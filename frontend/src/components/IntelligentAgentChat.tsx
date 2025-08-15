'use client'

import React, { useState, useEffect, useRef } from 'react';
import { AgentResponse, AnalysisProgress, RealTimeMessage } from '../../../agents/intelligent-agent/src/types';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'agent' | 'progress' | 'system';
  timestamp: Date;
  metadata?: any;
}

interface IntelligentAgentChatProps {
  className?: string;
}

export const IntelligentAgentChat: React.FC<IntelligentAgentChatProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const [uptime, setUptime] = useState<string>('');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<'offline' | 'connecting' | 'connected' | 'error'>('offline');
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const uptimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    connectToAgent();
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize the textarea based on content
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [inputMessage]);

  // Update uptime display
  useEffect(() => {
    if (connectionTime) {
      const updateUptime = () => {
        const now = new Date();
        const diff = now.getTime() - connectionTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setUptime(`${hours}h ${minutes}m ${seconds}s`);
      };
      
      updateUptime();
      uptimeIntervalRef.current = setInterval(updateUptime, 1000);
    } else {
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
        uptimeIntervalRef.current = null;
      }
      setUptime('');
    }

    return () => {
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
      }
    };
  }, [connectionTime]);

  const connectToAgent = () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting || isConnected) {
      return;
    }

    setIsConnecting(true);
    setAgentStatus('connecting');
    setConnectionAttempts(prev => prev + 1);
    setLastError(null);
    
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      const ws = new WebSocket('ws://localhost:3004');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setAgentStatus('connected');
        setConnectionTime(new Date());
        console.log('Connected to Intelligent Agent');
        
        // Start a new session
        ws.send(JSON.stringify({
          type: 'start_session',
          initialMessage: null
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: RealTimeMessage = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing agent message:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        setAgentStatus('offline');
        setConnectionTime(null);
        console.log('Disconnected from Intelligent Agent', event.code, event.reason);
        
        // Only try to reconnect if it wasn't a manual close and we're not already connected
        if (event.code !== 1000 && !isConnected) {
          setTimeout(() => {
            // Double-check we're still not connected before reconnecting
            if (!isConnected && !wsRef.current && !isConnecting) {
              connectToAgent();
            }
          }, 5000); // Increased delay to 5 seconds
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setAgentStatus('error');
        setLastError('Connection error occurred');
        // Don't set isConnected to false on error, let onclose handle it
      };

    } catch (error) {
      console.error('Failed to connect to agent:', error);
      setIsConnected(false);
      setIsConnecting(false);
      setAgentStatus('error');
      setLastError(error instanceof Error ? error.message : 'Failed to connect');
    }
  };

  const handleMessage = (data: any) => {
    console.log('Received agent message:', data);

    // Handle non-typed events like initial connection handshake
    if ((data as any).type === 'connection') {
      const anyData = data as any;
      setClientId(anyData.data?.clientId ?? null);
      addMessage({
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: 'Connected to LYNX Intelligent Agent! 👋',
        type: 'system',
        timestamp: new Date()
      });
      return;
    }

    // Handle connection confirmation message
    if ((data as any).type === 'message' && (data as any).data?.message?.includes('Connected to LYNX Intelligent Agent')) {
      const anyData = data as any;
      setClientId(anyData.data?.clientId ?? null);
      addMessage({
        id: `connection-confirmed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: '🤖 LYNX Intelligent Agent is now online and ready to help! You can ask me to analyze wallets, explain blockchain concepts, or answer any questions you have.',
        type: 'system',
        timestamp: new Date()
      });
      return;
    }

    switch (data.type) {
      case 'message':
        const agentResponse: AgentResponse = data.data as AgentResponse;
        if (agentResponse.content && agentResponse.content.trim() !== '') {
          // Check if this is an analysis start message
          if (agentResponse.metadata?.type === 'wallet_analysis_started') {
            // Add the initial analysis message
            addMessage({
              id: 'analysis-progress-message',
              content: agentResponse.content,
              type: 'agent',
              timestamp: agentResponse.timestamp || new Date(),
              metadata: { ...agentResponse.metadata, isProgressMessage: true }
            });
          } else if (agentResponse.metadata?.type === 'wallet_analysis_completed') {
            // Remove the progress message and add a normal completed message
            removeProgressMessage();
            addMessage({
              id: agentResponse.id || `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              content: agentResponse.content,
              type: 'agent',
              timestamp: agentResponse.timestamp || new Date(),
              metadata: { ...agentResponse.metadata, isCompletedAnalysis: true }
            });
          } else {
            // Regular message
            addMessage({
              id: agentResponse.id || `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              content: agentResponse.content,
              type: 'agent',
              timestamp: agentResponse.timestamp || new Date(),
              metadata: agentResponse.metadata
            });
          }
        }
        setIsTyping(false);
        break;

      case 'progress':
        const progress: AnalysisProgress = data.data as AnalysisProgress;
        // Update the existing progress message instead of adding a new one
        updateProgressMessage(progress.message || 'Progress update', {
          type: 'wallet_analysis_progress',
          progress: progress.progress,
          stage: progress.step,
          isProgressMessage: true
        });
        if (progress.analysisId) {
          setCurrentAnalysis((prev: any) => ({
            ...prev,
            progress: progress.progress,
            step: progress.step,
            data: progress.data
          }));
        }
        break;

      case 'insight':
        addMessage({
          id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `💡 **${(data as any).data?.title || 'Insight'}**: ${(data as any).data?.description || 'No description available'}`,
          type: 'agent',
          timestamp: new Date(),
          metadata: (data as any).data
        });
        break;

      case 'error':
        addMessage({
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `❌ Error: ${(data as any).data?.message || 'Unknown error'}`,
          type: 'system',
          timestamp: new Date()
        });
        setIsTyping(false);
        break;

      case 'analysis_update':
        // Optional: handle additional updates if needed
        break;

      default:
        console.warn('Unknown message type:', (data as any).type);
        addMessage({
          id: `unknown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `Unknown message type: ${(data as any).type}`,
          type: 'system',
          timestamp: new Date()
        });
        break;
    }
  };

  // Function to update the progress message instead of adding new ones
  const updateProgressMessage = (content: string, metadata?: any) => {
    setMessages(prev => {
      const updatedMessages = prev.map(message => {
        if (message.id === 'analysis-progress-message' || message.metadata?.isProgressMessage) {
          return {
            ...message,
            content: content,
            metadata: { ...message.metadata, ...metadata },
            timestamp: new Date()
          };
        }
        return message;
      });
      
      // If no progress message exists, create one
      if (!updatedMessages.some(m => m.id === 'analysis-progress-message' || m.metadata?.isProgressMessage)) {
        updatedMessages.push({
          id: 'analysis-progress-message',
          content: content,
          type: 'agent',
          timestamp: new Date(),
          metadata: { ...metadata, isProgressMessage: true }
        });
      }
      
      return updatedMessages;
    });
  };

  // Function to remove the progress message
  const removeProgressMessage = () => {
    setMessages(prev => prev.filter(message => 
      message.id !== 'analysis-progress-message' && !message.metadata?.isProgressMessage
    ));
  };

  // Function to download analysis results
  const downloadResults = (content: string, metadata?: any) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `wallet-analysis-${timestamp}.txt`;
    
    const downloadContent = `LYNX Wallet Analysis Results
Generated: ${new Date().toLocaleString()}
${metadata?.walletAddress ? `Wallet Address: ${metadata.walletAddress}` : ''}
${metadata?.analysisType ? `Analysis Type: ${metadata.analysisType}` : ''}

${content}`;
    
    const blob = new Blob([downloadContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addMessage = (message: Message) => {
    // Ensure unique ID if not provided
    if (!message.id) {
      message.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Ensure the message ID is unique by checking existing messages
    setMessages(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      let uniqueId = message.id;
      let counter = 1;
      
      while (existingIds.has(uniqueId)) {
        uniqueId = `${message.id}-${counter}`;
        counter++;
      }
      
      return [...prev, { ...message, id: uniqueId }];
    });
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !isConnected || !wsRef.current) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: inputMessage,
      type: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsTyping(true);

    // Send message to agent
    wsRef.current.send(JSON.stringify({
      type: 'message',
      content: inputMessage
    }));

    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessage = (content: string) => {
    // Handle undefined or null content
    if (!content) {
      return '';
    }
    
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'connected':
        return 'bg-primary';
      case 'connecting':
        return 'bg-accent';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (agentStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Offline';
    }
  };

  const getStatusIcon = () => {
    switch (agentStatus) {
      case 'connected':
        return '🟢';
      case 'connecting':
        return '🟡';
      case 'error':
        return '🔴';
      default:
        return '⚫';
    }
  };

  return (
          <div className={`flex flex-col h-full card-cyber animate-fade-in ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse shadow-neon`}></div>
          <h3 className="text-lg font-semibold text-text-primary font-orbitron">LYNX Intelligent Agent</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-text-primary font-oxanium">{getStatusIcon()} {getStatusText()}</span>
          </div>
          {isConnected && (
            <button
              onClick={connectToAgent}
              className="btn-cyber-secondary text-xs px-2 py-1 group relative overflow-hidden"
              title="Refresh Connection"
            >
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Status Info */}
      <div className="flex justify-end px-4 py-2 bg-bg-1/50 border-b border-border">
        <div className="flex flex-col items-end space-y-1">
          {isConnected && connectionTime && (
            <div className="text-xs text-muted">
              Connected: {connectionTime.toLocaleTimeString()} | Uptime: {uptime}
            </div>
          )}
          {connectionAttempts > 0 && !isConnected && (
            <div className="text-xs text-muted">
              Attempts: {connectionAttempts} {lastError && `| Error: ${lastError}`}
            </div>
          )}
          {clientId && (
            <div className="text-xs text-muted">
              Session: {clientId.substring(0, 8)}...
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-md lg:max-w-2xl px-4 py-2 rounded-lg shadow-sm transition ${
                message.type === 'user'
                  ? 'bg-gradient-primary text-bg-0'
                  : message.metadata?.isProgressMessage
                  ? 'bg-surface border-2 border-pink-500 text-white animate-pulse'
                  : message.type === 'progress'
                  ? 'bg-surface border border-accent text-accent'
                  : message.type === 'system'
                  ? 'bg-surface border border-border text-muted'
                  : 'bg-surface border border-border text-text-primary'
              }`}
            >
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
              {message.metadata?.isProgressMessage && message.metadata?.progress && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-pink-300 mb-1">
                    <span>Progress: {message.metadata.progress}%</span>
                    <span>{message.metadata.stage?.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  <div className="w-full bg-surface-dark rounded-full h-1">
                    <div
                      className="bg-pink-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${message.metadata.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {message.metadata?.isCompletedAnalysis && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => downloadResults(message.content, message.metadata)}
                    className="btn-cyber-blue text-xs px-4 py-2 group relative overflow-hidden"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Analysis</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString() : new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border text-text-primary px-4 py-2 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="text-sm">Agent is thinking</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end space-x-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Ask me to analyze a wallet or ask about blockchain..." : "Connecting to Intelligent Agent..."}
            className="input-cyber flex-1 resize-none"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="btn-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted">
            Press Enter to send, Shift+Enter for new line
          </div>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-primary font-medium">Agent Ready</span>
              </div>
            )}
            {isConnecting && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-xs text-accent font-medium">Connecting...</span>
              </div>
            )}
            {!isConnected && !isConnecting && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-500 font-medium font-oxanium">Agent Offline</span>
                </div>
                <button
                  onClick={connectToAgent}
                  className="btn-cyber-secondary text-xs px-3 py-1.5 group relative overflow-hidden"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Reconnect</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
