"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from project root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../.env') });
class ConfigManager {
    constructor() {
        this.config = {
            ethereum: {
                rpcUrl: process.env['ETHEREUM_RPC_URL'] || 'https://mainnet.infura.io/v3/',
                infuraProjectId: process.env['INFURA_PROJECT_ID'],
                etherscanApiKey: process.env['ETHERSCAN_API_KEY'],
            },
            bitcoin: {
                blockcypherApiKey: process.env['BLOCKCYPHER_API_KEY'],
                btcscanApiUrl: process.env['BTCSCAN_API_URL'] || 'https://btcscan.org/api',
            },
            binance: {
                rpcUrl: process.env['BSC_RPC_URL'] || 'https://bsc-dataseed.binance.org',
                bscscanApiKey: process.env['BSCSCAN_API_KEY'],
            },
            polygon: {
                rpcUrl: process.env['POLYGON_RPC_URL'] || 'https://polygon-rpc.com',
                polygonscanApiKey: process.env['POLYGONSCAN_API_KEY'],
            },
            solana: {
                rpcUrl: process.env['SOLANA_RPC_URL'] || 'https://api.mainnet-beta.solana.com',
                solscanApiKey: process.env['SOLSCAN_API_KEY'],
            },
            onelake: {
                connectionString: process.env['ONELAKE_CONNECTION_STRING'],
                databaseName: process.env['ONELAKE_DATABASE_NAME'] || 'lynx-investigations',
                containerName: process.env['ONELAKE_CONTAINER_NAME'] || 'wallet-investigations',
            },
            environment: {
                nodeEnv: process.env['NODE_ENV'] || 'development',
                logLevel: process.env['LOG_LEVEL'] || 'info',
            },
        };
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    getConfig() {
        return this.config;
    }
    getEthereumConfig() {
        return this.config.ethereum;
    }
    getBitcoinConfig() {
        return this.config.bitcoin;
    }
    getBinanceConfig() {
        return this.config.binance;
    }
    getPolygonConfig() {
        return this.config.polygon;
    }
    getSolanaConfig() {
        return this.config.solana;
    }
    getOneLakeConfig() {
        return this.config.onelake;
    }
    getEnvironmentConfig() {
        return this.config.environment;
    }
    isProduction() {
        return this.config.environment.nodeEnv === 'production';
    }
    isDevelopment() {
        return this.config.environment.nodeEnv === 'development';
    }
    hasEthereumApiKeys() {
        return !!(this.config.ethereum.infuraProjectId || this.config.ethereum.etherscanApiKey);
    }
    hasBitcoinApiKeys() {
        return !!(this.config.bitcoin.blockcypherApiKey || this.config.bitcoin.btcscanApiUrl);
    }
    hasBinanceApiKeys() {
        return !!this.config.binance.bscscanApiKey;
    }
    hasPolygonApiKeys() {
        return !!this.config.polygon.polygonscanApiKey;
    }
    hasSolanaApiKeys() {
        return !!this.config.solana.solscanApiKey;
    }
    hasOneLakeConnection() {
        return !!this.config.onelake.connectionString;
    }
    validateApiKeys() {
        return {
            ethereum: this.hasEthereumApiKeys(),
            bitcoin: this.hasBitcoinApiKeys(),
            binance: this.hasBinanceApiKeys(),
            polygon: this.hasPolygonApiKeys(),
            solana: this.hasSolanaApiKeys(),
            onelake: this.hasOneLakeConnection(),
        };
    }
}
exports.config = ConfigManager.getInstance();
exports.default = exports.config;
//# sourceMappingURL=config.js.map