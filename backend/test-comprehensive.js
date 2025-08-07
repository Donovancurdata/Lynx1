// Comprehensive test of Quick vs Deep Analysis
async function testComprehensiveAnalysis() {
  const testAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b'
  const baseUrl = 'http://localhost:3001/api/v1/wallet'

  console.log('🧪 Comprehensive Quick vs Deep Analysis Test')
  console.log('=' .repeat(60))

  // Test with a fresh analysis (no caching)
  console.log('\n🚀 Phase 1: Quick Analysis (Basic Metrics Only)')
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
    
    if (quickResult.success && quickResult.data) {
      console.log(`📊 Quick Analysis Results:`)
      console.log(`   • Total Value: $${(quickResult.data.totalValue || 0).toFixed(2)}`)
      console.log(`   • Total Transactions: ${quickResult.data.totalTransactions || 0}`)
      console.log(`   • Blockchains: ${Object.keys(quickResult.data.blockchains || {}).join(', ')}`)
      
      // Show basic metrics for each blockchain
      Object.entries(quickResult.data.blockchains || {}).forEach(([blockchain, analysis]) => {
        console.log(`   • ${blockchain.toUpperCase()}:`)
        console.log(`     - Native Balance: ${analysis.balance?.native || '0'}`)
        console.log(`     - Token Count: ${analysis.totalTokens || 0}`)
        console.log(`     - Transaction Count: ${analysis.transactionCount || 0}`)
        console.log(`     - Token Values: ${analysis.tokens?.length ? 'Calculated' : 'Not calculated (quick mode)'}`)
      })
    } else {
      console.log(`   ❌ Quick analysis failed: ${quickResult.error || 'Unknown error'}`)
    }
    
  } catch (error) {
    console.error('❌ Quick analysis failed:', error.message)
  }

  // Wait a moment between tests
  console.log('\n⏳ Waiting 2 seconds before deep analysis...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test Deep Analysis
  console.log('\n🔍 Phase 2: Deep Analysis (Comprehensive Data)')
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
    
    if (deepResult.success && deepResult.data) {
      console.log(`📊 Deep Analysis Results:`)
      console.log(`   • Total Value: $${(deepResult.data.totalValue || 0).toFixed(2)}`)
      console.log(`   • Total Transactions: ${deepResult.data.totalTransactions || 0}`)
      console.log(`   • Blockchains: ${Object.keys(deepResult.data.blockchains || {}).join(', ')}`)
      
      // Show detailed information for each blockchain
      Object.entries(deepResult.data.blockchains || {}).forEach(([blockchain, analysis]) => {
        console.log(`   • ${blockchain.toUpperCase()}:`)
        console.log(`     - Native Balance: ${analysis.balance?.native || '0'} ($${(analysis.balance?.usdValue || 0).toFixed(2)})`)
        console.log(`     - Token Count: ${analysis.totalTokens || 0}`)
        console.log(`     - Transaction Count: ${analysis.transactionCount || 0}`)
        console.log(`     - Total Lifetime Value: $${(analysis.totalLifetimeValue || 0).toFixed(2)}`)
        
        // Show top tokens with values
        if (analysis.topTokens && analysis.topTokens.length > 0) {
          console.log(`     - Top Tokens:`)
          analysis.topTokens.slice(0, 3).forEach((token, index) => {
            console.log(`       ${index + 1}. ${token.symbol}: ${token.balance} ($${(token.usdValue || 0).toFixed(2)})`)
          })
        }
        
        // Show recent transactions
        if (analysis.recentTransactions && analysis.recentTransactions.length > 0) {
          console.log(`     - Recent Transactions: ${analysis.recentTransactions.length} shown`)
        }
      })
    } else {
      console.log(`   ❌ Deep analysis failed: ${deepResult.error || 'Unknown error'}`)
    }
    
  } catch (error) {
    console.error('❌ Deep analysis failed:', error.message)
  }

  console.log('\n🎯 Analysis Comparison Complete!')
  console.log('📈 Key Differences:')
  console.log('   • Quick Analysis: Fast, basic metrics only')
  console.log('   • Deep Analysis: Comprehensive, includes token values and detailed data')
  console.log('   • Use Quick for initial overview, Deep for detailed investigation')
}

// Run the comprehensive test
testComprehensiveAnalysis().catch(console.error) 