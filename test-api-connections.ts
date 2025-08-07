import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('🔍 Testing API Connections...');
console.log('================================');

// Test Ethereum/Etherscan API
async function testEtherscanAPI() {
  console.log('\n🌐 Testing Etherscan API...');
  const apiKey = process.env['ETHERSCAN_API_KEY'];
  const address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'; // Vitalik's wallet
  
  if (!apiKey) {
    console.log('❌ ETHERSCAN_API_KEY not found');
    return;
  }
  
  try {
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    const data = await response.json() as any;
    
    if (data.status === '1') {
      console.log('✅ Etherscan API working - Balance:', data.result);
    } else {
      console.log('❌ Etherscan API error:', data.message);
    }
  } catch (error) {
    console.log('❌ Etherscan API connection failed:', error);
  }
}

// Test Infura API
async function testInfuraAPI() {
  console.log('\n🌐 Testing Infura API...');
  const projectId = process.env['INFURA_PROJECT_ID'];
  const address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  
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
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      console.log('✅ Infura API working - Balance:', data.result);
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
  const address = '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3'; // Binance hot wallet
  
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
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      console.log('✅ BSC via Infura API working - Balance:', data.result);
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
  const address = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'; // WMATIC token contract
  
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
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      console.log('✅ Polygon via Infura API working - Balance:', data.result);
    } else {
      console.log('❌ Polygon via Infura API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Polygon via Infura API connection failed:', error);
  }
}

// Test Bitcoin via BTCScan API
async function testBitcoinAPI() {
  console.log('\n🌐 Testing Bitcoin via BTCScan API...');
  const btcscanUrl = process.env['BTCSCAN_API_URL'];
  const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Genesis block address
  
  if (!btcscanUrl) {
    console.log('❌ BTCSCAN_API_URL not found');
    return;
  }
  
  try {
    const response = await fetch(`${btcscanUrl}/address/${address}`);
    const data = await response.json() as any;
    
    if (data && data.chain_stats) {
      const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const txCount = data.chain_stats.tx_count;
      console.log('✅ Bitcoin via BTCScan API working - Balance:', balance, 'satoshis');
      console.log('  Transactions:', txCount);
      console.log('  Funded TXOs:', data.chain_stats.funded_txo_count);
      console.log('  Spent TXOs:', data.chain_stats.spent_txo_count);
    } else if (data && data.error) {
      console.log('❌ Bitcoin via BTCScan API error:', data.error);
    } else {
      console.log('❌ Bitcoin via BTCScan API error: Unknown error');
    }
  } catch (error) {
    console.log('❌ Bitcoin via BTCScan API connection failed:', error);
  }
}

// Test Solana API
async function testSolanaAPI() {
  console.log('\n🌐 Testing Solana API...');
  const address = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
  
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getBalance',
        params: [address],
        id: 1
      })
    });
    
    const data = await response.json() as any;
    
    if (data.result) {
      console.log('✅ Solana API working - Balance:', data.result.value);
    } else {
      console.log('❌ Solana API error:', data.error);
    }
  } catch (error) {
    console.log('❌ Solana API connection failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  await testEtherscanAPI();
  await testInfuraAPI();
  await testBSCAPI();
  await testPolygonAPI();
  await testBitcoinAPI();
  await testSolanaAPI();
  
  console.log('\n🎉 API connection tests completed!');
}

runAllTests().catch(console.error); 