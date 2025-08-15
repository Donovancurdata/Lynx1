const { DeepAnalysisService } = require('./dist/services/DeepAnalysisService');

async function testDeepAnalysis() {
  try {
    console.log('🔍 Testing DeepAnalysisService...');
    
    const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    
    console.log(`📋 Testing with address: ${walletAddress}`);
    
    // Initialize the service
    await DeepAnalysisService.initialize();
    
    // Perform deep analysis
    console.log('\n🚀 Starting deep analysis...');
    const result = await DeepAnalysisService.performDeepAnalysis(walletAddress);
    
    console.log('\n✅ Deep analysis completed!');
    console.log('Result type:', typeof result);
    console.log('Result keys:', Object.keys(result));
    
    if (result) {
      console.log('\n📊 Result details:');
      console.log('- walletAddress:', result.walletAddress);
      console.log('- totalValue:', result.totalValue);
      console.log('- totalTransactions:', result.totalTransactions);
      console.log('- blockchains count:', Object.keys(result.blockchains || {}).length);
      console.log('- discoveredTokens count:', (result.discoveredTokens || []).length);
      
      if (result.blockchains) {
        console.log('\n🔗 Blockchain details:');
        for (const [blockchain, data] of Object.entries(result.blockchains)) {
          console.log(`  ${blockchain}:`);
          console.log(`    - value: ${data.value}`);
          console.log(`    - tokens: ${data.tokens?.length || 0}`);
          console.log(`    - transactions: ${data.transactionCount || 0}`);
          console.log(`    - nativeBalance: ${data.nativeBalance}`);
          console.log(`    - nativeUsdValue: ${data.nativeUsdValue}`);
        }
      }
    } else {
      console.log('❌ Result is null or undefined');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDeepAnalysis();
