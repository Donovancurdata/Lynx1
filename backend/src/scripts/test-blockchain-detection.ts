import { WalletAnalysisService } from '../services/WalletAnalysisService'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

// Import environment variables
const {
  NODE_ENV = 'development',
  LOG_LEVEL = 'info',
  SOLANA_RPC_URL,
  SOLSCAN_API_KEY,
  ETHERSCAN_API_KEY
} = process.env

async function testBlockchainDetection() {
  // Log environment configuration
  console.log('🔍 Testing Blockchain Detection...\n')
  console.log(`🔧 Environment: ${NODE_ENV}`)
  console.log(`📝 Log Level: ${LOG_LEVEL}`)
  console.log(`🔗 Solana RPC: ${SOLANA_RPC_URL || 'Not configured'}`)

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