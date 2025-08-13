'use client'

import React from 'react'
import { 
  ArrowRightIcon, 
  BanknotesIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CubeIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { WalletAnalysisService, type WalletAnalysis } from '@/services/walletAnalysis'

interface AnalysisResultsProps {
  results: WalletAnalysis
  isLoading: boolean
}

export function AnalysisResults({ results, isLoading }: AnalysisResultsProps) {
  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
      case 'bsc':
      case 'polygon':
        return <CubeIcon className="h-5 w-5 text-blue-600" />
      case 'bitcoin':
        return <BanknotesIcon className="h-5 w-5 text-orange-600" />
      case 'solana':
        return <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
      default:
        return <CubeIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
      case 'bsc':
      case 'polygon':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'bitcoin':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'solana':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBlockchainName = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
        return 'Ethereum (ETH)'
      case 'bsc':
        return 'Binance Smart Chain (BNB)'
      case 'polygon':
        return 'Polygon (MATIC)'
      case 'bitcoin':
        return 'Bitcoin (BTC)'
      case 'solana':
        return 'Solana (SOL)'
      default:
        return blockchain
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner mr-3" />
          <span className="text-secondary-600">Analyzing wallet...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Wallet Analysis</h3>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBlockchainColor(results.blockchain)}`}>
            {getBlockchainIcon(results.blockchain)}
            <span className="ml-1 capitalize">{getBlockchainName(results.blockchain)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-secondary-600">Native Balance</p>
            <p className="text-2xl font-bold text-secondary-900">{results.balance.native}</p>
            <p className="text-sm text-secondary-500">{WalletAnalysisService.formatUSDValue(results.balance.usdValue)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary-600">Total Tokens</p>
            <p className="text-2xl font-bold text-secondary-900">{results.totalTokens}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary-600">Total Transactions</p>
            <p className="text-2xl font-bold text-secondary-900">{results.transactionCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary-600">Token Transactions</p>
            <p className="text-2xl font-bold text-secondary-900">{results.tokenTransactionCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary-600">Current Total Value</p>
            <p className="text-2xl font-bold text-secondary-900">{WalletAnalysisService.formatUSDValue(results.balance.usdValue + results.tokens.reduce((sum, token) => sum + token.usdValue, 0))}</p>
          </div>
        </div>
      </div>

      {/* Top Tokens Card */}
      {results.topTokens.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <FireIcon className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-secondary-900">Top 5 Most Valuable Tokens</h3>
          </div>
          
          <div className="space-y-3">
            {results.topTokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{token.symbol}</p>
                    <p className="text-sm text-secondary-600">{token.balance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900">{WalletAnalysisService.formatUSDValue(token.usdValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions Card */}
      {results.recentTransactions.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-secondary-900">Recent Transactions (Last 10)</h3>
          </div>
          
          <div className="space-y-3">
            {results.recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-secondary-900 truncate">
                      {WalletAnalysisService.formatAddress(tx.from)}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-secondary-900 truncate">
                      {WalletAnalysisService.formatAddress(tx.to)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-sm text-secondary-600">{tx.value} {tx.currency}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'in' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {tx.type === 'in' ? 'Received' : 'Sent'}
                    </span>
                    <span className="text-xs text-secondary-500 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary-500">Hash</p>
                  <p className="text-xs font-mono text-secondary-600">{WalletAnalysisService.formatAddress(tx.hash)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Trading Value Card */}
      <div className="card">
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-secondary-900">Historical Trading Activity</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600">Historical Trading Value</p>
            <p className="text-2xl font-bold text-green-800">{WalletAnalysisService.formatUSDValue(results.totalLifetimeValue)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600">Transaction Count</p>
            <p className="text-2xl font-bold text-blue-800">{results.transactionCount}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600">Token Diversity</p>
            <p className="text-2xl font-bold text-purple-800">{results.totalTokens}</p>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Wallet Details</h3>
        <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <p className="text-sm text-secondary-600 mb-1">Address</p>
          <p className="font-mono text-secondary-900 break-all">{results.address}</p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-secondary-500">
        Last updated: {new Date(results.lastUpdated).toLocaleString()}
      </div>
    </div>
  )
} 
