import React from 'react'
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-bg-0">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
          poster="/heroSectionVid.mp4"
        >
          <source src="/heroSectionVid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-bg-0/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-0/20 to-bg-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-text-primary px-4 max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight animate-fade-in font-orbitron">
          <span className="text-gradient-primary text-shadow-neon">
            LYNX
          </span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary animate-fade-in font-orbitron" style={{ animationDelay: '0.3s' }}>
          Ledger Yield & Node eXplorer
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-text-muted max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Advanced blockchain analytics platform powered by AI for comprehensive wallet analysis, 
          intelligent fund flow tracking, and multi-chain token detection with real-time insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Link 
            to="/intelligent-agent" 
            className="btn-cyber-primary group"
          >
            <span className="flex items-center space-x-3">
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Try Intelligent Agent</span>
            </span>
          </Link>
          
          <Link 
            to="/traditional-analysis" 
            className="btn-cyber-secondary group"
          >
            <span className="flex items-center space-x-3">
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Traditional Analysis</span>
            </span>
          </Link>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Matrix background effect */}
      <div className="absolute inset-0 bg-matrix opacity-5"></div>
    </section>
  )
}
