'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Blockchain {
  id: string
  name: string
  symbol: string
  icon: string
}

const blockchains: Blockchain[] = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '🟡' },
  { id: 'binance', name: 'Binance Smart Chain', symbol: 'BNB', icon: '🟡' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '🟣' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '🟢' },
]

interface BlockchainSelectorProps {
  selected: string
  onSelect: (blockchain: string) => void
}

export function BlockchainSelector({ selected, onSelect }: BlockchainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedBlockchain = blockchains.find(b => b.id === selected) || blockchains[0]

  return (
    <div className="relative">
      <label htmlFor="blockchain" className="block text-sm font-medium text-secondary-700 mb-2">
        Select Blockchain
      </label>
      
      <div className="relative">
        <button
          type="button"
          className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border border-secondary-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <span className="text-lg mr-3">{selectedBlockchain.icon}</span>
            <span className="block truncate">{selectedBlockchain.name}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="h-5 w-5 text-secondary-400" aria-hidden="true" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {blockchains.map((blockchain) => (
              <button
                key={blockchain.id}
                className={`relative cursor-default select-none py-2 pl-3 pr-9 w-full text-left ${
                  blockchain.id === selected
                    ? 'bg-primary-600 text-white'
                    : 'text-secondary-900 hover:bg-secondary-100'
                }`}
                onClick={() => {
                  onSelect(blockchain.id)
                  setIsOpen(false)
                }}
              >
                <span className="flex items-center">
                  <span className="text-lg mr-3">{blockchain.icon}</span>
                  <span className="block truncate">{blockchain.name}</span>
                </span>
                {blockchain.id === selected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
