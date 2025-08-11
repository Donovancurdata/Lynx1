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

async function initializeHistoricalData() {
  // Validate required environment variables
  if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not found in environment variables')
  }

  console.log('📅 Initializing historical data collection...')
  console.log('⚠️  This will collect 5 years of historical data - this may take a while!')
  console.log(`🔧 Environment: ${NODE_ENV}`)
  console.log(`📝 Log Level: ${LOG_LEVEL}`)
  
  const collector = new TokenDataCollector()
  
  try {
    // Step 1: Collect tokens from the target wallet
    console.log('\n🔍 Step 1: Collecting tokens from wallet...')
    const walletAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    const tokens = await collector.collectWalletTokens(walletAddress)
    console.log(`✅ Collected ${tokens.length} unique tokens`)
    
    // Step 2: Collect historical data for the past 5 years
    console.log('\n📊 Step 2: Collecting historical data for the past 5 years...')
    await collector.collectHistoricalData()
    console.log('✅ Historical data collection completed!')
    
    console.log('\n🎉 Historical data initialization completed successfully!')
    console.log('📝 Next steps:')
    console.log('   1. Set up a cron job to run daily-token-collection.ts at midnight')
    console.log('   2. Monitor the Azure Data Lake Storage for data collection')
    console.log('   3. Use the collected data for accurate wallet analysis')
    
  } catch (error) {
    console.error('❌ Error during historical data initialization:', error)
    throw error
  }
}

// Run the initialization
if (require.main === module) {
  initializeHistoricalData().catch(console.error)
}

export { initializeHistoricalData } 