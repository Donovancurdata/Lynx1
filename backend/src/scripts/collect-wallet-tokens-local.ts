import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

async function collectWalletTokensLocal() {
  console.log('🔍 Collecting Wallet Tokens (Local Storage)...\n')
  
  const collector = new TokenDataCollector()
  
  try {
    const walletAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
    console.log(`📊 Analyzing wallet: ${walletAddress}`)
    
    // Collect tokens from each blockchain
    const blockchains = ['ethereum', 'bsc', 'polygon', 'avalanche']
    const allTokens: any[] = []
    
    for (const blockchain of blockchains) {
      try {
        console.log(`\n🔍 Collecting ${blockchain} tokens...`)
        const blockchainTokens = await collector.getBlockchainTokens(walletAddress, blockchain)
        console.log(`✅ Found ${blockchainTokens.length} ${blockchain} tokens`)
        allTokens.push(...blockchainTokens)
      } catch (error) {
        console.error(`❌ Error collecting ${blockchain} tokens:`, error)
      }
    }
    
    // Remove duplicates
    const uniqueTokens = allTokens.filter((token, index, self) => 
      index === self.findIndex(t => t.id === token.id)
    )
    
    console.log(`\n📊 Total unique tokens found: ${uniqueTokens.length}`)
    
    // Save to local file
    const resultsDir = path.join(__dirname, '../../results')
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true })
    }
    
    const tokensFile = path.join(resultsDir, 'wallet-tokens-local.json')
    fs.writeFileSync(tokensFile, JSON.stringify(uniqueTokens, null, 2))
    
    console.log(`📁 Tokens saved to: ${tokensFile}`)
    
    // Show summary by blockchain
    const byBlockchain = uniqueTokens.reduce((acc, token) => {
      if (!acc[token.blockchain]) {
        acc[token.blockchain] = []
      }
      acc[token.blockchain].push(token)
      return acc
    }, {} as any)
    
    console.log('\n📋 Token Summary by Blockchain:')
    Object.entries(byBlockchain).forEach(([blockchain, tokens]: [string, any]) => {
      console.log(`\n   ${blockchain.toUpperCase()} (${tokens.length} tokens):`)
      tokens.slice(0, 5).forEach((token: any, index: number) => {
        console.log(`     ${index + 1}. ${token.symbol} - ${token.name}`)
      })
      if (tokens.length > 5) {
        console.log(`     ... and ${tokens.length - 5} more tokens`)
      }
    })
    
    // Now collect prices for all tokens
    console.log('\n💰 Collecting prices for all tokens...')
    const tokenPrices: any[] = []
    
    for (const token of uniqueTokens) {
      try {
        console.log(`\n🔍 Getting price for ${token.symbol} (${token.blockchain})...`)
        const priceData = await collector.getAccurateTokenPrice(token.symbol, token.blockchain)
        
        if (priceData) {
          console.log(`✅ ${token.symbol}: $${priceData.price}`)
          tokenPrices.push({
            tokenId: token.id,
            symbol: token.symbol,
            name: token.name,
            blockchain: token.blockchain,
            address: token.address,
            price: priceData.price,
            high: priceData.high,
            low: priceData.low,
            volume: priceData.volume,
            marketCap: priceData.marketCap,
            timestamp: new Date().toISOString()
          })
        } else {
          console.log(`❌ No price data for ${token.symbol}`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`❌ Error getting price for ${token.symbol}:`, error)
      }
    }
    
    // Save prices to local file
    const pricesFile = path.join(resultsDir, 'token-prices-local.json')
    fs.writeFileSync(pricesFile, JSON.stringify(tokenPrices, null, 2))
    
    console.log(`\n📁 Token prices saved to: ${pricesFile}`)
    console.log(`✅ Successfully collected prices for ${tokenPrices.length} out of ${uniqueTokens.length} tokens`)
    
    // Show top tokens by value
    const sortedTokens = tokenPrices
      .filter(t => t.price > 0)
      .sort((a, b) => b.price - a.price)
    
    console.log('\n🏆 Top 10 Tokens by Price:')
    sortedTokens.slice(0, 10).forEach((token, index) => {
      console.log(`   ${index + 1}. ${token.symbol}: $${token.price} (${token.blockchain})`)
    })
    
  } catch (error) {
    console.error('❌ Error collecting wallet tokens:', error)
  }
}

// Run the collection
collectWalletTokensLocal().catch(console.error) 