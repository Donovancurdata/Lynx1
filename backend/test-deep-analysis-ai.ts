import { WalletAnalysisService } from '../agents/intelligent-agent/src/services/WalletAnalysisService';

async function testDeepAnalysisFormatting() {
  console.log('🧪 Testing Deep Analysis Response Formatting...\n');
  
  // Simulate the deep analysis response from the backend
  const mockDeepAnalysisResponse = {
    success: true,
    data: {
      walletAddress: "0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b",
      analysisDate: "2025-08-13T08:01:41.517Z",
      totalValue: 23.350000000557902,
      totalTransactions: 182,
      blockchains: {
        "ethereum": {
          blockchain: "ethereum",
          nativeBalance: "0.007947376995320855",
          nativeUsdValue: 5.579E-10,
          tokens: [],
          transactions: [],
          transactionCount: 157
        },
        "avalanche": {
          blockchain: "avalanche",
          nativeBalance: "0.171322157673768019",
          nativeUsdValue: 23.35,
          tokens: [],
          transactions: [],
          transactionCount: 25
        }
      },
      discoveredTokens: [
        {
          symbol: "IMX",
          name: "Immutable X",
          contractAddress: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
          balance: "0",
          usdValue: 0.597044,
          decimals: 18,
          blockchain: "ethereum",
          isMatched: true,
          coinGeckoId: "immutable-x"
        },
        {
          symbol: "ILV",
          name: "Illuvium",
          contractAddress: "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
          balance: "3.354534876187318",
          usdValue: 18.05,
          decimals: 18,
          blockchain: "ethereum",
          isMatched: true,
          coinGeckoId: "illuvium"
        },
        {
          symbol: "WETH.e",
          name: "Wrapped Ether",
          contractAddress: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
          balance: "0.22931724404192758",
          usdValue: 4604.37,
          decimals: 18,
          blockchain: "avalanche",
          isMatched: true,
          coinGeckoId: "movement-bridged-weth-movement"
        }
      ],
      azureStorageIds: []
    },
    analysisType: "DEEP",
    timestamp: "2025-08-13T08:01:41.517Z"
  };

  try {
    // Test the formatting
    const formattedResult = await WalletAnalysisService.formatAnalysisResults(mockDeepAnalysisResponse, 'deep');
    
    console.log('✅ Deep Analysis Formatting Test Results:\n');
    console.log(formattedResult);
    
    // Check if the response contains key elements
    const hasCrossChainInfo = formattedResult.includes('Cross-Chain Activity Detected');
    const hasTokenDiscovery = formattedResult.includes('Token Discovery Summary');
    const hasBlockchainBreakdown = formattedResult.includes('Ethereum Chain:') && formattedResult.includes('Avalanche Chain:');
    const hasTopTokens = formattedResult.includes('Top Tokens by Value');
    
    console.log('\n📊 Formatting Test Results:');
    console.log(`• Cross-chain info: ${hasCrossChainInfo ? '✅' : '❌'}`);
    console.log(`• Token discovery: ${hasTokenDiscovery ? '✅' : '❌'}`);
    console.log(`• Blockchain breakdown: ${hasBlockchainBreakdown ? '✅' : '❌'}`);
    console.log(`• Top tokens display: ${hasTopTokens ? '✅' : '❌'}`);
    
    if (hasCrossChainInfo && hasTokenDiscovery && hasBlockchainBreakdown && hasTopTokens) {
      console.log('\n🎉 All tests passed! The AI agent can now properly display deep analysis results.');
    } else {
      console.log('\n⚠️ Some tests failed. Check the formatting logic.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDeepAnalysisFormatting().catch(console.error);

