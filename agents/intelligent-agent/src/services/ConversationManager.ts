import { 
  ConversationContext, 
  IntentAnalysis, 
  ConversationResponse,
  ClientMessage,
  AgentMessage
} from '../types';
import { logger } from '../utils/logger';
import { OpenAIService, AIResponse } from './OpenAIService';

/**
 * Conversation Manager
 * 
 * Handles natural language processing, intent analysis, and response generation
 * for intelligent conversations with clients.
 */
export class ConversationManager {
  private knowledgeBase: Map<string, any> = new Map();
  private responseTemplates: Map<string, string[]> = new Map();
  private openaiService: OpenAIService;

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeResponseTemplates();
    
    try {
      this.openaiService = new OpenAIService();
      logger.info('Conversation Manager initialized with OpenAI integration');
    } catch (error) {
      logger.warn('OpenAI service not available, falling back to template responses:', error);
      this.openaiService = null as any;
    }
  }

  /**
   * Analyze the intent of a user message
   */
  async analyzeIntent(message: string, context: ConversationContext): Promise<IntentAnalysis> {
    const lowerMessage = message.toLowerCase();
    
    // Check for wallet analysis intent
    if (this.isWalletAnalysisRequest(lowerMessage)) {
      const walletAddress = this.extractWalletAddress(message);
      return {
        type: 'wallet_analysis',
        confidence: 0.95,
        entities: { walletAddress },
        metadata: { analysisType: this.determineAnalysisType(lowerMessage) }
      };
    }

    // Check for questions about blockchain/crypto
    if (this.isBlockchainQuestion(lowerMessage)) {
      return {
        type: 'question',
        confidence: 0.85,
        entities: { topic: this.extractTopic(lowerMessage) },
        metadata: { questionType: 'blockchain_education' }
      };
    }

    // Check for clarification requests
    if (this.isClarificationRequest(lowerMessage)) {
      return {
        type: 'clarification',
        confidence: 0.80,
        entities: { clarificationType: this.extractClarificationType(lowerMessage) },
        metadata: { context: context.currentAnalysis }
      };
    }

    // Check for general chat
    if (this.isGeneralChat(lowerMessage)) {
      return {
        type: 'general_chat',
        confidence: 0.70,
        entities: { chatType: this.extractChatType(lowerMessage) },
        metadata: { sentiment: this.analyzeSentiment(lowerMessage) }
      };
    }

    // Unknown intent
    return {
      type: 'unknown',
      confidence: 0.30,
      entities: {},
      metadata: { originalMessage: message }
    };
  }

  /**
   * Generate a response based on the message and context
   */
  async generateResponse(message: string, context: ConversationContext): Promise<ConversationResponse> {
    const intent = await this.analyzeIntent(message, context);
    
    switch (intent.type) {
      case 'question':
        return await this.generateQuestionResponse(message, intent, context);
      
      case 'clarification':
        return this.generateClarificationResponse(message, intent, context);
      
      case 'general_chat':
        return this.generateChatResponse(message, intent, context);
      
      default:
        return this.generateDefaultResponse(message, context);
    }
  }

  /**
   * Handle clarification requests
   */
  async handleClarification(message: string, context: ConversationContext): Promise<ConversationResponse> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what can you do') || lowerMessage.includes('help')) {
      return {
        content: `I'm your intelligent blockchain analysis assistant! Here's what I can do:

🔍 **Wallet Analysis**: Analyze any wallet address across multiple blockchains
💰 **Fund Tracking**: Track how funds move between wallets and exchanges
📊 **Risk Assessment**: Identify potential risks and suspicious patterns
💡 **Insights**: Provide intelligent insights about wallet behavior
📈 **Historical Data**: Show transaction history and value changes over time

Just paste a wallet address and I'll start analyzing it for you!`,
        metadata: { type: 'capabilities_explanation' }
      };
    }

    if (lowerMessage.includes('how does it work') || lowerMessage.includes('process')) {
      return {
        content: `Here's how my analysis process works:

1. **🔍 Blockchain Detection**: I automatically detect which blockchains the wallet operates on
2. **💰 Balance Check**: I check current balances across all detected blockchains
3. **📊 Transaction History**: I gather all transaction history and patterns
4. **🧠 Deep Analysis**: I perform risk assessment and pattern analysis
5. **💡 Insights**: I generate intelligent insights and recommendations

The process takes about 30-60 seconds and I'll keep you updated in real-time!`,
        metadata: { type: 'process_explanation' }
      };
    }

    return {
      content: "I'm here to help with blockchain wallet analysis. Could you please clarify what specific information you're looking for?",
      metadata: { type: 'general_clarification' }
    };
  }

  /**
   * Handle general chat
   */
  async handleGeneralChat(message: string, context: ConversationContext): Promise<ConversationResponse> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        content: "Hello! 👋 I'm ready to help you with blockchain analysis. What would you like to explore today?",
        metadata: { type: 'greeting' }
      };
    }

    if (lowerMessage.includes('thank')) {
      return {
        content: "You're welcome! 😊 I'm here whenever you need blockchain analysis or have questions about crypto. Feel free to ask me anything!",
        metadata: { type: 'gratitude' }
      };
    }

    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return {
        content: "Goodbye! 👋 Thanks for using LYNX. Feel free to come back anytime for more blockchain analysis!",
        metadata: { type: 'farewell' }
      };
    }

    return {
      content: "I'm primarily focused on blockchain analysis, but I'm happy to chat! What would you like to know about crypto or blockchain technology?",
      metadata: { type: 'general_chat' }
    };
  }

  /**
   * Check if message is a wallet analysis request
   */
  private isWalletAnalysisRequest(message: string): boolean {
    const analysisKeywords = [
      'analyze', 'check', 'investigate', 'look up', 'examine', 'scan',
      'wallet', 'address', 'account', '0x', 'bc1', '1', '3'
    ];
    
    return analysisKeywords.some(keyword => message.includes(keyword)) ||
           /0x[a-fA-F0-9]{40}/.test(message) ||
           /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/.test(message) ||
           /bc1[a-z0-9]{39,59}/.test(message);
  }

  /**
   * Extract wallet address from message
   */
  private extractWalletAddress(message: string): string | null {
    // Ethereum/Sub chains
    const ethMatch = message.match(/0x[a-fA-F0-9]{40}/);
    if (ethMatch) return ethMatch[0];

    // Bitcoin
    const btcMatch = message.match(/[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59}/);
    if (btcMatch) return btcMatch[0];

    return null;
  }

  /**
   * Determine analysis type from message
   */
  private determineAnalysisType(message: string): 'quick' | 'deep' {
    const deepKeywords = ['deep', 'detailed', 'comprehensive', 'full', 'complete', 'thorough'];
    return deepKeywords.some(keyword => message.includes(keyword)) ? 'deep' : 'quick';
  }

  /**
   * Check if message is a blockchain question
   */
  private isBlockchainQuestion(message: string): boolean {
    const questionKeywords = [
      'what is', 'how does', 'explain', 'tell me about', 'what are',
      'blockchain', 'crypto', 'bitcoin', 'ethereum', 'token', 'defi', 'nft'
    ];
    
    return questionKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Extract topic from question
   */
  private extractTopic(message: string): string {
    const topics = ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'token', 'defi', 'nft', 'wallet'];
    return topics.find(topic => message.includes(topic)) || 'blockchain';
  }

  /**
   * Check if message is a clarification request
   */
  private isClarificationRequest(message: string): boolean {
    const clarificationKeywords = [
      'what can you do', 'how does it work', 'help', 'clarify', 'explain',
      'what do you mean', 'i don\'t understand'
    ];
    
    return clarificationKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Extract clarification type
   */
  private extractClarificationType(message: string): string {
    if (message.includes('what can you do')) return 'capabilities';
    if (message.includes('how does it work')) return 'process';
    if (message.includes('help')) return 'help';
    return 'general';
  }

  /**
   * Check if message is general chat
   */
  private isGeneralChat(message: string): boolean {
    const chatKeywords = [
      'hello', 'hi', 'hey', 'thank', 'thanks', 'bye', 'goodbye',
      'how are you', 'nice to meet you'
    ];
    
    return chatKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Extract chat type
   */
  private extractChatType(message: string): string {
    if (message.includes('hello') || message.includes('hi')) return 'greeting';
    if (message.includes('thank')) return 'gratitude';
    if (message.includes('bye')) return 'farewell';
    return 'general';
  }

  /**
   * Analyze sentiment of message
   */
  private analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'like', 'thank'];
    const negativeWords = ['bad', 'terrible', 'hate', 'dislike', 'awful', 'horrible'];
    
    const positiveCount = positiveWords.filter(word => message.includes(word)).length;
    const negativeCount = negativeWords.filter(word => message.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Generate question response
   */
  private async generateQuestionResponse(message: string, intent: IntentAnalysis, context: ConversationContext): Promise<ConversationResponse> {
    const topic = intent.entities.topic;
    
    // Try OpenAI first for intelligent responses
    if (this.openaiService) {
      try {
        const aiResponse = await this.openaiService.generateBlockchainEducation(topic, context);
        return {
          content: aiResponse.content,
          metadata: { 
            topic, 
            source: 'openai_gpt4',
            suggestions: aiResponse.suggestions,
            riskAssessment: aiResponse.riskAssessment
          }
        };
      } catch (error) {
        logger.warn('OpenAI response generation failed, falling back to knowledge base:', error);
      }
    }
    
    // Use knowledge base for common questions
    const knowledge = this.knowledgeBase.get(topic);
    if (knowledge) {
      return {
        content: knowledge.response,
        metadata: { topic, source: 'knowledge_base' }
      };
    }

    return {
      content: `I'd be happy to explain ${topic}! However, I'm primarily designed for wallet analysis. For detailed ${topic} information, I'd recommend checking out reputable crypto education resources. Would you like me to analyze a wallet address instead?`,
      metadata: { topic, type: 'redirect_to_analysis' }
    };
  }

  /**
   * Generate clarification response
   */
  private async generateClarificationResponse(message: string, intent: IntentAnalysis, context: ConversationContext): Promise<ConversationResponse> {
    const response = await this.handleClarification(message, context);
    return response;
  }

  /**
   * Generate chat response
   */
  private async generateChatResponse(message: string, intent: IntentAnalysis, context: ConversationContext): Promise<ConversationResponse> {
    const response = await this.handleGeneralChat(message, context);
    return response;
  }

  /**
   * Generate default response
   */
  private generateDefaultResponse(message: string, context: ConversationContext): ConversationResponse {
    return {
      content: "I'm not sure I understood that. I'm here to help with blockchain wallet analysis. You can paste a wallet address for me to analyze, or ask me about my capabilities!",
      metadata: { type: 'default_response' }
    };
  }

  /**
   * Initialize knowledge base
   */
  private initializeKnowledgeBase(): void {
    this.knowledgeBase.set('blockchain', {
      response: `A blockchain is a distributed digital ledger that records transactions across a network of computers. It's the technology behind cryptocurrencies like Bitcoin and Ethereum. Key features include:

🔗 **Decentralization**: No single entity controls the network
🔒 **Security**: Transactions are cryptographically secured
📝 **Transparency**: All transactions are publicly visible
⏰ **Immutability**: Once recorded, transactions cannot be altered

Would you like me to analyze a specific wallet to show you how blockchain data works in practice?`
    });

    this.knowledgeBase.set('crypto', {
      response: `Cryptocurrency is digital or virtual currency that uses cryptography for security. Unlike traditional currencies, crypto operates on decentralized networks based on blockchain technology.

💰 **Examples**: Bitcoin (BTC), Ethereum (ETH), and thousands of others
🌐 **Decentralized**: No central bank or government controls them
🔐 **Secure**: Uses advanced cryptography to secure transactions
⚡ **Fast**: International transfers can be completed in minutes

I can analyze any crypto wallet to show you real examples of how this works!`
    });

    this.knowledgeBase.set('wallet', {
      response: `A cryptocurrency wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. Think of it like a digital bank account, but you control the private keys.

🔑 **Private Keys**: Like a password that gives you control over your funds
📬 **Public Address**: Like an account number that others can send funds to
💼 **Types**: Hardware wallets (most secure), software wallets, and exchange wallets
🔍 **Analysis**: I can analyze any wallet address to show you its transaction history and current holdings

Would you like me to analyze a wallet address to demonstrate?`
    });
  }

  /**
   * Initialize response templates
   */
  private initializeResponseTemplates(): void {
    this.responseTemplates.set('greeting', [
      "Hello! 👋 I'm ready to help you with blockchain analysis.",
      "Hi there! 🔍 Let's explore some blockchain data together.",
      "Hey! 💡 I'm your intelligent blockchain assistant."
    ]);

    this.responseTemplates.set('gratitude', [
      "You're welcome! 😊 I'm here whenever you need blockchain analysis.",
      "Happy to help! 🚀 Feel free to ask me anything about crypto.",
      "Anytime! 💪 Let me know if you need more analysis."
    ]);
  }
}
