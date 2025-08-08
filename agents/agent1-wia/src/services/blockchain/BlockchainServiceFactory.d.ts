import { BlockchainInfo, Transaction } from '../../types';
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
export declare class BlockchainServiceFactory {
    private static instance;
    private services;
    private evmService;
    private constructor();
    static getInstance(): BlockchainServiceFactory;
    /**
     * Initialize all blockchain services
     */
    private initializeServices;
    /**
     * Create adapter for EVM service to match BlockchainService interface
     */
    private createEVMServiceAdapter;
    /**
     * Get blockchain service by blockchain name
     */
    getService(blockchain: string): BlockchainService;
    /**
     * Get all supported blockchains
     */
    getSupportedBlockchains(): string[];
    /**
     * Get blockchain info for all supported blockchains
     */
    getAllBlockchainInfo(): Record<string, BlockchainInfo>;
    /**
     * Validate address for a specific blockchain
     */
    validateAddress(address: string, blockchain: string): boolean;
    /**
     * Get balance for an address on a specific blockchain
     */
    getBalance(address: string, blockchain: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    /**
     * Get transaction history for an address on a specific blockchain
     */
    getTransactionHistory(address: string, blockchain: string): Promise<Transaction[]>;
    /**
     * Get comprehensive wallet data for an address on a specific blockchain
     */
    getWalletData(address: string, blockchain: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        enhancedBalance?: any;
        transactions: Transaction[];
        transactionAnalysis?: any;
        blockchainInfo: BlockchainInfo;
    }>;
    /**
     * Check if a blockchain is supported
     */
    isSupported(blockchain: string): boolean;
    /**
     * Get service health status
     */
    getServiceHealth(): Promise<Record<string, boolean>>;
}
//# sourceMappingURL=BlockchainServiceFactory.d.ts.map