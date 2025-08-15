import { RiskAssessment, TransactionAnalysis, FundFlow, WalletOpinion } from '../types';
export declare class RiskAnalyzer {
    assessRisk(walletData: any, transactionAnalysis: TransactionAnalysis, fundFlows: FundFlow[], walletOpinion: WalletOpinion): Promise<RiskAssessment>;
    private identifyRiskFactors;
    private detectSuspiciousActivities;
    private calculateOverallRiskScore;
    private determineRiskLevel;
    private generateRecommendations;
    private detectMixingPatterns;
    private detectPumpAndDumpPatterns;
    private detectWashTrading;
}
//# sourceMappingURL=RiskAnalyzer.d.ts.map