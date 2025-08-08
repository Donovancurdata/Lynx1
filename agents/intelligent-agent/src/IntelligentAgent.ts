import { EventEmitter } from 'events';
import { WalletInvestigationRequest, WalletInvestigationResponse } from '../../agent1-wia/src/types';
import { Agent1WIA } from '../../agent1-wia/src/Agent1WIA';
import { ConversationManager } from './services/ConversationManager';
import { AnalysisOrchestrator } from './services/AnalysisOrchestrator';
import { RealTimeCommunicator } from './services/RealTimeCommunicator';
import { IntelligentInsights } from './services/IntelligentInsights';
import { 
  AgentSession, 
  ClientMessage, 
  AgentResponse, 
  AnalysisProgress, 
  IntelligentInsight,
  ConversationContext
} from './types';
import { logger } from './utils/logger';

/**
 * Intelligent AI Agent for LYNX
 * 
 * This agent can:
 * - Think for itself and make autonomous decisions
 * - Communicate naturally with clients in real-time
 * - Provide progressive results as data is gathered
 * - Generate intelligent insights and recommendations
 * - Handle multiple concurrent client sessions
 * - Learn from interactions to improve responses
 */
export class IntelligentAgent extends EventEmitter {
  private agent1WIA: Agent1WIA;
  private conversationManager: ConversationManager;
  private analysisOrchestrator: AnalysisOrchestrator;
  private realTimeCommunicator: RealTimeCommunicator;
  private intelligentInsights: IntelligentInsights;
  
  private activeSessions: Map<string, AgentSession> = new Map();
  private agentId: string = 'intelligent-agent';
  private version: string = '2.0.0';

  constructor() {
    super();
    
    this.agent1WIA = new Agent1WIA();
    this.conversationManager = new ConversationManager();
    this.analysisOrchestrator = new AnalysisOrchestrator(this.agent1WIA);
    this.realTimeCommunicator = new RealTimeCommunicator(this);
    this.intelligentInsights = new IntelligentInsights();
    
    logger.info('Intelligent Agent initialized successfully');
  }

  /**
   * Start a new client session
   */
  async startSession(clientId: string, initialMessage?: string): Promise<AgentSession> {
    const session: AgentSession = {
      id: clientId,
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

    this.activeSessions.set(clientId, session);
    
    // Send welcome message
    const welcomeResponse = await this.generateWelcomeMessage(session);
    await this.sendMessage(clientId, welcomeResponse);

    if (initialMessage) {
      await this.processMessage(clientId, initialMessage);
    }

    logger.info(`Started new session for client: ${clientId}`);
    return session;
  }

  /**
   * Process a message from a client
   */
  async processMessage(clientId: string, message: string): Promise<AgentResponse> {
    const session = this.activeSessions.get(clientId);
    if (!session) {
      throw new Error(`No active session found for client: ${clientId}`);
    }

    session.lastActivity = new Date();
    
    // Update conversation context
    const clientMessage: ClientMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      type: 'user'
    };
    
    session.context.conversationHistory.push(clientMessage);

    // Analyze the message intent
    const intent = await this.conversationManager.analyzeIntent(message, session.context);
    
    let response: AgentResponse;

    switch (intent.type) {
      case 'wallet_analysis':
        response = await this.handleWalletAnalysisRequest(clientId, message, session, intent);
        break;
      
      case 'question':
        response = await this.handleQuestion(clientId, message, session, intent);
        break;
      
      case 'clarification':
        response = await this.handleClarification(clientId, message, session, intent);
        break;
      
      case 'general_chat':
        response = await this.handleGeneralChat(clientId, message, session, intent);
        break;
      
      default:
        response = await this.handleUnknownIntent(clientId, message, session, intent);
    }

    // Store agent response in conversation history
    session.context.conversationHistory.push({
      id: response.id,
      content: response.content,
      timestamp: new Date(),
      type: 'agent',
      metadata: response.metadata
    });

    // Send response to client
    await this.sendMessage(clientId, response);

    return response;
  }

