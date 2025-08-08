import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

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

class ConfigManager {
  private static instance: ConfigManager;
  private config: BlockchainConfig;

  private constructor() {
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

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): BlockchainConfig {
    return this.config;
  }

  public getEthereumConfig() {
    return this.config.ethereum;
  }

  public getBitcoinConfig() {
    return this.config.bitcoin;
  }

  public getBinanceConfig() {
    return this.config.binance;
  }

  public getPolygonConfig() {
    return this.config.polygon;
  }

  public getAvalancheConfig() {
    return this.config.avalanche;
  }

  public getSolanaConfig() {
    return this.config.solana;
  }

  public getArbitrumConfig() {
    return this.config.arbitrum;
  }

  public getOptimismConfig() {
    return this.config.optimism;
  }

  public getBaseConfig() {
    return this.config.base;
  }

  public getLineaConfig() {
    return this.config.linea;
  }

  public getOneLakeConfig() {
    return this.config.onelake;
  }

  public getEnvironmentConfig() {
    return this.config.environment;
  }

  public isProduction(): boolean {
    return this.config.environment.nodeEnv === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.environment.nodeEnv === 'development';
  }

  public hasEthereumApiKeys(): boolean {
    return !!(this.config.ethereum.infuraProjectId || this.config.ethereum.etherscanApiKey);
  }

  public hasBitcoinApiKeys(): boolean {
    return !!(this.config.bitcoin.blockcypherApiKey || this.config.bitcoin.btcscanApiUrl);
  }

  public hasBinanceApiKeys(): boolean {
    return !!this.config.binance.bscscanApiKey;
  }

  public hasPolygonApiKeys(): boolean {
    return !!this.config.polygon.polygonscanApiKey;
  }

  public hasAvalancheApiKeys(): boolean {
    return !!this.config.avalanche.snowtraceApiKey;
  }

  public hasSolanaApiKeys(): boolean {
    return !!this.config.solana.solscanApiKey;
  }

  public hasArbitrumApiKeys(): boolean {
    return !!this.config.arbitrum.rpcUrl;
  }

  public hasOptimismApiKeys(): boolean {
    return !!this.config.optimism.rpcUrl;
  }

  public hasBaseApiKeys(): boolean {
    return !!this.config.base.rpcUrl;
  }

  public hasLineaApiKeys(): boolean {
    return !!this.config.linea.rpcUrl;
  }

  public hasOneLakeConnection(): boolean {
    return !!this.config.onelake.connectionString;
  }

  public validateApiKeys(): {
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
  } {
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

export const config = ConfigManager.getInstance();
export default config; 