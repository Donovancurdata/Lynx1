import { WalletInvestigationData } from '../types';
export declare class DataStorage {
    private onelakeConnectionString;
    private databaseName;
    private containerName;
    constructor();
    storeInvestigationData(data: WalletInvestigationData): Promise<void>;
    private storeToOneLake;
    private storeToMockStorage;
    getInvestigationData(walletAddress: string, blockchain?: string): Promise<WalletInvestigationData[]>;
    private getFromOneLake;
    private getFromMockStorage;
    getInvestigationStats(): Promise<{
        totalInvestigations: number;
        investigationsByBlockchain: Record<string, number>;
        recentInvestigations: number;
        averageProcessingTime: number;
    }>;
    private getStatsFromOneLake;
    private getStatsFromMockStorage;
    cleanupOldData(retentionDays?: number): Promise<void>;
    private cleanupOneLakeData;
    private cleanupMockStorageData;
    storeAgentMessage(message: any): Promise<void>;
    private storeAgentMessageToOneLake;
    private storeAgentMessageToMockStorage;
}
//# sourceMappingURL=DataStorage.d.ts.map