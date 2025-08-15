# LYNX - Intelligent Blockchain Analysis Platform

## Overview

LYNX is an intelligent AI/LLM agent platform that provides comprehensive blockchain analysis across multiple networks. The system features real-time communication, progressive data gathering, and intelligent insights for wallet investigation.

## 🚀 Features

- **Intelligent AI Agent**: Real-time chat interface with progressive analysis
- **Multi-Blockchain Support**: Ethereum, Polygon, BSC, Avalanche, Arbitrum, Optimism, Base, Linea, Bitcoin, Solana
- **Real-time Communication**: WebSocket-based live updates during analysis
- **Azure Integration**: Token price data storage and retrieval
- **Comprehensive Analysis**: Balance, transaction history, risk assessment, and fund flow tracking
- **BullMQ Job Queues**: High-performance job queue management with Redis
- **Optimized Performance**: Caching, batching, and concurrency optimization

## 🔧 Setup

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git
- Docker (for Redis setup)

### Installation

```bash
# Clone the repository
git clone https://github.com/Donovancurdata/Lynx1.git
cd LYNX

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..

### Redis Setup (Required for BullMQ)

LYNX uses BullMQ for job queue management, which requires Redis. The easiest way to set up Redis is using Docker:

```bash
# Start Redis container
docker run -d \
  --name lynx-redis \
  -p 6379:6379 \
  redis:alpine

# Verify Redis is running
docker ps | grep redis

# Test Redis connection
docker exec lynx-redis redis-cli ping
```

**Alternative Setup Methods:**

**Option 1: Docker Compose (Recommended)**
```bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  redis:
    image: redis:alpine
    container_name: lynx-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

volumes:
  redis_data:
EOF

# Start services
docker-compose up -d
```

**Option 2: WSL + Ubuntu (Windows)**
```bash
# Install Redis in WSL Ubuntu
wsl --install Ubuntu
wsl -d Ubuntu

# In Ubuntu terminal:
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configure Redis for external access
sudo nano /etc/redis/redis.conf
# Change: bind 127.0.0.1 to bind 0.0.0.0
# Change: protected-mode yes to protected-mode no

sudo systemctl restart redis-server
```

**Option 3: Native Installation**
- **macOS**: `brew install redis && brew services start redis`
- **Ubuntu/Debian**: `sudo apt install redis-server && sudo systemctl start redis-server`
- **Windows**: Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
```

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the environment file with your configuration
# See Environment Variables section below
```

## 🔑 Environment Variables

### Infura API Configuration (Primary Blockchain Provider)

LYNX uses Infura as the primary blockchain provider for most EVM-compatible networks. The new Infura API key `c927ef526ead44a19f46439e38d34f39` provides access to multiple blockchains:

```env
# Infura API Configuration
INFURA_PROJECT_ID=c927ef526ead44a19f46439e38d34f39
INFURA_API_KEY=c927ef526ead44a19f46439e38d34f39

# Infura Endpoints for Different Blockchains
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

### Additional API Keys

```env
# Blockchain API Keys (for transaction history and additional data)
ETHERSCAN_API_KEY=your_etherscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
SNOWTRACE_API_KEY=your_snowtrace_api_key

# Azure Data Lake Storage Gen2 Configuration
AZURE_STORAGE_ACCOUNT_NAME=your_azure_storage_account_name
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# BullMQ Configuration (Required for job queue management)
USE_QUEUE=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Ensure Redis is running first
docker ps | grep redis

# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

### Testing BullMQ Integration

```bash
# Test BullMQ performance
npm run test:bullmq

# Test optimized performance
node test-optimized-performance.js

# Check Redis status
docker exec lynx-redis redis-cli info memory
```

### Production Mode

```bash
# Build the application
npm run build

# Start production servers
npm start
```

## 🌐 Supported Blockchains

LYNX supports the following blockchains through Infura and other providers:

### EVM-Compatible Networks (via Infura)
- **Ethereum Mainnet**: Native ETH transactions and ERC-20 tokens
- **Polygon (MATIC)**: Layer 2 scaling solution
- **Binance Smart Chain (BSC)**: BNB and BEP-20 tokens
- **Avalanche (AVAX)**: High-performance blockchain
- **Arbitrum One**: Layer 2 scaling solution
- **Optimism**: Layer 2 scaling solution
- **Base**: Coinbase's Layer 2 network
- **Linea**: ConsenSys's Layer 2 network

### Other Networks
- **Bitcoin**: Native BTC transactions
- **Solana**: High-performance blockchain with SPL tokens

### API Key Configuration
- **Infura**: Single API key for all EVM chains (RPC/WebSocket)
- **Etherscan**: Single API key for Ethereum, Arbitrum, Optimism, Base, Linea
- **Chain-specific**: PolygonScan, BSCScan, Snowtrace, Solscan for their respective chains

## 🔍 API Endpoints

### Intelligent Agent
- `POST /api/intelligent-agent/analyze` - Start intelligent analysis
- `WebSocket ws://localhost:3004` - Real-time communication

### Traditional Analysis
- `POST /api/wallet/analyze` - Traditional wallet analysis
- `GET /api/blockchain/supported` - Get supported blockchains

## 📊 Features

### Intelligent Agent
- Real-time chat interface
- Progressive data gathering
- Multi-blockchain analysis
- Natural language processing
- Risk assessment and insights

### Traditional Analysis
- Comprehensive wallet investigation
- Transaction history analysis
- Token balance tracking
- Fund flow analysis
- Risk scoring

## 🔧 Architecture

### Components
- **Frontend**: Next.js with React
- **Backend**: Node.js with TypeScript
- **Intelligent Agent**: Custom AI/LLM implementation
- **Blockchain Services**: Multi-chain support via Infura
- **Data Storage**: Azure Data Lake Storage Gen2

### Services
- **WalletInvestigator**: Core analysis logic
- **BlockchainServiceFactory**: Multi-chain service management
- **PriceService**: Token price aggregation
- **RealTimeCommunicator**: WebSocket communication
- **ConversationManager**: NLP and response generation
- **QueueService**: BullMQ job queue management with caching and batching

## 📝 Documentation

For detailed API documentation and setup guides, see:
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Development Guide](docs/DEVELOPMENT_PLAN.md)
- [Token Collection Guide](backend/TOKEN_COLLECTION_README.md)
- [BullMQ Integration Guide](BULLMQ_INTEGRATION.md)
- [Performance Optimization Summary](PERFORMANCE_OPTIMIZATION_SUMMARY.md)

## 🔧 Troubleshooting

### Redis Connection Issues

```bash
# Check if Redis container is running
docker ps | grep redis

# Restart Redis container
docker restart lynx-redis

# Check Redis logs
docker logs lynx-redis

# Test Redis connection
docker exec lynx-redis redis-cli ping
```

### BullMQ Performance Issues

```bash
# Check queue status
npm run test:bullmq

# Monitor Redis memory usage
docker exec lynx-redis redis-cli info memory

# Clear Redis cache (if needed)
docker exec lynx-redis redis-cli FLUSHALL
```

### Common Issues

1. **Redis Connection Refused**: Ensure Redis container is running and port 6379 is accessible
2. **BullMQ Jobs Not Processing**: Check if `USE_QUEUE=true` is set in environment variables
3. **High Memory Usage**: Redis memory policy is set to `allkeys-lru` for automatic cleanup
4. **Slow Performance**: Verify concurrency settings and Redis configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [GitHub Repository](https://github.com/Donovancurdata/Lynx1.git)
- [Infura Documentation](https://docs.metamask.io/services/get-started/infura/)
- [Azure Data Lake Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)