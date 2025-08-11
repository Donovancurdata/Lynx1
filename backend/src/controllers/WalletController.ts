import { Request, Response } from 'express'
import { WalletAnalysisService } from '@/services/WalletAnalysisService'
import { logger } from '@/utils/logger'

export class WalletController {
  async validateWallet(req: Request, res: Response): Promise<Response> {
    try {
      const { address } = req.params
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Address parameter is required'
        })
      }
      
      logger.info(`Validating wallet address: ${address}`)

      const blockchain = WalletAnalysisService.detectBlockchain(address)
      const isValid = blockchain !== 'unknown'
      
      return res.json({
        success: true,
        data: {
          address,
          blockchain,
          isValid
        }
      })
    } catch (error) {
      logger.error('Wallet validation failed:', error)
      return res.status(500).json({
        success: false,
        error: 'Wallet validation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  async analyzeWallet(req: Request, res: Response): Promise<Response> {
    try {
      const { address, deepAnalysis = false } = req.body

      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        })
      }

      logger.info(`Analyzing wallet: ${address} (${deepAnalysis ? 'DEEP' : 'QUICK'} analysis)`)
      
      // Add debugging
      console.log(`🔍 API Controller: Analyzing wallet: ${address} (${deepAnalysis ? 'DEEP' : 'QUICK'} analysis)`)
      const detectedBlockchains = WalletAnalysisService.detectAllBlockchains(address)
      console.log(`🔍 API Controller: Detected blockchains: ${detectedBlockchains.join(', ')}`)

      const result = await WalletAnalysisService.analyzeWallet(address, deepAnalysis)
      
      // Log the multi-blockchain results
      logger.info(`Multi-blockchain analysis complete for ${address}:`, {
        totalValue: result.totalValue,
        totalTransactions: result.totalTransactions,
        blockchains: Object.keys(result.blockchains),
        analysisType: deepAnalysis ? 'DEEP' : 'QUICK'
      })
      
      // DETAILED DEBUGGING - Log exact result object structure
      console.log(`🔍 API Controller: DETAILED RESULT OBJECT:`)
      console.log(`🔍 Total Value: ${result.totalValue} (type: ${typeof result.totalValue})`)
      console.log(`🔍 Total Transactions: ${result.totalTransactions}`)
      console.log(`🔍 Blockchains keys: ${Object.keys(result.blockchains)}`)
      console.log(`🔍 Result object structure:`, JSON.stringify({
        address: result.address,
        totalValue: result.totalValue,
        totalTransactions: result.totalTransactions,
        blockchainCount: Object.keys(result.blockchains).length,
        firstBlockchain: Object.keys(result.blockchains)[0],
        lastUpdated: result.lastUpdated
      }, null, 2))
      
      // Check if we have blockchain-specific data
      Object.entries(result.blockchains).forEach(([blockchain, analysis]) => {
        console.log(`🔍 ${blockchain.toUpperCase()} Analysis:`)
        console.log(`   - Balance: ${analysis.balance?.native || 'N/A'} (USD: $${analysis.balance?.usdValue || 0})`)
        console.log(`   - Tokens: ${analysis.tokens?.length || 0} tokens`)
        console.log(`   - Total Token Value: $${analysis.tokens?.reduce((sum, token) => sum + (token.usdValue || 0), 0) || 0}`)
        console.log(`   - Transactions: ${analysis.transactionCount || 0}`)
      })
      
      return res.json({
        success: true,
        data: result
      })
    } catch (error) {
      logger.error('Wallet analysis failed:', error)
      return res.status(500).json({
        success: false,
        error: 'Wallet analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  async getBalance(req: Request, res: Response): Promise<Response> {
    try {
      const { address } = req.params

      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Address parameter is required'
        })
      }

      logger.info(`Getting balance for: ${address}`)

      const result = await WalletAnalysisService.analyzeWallet(address)
      
      // Get the first blockchain's balance (for backward compatibility)
      const blockchainKeys = Object.keys(result.blockchains)
      const firstBlockchain = blockchainKeys.length > 0 ? blockchainKeys[0] : 'unknown'
      const firstAnalysis = firstBlockchain !== 'unknown' ? result.blockchains[firstBlockchain as keyof typeof result.blockchains] : null
      
      return res.json({
        success: true,
        data: {
          address,
          balance: firstAnalysis?.balance || { native: '0', usdValue: 0 },
          blockchain: firstBlockchain,
          totalValue: result.totalValue
        }
      })
    } catch (error) {
      logger.error('Balance retrieval failed:', error)
      return res.status(500).json({
        success: false,
        error: 'Balance retrieval failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  async getTransactions(req: Request, res: Response): Promise<Response> {
    try {
      const { address } = req.params
      const limit = parseInt(req.query['limit'] as string) || 10

      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Address parameter is required'
        })
      }

      logger.info(`Getting transactions for: ${address}`)

      const result = await WalletAnalysisService.analyzeWallet(address)
      
      // Get transactions from the first blockchain (for backward compatibility)
      const blockchainKeys = Object.keys(result.blockchains)
      const firstBlockchain = blockchainKeys.length > 0 ? blockchainKeys[0] : 'unknown'
      const firstAnalysis = firstBlockchain !== 'unknown' ? result.blockchains[firstBlockchain as keyof typeof result.blockchains] : null
      const transactions = firstAnalysis?.recentTransactions.slice(0, limit) || []
      
      return res.json({
        success: true,
        data: {
          address,
          transactions,
          totalCount: result.totalTransactions
        }
      })
    } catch (error) {
      logger.error('Transaction retrieval failed:', error)
      return res.status(500).json({
        success: false,
        error: 'Transaction retrieval failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
} 