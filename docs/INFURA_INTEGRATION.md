# Infura Integration Documentation

## Overview

LYNX uses Infura as the primary blockchain provider for most EVM-compatible networks. This integration provides reliable access to multiple blockchains through a single API key.

## 🔑 API Key Configuration

### Current Infura API Key
- **Project ID**: `c927ef526ead44a19f46439e38d34f39`
- **API Key**: `c927ef526ead44a19f46439e38d34f39`
- **Provider**: Infura (MetaMask Services)

## 🌐 Supported Networks

### EVM-Compatible Networks (via Infura)

| Network | Chain ID | RPC URL | WebSocket URL | Explorer |
|---------|----------|---------|---------------|----------|
| **Ethereum Mainnet** | 1 | `https://mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [Etherscan](https://etherscan.io) |
| **Polygon (MATIC)** | 137 | `https://polygon-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://polygon-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [PolygonScan](https://polygonscan.com) |
| **Binance Smart Chain (BSC)** | 56 | `https://bsc-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://bsc-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [BSCScan](https://bscscan.com) |
| **Avalanche (AVAX)** | 43114 | `https://avalanche-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://avalanche-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [Snowtrace](https://snowtrace.io) |
| **Arbitrum One** | 42161 | `https://arbitrum-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://arbitrum-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [Arbiscan](https://arbiscan.io) |
| **Optimism** | 10 | `https://optimism-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://optimism-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [Optimistic Etherscan](https://optimistic.etherscan.io) |
| **Base** | 8453 | `https://base-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://base-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [BaseScan](https://basescan.org) |
| **Linea** | 59144 | `https://linea-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39` | `wss://linea-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39` | [LineaScan](https://lineascan.build) |

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Infura API Configuration
INFURA_PROJECT_ID=c927ef526ead44a19f46439e38d34f39
INFURA_API_KEY=c927ef526ead44a19f46439e38d34f39

# Ethereum Mainnet
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
ETHEREUM_WS_URL=wss://mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Polygon (MATIC)
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
POLYGON_WS_URL=wss://polygon-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Binance Smart Chain (BSC)
BSC_RPC_URL=https://bsc-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
BSC_WS_URL=wss://bsc-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Avalanche (AVAX)
AVALANCHE_RPC_URL=https://avalanche-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
AVALANCHE_WS_URL=wss://avalanche-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Arbitrum One
ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
ARBITRUM_WS_URL=wss://arbitrum-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Optimism
OPTIMISM_RPC_URL=https://optimism-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
OPTIMISM_WS_URL=wss://optimism-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Base
BASE_RPC_URL=https://base-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
BASE_WS_URL=wss://base-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39

