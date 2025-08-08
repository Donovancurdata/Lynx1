import axios from 'axios';
import { logger } from './utils/logger';

async function testSolscanAuth() {
  try {
    logger.info('🔑 Testing Solscan Pro API Authentication Methods...');
    
    const apiKey = process.env.SOLSCAN_API_KEY || 'your_solscan_api_key';
    const testAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
    
    // Method 1: token header
    logger.info('\n=== Method 1: token header ===');
    try {
      const response1 = await axios.get('https://pro-api.solscan.io/v2.0/account/detail', {
        params: { address: testAddress },
        headers: { token: apiKey },
        timeout: 10000
      });
      logger.info('✅ Method 1 (token header) - SUCCESS');
      logger.info(`Response: ${JSON.stringify(response1.data, null, 2)}`);
    } catch (error) {
      logger.error(`❌ Method 1 (token header) - FAILED: ${error}`);
    }
    
    // Method 2: Authorization header
    logger.info('\n=== Method 2: Authorization header ===');
    try {
      const response2 = await axios.get('https://pro-api.solscan.io/v2.0/account/detail', {
        params: { address: testAddress },
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 10000
      });
      logger.info('✅ Method 2 (Authorization header) - SUCCESS');
      logger.info(`Response: ${JSON.stringify(response2.data, null, 2)}`);
    } catch (error) {
      logger.error(`❌ Method 2 (Authorization header) - FAILED: ${error}`);
    }
    
    // Method 3: X-API-Key header
    logger.info('\n=== Method 3: X-API-Key header ===');
    try {
      const response3 = await axios.get('https://pro-api.solscan.io/v2.0/account/detail', {
        params: { address: testAddress },
        headers: { 'X-API-Key': apiKey },
        timeout: 10000
      });
      logger.info('✅ Method 3 (X-API-Key header) - SUCCESS');
      logger.info(`Response: ${JSON.stringify(response3.data, null, 2)}`);
    } catch (error) {
      logger.error(`❌ Method 3 (X-API-Key header) - FAILED: ${error}`);
    }
    
    // Method 4: API key as query parameter
    logger.info('\n=== Method 4: API key as query parameter ===');
    try {
      const response4 = await axios.get('https://pro-api.solscan.io/v2.0/account/detail', {
        params: { 
          address: testAddress,
          apikey: apiKey
        },
        timeout: 10000
      });
      logger.info('✅ Method 4 (query parameter) - SUCCESS');
      logger.info(`Response: ${JSON.stringify(response4.data, null, 2)}`);
    } catch (error) {
      logger.error(`❌ Method 4 (query parameter) - FAILED: ${error}`);
    }
    
    // Method 5: Try public endpoint without auth
    logger.info('\n=== Method 5: Public endpoint test ===');
    try {
      const response5 = await axios.get('https://api.solscan.io/account', {
        params: { address: testAddress },
        timeout: 10000
      });
      logger.info('✅ Method 5 (public endpoint) - SUCCESS');
      logger.info(`Response: ${JSON.stringify(response5.data, null, 2)}`);
    } catch (error) {
      logger.error(`❌ Method 5 (public endpoint) - FAILED: ${error}`);
    }
    
    logger.info('\n🎉 Solscan authentication test completed!');
    
  } catch (error) {
    logger.error('Solscan authentication test failed:', error);
  }
}

if (require.main === module) {
  testSolscanAuth().catch(console.error);
}

export { testSolscanAuth }; 