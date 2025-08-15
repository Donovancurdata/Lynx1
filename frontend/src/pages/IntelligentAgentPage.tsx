import React from 'react'
import { Header } from '../components/Header'
import { IntelligentAgentChat } from '../components/IntelligentAgentChat'

export function IntelligentAgentPage() {
  return (
    <div className="section-cyber">
      <Header />
      
      <main className="container mx-auto px-4 py-16 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-oxanium">
              <span className="text-gradient-primary">Intelligent Agent</span>
            </h1>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Interact with our AI-powered assistant for real-time blockchain analysis, 
              wallet insights, and intelligent fund flow tracking across multiple chains.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="h-[600px]">
                <IntelligentAgentChat className="h-full" />
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">AI Capabilities</h3>
                <ul className="space-y-3 text-text-muted">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Wallet analysis and risk assessment</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Fund flow tracking across chains</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Token detection and analysis</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Real-time market insights</span>
                  </li>clea
                </ul>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Supported Chains</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue rounded-full"></div>
                    <span className="text-text-muted text-sm">Ethereum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-text-muted text-sm">Bitcoin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-text-muted text-sm">Solana</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue rounded-full"></div>
                    <span className="text-text-muted text-sm">Polygon</span>
                  </div>
                </div>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      // This will be handled by the chat component
                      console.log('Sample wallet analysis requested');
                    }}
                    className="w-full text-left p-4 rounded-lg bg-bg-1 border border-border hover:border-primary hover:shadow-neon transition-all duration-300 text-text-muted hover:text-text-primary group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium font-oxanium">Analyze Sample Wallet</span>
                        <p className="text-xs text-text-muted mt-1">Get started with a demo analysis</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      // This will be handled by the chat component
                      console.log('Fund flow tracking requested');
                    }}
                    className="w-full text-left p-4 rounded-lg bg-bg-1 border border-border hover:border-accent hover:shadow-neon-accent transition-all duration-300 text-text-muted hover:text-text-primary group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium font-oxanium">Track Fund Flows</span>
                        <p className="text-xs text-text-muted mt-1">Monitor cross-chain transactions</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
