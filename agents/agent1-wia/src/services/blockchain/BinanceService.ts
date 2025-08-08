import { ethers } from 'ethers';
import axios from 'axios';
import { Transaction, BlockchainInfo } from '../../types';
import { logger } from '../../utils/logger';
import { config } from '../../utils/config';

export class BinanceService {
  private provider: ethers.JsonRpcProvider;
  private etherscanApiKey: string;
  private etherscanBaseUrl = 'https://api.etherscan.io/v2/api';
  private readonly chainId = 56; // BNB Smart Chain

  constructor() {
    const binanceConfig = config.getBinanceConfig();
    this.provider = new ethers.JsonRpcProvider(binanceConfig.rpcUrl);
    this.etherscanApiKey = binanceConfig.bscscanApiKey || ''; // Using Etherscan key for BSC
    
    if (!this.etherscanApiKey) {
      logger.warn('ETHERSCAN_API_KEY not provided for BSC, using mock data');
    } else {
      logger.info('Binance Smart Chain service initialized with Etherscan V2 API (chainId=56)');
    }
  }

  /**
   * Get current balance for a BSC address
   */
  async getBalance(address: string): Promise<{
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  }> {
    try {
      const balance = await this.provider.getBalance(address);
      const balanceInBnb = ethers.formatEther(balance);
      
      // Get USD value
      const usdValue = await this.getUsdValue(parseFloat(balanceInBnb));
      
      return {
        balance: balanceInBnb,
        usdValue,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error(`Failed to get BSC balance for ${address}:`, error);
      throw new Error(`Failed to get BSC balance: ${error.message}`);
    }
  }

  /**
   * Get transaction history for a BSC address
   */
  async getTransactionHistory(address: string): Promise<Transaction[]> {
    try {
      if (!this.etherscanApiKey) {
        throw new Error('Etherscan API key required for transaction history');
      }

      const params = {
        chainid: this.chainId,
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: this.etherscanApiKey
      };

      const response = await axios.get(this.etherscanBaseUrl, { params });
      
      if (response.data.status !== '1') {
        throw new Error(`BSCScan API error: ${response.data.message}`);
      }

      const transactions: Transaction[] = response.data.result.map((tx: any) => ({
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        currency: 'BNB',
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        status: tx.isError === '0' ? 'success' : 'failed',
        type: this.determineTransactionType(tx),
        metadata: {
          contractAddress: tx.contractAddress || undefined,
          methodName: tx.functionName || undefined
        }
      }));

      return transactions;
    } catch (error) {
      logger.error(`Failed to get BSC transaction history for ${address}:`, error);
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }

  /**
   * Get BEP-20 token transfers
   */
  async getTokenTransfers(address: string): Promise<Transaction[]> {
    try {
      if (!this.etherscanApiKey) {
        throw new Error('Etherscan API key required for token transfers');
      }

      const params = {
        chainid: this.chainId,
        module: 'account',
        action: 'tokentx',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: this.etherscanApiKey
      };

      const response = await axios.get(this.etherscanBaseUrl, { params });
      
      if (response.data.status !== '1') {
        return []; // No token transfers
      }

      return response.data.result.map((tx: any) => ({
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        from: tx.from,
        to: tx.to,
        value: tx.value,
        currency: tx.tokenSymbol,
        status: 'success',
        type: 'token',
        metadata: {
          contractAddress: tx.contractAddress,
          tokenSymbol: tx.tokenSymbol,
          tokenName: tx.tokenName,
          tokenDecimal: tx.tokenDecimal
        }
      }));
    } catch (error) {
      logger.error(`Failed to get token transfers for ${address}:`, error);
      return []; // Return empty array on error
    }
  }

  /**
   * Validate BSC address
   */
  validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Get blockchain information
   */
  getBlockchainInfo(): BlockchainInfo {
    return {
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      chainId: 56,
      rpcUrl: 'https://bsc-dataseed.binance.org',
      explorerUrl: 'https://bscscan.com'
    };
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getFeeData();
      return gasPrice.gasPrice?.toString() || '0';
    } catch (error) {
      logger.error('Failed to get gas price:', error);
      return '0';
    }
  }

  /**
   * Get block information
   */
  async getBlockInfo(blockNumber: number): Promise<{
    timestamp: Date;
    transactions: number;
    gasUsed: string;
  }> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return {
        timestamp: new Date(block?.timestamp || 0),
        transactions: block?.transactions.length || 0,
        gasUsed: block?.gasUsed?.toString() || '0'
      };
    } catch (error) {
      logger.error(`Failed to get block info for ${blockNumber}:`, error);
      throw error;
    }
  }

  /**
   * Determine transaction type based on transaction data
   */
  private determineTransactionType(tx: any): 'transfer' | 'contract' | 'token' | 'other' {
    if (tx.contractAddress && tx.contractAddress !== '') {
      return 'token';
    }
    
    if (tx.to && tx.to !== '' && tx.input === '0x') {
      return 'transfer';
    }
    
    if (tx.input && tx.input !== '0x') {
      return 'contract';
    }
    
    return 'other';
  }

  /**
   * Get USD value for BNB amount (placeholder - would use price API)
   */
  private async getUsdValue(bnbAmount: number): Promise<number> {
    // This would typically use a price API like CoinGecko or CoinMarketCap
    // For now, using a placeholder value
    const bnbPrice = 300; // USD per BNB (would be fetched from API)
    return bnbAmount * bnbPrice;
  }
} 