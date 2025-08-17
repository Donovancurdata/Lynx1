const axios = require('axios');

console.log('🧪 Testing Frontend Connection to Backend...');

const TEST_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';

async function testFrontendConnection() {
  try {
    // Test 1: Test the exact endpoint the frontend calls
    console.log('\n📝 Step 1: Testing Frontend Quick Analysis Endpoint...');
    try {
      const response = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
        address: TEST_ADDRESS,
        analysisType: 'quick'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        timeout: 30000
      });
      
      console.log(`✅ Frontend Connection SUCCESS!`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${response.data.success}`);
      console.log(`   Analysis Type: ${response.data.analysisType}`);
      
      if (response.data.data && response.data.data.blockchains.ethereum) {
        const ethData = response.data.data.blockchains.ethereum;
        console.log('\n📊 Frontend Received Data:');
        console.log(`   ETH Balance: ${ethData.balance.native} ETH`);
        console.log(`   USD Value: $${ethData.balance.usdValue.toFixed(2)}`);
        console.log(`   Transactions: ${ethData.transactionCount}`);
        console.log(`   Total Transactions: ${response.data.data.totalTransactions}`);
      }
      
      console.log('\n📊 Full Response Structure:');
      console.log(`   Total Value: $${response.data.data.totalValue.toFixed(2)}`);
      console.log(`   Total Transactions: ${response.data.data.totalTransactions}`);
      console.log(`   Blockchains: ${Object.keys(response.data.data.blockchains).join(', ')}`);
      
    } catch (error) {
      console.log(`❌ Frontend Connection failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    // Test 2: Test with query parameters like frontend does
    console.log('\n📝 Step 2: Testing with Frontend Query Parameters...');
    try {
      const url = `http://localhost:3001/api/v1/wallet/analyze?t=${Date.now()}&v=2`;
      const response = await axios.post(url, {
        address: TEST_ADDRESS,
        analysisType: 'quick'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        timeout: 30000
      });
      
      console.log(`✅ Frontend Query Parameters SUCCESS!`);
      console.log(`   URL: ${url}`);
      console.log(`   Status: ${response.status}`);
      
    } catch (error) {
      console.log(`❌ Frontend Query Parameters failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

testFrontendConnection().catch(console.error);
