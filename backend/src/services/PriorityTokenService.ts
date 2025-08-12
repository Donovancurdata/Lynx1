import { CoinGeckoService } from './CoinGeckoService'
import { TokenDataCollector } from './TokenDataCollector'
import { 
  PRIORITY_TOKENS, 
  getHighPriorityTokenIds, 
  getMediumPriorityTokenIds, 
  getLowPriorityTokenIds,
  PriorityToken 
} from '../config/priority-tokens'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

export interface PriorityTokenData {
  id: string
  symbol: string
  name: string
  priority: 'high' | 'medium' | 'low'
  category: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_rank: number
  last_updated: string
  collection_timestamp: string
}

export interface WalletAnalysisResult {
  address: string
  blockchain: string
  balance: {
    balance: string
    usdValue: number
    lastUpdated: Date
  }
  priorityTokens: PriorityTokenData[]
  marketOverview: {
    totalMarketCap: number
    totalVolume24h: number
    topPerformers: PriorityTokenData[]
    marketTrends: {
      gainers: PriorityTokenData[]
      losers: PriorityTokenData[]
    }
  }
  analysis: {
    highPriorityTokens: number
    mediumPriorityTokens: number
    lowPriorityTokens: number
    totalTokens: number
    successRate: number
  }
  lastUpdated: Date
}

export class PriorityTokenService {
  private coingeckoService: CoinGeckoService
  private tokenCollector: TokenDataCollector

  constructor() {
    this.coingeckoService = new CoinGeckoService()
    this.tokenCollector = new TokenDataCollector()
  }

  /**
   * Get comprehensive wallet analysis using priority tokens
   */
  async analyzeWallet(address: string, blockchain: string): Promise<WalletAnalysisResult> {
    try {
      console.log(`🎯 Analyzing wallet ${address} on ${blockchain} using priority token system`)

      // Get priority token IDs
      const highPriorityIds = getHighPriorityTokenIds()
      const mediumPriorityIds = getMediumPriorityTokenIds()
      const lowPriorityIds = getLowPriorityTokenIds()

      // Collect market data for all priority tokens
      const allPriorityIds = [...highPriorityIds, ...mediumPriorityIds, ...lowPriorityIds]
      const marketData = await this.coingeckoService.getMarketData(allPriorityIds)

      // Transform market data to our format
      const priorityTokenData: PriorityTokenData[] = marketData.map(md => {
        const priorityInfo = PRIORITY_TOKENS.find(p => p.id === md.id)
        return {
          id: md.id,
          symbol: md.symbol,
          name: md.name,
          priority: priorityInfo?.priority || 'low',
          category: priorityInfo?.category || 'other',
          current_price: md.current_price || 0,
          market_cap: md.market_cap || 0,
          total_volume: md.total_volume || 0,
          price_change_24h: md.price_change_24h || 0,
          price_change_percentage_24h: md.price_change_percentage_24h || 0,
          market_cap_rank: md.market_cap_rank || 0,
          last_updated: md.last_updated || new Date().toISOString(),
          collection_timestamp: new Date().toISOString()
        }
      })

      // Calculate market overview
      const totalMarketCap = priorityTokenData.reduce((sum, token) => sum + token.market_cap, 0)
      const totalVolume24h = priorityTokenData.reduce((sum, token) => sum + token.total_volume, 0)

      // Get top performers (positive 24h change)
      const topPerformers = priorityTokenData
        .filter(token => token.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 10)

      // Get market trends
      const gainers = priorityTokenData
        .filter(token => token.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 5)

      const losers = priorityTokenData
        .filter(token => token.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5)

      // Create analysis result
      const result: WalletAnalysisResult = {
        address,
        blockchain,
        balance: {
          balance: '0', // We're not getting actual wallet balance, just token analysis
          usdValue: 0,
          lastUpdated: new Date()
        },
        priorityTokens: priorityTokenData,
        marketOverview: {
          totalMarketCap,
          totalVolume24h,
          topPerformers,
          marketTrends: {
            gainers,
            losers
          }
        },
        analysis: {
          highPriorityTokens: priorityTokenData.filter(t => t.priority === 'high').length,
          mediumPriorityTokens: priorityTokenData.filter(t => t.priority === 'medium').length,
          lowPriorityTokens: priorityTokenData.filter(t => t.priority === 'low').length,
          totalTokens: priorityTokenData.length,
          successRate: (priorityTokenData.length / allPriorityIds.length) * 100
        },
        lastUpdated: new Date()
      }

      console.log(`✅ Wallet analysis completed for ${address}`)
      console.log(`   • Priority tokens analyzed: ${result.analysis.totalTokens}`)
      console.log(`   • High priority: ${result.analysis.highPriorityTokens}`)
      console.log(`   • Medium priority: ${result.analysis.mediumPriorityTokens}`)
      console.log(`   • Low priority: ${result.analysis.lowPriorityTokens}`)
      console.log(`   • Success rate: ${result.analysis.successRate.toFixed(1)}%`)

      return result

    } catch (error) {
      console.error(`❌ Error analyzing wallet ${address}:`, error)
      throw error
    }
  }

