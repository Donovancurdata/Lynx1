import { Router } from 'express'
import { validateWalletAddress } from '@/middleware/validation'
import { AnalysisController } from '@/controllers/AnalysisController'

const router = Router()
const analysisController = new AnalysisController()

// POST /api/v1/analysis/fund-flow
router.post('/fund-flow', validateWalletAddress, analysisController.analyzeFundFlow)

// POST /api/v1/analysis/forex-detection
router.post('/forex-detection', validateWalletAddress, analysisController.detectForexProviders)

// GET /api/v1/analysis/risk-assessment/:address
router.get('/risk-assessment/:address', validateWalletAddress, analysisController.assessRisk)

// POST /api/v1/analysis/comprehensive
router.post('/comprehensive', validateWalletAddress, analysisController.comprehensiveAnalysis)

export { router as analysisRoutes } 