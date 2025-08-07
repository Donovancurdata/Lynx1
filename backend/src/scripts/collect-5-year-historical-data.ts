import { TokenDataCollector } from '../services/TokenDataCollector'
import { WalletAnalysisStorage } from '../services/WalletAnalysisStorage'
import dotenv from 'dotenv'

dotenv.config()

async function collect5YearHistoricalData() {
  console.log('📊 Collecting Historical Data from Launch to Present...')
  console.log(`🕐 Started at: ${new Date().toISOString()}`)
  
  // Error tracking
  const errors: string[] = []
  const skippedTokens: string[] = []
  const successfulTokens: string[] = []
  const failedTokens: { token: string, error: string }[] = []
  
  try {
    const collector = new TokenDataCollector()
    const storage = new WalletAnalysisStorage()
    
    // Step 1: Read existing tokens from storage
    console.log('\n📖 Step 1: Reading existing tokens...')
    const tokens = await collector.readTokens()
    console.log(`✅ Found ${tokens.length} tokens to process`)
    
    if (tokens.length === 0) {
      console.log('⚠️ No tokens found. Please run token collection first.')
      console.log('\n========================================')
      console.log('❌ FINAL RESULT: NO TOKENS TO PROCESS')
      console.log('========================================')
      return
    }
    
    // Step 2: Sort tokens by priority (major coins first)
    const priorityOrder = ['BTC', 'ETH', 'WETH', 'SOL', 'USDC', 'USDT', 'BNB', 'AVAX', 'MATIC', 'LINK', 'UNI', 'AAVE']
    const sortedTokens = tokens.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.symbol.toUpperCase())
      const bPriority = priorityOrder.indexOf(b.symbol.toUpperCase())
      
      // Major tokens come first (-1 means not found, so give it low priority)
      if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority
      if (aPriority !== -1) return -1  // a is major, b is not
      if (bPriority !== -1) return 1   // b is major, a is not
      return 0 // both are not major, keep original order
    })

    console.log('\n🎯 Processing order (major tokens first):')
    sortedTokens.slice(0, 10).forEach((token, i) => {
      const isMajor = priorityOrder.includes(token.symbol.toUpperCase()) ? '🌟' : '  '
      console.log(`   ${i + 1}. ${isMajor} ${token.symbol} (${token.name})`)
    })
    if (sortedTokens.length > 10) {
      console.log(`   ... and ${sortedTokens.length - 10} more tokens`)
    }
    
    // Step 3: Process each token with proper launch dates
    console.log('\n🔄 Step 3: Processing tokens for historical data...')
    
    let processedTokens = 0
    let totalHistoricalRecords = 0
    
    for (let i = 0; i < sortedTokens.length; i++) {
      const token = sortedTokens[i]
      if (!token) continue
      
      try {
        const isMajor = priorityOrder.includes(token.symbol.toUpperCase()) ? '🌟' : '  '
        console.log(`\n📈 [${i + 1}/${sortedTokens.length}] ${isMajor} Processing ${token.symbol} (${token.name})...`)

        // Get token launch date
        const launchDate = getTokenLaunchDate(token.symbol)
        const endDate = new Date()
        
        if (!launchDate) {
          console.log(`⚠️ Skipping ${token.symbol} - unknown launch date`)
          skippedTokens.push(`${token.symbol} (${token.blockchain}) - unknown launch date`)
          continue
        }

        const daysSinceLaunch = Math.ceil((endDate.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
        console.log(`📅 Launch: ${launchDate.toISOString().split('T')[0]} (${daysSinceLaunch} days ago)`)
        
        // Get current price first to validate the token
        const currentPrice = await collector.getAccurateTokenPrice(token.symbol, token.blockchain)
        if (!currentPrice || currentPrice.price <= 0) {
          console.log(`⚠️ Skipping ${token.symbol} - no current price available`)
          skippedTokens.push(`${token.symbol} (${token.blockchain})`)
          continue
        }
        
        console.log(`💰 Current price: $${currentPrice.price}`)
        
        // Collect historical data for this token
        const historicalRecords = await collectTokenHistoricalData(
          collector,
          token,
          launchDate,
          endDate
        )
        
        if (historicalRecords.length > 0) {
          // Store historical data
          await collector.storeHistoricalData(token.symbol, historicalRecords)
          console.log(`✅ Stored ${historicalRecords.length} historical records for ${token.symbol}`)
          totalHistoricalRecords += historicalRecords.length
          successfulTokens.push(`${token.symbol} (${historicalRecords.length} records)`)
        } else {
          console.log(`⚠️ No historical data collected for ${token.symbol}`)
          skippedTokens.push(`${token.symbol} (${token.blockchain}) - no historical data`)
        }
        
        processedTokens++
        
        // Rate limiting between tokens (longer for major tokens to ensure success)
        const delay_ms = priorityOrder.includes(token.symbol.toUpperCase()) ? 1000 : 500
        await delay(delay_ms)
        
        // Progress update every 5 tokens
        if ((i + 1) % 5 === 0) {
          console.log(`\n📊 Progress: ${i + 1}/${sortedTokens.length} tokens processed (${Math.round(((i + 1) / sortedTokens.length) * 100)}%)`)
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`❌ Error processing ${token.symbol}:`, errorMsg)
        failedTokens.push({ token: `${token.symbol} (${token.blockchain})`, error: errorMsg })
        errors.push(`${token.symbol}: ${errorMsg}`)
        // Continue with next token
      }
    }
    
    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 HISTORICAL DATA COLLECTION COMPLETED')
    console.log('='.repeat(60))
    console.log(`🕐 Completed at: ${new Date().toISOString()}`)
    console.log(`📊 Summary:`)
    console.log(`   • Total tokens found: ${tokens.length}`)
    console.log(`   • Tokens processed: ${processedTokens}`)
    console.log(`   • Successful tokens: ${successfulTokens.length}`)
    console.log(`   • Skipped tokens: ${skippedTokens.length}`)
    console.log(`   • Failed tokens: ${failedTokens.length}`)
    console.log(`   • Total historical records stored: ${totalHistoricalRecords}`)
    console.log(`   • Date range: From each token's launch date to present`)
    console.log(`   • Storage location: historical-data file system in ADLS Gen 2`)
    
    if (successfulTokens.length > 0) {
      console.log('\n✅ SUCCESSFUL TOKENS:')
      successfulTokens.forEach(token => console.log(`   • ${token}`))
    }
    
    if (skippedTokens.length > 0) {
      console.log('\n⚠️ SKIPPED TOKENS:')
      skippedTokens.forEach(token => console.log(`   • ${token}`))
    }
    
    if (failedTokens.length > 0) {
      console.log('\n❌ FAILED TOKENS:')
      failedTokens.forEach(item => console.log(`   • ${item.token}: ${item.error}`))
    }
    
    if (errors.length > 0) {
      console.log('\n📋 ALL ERRORS (for debugging):')
      errors.forEach((error, index) => console.log(`   ${index + 1}. ${error}`))
    }
    
    console.log('\n' + '='.repeat(60))
    console.log(`🎯 FINAL STATUS: ${successfulTokens.length > 0 ? 'SUCCESS' : 'FAILED'}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('\n' + '='.repeat(60))
    console.error('❌ CRITICAL ERROR DURING HISTORICAL DATA COLLECTION')
    console.error('='.repeat(60))
    console.error(`🕐 Failed at: ${new Date().toISOString()}`)
    console.error(`❌ Error: ${errorMsg}`)
    console.error(`🔍 Error stack:`, error)
    console.error('='.repeat(60))
  }
}

async function collectTokenHistoricalData(
  collector: TokenDataCollector,
  token: any,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const historicalRecords = []
  const currentDate = new Date(startDate)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  let processedDays = 0
  let successfulDays = 0
  
  console.log(`    📅 Processing ${totalDays} days of historical data for ${token.symbol}...`)
  
  // Process each day
  while (currentDate <= endDate) {
    try {
      const dateStr = currentDate.toISOString().split('T')[0]
      
      // Get historical price for this date
      const historicalPrice = await getHistoricalPriceForDate(
        collector,
        token.symbol,
        token.blockchain,
        currentDate
      )
      
      if (historicalPrice && historicalPrice.price > 0) {
        historicalRecords.push({
          symbol: token.symbol,
          blockchain: token.blockchain,
          date: dateStr,
          price: historicalPrice.price,
          high: historicalPrice.high || historicalPrice.price,
          low: historicalPrice.low || historicalPrice.price,
          volume: historicalPrice.volume || 0,
          marketCap: historicalPrice.marketCap || 0,
          source: historicalPrice.source || 'historical'
        })
        successfulDays++
      }
      
      processedDays++
      
      // Progress update every 100 days
      if (processedDays % 100 === 0) {
        console.log(`    📊 ${token.symbol}: ${processedDays}/${totalDays} days processed (${successfulDays} successful)`)
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
      
      // Rate limiting - be conservative for historical data
      await delay(500) // 0.5 second between requests
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.log(`    ⚠️ Error getting historical data for ${token.symbol} on ${currentDate.toISOString().split('T')[0]}: ${errorMsg}`)
      processedDays++
      currentDate.setDate(currentDate.getDate() + 1)
      continue
    }
  }
  
  console.log(`    ✅ ${token.symbol}: Completed ${processedDays} days, ${successfulDays} successful records`)
  return historicalRecords
}

async function getHistoricalPriceForDate(
  collector: TokenDataCollector,
  symbol: string,
  blockchain: string,
  date: Date
): Promise<any> {
  try {
    // Try multiple sources for historical data
    const timestamp = Math.floor(date.getTime() / 1000)
    const dateStr = date.toISOString().split('T')[0]
    
    // Skip weekends for older data (markets were closed)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isOlderThan1Year = Date.now() - date.getTime() > 365 * 24 * 60 * 60 * 1000
    
    if (isWeekend && isOlderThan1Year) {
      console.log(`    ⏭️ Skipping weekend ${dateStr} for ${symbol}`)
      return null
    }
    
    // 1. Try CoinGecko historical endpoint
    try {
      const coinGeckoPrice = await getCoinGeckoHistoricalPrice(symbol, timestamp)
      if (coinGeckoPrice && coinGeckoPrice.price > 0) {
        return { ...coinGeckoPrice, source: 'coingecko-historical' }
      }
    } catch (error) {
      // Continue to next source
    }
    
    // 2. Try DefiLlama historical endpoint
    try {
      const defiLlamaPrice = await getDefiLlamaHistoricalPrice(symbol, timestamp)
      if (defiLlamaPrice && defiLlamaPrice.price > 0) {
        return { ...defiLlamaPrice, source: 'defillama-historical' }
      }
    } catch (error) {
      // Continue to next source
    }
    
    // 3. Try CoinDesk historical endpoint
    try {
      const coinDeskPrice = await getCoinDeskHistoricalPrice(symbol, timestamp)
      if (coinDeskPrice && coinDeskPrice.price > 0) {
        return { ...coinDeskPrice, source: 'coindesk-historical' }
      }
    } catch (error) {
      // Continue to next source
    }
    
    // 4. For tokens without historical data, use adjusted price based on known patterns
    console.log(`    ⚠️ No historical API data for ${symbol} on ${dateStr}, using adjusted estimate`)
    
    // Get a reasonable historical estimate (do NOT call current price APIs repeatedly)
    const adjustedPrice = getHistoricalEstimate(symbol, date)
    if (adjustedPrice > 0) {
      return {
        price: adjustedPrice,
        high: adjustedPrice * 1.1,
        low: adjustedPrice * 0.9,
        volume: 0,
        marketCap: 0,
        source: 'estimated'
      }
    }
    
    return null
    
  } catch (error) {
    console.log(`    ❌ Error getting historical price for ${symbol}: ${error}`)
    return null
  }
}

async function getCoinGeckoHistoricalPrice(symbol: string, timestamp: number): Promise<any> {
  try {
    // Map common symbols to CoinGecko IDs
    const symbolToId: { [key: string]: string } = {
      'ETH': 'ethereum',
      'WETH': 'ethereum', // Use ethereum for WETH
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'AAVE': 'aave',
      'COMP': 'compound-governance-token',
      'MKR': 'maker',
      'SUSHI': 'sushi',
      'CRV': 'curve-dao-token',
      'YFI': 'yearn-finance',
      'BAL': 'balancer',
      'SNX': 'havven',
      'REN': 'republic-protocol',
      'KNC': 'kyber-network-crystal',
      'BAND': 'band-protocol',
      'ZRX': '0x',
      'BAT': 'basic-attention-token',
      'REP': 'augur',
      'ZEC': 'zcash',
      'XMR': 'monero',
      'DASH': 'dash',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'BTC': 'bitcoin',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'SOL': 'solana',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'CAKE': 'pancakeswap-token',
      'ILV': 'illuvium',
      'SLP': 'smooth-love-potion',
      'PAID': 'paid-network',
      'ENS': 'ethereum-name-service',
      'FTM': 'fantom',
      'SOS': 'opendao',
      'IMX': 'immutable-x',
      'TIME': 'wonderland',
      'MEMO': 'wonderland',
      'WMEMO': 'wonderland',
      'WETH.E': 'ethereum',
      'ANYETH': 'ethereum',
      'BSW': 'biswap',
      'LUNA': 'terra-luna-2'
    }
    
    const coinId = symbolToId[symbol.toUpperCase()]
    if (!coinId) {
      throw new Error(`No CoinGecko ID mapping for ${symbol}`)
    }
    
    // Format date to DD-MM-YYYY format that CoinGecko expects
    const date = new Date(timestamp * 1000)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const dateStr = `${day}-${month}-${year}`
    
    console.log(`    🔍 CoinGecko: Fetching ${symbol} price for ${dateStr}`)
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${dateStr}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }
    
    const data = await response.json() as any
    
    if (data.market_data && data.market_data.current_price && data.market_data.current_price.usd) {
      const price = data.market_data.current_price.usd
      const marketCap = data.market_data.market_cap ? data.market_data.market_cap.usd : 0
      const volume = data.market_data.total_volume ? data.market_data.total_volume.usd : 0
      const high = data.market_data.high_24h ? data.market_data.high_24h.usd : price * 1.05
      const low = data.market_data.low_24h ? data.market_data.low_24h.usd : price * 0.95
      
      console.log(`    ✅ CoinGecko Historical: ${symbol} = $${price} on ${dateStr}`)
      
      return {
        price,
        high,
        low,
        volume,
        marketCap
      }
    }
    
    throw new Error('No price data in response')
    
  } catch (error) {
    console.log(`    ❌ CoinGecko Historical failed for ${symbol}: ${error}`)
    throw error
  }
}

async function getDefiLlamaHistoricalPrice(symbol: string, timestamp: number): Promise<any> {
  try {
    // Only use DefiLlama for major tokens with known contract addresses
    const symbolToAddress: { [key: string]: string } = {
      'ETH': 'ethereum:0x0000000000000000000000000000000000000000',
      'WETH': 'ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      'USDC': 'ethereum:0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c',
      'USDT': 'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7',
      'LINK': 'ethereum:0x514910771af9ca656af840dff83e8264ecf986ca',
      'UNI': 'ethereum:0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      'AAVE': 'ethereum:0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      'COMP': 'ethereum:0xc00e94cb662c3520282e6f5717214004a7f26888',
      'MKR': 'ethereum:0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      'SUSHI': 'ethereum:0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      'CRV': 'ethereum:0xd533a949740bb3306d119cc777fa900ba034cd52',
      'YFI': 'ethereum:0x0bc529c00c6401aef6d220be8c6ea1667f6ad9ec',
      'BAL': 'ethereum:0xba100000625a3754423978a60c9317c58a424e3d',
      'SNX': 'ethereum:0xc011a73ee8576fb46f5e1c5751ca3b9fe0f2a6f6',
      'ZRX': 'ethereum:0xe41d2489571d322189246dafa5ebde1f4699f498',
      'BAT': 'ethereum:0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      'ILV': 'ethereum:0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
      'SLP': 'ethereum:0x070a08beef8d36734dd67a491202ff35a6a16d97',
      'PAID': 'ethereum:0x1614f18fc94f47967a3fbe5ffcb46f6183746652',
      'ENS': 'ethereum:0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
      'SOS': 'ethereum:0x3b484b8259a095795f2bb4e8872ca750317ce0de',
      'IMX': 'ethereum:0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
      'TIME': 'avalanche:0xb54f16fb19478766a268f172c9480f8da1a7c9c3',
      'WMEMO': 'avalanche:0x0da67235dd5787d67955420c84ca1cecd4e5bb3b'
    }
    
    const tokenAddress = symbolToAddress[symbol.toUpperCase()]
    if (!tokenAddress) {
      throw new Error(`No DefiLlama address mapping for ${symbol}`)
    }
    
    const date = new Date(timestamp * 1000)
    const dateStr = date.toISOString().split('T')[0]
    
    console.log(`    🔍 DefiLlama: Fetching ${symbol} price for ${dateStr}`)
    
    const response = await fetch(
      `https://coins.llama.fi/prices/historical/${timestamp}/${tokenAddress}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`)
    }
    
    const data = await response.json() as any
    
    if (data && data.coins && data.coins[tokenAddress] && data.coins[tokenAddress].price) {
      const price = data.coins[tokenAddress].price
      
      console.log(`    ✅ DefiLlama Historical: ${symbol} = $${price} on ${dateStr}`)
      
      return {
        price,
        high: price * 1.05,
        low: price * 0.95,
        volume: 0,
        marketCap: 0
      }
    }
    
    throw new Error('No price data in response')
    
  } catch (error) {
    console.log(`    ❌ DefiLlama Historical failed for ${symbol}: ${error}`)
    throw error
  }
}

