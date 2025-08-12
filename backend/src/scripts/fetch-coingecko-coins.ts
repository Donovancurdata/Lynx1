import { CoinGeckoService, CoinGeckoCoin } from '../services/CoinGeckoService'
import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

async function fetchAndStoreCoingeckoCoins() {
  console.log('🚀 Starting CoinGecko coins collection and storage...')
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
    
    // Step 2: Fetch all coins from CoinGecko
    console.log('\n🦎 Step 2: Fetching all coins from CoinGecko...')
    const allCoins = await coingeckoService.getAllCoins()
    console.log(`✅ Successfully fetched ${allCoins.length} coins from CoinGecko`)
    
    // Step 3: Transform coins to our token format
    console.log('\n🔄 Step 3: Transforming coins to token format...')
    const transformedTokens = allCoins.map((coin: CoinGeckoCoin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      platform: 'coingecko',
      contractAddress: coin.contract_address || null,
      platforms: coin.platforms || {},
      source: 'coingecko',
      lastUpdated: new Date().toISOString()
    }))
    
    console.log(`✅ Transformed ${transformedTokens.length} coins to token format`)
    
    // Step 4: Store tokens in Azure
    console.log('\n💾 Step 4: Storing tokens in Azure storage...')
    await tokenCollector.storeTokens(transformedTokens)
    console.log('✅ Successfully stored all coins in Azure storage')
    
    // Step 5: Show summary
    console.log('\n📊 Collection Summary:')
    console.log(`   • Total coins fetched: ${allCoins.length}`)
    console.log(`   • Tokens stored: ${transformedTokens.length}`)
    console.log(`   • Platform: CoinGecko`)
    console.log(`   • Storage: Azure`)
    
    // Show sample of stored tokens
    if (transformedTokens.length > 0) {
      console.log('\n🏆 Sample of stored tokens:')
      transformedTokens.slice(0, 10).forEach((token, index) => {
        console.log(`   ${index + 1}. ${token.symbol} (${token.name})`)
      })
      
      if (transformedTokens.length > 10) {
        console.log(`   ... and ${transformedTokens.length - 10} more`)
      }
    }
    
    console.log('\n✅ CoinGecko coins collection and storage completed successfully!')
    console.log(`⏰ Completed at: ${new Date().toISOString()}`)
    
  } catch (error) {
    console.error('❌ Error during CoinGecko coins collection:', error)
    throw error
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  fetchAndStoreCoingeckoCoins().catch(console.error)
}

export { fetchAndStoreCoingeckoCoins }
