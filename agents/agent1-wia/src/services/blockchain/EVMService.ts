import { ethers } from 'ethers';
import axios from 'axios';
import { BlockchainInfo, Transaction } from '../../types';
import { logger } from '../../utils/logger';
import { config } from '../../utils/config';
import { PriceService } from '../PriceService';

// ERC-20 Token Interface
interface TokenBalance {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  balance: string;
  usdValue: number;
  lastUpdated: Date;
}

// Enhanced balance interface
interface EnhancedBalance {
  native: {
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  };
  tokens: TokenBalance[];
  totalUsdValue: number;
}

// Transaction value analysis
interface TransactionValueAnalysis {
  totalIncoming: number;
  totalOutgoing: number;
  netFlow: number;
  largestTransaction: number;
  averageTransaction: number;
  transactionCount: number;
  lifetimeVolume: number;
}

// Wallet opinion and risk assessment
interface WalletOpinion {
  type: 'whale' | 'active_trader' | 'hodler' | 'new_user' | 'inactive' | 'unknown';
  activityLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  estimatedValue: number;
  confidence: 'high' | 'medium' | 'low';
  riskScore: number; // 0-100, where 0 is low risk, 100 is high risk
  riskFactors: string[];
}

// Fund flow tracking
interface FundFlow {
  date: string;
  incoming: number;
  outgoing: number;
  netFlow: number;
  transactionCount: number;
}

// Comprehensive wallet investigation
interface WalletInvestigation {
  address: string;
  blockchain: string;
  balance: {
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  };
  enhancedBalance: EnhancedBalance;
  transactionAnalysis: TransactionValueAnalysis;
  recentTransactions: Transaction[];
  walletOpinion: WalletOpinion;
  fundFlows: FundFlow[];
  riskAssessment: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
  blockchainInfo: BlockchainInfo;
  investigationTimestamp: Date;
}

// EVM Chain Configuration
interface EVMChainConfig {
  name: string;
  symbol: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  etherscanBaseUrl: string;
  etherscanApiKey: string;
  decimals: number;
}

export class EVMService {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();
  private chainConfigs: Map<string, EVMChainConfig> = new Map();
  private priceService: PriceService;

  constructor() {
    this.priceService = PriceService.getInstance();
    this.initializeChains();
  }

