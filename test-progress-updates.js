const WebSocket = require('ws');

async function testProgressUpdates() {
  console.log('🧪 Testing Progress Updates with Intelligent Agent...\n');
  
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
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`📥 Received message type: ${message.type}`);
      
      if (message.type === 'message') {
        const agentResponse = message.data;
        console.log(`🤖 Agent Response (${agentResponse.type}):`);
        console.log(`   Content: ${agentResponse.content.substring(0, 100)}...`);
        console.log(`   Metadata: ${JSON.stringify(agentResponse.metadata?.type || 'none')}`);
      } else if (message.type === 'progress') {
        const progress = message.data;
        console.log(`🔄 Progress Update:`);
        console.log(`   Step: ${progress.step}`);
        console.log(`   Progress: ${progress.progress}%`);
        console.log(`   Message: ${progress.message}`);
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
    ws.close();
    process.exit(0);
  }, 30000);
}

// Run the test
testProgressUpdates();
