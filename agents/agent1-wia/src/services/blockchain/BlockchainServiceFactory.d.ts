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
    private initializeServices;
    private createEVMServiceAdapter;
    getService(blockchain: string): BlockchainService;
    getSupportedBlockchains(): string[];
    getAllBlockchainInfo(): Record<string, BlockchainInfo>;
    validateAddress(address: string, blockchain: string): boolean;
    getBalance(address: string, blockchain: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    getTransactionHistory(address: string, blockchain: string): Promise<Transaction[]>;
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
    isSupported(blockchain: string): boolean;
    getServiceHealth(): Promise<Record<string, boolean>>;
}
//# sourceMappingURL=BlockchainServiceFactory.d.ts.map