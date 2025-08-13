import React, { useState } from 'react'
import { Header } from '../components/Header'

export function IntelligentAgentPage() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', content: 'Hello! I\'m your AI assistant. I can help you analyze blockchain data, track wallet activities, and provide insights. What would you like to explore today?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { id: Date.now(), type: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        type: 'ai', 
        content: 'I\'m analyzing your request. This is a simulated response - in the real application, I would process your query and provide detailed blockchain insights.' 
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

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
              <div className="card-cyber h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-primary text-bg-0'
                            : 'bg-surface border border-border text-text-primary'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-surface border border-border text-text-primary px-4 py-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="spinner-cyber"></div>
                          <span className="text-sm">Analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-border">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about wallet analysis, fund flows, or blockchain insights..."
                      className="input-cyber flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="btn-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
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
                  </li>
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
                    onClick={() => setInputValue('Analyze wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                    className="w-full text-left p-3 rounded-lg bg-bg-1 border border-border hover:border-primary transition-colors text-text-muted hover:text-text-primary"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-sm">Analyze Sample Wallet</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setInputValue('Track fund flows for the last 24 hours')}
                    className="w-full text-left p-3 rounded-lg bg-bg-1 border border-border hover:border-primary transition-colors text-text-muted hover:text-text-primary"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-sm">Track Fund Flows</span>
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
