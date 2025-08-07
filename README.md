# LYNX - Ledger Yield & Node eXplorer

## Overview
LYNX is an AI-powered blockchain analytics platform that uses multiple specialized AI agents to examine wallet transactions, track fund flows, and provide comprehensive breakdowns of wallet activities across multiple blockchains.

## Multi-Agent Architecture

### Agent 1: Wallet Investigation Agent (WIA)
**Primary Responsibilities:**
- **Blockchain Detection**: Automatically identify which blockchain a wallet belongs to
- **Fund Analysis**: Determine what funds were in the wallet and their historical values
- **Temporal Analysis**: Track dates and times of all transactions
- **Data Storage**: Store all investigation results in Microsoft OneLake/Fabric
- **Wallet Opinion**: Assess if this is a main wallet or if the user has multiple wallets
- **Fund Flow Tracking**: Monitor how and where all funds moved

### Agent 2: Multi-Wallet Correlation Agent (MWCA)
**Primary Responsibilities:**
- **Cross-Wallet Analysis**: Evaluate Agent 1's opinion and identify related wallets
- **User Profiling**: Determine if multiple wallets belong to the same user
- **Pattern Recognition**: Identify wallet clustering and behavioral patterns
- **Risk Assessment**: Flag suspicious wallet networks for further review

### Agent 3: Forensic Analysis Agent (FAA)
**Primary Responsibilities:**
- **Deep Transaction Analysis**: Perform forensic-level investigation of flagged wallets
- **Compliance Checking**: Verify regulatory compliance and identify violations
- **Threat Assessment**: Evaluate potential risks and threats
- **Report Generation**: Create comprehensive forensic reports

### Agent 4: Intelligence Synthesis Agent (ISA)
**Primary Responsibilities:**
- **Data Integration**: Combine insights from all other agents
- **Trend Analysis**: Identify broader patterns and trends
- **Predictive Modeling**: Forecast future wallet behaviors
- **Strategic Recommendations**: Provide actionable intelligence

## Core Features
- **Multi-Agent AI System**: Specialized agents working in coordination
- **Automatic Blockchain Detection**: Identify wallet blockchain without user input
- **Comprehensive Fund Tracking**: Monitor all fund movements and destinations
- **Multi-Wallet User Profiling**: Identify users with multiple wallets
- **Microsoft OneLake/Fabric Integration**: Centralized data storage and analysis
- **Forensic-Level Analysis**: Deep investigation capabilities
- **Predictive Intelligence**: AI-powered forecasting and recommendations
- **User-Friendly UI**: Simple interface for wallet address input

## Development Phases

### Phase 1: Foundation & Core Infrastructure
- [x] Project setup and architecture
- [x] Basic UI/UX for wallet input
- [ ] Multi-agent framework setup
- [ ] Microsoft OneLake/Fabric integration setup
- [ ] Agent 1 (WIA) development
- [ ] Basic wallet validation system

### Phase 2: Agent 1 - Wallet Investigation Agent
- [ ] Automatic blockchain detection
- [ ] Fund analysis and historical tracking
- [ ] Temporal transaction analysis
- [ ] Wallet opinion generation
- [ ] Fund flow tracking implementation
- [ ] OneLake data storage integration

### Phase 3: Agent 2 - Multi-Wallet Correlation Agent
- [ ] Cross-wallet analysis algorithms
- [ ] User profiling and clustering
- [ ] Pattern recognition systems
- [ ] Risk assessment framework
- [ ] Agent coordination protocols

### Phase 4: Agent 3 - Forensic Analysis Agent
- [ ] Deep transaction analysis
- [ ] Compliance checking systems
- [ ] Threat assessment algorithms
- [ ] Forensic report generation
- [ ] Advanced investigation tools

### Phase 5: Agent 4 - Intelligence Synthesis Agent
- [ ] Multi-agent data integration
- [ ] Trend analysis and pattern recognition
- [ ] Predictive modeling implementation
- [ ] Strategic recommendation engine
- [ ] Advanced AI coordination

### Phase 6: Production & Optimization
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment
- [ ] Monitoring and logging

## Technology Stack
- **Frontend**: React/Next.js with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **AI/ML**: Python with TensorFlow/PyTorch for agents
- **Database**: Microsoft OneLake/Fabric
- **Agent Framework**: Custom multi-agent orchestration
- **Blockchain APIs**: Various blockchain APIs (Etherscan, BlockCypher, etc.)
- **Deployment**: Azure (for OneLake integration)

## Agent Communication Flow

```
User Input → Agent 1 (WIA) → Data Storage → Agent 2 (MWCA) → 
Agent 3 (FAA) → Agent 4 (ISA) → Final Report
```

1. **User submits wallet address**
2. **Agent 1 (WIA)** investigates and stores data
3. **Agent 2 (MWCA)** analyzes for multi-wallet patterns
4. **Agent 3 (FAA)** performs forensic analysis if needed
5. **Agent 4 (ISA)** synthesizes all intelligence
6. **Final comprehensive report** delivered to user

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Project Structure
```
LYNX/
├── frontend/          # React/Next.js UI
├── backend/           # API and business logic
├── agents/            # AI Agent implementations
│   ├── agent1-wia/   # Wallet Investigation Agent
│   ├── agent2-mwca/  # Multi-Wallet Correlation Agent
│   ├── agent3-faa/   # Forensic Analysis Agent
│   └── agent4-isa/   # Intelligence Synthesis Agent
├── blockchain/        # Blockchain integration modules
├── database/          # Database schemas and models
├── docs/             # Documentation
└── tests/            # Test suites
``` 