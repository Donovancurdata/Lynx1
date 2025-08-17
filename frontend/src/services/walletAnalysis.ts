// Wallet Analysis API Service
const API_BASE_URL = 'http://localhost:3001/api/v1'

export interface TokenBalance {
  symbol: string
  balance: string
  usdValue: number
  tokenAddress?: string
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  type: 'in' | 'out'
  currency: string
}

export interface WalletAnalysis {
  address: string
  blockchain: string
  balance: {
    native: string
    usdValue: number
  }
  tokens: TokenBalance[]
  totalTokens: number
  topTokens: TokenBalance[]
  recentTransactions: Transaction[]
  totalLifetimeValue: number
  transactionCount: number
  tokenTransactionCount: number
  lastUpdated: string
}

export interface MultiBlockchainAnalysis {
  address: string
  blockchains: {
    [blockchain: string]: WalletAnalysis
  }
  totalValue: number
  totalTransactions: number
  lastUpdated: string
}

export class WalletAnalysisService {
  static async analyzeWallet(address: string, analysisType: 'quick' | 'deep' = 'quick'): Promise<MultiBlockchainAnalysis> {
    try {
      let url = `${API_BASE_URL}/wallet/analyze?t=${Date.now()}&v=2`
      
      // For deep analysis, use the deep-analyze endpoint
      if (analysisType === 'deep') {
        url = `${API_BASE_URL}/wallet/deep-analyze?t=${Date.now()}&v=2`
      }
      
      // Detect blockchain type to set appropriate filter
      const detectedBlockchain = this.detectBlockchain(address)
      const blockchainFilter = detectedBlockchain === 'ethereum' ? 'ethereum' : undefined
      
      const requestBody: any = { address, analysisType }
      if (analysisType === 'deep' && blockchainFilter) {
        requestBody.blockchainFilter = blockchainFilter
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Analysis failed')
      }

      const backendData = result.data
      
      console.log('🔍 Frontend received multi-blockchain data:', {
        totalValue: backendData.totalValue,
        totalTransactions: backendData.totalTransactions,
        blockchains: Object.keys(backendData.blockchains || {}),
        blockchainCount: Object.keys(backendData.blockchains || {}).length,
        blockchainFilter: result.blockchainFilter,
        analyzedChains: result.analyzedChains
      })

      // Return the multi-blockchain data directly
      return backendData
    } catch (error) {
      console.error('❌ Wallet analysis failed:', error)
      throw error
    }
  }

  static detectBlockchain(address: string): string {
    // Ethereum/Sub Chains addresses
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return 'ethereum'
    }
    
    // Bitcoin addresses
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address)) {
      return 'bitcoin'
    }
    
    // Solana addresses
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return 'solana'
    }
    
    return 'unknown'
  }

  static formatBalance(balance: string, decimals: number = 18): string {
    const num = parseFloat(balance) / Math.pow(10, decimals)
    return num.toFixed(6)
  }

  static formatUSDValue(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  static formatAddress(address: string): string {
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-10)}`
    }
    return address
  }
} 