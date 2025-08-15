import { WalletInvestigationRequest, WalletInvestigationResponse, AgentMessage, BlockchainInfo, Transaction } from './types';
export declare class Agent1WIA {
    private walletInvestigator;
    private blockchainFactory;
    private blockchainDetector;
    private dataStorage;
    private agentId;
    private version;
    constructor();
    investigateWallet(request: WalletInvestigationRequest): Promise<WalletInvestigationResponse>;
    detectBlockchain(walletAddress: string): Promise<{
        blockchain: string;
        confidence: number;
        info: BlockchainInfo;
    }>;
    getMultiChainBalance(walletAddress: string): Promise<Record<string, {
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>>;
    getMultiChainTransactionHistory(walletAddress: string): Promise<Record<string, Transaction[]>>;
    getWalletData(walletAddress: string, blockchain: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        enhancedBalance?: any;
        transactions: Transaction[];
        blockchainInfo: BlockchainInfo;
    }>;
    getServiceHealth(): Promise<Record<string, boolean>>;
    getSupportedBlockchains(): string[];
    getAllBlockchainInfo(): Record<string, BlockchainInfo>;
    validateAddress(address: string, blockchain: string): boolean;
    getAgentInfo(): {
        agentId: string;
        version: string;
        capabilities: string[];
        supportedBlockchains: string[];
    };
    processAgentMessage(message: AgentMessage): Promise<void>;
    private validateRequest;
    private storeInvestigationData;
    private createAgentMessage;
}
//# sourceMappingURL=Agent1WIA.d.ts.map