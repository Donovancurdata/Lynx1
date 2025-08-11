import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

async function dailyTokenCollection() {
  console.log('📅 Daily Token Collection Started...\n')
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  
  const collector = new TokenDataCollector()
  
  try {
    // Step 1: Read existing tokens from Azure storage
    console.log('\n📖 Step 1: Reading existing tokens from Azure storage...')
    const existingTokens = await collector.readTokens()
    console.log(`✅ Found ${existingTokens.length} existing tokens`)
    
    if (existingTokens.length === 0) {
      console.log('⚠️ No existing tokens found. Please run the wallet token collection first.')
      return
    }
    
    // Step 2: Collect current prices for all tokens
    console.log('\n💰 Step 2: Collecting current prices...')
    const tokenValues = await collector.collectCurrentPrices()
    console.log(`✅ Collected prices for ${tokenValues.length} tokens`)
    
    // Step 3: Show summary
    console.log('\n📊 Collection Summary:')
    console.log(`   • Total tokens processed: ${existingTokens.length}`)
    console.log(`   • Prices collected: ${tokenValues.length}`)
    console.log(`   • Success rate: ${((tokenValues.length / existingTokens.length) * 100).toFixed(1)}%`)
    
    // Show top tokens by price
    const sortedTokens = tokenValues
      .filter(t => t.price > 0)
      .sort((a, b) => b.price - a.price)
    
    if (sortedTokens.length > 0) {
      console.log('\n🏆 Top 5 Tokens by Price:')
      sortedTokens.slice(0, 5).forEach((token, index) => {
        const tokenInfo = existingTokens.find(t => t.id === token.tokenId)
        const symbol = tokenInfo?.symbol || 'Unknown'
        console.log(`   ${index + 1}. ${symbol}: $${token.price.toFixed(6)}`)
      })
    }
    
    console.log('\n✅ Daily token collection completed successfully!')
    console.log(`⏰ Completed at: ${new Date().toISOString()}`)
    
  } catch (error) {
    console.error('❌ Daily token collection failed:', error)
    throw error
  }
}

// Run the daily collection
dailyTokenCollection().catch(console.error) 