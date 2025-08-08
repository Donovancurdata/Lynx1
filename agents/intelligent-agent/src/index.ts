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

    // Start the real-time communication server
    agent.realTimeCommunicator.startServer(3004);

    // Handle client messages
    agent.on('clientMessage', async ({ clientId, message }) => {
      try {
        if (message.type === 'start_session') {
          await agent.startSession(clientId, message.initialMessage);
        } else if (message.type === 'message') {
          await agent.processMessage(clientId, message.content);
        } else if (message.type === 'end_session') {
          await agent.endSession(clientId);
        }
      } catch (error) {
        logger.error(`Error handling client message from ${clientId}:`, error);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      
      // End all active sessions
      const activeSessions = agent.getActiveSessions();
      for (const [clientId] of activeSessions) {
        await agent.endSession(clientId);
      }

      // Stop the WebSocket server
      agent.realTimeCommunicator.stopServer();
      
      logger.info('Intelligent Agent shutdown complete');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      
      // End all active sessions
      const activeSessions = agent.getActiveSessions();
      for (const [clientId] of activeSessions) {
        await agent.endSession(clientId);
      }

      // Stop the WebSocket server
      agent.realTimeCommunicator.stopServer();
      
      logger.info('Intelligent Agent shutdown complete');
      process.exit(0);
    });

    logger.info('LYNX Intelligent Agent started successfully');
    logger.info('WebSocket server running on port 3004');
    logger.info('Agent capabilities:', agent.getAgentInfo());

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

export { IntelligentAgent };