  /**
   * Handle wallet analysis requests
   */
  private async handleWalletAnalysisRequest(
    clientId: string, 
    message: string, 
    session: AgentSession, 
    intent: any
  ): Promise<AgentResponse> {
    const walletAddress = intent.entities.walletAddress;
    
    if (!walletAddress) {
      return {
        id: Date.now().toString(),
        content: "I'd be happy to analyze a wallet for you! Please provide the wallet address you'd like me to investigate.",
        type: 'clarification',
        timestamp: new Date(),
        metadata: {
          requiresWalletAddress: true,
          suggestions: ['You can paste any wallet address here']
        }
      };
    }

    // Start progressive analysis
    const analysisId = `analysis_${Date.now()}`;
    session.context.currentAnalysis = {
      id: analysisId,
      walletAddress,
      status: 'starting',
      progress: 0,
      startTime: new Date()
    };

    // Send initial response
    const initialResponse: AgentResponse = {
      id: Date.now().toString(),
      content: `🔍 I'm starting to analyze wallet **${walletAddress}** for you. Let me gather some initial information...`,
      type: 'analysis_started',
      timestamp: new Date(),
      metadata: {
        analysisId,
        walletAddress,
        progress: 0
      }
    };

    // Start analysis in background
    this.performProgressiveAnalysis(clientId, walletAddress, session, analysisId);

    return initialResponse;
  }

  /**
   * Perform progressive analysis with real-time updates
   */
  private async performProgressiveAnalysis(
    clientId: string, 
    walletAddress: string, 
    session: AgentSession, 
    analysisId: string
  ): Promise<void> {
    try {
      // Step 1: Blockchain Detection (5%)
      await this.updateProgress(clientId, analysisId, 5, "🔍 Detecting which blockchains this wallet operates on...");
      
      const blockchainDetection = await this.agent1WIA.detectBlockchain(walletAddress);
      
      await this.sendProgressUpdate(clientId, {
        analysisId,
        step: 'blockchain_detection',
        progress: 10,
        message: `✅ Found wallet on **${blockchainDetection.blockchain}** blockchain (confidence: ${blockchainDetection.confidence}%)`,
        data: { blockchain: blockchainDetection.blockchain, confidence: blockchainDetection.confidence }
      });

      // Step 2: Balance Check (20%)
      await this.updateProgress(clientId, analysisId, 20, "💰 Checking current balances across detected blockchains...");
      
      const balances = await this.agent1WIA.getMultiChainBalance(walletAddress);
      const totalValue = Object.values(balances).reduce((sum, b) => sum + (b.usdValue || 0), 0);
      
      await this.sendProgressUpdate(clientId, {
        analysisId,
        step: 'balance_check',
        progress: 30,
        message: `💰 Current total value: **$${this.formatUSDValue(totalValue)}**`,
        data: { balances, totalValue }
      });

      // Step 3: Transaction History (40%)
      await this.updateProgress(clientId, analysisId, 40, "📊 Gathering transaction history...");
      
      const transactions = await this.agent1WIA.getMultiChainTransactionHistory(walletAddress);
      const totalTransactions = Object.values(transactions).flat().length;
      
      await this.sendProgressUpdate(clientId, {
        analysisId,
        step: 'transaction_history',
        progress: 60,
        message: `📊 Found **${totalTransactions}** transactions across all blockchains`,
        data: { transactionCount: totalTransactions, transactions }
      });

      // Step 4: Deep Analysis (80%)
      await this.updateProgress(clientId, analysisId, 80, "🧠 Performing deep analysis and generating insights...");
      
      const investigationRequest: WalletInvestigationRequest = {
        walletAddress,
        // analysisType: 'deep', // Removed as it's not in the type definition
        // includeHistoricalData: true, // Removed as it's not in the type definition
        // includeRiskAssessment: true // Removed as it's not in the type definition
      };
      
      const investigation = await this.agent1WIA.investigateWallet(investigationRequest);
      
      // Step 5: Generate Intelligent Insights (95%)
      await this.updateProgress(clientId, analysisId, 95, "💡 Generating intelligent insights and recommendations...");
      
      const insights = await this.intelligentInsights.generateInsights(investigation.data!, session.context);
      
      // Final Results (100%)
      await this.updateProgress(clientId, analysisId, 100, "✅ Analysis complete! Here are your comprehensive results:");
      
      // Use the correct aggregated data for final response
      const finalData = {
        walletAddress,
        totalValue,
        totalTransactions,
        balances,
        transactions,
        investigation: investigation.data
      };
      
      const finalResponse = await this.generateFinalAnalysisResponse(finalData, insights, session);
      await this.sendMessage(clientId, finalResponse);

      // Update session context
      session.context.currentAnalysis = null;
      session.context.insights.push(...insights);

    } catch (error) {
      logger.error(`Analysis failed for client ${clientId}:`, error);
      
      await this.sendMessage(clientId, {
        id: Date.now().toString(),
        content: `❌ I encountered an issue while analyzing the wallet: ${error instanceof Error ? error.message : 'Unknown error'}. Would you like me to try a different approach?`,
        type: 'error',
        timestamp: new Date(),
        metadata: { analysisId, error: true }
      });
      
      session.context.currentAnalysis = null;
    }
  }

