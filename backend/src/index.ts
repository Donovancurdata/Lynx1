import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import path from 'path'

import { errorHandler } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'
import { walletRoutes } from '@/routes/wallet'
import { blockchainRoutes } from '@/routes/blockchain'
import { analysisRoutes } from '@/routes/analysis'

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

const app = express()
const PORT = process.env['PORT'] || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' 
    ? [process.env['FRONTEND_URL'] || 'http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Compression
app.use(compression())

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] || '1.0.0'
  })
})

// API routes
app.use('/api/v1/wallet', walletRoutes)
app.use('/api/v1/blockchain', blockchainRoutes)
app.use('/api/v1/analysis', analysisRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`LYNX API server running on port ${PORT}`)
  logger.info(`Environment: ${process.env['NODE_ENV'] || 'development'}`)
})

export default app 