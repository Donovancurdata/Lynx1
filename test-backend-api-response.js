// Test script to see exactly what the backend API returns
const axios = require('axios');

async function testBackendAPI() {
  console.log('🧪 Testing Backend API Response Structure...\n');
  
  try {
    const response = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
      address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
      analysisType: 'quick'
    });
    
    console.log('✅ Backend API Response:');
    console.log('=' .repeat(50));
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check the structure
    const data = response.data.data;
    if (data && data.blockchains && data.blockchains.ethereum) {
      const ethData = data.blockchains.ethereum;
      console.log('\n🔍 Structure Analysis:');
      console.log('=' .repeat(50));
      console.log(`• Has tokens array: ${!!ethData.tokens}`);
      console.log(`• Tokens array length: ${ethData.tokens?.length || 0}`);
      console.log(`• Total tokens: ${ethData.totalTokens}`);
      console.log(`• Balance USD value: ${ethData.balance.usdValue}`);
      
      if (ethData.tokens && ethData.tokens.length > 0) {
        console.log('\n💰 Token Details:');
        ethData.tokens.forEach((token, index) => {
          console.log(`${index + 1}. ${token.symbol}:`);
          console.log(`   Balance: ${token.balance}`);
          console.log(`   USD Value: ${token.usdValue}`);
          console.log(`   Has Price: ${!!token.price}`);
          console.log(`   Price: ${token.price || 'N/A'}`);
        });
      } else {
        console.log('\n❌ No tokens array found in response!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error calling backend API:', error.response?.data || error.message);
  }
}

testBackendAPI();
