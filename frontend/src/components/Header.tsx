import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="nav-cyber fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-neon group-hover:shadow-neon-accent transition-all duration-300">
              <svg className="w-6 h-6 text-bg-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold font-orbitron text-gradient-primary">LYNX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/intelligent-agent" 
              className={`nav-link-cyber font-orbitron ${isActive('/intelligent-agent') ? 'active' : ''}`}
            >
              Intelligent Agent
            </Link>
            <Link 
              to="/traditional-analysis" 
              className={`nav-link-cyber font-orbitron ${isActive('/traditional-analysis') ? 'active' : ''}`}
            >
              Traditional Analysis
            </Link>
            <Link 
              to="/tax-calculations" 
              className={`nav-link-cyber font-orbitron ${isActive('/tax-calculations') ? 'active' : ''}`}
            >
              Tax Calculations
            </Link>
            <Link 
              to="/documentation" 
              className={`nav-link-cyber font-orbitron ${isActive('/documentation') ? 'active' : ''}`}
            >
              Documentation
            </Link>
            <Link 
              to="/about" 
              className={`nav-link-cyber font-orbitron ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border hover:border-primary transition-colors duration-300"
          >
            <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/intelligent-agent" 
                className={`nav-link-cyber font-orbitron ${isActive('/intelligent-agent') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Intelligent Agent
              </Link>
              <Link 
                to="/traditional-analysis" 
                className={`nav-link-cyber font-orbitron ${isActive('/traditional-analysis') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Traditional Analysis
              </Link>
              <Link 
                to="/tax-calculations" 
                className={`nav-link-cyber font-orbitron ${isActive('/tax-calculations') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tax Calculations
              </Link>
              <Link 
                to="/documentation" 
                className={`nav-link-cyber font-orbitron ${isActive('/documentation') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link 
                to="/about" 
                className={`nav-link-cyber font-orbitron ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 