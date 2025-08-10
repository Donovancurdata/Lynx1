import 'dotenv/config';
import { IntelligentAgent } from './IntelligentAgent';
import { logger } from './utils/logger';

/**
 * Main entry point for the LYNX Intelligent Agent
 */
async function main() {
  try {
    logger.info('Starting LYNX Intelligent Agent...');
    
    // Initialize the intelligent agent
    const agent = new IntelligentAgent();
    
    // Show agent info
    const agentInfo = agent.getAgentInfo();
    logger.info('Agent Info:', agentInfo);
    
    // Test welcome message
    const welcomeMessage = await agent.generateWelcomeMessage();
    logger.info('Welcome message generated successfully');
    logger.info('Welcome message type:', welcomeMessage.type);
    
    // Test code review functionality
    const testCodeContext = {
      feature: 'wallet analysis',
      description: 'Analyze blockchain wallets for risk assessment'
    };
    
    const codeReview = await agent.reviewCodeAndSuggestFeatures(testCodeContext);
    logger.info('Code review test completed');
    logger.info('Code review type:', codeReview.type);
    
    logger.info('LYNX Intelligent Agent started successfully');
    logger.info('Agent capabilities:', agent.getAgentInfo().capabilities);
    
    // Keep the process running
    logger.info('Agent is running. Press Ctrl+C to stop.');
    
  } catch (error) {
    logger.error('Failed to start Intelligent Agent:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  main().catch((error) => {
    logger.error('Unhandled error in main:', error);
    process.exit(1);
  });
}