  /**
   * Handle general questions
   */
  private async handleQuestion(
    clientId: string, 
    message: string, 
    session: AgentSession, 
    intent: any
  ): Promise<AgentResponse> {
    const response = await this.conversationManager.generateResponse(message, session.context);
    
    return {
      id: Date.now().toString(),
      content: response.content,
      type: 'answer',
      timestamp: new Date(),
      metadata: response.metadata
    };
  }

  /**
   * Handle clarification requests
   */
  private async handleClarification(
    clientId: string, 
    message: string, 
    session: AgentSession, 
    intent: any
  ): Promise<AgentResponse> {
    const response = await this.conversationManager.handleClarification(message, session.context);
    
    return {
      id: Date.now().toString(),
      content: response.content,
      type: 'clarification',
      timestamp: new Date(),
      metadata: response.metadata
    };
  }

  /**
   * Handle general chat
   */
  private async handleGeneralChat(
    clientId: string, 
    message: string, 
    session: AgentSession, 
    intent: any
  ): Promise<AgentResponse> {
    const response = await this.conversationManager.handleGeneralChat(message, session.context);
    
    return {
      id: Date.now().toString(),
      content: response.content,
      type: 'chat',
      timestamp: new Date(),
      metadata: response.metadata
    };
  }

  /**
   * Handle unknown intents
   */
  private async handleUnknownIntent(
    clientId: string, 
    message: string, 
    session: AgentSession, 
    intent: any
  ): Promise<AgentResponse> {
    return {
      id: Date.now().toString(),
      content: "I'm not sure I understood that. Could you please rephrase or ask me to analyze a wallet address? I'm here to help with blockchain wallet analysis!",
      type: 'clarification',
      timestamp: new Date(),
      metadata: { 
        confidence: intent.confidence,
        suggestions: ['Analyze wallet address', 'Ask about blockchain', 'Get help']
      }
    };
  }

  /**
   * Generate welcome message
   */
  private async generateWelcomeMessage(session: AgentSession): Promise<AgentResponse> {
    return {
      id: Date.now().toString(),
      content: `👋 Hello! I'm your intelligent blockchain analysis assistant. I can help you:

🔍 **Analyze any wallet address** across multiple blockchains
💰 **Track fund flows** and transaction patterns  
📊 **Provide insights** about wallet behavior and risk
💡 **Answer questions** about blockchain and crypto

Just paste a wallet address or ask me anything about blockchain analysis!`,
      type: 'welcome',
      timestamp: new Date(),
      metadata: {
        capabilities: ['wallet_analysis', 'fund_tracking', 'risk_assessment', 'blockchain_qa'],
        suggestions: ['Paste a wallet address', 'Ask about blockchain', 'Learn about my capabilities']
      }
    };
  }

