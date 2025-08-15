const axios = require('axios');

async function testCurrentPerformance() {
  console.log('🚀 Testing Current Performance (Without BullMQ)...\n');
  
  const testWallet = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
  const backendUrl = 'http://localhost:3001';
  
  console.log(`📊 Testing wallet: ${testWallet}`);
  console.log(`🔗 Backend URL: ${backendUrl}`);
  console.log('⏱️  Starting performance test...\n');
  
  // Test 1: Quick Analysis
  console.log('🔍 Test 1: Quick Analysis');
  const quickStart = Date.now();
  try {
    const quickResponse = await axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
      address: testWallet,
      analysisType: 'quick'
    }, { timeout: 60000 });
    const quickEnd = Date.now();
    const quickDuration = quickEnd - quickStart;
    console.log(`✅ Quick Analysis completed in ${quickDuration}ms`);
    console.log(`📄 Response size: ${JSON.stringify(quickResponse.data).length} characters`);
  } catch (error) {
    console.log(`❌ Quick Analysis failed: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Deep Analysis
  console.log('🔍 Test 2: Deep Analysis');
  const deepStart = Date.now();
  try {
    const deepResponse = await axios.post(`${backendUrl}/api/v1/wallet/deep-analyze`, {
      address: testWallet,
      analysisType: 'deep'
    }, { timeout: 300000 }); // 5 minutes timeout
    const deepEnd = Date.now();
    const deepDuration = deepEnd - deepStart;
    console.log(`✅ Deep Analysis completed in ${deepDuration}ms`);
    console.log(`📄 Response size: ${JSON.stringify(deepResponse.data).length} characters`);
  } catch (error) {
    console.log(`❌ Deep Analysis failed: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Multiple Concurrent Requests
  console.log('🔍 Test 3: Multiple Concurrent Requests (3 quick analyses)');
  const concurrentStart = Date.now();
  const concurrentPromises = [];
  
  for (let i = 0; i < 3; i++) {
    concurrentPromises.push(
      axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
        address: testWallet,
        analysisType: 'quick'
      }, { timeout: 60000 }).catch(error => ({ error: error.message }))
    );
  }
  
  try {
    const concurrentResults = await Promise.all(concurrentPromises);
    const concurrentEnd = Date.now();
    const concurrentDuration = concurrentEnd - concurrentStart;
    
    const successCount = concurrentResults.filter(r => !r.error).length;
    console.log(`✅ Concurrent test completed in ${concurrentDuration}ms`);
    console.log(`📊 Successful requests: ${successCount}/3`);
    console.log(`⚡ Average time per request: ${concurrentDuration / 3}ms`);
  } catch (error) {
    console.log(`❌ Concurrent test failed: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Performance Analysis
  console.log('📈 PERFORMANCE ANALYSIS');
  console.log('='.repeat(50));
  console.log('🔍 Current Status: BullMQ is NOT enabled');
  console.log('💡 To enable BullMQ:');
  console.log('   1. Add USE_QUEUE=true to .env file');
  console.log('   2. Start Redis server');
  console.log('   3. Restart backend and agents');
  console.log('\n🚀 Expected BullMQ Benefits:');
  console.log('   • Parallel processing of multiple requests');
  console.log('   • Better resource utilization');
  console.log('   • Reduced response times for concurrent users');
  console.log('   • Job persistence and retry mechanisms');
  console.log('   • Priority-based processing');
}

// Run the test
testCurrentPerformance().catch(console.error);
