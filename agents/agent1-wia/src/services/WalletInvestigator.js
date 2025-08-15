"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    async investigateWallet(request) {
        try {
            logger_1.logger.info(`Starting wallet investigation for address: ${request.walletAddress}`);
            if (process.env.USE_QUEUE === 'true' && !process.env.IN_QUEUE_PROCESS) {
                const { QueueService } = await Promise.resolve().then(() => __importStar(require('./QueueService')));
                const queueService = QueueService.getInstance();
                const job = await queueService.addHighPriorityJob({
                    walletAddress: request.walletAddress,
                    blockchains: request.blockchain ? [request.blockchain] : undefined,
                });
                let result = null;
                let attempts = 0;
                const maxAttempts = 120;
                while (attempts < maxAttempts) {
                    const jobState = await job.getState();
                    if (jobState === 'completed') {
                        result = await job.returnvalue;
                        break;
                    }
                    else if (jobState === 'failed') {
                        throw new Error(`Job failed: ${job.failedReason}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                }
                if (!result) {
                    throw new Error('Job timeout - did not complete within 120 seconds');
                }
                return result;
            }
            const detectedBlockchain = await this.detectBlockchain(request.walletAddress);
            logger_1.logger.info(`Detected blockchain: ${detectedBlockchain}`);
            const isValid = this.blockchainFactory.validateAddress(request.walletAddress, detectedBlockchain);
            if (!isValid) {
                throw new Error(`Invalid address ${request.walletAddress} for blockchain ${detectedBlockchain}`);
            }
            const walletData = await this.blockchainFactory.getWalletData(request.walletAddress, detectedBlockchain);
            logger_1.logger.info(`Retrieved wallet data: ${walletData.transactions.length} transactions found`);
            const transactionAnalysis = await this.transactionAnalyzer.analyzeTransactions(walletData.transactions, detectedBlockchain);
            const fundFlows = await this.fundFlowTracker.trackFundFlows(walletData.transactions, request.walletAddress);
            const walletOpinion = await this.walletOpinionGenerator.generateOpinion(walletData, transactionAnalysis, fundFlows);
            const riskAssessment = await this.riskAnalyzer.assessRisk(walletData, transactionAnalysis, fundFlows, walletOpinion);
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
            await this.dataStorage.storeInvestigationData(investigationData);
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
    async detectBlockchain(walletAddress) {
        try {
            const detection = BlockchainDetector_1.BlockchainDetector.detectBlockchain(walletAddress);
            if (detection && this.blockchainFactory.isSupported(detection.blockchain)) {
                return detection.blockchain;
            }
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
    getSupportedBlockchains() {
        return this.blockchainFactory.getSupportedBlockchains();
    }
    getAllBlockchainInfo() {
        return this.blockchainFactory.getAllBlockchainInfo();
    }
    async getServiceHealth() {
        return await this.blockchainFactory.getServiceHealth();
    }
    validateAddress(address, blockchain) {
        return this.blockchainFactory.validateAddress(address, blockchain);
    }
    async getBalance(address, blockchain) {
        return await this.blockchainFactory.getBalance(address, blockchain);
    }
    async getTransactionHistory(address, blockchain) {
        return await this.blockchainFactory.getTransactionHistory(address, blockchain);
    }
}
exports.WalletInvestigator = WalletInvestigator;
//# sourceMappingURL=WalletInvestigator.js.map