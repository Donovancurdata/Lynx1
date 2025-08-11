const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

// Import Agent 1 WIA (compiled JavaScript)
const { Agent1WIA } = require('../agents/agent1-wia/dist/Agent1WIA');

// Note: Intelligent Agent runs separately on port 3004

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Note: WebSocket server removed - Intelligent Agent runs separately

// Ports
const API_PORT = process.env.API_PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3004;

// Initialize Agent 1 WIA
const agent1 = new Agent1WIA();

// Note: Intelligent Agent runs separately on port 3004

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
      agent1_wia: 'running',
      intelligent_agent: 'separate_service',
      websocket: 'separate_service'
    },
    version: '2.0.0'
  });
});

// Wallet analysis endpoint
app.post('/api/v1/wallet/analyze', async (req, res) => {
  try {
    const { address, blockchain, analysisType = 'quick' } = req.body;
    const quickAnalysis = analysisType === 'quick';

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    // Auto-detect blockchain if not provided
    let detectedBlockchain = blockchain;
    if (!detectedBlockchain) {
      const detectionResult = await agent1.detectBlockchain(address);
      detectedBlockchain = detectionResult.blockchain;
      console.log(`🔍 Auto-detected blockchain: ${detectedBlockchain} for address: ${address}`);
    }

    console.log(`🔍 Analyzing wallet: ${address} on ${detectedBlockchain} (analysis type: ${analysisType}, quick: ${quickAnalysis})`);

    // Get enhanced wallet data with all tokens and transaction analysis
    const walletData = await agent1.getWalletData(address, detectedBlockchain, quickAnalysis);
    console.log(`🔧 DEBUG: getWalletData returned ${walletData.transactions.length} transactions`);
    
    // Also get the full investigation for additional insights
    const investigation = await agent1.investigateWallet({ 
      walletAddress: address, 
      blockchain: detectedBlockchain,
      quickAnalysis: quickAnalysis
    });

    // Create the MultiBlockchainAnalysis structure that the frontend expects
    const multiBlockchainData = {
      address: address,
      blockchains: {
        [detectedBlockchain]: {
          address: address,
          blockchain: detectedBlockchain,
          balance: {
            native: walletData.balance.balance,
            usdValue: walletData.balance.usdValue
          },
          tokens: walletData.tokens || [],
          totalTokens: walletData.tokens ? walletData.tokens.length : 0,
          topTokens: walletData.tokens ? walletData.tokens.slice(0, 5) : [],
          recentTransactions: walletData.transactions.slice(0, 10),
          totalLifetimeValue: investigation.data?.totalLifetimeValue || 0,
          transactionCount: walletData.transactions.length,
          tokenTransactionCount: walletData.tokens ? walletData.tokens.length : 0,
          lastUpdated: new Date().toISOString()
        }
      },
      totalValue: walletData.balance.usdValue,
      totalTransactions: walletData.transactions.length,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: multiBlockchainData
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Get wallet balance
app.get('/api/v1/wallet/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { blockchain } = req.query;

    // Auto-detect blockchain if not provided
    let detectedBlockchain = blockchain;
    if (!detectedBlockchain) {
      const detectionResult = await agent1.detectBlockchain(address);
      detectedBlockchain = detectionResult.blockchain;
      console.log(`🔍 Auto-detected blockchain: ${detectedBlockchain} for address: ${address}`);
    }

    console.log(`💰 Getting balance for: ${address} on ${detectedBlockchain}`);

    const walletData = await agent1.getWalletData(address, detectedBlockchain);

    res.json({
      success: true,
      data: walletData.balance
    });

  } catch (error) {
    console.error('Balance retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Balance retrieval failed',
      message: error.message
    });
  }
});

// Get transaction history
app.get('/api/v1/wallet/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { blockchain, limit = 50 } = req.query;

    // Auto-detect blockchain if not provided
    let detectedBlockchain = blockchain;
    if (!detectedBlockchain) {
      const detectionResult = await agent1.detectBlockchain(address);
      detectedBlockchain = detectionResult.blockchain;
      console.log(`🔍 Auto-detected blockchain: ${detectedBlockchain} for address: ${address}`);
    }

    console.log(`📊 Getting transactions for: ${address} on ${detectedBlockchain}`);

    const walletData = await agent1.getWalletData(address, detectedBlockchain);
    const transactions = walletData.transactions.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Transaction retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Transaction retrieval failed',
      message: error.message
    });
  }
});

// Serve the test interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-interface.html'));
});

// Note: WebSocket handling removed - Intelligent Agent runs separately on port 3004

// Start the consolidated server
server.listen(API_PORT, () => {
  console.log(`🚀 LYNX Backend Server running on http://localhost:${API_PORT}`);
  console.log(`🔍 Agent 1 WIA initialized and ready for wallet analysis`);
  console.log(`📱 Test interface available at http://localhost:${API_PORT}`);
  console.log(`💡 Note: Intelligent Agent runs separately on port 3004`);
});

module.exports = { app, server };