  /**
   * Generate final analysis response
   */
  private async generateFinalAnalysisResponse(
    data: any, 
    insights: IntelligentInsight[], 
    session: AgentSession
  ): Promise<AgentResponse> {
    const totalValue = data.totalValue || 0;
    const transactionCount = data.totalTransactions || 0;
    const balances = data.balances || {};
    const transactions = data.transactions || {};
    
    let content = `## 📊 **Analysis Complete!**\n\n`;
    content += `**Wallet:** ${data.walletAddress}\n`;
    content += `**Total Value:** $${this.formatUSDValue(totalValue)}\n`;
    content += `**Total Transactions:** ${transactionCount}\n`;
    content += `**Active Blockchains:** ${Object.keys(balances).length}\n\n`;
    
         // Show breakdown by blockchain
     if (Object.keys(balances).length > 0) {
       content += `### 🔗 **Blockchain Breakdown:**\n\n`;
       for (const [blockchain, balance] of Object.entries(balances)) {
         const txCount = transactions[blockchain] ? transactions[blockchain].length : 0;
         const balanceData = balance as { usdValue?: number };
         content += `• **${blockchain.toUpperCase()}**: $${this.formatUSDValue(balanceData.usdValue || 0)} (${txCount} transactions)\n`;
       }
       content += `\n`;
     }
    
    if (insights.length > 0) {
      content += `## 💡 **Key Insights:**\n\n`;
      insights.forEach((insight, index) => {
        content += `${index + 1}. **${insight.title}**\n`;
        content += `   ${insight.description}\n\n`;
      });
    }
    
    content += `\nWould you like me to dive deeper into any specific aspect or analyze another wallet?`;

    return {
      id: Date.now().toString(),
      content,
      type: 'analysis_complete',
      timestamp: new Date(),
      metadata: {
        totalValue,
        transactionCount,
        insights: insights.length,
        data
      }
    };
  }

  /**
   * Update analysis progress
   */
  private async updateProgress(
    clientId: string, 
    analysisId: string, 
    progress: number, 
    message: string
  ): Promise<void> {
    const session = this.activeSessions.get(clientId);
    if (session?.context.currentAnalysis) {
      session.context.currentAnalysis.progress = progress;
    }

    await this.sendProgressUpdate(clientId, {
      analysisId,
      step: 'progress',
      progress,
      message
    });
  }

  /**
   * Send progress update to client
   */
  private async sendProgressUpdate(clientId: string, update: AnalysisProgress): Promise<void> {
    await this.realTimeCommunicator.sendProgressUpdate(clientId, update);
  }

  /**
   * Send message to client
   */
  private async sendMessage(clientId: string, response: AgentResponse): Promise<void> {
    await this.realTimeCommunicator.sendMessage(clientId, response);
  }

  /**
   * Format USD value
   */
  private formatUSDValue(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value.toFixed(2);
    }
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): Map<string, AgentSession> {
    return this.activeSessions;
  }

  /**
   * End a client session
   */
  async endSession(clientId: string): Promise<void> {
    const session = this.activeSessions.get(clientId);
    if (session) {
      session.status = 'ended';
      session.endTime = new Date();
      this.activeSessions.delete(clientId);
      
      logger.info(`Ended session for client: ${clientId}`);
    }
  }

  /**
   * Get agent information
   */
  getAgentInfo(): { agentId: string; version: string; capabilities: string[] } {
    return {
      agentId: this.agentId,
      version: this.version,
      capabilities: [
        'natural_language_processing',
        'real_time_communication',
        'progressive_analysis',
        'intelligent_insights',
        'multi_blockchain_analysis',
        'conversation_memory',
        'autonomous_decision_making'
      ]
    };
  }

  /**
   * Start the WebSocket server
   */
  public startServer(port: number): void {
    this.realTimeCommunicator.startServer(port);
  }

  /**
   * Stop the WebSocket server
   */
  public stopServer(): void {
    this.realTimeCommunicator.stopServer();
  }
}
