import { RiskAssessment, TransactionAnalysis, FundFlow, WalletOpinion } from '../types';
export declare class RiskAnalyzer {
    /**
     * Assess risk based on analysis data
     */
    assessRisk(walletData: any, transactionAnalysis: TransactionAnalysis, fundFlows: FundFlow[], walletOpinion: WalletOpinion): Promise<RiskAssessment>;
    /**
     * Identify risk factors
     */
    private identifyRiskFactors;
    /**
     * Detect suspicious activities
     */
    private detectSuspiciousActivities;
    /**
     * Calculate overall risk score
     */
    private calculateOverallRiskScore;
    /**
     * Determine risk level based on score
     */
    private determineRiskLevel;
    /**
     * Generate recommendations based on risks
     */
    private generateRecommendations;
    /**
     * Detect mixing patterns
     */
    private detectMixingPatterns;
    /**
     * Detect pump and dump patterns
     */
    private detectPumpAndDumpPatterns;
    /**
     * Detect wash trading
     */
    private detectWashTrading;
}
//# sourceMappingURL=RiskAnalyzer.d.ts.map