const axios = require('axios');

async function testOptimizedPerformance() {
  console.log('🚀 Testing Optimized BullMQ Performance...\n');
  
  const testWallet = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
  const backendUrl = 'http://localhost:3001';
  
  console.log(`📊 Testing wallet: ${testWallet}`);
  console.log(`🔗 Backend URL: ${backendUrl}`);
  console.log('⏱️  Starting optimized performance test...\n');
  
  // Test 1: Quick Analysis with Optimizations
  console.log('🔍 Test 1: Quick Analysis (Optimized BullMQ)');
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
  
  // Test 2: Multiple Concurrent Requests with Optimizations
  console.log('🔍 Test 2: Multiple Concurrent Requests (3 quick analyses) - Optimized');
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
    
    // Compare with previous results
    const previousTime = 12338; // Previous concurrent test time
    const improvement = ((previousTime - concurrentDuration) / previousTime) * 100;
    console.log(`📈 Performance improvement: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%`);
  } catch (error) {
    console.log(`❌ Concurrent test failed: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Cache Test (Same request twice)
  console.log('🔍 Test 3: Cache Performance Test');
  const cacheStart1 = Date.now();
  try {
    const cacheResponse1 = await axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
      address: testWallet,
      analysisType: 'quick'
    }, { timeout: 60000 });
    const cacheEnd1 = Date.now();
    const cacheDuration1 = cacheEnd1 - cacheStart1;
    console.log(`✅ First request: ${cacheDuration1}ms`);
    
    // Second request (should be cached)
    const cacheStart2 = Date.now();
    const cacheResponse2 = await axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
      address: testWallet,
      analysisType: 'quick'
    }, { timeout: 60000 });
    const cacheEnd2 = Date.now();
    const cacheDuration2 = cacheEnd2 - cacheStart2;
    console.log(`✅ Second request (cached): ${cacheDuration2}ms`);
    
    const cacheImprovement = ((cacheDuration1 - cacheDuration2) / cacheDuration1) * 100;
    console.log(`📈 Cache improvement: ${cacheImprovement.toFixed(1)}%`);
  } catch (error) {
    console.log(`❌ Cache test failed: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Performance Analysis
  console.log('📈 OPTIMIZED BULLMQ PERFORMANCE ANALYSIS');
  console.log('='.repeat(50));
  console.log('🔍 Optimizations Applied:');
  console.log('   ✅ Reduced concurrency (5→2, 3→1, 2→1)');
  console.log('   ✅ Added job result caching (5min TTL)');
  console.log('   ✅ Optimized Redis configuration');
  console.log('   ✅ Added removeOnComplete/removeOnFail limits');
  console.log('   ✅ Implemented request batching');
  console.log('\n🚀 Expected Improvements:');
  console.log('   • Reduced Redis memory usage');
  console.log('   • Better concurrent performance');
  console.log('   • Faster cached responses');
  console.log('   • More stable queue processing');
  console.log('   • Reduced resource contention');
}

// Run the test
testOptimizedPerformance().catch(console.error);
