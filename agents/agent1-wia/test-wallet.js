const { Agent1WIA } = require('./dist/Agent1WIA');

async function testWallet() {
  try {
    console.log('🔍 Testing wallet analysis...');
    
    const agent1 = new Agent1WIA();
    const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    
    console.log(`📋 Wallet Address: ${walletAddress}`);
    
    // Test blockchain detection
    console.log('\n🔗 Testing blockchain detection...');
    const detection = await agent1.detectBlockchain(walletAddress);
    console.log('Detection result:', detection);
    
    // Test wallet data
    console.log('\n💰 Testing wallet data...');
    const walletData = await agent1.getWalletData(walletAddress, detection.blockchain);
    console.log('Wallet data:', JSON.stringify(walletData, null, 2));
    
    // Test investigation
    console.log('\n🔍 Testing investigation...');
    const investigation = await agent1.investigateWallet({
      walletAddress: walletAddress,
      blockchain: detection.blockchain
    });
    console.log('Investigation result:', JSON.stringify(investigation, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testWallet();
