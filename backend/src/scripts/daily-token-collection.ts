import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'

dotenv.config()

async function dailyTokenCollection() {
  console.log('🕛 Starting daily token collection...')
  console.log(`📅 Date: ${new Date().toISOString()}`)
  
  const collector = new TokenDataCollector()
  
  try {
    // Step 1: Collect current prices for all stored tokens
    console.log('\n📊 Step 1: Collecting current token prices...')
    const tokenValues = await collector.collectCurrentPrices()
    console.log(`✅ Collected prices for ${tokenValues.length} tokens`)
    
    // Step 2: Log summary of collected data
    console.log('\n📈 Price Summary:')
    const priceSummary = tokenValues.reduce((acc, tv) => {
      if (!acc[tv.tokenId]) {
        acc[tv.tokenId] = {
          count: 0,
          totalValue: 0,
          avgPrice: 0
        }
      }
      acc[tv.tokenId].count++
      acc[tv.tokenId].totalValue += tv.price
      acc[tv.tokenId].avgPrice = acc[tv.tokenId].totalValue / acc[tv.tokenId].count
      return acc
    }, {} as any)
    
    Object.entries(priceSummary).forEach(([tokenId, summary]: [string, any]) => {
      console.log(`   ${tokenId}: $${summary.avgPrice.toFixed(6)} (${summary.count} data points)`)
    })
    
    console.log('\n✅ Daily token collection completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during daily token collection:', error)
    throw error
  }
}

// Run the daily collection
if (require.main === module) {
  dailyTokenCollection().catch(console.error)
}

export { dailyTokenCollection } 