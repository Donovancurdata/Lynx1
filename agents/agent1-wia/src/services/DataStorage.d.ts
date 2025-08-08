import { WalletInvestigationData } from '../types';
export declare class DataStorage {
    private onelakeConnectionString;
    private databaseName;
    private containerName;
    constructor();
    /**
     * Store investigation data in OneLake
     */
    storeInvestigationData(data: WalletInvestigationData): Promise<void>;
    /**
     * Store data to OneLake/Fabric
     */
    private storeToOneLake;
    /**
     * Store data to mock storage (for development)
     */
    private storeToMockStorage;
    /**
     * Retrieve investigation data by wallet address
     */
    getInvestigationData(walletAddress: string, blockchain?: string): Promise<WalletInvestigationData[]>;
    /**
     * Retrieve data from OneLake
     */
    private getFromOneLake;
    /**
     * Retrieve data from mock storage
     */
    private getFromMockStorage;
    /**
     * Get investigation statistics
     */
    getInvestigationStats(): Promise<{
        totalInvestigations: number;
        investigationsByBlockchain: Record<string, number>;
        recentInvestigations: number;
        averageProcessingTime: number;
    }>;
    /**
     * Get statistics from OneLake
     */
    private getStatsFromOneLake;
    /**
     * Get statistics from mock storage
     */
    private getStatsFromMockStorage;
    /**
     * Clean up old investigation data
     */
    cleanupOldData(retentionDays?: number): Promise<void>;
    /**
     * Clean up OneLake data
     */
    private cleanupOneLakeData;
    /**
     * Clean up mock storage data
     */
    private cleanupMockStorageData;
    /**
     * Store agent message for inter-agent communication
     */
    storeAgentMessage(message: any): Promise<void>;
    /**
     * Store agent message to OneLake/Fabric
     */
    private storeAgentMessageToOneLake;
    /**
     * Store agent message to mock storage
     */
    private storeAgentMessageToMockStorage;
}
//# sourceMappingURL=DataStorage.d.ts.map