import { Transaction, FundFlow } from '../types';
export declare class FundFlowTracker {
    private knownExchanges;
    private knownForexProviders;
    trackFundFlows(transactions: Transaction[], walletAddress: string): Promise<FundFlow[]>;
    private analyzeTransactionFlow;
    private analyzeDestination;
    private identifyExchange;
    private identifyForexProvider;
    private identifyBankAccount;
    private identifyDeFiProtocol;
    private isExchangeAddress;
    private isForexAddress;
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