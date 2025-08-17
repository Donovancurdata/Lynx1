const axios = require('axios');

async function testSolanaDeepAnalysis() {
  console.log('🧪 Testing Solana Deep Analysis...');
  
  const requestBody = {
    address: 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4',
    blockchainFilter: 'solana'
  };
  
  console.log('📤 Sending request body:', JSON.stringify(requestBody, null, 2));
  
  try {
    // First check if server is running
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check successful:', healthResponse.status);
    
    // Send deep analysis request
    const response = await axios.post('http://localhost:3001/api/v1/wallet/deep-analyze', requestBody);
    
    console.log('✅ Response received:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Analysis Type:', response.data.analysisType);
    console.log('Blockchain Filter:', response.data.blockchainFilter);
    console.log('Analyzed Chains:', response.data.analyzedChains);
    console.log('Total Value:', response.data.data.totalValue);
    console.log('Total Transactions:', response.data.data.totalTransactions);
    console.log('Blockchains found:', Object.keys(response.data.data.blockchains));
    
    // Check if Solana analysis is working
    if (response.data.analyzedChains.includes('solana')) {
      console.log('✅ SUCCESS: Solana analysis is working');
      console.log('🔍 Solana Data:', response.data.data.blockchains.solana);
    } else {
      console.log('❌ FAILED: Solana analysis not working');
    }
    
    // Check if only Solana is analyzed (no Ethereum chains)
    const hasEthereumChains = response.data.analyzedChains.some(chain => 
      ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'linea'].includes(chain)
    );
    
    if (!hasEthereumChains) {
      console.log('✅ SUCCESS: Only Solana chain analyzed (Ethereum chains properly excluded)');
    } else {
      console.log('❌ FAILED: Ethereum chains should be excluded from Solana analysis');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - server not running');
      console.log('💡 Start the server with: npm run consolidated');
    } else if (error.response) {
      console.log('❌ Response error:', error.response.status, error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testSolanaDeepAnalysis();
