const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Ports
const API_PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      deep_analysis: 'running'
    },
    version: '1.0.0',
    features: {
      deep_analysis: 'enabled',
      blockchain_filtering: 'enabled'
    }
  });
});

// Deep Analysis endpoint - Comprehensive cross-chain wallet investigation
app.post('/api/v1/wallet/deep-analyze', async (req, res) => {
  try {
    const { address, blockchainFilter } = req.body;
    
    // Add debugging
    console.log('🔍 Deep Analysis Request Body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Extracted blockchainFilter:', blockchainFilter);
    console.log('🔍 Extracted address:', address);

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log(`🔍 Starting DEEP ANALYSIS for wallet: ${address}`);

    // Define Ethereum-based chains (EVM compatible)
    const ethereumBasedChains = [
      'ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 
      'optimism', 'base', 'linea', 'binance'
    ];
    
    // If blockchainFilter is specified, only analyze specified chains
    let chainsToAnalyze = ethereumBasedChains;
    if (blockchainFilter === 'ethereum' || blockchainFilter === 'evm') {
      console.log(`🔗 Filtering to Ethereum-based chains only`);
      chainsToAnalyze = ethereumBasedChains;
    } else if (blockchainFilter === 'solana') {
      chainsToAnalyze = ['solana'];
    } else if (blockchainFilter === 'bitcoin') {
      chainsToAnalyze = ['bitcoin'];
    }
    
    console.log(`🔗 Will analyze chains: ${chainsToAnalyze.join(', ')}`);
    
    // For now, simulate the analysis since we don't have Agent1WIA
    // In a real implementation, this would call the actual blockchain services
    const multiChainData = {};
    let totalValue = 0;
    let totalTransactions = 0;
    
    // Simulate analysis for each chain
    for (const chain of chainsToAnalyze) {
      try {
        console.log(`🔄 Analyzing ${chain} chain...`);
        
        // Simulate wallet data (replace with actual blockchain calls)
        const simulatedData = {
          ethereum: { balance: '0.007947376995320855', usdValue: 36.93, transactions: 157 },
          bsc: { balance: '0.000119184901825146', usdValue: 0.10, transactions: 206 },
          polygon: { balance: '0', usdValue: 0, transactions: 0 },
          avalanche: { balance: '0.171322157673768019', usdValue: 23.35, transactions: 25 },
          arbitrum: { balance: '0', usdValue: 0, transactions: 0 },
          optimism: { balance: '0', usdValue: 0, transactions: 0 },
          base: { balance: '0', usdValue: 0, transactions: 0 },
          linea: { balance: '0', usdValue: 0, transactions: 0 },
          binance: { balance: '0', usdValue: 0, transactions: 0 }
        };
        
        const chainData = simulatedData[chain] || { balance: '0', usdValue: 0, transactions: 0 };
        
        if (chainData.transactions > 0) {
          multiChainData[chain] = {
            address: address,
            blockchain: chain,
            balance: {
              native: chainData.balance,
              usdValue: chainData.usdValue
            },
            tokens: [],
            totalTokens: 0,
            topTokens: [],
            recentTransactions: [],
            totalLifetimeValue: chainData.usdValue,
            transactionCount: chainData.transactions,
            tokenTransactionCount: 0,
            lastUpdated: new Date().toISOString()
          };
          
          totalValue += chainData.usdValue;
          totalTransactions += chainData.transactions;
          
          console.log(`✅ ${chain} analysis complete: $${chainData.usdValue} value, ${chainData.transactions} transactions`);
        } else {
          console.log(`⚠️ No activity detected on ${chain} chain`);
        }
      } catch (error) {
        console.log(`❌ ${chain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Create transformed data
    const transformedData = {
      address: address,
      blockchains: multiChainData,
      totalValue: totalValue,
      totalTransactions: totalTransactions,
      lastUpdated: new Date().toISOString(),
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

    res.json({
      success: true,
      data: transformedData,
      analysisType: 'DEEP',
      blockchainFilter: blockchainFilter || 'auto',
      analyzedChains: Object.keys(multiChainData),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Deep analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Deep analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve the test interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-interface.html'));
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
server.listen(API_PORT, () => {
  console.log(`🚀 Simple Deep Analysis Server running on http://localhost:${API_PORT}`);
  console.log(`🔍 Deep Analysis endpoint: POST /api/v1/wallet/deep-analyze`);
  console.log(`🔗 Blockchain filtering enabled for Ethereum, Solana, and Bitcoin`);
  console.log(`✅ Server is listening on port ${API_PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
