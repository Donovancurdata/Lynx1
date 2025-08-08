export interface BlockchainConfig {
    ethereum: {
        rpcUrl: string;
        infuraProjectId?: string;
        etherscanApiKey?: string;
    };
    bitcoin: {
        blockcypherApiKey?: string;
        btcscanApiUrl?: string;
    };
    binance: {
        rpcUrl: string;
        bscscanApiKey?: string;
    };
    polygon: {
        rpcUrl: string;
        polygonscanApiKey?: string;
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
        infuraProjectId?: string;
        etherscanApiKey?: string;
    };
    getBitcoinConfig(): {
        blockcypherApiKey?: string;
        btcscanApiUrl?: string;
    };
    getBinanceConfig(): {
        rpcUrl: string;
        bscscanApiKey?: string;
    };
    getPolygonConfig(): {
        rpcUrl: string;
        polygonscanApiKey?: string;
    };
    getSolanaConfig(): {
        rpcUrl: string;
        solscanApiKey?: string;
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
    hasSolanaApiKeys(): boolean;
    hasOneLakeConnection(): boolean;
    validateApiKeys(): {
        ethereum: boolean;
        bitcoin: boolean;
        binance: boolean;
        polygon: boolean;
        solana: boolean;
        onelake: boolean;
    };
}
export declare const config: ConfigManager;
export default config;
//# sourceMappingURL=config.d.ts.map