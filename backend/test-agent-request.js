const axios = require('axios');

console.log('🧪 Testing Agent Request Simulation...');

const TEST_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';

async function testAgentRequest() {
  try {
    // Test 1: Simulate agent's quick analysis request
    console.log('\n📝 Step 1: Testing Agent Quick Analysis Request...');
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
      
      console.log(`✅ Agent Quick Analysis SUCCESS!`);
      console.log(`   Status: ${quickResponse.status}`);
      console.log(`   Success: ${quickResponse.data.success}`);
      console.log(`   Analysis Type: ${quickResponse.data.analysisType}`);
      
      // Log the FULL response to see what the agent receives
      console.log('\n📊 FULL RESPONSE DATA:');
      console.log(JSON.stringify(quickResponse.data, null, 2));
      
      if (quickResponse.data.data && quickResponse.data.data.blockchains.ethereum) {
        const ethData = quickResponse.data.data.blockchains.ethereum;
        console.log('\n📊 Parsed Ethereum Data:');
        console.log(`   ETH Balance: ${ethData.balance.native} ETH`);
        console.log(`   USD Value: $${ethData.balance.usdValue.toFixed(2)}`);
        console.log(`   Transactions: ${ethData.transactionCount}`);
        console.log(`   Transaction Count Type: ${typeof ethData.transactionCount}`);
      }
      
    } catch (error) {
      console.log(`❌ Agent Quick Analysis failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    // Test 2: Test the exact endpoint the agent might be calling
    console.log('\n📝 Step 2: Testing Different Endpoint Variations...');
    
    const endpoints = [
      '/api/v1/wallet/analyze',
      '/wallet/analyze',
      '/api/wallet/analyze'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing endpoint: ${endpoint}`);
        const response = await axios.post(`http://localhost:3001${endpoint}`, {
          address: TEST_ADDRESS,
          analysisType: 'quick'
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
        
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
        
      } catch (error) {
        console.log(`❌ ${endpoint} - Failed: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

testAgentRequest().catch(console.error);
