const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Test: Direct Service Call from Compiled Version');
console.log('================================================');

async function testCompiledService() {
  try {
    console.log('🚀 Importing compiled WalletAnalysisService...');
    const { WalletAnalysisService } = require('./dist/services/WalletAnalysisService');
    
    const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
    
    console.log('🔍 Calling analyzeWallet from compiled service...');
    const result = await WalletAnalysisService.analyzeWallet(address, false);
    
    console.log('✅ Compiled Service Result:');
    console.log(`  - Address: ${result.address}`);
    console.log(`  - Total Value: $${result.totalValue}`);
    console.log(`  - Total Transactions: ${result.totalTransactions}`);
    console.log(`  - Blockchains: ${Object.keys(result.blockchains).join(', ')}`);
    
    // Check Ethereum specifically
    if (result.blockchains.ethereum) {
      const eth = result.blockchains.ethereum;
      console.log('  - Ethereum Analysis:');
      console.log(`    - Balance: ${eth.balance.native} ($${eth.balance.usdValue})`);
      console.log(`    - Tokens: ${eth.tokens.length}`);
      console.log(`    - Total Tokens: ${eth.totalTokens}`);
      
      if (eth.tokens.length > 0) {
        console.log('    - Token details:');
        eth.tokens.forEach((token, index) => {
          console.log(`      ${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue})`);
        });
      }
    }
    
  } catch (error) {
    console.log('❌ Compiled service test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

testCompiledService().catch(console.error);