async function getCoinDeskHistoricalPrice(symbol: string, timestamp: number): Promise<any> {
  try {
    // CoinDesk primarily focuses on Bitcoin and major cryptocurrencies
    const supportedSymbols: { [key: string]: string } = {
      'BTC': 'BTC',
      'ETH': 'ETH',
      'WETH': 'ETH', // Use ETH for wrapped ETH
      'USDC': 'USDC',
      'USDT': 'USDT',
      'BNB': 'BNB',
      'ADA': 'ADA',
      'DOT': 'DOT',
      'SOL': 'SOL',
      'AVAX': 'AVAX',
      'MATIC': 'MATIC',
      'LINK': 'LINK',
      'UNI': 'UNI',
      'LTC': 'LTC',
      'BCH': 'BCH',
      'XRP': 'XRP',
      'DOGE': 'DOGE'
    }
    
    const coinDeskSymbol = supportedSymbols[symbol.toUpperCase()]
    if (!coinDeskSymbol) {
      throw new Error(`CoinDesk does not support ${symbol}`)
    }
    
    const date = new Date(timestamp * 1000)
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    console.log(`    🔍 CoinDesk: Fetching ${symbol} price for ${dateStr}`)
    
    // CoinDesk API endpoint for historical data
    const response = await fetch(
      `https://api.coindesk.com/v2/price/values/${coinDeskSymbol}?start_date=${dateStr}&end_date=${dateStr}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer 9cf21b3b475cb7be383cc5ff83451113ddcaa9b1aa79b76b7562a1a5cb8440b2`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`CoinDesk API error: ${response.status}`)
    }
    
    const data = await response.json() as any
    
    // CoinDesk API response structure may vary, adjust based on actual response
    if (data && data.data && data.data.length > 0) {
      const priceData = data.data[0]
      const price = priceData.value || priceData.price
      
      if (price && price > 0) {
        console.log(`    ✅ CoinDesk Historical: ${symbol} = $${price} on ${dateStr}`)
        
        return {
          price,
          high: price * 1.05,
          low: price * 0.95,
          volume: 0,
          marketCap: 0
        }
      }
    }
    
    throw new Error('No price data in CoinDesk response')
    
  } catch (error) {
    console.log(`    ❌ CoinDesk Historical failed for ${symbol}: ${error}`)
    throw error
  }
}

