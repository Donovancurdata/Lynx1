import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export interface TokenBalance {
  symbol: string
  balance: string
  usdValue: number
  tokenAddress?: string
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  type: 'in' | 'out'
  currency: string
  isTokenTransfer?: boolean
}

export interface WalletAnalysis {
  address: string
  blockchain: string
  balance: {
    native: string
    usdValue: number
  }
  tokens: TokenBalance[]
  totalTokens: number
  topTokens: TokenBalance[]
  recentTransactions: Transaction[]
  totalLifetimeValue: number
  transactionCount: number
  tokenTransactionCount: number
  lastUpdated: string
}

export interface MultiBlockchainAnalysis {
  address: string
  blockchains: {
    [blockchain: string]: WalletAnalysis
  }
  totalValue: number
  totalTransactions: number
  lastUpdated: string
}

export class WalletAnalysisServiceUltraOptimized {
  // Caches for performance optimization
  private static analysisCache = new Map<string, MultiBlockchainAnalysis>()
  private static tokenPriceCache = new Map<string, { price: number, timestamp: number }>()
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private static readonly MAX_TRANSACTIONS_PER_CHAIN = 5 // Reduced for speed
  private static readonly MAX_TOKENS_PER_CHAIN = 5 // Reduced for speed

  // Blockchain-specific API configurations
  private static readonly BLOCKCHAIN_APIS = {
    ethereum: {
      balanceUrl: 'https://api.etherscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.etherscan.io/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'ETH',
      priceSymbol: 'WETH'
    },
    bsc: {
      balanceUrl: 'https://api.bscscan.com/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.bscscan.com/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.bscscan.com/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['BSCSCAN_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'BNB',
      priceSymbol: 'BNB'
    },
    polygon: {
      balanceUrl: 'https://api.polygonscan.com/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.polygonscan.com/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.polygonscan.com/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['POLYGONSCAN_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'MATIC',
      priceSymbol: 'MATIC'
    },
    avalanche: {
      balanceUrl: 'https://api.snowtrace.io/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.snowtrace.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.snowtrace.io/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['SNOWTRACE_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'AVAX',
      priceSymbol: 'AVAX'
    },
    arbitrum: {
      balanceUrl: 'https://api.arbiscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.arbiscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.arbiscan.io/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['ARBISCAN_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'ARB',
      priceSymbol: 'ARB'
    },
    optimism: {
      balanceUrl: 'https://api-optimistic.etherscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api-optimistic.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api-optimistic.etherscan.io/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['OPTIMISTIC_ETHERSCAN_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'OP',
      priceSymbol: 'OP'
    },
    base: {
      balanceUrl: 'https://api.basescan.org/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.basescan.org/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.basescan.org/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['BASESCAN_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'ETH',
      priceSymbol: 'WETH'
    },
    linea: {
      balanceUrl: 'https://api.lineascan.build/api?module=account&action=balance&address={address}&tag=latest&apikey={key}',
      txUrl: 'https://api.lineascan.build/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      tokenUrl: 'https://api.lineascan.build/api?module=account&action=tokentx&address={address}&startblock=0&endblock=99999999&page=1&offset={limit}&sort=desc&apikey={key}',
      apiKey: process.env['LINEASCAN_API_KEY'] || process.env['ETHERSCAN_API_KEY'],
      nativeSymbol: 'ETH',
      priceSymbol: 'WETH'
    }
  }

