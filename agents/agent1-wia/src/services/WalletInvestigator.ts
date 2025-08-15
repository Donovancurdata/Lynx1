import { BlockchainServiceFactory } from './blockchain/BlockchainServiceFactory';
import { BlockchainDetector } from './BlockchainDetector';
import { TransactionAnalyzer } from './TransactionAnalyzer';
import { FundFlowTracker } from './FundFlowTracker';
import { WalletOpinionGenerator } from './WalletOpinionGenerator';
import { RiskAnalyzer } from './RiskAnalyzer';
import { DataStorage } from './DataStorage';
import {
  WalletInvestigationRequest,
  WalletInvestigationResponse,
  WalletInvestigationData,
  Transaction,
  BlockchainInfo,
  WalletOpinion,
  RiskAssessment
} from '../types';
import { logger } from '../utils/logger';

export class WalletInvestigator {
  private blockchainFactory: BlockchainServiceFactory;
  private blockchainDetector: BlockchainDetector;
  private transactionAnalyzer: TransactionAnalyzer;
  private fundFlowTracker: FundFlowTracker;
  private walletOpinionGenerator: WalletOpinionGenerator;
  private riskAnalyzer: RiskAnalyzer;
  private dataStorage: DataStorage;

  constructor() {
    this.blockchainFactory = BlockchainServiceFactory.getInstance();
    this.blockchainDetector = new BlockchainDetector();
    this.transactionAnalyzer = new TransactionAnalyzer();
    this.fundFlowTracker = new FundFlowTracker();
    this.walletOpinionGenerator = new WalletOpinionGenerator();
    this.riskAnalyzer = new RiskAnalyzer();
    this.dataStorage = new DataStorage();
  }

  /**
   * Main investigation method for Agent 1
   */
  async investigateWallet(request: WalletInvestigationRequest): Promise<WalletInvestigationResponse> {
    try {
      logger.info(`Starting wallet investigation for address: ${request.walletAddress}`);

      // Step 1: Detect blockchain
      const detectedBlockchain = await this.detectBlockchain(request.walletAddress);
      logger.info(`Detected blockchain: ${detectedBlockchain}`);

      // Step 2: Validate address on detected blockchain
      const isValid = this.blockchainFactory.validateAddress(request.walletAddress, detectedBlockchain);
      if (!isValid) {
        throw new Error(`Invalid address ${request.walletAddress} for blockchain ${detectedBlockchain}`);
      }

      // Step 3: Get comprehensive wallet data
      const walletData = await this.blockchainFactory.getWalletData(request.walletAddress, detectedBlockchain);
      logger.info(`Retrieved wallet data: ${walletData.transactions.length} transactions found`);

      // Step 4: Analyze transactions
      const transactionAnalysis = await this.transactionAnalyzer.analyzeTransactions(
        walletData.transactions,
        detectedBlockchain
      );

      // Step 5: Track fund flows
      const fundFlows = await this.fundFlowTracker.trackFundFlows(
        walletData.transactions,
        request.walletAddress
      );

      // Step 6: Generate wallet opinion
      const walletOpinion = await this.walletOpinionGenerator.generateOpinion(
        walletData,
        transactionAnalysis,
        fundFlows
      );

      // Step 7: Perform risk analysis
      const riskAssessment = await this.riskAnalyzer.assessRisk(
        walletData,
        transactionAnalysis,
        fundFlows,
        walletOpinion
      );

      // Step 8: Prepare investigation data
      const investigationData: WalletInvestigationData = {
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

    } catch (error) {
      logger.error(`Wallet investigation failed for ${request.walletAddress}:`, error);

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
  private async detectBlockchain(walletAddress: string): Promise<string> {
    try {
      // First try automatic detection
      const detection = BlockchainDetector.detectBlockchain(walletAddress);

      if (detection && this.blockchainFactory.isSupported(detection.blockchain)) {
        return detection.blockchain;
      }

      // If automatic detection fails, try each supported blockchain
      const supportedBlockchains = this.blockchainFactory.getSupportedBlockchains();

      for (const blockchain of supportedBlockchains) {
        try {
          const isValid = this.blockchainFactory.validateAddress(walletAddress, blockchain);
          if (isValid) {
            logger.info(`Validated address ${walletAddress} on ${blockchain}`);
            return blockchain;
          }
        } catch (error) {
          logger.debug(`Address validation failed for ${blockchain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      throw new Error(`Could not determine blockchain for address: ${walletAddress}`);
    } catch (error) {
      logger.error(`Blockchain detection failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Get supported blockchains
   */
  getSupportedBlockchains(): string[] {
    return this.blockchainFactory.getSupportedBlockchains();
  }

  /**
   * Get blockchain information
   */
  getAllBlockchainInfo(): Record<string, BlockchainInfo> {
    return this.blockchainFactory.getAllBlockchainInfo();
  }

  /**
   * Get service health status
   */
  async getServiceHealth(): Promise<Record<string, boolean>> {
    return await this.blockchainFactory.getServiceHealth();
  }

  /**
   * Validate address for a specific blockchain
   */
  validateAddress(address: string, blockchain: string): boolean {
    return this.blockchainFactory.validateAddress(address, blockchain);
  }

  /**
   * Get balance for an address on a specific blockchain
   */
  async getBalance(address: string, blockchain: string): Promise<{
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  }> {
    return await this.blockchainFactory.getBalance(address, blockchain);
  }

  /**
   * Get transaction history for an address on a specific blockchain
   */
  async getTransactionHistory(address: string, blockchain: string): Promise<Transaction[]> {
    return await this.blockchainFactory.getTransactionHistory(address, blockchain);
  }


}