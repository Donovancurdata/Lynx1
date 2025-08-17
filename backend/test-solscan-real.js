const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY;
const TEST_ADDRESS = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4';

console.log('🧪 Testing Solscan API directly with real data...');
console.log(`🔑 API Key: ${SOLSCAN_API_KEY?.substring(0, 20)}...`);
console.log(`📝 Test Address: ${TEST_ADDRESS}`);

async function testSolscanAPI() {
  // Test different possible endpoints and authentication methods
  const testCases = [
    {
      name: 'Account Info - Bearer Token',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Account Info - Token Header',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: { 'token': SOLSCAN_API_KEY }
    },
    {
      name: 'Account Info - X-API-Key',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: { 'X-API-Key': SOLSCAN_API_KEY }
    },
    {
      name: 'Account Info - API Key Query Param',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}&apikey=${SOLSCAN_API_KEY}`,
      headers: {}
    },
    {
      name: 'Account Info - No Auth',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: {}
    },
    {
      name: 'Account Info - Public API',
      url: `https://public-api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: {}
    },
    {
      name: 'Account Info - V2 API',
      url: `https://api.solscan.io/v2/account?address=${TEST_ADDRESS}`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 Testing: ${testCase.name}`);
      console.log(`📡 URL: ${testCase.url}`);
      console.log(`🔑 Headers:`, JSON.stringify(testCase.headers, null, 2));

      const response = await axios.get(testCase.url, {
        headers: testCase.headers,
        timeout: 10000
      });

      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Response keys: ${Object.keys(response.data).join(', ')}`);
      console.log(`📄 Full response:`, JSON.stringify(response.data, null, 2));

      // Check for balance data
      if (response.data.data && response.data.data.lamports) {
        const balance = response.data.data.lamports / Math.pow(10, 9);
        console.log(`💰 SOL Balance: ${balance}`);
      }

    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Status Text: ${error.response.statusText}`);
        console.log(`   Headers:`, JSON.stringify(error.response.headers, null, 2));
        console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log(`   Request was made but no response received`);
        console.log(`   Request:`, JSON.stringify(error.request, null, 2));
      }
    }
  }

  // Test transaction endpoints
  console.log('\n🔍 Testing Transaction Endpoints...');
  const txTestCases = [
    {
      name: 'Transactions - Bearer Token',
      url: `https://api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Transactions - Token Header',
      url: `https://api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: { 'token': SOLSCAN_API_KEY }
    },
    {
      name: 'Transactions - X-API-Key',
      url: `https://api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: { 'X-API-Key': SOLSCAN_API_KEY }
    },
    {
      name: 'Transactions - API Key Query Param',
      url: `https://api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10&apikey=${SOLSCAN_API_KEY}`,
      headers: {}
    },
    {
      name: 'Transactions - No Auth',
      url: `https://api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: {}
    },
    {
      name: 'Transactions - Public API',
      url: `https://public-api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: {}
    }
  ];

  for (const testCase of txTestCases) {
    try {
      console.log(`\n🔍 Testing: ${testCase.name}`);
      console.log(`📡 URL: ${testCase.url}`);
      console.log(`🔑 Headers:`, JSON.stringify(testCase.headers, null, 2));

      const response = await axios.get(testCase.url, {
        headers: testCase.headers,
        timeout: 15000
      });

      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Response keys: ${Object.keys(response.data).join(', ')}`);
      console.log(`📄 Full response:`, JSON.stringify(response.data, null, 2));

      // Check for transaction data
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log(`📝 Transaction count: ${response.data.data.length}`);
      }

    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Status Text: ${error.response.statusText}`);
        console.log(`   Headers:`, JSON.stringify(error.response.headers, null, 2));
        console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log(`   Request was made but no response received`);
        console.log(`   Request:`, JSON.stringify(error.request, null, 2));
      }
    }
  }
}

testSolscanAPI().catch(console.error);
