# Token Data Collection System

This system collects and stores accurate token price data in Azure Data Lake Storage Gen 2 for historical analysis and accurate wallet valuations.

## 🎯 Purpose

- **Accurate Token Prices**: Get real-time prices from multiple sources (CoinGecko, DexScreener, DefiLlama)
- **Historical Data**: Store 5 years of historical price data
- **Daily Updates**: Automatically collect new price data daily
- **Azure Storage**: Store data in Azure Data Lake Storage Gen 2 for scalability

## 📊 Data Structure

### Tokens Table
```json
{
  "id": "contractAddress-symbol",
  "name": "Token Name",
  "symbol": "TOKEN",
  "address": "0x...",
  "blockchain": "ethereum",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Token Values Table
```json
{
  "id": "tokenId-timestamp",
  "tokenId": "contractAddress-symbol",
  "price": 12.13,
  "high": 12.50,
  "low": 11.80,
  "volume": 1000000,
  "marketCap": 50000000,
  "date": "2025-01-01T00:00:00.000Z",
  "source": "multi-source"
}
```

## 🚀 Quick Start

### 1. Test Token Price Collection
```bash
npm run test-tokens
```

This will test the accurate price fetching for major tokens like:
- **SOS**: OpenDAO (should be ~$0.00000000344)
- **ILV**: Illuvium (should be ~$12.13)
- **WETH**: Wrapped Ethereum
- **BNB**: Binance Coin
- **AVAX**: Avalanche

### 2. Initialize Historical Data
```bash
npm run init-historical
```

This will:
- Collect all tokens from the target wallet
- Store them in Azure Data Lake Storage
- Collect 5 years of historical price data

### 3. Run Daily Collection
```bash
npm run daily-collection
```

This collects current prices for all stored tokens and stores them with today's date.

## 🔧 Configuration

### Azure Data Lake Storage Gen 2
- **Container**: `lynx`
- **File System**: `token-data`
- **Tenant ID**: `caf9f5e2-34b0-45fa-a1e7-094c19fc7377`
- **Client ID**: `fdeb2c50-bd8b-4b41-a434-0a47806551e0`
- **Client Secret**: `57a7489a-4903-41a6-89c3-49decac5aa79`

### Environment Variables
```env
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 📈 Price Sources

### 1. CoinGecko (Primary)
- Most reliable for major tokens
- Includes 24h high/low, volume, market cap
- Rate limited but comprehensive

### 2. DexScreener (Secondary)
- Real-time DEX prices
- Good for smaller tokens
- Covers multiple chains

### 3. DefiLlama (Tertiary)
- On-chain DeFi data
- Historical price support
- Token address mapping

### 4. Fallback Prices
- Hardcoded current prices for known tokens
- Used when APIs fail
- Updated manually as needed

## 🗂️ File Structure

```
backend/src/
├── services/
│   └── TokenDataCollector.ts    # Main collection service
└── scripts/
    ├── test-token-collector.ts  # Test price fetching
    ├── initialize-historical-data.ts  # Initial setup
    └── daily-token-collection.ts     # Daily collection
```

## 📅 Scheduling

### Daily Collection (Recommended)
Set up a cron job to run daily at midnight:

```bash
# Add to crontab
0 0 * * * cd /path/to/backend && npm run daily-collection
```

### Manual Collection
```bash
# Test specific tokens
npm run test-tokens

# Initialize historical data (one-time)
npm run init-historical

# Run daily collection manually
npm run daily-collection
```

## 🔍 Monitoring

### Azure Data Lake Storage Files
- `tokens.json` - All collected tokens
- `token-values-YYYY-MM-DD.json` - Daily price data
- `historical-{symbol}-YYYY-MM-DD.json` - Historical data

### Logs
The system provides detailed logging:
- ✅ Success messages with prices
- ⚠️ Warning messages for fallbacks
- ❌ Error messages for failures

## 🎯 Integration with Wallet Analysis

The collected data can be used to:
1. **Replace mock data** in wallet analysis
2. **Calculate accurate historical trading values**
3. **Provide real-time token valuations**
4. **Support multiple blockchains**

## 🔧 Troubleshooting

### Common Issues

1. **Rate Limiting**
   - APIs have rate limits
   - System includes delays between requests
   - Use fallback prices when needed

2. **Azure Connection**
   - Verify credentials
   - Check network connectivity
   - Ensure container exists

3. **Missing Tokens**
   - Add new tokens to symbol mappings
   - Update fallback prices
   - Check API responses

### Debug Mode
Add more detailed logging by modifying the collector service.

## 📝 Future Enhancements

1. **Real-time Historical Data**: Integrate with CoinGecko's historical API
2. **More Sources**: Add additional price sources
3. **Automated Updates**: Auto-update fallback prices
4. **Analytics**: Add price trend analysis
5. **Alerts**: Price change notifications

## 🤝 Contributing

When adding new tokens:
1. Update symbol mappings in `TokenDataCollector.ts`
2. Add fallback prices
3. Test with `npm run test-tokens`
4. Update documentation

---

**Note**: This system is separate from the main wallet analysis to avoid interference with existing functionality. 