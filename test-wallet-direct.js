const axios = require('axios');

async function testWalletDirect() {
  const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  console.log('🔍 Testing wallet directly:', address);
  console.log('=====================================');
  
  try {
    // Test 1: Get ETH balance from Etherscan
    console.log('\n1. Getting ETH balance...');
    const balanceResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest',
        apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
      }
    });
    
    if (balanceResponse.data.status === '1') {
      const balanceInWei = balanceResponse.data.result;
      const balanceInEth = (parseInt(balanceInWei) / 1e18).toFixed(6);
      console.log('✅ ETH Balance:', balanceInEth, 'ETH');
    } else {
      console.log('❌ Failed to get balance:', balanceResponse.data.message);
    }
    
    // Test 2: Get token transfers
    console.log('\n2. Getting token transfers...');
    const tokenResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'tokentx',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
      }
    });
    
    if (tokenResponse.data.status === '1') {
      const tokenTransfers = tokenResponse.data.result;
      console.log('✅ Token transfers found:', tokenTransfers.length);
      
      // Group by token contract
      const uniqueTokens = new Map();
      tokenTransfers.forEach(tx => {
        if (!uniqueTokens.has(tx.contractAddress)) {
          uniqueTokens.set(tx.contractAddress, {
            contractAddress: tx.contractAddress,
            tokenName: tx.tokenName,
            tokenSymbol: tx.tokenSymbol,
            decimals: parseInt(tx.tokenDecimal),
            transfers: []
          });
        }
        uniqueTokens.get(tx.contractAddress).transfers.push(tx);
      });
      
      console.log('✅ Unique tokens found:', uniqueTokens.size);
      uniqueTokens.forEach((token, contractAddress) => {
        console.log(`   - ${token.tokenName} (${token.tokenSymbol}): ${token.transfers.length} transfers`);
      });
    } else {
      console.log('❌ Failed to get token transfers:', tokenResponse.data.message);
    }
    
    // Test 3: Get normal transactions
    console.log('\n3. Getting normal transactions...');
    const txResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
      }
    });
    
    if (txResponse.data.status === '1') {
      const transactions = txResponse.data.result;
      console.log('✅ Normal transactions found:', transactions.length);
      
      if (transactions.length > 0) {
        console.log('Recent transactions:');
        transactions.slice(0, 5).forEach((tx, index) => {
          const valueInEth = (parseInt(tx.value) / 1e18).toFixed(6);
          console.log(`   ${index + 1}. ${tx.timeStamp} - ${valueInEth} ETH`);
          console.log(`      From: ${tx.from}`);
          console.log(`      To: ${tx.to}`);
          console.log(`      Hash: ${tx.hash}`);
        });
      }
    } else {
      console.log('❌ Failed to get transactions:', txResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWalletDirect().catch(console.error); 