  /**
   * Get priority token market data
   */
  async getPriorityTokenMarketData(): Promise<PriorityTokenData[]> {
    try {
      const allPriorityIds = getAllPriorityTokenIds()
      const marketData = await this.coingeckoService.getMarketData(allPriorityIds)

      return marketData.map(md => {
        const priorityInfo = PRIORITY_TOKENS.find(p => p.id === md.id)
        return {
          id: md.id,
          symbol: md.symbol,
          name: md.name,
          priority: priorityInfo?.priority || 'low',
          category: priorityInfo?.category || 'other',
          current_price: md.current_price || 0,
          market_cap: md.market_cap || 0,
          total_volume: md.total_volume || 0,
          price_change_24h: md.price_change_24h || 0,
          price_change_percentage_24h: md.price_change_percentage_24h || 0,
          market_cap_rank: md.market_cap_rank || 0,
          last_updated: md.last_updated || new Date().toISOString(),
          collection_timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('❌ Error getting priority token market data:', error)
      throw error
    }
  }

  /**
   * Get tokens by priority level
   */
  async getTokensByPriority(priority: 'high' | 'medium' | 'low'): Promise<PriorityTokenData[]> {
    try {
      const priorityIds = priority === 'high' ? getHighPriorityTokenIds() :
                         priority === 'medium' ? getMediumPriorityTokenIds() :
                         getLowPriorityTokenIds()

      const marketData = await this.coingeckoService.getMarketData(priorityIds)

      return marketData.map(md => {
        const priorityInfo = PRIORITY_TOKENS.find(p => p.id === md.id)
        return {
          id: md.id,
          symbol: md.symbol,
          name: md.name,
          priority: priorityInfo?.priority || 'low',
          category: priorityInfo?.category || 'other',
          current_price: md.current_price || 0,
          market_cap: md.market_cap || 0,
          total_volume: md.total_volume || 0,
          price_change_24h: md.price_change_24h || 0,
          price_change_percentage_24h: md.price_change_percentage_24h || 0,
          market_cap_rank: md.market_cap_rank || 0,
          last_updated: md.last_updated || new Date().toISOString(),
          collection_timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error(`❌ Error getting ${priority} priority tokens:`, error)
      throw error
    }
  }

  /**
   * Get tokens by category
   */
  async getTokensByCategory(category: string): Promise<PriorityTokenData[]> {
    try {
      const categoryTokens = PRIORITY_TOKENS.filter(t => t.category === category)
      const tokenIds = categoryTokens.map(t => t.id)

      const marketData = await this.coingeckoService.getMarketData(tokenIds)

      return marketData.map(md => {
        const priorityInfo = PRIORITY_TOKENS.find(p => p.id === md.id)
        return {
          id: md.id,
          symbol: md.symbol,
          name: md.name,
          priority: priorityInfo?.priority || 'low',
          category: priorityInfo?.category || 'other',
          current_price: md.current_price || 0,
          market_cap: md.market_cap || 0,
          total_volume: md.total_volume || 0,
          price_change_24h: md.price_change_24h || 0,
          price_change_percentage_24h: md.price_change_percentage_24h || 0,
          market_cap_rank: md.market_cap_rank || 0,
          last_updated: md.last_updated || new Date().toISOString(),
          collection_timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error(`❌ Error getting ${category} category tokens:`, error)
      throw error
    }
  }
}

// Helper function
function getAllPriorityTokenIds(): string[] {
  return PRIORITY_TOKENS.map(token => token.id)
}
