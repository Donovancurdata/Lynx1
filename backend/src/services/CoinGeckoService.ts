import axios from 'axios'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
  platforms?: Record<string, string>
  contract_address?: string
}

export interface CoinGeckoMarketData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: any
  last_updated: string
}

export class CoinGeckoService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env['COINGECKO_BASE_URL'] || 'https://api.coingecko.com/api/v3'
    this.apiKey = process.env['COINGECKO_API_KEY'] || ''
    
    console.log('🔍 Debug: Environment variables loaded:')
    console.log(`   COINGECKO_BASE_URL: ${process.env['COINGECKO_BASE_URL'] || 'NOT SET'}`)
    console.log(`   COINGECKO_API_KEY: ${process.env['COINGECKO_API_KEY'] ? 'SET (length: ' + process.env['COINGECKO_API_KEY'].length + ')' : 'NOT SET'}`)
    
    if (!this.apiKey) {
      throw new Error('CoinGecko API key not found in environment variables')
    }
  }

  /**
   * Get all supported coins list from CoinGecko
   * @returns Promise<CoinGeckoCoin[]>
   */
  async getAllCoins(): Promise<CoinGeckoCoin[]> {
    try {
      console.log('🦎 Fetching all coins from CoinGecko...')
      
      const response = await axios.get(`${this.baseUrl}/coins/list`, {
        headers: {
          'X-CG-Demo-API-Key': this.apiKey
        },
        timeout: 30000 // 30 second timeout
      })

      console.log(`✅ Successfully fetched ${response.data.length} coins from CoinGecko`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching coins from CoinGecko:', error)
      throw error
    }
  }

  /**
   * Get market data for specific coins
   * @param coinIds Array of coin IDs
   * @param currency Currency for prices (default: usd)
   * @returns Promise<CoinGeckoMarketData[]>
   */
  async getMarketData(coinIds: string[], currency: string = 'usd'): Promise<CoinGeckoMarketData[]> {
    try {
      if (coinIds.length === 0) {
        console.log('⚠️ No coin IDs provided for market data')
        return []
      }

      console.log(`💰 Fetching market data for ${coinIds.length} coins from CoinGecko...`)
      
      // CoinGecko allows up to 50 coins per request for demo plan
      const batchSize = 50
      const allMarketData: CoinGeckoMarketData[] = []

      for (let i = 0; i < coinIds.length; i += batchSize) {
        const batch = coinIds.slice(i, i + batchSize)
        console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.length} coins`)
        
        const response = await axios.get(`${this.baseUrl}/coins/markets`, {
          params: {
            ids: batch.join(','),
            vs_currency: currency,
            order: 'market_cap_desc',
            per_page: batchSize,
            page: 1,
            sparkline: false,
            locale: 'en'
          },
          headers: {
            'X-CG-Demo-API-Key': this.apiKey
          },
          timeout: 30000
        })

        allMarketData.push(...response.data)
        
        // Rate limiting: wait 1.2 seconds between batches (respecting 50 calls/minute limit)
        if (i + batchSize < coinIds.length) {
          console.log('⏳ Waiting 1.2 seconds before next batch...')
          await new Promise(resolve => setTimeout(resolve, 1200))
        }
      }

      console.log(`✅ Successfully fetched market data for ${allMarketData.length} coins`)
      return allMarketData
    } catch (error) {
      console.error('❌ Error fetching market data from CoinGecko:', error)
      throw error
    }
  }

  /**
   * Search for coins by symbol or name
   * @param query Search query
   * @returns Promise<CoinGeckoCoin[]>
   */
  async searchCoins(query: string): Promise<CoinGeckoCoin[]> {
    try {
      console.log(`🔍 Searching for coins with query: "${query}"`)
      
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          query: query
        },
        headers: {
          'X-CG-Demo-API-Key': this.apiKey
        },
        timeout: 10000
      })

      console.log(`✅ Found ${response.data.coins.length} coins matching "${query}"`)
      return response.data.coins
    } catch (error) {
      console.error('❌ Error searching coins:', error)
      throw error
    }
  }

  /**
   * Get trending coins
   * @returns Promise<any>
   */
  async getTrendingCoins(): Promise<any> {
    try {
      console.log('🔥 Fetching trending coins from CoinGecko...')
      
      const response = await axios.get(`${this.baseUrl}/search/trending`, {
        headers: {
          'X-CG-Demo-API-Key': this.apiKey
        },
        timeout: 10000
      })

      console.log(`✅ Successfully fetched trending coins`)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching trending coins:', error)
      throw error
    }
  }

  /**
   * Check API status
   * @returns Promise<boolean>
   */
  async checkApiStatus(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/ping`, {
        timeout: 5000
      })
      
      console.log('✅ CoinGecko API is responding')
      return true
    } catch (error) {
      console.error('❌ CoinGecko API is not responding:', error)
      return false
    }
  }
}
