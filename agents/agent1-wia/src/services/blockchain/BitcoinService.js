"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../utils/logger");
const config_1 = require("../../utils/config");
const PriceService_1 = require("../PriceService");
class BitcoinService {
    constructor() {
        this.blockcypherBaseUrl = 'https://api.blockcypher.com/v1';
        this.btcscanBaseUrl = 'https://btcscan.org/api';
        this.blockchainInfo = {
            name: 'Bitcoin',
            symbol: 'BTC',
            chainId: 0, // Bitcoin doesn't use chainId like EVM chains
            rpcUrl: 'https://btcscan.org/api',
            explorerUrl: 'https://btcscan.org'
        };
        const bitcoinConfig = config_1.config.getBitcoinConfig();
        this.blockcypherApiKey = bitcoinConfig.blockcypherApiKey || '';
        this.priceService = PriceService_1.PriceService.getInstance();
        if (bitcoinConfig.btcscanApiUrl) {
            logger_1.logger.info('Bitcoin service initialized with BTCScan API');
        }
        else if (this.blockcypherApiKey) {
            logger_1.logger.info('Bitcoin service initialized with BlockCypher API');
        }
        else {
            logger_1.logger.warn('No Bitcoin API keys provided, using mock data');
        }
    }
    getBlockchainInfo() {
        return this.blockchainInfo;
    }
    validateAddress(address) {
        // Bitcoin address validation regex
        const bitcoinAddressRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
        return bitcoinAddressRegex.test(address);
    }
    async getBalance(address) {
        try {
            const bitcoinConfig = config_1.config.getBitcoinConfig();
            // Try BTCScan first (no API key required)
            if (bitcoinConfig.btcscanApiUrl) {
                return await this.getBalanceFromBTCScan(address);
            }
            // Fallback to BlockCypher if API key is available
            if (this.blockcypherApiKey) {
                return await this.getBalanceFromBlockCypher(address);
            }
            logger_1.logger.warn('Using mock Bitcoin balance data');
            return this.getMockBalance(address);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get Bitcoin balance for ${address}: ${errorMessage}`);
            return this.getMockBalance(address);
        }
    }
    async getBalanceFromBlockCypher(address) {
        logger_1.logger.debug(`Getting Bitcoin balance for ${address} using BlockCypher API`);
        const response = await axios_1.default.get(`${this.blockcypherBaseUrl}/btc/main/addrs/${address}/balance`, {
            timeout: 10000
        });
        if (response.data && response.data.balance !== undefined) {
            const balanceInSatoshi = response.data.balance;
            const balanceInBtc = balanceInSatoshi / 100000000; // Convert satoshi to BTC
            // Get USD value from price service
            const usdValue = await this.priceService.getTokenPrice('BTC', 'bitcoin');
            logger_1.logger.debug(`Bitcoin balance for ${address}: ${balanceInBtc} BTC ($${usdValue})`);
            return {
                balance: balanceInBtc.toFixed(8),
                usdValue,
                lastUpdated: new Date()
            };
        }
        else {
            throw new Error('Invalid response from BlockCypher API');
        }
    }
    async getBalanceFromBTCScan(address) {
        logger_1.logger.debug(`Getting Bitcoin balance for ${address} using BTCScan API`);
        const response = await axios_1.default.get(`${this.btcscanBaseUrl}/address/${address}`, {
            timeout: 10000
        });
        if (response.data && response.data.chain_stats) {
            const fundedSum = response.data.chain_stats.funded_txo_sum || 0;
            const spentSum = response.data.chain_stats.spent_txo_sum || 0;
            const balanceInSatoshi = fundedSum - spentSum;
            const balanceInBtc = balanceInSatoshi / 100000000; // Convert satoshi to BTC
            // Get USD value from price service
            const usdValue = await this.priceService.getTokenPrice('BTC', 'bitcoin');
            logger_1.logger.debug(`Bitcoin balance for ${address}: ${balanceInBtc} BTC ($${usdValue})`);
            return {
                balance: balanceInBtc.toFixed(8),
                usdValue,
                lastUpdated: new Date()
            };
        }
        else {
            throw new Error('Invalid response from BTCScan API');
        }
    }
    async getTransactionHistory(address, limit = 100) {
        try {
            const bitcoinConfig = config_1.config.getBitcoinConfig();
            // Try BTCScan first
            if (bitcoinConfig.btcscanApiUrl) {
                return await this.getTransactionHistoryFromBTCScan(address, limit);
            }
            // Fallback to BlockCypher
            if (this.blockcypherApiKey) {
                return await this.getTransactionHistoryFromBlockCypher(address, limit);
            }
            logger_1.logger.warn('Using mock Bitcoin transaction data');
            return this.getMockTransactions(address, limit);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get Bitcoin transaction history for ${address}: ${errorMessage}`);
            return this.getMockTransactions(address, limit);
        }
    }
    async getTransactionHistoryFromBTCScan(address, limit) {
        logger_1.logger.debug(`Getting Bitcoin transaction history for ${address} using BTCScan API`);
        const response = await axios_1.default.get(`${this.btcscanBaseUrl}/address/${address}/txs`, {
            timeout: 15000
        });
        if (response.data && Array.isArray(response.data)) {
            const transactions = response.data
                .slice(0, limit)
                .map((tx) => ({
                hash: tx.txid,
                from: address,
                to: tx.vout?.[0]?.scriptpubkey_address || 'unknown',
                value: ((tx.vout?.[0]?.value || 0) / 100000000).toString(), // Convert satoshi to BTC
                timestamp: new Date(tx.status.block_time * 1000),
                blockNumber: tx.status.block_height || 0,
                gasUsed: '0',
                gasPrice: '0',
                status: tx.status.confirmed ? 'success' : 'pending',
                type: 'transfer',
                currency: 'BTC'
            }));
            logger_1.logger.debug(`Retrieved ${transactions.length} Bitcoin transactions from BTCScan`);
            return transactions;
        }
        else {
            throw new Error('Invalid response from BTCScan API');
        }
    }
    async getTransactionHistoryFromBlockCypher(address, limit) {
        logger_1.logger.debug(`Getting Bitcoin transaction history for ${address} using BlockCypher API`);
        const response = await axios_1.default.get(`${this.blockcypherBaseUrl}/btc/main/addrs/${address}/full`, {
            params: { limit },
            timeout: 15000
        });
        if (response.data && response.data.txs) {
            const transactions = response.data.txs.map((tx) => ({
                hash: tx.hash,
                from: address,
                to: tx.outputs?.[0]?.addresses?.[0] || 'unknown',
                value: (tx.outputs?.[0]?.value / 100000000).toString(), // Convert satoshi to BTC
                timestamp: new Date(tx.received),
                blockNumber: tx.block_height || 0,
                gasUsed: '0',
                gasPrice: '0',
                status: tx.confirmations > 0 ? 'success' : 'pending',
                type: 'transfer',
                currency: 'BTC'
            }));
            logger_1.logger.debug(`Retrieved ${transactions.length} Bitcoin transactions from BlockCypher`);
            return transactions;
        }
        else {
            throw new Error('Invalid response from BlockCypher API');
        }
    }
    async analyzeTransactionValues(transactions, walletAddress) {
        try {
            logger_1.logger.debug(`Analyzing Bitcoin transaction values for ${transactions.length} transactions`);
            let totalIncoming = 0;
            let totalOutgoing = 0;
            let largestTransaction = 0;
            let totalFees = 0;
            const values = [];
            for (const tx of transactions) {
                const value = parseFloat(tx.value) || 0;
                values.push(value);
                // Determine if transaction is incoming or outgoing
                const isIncoming = tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase();
                const isOutgoing = tx.from && tx.from.toLowerCase() === walletAddress.toLowerCase();
                if (isIncoming) {
                    totalIncoming += value;
                }
                else if (isOutgoing) {
                    totalOutgoing += value;
                }
                if (value > largestTransaction) {
                    largestTransaction = value;
                }
            }
            const netFlow = totalIncoming - totalOutgoing;
            const averageTransaction = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            const lifetimeVolume = totalIncoming + totalOutgoing;
            return {
                totalIncoming,
                totalOutgoing,
                netFlow,
                largestTransaction,
                averageTransaction,
                transactionCount: transactions.length,
                lifetimeVolume,
                totalFees
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to analyze Bitcoin transaction values: ${errorMessage}`);
            throw new Error(`Failed to analyze Bitcoin transaction values: ${errorMessage}`);
        }
    }
    async getWalletData(address) {
        try {
            const [balance, transactions] = await Promise.all([
                this.getBalance(address),
                this.getTransactionHistory(address, 100)
            ]);
            const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);
            return {
                balance,
                transactions,
                transactionAnalysis,
                blockchainInfo: this.getBlockchainInfo()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get Bitcoin wallet data for ${address}: ${errorMessage}`);
            throw new Error(`Failed to get Bitcoin wallet data: ${errorMessage}`);
        }
    }
    async getCurrentBlockHeight() {
        try {
            const bitcoinConfig = config_1.config.getBitcoinConfig();
            if (bitcoinConfig.btcscanApiUrl) {
                const response = await axios_1.default.get(`${this.btcscanBaseUrl}/blocks/tip/height`, {
                    timeout: 10000
                });
                if (response.data) {
                    return parseInt(response.data);
                }
            }
            if (this.blockcypherApiKey) {
                const response = await axios_1.default.get(`${this.blockcypherBaseUrl}/btc/main`, {
                    timeout: 10000
                });
                if (response.data && response.data.height) {
                    return response.data.height;
                }
            }
            throw new Error('No Bitcoin API available');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.warn(`Failed to get current block height: ${errorMessage}`);
            return 800000; // Fallback block height
        }
    }
    async getTransactionDetails(txHash) {
        try {
            const bitcoinConfig = config_1.config.getBitcoinConfig();
            if (bitcoinConfig.btcscanApiUrl) {
                const response = await axios_1.default.get(`${this.btcscanBaseUrl}/tx/${txHash}`, {
                    timeout: 10000
                });
                return response.data;
            }
            if (this.blockcypherApiKey) {
                const response = await axios_1.default.get(`${this.blockcypherBaseUrl}/btc/main/txs/${txHash}`, {
                    timeout: 10000
                });
                return response.data;
            }
            logger_1.logger.warn('Using mock transaction details');
            return this.getMockTransactionDetails(txHash);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error(`Failed to get transaction details for ${txHash}: ${errorMessage}`);
            return this.getMockTransactionDetails(txHash);
        }
    }
    // Mock data methods for fallback
    getMockBalance(address) {
        const mockBalance = (Math.random() * 5).toFixed(8);
        return {
            balance: mockBalance,
            usdValue: parseFloat(mockBalance) * 40000, // Mock USD value
            lastUpdated: new Date()
        };
    }
    getMockTransactions(address, limit) {
        const mockTransactions = [];
        for (let i = 0; i < Math.min(limit, 5); i++) {
            mockTransactions.push({
                hash: `0x${Math.random().toString(16).substring(2, 66)}`,
                from: address,
                to: `1${Math.random().toString(16).substring(2, 34)}`,
                value: (Math.random() * 2).toFixed(8),
                timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                blockNumber: Math.floor(Math.random() * 800000),
                gasUsed: '0',
                gasPrice: '0',
                status: 'success',
                type: 'transfer',
                currency: 'BTC'
            });
        }
        return mockTransactions;
    }
    getMockTransactionDetails(txHash) {
        return {
            hash: txHash,
            block_height: Math.floor(Math.random() * 800000),
            confirmations: Math.floor(Math.random() * 1000),
            received: new Date().toISOString(),
            inputs: [],
            outputs: []
        };
    }
}
exports.BitcoinService = BitcoinService;
//# sourceMappingURL=BitcoinService.js.map