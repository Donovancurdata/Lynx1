import { WalletAnalysisService } from '../services/WalletAnalysisService'
import * as dotenv from 'dotenv'

dotenv.config()

async function testBlockchainDetection() {
  console.log('🔍 Testing Blockchain Detection...\n')

  try {
    const solanaWallet = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4'
    const ethereumWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    
    console.log(`📊 Testing Solana wallet: ${solanaWallet}`)
    console.log(`🔗 Single blockchain detection: ${WalletAnalysisService.detectBlockchain(solanaWallet)}`)
    console.log(`🔗 All blockchains detection: ${WalletAnalysisService.detectAllBlockchains(solanaWallet).join(', ')}`)
    
    console.log(`\n📊 Testing Ethereum wallet: ${ethereumWallet}`)
    console.log(`🔗 Single blockchain detection: ${WalletAnalysisService.detectBlockchain(ethereumWallet)}`)
    console.log(`🔗 All blockchains detection: ${WalletAnalysisService.detectAllBlockchains(ethereumWallet).join(', ')}`)
    
    console.log('\n✅ Blockchain detection test completed!')

  } catch (error) {
    console.error('❌ Error during blockchain detection test:', error)
  }
}

testBlockchainDetection() 