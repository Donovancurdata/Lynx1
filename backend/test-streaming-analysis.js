const axios = require('axios');

async function testStreamingAnalysis() {
  console.log('🧪 Testing Streaming Deep Analysis...\n');
  
  const walletAddress = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
  
  try {
    console.log(`🔍 Starting deep analysis for wallet: ${walletAddress}\n`);
    
    // Simulate the intelligent agent's streaming analysis
    const stages = [
      { stage: 'initiating', message: '🔍 Initiating deep analysis...', percentage: 5 },
      { stage: 'blockchain_detection', message: '🔍 Detecting blockchains...', percentage: 15 },
      { stage: 'balance_check', message: '💰 Checking balances...', percentage: 30 },
      { stage: 'transaction_history', message: '📊 Gathering transaction history...', percentage: 50 },
      { stage: 'risk_assessment', message: '⚠️ Performing risk assessment...', percentage: 70 },
      { stage: 'fund_flow_analysis', message: '🌊 Analyzing fund flows...', percentage: 85 },
      { stage: 'insights_generation', message: '💡 Generating insights...', percentage: 95 },
      { stage: 'completion', message: '✅ Analysis completed!', percentage: 100 }
    ];

    // Simulate progress updates
    for (const stage of stages) {
      console.log(`🔄 Progress: ${stage.percentage}% - ${stage.message}`);
      console.log(`   Current stage: ${stage.stage.replace('_', ' ').toUpperCase()}\n`);
      
      // Add realistic delays
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    }

    // Now make the actual API call
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
    console.log('📊 Results:');
    console.log(JSON.stringify(response.data, null, 2));

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
testStreamingAnalysis();
