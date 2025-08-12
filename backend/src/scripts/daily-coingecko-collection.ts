import { CoinGeckoService } from '../services/CoinGeckoService'
import { TokenDataCollector } from '../services/TokenDataCollector'
import { 
  PRIORITY_TOKENS, 
  getHighPriorityTokenIds, 
  getMediumPriorityTokenIds, 
  getLowPriorityTokenIds,
  PriorityToken 
} from '../config/priority-tokens'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

interface DailyCollectionResult {
  timestamp: string
  coingeckoStatus: boolean
  tokensAnalyzed: number
  marketDataCollected: number
  successRate: number
  topPerformers: any[]
  errors: string[]
}

async function dailyCoinGeckoCollection() {
  console.log('🦎 Starting daily CoinGecko collection...')
  console.log(`📅 Date: ${new Date().toISOString()}`)
  console.log('=' .repeat(80))
  
  try {
    // Initialize services
    const coingeckoService = new CoinGeckoService()
    const tokenCollector = new TokenDataCollector()
    
    const result: DailyCollectionResult = {
      timestamp: new Date().toISOString(),
      coingeckoStatus: false,
      tokensAnalyzed: 0,
      marketDataCollected: 0,
      successRate: 0,
      topPerformers: [],
      errors: []
    }
    
    // Step 1: Check CoinGecko API status
    console.log('\n🔍 Step 1: Checking CoinGecko API status...')
    try {
      const apiStatus = await coingeckoService.checkApiStatus()
      if (!apiStatus) {
        throw new Error('CoinGecko API is not responding')
      }
      result.coingeckoStatus = true
      console.log('✅ CoinGecko API is responding')
    } catch (error) {
      console.error('❌ CoinGecko API check failed:', error)
      result.errors.push(`API Status Check: ${error}`)
      throw error
    }
    
    // Step 2: Read existing tokens from Azure
    console.log('\n📖 Step 2: Reading existing tokens from Azure storage...')
    let existingTokens = []
    try {
      existingTokens = await tokenCollector.readTokens()
      console.log(`✅ Found ${existingTokens.length} existing tokens`)
      result.tokensAnalyzed = existingTokens.length
    } catch (error) {
      console.error('❌ Error reading tokens from Azure:', error)
      result.errors.push(`Azure Read: ${error}`)
      throw error
    }
    
    if (existingTokens.length === 0) {
      console.log('⚠️ No existing tokens found. Please run the CoinGecko coins collection first.')
      return result
    }
    
    // Step 3: Create prioritized list for market data collection
    console.log('\n📋 Step 3: Creating prioritized list for market data collection...')
    
    // Get priority token IDs from our configuration
    const highPriorityIds = getHighPriorityTokenIds()
    const mediumPriorityIds = getMediumPriorityTokenIds()
    const lowPriorityIds = getLowPriorityTokenIds()
    
    console.log(`📊 Priority Token Breakdown:`)
    console.log(`   • High Priority: ${highPriorityIds.length} tokens`)
    console.log(`   • Medium Priority: ${mediumPriorityIds.length} tokens`)
    console.log(`   • Low Priority: ${lowPriorityIds.length} tokens`)
    console.log(`   • Total Priority Tokens: ${PRIORITY_TOKENS.length}`)
    
    // Create prioritized list starting with high priority tokens
    let prioritizedTokenIds: string[] = []
    
    // Add high priority tokens first (always include these)
    prioritizedTokenIds.push(...highPriorityIds)
    
    // Add medium priority tokens if we have room
    if (prioritizedTokenIds.length < 100) {
      prioritizedTokenIds.push(...mediumPriorityIds)
    }
    
    // Add low priority tokens if we still have room (limit total to 100)
    if (prioritizedTokenIds.length < 100) {
      const remainingSlots = 100 - prioritizedTokenIds.length
      prioritizedTokenIds.push(...lowPriorityIds.slice(0, remainingSlots))
    }
    
    // Limit to 100 tokens maximum for daily collection
    prioritizedTokenIds = prioritizedTokenIds.slice(0, 100)
    
    console.log(`📋 Created prioritized list with ${prioritizedTokenIds.length} tokens`)
    console.log(`   • High Priority: ${prioritizedTokenIds.filter(id => highPriorityIds.includes(id)).length}`)
    console.log(`   • Medium Priority: ${prioritizedTokenIds.filter(id => mediumPriorityIds.includes(id)).length}`)
    console.log(`   • Low Priority: ${prioritizedTokenIds.filter(id => lowPriorityIds.includes(id)).length}`)
    
    // Show the tokens we're collecting
    console.log('\n🎯 Priority Tokens for Collection:')
    prioritizedTokenIds.forEach((tokenId, index) => {
      const tokenInfo = PRIORITY_TOKENS.find(t => t.id === tokenId)
      if (tokenInfo) {
        console.log(`   ${index + 1}. ${tokenInfo.symbol} (${tokenInfo.name}) - ${tokenInfo.priority} priority`)
      }
    })
    
    // Step 4: Collect market data for prioritized tokens
    console.log('\n💰 Step 4: Collecting market data for prioritized tokens...')
    let marketData = []
    try {
      marketData = await coingeckoService.getMarketData(prioritizedTokenIds)
      console.log(`✅ Successfully collected market data for ${marketData.length} tokens`)
      result.marketDataCollected = marketData.length
      result.successRate = (marketData.length / prioritizedTokenIds.length) * 100
    } catch (error) {
      console.error('❌ Error collecting market data:', error)
      result.errors.push(`Market Data Collection: ${error}`)
      // Continue with partial data if available
    }
    
    // Step 4.5: Store market data to Azure
    if (marketData.length > 0) {
      console.log('\n💾 Step 4.5: Storing market data to Azure...')
      try {
        // Transform market data to our storage format
        const marketDataToStore = marketData.map(md => ({
          id: md.id,
          symbol: md.symbol,
          name: md.name,
          current_price: md.current_price,
          market_cap: md.market_cap,
          market_cap_rank: md.market_cap_rank,
          total_volume: md.total_volume,
          high_24h: md.high_24h,
          low_24h: md.low_24h,
          price_change_24h: md.price_change_24h,
          price_change_percentage_24h: md.price_change_percentage_24h,
          market_cap_change_24h: md.market_cap_change_24h,
          market_cap_change_percentage_24h: md.market_cap_change_percentage_24h,
          circulating_supply: md.circulating_supply,
          total_supply: md.total_supply,
          max_supply: md.max_supply,
          ath: md.ath,
          ath_change_percentage: md.ath_change_percentage,
          ath_date: md.ath_date,
          atl: md.atl,
          atl_change_percentage: md.atl_change_percentage,
          atl_date: md.atl_date,
          last_updated: md.last_updated,
          collection_timestamp: new Date().toISOString(),
          source: 'coingecko'
        }))
        
        // Store in Azure
        await tokenCollector.storeMarketData(marketDataToStore)
        console.log(`✅ Successfully stored ${marketDataToStore.length} market data records to Azure`)
        
      } catch (error) {
        console.error('❌ Error preparing market data for storage:', error)
        result.errors.push(`Market Data Storage: ${error}`)
      }
    }
    
    // Step 5: Analyze and display results
    console.log('\n📊 Step 5: Analyzing collection results...')
    
    if (marketData.length > 0) {
      // Show top performers by 24h change
      const topPerformers = marketData
        .filter(md => md.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 10)
      
      result.topPerformers = topPerformers
      
      console.log('\n🏆 Top 10 Performers (24h):')
      topPerformers.forEach((token, index) => {
        const priceFormatted = token.current_price.toFixed(6)
        const changeFormatted = token.price_change_percentage_24h.toFixed(2)
        console.log(`   ${index + 1}. ${token.symbol.toUpperCase()} (${token.name})`)
        console.log(`      💰 Price: $${priceFormatted}`)
        console.log(`      📈 24h Change: +${changeFormatted}%`)
        console.log(`      📊 Market Cap: $${(token.market_cap / 1e6).toFixed(2)}M`)
      })
      
      // Show market cap leaders
      const marketCapLeaders = marketData
        .filter(md => md.market_cap > 0)
        .sort((a, b) => b.market_cap - a.market_cap)
        .slice(0, 5)
      
      console.log('\n👑 Market Cap Leaders:')
      marketCapLeaders.forEach((token, index) => {
        const marketCapFormatted = (token.market_cap / 1e9).toFixed(2)
        const priceFormatted = token.current_price.toFixed(6)
        console.log(`   ${index + 1}. ${token.symbol.toUpperCase()} (${token.name})`)
        console.log(`      📊 Market Cap: $${marketCapFormatted}B`)
        console.log(`      💰 Price: $${priceFormatted}`)
        console.log(`      📈 24h Change: ${token.price_change_percentage_24h.toFixed(2)}%`)
      })
      
      // Show price distribution
      const priceRanges = {
        'Under $0.01': 0,
        '$0.01 - $0.10': 0,
        '$0.10 - $1.00': 0,
        '$1.00 - $10.00': 0,
        '$10.00 - $100.00': 0,
        'Over $100.00': 0
      }
      
      marketData.forEach(md => {
        const price = md.current_price
        if (price < 0.01) priceRanges['Under $0.01']++
        else if (price < 0.10) priceRanges['$0.01 - $0.10']++
        else if (price < 1.00) priceRanges['$0.10 - $1.00']++
        else if (price < 10.00) priceRanges['$1.00 - $10.00']++
        else if (price < 100.00) priceRanges['$10.00 - $100.00']++
        else priceRanges['Over $100.00']++
      })
      
      console.log('\n📊 Price Distribution:')
      Object.entries(priceRanges).forEach(([range, count]) => {
        if (count > 0) {
          const percentage = ((count / marketData.length) * 100).toFixed(1)
          console.log(`   ${range}: ${count} tokens (${percentage}%)`)
        }
      })
    }
    
    // Step 6: Show collection summary
    console.log('\n📊 Collection Summary:')
    console.log(`   • Total tokens analyzed: ${result.tokensAnalyzed}`)
    console.log(`   • Priority tokens collected: ${prioritizedTokenIds.length}`)
    console.log(`   • Market data collected: ${result.marketDataCollected}`)
    console.log(`   • Success rate: ${result.successRate.toFixed(1)}%`)
    console.log(`   • CoinGecko API status: ${result.coingeckoStatus ? '✅ Healthy' : '❌ Issues'}`)
    console.log(`   • Priority breakdown:`)
    console.log(`     - High: ${prioritizedTokenIds.filter(id => highPriorityIds.includes(id)).length}`)
    console.log(`     - Medium: ${prioritizedTokenIds.filter(id => mediumPriorityIds.includes(id)).length}`)
    console.log(`     - Low: ${prioritizedTokenIds.filter(id => lowPriorityIds.includes(id)).length}`)
    
    if (result.errors.length > 0) {
      console.log(`   • Errors encountered: ${result.errors.length}`)
      console.log('\n⚠️ Errors:')
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('✅ Daily CoinGecko collection completed successfully!')
    console.log(`⏰ Completed at: ${new Date().toISOString()}`)
    
    return result
    
  } catch (error) {
    console.error('\n❌ Daily CoinGecko collection failed:', error)
    throw error
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  dailyCoinGeckoCollection().catch(console.error)
}

export { dailyCoinGeckoCollection }
