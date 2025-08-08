import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

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

class ConfigManager {
  private static instance: ConfigManager;
  private config: BlockchainConfig;

  private constructor() {
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

  public getSolanaConfig() {
    return this.config.solana;
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

  public hasSolanaApiKeys(): boolean {
    return !!this.config.solana.solscanApiKey;
  }

  public hasOneLakeConnection(): boolean {
    return !!this.config.onelake.connectionString;
  }

  public validateApiKeys(): {
    ethereum: boolean;
    bitcoin: boolean;
    binance: boolean;
    polygon: boolean;
    solana: boolean;
    onelake: boolean;
  } {
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

export const config = ConfigManager.getInstance();
export default config; 