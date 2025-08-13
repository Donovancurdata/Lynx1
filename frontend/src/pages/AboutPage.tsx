import React from 'react'
import { Header } from '../components/Header'

export function AboutPage() {
  return (
    <div className="section-cyber">
      <Header />
      
      <main className="container mx-auto px-4 py-16 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-oxanium">
              <span className="text-gradient-primary">About LYNX</span>
            </h1>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Revolutionizing blockchain analytics with AI-powered insights, comprehensive wallet analysis, 
              and automated tax reporting across multiple chains.
            </p>
          </div>

          {/* Mission Section */}
          <div className="card-cyber mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text-primary mb-6 font-oxanium">Our Mission</h2>
              <p className="text-lg text-text-muted max-w-4xl mx-auto leading-relaxed">
                LYNX (Ledger Yield & Node eXplorer) is dedicated to democratizing blockchain analytics by providing 
                professional-grade tools that make complex blockchain data accessible, understandable, and actionable 
                for everyone from individual investors to institutional clients.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">AI-Powered Analysis</h3>
              </div>
              <p className="text-text-muted">
                Advanced artificial intelligence provides natural language insights and intelligent pattern recognition 
                across multiple blockchain networks.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Multi-Chain Support</h3>
              </div>
              <p className="text-text-muted">
                Comprehensive analysis across Ethereum, Bitcoin, Solana, Polygon, and more with unified reporting 
                and cross-chain insights.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Tax Compliance</h3>
              </div>
              <p className="text-text-muted">
                Automated tax reporting with support for multiple accounting methods and regulatory compliance 
                across jurisdictions.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Real-Time Data</h3>
              </div>
              <p className="text-text-muted">
                Live monitoring and instant updates with real-time transaction tracking and market data 
                across all supported networks.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Risk Assessment</h3>
              </div>
              <p className="text-text-muted">
                Advanced risk detection algorithms identify suspicious patterns, potential scams, 
                and security vulnerabilities in real-time.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Professional Tools</h3>
              </div>
              <p className="text-text-muted">
                Enterprise-grade analytics with professional reporting, data export capabilities, 
                and API integration for custom workflows.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="card-cyber mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center font-oxanium">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Blockchain Experts</h3>
                <p className="text-text-muted text-sm">
                  Seasoned professionals with deep expertise in blockchain technology, 
                  DeFi protocols, and cryptocurrency markets.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">AI Researchers</h3>
                <p className="text-text-muted text-sm">
                  Machine learning specialists developing cutting-edge AI models for 
                  blockchain data analysis and pattern recognition.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Software Engineers</h3>
                <p className="text-text-muted text-sm">
                  Full-stack developers building robust, scalable platforms with 
                  modern technologies and best practices.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="card-cyber">
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center font-oxanium">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Contact Information</h3>
                <div className="space-y-3 text-text-muted">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@lynx.analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <span>lynx.analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Global - Remote First</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4 font-oxanium">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                    <svg className="w-5 h-5 text-text-muted hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                    <svg className="w-5 h-5 text-text-muted hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                    <svg className="w-5 h-5 text-text-muted hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
