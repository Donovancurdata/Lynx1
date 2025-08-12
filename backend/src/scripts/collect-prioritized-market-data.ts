import { CoinGeckoService, CoinGeckoMarketData } from '../services/CoinGeckoService'
import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

interface MarketDataCollectionResult {
  timestamp: string
  totalRequested: number
  totalCollected: number
  successRate: number
  marketData: CoinGeckoMarketData[]
  errors: string[]
}

async function collectPrioritizedMarketData() {
  console.log('💰 Starting prioritized market data collection...')
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  
  try {
    // Initialize services
    const coingeckoService = new CoinGeckoService()
    const tokenCollector = new TokenDataCollector()
    
    // Step 1: Check CoinGecko API status
    console.log('\n🔍 Step 1: Checking CoinGecko API status...')
    const apiStatus = await coingeckoService.checkApiStatus()
    if (!apiStatus) {
      throw new Error('CoinGecko API is not responding')
    }
    console.log('✅ CoinGecko API is responding')
    
    // Step 2: Read existing tokens and get prioritized list
    console.log('\n📖 Step 2: Reading existing tokens and creating prioritized list...')
    const existingTokens = await tokenCollector.readTokens()
    console.log(`✅ Found ${existingTokens.length} existing tokens`)
    
    if (existingTokens.length === 0) {
      console.log('⚠️ No existing tokens found. Please run the CoinGecko coins collection first.')
      return
    }
    
    // For now, let's use a simple approach: prioritize tokens by platform
    // In a real scenario, you'd run the analysis script first
    const prioritizedTokens = existingTokens
      .filter(token => 
        token.platform === 'coingecko' || 
        token.platform === 'ethereum' || 
        token.platform === 'polygon'
      )
      .slice(0, 100) // Limit to first 100 for testing
    
    console.log(`📋 Created prioritized list with ${prioritizedTokens.length} tokens`)
    
    // Step 3: Collect market data for prioritized tokens
    console.log('\n💰 Step 3: Collecting market data for prioritized tokens...')
    const coinIds = prioritizedTokens.map(token => token.id)
    
    const marketData = await coingeckoService.getMarketData(coinIds)
    console.log(`✅ Successfully collected market data for ${marketData.length} tokens`)
    
    // Step 4: Store market data
    console.log('\n💾 Step 4: Storing market data...')
    // You can implement a method to store market data in Azure
    // For now, we'll just log the results
    
    // Step 5: Show collection summary
    console.log('\n📊 Market Data Collection Summary:')
    console.log(`   • Total tokens requested: ${prioritizedTokens.length}`)
    console.log(`   • Market data collected: ${marketData.length}`)
    console.log(`   • Success rate: ${((marketData.length / prioritizedTokens.length) * 100).toFixed(1)}%`)
    
    // Show top tokens by market cap
    if (marketData.length > 0) {
      const sortedByMarketCap = marketData
        .filter(md => md.market_cap > 0)
        .sort((a, b) => b.market_cap - a.market_cap)
      
      console.log('\n🏆 Top 10 Tokens by Market Cap:')
      sortedByMarketCap.slice(0, 10).forEach((token, index) => {
        const marketCapFormatted = (token.market_cap / 1e9).toFixed(2)
        const priceFormatted = token.current_price.toFixed(6)
        console.log(`   ${index + 1}. ${token.symbol} (${token.name})`)
        console.log(`      💰 Price: $${priceFormatted}`)
        console.log(`      📊 Market Cap: $${marketCapFormatted}B`)
        console.log(`      📈 24h Change: ${token.price_change_percentage_24h.toFixed(2)}%`)
      })
    }
    
    // Step 6: Show price distribution
    if (marketData.length > 0) {
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
        if (!price || price === null) return // Skip null/undefined prices
        
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
    
    const result: MarketDataCollectionResult = {
      timestamp: new Date().toISOString(),
      totalRequested: prioritizedTokens.length,
      totalCollected: marketData.length,
      successRate: (marketData.length / prioritizedTokens.length) * 100,
      marketData,
      errors: []
    }
    
    console.log('\n✅ Prioritized market data collection completed successfully!')
    console.log(`⏰ Completed at: ${new Date().toISOString()}`)
    
    return result
    
  } catch (error) {
    console.error('❌ Error during market data collection:', error)
    throw error
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  collectPrioritizedMarketData().catch(console.error)
}

export { collectPrioritizedMarketData }
