import { Transaction, TransactionAnalysis } from '../types';
export declare class TransactionAnalyzer {
    /**
     * Analyze transactions for patterns and behaviors
     */
    analyzeTransactions(transactions: Transaction[], blockchain: string): Promise<TransactionAnalysis>;
    /**
     * Analyze transaction types distribution
     */
    private analyzeTransactionTypes;
    /**
     * Analyze temporal patterns in transactions
     */
    private analyzeTemporalPatterns;
    /**
     * Analyze value distribution of transactions
     */
    private analyzeValueDistribution;
    /**
     * Analyze counterparties (addresses that interact with the wallet)
     */
    private analyzeCounterparties;
    /**
     * Analyze gas usage patterns (for EVM-based blockchains)
     */
    private analyzeGasUsage;
    /**
     * Analyze risk patterns in transactions
     */
    private analyzeRiskPatterns;
    /**
     * Calculate total days between first and last transaction
     */
    private calculateTotalDays;
}
//# sourceMappingURL=TransactionAnalyzer.d.ts.map