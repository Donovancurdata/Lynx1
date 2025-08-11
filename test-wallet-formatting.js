// Test script to debug wallet formatting
const { WalletAnalysisService } = require('./agents/intelligent-agent/dist/services/WalletAnalysisService');

// Mock the backend response data
const mockBackendResponse = {
  success: true,
  data: {
    address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
    blockchains: {
      ethereum: {
        address: '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b',
        blockchain: 'ethereum',
        balance: {
          native: '0.007947376995320855',
          usdValue: 5.579e-10
        },
        tokens: [],
        totalTokens: 0,
        topTokens: [],
        recentTransactions: [
          { hash: '0x123', from: '0xabc', to: '0xdef', value: '0.1', timestamp: '2025-01-01', type: 'in', currency: 'ETH' }
        ],
        totalLifetimeValue: 0,
        transactionCount: 157,
        tokenTransactionCount: 0,
        lastUpdated: '2025-08-11T15:26:12.000Z'
      }
    },
    totalValue: 5.579e-10,
    totalTransactions: 157,
    lastUpdated: '2025-08-11T15:26:12.000Z'
  }
};

console.log('🧪 Testing Wallet Formatting Method...\n');

// Test the formatting method
try {
  const formattedResult = WalletAnalysisService.formatAnalysisResults(mockBackendResponse, 'quick');
  console.log('✅ Formatted Result:');
  console.log(formattedResult);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test the calculation logic directly
console.log('\n🔍 Testing Calculation Logic Directly...\n');

const address = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
const blockchain = 'ethereum';

if (address === '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b' && blockchain === 'ethereum') {
  console.log('✅ Address and blockchain match, using real token data');
  
  const realTokenData = {
    eth: { 
      balance: 0.007947376995320855, 
      price: 4200, 
      usdValue: 0.007947376995320855 * 4200 
    },
    ens: { 
      balance: 0.033386347617776244, 
      price: 22.30, 
      usdValue: 0.033386347617776244 * 22.30 
    }
  };

  console.log('\n📊 Token Data:');
  console.log('ETH:', realTokenData.eth);
  console.log('ENS:', realTokenData.ens);

  let totalUsdValue = 0;
  let tokenCount = 0;
  let tokenDetails = '';

  // Calculate real values from verified data
  Object.entries(realTokenData).forEach(([symbol, token]) => {
    if (token.balance > 0) {
      totalUsdValue += token.usdValue;
      tokenCount++;
      tokenDetails += `• ${symbol.toUpperCase()}: ${token.balance} ($${token.usdValue.toFixed(2)})\n`;
    }
  });

  console.log('\n💰 Calculation Results:');
  console.log(`Total USD Value: $${totalUsdValue}`);
  console.log(`Total USD Value (toFixed(2)): $${totalUsdValue.toFixed(2)}`);
  console.log(`Total USD Value (toLocaleString()): $${totalUsdValue.toLocaleString()}`);
  console.log(`Token Count: ${tokenCount}`);
  console.log(`Token Details:\n${tokenDetails}`);

  // Test the specific formatting that's causing issues
  console.log('\n🔍 Testing Specific Formatting:');
  console.log(`toLocaleString(): $${totalUsdValue.toLocaleString()}`);
  console.log(`toFixed(2): $${totalUsdValue.toFixed(2)}`);
  console.log(`Math.round(totalUsdValue * 100) / 100: $${Math.round(totalUsdValue * 100) / 100}`);
} else {
  console.log('❌ Address or blockchain mismatch');
}
