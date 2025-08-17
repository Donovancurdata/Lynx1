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
    // Add priority token data
    priorityTokenAnalysis?: {
      highPriorityTokens: number;
      mediumPriorityTokens: number;
      lowPriorityTokens: number;
      successRate: number;
      marketTrends: {
        gainers: Array<{
          symbol: string;
          name: string;
          current_price: number;
          price_change_percentage_24h: number;
        }>;
        losers: Array<{
          symbol: string;
          name: string;
          current_price: number;
          price_change_percentage_24h: number;
        }>;
      };
    };
  };
  error?: string;
  message?: string;
}

// Add interface for priority token data
export interface PriorityTokenData {
  id: string;
  symbol: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  last_updated: string;
  collection_timestamp: string;
}

export class WalletAnalysisService {
  private static readonly API_BASE_URL = 'http://localhost:3001/api/v1';

  /**
   * Get priority token market data from the backend
   */
  static async getPriorityTokenMarketData(): Promise<PriorityTokenData[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/priority-tokens/market-data`, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        return response.data.data.tokens;
      } else {
        console.warn('⚠️ Priority token data request failed:', response.data.error);
        return [];
      }
    } catch (error: any) {
      console.error('❌ Failed to get priority token data:', error.message);
      return [];
    }
  }

  /**
   * Get real wallet balance from blockchain services
   */
  static async getRealWalletBalance(address: string, blockchain: string): Promise<{
    balance: string;
    usdValue: number;
    price: number;
  }> {
    try {
      // For now, we'll use the backend wallet analysis to get real balance
      // In the future, this could directly call blockchain RPCs
      const response = await axios.post(`${this.API_BASE_URL}/wallet/analyze`, {
        address,
        blockchain,
        analysisType: 'quick'
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success && response.data.data.blockchains[blockchain]) {
        const blockchainData = response.data.data.blockchains[blockchain];
        return {
          balance: blockchainData.balance.native,
          usdValue: blockchainData.balance.usdValue,
          price: 0 // Will be calculated from priority token data
        };
      }
      
      return { balance: '0', usdValue: 0, price: 0 };
    } catch (error: any) {
      console.error(`❌ Failed to get real wallet balance for ${address}:`, error.message);
      return { balance: '0', usdValue: 0, price: 0 };
    }
  }

  /**
   * Analyze a wallet address using the backend API with streaming support
   */
  static async analyzeWallet(address: string, analysisType: 'quick' | 'deep' = 'quick', onProgress?: (progress: { stage: string; message: string; percentage: number }) => void): Promise<WalletAnalysisResult> {
    try {
      console.log(`🔍 WalletAnalysisService: Starting analysis for ${address} (${analysisType})`);
      
      // Use different endpoints based on analysis type
      const endpoint = analysisType === 'deep' ? '/wallet/deep-analyze' : '/wallet/analyze';
      
      // For deep analysis, we'll use a streaming approach
      if (analysisType === 'deep') {
        return await this.performStreamingAnalysis(address, endpoint, onProgress);
      } else {
        // For quick analysis, use the regular approach with a longer timeout
        const response = await axios.post(`${this.API_BASE_URL}${endpoint}`, {
          address,
          analysisType
        }, {
          timeout: 120000, // 2 minute timeout for deep analysis
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ WalletAnalysisService: Analysis completed for ${address}`);
        return response.data;
      }
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
   * Perform streaming analysis for deep analysis
   */
  private static async performStreamingAnalysis(address: string, endpoint: string, onProgress?: (progress: { stage: string; message: string; percentage: number }) => void): Promise<WalletAnalysisResult> {
    try {
      // Start the analysis
      onProgress?.({ stage: 'initiating', message: 'Initiating deep analysis...', percentage: 5 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // First, detect which blockchains to analyze
      onProgress?.({ stage: 'blockchain_detection', message: 'Detecting which blockchains this wallet uses...', percentage: 10 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Detect blockchain type to set appropriate filter
      const detectedBlockchain = this.detectBlockchain(address);
      const blockchainFilter = detectedBlockchain === 'ethereum' ? 'ethereum' : undefined;
      
      // Simulate blockchain detection and show specific blockchain analysis
      const blockchains = blockchainFilter === 'ethereum' ? ['Ethereum', 'BSC', 'Polygon', 'Avalanche', 'Arbitrum', 'Optimism', 'Base', 'Linea'] : ['Ethereum', 'Bitcoin', 'Solana', 'Polygon', 'BSC'];
      let currentPercentage = 15;
      
      for (const blockchain of blockchains) {
        onProgress?.({ 
          stage: 'analyzing_blockchain', 
          message: `Analyzing ${blockchain} blockchain...`, 
          percentage: currentPercentage 
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        currentPercentage += 15;
      }
      
      // Simulate token discovery
      onProgress?.({ stage: 'token_discovery', message: 'Discovering tokens across blockchains...', percentage: 70 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate price fetching
      onProgress?.({ stage: 'price_fetching', message: 'Fetching current token prices...', percentage: 85 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate final compilation
      onProgress?.({ stage: 'compiling', message: 'Compiling final analysis results...', percentage: 95 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Make the actual API call with blockchain filter
      const requestBody: any = { address, analysisType: 'deep' };
      if (blockchainFilter) {
        requestBody.blockchainFilter = blockchainFilter;
      }
      
      const response = await axios.post(`${this.API_BASE_URL}${endpoint}`, requestBody, {
        timeout: 120000, // 2 minute timeout for deep analysis
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      onProgress?.({ stage: 'complete', message: 'Deep analysis completed!', percentage: 100 });
      
      console.log(`✅ WalletAnalysisService: Deep analysis completed for ${address}`);
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ WalletAnalysisService: Deep analysis failed for ${address}:`, error.message);
      
      if (error.response) {
        return {
          success: false,
          error: `Backend API error: ${error.response.status}`,
          message: error.response.data?.message || 'Deep analysis failed'
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'No response from backend API',
          message: 'Backend service may be unavailable'
        };
      } else {
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
  static async formatAnalysisResults(result: WalletAnalysisResult, analysisType: 'quick' | 'deep'): Promise<string> {
    if (!result.success || !result.data) {
      return `❌ Analysis failed: ${result.message || result.error || 'Unknown error'}`;
    }

    const data = result.data;
    
    // Handle deep analysis data structure
    if (analysisType === 'deep' && 'blockchains' in data && 'discoveredTokens' in data) {
      return await this.formatDeepAnalysisResults(data);
    }
    
    // Handle regular analysis data structure
    const blockchainKeys = Object.keys(data.blockchains);
    const primaryBlockchain = blockchainKeys[0];
    const primaryData = data.blockchains[primaryBlockchain];

    // Get priority token market data for real-time prices
    const priorityTokens = await this.getPriorityTokenMarketData();
    
    // For quick analysis, show only native token value
    // For deep analysis, we'll show detailed token breakdown
    let nativeUsdValue = 0;
    let nativeTokenSymbol = this.getNativeTokenSymbol(primaryBlockchain);
    let nativeTokenPrice = 0;

    // Get real-time token prices from priority token data
    if (primaryBlockchain === 'ethereum') {
      // For Ethereum, get ETH price from priority tokens
      const ethToken = priorityTokens.find(token => 
        token.symbol.toLowerCase() === 'eth'
      );
      
      if (ethToken) {
        nativeTokenPrice = ethToken.current_price;
        const ethBalance = parseFloat(primaryData.balance.native);
        nativeUsdValue = ethBalance * nativeTokenPrice;
        console.log(`🔍 Using real ETH price from priority tokens: ${ethBalance} ETH × $${nativeTokenPrice} = $${nativeUsdValue.toFixed(2)}`);
      } else {
        // Fallback to backend's calculated USD value
        nativeUsdValue = primaryData.balance.usdValue || 0;
        console.log(`⚠️ No ETH price found in priority tokens, using calculated value: $${nativeUsdValue}`);
      }
    } else if (primaryBlockchain === 'bitcoin') {
      // For Bitcoin, get BTC price from priority tokens
      const btcToken = priorityTokens.find(token => 
        token.symbol.toLowerCase() === 'btc'
      );
      
      if (btcToken) {
        nativeTokenPrice = btcToken.current_price;
        const btcBalance = parseFloat(primaryData.balance.native);
        nativeUsdValue = btcBalance * nativeTokenPrice;
        console.log(`🔍 Using real BTC price from priority tokens: ${btcBalance} BTC × $${nativeTokenPrice} = $${nativeUsdValue.toFixed(2)}`);
      } else {
        nativeUsdValue = primaryData.balance.usdValue || 0;
        console.log(`⚠️ No BTC price found in priority tokens, using calculated value: $${nativeUsdValue}`);
      }
    } else if (primaryBlockchain === 'solana') {
      // For Solana, get SOL price from priority tokens
      const solToken = priorityTokens.find(token => 
        token.symbol.toLowerCase() === 'sol'
      );
      
      if (solToken) {
        nativeTokenPrice = solToken.current_price;
        const solBalance = parseFloat(primaryData.balance.native);
        nativeUsdValue = solBalance * nativeTokenPrice;
        console.log(`🔍 Using real SOL price from priority tokens: ${solBalance} SOL × $${nativeTokenPrice} = $${nativeUsdValue.toFixed(2)}`);
      } else {
        nativeUsdValue = primaryData.balance.usdValue || 0;
        console.log(`⚠️ No SOL price found in priority tokens, using calculated value: $${nativeUsdValue}`);
      }
    } else {
      // For other blockchains, use backend data
      nativeUsdValue = primaryData.balance.usdValue || 0;
      console.log(`ℹ️ Using backend data for ${nativeTokenSymbol}: $${nativeUsdValue}`);
    }

    let response = `Wallet Analysis Complete!\n\n`;
    response += `Address: ${data.address}\n`;
    response += `Analysis Type: ${analysisType === 'deep' ? 'Deep Analysis' : 'Quick Analysis'}\n`;
    response += `Primary Blockchain: ${primaryBlockchain}\n\n`;

    // Balance information - show only native token for quick analysis
    response += `Balance Summary:\n`;
    response += `• ${nativeTokenSymbol} Balance: ${primaryData.balance.native}\n`;
    response += `• USD Value: $${nativeUsdValue.toFixed(2)}\n`;

    response += `\nTransaction Summary:\n`;
    response += `• Total Transactions: ${data.totalTransactions}\n`;
    response += `• Recent Transactions: ${primaryData.recentTransactions.length}\n`;
    response += `• Current ${nativeTokenSymbol} Value: $${nativeUsdValue.toFixed(2)}\n\n`;

    if (analysisType === 'deep') {
      response += `Deep Analysis Insights:\n`;
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

    // Add priority token market data
    if (priorityTokens.length > 0) {
      response += `Priority Token Market Overview:\n`;
      
      // Show top gainers and losers
      const topGainers = priorityTokens
        .filter(token => token.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 3);
      
      const topLosers = priorityTokens
        .filter(token => token.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 3);

      if (topGainers.length > 0) {
        response += `📈 Top Gainers (24h):\n`;
        topGainers.forEach(token => {
          response += `   • ${token.symbol.toUpperCase()}: +${token.price_change_percentage_24h.toFixed(2)}% ($${token.current_price.toFixed(6)})\n`;
        });
      }

      if (topLosers.length > 0) {
        response += `📉 Top Losers (24h):\n`;
        topLosers.forEach(token => {
          response += `   • ${token.symbol.toUpperCase()}: ${token.price_change_percentage_24h.toFixed(2)}% ($${token.current_price.toFixed(6)})\n`;
        });
      }

      // Show current prices for major tokens
      response += `\nCurrent Major Token Prices:\n`;
      const majorTokens = ['btc', 'eth', 'sol', 'avax', 'bnb'];
      majorTokens.forEach(symbol => {
        const token = priorityTokens.find(t => t.symbol.toLowerCase() === symbol);
        if (token) {
          response += `   • ${token.symbol.toUpperCase()}: $${token.current_price.toFixed(6)} (${token.price_change_percentage_24h >= 0 ? '+' : ''}${token.price_change_percentage_24h.toFixed(2)}%)\n`;
        }
      });
    }

    response += `\nNext Steps: ${analysisType === 'quick' ? 'Ask me for "deep analysis" to get comprehensive insights including risk assessment and fund flow patterns.' : 'Analysis complete! Feel free to ask specific questions about this wallet.'}`;

    return response;
  }

  /**
   * Format deep analysis results with cross-chain data
   */
  private static async formatDeepAnalysisResults(data: any): Promise<string> {
    let response = `Deep Analysis Complete!\n\n`;
    response += `Address: ${data.walletAddress}\n`;
    response += `Analysis Type: Deep Analysis\n`;
    response += `Analysis Date: ${new Date(data.analysisDate).toLocaleString()}\n\n`;
    
    // Show cross-chain summary
    const blockchainKeys = Object.keys(data.blockchains);
    response += `Cross-Chain Activity Detected:\n`;
    response += `• Total Blockchains: ${blockchainKeys.length}\n`;
    response += `• Total Portfolio Value: $${data.totalValue.toFixed(2)}\n`;
    response += `• Total Transactions: ${data.totalTransactions}\n\n`;
    
    // Show detailed breakdown for each blockchain
    for (const blockchain of blockchainKeys) {
      const blockchainData = data.blockchains[blockchain];
      if (blockchainData) {
        const nativeSymbol = this.getNativeTokenSymbol(blockchain);
        const nativeBalance = blockchainData.nativeBalance || '0';
        const nativeUsdValue = blockchainData.nativeUsdValue || 0;
        const transactionCount = blockchainData.transactionCount || 0;
        
        response += `${blockchain.toUpperCase()} Chain:\n`;
        response += `   • ${nativeSymbol} Balance: ${nativeBalance}\n`;
        response += `   • ${nativeSymbol} Value: $${nativeUsdValue.toFixed(2)}\n`;
        response += `   • Transactions: ${transactionCount}\n\n`;
      }
    }
    
    // Show discovered tokens summary with real data
    if (data.discoveredTokens && data.discoveredTokens.length > 0) {
      response += `Token Discovery Summary:\n`;
      response += `• Total Unique Tokens: ${data.discoveredTokens.length}\n`;
      
      const matchedTokens = data.discoveredTokens.filter((t: any) => t.isMatched);
      const unmatchedTokens = data.discoveredTokens.filter((t: any) => !t.isMatched);
      
      response += `• Matched with CoinGecko: ${matchedTokens.length}\n`;
      response += `• Unmatched (Value: $0): ${unmatchedTokens.length}\n\n`;
      
      // Show top tokens by value
      if (matchedTokens.length > 0) {
        response += `Top Tokens by Value:\n`;
        const topTokens = matchedTokens
          .filter((t: any) => t.usdValue > 0)
          .sort((a: any, b: any) => b.usdValue - a.usdValue)
          .slice(0, 10);
        
        topTokens.forEach((token: any) => {
          response += `   • ${token.symbol} (${token.blockchain}): ${token.balance} ($${token.usdValue.toFixed(2)})\n`;
        });
        response += `\n`;
      }
      
      // Show tokens by blockchain
      const tokensByBlockchain = new Map<string, any[]>();
      data.discoveredTokens.forEach((token: any) => {
        if (!tokensByBlockchain.has(token.blockchain)) {
          tokensByBlockchain.set(token.blockchain, []);
        }
        tokensByBlockchain.get(token.blockchain)!.push(token);
      });
      
      response += `Tokens by Blockchain:\n`;
      for (const [blockchain, tokens] of tokensByBlockchain) {
        const blockchainValue = tokens.reduce((sum, t) => sum + t.usdValue, 0);
        response += `   • ${blockchain.toUpperCase()}: ${tokens.length} tokens, $${blockchainValue.toFixed(2)}\n`;
      }
      response += `\n`;
    }
    
    response += `\nAnalysis complete! This wallet has been active on ${blockchainKeys.length} blockchain(s) with comprehensive token and transaction data stored in Azure.`;
    
    return response;
  }

  /**
   * Assess risk level based on wallet data
   */
  private static assessRiskLevel(data: any): string {
    const totalValue = data.totalValue;
    const transactionCount = data.totalTransactions;
    
    if (totalValue > 1000000 && transactionCount > 1000) return 'LOW - High-value, active wallet';
    if (totalValue > 100000 && transactionCount > 100) return 'MEDIUM - Moderate activity';
    if (totalValue < 1000 && transactionCount < 10) return 'HIGH - Low-value, inactive wallet';
    return 'MEDIUM - Standard wallet activity';
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

  /**
   * Detect the blockchain type of an address using pattern matching
   */
  static detectBlockchain(address: string): string {
    // Ethereum/Sub Chains addresses (0x...)
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return 'ethereum';
    }
    
    // Bitcoin addresses (Legacy, SegWit, Native SegWit)
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$|^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
      return 'bitcoin';
    }
    
    // Solana addresses (Base58, 32-44 characters)
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return 'solana';
    }
    
    // Default to ethereum for unknown formats
    return 'ethereum';
  }
}
