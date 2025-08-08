import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function testEtherscanMultiChain() {
  console.log('🔍 Testing Etherscan Multi-Chain API');
  console.log('=====================================');
  
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  const apiKey = process.env['ETHERSCAN_API_KEY'];
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    console.log(`🔑 API Key: ${apiKey ? 'Present' : 'Missing'}`);
    
    // Test different chains
    const chains = [
      { name: 'Ethereum', chainId: 1 },
      { name: 'BSC', chainId: 56 },
      { name: 'Polygon', chainId: 137 },
      { name: 'Arbitrum', chainId: 42161 },
      { name: 'Optimism', chainId: 10 },
      { name: 'Base', chainId: 8453 },
      { name: 'Linea', chainId: 59144 }
    ];
    
    for (const chain of chains) {
      console.log(`\n💰 Testing ${chain.name} (Chain ID: ${chain.chainId})...`);
      
      const balanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${testWallet}&tag=latest&apikey=${apiKey}&chainid=${chain.chainId}`;
      
      try {
        const response = await fetch(balanceUrl);
        const data = await response.json() as any;
        
        console.log(`Response Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(data, null, 2));
        
        if (data.status === '1') {
          const balanceWei = BigInt(data.result);
          const balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6);
          console.log(`✅ ${chain.name} Balance: ${balance}`);
        } else {
          console.log(`❌ ${chain.name} Error: ${data.message || 'Unknown error'}`);
        }
        
      } catch (error) {
        console.log(`❌ ${chain.name} Request failed:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testEtherscanMultiChain()
    .then(() => {
      console.log('\n🏁 Etherscan multi-chain test finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Etherscan multi-chain test failed:', error);
      process.exit(1);
    });
}

export { testEtherscanMultiChain };
