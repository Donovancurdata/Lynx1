const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Agent 1 WIA (compiled JavaScript)
const { Agent1WIA } = require('./agents/agent1-wia/dist/Agent1WIA');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Agent 1
const agent1 = new Agent1WIA();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    agent: 'Agent 1 WIA',
    version: '1.0.0'
  });
});

// Wallet analysis endpoint
app.post('/api/v1/wallet/analyze', async (req, res) => {
  try {
    const { address, blockchain = 'ethereum' } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log(`🔍 Analyzing wallet: ${address} on ${blockchain}`);

    // Get enhanced wallet data with all tokens and transaction analysis
    const walletData = await agent1.getWalletData(address, blockchain);
    
    // Also get the full investigation for additional insights
    const investigation = await agent1.investigateWallet({ 
      walletAddress: address, 
      blockchain 
    });

    // Combine the data
    const enhancedData = {
      ...investigation.data,
      enhancedBalance: walletData.enhancedBalance,
      transactionAnalysis: walletData.transactionAnalysis
    };

    res.json({
      success: true,
      data: enhancedData
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
    const { blockchain = 'ethereum' } = req.query;

    console.log(`💰 Getting balance for: ${address} on ${blockchain}`);

    const walletData = await agent1.getWalletData(address, blockchain);

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
    const { blockchain = 'ethereum', limit = 50 } = req.query;

    console.log(`📊 Getting transactions for: ${address} on ${blockchain}`);

    const walletData = await agent1.getWalletData(address, blockchain);
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LYNX Server running on http://localhost:${PORT}`);
  console.log(`🔍 Agent 1 WIA initialized and ready for wallet analysis`);
  console.log(`📱 Test interface available at http://localhost:${PORT}`);
});

module.exports = app; 