'use client'

import React, { useState } from 'react'
import { WalletInput } from '@/components/WalletInput'
import { MultiBlockchainResults } from '@/components/MultiBlockchainResults'
import { Header } from '@/components/Header'
import { WalletAnalysisService, type MultiBlockchainAnalysis } from '@/services/walletAnalysis'

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<MultiBlockchainAnalysis | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async (address: string, analysisType: 'quick' | 'deep') => {
    setIsAnalyzing(true)
    setError('')
    setWalletAddress(address)
    
    try {
      // Use the service to analyze the wallet with the specified analysis type
      const analysisData = await WalletAnalysisService.analyzeWallet(address, analysisType)
      setAnalysisResults(analysisData)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
              LYNX
            </h1>
            <p className="text-xl text-secondary-600 mb-2">
              Ledger Yield & Node eXplorer
            </p>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              AI-powered blockchain analytics platform for comprehensive wallet analysis, 
              fund flow tracking, and multi-chain token detection.
            </p>
          </div>

          {/* Analysis Interface */}
          <div className="card mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                Analyze Wallet
              </h2>
              <p className="text-secondary-600">
                Enter any wallet address to analyze its tokens, transactions, and lifetime value across multiple blockchains.
              </p>
            </div>

            <div className="space-y-4">
              <WalletInput 
                onAnalyze={handleAnalyze}
                isLoading={isAnalyzing}
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {analysisResults && (
            <MultiBlockchainResults 
              results={analysisResults}
              isLoading={isAnalyzing}
            />
          )}
        </div>
      </main>
    </div>
  )
} 