import React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { HeroSection } from '../components/HeroSection'

export function LandingPage() {
  return (
    <div className="section-cyber">
      <Header />
      
      {/* Hero Section with Video Background */}
      <HeroSection />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 slide-up">
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
                Natural language conversations with intelligent insights and real-time progressive analysis across multiple blockchains.
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
                Comprehensive analysis across Ethereum, Bitcoin, Solana, Polygon, and other major blockchains with unified reporting.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Tax Calculations</h3>
              </div>
              <p className="text-text-muted">
                Automated tax reporting with detailed capital gains calculations, cost basis tracking, and regulatory compliance.
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
                Advanced risk detection algorithms identify suspicious patterns, potential scams, and security vulnerabilities.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Real-Time Tracking</h3>
              </div>
              <p className="text-text-muted">
                Live monitoring of wallet activities, fund flows, and market movements with instant notifications and alerts.
              </p>
            </div>

            <div className="card-cyber">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary font-oxanium">Comprehensive Reports</h3>
              </div>
              <p className="text-text-muted">
                Detailed analytics reports with visualizations, historical data, and exportable formats for professional use.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-8 font-oxanium">Get Started Today</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/intelligent-agent" className="card-cyber hover:shadow-neon transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 font-oxanium">Intelligent Agent</h3>
                  <p className="text-text-muted text-sm">AI-powered analysis and insights</p>
                </div>
              </Link>

              <Link to="/traditional-analysis" className="card-cyber hover:shadow-neon transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 font-oxanium">Traditional Analysis</h3>
                  <p className="text-text-muted text-sm">Comprehensive wallet analytics</p>
                </div>
              </Link>

              <Link to="/tax-calculations" className="card-cyber hover:shadow-neon transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 font-oxanium">Tax Calculations</h3>
                  <p className="text-text-muted text-sm">Automated tax reporting</p>
                </div>
              </Link>

              <Link to="/documentation" className="card-cyber hover:shadow-neon transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 font-oxanium">Documentation</h3>
                  <p className="text-text-muted text-sm">Learn how to use LYNX</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
