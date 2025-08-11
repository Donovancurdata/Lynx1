const axios = require('axios');

async function testDebugUSD() {
  console.log('🧪 Testing USD Value Calculation with Debug Output...\n');
  
  try {
    console.log('1️⃣ Testing Backend Health...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Backend Health:', healthResponse.data.status);
    
    console.log('\n2️⃣ Testing Wallet Analysis (should show detailed USD calculation debug)...');
    const analysisResponse = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
      address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
      analysisType: 'quick'
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Wallet Analysis Response:');
    console.log(`   Success: ${analysisResponse.data.success}`);
    console.log(`   Address: ${analysisResponse.data.data.address}`);
    console.log(`   Total Value: $${analysisResponse.data.data.totalValue}`);
    
    const blockchain = Object.keys(analysisResponse.data.data.blockchains)[0];
    const blockchainData = analysisResponse.data.data.blockchains[blockchain];
    
    console.log(`   Blockchain: ${blockchain}`);
    console.log(`   Native Balance: ${blockchainData.balance.native} ETH`);
    console.log(`   USD Value: $${blockchainData.balance.usdValue}`);
    
    console.log('\n🎉 Test Complete!');
    console.log('   Check the backend console for detailed USD calculation debug output');
    console.log('   This should show which price API is being used and the calculation steps');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testDebugUSD();
