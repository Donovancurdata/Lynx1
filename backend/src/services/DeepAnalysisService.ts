import { logger } from '../utils/logger';
import { CoinGeckoService } from './CoinGeckoService';
import { ComprehensiveBlockchainAnalyzer } from './ComprehensiveBlockchainAnalyzer';
import { AzureStorageService } from './AzureStorageService';

export interface DeepAnalysisToken {
  symbol: string;
  name: string;
  contractAddress: string;
  balance: string;
  usdValue: number;
  decimals: number;
  blockchain: string;
  coinGeckoId?: string;
  isMatched: boolean;
}

export interface DeepAnalysisTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  type: 'in' | 'out';
  blockchain: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenAddress?: string;
  tokenValue?: string;
  tokenDecimals?: number;
}

export interface DeepAnalysisResult {
  walletAddress: string;
  analysisDate: string;
  totalValue: number;
  totalTransactions: number;
  blockchains: {
    [blockchain: string]: {
      blockchain: string;
      value: number;
      tokens: DeepAnalysisToken[];
      transactions: DeepAnalysisTransaction[];
      transactionCount: number;
      nativeBalance: string;
      nativeUsdValue: number;
    };
  };
  discoveredTokens: DeepAnalysisToken[];
  azureStorageIds: string[];
}

export interface AzureWalletAnalysisEntry {
  id: string;
  blockchain: string;
  value: number;
  tokens: DeepAnalysisToken[];
  date: string;
  transactions: DeepAnalysisTransaction[];
  transactionCount: number;
  nativeBalance: string;
  nativeUsdValue: number;
}

export class DeepAnalysisService {
  private static coinGeckoService: CoinGeckoService;

