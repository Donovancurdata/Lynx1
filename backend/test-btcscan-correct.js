const axios = require('axios');

console.log('🧪 Testing BTCScan API with Correct Endpoints...');

// Test addresses
const TEST_ADDRESSES = [
  'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda', // User address
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Known working
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' // Satoshi's address
];

async function testBTCScanAPI() {
  for (const address of TEST_ADDRESSES) {
    console.log(`\n🔍 Testing address: ${address}`);
    console.log(`   Format: ${address.startsWith('bc1') ? 'Bech32' : address.startsWith('3') ? 'P2SH' : 'Legacy'}`);
    
    try {
      // Test 1: Get address balance
      console.log(`   Testing balance endpoint: /api/address/${address}/balance`);
      try {
        const balanceResponse = await axios.get(`https://btcscan.org/api/address/${address}/balance`, {
          timeout: 15000
        });
        console.log(`   ✅ Balance SUCCESS:`, JSON.stringify(balanceResponse.data, null, 2));
      } catch (balanceError) {
        console.log(`   ❌ Balance FAILED: ${balanceError.message}`);
        if (balanceError.response) {
          console.log(`      Status: ${balanceError.response.status}`);
          console.log(`      Data: ${JSON.stringify(balanceError.response.data, null, 2)}`);
        }
      }
      
      // Test 2: Get transaction count
      console.log(`   Testing txcount endpoint: /api/address/${address}/txcount`);
      try {
        const txCountResponse = await axios.get(`https://btcscan.org/api/address/${address}/txcount`, {
          timeout: 15000
        });
        console.log(`   ✅ Transaction Count SUCCESS:`, JSON.stringify(txCountResponse.data, null, 2));
      } catch (txCountError) {
        console.log(`   ❌ Transaction Count FAILED: ${txCountError.message}`);
        if (txCountError.response) {
          console.log(`      Status: ${txCountError.response.status}`);
          console.log(`      Data: ${JSON.stringify(txCountError.response.data, null, 2)}`);
        }
      }
      
      // Test 3: Get full address info
      console.log(`   Testing full address endpoint: /api/address/${address}`);
      try {
        const fullResponse = await axios.get(`https://btcscan.org/api/address/${address}`, {
          timeout: 15000
        });
        console.log(`   ✅ Full Address SUCCESS:`, JSON.stringify(fullResponse.data, null, 2));
      } catch (fullError) {
        console.log(`   ❌ Full Address FAILED: ${fullError.message}`);
        if (fullError.response) {
          console.log(`      Status: ${fullError.response.status}`);
          console.log(`      Data: ${JSON.stringify(fullError.response.data, null, 2)}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ General error: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Testing chain info endpoint...');
  try {
    const chainInfoResponse = await axios.get('https://btcscan.org/api/chaininfo', {
      timeout: 15000
    });
    console.log('✅ Chain Info SUCCESS:', JSON.stringify(chainInfoResponse.data, null, 2));
  } catch (chainError) {
    console.log('❌ Chain Info FAILED:', chainError.message);
    if (chainError.response) {
      console.log(`   Status: ${chainError.response.status}`);
      console.log(`   Data: ${JSON.stringify(chainError.response.data, null, 2)}`);
    }
  }
}

testBTCScanAPI().catch(console.error);
