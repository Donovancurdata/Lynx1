# LYNX Project Scope - Definitive Reference

## Project Overview

**LYNX** (Ledger Yield & Node eXplorer) is an AI-powered blockchain analytics platform that uses multiple specialized AI agents to examine wallet transactions, track fund flows, and provide comprehensive breakdowns of wallet activities across multiple blockchains.

## Core Mission

To provide comprehensive blockchain wallet analysis through a sophisticated multi-agent AI system that can:
- Automatically detect and analyze wallets across multiple blockchains
- Track fund flows and identify destinations
- Detect forex providers and withdrawal patterns
- Correlate multiple wallets belonging to the same user
- Provide forensic-level analysis and compliance checking
- Generate strategic intelligence and predictive insights

## Multi-Agent Architecture

### Agent 1: Wallet Investigation Agent (WIA) - Primary Investigator
**Purpose**: Primary investigation and data collection agent

**Core Functions**:
- **Automatic Blockchain Detection**: Identify wallet blockchain without user input
- **Fund Analysis**: Determine what funds were in the wallet and their historical values
- **Temporal Analysis**: Track dates and times of all transactions
- **Data Storage**: Store all investigation results in Microsoft OneLake/Fabric
- **Wallet Opinion**: Assess if this is a main wallet or if the user has multiple wallets
- **Fund Flow Tracking**: Monitor how and where all funds moved

**Input**: Wallet address
**Output**: Comprehensive investigation report with stored data

**Key Capabilities**:
- Multi-blockchain address validation
- Real-time balance checking
- Transaction history analysis
- Fund flow visualization
- Data persistence to OneLake

### Agent 2: Multi-Wallet Correlation Agent (MWCA) - Pattern Analyzer
**Purpose**: Identify and correlate multiple wallets belonging to the same user

**Core Functions**:
- **Cross-Wallet Analysis**: Evaluate Agent 1's findings for multi-wallet patterns
- **User Profiling**: Determine if multiple wallets belong to the same user
- **Pattern Recognition**: Identify wallet clustering and behavioral patterns
- **Risk Assessment**: Flag suspicious wallet networks for further review
- **Correlation Scoring**: Rate the likelihood of wallet relationships

**Input**: Agent 1's investigation results
**Output**: Multi-wallet correlation report with risk assessment

**Key Capabilities**:
- Behavioral pattern analysis
- Transaction timing correlation
- Fund flow pattern matching
- Risk scoring algorithms
- User profiling models

### Agent 3: Forensic Analysis Agent (FAA) - Deep Investigator
**Purpose**: Deep forensic investigation of flagged or suspicious wallets

**Core Functions**:
- **Deep Transaction Analysis**: Perform forensic-level investigation
- **Compliance Checking**: Verify regulatory compliance and identify violations
- **Threat Assessment**: Evaluate potential risks and threats
- **Report Generation**: Create comprehensive forensic reports
- **Evidence Collection**: Gather detailed evidence for investigations

**Input**: Flagged wallets from Agent 2 or direct requests
**Output**: Detailed forensic analysis report

**Key Capabilities**:
- Advanced transaction tracing
- Compliance rule checking
- Threat modeling
- Evidence documentation
- Regulatory reporting

### Agent 4: Intelligence Synthesis Agent (ISA) - Strategic Coordinator
**Purpose**: Combine insights from all agents and provide strategic intelligence

**Core Functions**:
- **Data Integration**: Combine insights from all other agents
- **Trend Analysis**: Identify broader patterns and trends
- **Predictive Modeling**: Forecast future wallet behaviors
- **Strategic Recommendations**: Provide actionable intelligence
- **Risk Prioritization**: Rank risks by severity and likelihood

**Input**: All agent reports and historical data
**Output**: Strategic intelligence report with recommendations

**Key Capabilities**:
- Multi-agent data fusion
- Trend prediction models
- Risk prioritization
- Strategic planning
- Predictive analytics

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

## Core Features

- **Multi-Agent AI System**: Specialized agents working in coordination
- **Automatic Blockchain Detection**: Identify wallet blockchain without user input
- **Comprehensive Fund Tracking**: Monitor all fund movements and destinations
- **Multi-Wallet User Profiling**: Identify users with multiple wallets
- **Microsoft OneLake/Fabric Integration**: Centralized data storage and analysis
- **Forensic-Level Analysis**: Deep investigation capabilities
- **Predictive Intelligence**: AI-powered forecasting and recommendations
- **User-Friendly UI**: Simple interface for wallet address input

## Technology Stack

- **Frontend**: React/Next.js with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **AI/ML**: Python with TensorFlow/PyTorch for agents
- **Database**: Microsoft OneLake/Fabric
- **Agent Framework**: Custom multi-agent orchestration
- **Blockchain APIs**: Various blockchain APIs (Etherscan, BlockCypher, etc.)
- **Deployment**: Azure (for OneLake integration)

## Supported Blockchains

- **Ethereum** (ETH)
- **Bitcoin** (BTC)
- **Binance Smart Chain** (BNB)
- **Polygon** (MATIC)
- **Solana** (SOL)
- **Avalanche** (AVAX)
- **Arbitrum** (ARB)
- **Optimism** (OP)

