'use client'

import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface WalletInputProps {
  onAnalyze: (address: string) => void
  isLoading: boolean
}

export function WalletInput({ onAnalyze, isLoading }: WalletInputProps) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [detectedBlockchain, setDetectedBlockchain] = useState<string>('')

  const detectBlockchain = (addr: string): string => {
    // Ethereum/Sub Chains addresses
    if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return 'Ethereum/Sub Chains'
    }
    
    // Bitcoin addresses
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(addr)) {
      return 'Bitcoin'
    }
    
    // Solana addresses
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) {
      return 'Solana'
    }
    
    return ''
  }

  const validateAddress = (addr: string): boolean => {
    // Check if it matches any blockchain pattern
    return detectBlockchain(addr) !== ''
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    setAddress(newAddress)
    setError('')
    
    if (newAddress.trim()) {
      const blockchain = detectBlockchain(newAddress.trim())
      setDetectedBlockchain(blockchain)
      
      if (!blockchain) {
        setError('Invalid wallet address format')
      }
    } else {
      setDetectedBlockchain('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!address.trim()) {
      setError('Please enter a wallet address')
      return
    }

    if (!validateAddress(address.trim())) {
      setError('Invalid wallet address format')
      return
    }

    onAnalyze(address.trim())
  }

  const getPlaceholder = (): string => {
    return 'Enter any wallet address (Ethereum, Bitcoin, Solana, etc.)'
  }

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case 'Ethereum/Sub Chains':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Bitcoin':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Solana':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain) {
      case 'Ethereum/Sub Chains':
        return '🔷'
      case 'Bitcoin':
        return '🟠'
      case 'Solana':
        return '🟣'
      default:
        return '🔘'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="wallet-address" className="block text-sm font-medium text-secondary-700 mb-2">
          Wallet Address
        </label>
        <div className="relative">
          <input
            type="text"
            id="wallet-address"
            value={address}
            onChange={handleAddressChange}
            placeholder={getPlaceholder()}
            className={`input-field pr-12 ${error ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
            )}
          </div>
        </div>
        
        {/* Blockchain Detection Display */}
        {detectedBlockchain && !error && (
          <div className="mt-3 p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getBlockchainIcon(detectedBlockchain)}</span>
                <div>
                  <p className="text-sm font-medium text-secondary-900">Detected Blockchain</p>
                  <p className={`text-sm font-semibold ${getBlockchainColor(detectedBlockchain).split(' ')[1]}`}>
                    {detectedBlockchain}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getBlockchainColor(detectedBlockchain)}`}>
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-1.5"></span>
                Valid Address
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !address.trim() || !detectedBlockchain}
        className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="loading-spinner mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Analyze Wallet
          </>
        )}
      </button>
    </form>
  )
} 