  private initializeChains(): void {
    // Ethereum
    const ethereumConfig = config.getEthereumConfig();
    this.chainConfigs.set('ethereum', {
      name: 'Ethereum',
      symbol: 'ETH',
      chainId: 1,
      rpcUrl: ethereumConfig.rpcUrl || 'https://mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://etherscan.io',
      etherscanBaseUrl: 'https://api.etherscan.io/api',
      etherscanApiKey: ethereumConfig.etherscanApiKey || '',
      decimals: 18
    });

    // Polygon
    const polygonConfig = config.getPolygonConfig();
    this.chainConfigs.set('polygon', {
      name: 'Polygon',
      symbol: 'MATIC',
      chainId: 137,
      rpcUrl: polygonConfig.rpcUrl || 'https://polygon-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://polygonscan.com',
      etherscanBaseUrl: 'https://api.etherscan.io/v2/api',
      etherscanApiKey: polygonConfig.polygonscanApiKey || '',
      decimals: 18
    });

    // Binance Smart Chain
    const binanceConfig = config.getBinanceConfig();
    this.chainConfigs.set('binance', {
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      chainId: 56,
      rpcUrl: binanceConfig.rpcUrl || 'https://bsc-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://bscscan.com',
      etherscanBaseUrl: 'https://api.etherscan.io/v2/api',
      etherscanApiKey: binanceConfig.bscscanApiKey || '',
      decimals: 18
    });

    // Avalanche
    const avalancheConfig = config.getAvalancheConfig();
    this.chainConfigs.set('avalanche', {
      name: 'Avalanche',
      symbol: 'AVAX',
      chainId: 43114,
      rpcUrl: avalancheConfig.rpcUrl || 'https://avalanche-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://snowtrace.io',
      etherscanBaseUrl: 'https://api.snowtrace.io/api',
      etherscanApiKey: avalancheConfig.snowtraceApiKey || '',
      decimals: 18
    });

    // Arbitrum One
    const arbitrumConfig = config.getArbitrumConfig();
    this.chainConfigs.set('arbitrum', {
      name: 'Arbitrum One',
      symbol: 'ARB',
      chainId: 42161,
      rpcUrl: arbitrumConfig.rpcUrl || 'https://arbitrum-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://arbiscan.io',
      etherscanBaseUrl: 'https://api.arbiscan.io/api',
      etherscanApiKey: ethereumConfig.etherscanApiKey || '', // Arbitrum uses Etherscan API
      decimals: 18
    });

    // Optimism
    const optimismConfig = config.getOptimismConfig();
    this.chainConfigs.set('optimism', {
      name: 'Optimism',
      symbol: 'OP',
      chainId: 10,
      rpcUrl: optimismConfig.rpcUrl || 'https://optimism-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://optimistic.etherscan.io',
      etherscanBaseUrl: 'https://api-optimistic.etherscan.io/api',
      etherscanApiKey: ethereumConfig.etherscanApiKey || '', // Optimism uses Etherscan API
      decimals: 18
    });

    // Base
    const baseConfig = config.getBaseConfig();
    this.chainConfigs.set('base', {
      name: 'Base',
      symbol: 'ETH',
      chainId: 8453,
      rpcUrl: baseConfig.rpcUrl || 'https://base-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://basescan.org',
      etherscanBaseUrl: 'https://api.basescan.org/api',
      etherscanApiKey: ethereumConfig.etherscanApiKey || '', // Base uses Etherscan API
      decimals: 18
    });

    // Linea
    const lineaConfig = config.getLineaConfig();
    this.chainConfigs.set('linea', {
      name: 'Linea',
      symbol: 'ETH',
      chainId: 59144,
      rpcUrl: lineaConfig.rpcUrl || 'https://linea-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39',
      explorerUrl: 'https://lineascan.build',
      etherscanBaseUrl: 'https://api.lineascan.build/api',
      etherscanApiKey: ethereumConfig.etherscanApiKey || '', // Linea uses Etherscan API
      decimals: 18
    });

    // Initialize providers
    for (const [chain, config] of this.chainConfigs) {
      this.providers.set(chain, new ethers.JsonRpcProvider(config.rpcUrl));
      logger.info(`${config.name} service initialized`);
    }
  }

  getBlockchainInfo(chain: string): BlockchainInfo {
    const chainConfig = this.chainConfigs.get(chain);
    if (!chainConfig) {
      throw new Error(`Unsupported EVM chain: ${chain}`);
    }

    return {
      name: chainConfig.name,
      symbol: chainConfig.symbol,
      chainId: chainConfig.chainId,
      rpcUrl: chainConfig.rpcUrl,
      explorerUrl: chainConfig.explorerUrl
    };
  }

  validateAddress(address: string, chain: string): boolean {
    return ethers.isAddress(address);
  }

