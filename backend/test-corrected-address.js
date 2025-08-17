const axios = require('axios');

console.log('🧪 Testing Corrected Bitcoin Address...');

// Test the corrected address from the user
const CORRECTED_ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';

async function testCorrectedAddress() {
  console.log(`🔍 Testing corrected address: ${CORRECTED_ADDRESS}`);
  
  try {
    const response = await axios.get(`https://mempool.space/api/address/${CORRECTED_ADDRESS}`, {
      timeout: 15000
    });
    
    if (response.data && response.data.chain_stats) {
      const stats = response.data.chain_stats;
      const balanceSatoshis = stats.funded_txo_sum - stats.spent_txo_sum;
      const balanceBTC = (balanceSatoshis / Math.pow(10, 8)).toFixed(8);
      
      console.log(`✅ SUCCESS! Address is valid`);
      console.log(`   Balance: ${balanceBTC} BTC (${balanceSatoshis} satoshis)`);
      console.log(`   Transactions: ${stats.tx_count}`);
      console.log(`   Funded TXOs: ${stats.funded_txo_sum} satoshis`);
      console.log(`   Spent TXOs: ${stats.spent_txo_sum} satoshis`);
      
      // Now test the deep analysis endpoint
      console.log('\n🔍 Testing Deep Analysis with corrected address...');
      await testDeepAnalysis(CORRECTED_ADDRESS);
      
    } else {
      console.log('❌ No chain_stats found in response');
    }
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`❌ Invalid address: ${error.response.data}`);
    } else {
      console.log(`❌ API error: ${error.message}`);
    }
  }
}

async function testDeepAnalysis(address) {
  try {
    const response = await axios.post('http://localhost:3001/api/v1/wallet/deep-analyze', {
      address: address,
      blockchainFilter: 'bitcoin'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Deep Analysis SUCCESS!');
    console.log('   Status:', response.status);
    console.log('   Success:', response.data.success);
    console.log('   Analysis Type:', response.data.analysisType);
    console.log('   Blockchain Filter:', response.data.blockchainFilter);
    console.log('   Analyzed Chains:', response.data.analyzedChains);
    console.log('   Total Value:', response.data.data.totalValue);
    console.log('   Total Transactions:', response.data.data.totalTransactions);
    
    if (response.data.data.blockchains.bitcoin) {
      const btcData = response.data.data.blockchains.bitcoin;
      console.log('\n📊 Bitcoin Analysis Results:');
      console.log(`   Balance: ${btcData.balance.native} BTC`);
      console.log(`   USD Value: $${btcData.balance.usdValue.toFixed(2)}`);
      console.log(`   Transactions: ${btcData.transactionCount}`);
    }
    
  } catch (error) {
    console.log('❌ Deep Analysis failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testCorrectedAddress().catch(console.error);
