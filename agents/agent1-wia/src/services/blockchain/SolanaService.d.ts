import { Transaction, BlockchainInfo } from '../../types';
export declare class SolanaService {
    private rpcUrl;
    private solscanApiKey;
    private solscanBaseUrl;
    constructor();
    getBalance(address: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    getTransactionHistory(address: string, limit?: number): Promise<Transaction[]>;
    getWalletData(address: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        transactions: Transaction[];
        blockchainInfo: BlockchainInfo;
    }>;
    validateAddress(address: string): boolean;
    getBlockchainInfo(): BlockchainInfo;
    getCurrentSlot(): Promise<number>;
    private getMockBalance;
    private getMockTransactions;
    private generateMockSolanaAddress;
    private generateMockSolanaSignature;
    private simpleHash;
    private extractRecipientAddress;
    private determineTransactionType;
    private getUsdValue;
}
//# sourceMappingURL=SolanaService.d.ts.map