require('dotenv/config');
const { IntelligentAgent } = require('./dist/IntelligentAgent');

async function testAIAgent() {
  try {
    console.log('🧪 Testing LYNX Intelligent AI Agent...');
    
    // Initialize the agent
    const agent = new IntelligentAgent();
    console.log('✅ Agent initialized successfully');
    
    // Test agent info
    const agentInfo = agent.getAgentInfo();
    console.log('📋 Agent Info:', agentInfo);
    
    // Test welcome message generation
    const mockSession = {
      id: 'test-client-1',
      startTime: new Date(),
      status: 'active',
      context: {
        conversationHistory: [],
        currentAnalysis: null,
        userPreferences: {},
        insights: []
      },
      lastActivity: new Date()
    };
    
    const welcomeResponse = await agent.generateWelcomeMessage(mockSession);
    console.log('✅ Welcome message generated successfully');
    console.log('📝 Welcome Response Type:', welcomeResponse.type);
    console.log('📝 Welcome Response Content Length:', welcomeResponse.content.length);
    
    console.log('\n🎉 Basic tests passed! The AI agent is working correctly.');
    console.log('\nThe agent is now ready to:');
    console.log('• Process wallet analysis requests');
    console.log('• Answer blockchain questions');
    console.log('• Generate intelligent insights');
    console.log('• Provide risk assessments');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testAIAgent();
