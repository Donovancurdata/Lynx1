async function testSolscanAPI() {
  try {
    console.log('🔍 Testing Solscan API...');
    
    const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    const url = `https://public-api.solscan.io/account/${walletAddress}`;
    
    console.log(`📋 Testing with address: ${walletAddress}`);
    console.log(`🌐 URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('\n✅ Solscan API Response:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data));
    
    if (data) {
      console.log('\n📊 Data details:');
      console.log('- lamports:', data.lamports);
      console.log('- owner:', data.owner);
      console.log('- executable:', data.executable);
      console.log('- rentEpoch:', data.rentEpoch);
      console.log('- data:', data.data ? 'present' : 'missing');
      
      // Check if this indicates activity
      const hasActivity = data && data.lamports !== undefined;
      console.log('\n🔍 Activity Detection:');
      console.log('- Has activity:', hasActivity);
      console.log('- Reason:', hasActivity ? 'lamports found' : 'lamports missing or undefined');
    } else {
      console.log('❌ No data returned');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSolscanAPI();
