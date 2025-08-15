const WebSocket = require('ws');

async function testCompleteAnalysisFlow() {
  console.log('🧪 Testing Complete Analysis Flow...\n');
  
  const ws = new WebSocket('ws://localhost:3004');
  
  ws.on('open', () => {
    console.log('✅ Connected to Intelligent Agent WebSocket');
    
    // Send a wallet analysis request
    const message = {
      type: 'message',
      content: 'Analyze this wallet with deep analysis: AB3cBSkbTTk216rJ1dL3rdFbu47axRB8fPhmNFzwKNQn'
    };
    
    console.log('📤 Sending wallet analysis request...');
    ws.send(JSON.stringify(message));
  });
  
  let progressMessageCount = 0;
  let hasCompleted = false;
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'message') {
        const agentResponse = message.data;
        console.log(`📥 Message: ${agentResponse.type}`);
        console.log(`   Content: ${agentResponse.content.substring(0, 100)}...`);
        
        if (agentResponse.metadata?.type === 'wallet_analysis_started') {
          console.log('   🎯 Analysis started - progress message will show with white text and pink border');
        } else if (agentResponse.metadata?.type === 'wallet_analysis_completed') {
          hasCompleted = true;
          console.log('   ✅ Analysis completed - normal message posted with download button');
        }
      } else if (message.type === 'progress') {
        progressMessageCount++;
        const progress = message.data;
        console.log(`🔄 Progress Update #${progressMessageCount}:`);
        console.log(`   Step: ${progress.step}`);
        console.log(`   Progress: ${progress.progress}%`);
        console.log(`   Message: ${progress.message}`);
        console.log('   📝 This updates the same message with white text and pink border');
      } else if (message.type === 'error') {
        console.log(`❌ Error: ${message.data.message}`);
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
  });
  
  // Close connection after 30 seconds
  setTimeout(() => {
    console.log('⏰ Test completed, closing connection...');
    console.log(`📊 Total progress updates received: ${progressMessageCount}`);
    console.log(`✅ Analysis completed: ${hasCompleted ? 'Yes' : 'No'}`);
    console.log('💡 In the frontend, you should see:');
    console.log('   1. Progress message with white text and pink border');
    console.log('   2. Normal completion message with download button');
    console.log('   3. Download button to save results as text file');
    ws.close();
    process.exit(0);
  }, 30000);
}

// Run the test
testCompleteAnalysisFlow();
