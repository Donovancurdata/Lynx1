# Agent 1: Wallet Investigation Agent (WIA)

## Overview

Agent 1 WIA is the primary investigation agent in the LYNX multi-agent system. It specializes in comprehensive wallet analysis across multiple blockchains, providing detailed insights into wallet activities, fund flows, and risk assessments.

## Core Capabilities

### 🔍 Blockchain Detection
- **Automatic Detection**: Identifies which blockchain a wallet address belongs to
- **Pattern Recognition**: Uses address format patterns to determine blockchain type
- **Confidence Scoring**: Provides confidence levels for detection accuracy
- **Multi-Chain Support**: Supports Ethereum, Bitcoin, Binance Smart Chain, Polygon, and Solana

### 💰 Fund Analysis
- **Balance Tracking**: Monitors current and historical wallet balances
- **USD Value Conversion**: Converts crypto balances to USD equivalents
- **Historical Analysis**: Tracks balance changes over time
- **Multi-Chain Balance**: Checks balances across all supported blockchains

### ⏰ Temporal Analysis
- **Transaction Timeline**: Tracks all transaction dates and times
- **Activity Patterns**: Identifies peak activity hours and days
- **Frequency Analysis**: Calculates average transactions per day
- **Seasonal Trends**: Analyzes monthly and yearly patterns

### 🗄️ Data Storage
- **OneLake Integration**: Stores all investigation data in Microsoft OneLake/Fabric
- **Structured Storage**: Organizes data by blockchain and wallet address
- **Retention Management**: Implements data cleanup policies
- **Agent Communication**: Stores messages for inter-agent communication

### 🧠 Wallet Opinion Generation
- **Wallet Classification**: Determines if wallet is main, secondary, exchange, or DeFi
- **User Profiling**: Assesses if user has multiple wallets
- **Activity Assessment**: Evaluates activity levels (low, medium, high, very_high)
- **Value Estimation**: Provides total USD value and breakdown by asset

### 💸 Fund Flow Tracking
- **Movement Monitoring**: Tracks how and where all funds moved
- **Source Analysis**: Identifies fund sources and destinations
- **Flow Classification**: Categorizes flows as incoming, outgoing, or internal
- **Exchange Detection**: Identifies interactions with known exchanges

### ⚠️ Risk Assessment
- **Risk Scoring**: Calculates overall risk scores
- **Pattern Detection**: Identifies suspicious transaction patterns
- **Factor Analysis**: Evaluates multiple risk factors
- **Recommendations**: Provides actionable risk mitigation advice

## Supported Blockchains

| Blockchain | Symbol | Chain ID | Address Format |
|------------|--------|----------|----------------|
| Ethereum | ETH | 1 | 0x[a-fA-F0-9]{40} |
| Bitcoin | BTC | 0 | [13][a-km-zA-HJ-NP-Z1-9]{25,34} |
| Binance Smart Chain | BNB | 56 | 0x[a-fA-F0-9]{40} |
| Polygon | MATIC | 137 | 0x[a-fA-F0-9]{40} |
| Solana | SOL | 101 | [1-9A-HJ-NP-Za-km-z]{32,44} |

## Usage Examples

### Basic Wallet Investigation

```typescript
import { Agent1WIA } from './Agent1WIA';

const agent1 = new Agent1WIA();

// Investigate a wallet
const request = {
  walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  includeTokenTransfers: true,
  includeInternalTransactions: true,
  maxTransactions: 100,
  priority: 'medium'
};

const result = await agent1.investigateWallet(request);

if (result.success && result.data) {
  console.log(`Wallet: ${result.data.walletAddress}`);
  console.log(`Blockchain: ${result.data.blockchain}`);
  console.log(`Balance: ${result.data.balance.balance} ($${result.data.balance.usdValue})`);
  console.log(`Wallet Type: ${result.data.walletOpinion.walletType}`);
  console.log(`Risk Level: ${result.data.riskAssessment.riskLevel}`);
}
```

### Blockchain Detection

```typescript
// Detect blockchain for a wallet address
const detection = await agent1.detectBlockchain('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
console.log(`Detected: ${detection.blockchain} (confidence: ${detection.confidence})`);
```

### Multi-Chain Balance Check

```typescript
// Get balance across all supported blockchains
const balances = await agent1.getMultiChainBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
console.log('Multi-chain balances:', balances);
```

### Service Health Check

```typescript
// Check health of all blockchain services
const health = await agent1.getServiceHealth();
console.log('Service health:', health);
```

## API Reference

### Agent1WIA Class

#### Constructor
```typescript
new Agent1WIA()
```

#### Methods

##### `investigateWallet(request: WalletInvestigationRequest): Promise<WalletInvestigationResponse>`
Performs comprehensive wallet investigation.

**Parameters:**
- `request`: Investigation request object

**Returns:** Investigation response with detailed wallet analysis

##### `detectBlockchain(walletAddress: string): Promise<{blockchain: string, confidence: number, info: BlockchainInfo}>`
Detects which blockchain a wallet address belongs to.

