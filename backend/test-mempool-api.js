const axios = require('axios');

console.log('🧪 Testing Mempool.space API directly...');

const TEST_ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';

async function testMempoolAPI() {
  try {
    // Test: Get address info (includes balance and transaction count)
    console.log('\n🔍 Testing: Get Address Info');
    console.log(`URL: https://mempool.space/api/address/${TEST_ADDRESS}`);
    
    try {
      const response = await axios.get(`https://mempool.space/api/address/${TEST_ADDRESS}`, {
        timeout: 15000
      });
      
      console.log('✅ Response Status:', response.status);
      console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));
      
      // Extract and display key information
      if (response.data && response.data.chain_stats) {
        const chainStats = response.data.chain_stats;
        const balanceSatoshis = chainStats.funded_txo_sum - chainStats.spent_txo_sum;
        const balanceBTC = (balanceSatoshis / Math.pow(10, 8)).toFixed(8);
        const txCount = chainStats.tx_count;
        
        console.log('\n📊 Extracted Data:');
        console.log(`   Balance: ${balanceBTC} BTC (${balanceSatoshis} satoshis)`);
        console.log(`   Transactions: ${txCount}`);
        console.log(`   Funded TXOs: ${chainStats.funded_txo_sum} satoshis`);
        console.log(`   Spent TXOs: ${chainStats.spent_txo_sum} satoshis`);
        
      } else {
        console.log('❌ No chain_stats found in response');
      }
      
    } catch (error) {
      console.log('❌ API failed:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testMempoolAPI().catch(console.error);
