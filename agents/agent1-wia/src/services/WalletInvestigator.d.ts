import { WalletInvestigationRequest, WalletInvestigationResponse, Transaction, BlockchainInfo } from '../types';
export declare class WalletInvestigator {
    private blockchainFactory;
    private blockchainDetector;
    private transactionAnalyzer;
    private fundFlowTracker;
    private walletOpinionGenerator;
    private riskAnalyzer;
    private dataStorage;
    constructor();
    investigateWallet(request: WalletInvestigationRequest): Promise<WalletInvestigationResponse>;
    private detectBlockchain;
    getSupportedBlockchains(): string[];
    getAllBlockchainInfo(): Record<string, BlockchainInfo>;
    getServiceHealth(): Promise<Record<string, boolean>>;
    validateAddress(address: string, blockchain: string): boolean;
    getBalance(address: string, blockchain: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    getTransactionHistory(address: string, blockchain: string): Promise<Transaction[]>;
}
//# sourceMappingURL=WalletInvestigator.d.ts.map