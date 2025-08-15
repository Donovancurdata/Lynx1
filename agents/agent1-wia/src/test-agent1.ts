import { Agent1WIA } from './Agent1WIA';
import { WalletInvestigationRequest } from './types';
import { logger } from './utils/logger';

/**
 * Test script for Agent 1 WIA
 * Demonstrates the wallet investigation capabilities
 */
async function testAgent1() {
  try {
    logger.info('Starting Agent 1 WIA test...');
    
    // Initialize Agent 1
    const agent1 = new Agent1WIA();
    
    // Get agent information
    const agentInfo = agent1.getAgentInfo();
    logger.info('Agent 1 Info:', agentInfo);
    
    // Get service health
    const health = await agent1.getServiceHealth();
    logger.info('Service Health:', health);
    
    // Get supported blockchains
    const supportedBlockchains = agent1.getSupportedBlockchains();
    logger.info('Supported Blockchains:', supportedBlockchains);
    
    // Test wallet addresses for different blockchains (using valid addresses)
    const testWallets = [
      {
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Ethereum (valid checksum)
        description: 'Ethereum wallet'
      },
      {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Bitcoin
        description: 'Bitcoin wallet'
      },
      {
        address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3', // Binance Smart Chain
        description: 'BSC wallet'
      },
      {
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // Polygon
        description: 'Polygon wallet'
      },
      {
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Solana
        description: 'Solana wallet'
      }
    ];
    
    // Test blockchain detection
    logger.info('\n=== Testing Blockchain Detection ===');
    for (const wallet of testWallets) {
      try {
        const detection = await agent1.detectBlockchain(wallet.address);
        logger.info(`${wallet.description}: ${detection.blockchain} (confidence: ${detection.confidence})`);
      } catch (error) {
        logger.error(`Failed to detect blockchain for ${wallet.description}: ${error}`);
      }
    }
    
    // Test comprehensive investigation with Bitcoin (which we know works)
    logger.info('\n=== Testing Comprehensive Investigation ===');
    const investigationRequest: WalletInvestigationRequest = {
      walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Using Bitcoin address that works
      blockchain: 'bitcoin',
      includeTokenTransfers: true,
      includeInternalTransactions: true,
      maxTransactions: 100,
      priority: 'medium'
    };
    
    const investigationResult = await agent1.investigateWallet(investigationRequest);
    
    if (investigationResult.success && investigationResult.data) {
      // Check if it's actual investigation data or job status
      if ('walletAddress' in investigationResult.data) {
        logger.info('Investigation completed successfully!');
        logger.info(`Wallet: ${investigationResult.data.walletAddress}`);
        logger.info(`Blockchain: ${investigationResult.data.blockchain}`);
        logger.info(`Balance: ${investigationResult.data.balance.balance} ($${investigationResult.data.balance.usdValue})`);
        logger.info(`Transactions: ${investigationResult.data.transactions.length}`);
        logger.info(`Wallet Type: ${investigationResult.data.walletOpinion.walletType}`);
        logger.info(`Risk Level: ${investigationResult.data.riskAssessment.riskLevel}`);
        logger.info(`Activity Level: ${investigationResult.data.walletOpinion.activityLevel}`);
      } else {
        // It's a job status response
        logger.info('Job submitted successfully!');
        logger.info(`Job ID: ${investigationResult.data.jobId}`);
        logger.info(`Status: ${investigationResult.data.status}`);
        logger.info(`Progress: ${investigationResult.data.progress}%`);
        if (investigationResult.data.message) {
          logger.info(`Message: ${investigationResult.data.message}`);
        }
      }
    } else {
      logger.error('Investigation failed:', investigationResult.error);
    }
    
    // Test multi-chain balance check with Bitcoin
    logger.info('\n=== Testing Multi-Chain Balance ===');
    const multiChainBalance = await agent1.getMultiChainBalance('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    logger.info('Multi-chain balance results:', multiChainBalance);
    
    logger.info('\nAgent 1 WIA test completed successfully!');
    
  } catch (error) {
    logger.error('Agent 1 WIA test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAgent1().catch(console.error);
}

export { testAgent1 }; 