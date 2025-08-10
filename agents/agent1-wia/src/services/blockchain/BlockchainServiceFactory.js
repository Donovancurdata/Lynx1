"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainServiceFactory = void 0;
const EVMService_1 = require("./EVMService");
const BitcoinService_1 = require("./BitcoinService");
const SolanaService_1 = require("./SolanaService");
const logger_1 = require("../../utils/logger");
class BlockchainServiceFactory {
    constructor() {
        this.services = new Map();
        this.initializeServices();
    }
    static getInstance() {
        if (!BlockchainServiceFactory.instance) {
            BlockchainServiceFactory.instance = new BlockchainServiceFactory();
        }
        return BlockchainServiceFactory.instance;
    }
    /**
     * Initialize all blockchain services
     */
    initializeServices() {
        try {
            // Initialize EVM service for all EVM-compatible chains
            this.evmService = new EVMService_1.EVMService();
            this.services.set('ethereum', this.createEVMServiceAdapter('ethereum'));
            this.services.set('polygon', this.createEVMServiceAdapter('polygon'));
            this.services.set('binance', this.createEVMServiceAdapter('binance'));
            this.services.set('avalanche', this.createEVMServiceAdapter('avalanche'));
            this.services.set('arbitrum', this.createEVMServiceAdapter('arbitrum'));
            this.services.set('optimism', this.createEVMServiceAdapter('optimism'));
            this.services.set('base', this.createEVMServiceAdapter('base'));
            this.services.set('linea', this.createEVMServiceAdapter('linea'));
            logger_1.logger.info('EVM services initialized (Ethereum, Polygon, Binance, Avalanche, Arbitrum, Optimism, Base, Linea)');
            // Initialize Bitcoin service
            this.services.set('bitcoin', new BitcoinService_1.BitcoinService());
            logger_1.logger.info('Bitcoin service initialized');
            // Initialize Solana service
            this.services.set('solana', new SolanaService_1.SolanaService());
            logger_1.logger.info('Solana service initialized');
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize blockchain services:', error);
            throw error;
        }
    }
    /**
     * Create adapter for EVM service to match BlockchainService interface
     */
    createEVMServiceAdapter(chain) {
        return {
            getBalance: (address) => this.evmService.getBalance(address, chain),
            getTransactionHistory: (address) => this.evmService.getTransactionHistory(address, chain),
            validateAddress: (address) => this.evmService.validateAddress(address, chain),
            getBlockchainInfo: () => this.evmService.getBlockchainInfo(chain),
            getAllTokenBalances: (address) => this.evmService.getAllTokenBalances(address, chain),
            analyzeTransactionValues: (transactions, walletAddress) => this.evmService.analyzeTransactionValues(transactions, walletAddress),
            investigateWallet: (address) => this.evmService.investigateWallet(address, chain)
        };
    }
    /**
     * Get blockchain service by blockchain name
     */
    getService(blockchain) {
        const service = this.services.get(blockchain.toLowerCase());
        if (!service) {
            throw new Error(`Unsupported blockchain: ${blockchain}`);
        }
        return service;
    }
    /**
     * Get all supported blockchains
     */
    getSupportedBlockchains() {
        return Array.from(this.services.keys());
    }
    /**
     * Get blockchain info for all supported blockchains
     */
    getAllBlockchainInfo() {
        const info = {};
        for (const [name, service] of this.services.entries()) {
            info[name] = service.getBlockchainInfo();
        }
        return info;
    }
    /**
     * Validate address for a specific blockchain
     */
    validateAddress(address, blockchain) {
        try {
            const service = this.getService(blockchain);
            return service.validateAddress(address);
        }
        catch (error) {
            logger_1.logger.error(`Failed to validate address for ${blockchain}:`, error);
            return false;
        }
    }
    /**
     * Get balance for an address on a specific blockchain
     */
    async getBalance(address, blockchain) {
        try {
            const service = this.getService(blockchain);
            return await service.getBalance(address);
        }
        catch (error) {
            logger_1.logger.error(`Failed to get balance for ${address} on ${blockchain}:`, error);
            throw error;
        }
    }
    /**
     * Get transaction history for an address on a specific blockchain
     */
    async getTransactionHistory(address, blockchain) {
        try {
            const service = this.getService(blockchain);
            return await service.getTransactionHistory(address);
        }
        catch (error) {
            logger_1.logger.error(`Failed to get transaction history for ${address} on ${blockchain}:`, error);
            throw error;
        }
    }
    /**
     * Get comprehensive wallet data for an address on a specific blockchain
     */
    async getWalletData(address, blockchain) {
        try {
            // For EVM chains, use the EVM service directly for better performance
            if (['ethereum', 'polygon', 'binance'].includes(blockchain)) {
                return await this.evmService.getWalletData(address, blockchain);
            }
            // For other chains, use the service interface
            const service = this.getService(blockchain);
            const [balance, transactions] = await Promise.all([
                service.getBalance(address),
                service.getTransactionHistory(address)
            ]);
            // Get enhanced data if available
            let enhancedBalance = null;
            let transactionAnalysis = null;
            if (service.getAllTokenBalances) {
                try {
                    enhancedBalance = await service.getAllTokenBalances(address);
                }
                catch (error) {
                    logger_1.logger.warn(`Failed to get enhanced balance for ${address}: ${error}`);
                }
            }
            if (service.analyzeTransactionValues && transactions.length > 0) {
                try {
                    transactionAnalysis = await service.analyzeTransactionValues(transactions, address);
                }
                catch (error) {
                    logger_1.logger.warn(`Failed to analyze transaction values for ${address}: ${error}`);
                }
            }
            return {
                balance,
                enhancedBalance,
                transactions,
                transactionAnalysis,
                blockchainInfo: service.getBlockchainInfo()
            };
        }
        catch (error) {
            logger_1.logger.error(`Failed to get wallet data for ${address} on ${blockchain}:`, error);
            throw error;
        }
    }
    /**
     * Check if a blockchain is supported
     */
    isSupported(blockchain) {
        return this.services.has(blockchain.toLowerCase());
    }
    /**
     * Get service health status
     */
    async getServiceHealth() {
        const health = {};
        for (const [name, service] of this.services.entries()) {
            try {
                // Try to get blockchain info as a health check
                service.getBlockchainInfo();
                health[name] = true;
            }
            catch (error) {
                logger_1.logger.error(`Health check failed for ${name}:`, error);
                health[name] = false;
            }
        }
        return health;
    }
}
exports.BlockchainServiceFactory = BlockchainServiceFactory;
//# sourceMappingURL=BlockchainServiceFactory.js.map