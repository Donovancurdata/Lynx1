// Using built-in fetch (Node.js 18+)

async function testQuickVsDeepAnalysis() {
  const testAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
  const baseUrl = 'http://localhost:3001/api/v1/wallet'

  console.log('🧪 Testing Quick vs Deep Analysis System')
  console.log('=' .repeat(50))

  // Test 1: Quick Analysis
  console.log('\n🚀 Test 1: Quick Analysis (should be fast)')
  console.log('⏱️  Starting quick analysis...')
  const quickStart = Date.now()
  
  try {
    const quickResponse = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address: testAddress, 
        deepAnalysis: false 
      })
    })
    
    const quickResult = await quickResponse.json()
    const quickTime = Date.now() - quickStart
    
    console.log(`✅ Quick analysis completed in ${quickTime}ms`)
    console.log(`📊 Results:`)
    
    if (quickResult.success && quickResult.data) {
      console.log(`   • Total Value: $${(quickResult.data.totalValue || 0).toFixed(2)}`)
      console.log(`   • Total Transactions: ${quickResult.data.totalTransactions || 0}`)
      console.log(`   • Blockchains: ${Object.keys(quickResult.data.blockchains || {}).join(', ')}`)
      
      // Show token counts for each blockchain
      Object.entries(quickResult.data.blockchains || {}).forEach(([blockchain, analysis]) => {
        console.log(`   • ${blockchain.toUpperCase()}: ${analysis.totalTokens || 0} tokens, ${analysis.transactionCount || 0} transactions`)
      })
    } else {
      console.log(`   ❌ Analysis failed: ${quickResult.error || 'Unknown error'}`)
    }
    
  } catch (error) {
    console.error('❌ Quick analysis failed:', error.message)
  }

  // Test 2: Deep Analysis
  console.log('\n🔍 Test 2: Deep Analysis (should be comprehensive)')
  console.log('⏱️  Starting deep analysis...')
  const deepStart = Date.now()
  
  try {
    const deepResponse = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address: testAddress, 
        deepAnalysis: true 
      })
    })
    
    const deepResult = await deepResponse.json()
    const deepTime = Date.now() - deepStart
    
    console.log(`✅ Deep analysis completed in ${deepTime}ms`)
    console.log(`📊 Results:`)
    
    if (deepResult.success && deepResult.data) {
      console.log(`   • Total Value: $${(deepResult.data.totalValue || 0).toFixed(2)}`)
      console.log(`   • Total Transactions: ${deepResult.data.totalTransactions || 0}`)
      console.log(`   • Blockchains: ${Object.keys(deepResult.data.blockchains || {}).join(', ')}`)
      
      // Show detailed token information for each blockchain
      Object.entries(deepResult.data.blockchains || {}).forEach(([blockchain, analysis]) => {
        console.log(`   • ${blockchain.toUpperCase()}: ${analysis.totalTokens || 0} tokens, ${analysis.transactionCount || 0} transactions`)
        
        // Show top tokens with values
        if (analysis.topTokens && analysis.topTokens.length > 0) {
          console.log(`     Top tokens:`)
          analysis.topTokens.slice(0, 3).forEach(token => {
            console.log(`       - ${token.symbol}: ${token.balance} ($${(token.usdValue || 0).toFixed(2)})`)
          })
        }
      })
    } else {
      console.log(`   ❌ Analysis failed: ${deepResult.error || 'Unknown error'}`)
    }
    
  } catch (error) {
    console.error('❌ Deep analysis failed:', error.message)
  }

  console.log('\n🎯 Analysis Complete!')
  console.log('💡 Quick analysis provides basic metrics fast')
  console.log('💡 Deep analysis provides detailed token values and comprehensive data')
}

// Run the test
testQuickVsDeepAnalysis().catch(console.error) 