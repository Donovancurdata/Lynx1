async function testWalletAPI() {
  const testAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  const baseUrl = 'http://localhost:3001/api/v1/wallet';

  console.log('🧪 Testing Wallet Analysis API');
  console.log('=' .repeat(50));
  console.log(`Test Address: ${testAddress}`);
  console.log(`API Endpoint: ${baseUrl}/analyze`);

  try {
    console.log('\n🚀 Sending API request...');
    const response = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address: testAddress, 
        deepAnalysis: false 
      })
    });
    
    const result = await response.json();
    
    console.log('\n📊 API Response:');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    
    if (result.success && result.data) {
      console.log('\n✅ API Data:');
      console.log(`Total Value: $${(result.data.totalValue || 0).toFixed(10)}`);
      console.log(`Total Transactions: ${result.data.totalTransactions || 0}`);
      console.log(`Blockchains: ${Object.keys(result.data.blockchains || {}).join(', ')}`);
      console.log(`Tokens Array Length: ${result.data.tokens ? result.data.tokens.length : 'N/A'}`);
      
      // Check for the specific issue mentioned
      if (result.data.totalValue < 0.000001) {
        console.log('\n❌ ISSUE DETECTED: totalValue is essentially $0');
      }
      
      if (!result.data.tokens || result.data.tokens.length === 0) {
        console.log('❌ ISSUE DETECTED: tokens array is empty');
      }
      
      console.log('\n🔍 Full response data:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log(`❌ API Error: ${result.error || 'Unknown error'}`);
      if (result.message) {
        console.log(`Message: ${result.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Run the test
testWalletAPI();