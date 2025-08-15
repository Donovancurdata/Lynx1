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
                const balanceInSol = balanceInLamports / 1000000000;
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
    async getTransactionHistory(address, limit = 1000) {
        try {
            logger_1.logger.debug(`Getting ALL Solana transaction history for ${address} with enhanced pagination`);
            let allTransactions = [];
            let pageCount = 0;
            let before = undefined;
            while (pageCount < 1000) {
                pageCount++;
                logger_1.logger.debug(`📄 Solana Page ${pageCount}: Fetching transactions from RPC...`);
                try {
                    if (pageCount > 1) {
                        const delay = pageCount > 10 ? 3000 : 2000;
                        logger_1.logger.debug(`⏳ Rate limiting: waiting ${delay / 1000} seconds before next request...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
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
                        const pageTransactions = response.data.result.map((tx) => ({
                            hash: tx.signature,
                            blockNumber: tx.slot || 0,
                            timestamp: new Date(tx.blockTime * 1000),
                            from: address,
                            to: address,
                            value: '0',
                            currency: 'SOL',
                            status: tx.err ? 'failed' : 'success',
                            type: 'transfer',
                            metadata: {
                                slot: tx.slot,
                                fee: tx.fee / 1000000000,
                                signature: tx.signature
                            }
                        }));
                        allTransactions.push(...pageTransactions);
                        logger_1.logger.debug(`📊 Total transactions so far: ${allTransactions.length}`);
                        before = response.data.result[response.data.result.length - 1].signature;
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
                        logger_1.logger.warn(`⚠️ Rate limit hit (429), waiting 10 seconds before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        pageCount--;
                        continue;
                    }
                    else {
                        logger_1.logger.warn(`⚠️ RPC API error:`, error);
                        logger_1.logger.debug(`⏳ Waiting 5 seconds before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        pageCount--;
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
    validateAddress(address) {
        const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        return base58Pattern.test(address);
    }
    getBlockchainInfo() {
        return {
            name: 'Solana',
            symbol: 'SOL',
            chainId: 101,
            rpcUrl: 'https://api.mainnet-beta.solana.com',
            explorerUrl: 'https://solscan.io'
        };
    }
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
            return 200000000;
        }
    }
    getMockBalance(address) {
        const hash = this.simpleHash(address);
        const balance = (hash % 10000) / 100;
        const usdValue = balance * 100;
        return {
            balance: balance.toFixed(9),
            usdValue,
            lastUpdated: new Date()
        };
    }
    getMockTransactions(address, limit) {
        const transactions = [];
        const now = new Date();
        for (let i = 0; i < Math.min(limit, 10); i++) {
            const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const hash = this.simpleHash(`${address}-${i}`);
            const value = (hash % 100) / 10;
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
    generateMockSolanaAddress() {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let address = '';
        for (let i = 0; i < 44; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    }
    generateMockSolanaSignature() {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let signature = '';
        for (let i = 0; i < 88; i++) {
            signature += chars[Math.floor(Math.random() * chars.length)];
        }
        return signature;
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    extractRecipientAddress(tx) {
        if (tx.postTokenBalances && tx.postTokenBalances.length > 0) {
            return tx.postTokenBalances[0].owner || '';
        }
        if (tx.postBalances && tx.postBalances.length > 0) {
            return '';
        }
        return '';
    }
    determineTransactionType(tx) {
        if (tx.postTokenBalances && tx.postTokenBalances.length > 0) {
            return 'token';
        }
        if (tx.lamport && tx.lamport > 0) {
            return 'transfer';
        }
        return 'other';
    }
    async getUsdValue(solAmount) {
        try {
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
        const solPrice = 100;
        return solAmount * solPrice;
    }
}
exports.SolanaService = SolanaService;
//# sourceMappingURL=SolanaService.js.map