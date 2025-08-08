import { BlockchainInfo } from '../types';

export class BlockchainDetector {
  private static readonly BLOCKCHAIN_PATTERNS = {
    ethereum: /^0x[a-fA-F0-9]{40}$/,
    bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$|^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    binance: /^0x[a-fA-F0-9]{40}$/,
    polygon: /^0x[a-fA-F0-9]{40}$/,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    avalanche: /^0x[a-fA-F0-9]{40}$/,
    arbitrum: /^0x[a-fA-F0-9]{40}$/,
    optimism: /^0x[a-fA-F0-9]{40}$/,
  };

  private static readonly BLOCKCHAIN_CONFIGS: Record<string, BlockchainInfo> = {
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/',
      explorerUrl: 'https://etherscan.io',
    },
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      chainId: 0,
      rpcUrl: 'https://blockstream.info/api',
      explorerUrl: 'https://blockstream.info',
    },
    binance: {
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      chainId: 56,
      rpcUrl: 'https://bsc-dataseed.binance.org',
      explorerUrl: 'https://bscscan.com',
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      chainId: 137,
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com',
    },
    solana: {
      name: 'Solana',
      symbol: 'SOL',
      chainId: 101,
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      explorerUrl: 'https://explorer.solana.com',
    },
    avalanche: {
      name: 'Avalanche',
      symbol: 'AVAX',
      chainId: 43114,
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      explorerUrl: 'https://snowtrace.io',
    },
    arbitrum: {
      name: 'Arbitrum',
      symbol: 'ARB',
      chainId: 42161,
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      explorerUrl: 'https://arbiscan.io',
    },
    optimism: {
      name: 'Optimism',
      symbol: 'OP',
      chainId: 10,
      rpcUrl: 'https://mainnet.optimism.io',
      explorerUrl: 'https://optimistic.etherscan.io',
    },
  };

  /**
   * Detect which blockchain a wallet address belongs to
   */
  static detectBlockchain(address: string): { blockchain: string; confidence: number; info: BlockchainInfo } {
    const normalizedAddress = address.trim();
    
    // First, try to detect by specific patterns
    const patternResult = this.detectByPattern(normalizedAddress);
    if (patternResult) {
      return patternResult;
    }

    // If no pattern match, try additional validation
    const validationResult = this.performAdditionalValidation(normalizedAddress);
    if (validationResult) {
      return validationResult;
    }

    throw new Error(`Unable to detect blockchain for address: ${address}`);
  }

  /**
   * Detect blockchain by pattern matching
   */
  private static detectByPattern(address: string): { blockchain: string; confidence: number; info: BlockchainInfo } | null {
    // Bitcoin addresses (Legacy, SegWit, Native SegWit)
    if (address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/) || 
        address.match(/^bc1[a-z0-9]{39,59}$/) ||
        address.match(/^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
      return {
        blockchain: 'bitcoin',
        confidence: 0.95,
        info: this.BLOCKCHAIN_CONFIGS['bitcoin']
      };
    }

    // Solana addresses
    if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      return {
        blockchain: 'solana',
        confidence: 0.95,
        info: this.BLOCKCHAIN_CONFIGS['solana']
      };
    }

    // Ethereum-like addresses (0x...)
    if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
      // For Ethereum-like addresses, we need additional context
      // For now, default to Ethereum with medium confidence
      return {
        blockchain: 'ethereum',
        confidence: 0.7,
        info: this.BLOCKCHAIN_CONFIGS['ethereum']
      };
    }

    return null;
  }

  /**
   * Perform additional validation for ambiguous addresses
   */
  private static performAdditionalValidation(address: string): { blockchain: string; confidence: number; info: BlockchainInfo } | null {
    // Bitcoin addresses with different formats
    if (address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
      return {
        blockchain: 'bitcoin',
        confidence: 0.9,
        info: this.BLOCKCHAIN_CONFIGS['bitcoin']
      };
    }

    // Bitcoin SegWit addresses
    if (address.match(/^bc1[a-z0-9]{39,59}$/)) {
      return {
        blockchain: 'bitcoin',
        confidence: 0.9,
        info: this.BLOCKCHAIN_CONFIGS['bitcoin']
      };
    }

    // Bitcoin P2SH addresses
    if (address.match(/^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
      return {
        blockchain: 'bitcoin',
        confidence: 0.9,
        info: this.BLOCKCHAIN_CONFIGS['bitcoin']
      };
    }

    // Solana addresses
    if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      return {
        blockchain: 'solana',
        confidence: 0.9,
        info: this.BLOCKCHAIN_CONFIGS['solana']
      };
    }

    // Ethereum-like addresses (0x...)
    if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        blockchain: 'ethereum',
        confidence: 0.6,
        info: this.BLOCKCHAIN_CONFIGS['ethereum']
      };
    }

    return null;
  }

  /**
   * Validate if an address is valid for a specific blockchain
   */
  static validateAddress(address: string, blockchain: string): boolean {
    const normalizedAddress = address.trim();
    
    switch (blockchain) {
      case 'bitcoin':
        return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) ||
               /^bc1[a-z0-9]{39,59}$/.test(normalizedAddress) ||
               /^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress);
      
      case 'solana':
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress);
      
      case 'ethereum':
      case 'binance':
      case 'polygon':
      case 'avalanche':
      case 'arbitrum':
      case 'optimism':
        return /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress);
      
      default:
        const pattern = this.BLOCKCHAIN_PATTERNS[blockchain];
        if (!pattern) {
          throw new Error(`Unsupported blockchain: ${blockchain}`);
        }
        return pattern.test(normalizedAddress);
    }
  }

  /**
   * Get all supported blockchains
   */
  static getSupportedBlockchains(): string[] {
    return Object.keys(this.BLOCKCHAIN_PATTERNS);
  }

  /**
   * Get blockchain configuration
   */
  static getBlockchainConfig(blockchain: string): BlockchainInfo {
    const config = this.BLOCKCHAIN_CONFIGS[blockchain];
    if (!config) {
      throw new Error(`Blockchain configuration not found: ${blockchain}`);
    }
    return config;
  }

  /**
   * Get all blockchain configurations
   */
  static getAllBlockchainConfigs(): Record<string, BlockchainInfo> {
    return { ...this.BLOCKCHAIN_CONFIGS };
  }
} 