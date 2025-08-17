const axios = require('axios');

console.log('🧪 Testing Both Backend Endpoints...');

const TEST_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';

async function testBothEndpoints() {
  try {
    // Test 1: Quick Analysis endpoint
    console.log('\n📝 Step 1: Testing Quick Analysis endpoint...');
    try {
      const quickResponse = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
        address: TEST_ADDRESS,
        analysisType: 'quick'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log(`✅ Quick Analysis SUCCESS!`);
      console.log(`   Status: ${quickResponse.status}`);
      console.log(`   Success: ${quickResponse.data.success}`);
      console.log(`   Analysis Type: ${quickResponse.data.analysisType}`);
      console.log(`   Total Value: $${quickResponse.data.data.totalValue.toFixed(2)}`);
      console.log(`   Total Transactions: ${quickResponse.data.data.totalTransactions}`);
      
    } catch (quickError) {
      console.log(`❌ Quick Analysis failed: ${quickError.message}`);
      if (quickError.response) {
        console.log(`   Status: ${quickError.response.status}`);
        console.log(`   Data: ${JSON.stringify(quickError.response.data, null, 2)}`);
      }
    }
    
    // Test 2: Deep Analysis endpoint
    console.log('\n📝 Step 2: Testing Deep Analysis endpoint...');
    try {
      const deepResponse = await axios.post('http://localhost:3001/api/v1/wallet/deep-analyze', {
        address: TEST_ADDRESS,
        blockchainFilter: 'ethereum'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log(`✅ Deep Analysis SUCCESS!`);
      console.log(`   Status: ${deepResponse.status}`);
      console.log(`   Success: ${deepResponse.data.success}`);
      console.log(`   Analysis Type: ${deepResponse.data.analysisType}`);
      console.log(`   Blockchain Filter: ${deepResponse.data.blockchainFilter}`);
      console.log(`   Total Value: $${deepResponse.data.data.totalValue.toFixed(2)}`);
      console.log(`   Total Transactions: ${deepResponse.data.data.totalTransactions}`);
      
    } catch (deepError) {
      console.log(`❌ Deep Analysis failed: ${deepError.message}`);
      if (deepError.response) {
        console.log(`   Status: ${deepError.response.status}`);
        console.log(`   Data: ${JSON.stringify(deepError.response.data, null, 2)}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ General error: ${error.message}`);
  }
}

testBothEndpoints().catch(console.error);
