async function testMultipleWallets() {
  const testAddresses = [
    '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b', // Original test address
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Vitalik's address
    '0x8ba1f109551bD432803012645Hac136c2D2fDB',   // Example address
    '0x742d35Cc6634C0532925a3b8D3AC4E6632f8C48',   // Another example
  ];
  
  const baseUrl = 'http://localhost:3001/api/v1/wallet';

  console.log('🧪 Testing Multiple Wallet Addresses');
  console.log('=' .repeat(60));

  for (const address of testAddresses) {
    console.log(`\n🔍 Testing address: ${address}`);
    console.log('-' .repeat(50));

    try {
      const response = await fetch(`${baseUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: address, 
          deepAnalysis: false 
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`✅ Total Value: $${(result.data.totalValue || 0).toFixed(10)}`);
        console.log(`✅ Total Transactions: ${result.data.totalTransactions || 0}`);
        console.log(`✅ Blockchains: ${Object.keys(result.data.blockchains || {}).length}`);
        
        // Check for the specific issue
        if (result.data.totalValue < 0.000001) {
          console.log('❌ ISSUE: totalValue is essentially $0');
        }
        
        // Check if any blockchain has tokens
        let hasTokens = false;
        Object.entries(result.data.blockchains || {}).forEach(([blockchain, analysis]) => {
          if (analysis.tokens && analysis.tokens.length > 0) {
            hasTokens = true;
            console.log(`   ${blockchain}: ${analysis.tokens.length} tokens`);
          }
        });
        
        if (!hasTokens) {
          console.log('❌ ISSUE: No tokens found in any blockchain');
        }
        
      } else {
        console.log(`❌ Error: ${result.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error(`❌ Request failed: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run the test
testMultipleWallets();