# Linea
LINEA_RPC_URL=https://linea-mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39
LINEA_WS_URL=wss://linea-mainnet.infura.io/ws/v3/c927ef526ead44a19f46439e38d34f39
```

## 📊 Implementation Details

### Code Integration

The Infura integration is implemented across several key components:

#### 1. Configuration Management (`agents/agent1-wia/src/utils/config.ts`)
```typescript
export interface BlockchainConfig {
  ethereum: {
    rpcUrl: string;
    wsUrl?: string;
    infuraProjectId?: string;
    infuraApiKey?: string;
    etherscanApiKey?: string;
  };
  // ... other blockchain configurations
}
```

#### 2. EVM Service (`agents/agent1-wia/src/services/blockchain/EVMService.ts`)
```typescript
private initializeChains(): void {
  // Ethereum with Infura
  const ethereumConfig = config.getEthereumConfig();
  this.chainConfigs.set('ethereum', {
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 1,
    rpcUrl: ethereumConfig.infuraProjectId 
      ? `${ethereumConfig.rpcUrl}${ethereumConfig.infuraProjectId}`
      : 'https://eth.llamarpc.com',
    // ... other configuration
  });
  
  // ... other blockchain configurations
}
```

#### 3. Blockchain Service Factory (`agents/agent1-wia/src/services/blockchain/BlockchainServiceFactory.ts`)
```typescript
private initializeServices(): void {
  this.evmService = new EVMService();
  this.services.set('ethereum', this.createEVMServiceAdapter('ethereum'));
  this.services.set('polygon', this.createEVMServiceAdapter('polygon'));
  this.services.set('binance', this.createEVMServiceAdapter('binance'));
  this.services.set('avalanche', this.createEVMServiceAdapter('avalanche'));
  this.services.set('arbitrum', this.createEVMServiceAdapter('arbitrum'));
  this.services.set('optimism', this.createEVMServiceAdapter('optimism'));
  this.services.set('base', this.createEVMServiceAdapter('base'));
  this.services.set('linea', this.createEVMServiceAdapter('linea'));
}
```

## 🔍 API Methods Supported

### RPC Methods
- `eth_getBalance` - Get account balance
- `eth_getTransactionCount` - Get transaction count
- `eth_getTransactionByHash` - Get transaction details
- `eth_getTransactionReceipt` - Get transaction receipt
- `eth_call` - Execute contract calls
- `eth_getLogs` - Get event logs
- `eth_getBlockByNumber` - Get block information
- `eth_getBlockByHash` - Get block by hash

### WebSocket Methods
- `eth_subscribe` - Subscribe to real-time events
- `eth_unsubscribe` - Unsubscribe from events

### Blockchain Explorer APIs
For transaction history and additional data, we use the following explorer APIs:
- **Ethereum**: Etherscan API (`ETHERSCAN_API_KEY`)
- **Polygon**: PolygonScan API (`POLYGONSCAN_API_KEY`)
- **BSC**: BSCScan API (`BSCSCAN_API_KEY`)
- **Avalanche**: Snowtrace API (`SNOWTRACE_API_KEY`)
- **Arbitrum**: Etherscan API (`ETHERSCAN_API_KEY`) - Uses same key as Ethereum
- **Optimism**: Etherscan API (`ETHERSCAN_API_KEY`) - Uses same key as Ethereum
- **Base**: Etherscan API (`ETHERSCAN_API_KEY`) - Uses same key as Ethereum
- **Linea**: Etherscan API (`ETHERSCAN_API_KEY`) - Uses same key as Ethereum

## 📈 Rate Limits

### Infura Free Tier Limits
- **Requests per second**: 100,000
- **Daily requests**: 100,000,000
- **WebSocket connections**: 1,000 concurrent
- **Archive data**: Limited access

### Best Practices
1. **Implement caching** for frequently accessed data
2. **Use batch requests** when possible
3. **Monitor usage** to stay within limits
4. **Implement retry logic** for failed requests
5. **Use WebSocket connections** for real-time data

## 🔒 Security Considerations

### API Key Protection
- Store API keys in environment variables
- Never commit API keys to version control
- Use `.env.example` files for documentation
- Rotate API keys regularly

### Network Security
- Use HTTPS for all RPC calls
- Implement proper error handling
- Validate all input data
- Monitor for suspicious activity

## 🚀 Performance Optimization

### Caching Strategy
```typescript
// Example caching implementation
class CachedInfuraService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getBalance(address: string, chain: string): Promise<any> {
    const cacheKey = `${chain}:${address}:balance`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const data = await this.fetchFromInfura(address, chain);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }
}
```

### Batch Requests
```typescript
// Example batch request implementation
async function getMultipleBalances(addresses: string[], chain: string): Promise<any[]> {
  const batch = addresses.map((address, index) => ({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: index
  }));

  const response = await fetch(`${chainRpcUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch)
  });

  return response.json();
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Rate Limit Exceeded
```
Error: 429 Too Many Requests
```
**Solution**: Implement exponential backoff and request queuing

#### 2. Invalid API Key
```
Error: 401 Unauthorized
```
**Solution**: Verify API key in environment variables

#### 3. Network Unavailable
```
Error: Network request failed
```
**Solution**: Check network connectivity and Infura status

### Debug Tools

#### 1. Test API Connection
```bash
curl -X POST https://mainnet.infura.io/v3/c927ef526ead44a19f46439e38d34f39 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### 2. Monitor Usage
```typescript
// Add logging to track API usage
logger.info(`Infura API call: ${method} on ${chain}`);
```

## 📚 Additional Resources

- [Infura Documentation](https://docs.metamask.io/services/get-started/infura/)
- [Infura API Endpoints](https://docs.metamask.io/services/get-started/endpoints/)
- [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [MetaMask Services](https://metamask.io/services/)

## 🔄 Updates and Maintenance

### Version History
- **v1.0.0**: Initial Infura integration with Ethereum, Polygon, BSC, Avalanche
- **v1.1.0**: Added Arbitrum, Optimism, Base, Linea support
- **v1.2.0**: Enhanced error handling and caching

### Future Enhancements
- [ ] Add support for test networks (Goerli, Sepolia, etc.)
- [ ] Implement advanced caching strategies
- [ ] Add WebSocket event streaming
- [ ] Implement load balancing across multiple Infura projects
- [ ] Add support for custom RPC endpoints
