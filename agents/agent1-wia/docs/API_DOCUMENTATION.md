# 🔗 Blockchain API Documentation

This document contains comprehensive documentation for all blockchain APIs used by Agent 1 WIA.

## 📋 **API Keys & Endpoints**

### **1. Etherscan API (Ethereum)**
- **API Key**: `MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN`
- **Base URL**: `https://api.etherscan.io/api`
- **Documentation**: [Etherscan V2 Documentation](https://docs.etherscan.io/etherscan-v2)
- **Rate Limits**: 5 calls/second (free tier)
- **Features**:
  - Account balances
  - Transaction history
  - Contract verification
  - Gas tracking
  - Token transfers

### **2. Binance Smart Chain (Etherscan V2)**
- **API Key**: `MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN` (Etherscan V2 unified API)
- **Base URL**: `https://api.etherscan.io/v2/api`
- **Chain ID**: `56`
- **Documentation**: [Etherscan V2 Documentation](https://docs.etherscan.io/etherscan-v2)
- **Rate Limits**: 5 calls/second (free tier)
- **Features**:
  - Account balances
  - Transaction history
  - BEP-20 token transfers
  - Contract verification

### **3. Polygon (Etherscan V2)**
- **API Key**: `MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN` (Etherscan V2 unified API)
- **Base URL**: `https://api.etherscan.io/v2/api`
- **Chain ID**: `137`
- **Documentation**: [Etherscan V2 Documentation](https://docs.etherscan.io/etherscan-v2)
- **Rate Limits**: 5 calls/second (free tier)
- **Features**:
  - Account balances
  - Transaction history
  - ERC-20 token transfers
  - Contract verification

### **4. Solscan Pro API v2.0 (Solana)**
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTM1MzQxODkyMzYsImVtYWlsIjoiZG9ub3ZhbmRld2V0ekBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NTM1MzQxODl9.9doRMX3aV2Vd91uaFcIiHq-SR8r-_cs-mPkm8kgWfbE`
- **Base URL**: `https://pro-api.solscan.io`
- **Authentication**: `token` header
- **Documentation**: [Solscan Pro API v2.0 Documentation](https://pro-api.solscan.io/pro-api-docs/v2.0/reference/v2-account-detail)
- **Rate Limits**: 100 requests/second (Pro tier)
- **Features**:
  - Account detail and balance
  - Transaction history
  - Token accounts
  - Block information

**Example Request:**
```javascript
const requestOptions = {
  method: "get",
  headers: {"token":"YOUR_SOLSCAN_API_KEY"}
};

fetch("https://pro-api.solscan.io/v2.0/account/detail?address=WALLET_ADDRESS", requestOptions)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### **5. Binance Market Data API**
- **Base URL**: `https://api.binance.com`
- **Documentation**: [Binance API Documentation](https://developers.binance.com/docs/binance-spot-api-docs/rest-api#market-data-endpoints)
- **Rate Limits**: 1200 requests per minute
- **Features**:
  - Real-time price data
  - Market statistics
  - Trading pairs information

### **6. BTCScan API (Bitcoin)**
- **Base URL**: `https://btcscan.org/api/`
- **Documentation**: [BTCScan API Documentation](https://github.com/cornucopiaa/btcscan-org/blob/master/API.md)
- **Features**:
  - Bitcoin address information
  - Transaction history
  - Block information

## 🔧 **API Integration Details**

### **Etherscan V2 Unified API**
The Etherscan V2 API provides a unified interface across 50+ chains using a single API key. This includes:
- Ethereum (chainId: 1)
- Binance Smart Chain (chainId: 56)
- Polygon (chainId: 137)
- Arbitrum (chainId: 42161)
- Optimism (chainId: 10)

**Example Usage:**
```javascript
const chains = [1, 56, 137, 42161, 10]; // Ethereum, BSC, Polygon, Arbitrum, Optimism

for (const chain of chains) {
  const balance = fetch(`https://api.etherscan.io/v2/api?
     chainid=${chain}
     &module=account
     &action=balance
     &address=0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511
     &tag=latest&apikey=MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN`)
}
```

### **Common Endpoints**

#### **Account Balance**
```bash
GET https://api.etherscan.io/api
?module=account
&action=balance
&address=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
&tag=latest
&apikey=MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN
```

#### **Transaction History**
```bash
GET https://api.etherscan.io/api
?module=account
&action=txlist
&address=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
&startblock=0
&endblock=99999999
&sort=desc
&apikey=MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN
```

#### **Token Transfers**
```bash
GET https://api.etherscan.io/api
?module=account
&action=tokentx
&address=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
&startblock=0
&endblock=99999999
&sort=desc
&apikey=MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN
```

## 📊 **Rate Limits & Best Practices**

### **Etherscan APIs (Ethereum, BSC, Polygon)**
- **Free Tier**: 5 calls/second
- **Pro Tier**: 10 calls/second
- **Best Practices**:
  - Implement exponential backoff
  - Cache responses when possible
  - Use batch requests when available
  - Monitor usage to stay within limits

### **Solscan API**
- **Rate Limits**: Varies by plan
- **Best Practices**:
  - Use Bearer token authentication
  - Implement proper error handling
  - Cache account data when possible

### **Binance API**
- **Rate Limits**: 1200 requests per minute
- **Best Practices**:
  - Use multiple endpoints for redundancy
  - Implement WebSocket for real-time data
  - Cache price data for 1-5 seconds

## 🔒 **Security Considerations**

### **API Key Management**
- Store API keys in environment variables
- Never commit API keys to version control
- Use different keys for development and production
- Rotate keys regularly

### **Rate Limiting**
- Implement client-side rate limiting
- Use exponential backoff for retries
- Monitor API usage to avoid hitting limits

### **Error Handling**
- Handle API errors gracefully
- Implement fallback mechanisms
- Log errors for debugging
- Provide meaningful error messages

## 🚀 **Implementation in Agent 1**

### **Configuration**
```typescript
// Environment variables
ETHERSCAN_API_KEY=MHJIHS3WMFDF1YQB59Y2S8A8MIUCC1I9XN
SOLSCAN_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Service Integration**
All blockchain services in Agent 1 are configured to use these APIs:
- `EthereumService`: Uses Etherscan API
- `BinanceService`: Uses BSCScan API (Etherscan V2)
- `PolygonService`: Uses PolygonScan API (Etherscan V2)
- `SolanaService`: Uses Solscan API
- `BitcoinService`: Uses BlockCypher API (fallback)

### **Fallback Strategy**
When APIs are unavailable or rate limited:
1. Try primary API endpoint
2. If failed, try alternative endpoints
3. If still failed, use mock data
4. Log all failures for monitoring

## 📈 **Monitoring & Analytics**

### **API Health Checks**
- Regular health checks for all APIs
- Monitor response times
- Track error rates
- Alert on service degradation

### **Usage Tracking**
- Track API calls per service
- Monitor rate limit usage
- Log performance metrics
- Generate usage reports

## 🔗 **Useful Links**

- [Etherscan V2 Documentation](https://docs.etherscan.io/etherscan-v2)
- [Binance API Documentation](https://developers.binance.com/docs/binance-spot-api-docs/rest-api#market-data-endpoints)
- [BTCScan API Documentation](https://github.com/cornucopiaa/btcscan-org/blob/master/API.md)
- [Solscan API Documentation](https://docs.solscan.io/)

---

*Last Updated: July 25, 2025*
*API Keys Provided: ✅ Validated*
*Integration Status: ✅ Complete* 