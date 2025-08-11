const axios = require('axios');

async function testTokenBalances() {
  console.log('🔍 Testing Token Balances and USD Values...\n');
  
  try {
    const response = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
      address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
      analysisType: 'quick'
    });
    
    console.log('✅ Backend Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Extract key data
    const data = response.data.data;
    if (data && data.blockchains && data.blockchains.ethereum) {
      const ethData = data.blockchains.ethereum;
      console.log('\n🔍 Detailed Analysis:');
      console.log(`• Native Balance: ${ethData.balance.native} ETH`);
      console.log(`• USD Value: $${ethData.balance.usdValue}`);
      console.log(`• Total Tokens: ${ethData.totalTokens}`);
      
      if (ethData.tokens && ethData.tokens.length > 0) {
        console.log('\n💰 Token Details:');
        ethData.tokens.forEach((token, index) => {
          console.log(`${index + 1}. ${token.symbol}:`);
          console.log(`   Balance: ${token.balance}`);
          console.log(`   USD Value: $${token.usdValue}`);
          console.log(`   Price: $${token.price}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testTokenBalances();
