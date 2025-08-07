import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

async function testTokenCollectionSimple() {
  console.log('🔍 Testing Simple Token Collection...\n')
  
  const collector = new TokenDataCollector()
  
  try {
    // Test accurate price fetching for major tokens
    console.log('📊 Testing accurate price fetching...')
    
    const testTokens = [
      { symbol: 'SOS', blockchain: 'ethereum' },
      { symbol: 'ILV', blockchain: 'ethereum' },
      { symbol: 'WETH', blockchain: 'ethereum' },
      { symbol: 'BNB', blockchain: 'bsc' },
      { symbol: 'AVAX', blockchain: 'avalanche' },
      { symbol: 'CAKE', blockchain: 'bsc' },
      { symbol: 'TIME', blockchain: 'avalanche' },
      { symbol: 'MEMO', blockchain: 'avalanche' }
    ]
    
    const tokenPrices: any[] = []
    
    for (const token of testTokens) {
      console.log(`\n🔍 Testing ${token.symbol} on ${token.blockchain}...`)
      const priceData = await collector.getAccurateTokenPrice(token.symbol, token.blockchain)
      
      if (priceData) {
        console.log(`✅ ${token.symbol}: $${priceData.price}`)
        console.log(`   High: $${priceData.high}`)
        console.log(`   Low: $${priceData.low}`)
        console.log(`   Volume: $${priceData.volume}`)
        console.log(`   Market Cap: $${priceData.marketCap}`)
        
        tokenPrices.push({
          symbol: token.symbol,
          blockchain: token.blockchain,
          price: priceData.price,
          high: priceData.high,
          low: priceData.low,
          volume: priceData.volume,
          marketCap: priceData.marketCap,
          timestamp: new Date().toISOString()
        })
      } else {
        console.log(`❌ No price data for ${token.symbol}`)
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Save results to local file
    const resultsDir = path.join(__dirname, '../../results')
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true })
    }
    
    const resultsFile = path.join(resultsDir, 'token-prices.json')
    fs.writeFileSync(resultsFile, JSON.stringify(tokenPrices, null, 2))
    
    console.log(`\n✅ Token price testing complete!`)
    console.log(`📁 Results saved to: ${resultsFile}`)
    
    // Test wallet token collection
    console.log('\n🔍 Testing wallet token collection...')
    const walletAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    
    try {
      const tokens = await collector.collectWalletTokens(walletAddress)
      console.log(`✅ Collected ${tokens.length} tokens from wallet`)
      
      // Save tokens to local file
      const tokensFile = path.join(resultsDir, 'wallet-tokens.json')
      fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2))
      console.log(`📁 Tokens saved to: ${tokensFile}`)
      
      // Show sample of collected tokens
      console.log('\n📋 Sample of collected tokens:')
      tokens.slice(0, 10).forEach((token, index) => {
        console.log(`   ${index + 1}. ${token.symbol} (${token.blockchain}) - ${token.name}`)
      })
      
      if (tokens.length > 10) {
        console.log(`   ... and ${tokens.length - 10} more tokens`)
      }
      
    } catch (error) {
      console.error('❌ Error collecting wallet tokens:', error)
    }
    
  } catch (error) {
    console.error('❌ Error testing token collection:', error)
  }
}

// Run the test
testTokenCollectionSimple().catch(console.error) 