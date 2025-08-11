import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

// Import environment variables
const {
  NODE_ENV = 'development',
  PORT = '3001',
  LOG_LEVEL = 'info',
  SOLANA_RPC_URL,
  SOLSCAN_API_KEY
} = process.env

async function testSolanaAPI() {
  // Log environment configuration
  console.log('🔍 Testing Solana Wallet Analysis via API...\n')
  console.log(`🔧 Environment: ${NODE_ENV}`)
  console.log(`📝 Log Level: ${LOG_LEVEL}`)
  console.log(`🔗 Solana RPC: ${SOLANA_RPC_URL || 'Not configured'}`)
  console.log(`🌐 API Port: ${PORT}`)

  try {
    const solanaWallet = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4'
    
    console.log(`📊 Testing API with Solana wallet: ${solanaWallet}`)
    
    const response = await fetch('http://localhost:3001/api/v1/wallet/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: solanaWallet
      })
    })

    console.log(`📊 API Response Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Response:')
      console.log(JSON.stringify(data, null, 2))
    } else {
      const errorData = await response.json()
      console.log('❌ API Error:')
      console.log(JSON.stringify(errorData, null, 2))
    }

  } catch (error) {
    console.error('❌ Error during API test:', error)
  }
}

testSolanaAPI() 