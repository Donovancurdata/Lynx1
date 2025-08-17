const axios = require('axios');

console.log('🧪 Testing Bitcoin Deep Analysis...');

const TEST_ADDRESS = 'bc1q2ygmnk2uqrrft2ta8ltzdt28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';
const API_BASE_URL = 'http://localhost:3001';

async function testBitcoinDeepAnalysis() {
  try {
    // First, check if the server is running
    console.log('🔍 Checking server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Health check successful:', healthResponse.status);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
      return;
    }

    // Test Bitcoin deep analysis
    console.log('\n🔍 Testing Bitcoin Deep Analysis...');
    console.log(`📝 Test Address: ${TEST_ADDRESS}`);
    
    const requestBody = {
      address: TEST_ADDRESS,
      blockchainFilter: 'bitcoin'
    };
    
    console.log('📤 Sending request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/api/v1/wallet/deep-analyze`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout for Bitcoin analysis
    });
    
    console.log('✅ Response received:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Analysis Type:', response.data.analysisType);
    console.log('Blockchain Filter:', response.data.blockchainFilter);
    console.log('Analyzed Chains:', response.data.analyzedChains);
    console.log('Total Value:', response.data.data.totalValue);
    console.log('Total Transactions:', response.data.data.totalTransactions);
    
    const blockchains = Object.keys(response.data.data.blockchains);
    console.log('Blockchains found:', blockchains);
    
    if (response.data.success && blockchains.includes('bitcoin')) {
      console.log('✅ SUCCESS: Bitcoin analysis is working');
      
      const bitcoinData = response.data.data.blockchains.bitcoin;
      console.log('🔍 Bitcoin Data:', JSON.stringify(bitcoinData, null, 2));
      
      // Verify that only Bitcoin chain was analyzed
      if (blockchains.length === 1 && blockchains[0] === 'bitcoin') {
        console.log('✅ SUCCESS: Only Bitcoin chain analyzed (other chains properly excluded)');
      } else {
        console.log('⚠️ WARNING: Multiple chains found when only Bitcoin was requested');
      }
      
    } else {
      console.log('❌ FAILED: Bitcoin analysis not working properly');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testBitcoinDeepAnalysis().catch(console.error);
