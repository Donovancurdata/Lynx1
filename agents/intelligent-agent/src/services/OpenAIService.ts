import OpenAI from 'openai';
import { logger } from '../utils/logger';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface WalletAnalysisContext {
  walletAddress: string;
  analysisType: 'quick' | 'deep';
  blockchainData?: any;
  userPreferences?: Record<string, any>;
  conversationHistory?: string[];
}

export interface AIResponse {
  content: string;
  metadata?: Record<string, any>;
  suggestions?: string[];
  riskAssessment?: 'high' | 'medium' | 'low';
  nextSteps?: string[];
}

/**
 * OpenAI Service for Intelligent Agent
 * 
 * Handles all interactions with OpenAI GPT-4 model for:
 * - Wallet analysis explanations
 * - Blockchain education
 * - Risk assessment
 * - Customer interaction
 * - Code review and feature suggestions
 */
export class OpenAIService {
  private openai: OpenAI;
  private config: OpenAIConfig;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.config = {
      apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7')
    };

    this.openai = new OpenAI({
      apiKey: this.config.apiKey
    });

    logger.info('OpenAI Service initialized with GPT-4');
  }

  /**
   * Generate wallet analysis explanation using GPT-4
   */
  async generateWalletAnalysis(context: WalletAnalysisContext): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildWalletAnalysisSystemPrompt(context);
      
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this wallet address: ${context.walletAddress}`
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      const content = response.choices[0]?.message?.content || 'Unable to generate analysis';
      
      return this.parseAIResponse(content);
    } catch (error) {
      logger.error('Error generating wallet analysis with OpenAI:', error);
      return {
        content: 'I apologize, but I encountered an error while analyzing the wallet. Please try again or contact support.',
        metadata: { error: true }
      };
    }
  }

  /**
   * Generate blockchain education response
   */
  async generateBlockchainEducation(topic: string, context?: any): Promise<AIResponse> {
    try {
      const systemPrompt = `You are an expert blockchain analyst and educator. Your role is to explain blockchain concepts in a clear, engaging way that helps customers understand the technology and your role as a wallet analyzer.

Key responsibilities:
1. Explain blockchain concepts clearly and concisely
2. Describe your role as a blockchain wallet analyzer - you investigate wallets, analyze transactions, assess risk, and provide insights
3. Help customers understand the value of wallet analysis for security and investment decisions
4. Provide examples and analogies when helpful
5. Be encouraging and supportive
6. Explain that you can do both quick analysis and deep analysis
7. Mention your ability to detect which blockchains a wallet operates on
8. Highlight your risk assessment capabilities

