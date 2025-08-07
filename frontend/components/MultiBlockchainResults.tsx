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
import { WalletAnalysisService, type MultiBlockchainAnalysis, type WalletAnalysis } from '@/services/walletAnalysis'

interface MultiBlockchainResultsProps {
  results: MultiBlockchainAnalysis
  isLoading: boolean
}

export function MultiBlockchainResults({ results, isLoading }: MultiBlockchainResultsProps) {
  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
      case 'bsc':
      case 'polygon':
      case 'avalanche':
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
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'bsc':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'polygon':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'avalanche':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'bitcoin':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'solana':
        return 'bg-green-100 text-green-800 border-green-200'
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
      case 'avalanche':
        return 'Avalanche (AVAX)'
      case 'bitcoin':
        return 'Bitcoin (BTC)'
      case 'solana':
        return 'Solana (SOL)'
      default:
        return blockchain
    }
  }

  const BlockchainSection = ({ blockchain, analysis }: { blockchain: string, analysis: WalletAnalysis }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Wallet Analysis</h3>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBlockchainColor(blockchain)}`}>
          {getBlockchainIcon(blockchain)}
          <span className="ml-1 capitalize">{getBlockchainName(blockchain)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-secondary-600">Native Balance</p>
          <p className="text-2xl font-bold text-secondary-900">{analysis.balance.native}</p>
          <p className="text-sm text-secondary-500">{WalletAnalysisService.formatUSDValue(analysis.balance.usdValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary-600">Total Tokens</p>
          <p className="text-2xl font-bold text-secondary-900">{analysis.totalTokens}</p>
          <p className="text-sm text-secondary-500">Different tokens</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary-600">Total Transactions</p>
          <p className="text-2xl font-bold text-secondary-900">{analysis.transactionCount}</p>
          <p className="text-sm text-secondary-500">All time</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary-600">Token Transactions</p>
          <p className="text-2xl font-bold text-secondary-900">{analysis.tokenTransactionCount}</p>
          <p className="text-sm text-secondary-500">Token transfers</p>
        </div>
      </div>

      {/* Current Total Value */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="text-center">
          <p className="text-sm text-secondary-600">Current Total Value</p>
          <p className="text-2xl font-bold text-secondary-900">{WalletAnalysisService.formatUSDValue(analysis.balance.usdValue + analysis.tokens.reduce((sum, token) => sum + token.usdValue, 0))}</p>
        </div>
      </div>

      {/* Historical Trading Activity */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
          Historical Trading Activity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-secondary-600">Historical Trading Value</p>
            <p className="text-2xl font-bold text-secondary-900">{WalletAnalysisService.formatUSDValue(analysis.totalLifetimeValue)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-secondary-600">Total Transactions</p>
            <p className="text-2xl font-bold text-secondary-900">{analysis.transactionCount}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-secondary-600">Token Diversity</p>
            <p className="text-2xl font-bold text-secondary-900">{analysis.totalTokens}</p>
          </div>
        </div>
      </div>

      {/* Top Tokens */}
      {analysis.topTokens.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <FireIcon className="h-5 w-5 text-orange-600 mr-2" />
            Top 5 Most Valuable Tokens
          </h4>
          <div className="space-y-2">
            {analysis.topTokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-secondary-900">{token.symbol}</span>
                  <span className="text-sm text-secondary-500 ml-2">{token.balance}</span>
                </div>
                <span className="text-sm font-semibold text-secondary-900">{WalletAnalysisService.formatUSDValue(token.usdValue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {analysis.recentTransactions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
            Most Recent 10 Transactions
          </h4>
          <div className="space-y-2">
            {analysis.recentTransactions.slice(0, 10).map((tx, index) => {
              const txDate = new Date(tx.timestamp)
              const formattedDate = txDate.toLocaleDateString()
              const formattedTime = txDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {/* Left side - Transaction info */}
                  <div className="flex items-center flex-1">
                    <div className={`w-2 h-2 rounded-full mr-3 ${tx.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {tx.type === 'in' ? 'Received' : 'Sent'}
                      </div>
                      <div className="text-xs text-secondary-500">{WalletAnalysisService.formatAddress(tx.hash)}</div>
                    </div>
                  </div>
                  
                  {/* Middle - Date */}
                  <div className="text-center flex-1">
                    <div className="text-sm font-medium text-secondary-700">{formattedDate}</div>
                    <div className="text-xs text-secondary-500">{formattedTime}</div>
                  </div>
                  
                  {/* Right side - Amount */}
                  <div className="text-right flex-1">
                    <div className="text-sm font-semibold text-secondary-900">{tx.value}</div>
                    <div className="text-xs text-secondary-500">{tx.currency}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner mr-3" />
          <span className="text-secondary-600">Analyzing wallet across multiple blockchains...</span>
        </div>
      </div>
    )
  }

  const blockchainKeys = Object.keys(results.blockchains)
  
  if (blockchainKeys.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Data Found</h3>
          <p className="text-secondary-600">No activity found on any supported blockchain for this wallet address.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overall Summary */}
      <div className="card">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Multi-Blockchain Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-sm text-secondary-600">Total Value Across All Chains</p>
            <p className="text-2xl font-bold text-secondary-900">{WalletAnalysisService.formatUSDValue(results.totalValue)}</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-sm text-secondary-600">Total Transactions</p>
            <p className="text-2xl font-bold text-secondary-900">{results.totalTransactions}</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <p className="text-sm text-secondary-600">Active Blockchains</p>
            <p className="text-2xl font-bold text-secondary-900">{blockchainKeys.filter(blockchain => results.blockchains[blockchain].transactionCount > 0).length}</p>
          </div>
        </div>
      </div>

      {/* Individual Blockchain Sections - only show those with transactions */}
      {blockchainKeys
        .filter(blockchain => results.blockchains[blockchain].transactionCount > 0)
        .map((blockchain) => (
          <BlockchainSection 
            key={blockchain}
            blockchain={blockchain}
            analysis={results.blockchains[blockchain]}
          />
        ))}
    </div>
  )
} 