**Parameters:**
- `walletAddress`: The wallet address to analyze

**Returns:** Blockchain detection result with confidence score

##### `getMultiChainBalance(walletAddress: string): Promise<Record<string, Balance>>`
Gets wallet balance across all supported blockchains.

**Parameters:**
- `walletAddress`: The wallet address to check

**Returns:** Balance information for each supported blockchain

##### `getMultiChainTransactionHistory(walletAddress: string): Promise<Record<string, Transaction[]>>`
Gets transaction history across all supported blockchains.

**Parameters:**
- `walletAddress`: The wallet address to analyze

**Returns:** Transaction history for each supported blockchain

##### `getWalletData(walletAddress: string, blockchain: string): Promise<WalletData>`
Gets comprehensive wallet data for a specific blockchain.

**Parameters:**
- `walletAddress`: The wallet address to analyze
- `blockchain`: The specific blockchain to query

**Returns:** Complete wallet data including balance and transactions

##### `getServiceHealth(): Promise<Record<string, boolean>>`
Checks health status of all blockchain services.

**Returns:** Health status for each blockchain service

##### `getSupportedBlockchains(): string[]`
Gets list of supported blockchains.

**Returns:** Array of supported blockchain names

##### `getAllBlockchainInfo(): Record<string, BlockchainInfo>`
Gets information for all supported blockchains.

**Returns:** Blockchain information for all supported chains

##### `validateAddress(address: string, blockchain: string): boolean`
Validates if an address is valid for a specific blockchain.

**Parameters:**
- `address`: The address to validate
- `blockchain`: The blockchain to validate against

**Returns:** True if address is valid for the blockchain

##### `getAgentInfo(): AgentInfo`
Gets information about the agent.

**Returns:** Agent information including capabilities and supported blockchains

##### `processAgentMessage(message: AgentMessage): Promise<void>`
Processes messages from other agents.

**Parameters:**
- `message`: Agent message to process

## Data Types

### WalletInvestigationRequest
```typescript
interface WalletInvestigationRequest {
  walletAddress: string;
  blockchain?: string;
  includeTokenTransfers?: boolean;
  includeInternalTransactions?: boolean;
  maxTransactions?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
```

### WalletInvestigationResponse
```typescript
interface WalletInvestigationResponse {
  success: boolean;
  data?: WalletInvestigationData;
  error?: {
    message: string;
    code: string;
    details?: string;
  };
  timestamp: Date;
}
```

### WalletInvestigationData
```typescript
interface WalletInvestigationData {
  walletAddress: string;
  blockchain: string;
  blockchainInfo: BlockchainInfo;
  balance: {
    balance: string;
    usdValue: number;
    lastUpdated: Date;
  };
  transactions: Transaction[];
  transactionAnalysis: TransactionAnalysis;
  fundFlows: FundFlow[];
  walletOpinion: WalletOpinion;
  riskAssessment: RiskAssessment;
  investigationTimestamp: Date;
  agentId: string;
  version: string;
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ONELAKE_CONNECTION_STRING` | OneLake connection string | (mock storage) |
| `ONELAKE_DATABASE_NAME` | OneLake database name | `lynx-investigations` |
| `ONELAKE_CONTAINER_NAME` | OneLake container name | `wallet-investigations` |

### API Keys

The agent uses various blockchain APIs. Set the following environment variables for production use:

- `ETHERSCAN_API_KEY`: For Ethereum blockchain data
- `BSCSCAN_API_KEY`: For Binance Smart Chain data
- `POLYGONSCAN_API_KEY`: For Polygon blockchain data
- `SOLANA_RPC_URL`: For Solana blockchain data

## Error Handling

The agent implements comprehensive error handling:

- **Input Validation**: Validates wallet addresses and request parameters
- **Service Failures**: Handles blockchain API failures gracefully
- **Network Issues**: Implements retry logic for network problems
- **Data Storage**: Handles OneLake storage failures with fallback

## Performance Considerations

- **Parallel Processing**: Uses Promise.all for concurrent blockchain queries
- **Caching**: Implements caching for frequently accessed data
- **Rate Limiting**: Respects API rate limits for blockchain services
- **Memory Management**: Efficiently handles large transaction datasets

## Security Features

- **Input Sanitization**: Validates and sanitizes all inputs
- **Error Masking**: Prevents sensitive information in error messages
- **Access Control**: Implements proper access controls for data storage
- **Audit Logging**: Comprehensive logging for security auditing

## Testing

Run the test suite to verify functionality:

```bash
npm test
```

Or run the example test:

```bash
npm run test:agent1
```

## Integration

Agent 1 integrates with other agents in the LYNX system:

- **Agent 2 (MWCA)**: Receives investigation results for multi-wallet correlation
- **Agent 3 (FAA)**: Provides data for forensic analysis
- **Agent 4 (ISA)**: Contributes to intelligence synthesis

## Contributing

1. Follow the established code style
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure all blockchain services are properly tested

## License

This project is part of the LYNX system and follows the same licensing terms. 