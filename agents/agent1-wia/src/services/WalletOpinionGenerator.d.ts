import { WalletOpinion, TransactionAnalysis, FundFlow } from '../types';
export declare class WalletOpinionGenerator {
    /**
     * Generate wallet opinion based on analysis data
     */
    generateOpinion(walletData: any, transactionAnalysis: TransactionAnalysis, fundFlows: FundFlow[]): Promise<WalletOpinion>;
    /**
     * Analyze wallet characteristics
     */
    private analyzeCharacteristics;
    /**
     * Determine wallet type based on characteristics
     */
    private determineWalletType;
    /**
     * Calculate confidence level in the opinion
     */
    private calculateConfidence;
    /**
     * Generate reasoning for the opinion
     */
    private generateReasoning;
    /**
     * Estimate wallet value
     */
    private estimateValue;
    /**
     * Determine activity level
     */
    private determineActivityLevel;
    /**
     * Determine risk level
     */
    private determineRiskLevel;
    /**
     * Detect institutional patterns
     */
    private detectInstitutionalPatterns;
}
//# sourceMappingURL=WalletOpinionGenerator.d.ts.map