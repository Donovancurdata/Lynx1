const axios = require('axios');

async function testQueueSystem() {
  console.log('🔍 Testing Queue System Configuration...\n');
  
  const backendUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Check if USE_QUEUE is enabled
    console.log('🔍 Test 1: Checking queue configuration...');
    
    const healthResponse = await axios.get(`${backendUrl}/health`);
    console.log('✅ Backend health check successful');
    console.log('📄 Health response:', healthResponse.data);
    
    // Test 2: Submit a wallet analysis with explicit queue flag
    console.log('\n🔍 Test 2: Submitting wallet analysis with queue...');
    
    const testWallet = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    
    const analysisResponse = await axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
      address: testWallet,
      blockchain: 'solana',
      analysisType: 'quick'
    }, { timeout: 30000 });
    
    console.log('✅ Analysis response received');
    console.log('📄 Response keys:', Object.keys(analysisResponse.data));
    console.log('📄 Success:', analysisResponse.data.success);
    
    if (analysisResponse.data.data) {
      console.log('📄 Data keys:', Object.keys(analysisResponse.data.data));
      
      // Check if it's a job response
      if (analysisResponse.data.data.jobId) {
        console.log('✅ Queue system working! JobId returned:', analysisResponse.data.data.jobId);
        
        // Test 3: Check job status
        console.log('\n🔍 Test 3: Checking job status...');
        
        const statusResponse = await axios.get(`${backendUrl}/api/v1/wallet/status/${analysisResponse.data.data.jobId}`);
        console.log('✅ Status response received');
        console.log('📄 Status:', statusResponse.data);
        
      } else {
        console.log('⚠️ Queue system not working - full result returned instead of jobId');
        console.log('📄 This suggests USE_QUEUE=false or queue not initialized');
      }
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    if (error.response) {
      console.log(`📄 Error response:`, error.response.data);
    }
  }
}

// Run the test
testQueueSystem().catch(console.error);
