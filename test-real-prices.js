// Test script to verify real price usage instead of hardcoded values
const { WalletAnalysisService } = require('./agents/intelligent-agent/dist/services/WalletAnalysisService');

// Mock backend response with real token data (including prices)
const mockBackendResponseWithPrices = {
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
        tokens: [
          {
            symbol: 'WETH',
            balance: '0.007947376995320855',
            usdValue: 33.38,
            price: 4178.54, // Real price from Azure
            tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
          },
          {
            symbol: 'ENS',
            balance: '0.033386347617776244',
            usdValue: 0.74,
            price: 22.30, // Real price from Azure
            tokenAddress: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72'
          }
        ],
        totalTokens: 2,
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
    totalValue: 34.12,
    totalTransactions: 157,
    lastUpdated: '2025-08-11T15:26:12.000Z'
  }
};

console.log('🧪 Testing Real Price Usage Instead of Hardcoded Values...\n');

// Test quick analysis (should use real WETH price)
try {
  console.log('📊 QUICK ANALYSIS (Real Prices):');
  console.log('=' .repeat(50));
  const quickResult = WalletAnalysisService.formatAnalysisResults(mockBackendResponseWithPrices, 'quick');
  console.log(quickResult);
} catch (error) {
  console.error('❌ Quick Analysis Error:', error);
}

console.log('\n' + '='.repeat(80) + '\n');

// Test deep analysis (should show detailed breakdown with real prices)
try {
  console.log('🔍 DEEP ANALYSIS (Real Price Breakdown):');
  console.log('=' .repeat(50));
  const deepResult = WalletAnalysisService.formatAnalysisResults(mockBackendResponseWithPrices, 'deep');
  console.log(deepResult);
} catch (error) {
  console.error('❌ Deep Analysis Error:', error);
}

console.log('\n' + '='.repeat(80) + '\n');

// Test with backend that has no token data (should fallback)
const mockBackendResponseNoTokens = {
  success: true,
  data: {
    address: '0x1234567890123456789012345678901234567890',
    blockchains: {
      ethereum: {
        address: '0x1234567890123456789012345678901234567890',
        blockchain: 'ethereum',
        balance: {
          native: '0.1',
          usdValue: 418.00
        },
        tokens: [], // No token data
        totalTokens: 0,
        topTokens: [],
        recentTransactions: [],
        totalLifetimeValue: 0,
        transactionCount: 10,
        tokenTransactionCount: 0,
        lastUpdated: '2025-08-11T15:26:12.000Z'
      }
    },
    totalValue: 418.00,
    totalTransactions: 10,
    lastUpdated: '2025-08-11T15:26:12.000Z'
  }
};

console.log('⚠️ Testing Fallback (No Token Data):');
console.log('=' .repeat(50));
try {
  const fallbackResult = WalletAnalysisService.formatAnalysisResults(mockBackendResponseNoTokens, 'quick');
  console.log(fallbackResult);
} catch (error) {
  console.error('❌ Fallback Test Error:', error);
}