  static detectAllBlockchains(address: string): string[] {
    const blockchains: string[] = []
    
    // Ethereum/BSC/Polygon/Avalanche/Arbitrum/Optimism/Base/Linea addresses (0x format)
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      blockchains.push('ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'linea')
    }
    
    // Bitcoin addresses
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,62}$/.test(address)) {
      blockchains.push('bitcoin')
    }
    
    // Solana addresses
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      blockchains.push('solana')
    }
    
    return blockchains
  }

  static async analyzeWallet(address: string, deepAnalysis: boolean = false): Promise<MultiBlockchainAnalysis> {
    console.log(`🚀 Starting ULTRA-OPTIMIZED ${deepAnalysis ? 'DEEP' : 'QUICK'} analysis for wallet: ${address}`)
    
    // Check cache first
    const cacheKey = `${address}-${deepAnalysis}`
    const cached = this.analysisCache.get(cacheKey)
    if (cached && (Date.now() - new Date(cached.lastUpdated).getTime()) < this.CACHE_DURATION) {
      console.log('✅ Using cached analysis results')
      return cached
    }
    
    // Detect all possible blockchains for this address
    const detectedBlockchains = this.detectAllBlockchains(address)
    console.log(`🔗 Detected blockchains: ${detectedBlockchains.join(', ')}`)
    
    const startTime = Date.now()
    
    // Create analysis promises for parallel execution
    const analysisPromises = detectedBlockchains.map(async (blockchain) => {
      try {
        console.log(`🔄 Starting ${blockchain} analysis...`)
        const analysis = await this.analyzeSingleBlockchain(address, blockchain, deepAnalysis)
        console.log(`✅ ${blockchain} analysis complete: $${analysis.balance.usdValue.toFixed(2)} value, ${analysis.transactionCount} transactions`)
        return { blockchain, analysis }
      } catch (error) {
        console.log(`❌ ${blockchain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return { blockchain, analysis: null }
      }
    })
    
    // Wait for all analyses to complete in parallel
    const results = await Promise.all(analysisPromises)
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    console.log(`⏱️ Ultra-optimized analysis completed in ${duration.toFixed(2)} seconds`)
    
    // Compile results
    const compiledResults = this.compileResults(address, results)
    
    // Cache the results
    this.analysisCache.set(cacheKey, compiledResults)
    
    console.log(`🎯 Ultra-optimized analysis complete: $${compiledResults.totalValue.toFixed(2)} total value, ${compiledResults.totalTransactions} total transactions`)
    
    return compiledResults
  }

  private static async analyzeSingleBlockchain(address: string, blockchain: string, _deepAnalysis: boolean): Promise<WalletAnalysis> {
    const analysis: WalletAnalysis = {
      address,
      blockchain,
      balance: { native: '0', usdValue: 0 },
      tokens: [],
      totalTokens: 0,
      topTokens: [],
      recentTransactions: [],
      totalLifetimeValue: 0,
      transactionCount: 0,
      tokenTransactionCount: 0,
      lastUpdated: new Date().toISOString()
    }
    
    try {
      // Get basic blockchain data with ultra-reduced API calls
      const basicData = await this.getUltraOptimizedBlockchainData(address, blockchain)
      
      analysis.balance = basicData.balance
      analysis.recentTransactions = basicData.recentTransactions
      analysis.transactionCount = basicData.transactionCount
      analysis.tokens = basicData.tokens
      analysis.totalTokens = basicData.tokens.length
      analysis.topTokens = basicData.tokens.slice(0, 3) // Only top 3 tokens
      analysis.tokenTransactionCount = basicData.tokenTransactionCount
      
    } catch (error) {
      console.log(`⚠️ Error in ${blockchain} analysis:`, error)
    }
    
    return analysis
  }

  private static async getUltraOptimizedBlockchainData(address: string, blockchain: string) {
    const config = this.BLOCKCHAIN_APIS[blockchain as keyof typeof this.BLOCKCHAIN_APIS]
    if (!config || !config.apiKey) {
      throw new Error(`API key not configured for ${blockchain}`)
    }
    
    const balance = { native: '0', usdValue: 0 }
    const tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let transactionCount = 0
    let tokenTransactionCount = 0
    
    // Get balance (single API call)
    try {
      const balanceUrl = config.balanceUrl.replace('{address}', address).replace('{key}', config.apiKey)
      const balanceResponse = await fetch(balanceUrl)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance.native = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get cached token price for USD value
        const tokenPrice = await this.getCachedTokenPrice(config.priceSymbol)
        balance.usdValue = parseFloat(balance.native) * tokenPrice
      }
    } catch (error) {
      console.log(`⚠️ Balance fetch failed for ${blockchain}:`, error)
    }
    
    // Get recent transactions only (ultra-limited)
    try {
      const txUrl = config.txUrl.replace('{address}', address).replace('{limit}', this.MAX_TRANSACTIONS_PER_CHAIN.toString()).replace('{key}', config.apiKey)
      const txResponse = await fetch(txUrl)
      const txData = await txResponse.json() as any
      
      if (txData.status === '1' && txData.result) {
        transactionCount = txData.result.length
        const mappedTransactions = txData.result.slice(0, 3).map((tx: any) => ({ // Only 3 transactions
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: (parseInt(tx.value) / Math.pow(10, 18)).toFixed(6),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
          currency: config.nativeSymbol,
          isTokenTransfer: false
        }))
        recentTransactions = mappedTransactions
      }
    } catch (error) {
      console.log(`⚠️ Transaction fetch failed for ${blockchain}:`, error)
    }
    
    // Get token balances (ultra-limited)
    try {
      const tokenUrl = config.tokenUrl.replace('{address}', address).replace('{limit}', (this.MAX_TOKENS_PER_CHAIN * 2).toString()).replace('{key}', config.apiKey)
      const tokenResponse = await fetch(tokenUrl)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1' && tokenData.result) {
        tokenTransactionCount = tokenData.result.length
        
        // Group tokens by address and calculate current balances
        const tokenBalances = new Map<string, TokenBalance>()
        
        tokenData.result.forEach((tx: any) => {
          const tokenAddress = tx.contractAddress
          const tokenSymbol = tx.tokenSymbol
          const tokenDecimals = parseInt(tx.tokenDecimal)
          
          if (!tokenBalances.has(tokenAddress)) {
            tokenBalances.set(tokenAddress, {
              symbol: tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress
            })
          }
          
          const balance = tokenBalances.get(tokenAddress)!
          const value = parseInt(tx.value) / Math.pow(10, tokenDecimals)
          
          if (tx.from.toLowerCase() === address.toLowerCase()) {
            balance.balance = (parseFloat(balance.balance) - value).toString()
          } else {
            balance.balance = (parseFloat(balance.balance) + value).toString()
          }
        })
        
        // Convert to array and filter positive balances
        const positiveTokens = Array.from(tokenBalances.values()).filter(t => parseFloat(t.balance) > 0)
        
        // Calculate USD values for top tokens only (ultra-limited)
        for (let i = 0; i < Math.min(positiveTokens.length, this.MAX_TOKENS_PER_CHAIN); i++) {
          const token = positiveTokens[i]
          if (token) {
            const price = await this.getCachedTokenPrice(token.symbol)
            token.usdValue = parseFloat(token.balance) * price
            tokens.push(token)
          }
        }
      }
    } catch (error) {
      console.log(`⚠️ Token fetch failed for ${blockchain}:`, error)
    }
    
    return { balance, tokens, recentTransactions, transactionCount, tokenTransactionCount }
  }

  private static async getCachedTokenPrice(symbol: string): Promise<number> {
    const now = Date.now()
    const cached = this.tokenPriceCache.get(symbol)
    
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.price
    }
    
    // Ultra-fast fallback prices (no API calls for speed)
    const fallbackPrices: { [key: string]: number } = {
      'WETH': 3000,
      'ETH': 3000,
      'BNB': 500,
      'MATIC': 1,
      'AVAX': 25,
      'ARB': 1,
      'OP': 2,
      'USDC': 1,
      'USDT': 1,
      'DAI': 1,
      'UNI': 10,
      'LINK': 15,
      'AAVE': 200,
      'COMP': 50,
      'CRV': 1,
      'BAL': 10
    }
    
    const price = fallbackPrices[symbol] || 1
    this.tokenPriceCache.set(symbol, { price, timestamp: now })
    return price
  }

  private static compileResults(address: string, results: Array<{ blockchain: string, analysis: WalletAnalysis | null }>): MultiBlockchainAnalysis {
    const compiledResults: MultiBlockchainAnalysis = {
      address,
      blockchains: {},
      totalValue: 0,
      totalTransactions: 0,
      lastUpdated: new Date().toISOString()
    }
    
    for (const { blockchain, analysis } of results) {
      if (analysis) {
        compiledResults.blockchains[blockchain] = analysis
        compiledResults.totalValue += analysis.balance.usdValue + analysis.tokens.reduce((sum, token) => sum + token.usdValue, 0)
        compiledResults.totalTransactions += analysis.transactionCount
      }
    }
    
    return compiledResults
  }

  // Method to clear caches (useful for testing)
  static clearCaches(): void {
    this.analysisCache.clear()
    this.tokenPriceCache.clear()
    console.log('🧹 Caches cleared')
  }

  // Method to get cache statistics
  static getCacheStats(): { analysisCacheSize: number, tokenPriceCacheSize: number } {
    return {
      analysisCacheSize: this.analysisCache.size,
      tokenPriceCacheSize: this.tokenPriceCache.size
    }
  }
}
