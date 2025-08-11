import * as cron from 'node-cron'
import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

// Import environment variables
const {
  NODE_ENV = 'development',
  PORT = '3001',
  LOG_LEVEL = 'info',
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET
} = process.env

class DailyTokenCronJob {
  private collector: TokenDataCollector

  constructor() {
    // Validate required environment variables
    if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
      throw new Error('Azure credentials not found in environment variables')
    }
    
    this.collector = new TokenDataCollector()
  }

  async runDailyCollection(): Promise<void> {
    console.log('🕛 Cron Job: Starting daily token collection...')
    console.log(`📅 Date: ${new Date().toISOString()}`)
    
    try {
      // Step 1: Read existing tokens from Azure storage
      console.log('\n📖 Step 1: Reading existing tokens from Azure storage...')
      const existingTokens = await this.collector.readTokens()
      console.log(`✅ Found ${existingTokens.length} existing tokens`)
      
      if (existingTokens.length === 0) {
        console.log('⚠️ No existing tokens found. Skipping daily collection.')
        return
      }
      
      // Step 2: Collect current prices for all tokens
      console.log('\n💰 Step 2: Collecting current prices...')
      const tokenValues = await this.collector.collectCurrentPrices()
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
      
      console.log('\n✅ Cron Job: Daily token collection completed successfully!')
      console.log(`⏰ Completed at: ${new Date().toISOString()}`)
      
    } catch (error) {
      console.error('❌ Cron Job: Daily token collection failed:', error)
      // Don't throw error to prevent cron job from stopping
    }
  }

  startCronJob(): void {
    console.log('🚀 Starting Daily Token Collection Cron Job...')
    console.log('⏰ Schedule: Every day at midnight (00:00)')
    
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
      await this.runDailyCollection()
    }, {
      scheduled: true,
      timezone: 'UTC'
    })
    
    console.log('✅ Cron job scheduled successfully!')
    console.log('📝 To test immediately, you can also run: npm run daily-collection-azure')
  }

  // Method to run once immediately for testing
  async runOnce(): Promise<void> {
    console.log('🧪 Running daily collection once for testing...')
    await this.runDailyCollection()
  }
}

// Export for use in other files
export { DailyTokenCronJob }

// If this file is run directly, start the cron job
if (require.main === module) {
  const cronJob = new DailyTokenCronJob()
  cronJob.startCronJob()
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n⏹️ Stopping cron job...')
    process.exit(0)
  })
} 