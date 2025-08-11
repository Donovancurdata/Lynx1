// Test script to debug backend token processing
const { WalletAnalysisService } = require('./backend/dist/services/WalletAnalysisService');

async function testBackendTokenProcessing() {
  console.log('🧪 Testing Backend Token Processing Directly...\n');
  
  try {
    // Test the analyzeEthereumWallet method directly
    console.log('🔍 Calling analyzeEthereumWallet directly...');
    const result = await WalletAnalysisService.analyzeEthereumWallet('0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b', false);
    
    console.log('✅ Direct method result:');
    console.log('=' .repeat(50));
    console.log(JSON.stringify(result, null, 2));
    
    // Check specific fields
    console.log('\n🔍 Field Analysis:');
    console.log('=' .repeat(50));
    console.log(`• Has tokens array: ${!!result.tokens}`);
    console.log(`• Tokens array length: ${result.tokens?.length || 0}`);
    console.log(`• Total tokens: ${result.totalTokens}`);
    console.log(`• Balance USD value: ${result.balance.usdValue}`);
    console.log(`• Native balance: ${result.balance.native}`);
    
    if (result.tokens && result.tokens.length > 0) {
      console.log('\n💰 Token Details:');
      result.tokens.forEach((token, index) => {
        console.log(`${index + 1}. ${token.symbol}:`);
        console.log(`   Balance: ${token.balance}`);
        console.log(`   USD Value: ${token.usdValue}`);
        console.log(`   Has Price: ${!!token.price}`);
        console.log(`   Price: ${token.price || 'N/A'}`);
      });
    } else {
      console.log('\n❌ No tokens found in direct method call!');
    }
    
  } catch (error) {
    console.error('❌ Error calling direct method:', error);
  }
}

testBackendTokenProcessing();
