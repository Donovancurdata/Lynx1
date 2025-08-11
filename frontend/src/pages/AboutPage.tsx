import React from 'react'
import { Header } from '../components/Header'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-medium">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">About LYNX</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Pioneering the future of blockchain analytics with AI-powered insights and comprehensive multi-chain analysis
            </p>
          </div>

          {/* Mission Section */}
          <div className="card-elevated mb-12 slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
                To democratize blockchain analytics by providing professional-grade tools that make complex 
                blockchain data accessible, understandable, and actionable for everyone from individual investors 
                to institutional clients.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Innovation</h3>
              <p className="text-slate-600">
                Continuously pushing the boundaries of what's possible with AI and blockchain technology
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Security</h3>
              <p className="text-slate-600">
                Ensuring the highest standards of data security and privacy for our users
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600">
                Building a global community of blockchain enthusiasts and professionals
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="card-elevated mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
                <p className="text-slate-600 mb-4">
                  LYNX was born from the recognition that blockchain analytics was becoming increasingly complex 
                  and inaccessible to the average user. While institutional players had access to sophisticated 
                  tools, individual investors and small businesses were left behind.
                </p>
                <p className="text-slate-600 mb-4">
                  Our founders, experienced in both blockchain technology and financial analytics, set out to 
                  bridge this gap by creating an AI-powered platform that could provide professional-grade 
                  insights in an intuitive, user-friendly interface.
                </p>
                <p className="text-slate-600">
                  Today, LYNX serves thousands of users worldwide, from crypto enthusiasts to financial 
                  professionals, helping them make informed decisions in the rapidly evolving blockchain ecosystem.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Key Milestones</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Platform Launch</h4>
                      <p className="text-blue-100 text-sm">Initial release with Ethereum and Bitcoin support</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">AI Integration</h4>
                      <p className="text-blue-100 text-sm">Intelligent Agent launched with natural language processing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Multi-Chain Expansion</h4>
                      <p className="text-blue-100 text-sm">Added support for Solana, Polygon, and BSC</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Tax Solutions</h4>
                      <p className="text-blue-100 text-sm">Automated tax calculation and reporting features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="card-elevated mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">JD</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">John Doe</h3>
                <p className="text-blue-600 font-medium mb-2">CEO & Co-Founder</p>
                <p className="text-slate-600 text-sm">
                  Former blockchain researcher with 10+ years in fintech. Led development teams at major crypto exchanges.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">JS</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Jane Smith</h3>
                <p className="text-green-600 font-medium mb-2">CTO & Co-Founder</p>
                <p className="text-slate-600 text-sm">
                  AI/ML expert with PhD in Computer Science. Previously built analytics platforms for Fortune 500 companies.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">MJ</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Mike Johnson</h3>
                <p className="text-purple-600 font-medium mb-2">Head of Product</p>
                <p className="text-slate-600 text-sm">
                  Product strategist with deep experience in DeFi and blockchain infrastructure. Former product lead at major protocols.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">SL</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Sarah Lee</h3>
                <p className="text-orange-600 font-medium mb-2">Head of Engineering</p>
                <p className="text-slate-600 text-sm">
                  Full-stack engineer specializing in blockchain applications. Built scalable systems for crypto trading platforms.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">DW</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">David Wilson</h3>
                <p className="text-teal-600 font-medium mb-2">Head of Research</p>
                <p className="text-slate-600 text-sm">
                  Blockchain researcher and data scientist. Published author on DeFi analytics and risk assessment.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">AB</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Alice Brown</h3>
                <p className="text-indigo-600 font-medium mb-2">Head of Design</p>
                <p className="text-slate-600 text-sm">
                  UX/UI designer focused on making complex data accessible. Previously designed interfaces for financial platforms.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="card-elevated">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <p className="text-slate-600 text-sm">hello@lynx.com</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
                <p className="text-slate-600 text-sm">San Francisco, CA</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Support</h3>
                <p className="text-slate-600 text-sm">support@lynx.com</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                <p className="text-slate-600 text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
