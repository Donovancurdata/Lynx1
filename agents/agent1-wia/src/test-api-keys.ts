import axios from 'axios';
import { logger } from './utils/logger';

/**
 * Test script to validate provided API keys
 */
async function testApiKeys() {
  try {
    logger.info('🔑 Testing Provided API Keys...');
    
    // Test Ethereum/Etherscan API
    logger.info('\n=== Testing Etherscan API ===');
    try {
      const etherscanResponse = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'balance',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
        },
        timeout: 10000
      });
      
      if (etherscanResponse.data.status === '1') {
        logger.info('✅ Etherscan API key is valid and working');
        logger.info(`Balance: ${etherscanResponse.data.result} wei`);
      } else {
        logger.error(`❌ Etherscan API error: ${etherscanResponse.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ Etherscan API test failed: ${error}`);
    }
    
    // Test BSCScan API (using Etherscan V2)
    logger.info('\n=== Testing BSCScan API (Etherscan V2) ===');
    try {
      const bscResponse = await axios.get('https://api.bscscan.com/api', {
        params: {
          module: 'account',
          action: 'balance',
          address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
        },
        timeout: 10000
      });
      
      if (bscResponse.data.status === '1') {
        logger.info('✅ BSCScan API key is valid and working');
        logger.info(`Balance: ${bscResponse.data.result} wei`);
      } else {
        logger.error(`❌ BSCScan API error: ${bscResponse.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ BSCScan API test failed: ${error}`);
    }
    
    // Test PolygonScan API (using Etherscan V2)
    logger.info('\n=== Testing PolygonScan API (Etherscan V2) ===');
    try {
      const polygonResponse = await axios.get('https://api.polygonscan.com/api', {
        params: {
          module: 'account',
          action: 'balance',
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
        },
        timeout: 10000
      });
      
      if (polygonResponse.data.status === '1') {
        logger.info('✅ PolygonScan API key is valid and working');
        logger.info(`Balance: ${polygonResponse.data.result} wei`);
      } else {
        logger.error(`❌ PolygonScan API error: ${polygonResponse.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ PolygonScan API test failed: ${error}`);
    }
    
    // Test Solscan API
    logger.info('\n=== Testing Solscan API ===');
    try {
      const solscanResponse = await axios.get('https://api.solscan.io/account', {
        params: {
          address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
        },
        headers: {
          'Authorization': `Bearer ${process.env.SOLSCAN_API_KEY || 'your_solscan_api_key'}`
        },
        timeout: 10000
      });
      
      if (solscanResponse.status === 200) {
        logger.info('✅ Solscan API key is valid and working');
        logger.info(`Account data: ${JSON.stringify(solscanResponse.data, null, 2)}`);
      } else {
        logger.error(`❌ Solscan API error: ${solscanResponse.status}`);
      }
    } catch (error) {
      logger.error(`❌ Solscan API test failed: ${error}`);
    }
    
    // Test Binance Market Data API
    logger.info('\n=== Testing Binance Market Data API ===');
    try {
      const binanceResponse = await axios.get('https://api.binance.com/api/v3/ticker/price', {
        params: {
          symbol: 'BTCUSDT'
        },
        timeout: 10000
      });
      
      if (binanceResponse.status === 200) {
        logger.info('✅ Binance Market Data API is working');
        logger.info(`BTC Price: ${binanceResponse.data.price} USDT`);
      } else {
        logger.error(`❌ Binance API error: ${binanceResponse.status}`);
      }
    } catch (error) {
      logger.error(`❌ Binance API test failed: ${error}`);
    }
    
    logger.info('\n🎉 API key validation completed!');
    
  } catch (error) {
    logger.error('API key validation failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testApiKeys().catch(console.error);
}

export { testApiKeys }; 