import { BlockchainInfo } from '../types';
export declare class BlockchainDetector {
    private static readonly BLOCKCHAIN_PATTERNS;
    private static readonly BLOCKCHAIN_CONFIGS;
    /**
     * Detect which blockchain a wallet address belongs to
     */
    static detectBlockchain(address: string): {
        blockchain: string;
        confidence: number;
        info: BlockchainInfo;
    };
    /**
     * Detect blockchain by pattern matching
     */
    private static detectByPattern;
    /**
     * Perform additional validation for ambiguous addresses
     */
    private static performAdditionalValidation;
    /**
     * Validate if an address is valid for a specific blockchain
     */
    static validateAddress(address: string, blockchain: string): boolean;
    /**
     * Get all supported blockchains
     */
    static getSupportedBlockchains(): string[];
    /**
     * Get blockchain configuration
     */
    static getBlockchainConfig(blockchain: string): BlockchainInfo;
    /**
     * Get all blockchain configurations
     */
    static getAllBlockchainConfigs(): Record<string, BlockchainInfo>;
}
//# sourceMappingURL=BlockchainDetector.d.ts.map