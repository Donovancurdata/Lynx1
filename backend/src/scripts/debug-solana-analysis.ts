import { WalletAnalysisService } from '../services/WalletAnalysisService'
import * as dotenv from 'dotenv'

dotenv.config()

async function debugSolanaAnalysis() {
  console.log('🔍 Debugging Solana Analysis...\n')

  try {
    const solanaWallet = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4'
    
    console.log(`📊 Testing Solana wallet: ${solanaWallet}`)
    
    // Step 1: Test blockchain detection
    console.log('\n🔍 Step 1: Blockchain Detection')
    const detectedBlockchains = WalletAnalysisService.detectAllBlockchains(solanaWallet)
    console.log(`🔗 Detected blockchains: ${detectedBlockchains.join(', ')}`)
    
    // Step 2: Test each blockchain analysis individually
    console.log('\n🔍 Step 2: Individual Blockchain Analysis')
    for (const blockchain of detectedBlockchains) {
      console.log(`\n📊 Testing ${blockchain} analysis...`)
      try {
        let analysis: any
        switch (blockchain) {
          case 'solana':
            analysis = await WalletAnalysisService['analyzeSolanaWallet'](solanaWallet)
            break
          case 'ethereum':
            analysis = await WalletAnalysisService['analyzeEthereumWallet'](solanaWallet)
            break
          default:
            console.log(`⚠️ Skipping ${blockchain} - not implemented`)
            continue
        }
        console.log(`✅ ${blockchain} analysis successful: $${analysis.balance.usdValue.toFixed(2)}`)
      } catch (error) {
        console.log(`❌ ${blockchain} analysis failed:`, error)
      }
    }
    
    // Step 3: Test full analysis
    console.log('\n🔍 Step 3: Full Multi-Blockchain Analysis')
    try {
      const result = await WalletAnalysisService.analyzeWallet(solanaWallet)
      console.log(`✅ Full analysis successful: $${result.totalValue.toFixed(2)}`)
      console.log(`📊 Blockchains analyzed: ${Object.keys(result.blockchains).join(', ')}`)
    } catch (error) {
      console.log(`❌ Full analysis failed:`, error)
    }

  } catch (error) {
    console.error('❌ Error during debug:', error)
  }
}

debugSolanaAnalysis() 