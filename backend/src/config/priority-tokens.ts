export interface PriorityToken {
  id: string
  symbol: string
  name: string
  priority: 'high' | 'medium' | 'low'
  category: 'major' | 'defi' | 'gaming' | 'meme' | 'other'
  description?: string
}

export const PRIORITY_TOKENS: PriorityToken[] = [
  // 🏆 HIGH PRIORITY - Major Cryptocurrencies
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priority: 'high',
    category: 'major',
    description: 'The original cryptocurrency, digital gold'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priority: 'high',
    category: 'major',
    description: 'Smart contract platform and DeFi foundation'
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    priority: 'high',
    category: 'major',
    description: 'Binance ecosystem token'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priority: 'high',
    category: 'major',
    description: 'High-performance blockchain'
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    priority: 'high',
    category: 'major',
    description: 'Fast and scalable blockchain'
  },
  {
    id: 'matic-network',
    symbol: 'MATIC',
    name: 'Polygon',
    priority: 'high',
    category: 'major',
    description: 'Ethereum scaling solution'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    priority: 'high',
    category: 'major',
    description: 'Research-driven blockchain'
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    priority: 'high',
    category: 'major',
    description: 'Multi-chain network'
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    priority: 'high',
    category: 'defi',
    description: 'Oracle network for DeFi'
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    priority: 'high',
    category: 'defi',
    description: 'Leading DEX protocol'
  },

  // 🔄 MEDIUM PRIORITY - Important DeFi & Gaming
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    priority: 'medium',
    category: 'defi',
    description: 'Lending and borrowing protocol'
  },
  {
    id: 'curve-dao-token',
    symbol: 'CRV',
    name: 'Curve DAO Token',
    priority: 'medium',
    category: 'defi',
    description: 'Stablecoin exchange protocol'
  },
  {
    id: 'compound-governance-token',
    symbol: 'COMP',
    name: 'Compound',
    priority: 'medium',
    category: 'defi',
    description: 'Lending protocol governance token'
  },
  {
    id: 'maker',
    symbol: 'MKR',
    name: 'Maker',
    priority: 'medium',
    category: 'defi',
    description: 'DAI stablecoin governance'
  },
  {
    id: 'sushi',
    symbol: 'SUSHI',
    name: 'SushiSwap',
    priority: 'medium',
    category: 'defi',
    description: 'Community-driven DEX'
  },
  {
    id: 'yearn-finance',
    symbol: 'YFI',
    name: 'yearn.finance',
    priority: 'medium',
    category: 'defi',
    description: 'Yield optimization protocol'
  },
  {
    id: 'balancer',
    symbol: 'BAL',
    name: 'Balancer',
    priority: 'medium',
    category: 'defi',
    description: 'Automated portfolio manager'
  },
  {
    id: 'havven',
    symbol: 'SNX',
    name: 'Synthetix',
    priority: 'medium',
    category: 'defi',
    description: 'Synthetic asset protocol'
  },
  {
    id: 'illuvium',
    symbol: 'ILV',
    name: 'Illuvium',
    priority: 'medium',
    category: 'gaming',
    description: 'Blockchain gaming platform'
  },
  {
    id: 'axie-infinity',
    symbol: 'AXS',
    name: 'Axie Infinity',
    priority: 'medium',
    category: 'gaming',
    description: 'Play-to-earn gaming'
  },
  {
    id: 'decentraland',
    symbol: 'MANA',
    name: 'Decentraland',
    priority: 'medium',
    category: 'gaming',
    description: 'Virtual reality platform'
  },
  {
    id: 'the-sandbox',
    symbol: 'SAND',
    name: 'The Sandbox',
    priority: 'medium',
    category: 'gaming',
    description: 'Virtual world and gaming'
  },
  {
    id: 'enjincoin',
    symbol: 'ENJ',
    name: 'Enjin Coin',
    priority: 'medium',
    category: 'gaming',
    description: 'Gaming cryptocurrency platform'
  },

  // 💎 LOW PRIORITY - Stablecoins & Utilities
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    priority: 'low',
    category: 'other',
    description: 'USD-backed stablecoin'
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    priority: 'low',
    category: 'other',
    description: 'USD-backed stablecoin'
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai',
    priority: 'low',
    category: 'other',
    description: 'Decentralized stablecoin'
  },
  {
    id: 'wrapped-bitcoin',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    priority: 'low',
    category: 'other',
    description: 'Bitcoin on Ethereum'
  },
  {
    id: 'weth',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    priority: 'low',
    category: 'other',
    description: 'Wrapped Ethereum'
  },
  {
    id: 'pancakeswap-token',
    symbol: 'CAKE',
    name: 'PancakeSwap',
    priority: 'low',
    category: 'defi',
    description: 'BSC DEX token'
  },
  {
    id: 'binance-usd',
    symbol: 'BUSD',
    name: 'Binance USD',
    priority: 'low',
    category: 'other',
    description: 'Binance stablecoin'
  },
  {
    id: 'basic-attention-token',
    symbol: 'BAT',
    name: 'Basic Attention Token',
    priority: 'low',
    category: 'other',
    description: 'Brave browser token'
  },
  {
    id: 'augur',
    symbol: 'REP',
    name: 'Augur',
    priority: 'low',
    category: 'other',
    description: 'Prediction market platform'
  },
  {
    id: 'omisego',
    symbol: 'OMG',
    name: 'OMG Network',
    priority: 'low',
    category: 'other',
    description: 'Ethereum scaling solution'
  },
  {
    id: 'chiliz',
    symbol: 'CHZ',
    name: 'Chiliz',
    priority: 'low',
    category: 'other',
    description: 'Sports and entertainment'
  },
  {
    id: 'fantom',
    symbol: 'FTM',
    name: 'Fantom',
    priority: 'low',
    category: 'major',
    description: 'Smart contract platform'
  },
  {
    id: 'ethereum-name-service',
    symbol: 'ENS',
    name: 'Ethereum Name Service',
    priority: 'low',
    category: 'other',
    description: 'Domain name service'
  },
  {
    id: 'paid-network',
    symbol: 'PAID',
    name: 'PAID Network',
    priority: 'low',
    category: 'other',
    description: 'Business network platform'
  },
  {
    id: 'smooth-love-potion',
    symbol: 'SLP',
    name: 'Smooth Love Potion',
    priority: 'low',
    category: 'gaming',
    description: 'Axie Infinity gaming token'
  }
]

export const getPriorityTokensByLevel = (level: 'high' | 'medium' | 'low'): PriorityToken[] => {
  return PRIORITY_TOKENS.filter(token => token.priority === level)
}

export const getPriorityTokensByCategory = (category: string): PriorityToken[] => {
  return PRIORITY_TOKENS.filter(token => token.category === category)
}

export const getAllPriorityTokenIds = (): string[] => {
  return PRIORITY_TOKENS.map(token => token.id)
}

export const getHighPriorityTokenIds = (): string[] => {
  return getPriorityTokensByLevel('high').map(token => token.id)
}

export const getMediumPriorityTokenIds = (): string[] => {
  return getPriorityTokensByLevel('medium').map(token => token.id)
}

export const getLowPriorityTokenIds = (): string[] => {
  return getPriorityTokensByLevel('low').map(token => token.id)
}
