import { BlockchainServiceFactory } from './services/blockchain/BlockchainServiceFactory';
import { BlockchainDetector } from './services/BlockchainDetector';
import { logger } from './utils/logger';

/**
 * Test script for blockchain services
 * Verifies all blockchain connections and functionality
 */
async function testBlockchainServices() {
  try {
    logger.info('Starting blockchain services test...');
    
    // Initialize blockchain factory
    const factory = BlockchainServiceFactory.getInstance();
    
    // Get supported blockchains
    const supportedBlockchains = factory.getSupportedBlockchains();
    logger.info('Supported blockchains:', supportedBlockchains);
    
    // Get blockchain information
    const blockchainInfo = factory.getAllBlockchainInfo();
    logger.info('Blockchain information:', blockchainInfo);
    
    // Test service health
    const health = await factory.getServiceHealth();
    logger.info('Service health:', health);
    
    // Test blockchain detector
    const detector = new BlockchainDetector();
    
    // Test addresses for each blockchain
    const testAddresses = [
      {
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        expected: 'ethereum',
        description: 'Ethereum address'
      },
      {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        expected: 'bitcoin',
        description: 'Bitcoin address'
      },
      {
        address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
        expected: 'binance',
        description: 'BSC address'
      },
      {
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        expected: 'polygon',
        description: 'Polygon address'
      },
      {
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        expected: 'solana',
        description: 'Solana address'
      }
    ];
    
    logger.info('\n=== Testing Blockchain Detection ===');
    for (const test of testAddresses) {
      try {
        const detection = BlockchainDetector.detectBlockchain(test.address);
        const isCorrect = detection.blockchain === test.expected;
        const status = isCorrect ? '✅' : '❌';
        
        logger.info(`${status} ${test.description}:`);
        logger.info(`  Address: ${test.address}`);
        logger.info(`  Detected: ${detection.blockchain}`);
        logger.info(`  Expected: ${test.expected}`);
        logger.info(`  Confidence: ${detection.confidence}`);
        logger.info(`  Correct: ${isCorrect}`);
        logger.info('');
        
      } catch (error) {
        logger.error(`❌ Failed to detect blockchain for ${test.description}: ${error}`);
      }
    }
    
    // Test address validation
    logger.info('\n=== Testing Address Validation ===');
    for (const test of testAddresses) {
      try {
        const isValid = factory.validateAddress(test.address, test.expected);
        const status = isValid ? '✅' : '❌';
        
        logger.info(`${status} ${test.description}:`);
        logger.info(`  Address: ${test.address}`);
        logger.info(`  Blockchain: ${test.expected}`);
        logger.info(`  Valid: ${isValid}`);
        logger.info('');
        
      } catch (error) {
        logger.error(`❌ Failed to validate address for ${test.description}: ${error}`);
      }
    }
    
    // Test balance retrieval (for one address)
    logger.info('\n=== Testing Balance Retrieval ===');
    const testAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    const testBlockchain = 'ethereum';
    
    try {
      const balance = await factory.getBalance(testAddress, testBlockchain);
      logger.info(`✅ Balance retrieved for ${testAddress} on ${testBlockchain}:`);
      logger.info(`  Balance: ${balance.balance}`);
      logger.info(`  USD Value: $${balance.usdValue}`);
      logger.info(`  Last Updated: ${balance.lastUpdated}`);
      logger.info('');
      
    } catch (error) {
      logger.error(`❌ Failed to get balance for ${testAddress} on ${testBlockchain}: ${error}`);
    }
    
    // Test transaction history retrieval
    logger.info('\n=== Testing Transaction History ===');
    try {
      const transactions = await factory.getTransactionHistory(testAddress, testBlockchain);
      logger.info(`✅ Transaction history retrieved for ${testAddress} on ${testBlockchain}:`);
      logger.info(`  Transaction count: ${transactions.length}`);
      if (transactions.length > 0) {
        logger.info(`  Latest transaction: ${transactions[0].hash}`);
        logger.info(`  Latest transaction date: ${transactions[0].timestamp}`);
      }
      logger.info('');
      
    } catch (error) {
      logger.error(`❌ Failed to get transaction history for ${testAddress} on ${testBlockchain}: ${error}`);
    }
    
    // Test comprehensive wallet data
    logger.info('\n=== Testing Comprehensive Wallet Data ===');
    try {
      const walletData = await factory.getWalletData(testAddress, testBlockchain);
      logger.info(`✅ Comprehensive wallet data retrieved for ${testAddress} on ${testBlockchain}:`);
      logger.info(`  Balance: ${walletData.balance.balance} ($${walletData.balance.usdValue})`);
      logger.info(`  Transactions: ${walletData.transactions.length}`);
      logger.info(`  Blockchain: ${walletData.blockchainInfo.name} (${walletData.blockchainInfo.symbol})`);
      logger.info('');
      
    } catch (error) {
      logger.error(`❌ Failed to get comprehensive wallet data for ${testAddress} on ${testBlockchain}: ${error}`);
    }
    
    logger.info('Blockchain services test completed!');
    
  } catch (error) {
    logger.error('Blockchain services test failed:', error);
  }
}

// Run the test if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  testBlockchainServices().catch(console.error);
}

export { testBlockchainServices }; 