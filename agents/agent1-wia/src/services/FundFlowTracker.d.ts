import { Transaction, FundFlow } from '../types';
export declare class FundFlowTracker {
    private knownExchanges;
    private knownForexProviders;
    /**
     * Track fund flows from transactions
     */
    trackFundFlows(transactions: Transaction[], walletAddress: string): Promise<FundFlow[]>;
    /**
     * Analyze a single transaction for fund flow
     */
    private analyzeTransactionFlow;
    /**
     * Analyze destination address for exchange/forex/bank indicators
     */
    private analyzeDestination;
    /**
     * Identify if address belongs to a known exchange
     */
    private identifyExchange;
    /**
     * Identify if address belongs to a forex provider
     */
    private identifyForexProvider;
    /**
     * Identify if address is associated with bank transfers
     */
    private identifyBankAccount;
    /**
     * Identify DeFi protocol interactions
     */
    private identifyDeFiProtocol;
    /**
     * Check if address matches known exchange patterns
     */
    private isExchangeAddress;
    /**
     * Check if address matches known forex provider patterns
     */
    private isForexAddress;
    /**
     * Get fund flow summary statistics
     */
    getFundFlowSummary(fundFlows: FundFlow[]): {
        totalIncoming: number;
        totalOutgoing: number;
        exchangeTransfers: number;
        forexTransfers: number;
        bankTransfers: number;
        defiInteractions: number;
        largestTransfer: FundFlow | null;
        averageTransfer: number;
    };
}
//# sourceMappingURL=FundFlowTracker.d.ts.map