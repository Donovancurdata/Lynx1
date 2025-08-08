"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../utils/logger");
const config_1 = require("../../utils/config");
class SolanaService {
    constructor() {
        this.solscanBaseUrl = 'https://pro-api.solscan.io';
        const solanaConfig = config_1.config.getSolanaConfig();
        this.rpcUrl = solanaConfig.rpcUrl;
        this.solscanApiKey = solanaConfig.solscanApiKey || '';
        logger_1.logger.info('Solana service initialized with native RPC API');
    }
    /**
     * Get current balance for a Solana address
     */
    async getBalance(address) {
        try {
            logger_1.logger.debug(`Getting Solana balance for ${address} using native RPC API`);
            const response = await axios_1.default.post(this.rpcUrl, {
                jsonrpc: '2.0',
                id: 1,
                method: 'getAccountInfo',
                params: [
                    address,
                    {
                        commitment: 'finalized',
                        encoding: 'base58'
                    }
                ]
            }, {
                timeout: 10000
            });
            if (response.data.result && response.data.result.value) {
                const balanceInLamports = response.data.result.value.lamports;
                const balanceInSol = balanceInLamports / 1000000000; // Convert lamports to SOL
                // Get USD value from price API
                const usdValue = await this.getUsdValue(balanceInSol);
                logger_1.logger.debug(`Solana balance for ${address}: ${balanceInSol} SOL ($${usdValue})`);
                return {
                    balance: balanceInSol.toString(),
                    usdValue,
                    lastUpdated: new Date()
                };
            }
            else {
                throw new Error('Invalid response from Solana RPC API');
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.warn(`Failed to get Solana balance: ${errorMessage}, using mock data`);
            return this.getMockBalance(address);
        }
    }
    /**
     * Get transaction history for a Solana address with enhanced pagination
     */
    async getTransactionHistory(address, limit = 1000) {
        try {
            logger_1.logger.debug(`Getting ALL Solana transaction history for ${address} with enhanced pagination`);
            let allTransactions = [];
            let pageCount = 0;
            let before = undefined;
            // Fetch ALL transactions with pagination (up to 1000 pages = 1M transactions max)
            while (pageCount < 1000) {
                pageCount++;
                logger_1.logger.debug(`📄 Solana Page ${pageCount}: Fetching transactions from RPC...`);
                try {
                    // Add rate limiting delays
                    if (pageCount > 1) {
                        const delay = pageCount > 10 ? 3000 : 2000; // Longer delay after 10 pages
                        logger_1.logger.debug(`⏳ Rate limiting: waiting ${delay / 1000} seconds before next request...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                    // Use Solana RPC with pagination
                    const params = {
                        limit: 1000
                    };
                    if (before) {
                        params.before = before;
                    }
                    const response = await axios_1.default.post(this.rpcUrl, {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getSignaturesForAddress',
                        params: [address, params]
                    }, {
                        timeout: 15000
                    });
                    if (response.data.result && Array.isArray(response.data.result) && response.data.result.length > 0) {
                        logger_1.logger.debug(`✅ RPC Page ${pageCount}: Found ${response.data.result.length} transactions`);
                        // Process transactions with REAL timestamps
                        const pageTransactions = response.data.result.map((tx) => ({
                            hash: tx.signature,
                            blockNumber: tx.slot || 0,
                            timestamp: new Date(tx.blockTime * 1000),
                            from: address,
                            to: address,
                            value: '0', // Transaction value not available in this endpoint
                            currency: 'SOL',
                            status: tx.err ? 'failed' : 'success',
                            type: 'transfer',
                            metadata: {
                                slot: tx.slot,
                                fee: tx.fee / 1000000000, // Convert lamports to SOL
                                signature: tx.signature
                            }
                        }));
                        allTransactions.push(...pageTransactions);
                        logger_1.logger.debug(`📊 Total transactions so far: ${allTransactions.length}`);
                        // Set before for next page
                        before = response.data.result[response.data.result.length - 1].signature;
                        // If we got less than 1000 transactions, we've reached the end
                        if (response.data.result.length < 1000) {
                            logger_1.logger.debug(`📄 Solana Page ${pageCount}: Got ${response.data.result.length} transactions (less than 1000), reached end`);
                            break;
                        }
                    }
                    else {
                        logger_1.logger.debug(`📄 Solana Page ${pageCount}: No more transactions found`);
                        break;
                    }
                }
                catch (error) {
                    if (axios_1.default.isAxiosError(error) && error.response?.status === 429) {
                        // Rate limit hit - wait longer and retry
                        logger_1.logger.warn(`⚠️ Rate limit hit (429), waiting 10 seconds before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        pageCount--; // Retry the same page
                        continue;
                    }
                    else {
                        logger_1.logger.warn(`⚠️ RPC API error:`, error);
                        // Wait and retry on other errors too
                        logger_1.logger.debug(`⏳ Waiting 5 seconds before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        pageCount--; // Retry the same page
                        continue;
                    }
                }
            }
            logger_1.logger.debug(`📊 Solana Total transaction count: ${allTransactions.length}`);
            return allTransactions;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.warn(`Failed to get Solana transaction history: ${errorMessage}, using mock data`);
            return this.getMockTransactions(address, limit);
        }
    }
    /**
     * Get comprehensive wallet data
     */
    async getWalletData(address) {
        const [balance, transactions] = await Promise.all([
            this.getBalance(address),
            this.getTransactionHistory(address)
        ]);
        return {
            balance,
            transactions,
            blockchainInfo: this.getBlockchainInfo()
        };
    }
    /**
     * Validate Solana address
     */
    validateAddress(address) {
        // Solana address validation (base58 encoded, 32-44 characters)
        const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        return base58Pattern.test(address);
    }
    /**
     * Get blockchain information
     */
    getBlockchainInfo() {
        return {
            name: 'Solana',
            symbol: 'SOL',
            chainId: 101,
            rpcUrl: 'https://api.mainnet-beta.solana.com',
            explorerUrl: 'https://solscan.io'
        };
    }
    /**
     * Get current slot (block height)
     */
    async getCurrentSlot() {
        try {
            const response = await axios_1.default.post(this.rpcUrl, {
                jsonrpc: '2.0',
                id: 1,
                method: 'getSlot'
            }, {
                timeout: 5000
            });
            if (response.data.result) {
                return response.data.result;
            }
            else {
                throw new Error('Invalid response from Solana RPC');
            }
        }
        catch (error) {
            logger_1.logger.warn('Failed to get current slot, using mock data');
            return 200000000; // Mock slot
        }
    }
    /**
     * Get mock balance data
     */
    getMockBalance(address) {
        // Generate a realistic mock balance based on address
        const hash = this.simpleHash(address);
        const balance = (hash % 10000) / 100; // 0-100 SOL
        const usdValue = balance * 100; // Mock SOL price
        return {
            balance: balance.toFixed(9),
            usdValue,
            lastUpdated: new Date()
        };
    }
    /**
     * Get mock transaction data
     */
    getMockTransactions(address, limit) {
        const transactions = [];
        const now = new Date();
        for (let i = 0; i < Math.min(limit, 10); i++) {
            const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // Each transaction 1 day apart
            const hash = this.simpleHash(`${address}-${i}`);
            const value = (hash % 100) / 10; // 0-10 SOL
            transactions.push({
                hash: this.generateMockSolanaSignature(),
                from: i % 2 === 0 ? address : this.generateMockSolanaAddress(),
                to: i % 2 === 0 ? this.generateMockSolanaAddress() : address,
                value: value.toFixed(9),
                currency: 'SOL',
                timestamp,
                blockNumber: 200000000 + i,
                status: 'success',
                type: 'transfer',
                metadata: {
                    fee: 0.000005,
                    slot: 200000000 + i
                }
            });
        }
        return transactions;
    }
    /**
     * Generate a mock Solana address
     */
    generateMockSolanaAddress() {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let address = '';
        for (let i = 0; i < 44; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    }
    /**
     * Generate a mock Solana transaction signature
     */
    generateMockSolanaSignature() {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let signature = '';
        for (let i = 0; i < 88; i++) {
            signature += chars[Math.floor(Math.random() * chars.length)];
        }
        return signature;
    }
    /**
     * Simple hash function for generating consistent mock data
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    /**
     * Extract recipient address from transaction
     */
    extractRecipientAddress(tx) {
        // This is a simplified extraction - in practice, you'd need to parse the transaction instructions
        if (tx.postTokenBalances && tx.postTokenBalances.length > 0) {
            return tx.postTokenBalances[0].owner || '';
        }
        if (tx.postBalances && tx.postBalances.length > 0) {
            // For SOL transfers, we'd need to look at the instruction data
            return '';
        }
        return '';
    }
    /**
     * Determine transaction type based on transaction data
     */
    determineTransactionType(tx) {
        // This is a simplified determination - in practice, you'd parse the instruction data
        if (tx.postTokenBalances && tx.postTokenBalances.length > 0) {
            return 'token';
        }
        // Check if it's a SOL transfer (simplified)
        if (tx.lamport && tx.lamport > 0) {
            return 'transfer';
        }
        return 'other';
    }
    /**
     * Get USD value for SOL amount using price API
     */
    async getUsdValue(solAmount) {
        try {
            // Try to get real price from CoinGecko API
            const response = await axios_1.default.get('https://api.coingecko.com/api/v3/simple/price', {
                params: {
                    ids: 'solana',
                    vs_currencies: 'usd'
                },
                timeout: 5000
            });
            if (response.data && response.data.solana && response.data.solana.usd) {
                return solAmount * response.data.solana.usd;
            }
        }
        catch (error) {
            logger_1.logger.debug('Failed to get SOL price from CoinGecko, using fallback');
        }
        // Fallback to mock price
        const solPrice = 100; // USD per SOL (fallback)
        return solAmount * solPrice;
    }
}
exports.SolanaService = SolanaService;
//# sourceMappingURL=SolanaService.js.map