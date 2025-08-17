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
            native: '0', // Not getting actual wallet balance, focusing on priority tokens
            usdValue: priorityAnalysis.marketOverview.totalMarketCap
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
          recentTransactions: [], // No transaction data in priority token system
          totalLifetimeValue: priorityAnalysis.marketOverview.totalMarketCap,
          transactionCount: 0,
          tokenTransactionCount: priorityAnalysis.analysis.totalTokens,
          lastUpdated: new Date().toISOString()
        }
      },
      totalValue: priorityAnalysis.marketOverview.totalMarketCap,
      totalTransactions: 0,
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

    // Use Agent1WIA directly for reliable deep analysis
    console.log(`🔍 Using Agent1WIA for deep analysis of ${address}...`);
    
    // Detect blockchain
    const detectionResult = await agent1.detectBlockchain(address);
    const detectedBlockchain = detectionResult.blockchain;
    console.log(`🔗 Detected blockchain: ${detectedBlockchain}`);
    
    // Define Ethereum-based chains (EVM compatible)
    const ethereumBasedChains = [
      'ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 
      'optimism', 'base', 'linea', 'binance'
    ];
    
    // If blockchainFilter is specified or if detected blockchain is Ethereum-based,
    // only analyze Ethereum-based chains
    let chainsToAnalyze = ethereumBasedChains;
    if (blockchainFilter === 'ethereum' || 
        blockchainFilter === 'evm' || 
        ethereumBasedChains.includes(detectedBlockchain)) {
      console.log(`🔗 Filtering to Ethereum-based chains only`);
      chainsToAnalyze = ethereumBasedChains;
    } else if (blockchainFilter === 'solana') {
      chainsToAnalyze = ['solana'];
    } else if (blockchainFilter === 'bitcoin') {
      chainsToAnalyze = ['bitcoin'];
    }
    
    console.log(`🔗 Will analyze chains: ${chainsToAnalyze.join(', ')}`);
    
    // Get comprehensive wallet data for all relevant chains
    const multiChainData = {};
    let totalValue = 0;
    let totalTransactions = 0;
    
    for (const chain of chainsToAnalyze) {
      try {
        console.log(`🔄 Analyzing ${chain} chain...`);
        const walletData = await agent1.getWalletData(address, chain);
        
        if (walletData && walletData.transactions && walletData.transactions.length > 0) {
          multiChainData[chain] = {
            address: address,
            blockchain: chain,
            balance: {
              native: walletData.balance?.balance || '0',
              usdValue: walletData.balance?.usdValue || 0
            },
            tokens: [], // Agent1WIA doesn't return tokens in this format
            totalTokens: 0,
            topTokens: [],
            recentTransactions: (walletData.transactions || []).slice(0, 10).map(tx => ({
              hash: tx.hash || 'unknown',
              from: tx.from || 'unknown',
              to: tx.to || 'unknown',
              value: tx.value || '0',
              timestamp: tx.timestamp?.toISOString() || new Date().toISOString(),
              type: tx.type || 'transfer',
              currency: tx.currency || 'native'
            })),
            totalLifetimeValue: walletData.balance?.usdValue || 0,
            transactionCount: walletData.transactions?.length || 0,
            tokenTransactionCount: 0,
            lastUpdated: new Date().toISOString()
          };
          
          totalValue += walletData.balance?.usdValue || 0;
          totalTransactions += walletData.transactions?.length || 0;
          
          console.log(`✅ ${chain} analysis complete: $${walletData.balance?.usdValue || 0} value, ${walletData.transactions?.length || 0} transactions`);
        } else {
          console.log(`⚠️ No activity detected on ${chain} chain`);
        }
      } catch (error) {
        console.log(`❌ ${chain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Don't add failed chains to results
      }
    }
    
    // Create transformed data in the format the intelligent agent expects
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
