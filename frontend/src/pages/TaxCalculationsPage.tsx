import React, { useState } from 'react'
import { Header } from '../components/Header'

export function TaxCalculationsPage() {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [walletAddress, setWalletAddress] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [taxResults, setTaxResults] = useState(null)

  const handleCalculate = async () => {
    if (!walletAddress.trim()) return

    setIsCalculating(true)
    
    // Simulate tax calculation
    setTimeout(() => {
      setTaxResults({
        year: selectedYear,
        address: walletAddress,
        totalGains: 15420.50,
        totalLosses: 3200.75,
        netGain: 12219.75,
        taxRate: 15,
        estimatedTax: 1832.96,
        transactions: 89,
        methods: ['FIFO', 'LIFO', 'Specific Identification']
      })
      setIsCalculating(false)
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
              <span className="text-gradient-primary">Tax Calculations</span>
            </h1>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Automated tax reporting with detailed capital gains calculations, 
              cost basis tracking, and regulatory compliance across multiple jurisdictions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Interface */}
            <div className="lg:col-span-2">
              <div className="card-cyber">
                <h2 className="text-2xl font-bold text-text-primary mb-6 font-oxanium">Tax Calculator</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-text-primary font-medium mb-2">Tax Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="input-cyber w-full"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter wallet address (0x...)"
                      className="input-cyber w-full"
                    />
                  </div>

                  <button
                    onClick={handleCalculate}
                    disabled={!walletAddress.trim() || isCalculating}
                    className="btn-cyber-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCalculating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="spinner-cyber"></div>
                        <span>Calculating Taxes...</span>
                      </div>
                    ) : (
                      <span>Calculate Taxes</span>
                    )}
                  </button>
                </div>

                {/* Results */}
                {taxResults && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-xl font-bold text-text-primary mb-6 font-oxanium">Tax Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">Total Gains:</span>
                          <span className="text-green-400 font-semibold">${taxResults.totalGains.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">Total Losses:</span>
                          <span className="text-red-400 font-semibold">${taxResults.totalLosses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">Net Gain:</span>
                          <span className="text-primary font-semibold">${taxResults.netGain.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">Tax Rate:</span>
                          <span className="text-accent font-semibold">{taxResults.taxRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">Estimated Tax:</span>
                          <span className="text-primary font-bold text-xl">${taxResults.estimatedTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted">Transactions:</span>
                          <span className="text-text-primary font-semibold">{taxResults.transactions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Features</h3>
                <ul className="space-y-3 text-text-muted">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Automated capital gains calculations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Cost basis tracking and optimization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Multi-jurisdiction tax compliance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Real-time tax liability estimates</span>
                  </li>
                </ul>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Supported Methods</h3>
                <div className="space-y-3">
                  {['FIFO', 'LIFO', 'Specific Identification', 'Average Cost'].map((method) => (
                    <div key={method} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue rounded-full"></div>
                      <span className="text-text-muted text-sm">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Important Notes</h3>
                <div className="space-y-3 text-text-muted text-sm">
                  <p>
                    • This calculator provides estimates only. Consult with a tax professional for official tax advice.
                  </p>
                  <p>
                    • Results are based on current tax laws and may change with new regulations.
                  </p>
                  <p>
                    • All calculations assume US tax residency unless otherwise specified.
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
