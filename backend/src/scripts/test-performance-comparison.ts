import { WalletAnalysisService } from '../services/WalletAnalysisService';
import { WalletAnalysisServiceOptimized } from '../services/WalletAnalysisServiceOptimized';
import { logger } from '../utils/logger';

async function testPerformanceComparison() {
  console.log('⚡ Performance Comparison Test');
  console.log('==============================');
  
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    
    // Test 1: Original Analysis (Limited)
    console.log('\n🐌 Testing ORIGINAL analysis (limited scope)...');
    const originalStartTime = Date.now();
    
    try {
      // Only test Ethereum for original to avoid excessive time
      const originalResults = await WalletAnalysisService.analyzeWallet(testWallet, false);
      const originalEndTime = Date.now();
      const originalDuration = (originalEndTime - originalStartTime) / 1000;
      
      console.log(`⏱️ Original analysis completed in ${originalDuration.toFixed(2)} seconds`);
      console.log(`💰 Original total value: $${originalResults.totalValue.toFixed(2)}`);
      console.log(`📊 Original total transactions: ${originalResults.totalTransactions}`);
      console.log(`🔗 Original blockchains: ${Object.keys(originalResults.blockchains).length}`);
      
    } catch (error) {
      console.log(`❌ Original analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Test 2: Optimized Analysis (Full Multi-Chain)
    console.log('\n🚀 Testing OPTIMIZED analysis (full multi-chain)...');
    const optimizedStartTime = Date.now();
    
    try {
      const optimizedResults = await WalletAnalysisServiceOptimized.analyzeWallet(testWallet, false);
      const optimizedEndTime = Date.now();
      const optimizedDuration = (optimizedEndTime - optimizedStartTime) / 1000;
      
      console.log(`⏱️ Optimized analysis completed in ${optimizedDuration.toFixed(2)} seconds`);
      console.log(`💰 Optimized total value: $${optimizedResults.totalValue.toFixed(2)}`);
      console.log(`📊 Optimized total transactions: ${optimizedResults.totalTransactions}`);
      console.log(`🔗 Optimized blockchains: ${Object.keys(optimizedResults.blockchains).length}`);
      
      // Display detailed results
      console.log('\n📊 Optimized Analysis Details:');
      console.log('==============================');
      for (const [blockchain, data] of Object.entries(optimizedResults.blockchains)) {
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
      
    } catch (error) {
      console.log(`❌ Optimized analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Test 3: Cache Performance Test
    console.log('\n🔄 Testing cache performance...');
    const cacheStartTime = Date.now();
    
    try {
      // Run optimized analysis again to test cache
      const cachedResults = await WalletAnalysisServiceOptimized.analyzeWallet(testWallet, false);
      const cacheEndTime = Date.now();
      const cacheDuration = (cacheEndTime - cacheStartTime) / 1000;
      
      console.log(`⏱️ Cached analysis completed in ${cacheDuration.toFixed(2)} seconds`);
      console.log(`💰 Cached total value: $${cachedResults.totalValue.toFixed(2)}`);
      
      // Show cache statistics
      const cacheStats = WalletAnalysisServiceOptimized.getCacheStats();
      console.log(`📊 Cache stats: ${cacheStats.analysisCacheSize} analysis entries, ${cacheStats.tokenPriceCacheSize} price entries`);
      
    } catch (error) {
      console.log(`❌ Cache test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Test 4: Memory and Resource Usage
    console.log('\n💾 Testing memory usage...');
    const memUsage = process.memoryUsage();
    console.log(`📊 Memory usage:`);
    console.log(`  - RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('\n✅ Performance comparison completed successfully!');
    
  } catch (error) {
    console.error('❌ Performance comparison failed:', error);
    logger.error('Performance comparison test failed:', error);
  }
}

// Run the performance comparison
if (require.main === module) {
  testPerformanceComparison()
    .then(() => {
      console.log('\n🏁 Performance comparison finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Performance comparison failed:', error);
      process.exit(1);
    });
}

export { testPerformanceComparison };
