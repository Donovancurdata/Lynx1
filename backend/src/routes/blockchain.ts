import { Router } from 'express'
import { BlockchainController } from '@/controllers/BlockchainController'

const router = Router()
const blockchainController = new BlockchainController()

// GET /api/v1/blockchain/supported
router.get('/supported', blockchainController.getSupportedBlockchains)

// GET /api/v1/blockchain/:chain/status
router.get('/:chain/status', blockchainController.getBlockchainStatus)

// GET /api/v1/blockchain/:chain/latest-block
router.get('/:chain/latest-block', blockchainController.getLatestBlock)

export { router as blockchainRoutes } 