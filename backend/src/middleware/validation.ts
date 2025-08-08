import { Request, Response, NextFunction } from 'express'

// Basic wallet address validation patterns
const ADDRESS_PATTERNS = {
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,62}$/,
  binance: /^0x[a-fA-F0-9]{40}$/,
  polygon: /^0x[a-fA-F0-9]{40}$/,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
}

export const validateWalletAddress = (req: Request, res: Response, next: NextFunction): Response | void => {
  const address = req.params['address'] || req.body['address']
  const specifiedBlockchain = req.query['blockchain'] as string || req.body['blockchain']

  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Wallet address is required'
    })
  }

  // Auto-detect blockchain if not specified
  let detectedBlockchain: string | null = null
  if (specifiedBlockchain) {
    detectedBlockchain = specifiedBlockchain
  } else {
    // Auto-detect based on address format
    for (const [blockchain, pattern] of Object.entries(ADDRESS_PATTERNS)) {
      if (pattern.test(address)) {
        detectedBlockchain = blockchain
        break
      }
    }
  }

  if (!detectedBlockchain) {
    return res.status(400).json({
      success: false,
      error: 'Invalid wallet address format or unsupported blockchain'
    })
  }

  const pattern = ADDRESS_PATTERNS[detectedBlockchain as keyof typeof ADDRESS_PATTERNS]
  
  if (!pattern) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported blockchain'
    })
  }

  if (!pattern.test(address)) {
    return res.status(400).json({
      success: false,
      error: `Invalid ${detectedBlockchain} wallet address format`
    })
  }

  // Add detected blockchain to request for use in controller
  req.body['detectedBlockchain'] = detectedBlockchain
  req.params['detectedBlockchain'] = detectedBlockchain

  next()
}

export const validateBlockchain = (req: Request, res: Response, next: NextFunction): Response | void => {
  const blockchain = req.query['blockchain'] as string || req.body['blockchain']

  if (!blockchain) {
    return res.status(400).json({
      success: false,
      error: 'Blockchain parameter is required'
    })
  }

  const supportedBlockchains = ['ethereum', 'bitcoin', 'binance', 'polygon', 'solana']
  
  if (!supportedBlockchains.includes(blockchain)) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported blockchain',
      supported: supportedBlockchains
    })
  }

  next()
} 