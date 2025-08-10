export interface TokenBalance {
    symbol: string;
    balance: string;
    usdValue: number;
    tokenAddress?: string;
}
export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: string;
    type: 'in' | 'out';
    currency: string;
    isTokenTransfer?: boolean;
}
export interface WalletAnalysis {
    address: string;
    blockchain: string;
    balance: {
        native: string;
        usdValue: number;
    };
    tokens: TokenBalance[];
    totalTokens: number;
    topTokens: TokenBalance[];
    recentTransactions: Transaction[];
    totalLifetimeValue: number;
    transactionCount: number;
    tokenTransactionCount: number;
    lastUpdated: string;
}
export interface MultiBlockchainAnalysis {
    address: string;
    blockchains: {
        [blockchain: string]: WalletAnalysis;
    };
    totalValue: number;
    totalTransactions: number;
    lastUpdated: string;
}
export declare class WalletAnalysisServiceUltraOptimized {
    private static analysisCache;
    private static tokenPriceCache;
    private static readonly CACHE_DURATION;
    private static readonly MAX_TRANSACTIONS_PER_CHAIN;
    private static readonly MAX_TOKENS_PER_CHAIN;
    private static readonly BLOCKCHAIN_APIS;
    static detectAllBlockchains(address: string): string[];
    static analyzeWallet(address: string, deepAnalysis?: boolean): Promise<MultiBlockchainAnalysis>;
    private static analyzeSingleBlockchain;
    private static getUltraOptimizedBlockchainData;
    private static getBalanceViaRPC;
    private static getCachedTokenPrice;
    private static compileResults;
    static clearCaches(): void;
    static getCacheStats(): {
        analysisCacheSize: number;
        tokenPriceCacheSize: number;
    };
}
//# sourceMappingURL=WalletAnalysisServiceUltraOptimized.d.ts.map