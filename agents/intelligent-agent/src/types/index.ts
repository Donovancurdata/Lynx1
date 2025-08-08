export interface AgentSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'ended' | 'paused';
  context: ConversationContext;
  lastActivity: Date;
}

export interface ConversationContext {
  conversationHistory: (ClientMessage | AgentMessage)[];
  currentAnalysis: CurrentAnalysis | null;
  userPreferences: Record<string, any>;
  insights: IntelligentInsight[];
}

export interface CurrentAnalysis {
  id: string;
  walletAddress: string;
  status: 'starting' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
}

export interface ClientMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'user';
  metadata?: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'agent';
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  id: string;
  content: string;
  type: 'welcome' | 'analysis_started' | 'analysis_complete' | 'answer' | 'clarification' | 'chat' | 'error' | 'progress';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AnalysisProgress {
  analysisId: string;
  step: string;
  progress: number;
  message: string;
  data?: Record<string, any>;
}

export interface IntelligentInsight {
  id: string;
  title: string;
  description: string;
  type: 'risk' | 'opportunity' | 'pattern' | 'anomaly' | 'recommendation';
  confidence: number;
  data?: Record<string, any>;
  timestamp: Date;
}

export interface IntentAnalysis {
  type: 'wallet_analysis' | 'question' | 'clarification' | 'general_chat' | 'unknown';
  confidence: number;
  entities: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ConversationResponse {
  content: string;
  metadata?: Record<string, any>;
}

export interface RealTimeMessage {
  type: 'message' | 'progress' | 'analysis_update' | 'insight' | 'error';
  data: AgentResponse | AnalysisProgress | IntelligentInsight | any;
  timestamp: Date;
}

export interface AgentCapabilities {
  naturalLanguageProcessing: boolean;
  realTimeCommunication: boolean;
  progressiveAnalysis: boolean;
  intelligentInsights: boolean;
  multiBlockchainAnalysis: boolean;
  conversationMemory: boolean;
  autonomousDecisionMaking: boolean;
}

export interface AgentConfig {
  maxConcurrentSessions: number;
  sessionTimeoutMinutes: number;
  enableRealTimeUpdates: boolean;
  enableProgressiveResults: boolean;
  enableIntelligentInsights: boolean;
  supportedBlockchains: string[];
  analysisTimeoutSeconds: number;
}
