import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('🔍 Testing Specific Wallet: 0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b');
console.log('================================');

const WALLET_ADDRESS = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';

// Test Ethereum via Etherscan API
async function testEtherscanAPI() {
  console.log('\n🌐 Testing Ethereum via Etherscan API...');
  const apiKey = process.env['ETHERSCAN_API_KEY'];
  
  if (!apiKey) {
    console.log('❌ ETHERSCAN_API_KEY not found');
    return;
  }
  
  try {
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${WALLET_ADDRESS}&tag=latest&apikey=${apiKey}`);
    const data = await response.json() as any;
    
    if (data.status === '1') {
      const balanceWei = BigInt(data.result);
      const balanceEth = Number(balanceWei) / Math.pow(10, 18);
      console.log('✅ Etherscan API working');
      console.log('  Balance:', balanceEth.toFixed(6), 'ETH');
      console.log('  Raw Balance:', data.result, 'wei');
    } else {
      console.log('❌ Etherscan API error:', data.message);
    }
  } catch (error) {
    console.log('❌ Etherscan API connection failed:', error);
  }
}

// Test Ethereum via Infura API
async function testInfuraAPI() {
  console.log('\n🌐 Testing Ethereum via Infura API...');
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
        params: [WALLET_ADDRESS, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const balanceWei = BigInt(data.result);
      const balanceEth = Number(balanceWei) / Math.pow(10, 18);
      console.log('✅ Infura API working');
      console.log('  Balance:', balanceEth.toFixed(6), 'ETH');
      console.log('  Raw Balance:', data.result, 'wei');
    } else {
      console.log('❌ Infura API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Infura API connection failed:', error);
  }
}

// Test BSC via Infura API
async function testBSCAPI() {
  console.log('\n🌐 Testing BSC via Infura API...');
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
        params: [WALLET_ADDRESS, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const balanceWei = BigInt(data.result);
      const balanceBnb = Number(balanceWei) / Math.pow(10, 18);
      console.log('✅ BSC via Infura API working');
      console.log('  Balance:', balanceBnb.toFixed(6), 'BNB');
      console.log('  Raw Balance:', data.result, 'wei');
    } else {
      console.log('❌ BSC via Infura API error:', data.error);
    }
  } catch (error) {
    console.log('❌ BSC via Infura API connection failed:', error);
  }
}

// Test Polygon via Infura API
async function testPolygonAPI() {
  console.log('\n🌐 Testing Polygon via Infura API...');
  const projectId = process.env['INFURA_PROJECT_ID'];
  
  if (!projectId) {
    console.log('❌ INFURA_PROJECT_ID not found');
    return;
  }
  
  try {
    const response = await fetch(`https://polygon-mainnet.infura.io/v3/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [WALLET_ADDRESS, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const balanceWei = BigInt(data.result);
      const balanceMatic = Number(balanceWei) / Math.pow(10, 18);
      console.log('✅ Polygon via Infura API working');
      console.log('  Balance:', balanceMatic.toFixed(6), 'MATIC');
      console.log('  Raw Balance:', data.result, 'wei');
    } else {
      console.log('❌ Polygon via Infura API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Polygon via Infura API connection failed:', error);
  }
}

// Test Solana API (Note: This is an Ethereum address, so it won't have Solana balance)
async function testSolanaAPI() {
  console.log('\n🌐 Testing Solana API...');
  console.log('⚠️  Note: This is an Ethereum address, so no Solana balance expected');
  
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getBalance',
        params: [WALLET_ADDRESS],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      console.log('✅ Solana API working');
      console.log('  Balance:', data.result.value, 'lamports');
      console.log('  SOL:', Number(data.result.value) / Math.pow(10, 9));
    } else {
      console.log('❌ Solana API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Solana API connection failed:', error);
  }
}

// Get transaction count for Ethereum
async function getTransactionCount() {
  console.log('\n📊 Getting Transaction Count...');
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
        method: 'eth_getTransactionCount',
        params: [WALLET_ADDRESS, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      const txCount = parseInt(data.result, 16);
      console.log('✅ Transaction count retrieved');
      console.log('  Nonce:', txCount);
      console.log('  This indicates', txCount, 'transactions have been sent from this wallet');
    } else {
      console.log('❌ Error getting transaction count:', data.error);
    }
  } catch (error) {
    console.log('❌ Failed to get transaction count:', error);
  }
}

// Run all tests
async function runAllTests() {
  await testEtherscanAPI();
  await testInfuraAPI();
  await testBSCAPI();
  await testPolygonAPI();
  await testSolanaAPI();
  await getTransactionCount();
  
  console.log('\n🎉 Wallet analysis completed!');
  console.log('\n📝 Summary:');
  console.log('  - This appears to be an Ethereum wallet address');
  console.log('  - Check the balances above to see if it has funds on different networks');
  console.log('  - The transaction count shows how active this wallet has been');
}

runAllTests().catch(console.error); 