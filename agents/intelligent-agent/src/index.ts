import 'dotenv/config';
import { IntelligentAgent } from './IntelligentAgent';
import { logger } from './utils/logger';
import { EventEmitter } from 'events';
import { RealTimeCommunicator } from './services/RealTimeCommunicator';
import { ConversationManager } from './services/ConversationManager';
import { ConversationContext, AgentResponse, IntentAnalysis } from './types';

/**
 * Main entry point for the LYNX Intelligent Agent
 */
async function main() {
  try {
    logger.info('Starting LYNX Intelligent Agent...');
    
    // Initialize the intelligent agent
    const agent = new IntelligentAgent();
    
    // Initialize conversation manager
    const conversationManager = new ConversationManager();

    // Initialize event system and real-time communicator
    const eventEmitter = new EventEmitter();
    const rtc = new RealTimeCommunicator(eventEmitter);
    rtc.startServer(3004);

    // Session context store (in-memory)
    const sessionContexts: Map<string, ConversationContext> = new Map();

    // Handle client messages routed from RTC
    eventEmitter.on('clientMessage', async ({ clientId, message }) => {
      try {
        // Initialize context if new
        if (!sessionContexts.has(clientId)) {
          sessionContexts.set(clientId, {
            conversationHistory: [],
            currentAnalysis: null,
            userPreferences: {},
            insights: []
          });
        }
        const context = sessionContexts.get(clientId)!;

        if (message?.type === 'start_session') {
          const welcome = await agent.generateWelcomeMessage();
          const response: AgentResponse = {
            id: welcome.id,
            content: welcome.content,
            type: 'welcome',
            timestamp: new Date(),
            metadata: welcome.metadata
          };
          await rtc.sendMessage(clientId, response);
          return;
        }

        if (message?.type === 'end_session') {
          // RTC will handle persistence and close
          return;
        }

        if (message?.type === 'message' || typeof message?.content === 'string') {
          const userText: string = message?.content || '';
          // Analyze intent to categorize response type
          const intent: IntentAnalysis = await conversationManager.analyzeIntent(userText, context);

          // Generate response
          const convoResponse = await conversationManager.generateResponse(userText, context);
          const mappedType: AgentResponse['type'] = intent.type === 'question'
            ? 'answer'
            : intent.type === 'clarification'
            ? 'clarification'
            : intent.type === 'general_chat'
            ? 'chat'
            : 'answer';

          const response: AgentResponse = {
            id: `${Date.now()}`,
            content: convoResponse.content,
            type: mappedType,
            timestamp: new Date(),
            metadata: convoResponse.metadata
          };

          await rtc.sendMessage(clientId, response);
          return;
        }
      } catch (error) {
        logger.error('Error handling client message', { error });
        await rtc.sendError(clientId, 'Internal error processing your message');
      }
    });

    const agentInfo = agent.getAgentInfo();
    logger.info('Agent Info:', agentInfo);
    logger.info('LYNX Intelligent Agent started successfully');
    logger.info('Agent capabilities:', agent.getAgentInfo().capabilities);
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
