import { WalletAnalysisService } from '../services/WalletAnalysisService';
import { logger } from '../utils/logger';

// Cache for storing results to avoid re-analysis
const analysisCache = new Map<string, any>();

interface TokenBalance {
  symbol: string;
  balance: string;
  usdValue: number;
  tokenAddress?: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  type: 'in' | 'out';
  currency: string;
  isTokenTransfer?: boolean;
}

interface WalletAnalysis {
  address: string;
  blockchain: string;
  balance: {
    native: string;
    usdValue: number;
  };
  tokens: TokenBalance[];
  totalTokens: number;
  topTokens: TokenBalance[];
  recentTransactions: Transaction[];
  totalLifetimeValue: number;
  transactionCount: number;
  tokenTransactionCount: number;
  lastUpdated: string;
}

interface BasicBlockchainData {
  balance: { native: string; usdValue: number };
  tokens: TokenBalance[];
  recentTransactions: Transaction[];
  transactionCount: number;
  tokenTransactionCount: number;
}

async function testOptimizedTraditionalAnalysis() {
  console.log('🚀 Testing OPTIMIZED Traditional Wallet Analysis');
  console.log('===============================================');

  // Test wallet address
  const testWallet = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  
  try {
    console.log(`\n📋 Testing wallet: ${testWallet}`);
    
    // Check cache first
    if (analysisCache.has(testWallet)) {
      console.log('✅ Using cached results');
      const cachedResults = analysisCache.get(testWallet);
      displayResults(cachedResults);
      return cachedResults;
    }
    
    // Test 1: Quick blockchain detection (no API calls)
    console.log('\n🔍 Step 1: Detecting blockchains (instant)...');
    const detectedBlockchains = WalletAnalysisService.detectAllBlockchains(testWallet);
    console.log('Detected blockchains:', detectedBlockchains);
    
    // Test 2: Parallel analysis with reduced API calls
    console.log('\n💰 Step 2: Performing optimized analysis...');
    const startTime = Date.now();
    
    // Create analysis promises for parallel execution
    const analysisPromises = detectedBlockchains.map(async (blockchain) => {
      try {
        console.log(`🔄 Starting ${blockchain} analysis...`);
        const analysis = await analyzeSingleBlockchain(testWallet, blockchain);
        console.log(`✅ ${blockchain} analysis complete: $${analysis.balance.usdValue.toFixed(2)} value, ${analysis.transactionCount} transactions`);
        return { blockchain, analysis };
      } catch (error) {
        console.log(`❌ ${blockchain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { blockchain, analysis: null };
      }
    });
    
    // Wait for all analyses to complete in parallel
    const results = await Promise.all(analysisPromises);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`\n⏱️ Analysis completed in ${duration.toFixed(2)} seconds`);
    
    // Compile results
    const compiledResults = compileResults(testWallet, results);
    
    // Cache the results
    analysisCache.set(testWallet, compiledResults);
    
    // Display results
    displayResults(compiledResults);
    
    console.log('\n✅ Optimized test completed successfully!');
    return compiledResults;
    
  } catch (error) {
    console.error('❌ Optimized test failed:', error);
    logger.error('Optimized traditional analysis test failed:', error);
  }
}

async function analyzeSingleBlockchain(address: string, blockchain: string): Promise<WalletAnalysis> {
  // Simplified analysis for each blockchain with reduced API calls
  const analysis: WalletAnalysis = {
    address,
    blockchain,
    balance: {
      native: '0',
      usdValue: 0
    },
    tokens: [],
    totalTokens: 0,
    topTokens: [],
    recentTransactions: [],
    totalLifetimeValue: 0,
    transactionCount: 0,
    tokenTransactionCount: 0,
    lastUpdated: new Date().toISOString()
  };
  
  try {
    // Get basic balance and recent transactions only (no deep analysis)
    const basicData = await getBasicBlockchainData(address, blockchain);
    
    analysis.balance = basicData.balance;
    analysis.recentTransactions = basicData.recentTransactions;
    analysis.transactionCount = basicData.transactionCount;
    analysis.tokens = basicData.tokens;
    analysis.totalTokens = basicData.tokens.length;
    analysis.topTokens = basicData.tokens.slice(0, 5); // Top 5 tokens only
    
  } catch (error) {
    console.log(`⚠️ Error in ${blockchain} analysis:`, error);
  }
  
  return analysis;
}

async function getBasicBlockchainData(address: string, blockchain: string): Promise<BasicBlockchainData> {
  const apiKey = process.env['ETHERSCAN_API_KEY'];
  if (!apiKey) {
    throw new Error('API key not configured');
  }
  
  const balance = { native: '0', usdValue: 0 };
  const tokens: TokenBalance[] = [];
  let recentTransactions: Transaction[] = [];
  let transactionCount = 0;
  let tokenTransactionCount = 0;
  
  // Get balance
  try {
    const balanceResponse = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
    const balanceData = await balanceResponse.json() as any;
    
    if (balanceData.status === '1') {
      const balanceWei = BigInt(balanceData.result);
      balance.native = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6);
      
      // Get token price for USD value
      const tokenPrice = await getCachedTokenPrice('WETH');
      balance.usdValue = parseFloat(balance.native) * tokenPrice;
    }
  } catch (error) {
    console.log(`⚠️ Balance fetch failed for ${blockchain}:`, error);
  }
  
  // Get recent transactions only (first page, max 20)
  try {
    const txResponse = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${apiKey}`);
    const txData = await txResponse.json() as any;
    
    if (txData.status === '1' && txData.result) {
      transactionCount = txData.result.length;
      recentTransactions = txData.result.slice(0, 10).map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: (parseInt(tx.value) / Math.pow(10, 18)).toFixed(6),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
        currency: 'ETH',
        isTokenTransfer: false
      }));
    }
  } catch (error) {
    console.log(`⚠️ Transaction fetch failed for ${blockchain}:`, error);
  }
  
  // Get token balances (limited to recent tokens)
  try {
    const tokenResponse = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`);
    const tokenData = await tokenResponse.json() as any;
    
    if (tokenData.status === '1' && tokenData.result) {
      // Group tokens by address and calculate current balances
      const tokenBalances = new Map<string, TokenBalance>();
      
      tokenData.result.forEach((tx: any) => {
        const tokenAddress = tx.contractAddress;
        const tokenSymbol = tx.tokenSymbol;
        const tokenDecimals = parseInt(tx.tokenDecimal);
        
        if (!tokenBalances.has(tokenAddress)) {
          tokenBalances.set(tokenAddress, {
            symbol: tokenSymbol,
            balance: '0',
            usdValue: 0,
            tokenAddress
          });
        }
        
        const balance = tokenBalances.get(tokenAddress)!;
        const value = parseInt(tx.value) / Math.pow(10, tokenDecimals);
        
        if (tx.from.toLowerCase() === address.toLowerCase()) {
          balance.balance = (parseFloat(balance.balance) - value).toString();
        } else {
          balance.balance = (parseFloat(balance.balance) + value).toString();
        }
      });
      
      // Convert to array and calculate USD values
      const positiveTokens = Array.from(tokenBalances.values()).filter(t => parseFloat(t.balance) > 0);
      
              // Calculate USD values for tokens (limited to top 10)
        for (let i = 0; i < Math.min(positiveTokens.length, 10); i++) {
          const token = positiveTokens[i];
          if (token) {
            const price = await getCachedTokenPrice(token.symbol);
            token.usdValue = parseFloat(token.balance) * price;
            tokens.push(token);
          }
        }
    }
  } catch (error) {
    console.log(`⚠️ Token fetch failed for ${blockchain}:`, error);
  }
  
  return { balance, tokens, recentTransactions, transactionCount, tokenTransactionCount };
}

// Token price cache to avoid repeated API calls
const tokenPriceCache = new Map<string, { price: number, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedTokenPrice(symbol: string): Promise<number> {
  const now = Date.now();
  const cached = tokenPriceCache.get(symbol);
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.price;
  }
  
  // Simple fallback price (in real implementation, this would call price APIs)
  const price = symbol === 'WETH' ? 3000 : 1; // Simplified for testing
  
  tokenPriceCache.set(symbol, { price, timestamp: now });
  return price;
}

function compileResults(address: string, results: Array<{ blockchain: string, analysis: WalletAnalysis | null }>) {
  const compiledResults = {
    address,
    blockchains: {} as any,
    totalValue: 0,
    totalTransactions: 0,
    lastUpdated: new Date().toISOString()
  };
  
  for (const { blockchain, analysis } of results) {
    if (analysis) {
      compiledResults.blockchains[blockchain] = analysis;
      compiledResults.totalValue += analysis.balance.usdValue + analysis.tokens.reduce((sum: number, token: TokenBalance) => sum + token.usdValue, 0);
      compiledResults.totalTransactions += analysis.transactionCount;
    }
  }
  
  return compiledResults;
}

function displayResults(results: any) {
  console.log('\n📊 Optimized Analysis Results:');
  console.log('==============================');
  console.log(`Total Value: $${results.totalValue.toFixed(2)}`);
  console.log(`Total Transactions: ${results.totalTransactions}`);
  console.log(`Active Blockchains: ${Object.keys(results.blockchains).length}`);
  
  console.log('\n🔗 Blockchain Breakdown:');
  for (const [blockchain, data] of Object.entries(results.blockchains)) {
    const blockchainData = data as WalletAnalysis;
    console.log(`• ${blockchain.toUpperCase()}:`);
    console.log(`  - Native Balance: ${blockchainData.balance.native}`);
    console.log(`  - USD Value: $${blockchainData.balance.usdValue.toFixed(2)}`);
    console.log(`  - Token Count: ${blockchainData.tokens.length}`);
    console.log(`  - Transaction Count: ${blockchainData.recentTransactions.length}`);
    
    if (blockchainData.tokens.length > 0) {
      console.log(`  - Top Tokens:`);
      blockchainData.tokens.slice(0, 3).forEach((token: TokenBalance) => {
        console.log(`    * ${token.symbol}: ${token.balance} ($${token.usdValue.toFixed(2)})`);
      });
    }
  }
}

// Run the optimized test
if (require.main === module) {
  testOptimizedTraditionalAnalysis()
    .then(() => {
      console.log('\n🏁 Optimized test script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Optimized test script failed:', error);
      process.exit(1);
    });
}

export { testOptimizedTraditionalAnalysis };
