import { TokenDataCollector } from '../services/TokenDataCollector'
import * as dotenv from 'dotenv'

dotenv.config()

async function collectWalletTokensAzure() {
  console.log('🔍 Collecting Wallet Tokens (Azure Storage)...\n')
  
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
    
    // Store tokens in Azure
    console.log('\n📝 Storing tokens in Azure Data Lake Storage...')
    await collector.storeTokens(uniqueTokens)
    console.log('✅ Tokens stored successfully in Azure!')
    
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
    
    // Now collect prices for all tokens and store in Azure
    console.log('\n💰 Collecting prices for all tokens...')
    const tokenValues = await collector.collectCurrentPrices()
    
    console.log(`\n📊 Price Collection Summary:`)
    console.log(`   • Total tokens: ${uniqueTokens.length}`)
    console.log(`   • Prices collected: ${tokenValues.length}`)
    console.log(`   • Success rate: ${((tokenValues.length / uniqueTokens.length) * 100).toFixed(1)}%`)
    
    // Show top tokens by value
    const sortedTokens = tokenValues
      .filter(t => t.price > 0)
      .sort((a, b) => b.price - a.price)
    
    console.log('\n🏆 Top 10 Tokens by Price:')
    sortedTokens.slice(0, 10).forEach((token, index) => {
      const tokenInfo = uniqueTokens.find(t => t.id === token.tokenId)
      const symbol = tokenInfo?.symbol || 'Unknown'
      console.log(`   ${index + 1}. ${symbol}: $${token.price.toFixed(6)} (${tokenInfo?.blockchain})`)
    })
    
    console.log('\n🎉 Wallet token collection and Azure storage completed successfully!')
    console.log('📁 Data stored in Azure Data Lake Storage Gen 2')
    console.log('📄 Files: tokens.json, token-values-YYYY-MM-DD.json')
    
  } catch (error) {
    console.error('❌ Error collecting wallet tokens:', error)
  }
}

// Run the collection
collectWalletTokensAzure().catch(console.error) 