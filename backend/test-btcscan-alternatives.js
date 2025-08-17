const axios = require('axios');

console.log('🧪 Testing BTCScan API Alternatives...');

// Test with both modern (bech32) and legacy Bitcoin address formats
const TEST_ADDRESSES = [
  'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda', // Modern bech32
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' // Legacy format (Satoshi's address)
];

const BTCSCAN_API_URL = 'https://btcscan.org/api';

async function testBTCScanAlternatives() {
  for (const address of TEST_ADDRESSES) {
    console.log(`\n🔍 Testing address: ${address}`);
    console.log(`   Format: ${address.startsWith('bc1') ? 'Bech32 (modern)' : 'Legacy'}`);
    
    // Test 1: Try the basic address endpoint
    try {
      console.log(`   Testing: GET /address/${address}`);
      const response = await axios.get(`${BTCSCAN_API_URL}/address/${address}`, {
        timeout: 15000
      });
      
      console.log(`   ✅ Success! Status: ${response.status}`);
      console.log(`   ✅ Data: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`      Status: ${error.response.status}`);
        console.log(`      Data: ${error.response.data}`);
      }
    }
    
    // Test 2: Try different endpoint patterns
    const alternativeEndpoints = [
      `/address/balance/${address}`,
      `/address/txcount/${address}`,
      `/address/info/${address}`,
      `/address/summary/${address}`,
      `/address/transactions/${address}`,
      `/address/utxo/${address}`,
      `/address/history/${address}`
    ];
    
    for (const endpoint of alternativeEndpoints) {
      try {
        console.log(`   Testing: GET ${endpoint}`);
        const response = await axios.get(`${BTCSCAN_API_URL}${endpoint}`, {
          timeout: 10000
        });
        
        console.log(`   ✅ Success! Status: ${response.status}`);
        console.log(`   ✅ Data: ${JSON.stringify(response.data, null, 2)}`);
        break; // If we find a working endpoint, stop testing others
        
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`   ❌ 404: Endpoint not found`);
        } else {
          console.log(`   ❌ Failed: ${error.message}`);
        }
      }
    }
    
    // Test 3: Try the chaininfo endpoint to see what's available
    try {
      console.log(`   Testing: GET /chaininfo`);
      const response = await axios.get(`${BTCSCAN_API_URL}/chaininfo`, {
        timeout: 10000
      });
      
      console.log(`   ✅ Chain Info Success! Status: ${response.status}`);
      console.log(`   ✅ Available endpoints: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error) {
      console.log(`   ❌ Chain Info failed: ${error.message}`);
    }
  }
}

testBTCScanAlternatives().catch(console.error);
