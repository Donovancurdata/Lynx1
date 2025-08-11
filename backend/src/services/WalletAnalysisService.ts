import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs'
import { WalletAnalysisStorage, WalletAnalysisData, WalletTransaction } from './WalletAnalysisStorage'
import { WalletAnalysisServiceUltraOptimized } from './WalletAnalysisServiceUltraOptimized'

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

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
  // Token information (for token transfers)
  tokenSymbol?: string
  tokenName?: string
  tokenAddress?: string
  tokenValue?: string
  tokenDecimals?: number
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
  allTransactions?: Transaction[] // Optional - for storing ALL transactions
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

export class WalletAnalysisService {
  static detectBlockchain(address: string): string {
    // Ethereum/BSC/Polygon addresses
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return 'ethereum'
    }
    
    // Bitcoin addresses
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,62}$/.test(address)) {
      return 'bitcoin'
    }
    
    // Solana addresses
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return 'solana'
    }
    
    return 'unknown'
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
    // Use the ultra-optimized service for quick analysis
    if (!deepAnalysis) {
      console.log(`🚀 Using ULTRA-OPTIMIZED service for QUICK analysis`)
      return await WalletAnalysisServiceUltraOptimized.analyzeWallet(address, false)
    }

    // Use the comprehensive per-chain analyzers for deep analysis
    console.log(`🚀 Using COMPREHENSIVE service for DEEP analysis`)
    return await this.analyzeWalletDeep(address)
  }

  private static async analyzeWalletDeep(address: string): Promise<MultiBlockchainAnalysis> {
    const detectedBlockchains = this.detectAllBlockchains(address)
    console.log(`🔗 [DEEP] Detected blockchains: ${detectedBlockchains.join(', ')}`)

    const analysisPromises = detectedBlockchains.map(async (blockchain) => {
      try {
        let analysis: WalletAnalysis | null = null
        switch (blockchain) {
          case 'ethereum':
            analysis = await this.analyzeEthereumWallet(address, true)
            break
          case 'bsc':
            analysis = await this.analyzeBSCWallet(address)
            break
          case 'polygon':
            analysis = await this.analyzePolygonWallet(address)
            break
          case 'avalanche':
            analysis = await this.analyzeAvalancheWallet(address)
            break
          case 'arbitrum':
            analysis = await this.analyzeArbitrumWallet(address)
            break
          case 'optimism':
            analysis = await this.analyzeOptimismWallet(address)
            break
          case 'base':
            analysis = await this.analyzeBaseWallet(address)
            break
          case 'linea':
            analysis = await this.analyzeLineaWallet(address)
            break
          case 'bitcoin':
            analysis = await this.analyzeBitcoinWallet(address)
            break
          case 'solana':
            analysis = await this.analyzeSolanaWallet(address)
            break
          default:
            console.log(`⚠️ [DEEP] Unsupported or unknown blockchain: ${blockchain}`)
            analysis = null
        }
        return { blockchain, analysis }
      } catch (error) {
        console.log(`❌ [DEEP] ${blockchain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return { blockchain, analysis: null }
      }
    })

    const results = await Promise.all(analysisPromises)

    // Compile results
    const compiled: MultiBlockchainAnalysis = {
      address,
      blockchains: {},
      totalValue: 0,
      totalTransactions: 0,
      lastUpdated: new Date().toISOString()
    }

    for (const { blockchain, analysis } of results) {
      if (analysis) {
        compiled.blockchains[blockchain] = analysis
        const tokensValue = (analysis.tokens || []).reduce((sum, t) => sum + (t.usdValue || 0), 0)
        compiled.totalValue += (analysis.balance?.usdValue || 0) + tokensValue
        compiled.totalTransactions += analysis.transactionCount || (analysis.recentTransactions?.length || 0)
      }
    }

    try {
      await this.storeWalletAnalysis(address, compiled)
    } catch (err) {
      console.log(`⚠️ [DEEP] Failed to store wallet analysis:`, err)
    }

    console.log(`🎯 [DEEP] Analysis complete: $${compiled.totalValue.toFixed(2)} total value, ${compiled.totalTransactions} total transactions`)
    return compiled
  }

  private static async analyzeEthereumWallet(address: string, deepAnalysis: boolean = false): Promise<WalletAnalysis> {
    // Test Ethereum via Etherscan API
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    // const infuraProjectId = process.env['INFURA_PROJECT_ID']
    
    console.log(`🔍 Starting Ethereum analysis for ${address}`)
    console.log(`🔑 Etherscan API Key: ${etherscanApiKey ? '✅ Set' : '❌ Not set'}`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    
    if (etherscanApiKey) {
      try {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
        const data = await response.json() as any
        
        if (data.status === '1') {
          const balanceWei = BigInt(data.result)
          balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
          
          // Get real ETH price from CoinGecko
          const ethPrice = await this.getTokenPrice('WETH') // Use WETH price as ETH price
          usdValue = parseFloat(balance) * ethPrice
          
          console.log(`💰 ETH Balance: ${balance} ETH ($${usdValue.toFixed(2)})`)
        } else {
          console.log(`❌ ETH balance API error:`, data.message)
        }
      } catch (error) {
        console.error('Etherscan API error:', error)
      }
    }

    // Add delay to respect rate limit
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get real transaction history from Etherscan
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    let transactionCount = 0
    
    if (etherscanApiKey) {
      try {
        console.log(`🔍 Fetching ALL transactions for ${address}...`)
        // Get ALL normal transactions using pagination
        let allEthereumTransactions: any[] = []
        let page = 1
        const pageSize = 100
        
        while (true) {
          const txResponse = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`)
          const txData = await txResponse.json() as any
          
          if (txData.status === '1' && txData.result && txData.result.length > 0) {
            allEthereumTransactions = allEthereumTransactions.concat(txData.result)
            console.log(`📄 Ethereum Page ${page}: Found ${txData.result.length} transactions`)
            
            // If we got less than pageSize, we've reached the end
            if (txData.result.length < pageSize) {
              break
            }
            page++
            
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 200))
          } else {
            console.log(`📄 Ethereum Page ${page}: No more transactions found`)
            break
          }
        }
        
        transactionCount = allEthereumTransactions.length
        console.log(`📊 Ethereum Total transaction count: ${transactionCount}`)
        
        // Convert ALL transactions to our format
        allTransactions = allEthereumTransactions.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: (parseInt(tx.value) / Math.pow(10, 18)).toFixed(6),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in' as 'in' | 'out',
          currency: 'ETH',
          isTokenTransfer: false
        }))
        
        // Convert recent transactions to our format (first 10)
        recentTransactions = allTransactions.slice(0, 10)
        
        // Log the most recent transaction dates
        console.log(`📅 Most recent Ethereum transaction dates:`)
        recentTransactions.forEach((tx, index) => {
          const date = new Date(tx.timestamp)
          console.log(`  ${index + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${tx.value} ETH`)
        })
      } catch (error) {
        console.error('Etherscan transaction API error:', error)
      }
    }

    // Add delay to respect rate limit
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get real token balances from Etherscan
    let tokens: TokenBalance[] = []
    
    if (etherscanApiKey) {
      try {
        console.log(`🔍 Fetching token transfers for ${address}...`)
        // Get ERC-20 token transfers
        const tokenResponse = await fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${etherscanApiKey}`)
        const tokenData = await tokenResponse.json() as any
        
        console.log(`📊 Token API response:`, JSON.stringify(tokenData, null, 2))
        
        if (tokenData.status === '1' && tokenData.result) {
          console.log(`✅ Found ${tokenData.result.length} token transfers`)
          // Group by token contract address and calculate current balances
          const tokenBalances = new Map<string, { symbol: string, balance: number, tokenAddress: string }>()
          
          tokenData.result.forEach((tx: any) => {
            const tokenAddress = tx.contractAddress
            const symbol = tx.tokenSymbol
            const value = parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))
            
            if (!tokenBalances.has(tokenAddress)) {
              tokenBalances.set(tokenAddress, { symbol, balance: 0, tokenAddress })
            }
            
            const current = tokenBalances.get(tokenAddress)!
            if (tx.from.toLowerCase() === address.toLowerCase()) {
              current.balance -= value
            } else if (tx.to.toLowerCase() === address.toLowerCase()) {
              current.balance += value
            }
          })
          
          // For quick analysis, just count tokens and add to collection
          if (!deepAnalysis) {
            console.log(`⚡ Quick analysis: Counting tokens without price lookup...`)
            const tokenCount = Array.from(tokenBalances.values()).filter(token => token.balance > 0).length
            console.log(`📊 Found ${tokenCount} tokens with non-zero balance`)
            
            // Add new tokens to collection system (without price lookup)
            for (const token of Array.from(tokenBalances.values()).filter(token => token.balance > 0)) {
              await this.addTokenToCollection(token.symbol, 'ethereum', token.tokenAddress, token.symbol)
            }
            
            // Create placeholder tokens for quick analysis
            tokens = Array.from(tokenBalances.values())
              .filter(token => token.balance > 0)
              .map(token => ({
                symbol: token.symbol,
                balance: token.balance.toFixed(6),
                usdValue: 0, // Will be calculated in deep analysis
                tokenAddress: token.tokenAddress
              }))
            
            tokenTransactionCount = tokenData.result.length
            console.log(`📊 Token transaction count: ${tokenTransactionCount}`)
          } else {
            // Deep analysis: Get real prices and detailed information
            console.log(`🔍 Deep analysis: Getting token prices and detailed information...`)
            
            // Convert to TokenBalance format and filter out zero balances
            const tokenPromises = Array.from(tokenBalances.values())
              .filter(token => token.balance > 0)
              .map(async token => {
                // Get real price from CoinGecko
                const price = await this.getTokenPrice(token.symbol)
                const usdValue = token.balance * price
                
                return {
                  symbol: token.symbol,
                  balance: token.balance.toFixed(6),
                  usdValue,
                  tokenAddress: token.tokenAddress
                }
              })

            // Wait for all price lookups to complete
            tokens = await Promise.all(tokenPromises)
            
            console.log(`✅ Found ${tokens.length} tokens with non-zero balance`)
            
            // Add new tokens to collection system
            for (const token of tokens) {
              await this.addTokenToCollection(token.symbol, 'ethereum', token.tokenAddress, token.symbol)
            }
            
            // Calculate historical trading value from all transactions
            historicalTradingValue = await this.calculateHistoricalTradingValue(tokenData.result)
            
            // Update transaction counts
            tokenTransactionCount = tokenData.result.length
            console.log(`📊 Token transaction count: ${tokenTransactionCount}`)
            
            // Enhance normal transactions with token information
            console.log(`🔍 Matching token transfers with normal transactions...`)
            const tokenTransferMap = new Map<string, any>()
            
            // Create a map of token transfers by transaction hash
            tokenData.result.forEach((tokenTx: any) => {
              tokenTransferMap.set(tokenTx.hash.toLowerCase(), {
                symbol: tokenTx.tokenSymbol,
                name: tokenTx.tokenName,
                address: tokenTx.contractAddress,
                value: (parseInt(tokenTx.value) / Math.pow(10, parseInt(tokenTx.tokenDecimal))).toFixed(6),
                decimals: parseInt(tokenTx.tokenDecimal),
                isTokenTransfer: true
              })
            })
            
            // Enhance normal transactions with token information
            allTransactions = allTransactions.map(tx => {
              const tokenInfo = tokenTransferMap.get(tx.hash.toLowerCase())
              if (tokenInfo) {
                return {
                  ...tx,
                  tokenSymbol: tokenInfo.symbol,
                  tokenName: tokenInfo.name,
                  tokenAddress: tokenInfo.address,
                  tokenValue: tokenInfo.value,
                  tokenDecimals: tokenInfo.decimals,
                  isTokenTransfer: true
                }
              }
              return tx
            })
            
            console.log(`✅ Enhanced ${tokenTransferMap.size} transactions with token information`)
            
            // Get ALL transactions from Etherscan (multiple API calls to get complete count)
            try {
              console.log(`🔍 Fetching ALL transactions for ${address}...`)
              let allNormalTransactions: any[] = []
              let page = 1
              const pageSize = 100
              
              while (true) {
                const txResponse = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`)
                const txData = await txResponse.json() as any
                
                if (txData.status === '1' && txData.result && txData.result.length > 0) {
                  allNormalTransactions = allNormalTransactions.concat(txData.result)
                  console.log(`📄 Page ${page}: Found ${txData.result.length} transactions`)
                  
                  // If we got less than pageSize, we've reached the end
                  if (txData.result.length < pageSize) {
                    break
                  }
                  page++
                  
                  // Add delay to respect rate limits
                  await new Promise(resolve => setTimeout(resolve, 200))
                } else {
                  console.log(`📄 Page ${page}: No more transactions found`)
                  break
                }
              }
              
              const normalTxCount = allNormalTransactions.length
              totalTransactionCount = normalTxCount // Just use the total normal transactions
              console.log(`📊 Total transaction count: ${totalTransactionCount} (normal transactions only)`)
              
              // Store all transactions for potential future use
              console.log(`💾 Stored ${allNormalTransactions.length} normal transactions`)
              
            } catch (error) {
              console.log(`❌ Error getting total transaction count:`, error)
              totalTransactionCount = tokenTransactionCount
            }
            
            // Also add token transfers as transactions if no normal transactions found
            if (recentTransactions.length === 0 && tokenData.result) {
              console.log(`📝 Adding token transfers as transactions...`)
              recentTransactions = tokenData.result.slice(0, 10).map((tx: any) => ({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: (parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))).toFixed(6),
                timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
                currency: tx.tokenSymbol
              }))
              console.log(`✅ Added ${recentTransactions.length} token transfer transactions to recent transactions`)
            }
          }
        } else {
          console.log(`❌ No token transfers found or API error:`, tokenData.message)
        }
      } catch (error) {
        console.error('Etherscan token API error:', error)
      }
    }

    // If no real tokens found, use some common ones as fallback
    if (tokens.length === 0) {
      tokens = [
        { symbol: 'USDC', balance: '0.000000', usdValue: 0, tokenAddress: '0xA0b86a33E6441b8c4' },
        { symbol: 'WETH', balance: '0.000000', usdValue: 0, tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }
      ]
    }

    const topTokens = tokens.sort((a, b) => b.usdValue - a.usdValue).slice(0, 5)
    
    // Use historical trading value if calculated, otherwise fallback to current value
    const totalLifetimeValue = historicalTradingValue > 0 ? historicalTradingValue : (usdValue + tokens.reduce((sum, token) => sum + token.usdValue, 0))
    
    console.log(`🔍 Backend calculated values:`, {
      historicalTradingValue,
      usdValue,
      tokensTotal: tokens.reduce((sum, token) => sum + token.usdValue, 0),
      finalTotalLifetimeValue: totalLifetimeValue
    })

    return {
      address,
      blockchain: 'ethereum',
      balance: {
        native: `${balance} ETH`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions,
      allTransactions,
      totalLifetimeValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeBitcoinWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Bitcoin analysis for ${address}`)
    
    let balance = '0'
    let usdValue = 0
    let transactionCount = 0
    let recentTransactions: Transaction[] = []
    
    try {
      // Use BlockCypher API for Bitcoin data (free tier available)
      console.log(`💰 Getting Bitcoin balance and transactions for ${address}...`)
      const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?limit=50`)
      const data = await response.json() as any
      
      if (data && data.balance !== undefined) {
        // Balance is in satoshis, convert to BTC
        balance = (data.balance / Math.pow(10, 8)).toFixed(8)
        transactionCount = data.n_tx || 0
        
        // Get current BTC price from CoinGecko
        try {
          console.log(`💰 Getting BTC price from CoinGecko...`)
          const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
          const priceData = await priceResponse.json() as any
          const btcPrice = priceData.bitcoin?.usd || 45000
          usdValue = parseFloat(balance) * btcPrice
          console.log(`✅ BTC price: $${btcPrice}, Balance: ${balance} BTC ($${usdValue.toFixed(2)})`)
        } catch (error) {
          console.log(`⚠️ BTC price fetch failed, using fallback`)
          usdValue = parseFloat(balance) * 45000
        }
        
        // Get recent transactions
        if (data.txrefs && Array.isArray(data.txrefs)) {
          recentTransactions = data.txrefs.slice(0, 10).map((tx: any) => ({
            hash: tx.tx_hash,
            from: tx.tx_input_n === -1 ? 'Mining Reward' : address,
            to: tx.tx_input_n === -1 ? address : 'Unknown',
            value: (tx.value / Math.pow(10, 8)).toFixed(8),
            timestamp: new Date(tx.confirmed).toISOString(),
            type: tx.tx_input_n === -1 ? 'in' : 'out',
            currency: 'BTC'
          }))
        }
        
        console.log(`✅ Bitcoin analysis complete: ${balance} BTC ($${usdValue.toFixed(2)}), ${transactionCount} transactions`)
        
        // Add BTC to our token collection system
        await this.addTokenToCollection('BTC', 'bitcoin', undefined, 'Bitcoin')
      } else {
        console.log(`⚠️ No balance data found for Bitcoin address`)
      }
    } catch (error) {
      console.log(`❌ Error analyzing Bitcoin wallet:`, error)
    }

    return {
      address,
      blockchain: 'bitcoin',
      balance: {
        native: `${balance} BTC`,
        usdValue
      },
      tokens: [],
      totalTokens: 0,
      topTokens: [],
      recentTransactions,
      totalLifetimeValue: usdValue,
      transactionCount,
      tokenTransactionCount: 0,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeSolanaWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Solana analysis for ${address}`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get SOL balance
      console.log(`💰 Getting SOL balance for ${address}...`)
      const balanceResponse = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'getBalance',
          params: [address],
          id: 1
        })
      })
      
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.result) {
        const balanceLamports = balanceData.result.value
        balance = (Number(balanceLamports) / Math.pow(10, 9)).toFixed(6)
        
        // Get SOL price from CoinGecko
        try {
          console.log(`💰 Getting SOL price from CoinGecko...`)
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
          const data = await response.json() as any
          const solPrice = data.solana?.usd || 100
          usdValue = parseFloat(balance) * solPrice
          console.log(`✅ SOL price: $${solPrice}, Balance: ${balance} SOL ($${usdValue.toFixed(2)})`)
        } catch (error) {
          console.log(`⚠️ SOL price fetch failed, using fallback`)
          usdValue = parseFloat(balance) * 100
        }
      }
    } catch (error) {
      console.log(`❌ Error getting SOL balance:`, error)
    }

    try {
      // Get ALL transaction history using Solana RPC directly
      console.log(`📊 Getting ALL Solana transaction history for ${address} using RPC...`)
      let allSignatures: any[] = []
      let pageCount = 0
      let before: string | undefined = undefined
      
      while (pageCount < 1000) { // Safety limit of 1000 pages (1M transactions max)
        pageCount++
        console.log(`📄 Solana Page ${pageCount}: Fetching transactions from RPC...`)
        
        try {
          // Add longer delay between requests to respect rate limits
          if (pageCount > 1) {
            const delay = pageCount > 10 ? 3000 : 2000 // Longer delay after 10 pages
            console.log(`⏳ Rate limiting: waiting ${delay/1000} seconds before next request...`)
            await new Promise(resolve => setTimeout(resolve, delay))
          }
          
          // Use Solana RPC directly with pagination
          const params: any = {
            limit: 1000
          }
          if (before) {
            params.before = before
          }
          
          const rpcResponse = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'getSignaturesForAddress',
              params: [address, params],
              id: 1
            })
          })
          
          if (rpcResponse.ok) {
            const rpcData = await rpcResponse.json() as any
            
            if (rpcData.result && Array.isArray(rpcData.result) && rpcData.result.length > 0) {
              console.log(`✅ RPC Page ${pageCount}: Found ${rpcData.result.length} transactions`)
              
              // Process transactions with REAL timestamps
              const pageTransactions = rpcData.result.map((tx: any) => {
                // Use REAL blockTime from RPC
                let timestamp: string
                if (tx.blockTime && typeof tx.blockTime === 'number' && tx.blockTime > 0) {
                  timestamp = new Date(tx.blockTime * 1000).toISOString()
                } else if (tx.blockTime && typeof tx.blockTime === 'string') {
                  timestamp = new Date(parseInt(tx.blockTime) * 1000).toISOString()
                } else {
                  // Fallback to current time if no blockTime
                  timestamp = new Date().toISOString()
                }
                
                return {
                  signature: tx.signature || 'unknown',
                  blockTime: tx.blockTime || 0,
                  timestamp,
                  slot: tx.slot || 0,
                  err: tx.err || null
                }
              })
              
              allSignatures.push(...pageTransactions)
              console.log(`📊 Total transactions so far: ${allSignatures.length}`)
              
              // Set before for next page
              before = rpcData.result[rpcData.result.length - 1].signature
              
              // If we got less than 1000 transactions, we've reached the end
              if (rpcData.result.length < 1000) {
                console.log(`📄 Solana Page ${pageCount}: Got ${rpcData.result.length} transactions (less than 1000), reached end`)
                break
              }
            } else {
              console.log(`📄 Solana Page ${pageCount}: No more transactions found`)
              break
            }
          } else if (rpcResponse.status === 429) {
            // Rate limit hit - wait longer and retry
            console.log(`⚠️ Rate limit hit (429), waiting 10 seconds before retry...`)
            await new Promise(resolve => setTimeout(resolve, 10000))
            pageCount-- // Retry the same page
            continue
          } else {
            console.log(`⚠️ RPC API error: ${rpcResponse.status} ${rpcResponse.statusText}`)
            // Wait and retry on other errors too
            console.log(`⏳ Waiting 5 seconds before retry...`)
            await new Promise(resolve => setTimeout(resolve, 5000))
            pageCount-- // Retry the same page
            continue
          }
        } catch (error) {
          console.log(`⚠️ RPC API request failed:`, error)
          // Wait and retry on network errors
          console.log(`⏳ Waiting 5 seconds before retry...`)
          await new Promise(resolve => setTimeout(resolve, 5000))
          pageCount-- // Retry the same page
          continue
        }
      }
      
      totalTransactionCount = allSignatures.length
      console.log(`📊 Solana Total transaction count: ${totalTransactionCount}`)
      
      // Convert to our transaction format with REAL timestamps
      allTransactions = allSignatures.map((tx: any) => ({
        hash: tx.signature,
        from: address,
        to: address,
        value: '0', // Value not available in this endpoint
        timestamp: tx.timestamp,
        type: 'transfer' as 'in' | 'out',
        currency: 'SOL'
      }))
      
      recentTransactions = allTransactions.slice(0, 10)
      
      // Log recent transaction dates to verify they're real
      console.log(`📅 Most recent Solana transaction dates:`)
      recentTransactions.forEach((tx, index) => {
        const date = new Date(tx.timestamp)
        console.log(`  ${index + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${tx.value} SOL`)
      })
    } catch (error) {
      console.log(`❌ Error getting Solana transactions:`, error)
    }

    try {
      // Get token balances using ONLY Solscan
      console.log(`🪙 Getting Solana token balances for ${address} using Solscan...`)
      
      let tokenData: any = null
      
      try {
        console.log(`🔄 Fetching tokens from Solscan...`)
        const response = await fetch(`https://public-api.solscan.io/account/tokens?account=${address}`)
        
        if (response.ok) {
          const data = await response.json() as any
          tokenData = data
          console.log(`✅ Successfully fetched tokens from Solscan`)
        } else {
          console.log(`⚠️ Solscan tokens API returned ${response.status}`)
        }
      } catch (error) {
        console.log(`⚠️ Solscan tokens API failed: ${error}`)
      }
      
      // Fallback to RPC if Solscan fails
      if (!tokenData || tokenData.length === 0) {
        console.log(`🔄 Trying direct RPC method for token accounts...`)
        try {
          const tokenAccountsResponse = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'getTokenAccountsByOwner',
              params: [
                address,
                {
                  programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
                },
                {
                  encoding: 'jsonParsed'
                }
              ],
              id: 1
            })
          })
          
          const tokenAccountsData = await tokenAccountsResponse.json() as any
          
          if (tokenAccountsData.result && tokenAccountsData.result.value) {
            console.log(`✅ Found ${tokenAccountsData.result.value.length} token accounts via RPC`)
            tokenData = tokenAccountsData.result.value.map((account: any) => ({
              tokenInfo: {
                symbol: account.account.data.parsed.info.mint,
                address: account.account.data.parsed.info.mint
              },
              tokenAmount: {
                uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
                decimals: account.account.data.parsed.info.tokenAmount.decimals
              }
            }))
          }
        } catch (rpcError) {
          console.log(`⚠️ RPC method also failed: ${rpcError}`)
        }
      }
      
      if (tokenData && Array.isArray(tokenData)) {
        console.log(`✅ Found ${tokenData.length} Solana tokens`)
        
        // Process each token with REAL prices
        for (const token of tokenData) {
          try {
            // Handle different token data formats
            let symbol = 'Unknown'
            let balance = '0'
            let tokenAddress = ''
            
            if (token.tokenInfo?.symbol) {
              symbol = token.tokenInfo.symbol
            } else if (token.mint) {
              symbol = token.mint.slice(0, 8)
            }
            
            if (token.tokenAmount?.uiAmount) {
              balance = token.tokenAmount.uiAmount.toString()
            } else if (token.amount) {
              balance = token.amount.toString()
            }
            
            // Removed decimals handling as it's not used
            
            if (token.tokenInfo?.address) {
              tokenAddress = token.tokenInfo.address
            } else if (token.mint) {
              tokenAddress = token.mint
            }
            
            // Only process tokens with non-zero balance
            if (parseFloat(balance) > 0) {
              // Get REAL token price from multiple sources
              let tokenPrice = 0
              try {
                // Try CoinGecko first for common tokens
                const coingeckoResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`)
                const coingeckoData = await coingeckoResponse.json() as any
                if (coingeckoData[symbol.toLowerCase()]?.usd) {
                  tokenPrice = coingeckoData[symbol.toLowerCase()].usd
                  console.log(`✅ ${symbol} price from CoinGecko: $${tokenPrice}`)
                } else {
                  // Try our token service as fallback
                  tokenPrice = await this.getTokenPrice(symbol, 'solana')
                  console.log(`✅ ${symbol} price from token service: $${tokenPrice}`)
                }
              } catch (error) {
                console.log(`⚠️ Could not get price for ${symbol}, using small default`)
                tokenPrice = 0.001 // Very small default price
              }
              
              const usdValue = parseFloat(balance) * tokenPrice
              
              // NO MORE CAP - use real values
              tokens.push({
                symbol,
                balance: balance.toString(),
                usdValue: usdValue,
                tokenAddress
              })
              
              console.log(`🪙 ${symbol}: ${balance} ($${usdValue.toFixed(4)})`)
              
              // Add new tokens to our collection system
              await this.addTokenToCollection(symbol, 'solana', tokenAddress, symbol)
            }
          } catch (tokenError) {
            console.log(`⚠️ Error processing token:`, tokenError)
          }
        }
        
        tokenTransactionCount = tokens.length
        console.log(`📊 Solana Token transaction count: ${tokenTransactionCount}`)
      }
    } catch (error) {
      console.log(`❌ Error getting Solana tokens:`, error)
    }

    // Calculate historical trading value
    historicalTradingValue = usdValue + tokens.reduce((sum, token) => sum + token.usdValue, 0)
    console.log(`📊 Solana Total historical trading value: $${historicalTradingValue.toFixed(2)}`)

    const topTokens = tokens.sort((a, b) => b.usdValue - a.usdValue).slice(0, 5)
    
    console.log(`✅ Solana analysis complete: $${historicalTradingValue.toFixed(2)} value, ${totalTransactionCount} transactions`)
    
    return {
      address,
      blockchain: 'solana',
      balance: {
        native: `${balance} SOL`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions,
      allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeBSCWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting BSC analysis for ${address}`)
    
    // Use Etherscan v2 API with BSC chain ID (56)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping BSC analysis`)
      return {
        address,
        blockchain: 'bsc',
        balance: {
          native: '0 BNB',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for BSC (Chain ID: 56)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get BNB balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get BNB price from CoinGecko
        const bnbPrice = await this.getTokenPrice('BNB')
        usdValue = parseFloat(balance) * bnbPrice
        
        console.log(`💰 BNB Balance: ${balance} BNB ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ BNB balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} BSC token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenAmount * tokenPrice
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} BSC tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'bsc', token.tokenAddress, token.symbol)
        }
        
        // Enhance normal transactions with token information
        console.log(`🔍 Matching BSC token transfers with normal transactions...`)
        const tokenTransferMap = new Map<string, any>()
        
        // Create a map of token transfers by transaction hash
        tokenData.result.forEach((tokenTx: any) => {
          tokenTransferMap.set(tokenTx.hash.toLowerCase(), {
            symbol: tokenTx.tokenSymbol,
            name: tokenTx.tokenName,
            address: tokenTx.contractAddress,
            value: (parseInt(tokenTx.value) / Math.pow(10, parseInt(tokenTx.tokenDecimal))).toFixed(6),
            decimals: parseInt(tokenTx.tokenDecimal),
            isTokenTransfer: true
          })
        })
        
        // Enhance normal transactions with token information
        allTransactions = allTransactions.map(tx => {
          const tokenInfo = tokenTransferMap.get(tx.hash.toLowerCase())
          if (tokenInfo) {
            return {
              ...tx,
              tokenSymbol: tokenInfo.symbol,
              tokenName: tokenInfo.name,
              tokenAddress: tokenInfo.address,
              tokenValue: tokenInfo.value,
              tokenDecimals: tokenInfo.decimals,
              isTokenTransfer: true,
              currency: tokenInfo.symbol // Override currency with token symbol
            }
          }
          return tx
        })
        
        console.log(`✅ Enhanced ${tokenTransferMap.size} BSC transactions with token information`)
      } else {
        console.log(`❌ BSC token transfers API error:`, tokenData.message)
      }
      
      // Get ALL BSC transactions (similar to Ethereum)
      console.log(`🔍 Fetching ALL BSC transactions for ${address}...`)
      let allBSCTransactions: any[] = []
      let page = 1
      const pageSize = 100
      
      while (true) {
        const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`)
        const txData = await txResponse.json() as any
        
        if (txData.status === '1' && txData.result && txData.result.length > 0) {
          allBSCTransactions = allBSCTransactions.concat(txData.result)
          console.log(`📄 BSC Page ${page}: Found ${txData.result.length} transactions`)
          
          // If we got less than pageSize, we've reached the end
          if (txData.result.length < pageSize) {
            break
          }
          page++
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 200))
        } else {
          console.log(`📄 BSC Page ${page}: No more transactions found`)
          break
        }
      }
      
      totalTransactionCount = allBSCTransactions.length
      console.log(`📊 BSC Total transaction count: ${totalTransactionCount}`)
      
      // Ensure token transaction count doesn't exceed total transaction count
      if (tokenTransactionCount > totalTransactionCount) {
        console.log(`⚠️ BSC Token transactions (${tokenTransactionCount}) exceed total transactions (${totalTransactionCount}), adjusting...`)
        tokenTransactionCount = totalTransactionCount
      }
      
      // Convert ALL transactions to our format
      allTransactions = allBSCTransactions.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: (parseFloat(tx.value) / Math.pow(10, 18)).toFixed(6),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in' as 'in' | 'out',
        currency: 'BNB',
        isTokenTransfer: false
      }))
      
      // Convert recent transactions to our format (first 10)
      recentTransactions = allTransactions.slice(0, 10)
      
      // Log the most recent transaction dates
      console.log(`📅 Most recent BSC transaction dates:`)
      recentTransactions.forEach((tx, index) => {
        const date = new Date(tx.timestamp)
        console.log(`  ${index + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${tx.value} BNB`)
      })
      
      // Calculate historical trading value using proper historical calculation
      historicalTradingValue = await this.calculateHistoricalTradingValue(tokenData.result)
      
      // If historical calculation returns 0, use a simplified approach
      if (historicalTradingValue === 0) {
        console.log(`⚠️ Historical calculation returned 0, using transaction volume estimation...`)
        
        // Estimate historical trading value based on transaction volume
        // For BSC, most transactions are likely small amounts, so estimate conservatively
        const estimatedValuePerTransaction = 0.5 // $0.50 per transaction as conservative estimate
        historicalTradingValue = tokenData.result.length * estimatedValuePerTransaction
        
        console.log(`📊 BSC Estimated historical trading value: $${historicalTradingValue.toFixed(2)} (${tokenData.result.length} transactions × $${estimatedValuePerTransaction})`)
      } else {
        console.log(`📊 BSC Total historical trading value: $${historicalTradingValue.toFixed(2)}`)
      }
      
    } catch (error) {
      console.log(`❌ Error in BSC analysis:`, error)
    }
    
    const topTokens = tokens.sort((a, b) => b.usdValue - a.usdValue).slice(0, 5)
    
    return {
      address,
      blockchain: 'bsc',
      balance: {
        native: `${balance} BNB`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions,
      allTransactions: allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzePolygonWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Polygon analysis for ${address}`)
    
    // Use Etherscan v2 API with Polygon chain ID (137)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping Polygon analysis`)
      return {
        address,
        blockchain: 'polygon',
        balance: {
          native: '0 MATIC',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for Polygon (Chain ID: 137)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get MATIC balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=137&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get MATIC price from CoinGecko
        const maticPrice = await this.getTokenPrice('MATIC')
        usdValue = parseFloat(balance) * maticPrice
        
        console.log(`💰 MATIC Balance: ${balance} MATIC ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ MATIC balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=137&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} Polygon token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenAmount * tokenPrice
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} Polygon tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'polygon', token.tokenAddress, token.symbol)
        }
        
        // Enhance normal transactions with token information
        console.log(`🔍 Matching Polygon token transfers with normal transactions...`)
        const tokenTransferMap = new Map<string, any>()
        
        // Create a map of token transfers by transaction hash
        tokenData.result.forEach((tokenTx: any) => {
          tokenTransferMap.set(tokenTx.hash.toLowerCase(), {
            symbol: tokenTx.tokenSymbol,
            name: tokenTx.tokenName,
            address: tokenTx.contractAddress,
            value: (parseInt(tokenTx.value) / Math.pow(10, parseInt(tokenTx.tokenDecimal))).toFixed(6),
            decimals: parseInt(tokenTx.tokenDecimal),
            isTokenTransfer: true
          })
        })
        
        // Enhance normal transactions with token information
        allTransactions = allTransactions.map(tx => {
          const tokenInfo = tokenTransferMap.get(tx.hash.toLowerCase())
          if (tokenInfo) {
            return {
              ...tx,
              tokenSymbol: tokenInfo.symbol,
              tokenName: tokenInfo.name,
              tokenAddress: tokenInfo.address,
              tokenValue: tokenInfo.value,
              tokenDecimals: tokenInfo.decimals,
              isTokenTransfer: true,
              currency: tokenInfo.symbol // Override currency with token symbol
            }
          }
          return tx
        })
        
        console.log(`✅ Enhanced ${tokenTransferMap.size} Polygon transactions with token information`)
      } else {
        console.log(`❌ Polygon token transfers API error:`, tokenData.message)
      }
      
      // Get ALL Polygon transactions
      console.log(`🔍 Fetching ALL Polygon transactions for ${address}...`)
      let allPolygonTransactions: any[] = []
      let page = 1
      const pageSize = 100
      
      while (true) {
        const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=137&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`)
        const txData = await txResponse.json() as any
        
        if (txData.status === '1' && txData.result && txData.result.length > 0) {
          allPolygonTransactions = allPolygonTransactions.concat(txData.result)
          console.log(`📄 Polygon Page ${page}: Found ${txData.result.length} transactions`)
          
          // If we got less than pageSize, we've reached the end
          if (txData.result.length < pageSize) {
            break
          }
          page++
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 200))
        } else {
          console.log(`📄 Polygon Page ${page}: No more transactions found`)
          break
        }
      }
      
      totalTransactionCount = allPolygonTransactions.length
      console.log(`📊 Polygon Total transaction count: ${totalTransactionCount}`)
      
      // Ensure token transaction count doesn't exceed total transaction count
      if (tokenTransactionCount > totalTransactionCount) {
        console.log(`⚠️ Polygon Token transactions (${tokenTransactionCount}) exceed total transactions (${totalTransactionCount}), adjusting...`)
        tokenTransactionCount = totalTransactionCount
      }
      
      // Convert ALL transactions to our format
      allTransactions = allPolygonTransactions.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: (parseFloat(tx.value) / Math.pow(10, 18)).toFixed(6),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in' as 'in' | 'out',
        currency: 'MATIC',
        isTokenTransfer: false
      }))
      
      // Convert recent transactions to our format (first 10)
      recentTransactions = allTransactions.slice(0, 10)
      
      // Calculate historical trading value using proper historical calculation
      historicalTradingValue = await this.calculateHistoricalTradingValue(tokenData.result)
      console.log(`📊 Polygon Total historical trading value: $${historicalTradingValue.toFixed(2)}`)
      
    } catch (error) {
      console.log(`❌ Error in Polygon analysis:`, error)
    }
    
    const topTokens = tokens.sort((a, b) => b.usdValue - a.usdValue).slice(0, 5)
    
    return {
      address,
      blockchain: 'polygon',
      balance: {
        native: `${balance} MATIC`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions,
      allTransactions: allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeAvalancheWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Avalanche analysis for ${address}`)
    
    // Use Etherscan v2 API with Avalanche chain ID (43114)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping Avalanche analysis`)
      return {
        address,
        blockchain: 'avalanche',
        balance: {
          native: '0 AVAX',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for Avalanche (Chain ID: 43114)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get AVAX balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=43114&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get AVAX price from CoinGecko
        const avaxPrice = await this.getTokenPrice('AVAX')
        usdValue = parseFloat(balance) * avaxPrice
        
        console.log(`💰 AVAX Balance: ${balance} AVAX ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ AVAX balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=43114&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} Avalanche token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price - if no price found, use 0
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenPrice > 0 ? tokenAmount * tokenPrice : 0
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} Avalanche tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'avalanche', token.tokenAddress, token.symbol)
        }
        
        // Enhance normal transactions with token information
        console.log(`🔍 Matching Avalanche token transfers with normal transactions...`)
        const tokenTransferMap = new Map<string, any>()
        
        // Create a map of token transfers by transaction hash
        tokenData.result.forEach((tokenTx: any) => {
          tokenTransferMap.set(tokenTx.hash.toLowerCase(), {
            symbol: tokenTx.tokenSymbol,
            name: tokenTx.tokenName,
            address: tokenTx.contractAddress,
            value: (parseInt(tokenTx.value) / Math.pow(10, parseInt(tokenTx.tokenDecimal))).toFixed(6),
            decimals: parseInt(tokenTx.tokenDecimal),
            isTokenTransfer: true
          })
        })
        
        // Enhance normal transactions with token information
        allTransactions = allTransactions.map(tx => {
          const tokenInfo = tokenTransferMap.get(tx.hash.toLowerCase())
          if (tokenInfo) {
            return {
              ...tx,
              tokenSymbol: tokenInfo.symbol,
              tokenName: tokenInfo.name,
              tokenAddress: tokenInfo.address,
              tokenValue: tokenInfo.value,
              tokenDecimals: tokenInfo.decimals,
              isTokenTransfer: true,
              currency: tokenInfo.symbol // Override currency with token symbol
            }
          }
          return tx
        })
        
        console.log(`✅ Enhanced ${tokenTransferMap.size} Avalanche transactions with token information`)
      } else {
        console.log(`❌ Avalanche token transfers API error:`, tokenData.message)
      }
      
      // Get ALL Avalanche transactions
      console.log(`🔍 Fetching ALL Avalanche transactions for ${address}...`)
      let allAvalancheTransactions: any[] = []
      let page = 1
      const pageSize = 100
      
      while (true) {
        const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=43114&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${pageSize}&sort=desc&apikey=${etherscanApiKey}`)
        const txData = await txResponse.json() as any
        
        if (txData.status === '1' && txData.result && txData.result.length > 0) {
          allAvalancheTransactions = allAvalancheTransactions.concat(txData.result)
          console.log(`📄 Avalanche Page ${page}: Found ${txData.result.length} transactions`)
          
          // If we got less than pageSize, we've reached the end
          if (txData.result.length < pageSize) {
            break
          }
          page++
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 200))
        } else {
          console.log(`📄 Avalanche Page ${page}: No more transactions found`)
          break
        }
      }
      
      totalTransactionCount = allAvalancheTransactions.length
      console.log(`📊 Avalanche Total transaction count: ${totalTransactionCount}`)
      
      // Ensure token transaction count doesn't exceed total transaction count
      if (tokenTransactionCount > totalTransactionCount) {
        console.log(`⚠️ Avalanche Token transactions (${tokenTransactionCount}) exceed total transactions (${totalTransactionCount}), adjusting...`)
        tokenTransactionCount = totalTransactionCount
      }
      
      // Convert ALL transactions to our format
      allTransactions = allAvalancheTransactions.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: (parseFloat(tx.value) / Math.pow(10, 18)).toFixed(6),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in' as 'in' | 'out',
        currency: 'AVAX',
        isTokenTransfer: false
      }))
      
      // Convert recent transactions to our format (first 10)
      recentTransactions = allTransactions.slice(0, 10)
      
      // Log the most recent transaction dates
      console.log(`📅 Most recent Avalanche transaction dates:`)
      recentTransactions.forEach((tx, index) => {
        const date = new Date(tx.timestamp)
        console.log(`  ${index + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${tx.value} AVAX`)
      })
      
      // Calculate historical trading value using proper historical calculation
      historicalTradingValue = await this.calculateHistoricalTradingValue(tokenData.result)
      
      // If historical calculation returns 0, use a simplified approach
      if (historicalTradingValue === 0) {
        console.log(`⚠️ Historical calculation returned 0, using transaction volume estimation...`)
        
        // Estimate historical trading value based on transaction volume
        // For Avalanche, transactions are likely more substantial
        const estimatedValuePerTransaction = 2.0 // $2.00 per transaction as conservative estimate
        historicalTradingValue = tokenData.result.length * estimatedValuePerTransaction
        
        console.log(`📊 Avalanche Estimated historical trading value: $${historicalTradingValue.toFixed(2)} (${tokenData.result.length} transactions × $${estimatedValuePerTransaction})`)
      } else {
        console.log(`📊 Avalanche Total historical trading value: $${historicalTradingValue.toFixed(2)}`)
      }
      
    } catch (error) {
      console.log(`❌ Error in Avalanche analysis:`, error)
    }
    
    const topTokens = tokens.sort((a, b) => b.usdValue - a.usdValue).slice(0, 5)
    
    return {
      address,
      blockchain: 'avalanche',
      balance: {
        native: `${balance} AVAX`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions,
      allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeArbitrumWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Arbitrum analysis for ${address}`)
    
    // Use Etherscan v2 API with Arbitrum chain ID (42161)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping Arbitrum analysis`)
      return {
        address,
        blockchain: 'arbitrum',
        balance: {
          native: '0 ARB',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for Arbitrum (Chain ID: 42161)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get ARB balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=42161&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get ARB price from CoinGecko
        const arbPrice = await this.getTokenPrice('ARB')
        usdValue = parseFloat(balance) * arbPrice
        
        console.log(`💰 ARB Balance: ${balance} ARB ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ ARB balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=42161&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} Arbitrum token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenAmount * tokenPrice
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} Arbitrum tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'arbitrum', token.tokenAddress, token.symbol)
        }
      } else {
        console.log(`❌ Arbitrum token transfers API error:`, tokenData.message)
      }
      
      // Get normal transactions using Etherscan v2 API
      const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=42161&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const txData = await txResponse.json() as any
      
      if (txData.status === '1') {
        console.log(`✅ Found ${txData.result.length} Arbitrum transactions`)
        
        // Process transactions
        for (const tx of txData.result) {
          const value = parseFloat(tx.value) / Math.pow(10, 18)
          const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString()
          
          const transaction: Transaction = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: value.toFixed(6),
            timestamp,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
            currency: 'ARB'
          }
          
          recentTransactions.push(transaction)
          allTransactions.push(transaction)
          
          // Calculate historical trading value
          historicalTradingValue += value * (await this.getTokenPrice('ARB'))
        }
        
        totalTransactionCount = txData.result.length
      } else {
        console.log(`❌ Arbitrum transactions API error:`, txData.message)
      }
      
    } catch (error) {
      console.log(`❌ Arbitrum analysis error:`, error)
    }
    
    // Get top tokens by USD value
    const topTokens = tokens
      .sort((a, b) => b.usdValue - a.usdValue)
      .slice(0, 5)
    
    return {
      address,
      blockchain: 'arbitrum',
      balance: {
        native: `${balance} ARB`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions: recentTransactions.slice(0, 10),
      allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeOptimismWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Optimism analysis for ${address}`)
    
    // Use Etherscan v2 API with Optimism chain ID (10)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping Optimism analysis`)
      return {
        address,
        blockchain: 'optimism',
        balance: {
          native: '0 OP',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for Optimism (Chain ID: 10)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get OP balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=10&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get OP price from CoinGecko
        const opPrice = await this.getTokenPrice('OP')
        usdValue = parseFloat(balance) * opPrice
        
        console.log(`💰 OP Balance: ${balance} OP ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ OP balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=10&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} Optimism token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenAmount * tokenPrice
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} Optimism tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'optimism', token.tokenAddress, token.symbol)
        }
      } else {
        console.log(`❌ Optimism token transfers API error:`, tokenData.message)
      }
      
      // Get normal transactions using Etherscan v2 API
      const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=10&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const txData = await txResponse.json() as any
      
      if (txData.status === '1') {
        console.log(`✅ Found ${txData.result.length} Optimism transactions`)
        
        // Process transactions
        for (const tx of txData.result) {
          const value = parseFloat(tx.value) / Math.pow(10, 18)
          const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString()
          
          const transaction: Transaction = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: value.toFixed(6),
            timestamp,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
            currency: 'OP'
          }
          
          recentTransactions.push(transaction)
          allTransactions.push(transaction)
          
          // Calculate historical trading value
          historicalTradingValue += value * (await this.getTokenPrice('OP'))
        }
        
        totalTransactionCount = txData.result.length
      } else {
        console.log(`❌ Optimism transactions API error:`, txData.message)
      }
      
    } catch (error) {
      console.log(`❌ Optimism analysis error:`, error)
    }
    
    // Get top tokens by USD value
    const topTokens = tokens
      .sort((a, b) => b.usdValue - a.usdValue)
      .slice(0, 5)
    
    return {
      address,
      blockchain: 'optimism',
      balance: {
        native: `${balance} OP`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions: recentTransactions.slice(0, 10),
      allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeBaseWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Base analysis for ${address}`)
    
    // Use Etherscan v2 API with Base chain ID (8453)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping Base analysis`)
      return {
        address,
        blockchain: 'base',
        balance: {
          native: '0 ETH',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for Base (Chain ID: 8453)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get ETH balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get ETH price from CoinGecko
        const ethPrice = await this.getTokenPrice('ETH')
        usdValue = parseFloat(balance) * ethPrice
        
        console.log(`💰 ETH Balance: ${balance} ETH ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ ETH balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} Base token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenAmount * tokenPrice
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} Base tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'base', token.tokenAddress, token.symbol)
        }
      } else {
        console.log(`❌ Base token transfers API error:`, tokenData.message)
      }
      
      // Get normal transactions using Etherscan v2 API
      const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const txData = await txResponse.json() as any
      
      if (txData.status === '1') {
        console.log(`✅ Found ${txData.result.length} Base transactions`)
        
        // Process transactions
        for (const tx of txData.result) {
          const value = parseFloat(tx.value) / Math.pow(10, 18)
          const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString()
          
          const transaction: Transaction = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: value.toFixed(6),
            timestamp,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
            currency: 'ETH'
          }
          
          recentTransactions.push(transaction)
          allTransactions.push(transaction)
          
          // Calculate historical trading value
          historicalTradingValue += value * (await this.getTokenPrice('ETH'))
        }
        
        totalTransactionCount = txData.result.length
      } else {
        console.log(`❌ Base transactions API error:`, txData.message)
      }
      
    } catch (error) {
      console.log(`❌ Base analysis error:`, error)
    }
    
    // Get top tokens by USD value
    const topTokens = tokens
      .sort((a, b) => b.usdValue - a.usdValue)
      .slice(0, 5)
    
    return {
      address,
      blockchain: 'base',
      balance: {
        native: `${balance} ETH`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions: recentTransactions.slice(0, 10),
      allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static async analyzeLineaWallet(address: string): Promise<WalletAnalysis> {
    console.log(`🔍 Starting Linea analysis for ${address}`)
    
    // Use Etherscan v2 API with Linea chain ID (59144)
    const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
    
    if (!etherscanApiKey) {
      console.log(`⚠️ Etherscan API key not found, skipping Linea analysis`)
      return {
        address,
        blockchain: 'linea',
        balance: {
          native: '0 ETH',
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
      }
    }
    
    console.log(`🔗 Using Etherscan v2 API for Linea (Chain ID: 59144)`)
    
    let balance = '0'
    let usdValue = 0
    let historicalTradingValue = 0
    let totalTransactionCount = 0
    let tokenTransactionCount = 0
    let tokens: TokenBalance[] = []
    let recentTransactions: Transaction[] = []
    let allTransactions: Transaction[] = []
    
    try {
      // Get ETH balance using Etherscan v2 API
      const balanceResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=59144&module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`)
      const balanceData = await balanceResponse.json() as any
      
      if (balanceData.status === '1') {
        const balanceWei = BigInt(balanceData.result)
        balance = (Number(balanceWei) / Math.pow(10, 18)).toFixed(6)
        
        // Get ETH price from CoinGecko
        const ethPrice = await this.getTokenPrice('ETH')
        usdValue = parseFloat(balance) * ethPrice
        
        console.log(`💰 ETH Balance: ${balance} ETH ($${usdValue.toFixed(2)})`)
      } else {
        console.log(`❌ ETH balance API error:`, balanceData.message)
      }
      
      // Get token transfers using Etherscan v2 API
      const tokenResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=59144&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const tokenData = await tokenResponse.json() as any
      
      if (tokenData.status === '1') {
        console.log(`✅ Found ${tokenData.result.length} Linea token transfers`)
        
        // Process token transfers
        const tokenMap = new Map<string, any>()
        
        for (const tx of tokenData.result) {
          const tokenKey = tx.contractAddress.toLowerCase()
          
          if (!tokenMap.has(tokenKey)) {
            tokenMap.set(tokenKey, {
              symbol: tx.tokenSymbol,
              balance: '0',
              usdValue: 0,
              tokenAddress: tx.contractAddress
            })
          }
          
          // Calculate balance (simplified - in real implementation you'd need to track all transfers)
          const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
          
          // Get token price
          const tokenPrice = await this.getTokenPrice(tx.tokenSymbol)
          const tokenUsdValue = tokenAmount * tokenPrice
          
          const existing = tokenMap.get(tokenKey)!
          existing.balance = (parseFloat(existing.balance) + tokenAmount).toFixed(6)
          existing.usdValue += tokenUsdValue
        }
        
        tokens = Array.from(tokenMap.values()).filter(token => parseFloat(token.balance) > 0)
        tokenTransactionCount = tokenData.result.length
        
        console.log(`✅ Found ${tokens.length} Linea tokens with non-zero balance`)
        
        // Add new tokens to collection system
        for (const token of tokens) {
          await this.addTokenToCollection(token.symbol, 'linea', token.tokenAddress, token.symbol)
        }
      } else {
        console.log(`❌ Linea token transfers API error:`, tokenData.message)
      }
      
      // Get normal transactions using Etherscan v2 API
      const txResponse = await fetch(`https://api.etherscan.io/v2/api?chainid=59144&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`)
      const txData = await txResponse.json() as any
      
      if (txData.status === '1') {
        console.log(`✅ Found ${txData.result.length} Linea transactions`)
        
        // Process transactions
        for (const tx of txData.result) {
          const value = parseFloat(tx.value) / Math.pow(10, 18)
          const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString()
          
          const transaction: Transaction = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: value.toFixed(6),
            timestamp,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
            currency: 'ETH'
          }
          
          recentTransactions.push(transaction)
          allTransactions.push(transaction)
          
          // Calculate historical trading value
          historicalTradingValue += value * (await this.getTokenPrice('ETH'))
        }
        
        totalTransactionCount = txData.result.length
      } else {
        console.log(`❌ Linea transactions API error:`, txData.message)
      }
      
    } catch (error) {
      console.log(`❌ Linea analysis error:`, error)
    }
    
    // Get top tokens by USD value
    const topTokens = tokens
      .sort((a, b) => b.usdValue - a.usdValue)
      .slice(0, 5)
    
    return {
      address,
      blockchain: 'linea',
      balance: {
        native: `${balance} ETH`,
        usdValue
      },
      tokens,
      totalTokens: tokens.length,
      topTokens,
      recentTransactions: recentTransactions.slice(0, 10),
      allTransactions,
      totalLifetimeValue: historicalTradingValue,
      transactionCount: totalTransactionCount,
      tokenTransactionCount,
      lastUpdated: new Date().toISOString()
    }
  }

  private static priceCache: Map<string, { price: number, timestamp: number }> = new Map()
  private static lastApiCall = 0
  private static readonly API_CALL_INTERVAL = 1200 // 1.2 seconds between calls to respect rate limit

  private static async getTokenPrice(symbol: string, blockchain: string = 'ethereum'): Promise<number> {
    // First try to get from Azure storage (our primary source)
    const azurePrice = await this.getTokenPriceFromAzureStorage(symbol, blockchain)
    if (azurePrice && azurePrice.price > 0) {
      console.log(`✅ ${symbol} price from Azure storage: $${azurePrice.price}`)
      return azurePrice.price
    }

    // If not in Azure storage, add token to collection and get one-time price
    console.log(`🆕 ${symbol} not in Azure storage, adding to collection...`)
    await this.addTokenToCollection(symbol, blockchain, undefined, symbol)
    
    // Try to get price one more time after adding to collection
    const retryPrice = await this.getTokenPriceFromAzureStorage(symbol, blockchain)
    if (retryPrice && retryPrice.price > 0) {
      console.log(`✅ ${symbol} price after collection: $${retryPrice.price}`)
      return retryPrice.price
    }

    // Check existing cache (cache for 5 minutes)
    const cached = this.priceCache.get(symbol)
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      console.log(`💰 ${symbol} price (cached): $${cached.price}`)
      return cached.price
    }

    // Rate limiting - wait if we called API too recently
    const now = Date.now()
    const timeSinceLastCall = now - this.lastApiCall
    if (timeSinceLastCall < this.API_CALL_INTERVAL) {
      const waitTime = this.API_CALL_INTERVAL - timeSinceLastCall
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms before next API call`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    // Try multiple price sources in order of preference
    const price = await this.getTokenPriceFromMultipleSources(symbol)
    
    // Cache the result
    this.priceCache.set(symbol, { price, timestamp: Date.now() })
    
    return price
  }

  private static async getTokenPriceFromMultipleSources(symbol: string): Promise<number> {
    // 1. Try DefiLlama first (best for historical data)
    try {
      const defiLlamaPrice = await this.getTokenPriceFromDefiLlama(symbol)
      if (defiLlamaPrice > 0) {
        console.log(`✅ DefiLlama price for ${symbol}: $${defiLlamaPrice}`)
        return defiLlamaPrice
      }
    } catch (error) {
      console.log(`⚠️ DefiLlama failed for ${symbol}:`, error)
    }

    // 2. Try DexScreener (best for DEX tokens)
    try {
      const dexScreenerPrice = await this.getTokenPriceFromDexScreener(symbol)
      if (dexScreenerPrice > 0) {
        console.log(`✅ DexScreener price for ${symbol}: $${dexScreenerPrice}`)
        return dexScreenerPrice
      }
    } catch (error) {
      console.log(`⚠️ DexScreener failed for ${symbol}:`, error)
    }

    // 3. Try CoinGecko (fallback)
    try {
      const coinGeckoPrice = await this.getTokenPriceFromCoinGecko(symbol)
      if (coinGeckoPrice > 0) {
        console.log(`✅ CoinGecko price for ${symbol}: $${coinGeckoPrice}`)
        return coinGeckoPrice
      }
    } catch (error) {
      console.log(`⚠️ CoinGecko failed for ${symbol}:`, error)
    }

    // 4. Use fallback price
    console.log(`⚠️ All price sources failed for ${symbol}, using fallback`)
    return this.getFallbackPrice(symbol)
  }

  private static async getTokenPriceFromDefiLlama(symbol: string): Promise<number> {
    try {
      // Map common symbols to DefiLlama token addresses
      const symbolToAddress: { [key: string]: string } = {
        'ETH': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'USDC': '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c',
        'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
        'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
        'WBTC': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        'UNI': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        'LINK': '0x514910771af9ca656af840dff83e8264ecf986ca',
        'AAVE': '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        'CRV': '0xd533a949740bb3306d119cc777fa900ba034cd52',
        'COMP': '0xc00e94cb662c3520282e6f5717214004a7f26888',
        'MKR': '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        'SUSHI': '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        'YFI': '0x0bc529c00c6401aef6d220be8c6ea1667f6ad9ec',
        'BAL': '0xba100000625a3754423978a60c9317c58a424e3d',
        'SNX': '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
        'REN': '0x408e41876cccdc0f92210600ef50372656052a38',
        'KNC': '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
        'ZRX': '0xe41d2489571d322189246dafa5ebde1f4699f498',
        'BAT': '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        'REP': '0x1985365e9f78359a9b6ad760e32412f4a445e862',
        'OMG': '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        'MANA': '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        'ENJ': '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
        'SAND': '0x3845badade8e6dff049820680d1f14bd3903a5d0',
        'AXS': '0xbb0e17ef65f82ab02d3d27b06d88e0d5d0b1b143',
        'CHZ': '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
        'HOT': '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
        'VET': '0xd850942ef8811f2a866692a623011bde52a462c1',
        'TRX': '0x50327c6c5a14dcba7072124b5b975ab4c5c4d6c6',
        'ADA': '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
        'DOT': '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
        'MATIC': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        'AVAX': '0x85f138bfee4ef8e540890cfb48f620571d67eda3',
        'FTM': '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
        'SOL': '0xd31a59c85ae9d8edefec411d448f90841571b89c',
        'NEAR': '0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4',
        'ALGO': '0xa1faa113cbe53436df28ff0aee54275c13b40975',
        'ATOM': '0x8d983cb9388e62c8c4eddc5e8c7b2e8e88b504e3',
        'LUNA': '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
        'UST': '0xa693b19d2931d498c5b318df961919bb4aee87a5',
        'BNB': '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        'CAKE': '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        'BUSD': '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        'HELENA': '0x7b2df125567815ac9b57da04b620f50bc93b320c',
        'TITANO': '0x4e3cabd3ad77420ff9031d19899594041c420aee',
        'SAFUU': '0x6afcff9189e8ed3fcc1cffa184feb1276ef6b08e',
        'ARCA': '0x1a3acf6d19267e2d3e7f898f42803e90c9219062',
        'IGO': '0x5b4e1c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c',
        'QBIT': '0x17b7163cf1dbd286e262ddc68b553d899b93f526',
        'TIME': '0xb54f16fb19478766a268f172c9480f8da1a7c9c3',
        'MEMO': '0x136aed5c8c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c',
        'WETH.E': '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
        'ANYETH': '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
        'MNEAV': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        'WETH.e': '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
        'wMEMO': '0x0da67235dd5787d67955420c84ca1cecd4e5bb3b',
        'anyETH': '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
        'SOS': '0x3b484b82567a09e2588a13d54d032153f0c0aee0',
        'PAID': '0x1614f18fc94f47967a3fbe5ffcd46d4e7da3d787',
        'SLP': '0x070a08beef8d36734dd67a491202ff35a6a16d97',
        'ILV': '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
        'ENS': '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
        'sILV': '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
        'sILV2': '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
        'BYTES': '0x7d647b1a0dcd5525e9c6b3d14be58f27674f8c95e'
      }

      const tokenAddress = symbolToAddress[symbol.toUpperCase()]
      if (!tokenAddress) {
        console.log(`⚠️ No DefiLlama address mapping for ${symbol}`)
        return 0
      }

      // Try to get price from DefiLlama's price API
      const response = await fetch(`https://api.llama.fi/v2/historicalPrice/${tokenAddress}?timestamp=${Math.floor(Date.now() / 1000)}`)
      const data = await response.json() as any
      
      if (data && data.price) {
        return data.price
      }
      
      return 0
    } catch (error) {
      console.log(`❌ DefiLlama error for ${symbol}:`, error)
      return 0
    }
  }

  private static async getTokenPriceFromDexScreener(symbol: string): Promise<number> {
    try {
      // DexScreener search endpoint
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(symbol)}`)
      const data = await response.json() as any
      
      if (data.pairs && data.pairs.length > 0) {
        // Get the first (most relevant) pair
        const pair = data.pairs[0]
        if (pair.priceUsd) {
          return parseFloat(pair.priceUsd)
        }
      }
      
      return 0
    } catch (error) {
      console.log(`❌ DexScreener error for ${symbol}:`, error)
      return 0
    }
  }

  private static async getTokenPriceFromCoinGecko(symbol: string): Promise<number> {
    try {
      // Map common token symbols to CoinGecko IDs
      const symbolToId: { [key: string]: string } = {
        'ETH': 'ethereum',
        'WETH': 'weth',
        'USDC': 'usd-coin',
        'USDT': 'tether',
        'DAI': 'dai',
        'WBTC': 'wrapped-bitcoin',
        'UNI': 'uniswap',
        'LINK': 'chainlink',
        'AAVE': 'aave',
        'CRV': 'curve-dao-token',
        'COMP': 'compound-governance-token',
        'MKR': 'maker',
        'SUSHI': 'sushi',
        'YFI': 'yearn-finance',
        'BAL': 'balancer',
        'SNX': 'havven',
        'REN': 'republic-protocol',
        'KNC': 'kyber-network-crystal',
        'ZRX': '0x',
        'BAT': 'basic-attention-token',
        'REP': 'augur',
        'OMG': 'omisego',
        'MANA': 'decentraland',
        'ENJ': 'enjincoin',
        'SAND': 'the-sandbox',
        'AXS': 'axie-infinity',
        'CHZ': 'chiliz',
        'HOT': 'holochain',
        'VET': 'vechain',
        'TRX': 'tron',
        'ADA': 'cardano',
        'DOT': 'polkadot',
        'MATIC': 'matic-network',
        'AVAX': 'avalanche-2',
        'FTM': 'fantom',
        'SOL': 'solana',
        'NEAR': 'near',
        'ALGO': 'algorand',
        'ATOM': 'cosmos',
        'LUNA': 'terra-luna-2',
        'UST': 'terrausd',
        'BNB': 'binancecoin',
        'CAKE': 'pancakeswap-token',
        'BUSD': 'binance-usd',
        'HELENA': 'helena',
        'TITANO': 'titano',
        'SAFUU': 'safuu',
        'ARCA': 'arca',
        'IGO': 'igo',
        'QBIT': 'qbit',
        'TIME': 'time',
        'MEMO': 'memo',
        'WETH.E': 'weth',
        'ANYETH': 'weth',
        'MNEAV': 'mneav',
        'WETH.e': 'weth',
        'wMEMO': 'memo',
        'anyETH': 'weth',
        'SOS': 'opendao',
        'ILV': 'illuvium',
        'ENS': 'ethereum-name-service',
        'sILV': 'illuvium', // Use ILV price for sILV
        'sILV2': 'illuvium', // Use ILV price for sILV2
        'BYTES': 'bytes'
      }

      const coinId = symbolToId[symbol.toUpperCase()]
      if (!coinId) {
        console.log(`⚠️ No CoinGecko ID mapping for ${symbol}`)
        return 0
      }

      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
      const data = await response.json() as any
      
      if (data[coinId] && data[coinId].usd) {
        return data[coinId].usd
      } else {
        console.log(`⚠️ No price data for ${symbol} (${coinId}) - API response:`, JSON.stringify(data))
        return 0
      }
    } catch (error) {
      console.log(`❌ CoinGecko error for ${symbol}:`, error)
      return 0
    }
  }

  private static getFallbackPrice(symbol: string): number {
    // Use reasonable fallback prices when all APIs fail
    const fallbackPrices: { [key: string]: number } = {
      // Major Ethereum tokens
      'ETH': 3500, // ~$3500
      'WETH': 3500, // ~$3500
      'USDC': 1, // Stablecoin
      'USDT': 1, // Stablecoin
      'DAI': 1, // Stablecoin
      'WBTC': 65000, // ~$65000
      'UNI': 8, // ~$8
      'LINK': 15, // ~$15
      'AAVE': 250, // ~$250
      'CRV': 0.5, // ~$0.50
      'COMP': 60, // ~$60
      'MKR': 2000, // ~$2000
      'SUSHI': 1, // ~$1
      'YFI': 8000, // ~$8000
      'BAL': 4, // ~$4
      'SNX': 3, // ~$3
      'REN': 0.1, // ~$0.10
      'KNC': 0.5, // ~$0.50
      'ZRX': 0.3, // ~$0.30
      'BAT': 0.2, // ~$0.20
      'REP': 1, // ~$1
      'OMG': 0.5, // ~$0.50
      'MANA': 0.4, // ~$0.40
      'ENJ': 0.3, // ~$0.30
      'SAND': 0.4, // ~$0.40
      'AXS': 7, // ~$7
      'CHZ': 0.1, // ~$0.10
      'HOT': 0.001, // ~$0.001
      'VET': 0.02, // ~$0.02
      'TRX': 0.1, // ~$0.10
      'ADA': 0.5, // ~$0.50
      'DOT': 7, // ~$7
      'MATIC': 0.7, // ~$0.70
      'AVAX': 25, // ~$25
      'FTM': 0.3, // ~$0.30
      'SOL': 100, // ~$100
      'NEAR': 5, // ~$5
      'ALGO': 0.2, // ~$0.20
      'ATOM': 8, // ~$8
      'LUNA': 0.5, // ~$0.50
      'UST': 1, // Stablecoin
      'BNB': 600, // ~$600
      'CAKE': 2, // ~$2
      'BUSD': 1, // Stablecoin
      'HELENA': 0.01, // Most BSC tokens are low value
      'TITANO': 0.01,
      'SAFUU': 0.01,
      'ARCA': 0.01,
      'IGO': 0.01,
      'QBIT': 0.01,
      'TIME': 0.1, // TIME token
      'MEMO': 0.1,
      'WETH.E': 3500,
      'ANYETH': 3500,
      'MNEAV': 0.01,
      'WETH.e': 3500,
      'wMEMO': 0.1,
      'anyETH': 3500,
      'SOS': 0.000000004, // Very low value
      'PAID': 0.1, // ~$0.10
      'SLP': 0.5, // ~$0.50
      'ILV': 14, // ~$14
      'ENS': 28, // ~$28
      'sILV': 14, // Same as ILV
      'sILV2': 14, // Same as ILV
      'BYTES': 0.01,
      'UNKNOWN': 0.01, // Default for unknown tokens
    }
    
    const fallbackPrice = fallbackPrices[symbol.toUpperCase()]
    if (fallbackPrice !== undefined) {
      console.log(`🔄 Using fallback price for ${symbol}: $${fallbackPrice}`)
      return fallbackPrice
    }
    
    console.log(`⚠️ No fallback price for ${symbol}, using $0`)
    return 0
  }

  private static async calculateHistoricalTradingValue(transactions: any[]): Promise<number> {
    let totalTradingValue = 0
    let processedCount = 0
    let skippedCount = 0
    
    console.log(`📊 Calculating historical trading value for ${transactions.length} transactions...`)
    
    // Log the date range of transactions
    if (transactions.length > 0) {
      const firstTx = transactions[0]
      const lastTx = transactions[transactions.length - 1]
      const firstDate = new Date(parseInt(firstTx.timeStamp) * 1000)
      const lastDate = new Date(parseInt(lastTx.timeStamp) * 1000)
      console.log(`📅 Transaction date range: ${firstDate.toLocaleDateString()} to ${lastDate.toLocaleDateString()}`)
    }
    
    for (const tx of transactions) {
      try {
        // Skip transactions without token data
        if (!tx.tokenSymbol || !tx.value) {
          skippedCount++
          continue
        }
        
        // Parse token amount
        const tokenAmount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '18'))
        
        // Clean up token symbol (remove URLs, special characters, etc.)
        let cleanSymbol = tx.tokenSymbol
          .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
          .replace(/\[.*?\]/g, '') // Remove brackets and content
          .replace(/\(.*?\)/g, '') // Remove parentheses and content
          .replace(/[^\w\s]/g, '') // Remove special characters
          .trim()
        
        // If symbol is too long or empty, use a default
        if (cleanSymbol.length > 20 || cleanSymbol.length === 0) {
          cleanSymbol = 'UNKNOWN'
        }
        
        // Get historical price for the token at the transaction date
        const txDate = new Date(parseInt(tx.timeStamp) * 1000)
        const historicalPrice = await this.getHistoricalTokenPrice(cleanSymbol, txDate)
        
        const transactionValue = tokenAmount * historicalPrice
        totalTradingValue += transactionValue
        processedCount++
        
        // Log all transactions for debugging
        console.log(`💰 ${cleanSymbol} (${tx.tokenSymbol}): ${tokenAmount.toFixed(6)} @ $${historicalPrice} = $${transactionValue.toFixed(2)} (${txDate.toISOString().split('T')[0]})`)
        
      } catch (error) {
        console.log(`⚠️ Error calculating value for transaction ${tx.hash}:`, error)
        skippedCount++
      }
    }
    
    console.log(`📊 Processed ${processedCount} transactions, Skipped ${skippedCount}, Total historical trading value: $${totalTradingValue.toFixed(2)}`)
    return totalTradingValue
  }

  private static async getHistoricalTokenPrice(symbol: string, date: Date): Promise<number> {
    try {
      // Try DefiLlama historical price first (most accurate)
      const defiLlamaPrice = await this.getHistoricalPriceFromDefiLlama(symbol, date)
      if (defiLlamaPrice > 0) {
        console.log(`✅ DefiLlama historical price for ${symbol} at ${date.toISOString().split('T')[0]}: $${defiLlamaPrice}`)
        return defiLlamaPrice
      }

      // Fallback to current price with historical adjustment
      const currentPrice = await this.getTokenPrice(symbol)
      
      // Apply a rough historical adjustment based on known market trends
      // const daysSince = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      // Simple historical adjustment factors (very rough approximation)
      const historicalFactors: { [key: string]: number } = {
        'ETH': 0.3, // ETH was much cheaper in 2021
        'WETH': 0.3,
        'USDC': 1.0, // Stablecoin
        'USDT': 1.0, // Stablecoin
        'ILV': 0.5, // ILV was around $50-100 in 2021
        'ENS': 0.2, // ENS was much cheaper when launched
        'SOS': 0.1, // SOS had higher value initially
        'FTM': 0.4, // FTM was cheaper in 2021
        'PAID': 0.3, // PAID was more expensive initially
        'SLP': 0.5, // SLP was more valuable in 2021
        'LINK': 0.6, // LINK was cheaper in 2021
        // BSC tokens
        'BNB': 0.4, // BNB was cheaper in 2021
        'BUSD': 1.0, // Stablecoin
        'CAKE': 0.3, // CAKE was more expensive in 2021
        'HELENA': 0.1, // Most BSC tokens were more valuable initially
        'TITANO': 0.1,
        'SAFUU': 0.1,
        'ARCA': 0.1,
        'IGO': 0.1,
        'QBIT': 0.1,
        // Avalanche tokens
        'AVAX': 0.4, // AVAX was cheaper in 2021
        'TIME': 0.2, // TIME was more expensive initially
        'MEMO': 0.2,
        'WETH.E': 0.3,
        'ANYETH': 0.3,
      }
      
      const factor = historicalFactors[symbol.toUpperCase()] || 0.5
      const adjustedPrice = currentPrice * factor
      console.log(`🔄 Using adjusted historical price for ${symbol} at ${date.toISOString().split('T')[0]}: $${adjustedPrice} (current: $${currentPrice} × factor: ${factor})`)
      return adjustedPrice
    } catch (error) {
      console.log(`⚠️ Error getting historical price for ${symbol}:`, error)
      return 0
    }
  }

  private static async getHistoricalPriceFromDefiLlama(symbol: string, date: Date): Promise<number> {
    try {
      // DefiLlama historical price endpoint
      // Note: This requires the token address, not symbol
      // For now, we'll try to find the token address first
      
      // Map common symbols to known addresses
      const symbolToAddress: { [key: string]: string } = {
        'ETH': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'USDC': '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c',
        'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
        'BNB': '0xbb4cdb9cbd36b01bd1cbaef2af088b3c8c8c8c8c8c',
        'AVAX': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'MATIC': '0x0000000000000000000000000000000000001010'
      }

      const tokenAddress = symbolToAddress[symbol.toUpperCase()]
      if (!tokenAddress) {
        console.log(`⚠️ No DefiLlama address mapping for ${symbol}`)
        return 0
      }

      const timestamp = Math.floor(date.getTime() / 1000)
      const response = await fetch(`https://api.llama.fi/v2/historicalPrice/${tokenAddress}?timestamp=${timestamp}`)
      const data = await response.json() as any
      
      if (data && data.price) {
        return data.price
      }
      
      return 0
    } catch (error) {
      console.log(`❌ DefiLlama historical price error for ${symbol}:`, error)
      return 0
    }
  }

  private static tokenPriceCache: Map<string, any> = new Map()
  private static tokenPricesLoaded = false

  /**
   * Load token prices from Azure storage (collected data)
   */
  private static async loadTokenPricesFromAzure(): Promise<void> {
    if (this.tokenPricesLoaded) return

    try {
      // Import TokenDataCollector to read from Azure
      const { TokenDataCollector } = await import('./TokenDataCollector')
      const collector = new TokenDataCollector()
      
      // Read the latest token values from Azure
      const fileSystemClient = collector['dataLakeServiceClient'].getFileSystemClient('token-data')
      const files = fileSystemClient.listPaths()
      
      let latestFile = ''
      let latestDate = ''
      
      for await (const file of files) {
        if (file.name && file.name.startsWith('token-values-') && file.name.endsWith('.json')) {
          const dateStr = file.name.replace('token-values-', '').replace('.json', '')
          if (dateStr > latestDate) {
            latestDate = dateStr
            latestFile = file.name
          }
        }
      }
      
      if (latestFile) {
        const fileClient = fileSystemClient.getFileClient(latestFile)
        const downloadResponse = await fileClient.read()
        const data = await collector['streamToString'](downloadResponse.readableStreamBody!)
        const tokenValues = JSON.parse(data)
        
        // Also read tokens to get symbol mapping
        const tokensFile = fileSystemClient.getFileClient('tokens.json')
        const tokensResponse = await tokensFile.read()
        const tokensData = await collector['streamToString'](tokensResponse.readableStreamBody!)
        const tokens = JSON.parse(tokensData)
        
        // Create a map of tokenId to symbol
        const tokenIdToSymbol = new Map()
        tokens.forEach((token: any) => {
          tokenIdToSymbol.set(token.id, token.symbol)
        })
        
        // Load the latest prices into cache
        tokenValues.forEach((tokenValue: any) => {
          const symbol = tokenIdToSymbol.get(tokenValue.tokenId)
          if (symbol) {
            // Extract blockchain from tokenId (format: symbol-blockchain or address-blockchain)
            const tokenIdParts = tokenValue.tokenId.split('-')
            const blockchain = tokenIdParts.length > 1 ? tokenIdParts[tokenIdParts.length - 1] : 'ethereum'
            
            const key = `${symbol.toLowerCase()}-${blockchain}`
            this.tokenPriceCache.set(key, {
              symbol: symbol,
              price: tokenValue.price,
              high: tokenValue.high,
              low: tokenValue.low,
              volume: tokenValue.volume,
              marketCap: tokenValue.marketCap,
              source: 'azure-collected'
            })
          }
        })
        
        console.log(`📊 Loaded ${this.tokenPriceCache.size} token prices from Azure storage (${latestFile})`)
        this.tokenPricesLoaded = true
      } else {
        console.log('⚠️ No token values found in Azure storage, falling back to local cache')
        this.loadTokenPricesFromLocal()
      }
    } catch (error) {
      console.error('❌ Error loading token prices from Azure:', error)
      console.log('🔄 Falling back to local cache...')
      this.loadTokenPricesFromLocal()
    }
  }

  /**
   * Load token prices from the collected data file (fallback)
   */
  private static loadTokenPricesFromLocal(): void {
    try {
      const pricesFile = path.join(__dirname, '../../results/token-prices-local.json')
      if (fs.existsSync(pricesFile)) {
        const priceData = JSON.parse(fs.readFileSync(pricesFile, 'utf8'))
        priceData.forEach((token: any) => {
          const key = `${token.symbol.toLowerCase()}-${token.blockchain}`
          this.tokenPriceCache.set(key, token)
        })
        console.log(`📊 Loaded ${this.tokenPriceCache.size} token prices from local cache`)
        this.tokenPricesLoaded = true
      }
    } catch (error) {
      console.error('❌ Error loading token prices from local cache:', error)
    }
  }

  /**
   * Load token prices (tries Azure first, then local fallback)
   */
  private static async loadTokenPrices(): Promise<void> {
    if (this.tokenPricesLoaded) return
    await this.loadTokenPricesFromAzure()
  }

  /**
   * Get token price from collected data cache
   */
  private static async getTokenPriceFromCache(symbol: string, blockchain: string): Promise<any | null> {
    await this.loadTokenPrices()
    const key = `${symbol.toLowerCase()}-${blockchain}`
    return this.tokenPriceCache.get(key) || null
  }

  private static async getTokenPriceFromAzureStorage(symbol: string, blockchain: string): Promise<any | null> {
    try {
      // Import TokenDataCollector to read from Azure
      const { TokenDataCollector } = await import('./TokenDataCollector')
      const collector = new TokenDataCollector()
      
      // Read the latest token values from Azure
      const fileSystemClient = collector['dataLakeServiceClient'].getFileSystemClient('token-data')
      
      // Find the latest token values file
      const files = fileSystemClient.listPaths()
      let latestFile = ''
      let latestDate = ''
      
      for await (const file of files) {
        if (file.name && file.name.startsWith('token-values-') && file.name.endsWith('.json')) {
          const dateStr = file.name.replace('token-values-', '').replace('.json', '')
          if (dateStr > latestDate) {
            latestDate = dateStr
            latestFile = file.name
          }
        }
      }
      
      if (!latestFile) {
        return null
      }
      
      // Read token values
      const valuesFile = fileSystemClient.getFileClient(latestFile)
      const valuesResponse = await valuesFile.read()
      const valuesData = await collector['streamToString'](valuesResponse.readableStreamBody!)
      const tokenValues = JSON.parse(valuesData)
      
      // Read tokens to get symbol mapping
      const tokensFile = fileSystemClient.getFileClient('tokens.json')
      const tokensResponse = await tokensFile.read()
      const tokensData = await collector['streamToString'](tokensResponse.readableStreamBody!)
      const tokens = JSON.parse(tokensData)
      
      // Find the token by symbol and blockchain
      const token = tokens.find((t: any) => 
        t.symbol.toLowerCase() === symbol.toLowerCase() && 
        t.blockchain === blockchain
      )
      
      if (!token) {
        return null
      }
      
      // Find the latest price for this token
      const tokenValue = tokenValues.find((tv: any) => tv.tokenId === token.id)
      
      if (tokenValue && tokenValue.price > 0) {
        return {
          symbol: symbol,
          price: tokenValue.price,
          high: tokenValue.high,
          low: tokenValue.low,
          volume: tokenValue.volume,
          marketCap: tokenValue.marketCap,
          source: 'azure-storage'
        }
      }
      
      return null
    } catch (error) {
      console.log(`⚠️ Error getting ${symbol} price from Azure storage:`, error)
      return null
    }
  }

  /**
   * Store wallet analysis data in ADLS Gen 2
   */
  private static async addTokenToCollection(symbol: string, blockchain: string, tokenAddress?: string, tokenName?: string): Promise<void> {
    try {
      // Check if token already exists in our collection
      const existingToken = await this.getTokenPriceFromCache(symbol, blockchain)
      if (existingToken) {
        return // Token already exists
      }
      
      console.log(`🆕 Adding new token to collection: ${symbol} (${blockchain})`)
      
      // Import TokenDataCollector to actually store tokens
      const { TokenDataCollector } = await import('./TokenDataCollector')
      const collector = new TokenDataCollector()
      
      // Create token object with proper ID format (address-blockchain)
      const token = {
        id: tokenAddress ? `${tokenAddress}-${blockchain}` : `${symbol.toLowerCase()}-${blockchain}`,
        name: tokenName || symbol,
        symbol: symbol,
        address: tokenAddress,
        blockchain: blockchain,
        createdAt: new Date()
      }
      
      // Read existing tokens
      let existingTokens: any[] = []
      try {
        existingTokens = await collector.readTokens()
      } catch (error) {
        console.log(`⚠️ No existing tokens file found, creating new one`)
      }
      
      // Check if token already exists
      const tokenExists = existingTokens.some(t => t.id === token.id)
      if (tokenExists) {
        console.log(`✅ Token ${symbol} already exists in collection`)
        return
      }
      
      // Add new token to collection
      existingTokens.push(token)
      
      // Store updated tokens list
      await collector.storeTokens(existingTokens)
      
      console.log(`📝 New token discovered and stored: ${symbol} on ${blockchain} (${tokenAddress || 'no address'})`)
      
      // Also collect current price for this token
      try {
        const priceData = await collector.getAccurateTokenPrice(symbol)
        if (priceData) {
          const tokenValue = {
            id: `${token.id}-${new Date().toISOString().split('T')[0]}`,
            tokenId: token.id,
            price: priceData.price,
            high: priceData.high,
            low: priceData.low,
            volume: priceData.volume,
            marketCap: priceData.marketCap || 0,
            date: new Date(),
            source: 'wallet-discovery'
          }
          
          // Read existing token values
          let existingValues: any[] = []
          try {
            const fileSystemClient = collector['dataLakeServiceClient'].getFileSystemClient('token-data')
            const valuesFile = fileSystemClient.getFileClient('token-values-current.json')
            const response = await valuesFile.read()
            const data = await collector['streamToString'](response.readableStreamBody!)
            existingValues = JSON.parse(data)
          } catch (error) {
            console.log(`⚠️ No existing token values file found, creating new one`)
          }
          
          // Add new token value
          existingValues.push(tokenValue)
          
          // Store updated token values
          await collector.storeTokenValues(existingValues)
          
          console.log(`💰 Collected initial price for ${symbol}: $${priceData.price}`)
        }
      } catch (priceError) {
        console.log(`⚠️ Could not collect initial price for ${symbol}:`, priceError)
      }
      
    } catch (error) {
      console.log(`⚠️ Error adding token to collection:`, error)
    }
  }

  private static async storeWalletAnalysis(address: string, analysis: MultiBlockchainAnalysis): Promise<void> {
    const storage = new WalletAnalysisStorage()
    
    // Convert MultiBlockchainAnalysis to WalletAnalysisData format
    const analysisData: WalletAnalysisData = {
      walletId: address,
      analysisDate: new Date().toISOString(),
      blockchains: {},
      totalValue: analysis.totalValue,
      totalTransactions: analysis.totalTransactions,
      lastUpdated: analysis.lastUpdated
    }
    
    // Convert each blockchain's data
    for (const [blockchain, blockchainData] of Object.entries(analysis.blockchains)) {
      // Convert transactions to WalletTransaction format
      // Save ALL transactions, not just recent 10
      const allTransactions = blockchainData.allTransactions || blockchainData.recentTransactions || []
      const transactions: WalletTransaction[] = allTransactions.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: '0', // Not available in current format
        timestamp: tx.timestamp,
        gasPrice: '0', // Not available in current format
        gasUsed: '0', // Not available in current format
        blockchain: blockchain,
        // Enhanced token information
        currency: tx.currency,
        tokenSymbol: tx.tokenSymbol,
        tokenName: tx.tokenName,
        tokenAddress: tx.tokenAddress,
        tokenValue: tx.tokenValue,
        tokenDecimals: tx.tokenDecimals,
        isTokenTransfer: tx.isTokenTransfer
      }))
      
      analysisData.blockchains[blockchain] = {
        balance: {
          value: blockchainData.balance.native,
          usdValue: blockchainData.balance.usdValue,
          currency: blockchain === 'ethereum' ? 'ETH' : blockchain === 'bsc' ? 'BNB' : blockchain === 'polygon' ? 'MATIC' : blockchain === 'avalanche' ? 'AVAX' : 'UNKNOWN'
        },
        tokens: blockchainData.tokens.map(token => ({
          symbol: token.symbol,
          name: token.symbol, // Using symbol as name for now
          balance: token.balance,
          usdValue: token.usdValue,
          contractAddress: token.tokenAddress || ''
        })),
        transactions: transactions,
        totalTransactionCount: blockchainData.transactionCount,
        tokenTransactionCount: blockchainData.tokenTransactionCount,
        historicalTradingValue: blockchainData.totalLifetimeValue
      }
    }
    
    await storage.storeWalletAnalysis(analysisData)
  }
}