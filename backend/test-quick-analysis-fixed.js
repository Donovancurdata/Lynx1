const axios = require('axios');

console.log('🧪 Testing Quick Analysis with Fixed Values...');

const TEST_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';

async function testQuickAnalysis() {
  try {
    console.log(`🔍 Testing Quick Analysis for: ${TEST_ADDRESS}`);
    
    const response = await axios.post('http://localhost:3001/api/v1/wallet/analyze', {
      address: TEST_ADDRESS,
      analysisType: 'quick'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log(`✅ Quick Analysis SUCCESS!`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${response.data.success}`);
    console.log(`   Analysis Type: ${response.data.analysisType}`);
    
    if (response.data.data && response.data.data.blockchains.ethereum) {
      const ethData = response.data.data.blockchains.ethereum;
      console.log('\n📊 Ethereum Analysis Results:');
      console.log(`   ETH Balance: ${ethData.balance.native} ETH`);
      console.log(`   USD Value: $${ethData.balance.usdValue.toFixed(2)}`);
      console.log(`   Transactions: ${ethData.transactionCount}`);
    }
    
    console.log(`\n📊 Overall Results:`);
    console.log(`   Total Value: $${response.data.data.totalValue.toFixed(2)}`);
    console.log(`   Total Transactions: ${response.data.data.totalTransactions}`);
    
  } catch (error) {
    console.log(`❌ Quick Analysis failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testQuickAnalysis().catch(console.error);
