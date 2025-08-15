const axios = require('axios');

async function testBlockchainProgress() {
  console.log('🧪 Testing Blockchain-Specific Progress Updates...\n');
  
  const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
  
  try {
    console.log(`🔍 Starting deep analysis for wallet: ${walletAddress}\n`);
    
    // Simulate the intelligent agent's blockchain-specific progress updates
    const progressStages = [
      { stage: 'initiating', message: '🔍 Initiating deep analysis...', percentage: 5 },
      { stage: 'blockchain_detection', message: '🔍 Detecting which blockchains this wallet uses...', percentage: 10 },
      { stage: 'analyzing_ethereum', message: '🔵 Analyzing Ethereum (ETH) blockchain...', percentage: 15 },
      { stage: 'ethereum_balance', message: '💰 Checking ETH balance and token holdings...', percentage: 20 },
      { stage: 'ethereum_transactions', message: '📊 Gathering ETH transaction history...', percentage: 25 },
      { stage: 'ethereum_tokens', message: '🪙 Analyzing ERC-20 tokens and DeFi positions...', percentage: 30 },
      { stage: 'analyzing_bitcoin', message: '🟡 Analyzing Bitcoin (BTC) blockchain...', percentage: 35 },
      { stage: 'bitcoin_balance', message: '💰 Checking BTC balance and UTXO analysis...', percentage: 40 },
      { stage: 'bitcoin_transactions', message: '📊 Gathering BTC transaction history...', percentage: 45 },
      { stage: 'analyzing_solana', message: '🟣 Analyzing Solana (SOL) blockchain...', percentage: 50 },
      { stage: 'solana_balance', message: '💰 Checking SOL balance and SPL tokens...', percentage: 55 },
      { stage: 'solana_transactions', message: '📊 Gathering SOL transaction history...', percentage: 60 },
      { stage: 'solana_defi', message: '🏦 Analyzing Solana DeFi protocols...', percentage: 65 },
      { stage: 'cross_chain_analysis', message: '🌐 Performing cross-chain fund flow analysis...', percentage: 75 },
      { stage: 'risk_assessment', message: '⚠️ Assessing overall risk profile...', percentage: 80 },
      { stage: 'pattern_analysis', message: '🔍 Analyzing transaction patterns and behaviors...', percentage: 85 },
      { stage: 'insights_generation', message: '💡 Generating intelligent insights and recommendations...', percentage: 90 },
      { stage: 'finalizing', message: '📋 Compiling comprehensive analysis report...', percentage: 95 },
      { stage: 'completion', message: '✅ Deep analysis completed successfully!', percentage: 100 }
    ];

    // Simulate progress updates with realistic timing
    for (const stage of progressStages) {
      console.log(`🔄 Progress: ${stage.percentage}% - ${stage.message}`);
      
      // Add special formatting for blockchain-specific stages
      if (stage.stage.includes('analyzing_')) {
        const blockchain = stage.stage.replace('analyzing_', '').toUpperCase();
        console.log(`   🔍 Starting detailed analysis of ${blockchain} blockchain...`);
      } else if (stage.stage.includes('_balance')) {
        const blockchain = stage.stage.split('_')[0].toUpperCase();
        console.log(`   💰 Checking ${blockchain} balance and token holdings...`);
      } else if (stage.stage.includes('_transactions')) {
        const blockchain = stage.stage.split('_')[0].toUpperCase();
        console.log(`   📊 Gathering ${blockchain} transaction history...`);
      } else if (stage.stage.includes('_tokens') || stage.stage.includes('_defi')) {
        const blockchain = stage.stage.split('_')[0].toUpperCase();
        console.log(`   🪙 Analyzing ${blockchain} tokens and DeFi positions...`);
      }
      
      console.log(`   Stage: ${stage.stage.replace(/_/g, ' ').toUpperCase()}\n`);
      
      // Add realistic delays
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    }

    console.log('📡 Making API call to backend...\n');
    
    const response = await axios.post('http://localhost:3001/api/v1/wallet/deep-analyze', {
      address: walletAddress,
      analysisType: 'deep'
    }, {
      timeout: 300000, // 5 minute timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Analysis completed successfully!');
    console.log('📊 Results summary:');
    console.log(`   - Address: ${response.data.data?.address || 'N/A'}`);
    console.log(`   - Total Value: $${response.data.data?.totalValue || 0}`);
    console.log(`   - Total Transactions: ${response.data.data?.totalTransactions || 0}`);
    console.log(`   - Blockchains Detected: ${Object.keys(response.data.data?.blockchains || {}).length}`);

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    
    if (error.response) {
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    }
  }
}

// Run the test
testBlockchainProgress();
