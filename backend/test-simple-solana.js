const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const TEST_ADDRESS = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXh7HqgaqTch31h41BQXhKhLXiCZT4';

console.log('🧪 Testing Simple Solana RPC...');
console.log(`🔗 RPC URL: ${SOLANA_RPC_URL}`);
console.log(`📝 Test Address: ${TEST_ADDRESS}`);

async function testSimpleSolana() {
  try {
    // Test 1: Get balance
    console.log('\n🔍 Testing: Get Balance');
    
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
    
    if (balanceResponse.data && balanceResponse.data.result) {
      const lamports = balanceResponse.data.result.value;
      const solBalance = lamports / Math.pow(10, 9);
      console.log(`✅ Balance: ${solBalance} SOL (${lamports} lamports)`);
      
      // Test 2: Get transactions with rate limiting
      console.log('\n🔍 Testing: Get Transactions (with rate limiting)');
      
      let totalTransactions = 0;
      let lastSignature = null;
      const batchSize = 1000;
      
      for (let batch = 0; batch < 5; batch++) { // Limit to 5 batches
        try {
          const params = [
            TEST_ADDRESS,
            {
              limit: batchSize
            }
          ];
          
          if (lastSignature) {
            params[1].before = lastSignature;
          }
          
          console.log(`🔍 Fetching batch ${batch + 1}...`);
          
          const txResponse = await axios.post(SOLANA_RPC_URL, {
            jsonrpc: '2.0',
            id: batch + 1,
            method: 'getSignaturesForAddress',
            params: params
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 15000
          });
          
          if (txResponse.data && txResponse.data.result) {
            const transactions = txResponse.data.result;
            const batchCount = transactions.length;
            totalTransactions += batchCount;
            
            console.log(`✅ Batch ${batch + 1}: ${batchCount} transactions (Total: ${totalTransactions})`);
            
            if (batchCount < batchSize) {
              console.log(`✅ Reached end after ${batch + 1} batches`);
              break;
            }
            
            lastSignature = transactions[transactions.length - 1].signature;
            
            // Add delay to avoid rate limiting
            if (batch < 4) {
              console.log(`⏳ Waiting 2 seconds before next batch...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          
        } catch (batchError) {
          if (batchError.response && batchError.response.status === 429) {
            console.log(`⚠️ Rate limited on batch ${batch + 1}, waiting 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          } else {
            console.log(`❌ Batch ${batch + 1} failed: ${batchError.message}`);
            break;
          }
        }
      }
      
      console.log(`\n🎯 Final Results:`);
      console.log(`💰 SOL Balance: ${solBalance} SOL`);
      console.log(`📝 Total Transactions: ${totalTransactions}`);
      
    } else {
      console.log(`❌ Invalid balance response`);
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSimpleSolana().catch(console.error);
