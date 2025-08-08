import { WalletAnalysisServiceUltraOptimized } from '../services/WalletAnalysisServiceUltraOptimized';

async function testBSCAnalysis() {
  console.log('🔍 Testing BSC Analysis Specifically');
  console.log('====================================');
  
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    
    // Test BSC balance directly
    const bscConfig = WalletAnalysisServiceUltraOptimized['BLOCKCHAIN_APIS']['bsc'];
    console.log('\n🔧 BSC Configuration:');
    console.log(`API Key: ${bscConfig.apiKey ? 'Present' : 'Missing'}`);
    console.log(`Balance URL: ${bscConfig.balanceUrl}`);
    
    // Test balance API call
    console.log('\n💰 Testing BSC Balance API...');
    const balanceUrl = bscConfig.balanceUrl.replace('{address}', testWallet).replace('{key}', bscConfig.apiKey || '');
    console.log(`URL: ${balanceUrl}`);
    
    const balanceResponse = await fetch(balanceUrl);
    const balanceData = await balanceResponse.json() as any;
    console.log(`Response Status: ${balanceResponse.status}`);
    console.log(`Response Data:`, JSON.stringify(balanceData, null, 2));
    
    if (balanceData.status === '1') {
      const balanceWei = BigInt(balanceData.result);
      const balanceBNB = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6);
      console.log(`\n✅ BSC Balance: ${balanceBNB} BNB`);
    } else {
      console.log(`\n❌ BSC Balance Error: ${balanceData.message || 'Unknown error'}`);
    }
    
    // Test transaction API call
    console.log('\n📊 Testing BSC Transaction API...');
    const txUrl = bscConfig.txUrl.replace('{address}', testWallet).replace('{limit}', '5').replace('{key}', bscConfig.apiKey || '');
    console.log(`URL: ${txUrl}`);
    
    const txResponse = await fetch(txUrl);
    const txData = await txResponse.json() as any;
    console.log(`Response Status: ${txResponse.status}`);
    console.log(`Response Data:`, JSON.stringify(txData, null, 2));
    
    if (txData.status === '1' && txData.result) {
      console.log(`\n✅ BSC Transactions: ${txData.result.length} found`);
    } else {
      console.log(`\n❌ BSC Transaction Error: ${txData.message || 'Unknown error'}`);
    }
    
    // Test token API call
    console.log('\n🪙 Testing BSC Token API...');
    const tokenUrl = bscConfig.tokenUrl.replace('{address}', testWallet).replace('{limit}', '10').replace('{key}', bscConfig.apiKey || '');
    console.log(`URL: ${tokenUrl}`);
    
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json() as any;
    console.log(`Response Status: ${tokenResponse.status}`);
    console.log(`Response Data:`, JSON.stringify(tokenData, null, 2));
    
    if (tokenData.status === '1' && tokenData.result) {
      console.log(`\n✅ BSC Token Transactions: ${tokenData.result.length} found`);
    } else {
      console.log(`\n❌ BSC Token Error: ${tokenData.message || 'Unknown error'}`);
    }
    
    // Now test the full BSC analysis
    console.log('\n🚀 Testing Full BSC Analysis...');
    const bscAnalysis = await WalletAnalysisServiceUltraOptimized['analyzeSingleBlockchain'](testWallet, 'bsc', false);
    console.log(`\n📊 BSC Analysis Results:`);
    console.log(`- Native Balance: ${bscAnalysis.balance.native}`);
    console.log(`- USD Value: $${bscAnalysis.balance.usdValue.toFixed(2)}`);
    console.log(`- Token Count: ${bscAnalysis.tokens.length}`);
    console.log(`- Transaction Count: ${bscAnalysis.transactionCount}`);
    
    if (bscAnalysis.tokens.length > 0) {
      console.log(`- Tokens:`);
      bscAnalysis.tokens.forEach((token: any) => {
        console.log(`  * ${token.symbol}: ${token.balance} ($${token.usdValue.toFixed(2)})`);
      });
    }
    
  } catch (error) {
    console.error('❌ BSC test failed:', error);
  }
}

// Run the BSC test
if (require.main === module) {
  testBSCAnalysis()
    .then(() => {
      console.log('\n🏁 BSC test finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 BSC test failed:', error);
      process.exit(1);
    });
}

export { testBSCAnalysis };
