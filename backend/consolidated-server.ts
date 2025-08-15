import express from 'express';
import cors from 'cors';
import path from 'path';
import WebSocket from 'ws';
import http from 'http';

// Import Priority Token Service for new token analysis system
import { PriorityTokenService } from './src/services/PriorityTokenService.js';

// Import Agent 1 WIA (compiled JavaScript) - kept for compatibility
import { Agent1WIA } from '../agents/agent1-wia/dist/Agent1WIA.js';

// Import Deep Analysis Service for comprehensive cross-chain analysis
import { DeepAnalysisService } from './src/services/DeepAnalysisService.js';

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

// Initialize Deep Analysis Service for comprehensive cross-chain analysis
let deepAnalysisService: DeepAnalysisService;

// Initialize all services
const initializeAllServices = async () => {
  try {
    console.log('🚀 Initializing LYNX Backend Services...');
    
    // Initialize Agent 1 WIA (already initialized in constructor)
    console.log('✅ Agent 1 WIA initialized');
    
    // Initialize Priority Token Service (already initialized in constructor)
    console.log('✅ Priority Token Service initialized');
    
    // Initialize Deep Analysis Service
    await DeepAnalysisService.initialize();
    deepAnalysisService = DeepAnalysisService;
    console.log('✅ Deep Analysis Service initialized');
    

    
    console.log('🎯 All services initialized successfully!');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
};

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
      deep_analysis_service: 'running',
      intelligent_agent: 'separate_service',
      websocket: 'separate_service'
    },
    version: '2.2.0',
    features: {
      priority_tokens: 'enabled',
      coin_gecko_integration: 'enabled',
      azure_storage: 'enabled',
      deep_analysis: 'enabled',
      cross_chain_analysis: 'enabled'
    }
  });
});

// Wallet analysis endpoint
app.post('/api/v1/wallet/analyze', async (req, res) => {
  try {
    const { address, blockchain, analysisType = 'quick' } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log(`🎯 Analyzing wallet: ${address}`);

    // Use direct wallet investigation
    const investigationRequest = {
      walletAddress: address,
      blockchain: blockchain,
      includeDeepAnalysis: analysisType === 'deep',
      includeTokenTransfers: true,
      includeInternalTransactions: true,
      maxTransactions: 100,
      priority: 'medium' as const
    };

    const investigationResult = await agent1.investigateWallet(investigationRequest);

    if (!investigationResult.success) {
      return res.status(500).json({
        success: false,
        error: investigationResult.error?.message || 'Analysis failed'
      });
    }

    // If it's a completed result, return the full analysis
    if (investigationResult.data && 'walletAddress' in investigationResult.data) {
      const data = investigationResult.data;
      
      // Transform the result to match the expected format
      const transformedResult = {
        address: data.walletAddress,
        blockchains: {
          [data.blockchain]: {
            address: data.walletAddress,
            blockchain: data.blockchain,
            balance: {
              native: data.balance.balance,
              usdValue: data.balance.usdValue
            },
            tokens: data.tokens || [],
            totalTokens: data.tokens?.length || 0,
            topTokens: (data.tokens || []).slice(0, 5),
            recentTransactions: data.transactions?.slice(0, 10) || [],
            totalLifetimeValue: data.balance.usdValue,
            transactionCount: data.transactions?.length || 0,
            tokenTransactionCount: data.tokens?.length || 0,
            lastUpdated: data.investigationTimestamp.toISOString()
          }
        },
        totalValue: data.balance.usdValue,
        totalTransactions: data.transactions?.length || 0,
        lastUpdated: data.investigationTimestamp.toISOString(),
        priorityTokenAnalysis: {
          highPriorityTokens: 0,
          mediumPriorityTokens: 0,
          lowPriorityTokens: 0,
          successRate: 100,
          marketTrends: []
        }
      };

      return res.json({
        success: true,
        data: transformedResult
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Unexpected response format'
    });

  } catch (error) {
    console.error('❌ Wallet analysis failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed'
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

// Deep Analysis endpoint - Comprehensive cross-chain wallet investigation
app.post('/api/v1/wallet/deep-analyze', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log(`🔍 Starting DEEP ANALYSIS for wallet: ${address}`);

    // Perform comprehensive deep analysis across all blockchains
    const deepAnalysisResult = await DeepAnalysisService.performDeepAnalysis(address);

    res.json({
      success: true,
      data: deepAnalysisResult,
      analysisType: 'DEEP',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Deep analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Deep analysis failed',
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
server.listen(API_PORT, async () => {
  console.log(`🚀 LYNX Backend Server running on http://localhost:${API_PORT}`);
  
  // Initialize all services
  await initializeAllServices();
  
  console.log(`📱 Test interface available at http://localhost:${API_PORT}`);
  console.log(`💡 Note: Intelligent Agent runs separately on port 3004`);
  console.log(`\n🎯 Available Endpoints:`);
  console.log(`   • POST /api/v1/wallet/analyze - Quick wallet analysis using priority tokens`);
      console.log(`   • POST /api/v1/wallet/deep-analyze - Comprehensive cross-chain analysis`);
  console.log(`   • GET /api/v1/priority-tokens/market-data - All priority tokens`);
  console.log(`   • GET /api/v1/priority-tokens/by-priority/:level - Tokens by priority`);
  console.log(`   • GET /api/v1/priority-tokens/by-category/:category - Tokens by category`);
});

export { app, server };