  static async initialize(): Promise<void> {
    try {
      this.coinGeckoService = new CoinGeckoService();
      await AzureStorageService.initialize();
      await ComprehensiveBlockchainAnalyzer.initialize();
      logger.info('DeepAnalysisService initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize DeepAnalysisService:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive deep analysis across all detected blockchains
   */
  static async performDeepAnalysis(walletAddress: string): Promise<DeepAnalysisResult> {
    logger.info(`🚀 Starting DEEP ANALYSIS for wallet: ${walletAddress}`);
    
    try {
      // 1. Detect all blockchains the wallet has been active on
      const activeBlockchains = await this.detectActiveBlockchains(walletAddress);
      logger.info(`🔗 Detected active blockchains: ${activeBlockchains.join(', ')}`);

      // 2. Analyze each blockchain comprehensively
      const blockchainAnalyses = await this.analyzeAllBlockchains(walletAddress, activeBlockchains);
      
      // 3. Discover and value all tokens across all chains
      const allTokens = await this.discoverAndValueAllTokens(blockchainAnalyses);
      
      // 4. Store discovered tokens in Azure for future daily collection evaluation
      await this.storeDiscoveredTokens(allTokens);
      
      // 5. Store comprehensive wallet analysis in Azure
      const azureStorageIds = await this.storeWalletAnalysis(walletAddress, blockchainAnalyses, allTokens);
      
      // 6. Compile final results
      const result = this.compileDeepAnalysisResults(walletAddress, blockchainAnalyses, allTokens, azureStorageIds);
      
      logger.info(`✅ Deep analysis completed successfully for ${walletAddress}`);
      return result;
      
    } catch (error) {
      logger.error(`❌ Deep analysis failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Detect which blockchains the wallet has been active on
   */
  private static async detectActiveBlockchains(walletAddress: string): Promise<string[]> {
    const supportedBlockchains = [
      'ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 
      'optimism', 'base', 'linea', 'bitcoin', 'solana'
    ];
    
    const activeBlockchains: string[] = [];
    
    for (const blockchain of supportedBlockchains) {
      try {
        const isActive = await this.checkBlockchainActivity(walletAddress, blockchain);
        if (isActive) {
          activeBlockchains.push(blockchain);
          logger.info(`✅ ${blockchain.toUpperCase()} activity detected for ${walletAddress}`);
        }
      } catch (error) {
        logger.debug(`No activity detected on ${blockchain}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return activeBlockchains;
  }

  /**
   * Check if wallet has activity on a specific blockchain
   */
  private static async checkBlockchainActivity(walletAddress: string, blockchain: string): Promise<boolean> {
    try {
      switch (blockchain) {
        case 'ethereum':
          return await this.checkEthereumActivity(walletAddress);
        case 'bsc':
          return await this.checkBSCActivity(walletAddress);
        case 'polygon':
          return await this.checkPolygonActivity(walletAddress);
        case 'avalanche':
          return await this.checkAvalancheActivity(walletAddress);
        case 'arbitrum':
          return await this.checkArbitrumActivity(walletAddress);
        case 'optimism':
          return await this.checkOptimismActivity(walletAddress);
        case 'base':
          return await this.checkBaseActivity(walletAddress);
        case 'linea':
          return await this.checkLineaActivity(walletAddress);
        case 'bitcoin':
          return await this.checkBitcoinActivity(walletAddress);
        case 'solana':
          return await this.checkSolanaActivity(walletAddress);
        default:
          return false;
      }
    } catch (error) {
      logger.debug(`Error checking ${blockchain} activity:`, error);
      return false;
    }
  }

  /**
   * Check Ethereum activity via Etherscan V2 API (Chain ID 1)
   */
  private static async checkEthereumActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with Ethereum chain ID (1)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check BSC activity via Etherscan V2 API (Chain ID 56)
   */
  private static async checkBSCActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with BSC chain ID (56)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Polygon activity via Etherscan V2 API (Chain ID 137)
   */
  private static async checkPolygonActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with Polygon chain ID (137)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=137&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Avalanche activity via Snowtrace
   */
  private static async checkAvalancheActivity(walletAddress: string): Promise<boolean> {
    const snowtraceApiKey = process.env.SNOWTRACE_API_KEY;
    if (!snowtraceApiKey) return false;
    
    try {
      const response = await fetch(`https://api.snowtrace.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${snowtraceApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Arbitrum activity via Etherscan V2 API (Chain ID 42161)
   */
  private static async checkArbitrumActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with Arbitrum chain ID (42161)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=42161&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Optimism activity via Etherscan V2 API (Chain ID 10)
   */
  private static async checkOptimismActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with Optimism chain ID (10)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=10&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Base activity via Etherscan V2 API (Chain ID 8453)
   */
  private static async checkBaseActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with Base chain ID (8453)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Linea activity via Etherscan V2 API (Chain ID 59144)
   */
  private static async checkLineaActivity(walletAddress: string): Promise<boolean> {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) return false;
    
    try {
      // Use Etherscan V2 API with Linea chain ID (59144)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=59144&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      return data.status === '1' && data.result && data.result.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Bitcoin activity via BTCScan
   */
  private static async checkBitcoinActivity(walletAddress: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.btcscan.org/api/address/${walletAddress}`);
      const data = await response.json();
      
      return data && data.balance !== undefined;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check Solana activity via Solscan
   */
  private static async checkSolanaActivity(walletAddress: string): Promise<boolean> {
    try {
      const response = await fetch(`https://public-api.solscan.io/account/${walletAddress}`);
      const data = await response.json();
      
      return data && data.lamports !== undefined;
    } catch (error) {
      return false;
    }
  }

  /**
   * Analyze all detected blockchains comprehensively
   */
  private static async analyzeAllBlockchains(walletAddress: string, blockchains: string[]): Promise<any> {
    const analyses: any = {};
    
    for (const blockchain of blockchains) {
      try {
        logger.info(`🔍 Analyzing ${blockchain} for ${walletAddress}...`);
        const analysis = await this.analyzeSingleBlockchain(walletAddress, blockchain);
        analyses[blockchain] = analysis;
        logger.info(`✅ ${blockchain} analysis completed`);
      } catch (error) {
        logger.error(`❌ ${blockchain} analysis failed:`, error);
        analyses[blockchain] = null;
      }
    }
    
    return analyses;
  }

  /**
   * Analyze a single blockchain comprehensively
   */
  private static async analyzeSingleBlockchain(walletAddress: string, blockchain: string): Promise<any> {
    try {
      const analysis = await ComprehensiveBlockchainAnalyzer.analyzeBlockchain(walletAddress, blockchain);
      return {
        blockchain: analysis.blockchain,
        nativeBalance: analysis.nativeBalance,
        nativeUsdValue: analysis.nativeUsdValue,
        tokens: analysis.tokens,
        transactions: analysis.transactions,
        transactionCount: analysis.transactionCount
      };
    } catch (error) {
      logger.error(`Failed to analyze ${blockchain} for ${walletAddress}:`, error);
      return {
        blockchain,
        nativeBalance: '0',
        nativeUsdValue: 0,
        tokens: [],
        transactions: [],
        transactionCount: 0
      };
    }
  }

  /**
   * Discover and value all tokens across all chains using CoinGecko
   */
  private static async discoverAndValueAllTokens(blockchainAnalyses: any): Promise<DeepAnalysisToken[]> {
    const allTokens: DeepAnalysisToken[] = [];
    
    for (const [blockchain, analysis] of Object.entries(blockchainAnalyses)) {
      if (analysis && analysis.tokens) {
        for (const token of analysis.tokens) {
          try {
            // Try to match token with CoinGecko
            const coinGeckoId = await this.matchTokenToCoinGecko(token.symbol, token.name);
            const usdValue = coinGeckoId ? await this.getTokenPrice(coinGeckoId) : 0;
            
            const deepAnalysisToken: DeepAnalysisToken = {
              ...token,
              blockchain,
              coinGeckoId,
              usdValue,
              isMatched: !!coinGeckoId
            };
            
            allTokens.push(deepAnalysisToken);
          } catch (error) {
            logger.warn(`Failed to process token ${token.symbol} on ${blockchain}:`, error);
          }
        }
      }
    }
    
    return allTokens;
  }

  /**
   * Match token symbol/name to CoinGecko coin ID
   */
  private static async matchTokenToCoinGecko(symbol: string, name: string): Promise<string | null> {
    try {
      // First try exact symbol match
      const coinsList = await this.coinGeckoService.getAllCoins();
      const exactMatch = coinsList.find(coin => 
        coin.symbol.toLowerCase() === symbol.toLowerCase()
      );
      
      if (exactMatch) {
        return exactMatch.id;
      }
      
      // Try name match
      const nameMatch = coinsList.find(coin => 
        coin.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(coin.name.toLowerCase())
      );
      
      if (nameMatch) {
        return nameMatch.id;
      }
      
      // Try fuzzy search
      const searchResults = await this.coinGeckoService.searchCoins(symbol);
      if (searchResults && searchResults.length > 0) {
        return searchResults[0].id;
      }
      
      return null;
    } catch (error) {
      logger.warn(`Failed to match token ${symbol} to CoinGecko:`, error);
      return null;
    }
  }

  /**
   * Get token price from CoinGecko
   */
  private static async getTokenPrice(coinGeckoId: string): Promise<number> {
    try {
      const marketData = await this.coinGeckoService.getMarketData([coinGeckoId]);
      if (marketData && marketData.length > 0) {
        return marketData[0].current_price || 0;
      }
      return 0;
    } catch (error) {
      logger.warn(`Failed to get price for ${coinGeckoId}:`, error);
      return 0;
    }
  }

  /**
   * Store discovered tokens in Azure for future daily collection evaluation
   */
  private static async storeDiscoveredTokens(tokens: DeepAnalysisToken[]): Promise<void> {
    try {
      const uniqueTokens = tokens.filter((token, index, self) => 
        index === self.findIndex(t => t.contractAddress === token.contractAddress && t.blockchain === token.blockchain)
      );
      
      logger.info(`💾 Storing ${uniqueTokens.length} discovered tokens in Azure`);
      
      // Store tokens using AzureStorageService
      for (const token of uniqueTokens) {
        try {
          await AzureStorageService.storeDiscoveredTokens(token.contractAddress || 'unknown', [token]);
        } catch (error) {
          logger.warn(`Failed to store token ${token.symbol}:`, error);
        }
      }
      
      logger.info(`💾 Successfully stored discovered tokens in Azure`);
    } catch (error) {
      logger.error('Failed to store discovered tokens:', error);
    }
  }

  /**
   * Store comprehensive wallet analysis in Azure
   */
  private static async storeWalletAnalysis(
    walletAddress: string, 
    blockchainAnalyses: any, 
    allTokens: DeepAnalysisToken[]
  ): Promise<string[]> {
    const storageIds: string[] = [];
    
    try {
      for (const [blockchain, analysis] of Object.entries(blockchainAnalyses)) {
        if (analysis) {
          const storageData: DeepAnalysisStorageData = {
            walletAddress,
            blockchain,
            analysisDate: new Date().toISOString(),
            totalValue: analysis.nativeUsdValue + (analysis.tokens || []).reduce((sum: number, t: any) => sum + (t.usdValue || 0), 0),
            totalTransactions: analysis.transactionCount || 0,
            nativeBalance: analysis.nativeBalance || '0',
            nativeUsdValue: analysis.nativeUsdValue || 0,
            tokens: allTokens.filter(t => t.blockchain === blockchain),
            transactions: analysis.transactions || [],
            discoveredTokens: allTokens
          };
          
          try {
            const storageId = await AzureStorageService.storeDeepAnalysisData(storageData);
            storageIds.push(storageId);
            logger.info(`💾 Stored ${blockchain} analysis for ${walletAddress} in Azure: ${storageId}`);
          } catch (error) {
            logger.error(`Failed to store ${blockchain} analysis for ${walletAddress}:`, error);
          }
        }
      }
    } catch (error) {
      logger.error('Failed to store wallet analysis:', error);
    }
    
    return storageIds;
  }

  /**
   * Compile final deep analysis results
   */
  private static compileDeepAnalysisResults(
    walletAddress: string,
    blockchainAnalyses: any,
    allTokens: DeepAnalysisToken[],
    azureStorageIds: string[]
  ): DeepAnalysisResult {
    let totalValue = 0;
    let totalTransactions = 0;
    
    for (const [blockchain, analysis] of Object.entries(blockchainAnalyses)) {
      if (analysis) {
        totalValue += analysis.nativeUsdValue || 0;
        totalValue += (analysis.tokens || []).reduce((sum: number, t: any) => sum + (t.usdValue || 0), 0);
        totalTransactions += analysis.transactionCount || 0;
      }
    }
    
    return {
      walletAddress,
      analysisDate: new Date().toISOString(),
      totalValue,
      totalTransactions,
      blockchains: blockchainAnalyses,
      discoveredTokens: allTokens,
      azureStorageIds
    };
  }
}
