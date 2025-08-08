import { WalletAnalysisService } from '../services/WalletAnalysisService';
import { logger } from '../utils/logger';

async function testTraditionalAnalysis() {
  console.log('🧪 Testing Traditional Wallet Analysis');
  console.log('=====================================');

  // Test wallet address (same as used in the intelligent agent)
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    
    // Test 1: Detect all blockchains
    console.log('\n🔍 Step 1: Detecting blockchains...');
    const detectedBlockchains = WalletAnalysisService.detectAllBlockchains(testWallet);
    console.log('Detected blockchains:', detectedBlockchains);
    
    // Test 2: Analyze wallet with deep analysis
    console.log('\n💰 Step 2: Performing deep analysis...');
    const analysis = await WalletAnalysisService.analyzeWallet(testWallet, true);
    
    console.log('\n📊 Analysis Results:');
    console.log('====================');
    console.log(`Total Value: $${analysis.totalValue}`);
    console.log(`Total Transactions: ${analysis.totalTransactions}`);
    console.log(`Active Blockchains: ${Object.keys(analysis.blockchains).length}`);
    
    console.log('\n🔗 Blockchain Breakdown:');
    for (const [blockchain, data] of Object.entries(analysis.blockchains)) {
      console.log(`• ${blockchain.toUpperCase()}:`);
      console.log(`  - Native Balance: ${data.balance.native}`);
      console.log(`  - USD Value: $${data.balance.usdValue}`);
      console.log(`  - Token Count: ${data.tokens.length}`);
      console.log(`  - Transaction Count: ${data.recentTransactions.length}`);
      
      if (data.tokens.length > 0) {
        console.log(`  - Tokens:`);
        data.tokens.forEach(token => {
          console.log(`    * ${token.symbol}: ${token.balance} ($${token.usdValue})`);
        });
      }
    }
    
    // Test 3: Check specific blockchain analysis
    console.log('\n🔍 Step 3: Testing individual blockchain analysis...');
    for (const blockchain of detectedBlockchains) {
      console.log(`\nTesting ${blockchain} analysis...`);
      try {
        const blockchainAnalysis = await WalletAnalysisService.analyzeWallet(testWallet, false);
        const blockchainData = blockchainAnalysis.blockchains[blockchain];
        if (blockchainData) {
          console.log(`✅ ${blockchain.toUpperCase()}: $${blockchainData.balance.usdValue} (${blockchainData.recentTransactions.length} transactions)`);
        } else {
          console.log(`❌ ${blockchain.toUpperCase()}: No data found`);
        }
      } catch (error) {
        console.log(`❌ ${blockchain.toUpperCase()}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Test 4: Check Azure token price loading
    console.log('\n☁️ Step 4: Checking Azure token price loading...');
    // This would require testing the PriceService directly
    console.log('Note: Azure token price loading is handled by PriceService in the agent');
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    logger.error('Traditional analysis test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testTraditionalAnalysis()
    .then(() => {
      console.log('\n🏁 Test script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

export { testTraditionalAnalysis };
