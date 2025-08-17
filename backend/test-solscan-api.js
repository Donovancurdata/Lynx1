const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY;
const TEST_ADDRESS = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4';

async function testSolscanAPI() {
  console.log('🧪 Testing Solscan API directly...');
  console.log(`🔑 API Key: ${SOLSCAN_API_KEY?.substring(0, 20)}...`);
  console.log(`📝 Test Address: ${TEST_ADDRESS}`);
  
  // Test different possible endpoints
  const endpoints = [
    {
      name: 'Account Info (v1)',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Account Info (v2)',
      url: `https://api.solscan.io/v2/account?address=${TEST_ADDRESS}`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Account Info (public)',
      url: `https://public-api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Account Info (no auth)',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}`,
      headers: {}
    },
    {
      name: 'Account Info (with token)',
      url: `https://api.solscan.io/account?address=${TEST_ADDRESS}&token=${SOLSCAN_API_KEY}`,
      headers: {}
    }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint.name}`);
      console.log(`📡 URL: ${endpoint.url}`);
      
      const response = await axios.get(endpoint.url, {
        headers: endpoint.headers,
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Response keys: ${Object.keys(response.data).join(', ')}`);
      
      if (response.data.success !== undefined) {
        console.log(`✅ Success field: ${response.data.success}`);
      }
      
      if (response.data.data) {
        console.log(`✅ Data field present`);
        if (response.data.data.lamports) {
          console.log(`💰 Lamports: ${response.data.data.lamports}`);
          console.log(`💰 SOL: ${response.data.data.lamports / Math.pow(10, 9)}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
      }
    }
  }
  
  // Test transaction endpoints
  console.log('\n🔍 Testing Transaction Endpoints...');
  const txEndpoints = [
    {
      name: 'Transactions (v1)',
      url: `https://api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Transactions (v2)',
      url: `https://api.solscan.io/v2/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    },
    {
      name: 'Transactions (public)',
      url: `https://public-api.solscan.io/account/transactions?address=${TEST_ADDRESS}&limit=10`,
      headers: { 'Authorization': `Bearer ${SOLSCAN_API_KEY}` }
    }
  ];
  
  for (const endpoint of txEndpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint.name}`);
      console.log(`📡 URL: ${endpoint.url}`);
      
      const response = await axios.get(endpoint.url, {
        headers: endpoint.headers,
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Response keys: ${Object.keys(response.data).join(', ')}`);
      
      if (response.data.success !== undefined) {
        console.log(`✅ Success field: ${response.data.success}`);
      }
      
      if (response.data.data) {
        console.log(`✅ Data field present`);
        console.log(`📝 Transaction count: ${response.data.data.length || 0}`);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
      }
    }
  }
}

testSolscanAPI().catch(console.error);
