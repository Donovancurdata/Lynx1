'use client'

import React, { useState, useEffect, useRef } from 'react';
import { AgentResponse, AnalysisProgress, RealTimeMessage } from '../../agents/intelligent-agent/src/types';

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
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectToAgent();
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToAgent = () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting || isConnected) {
      return;
    }

    setIsConnecting(true);
    
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
          handleAgentMessage(data);
        } catch (error) {
          console.error('Error parsing agent message:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
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
        // Don't set isConnected to false on error, let onclose handle it
      };

    } catch (error) {
      console.error('Failed to connect to agent:', error);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  const handleAgentMessage = (data: RealTimeMessage) => {
    console.log('Received agent message:', data);
    
    switch (data.type) {
      case 'connection':
        setClientId(data.data.clientId);
        addMessage({
          id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: 'Connected to LYNX Intelligent Agent! 👋',
          type: 'system',
          timestamp: new Date()
        });
        break;

      case 'message':
        const agentResponse: AgentResponse = data.data;
        // Only add message if it has meaningful content
        if (agentResponse.content && agentResponse.content.trim() !== '') {
          addMessage({
            id: agentResponse.id || `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content: agentResponse.content,
            type: 'agent',
            timestamp: agentResponse.timestamp || new Date(),
            metadata: agentResponse.metadata
          });
        }
        setIsTyping(false);
        break;

      case 'progress':
        const progress: AnalysisProgress = data.data;
        addMessage({
          id: progress.analysisId || `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: progress.message || 'Progress update',
          type: 'progress',
          timestamp: new Date(),
          metadata: progress
        });
        
        // Update current analysis progress
        if (progress.analysisId) {
          setCurrentAnalysis(prev => ({
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
          content: `💡 **${data.data.title || 'Insight'}**: ${data.data.description || 'No description available'}`,
          type: 'agent',
          timestamp: new Date(),
          metadata: data.data
        });
        break;

      case 'error':
        addMessage({
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `❌ Error: ${data.data.message || 'Unknown error'}`,
          type: 'system',
          timestamp: new Date()
        });
        setIsTyping(false);
        break;

      default:
        console.warn('Unknown message type:', data.type);
        addMessage({
          id: `unknown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `Unknown message type: ${data.type}`,
          type: 'system',
          timestamp: new Date()
        });
        break;
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="text-lg font-semibold text-gray-900">LYNX Intelligent Agent</h3>
        </div>
                 <div className="text-sm text-gray-500">
           {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'progress'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : message.type === 'system'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString() : new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="text-sm">Agent is thinking</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Progress Bar */}
      {currentAnalysis && currentAnalysis.progress > 0 && currentAnalysis.progress < 100 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentAnalysis.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{currentAnalysis.progress}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {currentAnalysis.step}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to analyze a wallet or ask about blockchain..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};
