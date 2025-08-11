import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

// Import environment variables
const {
  NODE_ENV = 'development',
  LOG_LEVEL = 'info',
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET
} = process.env

async function dailyTokenCollection() {
  // Validate required environment variables
  if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not found in environment variables')
  }

  console.log('🕛 Starting daily token collection...')
  console.log(`📅 Date: ${new Date().toISOString()}`)
  console.log(`🔧 Environment: ${NODE_ENV}`)
  console.log(`📝 Log Level: ${LOG_LEVEL}`)
  
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