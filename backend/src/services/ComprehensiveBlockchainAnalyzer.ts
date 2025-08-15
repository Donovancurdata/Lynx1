import { logger } from '../utils/logger';
import { Agent1WIA } from '../../../agents/agent1-wia/dist/Agent1WIA';
import { DeepAnalysisToken, DeepAnalysisTransaction } from './DeepAnalysisService';

export interface BlockchainAnalysisResult {
  blockchain: string;
  nativeBalance: string;
  nativeUsdValue: number;
  tokens: DeepAnalysisToken[];
  transactions: DeepAnalysisTransaction[];
  transactionCount: number;
  isActive: boolean;
  error?: string;
}

export class ComprehensiveBlockchainAnalyzer {
  private static agent1WIA: Agent1WIA;

  static async initialize(): Promise<void> {
    try {
      this.agent1WIA = new Agent1WIA();
      logger.info('ComprehensiveBlockchainAnalyzer initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize ComprehensiveBlockchainAnalyzer:', error);
      throw error;
    }
  }

  /**
   * Analyze a wallet comprehensively on a specific blockchain
   */
  static async analyzeBlockchain(
    walletAddress: string, 
    blockchain: string
  ): Promise<BlockchainAnalysisResult> {
    logger.info(`🔍 Starting comprehensive analysis for ${walletAddress} on ${blockchain}`);
    
    try {
      switch (blockchain) {
        case 'ethereum':
          return await this.analyzeEthereum(walletAddress);
        case 'bsc':
          return await this.analyzeBSC(walletAddress);
        case 'polygon':
          return await this.analyzePolygon(walletAddress);
        case 'avalanche':
          return await this.analyzeAvalanche(walletAddress);
        case 'arbitrum':
          return await this.analyzeArbitrum(walletAddress);
        case 'optimism':
          return await this.analyzeOptimism(walletAddress);
        case 'base':
          return await this.analyzeBase(walletAddress);
        case 'linea':
          return await this.analyzeLinea(walletAddress);
        case 'bitcoin':
          return await this.analyzeBitcoin(walletAddress);
        case 'solana':
          return await this.analyzeSolana(walletAddress);
        default:
          return {
            blockchain,
            nativeBalance: '0',
            nativeUsdValue: 0,
            tokens: [],
            transactions: [],
            transactionCount: 0,
            isActive: false,
            error: `Unsupported blockchain: ${blockchain}`
          };
      }
    } catch (error) {
      logger.error(`❌ ${blockchain} analysis failed:`, error);
      return {
        blockchain,
        nativeBalance: '0',
        nativeUsdValue: 0,
        tokens: [],
        transactions: [],
        transactionCount: 0,
        isActive: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze Ethereum wallet comprehensively
   */
  private static async analyzeEthereum(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'ethereum');
      
      // Use token data from Agent1WIA instead of calling separate methods
      const tokenData = walletData.enhancedBalance?.tokens || [];
      
      // Get comprehensive transaction data
      const transactionData = await this.getEthereumTransactionData(walletAddress);
      
      // Calculate correct ETH USD value using real-time price
      const ethBalance = parseFloat(walletData.balance.balance || '0');
      const ethUsdValue = await this.getETHUSDValue(ethBalance);
      
      return {
        blockchain: 'ethereum',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: ethUsdValue,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Ethereum analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get real-time ETH USD value from CoinGecko
   */
  private static async getETHUSDValue(ethBalance: number): Promise<number> {
    try {
      // Use CoinGecko to get current ETH price
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json() as { ethereum?: { usd: number } };
      
      if (data.ethereum && data.ethereum.usd) {
        const ethPrice = data.ethereum.usd;
        return ethBalance * ethPrice;
      }
      
      // Fallback to a reasonable ETH price if API fails
      logger.warn('Failed to get ETH price from CoinGecko, using fallback price');
      return ethBalance * 4500; // Fallback ETH price
    } catch (error) {
      logger.warn('Failed to get ETH price, using fallback price:', error);
      return ethBalance * 4500; // Fallback ETH price
    }
  }

  /**
   * Get real-time BNB USD value from CoinGecko
   */
  private static async getBNBUSDValue(bnbBalance: number): Promise<number> {
    try {
      // Use CoinGecko to get current BNB price
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
      const data = await response.json() as { binancecoin?: { usd: number } };
      
      if (data.binancecoin && data.binancecoin.usd) {
        const bnbPrice = data.binancecoin.usd;
        return bnbBalance * bnbPrice;
      }
      
      // Fallback to a reasonable BNB price if API fails
      logger.warn('Failed to get BNB price from CoinGecko, using fallback price');
      return bnbBalance * 800; // Fallback BNB price
    } catch (error) {
      logger.warn('Failed to get BNB price, using fallback price:', error);
      return bnbBalance * 800; // Fallback BNB price
    }
  }

  /**
   * Analyze BSC wallet comprehensively
   */
  private static async analyzeBSC(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA - use 'binance' as that's how it's registered in BlockchainServiceFactory
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'binance');
      
      // Get comprehensive token data
      const tokenData = await this.getBSCTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getBSCTransactionData(walletAddress);
      
      // Calculate correct BNB USD value using real-time price
      const bnbBalance = parseFloat(walletData.balance.balance || '0');
      const bnbUsdValue = await this.getBNBUSDValue(bnbBalance);
      
      return {
        blockchain: 'bsc',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: bnbUsdValue,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: transactionData.length, // Use actual retrieved transaction count
        isActive: true
      };
    } catch (error) {
      logger.error('BSC analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Polygon wallet comprehensively
   */
  private static async analyzePolygon(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'polygon');
      
      // Get comprehensive token data
      const tokenData = await this.getPolygonTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getPolygonTransactionData(walletAddress);
      
      return {
        blockchain: 'polygon',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Polygon analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Avalanche wallet comprehensively
   */
  private static async analyzeAvalanche(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'avalanche');
      
      // Get comprehensive token data
      const tokenData = await this.getAvalancheTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getAvalancheTransactionData(walletAddress);
      
      return {
        blockchain: 'avalanche',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Avalanche analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Arbitrum wallet comprehensively
   */
  private static async analyzeArbitrum(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'arbitrum');
      
      // Get comprehensive token data
      const tokenData = await this.getArbitrumTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getArbitrumTransactionData(walletAddress);
      
      return {
        blockchain: 'arbitrum',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Arbitrum analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Optimism wallet comprehensively
   */
  private static async analyzeOptimism(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'optimism');
      
      // Get comprehensive token data
      const tokenData = await this.getOptimismTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getOptimismTransactionData(walletAddress);
      
      return {
        blockchain: 'optimism',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Optimism analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Base wallet comprehensively
   */
  private static async analyzeBase(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'base');
      
      // Get comprehensive token data
      const tokenData = await this.getBaseTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getBaseTransactionData(walletAddress);
      
      return {
        blockchain: 'base',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Base analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Linea wallet comprehensively
   */
  private static async analyzeLinea(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'linea');
      
      // Get comprehensive token data
      const tokenData = await this.getLineaTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getLineaTransactionData(walletAddress);
      
      return {
        blockchain: 'linea',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Linea analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Bitcoin wallet comprehensively
   */
  private static async analyzeBitcoin(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'bitcoin');
      
      // Get comprehensive transaction data
      const transactionData = await this.getBitcoinTransactionData(walletAddress);
      
      return {
        blockchain: 'bitcoin',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: [], // Bitcoin doesn't have ERC-20 tokens
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Bitcoin analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze Solana wallet comprehensively
   */
  private static async analyzeSolana(walletAddress: string): Promise<BlockchainAnalysisResult> {
    try {
      // Get wallet data from Agent1WIA
      const walletData = await this.agent1WIA.getWalletData(walletAddress, 'solana');
      
      // Get comprehensive token data
      const tokenData = await this.getSolanaTokenData(walletAddress);
      
      // Get comprehensive transaction data
      const transactionData = await this.getSolanaTransactionData(walletAddress);
      
      return {
        blockchain: 'solana',
        nativeBalance: walletData.balance.balance || '0',
        nativeUsdValue: walletData.balance.usdValue || 0,
        tokens: tokenData,
        transactions: transactionData,
        transactionCount: walletData.transactions.length || 0,
        isActive: true
      };
    } catch (error) {
      logger.error('Solana analysis failed:', error);
      throw error;
    }
  }

  // Token data retrieval methods for each blockchain
  private static async getEthereumTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY'];
    if (!etherscanApiKey) return [];
    
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'ethereum');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Ethereum token data:', error);
      return [];
    }
  }

  private static async getBSCTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY'];
    if (!etherscanApiKey) return [];
    
    try {
      // Use Etherscan V2 API with BSC chain ID (56)
      const response = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'bsc');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get BSC token data:', error);
      return [];
    }
  }

  private static async getPolygonTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    const polygonscanApiKey = process.env['POLYGONSCAN_API_KEY'];
    if (!polygonscanApiKey) return [];
    
    try {
      const response = await fetch(`https://api.polygonscan.com/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${polygonscanApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'polygon');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Polygon token data:', error);
      return [];
    }
  }

  private static async getAvalancheTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    const snowtraceApiKey = process.env['SNOWTRACE_API_KEY'];
    if (!snowtraceApiKey) return [];
    
    try {
      const response = await fetch(`https://api.snowtrace.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${snowtraceApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'avalanche');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Avalanche token data:', error);
      return [];
    }
  }

  private static async getArbitrumTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    const arbiscanApiKey = process.env['ARBISCAN_API_KEY'];
    if (!arbiscanApiKey) return [];
    
    try {
      const response = await fetch(`https://api.arbiscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${arbiscanApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'arbitrum');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Arbitrum token data:', error);
      return [];
    }
  }

  private static async getOptimismTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    try {
      const response = await fetch(`https://api-optimistic.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'optimism');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Optimism token data:', error);
      return [];
    }
  }

  private static async getBaseTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    try {
      const response = await fetch(`https://api.basescan.org/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'base');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Base token data:', error);
      return [];
    }
  }

  private static async getLineaTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    try {
      const response = await fetch(`https://api.lineascan.build/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTokenData(data.result, 'linea');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Linea token data:', error);
      return [];
    }
  }

  private static async getSolanaTokenData(walletAddress: string): Promise<DeepAnalysisToken[]> {
    try {
      const response = await fetch(`https://public-api.solscan.io/account/tokens?account=${walletAddress}`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        return data.map((token: any) => ({
          symbol: token.tokenInfo?.symbol || 'UNKNOWN',
          name: token.tokenInfo?.name || 'Unknown Token',
          contractAddress: token.mint || '',
          balance: token.tokenAmount?.uiAmount?.toString() || '0',
          usdValue: 0, // Will be filled by CoinGecko matching
          decimals: token.tokenAmount?.decimals || 0,
          blockchain: 'solana',
          isMatched: false
        }));
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Solana token data:', error);
      return [];
    }
  }

  // Transaction data retrieval methods for each blockchain
  private static async getEthereumTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY'];
    if (!etherscanApiKey) return [];
    
    try {
      const allTransactions: DeepAnalysisTransaction[] = [];
      let page = 1;
      const pageSize = 100; // Maximum allowed by Etherscan
      let hasMoreTransactions = true;
      
      // Fetch all transactions using pagination
      while (hasMoreTransactions) {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`);
        const data = await response.json();
        
        if (data.status === '1' && data.result && data.result.length > 0) {
          const transactions = this.processEtherscanTransactionData(data.result, 'ethereum');
          allTransactions.push(...transactions);
          
          // If we got less than pageSize, we've reached the end
          if (data.result.length < pageSize) {
            hasMoreTransactions = false;
          } else {
            page++;
          }
        } else {
          hasMoreTransactions = false;
        }
        
        // Add a small delay to avoid rate limiting
        if (hasMoreTransactions) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      logger.info(`📊 Retrieved ${allTransactions.length} Ethereum transactions for ${walletAddress}`);
      return allTransactions;
    } catch (error) {
      logger.error('Failed to get Ethereum transaction data:', error);
      return [];
    }
  }

  private static async getBSCTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY'];
    if (!etherscanApiKey) return [];
    
    try {
      const allTransactions: DeepAnalysisTransaction[] = [];
      let page = 1;
      const pageSize = 100; // Maximum allowed by Etherscan
      let hasMoreTransactions = true;
      
      // Fetch all transactions using pagination
      while (hasMoreTransactions) {
        const response = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`);
        const data = await response.json();
        
        if (data.status === '1' && data.result && data.result.length > 0) {
          const transactions = this.processEtherscanTransactionData(data.result, 'bsc');
          allTransactions.push(...transactions);
          
          // If we got less than pageSize, we've reached the end
          if (data.result.length < pageSize) {
            hasMoreTransactions = false;
          } else {
            page++;
          }
        } else {
          hasMoreTransactions = false;
        }
        
        // Add a small delay to avoid rate limiting
        if (hasMoreTransactions) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      logger.info(`📊 Retrieved ${allTransactions.length} BSC transactions for ${walletAddress}`);
      return allTransactions;
    } catch (error) {
      logger.error('Failed to get BSC transaction data:', error);
      return [];
    }
  }

  private static async getPolygonTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    const polygonscanApiKey = process.env['POLYGONSCAN_API_KEY'];
    if (!polygonscanApiKey) return [];
    
    try {
      const response = await fetch(`https://api.polygonscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${polygonscanApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTransactionData(data.result, 'polygon');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Polygon transaction data:', error);
      return [];
    }
  }

  private static async getAvalancheTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    const snowtraceApiKey = process.env['SNOWTRACE_API_KEY'];
    if (!snowtraceApiKey) return [];
    
    try {
      const response = await fetch(`https://api.snowtrace.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${snowtraceApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTransactionData(data.result, 'avalanche');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Avalanche transaction data:', error);
      return [];
    }
  }

  private static async getArbitrumTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    const arbiscanApiKey = process.env['ARBISCAN_API_KEY'];
    if (!arbiscanApiKey) return [];
    
    try {
      const response = await fetch(`https://api.arbiscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${arbiscanApiKey}`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTransactionData(data.result, 'arbitrum');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Arbitrum transaction data:', error);
      return [];
    }
  }

  private static async getOptimismTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    try {
      const response = await fetch(`https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTransactionData(data.result, 'optimism');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Optimism transaction data:', error);
      return [];
    }
  }

  private static async getBaseTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    try {
      const response = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTransactionData(data.result, 'base');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Base transaction data:', error);
      return [];
    }
  }

  private static async getLineaTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    try {
      const response = await fetch(`https://api.lineascan.build/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc`);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return this.processEtherscanTransactionData(data.result, 'linea');
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Linea transaction data:', error);
      return [];
    }
  }

  private static async getBitcoinTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    try {
      const response = await fetch(`https://api.btcscan.org/api/address/${walletAddress}/txs`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        return data.slice(0, 100).map((tx: any) => ({
          hash: tx.txid || '',
          from: tx.vin?.[0]?.prevout?.scriptpubkey_address || '',
          to: tx.vout?.[0]?.scriptpubkey_address || '',
          value: (tx.vout?.[0]?.value / 100000000).toString() || '0', // Convert satoshis to BTC
          timestamp: new Date(tx.status?.block_time * 1000).toISOString(),
          type: 'in', // Simplified for Bitcoin
          blockchain: 'bitcoin'
        }));
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Bitcoin transaction data:', error);
      return [];
    }
  }

  private static async getSolanaTransactionData(walletAddress: string): Promise<DeepAnalysisTransaction[]> {
    try {
      const response = await fetch(`https://public-api.solscan.io/account/transactions?account=${walletAddress}&limit=100`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        return data.map((tx: any) => ({
          hash: tx.txHash || '',
          from: tx.signer?.[0] || '',
          to: tx.parsedInstruction?.[0]?.parsed?.info?.destination || '',
          value: '0', // Solana transactions don't have simple value field
          timestamp: new Date(tx.blockTime * 1000).toISOString(),
          type: 'in', // Simplified for Solana
          blockchain: 'solana'
        }));
      }
      return [];
    } catch (error) {
      logger.error('Failed to get Solana transaction data:', error);
      return [];
    }
  }

  // Helper methods to process API responses
  private static processEtherscanTokenData(tokenTxs: any[], blockchain: string): DeepAnalysisToken[] {
    const tokenMap = new Map<string, any>();
    
    for (const tx of tokenTxs) {
      const key = tx.contractAddress.toLowerCase();
      if (!tokenMap.has(key)) {
        tokenMap.set(key, {
          symbol: tx.tokenSymbol || 'UNKNOWN',
          name: tx.tokenName || 'Unknown Token',
          contractAddress: tx.contractAddress,
          balance: '0',
          usdValue: 0, // Will be filled by CoinGecko matching
          decimals: parseInt(tx.tokenDecimal) || 0,
          blockchain,
          isMatched: false
        });
      }
      
      // Calculate balance from transactions
      const currentBalance = parseFloat(tokenMap.get(key).balance);
      const txValue = parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal));
      
      if (tx.from.toLowerCase() === tx.to.toLowerCase()) {
        // Self-transfer, no balance change
        continue;
      }
      
      if (tx.from.toLowerCase() === '0x0000000000000000000000000000000000000000') {
        // Minting, add to balance
        tokenMap.get(key).balance = (currentBalance + txValue).toString();
      } else if (tx.to.toLowerCase() === '0x0000000000000000000000000000000000000000') {
        // Burning, subtract from balance
        tokenMap.get(key).balance = Math.max(0, currentBalance - txValue).toString();
      } else {
        // Regular transfer
        if (tx.from.toLowerCase() === tx.to.toLowerCase()) {
          // Self-transfer, no change
          continue;
        }
        // This is simplified - in reality you'd need to track all transfers
        // For now, we'll just use the last known balance
      }
    }
    
    return Array.from(tokenMap.values());
  }

  private static processEtherscanTransactionData(txs: any[], blockchain: string): DeepAnalysisTransaction[] {
    return txs.map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (parseInt(tx.value) / Math.pow(10, 18)).toString(), // Convert wei to ETH
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      type: tx.from.toLowerCase() === tx.to.toLowerCase() ? 'in' : 'out',
      blockchain
    }));
  }
}
