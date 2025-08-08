'use client'

import React, { useState } from 'react'
import { WalletInput } from '@/components/WalletInput'
import { MultiBlockchainResults } from '@/components/MultiBlockchainResults'
import { IntelligentAgentChat } from '@/components/IntelligentAgentChat'
import { Header } from '@/components/Header'
import { WalletAnalysisService, type MultiBlockchainAnalysis } from '@/services/walletAnalysis'

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<MultiBlockchainAnalysis | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'traditional' | 'intelligent'>('intelligent')

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
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
              LYNX
            </h1>
            <p className="text-xl text-secondary-600 mb-2">
              Ledger Yield & Node eXplorer
            </p>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              AI-powered blockchain analytics platform with intelligent agents for comprehensive wallet analysis, 
              fund flow tracking, and multi-chain token detection.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('intelligent')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'intelligent'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🤖 Intelligent Agent
              </button>
              <button
                onClick={() => setActiveTab('traditional')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'traditional'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Traditional Analysis
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'intelligent' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <div className="card h-96">
                  <IntelligentAgentChat />
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    🤖 Intelligent Agent Features
                  </h3>
                  <ul className="space-y-2 text-sm text-secondary-600">
                    <li>• Natural language conversations</li>
                    <li>• Real-time progressive analysis</li>
                    <li>• Intelligent insights and recommendations</li>
                    <li>• Multi-blockchain support</li>
                    <li>• Risk assessment and pattern detection</li>
                    <li>• Autonomous decision making</li>
                  </ul>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    💡 How to Use
                  </h3>
                  <div className="space-y-3 text-sm text-secondary-600">
                    <p><strong>Analyze a wallet:</strong> "Analyze wallet 0x123..."</p>
                    <p><strong>Ask questions:</strong> "What is blockchain?"</p>
                    <p><strong>Get help:</strong> "What can you do?"</p>
                    <p><strong>Deep analysis:</strong> "Do a deep analysis of..."</p>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    🔗 Quick Examples
                  </h3>
                  <div className="space-y-2 text-sm">
                    <button 
                      onClick={() => setActiveTab('intelligent')}
                      className="block w-full text-left p-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      "Analyze this wallet: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                    </button>
                    <button 
                      onClick={() => setActiveTab('intelligent')}
                      className="block w-full text-left p-2 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      "What are the risks of high-value wallets?"
                    </button>
                    <button 
                      onClick={() => setActiveTab('intelligent')}
                      className="block w-full text-left p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                    >
                      "Explain how blockchain works"
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Traditional Analysis Interface */}
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                    Traditional Wallet Analysis
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
          )}
        </div>
      </main>
    </div>
  )
} 