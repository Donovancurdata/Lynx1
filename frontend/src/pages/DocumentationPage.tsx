import React from 'react'
import { Header } from '../components/Header'

export function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full mb-4 shadow-medium">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Documentation</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Complete guides, tutorials, and API references to help you get the most out of LYNX
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 slide-up">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="card-elevated sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Navigation</h3>
                <nav className="space-y-2">
                  <a href="#getting-started" className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-2">
                    Getting Started
                  </a>
                  <a href="#intelligent-agent" className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-2">
                    Intelligent Agent
                  </a>
                  <a href="#traditional-analysis" className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-2">
                    Traditional Analysis
                  </a>
                  <a href="#tax-calculations" className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-2">
                    Tax Calculations
                  </a>
                  <a href="#api-reference" className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-2">
                    API Reference
                  </a>
                  <a href="#faq" className="block text-sm text-slate-600 hover:text-blue-600 transition-colors py-2">
                    FAQ
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Documentation Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Getting Started */}
              <section id="getting-started" className="card-elevated">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    Welcome to LYNX! This guide will help you get started with our blockchain analytics platform.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">What is LYNX?</h3>
                  <p className="text-slate-600 mb-4">
                    LYNX (Ledger Yield & Node eXplorer) is an advanced blockchain analytics platform that provides:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
                    <li>AI-powered wallet analysis and insights</li>
                    <li>Multi-blockchain token tracking</li>
                    <li>Automated tax calculations</li>
                    <li>Risk assessment and pattern detection</li>
                    <li>Real-time transaction monitoring</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Quick Start Guide</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Step 1: Choose Your Analysis Type</h4>
                      <p className="text-blue-800 text-sm">
                        Decide between Intelligent Agent (AI-powered) or Traditional Analysis (manual input)
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Step 2: Enter Wallet Address</h4>
                      <p className="text-green-800 text-sm">
                        Input the wallet address you want to analyze (supports multiple blockchains)
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">Step 3: Review Results</h4>
                      <p className="text-purple-800 text-sm">
                        Examine detailed analytics, token balances, and transaction history
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Intelligent Agent */}
              <section id="intelligent-agent" className="card-elevated">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Intelligent Agent</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    The Intelligent Agent uses advanced AI to provide natural language analysis of blockchain data.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Use</h3>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-700 mb-2">Analyze a wallet:</p>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">"Analyze wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"</code>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-700 mb-2">Ask questions:</p>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">"What is blockchain?"</code>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-700 mb-2">Get insights:</p>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">"What are the risks of this wallet?"</code>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-600">
                    <li>Natural language processing</li>
                    <li>Real-time progressive analysis</li>
                    <li>Multi-blockchain support</li>
                    <li>Risk assessment</li>
                    <li>Pattern detection</li>
                  </ul>
                </div>
              </section>

              {/* Traditional Analysis */}
              <section id="traditional-analysis" className="card-elevated">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Traditional Analysis</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    Traditional Analysis provides comprehensive wallet analytics with detailed token tracking and transaction history.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Supported Blockchains</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900">Ethereum</h4>
                      <p className="text-blue-700 text-sm">ERC-20 tokens, NFTs, DeFi</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900">Bitcoin</h4>
                      <p className="text-orange-700 text-sm">BTC, Lightning Network</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900">Solana</h4>
                      <p className="text-purple-700 text-sm">SPL tokens, DeFi protocols</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900">Polygon</h4>
                      <p className="text-green-700 text-sm">MATIC, Layer 2 scaling</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900">Binance Smart Chain</h4>
                      <p className="text-yellow-700 text-sm">BEP-20 tokens, DeFi</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900">More Coming</h4>
                      <p className="text-red-700 text-sm">Additional chains soon</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Analysis Types</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Quick Analysis</h4>
                      <p className="text-slate-600 text-sm">
                        Fast overview of wallet contents, recent transactions, and basic metrics
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Deep Analysis</h4>
                      <p className="text-slate-600 text-sm">
                        Comprehensive analysis including historical data, risk assessment, and detailed reporting
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tax Calculations */}
              <section id="tax-calculations" className="card-elevated">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Tax Calculations</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    Automated tax reporting with support for multiple accounting methods and regulatory compliance.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Supported Methods</h3>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">FIFO (First In, First Out)</h4>
                      <p className="text-slate-600 text-sm">
                        Default method that sells the oldest tokens first
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">LIFO (Last In, First Out)</h4>
                      <p className="text-slate-600 text-sm">
                        Sells the most recently acquired tokens first
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">HIFO (Highest In, First Out)</h4>
                      <p className="text-slate-600 text-sm">
                        Sells tokens with the highest cost basis first
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Report Types</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-600">
                    <li>Capital gains and losses</li>
                    <li>IRS Form 8949</li>
                    <li>Schedule D</li>
                    <li>Staking and mining income</li>
                    <li>DeFi transaction reports</li>
                  </ul>
                </div>
              </section>

              {/* API Reference */}
              <section id="api-reference" className="card-elevated">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">API Reference</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    Integrate LYNX analytics into your applications with our comprehensive API.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Authentication</h3>
                  <div className="p-4 bg-slate-50 rounded-lg mb-6">
                    <p className="text-slate-700 mb-2">All API requests require an API key in the header:</p>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded">Authorization: Bearer YOUR_API_KEY</code>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Endpoints</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Wallet Analysis</h4>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">POST /api/v1/analyze</code>
                      <p className="text-slate-600 text-sm mt-2">
                        Analyze a wallet address across multiple blockchains
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Tax Calculations</h4>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">POST /api/v1/tax/calculate</code>
                      <p className="text-slate-600 text-sm mt-2">
                        Generate tax reports for specified wallets and time period
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Token Prices</h4>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">GET /api/v1/prices</code>
                      <p className="text-slate-600 text-sm mt-2">
                        Get current and historical token prices
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="card-elevated">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Is my wallet data secure?
                    </h3>
                    <p className="text-slate-600">
                      Yes, we only analyze publicly available blockchain data. We never require private keys or access to your wallets.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Which blockchains do you support?
                    </h3>
                    <p className="text-slate-600">
                      We currently support Ethereum, Bitcoin, Solana, Polygon, and Binance Smart Chain, with more coming soon.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      How accurate are the tax calculations?
                    </h3>
                    <p className="text-slate-600">
                      Our calculations are based on publicly available blockchain data. We recommend consulting with a tax professional for official tax advice.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Can I export my analysis results?
                    </h3>
                    <p className="text-slate-600">
                      Yes, all analysis results can be exported in PDF, CSV, and JSON formats for your records.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
