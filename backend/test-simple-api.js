const http = require('http');

console.log('🔍 Simple API Test');
console.log('==================');

const postData = JSON.stringify({
  address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
  deepAnalysis: false
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/wallet/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`✅ API Response Status: ${res.statusCode}`);
  console.log(`✅ API Response Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ API Response Data:');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.success && jsonData.data) {
        const result = jsonData.data;
        console.log('\n📊 API Response Analysis:');
        console.log(`  - Address: ${result.address}`);
        console.log(`  - Total Value: $${result.totalValue}`);
        console.log(`  - Total Transactions: ${result.totalTransactions}`);
        console.log(`  - Blockchains: ${Object.keys(result.blockchains).join(', ')}`);
        
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
      console.log('❌ Failed to parse JSON response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ API request failed:', error.message);
});

req.write(postData);
req.end();
