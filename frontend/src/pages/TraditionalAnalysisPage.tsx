import React, { useState } from 'react'
import { Header } from '../components/Header'

export function TraditionalAnalysisPage() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) return

    setIsAnalyzing(true)
    
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResults({
        address: walletAddress,
        balance: '2.45 ETH',
        transactions: 156,
        riskScore: 'Low',
        lastActivity: '2 hours ago',
        tokens: ['ETH', 'USDC', 'UNI', 'LINK'],
        chains: ['Ethereum', 'Polygon']
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="section-cyber">
      <Header />
      
      <main className="container mx-auto px-4 py-16 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-oxanium">
              <span className="text-gradient-primary">Traditional Analysis</span>
            </h1>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Comprehensive wallet analysis with detailed insights, transaction history, 
              and risk assessment across multiple blockchain networks.
            </p>
          </div>

          {/* Input Section */}
          <div className="card-cyber mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6 font-oxanium">Wallet Analysis</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="input-cyber flex-1"
              />
              <button
                onClick={handleAnalyze}
                disabled={!walletAddress.trim() || isAnalyzing}
                className="btn-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner-cyber"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <span>Analyze Wallet</span>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {analysisResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Balance</h3>
                <p className="text-3xl font-bold text-primary">{analysisResults.balance}</p>
                <p className="text-text-muted text-sm mt-2">Current balance</p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Transactions</h3>
                <p className="text-3xl font-bold text-accent">{analysisResults.transactions}</p>
                <p className="text-text-muted text-sm mt-2">Total transactions</p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Risk Score</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${analysisResults.riskScore === 'Low' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-2xl font-bold text-text-primary">{analysisResults.riskScore}</p>
                </div>
                <p className="text-text-muted text-sm mt-2">Risk assessment</p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Last Activity</h3>
                <p className="text-xl font-semibold text-text-primary">{analysisResults.lastActivity}</p>
                <p className="text-text-muted text-sm mt-2">Recent activity</p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Tokens</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.tokens.map((token, index) => (
                    <span key={index} className="badge-cyber-primary">{token}</span>
                  ))}
                </div>
                <p className="text-text-muted text-sm mt-2">Held tokens</p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Chains</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.chains.map((chain, index) => (
                    <span key={index} className="badge-cyber-accent">{chain}</span>
                  ))}
                </div>
                <p className="text-text-muted text-sm mt-2">Active networks</p>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Transaction History</h3>
              </div>
              <p className="text-text-muted">
                Complete transaction history with detailed analysis of fund flows, 
                token transfers, and interaction patterns.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Risk Assessment</h3>
              </div>
              <p className="text-text-muted">
                Advanced risk detection algorithms identify suspicious patterns, 
                potential scams, and security vulnerabilities.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Real-Time Data</h3>
              </div>
              <p className="text-text-muted">
                Live monitoring of wallet activities with instant updates and 
                real-time notifications for important events.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
