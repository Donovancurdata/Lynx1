import { TokenDataCollector } from '../services/TokenDataCollector'
import { CoinGeckoService } from '../services/CoinGeckoService'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

interface TokenAnalysis {
  tokenId: string
  symbol: string
  name: string
  platform: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  coingeckoId?: string
}

async function analyzeTokensForMarketData() {
  console.log('🔍 Starting token analysis for market data collection...')
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  
  try {
    // Initialize services
    const tokenCollector = new TokenDataCollector()
    const coingeckoService = new CoinGeckoService()
    
    // Step 1: Read existing tokens from Azure
    console.log('\n📖 Step 1: Reading existing tokens from Azure storage...')
    const existingTokens = await tokenCollector.readTokens()
    console.log(`✅ Found ${existingTokens.length} existing tokens`)
    
    if (existingTokens.length === 0) {
      console.log('⚠️ No existing tokens found. Please run the CoinGecko coins collection first.')
      return
    }
    
    // Step 2: Get all available coins from CoinGecko
    console.log('\n🦎 Step 2: Fetching available coins from CoinGecko...')
    const coingeckoCoins = await coingeckoService.getAllCoins()
    console.log(`✅ Found ${coingeckoCoins.length} coins available on CoinGecko`)
    
    // Step 3: Create a map of CoinGecko coins for fast lookup
    const coingeckoMap = new Map<string, any>()
    coingeckoCoins.forEach(coin => {
      coingeckoMap.set(coin.symbol.toLowerCase(), coin)
      coingeckoMap.set(coin.name.toLowerCase(), coin)
    })
    
    // Step 4: Analyze each token and assign priority
    console.log('\n🔍 Step 3: Analyzing tokens and assigning priority...')
    const tokenAnalysis: TokenAnalysis[] = []
    
    existingTokens.forEach(token => {
      let priority: 'high' | 'medium' | 'low' = 'low'
      let reason = 'No match found on CoinGecko'
      let coingeckoId: string | undefined
      
      // Check if token exists on CoinGecko
      const symbolMatch = coingeckoMap.get(token.symbol.toLowerCase())
      const nameMatch = coingeckoMap.get(token.name.toLowerCase())
      
      if (symbolMatch) {
        coingeckoId = symbolMatch.id
        priority = 'high'
        reason = 'Symbol match found on CoinGecko'
      } else if (nameMatch) {
        coingeckoId = nameMatch.id
        priority = 'medium'
        reason = 'Name match found on CoinGecko'
      }
      
      // Additional priority adjustments
      if (token.platform === 'coingecko') {
        priority = 'high'
        reason = 'Directly from CoinGecko'
      } else if (token.platform === 'ethereum' || token.platform === 'polygon') {
        priority = priority === 'low' ? 'medium' : priority
        reason += ' (Major blockchain platform)'
      }
      
      tokenAnalysis.push({
        tokenId: token.id,
        symbol: token.symbol,
        name: token.name,
        platform: token.platform,
        priority,
        reason,
        coingeckoId
      })
    })
    
    // Step 5: Categorize tokens by priority
    const highPriority = tokenAnalysis.filter(t => t.priority === 'high')
    const mediumPriority = tokenAnalysis.filter(t => t.priority === 'medium')
    const lowPriority = tokenAnalysis.filter(t => t.priority === 'low')
    
    // Step 6: Show analysis results
    console.log('\n📊 Token Analysis Results:')
    console.log(`   • High Priority: ${highPriority.length} tokens`)
    console.log(`   • Medium Priority: ${mediumPriority.length} tokens`)
    console.log(`   • Low Priority: ${lowPriority.length} tokens`)
    console.log(`   • Total Analyzed: ${tokenAnalysis.length} tokens`)
    
    // Show high priority tokens
    if (highPriority.length > 0) {
      console.log('\n🏆 High Priority Tokens (Recommended for market data):')
      highPriority.slice(0, 20).forEach((token, index) => {
        console.log(`   ${index + 1}. ${token.symbol} (${token.name}) - ${token.reason}`)
      })
      
      if (highPriority.length > 20) {
        console.log(`   ... and ${highPriority.length - 20} more`)
      }
    }
    
    // Show medium priority tokens
    if (mediumPriority.length > 0) {
      console.log('\n🔄 Medium Priority Tokens:')
      mediumPriority.slice(0, 10).forEach((token, index) => {
        console.log(`   ${index + 1}. ${token.symbol} (${token.name}) - ${token.reason}`)
      })
      
      if (mediumPriority.length > 10) {
        console.log(`   ... and ${mediumPriority.length - 10} more`)
      }
    }
    
    // Step 7: Create prioritized list for market data collection
    const prioritizedList = [
      ...highPriority.map(t => t.coingeckoId).filter(Boolean),
      ...mediumPriority.map(t => t.coingeckoId).filter(Boolean)
    ]
    
    console.log('\n📋 Prioritized List for Market Data Collection:')
    console.log(`   • High Priority IDs: ${prioritizedList.length}`)
    console.log(`   • Estimated API calls needed: ${Math.ceil(prioritizedList.length / 50)}`)
    
    // Step 8: Save analysis results
    const analysisResults = {
      timestamp: new Date().toISOString(),
      totalTokens: existingTokens.length,
      coingeckoCoins: coingeckoCoins.length,
      analysis: tokenAnalysis,
      prioritizedList: prioritizedList,
      summary: {
        highPriority: highPriority.length,
        mediumPriority: mediumPriority.length,
        lowPriority: lowPriority.length
      }
    }
    
    // Store analysis results in Azure (you can implement this method)
    // await tokenCollector.storeAnalysisResults(analysisResults)
    
    console.log('\n✅ Token analysis completed successfully!')
    console.log(`⏰ Completed at: ${new Date().toISOString()}`)
    
    return analysisResults
    
  } catch (error) {
    console.error('❌ Error during token analysis:', error)
    throw error
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  analyzeTokensForMarketData().catch(console.error)
}

export { analyzeTokensForMarketData }
