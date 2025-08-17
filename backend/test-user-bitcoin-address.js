const axios = require('axios');

console.log('🧪 Testing User Bitcoin Address with Consolidated Server...');

// User's Bitcoin address
const USER_ADDRESS = 'bc1q2ygmnk2uqrrft2ta8ltzdt28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';

async function testUserBitcoinAddress() {
  console.log(`🔍 Testing with user address: ${USER_ADDRESS}`);
  
  try {
    // Test 1: Direct BTCScan API call
    console.log('\n📝 Step 1: Testing direct BTCScan API...');
    const btcscanResponse = await axios.get(`https://btcscan.org/api/address/${USER_ADDRESS}`, {
      timeout: 15000
    });
    
    if (btcscanResponse.data && btcscanResponse.data.chain_stats) {
      const stats = btcscanResponse.data.chain_stats;
      const balanceSatoshis = stats.funded_txo_sum - stats.spent_txo_sum;
      const balanceBTC = (balanceSatoshis / Math.pow(10, 8)).toFixed(8);
      
      console.log(`✅ BTCScan API SUCCESS!`);
      console.log(`   Balance: ${balanceBTC} BTC`);
      console.log(`   Transactions: ${stats.tx_count}`);
      console.log(`   Funded TXOs: ${stats.funded_txo_sum} satoshis`);
      console.log(`   Spent TXOs: ${stats.spent_txo_sum} satoshis`);
      
      // Test 2: Deep Analysis endpoint
      console.log('\n📝 Step 2: Testing Deep Analysis endpoint...');
      await testDeepAnalysis(USER_ADDRESS);
      
    } else {
      console.log('❌ BTCScan API: No chain_stats found');
      console.log('Response data:', JSON.stringify(btcscanResponse.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ BTCScan API failed:', error.message);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

async function testDeepAnalysis(address) {
  try {
    console.log(`   Testing Deep Analysis with blockchainFilter: 'bitcoin'...`);
    
    const response = await axios.post('http://localhost:3001/api/v1/wallet/deep-analyze', {
      address: address,
      blockchainFilter: 'bitcoin'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log(`   ✅ Deep Analysis SUCCESS!`);
    console.log(`      Status: ${response.status}`);
    console.log(`      Success: ${response.data.success}`);
    console.log(`      Analysis Type: ${response.data.analysisType}`);
    console.log(`      Blockchain Filter: ${response.data.blockchainFilter}`);
    console.log(`      Analyzed Chains: ${response.data.analyzedChains.join(', ')}`);
    console.log(`      Total Value: $${response.data.data.totalValue.toFixed(2)}`);
    console.log(`      Total Transactions: ${response.data.data.totalTransactions}`);
    
    if (response.data.data.blockchains.bitcoin) {
      const btcData = response.data.data.blockchains.bitcoin;
      console.log('\n📊 Bitcoin Analysis Results:');
      console.log(`   Balance: ${btcData.balance.native} BTC`);
      console.log(`   USD Value: $${btcData.balance.usdValue.toFixed(2)}`);
      console.log(`   Transactions: ${btcData.transactionCount}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Deep Analysis failed: ${error.message}`);
    if (error.response) {
      console.log(`      Status: ${error.response.status}`);
      console.log(`      Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testUserBitcoinAddress().catch(console.error);
