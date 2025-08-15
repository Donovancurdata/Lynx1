const axios = require('axios');

async function testDeepAnalysis() {
  try {
    console.log('🔍 Testing deep analysis endpoint...');
    
    const testAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    const url = 'http://localhost:3001/api/v1/wallet/deep-analyze';
    
    console.log(`📋 Testing with address: ${testAddress}`);
    console.log(`🌐 URL: ${url}`);
    
    const response = await axios.post(url, {
      address: testAddress
    }, {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Deep analysis completed!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n📊 Analysis Summary:');
      console.log('- Address:', response.data.data?.address);
      console.log('- Total Value:', response.data.data?.totalValue);
      console.log('- Total Transactions:', response.data.data?.totalTransactions);
      console.log('- Blockchains:', Object.keys(response.data.data?.blockchains || {}));
      
      if (response.data.data?.blockchains?.solana) {
        console.log('\n🔗 Solana Details:');
        console.log('- Balance:', response.data.data.blockchains.solana.balance);
        console.log('- Transactions:', response.data.data.blockchains.solana.transactionCount);
        console.log('- Recent Transactions:', response.data.data.blockchains.solana.recentTransactions?.length || 0);
      }
    } else {
      console.log('❌ Analysis failed:', response.data.error || response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testDeepAnalysis();
