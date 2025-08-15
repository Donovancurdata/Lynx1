"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../.env') });
class ConfigManager {
    constructor() {
        this.config = {
            ethereum: {
                rpcUrl: process.env['ETHEREUM_RPC_URL'] || 'https://mainnet.infura.io/v3/',
                wsUrl: process.env['ETHEREUM_WS_URL'],
                infuraProjectId: process.env['INFURA_PROJECT_ID'],
                infuraApiKey: process.env['INFURA_API_KEY'],
                etherscanApiKey: process.env['ETHERSCAN_API_KEY'],
            },
            bitcoin: {
                blockcypherApiKey: process.env['BLOCKCYPHER_API_KEY'],
                btcscanApiUrl: process.env['BTCSCAN_API_URL'] || 'https://btcscan.org/api',
            },
            binance: {
                rpcUrl: process.env['BSC_RPC_URL'] || 'https://bsc-dataseed.binance.org',
                wsUrl: process.env['BSC_WS_URL'],
                bscscanApiKey: process.env['BSCSCAN_API_KEY'],
            },
            polygon: {
                rpcUrl: process.env['POLYGON_RPC_URL'] || 'https://polygon-rpc.com',
                wsUrl: process.env['POLYGON_WS_URL'],
                polygonscanApiKey: process.env['POLYGONSCAN_API_KEY'],
            },
            avalanche: {
                rpcUrl: process.env['AVALANCHE_RPC_URL'] || 'https://api.avax.network/ext/bc/C/rpc',
                wsUrl: process.env['AVALANCHE_WS_URL'],
                snowtraceApiKey: process.env['SNOWTRACE_API_KEY'],
            },
            arbitrum: {
                rpcUrl: process.env['ARBITRUM_RPC_URL'] || 'https://arbitrum-mainnet.infura.io/v3/',
                wsUrl: process.env['ARBITRUM_WS_URL'],
            },
            optimism: {
                rpcUrl: process.env['OPTIMISM_RPC_URL'] || 'https://optimism-mainnet.infura.io/v3/',
                wsUrl: process.env['OPTIMISM_WS_URL'],
            },
            base: {
                rpcUrl: process.env['BASE_RPC_URL'] || 'https://base-mainnet.infura.io/v3/',
                wsUrl: process.env['BASE_WS_URL'],
            },
            linea: {
                rpcUrl: process.env['LINEA_RPC_URL'] || 'https://linea-mainnet.infura.io/v3/',
                wsUrl: process.env['LINEA_WS_URL'],
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
    getAvalancheConfig() {
        return this.config.avalanche;
    }
    getSolanaConfig() {
        return this.config.solana;
    }
    getArbitrumConfig() {
        return this.config.arbitrum;
    }
    getOptimismConfig() {
        return this.config.optimism;
    }
    getBaseConfig() {
        return this.config.base;
    }
    getLineaConfig() {
        return this.config.linea;
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
    hasAvalancheApiKeys() {
        return !!this.config.avalanche.snowtraceApiKey;
    }
    hasSolanaApiKeys() {
        return !!this.config.solana.solscanApiKey;
    }
    hasArbitrumApiKeys() {
        return !!this.config.arbitrum.rpcUrl;
    }
    hasOptimismApiKeys() {
        return !!this.config.optimism.rpcUrl;
    }
    hasBaseApiKeys() {
        return !!this.config.base.rpcUrl;
    }
    hasLineaApiKeys() {
        return !!this.config.linea.rpcUrl;
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
            avalanche: this.hasAvalancheApiKeys(),
            arbitrum: this.hasArbitrumApiKeys(),
            optimism: this.hasOptimismApiKeys(),
            base: this.hasBaseApiKeys(),
            linea: this.hasLineaApiKeys(),
            solana: this.hasSolanaApiKeys(),
            onelake: this.hasOneLakeConnection(),
        };
    }
}
exports.config = ConfigManager.getInstance();
exports.default = exports.config;
//# sourceMappingURL=config.js.map