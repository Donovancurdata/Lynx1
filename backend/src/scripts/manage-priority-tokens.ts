import { 
  PRIORITY_TOKENS, 
  getHighPriorityTokenIds, 
  getMediumPriorityTokenIds, 
  getLowPriorityTokenIds,
  PriorityToken 
} from '../config/priority-tokens'
import { CoinGeckoService } from '../services/CoinGeckoService'
import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

interface TokenStats {
  symbol: string
  name: string
  priority: string
  category: string
  lastCollected?: string
  price?: number
  marketCap?: number
  volume24h?: number
}

async function managePriorityTokens() {
  console.log('🎯 Priority Token Management System')
  console.log('=' .repeat(60))
  
  try {
    // Initialize services
    const coingeckoService = new CoinGeckoService()
    const tokenCollector = new TokenDataCollector()
    
    // Display current priority token configuration
    console.log('\n📋 Current Priority Token Configuration:')
    console.log(`   • High Priority: ${getHighPriorityTokenIds().length} tokens`)
    console.log(`   • Medium Priority: ${getMediumPriorityTokenIds().length} tokens`)
    console.log(`   • Low Priority: ${getLowPriorityTokenIds().length} tokens`)
    console.log(`   • Total: ${PRIORITY_TOKENS.length} tokens`)
    
    // Show high priority tokens
    console.log('\n🏆 HIGH PRIORITY TOKENS:')
    const highPriorityTokens = PRIORITY_TOKENS.filter(t => t.priority === 'high')
    highPriorityTokens.forEach((token, index) => {
      console.log(`   ${index + 1}. ${token.symbol} (${token.name})`)
      console.log(`      Category: ${token.category}`)
      console.log(`      Description: ${token.description}`)
    })
    
    // Show medium priority tokens
    console.log('\n🔄 MEDIUM PRIORITY TOKENS:')
    const mediumPriorityTokens = PRIORITY_TOKENS.filter(t => t.priority === 'medium')
    mediumPriorityTokens.forEach((token, index) => {
      console.log(`   ${index + 1}. ${token.symbol} (${token.name})`)
      console.log(`      Category: ${token.category}`)
      console.log(`      Description: ${token.description}`)
    })
    
    // Show low priority tokens
    console.log('\n💎 LOW PRIORITY TOKENS:')
    const lowPriorityTokens = PRIORITY_TOKENS.filter(t => t.priority === 'low')
    lowPriorityTokens.forEach((token, index) => {
      console.log(`   ${index + 1}. ${token.symbol} (${token.name})`)
      console.log(`      Category: ${token.category}`)
      console.log(`      Description: ${token.description}`)
    })
    
    // Check which tokens are actually available in CoinGecko
    console.log('\n🔍 Checking CoinGecko availability for priority tokens...')
    const allPriorityIds = getAllPriorityTokenIds()
    const availableTokens = await coingeckoService.getMarketData(allPriorityIds.slice(0, 50)) // Check first 50
    
    console.log(`✅ Found ${availableTokens.length} priority tokens available in CoinGecko`)
    
    // Show available tokens with current market data
    if (availableTokens.length > 0) {
      console.log('\n💰 Available Priority Tokens with Market Data:')
      availableTokens.forEach((token, index) => {
        const priorityInfo = PRIORITY_TOKENS.find(p => p.id === token.id)
        const priority = priorityInfo ? priorityInfo.priority : 'unknown'
        const category = priorityInfo ? priorityInfo.category : 'unknown'
        
        console.log(`   ${index + 1}. ${token.symbol.toUpperCase()} (${token.name})`)
        console.log(`      Priority: ${priority.toUpperCase()} | Category: ${category}`)
        console.log(`      Price: $${token.current_price?.toFixed(6) || 'N/A'}`)
        console.log(`      Market Cap: $${token.market_cap ? (token.market_cap / 1e6).toFixed(2) + 'M' : 'N/A'}`)
        console.log(`      24h Volume: $${token.total_volume ? (token.total_volume / 1e6).toFixed(2) + 'M' : 'N/A'}`)
        console.log(`      24h Change: ${token.price_change_percentage_24h?.toFixed(2) || 'N/A'}%`)
      })
    }
    
    // Show category breakdown
    console.log('\n📊 Category Breakdown:')
    const categories = ['major', 'defi', 'gaming', 'other']
    categories.forEach(category => {
      const categoryTokens = PRIORITY_TOKENS.filter(t => t.category === category)
      console.log(`   • ${category.toUpperCase()}: ${categoryTokens.length} tokens`)
    })
    
    // Show priority distribution
    console.log('\n📈 Priority Distribution:')
    const priorities = ['high', 'medium', 'low']
    priorities.forEach(priority => {
      const priorityTokens = PRIORITY_TOKENS.filter(t => t.priority === priority)
      console.log(`   • ${priority.toUpperCase()}: ${priorityTokens.length} tokens`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ Priority token management completed!')
    console.log('\n💡 To add new tokens:')
    console.log('   1. Edit backend/src/config/priority-tokens.ts')
    console.log('   2. Add new tokens to the PRIORITY_TOKENS array')
    console.log('   3. Set appropriate priority and category')
    console.log('   4. Run this script again to verify')
    
    return {
      totalTokens: PRIORITY_TOKENS.length,
      highPriority: getHighPriorityTokenIds().length,
      mediumPriority: getMediumPriorityTokenIds().length,
      lowPriority: getLowPriorityTokenIds().length,
      availableInCoinGecko: availableTokens.length
    }
    
  } catch (error) {
    console.error('❌ Error managing priority tokens:', error)
    throw error
  }
}

// Helper function to get all priority token IDs
function getAllPriorityTokenIds(): string[] {
  return PRIORITY_TOKENS.map(token => token.id)
}

// Run the function if this file is executed directly
if (require.main === module) {
  managePriorityTokens().catch(console.error)
}

export { managePriorityTokens }
