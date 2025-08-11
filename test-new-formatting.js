// Test script for new formatting - native token only for quick analysis
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

console.log('🧪 Testing New Formatting - Native Token Only for Quick Analysis...\n');

// Test quick analysis (should show only ETH)
try {
  console.log('📊 QUICK ANALYSIS (Native Token Only):');
  console.log('=' .repeat(50));
  const quickResult = WalletAnalysisService.formatAnalysisResults(mockBackendResponse, 'quick');
  console.log(quickResult);
} catch (error) {
  console.error('❌ Quick Analysis Error:', error);
}

console.log('\n' + '='.repeat(80) + '\n');

// Test deep analysis (should show detailed breakdown)
try {
  console.log('🔍 DEEP ANALYSIS (Detailed Token Breakdown):');
  console.log('=' .repeat(50));
  const deepResult = WalletAnalysisService.formatAnalysisResults(mockBackendResponse, 'deep');
  console.log(deepResult);
} catch (error) {
  console.error('❌ Deep Analysis Error:', error);
}

console.log('\n' + '='.repeat(80) + '\n');

// Test with different blockchain
const bscMockResponse = {
  success: true,
  data: {
    address: '0x1234567890123456789012345678901234567890',
    blockchains: {
      bsc: {
        address: '0x1234567890123456789012345678901234567890',
        blockchain: 'bsc',
        balance: {
          native: '1.5',
          usdValue: 450
        },
        tokens: [],
        totalTokens: 0,
        topTokens: [],
        recentTransactions: [],
        totalLifetimeValue: 0,
        transactionCount: 25,
        tokenTransactionCount: 0,
        lastUpdated: '2025-08-11T15:26:12.000Z'
      }
    },
    totalValue: 450,
    totalTransactions: 25,
    lastUpdated: '2025-08-11T15:26:12.000Z'
  }
};

console.log('🌐 Testing Different Blockchain (BSC):');
console.log('=' .repeat(50));
try {
  const bscResult = WalletAnalysisService.formatAnalysisResults(bscMockResponse, 'quick');
  console.log(bscResult);
} catch (error) {
  console.error('❌ BSC Analysis Error:', error);
}
