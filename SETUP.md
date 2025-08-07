# LYNX Setup Guide

## Prerequisites

Before setting up LYNX, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LYNX
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the environment file with your configuration
# See Environment Variables section below
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## Environment Variables

Edit the `.env` file with your specific configuration:

### Required Variables

```bash
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Microsoft OneLake/Fabric (Required for Phase 1)
ONELAKE_CONNECTION_STRING=your_onelake_connection_string
FABRIC_WORKSPACE_ID=your_fabric_workspace_id
FABRIC_DATASET_ID=your_fabric_dataset_id

# Blockchain API Keys (Required for Phase 2+)
ETHERSCAN_API_KEY=your_etherscan_api_key
BLOCKCYPHER_API_KEY=your_blockcypher_api_key
```

### Optional Variables

```bash
# Additional Blockchain APIs
BSCSCAN_API_KEY=your_bscscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# AI/ML Configuration (Phase 5)
AI_MODEL_ENDPOINT=your_ai_model_endpoint
AI_API_KEY=your_ai_api_key

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Key Setup

### 1. Etherscan API Key
- Visit [Etherscan](https://etherscan.io/)
- Create an account and get your API key
- Add to `ETHERSCAN_API_KEY` in `.env`

### 2. BlockCypher API Key
- Visit [BlockCypher](https://www.blockcypher.com/)
- Create an account and get your API key
- Add to `BLOCKCYPHER_API_KEY` in `.env`

### 3. Microsoft OneLake/Fabric Setup
- Set up Microsoft Fabric workspace
- Configure OneLake connection
- Add connection details to `.env`

## Development Workflow

### Phase 1: Foundation (Current)
- ✅ Project structure
- ✅ Basic UI/UX
- ✅ Frontend components
- ✅ Backend API structure
- 🔄 OneLake integration
- 🔄 Wallet validation

### Phase 2: Ethereum Implementation
- 🔄 Ethereum blockchain integration
- 🔄 ETH wallet validation
- 🔄 Transaction analysis
- 🔄 Fund flow tracking
- 🔄 Forex provider detection

### Phase 3: Bitcoin Implementation
- 🔄 Bitcoin blockchain integration
- 🔄 BTC wallet validation
- 🔄 UTXO analysis
- 🔄 Fund flow tracking
- 🔄 Forex provider detection

## Available Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both frontend and backend
npm run test             # Run tests for both
npm run setup            # Install all dependencies and setup env
```

### Frontend
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
```

### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build TypeScript
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run tests
```

## Project Structure

```
LYNX/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── logs/                # Application logs
├── blockchain/              # Blockchain integration modules
├── ai/                      # AI/ML components
├── shared/                  # Shared utilities
├── docs/                    # Documentation
└── tests/                   # Test suites
```

## Testing

### Frontend Testing
```bash
cd frontend
npm test                     # Run tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage
```

### Backend Testing
```bash
cd backend
npm test                     # Run tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage
```

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build both frontend and backend
npm run build

# Start production servers
npm run start:frontend
npm run start:backend
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Kill process on port 3001
   npx kill-port 3001
   ```

2. **TypeScript errors**
   ```bash
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   npm run type-check
   ```

3. **Dependencies issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Environment variables not loading**
   ```bash
   # Ensure .env file exists
   cp .env.example .env
   # Restart development servers
   npm run dev
   ```

### Getting Help

- Check the [Development Plan](./docs/DEVELOPMENT_PLAN.md) for detailed phase information
- Review the [README](./README.md) for project overview
- Check logs in `backend/logs/` for backend issues
- Check browser console for frontend issues

## Next Steps

After successful setup:

1. **Complete Phase 1**: Implement OneLake integration and wallet validation
2. **Start Phase 2**: Begin Ethereum blockchain integration
3. **Set up monitoring**: Configure logging and error tracking
4. **Add tests**: Implement comprehensive test coverage
5. **Deploy**: Set up production deployment pipeline

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Run the test suite
5. Submit a pull request

## Support

For questions or issues:
- Check the documentation in `docs/`
- Review the development plan
- Create an issue in the repository 