import { WalletInvestigationRequest, WalletInvestigationResponse, AgentMessage, BlockchainInfo, Transaction } from './types';
/**
 * Agent 1: Wallet Investigation Agent (WIA)
 *
 * Primary Responsibilities:
 * - Blockchain Detection: Automatically identify which blockchain a wallet belongs to
 * - Fund Analysis: Determine what funds were in the wallet and their historical values
 * - Temporal Analysis: Track dates and times of all transactions
 * - Data Storage: Store all investigation results in Microsoft OneLake/Fabric
 * - Wallet Opinion: Assess if this is a main wallet or if the user has multiple wallets
 * - Fund Flow Tracking: Monitor how and where all funds moved
 */
export declare class Agent1WIA {
    private walletInvestigator;
    private blockchainFactory;
    private blockchainDetector;
    private dataStorage;
    private agentId;
    private version;
    constructor();
    /**
     * Main investigation method - orchestrates the entire wallet investigation process
     */
    investigateWallet(request: WalletInvestigationRequest): Promise<WalletInvestigationResponse>;
    /**
     * Detect blockchain for a wallet address
     */
    detectBlockchain(walletAddress: string): Promise<{
        blockchain: string;
        confidence: number;
        info: BlockchainInfo;
    }>;
    /**
     * Get wallet balance across all supported blockchains
     */
    getMultiChainBalance(walletAddress: string): Promise<Record<string, {
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>>;
    /**
     * Get transaction history across all supported blockchains
     */
    getMultiChainTransactionHistory(walletAddress: string): Promise<Record<string, Transaction[]>>;
    /**
     * Get comprehensive wallet data for a specific blockchain
     */
    getWalletData(walletAddress: string, blockchain: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        transactions: Transaction[];
        blockchainInfo: BlockchainInfo;
    }>;
    /**
     * Get service health status for all blockchain services
     */
    getServiceHealth(): Promise<Record<string, boolean>>;
    /**
     * Get all supported blockchains
     */
    getSupportedBlockchains(): string[];
    /**
     * Get blockchain information for all supported blockchains
     */
    getAllBlockchainInfo(): Record<string, BlockchainInfo>;
    /**
     * Validate address for a specific blockchain
     */
    validateAddress(address: string, blockchain: string): boolean;
    /**
     * Get agent information
     */
    getAgentInfo(): {
        agentId: string;
        version: string;
        capabilities: string[];
        supportedBlockchains: string[];
    };
    /**
     * Process agent message from other agents
     */
    processAgentMessage(message: AgentMessage): Promise<void>;
    /**
     * Validate investigation request
     */
    private validateRequest;
    /**
     * Store investigation data in OneLake
     */
    private storeInvestigationData;
    /**
     * Create agent message for other agents
     */
    private createAgentMessage;
}
//# sourceMappingURL=Agent1WIA.d.ts.map