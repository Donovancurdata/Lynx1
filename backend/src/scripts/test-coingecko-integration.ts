import { CoinGeckoService } from '../services/CoinGeckoService'
import { fetchAndStoreCoingeckoCoins } from './fetch-coingecko-coins'
import { analyzeTokensForMarketData } from './analyze-tokens-for-market-data'
import { collectPrioritizedMarketData } from './collect-prioritized-market-data'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

async function testCoinGeckoIntegration() {
  console.log('🧪 Starting comprehensive CoinGecko integration test...')
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('=' .repeat(80))
  
  try {
    // Step 1: Test CoinGecko API connection
    console.log('\n🔍 STEP 1: Testing CoinGecko API Connection')
    console.log('-'.repeat(50))
    
    const coingeckoService = new CoinGeckoService()
    const apiStatus = await coingeckoService.checkApiStatus()
    
    if (!apiStatus) {
      throw new Error('CoinGecko API is not responding')
    }
    console.log('✅ CoinGecko API connection successful')
    
    // Step 2: Test fetching all coins
    console.log('\n🦎 STEP 2: Testing Coin Fetching')
    console.log('-'.repeat(50))
    
    console.log('Fetching sample of coins to test API...')
    const sampleCoins = await coingeckoService.getAllCoins()
    console.log(`✅ Successfully fetched ${sampleCoins.length} coins from CoinGecko`)
    
    // Show sample coins
    if (sampleCoins.length > 0) {
      console.log('\n📋 Sample of available coins:')
      sampleCoins.slice(0, 5).forEach((coin, index) => {
        console.log(`   ${index + 1}. ${coin.symbol.toUpperCase()} (${coin.name})`)
      })
    }
    
    // Step 3: Test market data fetching for a few popular coins
    console.log('\n💰 STEP 3: Testing Market Data Fetching')
    console.log('-'.repeat(50))
    
    const popularCoins = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']
    console.log(`Testing market data for popular coins: ${popularCoins.join(', ')}`)
    
    const marketData = await coingeckoService.getMarketData(popularCoins)
    console.log(`✅ Successfully fetched market data for ${marketData.length} coins`)
    
    // Show market data
    if (marketData.length > 0) {
      console.log('\n📊 Market Data Sample:')
      marketData.forEach((coin, index) => {
        const priceFormatted = coin.current_price.toFixed(6)
        const marketCapFormatted = (coin.market_cap / 1e9).toFixed(2)
        console.log(`   ${index + 1}. ${coin.symbol.toUpperCase()} (${coin.name})`)
        console.log(`      💰 Price: $${priceFormatted}`)
        console.log(`      📊 Market Cap: $${marketCapFormatted}B`)
        console.log(`      📈 24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%`)
      })
    }
    
    // Step 4: Test trending coins
    console.log('\n🔥 STEP 4: Testing Trending Coins')
    console.log('-'.repeat(50))
    
    const trendingCoins = await coingeckoService.getTrendingCoins()
    console.log(`✅ Successfully fetched trending coins`)
    
    if (trendingCoins.coins && trendingCoins.coins.length > 0) {
      console.log('\n🔥 Trending Coins:')
      trendingCoins.coins.slice(0, 5).forEach((coin: any, index: number) => {
        console.log(`   ${index + 1}. ${coin.item.symbol.toUpperCase()} (${coin.item.name})`)
        console.log(`      📊 Market Cap Rank: ${coin.item.market_cap_rank || 'N/A'}`)
        console.log(`      💰 Price: $${coin.item.price_btc.toFixed(8)} BTC`)
      })
    }
    
    // Step 5: Test search functionality
    console.log('\n🔍 STEP 5: Testing Search Functionality')
    console.log('-'.repeat(50))
    
    const searchResults = await coingeckoService.searchCoins('bitcoin')
    console.log(`✅ Search for 'bitcoin' returned ${searchResults.length} results`)
    
    if (searchResults.length > 0) {
      console.log('\n🔍 Search Results Sample:')
      searchResults.slice(0, 3).forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.symbol.toUpperCase()} (${result.name})`)
        console.log(`      🆔 ID: ${result.id}`)
        console.log(`      🏆 Market Cap Rank: ${result.market_cap_rank || 'N/A'}`)
      })
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('✅ All CoinGecko API tests completed successfully!')
    console.log('🚀 Ready to proceed with full integration')
    
    // Step 6: Ask user if they want to proceed with full integration
    console.log('\n🤔 Would you like to proceed with the full integration?')
    console.log('   This will:')
    console.log('   1. Fetch all coins from CoinGecko and store in Azure')
    console.log('   2. Analyze existing tokens and create prioritized list')
    console.log('   3. Collect market data for prioritized tokens')
    console.log('\n   Run the following commands to proceed:')
    console.log('   npm run fetch-coingecko-coins')
    console.log('   npm run analyze-tokens')
    console.log('   npm run collect-market-data')
    
  } catch (error) {
    console.error('\n❌ CoinGecko integration test failed:', error)
    console.log('\n🔧 Troubleshooting tips:')
    console.log('   1. Check your CoinGecko API key in .env file')
    console.log('   2. Verify internet connection')
    console.log('   3. Check if CoinGecko API is experiencing issues')
    throw error
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testCoinGeckoIntegration().catch(console.error)
}

export { testCoinGeckoIntegration }
