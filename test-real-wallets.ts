import { Agent1WIA } from './agents/agent1-wia/src/Agent1WIA.ts'
import { logger } from './agents/agent1-wia/src/utils/logger.ts'

// Real wallet addresses for testing (these are public addresses)
const TEST_WALLETS = {
  ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Vitalik's wallet
  bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Genesis block address
  binance: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3', // Binance hot wallet
  polygon: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC token contract
  solana: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' // Solana test wallet
}

async function testRealWallets() {
  const agent = new Agent1WIA()
  
  logger.info('🔍 Testing Agent 1 WIA with Real Wallet Addresses...')
  
  for (const [blockchain, address] of Object.entries(TEST_WALLETS)) {
    try {
      logger.info(`\n=== Testing ${blockchain.toUpperCase()} Wallet ===`)
      logger.info(`Address: ${address}`)
      
      // Test 1: Validate address
      logger.info('\n1. Validating address...')
      const validation = agent.validateAddress(address, blockchain)
      logger.info(`✅ Validation: ${validation}`)
      
      // Test 2: Get balance
      logger.info('\n2. Getting balance...')
      const balance = await agent.getWalletData(address, blockchain)
      logger.info(`💰 Balance: ${JSON.stringify(balance.balance, null, 2)}`)
      
      // Test 3: Get transaction history
      logger.info('\n3. Getting transaction history...')
      logger.info(`📊 Transactions: ${balance.transactions.length} found`)
      if (balance.transactions.length > 0) {
        logger.info(`Latest transaction: ${JSON.stringify(balance.transactions[0], null, 2)}`)
      }
      
      // Test 4: Full investigation
      logger.info('\n4. Running full investigation...')
      const investigation = await agent.investigateWallet({ walletAddress: address, blockchain })
      logger.info(`🔍 Investigation: ${JSON.stringify(investigation, null, 2)}`)
      
    } catch (error) {
      logger.error(`❌ ${blockchain} test failed: ${error}`)
    }
  }
  
  logger.info('\n🎉 Real wallet testing completed!')
}

// Run the test
testRealWallets().catch(console.error) 