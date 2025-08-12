import express from 'express';
import cors from 'cors';
import path from 'path';
import WebSocket from 'ws';
import http from 'http';

// Import Priority Token Service for new token analysis system
import { PriorityTokenService } from './src/services/PriorityTokenService.js';

// Import Agent 1 WIA (compiled JavaScript) - kept for compatibility
import { Agent1WIA } from '../agents/agent1-wia/dist/Agent1WIA.js';

// Note: Intelligent Agent runs separately on port 3004

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Note: WebSocket server removed - Intelligent Agent runs separately

// Ports
const API_PORT = process.env.API_PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3004;

// Initialize Priority Token Service for new token analysis
const priorityTokenService = new PriorityTokenService();

// Initialize Agent 1 WIA (kept for compatibility)
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
      priority_token_service: 'running',
      agent1_wia: 'running',
      intelligent_agent: 'separate_service',
      websocket: 'separate_service'
    },
    version: '2.1.0',
    features: {
      priority_tokens: 'enabled',
      coin_gecko_integration: 'enabled',
      azure_storage: 'enabled'
    }
  });
});

// Wallet analysis endpoint - Updated to use Priority Token System
app.post('/api/v1/wallet/analyze', async (req, res) => {
  try {
    const { address, blockchain, analysisType = 'quick' } = req.body;

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

    console.log(`🎯 Analyzing wallet: ${address} on ${detectedBlockchain} using Priority Token System`);

    // Get real wallet balance and transaction data from blockchain services
    let realBalance = '0';
    let realUsdValue = 0;
    let realTransactions: any[] = [];
    let realTransactionCount = 0;
    
    try {
      const walletData = await agent1.getWalletData(address, detectedBlockchain);
      realBalance = walletData.balance.balance;
      realUsdValue = walletData.balance.usdValue;
      realTransactions = walletData.transactions || [];
      realTransactionCount = realTransactions.length;
      console.log(`💰 Real wallet balance: ${realBalance} ${detectedBlockchain} ($${realUsdValue})`);
      console.log(`📊 Real transaction count: ${realTransactionCount}`);
    } catch (error) {
      console.log(`⚠️ Could not get real wallet data: ${error.message}`);
    }

    // Use the new Priority Token Service for comprehensive token analysis
    const priorityAnalysis = await priorityTokenService.analyzeWallet(address, detectedBlockchain);

    // Create the MultiBlockchainAnalysis structure that the frontend expects
    const multiBlockchainData = {
      address: address,
      blockchains: {
        [detectedBlockchain]: {
          address: address,
          blockchain: detectedBlockchain,
          balance: {
            native: realBalance, // Real wallet balance from blockchain
            usdValue: realUsdValue || priorityAnalysis.marketOverview.totalMarketCap
          },
          tokens: priorityAnalysis.priorityTokens.map(token => ({
            id: token.id,
            symbol: token.symbol,
            name: token.name,
            price: token.current_price,
            marketCap: token.market_cap,
            volume24h: token.total_volume,
            priceChange24h: token.price_change_percentage_24h,
            priority: token.priority,
            category: token.category
          })),
          totalTokens: priorityAnalysis.analysis.totalTokens,
          topTokens: priorityAnalysis.marketOverview.topPerformers.slice(0, 5).map(token => ({
            id: token.id,
            symbol: token.symbol,
            name: token.name,
            price: token.current_price,
            marketCap: token.market_cap,
            priceChange24h: token.price_change_percentage_24h
          })),
          recentTransactions: realTransactions.slice(0, 10), // Real transaction data
          totalLifetimeValue: realUsdValue || priorityAnalysis.marketOverview.totalMarketCap,
          transactionCount: realTransactionCount, // Real transaction count
          tokenTransactionCount: priorityAnalysis.analysis.totalTokens,
          lastUpdated: new Date().toISOString()
        }
      },
      totalValue: realUsdValue || priorityAnalysis.marketOverview.totalMarketCap,
      totalTransactions: realTransactionCount,
      lastUpdated: new Date().toISOString(),
      // Add priority token specific data
      priorityTokenAnalysis: {
        highPriorityTokens: priorityAnalysis.analysis.highPriorityTokens,
        mediumPriorityTokens: priorityAnalysis.analysis.mediumPriorityTokens,
        lowPriorityTokens: priorityAnalysis.analysis.lowPriorityTokens,
        successRate: priorityAnalysis.analysis.successRate,
        marketTrends: priorityAnalysis.marketOverview.marketTrends
      }
    };

    console.log(`🎯 Priority Token Analysis completed for ${address}:`);
    console.log(`   • Total priority tokens: ${priorityAnalysis.analysis.totalTokens}`);
    console.log(`   • High priority: ${priorityAnalysis.analysis.highPriorityTokens}`);
    console.log(`   • Medium priority: ${priorityAnalysis.analysis.mediumPriorityTokens}`);
    console.log(`   • Low priority: ${priorityAnalysis.analysis.lowPriorityTokens}`);
    console.log(`   • Success rate: ${priorityAnalysis.analysis.successRate.toFixed(1)}%`);
    console.log(`   • Total market cap: $${(priorityAnalysis.marketOverview.totalMarketCap / 1e9).toFixed(2)}B`);

    res.json({
      success: true,
      data: multiBlockchainData
    });

  } catch (error) {
    console.error('Priority Token Analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Priority Token Analysis failed',
      message: error.message
    });
  }
});

// Priority Token Analysis endpoints
app.get('/api/v1/priority-tokens/market-data', async (req, res) => {
  try {
    console.log('📊 Getting priority token market data...');
    const marketData = await priorityTokenService.getPriorityTokenMarketData();
    
    res.json({
      success: true,
      data: {
        tokens: marketData,
        totalTokens: marketData.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to get priority token market data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get priority token market data',
      message: error.message
    });
  }
});

app.get('/api/v1/priority-tokens/by-priority/:level', async (req, res) => {
  try {
    const { level } = req.params;
    if (!['high', 'medium', 'low'].includes(level)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority level. Must be high, medium, or low'
      });
    }

    console.log(`📊 Getting ${level} priority tokens...`);
    const tokens = await priorityTokenService.getTokensByPriority(level);
    
    res.json({
      success: true,
      data: {
        priority: level,
        tokens: tokens,
        totalTokens: tokens.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Failed to get ${req.params.level} priority tokens:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to get ${req.params.level} priority tokens`,
      message: error.message
    });
  }
});

app.get('/api/v1/priority-tokens/by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📊 Getting tokens by category: ${category}...`);
    
    const tokens = await priorityTokenService.getTokensByCategory(category);
    
    res.json({
      success: true,
      data: {
        category: category,
        tokens: tokens,
        totalTokens: tokens.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Failed to get tokens by category ${req.params.category}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to get tokens by category ${req.params.category}`,
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
  console.log(`🎯 Priority Token Service initialized and ready for token analysis`);
  console.log(`🔍 Agent 1 WIA initialized (kept for compatibility)`);
  console.log(`📱 Test interface available at http://localhost:${API_PORT}`);
  console.log(`💡 Note: Intelligent Agent runs separately on port 3004`);
  console.log(`\n🎯 New Priority Token Endpoints:`);
  console.log(`   • GET /api/v1/priority-tokens/market-data - All priority tokens`);
  console.log(`   • GET /api/v1/priority-tokens/by-priority/:level - Tokens by priority`);
  console.log(`   • GET /api/v1/priority-tokens/by-category/:category - Tokens by category`);
  console.log(`   • POST /api/v1/wallet/analyze - Wallet analysis using priority tokens`);
});

export { app, server };
