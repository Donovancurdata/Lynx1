import { Transaction, TransactionAnalysis } from '../types';
export declare class TransactionAnalyzer {
    analyzeTransactions(transactions: Transaction[], blockchain: string): Promise<TransactionAnalysis>;
    private analyzeTransactionTypes;
    private analyzeTemporalPatterns;
    private analyzeValueDistribution;
    private analyzeCounterparties;
    private analyzeGasUsage;
    private analyzeRiskPatterns;
    private calculateTotalDays;
}
//# sourceMappingURL=TransactionAnalyzer.d.ts.map