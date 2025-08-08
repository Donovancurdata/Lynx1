export interface BlockchainInfo {
    name: string;
    symbol: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
}
export interface Transaction {
    hash: string;
    blockNumber: number;
    timestamp: Date;
    from: string;
    to: string;
    value: string;
    currency: string;
    status: 'success' | 'failed' | 'pending';
    type: 'transfer' | 'contract' | 'token' | 'other';
    gasUsed?: string;
    gasPrice?: string;
    metadata?: {
        contractAddress?: string;
        tokenSymbol?: string;
        tokenName?: string;
        methodName?: string;
        confirmations?: number;
        fees?: number;
        size?: number;
        fee?: number;
        slot?: number;
    };
}
export interface TransactionAnalysis {
    totalTransactions: number;
    transactionTypes: Record<string, number>;
    temporalPatterns: {
        hourlyDistribution: Record<number, number>;
        dailyDistribution: Record<string, number>;
        monthlyDistribution: Record<string, number>;
        averageTransactionsPerDay: number;
        mostActiveHour: number;
        mostActiveDay: string;
    };
    valueDistribution: {
        totalValue: number;
        averageValue: number;
        medianValue: number;
        minValue: number;
        maxValue: number;
        valueRanges: Record<string, number>;
    };
    counterpartyAnalysis: {
        uniqueAddresses: number;
        topCounterparties: Array<{
            address: string;
            interactionCount: number;
            totalValue: number;
        }>;
        incomingAddresses: string[];
        outgoingAddresses: string[];
    };
    gasAnalysis: {
        totalGasUsed: number;
        averageGasUsed: number;
        gasEfficiency: number;
        highGasTransactions: number;
    };
    riskPatterns: {
        suspiciousPatterns: string[];
        riskScore: number;
        riskFactors: string[];
    };
    blockchain: string;
    analysisTimestamp: Date;
}
export interface FundFlow {
    id: string;
    sourceAddress: string;
    destinationAddress: string;
    amount: string;
    currency: string;
    timestamp: Date;
    transactionHash: string;
    flowType: 'incoming' | 'outgoing' | 'internal';
    blockchain: string;
    metadata?: {
        exchangeName?: string;
        forexProvider?: string;
        bankAccount?: string;
        description?: string;
    };
}
export interface WalletOpinion {
    walletType: 'main' | 'secondary' | 'exchange' | 'defi' | 'unknown';
    confidence: number;
    reasoning: string[];
    characteristics: {
        isActive: boolean;
        isHighValue: boolean;
        isDeFiUser: boolean;
        isExchangeUser: boolean;
        hasMultipleWallets: boolean;
        isInstitutional: boolean;
    };
    estimatedValue: {
        totalUSD: number;
        breakdown: Record<string, number>;
    };
    activityLevel: 'low' | 'medium' | 'high' | 'very_high';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    generatedAt: Date;
}
export interface RiskAssessment {
    overallRiskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: Array<{
        factor: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        evidence: string[];
    }>;
    suspiciousActivities: Array<{
        activity: string;
        timestamp: Date;
        description: string;
        riskScore: number;
    }>;
    recommendations: string[];
    assessmentTimestamp: Date;
}
export interface WalletInvestigationRequest {
    walletAddress: string;
    blockchain?: string;
    includeTokenTransfers?: boolean;
    includeInternalTransactions?: boolean;
    maxTransactions?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}
export interface WalletInvestigationResponse {
    success: boolean;
    data?: WalletInvestigationData;
    error?: {
        message: string;
        code: string;
        details?: string;
    };
    timestamp: Date;
}
export interface WalletInvestigationData {
    walletAddress: string;
    blockchain: string;
    blockchainInfo: BlockchainInfo;
    balance: {
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    };
    transactions: Transaction[];
    transactionAnalysis: TransactionAnalysis;
    fundFlows: FundFlow[];
    walletOpinion: WalletOpinion;
    riskAssessment: RiskAssessment;
    investigationTimestamp: Date;
    agentId: string;
    version: string;
}
export interface AgentMessage {
    id: string;
    timestamp: Date;
    sender: string;
    recipient: string;
    type: 'investigation' | 'correlation' | 'forensic' | 'synthesis';
    data: any;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    metadata?: {
        blockchain?: string;
        walletAddress?: string;
        riskLevel?: string;
        confidence?: number;
    };
}
export interface InvestigationRequest {
    walletAddress: string;
    blockchain?: string;
}
export interface InvestigationResponse {
    success: boolean;
    investigationId?: string;
    walletInvestigation?: any;
    error?: string;
    processingTime?: number;
}
export interface WalletInvestigation {
    id: string;
    walletAddress: string;
    blockchain: string;
    investigationDate: Date;
    currentBalance: any;
    transactionHistory: Transaction[];
    fundFlows: FundFlow[];
    walletOpinion: WalletOpinion;
    riskIndicators: any[];
    metadata: any;
}
export interface UserProfile {
    id: string;
    walletAddresses: string[];
    primaryWallet: string;
    estimatedValue: number;
    riskLevel: string;
    lastUpdated: Date;
}
export interface RiskIndicator {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence: string[];
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map