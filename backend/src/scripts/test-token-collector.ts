import { TokenDataCollector } from '../services/TokenDataCollector'

async function testTokenCollector() {
  console.log('🔍 Testing Token Data Collector...\n')
  
  const collector = new TokenDataCollector()
  
  try {
    // Test accurate price fetching for major tokens
    console.log('📊 Testing accurate price fetching...')
    
    const testTokens = [
      { symbol: 'SOS', blockchain: 'ethereum' },
      { symbol: 'ILV', blockchain: 'ethereum' },
      { symbol: 'WETH', blockchain: 'ethereum' },
      { symbol: 'BNB', blockchain: 'bsc' },
      { symbol: 'AVAX', blockchain: 'avalanche' }
    ]
    
    for (const token of testTokens) {
      console.log(`\n🔍 Testing ${token.symbol} on ${token.blockchain}...`)
      const priceData = await collector.getAccurateTokenPrice(token.symbol)
      
      if (priceData) {
        console.log(`✅ ${token.symbol}: $${priceData.price}`)
        console.log(`   High: $${priceData.high}`)
        console.log(`   Low: $${priceData.low}`)
        console.log(`   Volume: $${priceData.volume}`)
        console.log(`   Market Cap: $${priceData.marketCap}`)
      } else {
        console.log(`❌ No price data for ${token.symbol}`)
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log('\n✅ Token price testing complete!')
    
    // Test wallet token collection (commented out to avoid API calls)
    /*
    console.log('\n🔍 Testing wallet token collection...')
    const walletAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    const tokens = await collector.collectWalletTokens(walletAddress)
    console.log(`✅ Collected ${tokens.length} tokens from wallet`)
    
    // Test current price collection
    console.log('\n📊 Testing current price collection...')
    const tokenValues = await collector.collectCurrentPrices()
    console.log(`✅ Collected prices for ${tokenValues.length} tokens`)
    */
    
  } catch (error) {
    console.error('❌ Error testing token collector:', error)
  }
}

// Run the test
testTokenCollector().catch(console.error) 