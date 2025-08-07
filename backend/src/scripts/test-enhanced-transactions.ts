import { WalletAnalysisStorage } from '../services/WalletAnalysisStorage'
import * as dotenv from 'dotenv'

dotenv.config()

async function testEnhancedTransactions() {
  console.log('🔍 Testing Enhanced Transaction Data with Token Information...\n')

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

            console.log('\n🔗 Blockchain breakdown with enhanced transaction data:')
            for (const [blockchain, data] of Object.entries(analysisData.blockchains)) {
              console.log(`\n  • ${blockchain.toUpperCase()}:`)
              console.log(`    - Balance: ${data.balance.value} ($${data.balance.usdValue.toFixed(2)})`)
              console.log(`    - Total transactions: ${data.totalTransactionCount}`)
              console.log(`    - Token transactions: ${data.tokenTransactionCount}`)
              console.log(`    - Historical trading value: $${data.historicalTradingValue.toFixed(2)}`)
              console.log(`    - Stored transactions: ${data.transactions.length}`)

              // Show enhanced transaction data with token information
              if (data.transactions.length > 0) {
                console.log(`    - Enhanced transaction examples:`)
                data.transactions.slice(0, 5).forEach((tx, index) => {
                  const date = new Date(tx.timestamp)
                  const isTokenTransfer = tx.isTokenTransfer || false
                  const tokenInfo = isTokenTransfer ? 
                    `[TOKEN: ${tx.tokenSymbol || 'Unknown'} - ${tx.tokenValue || '0'} ${tx.tokenSymbol || 'tokens'}]` : 
                    ''
                  
                  console.log(`      ${index + 1}. ${date.toLocaleDateString()} - ${tx.value} ${tx.currency} ${tokenInfo}`)
                  
                  // Show additional token details if available
                  if (isTokenTransfer && tx.tokenAddress) {
                    console.log(`         Token Address: ${tx.tokenAddress}`)
                    console.log(`         Token Decimals: ${tx.tokenDecimals || 'Unknown'}`)
                  }
                })
                
                if (data.transactions.length > 5) {
                  console.log(`      ... and ${data.transactions.length - 5} more transactions`)
                }
              }
            }
          } else {
            console.log('❌ Failed to read analysis data')
          }
        } else {
          console.log('⚠️ No stored analyses found')
        }
      }

      console.log('\n✅ Enhanced transaction data test completed!')
      console.log('\n💡 Key Features:')
      console.log('   • Token transfers now show token symbol and amount')
      console.log('   • Native currency transfers show ETH/BNB/MATIC/AVAX')
      console.log('   • Token addresses and decimals are included')
      console.log('   • isTokenTransfer flag identifies token vs native transfers')

    } else {
      console.log('⚠️ No stored analyses found')
    }

  } catch (error) {
    console.error('❌ Error during enhanced transaction test:', error)
  }
}

testEnhancedTransactions() 