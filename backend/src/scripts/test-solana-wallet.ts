import { WalletAnalysisService } from '../services/WalletAnalysisService'
import * as dotenv from 'dotenv'

dotenv.config()

async function testSolanaWallet() {
  console.log('🔍 Testing Solana Wallet Analysis...\n')

  try {
    // Test Solana wallet address
    const solanaWallet = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4'

    console.log(`📊 Analyzing Solana wallet: ${solanaWallet}`)
    
    // Detect blockchains for this address
    const detectedBlockchains = WalletAnalysisService.detectAllBlockchains(solanaWallet)
    console.log(`🔗 Detected blockchains: ${detectedBlockchains.join(', ')}`)

    // Run the analysis
    const analysis = await WalletAnalysisService.analyzeWallet(solanaWallet)
    
    console.log('\n📊 Analysis Results:')
    console.log(`   • Total Value: $${analysis.totalValue.toFixed(2)}`)
    console.log(`   • Total Transactions: ${analysis.totalTransactions}`)
    console.log(`   • Blockchains: ${Object.keys(analysis.blockchains).join(', ')}`)

    // Show detailed results for each blockchain
    for (const [blockchain, blockchainData] of Object.entries(analysis.blockchains)) {
      console.log(`\n🔗 ${blockchain.toUpperCase()} Analysis:`)
      console.log(`   • Native balance: ${blockchainData.balance.native} ($${blockchainData.balance.usdValue.toFixed(2)})`)
      console.log(`   • Token count: ${blockchainData.totalTokens}`)
      console.log(`   • Transaction count: ${blockchainData.transactionCount}`)
      console.log(`   • Token transaction count: ${blockchainData.tokenTransactionCount}`)
      console.log(`   • Historical trading value: $${blockchainData.totalLifetimeValue.toFixed(2)}`)
      
      if (blockchainData.topTokens.length > 0) {
        console.log(`   • Top tokens:`)
        blockchainData.topTokens.forEach((token, index) => {
          console.log(`     ${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue.toFixed(2)})`)
        })
      }

      if (blockchainData.recentTransactions.length > 0) {
        console.log(`   • Recent transactions:`)
        blockchainData.recentTransactions.slice(0, 5).forEach((tx, index) => {
          const date = new Date(tx.timestamp)
          const tokenInfo = tx.isTokenTransfer && tx.tokenSymbol 
            ? ` [TOKEN: ${tx.tokenSymbol} - ${tx.tokenValue || '0'} ${tx.tokenSymbol}]`
            : ''
          console.log(`     ${index + 1}. ${date.toLocaleDateString()} - ${tx.value} ${tx.currency}${tokenInfo}`)
        })
      }
    }

    console.log('\n✅ Solana wallet analysis completed!')

  } catch (error) {
    console.error('❌ Error during Solana wallet analysis:', error)
  }
}

testSolanaWallet() 