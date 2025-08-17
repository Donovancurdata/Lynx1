const axios = require('axios');

console.log('🧪 Testing Etherscan Transaction Count Directly...');

const TEST_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
const ETHERSCAN_API_KEY = 'MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN';

async function testEtherscanTransactionCount() {
  try {
    // Test 1: Etherscan V2 API with chainId
    console.log('\n📝 Step 1: Testing Etherscan V2 API with chainId...');
    try {
      const response = await axios.get('https://api.etherscan.io/v2/api', {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionCount',
          address: TEST_ADDRESS,
          chainid: 1, // Ethereum mainnet
          apikey: ETHERSCAN_API_KEY
        },
        timeout: 15000
      });
      
      console.log(`✅ Etherscan V2 API Response:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
      
      if (response.data && response.data.result) {
        const transactionCount = parseInt(response.data.result, 16);
        console.log(`   Transaction Count (hex): ${response.data.result}`);
        console.log(`   Transaction Count (decimal): ${transactionCount}`);
      }
      
    } catch (error) {
      console.log(`❌ Etherscan V2 API failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    // Test 2: Traditional Etherscan V1 API
    console.log('\n📝 Step 2: Testing Traditional Etherscan V1 API...');
    try {
      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionCount',
          address: TEST_ADDRESS,
          apikey: ETHERSCAN_API_KEY
        },
        timeout: 15000
      });
      
      console.log(`✅ Etherscan V1 API Response:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
      
      if (response.data && response.data.result) {
        const transactionCount = parseInt(response.data.result, 16);
        console.log(`   Transaction Count (hex): ${response.data.result}`);
        console.log(`   Transaction Count (decimal): ${transactionCount}`);
      }
      
    } catch (error) {
      console.log(`❌ Etherscan V1 API failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    // Test 3: Check if there are pending transactions
    console.log('\n📝 Step 3: Testing for Pending Transactions...');
    try {
      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionCount',
          address: TEST_ADDRESS,
          tag: 'pending', // Check pending transactions
          apikey: ETHERSCAN_API_KEY
        },
        timeout: 15000
      });
      
      console.log(`✅ Etherscan Pending Transactions Response:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
      
      if (response.data && response.data.result) {
        const pendingCount = parseInt(response.data.result, 16);
        console.log(`   Pending Transaction Count (hex): ${response.data.result}`);
        console.log(`   Pending Transaction Count (decimal): ${pendingCount}`);
      }
      
    } catch (error) {
      console.log(`❌ Etherscan Pending Transactions failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    // Test 4: Check the actual transaction list to count them
    console.log('\n📝 Step 4: Testing Transaction List to Count Manually...');
    try {
      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlist',
          address: TEST_ADDRESS,
          startblock: 0,
          endblock: 99999999,
          sort: 'asc',
          apikey: ETHERSCAN_API_KEY
        },
        timeout: 15000
      });
      
      console.log(`✅ Etherscan Transaction List Response:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Result Count: ${response.data.result ? response.data.result.length : 'No result'}`);
      
      if (response.data && response.data.result && Array.isArray(response.data.result)) {
        console.log(`   Total Transactions Found: ${response.data.result.length}`);
        
        // Show first few transactions
        if (response.data.result.length > 0) {
          console.log(`   First Transaction: ${response.data.result[0].hash}`);
          console.log(`   Last Transaction: ${response.data.result[response.data.result.length - 1].hash}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Etherscan Transaction List failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

testEtherscanTransactionCount().catch(console.error);
