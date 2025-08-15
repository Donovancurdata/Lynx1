const axios = require('axios');

async function testDeepAnalysisBottleneck() {
  console.log('🔍 Deep Analysis Bottleneck Test\n');
  
  const backendUrl = 'http://localhost:3001';
  const testWallet = 'AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn';
  
  const results = {
    quickAnalysis: null,
    deepAnalysis: null,
    individualSteps: {},
    bottlenecks: []
  };

  try {
    // Test 1: Quick Analysis Baseline
    console.log('📊 Test 1: Quick Analysis Baseline...');
    const quickStart = Date.now();
    
    const quickResponse = await axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
      address: testWallet,
      blockchain: 'solana',
      analysisType: 'quick'
    }, { timeout: 60000 });
    
    const quickDuration = Date.now() - quickStart;
    results.quickAnalysis = {
      duration: quickDuration,
      success: quickResponse.data.success,
      hasJobId: quickResponse.data.data?.jobId ? true : false,
      responseSize: JSON.stringify(quickResponse.data).length
    };
    
    console.log(`✅ Quick Analysis: ${quickDuration}ms`);
    console.log(`   - Success: ${quickResponse.data.success}`);
    console.log(`   - Has JobId: ${results.quickAnalysis.hasJobId}`);
    console.log(`   - Response Size: ${results.quickAnalysis.responseSize} bytes\n`);

    // Test 2: Deep Analysis with Progress Tracking
    console.log('🔍 Test 2: Deep Analysis with Progress Tracking...');
    const deepStart = Date.now();
    
    const deepResponse = await axios.post(`${backendUrl}/api/v1/wallet/analyze`, {
      address: testWallet,
      blockchain: 'solana',
      analysisType: 'deep'
    }, { timeout: 300000 }); // 5 minute timeout
    
    const deepDuration = Date.now() - deepStart;
    results.deepAnalysis = {
      duration: deepDuration,
      success: deepResponse.data.success,
      hasJobId: deepResponse.data.data?.jobId ? true : false,
      responseSize: JSON.stringify(deepResponse.data).length
    };
    
    console.log(`✅ Deep Analysis: ${deepDuration}ms`);
    console.log(`   - Success: ${deepResponse.data.success}`);
    console.log(`   - Has JobId: ${results.deepAnalysis.hasJobId}`);
    console.log(`   - Response Size: ${results.deepAnalysis.responseSize} bytes\n`);

    // Test 3: If Deep Analysis returns JobId, track progress
    if (results.deepAnalysis.hasJobId) {
      const jobId = deepResponse.data.data.jobId;
      console.log(`🔄 Test 3: Tracking Job Progress for ${jobId}...`);
      
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes with 10-second intervals
      const progressData = [];
      
      while (attempts < maxAttempts) {
        attempts++;
        const pollStart = Date.now();
        
        try {
          const statusResponse = await axios.get(`${backendUrl}/api/v1/wallet/status/${jobId}`, {
            timeout: 30000
          });
          
          const pollDuration = Date.now() - pollStart;
          const status = statusResponse.data.data;
          
          progressData.push({
            attempt: attempts,
            timestamp: new Date().toISOString(),
            status: status.status,
            progress: status.progress,
            pollDuration: pollDuration,
            message: status.message
          });
          
          console.log(`📊 Attempt ${attempts}: Status=${status.status}, Progress=${status.progress}%, Poll=${pollDuration}ms`);
          
          // Check for completion or failure
          if (status.status === 'completed' || status.status === 'failed') {
            console.log(`✅ Job ${status.status} after ${attempts} attempts`);
            break;
          }
          
          // Wait 10 seconds before next poll
          await new Promise(resolve => setTimeout(resolve, 10000));
          
        } catch (error) {
          console.log(`❌ Poll attempt ${attempts} failed: ${error.message}`);
          progressData.push({
            attempt: attempts,
            timestamp: new Date().toISOString(),
            error: error.message
          });
        }
      }
      
      results.progressTracking = progressData;
    }

    // Test 4: Individual API Endpoint Performance
    console.log('\n🔍 Test 4: Individual Endpoint Performance...');
    
    // Test balance endpoint
    const balanceStart = Date.now();
    try {
      const balanceResponse = await axios.get(`${backendUrl}/api/v1/wallet/balance/${testWallet}?blockchain=solana`, {
        timeout: 30000
      });
      const balanceDuration = Date.now() - balanceStart;
      results.individualSteps.balance = {
        duration: balanceDuration,
        success: balanceResponse.data.success
      };
      console.log(`💰 Balance: ${balanceDuration}ms`);
    } catch (error) {
      results.individualSteps.balance = {
        duration: Date.now() - balanceStart,
        success: false,
        error: error.message
      };
      console.log(`❌ Balance: ${error.message}`);
    }

    // Test transactions endpoint
    const txStart = Date.now();
    try {
      const txResponse = await axios.get(`${backendUrl}/api/v1/wallet/transactions/${testWallet}?blockchain=solana&limit=50`, {
        timeout: 30000
      });
      const txDuration = Date.now() - txStart;
      results.individualSteps.transactions = {
        duration: txDuration,
        success: txResponse.data.success,
        count: txResponse.data.data?.length || 0
      };
      console.log(`📊 Transactions: ${txDuration}ms (${results.individualSteps.transactions.count} txs)`);
    } catch (error) {
      results.individualSteps.transactions = {
        duration: Date.now() - txStart,
        success: false,
        error: error.message
      };
      console.log(`❌ Transactions: ${error.message}`);
    }

    // Test deep analysis endpoint directly
    const deepDirectStart = Date.now();
    try {
      const deepDirectResponse = await axios.post(`${backendUrl}/api/v1/wallet/deep-analyze`, {
        address: testWallet
      }, { timeout: 300000 });
      const deepDirectDuration = Date.now() - deepDirectStart;
      results.individualSteps.deepAnalysisDirect = {
        duration: deepDirectDuration,
        success: deepDirectResponse.data.success
      };
      console.log(`🔍 Deep Analysis Direct: ${deepDirectDuration}ms`);
    } catch (error) {
      results.individualSteps.deepAnalysisDirect = {
        duration: Date.now() - deepDirectStart,
        success: false,
        error: error.message
      };
      console.log(`❌ Deep Analysis Direct: ${error.message}`);
    }

    // Test priority tokens endpoint
    const tokensStart = Date.now();
    try {
      const tokensResponse = await axios.get(`${backendUrl}/api/v1/priority-tokens/market-data`, {
        timeout: 30000
      });
      const tokensDuration = Date.now() - tokensStart;
      results.individualSteps.priorityTokens = {
        duration: tokensDuration,
        success: tokensResponse.data.success,
        count: tokensResponse.data.data?.tokens?.length || 0
      };
      console.log(`🪙 Priority Tokens: ${tokensDuration}ms (${results.individualSteps.priorityTokens.count} tokens)`);
    } catch (error) {
      results.individualSteps.priorityTokens = {
        duration: Date.now() - tokensStart,
        success: false,
        error: error.message
      };
      console.log(`❌ Priority Tokens: ${error.message}`);
    }

    // Analyze bottlenecks
    console.log('\n📈 Bottleneck Analysis:');
    
    // Compare quick vs deep
    if (results.quickAnalysis && results.deepAnalysis) {
      const ratio = results.deepAnalysis.duration / results.quickAnalysis.duration;
      console.log(`🔍 Quick vs Deep Ratio: ${ratio.toFixed(2)}x slower`);
      
      if (ratio > 5) {
        results.bottlenecks.push(`Deep analysis is ${ratio.toFixed(2)}x slower than quick analysis`);
      }
    }

    // Find slowest individual step
    const stepDurations = Object.entries(results.individualSteps)
      .filter(([_, data]) => data.success)
      .map(([step, data]) => ({ step, duration: data.duration }));
    
    if (stepDurations.length > 0) {
      stepDurations.sort((a, b) => b.duration - a.duration);
      const slowest = stepDurations[0];
      console.log(`🐌 Slowest Step: ${slowest.step} (${slowest.duration}ms)`);
      results.bottlenecks.push(`${slowest.step} is the slowest step at ${slowest.duration}ms`);
    }

    // Check for timeouts
    const timeoutSteps = Object.entries(results.individualSteps)
      .filter(([_, data]) => !data.success && data.error?.includes('timeout'));
    
    if (timeoutSteps.length > 0) {
      console.log(`⏰ Timeout Issues: ${timeoutSteps.length} endpoints timed out`);
      results.bottlenecks.push(`${timeoutSteps.length} endpoints are timing out`);
    }

    // Check progress tracking performance
    if (results.progressTracking) {
      const avgPollTime = results.progressTracking
        .filter(p => p.pollDuration)
        .reduce((sum, p) => sum + p.pollDuration, 0) / results.progressTracking.length;
      
      console.log(`📊 Average Poll Time: ${avgPollTime.toFixed(0)}ms`);
      
      if (avgPollTime > 5000) {
        results.bottlenecks.push(`Status polling is slow (avg ${avgPollTime.toFixed(0)}ms)`);
      }
    }

    // Summary
    console.log('\n📋 Summary:');
    console.log(`✅ Quick Analysis: ${results.quickAnalysis?.duration}ms`);
    console.log(`🔍 Deep Analysis: ${results.deepAnalysis?.duration}ms`);
    console.log(`🔄 Progress Tracking: ${results.progressTracking?.length || 0} attempts`);
    
    if (results.bottlenecks.length > 0) {
      console.log('\n🚨 Identified Bottlenecks:');
      results.bottlenecks.forEach((bottleneck, index) => {
        console.log(`   ${index + 1}. ${bottleneck}`);
      });
    } else {
      console.log('\n✅ No significant bottlenecks identified');
    }

    // Save detailed results
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `deep-analysis-bottleneck-${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`\n💾 Detailed results saved to: ${filename}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📄 Error response:', error.response.data);
    }
  }
}

// Run the test
testDeepAnalysisBottleneck().catch(console.error);
