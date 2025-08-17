const axios = require('axios');

console.log('🧪 Testing BTCScan API directly...');

const TEST_ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';
const BTCSCAN_API_URL = 'https://btcscan.org/api';

async function testBTCScanAPI() {
  try {
    // Test 1: Get address balance
    console.log('\n🔍 Testing: Get Address Balance');
    console.log(`URL: ${BTCSCAN_API_URL}/address/balance/${TEST_ADDRESS}`);
    
    try {
      const balanceResponse = await axios.get(`${BTCSCAN_API_URL}/address/balance/${TEST_ADDRESS}`, {
        timeout: 15000
      });
      
      console.log('✅ Balance Response Status:', balanceResponse.status);
      console.log('✅ Balance Response Data:', JSON.stringify(balanceResponse.data, null, 2));
      
    } catch (balanceError) {
      console.log('❌ Balance API failed:', balanceError.message);
      if (balanceError.response) {
        console.log('   Status:', balanceError.response.status);
        console.log('   Data:', JSON.stringify(balanceError.response.data, null, 2));
      }
    }
    
    // Test 2: Get transaction count
    console.log('\n🔍 Testing: Get Transaction Count');
    console.log(`URL: ${BTCSCAN_API_URL}/address/txcount/${TEST_ADDRESS}`);
    
    try {
      const txCountResponse = await axios.get(`${BTCSCAN_API_URL}/address/txcount/${TEST_ADDRESS}`, {
        timeout: 15000
      });
      
      console.log('✅ Transaction Count Response Status:', txCountResponse.status);
      console.log('✅ Transaction Count Response Data:', JSON.stringify(txCountResponse.data, null, 2));
      
    } catch (txCountError) {
      console.log('❌ Transaction Count API failed:', txCountError.message);
      if (txCountError.response) {
        console.log('   Status:', txCountError.response.status);
        console.log('   Data:', JSON.stringify(txCountError.response.data, null, 2));
      }
    }
    
    // Test 3: Try alternative endpoints from the documentation
    console.log('\n🔍 Testing: Alternative BTCScan Endpoints');
    
    // Test address info endpoint
    try {
      const infoResponse = await axios.get(`${BTCSCAN_API_URL}/address/${TEST_ADDRESS}`, {
        timeout: 15000
      });
      
      console.log('✅ Address Info Response Status:', infoResponse.status);
      console.log('✅ Address Info Response Data:', JSON.stringify(infoResponse.data, null, 2));
      
    } catch (infoError) {
      console.log('❌ Address Info API failed:', infoError.message);
      if (infoError.response) {
        console.log('   Status:', infoError.response.status);
        console.log('   Data:', JSON.stringify(infoError.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testBTCScanAPI().catch(console.error);
