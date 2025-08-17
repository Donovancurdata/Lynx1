const axios = require('axios');

console.log('🧪 Testing Full Transaction List Count...');

const TEST_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
const ETHERSCAN_API_KEY = 'MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN';

async function testFullTransactionList() {
  try {
    // Get the full transaction list
    console.log('🔍 Fetching full transaction list...');
    
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: TEST_ADDRESS,
        startblock: 0,
        endblock: 99999999,
        sort: 'asc',
        apikey: ETHERSCAN_API_KEY
      },
      timeout: 30000
    });
    
    console.log(`✅ Transaction List Response:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Status Message: ${response.data.message}`);
    console.log(`   Result Count: ${response.data.result ? response.data.result.length : 'No result'}`);
    
    if (response.data && response.data.result && Array.isArray(response.data.result)) {
      const transactions = response.data.result;
      console.log(`\n📊 Transaction Analysis:`);
      console.log(`   Total Transactions: ${transactions.length}`);
      
      // Count different types of transactions
      let incomingCount = 0;
      let outgoingCount = 0;
      let contractInteractions = 0;
      
      transactions.forEach(tx => {
        if (tx.to.toLowerCase() === TEST_ADDRESS.toLowerCase()) {
          incomingCount++;
        } else if (tx.from.toLowerCase() === TEST_ADDRESS.toLowerCase()) {
          outgoingCount++;
        }
        
        if (tx.input && tx.input !== '0x') {
          contractInteractions++;
        }
      });
      
      console.log(`   Incoming Transactions: ${incomingCount}`);
      console.log(`   Outgoing Transactions: ${outgoingCount}`);
      console.log(`   Contract Interactions: ${contractInteractions}`);
      
      // Show first and last few transactions
      if (transactions.length > 0) {
        console.log(`\n📝 First Transaction:`);
        console.log(`   Hash: ${transactions[0].hash}`);
        console.log(`   Block: ${transactions[0].blockNumber}`);
        console.log(`   From: ${transactions[0].from}`);
        console.log(`   To: ${transactions[0].to}`);
        console.log(`   Value: ${transactions[0].value}`);
        
        console.log(`\n📝 Last Transaction:`);
        const lastTx = transactions[transactions.length - 1];
        console.log(`   Hash: ${lastTx.hash}`);
        console.log(`   Block: ${lastTx.blockNumber}`);
        console.log(`   From: ${lastTx.from}`);
        console.log(`   To: ${lastTx.to}`);
        console.log(`   Value: ${lastTx.value}`);
      }
      
      // Check if there are more transactions (pagination)
      if (transactions.length === 10000) {
        console.log(`\n⚠️ WARNING: Result limited to 10,000 transactions. There may be more!`);
        console.log(`   Etherscan API limits results to 10,000 transactions per request.`);
        console.log(`   To get the full count, we need to use pagination.`);
      }
      
    } else {
      console.log(`❌ No transaction data found`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testFullTransactionList().catch(console.error);
