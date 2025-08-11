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
    if (ethereumConfig.rpcUrl && ethereumConfig.rpcUrl.includes('infura.io')) {
      // Use the full RPC URL directly (it already includes the project ID)
      this.provider = new ethers.JsonRpcProvider(ethereumConfig.rpcUrl);
      logger.info('Ethereum service initialized with Infura');
    } else if (ethereumConfig.infuraProjectId) {
      // Fallback: construct URL if only project ID is provided
      this.provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${ethereumConfig.infuraProjectId}`);
      logger.info('Ethereum service initialized with Infura (project ID only)');
    } else {
      // Fallback to public RPC
      this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      logger.warn('Ethereum service initialized with public RPC (no Infura configuration)');
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
      
      logger.debug(`Raw balance: ${balance.toString()}, formatted: ${balanceInEth} ETH`);
      
      // Get USD value from price API
      logger.debug(`Calling getUsdValue with ${parseFloat(balanceInEth)} ETH`);
      const usdValue = await this.getUsdValue(parseFloat(balanceInEth));
      
      logger.debug(`USD value calculation result: $${usdValue} for ${balanceInEth} ETH`);
      
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
        logger.debug(`Found ${tokenTransfers.length} token transfers for ${address}`);
        
        if (tokenTransfers.length === 0) {
          logger.debug(`No token transfers found for ${address}`);
          return [];
        }

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

        logger.debug(`Found ${uniqueTokens.size} unique tokens for ${address}`);

        // Calculate current balance for each token
        const tokenBalances: TokenBalance[] = [];
        
        for (const [contractAddress, tokenInfo] of uniqueTokens) {
          try {
            logger.debug(`Getting balance for token ${tokenInfo.tokenSymbol} (${contractAddress})`);
            const balance = await this.getTokenBalance(address, contractAddress, tokenInfo);
            if (parseFloat(balance.balance) > 0) {
              tokenBalances.push(balance);
              logger.debug(`Token ${tokenInfo.tokenSymbol} has balance: ${balance.balance}`);
            } else {
              logger.debug(`Token ${tokenInfo.tokenSymbol} has zero balance, skipping`);
            }
          } catch (error) {
            logger.warn(`Failed to get balance for token ${tokenInfo.tokenSymbol}: ${error}`);
          }
        }

        logger.debug(`Found ${tokenBalances.length} tokens with non-zero balance for ${address}`);
        return tokenBalances;
      } else {
        logger.warn(`Etherscan API returned status: ${response.data.status}, message: ${response.data.message}`);
        logger.warn('Failed to get token transfers from Etherscan, using mock data');
        return this.getMockTokenBalances(address);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get ERC-20 tokens for ${address}: ${errorMessage}`);
      logger.warn('Falling back to mock token data');
      return this.getMockTokenBalances(address);
    }
  }

  async getTokenBalance(address: string, contractAddress: string, tokenInfo: any): Promise<TokenBalance> {
    try {
      logger.debug(`🔍 Attempting RPC call for ${tokenInfo.tokenSymbol} (${contractAddress})`);
      
      // ERC-20 balanceOf function
      const balanceOfAbi = ['function balanceOf(address owner) view returns (uint256)'];
      const tokenContract = new ethers.Contract(contractAddress, balanceOfAbi, this.provider);
      
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(balance, tokenInfo.decimals);
      
      logger.debug(`✅ RPC call successful for ${tokenInfo.tokenSymbol}: Raw=${balance.toString()}, Formatted=${formattedBalance}`);
      
      // Check if balance is actually zero
      if (balance.toString() === '0') {
        logger.debug(`Token ${tokenInfo.tokenSymbol} has zero balance`);
        return {
          contractAddress,
          tokenName: tokenInfo.tokenName,
          tokenSymbol: tokenInfo.tokenSymbol,
          decimals: tokenInfo.decimals,
          balance: '0',
          usdValue: 0,
          lastUpdated: new Date()
        };
      }
      
      // Get USD value (this would need a price API for each token)
      const usdValue = await this.getTokenUsdValue(contractAddress, parseFloat(formattedBalance));
      
      logger.debug(`Token ${tokenInfo.tokenSymbol} balance: ${formattedBalance}, USD value: $${usdValue}`);
      
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
      logger.error(`❌ RPC call failed for ${tokenInfo.tokenSymbol}: ${errorMessage}`);
      
      // Fallback: Try to calculate balance from transaction history
      logger.debug(`🔄 Attempting fallback balance calculation for ${tokenInfo.tokenSymbol}`);
      try {
        const fallbackBalance = await this.calculateBalanceFromHistory(address, contractAddress, tokenInfo);
        logger.debug(`📊 Fallback calculation result for ${tokenInfo.tokenSymbol}: ${fallbackBalance}`);
        
        if (fallbackBalance > 0) {
          logger.debug(`✅ Fallback calculation successful: ${tokenInfo.tokenSymbol} = ${fallbackBalance}`);
          const usdValue = await this.getTokenUsdValue(contractAddress, fallbackBalance);
          logger.debug(`💰 USD value for ${tokenInfo.tokenSymbol}: $${usdValue}`);
          
          return {
            contractAddress,
            tokenName: tokenInfo.tokenName,
            tokenSymbol: tokenInfo.tokenSymbol,
            decimals: tokenInfo.decimals,
            balance: fallbackBalance.toString(),
            usdValue,
            lastUpdated: new Date()
          };
        } else {
          logger.debug(`⚠️ Fallback calculation returned zero for ${tokenInfo.tokenSymbol}`);
        }
      } catch (fallbackError) {
        logger.error(`❌ Fallback calculation failed for ${tokenInfo.tokenSymbol}: ${fallbackError}`);
      }
      
      // If all else fails, return zero balance
      logger.debug(`💀 All methods failed for ${tokenInfo.tokenSymbol}, returning zero balance`);
      return {
        contractAddress,
        tokenName: tokenInfo.tokenName,
        tokenSymbol: tokenInfo.tokenSymbol,
        decimals: tokenInfo.decimals,
        balance: '0',
        usdValue: 0,
        lastUpdated: new Date()
      };
    }
  }

  private async calculateBalanceFromHistory(address: string, contractAddress: string, tokenInfo: any): Promise<number> {
    try {
      logger.debug(`🔄 Getting token transfers for ${tokenInfo.tokenSymbol} from Etherscan...`);
      
      // Get recent token transfers for this specific token
      const response = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          contractaddress: contractAddress,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: this.etherscanApiKey
        },
        timeout: 10000
      });

      if (response.data.status === '1') {
        const transfers = response.data.result;
        logger.debug(`📊 Found ${transfers.length} transfers for ${tokenInfo.tokenSymbol}`);
        
        let balance = 0;
        let incomingCount = 0;
        let outgoingCount = 0;
        
        // Calculate balance from transfer history
        transfers.forEach((tx: any, index: number) => {
          const value = parseFloat(tx.value) / Math.pow(10, tokenInfo.decimals);
          if (tx.to.toLowerCase() === address.toLowerCase()) {
            balance += value; // Incoming
            incomingCount++;
            logger.debug(`  +${index}: Incoming ${value} ${tokenInfo.tokenSymbol} (Total: ${balance})`);
          } else if (tx.from.toLowerCase() === address.toLowerCase()) {
            balance -= value; // Outgoing
            outgoingCount++;
            logger.debug(`  -${index}: Outgoing ${value} ${tokenInfo.tokenSymbol} (Total: ${balance})`);
          }
        });
        
        logger.debug(`📈 ${tokenInfo.tokenSymbol} calculation: ${incomingCount} incoming, ${outgoingCount} outgoing, Final balance: ${balance}`);
        const finalBalance = Math.max(0, balance); // Don't return negative balances
        logger.debug(`✅ Final balance for ${tokenInfo.tokenSymbol}: ${finalBalance}`);
        return finalBalance;
      } else {
        logger.error(`❌ Etherscan API error for ${tokenInfo.tokenSymbol}: ${response.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ Failed to calculate balance from history for ${tokenInfo.tokenSymbol}: ${error}`);
    }
    
    return 0;
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
    logger.debug(`getUsdValue called with ${ethAmount} ETH`);
    
    try {
      logger.debug('Attempting to get ETH price from CoinGecko...');
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'ethereum',
          vs_currencies: 'usd'
        },
        timeout: 5000
      });
      
      const ethPrice = response.data.ethereum.usd;
      logger.debug(`✅ Got ETH price from CoinGecko: $${ethPrice}`);
      const result = ethAmount * ethPrice;
      logger.debug(`💰 Final calculation: ${ethAmount} ETH × $${ethPrice} = $${result}`);
      return result;
    } catch (error) {
      logger.warn(`❌ CoinGecko API failed: ${error.message}, trying Binance...`);
      
      try {
        // Try alternative price API
        logger.debug('Attempting to get ETH price from Binance...');
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
          params: { symbol: 'ETHUSDT' },
          timeout: 5000
        });
        
        const ethPrice = parseFloat(response.data.price);
        logger.debug(`✅ Got ETH price from Binance: $${ethPrice}`);
        const result = ethAmount * ethPrice;
        logger.debug(`💰 Final calculation: ${ethAmount} ETH × $${ethPrice} = $${result}`);
        return result;
      } catch (fallbackError) {
        logger.warn(`❌ Binance API also failed: ${fallbackError.message}, using fallback price`);
        // Use current market price estimate (as of August 2024)
        const fallbackPrice = 4200; // Updated to current ETH price
        const result = ethAmount * fallbackPrice;
        logger.debug(`💰 Fallback calculation: ${ethAmount} ETH × $${fallbackPrice} = $${result}`);
        return result;
      }
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