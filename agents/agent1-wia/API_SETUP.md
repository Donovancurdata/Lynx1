# 🔗 Blockchain API Setup Guide for Agent 1 WIA

This guide will help you set up all the necessary API keys to connect Agent 1 to real blockchain data.

## 📋 Required API Keys

### 1. **Ethereum APIs**
- **Infura Project ID** (Recommended)
  - Go to [Infura.io](https://infura.io)
  - Create a free account
  - Create a new project
  - Copy your Project ID
  - Set: `INFURA_PROJECT_ID=your_project_id_here`

- **Etherscan API Key** (For transaction history)
  - Go to [Etherscan.io](https://etherscan.io)
  - Create a free account
  - Go to API-KEYs section
  - Create a new API key
  - Set: `ETHERSCAN_API_KEY=your_api_key_here`

### 2. **Bitcoin API**
- **BlockCypher API Key** (For Bitcoin data)
  - Go to [BlockCypher.com](https://blockcypher.com)
  - Create a free account
  - Get your API token
  - Set: `BLOCKCYPHER_API_KEY=your_api_key_here`

### 3. **Binance Smart Chain API**
- **BSCScan API Key** (For BSC transaction history)
  - Go to [BSCScan.com](https://bscscan.com)
  - Create a free account
  - Go to API section
  - Create a new API key
  - Set: `BSCSCAN_API_KEY=your_api_key_here`

### 4. **Polygon API**
- **PolygonScan API Key** (For Polygon transaction history)
  - Go to [PolygonScan.com](https://polygonscan.com)
  - Create a free account
  - Go to API section
  - Create a new API key
  - Set: `POLYGONSCAN_API_KEY=your_api_key_here`

### 5. **Solana API**
- **Solscan API Key** (For Solana data)
  - Go to [Solscan.io](https://solscan.io)
  - Create a free account
  - Get your API key
  - Set: `SOLSCAN_API_KEY=your_api_key_here`

## 🚀 Quick Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit the .env file** with your API keys:
   ```env
   # Ethereum
   INFURA_PROJECT_ID=your_infura_project_id_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   
   # Bitcoin
   BLOCKCYPHER_API_KEY=your_blockcypher_api_key_here
   
   # Binance Smart Chain
   BSCSCAN_API_KEY=your_bscscan_api_key_here
   
   # Polygon
   POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
   
   # Solana
   SOLSCAN_API_KEY=your_solscan_api_key_here
   ```

3. **Test the connections:**
   ```bash
   npm run test:api
   ```

## ✅ Current Status

Based on the latest test:

- **✅ CoinGecko Price API**: Working perfectly
- **✅ Bitcoin Service**: Working with mock data (ready for real API)
- **✅ Solana Service**: Working with mock data (ready for real API)
- **✅ BSC Service**: Balance working, needs API key for transactions
- **⚠️ Ethereum Service**: Needs valid address checksum
- **⚠️ Polygon Service**: Needs API key for transactions

## 🔧 Troubleshooting

### Ethereum Address Checksum Error
The test address `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` has an invalid checksum. Use a valid Ethereum address like:
- `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` (invalid)
- `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` (valid)

### API Rate Limits
Most free API tiers have rate limits:
- **Etherscan**: 5 calls/second
- **BSCScan**: 5 calls/second
- **PolygonScan**: 5 calls/second
- **BlockCypher**: 3 calls/second
- **Solscan**: Varies by plan

### Fallback Behavior
When API keys are not provided, the system gracefully falls back to mock data, ensuring the application continues to work for testing purposes.

## 🎯 Next Steps

1. **Get API Keys**: Follow the links above to get your API keys
2. **Update .env**: Add your API keys to the .env file
3. **Test Again**: Run `npm run test:api` to verify connections
4. **Deploy**: Once working, deploy to production

## 📊 API Usage Monitoring

Monitor your API usage to stay within free tier limits:
- **Etherscan**: Check your dashboard
- **BSCScan**: Check your dashboard
- **PolygonScan**: Check your dashboard
- **BlockCypher**: Check your dashboard
- **Solscan**: Check your dashboard

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use environment variables in production
- Consider using a secrets management service for production
- Monitor API usage to avoid unexpected charges

## 📞 Support

If you encounter issues:
1. Check the API provider's documentation
2. Verify your API keys are correct
3. Check rate limits and usage
4. Test with the provided test script 