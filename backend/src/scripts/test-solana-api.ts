import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()

async function testSolanaAPI() {
  console.log('🔍 Testing Solana Wallet Analysis via API...\n')

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