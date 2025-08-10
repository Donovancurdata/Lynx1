export declare class PriceService {
    private static instance;
    private tokenPrices;
    private lastLoadTime;
    private readonly CACHE_DURATION;
    private dataLakeServiceClient;
    private fileSystemName;
    private constructor();
    static getInstance(): PriceService;
    getTokenPrice(tokenSymbol: string, chain: string): Promise<number>;
    getUSDValue(amount: string, tokenAddress: string, chain: string): Promise<number>;
    private loadTokenPrices;
    private initializeAzureConnection;
    private loadFromAzure;
    private streamToString;
    private loadFromLocal;
}
//# sourceMappingURL=PriceService.d.ts.map