const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Debug: Environment Variables');
console.log('================================');
console.log(`Etherscan API Key: ${process.env.ETHERSCAN_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`Current working directory: ${process.cwd()}`);
console.log(`Env file path: ${path.resolve(__dirname, '../.env')}`);
console.log('');

// Test 1: Direct Etherscan API call
async function testEtherscanAPI() {
  console.log('🔍 Test 1: Direct Etherscan API Call');
  console.log('=====================================');
  
  const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  const apiKey = process.env.ETHERSCAN_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No Etherscan API key found');
    return;
  }
  
  try {
    // Test balance
    console.log('💰 Testing ETH balance...');
    const balanceResponse = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    const balanceData = await balanceResponse.json();
    
    if (balanceData.status === '1') {
      const balanceWei = BigInt(balanceData.result);
      const balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6);
      console.log(`✅ ETH Balance: ${balance} ETH`);
    } else {
      console.log(`❌ Balance API error: ${balanceData.message}`);
    }
    
    // Test token transfers
    console.log('🪙 Testing token transfers...');
    const tokenResponse = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`);
    const tokenData = await tokenResponse.json();
    
    if (tokenData.status === '1' && tokenData.result) {
      console.log(`✅ Found ${tokenData.result.length} token transfers`);
      
      // Show unique tokens
      const uniqueTokens = new Set();
      tokenData.result.forEach(tx => {
        uniqueTokens.add(`${tx.tokenSymbol} (${tx.contractAddress})`);
      });
      
      console.log('📋 Unique tokens found:');
      Array.from(uniqueTokens).forEach(token => console.log(`  - ${token}`));
    } else {
      console.log(`❌ Token API error: ${tokenData.message}`);
    }
    
  } catch (error) {
    console.log('❌ API call failed:', error.message);
  }
}

// Test 2: Test the service directly
async function testServiceDirectly() {
  console.log('');
  console.log('🔍 Test 2: Test WalletAnalysisService Directly');
  console.log('==============================================');
  
  try {
    // Import the compiled service
    const { WalletAnalysisService } = require('./dist/services/WalletAnalysisService');
    
    const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
    
    console.log('🚀 Calling analyzeEthereumWallet directly...');
    const result = await WalletAnalysisService.analyzeEthereumWallet(address, false);
    
    console.log('✅ Service returned:');
    console.log(`  - Address: ${result.address}`);
    console.log(`  - Blockchain: ${result.blockchain}`);
    console.log(`  - Balance: ${result.balance.native} ($${result.balance.usdValue})`);
    console.log(`  - Tokens: ${result.tokens.length}`);
    console.log(`  - Total Tokens: ${result.totalTokens}`);
    
    if (result.tokens.length > 0) {
      console.log('  - Token details:');
      result.tokens.forEach((token, index) => {
        console.log(`    ${index + 1}. ${token.symbol}: ${token.balance} ($${token.usdValue})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Service test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Test 3: Test the full analyzeWallet method
async function testFullAnalysis() {
  console.log('');
  console.log('🔍 Test 3: Test Full analyzeWallet Method');
  console.log('==========================================');
  
  try {
    const { WalletAnalysisService } = require('./dist/services/WalletAnalysisService');
    
    const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
    
    console.log('🚀 Calling analyzeWallet (quick analysis)...');
    const result = await WalletAnalysisService.analyzeWallet(address, false);
    
    console.log('✅ Full analysis returned:');
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
    }
    
  } catch (error) {
    console.log('❌ Full analysis failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Step-by-Step Debug...');
  console.log('');
  
  await testEtherscanAPI();
  await testServiceDirectly();
  await testFullAnalysis();
  
  console.log('');
  console.log('✅ Debug complete!');
}

runAllTests().catch(console.error);
