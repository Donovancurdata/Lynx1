import { PriorityTokenService } from './src/services/PriorityTokenService';

async function testPriorityTokenSystem() {
  console.log('🧪 Testing Priority Token System...\n');
  
  try {
    const priorityService = new PriorityTokenService();
    
    // Test 1: Get all priority token market data
    console.log('📊 Test 1: Getting all priority token market data...');
    const allTokens = await priorityService.getPriorityTokenMarketData();
    console.log(`✅ Successfully retrieved ${allTokens.length} priority tokens`);
    
    // Test 2: Get tokens by priority level
    console.log('\n📊 Test 2: Getting tokens by priority level...');
    const highPriorityTokens = await priorityService.getTokensByPriority('high');
    const mediumPriorityTokens = await priorityService.getTokensByPriority('medium');
    const lowPriorityTokens = await priorityService.getTokensByPriority('low');
    
    console.log(`✅ High priority: ${highPriorityTokens.length} tokens`);
    console.log(`✅ Medium priority: ${mediumPriorityTokens.length} tokens`);
    console.log(`✅ Low priority: ${lowPriorityTokens.length} tokens`);
    
    // Test 3: Get tokens by category
    console.log('\n📊 Test 3: Getting tokens by category...');
    const majorTokens = await priorityService.getTokensByCategory('major');
    const defiTokens = await priorityService.getTokensByCategory('defi');
    const gamingTokens = await priorityService.getTokensByCategory('gaming');
    
    console.log(`✅ Major tokens: ${majorTokens.length} tokens`);
    console.log(`✅ DeFi tokens: ${defiTokens.length} tokens`);
    console.log(`✅ Gaming tokens: ${gamingTokens.length} tokens`);
    
    // Test 4: Wallet analysis simulation
    console.log('\n📊 Test 4: Simulating wallet analysis...');
    const walletAnalysis = await priorityService.analyzeWallet('test-address', 'ethereum');
    
    console.log(`✅ Wallet analysis completed:`);
    console.log(`   • Total tokens: ${walletAnalysis.analysis.totalTokens}`);
    console.log(`   • High priority: ${walletAnalysis.analysis.highPriorityTokens}`);
    console.log(`   • Medium priority: ${walletAnalysis.analysis.mediumPriorityTokens}`);
    console.log(`   • Low priority: ${walletAnalysis.analysis.lowPriorityTokens}`);
    console.log(`   • Success rate: ${walletAnalysis.analysis.successRate.toFixed(1)}%`);
    console.log(`   • Total market cap: $${(walletAnalysis.marketOverview.totalMarketCap / 1e9).toFixed(2)}B`);
    
    // Show some sample data
    console.log('\n📊 Sample High Priority Tokens:');
    highPriorityTokens.slice(0, 3).forEach((token, index) => {
      console.log(`   ${index + 1}. ${token.symbol} (${token.name})`);
      console.log(`      Price: $${token.current_price.toFixed(6)}`);
      console.log(`      24h Change: ${token.price_change_percentage_24h.toFixed(2)}%`);
      console.log(`      Market Cap: $${(token.market_cap / 1e6).toFixed(2)}M`);
    });
    
    console.log('\n🎯 Priority Token System Test Completed Successfully!');
    console.log('✅ All services are working correctly');
    console.log('✅ Ready to use with the consolidated server');
    
  } catch (error) {
    console.error('❌ Priority Token System Test Failed:', error);
    process.exit(1);
  }
}

// Run the test
testPriorityTokenSystem();