  async getBalance(address: string, chain: string): Promise<{
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  }> {
    try {
      const chainConfig = this.chainConfigs.get(chain);
      const provider = this.providers.get(chain);
      
      if (!chainConfig || !provider) {
        throw new Error(`Unsupported EVM chain: ${chain}`);
      }

      logger.debug(`Getting ${chainConfig.name} balance for ${address} via ${chainConfig.rpcUrl}`);
      
      // Test RPC connection first
      try {
        const blockNumber = await provider.getBlockNumber();
        logger.debug(`RPC connection successful - Latest block: ${blockNumber}`);
      } catch (rpcError) {
        logger.error(`RPC connection failed for ${chain}: ${rpcError instanceof Error ? rpcError.message : 'Unknown RPC error'}`);
        throw new Error(`RPC connection failed: ${rpcError instanceof Error ? rpcError.message : 'Unknown RPC error'}`);
      }
      
      const balance = await provider.getBalance(address);
      const balanceInUnits = ethers.formatEther(balance);
      
      // Get USD value from price service
      const usdValue = await this.priceService.getTokenPrice(chainConfig.symbol, chain);
      
      logger.debug(`${chainConfig.name} balance for ${address}: ${balanceInUnits} ${chainConfig.symbol} ($${usdValue})`);
      
      return {
        balance: balanceInUnits,
        usdValue,
        lastUpdated: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get ${chain} balance for ${address}: ${errorMessage}`);
      
      // Don't use mock data for RPC failures - throw the error instead
      throw new Error(`Failed to get ${chain} balance: ${errorMessage}`);
    }
  }

  async getAllTokenBalances(address: string, chain: string): Promise<EnhancedBalance> {
    try {
      logger.debug(`Getting all token balances for ${address} on ${chain}`);
      
      // Get native balance
      const nativeBalance = await this.getBalance(address, chain);
      
      // Get ERC-20 tokens
      const tokens = await this.getERC20Tokens(address, chain);
      
      // Calculate total USD value
      const totalUsdValue = nativeBalance.usdValue + tokens.reduce((sum, token) => sum + token.usdValue, 0);
      
      return {
        native: nativeBalance,
        tokens,
        totalUsdValue
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get all token balances for ${address} on ${chain}: ${errorMessage}`);
      throw new Error(`Failed to get all token balances: ${errorMessage}`);
    }
  }

