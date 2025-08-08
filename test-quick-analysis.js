// Test Quick Analysis functionality
const axios = require('axios');

async function testQuickAnalysis() {
  const testAddress = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4';
  const baseUrl = 'http://localhost:3003/api/v1/wallet/analyze';
  
  console.log('🧪 Testing Quick Analysis...');
  console.log('🔧 Sending request with analysisType: quick');
  
  try {
    const response = await axios.post(baseUrl, {
      address: testAddress,
      analysisType: 'quick'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = response.data.data;
    console.log('✅ Quick Analysis Response:');
    console.log(`   Total Transactions: ${data.totalTransactions}`);
    console.log(`   Blockchains: ${Object.keys(data.blockchains).join(', ')}`);
    
    for (const [blockchain, analysis] of Object.entries(data.blockchains)) {
      console.log(`   ${blockchain}: ${analysis.transactionCount} transactions`);
      if (analysis.transactionCount > 200) {
        console.log(`   ⚠️  WARNING: Should show "200+" for Quick Analysis!`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testQuickAnalysis(); 