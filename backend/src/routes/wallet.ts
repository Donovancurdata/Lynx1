import { Router } from 'express'
import { validateWalletAddress } from '@/middleware/validation'
import { WalletController } from '@/controllers/WalletController'

const router = Router()
const walletController = new WalletController()

// GET /api/v1/wallet/validate/:address
router.get('/validate/:address', validateWalletAddress, walletController.validateWallet)

// POST /api/v1/wallet/analyze
router.post('/analyze', validateWalletAddress, walletController.analyzeWallet)

// GET /api/v1/wallet/balance/:address
router.get('/balance/:address', validateWalletAddress, walletController.getBalance)

// GET /api/v1/wallet/transactions/:address
router.get('/transactions/:address', validateWalletAddress, walletController.getTransactions)

export { router as walletRoutes } 