function getTokenLaunchDate(symbol: string): Date | null {
  // Token launch dates (approximate)
  const launchDates: { [key: string]: string } = {
    'BTC': '2009-01-03',
    'ETH': '2015-07-30',
    'WETH': '2015-07-30', // Same as ETH
    'USDC': '2018-09-26',
    'USDT': '2014-10-06',
    'BNB': '2017-07-08',
    'SOL': '2020-03-16',
    'AVAX': '2020-09-22',
    'MATIC': '2019-04-29',
    'LINK': '2017-09-20',
    'UNI': '2020-09-17',
    'AAVE': '2017-11-27',
    'COMP': '2020-06-15',
    'MKR': '2017-12-27',
    'SUSHI': '2020-08-30',
    'CRV': '2020-08-13',
    'YFI': '2020-07-17',
    'BAL': '2020-06-23',
    'SNX': '2018-02-28',
    'ZRX': '2017-08-15',
    'BAT': '2017-05-31',
    'LTC': '2011-10-07',
    'BCH': '2017-08-01',
    'ADA': '2017-09-29',
    'DOT': '2020-08-19',
    'XRP': '2012-06-02',
    'DOGE': '2013-12-06',
    'SHIB': '2020-08-01',
    'CAKE': '2020-09-29',
    'ILV': '2021-03-30',
    'SLP': '2021-01-27',
    'PAID': '2021-01-14',
    'ENS': '2021-11-08',
    'SOS': '2021-12-24',
    'IMX': '2021-11-05',
    'TIME': '2021-10-03',
    'WMEMO': '2021-10-03',
    'BSW': '2021-07-06',
    'WETH.E': '2020-09-22', // Avalanche launch
    'ANYETH': '2020-07-01',
    'MNEAV': '2020-09-22'
  }
  
  const dateStr = launchDates[symbol.toUpperCase()]
  if (!dateStr) {
    return null
  }
  
  return new Date(dateStr + 'T00:00:00.000Z')
}

