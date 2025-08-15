const { Agent1WIA } = require('../agents/agent1-wia/dist/Agent1WIA');

async function testSimpleDeepAnalysis() {
  try {
    console.log('🔍 Testing simple deep analysis...');
    
    const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
    
    console.log(`📋 Testing with address: ${walletAddress}`);
    
    // Create Agent1WIA instance
    const agent1 = new Agent1WIA();
    
    // Get wallet data
    console.log('\n💰 Getting wallet data...');
    const walletData = await agent1.getWalletData(walletAddress, 'solana');
    
    console.log('✅ Wallet data retrieved:');
    console.log('- Balance:', walletData.balance);
    console.log('- Transactions count:', walletData.transactions?.length || 0);
    
    // Simulate deep analysis result
    const deepAnalysisResult = {
      walletAddress: walletAddress,
      analysisDate: new Date().toISOString(),
      totalValue: walletData.balance?.usdValue || 0,
      totalTransactions: walletData.transactions?.length || 0,
      blockchains: {
        solana: {
          blockchain: 'solana',
          value: walletData.balance?.usdValue || 0,
          tokens: [],
          transactions: walletData.transactions || [],
          transactionCount: walletData.transactions?.length || 0,
          nativeBalance: walletData.balance?.balance || '0',
          nativeUsdValue: walletData.balance?.usdValue || 0
        }
      },
      discoveredTokens: [],
      azureStorageIds: []
    };
    
    console.log('\n📊 Deep analysis result:');
    console.log('- Total value:', deepAnalysisResult.totalValue);
    console.log('- Total transactions:', deepAnalysisResult.totalTransactions);
    console.log('- Blockchains:', Object.keys(deepAnalysisResult.blockchains));
    
    // Transform to intelligent agent format
    const transformedData = {
      address: deepAnalysisResult.walletAddress,
      blockchains: {},
      totalValue: deepAnalysisResult.totalValue,
      totalTransactions: deepAnalysisResult.totalTransactions,
      lastUpdated: deepAnalysisResult.analysisDate,
      priorityTokenAnalysis: {
        highPriorityTokens: 0,
        mediumPriorityTokens: 0,
        lowPriorityTokens: 0,
        successRate: 100,
        marketTrends: {
          gainers: [],
          losers: []
        }
      }
    };
    
    // Transform blockchain data
    for (const [blockchain, blockchainData] of Object.entries(deepAnalysisResult.blockchains)) {
      transformedData.blockchains[blockchain] = {
        address: deepAnalysisResult.walletAddress,
        blockchain: blockchain,
        balance: {
          native: blockchainData.nativeBalance,
          usdValue: blockchainData.nativeUsdValue
        },
        tokens: blockchainData.tokens.map(token => ({
          symbol: token.symbol,
          balance: token.balance,
          usdValue: token.usdValue,
          tokenAddress: token.contractAddress
        })),
        totalTokens: blockchainData.tokens.length,
        topTokens: blockchainData.tokens
          .sort((a, b) => b.usdValue - a.usdValue)
          .slice(0, 5)
          .map(token => ({
            symbol: token.symbol,
            balance: token.balance,
            usdValue: token.usdValue,
            tokenAddress: token.contractAddress
          })),
        recentTransactions: blockchainData.transactions
          .slice(0, 10)
          .map(tx => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: tx.timestamp,
            type: tx.type,
            currency: tx.tokenSymbol || 'native'
          })),
        totalLifetimeValue: blockchainData.value,
        transactionCount: blockchainData.transactionCount,
        tokenTransactionCount: blockchainData.tokens.length,
        lastUpdated: deepAnalysisResult.analysisDate
      };
    }
    
    console.log('\n🎯 Final transformed data:');
    console.log('- Address:', transformedData.address);
    console.log('- Total value:', transformedData.totalValue);
    console.log('- Total transactions:', transformedData.totalTransactions);
    console.log('- Blockchains:', Object.keys(transformedData.blockchains));
    
    if (transformedData.blockchains.solana) {
      console.log('\n🔗 Solana details:');
      console.log('- Balance:', transformedData.blockchains.solana.balance);
      console.log('- Transactions:', transformedData.blockchains.solana.transactionCount);
      console.log('- Recent transactions:', transformedData.blockchains.solana.recentTransactions.length);
    }
    
    console.log('\n✅ Deep analysis simulation completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSimpleDeepAnalysis();
