"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletInvestigator = void 0;
const BlockchainServiceFactory_1 = require("./blockchain/BlockchainServiceFactory");
const BlockchainDetector_1 = require("./BlockchainDetector");
const TransactionAnalyzer_1 = require("./TransactionAnalyzer");
const FundFlowTracker_1 = require("./FundFlowTracker");
const WalletOpinionGenerator_1 = require("./WalletOpinionGenerator");
const RiskAnalyzer_1 = require("./RiskAnalyzer");
const DataStorage_1 = require("./DataStorage");
const logger_1 = require("../utils/logger");
class WalletInvestigator {
    constructor() {
        this.blockchainFactory = BlockchainServiceFactory_1.BlockchainServiceFactory.getInstance();
        this.blockchainDetector = new BlockchainDetector_1.BlockchainDetector();
        this.transactionAnalyzer = new TransactionAnalyzer_1.TransactionAnalyzer();
        this.fundFlowTracker = new FundFlowTracker_1.FundFlowTracker();
        this.walletOpinionGenerator = new WalletOpinionGenerator_1.WalletOpinionGenerator();
        this.riskAnalyzer = new RiskAnalyzer_1.RiskAnalyzer();
        this.dataStorage = new DataStorage_1.DataStorage();
    }
    /**
     * Main investigation method for Agent 1
     */
    async investigateWallet(request) {
        try {
            logger_1.logger.info(`Starting wallet investigation for address: ${request.walletAddress}`);
            // Step 1: Detect blockchain
            const detectedBlockchain = await this.detectBlockchain(request.walletAddress);
            logger_1.logger.info(`Detected blockchain: ${detectedBlockchain}`);
            // Step 2: Validate address on detected blockchain
            const isValid = this.blockchainFactory.validateAddress(request.walletAddress, detectedBlockchain);
            if (!isValid) {
                throw new Error(`Invalid address ${request.walletAddress} for blockchain ${detectedBlockchain}`);
            }
            // Step 3: Get comprehensive wallet data
            const walletData = await this.blockchainFactory.getWalletData(request.walletAddress, detectedBlockchain);
            logger_1.logger.info(`Retrieved wallet data: ${walletData.transactions.length} transactions found`);
            // Step 4: Analyze transactions
            const transactionAnalysis = await this.transactionAnalyzer.analyzeTransactions(walletData.transactions, detectedBlockchain);
            // Step 5: Track fund flows
            const fundFlows = await this.fundFlowTracker.trackFundFlows(walletData.transactions, request.walletAddress);
            // Step 6: Generate wallet opinion
            const walletOpinion = await this.walletOpinionGenerator.generateOpinion(walletData, transactionAnalysis, fundFlows);
            // Step 7: Perform risk analysis
            const riskAssessment = await this.riskAnalyzer.assessRisk(walletData, transactionAnalysis, fundFlows, walletOpinion);
            // Step 8: Prepare investigation data
            const investigationData = {
                walletAddress: request.walletAddress,
                blockchain: detectedBlockchain,
                blockchainInfo: walletData.blockchainInfo,
                balance: walletData.balance,
                transactions: walletData.transactions,
                transactionAnalysis,
                fundFlows,
                walletOpinion,
                riskAssessment,
                investigationTimestamp: new Date(),
                agentId: 'agent1-wia',
                version: '1.0.0'
            };
            // Step 9: Store data in OneLake
            await this.dataStorage.storeInvestigationData(investigationData);
            // Step 10: Prepare response
            return {
                success: true,
                data: investigationData,
                timestamp: new Date()
            };
        }
        catch (error) {
            logger_1.logger.error(`Wallet investigation failed for ${request.walletAddress}:`, error);
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                    code: 'INVESTIGATION_FAILED',
                    details: error instanceof Error ? error.stack : undefined
                },
                timestamp: new Date()
            };
        }
    }
    /**
     * Detect which blockchain the wallet address belongs to
     */
    async detectBlockchain(walletAddress) {
        try {
            // First try automatic detection
            const detection = BlockchainDetector_1.BlockchainDetector.detectBlockchain(walletAddress);
            if (detection && this.blockchainFactory.isSupported(detection.blockchain)) {
                return detection.blockchain;
            }
            // If automatic detection fails, try each supported blockchain
            const supportedBlockchains = this.blockchainFactory.getSupportedBlockchains();
            for (const blockchain of supportedBlockchains) {
                try {
                    const isValid = this.blockchainFactory.validateAddress(walletAddress, blockchain);
                    if (isValid) {
                        logger_1.logger.info(`Validated address ${walletAddress} on ${blockchain}`);
                        return blockchain;
                    }
                }
                catch (error) {
                    logger_1.logger.debug(`Address validation failed for ${blockchain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            throw new Error(`Could not determine blockchain for address: ${walletAddress}`);
        }
        catch (error) {
            logger_1.logger.error(`Blockchain detection failed for ${walletAddress}:`, error);
            throw error;
        }
    }
    /**
     * Get supported blockchains
     */
    getSupportedBlockchains() {
        return this.blockchainFactory.getSupportedBlockchains();
    }
    /**
     * Get blockchain information
     */
    getAllBlockchainInfo() {
        return this.blockchainFactory.getAllBlockchainInfo();
    }
    /**
     * Get service health status
     */
    async getServiceHealth() {
        return await this.blockchainFactory.getServiceHealth();
    }
    /**
     * Validate address for a specific blockchain
     */
    validateAddress(address, blockchain) {
        return this.blockchainFactory.validateAddress(address, blockchain);
    }
    /**
     * Get balance for an address on a specific blockchain
     */
    async getBalance(address, blockchain) {
        return await this.blockchainFactory.getBalance(address, blockchain);
    }
    /**
     * Get transaction history for an address on a specific blockchain
     */
    async getTransactionHistory(address, blockchain) {
        return await this.blockchainFactory.getTransactionHistory(address, blockchain);
    }
}
exports.WalletInvestigator = WalletInvestigator;
//# sourceMappingURL=WalletInvestigator.js.map