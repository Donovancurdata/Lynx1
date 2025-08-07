import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('🔍 Testing Solana Wallet: CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4');
console.log('================================');

const SOLANA_WALLET_ADDRESS = 'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4';

// Test Solana API
async function testSolanaAPI() {
  console.log('\n🌐 Testing Solana API...');
  
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getBalance',
        params: [SOLANA_WALLET_ADDRESS],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const balanceLamports = data.result.value;
      const balanceSol = Number(balanceLamports) / Math.pow(10, 9);
      console.log('✅ Solana API working');
      console.log('  Balance:', balanceSol.toFixed(6), 'SOL');
      console.log('  Raw Balance:', balanceLamports, 'lamports');
    } else {
      console.log('❌ Solana API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Solana API connection failed:', error);
  }
}

// Test Solana token accounts
async function testSolanaTokenAccounts() {
  console.log('\n🪙 Testing Solana Token Accounts...');
  
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getTokenAccountsByOwner',
        params: [
          SOLANA_WALLET_ADDRESS,
          {
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
          },
          {
            encoding: 'jsonParsed'
          }
        ],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result && data.result.value) {
      console.log('✅ Token accounts retrieved');
      console.log('  Total token accounts:', data.result.value.length);
      
      if (data.result.value.length > 0) {
        console.log('\n  Token details:');
        data.result.value.forEach((account: any, index: number) => {
          const tokenInfo = account.account.data.parsed.info;
          const balance = tokenInfo.tokenAmount.uiAmount;
          const symbol = tokenInfo.mint;
          
          if (balance > 0) {
            console.log(`    ${index + 1}. ${symbol}: ${balance}`);
          }
        });
      } else {
        console.log('  No token accounts found');
      }
    } else {
      console.log('❌ Error getting token accounts:', data.error);
    }
  } catch (error) {
    console.log('❌ Failed to get token accounts:', error);
  }
}

// Test Solana transaction count
async function testSolanaTransactionCount() {
  console.log('\n📊 Getting Solana Transaction Count...');
  
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getSignatureStatuses',
        params: [
          [SOLANA_WALLET_ADDRESS],
          {
            searchTransactionHistory: true
          }
        ],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      console.log('✅ Transaction status retrieved');
      console.log('  Note: This shows recent transaction status');
    } else {
      console.log('❌ Error getting transaction status:', data.error);
    }
  } catch (error) {
    console.log('❌ Failed to get transaction status:', error);
  }
}

// Test if this address exists on Ethereum (unlikely but worth checking)
async function testEthereumAPI() {
  console.log('\n🌐 Testing Ethereum API (unlikely to have balance)...');
  const projectId = process.env['INFURA_PROJECT_ID'];
  
  if (!projectId) {
    console.log('❌ INFURA_PROJECT_ID not found');
    return;
  }
  
  try {
    const response = await fetch(`https://mainnet.infura.io/v3/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [SOLANA_WALLET_ADDRESS, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const balanceWei = BigInt(data.result);
      const balanceEth = Number(balanceWei) / Math.pow(10, 18);
      console.log('✅ Ethereum API working');
      console.log('  Balance:', balanceEth.toFixed(6), 'ETH');
      console.log('  Raw Balance:', data.result, 'wei');
    } else {
      console.log('❌ Ethereum API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Ethereum API connection failed:', error);
  }
}

// Test BSC API (unlikely but worth checking)
async function testBSCAPI() {
  console.log('\n🌐 Testing BSC API (unlikely to have balance)...');
  const projectId = process.env['INFURA_PROJECT_ID'];
  
  if (!projectId) {
    console.log('❌ INFURA_PROJECT_ID not found');
    return;
  }
  
  try {
    const response = await fetch(`https://bsc-mainnet.infura.io/v3/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [SOLANA_WALLET_ADDRESS, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const balanceWei = BigInt(data.result);
      const balanceBnb = Number(balanceWei) / Math.pow(10, 18);
      console.log('✅ BSC API working');
      console.log('  Balance:', balanceBnb.toFixed(6), 'BNB');
      console.log('  Raw Balance:', data.result, 'wei');
    } else {
      console.log('❌ BSC API error:', data.error);
    }
  } catch (error) {
    console.log('❌ BSC API connection failed:', error);
  }
}

// Test Solana account info
async function testSolanaAccountInfo() {
  console.log('\n📋 Getting Solana Account Info...');
  
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getAccountInfo',
        params: [
          SOLANA_WALLET_ADDRESS,
          {
            encoding: 'jsonParsed'
          }
        ],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result && data.result.value) {
      console.log('✅ Account info retrieved');
      console.log('  Owner:', data.result.value.owner);
      console.log('  Executable:', data.result.value.executable);
      console.log('  Lamports:', data.result.value.lamports);
      console.log('  Rent epoch:', data.result.value.rentEpoch);
    } else {
      console.log('❌ Error getting account info:', data.error);
    }
  } catch (error) {
    console.log('❌ Failed to get account info:', error);
  }
}

// Run all tests
async function runAllTests() {
  await testSolanaAPI();
  await testSolanaAccountInfo();
  await testSolanaTokenAccounts();
  await testSolanaTransactionCount();
  await testEthereumAPI();
  await testBSCAPI();
  
  console.log('\n🎉 Solana wallet analysis completed!');
  console.log('\n📝 Summary:');
  console.log('  - This is a Solana wallet address');
  console.log('  - Check the SOL balance and token accounts above');
  console.log('  - Other networks are unlikely to have balances for this address');
}

runAllTests().catch(console.error); 