import { BlockchainInfo, Transaction } from '../../types';
interface TokenBalance {
    contractAddress: string;
    tokenName: string;
    tokenSymbol: string;
    decimals: number;
    balance: string;
    usdValue: number;
    lastUpdated: Date;
}
interface EnhancedBalance {
    native: {
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    };
    tokens: TokenBalance[];
    totalUsdValue: number;
}
interface TransactionValueAnalysis {
    totalIncoming: number;
    totalOutgoing: number;
    netFlow: number;
    largestTransaction: number;
    averageTransaction: number;
    transactionCount: number;
    lifetimeVolume: number;
}
interface WalletOpinion {
    type: 'whale' | 'active_trader' | 'hodler' | 'new_user' | 'inactive' | 'unknown';
    activityLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    estimatedValue: number;
    confidence: 'high' | 'medium' | 'low';
    riskScore: number;
    riskFactors: string[];
}
interface FundFlow {
    date: string;
    incoming: number;
    outgoing: number;
    netFlow: number;
    transactionCount: number;
}
interface WalletInvestigation {
    address: string;
    blockchain: string;
    balance: {
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    };
    enhancedBalance: EnhancedBalance;
    transactionAnalysis: TransactionValueAnalysis;
    recentTransactions: Transaction[];
    walletOpinion: WalletOpinion;
    fundFlows: FundFlow[];
    riskAssessment: {
        score: number;
        factors: string[];
        recommendations: string[];
    };
    blockchainInfo: BlockchainInfo;
    investigationTimestamp: Date;
}
export declare class EVMService {
    private providers;
    private chainConfigs;
    private priceService;
    constructor();
    private initializeChains;
    getBlockchainInfo(chain: string): BlockchainInfo;
    validateAddress(address: string, chain: string): boolean;
    getBalance(address: string, chain: string): Promise<{
        balance: string;
        usdValue: number;
        lastUpdated: Date;
    }>;
    getAllTokenBalances(address: string, chain: string): Promise<EnhancedBalance>;
    getERC20Tokens(address: string, chain: string): Promise<TokenBalance[]>;
    getTokenBalance(address: string, contractAddress: string, tokenInfo: any, chain: string): Promise<TokenBalance>;
    getTransactionHistory(address: string, chain: string, limit?: number): Promise<Transaction[]>;
    analyzeTransactionValues(transactions: Transaction[], walletAddress: string): Promise<TransactionValueAnalysis>;
    generateWalletOpinion(address: string, enhancedBalance: EnhancedBalance, transactionAnalysis: TransactionValueAnalysis, transactions: Transaction[]): Promise<WalletOpinion>;
    private calculateRiskScore;
    private getRiskFactors;
    generateFundFlows(transactions: Transaction[], walletAddress: string): Promise<FundFlow[]>;
    investigateWallet(address: string, chain: string): Promise<WalletInvestigation>;
    private generateRiskRecommendations;
    getWalletData(address: string, chain: string): Promise<{
        balance: {
            balance: string;
            usdValue: number;
            lastUpdated: Date;
        };
        enhancedBalance: EnhancedBalance;
        transactions: Transaction[];
        transactionAnalysis: TransactionValueAnalysis;
        blockchainInfo: BlockchainInfo;
    }>;
    private determineTransactionType;
}
export {};
//# sourceMappingURL=EVMService.d.ts.map