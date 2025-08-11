import React, { useState } from 'react'
import { Header } from '../components/Header'
import { WalletInput } from '../components/WalletInput'
import { MultiBlockchainResults } from '../components/MultiBlockchainResults'
import { WalletAnalysisService, type MultiBlockchainAnalysis } from '../services/walletAnalysis'

export function TraditionalAnalysisPage() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<MultiBlockchainAnalysis | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async (address: string, analysisType: 'quick' | 'deep') => {
    setIsAnalyzing(true)
    setError('')
    setWalletAddress(address)
    
    try {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-medium">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Traditional Analysis</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive wallet analysis with detailed token tracking, transaction history, and multi-chain insights
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 slide-up">
            {/* Analysis Interface */}
            <div className="card-elevated">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Wallet Analysis</h2>
                  <p className="text-slate-600">
                    Enter any wallet address to analyze its tokens, transactions, and lifetime value across multiple blockchains.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <WalletInput 
                  onAnalyze={handleAnalyze}
                  isLoading={isAnalyzing}
                />
              </div>

              {error && (
                <div className="mt-6 p-4 status-error rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
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

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900">Token Tracking</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Comprehensive tracking of all tokens across multiple blockchains with real-time balances and historical data.
                </p>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900">Transaction History</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Detailed transaction logs with timestamps, amounts, gas fees, and counterparty information.
                </p>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900">Analytics</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Advanced analytics including portfolio performance, risk metrics, and market correlation analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
