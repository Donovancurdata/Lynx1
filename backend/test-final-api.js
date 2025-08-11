// Final test to confirm backend API is working
const axios = require('axios');

async function testFinalAPI() {
  console.log('🧪 Final Backend API Test...\n');
  
  try {
    console.log('🔍 Calling backend API for quick analysis...');
    const response = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
      address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
      analysisType: 'quick'
    });
    
    console.log('✅ Backend API Response:');
    console.log('=' .repeat(50));
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check if we got token data
    console.log('\n🔍 Token Data Check:');
    console.log('=' .repeat(50));
    if (response.data.data && response.data.data.blockchains && response.data.data.blockchains.ethereum) {
      const ethData = response.data.data.blockchains.ethereum;
      console.log(`• Has tokens array: ${!!ethData.tokens}`);
      console.log(`• Tokens array length: ${ethData.tokens?.length || 0}`);
      console.log(`• Total tokens: ${ethData.totalTokens}`);
      console.log(`• Balance USD value: ${ethData.balance?.usdValue}`);
      console.log(`• Native balance: ${ethData.balance?.native}`);
      
      if (ethData.tokens && ethData.tokens.length > 0) {
        console.log('\n💰 Token Details:');
        ethData.tokens.forEach((token, index) => {
          console.log(`${index + 1}. ${token.symbol}:`);
          console.log(`   Balance: ${token.balance}`);
          console.log(`   USD Value: ${token.usdValue}`);
          console.log(`   Has Price: ${!!token.price}`);
          console.log(`   Price: ${token.price || 'N/A'}`);
        });
        
        console.log('\n✅ SUCCESS! Backend is now returning real token data!');
        console.log('The intelligent agent should now be able to display correct USD values.');
      } else {
        console.log('\n❌ Still no tokens found in API response!');
      }
    } else {
      console.log('❌ No ethereum blockchain data found in API response!');
    }
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Backend Error Response:', error.response.status, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testFinalAPI();
