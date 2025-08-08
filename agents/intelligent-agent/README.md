# LYNX Intelligent Agent 🤖

An intelligent AI agent that transforms your blockchain analysis platform into a conversational, autonomous system that can think for itself and communicate with clients in real-time.

## 🌟 Features

### 🧠 **Intelligent Capabilities**
- **Natural Language Processing**: Understands and responds to natural language queries
- **Autonomous Decision Making**: Makes intelligent decisions about analysis priorities
- **Conversation Memory**: Remembers context and user preferences across sessions
- **Progressive Analysis**: Shows results as they're being gathered in real-time

### 💬 **Real-time Communication**
- **WebSocket-based**: Instant bidirectional communication
- **Live Updates**: Progressive results and insights as analysis progresses
- **Multi-client Support**: Handles multiple concurrent user sessions
- **Typing Indicators**: Shows when the agent is thinking

### 🔍 **Advanced Analysis**
- **Multi-blockchain Support**: Analyzes wallets across Ethereum, Bitcoin, Solana, and more
- **Intelligent Insights**: Generates AI-powered insights and recommendations
- **Risk Assessment**: Identifies potential risks and suspicious patterns
- **Pattern Recognition**: Detects trading patterns and behavioral anomalies

### 🎯 **User Experience**
- **Conversational Interface**: Natural chat-based interaction
- **Progressive Results**: See analysis progress in real-time
- **Intelligent Recommendations**: Personalized suggestions based on wallet data
- **Educational Content**: Explains blockchain concepts and analysis results

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- TypeScript
- Access to the existing LYNX backend services

### Installation

1. **Navigate to the intelligent agent directory:**
   ```bash
   cd agents/intelligent-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the agent:**
   ```bash
   npm run build
   ```

4. **Start the intelligent agent:**
   ```bash
   npm start
   ```

The agent will start on port 3004 and be ready to accept WebSocket connections.

### Development Mode

For development with auto-reload:
```bash
npm run dev
```

## 🏗️ Architecture

### Core Components

```
intelligent-agent/
├── src/
│   ├── IntelligentAgent.ts          # Main agent orchestrator
│   ├── services/
│   │   ├── ConversationManager.ts   # NLP and intent analysis
│   │   ├── RealTimeCommunicator.ts  # WebSocket communication
│   │   ├── IntelligentInsights.ts   # AI insights generation
│   │   └── AnalysisOrchestrator.ts  # Analysis coordination
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   └── utils/
│       └── logger.ts                # Logging utilities
```

### Integration Points

- **Agent1WIA**: Leverages existing wallet investigation capabilities
- **Frontend**: WebSocket connection for real-time chat interface
- **Backend Services**: Integrates with existing blockchain analysis APIs

## 💬 Usage Examples

### Basic Wallet Analysis
```
User: "Analyze wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
Agent: "🔍 I'm starting to analyze wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 for you. Let me gather some initial information..."

[Progress updates in real-time]
✅ Found wallet on ethereum blockchain (confidence: 95%)
💰 Current total value: $125.5K
📊 Found 1,247 transactions across all blockchains
🧠 Performing deep analysis and generating insights...
💡 Generating intelligent insights and recommendations...
```

### Educational Queries
```
User: "What is blockchain?"
Agent: "A blockchain is a distributed digital ledger that records transactions across a network of computers. It's the technology behind cryptocurrencies like Bitcoin and Ethereum. Key features include:

🔗 **Decentralization**: No single entity controls the network
🔒 **Security**: Transactions are cryptographically secured
📝 **Transparency**: All transactions are publicly visible
⏰ **Immutability**: Once recorded, transactions cannot be altered

Would you like me to analyze a specific wallet to show you how blockchain data works in practice?"
```

### Risk Assessment
```
User: "What are the risks of this wallet?"
Agent: "Based on my analysis, here are the key risks I've identified:

⚠️ **High Value Wallet**: This wallet contains over $125K in assets. Consider implementing additional security measures.

⚠️ **High Transaction Activity**: 1,247 transactions indicate very active trading. Monitor for potential wash trading patterns.

⚠️ **Exchange Interactions**: This wallet has interacted with known exchanges. Be aware of potential KYC implications.

💡 **Recommendations**: Consider using hardware wallets and multi-signature setups for enhanced security."
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the intelligent agent directory:

```env
# Logging
LOG_LEVEL=info

# WebSocket Server
WS_PORT=3004

# Agent Configuration
MAX_CONCURRENT_SESSIONS=100
SESSION_TIMEOUT_MINUTES=30
ENABLE_REAL_TIME_UPDATES=true
ENABLE_PROGRESSIVE_RESULTS=true
ENABLE_INTELLIGENT_INSIGHTS=true
ANALYSIS_TIMEOUT_SECONDS=300
```

### Agent Configuration

The agent can be configured through the `AgentConfig` interface:

```typescript
const config: AgentConfig = {
  maxConcurrentSessions: 100,
  sessionTimeoutMinutes: 30,
  enableRealTimeUpdates: true,
  enableProgressiveResults: true,
  enableIntelligentInsights: true,
  supportedBlockchains: ['ethereum', 'bitcoin', 'solana', 'polygon'],
  analysisTimeoutSeconds: 300
};
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Specific Features
```bash
# Test conversation manager
npm test -- --testNamePattern="ConversationManager"

# Test real-time communication
npm test -- --testNamePattern="RealTimeCommunicator"

# Test intelligent insights
npm test -- --testNamePattern="IntelligentInsights"
```

## 📊 Monitoring

### Logs
The agent generates comprehensive logs:
- `logs/intelligent-agent.log` - All logs
- `logs/intelligent-agent-error.log` - Error logs only
- `logs/intelligent-agent-exceptions.log` - Uncaught exceptions
- `logs/intelligent-agent-rejections.log` - Promise rejections

### Health Checks
```bash
# Check agent status
curl http://localhost:3004/health

# Get active sessions
curl http://localhost:3004/sessions

# Get agent capabilities
curl http://localhost:3004/capabilities
```

## 🔌 API Integration

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:3004');

// Start a session
ws.send(JSON.stringify({
  type: 'start_session',
  initialMessage: 'Hello, can you analyze a wallet for me?'
}));

// Send a message
ws.send(JSON.stringify({
  type: 'message',
  content: 'Analyze wallet 0x123...'
}));

// Listen for responses
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Agent response:', data);
};
```

### Message Types

#### Client to Agent
- `start_session` - Start a new conversation session
- `message` - Send a text message to the agent
- `end_session` - End the current session

#### Agent to Client
- `connection` - Connection confirmation with client ID
- `message` - Agent response message
- `progress` - Analysis progress update
- `insight` - Intelligent insight or recommendation
- `error` - Error message

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3004
CMD ["node", "dist/index.js"]
```

### PM2 Deployment
```bash
pm2 start dist/index.js --name "lynx-intelligent-agent"
pm2 save
pm2 startup
```

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: Implement rate limiting for WebSocket connections
- **Session Management**: Automatic session cleanup and timeout
- **Error Handling**: Comprehensive error handling without exposing sensitive data
- **Logging**: Secure logging without sensitive information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the logs for debugging information
- Review the configuration options

---

**The LYNX Intelligent Agent transforms your blockchain analysis from a static tool into a dynamic, conversational AI assistant that thinks for itself and provides intelligent insights in real-time.** 🚀
