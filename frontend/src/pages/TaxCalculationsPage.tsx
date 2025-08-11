import React, { useState } from 'react'
import { Header } from '../components/Header'

export function TaxCalculationsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [walletAddresses, setWalletAddresses] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCalculateTaxes = async () => {
    setIsProcessing(true)
    // TODO: Implement tax calculation logic
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4 shadow-medium">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Tax Calculations</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Automated tax reporting with detailed capital gains calculations, cost basis tracking, and regulatory compliance
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 slide-up">
            {/* Tax Calculator */}
            <div className="lg:col-span-2">
              <div className="card-elevated">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Tax Calculator</h2>
                    <p className="text-slate-600">
                      Generate comprehensive tax reports for your cryptocurrency transactions
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Year Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tax Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="input-field"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Wallet Addresses */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Wallet Addresses
                    </label>
                    <textarea
                      value={walletAddresses}
                      onChange={(e) => setWalletAddresses(e.target.value)}
                      placeholder="Enter wallet addresses (one per line)&#10;0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6&#10;0x1234567890abcdef..."
                      className="input-field min-h-[120px] resize-none"
                      rows={5}
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Enter one wallet address per line. We'll analyze all transactions for the selected tax year.
                    </p>
                  </div>

                  {/* Calculate Button */}
                  <button
                    onClick={handleCalculateTaxes}
                    disabled={isProcessing || !walletAddresses.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span>Calculating Taxes...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Generate Tax Report</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Sample Report Preview */}
              <div className="card-elevated mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Sample Tax Report</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-semibold text-green-800">Capital Gains</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">$12,450.00</p>
                      <p className="text-sm text-green-700">Short-term: $8,200 | Long-term: $4,250</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="font-semibold text-blue-800">Total Transactions</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">1,247</p>
                      <p className="text-sm text-blue-700">Across 3 blockchains</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="card-elevated">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Features</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Automated capital gains calculations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Cost basis tracking (FIFO, LIFO, HIFO)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Multi-blockchain support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>IRS Form 8949 generation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>DeFi transaction handling</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Staking and mining income</span>
                  </li>
                </ul>
              </div>

              <div className="card-elevated">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Supported Methods</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">FIFO (First In, First Out)</p>
                    <p className="text-slate-600">Default method for most taxpayers</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">LIFO (Last In, First Out)</p>
                    <p className="text-slate-600">May reduce tax liability in some cases</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">HIFO (Highest In, First Out)</p>
                    <p className="text-slate-600">Sells highest cost basis first</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Important Notes</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Disclaimer:</strong> This tool provides estimates only. Always consult with a tax professional for official tax advice.
                  </p>
                  <p className="text-slate-700">
                    • Reports are generated based on publicly available blockchain data
                  </p>
                  <p className="text-slate-700">
                    • Some transactions may require manual review
                  </p>
                  <p className="text-slate-700">
                    • DeFi protocols and complex transactions may have special tax implications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