function getHistoricalEstimate(symbol: string, date: Date): number {
  // Historical price estimates based on known patterns and launch dates
  const currentYear = new Date().getFullYear()
  const targetYear = date.getFullYear()
  const yearsBack = currentYear - targetYear
  
  // Base estimates for known tokens (approximate historical values)
  const baseEstimates: { [key: string]: { current: number, launch: number, launchYear: number } } = {
    'ETH': { current: 3500, launch: 0.30, launchYear: 2015 },
    'WETH': { current: 3500, launch: 0.30, launchYear: 2015 },
    'BTC': { current: 70000, launch: 0.0008, launchYear: 2009 },
    'BNB': { current: 600, launch: 0.10, launchYear: 2017 },
    'AVAX': { current: 40, launch: 0.50, launchYear: 2020 },
    'MATIC': { current: 1.50, launch: 0.0017, launchYear: 2019 },
    'LINK': { current: 25, launch: 0.11, launchYear: 2017 },
    'UNI': { current: 12, launch: 1.0, launchYear: 2020 },
    'AAVE': { current: 180, launch: 0.009, launchYear: 2017 },
    'COMP': { current: 80, launch: 61.0, launchYear: 2020 },
    'MKR': { current: 2500, launch: 30.0, launchYear: 2017 },
    'SUSHI': { current: 2.5, launch: 1.0, launchYear: 2020 },
    'CRV': { current: 0.8, launch: 1.2, launchYear: 2020 },
    'YFI': { current: 8000, launch: 32.0, launchYear: 2020 },
    'BAL': { current: 5, launch: 15.0, launchYear: 2020 },
    'SNX': { current: 4, launch: 0.036, launchYear: 2018 },
    'USDC': { current: 1.0, launch: 1.0, launchYear: 2018 },
    'USDT': { current: 1.0, launch: 1.0, launchYear: 2014 },
    'CAKE': { current: 4, launch: 0.20, launchYear: 2020 },
    'ILV': { current: 20, launch: 65.0, launchYear: 2021 },
    'SLP': { current: 0.006, launch: 0.001, launchYear: 2021 },
    'PAID': { current: 0.08, launch: 0.30, launchYear: 2021 },
    'ENS': { current: 30, launch: 10.0, launchYear: 2021 },
    'SOS': { current: 0.000000003, launch: 0.00000001, launchYear: 2021 },
    'IMX': { current: 2.5, launch: 0.50, launchYear: 2021 },
    'TIME': { current: 50, launch: 1000.0, launchYear: 2021 },
    'WMEMO': { current: 3000, launch: 50000.0, launchYear: 2021 },
    'BSW': { current: 0.5, launch: 0.10, launchYear: 2021 }
  }
  
  const tokenData = baseEstimates[symbol.toUpperCase()]
  if (!tokenData) {
    // For unknown tokens, return 0 (skip)
    return 0
  }
  
  // If the date is before the token launch, return 0
  if (targetYear < tokenData.launchYear) {
    return 0
  }
  
  // If it's the launch year, interpolate between launch price and end of year
  if (targetYear === tokenData.launchYear) {
    const dayOfYear = Math.floor((date.getTime() - new Date(targetYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24))
    const progressThroughYear = dayOfYear / 365
    return tokenData.launch + (tokenData.current * 0.1 - tokenData.launch) * progressThroughYear
  }
  
  // For years after launch, use exponential growth model
  const yearsFromLaunch = targetYear - tokenData.launchYear
  const growthRate = Math.pow(tokenData.current / tokenData.launch, 1 / (currentYear - tokenData.launchYear))
  const estimatedPrice = tokenData.launch * Math.pow(growthRate, yearsFromLaunch)
  
  return Math.max(estimatedPrice, 0)
}

function applyHistoricalAdjustment(symbol: string, currentPrice: number, date: Date): number {
  // This function is now deprecated in favor of getHistoricalEstimate
  // Keep it for backward compatibility
  const estimate = getHistoricalEstimate(symbol, date)
  return estimate > 0 ? estimate : currentPrice * 0.1
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Run the historical data collection
collect5YearHistoricalData().catch(console.error) 