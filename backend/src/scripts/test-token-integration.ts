import { WalletAnalysisService } from '../services/WalletAnalysisService'
import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'

dotenv.config()

async function testTokenIntegration() {
  console.log('🧪 Testing Token Data Integration with Wallet Analysis...\n')
  
  try {
    // Step 1: Check what tokens we have in Azure storage
    console.log('📊 Step 1: Checking Azure token data...')
    const collector = new TokenDataCollector()
    
    try {
      const existingTokens = await collector.readTokens()
      console.log(`✅ Found ${existingTokens.length} tokens in Azure storage`)
      
      if (existingTokens.length > 0) {
        console.log('\n📋 Sample tokens from Azure:')
        existingTokens.slice(0, 5).forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.symbol} (${token.blockchain})`)
        })
      }
    } catch (error) {
      console.log('⚠️ Could not read tokens from Azure:', error)
    }
    
    // Step 2: Test wallet analysis with a known wallet
    console.log('\n🔍 Step 2: Testing wallet analysis with collected token data...')
    const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    
    console.log(`📱 Analyzing wallet: ${testWallet}`)
    const analysis = await WalletAnalysisService.analyzeWallet(testWallet)
    
    // Step 3: Show results and check if collected data was used
    console.log('\n📊 Analysis Results:')
    console.log(`   • Total value: $${analysis.totalValue.toFixed(2)}`)
    console.log(`   • Total transactions: ${analysis.totalTransactions}`)
    console.log(`   • Blockchains analyzed: ${Object.keys(analysis.blockchains).join(', ')}`)
    
    // Check each blockchain for token data
    Object.entries(analysis.blockchains).forEach(([blockchain, data]) => {
      console.log(`\n🔗 ${blockchain.toUpperCase()} Analysis:`)
      console.log(`   • Native balance: ${data.balance.native} ($${data.balance.usdValue.toFixed(2)})`)
      console.log(`   • Token count: ${data.tokens.length}`)
      
      if (data.tokens.length > 0) {
        console.log(`   • Top tokens:`)
        data.tokens.slice(0, 3).forEach((token, index) => {
          console.log(`     ${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue.toFixed(2)})`)
        })
      }
    })
    
    // Step 4: Check if we can see evidence of collected data usage
    console.log('\n🔍 Step 3: Checking for collected data usage...')
    console.log('💡 Look for "Using collected data price" messages in the logs above')
    console.log('💡 If you see those messages, the integration is working!')
    
    console.log('\n✅ Token integration test completed!')
    
  } catch (error) {
    console.error('❌ Error during token integration test:', error)
  }
}

// Run the test
testTokenIntegration().catch(console.error) 