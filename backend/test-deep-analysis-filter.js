const axios = require('axios');

async function testDeepAnalysis() {
  try {
    console.log('🧪 Testing Deep Analysis with Ethereum Filter...');
    
    const requestBody = {
      address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
      blockchainFilter: 'ethereum'
    };
    
    console.log('📤 Sending request body:', JSON.stringify(requestBody, null, 2));
    
    // First check if server is running
    try {
      const healthResponse = await axios.get('http://localhost:3001/health');
      console.log('✅ Health check successful:', healthResponse.status);
    } catch (healthError) {
      console.error('❌ Health check failed:', healthError.message);
      return;
    }
    
    const response = await axios.post('http://localhost:3001/api/v1/wallet/deep-analyze', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const result = response.data;
    
    console.log('✅ Response received:');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    console.log('Analysis Type:', result.analysisType);
    console.log('Blockchain Filter:', result.blockchainFilter);
    console.log('Analyzed Chains:', result.analyzedChains);
    console.log('Total Value:', result.data?.totalValue);
    console.log('Total Transactions:', result.data?.totalTransactions);
    console.log('Blockchains found:', Object.keys(result.data?.blockchains || {}));
    
    // Check if Solana is excluded
    if (result.data?.blockchains?.solana) {
      console.log('❌ ERROR: Solana should be excluded for Ethereum analysis!');
    } else {
      console.log('✅ SUCCESS: Solana is properly excluded from Ethereum analysis');
    }
    
    // Check if only Ethereum-based chains are included
    const ethereumBasedChains = ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'linea', 'binance'];
    const foundChains = Object.keys(result.data?.blockchains || {});
    const nonEthereumChains = foundChains.filter(chain => !ethereumBasedChains.includes(chain));
    
    if (nonEthereumChains.length > 0) {
      console.log('❌ ERROR: Found non-Ethereum chains:', nonEthereumChains);
    } else {
      console.log('✅ SUCCESS: Only Ethereum-based chains found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received - server may be down');
    } else {
      console.error('Request setup failed:', error.message);
    }
  }
}

testDeepAnalysis();
