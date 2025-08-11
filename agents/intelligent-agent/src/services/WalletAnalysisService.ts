import axios from 'axios';

export interface WalletAnalysisResult {
  success: boolean;
  data?: {
    address: string;
    blockchains: {
      [blockchain: string]: {
        address: string;
        blockchain: string;
        balance: {
          native: string;
          usdValue: number;
        };
        tokens: Array<{
          symbol: string;
          balance: string;
          usdValue: number;
          tokenAddress?: string;
        }>;
        totalTokens: number;
        topTokens: Array<{
          symbol: string;
          balance: string;
          usdValue: number;
          tokenAddress?: string;
        }>;
        recentTransactions: Array<{
          hash: string;
          from: string;
          to: string;
          value: string;
          timestamp: string;
          type: 'in' | 'out';
          currency: string;
        }>;
        totalLifetimeValue: number;
        transactionCount: number;
        tokenTransactionCount: number;
        lastUpdated: string;
      };
    };
    totalValue: number;
    totalTransactions: number;
    lastUpdated: string;
  };
  error?: string;
  message?: string;
}

export class WalletAnalysisService {
  private static readonly API_BASE_URL = 'http://localhost:3001/api/v1';

  /**
   * Analyze a wallet address using the backend API
   */
  static async analyzeWallet(address: string, analysisType: 'quick' | 'deep' = 'quick'): Promise<WalletAnalysisResult> {
    try {
      console.log(`🔍 WalletAnalysisService: Starting analysis for ${address} (${analysisType})`);
      
      const response = await axios.post(`${this.API_BASE_URL}/wallet/analyze`, {
        address,
        analysisType
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WalletAnalysisService: Analysis completed for ${address}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ WalletAnalysisService: Analysis failed for ${address}:`, error.message);
      
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error: `Backend API error: ${error.response.status}`,
          message: error.response.data?.message || 'Analysis failed'
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: 'No response from backend API',
          message: 'Backend service may be unavailable'
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: 'Request setup failed',
          message: error.message || 'Unknown error'
        };
      }
    }
  }

  /**
   * Get wallet balance
   */
  static async getWalletBalance(address: string, blockchain?: string): Promise<any> {
    try {
      const params = blockchain ? { blockchain } : {};
      const response = await axios.get(`${this.API_BASE_URL}/wallet/balance/${address}`, {
        params,
        timeout: 15000
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ WalletAnalysisService: Balance retrieval failed for ${address}:`, error.message);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactionHistory(address: string, blockchain?: string, limit: number = 50): Promise<any> {
    try {
      const params: any = { limit };
      if (blockchain) params.blockchain = blockchain;
      
      const response = await axios.get(`${this.API_BASE_URL}/wallet/transactions/${address}`, {
        params,
        timeout: 15000
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ WalletAnalysisService: Transaction retrieval failed for ${address}:`, error.message);
      throw error;
    }
  }

  /**
   * Format wallet analysis results into a user-friendly response
   */
  static formatAnalysisResults(result: WalletAnalysisResult, analysisType: 'quick' | 'deep'): string {
    if (!result.success || !result.data) {
      return `❌ Analysis failed: ${result.message || result.error || 'Unknown error'}`;
    }

    const data = result.data;
    const blockchainKeys = Object.keys(data.blockchains);
    const primaryBlockchain = blockchainKeys[0];
    const primaryData = data.blockchains[primaryBlockchain];

    let response = `🔍 **Wallet Analysis Complete!**\n\n`;
    response += `**Address:** \`${data.address}\`\n`;
    response += `**Analysis Type:** ${analysisType === 'deep' ? 'Deep Analysis' : 'Quick Analysis'}\n`;
    response += `**Primary Blockchain:** ${primaryBlockchain}\n\n`;

    // Balance information
    response += `💰 **Balance Summary:**\n`;
    response += `• Native Balance: ${primaryData.balance.native}\n`;
    response += `• USD Value: $${primaryData.balance.usdValue.toLocaleString()}\n`;
    response += `• Total Tokens: ${primaryData.totalTokens}\n\n`;

    // Token information
    if (primaryData.tokens && primaryData.tokens.length > 0) {
      response += `🪙 **Top Tokens:**\n`;
      primaryData.topTokens.slice(0, 5).forEach((token, index) => {
        response += `${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue.toLocaleString()})\n`;
      });
      response += `\n`;
    }

    // Transaction information
    response += `📊 **Transaction Summary:**\n`;
    response += `• Total Transactions: ${data.totalTransactions}\n`;
    response += `• Recent Transactions: ${primaryData.recentTransactions.length}\n`;
    response += `• Total Lifetime Value: $${data.totalValue.toLocaleString()}\n\n`;

    if (analysisType === 'deep') {
      response += `🔍 **Deep Analysis Insights:**\n`;
      response += `• Risk Level: ${this.assessRiskLevel(data)}\n`;
      response += `• Activity Pattern: ${this.assessActivityPattern(data)}\n`;
      response += `• Wealth Distribution: ${this.assessWealthDistribution(data)}\n\n`;
    }

    response += `⏰ **Last Updated:** ${new Date(data.lastUpdated).toLocaleString()}\n\n`;
    response += `💡 **Next Steps:** ${analysisType === 'quick' ? 'Ask me for "deep analysis" to get comprehensive insights including risk assessment and fund flow patterns.' : 'Analysis complete! Feel free to ask specific questions about this wallet.'}`;

    return response;
  }

  /**
   * Assess risk level based on wallet data
   */
  private static assessRiskLevel(data: any): string {
    const totalValue = data.totalValue;
    const transactionCount = data.totalTransactions;
    
    if (totalValue > 1000000 && transactionCount > 1000) return '🟢 LOW - High-value, active wallet';
    if (totalValue > 100000 && transactionCount > 100) return '🟡 MEDIUM - Moderate activity';
    if (totalValue < 1000 && transactionCount < 10) return '🔴 HIGH - Low-value, inactive wallet';
    return '🟡 MEDIUM - Standard wallet activity';
  }

  /**
   * Assess activity pattern
   */
  private static assessActivityPattern(data: any): string {
    const transactionCount = data.totalTransactions;
    if (transactionCount > 1000) return 'Very Active - High transaction volume';
    if (transactionCount > 100) return 'Active - Regular transactions';
    if (transactionCount > 10) return 'Moderate - Occasional activity';
    return 'Inactive - Minimal transactions';
  }

  /**
   * Assess wealth distribution
   */
  private static assessWealthDistribution(data: any): string {
    const totalValue = data.totalValue;
    if (totalValue > 1000000) return 'Whale - Very high value';
    if (totalValue > 100000) return 'High Net Worth - Significant holdings';
    if (totalValue > 10000) return 'Moderate - Decent holdings';
    if (totalValue > 1000) return 'Small - Limited holdings';
    return 'Minimal - Very small holdings';
  }
}
