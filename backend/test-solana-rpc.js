const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
const TEST_ADDRESS = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4';

console.log('🧪 Testing Solana RPC directly...');
console.log(`🔗 RPC URL: ${SOLANA_RPC_URL}`);
console.log(`📝 Test Address: ${TEST_ADDRESS}`);

async function testSolanaRPC() {
  try {
    // Test 1: Get account info (balance)
    console.log('\n🔍 Testing: Get Account Info (Balance)');
    
    const balanceResponse = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [TEST_ADDRESS]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log(`✅ Balance Response:`, JSON.stringify(balanceResponse.data, null, 2));
    
    if (balanceResponse.data.result) {
      const lamports = balanceResponse.data.result.value;
      const solBalance = lamports / Math.pow(10, 9);
      console.log(`💰 SOL Balance: ${solBalance} SOL (${lamports} lamports)`);
    }
    
  } catch (error) {
    console.log(`❌ Balance request failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
  
  try {
    // Test 2: Get transaction count
    console.log('\n🔍 Testing: Get Transaction Count');
    
    const txCountResponse = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: '2.0',
      id: 2,
      method: 'getSignatureCounts',
      params: [[TEST_ADDRESS]]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log(`✅ Transaction Count Response:`, JSON.stringify(txCountResponse.data, null, 2));
    
    if (txCountResponse.data.result) {
      const txCount = txCountResponse.data.result.value[0];
      console.log(`📝 Transaction Count: ${txCount}`);
    }
    
  } catch (error) {
    console.log(`❌ Transaction count request failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
  
  try {
    // Test 3: Get recent transactions
    console.log('\n🔍 Testing: Get Recent Transactions');
    
    const txResponse = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: '2.0',
      id: 3,
      method: 'getSignaturesForAddress',
      params: [
        TEST_ADDRESS,
        {
          limit: 10
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log(`✅ Recent Transactions Response:`, JSON.stringify(txResponse.data, null, 2));
    
    if (txResponse.data.result) {
      const transactions = txResponse.data.result.value;
      console.log(`📝 Found ${transactions.length} recent transactions`);
      
      if (transactions.length > 0) {
        console.log(`📝 First transaction:`, JSON.stringify(transactions[0], null, 2));
      }
    }
    
  } catch (error) {
    console.log(`❌ Recent transactions request failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
  
  try {
    // Test 4: Get account info with more details
    console.log('\n🔍 Testing: Get Detailed Account Info');
    
    const accountResponse = await axios.post(SOLANA_RPC_URL, {
      jsonrpc: '2.0',
      id: 4,
      method: 'getAccountInfo',
      params: [
        TEST_ADDRESS,
        {
          encoding: 'jsonParsed'
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log(`✅ Account Info Response:`, JSON.stringify(accountResponse.data, null, 2));
    
    if (accountResponse.data.result) {
      const accountInfo = accountResponse.data.result.value;
      if (accountInfo) {
        console.log(`💰 Account Owner: ${accountInfo.owner}`);
        console.log(`💰 Lamports: ${accountInfo.lamports}`);
        console.log(`💰 Executable: ${accountInfo.executable}`);
        console.log(`💰 Rent Epoch: ${accountInfo.rentEpoch}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Account info request failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSolanaRPC().catch(console.error);
