export interface BlockchainConfig {
    ethereum: {
        rpcUrl: string;
        wsUrl?: string;
        infuraProjectId?: string;
        infuraApiKey?: string;
        etherscanApiKey?: string;
    };
    bitcoin: {
        blockcypherApiKey?: string;
        btcscanApiUrl?: string;
    };
    binance: {
        rpcUrl: string;
        wsUrl?: string;
        bscscanApiKey?: string;
    };
    polygon: {
        rpcUrl: string;
        wsUrl?: string;
        polygonscanApiKey?: string;
    };
    avalanche: {
        rpcUrl: string;
        wsUrl?: string;
        snowtraceApiKey?: string;
    };
    arbitrum: {
        rpcUrl: string;
        wsUrl?: string;
    };
    optimism: {
        rpcUrl: string;
        wsUrl?: string;
    };
    base: {
        rpcUrl: string;
        wsUrl?: string;
    };
    linea: {
        rpcUrl: string;
        wsUrl?: string;
    };
    solana: {
        rpcUrl: string;
        solscanApiKey?: string;
    };
    onelake: {
        connectionString?: string;
        databaseName: string;
        containerName: string;
    };
    environment: {
        nodeEnv: string;
        logLevel: string;
    };
}
declare class ConfigManager {
    private static instance;
    private config;
    private constructor();
    static getInstance(): ConfigManager;
    getConfig(): BlockchainConfig;
    getEthereumConfig(): {
        rpcUrl: string;
        wsUrl?: string;
        infuraProjectId?: string;
        infuraApiKey?: string;
        etherscanApiKey?: string;
    };
    getBitcoinConfig(): {
        blockcypherApiKey?: string;
        btcscanApiUrl?: string;
    };
    getBinanceConfig(): {
        rpcUrl: string;
        wsUrl?: string;
        bscscanApiKey?: string;
    };
    getPolygonConfig(): {
        rpcUrl: string;
        wsUrl?: string;
        polygonscanApiKey?: string;
    };
    getAvalancheConfig(): {
        rpcUrl: string;
        wsUrl?: string;
        snowtraceApiKey?: string;
    };
    getSolanaConfig(): {
        rpcUrl: string;
        solscanApiKey?: string;
    };
    getArbitrumConfig(): {
        rpcUrl: string;
        wsUrl?: string;
    };
    getOptimismConfig(): {
        rpcUrl: string;
        wsUrl?: string;
    };
    getBaseConfig(): {
        rpcUrl: string;
        wsUrl?: string;
    };
    getLineaConfig(): {
        rpcUrl: string;
        wsUrl?: string;
    };
    getOneLakeConfig(): {
        connectionString?: string;
        databaseName: string;
        containerName: string;
    };
    getEnvironmentConfig(): {
        nodeEnv: string;
        logLevel: string;
    };
    isProduction(): boolean;
    isDevelopment(): boolean;
    hasEthereumApiKeys(): boolean;
    hasBitcoinApiKeys(): boolean;
    hasBinanceApiKeys(): boolean;
    hasPolygonApiKeys(): boolean;
    hasAvalancheApiKeys(): boolean;
    hasSolanaApiKeys(): boolean;
    hasArbitrumApiKeys(): boolean;
    hasOptimismApiKeys(): boolean;
    hasBaseApiKeys(): boolean;
    hasLineaApiKeys(): boolean;
    hasOneLakeConnection(): boolean;
    validateApiKeys(): {
        ethereum: boolean;
        bitcoin: boolean;
        binance: boolean;
        polygon: boolean;
        avalanche: boolean;
        arbitrum: boolean;
        optimism: boolean;
        base: boolean;
        linea: boolean;
        solana: boolean;
        onelake: boolean;
    };
}
export declare const config: ConfigManager;
export default config;
//# sourceMappingURL=config.d.ts.map