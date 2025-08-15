"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent1WIA = void 0;
const WalletInvestigator_1 = require("./services/WalletInvestigator");
const BlockchainServiceFactory_1 = require("./services/blockchain/BlockchainServiceFactory");
const BlockchainDetector_1 = require("./services/BlockchainDetector");
const DataStorage_1 = require("./services/DataStorage");
const logger_1 = require("./utils/logger");
class Agent1WIA {
    constructor() {
        this.agentId = 'agent1-wia';
        this.version = '1.0.0';
        this.walletInvestigator = new WalletInvestigator_1.WalletInvestigator();
        this.blockchainFactory = BlockchainServiceFactory_1.BlockchainServiceFactory.getInstance();
        this.blockchainDetector = new BlockchainDetector_1.BlockchainDetector();
        this.dataStorage = new DataStorage_1.DataStorage();
        logger_1.logger.info('Agent 1 WIA initialized successfully');
    }
    async investigateWallet(request) {
        const startTime = Date.now();
        try {
            logger_1.logger.info(`Agent 1 WIA: Starting investigation for wallet ${request.walletAddress}`);
            this.validateRequest(request);
            const investigationResponse = await this.walletInvestigator.investigateWallet(request);
            if (!investigationResponse.success) {
                throw new Error(investigationResponse.error?.message || 'Investigation failed');
            }
            await this.storeInvestigationData(investigationResponse.data);
            const agentMessage = this.createAgentMessage(investigationResponse.data);
            await this.dataStorage.storeAgentMessage(agentMessage);
            const processingTime = Date.now() - startTime;
            logger_1.logger.info(`Agent 1 WIA: Investigation completed in ${processingTime}ms`);
            return {
                ...investigationResponse,
                timestamp: new Date()
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const errorStack = error instanceof Error ? error.stack : undefined;
            logger_1.logger.error(`Agent 1 WIA: Investigation failed for ${request.walletAddress}:`, error);
            const errorResponse = {
                success: false,
                error: {
                    message: errorMessage,
                    code: 'AGENT1_INVESTIGATION_FAILED',
                    ...(errorStack && { details: errorStack })
                },
                timestamp: new Date()
            };
            return errorResponse;
        }
    }
    async detectBlockchain(walletAddress) {
        try {
            logger_1.logger.info(`Agent 1 WIA: Detecting blockchain for ${walletAddress}`);
            const detection = BlockchainDetector_1.BlockchainDetector.detectBlockchain(walletAddress);
            logger_1.logger.info(`Agent 1 WIA: Detected ${detection.blockchain} with confidence ${detection.confidence}`);
            return detection;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Blockchain detection failed';
            logger_1.logger.error(`Agent 1 WIA: Blockchain detection failed for ${walletAddress}:`, error);
            throw new Error(errorMessage);
        }
    }
    async getMultiChainBalance(walletAddress) {
        const balances = {};
        const supportedBlockchains = this.blockchainFactory.getSupportedBlockchains();
        logger_1.logger.info(`Agent 1 WIA: Getting multi-chain balance for ${walletAddress}`);
        for (const blockchain of supportedBlockchains) {
            try {
                const isValid = this.blockchainFactory.validateAddress(walletAddress, blockchain);
                if (isValid || blockchain === 'ethereum' || blockchain === 'polygon' || blockchain === 'binance' || blockchain === 'avalanche' || blockchain === 'arbitrum' || blockchain === 'optimism' || blockchain === 'base' || blockchain === 'linea') {
                    const balance = await this.blockchainFactory.getBalance(walletAddress, blockchain);
                    balances[blockchain] = balance;
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                logger_1.logger.debug(`Agent 1 WIA: Failed to get balance for ${blockchain}: ${errorMessage}`);
            }
        }
        return balances;
    }
    async getMultiChainTransactionHistory(walletAddress) {
        const transactions = {};
        const supportedBlockchains = this.blockchainFactory.getSupportedBlockchains();
        logger_1.logger.info(`Agent 1 WIA: Getting multi-chain transaction history for ${walletAddress}`);
        for (const blockchain of supportedBlockchains) {
            try {
                const isValid = this.blockchainFactory.validateAddress(walletAddress, blockchain);
                if (isValid || blockchain === 'ethereum' || blockchain === 'polygon' || blockchain === 'binance' || blockchain === 'avalanche' || blockchain === 'arbitrum' || blockchain === 'optimism' || blockchain === 'base' || blockchain === 'linea') {
                    const txHistory = await this.blockchainFactory.getTransactionHistory(walletAddress, blockchain);
                    transactions[blockchain] = txHistory;
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                logger_1.logger.debug(`Agent 1 WIA: Failed to get transaction history for ${blockchain}: ${errorMessage}`);
            }
        }
        return transactions;
    }
    async getWalletData(walletAddress, blockchain) {
        try {
            logger_1.logger.info(`Agent 1 WIA: Getting wallet data for ${walletAddress} on ${blockchain}`);
            return await this.blockchainFactory.getWalletData(walletAddress, blockchain);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get wallet data';
            logger_1.logger.error(`Agent 1 WIA: Failed to get wallet data for ${walletAddress} on ${blockchain}:`, error);
            throw error;
        }
    }
    async getServiceHealth() {
        try {
            const health = await this.blockchainFactory.getServiceHealth();
            logger_1.logger.info(`Agent 1 WIA: Service health check completed`);
            return health;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Service health check failed';
            logger_1.logger.error(`Agent 1 WIA: Service health check failed:`, error);
            throw new Error(errorMessage);
        }
    }
    getSupportedBlockchains() {
        return this.blockchainFactory.getSupportedBlockchains();
    }
    getAllBlockchainInfo() {
        return this.blockchainFactory.getAllBlockchainInfo();
    }
    validateAddress(address, blockchain) {
        return this.blockchainFactory.validateAddress(address, blockchain);
    }
    getAgentInfo() {
        return {
            agentId: this.agentId,
            version: this.version,
            capabilities: [
                'Blockchain Detection',
                'Fund Analysis',
                'Temporal Analysis',
                'Data Storage',
                'Wallet Opinion Generation',
                'Fund Flow Tracking',
                'Risk Assessment'
            ],
            supportedBlockchains: this.getSupportedBlockchains()
        };
    }
    async processAgentMessage(message) {
        try {
            logger_1.logger.info(`Agent 1 WIA: Processing message from ${message.sender}`);
            await this.dataStorage.storeAgentMessage(message);
            logger_1.logger.info(`Agent 1 WIA: Message processed successfully`);
        }
        catch (error) {
            logger_1.logger.error(`Agent 1 WIA: Failed to process agent message:`, error);
            throw error;
        }
    }
    validateRequest(request) {
        if (!request.walletAddress || request.walletAddress.trim().length === 0) {
            throw new Error('Wallet address is required');
        }
        if (request.walletAddress.length < 10) {
            throw new Error('Invalid wallet address format');
        }
        if (request.blockchain && !this.blockchainFactory.isSupported(request.blockchain)) {
            throw new Error(`Unsupported blockchain: ${request.blockchain}`);
        }
    }
    async storeInvestigationData(data) {
        try {
            await this.dataStorage.storeInvestigationData(data);
            logger_1.logger.info(`Agent 1 WIA: Investigation data stored successfully`);
        }
        catch (error) {
            logger_1.logger.error(`Agent 1 WIA: Failed to store investigation data:`, error);
            throw error;
        }
    }
    createAgentMessage(data) {
        return {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            sender: this.agentId,
            recipient: 'agent2-mwca',
            type: 'investigation',
            data: {
                walletAddress: data.walletAddress,
                blockchain: data.blockchain,
                walletOpinion: data.walletOpinion,
                riskAssessment: data.riskAssessment,
                transactionAnalysis: data.transactionAnalysis
            },
            priority: data.riskAssessment.riskLevel === 'critical' ? 'urgent' : 'medium',
            metadata: {
                blockchain: data.blockchain,
                walletAddress: data.walletAddress,
                riskLevel: data.riskAssessment.riskLevel,
                confidence: data.walletOpinion.confidence
            }
        };
    }
}
exports.Agent1WIA = Agent1WIA;
//# sourceMappingURL=Agent1WIA.js.map