## Development Phases

### Phase 1: Foundation & Core Infrastructure (Weeks 1-4)
- [x] Project setup and architecture
- [x] Basic UI/UX for wallet input
- [ ] Multi-agent framework setup
- [ ] Microsoft OneLake/Fabric integration setup
- [ ] Agent 1 (WIA) development
- [ ] Basic wallet validation system

### Phase 2: Agent 1 - Wallet Investigation Agent (Weeks 5-8)
- [ ] Automatic blockchain detection
- [ ] Fund analysis and historical tracking
- [ ] Temporal transaction analysis
- [ ] Wallet opinion generation
- [ ] Fund flow tracking implementation
- [ ] OneLake data storage integration

### Phase 3: Agent 2 - Multi-Wallet Correlation Agent (Weeks 9-12)
- [ ] Cross-wallet analysis algorithms
- [ ] User profiling and clustering
- [ ] Pattern recognition systems
- [ ] Risk assessment framework
- [ ] Agent coordination protocols

### Phase 4: Agent 3 - Forensic Analysis Agent (Weeks 13-16)
- [ ] Deep transaction analysis
- [ ] Compliance checking systems
- [ ] Threat assessment algorithms
- [ ] Forensic report generation
- [ ] Advanced investigation tools

### Phase 5: Agent 4 - Intelligence Synthesis Agent (Weeks 17-20)
- [ ] Multi-agent data integration
- [ ] Trend analysis and pattern recognition
- [ ] Predictive modeling implementation
- [ ] Strategic recommendation engine
- [ ] Advanced AI coordination

### Phase 6: Production & Optimization (Weeks 21-24)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment
- [ ] Monitoring and logging

## Data Models

### Wallet Investigation Data
```typescript
interface WalletInvestigation {
  id: string;
  walletAddress: string;
  blockchain: string;
  investigationDate: Date;
  currentBalance: {
    amount: string;
    currency: string;
    usdValue: number;
    lastUpdated: Date;
  };
  transactionHistory: Transaction[];
  fundFlows: FundFlow[];
  walletOpinion: {
    isMainWallet: boolean;
    confidence: number;
    reasoning: string;
    relatedWallets: string[];
    userProfile: UserProfile;
  };
  riskIndicators: RiskIndicator[];
  metadata: {
    investigationDuration: number;
    dataSources: string[];
    confidence: number;
  };
}
```

### Multi-Wallet Correlation Data
```typescript
interface MultiWalletCorrelation {
  primaryWallet: string;
  correlatedWallets: CorrelatedWallet[];
  userProfile: {
    totalWallets: number;
    totalValue: number;
    activityPattern: string;
    riskLevel: string;
  };
  correlationScore: number;
  behavioralPatterns: BehavioralPattern[];
  riskAssessment: RiskAssessment;
}
```

### Forensic Analysis Data
```typescript
interface ForensicAnalysis {
  walletAddress: string;
  investigationLevel: 'basic' | 'detailed' | 'comprehensive';
  complianceIssues: ComplianceIssue[];
  threats: Threat[];
  evidence: Evidence[];
  recommendations: Recommendation[];
  riskScore: number;
}
```

### Intelligence Synthesis Data
```typescript
interface IntelligenceSynthesis {
  analysisId: string;
  timestamp: Date;
  trends: Trend[];
  predictions: Prediction[];
  strategicRecommendations: StrategicRecommendation[];
  riskPrioritization: RiskPriority[];
  overallRiskScore: number;
}
```

## Agent Configuration

### Agent 1 (WIA) Configuration
```yaml
agent1_wia:
  name: "Wallet Investigation Agent"
  version: "1.0.0"
  capabilities:
    - blockchain_detection
    - fund_analysis
    - temporal_analysis
    - data_storage
    - wallet_opinion
    - fund_flow_tracking
  settings:
    max_investigation_time: 300  # seconds
    supported_blockchains:
      - ethereum
      - bitcoin
      - binance
      - polygon
      - solana
    data_storage:
      provider: "onelake"
      retention_days: 365
```

### Agent 2 (MWCA) Configuration
```yaml
agent2_mwca:
  name: "Multi-Wallet Correlation Agent"
  version: "1.0.0"
  capabilities:
    - cross_wallet_analysis
    - user_profiling
    - pattern_recognition
    - risk_assessment
    - correlation_scoring
  settings:
    correlation_threshold: 0.7
    max_correlation_depth: 3
    risk_assessment_weights:
      transaction_pattern: 0.3
      timing_correlation: 0.2
      fund_flow_pattern: 0.3
      behavioral_similarity: 0.2
```

### Agent 3 (FAA) Configuration
```yaml
agent3_faa:
  name: "Forensic Analysis Agent"
  version: "1.0.0"
  capabilities:
    - deep_transaction_analysis
    - compliance_checking
    - threat_assessment
    - report_generation
    - evidence_collection
  settings:
    investigation_levels:
      basic: 60      # seconds
      detailed: 300  # seconds
      comprehensive: 900  # seconds
    compliance_rules:
      - kyc_requirements
      - aml_regulations
      - tax_compliance
    threat_models:
      - money_laundering
      - terrorist_financing
      - fraud_patterns
```

