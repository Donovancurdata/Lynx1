import axios from 'axios'

// Test Solana wallet addresses
const SOLANA_WALLETS = [
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Known Solana wallet
  'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK', // Another Solana wallet
  '7NsqJxKd1zuo1oXrX3KkqJzQZ8QZ8QZ8QZ8QZ8QZ8QZ8'  // Invalid wallet for testing
]

async function testSolanaWalletAnalysis() {
  console.log('🧪 Testing Solana Wallet Analysis API...\n')
  
  for (const wallet of SOLANA_WALLETS) {
    console.log(`🔍 Testing wallet: ${wallet}`)
    
    try {
      // Test wallet validation
      console.log('  📋 Testing wallet validation...')
      const validateResponse = await axios.get(`http://localhost:3001/api/v1/wallet/validate/${wallet}`)
      console.log(`  ✅ Validation result:`, validateResponse.data)
      
      // Test wallet analysis
      console.log('  🔍 Testing wallet analysis...')
      const analyzeResponse = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
        address: wallet
      })
      console.log(`  ✅ Analysis result:`, {
        success: analyzeResponse.data.success,
        totalValue: analyzeResponse.data.data?.totalValue,
        totalTransactions: analyzeResponse.data.data?.totalTransactions,
        blockchains: Object.keys(analyzeResponse.data.data?.blockchains || {})
      })
      
      // Test balance endpoint
      console.log('  💰 Testing balance endpoint...')
      const balanceResponse = await axios.get(`http://localhost:3001/api/v1/wallet/balance/${wallet}`)
      console.log(`  ✅ Balance result:`, {
        success: balanceResponse.data.success,
        balance: balanceResponse.data.data?.balance,
        blockchain: balanceResponse.data.data?.blockchain
      })
      
      // Test transactions endpoint
      console.log('  📊 Testing transactions endpoint...')
      const transactionsResponse = await axios.get(`http://localhost:3001/api/v1/wallet/transactions/${wallet}?limit=5`)
      console.log(`  ✅ Transactions result:`, {
        success: transactionsResponse.data.success,
        transactionCount: transactionsResponse.data.data?.transactions?.length,
        totalCount: transactionsResponse.data.data?.totalCount
      })
      
    } catch (error: any) {
      console.log(`  ❌ Error testing wallet ${wallet}:`, error.response?.data || error.message)
    }
    
    console.log('') // Empty line for readability
  }
  
  console.log('🎉 Solana wallet analysis testing complete!')
}

// Run the test
testSolanaWalletAnalysis().catch(console.error) 