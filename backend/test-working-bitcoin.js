const axios = require('axios');

console.log('🧪 Testing Bitcoin API Integration...');

// Test with a known working address first
const KNOWN_WORKING_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const USER_ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';

async function testBitcoinAPIs() {
  console.log('🔍 Step 1: Testing with known working address...');
  await testAddress(KNOWN_WORKING_ADDRESS, 'Known Working');
  
  console.log('\n🔍 Step 2: Testing with user address...');
  await testAddress(USER_ADDRESS, 'User Address');
}

async function testAddress(address, label) {
  console.log(`\n📝 Testing ${label}: ${address}`);
  
  try {
    // Test Mempool.space API
    console.log(`   Testing Mempool.space API...`);
    const response = await axios.get(`https://mempool.space/api/address/${address}`, {
      timeout: 15000
    });
    
    if (response.data && response.data.chain_stats) {
      const stats = response.data.chain_stats;
      const balanceSatoshis = stats.funded_txo_sum - stats.spent_txo_sum;
      const balanceBTC = (balanceSatoshis / Math.pow(10, 8)).toFixed(8);
      
      console.log(`   ✅ Mempool.space SUCCESS!`);
      console.log(`      Balance: ${balanceBTC} BTC`);
      console.log(`      Transactions: ${stats.tx_count}`);
      
      // If this is the user address and it works, test deep analysis
      if (address === USER_ADDRESS) {
        console.log(`\n🔍 Testing Deep Analysis with working address...`);
        await testDeepAnalysis(address);
      }
      
    } else {
      console.log(`   ❌ Mempool.space: No chain_stats found`);
    }
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`   ❌ Mempool.space: Invalid address - ${error.response.data}`);
    } else {
      console.log(`   ❌ Mempool.space: ${error.message}`);
    }
  }
}

async function testDeepAnalysis(address) {
  try {
    console.log(`   Testing Deep Analysis endpoint...`);
    
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
    console.log(`      Total Value: $${response.data.data.totalValue.toFixed(2)}`);
    console.log(`      Total Transactions: ${response.data.data.totalTransactions}`);
    console.log(`      Analyzed Chains: ${response.data.analyzedChains.join(', ')}`);
    
  } catch (error) {
    console.log(`   ❌ Deep Analysis failed: ${error.message}`);
    if (error.response) {
      console.log(`      Status: ${error.response.status}`);
      console.log(`      Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testBitcoinAPIs().catch(console.error);
