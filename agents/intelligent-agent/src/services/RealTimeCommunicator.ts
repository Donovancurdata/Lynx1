import { WebSocket, WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { AgentResponse, AnalysisProgress, RealTimeMessage } from '../types';
import { logger } from '../utils/logger';
import { AzureConversationStorage, ConversationMessageRecord, ConversationSessionRecord } from './AzureConversationStorage';

/**
 * Real-time Communication Service
 * 
 * Handles WebSocket connections and sends live updates to clients
 * during wallet analysis and conversations.
 */
export class RealTimeCommunicator {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocket> = new Map();
  private port: number = 3004;
  private eventEmitter: EventEmitter | null = null;
  private storage: AzureConversationStorage = new AzureConversationStorage();
  private sessions: Map<string, ConversationSessionRecord> = new Map();

  constructor(eventEmitter?: EventEmitter) {
    this.eventEmitter = eventEmitter;
    logger.info('Real-time Communicator initialized');
  }

  /**
   * Start the WebSocket server
   */
  startServer(port?: number): void {
    if (this.wss) {
      logger.warn('WebSocket server already running');
      return;
    }

    this.port = port || this.port;
    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on('connection', (ws: WebSocket, req) => {
      this.handleClientConnection(ws, req);
    });

    this.wss.on('error', (error) => {
      logger.error('WebSocket server error:', error);
    });

    logger.info(`Real-time communication server started on port ${this.port}`);
  }

  /**
   * Handle new client connection
   */
  private handleClientConnection(ws: WebSocket, req: any): void {
    const clientId = this.generateClientId();
    this.clients.set(clientId, ws);

    // Initialize in-memory session
    this.sessions.set(clientId, {
      sessionId: clientId,
      clientId: clientId,
      startTime: new Date().toISOString(),
      endTime: '',
      messageCount: 0,
      messages: []
    });

    logger.info(`Client connected: ${clientId}`);

    // Send connection confirmation
    this.sendToClient(clientId, {
      type: 'message',
      data: {
        clientId,
        message: 'Connected to LYNX Intelligent Agent',
        timestamp: new Date()
      },
      timestamp: new Date()
    });

    // Handle client messages
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        // Track incoming message
        this.trackMessage(clientId, {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'user',
          content: typeof message === 'string' ? message : (message.content || JSON.stringify(message)),
          timestamp: new Date().toISOString(),
          metadata: typeof message === 'object' ? message : undefined
        });
        this.handleClientMessage(clientId, message);
      } catch (error) {
        logger.error(`Error parsing client message from ${clientId}:`, error);
        this.sendError(clientId, 'Invalid message format');
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      logger.info(`Client disconnected: ${clientId}`);
      this.finalizeAndPersistSession(clientId);
      this.clients.delete(clientId);
    });

    // Handle connection errors
    ws.on('error', (error) => {
      logger.error(`WebSocket error for client ${clientId}:`, error);
      this.finalizeAndPersistSession(clientId);
      this.clients.delete(clientId);
    });
  }

  /**
   * Handle messages from clients
   */
  private handleClientMessage(clientId: string, message: any): void {
    logger.info(`Received message from client ${clientId}:`, message);

    // End session explicit command
    if (message && message.type === 'end_session') {
      this.finalizeAndPersistSession(clientId);
      const ws = this.clients.get(clientId);
      if (ws) {
        try { ws.close(1000, 'Session ended by client'); } catch {}
      }
      return;
    }

    // Emit message event for the intelligent agent to handle
    this.emit('clientMessage', { clientId, message });
  }

  /**
   * Send message to specific client
   */
  async sendMessage(clientId: string, response: AgentResponse): Promise<void> {
    const realTimeMessage: RealTimeMessage = {
      type: 'message',
      data: response,
      timestamp: new Date()
    };

    // Track outgoing agent message
    this.trackMessage(clientId, {
      id: response.id || `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'agent',
      content: response.content,
      timestamp: (response.timestamp || new Date()).toISOString(),
      metadata: response.metadata
    });

    this.sendToClient(clientId, realTimeMessage);
  }

  /**
   * Send progress update to specific client
   */
  async sendProgressUpdate(clientId: string, progress: AnalysisProgress): Promise<void> {
    const realTimeMessage: RealTimeMessage = {
      type: 'progress',
      data: progress,
      timestamp: new Date()
    };

    // Track progress as a system/progress message
    this.trackMessage(clientId, {
      id: progress.analysisId || `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'progress',
      content: progress.message,
      timestamp: new Date().toISOString(),
      metadata: progress as any
    });

    this.sendToClient(clientId, realTimeMessage);
  }

  /**
   * Send insight to specific client
   */
  async sendInsight(clientId: string, insight: any): Promise<void> {
    const realTimeMessage: RealTimeMessage = {
      type: 'insight',
      data: insight,
      timestamp: new Date()
    };

    this.trackMessage(clientId, {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'insight',
      content: insight?.description || 'Insight',
      timestamp: new Date().toISOString(),
      metadata: insight
    });

    this.sendToClient(clientId, realTimeMessage);
  }

  /**
   * Send error to specific client
   */
  async sendError(clientId: string, error: string): Promise<void> {
    const realTimeMessage: RealTimeMessage = {
      type: 'error',
      data: {
        message: error,
        timestamp: new Date()
      },
      timestamp: new Date()
    };

    this.trackMessage(clientId, {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'error',
      content: error,
      timestamp: new Date().toISOString()
    });

    this.sendToClient(clientId, realTimeMessage);
  }

  /**
   * Send message to all connected clients
   */
  async broadcastMessage(message: RealTimeMessage): Promise<void> {
    for (const [clientId, ws] of this.clients) {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      } catch (error) {
        logger.error(`Error broadcasting to client ${clientId}:`, error);
      }
    }
  }

  /**
   * Track a message in the in-memory session
   */
  private trackMessage(clientId: string, record: ConversationMessageRecord): void {
    const session = this.sessions.get(clientId);
    if (!session) return;
    session.messages.push(record);
    session.messageCount = session.messages.length;
  }

  /**
   * Finalize and persist a session to Azure
   */
  private async finalizeAndPersistSession(clientId: string): Promise<void> {
    const session = this.sessions.get(clientId);
    if (!session) return;
    session.endTime = new Date().toISOString();

    try {
      await this.storage.saveConversation(session);
    } finally {
      this.sessions.delete(clientId);
    }
  }

  /**
   * Send message to specific client
   */
  private sendToClient(clientId: string, message: RealTimeMessage): void {
    const ws = this.clients.get(clientId);
    
    if (!ws) {
      logger.warn(`Client ${clientId} not found`);
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
        logger.debug(`Sent message to client ${clientId}:`, message.type);
      } catch (error) {
        logger.error(`Error sending message to client ${clientId}:`, error);
        this.finalizeAndPersistSession(clientId);
        this.clients.delete(clientId);
      }
    } else {
      logger.warn(`Client ${clientId} connection not open, removing from clients`);
      this.finalizeAndPersistSession(clientId);
      this.clients.delete(clientId);
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Get list of connected client IDs
   */
  getConnectedClients(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Check if client is connected
   */
  isClientConnected(clientId: string): boolean {
    const ws = this.clients.get(clientId);
    return ws ? ws.readyState === WebSocket.OPEN : false;
  }

  /**
   * Disconnect specific client
   */
  disconnectClient(clientId: string): void {
    const ws = this.clients.get(clientId);
    if (ws) {
      ws.close();
      this.finalizeAndPersistSession(clientId);
      this.clients.delete(clientId);
      logger.info(`Disconnected client: ${clientId}`);
    }
  }

  /**
   * Stop the WebSocket server
   */
  stopServer(): void {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
      // Persist all sessions on shutdown
      const pending = Array.from(this.sessions.keys());
      pending.forEach((clientId) => {
        this.finalizeAndPersistSession(clientId);
      });
      this.clients.clear();
      logger.info('Real-time communication server stopped');
    }
  }

  /**
   * Emit event (for integration with EventEmitter)
   */
  private emit(event: string, data: any): void {
    if (this.eventEmitter) {
      this.eventEmitter.emit(event, data);
    }
  }
}
