import { WalletAnalysisService } from '../services/WalletAnalysisService'
import { WalletAnalysisStorage } from '../services/WalletAnalysisStorage'
import dotenv from 'dotenv'

dotenv.config()

async function testWalletAnalysisStorage() {
  console.log('🧪 Testing Wallet Analysis Storage...')
  
  const walletAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
  
  try {
    console.log(`📊 Analyzing wallet: ${walletAddress}`)
    
    // Perform the analysis (this will automatically store the data)
    const analysis = await WalletAnalysisService.analyzeWallet(walletAddress)
    
    console.log('\n✅ Analysis completed successfully!')
    console.log(`📊 Analysis Summary:`)
    console.log(`   • Total Value: $${analysis.totalValue.toFixed(2)}`)
    console.log(`   • Total Transactions: ${analysis.totalTransactions}`)
    console.log(`   • Blockchains: ${Object.keys(analysis.blockchains).join(', ')}`)
    
    // Test reading the stored data
    console.log('\n📖 Testing data retrieval...')
    const storage = new WalletAnalysisStorage()
    
    // List all analyses for this wallet
    const analyses = await storage.listWalletAnalyses(walletAddress)
    console.log(`📁 Found ${analyses.length} stored analyses for ${walletAddress}:`)
    analyses.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`)
    })
    
    if (analyses.length > 0) {
      // Read the most recent analysis
      const latestAnalysis = await storage.readWalletAnalysis(walletAddress)
      if (latestAnalysis) {
        console.log('\n📊 Latest Analysis Data:')
        console.log(`   • Wallet ID: ${latestAnalysis.walletId}`)
        console.log(`   • Analysis Date: ${latestAnalysis.analysisDate}`)
        console.log(`   • Total Value: $${latestAnalysis.totalValue.toFixed(2)}`)
        console.log(`   • Total Transactions: ${latestAnalysis.totalTransactions}`)
        console.log(`   • Blockchains: ${Object.keys(latestAnalysis.blockchains).join(', ')}`)
        
        // Show transaction counts per blockchain
        for (const [blockchain, data] of Object.entries(latestAnalysis.blockchains)) {
          console.log(`   • ${blockchain.toUpperCase()}: ${data.transactions.length} transactions`)
        }
      }
    }
    
    console.log('\n🎉 Wallet Analysis Storage Test Completed Successfully!')
    
  } catch (error) {
    console.error('❌ Error during wallet analysis storage test:', error)
  }
}

// Run the test
testWalletAnalysisStorage().catch(console.error) 