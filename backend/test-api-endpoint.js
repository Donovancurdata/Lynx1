const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

console.log('🔍 Test: API Endpoint vs Service Direct Call');
console.log('============================================');

async function testAPIEndpoint() {
  console.log('🚀 Testing API endpoint /api/v1/wallet/analyze...');
  
  try {
    const response = await fetch('http://localhost:3001/api/v1/wallet/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
        deepAnalysis: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check the structure
    if (data.success && data.data) {
      const result = data.data;
      console.log('\n📊 API Response Analysis:');
      console.log(`  - Address: ${result.address}`);
      console.log(`  - Total Value: $${result.totalValue}`);
      console.log(`  - Total Transactions: ${result.totalTransactions}`);
      console.log(`  - Blockchains: ${Object.keys(result.blockchains).join(', ')}`);
      
      // Check Ethereum specifically
      if (result.blockchains.ethereum) {
        const eth = result.blockchains.ethereum;
        console.log('  - Ethereum Analysis:');
        console.log(`    - Balance: ${eth.balance.native} ($${eth.balance.usdValue})`);
        console.log(`    - Tokens: ${eth.tokens.length}`);
        console.log(`    - Total Tokens: ${eth.totalTokens}`);
        
        if (eth.tokens.length > 0) {
          console.log('    - Token details:');
          eth.tokens.forEach((token, index) => {
            console.log(`      ${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue})`);
          });
        }
      }
    }
    
  } catch (error) {
    console.log('❌ API endpoint test failed:', error.message);
  }
}

async function testServiceDirectly() {
  console.log('\n🚀 Testing service directly...');
  
  try {
    const { WalletAnalysisService } = require('./dist/services/WalletAnalysisService');
    
    const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
    
    console.log('🔍 Calling analyzeWallet directly...');
    const result = await WalletAnalysisService.analyzeWallet(address, false);
    
    console.log('✅ Direct Service Result:');
    console.log(`  - Address: ${result.address}`);
    console.log(`  - Total Value: $${result.totalValue}`);
    console.log(`  - Total Transactions: ${result.totalTransactions}`);
    console.log(`  - Blockchains: ${Object.keys(result.blockchains).join(', ')}`);
    
    // Check Ethereum specifically
    if (result.blockchains.ethereum) {
      const eth = result.blockchains.ethereum;
      console.log('  - Ethereum Analysis:');
      console.log(`    - Balance: ${eth.balance.native} ($${eth.balance.usdValue})`);
      console.log(`    - Tokens: ${eth.tokens.length}`);
      console.log(`    - Total Tokens: ${eth.totalTokens}`);
      
      if (eth.tokens.length > 0) {
        console.log('    - Token details:');
        eth.tokens.forEach((token, index) => {
          console.log(`      ${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue})`);
        });
      }
    }
    
  } catch (error) {
    console.log('❌ Direct service test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

async function compareResults() {
  console.log('\n🔍 Comparing API vs Direct Service Results...');
  console.log('==============================================');
  
  // This will help identify if there's a mismatch
  console.log('If the API returns different data than the direct service call,');
  console.log('then the issue is in the API endpoint or controller.');
  console.log('If they return the same data, then the issue is in the intelligent agent.');
}

async function runAllTests() {
  await testAPIEndpoint();
  await testServiceDirectly();
  await compareResults();
  
  console.log('\n✅ Comparison complete!');
}

runAllTests().catch(console.error);
