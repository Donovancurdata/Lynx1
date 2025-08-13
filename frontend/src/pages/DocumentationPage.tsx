import React, { useState } from 'react'
import { Header } from '../components/Header'

export function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'intelligent-agent', title: 'Intelligent Agent' },
    { id: 'traditional-analysis', title: 'Traditional Analysis' },
    { id: 'tax-calculations', title: 'Tax Calculations' },
    { id: 'api-reference', title: 'API Reference' },
    { id: 'faq', title: 'FAQ' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary font-oxanium">Getting Started</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Welcome to LYNX - your comprehensive blockchain analytics platform. This guide will help you get started with our powerful tools for wallet analysis, fund tracking, and tax calculations.
              </p>
              
              <h3 className="text-lg font-semibold text-text-primary">Quick Start</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Choose your analysis type: Intelligent Agent or Traditional Analysis</li>
                <li>Enter a wallet address to analyze</li>
                <li>Review the comprehensive results and insights</li>
                <li>Use our tax calculator for regulatory compliance</li>
              </ol>

              <h3 className="text-lg font-semibold text-text-primary">Supported Blockchains</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Ethereum', 'Bitcoin', 'Solana', 'Polygon'].map((chain) => (
                  <div key={chain} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm">{chain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'intelligent-agent':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary font-oxanium">Intelligent Agent</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Our AI-powered assistant provides natural language analysis of blockchain data. Simply ask questions in plain English and receive detailed insights.
              </p>

              <h3 className="text-lg font-semibold text-text-primary">Features</h3>
              <ul className="space-y-2 ml-4">
                <li>• Natural language queries</li>
                <li>• Real-time blockchain analysis</li>
                <li>• Risk assessment and pattern detection</li>
                <li>• Multi-chain data aggregation</li>
              </ul>

              <h3 className="text-lg font-semibold text-text-primary">Example Queries</h3>
              <div className="space-y-3">
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <p className="text-sm font-medium text-text-primary">"Analyze wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"</p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <p className="text-sm font-medium text-text-primary">"What are the risks of this wallet?"</p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <p className="text-sm font-medium text-text-primary">"Track fund flows for the last 24 hours"</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'traditional-analysis':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary font-oxanium">Traditional Analysis</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Comprehensive wallet analysis with detailed transaction history, token tracking, and risk assessment across multiple blockchains.
              </p>

              <h3 className="text-lg font-semibold text-text-primary">Analysis Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-cyber">
                  <h4 className="font-semibold text-text-primary mb-2">Quick Analysis</h4>
                  <p className="text-sm">Basic wallet overview with key metrics and recent activity</p>
                </div>
                <div className="card-cyber">
                  <h4 className="font-semibold text-text-primary mb-2">Deep Analysis</h4>
                  <p className="text-sm">Comprehensive analysis with full transaction history and risk assessment</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-text-primary">Metrics Provided</h3>
              <ul className="space-y-2 ml-4">
                <li>• Current balance and token holdings</li>
                <li>• Transaction count and history</li>
                <li>• Risk score and assessment</li>
                <li>• Fund flow patterns</li>
                <li>• Cross-chain activity</li>
              </ul>
            </div>
          </div>
        )

      case 'tax-calculations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary font-oxanium">Tax Calculations</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Automated tax reporting with detailed capital gains calculations, cost basis tracking, and regulatory compliance.
              </p>

              <h3 className="text-lg font-semibold text-text-primary">Supported Methods</h3>
              <div className="space-y-3">
                {['FIFO (First In, First Out)', 'LIFO (Last In, First Out)', 'Specific Identification', 'Average Cost'].map((method) => (
                  <div key={method} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{method}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-text-primary">Features</h3>
              <ul className="space-y-2 ml-4">
                <li>• Automated capital gains calculations</li>
                <li>• Cost basis tracking and optimization</li>
                <li>• Multi-jurisdiction tax compliance</li>
                <li>• Real-time tax liability estimates</li>
                <li>• Export capabilities for tax filing</li>
              </ul>
            </div>
          </div>
        )

      case 'api-reference':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary font-oxanium">API Reference</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Integrate LYNX analytics into your applications with our comprehensive REST API.
              </p>

              <h3 className="text-lg font-semibold text-text-primary">Authentication</h3>
              <div className="p-4 bg-surface border border-border rounded-lg">
                <p className="text-sm font-mono text-primary">Authorization: Bearer YOUR_API_KEY</p>
              </div>

              <h3 className="text-lg font-semibold text-text-primary">Endpoints</h3>
              <div className="space-y-3">
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <p className="text-sm font-mono text-accent">GET /api/v1/wallet/{'{address}'}/analysis</p>
                  <p className="text-sm mt-1">Get comprehensive wallet analysis</p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <p className="text-sm font-mono text-accent">POST /api/v1/ai/query</p>
                  <p className="text-sm mt-1">Submit natural language queries</p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <p className="text-sm font-mono text-accent">GET /api/v1/tax/{'{address}'}/report</p>
                  <p className="text-sm mt-1">Generate tax reports</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'faq':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary font-oxanium">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="card-cyber">
                <h3 className="font-semibold text-text-primary mb-2">How accurate is the analysis?</h3>
                <p className="text-text-muted text-sm">
                  Our analysis is based on publicly available blockchain data and provides high accuracy for standard transactions. Complex DeFi interactions may require additional review.
                </p>
              </div>

              <div className="card-cyber">
                <h3 className="font-semibold text-text-primary mb-2">Which blockchains do you support?</h3>
                <p className="text-text-muted text-sm">
                  We currently support Ethereum, Bitcoin, Solana, and Polygon. More chains are being added regularly.
                </p>
              </div>

              <div className="card-cyber">
                <h3 className="font-semibold text-text-primary mb-2">Is my data secure?</h3>
                <p className="text-text-muted text-sm">
                  Yes, we only analyze publicly available blockchain data. We don't store private keys or sensitive information.
                </p>
              </div>

              <div className="card-cyber">
                <h3 className="font-semibold text-text-primary mb-2">How often is data updated?</h3>
                <p className="text-text-muted text-sm">
                  Data is updated in real-time for most blockchains. Some historical data may have slight delays.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="section-cyber">
      <Header />
      
      <main className="container mx-auto px-4 py-16 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-oxanium">
              <span className="text-gradient-primary">Documentation</span>
            </h1>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Comprehensive guides and reference materials to help you make the most of LYNX's powerful blockchain analytics capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Sections</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-bg-0'
                          : 'text-text-muted hover:text-text-primary hover:bg-bg-1'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="card-cyber">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
