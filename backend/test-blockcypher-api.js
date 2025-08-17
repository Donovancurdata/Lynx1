const axios = require('axios');

console.log('🧪 Testing BlockCypher API directly...');

const TEST_ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';
const BLOCKCYPHER_API_KEY = 'c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0'; // Free tier token

async function testBlockCypherAPI() {
  try {
    // Test 1: Get address balance
    console.log('\n🔍 Testing: Get Address Balance');
    console.log(`URL: https://api.blockcypher.com/v1/btc/main/addrs/${TEST_ADDRESS}/balance`);
    
    try {
      const balanceResponse = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${TEST_ADDRESS}/balance`, {
        params: {
          token: BLOCKCYPHER_API_KEY
        },
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
    
    // Test 2: Get address info (includes transaction count)
    console.log('\n🔍 Testing: Get Address Info');
    console.log(`URL: https://api.blockcypher.com/v1/btc/main/addrs/${TEST_ADDRESS}`);
    
    try {
      const infoResponse = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${TEST_ADDRESS}`, {
        params: {
          token: BLOCKCYPHER_API_KEY
        },
        timeout: 15000
      });
      
      console.log('✅ Info Response Status:', infoResponse.status);
      console.log('✅ Info Response Data:', JSON.stringify(infoResponse.data, null, 2));
      
    } catch (infoError) {
      console.log('❌ Info API failed:', infoError.message);
      if (infoError.response) {
        console.log('   Status:', infoError.response.status);
        console.log('   Data:', JSON.stringify(infoError.response.data, null, 2));
      }
    }
    
    // Test 3: Try without API key (free tier)
    console.log('\n🔍 Testing: Without API Key (Free Tier)');
    
    try {
      const freeResponse = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${TEST_ADDRESS}`, {
        timeout: 15000
      });
      
      console.log('✅ Free Tier Response Status:', freeResponse.status);
      console.log('✅ Free Tier Response Data:', JSON.stringify(freeResponse.data, null, 2));
      
    } catch (freeError) {
      console.log('❌ Free Tier API failed:', freeError.message);
      if (freeError.response) {
        console.log('   Status:', freeError.response.status);
        console.log('   Data:', JSON.stringify(freeError.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testBlockCypherAPI().catch(console.error);