Current topic: ${topic}`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please explain: ${topic}`
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      const content = response.choices[0]?.message?.content || 'Unable to generate explanation';
      
      return this.parseAIResponse(content);
    } catch (error) {
      logger.error('Error generating blockchain education with OpenAI:', error);
      return {
        content: 'I apologize, but I encountered an error while explaining that concept. Please try again.',
        metadata: { error: true }
      };
    }
  }

  /**
   * Generate risk assessment based on deep analysis
   */
  async generateRiskAssessment(walletData: any, analysisType: 'quick' | 'deep'): Promise<AIResponse> {
    try {
      const systemPrompt = `You are a blockchain security expert and risk analyst. Your job is to assess the risk level of cryptocurrency wallets based on their transaction patterns, fund flows, and blockchain activity.

Risk Assessment Criteria:
- **HIGH RISK**: Suspicious patterns, large fund movements, connections to known bad actors, unusual transaction timing, mixing services usage, high-frequency trading with suspicious patterns
- **MEDIUM RISK**: Some concerning patterns, moderate fund movements, mixed transaction history, occasional unusual activity, moderate risk indicators
- **LOW RISK**: Normal patterns, consistent behavior, transparent transaction history, typical user behavior, no suspicious indicators

Provide:
1. Risk level assessment (HIGH/MEDIUM/LOW) with clear reasoning
2. Key factors contributing to the risk level
3. Specific concerns or positive indicators
4. Recommendations for further investigation if needed
5. Explanation of what each risk level means for the user

Be thorough but concise. Focus on actionable insights. Use the analysis data to support your assessment.`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please assess the risk level for this wallet based on ${analysisType} analysis data: ${JSON.stringify(walletData, null, 2)}`
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      const content = response.choices[0]?.message?.content || 'Unable to generate risk assessment';
      
      return this.parseAIResponse(content);
    } catch (error) {
      logger.error('Error generating risk assessment with OpenAI:', error);
      return {
        content: 'I apologize, but I encountered an error while assessing the wallet risk. Please try again.',
        metadata: { error: true }
      };
    }
  }

  /**
   * Generate customer information gathering prompts
   */
  async generateCustomerInfoGathering(context: any): Promise<AIResponse> {
    try {
      const systemPrompt = `You are a friendly blockchain analyst assistant. Your goal is to gather helpful information from customers to provide better analysis and build rapport.

Information to gather:
1. Customer's name (for personalization)
2. How long they've been involved with blockchain/crypto
3. Their purpose for using blockchain (trading, investment, development, etc.)
4. Any specific concerns or questions they have
5. Their experience level with blockchain technology

Be conversational and natural. Don't be pushy. Explain why this information helps you provide better service.

SPECIFIC QUESTIONS TO ASK:
- "What's your name? It helps me personalize our conversation."
- "How long have you been involved with blockchain and cryptocurrency?"
- "What brings you to blockchain? Are you trading, investing, developing, or something else?"

Make it feel like a natural conversation, not an interrogation.`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please help me gather some information from this customer to provide better service. Context: ${JSON.stringify(context, null, 2)}`
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      const content = response.choices[0]?.message?.content || 'Unable to generate customer info gathering prompts';
      
      return this.parseAIResponse(content);
    } catch (error) {
      logger.error('Error generating customer info gathering with OpenAI:', error);
      return {
        content: 'I apologize, but I encountered an error. Let me ask you a few questions to better assist you.',
        metadata: { error: true }
      };
    }
  }

  /**
   * Review code and suggest new features
   */
  async reviewCodeAndSuggestFeatures(codeContext: any): Promise<AIResponse> {
    try {
      const systemPrompt = `You are a senior blockchain developer and code reviewer for the LYNX platform. Your job is to:
1. Review code for potential improvements
2. Suggest new features that could enhance the LYNX blockchain analysis platform
3. Identify opportunities for optimization
4. Stay up to date with blockchain development trends
5. Suggest integrations with new blockchain networks or tools
6. Review the platform's current capabilities and suggest enhancements
7. Identify gaps in functionality that could be filled with new features
8. Suggest improvements to the user experience and analysis capabilities

Be constructive and forward-thinking. Focus on practical improvements that add value to the LYNX platform.

SPECIFIC AREAS TO FOCUS ON:
- Blockchain detection and analysis improvements
- Risk assessment enhancements
- User interface and experience improvements
- New blockchain network integrations
- Performance optimizations
- Security enhancements`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please review this code and suggest improvements or new features: ${JSON.stringify(codeContext, null, 2)}`
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });

      const content = response.choices[0]?.message?.content || 'Unable to review code';
      
      return this.parseAIResponse(content);
    } catch (error) {
      logger.error('Error reviewing code with OpenAI:', error);
      return {
        content: 'I apologize, but I encountered an error while reviewing the code. Please try again.',
        metadata: { error: true }
      };
    }
  }

  /**
   * Build system prompt for wallet analysis
   */
  private buildWalletAnalysisSystemPrompt(context: WalletAnalysisContext): string {
    return `You are an intelligent blockchain wallet analyzer for the LYNX platform. Your role is to provide comprehensive wallet analysis and customer support.

CORE RESPONSIBILITIES:
1. **Quick Analysis**: Provide a comprehensive rundown of the wallet and its blockchain presence
2. **Blockchain Education**: Explain blockchain concepts and your role as a wallet analyzer
3. **Deep Analysis Offer**: Always offer to perform deep analysis for comprehensive insights
4. **Code Review**: Stay updated with platform features and suggest improvements
5. **Risk Assessment**: Evaluate wallet risk level based on analysis data
6. **Customer Information Gathering**: Collect helpful details like name, blockchain experience, and purpose

ANALYSIS APPROACH:
- Be thorough but conversational
- Explain technical concepts in simple terms
- Provide actionable insights
- Offer to gather more information from customers
- Suggest next steps and additional analysis options

CUSTOMER INTERACTION STYLE:
- Professional but friendly
- Educational and helpful
- Proactive in offering additional services
- Clear about your capabilities and limitations

SPECIFIC REQUIREMENTS:
- Always offer deep analysis after quick analysis
- Explain what blockchain the wallet belongs to
- Describe your job as a blockchain wallet analyzer
- Offer to gather customer information (name, blockchain experience, purpose)
- Provide risk assessment (high/medium/low) with explanations
- Stay updated with platform features and suggest improvements

Current analysis type: ${context.analysisType}
Wallet address: ${context.walletAddress}`;
  }

  /**
   * Parse AI response and extract structured data
   */
  private parseAIResponse(content: string): AIResponse {
    // Extract risk assessment if present
    const riskMatch = content.match(/risk\s*level?:\s*(high|medium|low)/i);
    const riskAssessment = riskMatch ? (riskMatch[1].toLowerCase() as 'high' | 'medium' | 'low') : undefined;

    // Extract suggestions (lines starting with - or •)
    const suggestions = content
      .split('\n')
      .filter(line => line.trim().match(/^[-•]/))
      .map(line => line.trim().replace(/^[-•]\s*/, ''));

    // Extract next steps
    const nextStepsMatch = content.match(/next\s*steps?:(.*?)(?=\n\n|\n[A-Z]|$)/is);
    const nextSteps = nextStepsMatch 
      ? nextStepsMatch[1].split('\n').filter(line => line.trim()).map(line => line.trim())
      : undefined;

    return {
      content,
      metadata: {
        riskAssessment,
        hasSuggestions: suggestions.length > 0,
        hasNextSteps: !!nextSteps
      },
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      riskAssessment,
      nextSteps
    };
  }

  /**
   * Get service configuration
   */
  getConfig(): OpenAIConfig {
    return { ...this.config };
  }

  /**
   * Test OpenAI connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.openai.models.list();
      return response.data.length > 0;
    } catch (error) {
      logger.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}
