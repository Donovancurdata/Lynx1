import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function testEtherscanAPI() {
  const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
  const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  
  console.log('🔍 Testing Etherscan API...')
  console.log('API Key:', etherscanApiKey ? '✅ Set' : '❌ Not set')
  
  if (!etherscanApiKey) {
    console.log('❌ No Etherscan API key found')
    return
  }
  
  try {
    // Test balance API
    console.log('\n📊 Testing balance API...')
    const balanceResponse = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${testAddress}&tag=latest&apikey=${etherscanApiKey}`)
    const balanceData = await balanceResponse.json()
    console.log('Balance response:', JSON.stringify(balanceData, null, 2))
    
    // Test transaction API
    console.log('\n📊 Testing transaction API...')
    const txResponse = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${testAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${etherscanApiKey}`)
    const txData = await txResponse.json()
    console.log('Transaction response:', JSON.stringify(txData, null, 2))
    
    // Test token API
    console.log('\n📊 Testing token API...')
    const tokenResponse = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${testAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${etherscanApiKey}`)
    const tokenData = await tokenResponse.json()
    console.log('Token response:', JSON.stringify(tokenData, null, 2))
    
  } catch (error) {
    console.error('❌ Error testing Etherscan API:', error)
  }
}

testEtherscanAPI() 