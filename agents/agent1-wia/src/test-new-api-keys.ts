import axios from 'axios';
import { logger } from './utils/logger';

async function testNewApiKeys() {
  try {
    logger.info('🔑 Testing Updated API Keys and Configurations...');
    
    // Test Solana with new Solscan Pro API v2.0
    logger.info('\n=== Testing Solana Solscan Pro API v2.0 ===');
    try {
      const solscanResponse = await axios.get('https://pro-api.solscan.io/v2.0/account/detail', {
        params: { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' },
        headers: { 
          token: process.env.SOLSCAN_API_KEY || 'your_solscan_api_key'
        },
        timeout: 10000
      });
      
      if (solscanResponse.data.success) {
        logger.info('✅ Solscan Pro API v2.0 is working');
        logger.info(`Account: ${solscanResponse.data.data.account}`);
        logger.info(`Lamports: ${solscanResponse.data.data.lamports}`);
        logger.info(`Type: ${solscanResponse.data.data.type}`);
      } else {
        logger.error(`❌ Solscan Pro API error: ${solscanResponse.data.errors?.[0]?.message || 'Unknown error'}`);
      }
    } catch (error) {
      logger.error(`❌ Solscan Pro API test failed: ${error}`);
    }
    
    // Test BSC with Etherscan V2 API (chainId=56)
    logger.info('\n=== Testing BSC with Etherscan V2 API (chainId=56) ===');
    try {
      const bscResponse = await axios.get('https://api.etherscan.io/v2/api', {
        params: {
          chainid: 56,
          module: 'account',
          action: 'balance',
          address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
        },
        timeout: 10000
      });
      
      if (bscResponse.data.status === '1') {
        logger.info('✅ BSC Etherscan V2 API is working');
        logger.info(`Balance: ${bscResponse.data.result} wei`);
      } else {
        logger.error(`❌ BSC Etherscan V2 API error: ${bscResponse.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ BSC Etherscan V2 API test failed: ${error}`);
    }
    
    // Test Polygon with Etherscan V2 API (chainId=137)
    logger.info('\n=== Testing Polygon with Etherscan V2 API (chainId=137) ===');
    try {
      const polygonResponse = await axios.get('https://api.etherscan.io/v2/api', {
        params: {
          chainid: 137,
          module: 'account',
          action: 'balance',
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
        },
        timeout: 10000
      });
      
      if (polygonResponse.data.status === '1') {
        logger.info('✅ Polygon Etherscan V2 API is working');
        logger.info(`Balance: ${polygonResponse.data.result} wei`);
      } else {
        logger.error(`❌ Polygon Etherscan V2 API error: ${polygonResponse.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ Polygon Etherscan V2 API test failed: ${error}`);
    }
    
    // Test Ethereum with Etherscan V2 API (chainId=1)
    logger.info('\n=== Testing Ethereum with Etherscan V2 API (chainId=1) ===');
    try {
      const ethResponse = await axios.get('https://api.etherscan.io/v2/api', {
        params: {
          chainid: 1,
          module: 'account',
          action: 'balance',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          tag: 'latest',
          apikey: process.env.ETHERSCAN_API_KEY || 'your_etherscan_api_key'
        },
        timeout: 10000
      });
      
      if (ethResponse.data.status === '1') {
        logger.info('✅ Ethereum Etherscan V2 API is working');
        logger.info(`Balance: ${ethResponse.data.result} wei`);
      } else {
        logger.error(`❌ Ethereum Etherscan V2 API error: ${ethResponse.data.message}`);
      }
    } catch (error) {
      logger.error(`❌ Ethereum Etherscan V2 API test failed: ${error}`);
    }
    
    // Test Bitcoin with BTCScan API
    logger.info('\n=== Testing Bitcoin with BTCScan API ===');
    try {
      const btcResponse = await axios.get('https://btcscan.org/api/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', {
        timeout: 10000
      });
      
      if (btcResponse.data) {
        logger.info('✅ BTCScan API is working');
        logger.info(`Response: ${JSON.stringify(btcResponse.data, null, 2)}`);
      } else {
        logger.error(`❌ BTCScan API error: No data received`);
      }
    } catch (error) {
      logger.error(`❌ BTCScan API test failed: ${error}`);
    }
    
    logger.info('\n🎉 New API keys test completed!');
    
  } catch (error) {
    logger.error('New API keys test failed:', error);
  }
}

if (require.main === module) {
  testNewApiKeys().catch(console.error);
}

export { testNewApiKeys }; 