import { EVMService } from './EVMService';
import { BitcoinService } from './BitcoinService';
import { SolanaService } from './SolanaService';
import { BlockchainInfo, Transaction } from '../../types';
import { logger } from '../../utils/logger';

export interface BlockchainService {
  getBalance(address: string): Promise<{
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  }>;
  getTransactionHistory(address: string): Promise<Transaction[]>;
  validateAddress(address: string): boolean;
  getBlockchainInfo(): BlockchainInfo;
  getAllTokenBalances?(address: string): Promise<any>;
  analyzeTransactionValues?(transactions: Transaction[], walletAddress: string): Promise<any>;
  investigateWallet?(address: string): Promise<any>;
}

export class BlockchainServiceFactory {
  private static instance: BlockchainServiceFactory;
  private services: Map<string, BlockchainService> = new Map();
  private evmService: EVMService;

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): BlockchainServiceFactory {
    if (!BlockchainServiceFactory.instance) {
      BlockchainServiceFactory.instance = new BlockchainServiceFactory();
    }
    return BlockchainServiceFactory.instance;
  }

  /**
   * Initialize all blockchain services
   */
  private initializeServices(): void {
    try {
      // Initialize EVM service for all EVM-compatible chains
      this.evmService = new EVMService();
      this.services.set('ethereum', this.createEVMServiceAdapter('ethereum'));
      this.services.set('polygon', this.createEVMServiceAdapter('polygon'));
      this.services.set('binance', this.createEVMServiceAdapter('binance'));
      this.services.set('avalanche', this.createEVMServiceAdapter('avalanche'));
      this.services.set('arbitrum', this.createEVMServiceAdapter('arbitrum'));
      this.services.set('optimism', this.createEVMServiceAdapter('optimism'));
      this.services.set('base', this.createEVMServiceAdapter('base'));
      this.services.set('linea', this.createEVMServiceAdapter('linea'));
      logger.info('EVM services initialized (Ethereum, Polygon, Binance, Avalanche, Arbitrum, Optimism, Base, Linea)');

      // Initialize Bitcoin service
      this.services.set('bitcoin', new BitcoinService());
      logger.info('Bitcoin service initialized');

      // Initialize Solana service
      this.services.set('solana', new SolanaService());
      logger.info('Solana service initialized');

    } catch (error) {
      logger.error('Failed to initialize blockchain services:', error);
      throw error;
    }
  }

  /**
   * Create adapter for EVM service to match BlockchainService interface
   */
  private createEVMServiceAdapter(chain: string): BlockchainService {
    return {
      getBalance: (address: string) => this.evmService.getBalance(address, chain),
      getTransactionHistory: (address: string) => this.evmService.getTransactionHistory(address, chain),
      validateAddress: (address: string) => this.evmService.validateAddress(address, chain),
      getBlockchainInfo: () => this.evmService.getBlockchainInfo(chain),
      getAllTokenBalances: (address: string) => this.evmService.getAllTokenBalances(address, chain),
      analyzeTransactionValues: (transactions: Transaction[], walletAddress: string) => 
        this.evmService.analyzeTransactionValues(transactions, walletAddress),
      investigateWallet: (address: string) => this.evmService.investigateWallet(address, chain)
    };
  }

  /**
   * Get blockchain service by blockchain name
   */
  public getService(blockchain: string): BlockchainService {
    const service = this.services.get(blockchain.toLowerCase());
    if (!service) {
      throw new Error(`Unsupported blockchain: ${blockchain}`);
    }
    return service;
  }

  /**
   * Get all supported blockchains
   */
  public getSupportedBlockchains(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get blockchain info for all supported blockchains
   */
  public getAllBlockchainInfo(): Record<string, BlockchainInfo> {
    const info: Record<string, BlockchainInfo> = {};
    
    for (const [name, service] of this.services.entries()) {
      info[name] = service.getBlockchainInfo();
    }
    
    return info;
  }

  /**
   * Validate address for a specific blockchain
   */
  public validateAddress(address: string, blockchain: string): boolean {
    try {
      const service = this.getService(blockchain);
      return service.validateAddress(address);
    } catch (error) {
      logger.error(`Failed to validate address for ${blockchain}:`, error);
      return false;
    }
  }

  /**
   * Get balance for an address on a specific blockchain
   */
  public async getBalance(address: string, blockchain: string): Promise<{
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  }> {
    try {
      const service = this.getService(blockchain);
      return await service.getBalance(address);
    } catch (error) {
      logger.error(`Failed to get balance for ${address} on ${blockchain}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction history for an address on a specific blockchain
   */
  public async getTransactionHistory(address: string, blockchain: string): Promise<Transaction[]> {
    try {
      const service = this.getService(blockchain);
      return await service.getTransactionHistory(address);
    } catch (error) {
      logger.error(`Failed to get transaction history for ${address} on ${blockchain}:`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive wallet data for an address on a specific blockchain
   */
  public async getWalletData(address: string, blockchain: string): Promise<{
    balance: {
      balance: string;
      usdValue: number;
      lastUpdated: Date;
    };
    enhancedBalance?: any;
    transactions: Transaction[];
    transactionAnalysis?: any;
    blockchainInfo: BlockchainInfo;
  }> {
    try {
      // For EVM chains, use the EVM service directly for better performance
      if (['ethereum', 'polygon', 'binance'].includes(blockchain)) {
        return await this.evmService.getWalletData(address, blockchain);
      }
      
      // For other chains, use the service interface
      const service = this.getService(blockchain);
      const [balance, transactions] = await Promise.all([
        service.getBalance(address),
        service.getTransactionHistory(address)
      ]);

      // Get enhanced data if available
      let enhancedBalance = null;
      let transactionAnalysis = null;

      if (service.getAllTokenBalances) {
        try {
          enhancedBalance = await service.getAllTokenBalances(address);
        } catch (error) {
          logger.warn(`Failed to get enhanced balance for ${address}: ${error}`);
        }
      }

      if (service.analyzeTransactionValues && transactions.length > 0) {
        try {
          transactionAnalysis = await service.analyzeTransactionValues(transactions, address);
        } catch (error) {
          logger.warn(`Failed to analyze transaction values for ${address}: ${error}`);
        }
      }

      return {
        balance,
        enhancedBalance,
        transactions,
        transactionAnalysis,
        blockchainInfo: service.getBlockchainInfo()
      };
    } catch (error) {
      logger.error(`Failed to get wallet data for ${address} on ${blockchain}:`, error);
      throw error;
    }
  }

  /**
   * Check if a blockchain is supported
   */
  public isSupported(blockchain: string): boolean {
    return this.services.has(blockchain.toLowerCase());
  }

  /**
   * Get service health status
   */
  public async getServiceHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const [name, service] of this.services.entries()) {
      try {
        // Try to get blockchain info as a health check
        service.getBlockchainInfo();
        health[name] = true;
      } catch (error) {
        logger.error(`Health check failed for ${name}:`, error);
        health[name] = false;
      }
    }
    
    return health;
  }
} 