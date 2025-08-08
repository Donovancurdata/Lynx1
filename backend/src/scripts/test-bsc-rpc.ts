async function testBSCRPC() {
  console.log('🔍 Testing BSC via RPC');
  console.log('========================');
  
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    
    // Test BSC balance via Infura RPC
    console.log('\n💰 Testing BSC Balance via RPC...');
    const rpcUrl = 'https://bsc-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39';
    
    const balanceRequest = {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [testWallet, 'latest'],
      id: 1
    };
    
    const balanceResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(balanceRequest)
    });
    
    const balanceData = await balanceResponse.json() as any;
    console.log(`Response:`, JSON.stringify(balanceData, null, 2));
    
    if (balanceData.result) {
      const balanceWei = BigInt(balanceData.result);
      const balanceBNB = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6);
      console.log(`\n✅ BSC Balance via RPC: ${balanceBNB} BNB`);
      
      if (parseFloat(balanceBNB) > 0) {
        console.log(`💰 This wallet HAS BSC funds: ${balanceBNB} BNB`);
      } else {
        console.log(`❌ This wallet has NO BSC funds`);
      }
    } else {
      console.log(`\n❌ BSC RPC Error: ${balanceData.error?.message || 'Unknown error'}`);
    }
    
    // Test transaction count via RPC
    console.log('\n📊 Testing BSC Transaction Count via RPC...');
    const txCountRequest = {
      jsonrpc: '2.0',
      method: 'eth_getTransactionCount',
      params: [testWallet, 'latest'],
      id: 2
    };
    
    const txCountResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(txCountRequest)
    });
    
    const txCountData = await txCountResponse.json() as any;
    console.log(`Transaction Count Response:`, JSON.stringify(txCountData, null, 2));
    
    if (txCountData.result) {
      const txCount = parseInt(txCountData.result, 16);
      console.log(`\n✅ BSC Transaction Count: ${txCount}`);
    } else {
      console.log(`\n❌ BSC Transaction Count Error: ${txCountData.error?.message || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('❌ BSC RPC test failed:', error);
  }
}

// Run the BSC RPC test
if (require.main === module) {
  testBSCRPC()
    .then(() => {
      console.log('\n🏁 BSC RPC test finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 BSC RPC test failed:', error);
      process.exit(1);
    });
}

export { testBSCRPC };