### Agent 4 (ISA) Configuration
```yaml
agent4_isa:
  name: "Intelligence Synthesis Agent"
  version: "1.0.0"
  capabilities:
    - data_integration
    - trend_analysis
    - predictive_modeling
    - strategic_recommendations
    - risk_prioritization
  settings:
    synthesis_timeout: 600  # seconds
    prediction_horizon: 30  # days
    trend_analysis_window: 90  # days
    risk_categories:
      - low: 0-25
      - medium: 26-50
      - high: 51-75
      - critical: 76-100
```

## Success Metrics

### Phase 1 Success Metrics
- [x] Project structure completed
- [x] Basic UI functional
- [ ] Multi-agent framework operational
- [ ] OneLake integration working
- [ ] Wallet validation system operational

### Phase 2 Success Metrics
- [ ] Agent 1 (WIA) fully operational
- [ ] Automatic blockchain detection working
- [ ] Fund analysis and tracking operational
- [ ] Wallet opinion generation functional
- [ ] Data storage integration complete

### Phase 3 Success Metrics
- [ ] Agent 2 (MWCA) fully operational
- [ ] Cross-wallet analysis working
- [ ] User profiling functional
- [ ] Pattern recognition operational
- [ ] Risk assessment working

### Phase 4 Success Metrics
- [ ] Agent 3 (FAA) fully operational
- [ ] Forensic analysis working
- [ ] Compliance checking functional
- [ ] Threat assessment operational
- [ ] Report generation working

### Phase 5 Success Metrics
- [ ] Agent 4 (ISA) fully operational
- [ ] Data integration working
- [ ] Trend analysis functional
- [ ] Predictive modeling operational
- [ ] Strategic recommendations working

### Overall Success Metrics
- [ ] Multi-agent system operational
- [ ] Accurate blockchain detection
- [ ] Comprehensive fund flow tracking
- [ ] Reliable wallet correlation
- [ ] High-performance system
- [ ] User-friendly interface
- [ ] Comprehensive reporting

## Technical Requirements

### Frontend Requirements
- React 18+ with TypeScript
- Next.js for SSR/SSG
- Tailwind CSS for styling
- Responsive design
- Accessibility compliance

### Backend Requirements
- Node.js with Express and TypeScript
- RESTful API design
- GraphQL support (optional)
- WebSocket support for real-time updates

### Agent Requirements
- Python-based AI/ML models
- TensorFlow or PyTorch
- Model versioning and deployment
- Real-time inference capabilities
- Model monitoring and retraining

### Database Requirements
- Microsoft OneLake/Fabric integration
- Real-time data synchronization
- Efficient querying capabilities
- Data backup and recovery

### Blockchain Requirements
- Multi-blockchain support
- Real-time transaction monitoring
- Efficient API usage
- Rate limit management
- Error handling and retry logic

### Security Requirements
- Input validation and sanitization
- Rate limiting and DDoS protection
- Data encryption at rest and in transit
- Secure API key management
- Regular security audits

### Performance Requirements
- Sub-second response times
- High availability (99.9%+)
- Scalable architecture
- Efficient caching strategies
- CDN integration

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

## Key Benefits of Multi-Agent Architecture

1. **Specialization**: Each agent focuses on specific aspects, improving accuracy
2. **Scalability**: Easy to add new agents or modify existing ones
3. **Reliability**: If one agent fails, others can continue working
4. **Intelligence**: Each agent can learn and improve independently
5. **Comprehensive Analysis**: Multiple perspectives provide deeper insights

## Current Status

### Phase 1: Foundation ✅ (Mostly Complete)
- ✅ Project structure and architecture
- ✅ Modern UI/UX with wallet input interface
- ✅ Frontend components (Header, BlockchainSelector, WalletInput, AnalysisResults)
- ✅ Backend API structure with Express.js
- ✅ Agent 1 (WIA) framework started
- 🔄 Multi-agent framework setup (in progress)

### Phase 2: Agent 1 (WIA) 🔄 (Next Focus)
- 🔄 Automatic blockchain detection
- 🔄 Fund analysis and historical tracking
- 🔄 Temporal transaction analysis
- 🔄 Wallet opinion generation
- 🔄 Fund flow tracking implementation
- 🔄 OneLake data storage integration

## Next Steps

1. **Complete Agent 1 (WIA)**: Focus on implementing the Wallet Investigation Agent with automatic blockchain detection and comprehensive analysis
2. **Set up Agent Communication**: Implement the message passing system between agents
3. **Integrate OneLake**: Connect to Microsoft OneLake/Fabric for data storage
4. **Add Real Blockchain APIs**: Replace mock data with actual blockchain API integrations
5. **Implement Agent 2 (MWCA)**: Begin work on the Multi-Wallet Correlation Agent

---

**This document serves as the definitive reference for the LYNX project scope and should be updated as the project evolves.** 