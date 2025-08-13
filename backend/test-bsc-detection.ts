import 'dotenv/config';

async function testBSCDetection() {
  console.log('🧪 Testing BSC Detection via Etherscan V2 API...\n');
  
  const walletAddress = "0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b";
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`• ETHERSCAN_API_KEY: ${process.env.ETHERSCAN_API_KEY ? 'SET' : 'MISSING'}`);
  
  if (!process.env.ETHERSCAN_API_KEY) {
    console.log('❌ ETHERSCAN_API_KEY is missing! This is why BSC detection is failing.');
    return;
  }
  
  try {
    // Test BSC activity detection via Etherscan V2 API with chain ID 56
    console.log('\n🔍 Testing BSC activity detection via Etherscan V2...');
    
    const response = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`);
    const data = await response.json();
    
    console.log('📊 Etherscan V2 BSC API Response:');
    console.log(`• Status: ${data.status}`);
    console.log(`• Message: ${data.message}`);
    console.log(`• Result count: ${data.result ? data.result.length : 0}`);
    
    if (data.status === '1' && data.result && data.result.length > 0) {
      console.log('✅ BSC activity detected! The wallet has transactions on BSC.');
      console.log(`• First transaction: ${data.result[0].hash}`);
      console.log(`• Total transactions: ${data.result.length}`);
    } else {
      console.log('❌ No BSC activity detected or API error.');
      if (data.message) {
        console.log(`• Error: ${data.message}`);
      }
    }
    
    // Also test token transactions
    console.log('\n🔍 Testing BSC token transactions via Etherscan V2...');
    
    const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`);
    const tokenData = await tokenResponse.json();
    
    console.log('📊 Etherscan V2 BSC Token API Response:');
    console.log(`• Status: ${tokenData.status}`);
    console.log(`• Message: ${tokenData.message}`);
    console.log(`• Token transactions: ${tokenData.result ? tokenData.result.length : 0}`);
    
    if (tokenData.status === '1' && tokenData.result && tokenData.result.length > 0) {
      console.log('✅ BSC token activity detected!');
      console.log(`• Token transactions: ${tokenData.result.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing BSC detection:', error);
  }
}

// Run the test
testBSCDetection().catch(console.error);
