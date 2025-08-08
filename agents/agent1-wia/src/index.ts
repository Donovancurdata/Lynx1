// Main Agent 1 WIA exports
export { Agent1WIA } from './Agent1WIA';

// Service exports
export { WalletInvestigator } from './services/WalletInvestigator';
export { BlockchainDetector } from './services/BlockchainDetector';
export { TransactionAnalyzer } from './services/TransactionAnalyzer';
export { FundFlowTracker } from './services/FundFlowTracker';
export { WalletOpinionGenerator } from './services/WalletOpinionGenerator';
export { RiskAnalyzer } from './services/RiskAnalyzer';
export { DataStorage } from './services/DataStorage';

// Blockchain service exports
export { BlockchainServiceFactory } from './services/blockchain/BlockchainServiceFactory';
export { EthereumService } from './services/blockchain/EthereumService';
export { BitcoinService } from './services/blockchain/BitcoinService';
export { BinanceService } from './services/blockchain/BinanceService';
export { PolygonService } from './services/blockchain/PolygonService';
export { SolanaService } from './services/blockchain/SolanaService';

// Type exports
export * from './types';

// Utility exports
export { logger } from './utils/logger'; 