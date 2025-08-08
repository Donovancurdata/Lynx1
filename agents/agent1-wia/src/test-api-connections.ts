import { config } from './utils/config';
import { logger } from './utils/logger';
import { EthereumService } from './services/blockchain/EthereumService';
import { BitcoinService } from './services/blockchain/BitcoinService';
import { SolanaService } from './services/blockchain/SolanaService';
import { BinanceService } from './services/blockchain/BinanceService';
import { PolygonService } from './services/blockchain/PolygonService';

/**
 * Test script to verify blockchain API connections
 */
async function testApiConnections() {
  try {
    logger.info('🔗 Testing Blockchain API Connections...');
    
    // Get configuration
    const apiKeys = config.validateApiKeys();
    logger.info('API Key Status:', apiKeys);
    
    // Test addresses
    const testAddresses = {
      ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      solana: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      binance: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      polygon: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    };
    
    // Test Ethereum
    logger.info('\n=== Testing Ethereum API ===');
    const ethereumService = new EthereumService();
    try {
      const ethBalance = await ethereumService.getBalance(testAddresses.ethereum);
      logger.info(`✅ Ethereum balance: ${ethBalance.balance} ETH ($${ethBalance.usdValue})`);
      
      const ethTransactions = await ethereumService.getTransactionHistory(testAddresses.ethereum, 5);
      logger.info(`✅ Ethereum transactions: ${ethTransactions.length} found`);
    } catch (error) {
      logger.error(`❌ Ethereum API test failed: ${error}`);
    }
    
    // Test Bitcoin
    logger.info('\n=== Testing Bitcoin API ===');
    const bitcoinService = new BitcoinService();
    try {
      const btcBalance = await bitcoinService.getBalance(testAddresses.bitcoin);
      logger.info(`✅ Bitcoin balance: ${btcBalance.balance} BTC ($${btcBalance.usdValue})`);
      
      const btcTransactions = await bitcoinService.getTransactionHistory(testAddresses.bitcoin, 5);
      logger.info(`✅ Bitcoin transactions: ${btcTransactions.length} found`);
    } catch (error) {
      logger.error(`❌ Bitcoin API test failed: ${error}`);
    }
    
    // Test Solana (Solscan Pro API v2.0)
    logger.info('\n=== Testing Solana API (Solscan Pro v2.0) ===');
    const solanaService = new SolanaService();
    try {
      const solBalance = await solanaService.getBalance(testAddresses.solana);
      logger.info(`✅ Solana balance: ${solBalance.balance} SOL ($${solBalance.usdValue})`);
      
      const solTransactions = await solanaService.getTransactionHistory(testAddresses.solana, 5);
      logger.info(`✅ Solana transactions: ${solTransactions.length} found`);
    } catch (error) {
      logger.error(`❌ Solana API test failed: ${error}`);
    }
    
    // Test Binance Smart Chain (Etherscan V2)
    logger.info('\n=== Testing Binance Smart Chain API (Etherscan V2) ===');
    const binanceService = new BinanceService();
    try {
      const bnbBalance = await binanceService.getBalance(testAddresses.binance);
      logger.info(`✅ BSC balance: ${bnbBalance.balance} BNB ($${bnbBalance.usdValue})`);
      
      const bnbTransactions = await binanceService.getTransactionHistory(testAddresses.binance);
      logger.info(`✅ BSC transactions: ${bnbTransactions.length} found`);
    } catch (error) {
      logger.error(`❌ BSC API test failed: ${error}`);
    }
    
    // Test Polygon (Etherscan V2)
    logger.info('\n=== Testing Polygon API (Etherscan V2) ===');
    const polygonService = new PolygonService();
    try {
      const maticBalance = await polygonService.getBalance(testAddresses.polygon);
      logger.info(`✅ Polygon balance: ${maticBalance.balance} MATIC ($${maticBalance.usdValue})`);
      
      const maticTransactions = await polygonService.getTransactionHistory(testAddresses.polygon);
      logger.info(`✅ Polygon transactions: ${maticTransactions.length} found`);
    } catch (error) {
      logger.error(`❌ Polygon API test failed: ${error}`);
    }
    
    // Test price APIs
    logger.info('\n=== Testing Price APIs ===');
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
      const prices = await response.json();
      logger.info('✅ CoinGecko price API working:', prices);
    } catch (error) {
      logger.error(`❌ Price API test failed: ${error}`);
    }
    
    logger.info('\n🎉 API connection test completed!');
    
  } catch (error) {
    logger.error('API connection test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testApiConnections().catch(console.error);
}

export { testApiConnections }; 