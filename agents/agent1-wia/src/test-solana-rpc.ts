import axios from 'axios';
import { logger } from './utils/logger';

async function testSolanaRPC() {
  try {
    logger.info('🔗 Testing Solana Native RPC API...');
    
    const rpcUrl = 'https://api.mainnet-beta.solana.com';
    const testAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
    
    // Test 1: getAccountInfo (balance)
    logger.info('\n=== Test 1: getAccountInfo (Balance) ===');
    try {
      const response1 = await axios.post(rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
          testAddress,
          {
            commitment: 'finalized',
            encoding: 'base58'
          }
        ]
      }, {
        timeout: 10000
      });
      
      if (response1.data.result && response1.data.result.value) {
        const lamports = response1.data.result.value.lamports;
        const sol = lamports / 1000000000;
        logger.info('✅ getAccountInfo - SUCCESS');
        logger.info(`Lamports: ${lamports}`);
        logger.info(`SOL: ${sol}`);
        logger.info(`Owner: ${response1.data.result.value.owner}`);
      } else {
        logger.error('❌ getAccountInfo - No account data');
      }
    } catch (error) {
      logger.error(`❌ getAccountInfo - FAILED: ${error}`);
    }
    
    // Test 2: getSignaturesForAddress (transactions)
    logger.info('\n=== Test 2: getSignaturesForAddress (Transactions) ===');
    try {
      const response2 = await axios.post(rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [
          testAddress,
          {
            limit: 5
          }
        ]
      }, {
        timeout: 10000
      });
      
      if (response2.data.result) {
        logger.info('✅ getSignaturesForAddress - SUCCESS');
        logger.info(`Found ${response2.data.result.length} transactions`);
        response2.data.result.forEach((tx: any, index: number) => {
          logger.info(`Tx ${index + 1}: ${tx.signature} (Slot: ${tx.slot})`);
        });
      } else {
        logger.error('❌ getSignaturesForAddress - No transaction data');
      }
    } catch (error) {
      logger.error(`❌ getSignaturesForAddress - FAILED: ${error}`);
    }
    
    // Test 3: getSlot (current block height)
    logger.info('\n=== Test 3: getSlot (Current Block Height) ===');
    try {
      const response3 = await axios.post(rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSlot'
      }, {
        timeout: 10000
      });
      
      if (response3.data.result) {
        logger.info('✅ getSlot - SUCCESS');
        logger.info(`Current Slot: ${response3.data.result}`);
      } else {
        logger.error('❌ getSlot - No slot data');
      }
    } catch (error) {
      logger.error(`❌ getSlot - FAILED: ${error}`);
    }
    
    // Test 4: getBalance (alternative balance method)
    logger.info('\n=== Test 4: getBalance (Alternative Balance Method) ===');
    try {
      const response4 = await axios.post(rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [
          testAddress,
          {
            commitment: 'finalized'
          }
        ]
      }, {
        timeout: 10000
      });
      
      if (response4.data.result) {
        const lamports = response4.data.result.value;
        const sol = lamports / 1000000000;
        logger.info('✅ getBalance - SUCCESS');
        logger.info(`Lamports: ${lamports}`);
        logger.info(`SOL: ${sol}`);
      } else {
        logger.error('❌ getBalance - No balance data');
      }
    } catch (error) {
      logger.error(`❌ getBalance - FAILED: ${error}`);
    }
    
    logger.info('\n🎉 Solana RPC API test completed!');
    
  } catch (error) {
    logger.error('Solana RPC API test failed:', error);
  }
}

if (require.main === module) {
  testSolanaRPC().catch(console.error);
}

export { testSolanaRPC }; 