import { WalletAnalysisStorage } from '../services/WalletAnalysisStorage'
import * as dotenv from 'dotenv'

dotenv.config()

async function testWalletStorageVerification() {
  console.log('🔍 Testing Wallet Analysis Storage Verification...\n')
  
  try {
    const storage = new WalletAnalysisStorage()
    
    // Test wallet address
    const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    
    console.log('📊 Step 1: Listing all stored wallet analyses...')
    const analyses = await storage.listWalletAnalyses()
    console.log(`✅ Found ${analyses.length} stored wallet analyses`)
    
    if (analyses.length > 0) {
      console.log('\n📋 Stored analyses:')
      analyses.forEach((analysis, index) => {
        console.log(`  ${index + 1}. ${analysis}`)
      })
    }
    
    console.log('\n📊 Step 2: Reading the most recent analysis...')
    if (analyses.length > 0) {
      const latestAnalysis = analyses[analyses.length - 1]
      if (latestAnalysis) {
        const analysisData = await storage.readWalletAnalysis(latestAnalysis)
      
      if (analysisData) {
        console.log(`✅ Successfully read analysis for ${analysisData.walletId}`)
        console.log(`📅 Analysis date: ${analysisData.analysisDate}`)
        console.log(`💰 Total value: $${analysisData.totalValue.toFixed(2)}`)
        console.log(`📊 Total transactions: ${analysisData.totalTransactions}`)
        
        console.log('\n🔗 Blockchain breakdown:')
        for (const [blockchain, data] of Object.entries(analysisData.blockchains)) {
          console.log(`  • ${blockchain.toUpperCase()}:`)
          console.log(`    - Balance: ${data.balance.value} ($${data.balance.usdValue.toFixed(2)})`)
          console.log(`    - Total transactions: ${data.totalTransactionCount}`)
          console.log(`    - Token transactions: ${data.tokenTransactionCount}`)
          console.log(`    - Historical trading value: $${data.historicalTradingValue.toFixed(2)}`)
          console.log(`    - Stored transactions: ${data.transactions.length}`)
          
          // Show some sample transactions
          if (data.transactions.length > 0) {
            console.log(`    - Sample transactions:`)
            data.transactions.slice(0, 3).forEach((tx, index) => {
              const date = new Date(tx.timestamp)
              console.log(`      ${index + 1}. ${date.toLocaleDateString()} - ${tx.value} ${data.balance.currency}`)
            })
            if (data.transactions.length > 3) {
              console.log(`      ... and ${data.transactions.length - 3} more transactions`)
            }
          }
        }
      } else {
        console.log('❌ Failed to read analysis data')
      }
      } else {
        console.log('⚠️ No stored analyses found')
      }
    } else {
      console.log('⚠️ No stored analyses found')
    }
    
    console.log('\n✅ Wallet storage verification completed!')
    
  } catch (error) {
    console.error('❌ Error during wallet storage verification:', error)
  }
}

testWalletStorageVerification() 