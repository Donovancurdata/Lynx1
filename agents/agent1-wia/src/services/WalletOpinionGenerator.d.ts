import { WalletOpinion, TransactionAnalysis, FundFlow } from '../types';
export declare class WalletOpinionGenerator {
    generateOpinion(walletData: any, transactionAnalysis: TransactionAnalysis, fundFlows: FundFlow[]): Promise<WalletOpinion>;
    private analyzeCharacteristics;
    private determineWalletType;
    private calculateConfidence;
    private generateReasoning;
    private estimateValue;
    private determineActivityLevel;
    private determineRiskLevel;
    private detectInstitutionalPatterns;
}
//# sourceMappingURL=WalletOpinionGenerator.d.ts.map