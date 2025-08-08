import { ethers } from 'ethers';
import axios from 'axios';
import { BlockchainInfo, Transaction } from '../../types';
import { logger } from '../../utils/logger';
import { config } from '../../utils/config';

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

export class EthereumService {
  private provider: ethers.JsonRpcProvider;
  private etherscanApiKey: string;
  private readonly blockchainInfo: BlockchainInfo = {
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io'
  };

  constructor() {
    const ethereumConfig = config.getEthereumConfig();
    
    // Initialize provider
    if (ethereumConfig.infuraProjectId) {
      this.provider = new ethers.JsonRpcProvider(`${ethereumConfig.rpcUrl}${ethereumConfig.infuraProjectId}`);
      logger.info('Ethereum service initialized with Infura');
    } else {
      // Fallback to public RPC
      this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      logger.warn('Ethereum service initialized with public RPC (no Infura project ID)');
    }
    
    this.etherscanApiKey = ethereumConfig.etherscanApiKey || '';
    
    if (!this.etherscanApiKey) {
      logger.warn('ETHERSCAN_API_KEY not provided, using mock data for transaction history');
    }
  }

  getBlockchainInfo(): BlockchainInfo {
    return this.blockchainInfo;
  }

  validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  async getBalance(address: string): Promise<{
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  }> {
    try {
      logger.debug(`Getting Ethereum balance for ${address}`);
      
      const balance = await this.provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      // Get USD value from price API
      const usdValue = await this.getUsdValue(parseFloat(balanceInEth));
      
      logger.debug(`Ethereum balance for ${address}: ${balanceInEth} ETH ($${usdValue})`);
      
      return {
        balance: balanceInEth,
        usdValue,
        lastUpdated: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get Ethereum balance for ${address}: ${errorMessage}`);
      throw new Error(`Failed to get Ethereum balance: ${errorMessage}`);
    }
  }

  async getAllTokenBalances(address: string): Promise<EnhancedBalance> {
    try {
      logger.debug(`Getting all token balances for ${address}`);
      
      // Get native ETH balance
      const nativeBalance = await this.getBalance(address);
      
      // Get ERC-20 tokens
      const tokens = await this.getERC20Tokens(address);
      
      // Calculate total USD value
      const totalUsdValue = nativeBalance.usdValue + tokens.reduce((sum, token) => sum + token.usdValue, 0);
      
      return {
        native: nativeBalance,
        tokens,
        totalUsdValue
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get all token balances for ${address}: ${errorMessage}`);
      throw new Error(`Failed to get all token balances: ${errorMessage}`);
    }
  }

  async getERC20Tokens(address: string): Promise<TokenBalance[]> {
    try {
      if (!this.etherscanApiKey) {
        logger.warn('Etherscan API key not provided, using mock token data');
        return this.getMockTokenBalances(address);
      }

      logger.debug(`Getting ERC-20 tokens for ${address}`);

      // Get token transfers to find all tokens the address has interacted with
      const response = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: this.etherscanApiKey
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
            const balance = await this.getTokenBalance(address, contractAddress, tokenInfo);
            if (parseFloat(balance.balance) > 0) {
              tokenBalances.push(balance);
            }
          } catch (error) {
            logger.warn(`Failed to get balance for token ${tokenInfo.tokenSymbol}: ${error}`);
          }
        }

