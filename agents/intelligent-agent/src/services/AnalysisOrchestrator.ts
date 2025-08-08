import { Agent1WIA } from '../../../agent1-wia/src/Agent1WIA';
import { WalletInvestigationRequest, WalletInvestigationResponse } from '../../../agent1-wia/src/types';
import { logger } from '../utils/logger';

/**
 * Analysis Orchestrator
 * 
 * Coordinates the analysis process and manages integration with existing services.
 * Handles the orchestration of multiple analysis steps and ensures proper
 * data flow between different components.
 */
export class AnalysisOrchestrator {
  private agent1WIA: Agent1WIA;

  constructor(agent1WIA: Agent1WIA) {
    this.agent1WIA = agent1WIA;
    logger.info('Analysis Orchestrator initialized');
  }

  /**
   * Perform comprehensive wallet analysis
   */
  async performAnalysis(walletAddress: string, analysisType: 'quick' | 'deep' = 'quick'): Promise<any> {
    try {
      logger.info(`Starting analysis for wallet: ${walletAddress}, type: ${analysisType}`);

      // Step 1: Blockchain Detection
      const blockchainInfo = await this.detectBlockchains(walletAddress);

      // Step 2: Balance Analysis
      const balanceInfo = await this.analyzeBalances(walletAddress, blockchainInfo);

      // Step 3: Transaction Analysis
      const transactionInfo = await this.analyzeTransactions(walletAddress, blockchainInfo);

      // Step 4: Deep Investigation (if requested)
      let investigationData = null;
      if (analysisType === 'deep') {
        investigationData = await this.performDeepInvestigation(walletAddress);
      }

      // Step 5: Compile Results
      const results = this.compileResults(walletAddress, blockchainInfo, balanceInfo, transactionInfo, investigationData);

      logger.info(`Analysis completed for wallet: ${walletAddress}`);
      return results;

    } catch (error) {
      logger.error(`Analysis failed for wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Detect which blockchains the wallet operates on
   */
  private async detectBlockchains(walletAddress: string): Promise<any> {
    try {
      const detection = await this.agent1WIA.detectBlockchain(walletAddress);
      
      logger.info(`Blockchain detection for ${walletAddress}:`, {
        blockchain: detection.blockchain,
        confidence: detection.confidence
      });

      return {
        primary: detection.blockchain,
        confidence: detection.confidence,
        supported: this.agent1WIA.getSupportedBlockchains(),
        info: this.agent1WIA.getAllBlockchainInfo()
      };
    } catch (error) {
      logger.error(`Blockchain detection failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Analyze balances across detected blockchains
   */
  private async analyzeBalances(walletAddress: string, blockchainInfo: any): Promise<any> {
    try {
      const balances = await this.agent1WIA.getMultiChainBalance(walletAddress);
      
      // Calculate total value across all blockchains
      const totalValue = Object.values(balances).reduce((sum: number, balance: any) => {
        return sum + (balance.usdValue || 0);
      }, 0);

      // Get detailed balance information for each blockchain
      const balanceDetails = {};
      for (const [blockchain, balance] of Object.entries(balances)) {
        balanceDetails[blockchain] = {
          balance: balance.balance,
          usdValue: balance.usdValue || 0,
          lastUpdated: balance.lastUpdated
        };
      }

      logger.info(`Balance analysis for ${walletAddress}:`, {
        totalValue,
        blockchainCount: Object.keys(balances).length,
        blockchains: Object.keys(balances)
      });

      return {
        balances: balanceDetails,
        totalValue,
        blockchainCount: Object.keys(balances).length,
        activeBlockchains: Object.keys(balances),
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error(`Balance analysis failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Analyze transactions across detected blockchains
   */
  private async analyzeTransactions(walletAddress: string, blockchainInfo: any): Promise<any> {
    try {
      const transactions = await this.agent1WIA.getMultiChainTransactionHistory(walletAddress);
      
      // Calculate total transactions across all blockchains
      const totalTransactions = Object.values(transactions).flat().length;
      const transactionSummary = this.summarizeTransactions(transactions);

      // Get transaction counts per blockchain
      const transactionCounts = {};
      for (const [blockchain, txList] of Object.entries(transactions)) {
        transactionCounts[blockchain] = Array.isArray(txList) ? txList.length : 0;
      }

      logger.info(`Transaction analysis for ${walletAddress}:`, {
        totalTransactions,
        blockchainCount: Object.keys(transactions).length,
        blockchains: Object.keys(transactions),
        transactionCounts
      });

      return {
        transactions,
        totalTransactions,
        summary: transactionSummary,
        blockchainCount: Object.keys(transactions).length,
        activeBlockchains: Object.keys(transactions),
        transactionCounts,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error(`Transaction analysis failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Perform deep investigation using Agent1WIA
   */
  private async performDeepInvestigation(walletAddress: string): Promise<any> {
    try {
      const request: WalletInvestigationRequest = {
        walletAddress,
        // analysisType: 'deep', // Removed as it's not in the type definition
        // includeHistoricalData: true, // Removed as it's not in the type definition
        // includeRiskAssessment: true // Removed as it's not in the type definition
      };

      const investigation = await this.agent1WIA.investigateWallet(request);
      
      if (!investigation.success) {
        throw new Error(investigation.error?.message || 'Deep investigation failed');
      }

      logger.info(`Deep investigation completed for ${walletAddress}`);
      return investigation.data;
    } catch (error) {
      logger.error(`Deep investigation failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Compile all analysis results into a comprehensive report
   */
  private compileResults(
    walletAddress: string,
    blockchainInfo: any,
    balanceInfo: any,
    transactionInfo: any,
    investigationData: any
  ): any {
    const results = {
      walletAddress,
      analysis: {
        blockchains: blockchainInfo,
        balances: balanceInfo,
        transactions: transactionInfo,
        investigation: investigationData
      },
      summary: {
        totalValue: balanceInfo.totalValue,
        totalTransactions: transactionInfo.totalTransactions,
        blockchainCount: balanceInfo.blockchainCount,
        activeBlockchains: balanceInfo.activeBlockchains || [],
        transactionCounts: transactionInfo.transactionCounts || {},
        lastUpdated: new Date()
      },
      metadata: {
        analysisType: investigationData ? 'deep' : 'quick',
        timestamp: new Date(),
        version: '2.0.0'
      }
    };

    logger.info(`Results compiled for ${walletAddress}:`, {
      totalValue: results.summary.totalValue,
      totalTransactions: results.summary.totalTransactions,
      blockchainCount: results.summary.blockchainCount,
      activeBlockchains: results.summary.activeBlockchains
    });

    return results;
  }

  /**
   * Summarize transaction data
   */
  private summarizeTransactions(transactions: Record<string, any[]>): any {
    const allTransactions = Object.values(transactions).flat();
    
    const summary = {
      total: allTransactions.length,
      byType: {
        incoming: 0,
        outgoing: 0
      },
      byCurrency: {},
      timeRange: {
        earliest: null,
        latest: null
      },
      averageValue: 0
    };

    let totalValue = 0;
    let earliestDate = null;
    let latestDate = null;

    allTransactions.forEach((tx: any) => {
      // Count by type
      if (tx.type === 'in') {
        summary.byType.incoming++;
      } else if (tx.type === 'out') {
        summary.byType.outgoing++;
      }

      // Count by currency
      const currency = tx.currency || 'unknown';
      summary.byCurrency[currency] = (summary.byCurrency[currency] || 0) + 1;

      // Track time range
      const txDate = new Date(tx.timestamp);
      if (!earliestDate || txDate < earliestDate) {
        earliestDate = txDate;
      }
      if (!latestDate || txDate > latestDate) {
        latestDate = txDate;
      }

      // Calculate total value
      const value = parseFloat(tx.value) || 0;
      totalValue += value;
    });

    summary.timeRange.earliest = earliestDate;
    summary.timeRange.latest = latestDate;
    summary.averageValue = allTransactions.length > 0 ? totalValue / allTransactions.length : 0;

    return summary;
  }

  /**
   * Get service health status
   */
  async getServiceHealth(): Promise<Record<string, boolean>> {
    try {
      return await this.agent1WIA.getServiceHealth();
    } catch (error) {
      logger.error('Failed to get service health:', error);
      return {};
    }
  }

  /**
   * Validate wallet address
   */
  validateWalletAddress(address: string): boolean {
    try {
      // Try to validate against all supported blockchains
      const supportedBlockchains = this.agent1WIA.getSupportedBlockchains();
      
      for (const blockchain of supportedBlockchains) {
        if (this.agent1WIA.validateAddress(address, blockchain)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      logger.error('Address validation failed:', error);
      return false;
    }
  }

  /**
   * Get supported blockchains
   */
  getSupportedBlockchains(): string[] {
    return this.agent1WIA.getSupportedBlockchains();
  }

  /**
   * Get blockchain information
   */
  getAllBlockchainInfo(): Record<string, any> {
    return this.agent1WIA.getAllBlockchainInfo();
  }
}
