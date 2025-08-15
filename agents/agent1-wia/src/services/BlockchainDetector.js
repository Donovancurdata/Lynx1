"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainDetector = void 0;
class BlockchainDetector {
    static detectBlockchain(address) {
        const normalizedAddress = address.trim();
        const patternResult = this.detectByPattern(normalizedAddress);
        if (patternResult) {
            return patternResult;
        }
        const validationResult = this.performAdditionalValidation(normalizedAddress);
        if (validationResult) {
            return validationResult;
        }
        throw new Error(`Unable to detect blockchain for address: ${address}`);
    }
    static detectByPattern(address) {
        if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
            if (address.length >= 40 || (address.length >= 32 && /^[A-Z]/.test(address))) {
                return {
                    blockchain: 'solana',
                    confidence: 0.95,
                    info: this.BLOCKCHAIN_CONFIGS['solana']
                };
            }
        }
        if (address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/) ||
            address.match(/^bc1[a-z0-9]{39,59}$/) ||
            address.match(/^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
            return {
                blockchain: 'bitcoin',
                confidence: 0.95,
                info: this.BLOCKCHAIN_CONFIGS['bitcoin']
            };
        }
        if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
            return {
                blockchain: 'ethereum',
                confidence: 0.7,
                info: this.BLOCKCHAIN_CONFIGS['ethereum']
            };
        }
        return null;
    }
    static performAdditionalValidation(address) {
        if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
            if (address.length >= 40 || (address.length >= 32 && /^[A-Z]/.test(address))) {
                return {
                    blockchain: 'solana',
                    confidence: 0.9,
                    info: this.BLOCKCHAIN_CONFIGS['solana']
                };
            }
        }
        if (address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
            return {
                blockchain: 'bitcoin',
                confidence: 0.9,
                info: this.BLOCKCHAIN_CONFIGS['bitcoin']
            };
        }
        if (address.match(/^bc1[a-z0-9]{39,59}$/)) {
            return {
                blockchain: 'bitcoin',
                confidence: 0.9,
                info: this.BLOCKCHAIN_CONFIGS['bitcoin']
            };
        }
        if (address.match(/^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
            return {
                blockchain: 'bitcoin',
                confidence: 0.9,
                info: this.BLOCKCHAIN_CONFIGS['bitcoin']
            };
        }
        if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
            return {
                blockchain: 'ethereum',
                confidence: 0.6,
                info: this.BLOCKCHAIN_CONFIGS['ethereum']
            };
        }
        return null;
    }
    static validateAddress(address, blockchain) {
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
    static getSupportedBlockchains() {
        return Object.keys(this.BLOCKCHAIN_PATTERNS);
    }
    static getBlockchainConfig(blockchain) {
        const config = this.BLOCKCHAIN_CONFIGS[blockchain];
        if (!config) {
            throw new Error(`Blockchain configuration not found: ${blockchain}`);
        }
        return config;
    }
    static getAllBlockchainConfigs() {
        return { ...this.BLOCKCHAIN_CONFIGS };
    }
}
exports.BlockchainDetector = BlockchainDetector;
BlockchainDetector.BLOCKCHAIN_PATTERNS = {
    ethereum: /^0x[a-fA-F0-9]{40}$/,
    bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$|^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    binance: /^0x[a-fA-F0-9]{40}$/,
    polygon: /^0x[a-fA-F0-9]{40}$/,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    avalanche: /^0x[a-fA-F0-9]{40}$/,
    arbitrum: /^0x[a-fA-F0-9]{40}$/,
    optimism: /^0x[a-fA-F0-9]{40}$/,
};
BlockchainDetector.BLOCKCHAIN_CONFIGS = {
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
//# sourceMappingURL=BlockchainDetector.js.map