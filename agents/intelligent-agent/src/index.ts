import 'dotenv/config';
import { IntelligentAgent } from './IntelligentAgent';
import { logger } from './utils/logger';
import { EventEmitter } from 'events';
import { RealTimeCommunicator } from './services/RealTimeCommunicator';
import { ConversationManager } from './services/ConversationManager';
import { ConversationContext, AgentResponse, IntentAnalysis, AnalysisProgress } from './types';

/**
 * Main entry point for the LYNX Intelligent Agent
 */
async function main() {
  try {
    logger.info('Starting LYNX Intelligent Agent...');
    
    // Initialize the intelligent agent
    const agent = new IntelligentAgent();
    
    // Initialize event system and real-time communicator
    const eventEmitter = new EventEmitter();
    const rtc = new RealTimeCommunicator(eventEmitter);
    rtc.startServer(3004);

    // Session context store (in-memory)
    const sessionContexts: Map<string, ConversationContext> = new Map();

    // Create a message hook function to capture progress updates
    const createMessageHook = (clientId: string) => {
      return async (record: { role: 'user' | 'agent'; content: string; metadata?: Record<string, any> }) => {
        try {
          if (record.role === 'agent') {
            // Check if this is a progress update
            if (record.metadata?.type === 'wallet_analysis_progress') {
              const progress: AnalysisProgress = {
                analysisId: record.metadata.analysisId || `analysis_${Date.now()}`,
                step: record.metadata.stage || 'unknown',
                progress: record.metadata.progress || 0,
                message: record.content,
                data: record.metadata
              };
              await rtc.sendProgressUpdate(clientId, progress);
            } else {
              // Regular agent message
              const response: AgentResponse = {
                id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: record.content,
                type: record.metadata?.type === 'wallet_analysis_started' ? 'analysis_started' :
                      record.metadata?.type === 'wallet_analysis_completed' ? 'analysis_complete' :
                      record.metadata?.type === 'wallet_analysis_error' ? 'error' : 'answer',
                timestamp: new Date(),
                metadata: record.metadata
              };
              await rtc.sendMessage(clientId, response);
            }
          }
        } catch (error) {
          logger.error('Error in message hook:', error);
        }
      };
    };

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
          
          // Create conversation manager with message hook for this client
          const conversationManager = new ConversationManager(createMessageHook(clientId));
          
          // Analyze intent to categorize response type
          const intent: IntentAnalysis = await conversationManager.analyzeIntent(userText, context);

          // Generate response (this will trigger progress updates through the message hook)
          const convoResponse = await conversationManager.generateResponse(userText, context);
          
          // The message hook will handle sending the response, so we don't need to send it again here
          // unless it's a simple response without progress updates
          if (!convoResponse.metadata?.type?.includes('wallet_analysis')) {
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
          }
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

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down Intelligent Agent...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down Intelligent Agent...');
  process.exit(0);
});

// Start the agent
main().catch((error) => {
  logger.error('Unhandled error in main:', error);
  process.exit(1);
});
