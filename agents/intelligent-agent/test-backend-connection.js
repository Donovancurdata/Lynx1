const axios = require('axios');

async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...');
    
    const API_BASE_URL = 'http://localhost:3001/api/v1';
    const testAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    
    console.log(`📋 Testing with address: ${testAddress}`);
    console.log(`🌐 Backend URL: ${API_BASE_URL}`);
    
    // Test 1: Check if backend is running
    console.log('\n1️⃣ Testing backend health...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
        timeout: 5000
      });
      console.log('✅ Backend is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
      return;
    }
    
    // Test 2: Test deep analysis endpoint
    console.log('\n2️⃣ Testing deep analysis endpoint...');
    try {
      const analysisResponse = await axios.post(`${API_BASE_URL}/wallet/deep-analyze`, {
        address: testAddress,
        analysisType: 'deep'
      }, {
        timeout: 60000, // 60 seconds
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Deep analysis completed!');
      console.log('Response status:', analysisResponse.status);
      console.log('Response data keys:', Object.keys(analysisResponse.data));
      
      if (analysisResponse.data.success) {
        console.log('✅ Analysis was successful!');
        console.log('Data summary:', {
          address: analysisResponse.data.data?.address,
          totalValue: analysisResponse.data.data?.totalValue,
          totalTransactions: analysisResponse.data.data?.totalTransactions,
          blockchains: Object.keys(analysisResponse.data.data?.blockchains || {})
        });
      } else {
        console.log('❌ Analysis failed:', analysisResponse.data.error || analysisResponse.data.message);
      }
      
    } catch (error) {
      console.log('❌ Deep analysis failed:', error.message);
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBackendConnection();
