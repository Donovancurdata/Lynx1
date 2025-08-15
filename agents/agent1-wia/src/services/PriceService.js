"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const logger_1 = require("../utils/logger");
const storage_file_datalake_1 = require("@azure/storage-file-datalake");
const identity_1 = require("@azure/identity");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class PriceService {
    constructor() {
        this.tokenPrices = new Map();
        this.lastLoadTime = 0;
        this.CACHE_DURATION = 5 * 60 * 1000;
        this.fileSystemName = 'token-data';
        this.initializeAzureConnection();
        this.loadTokenPrices();
    }
    static getInstance() {
        if (!PriceService.instance) {
            PriceService.instance = new PriceService();
        }
        return PriceService.instance;
    }
    async getTokenPrice(tokenSymbol, chain) {
        try {
            if (Date.now() - this.lastLoadTime > this.CACHE_DURATION) {
                await this.loadTokenPrices();
            }
            const key = `${tokenSymbol.toUpperCase()}_${chain}`;
            const price = this.tokenPrices.get(key);
            if (price !== undefined) {
                logger_1.logger.debug(`Found price for ${key}: $${price}`);
                return price;
            }
            const fallbackKey = tokenSymbol.toUpperCase();
            const fallbackPriceFromCache = this.tokenPrices.get(fallbackKey);
            if (fallbackPriceFromCache !== undefined) {
                logger_1.logger.debug(`Found fallback price for ${fallbackKey}: $${fallbackPriceFromCache}`);
                return fallbackPriceFromCache;
            }
            const fallbackPrices = {
                'ETH': 3000,
                'WETH': 3000,
                'MATIC': 0.8,
                'BNB': 400,
                'AVAX': 30,
                'USDC': 1,
                'USDT': 1,
                'DAI': 1
            };
            const fallbackPriceFromDefaults = fallbackPrices[tokenSymbol.toUpperCase()];
            if (fallbackPriceFromDefaults) {
                logger_1.logger.debug(`Using fallback price for ${tokenSymbol}: $${fallbackPriceFromDefaults}`);
                return fallbackPriceFromDefaults;
            }
            logger_1.logger.warn(`No price found for ${tokenSymbol} on ${chain}`);
            return 0;
        }
        catch (error) {
            logger_1.logger.error(`Error getting token price for ${tokenSymbol}:`, error);
            return 0;
        }
    }
    async getUSDValue(amount, tokenAddress, chain) {
        try {
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum))
                return 0;
            const price = await this.getTokenPrice('ETH', chain);
            return amountNum * price;
        }
        catch (error) {
            logger_1.logger.error(`Error calculating USD value:`, error);
            return 0;
        }
    }
    async loadTokenPrices() {
        try {
            logger_1.logger.info('Loading token prices from Azure...');
            const azurePrices = await this.loadFromAzure();
            if (azurePrices && Object.keys(azurePrices).length > 0) {
                this.tokenPrices = new Map(Object.entries(azurePrices));
                logger_1.logger.info(`Loaded ${this.tokenPrices.size} token prices from Azure`);
            }
            else {
                await this.loadFromLocal();
            }
            this.lastLoadTime = Date.now();
        }
        catch (error) {
            logger_1.logger.error('Failed to load token prices:', error);
            await this.loadFromLocal();
        }
    }
    initializeAzureConnection() {
        try {
            const tenantId = process.env['AZURE_TENANT_ID'];
            const clientId = process.env['AZURE_CLIENT_ID'];
            const clientSecret = process.env['AZURE_CLIENT_SECRET'];
            logger_1.logger.info(`Azure credentials check - Tenant ID: ${tenantId ? 'Found' : 'Missing'}, Client ID: ${clientId ? 'Found' : 'Missing'}, Client Secret: ${clientSecret ? 'Found' : 'Missing'}`);
            if (!tenantId || !clientId || !clientSecret) {
                logger_1.logger.warn('Azure credentials not found in environment variables, using local fallback');
                return;
            }
            const credential = new identity_1.ClientSecretCredential(tenantId, clientId, clientSecret);
            const accountName = process.env['AZURE_STORAGE_ACCOUNT_NAME'] || 'saprodtesting';
            logger_1.logger.info(`Initializing Azure connection to account: ${accountName}`);
            this.dataLakeServiceClient = new storage_file_datalake_1.DataLakeServiceClient(`https://${accountName}.blob.core.windows.net`, credential);
            logger_1.logger.info('Azure Data Lake Storage connection initialized successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize Azure connection:', error);
        }
    }
    async loadFromAzure() {
        try {
            if (!this.dataLakeServiceClient) {
                logger_1.logger.warn('Azure client not initialized, using local fallback');
                return null;
            }
            logger_1.logger.info('Attempting to connect to Azure Data Lake Storage...');
            const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(this.fileSystemName);
            let tokenSymbols = {};
            try {
                logger_1.logger.info('Reading tokens.json from Azure...');
                const tokensFileClient = fileSystemClient.getFileClient('tokens.json');
                const tokensResponse = await tokensFileClient.read();
                const tokensContent = await this.streamToString(tokensResponse.readableStreamBody);
                const tokens = JSON.parse(tokensContent);
                for (const token of tokens) {
                    tokenSymbols[token.id] = token.symbol;
                }
                logger_1.logger.info(`Loaded ${Object.keys(tokenSymbols).length} token symbols from Azure`);
            }
            catch (error) {
                logger_1.logger.warn('Could not read tokens.json from Azure:', error);
            }
            const files = [];
            for await (const file of fileSystemClient.listPaths()) {
                if (file.name && file.name.startsWith('token-values-')) {
                    files.push(file.name);
                }
            }
            if (files.length === 0) {
                logger_1.logger.warn('No token values files found in Azure, using local fallback');
                return null;
            }
            const latestFile = files.sort().pop();
            if (!latestFile) {
                logger_1.logger.warn('No valid token values file found, using local fallback');
                return null;
            }
            logger_1.logger.info(`Loading token prices from Azure file: ${latestFile}`);
            const fileClient = fileSystemClient.getFileClient(latestFile);
            const response = await fileClient.read();
            const content = await this.streamToString(response.readableStreamBody);
            const tokenValues = JSON.parse(content);
            const priceMap = {};
            logger_1.logger.info(`Processing ${tokenValues.length} token values from Azure...`);
            for (const tokenValue of tokenValues) {
                if (tokenValue.price && tokenValue.price > 0) {
                    priceMap[tokenValue.tokenId] = tokenValue.price;
                    const symbol = tokenSymbols[tokenValue.tokenId];
                    if (symbol) {
                        priceMap[symbol.toUpperCase()] = tokenValue.price;
                        const blockchain = tokenValue.tokenId.split('-')[1];
                        if (blockchain) {
                            priceMap[`${symbol.toUpperCase()}_${blockchain}`] = tokenValue.price;
                        }
                    }
                }
            }
            logger_1.logger.info(`Successfully loaded ${Object.keys(priceMap).length} token prices from Azure`);
            return priceMap;
        }
        catch (error) {
            logger_1.logger.error('Failed to load from Azure:', error);
            return null;
        }
    }
    async streamToString(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', (data) => {
                chunks.push(data);
            });
            readableStream.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf8'));
            });
            readableStream.on('error', reject);
        });
    }
    async loadFromLocal() {
        try {
            const fs = require('fs');
            const path = require('path');
            const possiblePaths = [
                path.join(__dirname, '../../../../backend/results/token-prices.json'),
                path.join(__dirname, '../../../backend/results/token-prices.json'),
                path.join(process.cwd(), 'backend/results/token-prices.json'),
                path.join(process.cwd(), 'results/token-prices.json')
            ];
            let localPath = '';
            for (const testPath of possiblePaths) {
                if (fs.existsSync(testPath)) {
                    localPath = testPath;
                    break;
                }
            }
            if (localPath && fs.existsSync(localPath)) {
                logger_1.logger.info(`Found token prices file at: ${localPath}`);
                const data = fs.readFileSync(localPath, 'utf8');
                const prices = JSON.parse(data);
                if (Array.isArray(prices)) {
                    for (const token of prices) {
                        if (token.symbol && token.price) {
                            this.tokenPrices.set(token.symbol.toUpperCase(), token.price);
                            const key = `${token.symbol.toUpperCase()}_${token.blockchain}`;
                            this.tokenPrices.set(key, token.price);
                        }
                    }
                }
                else {
                    for (const [symbol, priceData] of Object.entries(prices)) {
                        if (typeof priceData === 'object' && priceData !== null) {
                            const price = priceData.price || priceData.usd || 0;
                            this.tokenPrices.set(symbol.toUpperCase(), price);
                        }
                    }
                }
                logger_1.logger.info(`Loaded ${this.tokenPrices.size} token prices from local file`);
            }
            else {
                logger_1.logger.warn('Local token prices file not found, using fallback prices');
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to load from local file:', error);
        }
    }
}
exports.PriceService = PriceService;
//# sourceMappingURL=PriceService.js.map