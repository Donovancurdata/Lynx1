async function testAgent1Import() {
  try {
    console.log('🔍 Testing Agent1WIA import...');
    
    // Try to import Agent1WIA
    console.log('📦 Attempting to import Agent1WIA...');
    const { Agent1WIA } = require('../agents/agent1-wia/dist/Agent1WIA');
    console.log('✅ Agent1WIA imported successfully');
    
    // Create instance
    console.log('🔧 Creating Agent1WIA instance...');
    const agent1 = new Agent1WIA();
    console.log('✅ Agent1WIA instance created');
    
    // Test wallet data
    const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    console.log(`📋 Testing wallet data for: ${walletAddress}`);
    
    const walletData = await agent1.getWalletData(walletAddress, 'solana');
    console.log('✅ Wallet data retrieved successfully');
    console.log('Data keys:', Object.keys(walletData));
    console.log('Balance:', walletData.balance);
    console.log('Transactions count:', walletData.transactions?.length || 0);
    
    // Test activity detection
    const hasActivity = walletData && (walletData.balance || walletData.transactions?.length > 0);
    console.log('\n🔍 Activity Detection:');
    console.log('- Has activity:', hasActivity);
    console.log('- Reason:', hasActivity ? 'balance or transactions found' : 'no balance or transactions');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAgent1Import();
