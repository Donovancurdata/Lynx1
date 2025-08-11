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
          price?: number;
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

    // For quick analysis, show only native token value
    // For deep analysis, we'll show detailed token breakdown
    let nativeUsdValue = 0;
    let nativeTokenSymbol = this.getNativeTokenSymbol(primaryBlockchain);

    // Get real-time token prices from backend instead of hardcoded values
    
    if (primaryBlockchain === 'ethereum') {
      // For Ethereum, try to get real ETH price from backend data
      const ethBalance = parseFloat(primaryData.balance.native);
      
      // Check if backend has real ETH price data
      if (primaryData.tokens && primaryData.tokens.length > 0) {
        // Look for ETH/WETH token with real price
        const ethToken = primaryData.tokens.find(token => 
          token.symbol?.toLowerCase() === 'eth' || 
          token.symbol?.toLowerCase() === 'weth'
        );
        
        if (ethToken && ethToken.price) {
          nativeUsdValue = ethBalance * ethToken.price;
          console.log(`🔍 Using real ETH price from backend: ${ethBalance} ETH × $${ethToken.price} = $${nativeUsdValue.toFixed(2)}`);
        } else {
          // Fallback to backend's calculated USD value
          nativeUsdValue = primaryData.balance.usdValue || 0;
          console.log(`⚠️ No ETH price found in backend, using calculated value: $${nativeUsdValue}`);
        }
      } else {
        // No token data, use backend's calculated value
        nativeUsdValue = primaryData.balance.usdValue || 0;
        console.log(`⚠️ No token data in backend, using calculated value: $${nativeUsdValue}`);
      }
    } else {
      // For other blockchains, use backend data
      nativeUsdValue = primaryData.balance.usdValue || 0;
      console.log(`ℹ️ Using backend data for ${nativeTokenSymbol}: $${nativeUsdValue}`);
    }

    let response = `🔍 Wallet Analysis Complete!\n\n`;
    response += `Address: ${data.address}\n`;
    response += `Analysis Type: ${analysisType === 'deep' ? 'Deep Analysis' : 'Quick Analysis'}\n`;
    response += `Primary Blockchain: ${primaryBlockchain}\n\n`;

    // Balance information - show only native token for quick analysis
    response += `💰 Balance Summary:\n`;
    response += `• ${nativeTokenSymbol} Balance: ${primaryData.balance.native}\n`;
    response += `• USD Value: $${nativeUsdValue.toFixed(2)}\n`;

    response += `\n📊 Transaction Summary:\n`;
    response += `• Total Transactions: ${data.totalTransactions}\n`;
    response += `• Recent Transactions: ${primaryData.recentTransactions.length}\n`;
    response += `• Total Lifetime Value: $0\n`;
    response += `• Current ${nativeTokenSymbol} Value: $${nativeUsdValue.toFixed(2)}\n\n`;

    if (analysisType === 'deep') {
      response += `🔍 Deep Analysis Insights:\n`;
      response += `• Risk Level: ${this.assessRiskLevel(data)}\n`;
      response += `• Activity Pattern: ${this.assessActivityPattern(data)}\n`;
      response += `• Wealth Distribution: ${this.assessWealthDistribution(data)}\n\n`;
      
      // For deep analysis, show detailed token breakdown using real prices
      if (primaryBlockchain === 'ethereum' && primaryData.tokens && primaryData.tokens.length > 0) {
        response += `💎 Detailed Token Holdings:\n`;
        
        // Show ETH balance with calculated USD value
        response += `• ETH: ${primaryData.balance.native} ($${nativeUsdValue.toFixed(2)})\n`;
        
        // Show other tokens with real prices from backend
        let totalPortfolioValue = nativeUsdValue;
        primaryData.tokens.forEach(token => {
          if (token.symbol && token.symbol.toLowerCase() !== 'eth' && token.symbol.toLowerCase() !== 'weth') {
            const tokenUsdValue = (parseFloat(token.balance) * token.price) || 0;
            totalPortfolioValue += tokenUsdValue;
            response += `• ${token.symbol}: ${token.balance} ($${tokenUsdValue.toFixed(2)})\n`;
          }
        });
        
        response += `• Total Portfolio Value: $${totalPortfolioValue.toFixed(2)}\n\n`;
      } else {
        response += `💎 Token Details:\n`;
        response += `• Total Tokens: ${primaryData.totalTokens || 0}\n`;
        response += `• Top Tokens: ${primaryData.topTokens?.length || 0} found\n\n`;
      }
    }

    response += `⏰ Last Updated: ${new Date(data.lastUpdated).toLocaleString()}\n\n`;
    response += `💡 Next Steps: ${analysisType === 'quick' ? 'Ask me for "deep analysis" to get comprehensive insights including risk assessment and fund flow patterns.' : 'Analysis complete! Feel free to ask specific questions about this wallet.'}`;

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

  /**
   * Get native token symbol for blockchain
   */
  private static getNativeTokenSymbol(blockchain: string): string {
    const tokenMap: { [key: string]: string } = {
      'ethereum': 'ETH',
      'bsc': 'BNB',
      'polygon': 'MATIC',
      'avalanche': 'AVAX',
      'fantom': 'FTM',
      'arbitrum': 'ETH',
      'optimism': 'ETH',
      'solana': 'SOL',
      'bitcoin': 'BTC'
    };
    return tokenMap[blockchain.toLowerCase()] || 'Native Token';
  }
}
