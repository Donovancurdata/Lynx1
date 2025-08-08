import { Transaction, BlockchainInfo } from '../../types';
export declare class SolanaService {
    private rpcUrl;
    private solscanApiKey;
    private solscanBaseUrl;
    constructor();
    /**
     * Get current balance for a Solana address
     */
    getBalance(address: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    /**
     * Get transaction history for a Solana address with enhanced pagination
     */
    getTransactionHistory(address: string, limit?: number): Promise<Transaction[]>;
    /**
     * Get comprehensive wallet data
     */
    getWalletData(address: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        transactions: Transaction[];
        blockchainInfo: BlockchainInfo;
    }>;
    /**
     * Validate Solana address
     */
    validateAddress(address: string): boolean;
    /**
     * Get blockchain information
     */
    getBlockchainInfo(): BlockchainInfo;
    /**
     * Get current slot (block height)
     */
    getCurrentSlot(): Promise<number>;
    /**
     * Get mock balance data
     */
    private getMockBalance;
    /**
     * Get mock transaction data
     */
    private getMockTransactions;
    /**
     * Generate a mock Solana address
     */
    private generateMockSolanaAddress;
    /**
     * Generate a mock Solana transaction signature
     */
    private generateMockSolanaSignature;
    /**
     * Simple hash function for generating consistent mock data
     */
    private simpleHash;
    /**
     * Extract recipient address from transaction
     */
    private extractRecipientAddress;
    /**
     * Determine transaction type based on transaction data
     */
    private determineTransactionType;
    /**
     * Get USD value for SOL amount using price API
     */
    private getUsdValue;
}
//# sourceMappingURL=SolanaService.d.ts.map