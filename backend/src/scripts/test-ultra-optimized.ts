import { WalletAnalysisServiceUltraOptimized } from '../services/WalletAnalysisServiceUltraOptimized';
import { logger } from '../utils/logger';

async function testUltraOptimizedAnalysis() {
  console.log('⚡ Testing ULTRA-OPTIMIZED Wallet Analysis');
  console.log('==========================================');
  
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    
    // Clear any existing cache for fresh test
    WalletAnalysisServiceUltraOptimized.clearCaches();
    
    const startTime = Date.now();
    
    // Run ultra-optimized analysis
    const results = await WalletAnalysisServiceUltraOptimized.analyzeWallet(testWallet, false);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n⏱️ Ultra-optimized analysis completed in ${duration.toFixed(3)} seconds`);
    console.log(`💰 Total value: $${results.totalValue.toFixed(2)}`);
    console.log(`📊 Total transactions: ${results.totalTransactions}`);
    console.log(`🔗 Active blockchains: ${Object.keys(results.blockchains).length}`);
    
    // Display detailed results
    console.log('\n📊 Detailed Results:');
    console.log('====================');
    for (const [blockchain, data] of Object.entries(results.blockchains)) {
      console.log(`\n• ${blockchain.toUpperCase()}:`);
      console.log(`  - Native Balance: ${data.balance.native}`);
      console.log(`  - USD Value: $${data.balance.usdValue.toFixed(2)}`);
      console.log(`  - Token Count: ${data.tokens.length}`);
      console.log(`  - Transaction Count: ${data.transactionCount}`);
      
      if (data.tokens.length > 0) {
        console.log(`  - Top Tokens:`);
        data.tokens.slice(0, 3).forEach((token: any) => {
          console.log(`    * ${token.symbol}: ${token.balance} ($${token.usdValue.toFixed(2)})`);
        });
      }
    }
    
    // Test cache performance
    console.log('\n🔄 Testing cache performance...');
    const cacheStartTime = Date.now();
    const cachedResults = await WalletAnalysisServiceUltraOptimized.analyzeWallet(testWallet, false);
    const cacheEndTime = Date.now();
    const cacheDuration = (cacheEndTime - cacheStartTime) / 1000;
    
    console.log(`⏱️ Cached analysis completed in ${cacheDuration.toFixed(3)} seconds`);
    console.log(`💰 Cached total value: $${cachedResults.totalValue.toFixed(2)}`);
    
    // Show cache statistics
    const cacheStats = WalletAnalysisServiceUltraOptimized.getCacheStats();
    console.log(`📊 Cache stats: ${cacheStats.analysisCacheSize} analysis entries, ${cacheStats.tokenPriceCacheSize} price entries`);
    
    console.log('\n✅ Ultra-optimized test completed successfully!');
    return results;
    
  } catch (error) {
    console.error('❌ Ultra-optimized test failed:', error);
    logger.error('Ultra-optimized analysis test failed:', error);
    return null;
  }
}

// Run the ultra-optimized test
if (require.main === module) {
  testUltraOptimizedAnalysis()
    .then(() => {
      console.log('\n🏁 Ultra-optimized test finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Ultra-optimized test failed:', error);
      process.exit(1);
    });
}

export { testUltraOptimizedAnalysis };