        logger.debug(`Found ${tokenBalances.length} tokens with non-zero balance`);
        return tokenBalances;
      } else {
        logger.warn('Failed to get token transfers from Etherscan, using mock data');
        return this.getMockTokenBalances(address);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get ERC-20 tokens for ${address}: ${errorMessage}`);
      return this.getMockTokenBalances(address);
    }
  }

  async getTokenBalance(address: string, contractAddress: string, tokenInfo: any): Promise<TokenBalance> {
    try {
      // ERC-20 balanceOf function
      const balanceOfAbi = ['function balanceOf(address owner) view returns (uint256)'];
      const tokenContract = new ethers.Contract(contractAddress, balanceOfAbi, this.provider);
      
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(balance, tokenInfo.decimals);
      
      // Get USD value (this would need a price API for each token)
      const usdValue = await this.getTokenUsdValue(contractAddress, parseFloat(formattedBalance));
      
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
        // For incoming: tx.to should match the wallet address
        // For outgoing: tx.from should match the wallet address
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

  async getTransactionHistory(address: string, limit: number = 100): Promise<Transaction[]> {
    try {
      if (!this.etherscanApiKey) {
        logger.warn('Etherscan API key not provided, using mock data');
        return this.getMockTransactions(address, limit);
      }

      logger.debug(`Getting Ethereum transaction history for ${address} (limit: ${limit})`);

      const response = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: this.etherscanApiKey
        },
        timeout: 10000 // 10 second timeout
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
            currency: 'ETH'
          }));
        
        logger.debug(`Retrieved ${transactions.length} transactions for ${address}`);
        return transactions;
      } else {
        logger.warn('Failed to get transactions from Etherscan, using mock data');
        return this.getMockTransactions(address, limit);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get transaction history for ${address}: ${errorMessage}`);
      return this.getMockTransactions(address, limit);
    }
  }

  async getWalletData(address: string): Promise<{
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
        this.getBalance(address),
        this.getAllTokenBalances(address),
        this.getTransactionHistory(address, 1000) // Get more transactions for analysis
      ]);

      const transactionAnalysis = await this.analyzeTransactionValues(transactions, address);

      return {
        balance,
        enhancedBalance,
        transactions,
        transactionAnalysis,
        blockchainInfo: this.blockchainInfo
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get wallet data for ${address}: ${errorMessage}`);
      throw new Error(`Failed to get wallet data: ${errorMessage}`);
    }
  }

  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getFeeData();
      return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get gas price: ${errorMessage}`);
      return '0';
    }
  }

  async getBlockInfo(blockNumber: number): Promise<{
    timestamp: Date;
    transactions: number;
    gasUsed: string;
  }> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      if (!block) {
        throw new Error('Block not found');
      }
      
      return {
        timestamp: new Date(block.timestamp * 1000),
        transactions: block.transactions.length,
        gasUsed: block.gasUsed.toString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get block info: ${errorMessage}`);
      throw new Error(`Failed to get block info: ${errorMessage}`);
    }
  }

  private determineTransactionType(tx: any): 'transfer' | 'contract' | 'token' | 'other' {
    if (tx.input === '0x' || tx.input === '') {
      return 'transfer';
    } else if (tx.input.startsWith('0xa9059cbb')) {
      return 'token';
    } else {
      return 'contract';
    }
  }

  private async getUsdValue(ethAmount: number): Promise<number> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'ethereum',
          vs_currencies: 'usd'
        },
        timeout: 5000
      });
      
      const ethPrice = response.data.ethereum.usd;
      return ethAmount * ethPrice;
    } catch (error) {
      logger.warn('Failed to get ETH price, using fallback value');
      return ethAmount * 2000; // Fallback price
    }
  }

  private async getTokenUsdValue(contractAddress: string, tokenAmount: number): Promise<number> {
    try {
      // This would need a more sophisticated price API for individual tokens
      // For now, using a simple fallback
      return tokenAmount * 1; // Fallback: assume $1 per token
    } catch (error) {
      logger.warn(`Failed to get token price for ${contractAddress}, using fallback value`);
      return tokenAmount * 1;
    }
  }

  private getMockTokenBalances(address: string): TokenBalance[] {
    return [
      {
        contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        tokenName: 'Tether USD',
        tokenSymbol: 'USDT',
        decimals: 6,
        balance: '1000.0',
        usdValue: 1000.0,
        lastUpdated: new Date()
      },
      {
        contractAddress: '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c',
        tokenName: 'USD Coin',
        tokenSymbol: 'USDC',
        decimals: 6,
        balance: '500.0',
        usdValue: 500.0,
        lastUpdated: new Date()
      }
    ];
  }

  private getMockTransactions(address: string, limit: number): Transaction[] {
    const mockTransactions: Transaction[] = [];
    
    for (let i = 0; i < Math.min(limit, 10); i++) {
      mockTransactions.push({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: i % 2 === 0 ? address : `0x${Math.random().toString(16).substr(2, 40)}`,
        to: i % 2 === 0 ? `0x${Math.random().toString(16).substr(2, 40)}` : address,
        value: (Math.random() * 10).toFixed(6),
        timestamp: new Date(Date.now() - i * 86400000), // Each transaction 1 day apart
        blockNumber: 18000000 + i,
        gasUsed: '21000',
        gasPrice: '20000000000',
        status: 'success',
        type: 'transfer',
        currency: 'ETH'
      });
    }
    
    return mockTransactions;
  }
} 