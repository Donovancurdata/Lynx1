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
    /**
     * Main investigation method for Agent 1
     */
    investigateWallet(request: WalletInvestigationRequest): Promise<WalletInvestigationResponse>;
    /**
     * Detect which blockchain the wallet address belongs to
     */
    private detectBlockchain;
    /**
     * Get supported blockchains
     */
    getSupportedBlockchains(): string[];
    /**
     * Get blockchain information
     */
    getAllBlockchainInfo(): Record<string, BlockchainInfo>;
    /**
     * Get service health status
     */
    getServiceHealth(): Promise<Record<string, boolean>>;
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
}
//# sourceMappingURL=WalletInvestigator.d.ts.map