  async getERC20Tokens(address: string, chain: string): Promise<TokenBalance[]> {
    try {
      const chainConfig = this.chainConfigs.get(chain);
      
      if (!chainConfig) {
        throw new Error(`Unsupported EVM chain: ${chain}`);
      }

      if (!chainConfig.etherscanApiKey) {
        logger.warn(`${chainConfig.name} API key not provided, cannot get token balances`);
        return [];
      }

      logger.debug(`Getting ERC-20 tokens for ${address} on ${chainConfig.name}`);

      // Get token transfers to find all tokens the address has interacted with
      const response = await axios.get(chainConfig.etherscanBaseUrl, {
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: chainConfig.etherscanApiKey,
          ...(chain !== 'ethereum' && { chainId: chainConfig.chainId })
        },
        timeout: 15000
      });

      if (response.data.status === '1') {
        const tokenTransfers = response.data.result;
        const uniqueTokens = new Map<string, any>();
        
        // Group by token contract address
        tokenTransfers.forEach((tx: any) => {
          if (!uniqueTokens.has(tx.contractAddress)) {
            uniqueTokens.set(tx.contractAddress, {
              contractAddress: tx.contractAddress,
              tokenName: tx.tokenName,
              tokenSymbol: tx.tokenSymbol,
              decimals: parseInt(tx.tokenDecimal),
              transfers: []
            });
          }
          uniqueTokens.get(tx.contractAddress).transfers.push(tx);
        });

        // Calculate current balance for each token
        const tokenBalances: TokenBalance[] = [];
        
        for (const [contractAddress, tokenInfo] of uniqueTokens) {
          try {
            const balance = await this.getTokenBalance(address, contractAddress, tokenInfo, chain);
            if (parseFloat(balance.balance) > 0) {
              tokenBalances.push(balance);
            }
          } catch (error) {
            logger.warn(`Failed to get balance for token ${tokenInfo.tokenSymbol}: ${error}`);
          }
        }

        logger.debug(`Found ${tokenBalances.length} tokens with non-zero balance on ${chainConfig.name}`);
        return tokenBalances;
      } else {
        logger.warn(`Failed to get token transfers from ${chainConfig.name} API, returning empty array`);
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get ERC-20 tokens for ${address} on ${chain}: ${errorMessage}`);
      return [];
    }
  }

  async getTokenBalance(address: string, contractAddress: string, tokenInfo: any, chain: string): Promise<TokenBalance> {
    try {
      const provider = this.providers.get(chain);
      if (!provider) {
        throw new Error(`Provider not found for chain: ${chain}`);
      }

      // ERC-20 balanceOf function
      const balanceOfAbi = ['function balanceOf(address owner) view returns (uint256)'];
      const tokenContract = new ethers.Contract(contractAddress, balanceOfAbi, provider);
      
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(balance, tokenInfo.decimals);
      
      // Get USD value from price service
      const usdValue = await this.priceService.getTokenPrice(tokenInfo.tokenSymbol, chain);
      
      return {
        contractAddress,
        tokenName: tokenInfo.tokenName,
        tokenSymbol: tokenInfo.tokenSymbol,
        decimals: tokenInfo.decimals,
        balance: formattedBalance,
        usdValue,
        lastUpdated: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get token balance: ${errorMessage}`);
    }
  }

  async getTransactionHistory(address: string, chain: string, limit: number = 1000): Promise<Transaction[]> {
    try {
      const chainConfig = this.chainConfigs.get(chain);
      const provider = this.providers.get(chain);
      
      if (!chainConfig || !provider) {
        throw new Error(`Unsupported EVM chain: ${chain}`);
      }

      if (!chainConfig.etherscanApiKey) {
        logger.warn(`${chainConfig.name} API key not provided, cannot get transaction history`);
        return [];
      }

      logger.debug(`Getting ${chainConfig.name} transaction history for ${address} (limit: ${limit})`);

      const response = await axios.get(chainConfig.etherscanBaseUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: chainConfig.etherscanApiKey,
          ...(chain !== 'ethereum' && { chainId: chainConfig.chainId })
        },
        timeout: 15000
      });

      if (response.data.status === '1') {
        const transactions: Transaction[] = response.data.result
          .slice(0, limit)
          .map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: ethers.formatEther(tx.value),
            timestamp: new Date(parseInt(tx.timeStamp) * 1000),
            blockNumber: parseInt(tx.blockNumber),
            gasUsed: tx.gasUsed,
            gasPrice: tx.gasPrice,
            status: tx.isError === '0' ? 'success' : 'failed',
            type: this.determineTransactionType(tx),
            currency: chainConfig.symbol
          }));
        
        logger.debug(`Retrieved ${transactions.length} transactions for ${address} on ${chainConfig.name}`);
        return transactions;
      } else {
        logger.warn(`Failed to get transactions from ${chainConfig.name} API, will try RPC fallback`);
        // Continue to RPC fallback below
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get transaction history for ${address} on ${chain}: ${errorMessage}`);
      
      // Try to get recent transactions via RPC as fallback
      try {
        logger.debug(`Attempting RPC fallback for transaction history on ${chain}`);
        const provider = this.providers.get(chain);
        const chainConfig = this.chainConfigs.get(chain);
        if (provider && chainConfig) {
          const latestBlock = await provider.getBlockNumber();
          const transactions: Transaction[] = [];
          
          // Get transactions from recent blocks (last 100 blocks)
          const startBlock = Math.max(0, latestBlock - 100);
          for (let blockNum = latestBlock; blockNum >= startBlock && transactions.length < limit; blockNum--) {
            try {
              const block = await provider.getBlock(blockNum, true);
              if (block && block.transactions) {
                for (const tx of block.transactions) {
                  if (transactions.length >= limit) break;
                  
                  // Handle both string and transaction object types
                  if (typeof tx === 'string') {
                    // If tx is just a hash, skip it
                    continue;
                  }
                  
                  // Type assertion for transaction object
                  const txObj = tx as any;
                  
                  // Check if transaction involves our address
                  if (txObj.from?.toLowerCase() === address.toLowerCase() || txObj.to?.toLowerCase() === address.toLowerCase()) {
                    transactions.push({
                      hash: txObj.hash,
                      from: txObj.from || '',
                      to: txObj.to || '',
                      value: ethers.formatEther(txObj.value || 0),
                      timestamp: new Date((block.timestamp || 0) * 1000),
                      blockNumber: blockNum,
                      gasUsed: txObj.gasLimit?.toString() || '0',
                      gasPrice: txObj.gasPrice?.toString() || '0',
                      status: 'success',
                      type: this.determineTransactionType(txObj),
                      currency: chainConfig?.symbol || 'ETH'
                    });
                  }
                }
              }
            } catch (blockError) {
              logger.debug(`Failed to get block ${blockNum}: ${blockError instanceof Error ? blockError.message : 'Unknown error'}`);
              continue;
            }
          }
          
          if (transactions.length > 0) {
            logger.debug(`RPC fallback successful: Retrieved ${transactions.length} transactions for ${address} on ${chain}`);
            return transactions;
          }
        }
      } catch (rpcError) {
        logger.debug(`RPC fallback also failed: ${rpcError instanceof Error ? rpcError.message : 'Unknown error'}`);
      }
      
      // If all else fails, return empty array instead of mock data
      logger.warn(`No transaction data available for ${address} on ${chain}, returning empty array`);
      return [];
    }
  }

  async analyzeTransactionValues(transactions: Transaction[], walletAddress: string): Promise<TransactionValueAnalysis> {
    try {
      logger.debug(`Analyzing transaction values for ${transactions.length} transactions for wallet ${walletAddress}`);
      
      let totalIncoming = 0;
      let totalOutgoing = 0;
      let largestTransaction = 0;
      const values: number[] = [];
      
      for (const tx of transactions) {
        const value = parseFloat(tx.value) || 0;
        values.push(value);
        
        // Determine if transaction is incoming or outgoing based on from/to addresses
        const isIncoming = tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase();
        const isOutgoing = tx.from && tx.from.toLowerCase() === walletAddress.toLowerCase();
        
        if (isIncoming) {
          totalIncoming += value;
        } else if (isOutgoing) {
          totalOutgoing += value;
        }
        
        if (value > largestTransaction) {
          largestTransaction = value;
        }
      }
      
      const netFlow = totalIncoming - totalOutgoing;
      const averageTransaction = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      const lifetimeVolume = totalIncoming + totalOutgoing;
      
      return {
        totalIncoming,
        totalOutgoing,
        netFlow,
        largestTransaction,
        averageTransaction,
        transactionCount: transactions.length,
        lifetimeVolume
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to analyze transaction values: ${errorMessage}`);
      throw new Error(`Failed to analyze transaction values: ${errorMessage}`);
    }
  }

  async generateWalletOpinion(
    address: string, 
    enhancedBalance: EnhancedBalance, 
    transactionAnalysis: TransactionValueAnalysis,
    transactions: Transaction[]
  ): Promise<WalletOpinion> {
    try {
      const totalValue = enhancedBalance.totalUsdValue;
      const transactionCount = transactionAnalysis.transactionCount;
      const lifetimeVolume = transactionAnalysis.lifetimeVolume;
      const averageTransaction = transactionAnalysis.averageTransaction;
      
      // Determine wallet type
      let type: WalletOpinion['type'] = 'unknown';
      if (totalValue > 1000000) {
        type = 'whale';
      } else if (transactionCount > 100 && averageTransaction > 1000) {
        type = 'active_trader';
      } else if (transactionCount < 10 && totalValue > 1000) {
        type = 'hodler';
      } else if (transactionCount < 5) {
        type = 'new_user';
      } else if (transactionCount === 0) {
        type = 'inactive';
      } else {
        type = 'active_trader';
      }

      // Determine activity level
      let activityLevel: WalletOpinion['activityLevel'] = 'low';
      if (transactionCount > 500) {
        activityLevel = 'very_high';
      } else if (transactionCount > 100) {
        activityLevel = 'high';
      } else if (transactionCount > 20) {
        activityLevel = 'medium';
      } else if (transactionCount > 5) {
        activityLevel = 'low';
      } else {
        activityLevel = 'very_low';
      }

      // Calculate confidence based on data quality
      let confidence: WalletOpinion['confidence'] = 'medium';
      if (transactionCount > 50 && totalValue > 10000) {
        confidence = 'high';
      } else if (transactionCount < 5) {
        confidence = 'low';
      }

      // Calculate risk score
      const riskScore = this.calculateRiskScore(enhancedBalance, transactionAnalysis, transactions);

      return {
        type,
        activityLevel,
        estimatedValue: totalValue,
        confidence,
        riskScore,
        riskFactors: this.getRiskFactors(enhancedBalance, transactionAnalysis, transactions)
      };
    } catch (error) {
      logger.error(`Failed to generate wallet opinion: ${error}`);
      return {
        type: 'unknown',
        activityLevel: 'low',
        estimatedValue: 0,
        confidence: 'low',
        riskScore: 50,
        riskFactors: ['Unable to analyze wallet']
      };
    }
  }

  private calculateRiskScore(
    enhancedBalance: EnhancedBalance, 
    transactionAnalysis: TransactionValueAnalysis,
    transactions: Transaction[]
  ): number {
    let riskScore = 0;
    
    // High volume transactions increase risk
    if (transactionAnalysis.largestTransaction > 100000) riskScore += 20;
    if (transactionAnalysis.averageTransaction > 10000) riskScore += 15;
    
    // High frequency trading increases risk
    if (transactionAnalysis.transactionCount > 1000) riskScore += 25;
    if (transactionAnalysis.transactionCount > 100) riskScore += 15;
    
    // Large net flow might indicate suspicious activity
    if (Math.abs(transactionAnalysis.netFlow) > 50000) riskScore += 20;
    
    // Many different tokens might indicate complex activity
    if (enhancedBalance.tokens.length > 20) riskScore += 10;
    
    // Very high total value increases risk
    if (enhancedBalance.totalUsdValue > 1000000) riskScore += 15;
    
    return Math.min(riskScore, 100);
  }

  private getRiskFactors(
    enhancedBalance: EnhancedBalance, 
    transactionAnalysis: TransactionValueAnalysis,
    transactions: Transaction[]
  ): string[] {
    const factors: string[] = [];
    
    if (transactionAnalysis.largestTransaction > 100000) {
      factors.push('High value transactions detected');
    }
    
    if (transactionAnalysis.transactionCount > 1000) {
      factors.push('Very high transaction frequency');
    }
    
    if (Math.abs(transactionAnalysis.netFlow) > 50000) {
      factors.push('Large net fund flow detected');
    }
    
    if (enhancedBalance.tokens.length > 20) {
      factors.push('Complex token portfolio');
    }
    
    if (enhancedBalance.totalUsdValue > 1000000) {
      factors.push('High total portfolio value');
    }
    
    return factors;
  }

  async generateFundFlows(transactions: Transaction[], walletAddress: string): Promise<FundFlow[]> {
    try {
      const fundFlows: FundFlow[] = [];
      const now = new Date();
      
      // Generate fund flows for the last 5 days
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        // Filter transactions for this date
        const dayTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.timestamp);
          return txDate.toISOString().split('T')[0] === dateStr;
        });
        
        let incoming = 0;
        let outgoing = 0;
        
        for (const tx of dayTransactions) {
          const value = parseFloat(tx.value) || 0;
          const isIncoming = tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase();
          const isOutgoing = tx.from && tx.from.toLowerCase() === walletAddress.toLowerCase();
          
          if (isIncoming) {
            incoming += value;
          } else if (isOutgoing) {
            outgoing += value;
          }
        }
        
        fundFlows.push({
          date: dateStr,
          incoming,
          outgoing,
          netFlow: incoming - outgoing,
          transactionCount: dayTransactions.length
        });
      }
      
      return fundFlows;
    } catch (error) {
      logger.error(`Failed to generate fund flows: ${error}`);
      return [];
    }
  }

  async investigateWallet(address: string, chain: string): Promise<WalletInvestigation> {
    try {
      logger.info(`Starting comprehensive wallet investigation for ${address} on ${chain}`);
      
      // Get all data in parallel
      const [balance, enhancedBalance, transactions] = await Promise.all([
        this.getBalance(address, chain),
        this.getAllTokenBalances(address, chain),
        this.getTransactionHistory(address, chain, 1000) // Get more transactions for analysis
      ]);

      // Analyze transactions
      const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);
      
      // Get recent transactions (last 10)
      const recentTransactions = transactions.slice(0, 10);
      
      // Generate wallet opinion
      const walletOpinion = await this.generateWalletOpinion(address, enhancedBalance, transactionAnalysis, transactions);
      
      // Generate fund flows
      const fundFlows = await this.generateFundFlows(transactions, address);
      
      // Generate risk assessment
      const riskAssessment = {
        score: walletOpinion.riskScore,
        factors: walletOpinion.riskFactors,
        recommendations: this.generateRiskRecommendations(walletOpinion, transactionAnalysis)
      };

      const investigation: WalletInvestigation = {
        address,
        blockchain: chain,
        balance,
        enhancedBalance,
        transactionAnalysis,
        recentTransactions,
        walletOpinion,
        fundFlows,
        riskAssessment,
        blockchainInfo: this.getBlockchainInfo(chain),
        investigationTimestamp: new Date()
      };

      logger.info(`Wallet investigation completed for ${address}`);
      return investigation;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to investigate wallet ${address} on ${chain}: ${errorMessage}`);
      throw new Error(`Failed to investigate wallet: ${errorMessage}`);
    }
  }

  private generateRiskRecommendations(walletOpinion: WalletOpinion, transactionAnalysis: TransactionValueAnalysis): string[] {
    const recommendations: string[] = [];
    
    if (walletOpinion.riskScore > 70) {
      recommendations.push('High risk wallet - exercise extreme caution');
    } else if (walletOpinion.riskScore > 50) {
      recommendations.push('Moderate risk wallet - proceed with caution');
    } else {
      recommendations.push('Low risk wallet - appears safe for interaction');
    }
    
    if (transactionAnalysis.largestTransaction > 100000) {
      recommendations.push('Monitor for large transaction patterns');
    }
    
    if (transactionAnalysis.transactionCount > 1000) {
      recommendations.push('High frequency trading detected - monitor for suspicious patterns');
    }
    
    if (Math.abs(transactionAnalysis.netFlow) > 50000) {
      recommendations.push('Large net fund flow detected - verify source of funds');
    }
    
    return recommendations;
  }

  async getWalletData(address: string, chain: string): Promise<{
    balance: {
      balance: string;
      usdValue: number;
      lastUpdated: Date;
    };
    enhancedBalance: EnhancedBalance;
    transactions: Transaction[];
    transactionAnalysis: TransactionValueAnalysis;
    blockchainInfo: BlockchainInfo;
  }> {
    try {
      const [balance, enhancedBalance, transactions] = await Promise.all([
        this.getBalance(address, chain),
        this.getAllTokenBalances(address, chain),
        this.getTransactionHistory(address, chain, 1000) // Get more transactions for analysis
      ]);

      const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);

      return {
        balance,
        enhancedBalance,
        transactions,
        transactionAnalysis,
        blockchainInfo: this.getBlockchainInfo(chain)
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get wallet data for ${address} on ${chain}: ${errorMessage}`);
      throw new Error(`Failed to get wallet data: ${errorMessage}`);
    }
  }

  private determineTransactionType(tx: any): 'transfer' | 'contract' | 'token' | 'other' {
    if (tx.input === '0x' || tx.input === '') {
      return 'transfer';
    } else if (tx.input && tx.input.length > 10) {
      return 'contract';
    } else {
      return 'other';
    }
  }

  // Note: Mock data methods removed - now using real RPC calls and Etherscan API
} 