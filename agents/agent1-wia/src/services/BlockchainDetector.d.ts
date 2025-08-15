import { BlockchainInfo } from '../types';
export declare class BlockchainDetector {
    private static readonly BLOCKCHAIN_PATTERNS;
    private static readonly BLOCKCHAIN_CONFIGS;
    static detectBlockchain(address: string): {
        blockchain: string;
        confidence: number;
        info: BlockchainInfo;
    };
    private static detectByPattern;
    private static performAdditionalValidation;
    static validateAddress(address: string, blockchain: string): boolean;
    static getSupportedBlockchains(): string[];
    static getBlockchainConfig(blockchain: string): BlockchainInfo;
    static getAllBlockchainConfigs(): Record<string, BlockchainInfo>;
}
//# sourceMappingURL=BlockchainDetector.d.ts.map