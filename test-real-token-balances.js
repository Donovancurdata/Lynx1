const axios = require('axios');

async function checkRealTokenBalances() {
  console.log('🔍 Checking Real Token Balances via Etherscan...\n');
  
  const walletAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  const etherscanApiKey = 'MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN';
  
  try {
    // Get ERC-20 token transfers
    console.log('📊 Getting ERC-20 token transfers...');
    const transfersResponse = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'account',
        action: 'tokentx',
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: etherscanApiKey
      }
    });
    
    if (transfersResponse.data.status === '1') {
      const transfers = transfersResponse.data.result;
      console.log(`✅ Found ${transfers.length} token transfers`);
      
      // Group by token contract address
      const tokenMap = new Map();
      transfers.forEach(tx => {
        const tokenAddress = tx.contractAddress;
        const tokenSymbol = tx.tokenSymbol;
        const tokenName = tx.tokenName;
        const decimals = parseInt(tx.tokenDecimal);
        
        if (!tokenMap.has(tokenAddress)) {
          tokenMap.set(tokenAddress, {
            symbol: tokenSymbol,
            name: tokenName,
            decimals: decimals,
            transfers: []
          });
        }
        
        tokenMap.get(tokenAddress).transfers.push(tx);
      });
      
      console.log(`\n💰 Unique Tokens Found: ${tokenMap.size}`);
      
      // Check current balances for each token
      for (const [tokenAddress, tokenInfo] of tokenMap) {
        console.log(`\n🔍 ${tokenInfo.symbol} (${tokenInfo.name}):`);
        console.log(`   Contract: ${tokenAddress}`);
        console.log(`   Decimals: ${tokenInfo.decimals}`);
        
        // Get current balance
        try {
          const balanceResponse = await axios.get(`https://api.etherscan.io/api`, {
            params: {
              module: 'account',
              action: 'tokenbalance',
              contractaddress: tokenAddress,
              address: walletAddress,
              tag: 'latest',
              apikey: etherscanApiKey
            }
          });
          
          if (balanceResponse.data.status === '1') {
            const rawBalance = balanceResponse.data.result;
            const actualBalance = rawBalance / Math.pow(10, tokenInfo.decimals);
            console.log(`   Raw Balance: ${rawBalance}`);
            console.log(`   Actual Balance: ${actualBalance}`);
            
            if (actualBalance > 0) {
              console.log(`   ✅ Has balance: ${actualBalance} ${tokenInfo.symbol}`);
            } else {
              console.log(`   ❌ Zero balance`);
            }
          }
        } catch (error) {
          console.log(`   ❌ Error getting balance: ${error.message}`);
        }
      }
    } else {
      console.log('❌ Etherscan API error:', transfersResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRealTokenBalances();
