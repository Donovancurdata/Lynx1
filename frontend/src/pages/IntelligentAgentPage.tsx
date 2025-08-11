import React from 'react'
import { Header } from '../components/Header'
import { IntelligentAgentChat } from '../components/IntelligentAgentChat'

export function IntelligentAgentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-medium">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Intelligent Agent</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              AI-powered blockchain analysis with natural language conversations and intelligent insights
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 slide-up">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="card-elevated h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900">AI Assistant</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-500">Online</span>
                  </div>
                </div>
                <div className="flex-1">
                  <IntelligentAgentChat />
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="card-elevated">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Features</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Natural language conversations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Real-time progressive analysis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Intelligent insights and recommendations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Multi-blockchain support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Risk assessment and pattern detection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Autonomous decision making</span>
                  </li>
                </ul>
              </div>

              <div className="card-elevated">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">How to Use</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">Analyze a wallet:</p>
                    <p className="text-slate-600">"Analyze wallet 0x123..."</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">Ask questions:</p>
                    <p className="text-slate-600">"What is blockchain?"</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">Get help:</p>
                    <p className="text-slate-600">"What can you do?"</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-700">Deep analysis:</p>
                    <p className="text-slate-600">"Do a deep analysis of..."</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Quick Examples</h3>
                </div>
                <div className="space-y-3">
                  <button className="block w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300">
                    <span className="font-medium">"Analyze this wallet: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"</span>
                  </button>
                  <button className="block w-full text-left p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all duration-200 border border-green-200 hover:border-green-300">
                    <span className="font-medium">"What are the risks of high-value wallets?"</span>
                  </button>
                  <button className="block w-full text-left p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300">
                    <span className="font-medium">"Explain how blockchain works"</span>
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
