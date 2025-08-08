import { BlockchainInfo, Transaction } from '../../types';
interface BitcoinTransactionAnalysis {
    totalIncoming: number;
    totalOutgoing: number;
    netFlow: number;
    largestTransaction: number;
    averageTransaction: number;
    transactionCount: number;
    lifetimeVolume: number;
    totalFees: number;
}
export declare class BitcoinService {
    private blockcypherApiKey;
    private blockcypherBaseUrl;
    private btcscanBaseUrl;
    private priceService;
    private readonly blockchainInfo;
    constructor();
    getBlockchainInfo(): BlockchainInfo;
    validateAddress(address: string): boolean;
    getBalance(address: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    private getBalanceFromBlockCypher;
    private getBalanceFromBTCScan;
    getTransactionHistory(address: string, limit?: number): Promise<Transaction[]>;
    private getTransactionHistoryFromBTCScan;
    private getTransactionHistoryFromBlockCypher;
    analyzeTransactionValues(transactions: Transaction[], walletAddress: string): Promise<BitcoinTransactionAnalysis>;
    getWalletData(address: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        transactions: Transaction[];
        transactionAnalysis: BitcoinTransactionAnalysis;
        blockchainInfo: BlockchainInfo;
    }>;
    getCurrentBlockHeight(): Promise<number>;
    getTransactionDetails(txHash: string): Promise<any>;
    private getMockBalance;
    private getMockTransactions;
    private getMockTransactionDetails;
}
export {};
//# sourceMappingURL=BitcoinService.d.ts.map