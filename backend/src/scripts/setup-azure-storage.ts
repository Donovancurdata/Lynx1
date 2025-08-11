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
  AZURE_CLIENT_SECRET,
  ONELAKE_CONNECTION_STRING,
  ONELAKE_DATABASE_NAME,
  ONELAKE_CONTAINER_NAME
} = process.env

async function setupAzureStorage() {
  // Validate required environment variables
  if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not found in environment variables')
  }

  console.log('🔧 Setting up Azure Storage Integration...\n')
  console.log(`🔧 Environment: ${NODE_ENV}`)
  console.log(`📝 Log Level: ${LOG_LEVEL}`)
  console.log(`☁️ Azure Account: ${AZURE_STORAGE_ACCOUNT_NAME}`)
  console.log(`🏢 Tenant ID: ${AZURE_TENANT_ID}`)
  
  const collector = new TokenDataCollector()
  
  try {
    // Test Azure connection
    console.log('🔍 Testing Azure connection...')
    
    // Test with a small sample token
    const testToken = {
      id: 'test-1',
      symbol: 'TEST',
      name: 'Test Token',
      blockchain: 'ethereum',
      address: '0x1234567890123456789012345678901234567890',
      createdAt: new Date()
    }
    
    console.log('📝 Testing token storage...')
    await collector.storeTokens([testToken])
    console.log('✅ Token storage test successful!')
    
    // Test with sample price data
    const testPriceData = {
      id: 'test-price-1',
      tokenId: 'test-1',
      price: 1.23,
      high: 1.25,
      low: 1.20,
      volume: 1000000,
      marketCap: 10000000,
      date: new Date(),
      source: 'test'
    }
    
    console.log('💰 Testing price data storage...')
    await collector.storeTokenValues([testPriceData])
    console.log('✅ Price data storage test successful!')
    
    // Test reading back the data
    console.log('📖 Testing data retrieval...')
    const tokens = await collector.readTokens()
    console.log(`✅ Retrieved ${tokens.length} tokens from Azure storage`)
    
    console.log('\n🎉 Azure Storage Integration Setup Complete!')
    console.log('📁 Container: lynx')
    console.log('📂 File System: token-data')
    console.log('📄 Files: tokens.json, token-values-YYYY-MM-DD.json')
    
  } catch (error) {
    console.error('❌ Azure Storage Setup Failed:', error)
    console.log('\n🔧 Troubleshooting Tips:')
    console.log('1. Check Azure credentials in .env file')
    console.log('2. Verify container "lynx" exists in ADLS Gen 2')
    console.log('3. Ensure Entra ID has proper permissions')
    console.log('4. Check network connectivity to Azure')
  }
}

// Run the setup
setupAzureStorage().catch(console.error) 