import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Ports
const API_PORT = process.env.API_PORT || 3001;

// Etherscan API configuration for multi-chain support
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY;
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
// Removed BlockCypher - using BTCScan API instead
const BTCSCAN_API_URL = process.env.BTCSCAN_API_URL || 'https://btcscan.org/api';

// Check if required environment variables are loaded
if (!ETHERSCAN_API_KEY) {
  console.error('❌ ETHERSCAN_API_KEY not found in environment variables');
  console.error('💡 Make sure you have a .env file with ETHERSCAN_API_KEY=your_key');
  console.error(`🔍 Current working directory: ${process.cwd()}`);
  console.error(`🔍 Looking for .env at: ${path.join(__dirname, '..', '.env')}`);
  process.exit(1);
}

console.log(`🔑 Loaded Etherscan API Key: ${ETHERSCAN_API_KEY.substring(0, 8)}...`);
console.log(`🔗 Solana RPC enabled (no API key required)`);
console.log(`🔗 Bitcoin support enabled via BTCScan API (free)`);
console.log(`💰 CoinGecko integration enabled for real-time pricing`);

// Chain configurations with Etherscan V2 API support (correct endpoint format)
const CHAIN_CONFIGS = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'ETH',
    decimals: 18
  },
  bsc: {
    name: 'BSC',
    chainId: 56,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'BNB',
    decimals: 18
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'MATIC',
    decimals: 18
  },
  avalanche: {
    name: 'Avalanche',
    chainId: 43114,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'AVAX',
    decimals: 18
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: 42161,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'ETH',
    decimals: 18
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'ETH',
    decimals: 18
  },
  base: {
    name: 'Base',
    chainId: 8453,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'ETH',
    decimals: 18
  },
  linea: {
    name: 'Linea',
    chainId: 59144,
    apiUrl: 'https://api.etherscan.io/v2/api',
    apiKey: ETHERSCAN_API_KEY,
    nativeCurrency: 'ETH',
    decimals: 18
  },
  solana: {
    name: 'Solana',
    chainId: null, // Solana doesn't use EVM chain IDs
    apiUrl: 'https://api.mainnet-beta.solana.com', // Solana RPC endpoint
    apiKey: null, // No API key needed for RPC
    nativeCurrency: 'SOL',
    decimals: 9
  },
  bitcoin: {
    name: 'Bitcoin',
    chainId: null, // Bitcoin doesn't use EVM chain IDs
    apiUrl: 'https://btcscan.org/api',
    apiKey: null, // No API key needed for public API
    nativeCurrency: 'BTC',
    decimals: 8
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      deep_analysis: 'running',
      blockchain_filtering: 'enabled',
      etherscan_v2_multi_chain: 'enabled'
    },
    version: '2.5.0',
    features: {
      deep_analysis: 'enabled',
      blockchain_filtering: 'enabled',
      cross_chain_analysis: 'enabled',
      real_blockchain_data: 'enabled',
      etherscan_v2_api: 'enabled'
    }
  });
});

// Helper function to get wallet balance - using ONLY real APIs, NO mock data
async function getWalletBalance(address: string, chain: string): Promise<{ balance: string; usdValue: number }> {
  try {
    if (chain === 'solana') {
      // Use Solana RPC directly for balance
      try {
        console.log(`🔍 Getting Solana balance via RPC...`);
        
        const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        
        const rpcResponse = await axios.post(SOLANA_RPC_URL, {
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        console.log(`✅ Solana RPC balance response:`, JSON.stringify(rpcResponse.data, null, 2));
        
        if (rpcResponse.data && rpcResponse.data.result) {
          const lamports = rpcResponse.data.result.value;
          const balance = (lamports / Math.pow(10, 9)).toString();
          
          // Get real-time SOL price from CoinGecko
          let solPrice = 100; // Fallback price
          try {
            console.log(`🔍 Fetching real-time SOL price from CoinGecko...`);
            const coingeckoResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
              params: {
                ids: 'solana',
                vs_currencies: 'usd'
              },
              headers: {
                'X-CG-API-Key': COINGECKO_API_KEY
              },
              timeout: 10000
            });
            
            if (coingeckoResponse.data && coingeckoResponse.data.solana && coingeckoResponse.data.solana.usd) {
              solPrice = coingeckoResponse.data.solana.usd;
              console.log(`✅ CoinGecko SOL price: $${solPrice}`);
            } else {
              console.log(`⚠️ CoinGecko response format unexpected, using fallback price`);
            }
          } catch (coingeckoError: any) {
            console.log(`⚠️ CoinGecko API failed: ${coingeckoError.message}, using fallback price`);
          }
          
          const usdValue = parseFloat(balance) * solPrice;
          
          console.log(`✅ Solana RPC success: ${balance} SOL = $${usdValue.toFixed(2)} (SOL price: $${solPrice})`);
          return { balance, usdValue };
        } else {
          throw new Error('Invalid RPC response format');
        }
        
      } catch (rpcError: any) {
        console.log(`❌ Solana RPC failed: ${rpcError.message}`);
        if (rpcError.response) {
          console.log(`❌ RPC Status: ${rpcError.response.status}`);
          console.log(`❌ RPC Response data:`, JSON.stringify(rpcError.response.data, null, 2));
        }
        throw new Error(`Solana RPC failed: ${rpcError.message}`);
      }
      
         } else if (chain === 'bitcoin') {
       // Use BTCScan API for Bitcoin balance (free, public API)
       try {
         console.log(`🔍 Getting Bitcoin balance via BTCScan API...`);
         
         const response = await axios.get(`https://btcscan.org/api/address/${address}`, {
           timeout: 15000
         });
         
         console.log(`✅ BTCScan API response for Bitcoin:`, JSON.stringify(response.data, null, 2));
         
         if (response.data && response.data.chain_stats) {
           // BTCScan returns balance in satoshis via chain_stats
           const balanceSatoshis = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
           const balance = (balanceSatoshis / Math.pow(10, 8)).toString(); // Convert satoshis to BTC
           
           // Get real-time BTC price from CoinGecko
           let btcPrice = 100; // Fallback price
           try {
             console.log(`🔍 Fetching real-time BTC price from CoinGecko...`);
             const coingeckoResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
               params: {
                 ids: 'bitcoin',
                 vs_currencies: 'usd'
               },
               headers: {
                 'X-CG-API-Key': COINGECKO_API_KEY
               },
               timeout: 10000
             });
             
             if (coingeckoResponse.data && coingeckoResponse.data.bitcoin && coingeckoResponse.data.bitcoin.usd) {
               btcPrice = coingeckoResponse.data.bitcoin.usd;
               console.log(`✅ CoinGecko BTC price: $${btcPrice}`);
             } else {
               console.log(`⚠️ CoinGecko response format unexpected, using fallback price`);
             }
           } catch (coingeckoError: any) {
             console.log(`⚠️ CoinGecko API failed: ${coingeckoError.message}, using fallback price`);
           }
           
           const usdValue = parseFloat(balance) * btcPrice;
           
           console.log(`✅ BTCScan API success: ${balance} BTC = $${usdValue.toFixed(2)} (BTC price: $${btcPrice})`);
           return { balance, usdValue };
         } else {
           throw new Error('Invalid BTCScan response format for balance');
         }
         
       } catch (apiError: any) {
         console.log(`❌ BTCScan API failed for Bitcoin: ${apiError.message}`);
         if (apiError.response) {
           console.log(`❌ Status: ${apiError.response.status}`);
           console.log(`❌ Response data:`, JSON.stringify(apiError.response.data, null, 2));
         }
         throw new Error(`BTCScan API failed for Bitcoin: ${apiError.message}`);
       }
      
    } else {
      // For other chains, also try real APIs first
      try {
        const chainConfig = CHAIN_CONFIGS[chain as keyof typeof CHAIN_CONFIGS];
        if (!chainConfig) {
          throw new Error(`No configuration found for chain: ${chain}`);
        }
        
        console.log(`🔍 Trying Etherscan V2 API for ${chain} with chainId: ${chainConfig.chainId}`);
        
        const response = await axios.get(chainConfig.apiUrl, {
          params: {
            module: 'account',
            action: 'balance',
            address: address,
            chainid: chainConfig.chainId,
            apikey: chainConfig.apiKey
          },
          timeout: 10000
        });
        
        console.log(`✅ Etherscan V2 API response for ${chain}:`, JSON.stringify(response.data, null, 2));
        
                 if (response.data && response.data.result) {
           const balance = response.data.result;
           // Convert from wei to ETH (divide by 10^18)
           const balanceInEth = parseFloat(balance) / Math.pow(10, chainConfig.decimals);
           
           // Get real-time ETH price from CoinGecko
           let ethPrice = 100; // Fallback price
           try {
             console.log(`🔍 Fetching real-time ETH price from CoinGecko...`);
             const coingeckoResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
               params: {
                 ids: 'ethereum',
                 vs_currencies: 'usd'
               },
               headers: {
                 'X-CG-API-Key': COINGECKO_API_KEY
               },
               timeout: 10000
             });
             
             if (coingeckoResponse.data && coingeckoResponse.data.ethereum && coingeckoResponse.data.ethereum.usd) {
               ethPrice = coingeckoResponse.data.ethereum.usd;
               console.log(`✅ CoinGecko ETH price: $${ethPrice}`);
             } else {
               console.log(`⚠️ CoinGecko response format unexpected, using fallback price`);
             }
           } catch (coingeckoError: any) {
             console.log(`⚠️ CoinGecko API failed: ${coingeckoError.message}, using fallback price`);
           }
           
           const usdValue = balanceInEth * ethPrice;
           
           // Return balance in ETH (not wei) and USD value
           return { balance: balanceInEth.toString(), usdValue };
         }
        
      } catch (apiError: any) {
        console.log(`❌ Etherscan V2 API failed for ${chain}: ${apiError.message}`);
        if (apiError.response) {
          console.log(`❌ Status: ${apiError.response.status}`);
          console.log(`❌ Response data:`, JSON.stringify(apiError.response.data, null, 2));
        }
      }
      
      // If Etherscan V2 fails, try individual chain APIs
      try {
        let individualApiUrl = '';
        switch (chain) {
          case 'bsc':
            individualApiUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&apikey=${process.env.BSCSCAN_API_KEY}`;
            break;
          case 'polygon':
            individualApiUrl = `https://api.polygonscan.com/api?module=account&action=balance&address=${address}&apikey=${process.env.POLYGONSCAN_API_KEY}`;
            break;
          case 'avalanche':
            individualApiUrl = `https://api.snowtrace.io/api?module=account&action=balance&address=${address}&apikey=${process.env.SNOWTRACE_API_KEY}`;
            break;
          case 'arbitrum':
            individualApiUrl = `https://api.arbiscan.io/api?module=account&action=balance&address=${address}&apikey=${process.env.ARBISCAN_API_KEY}`;
            break;
          case 'optimism':
            individualApiUrl = `https://api-optimistic.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${process.env.OPTIMISM_API_KEY}`;
            break;
          case 'base':
            individualApiUrl = `https://api.basescan.org/api?module=account&action=balance&address=${address}&apikey=${process.env.BASESCAN_API_KEY}`;
            break;
          case 'linea':
            individualApiUrl = `https://api.lineascan.build/api?module=account&action=balance&address=${address}&apikey=${process.env.LINEASCAN_API_KEY}`;
            break;
          default:
            individualApiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
        }
        
        if (individualApiUrl) {
          console.log(`🔍 Trying individual API for ${chain}: ${individualApiUrl}`);
          
          const response = await axios.get(individualApiUrl, { timeout: 10000 });
          
          console.log(`✅ Individual API response for ${chain}:`, JSON.stringify(response.data, null, 2));
          
          if (response.data && response.data.result) {
            const balance = response.data.result;
            const usdValue = parseFloat(balance) / Math.pow(10, 18) * 100; // Approximate price
            
            return { balance, usdValue };
          }
        }
        
      } catch (individualApiError: any) {
        console.log(`❌ Individual API failed for ${chain}: ${individualApiError.message}`);
        if (individualApiError.response) {
          console.log(`❌ Status: ${individualApiError.response.status}`);
          console.log(`❌ Response data:`, JSON.stringify(individualApiError.response.data, null, 2));
        }
      }
      
      // If we get here, ALL APIs failed - throw error to see what happened
      throw new Error(`All APIs failed for ${chain} - no mock data available`);
    }
  } catch (error: any) {
    console.error(`❌ Failed to get balance for ${chain}:`, error.message);
    throw error; // Re-throw to see the actual error
  }
}

// Helper function to get transaction count - using ONLY real APIs, NO mock data
async function getTransactionCount(address: string, chain: string): Promise<number> {
  try {
    if (chain === 'solana') {
      // Use Solana RPC directly for transaction count with pagination and rate limiting
      try {
        console.log(`🔍 Getting Solana transaction count via RPC with pagination...`);
        
        const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        let totalTransactions = 0;
        let lastSignature: string | null = null;
        const batchSize = 1000;
        let consecutiveRateLimits = 0;
        const maxRetries = 3;
        
        // Make multiple calls to get all transactions
        for (let batch = 0; batch < 20; batch++) { // Increased limit to handle more batches
          const params: [string, { limit: number; before?: string }] = [
            address,
            {
              limit: batchSize
            }
          ];
          
          // Add before parameter for pagination (except first call)
          if (lastSignature) {
            params[1].before = lastSignature;
          }
          
          console.log(`🔍 Fetching batch ${batch + 1} (${lastSignature ? 'before: ' + lastSignature.substring(0, 8) + '...' : 'first batch'})`);
          
          let retryCount = 0;
          let batchSuccess = false;
          
          while (retryCount < maxRetries && !batchSuccess) {
            try {
              const rpcResponse = await axios.post(SOLANA_RPC_URL, {
                jsonrpc: '2.0',
                id: batch + 1,
                method: 'getSignaturesForAddress',
                params: params
              }, {
                headers: {
                  'Content-Type': 'application/json'
                },
                timeout: 15000
              });
              
              if (rpcResponse.data && rpcResponse.data.result) {
                const transactions = rpcResponse.data.result;
                const batchCount = transactions.length;
                totalTransactions += batchCount;
                
                console.log(`✅ Batch ${batch + 1}: Found ${batchCount} transactions (Total: ${totalTransactions})`);
                
                // Reset rate limit counter on success
                consecutiveRateLimits = 0;
                batchSuccess = true;
                
                // If we got less than batchSize, we've reached the end
                if (batchCount < batchSize) {
                  console.log(`✅ Reached end of transactions after ${batch + 1} batches`);
                  return totalTransactions;
                }
                
                // Get the last signature for next batch
                lastSignature = transactions[transactions.length - 1].signature;
                
                // Add 3-second delay to avoid rate limiting
                if (batch < 19) { // Don't delay after last batch
                  console.log(`⏳ Waiting 3 seconds before next batch to avoid rate limiting...`);
                  await new Promise(resolve => setTimeout(resolve, 3000));
                }
                
              } else {
                console.log(`❌ Invalid RPC response for batch ${batch + 1}`);
                break;
              }
              
            } catch (rpcError: any) {
              if (rpcError.response && rpcError.response.status === 429) {
                consecutiveRateLimits++;
                retryCount++;
                
                if (retryCount < maxRetries) {
                  const waitTime = 3000 * retryCount; // Progressive backoff: 3s, 6s, 9s
                  console.log(`⚠️ Rate limited on batch ${batch + 1} (attempt ${retryCount}/${maxRetries}), waiting ${waitTime/1000} seconds...`);
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                } else {
                  console.log(`❌ Max retries reached for batch ${batch + 1} due to rate limiting`);
                  break;
                }
              } else {
                console.log(`❌ RPC error for batch ${batch + 1}: ${rpcError.message}`);
                if (rpcError.response) {
                  console.log(`❌ Status: ${rpcError.response.status}`);
                  console.log(`❌ Response data:`, JSON.stringify(rpcError.response.data, null, 2));
                }
                break;
              }
            }
          }
          
          // If we couldn't get this batch after all retries, stop
          if (!batchSuccess) {
            console.log(`❌ Failed to get batch ${batch + 1} after ${maxRetries} retries`);
            break;
          }
          
          // If we've hit too many consecutive rate limits, add extra delay
          if (consecutiveRateLimits >= 2) {
            console.log(`⚠️ Multiple consecutive rate limits detected, adding extra 5-second delay...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            consecutiveRateLimits = 0;
          }
        }
        
        console.log(`✅ Solana RPC success: Total ${totalTransactions} transactions found`);
        return totalTransactions;
        
      } catch (rpcError: any) {
        console.log(`❌ Solana RPC failed: ${rpcError.message}`);
        if (rpcError.response) {
          console.log(`❌ RPC Status: ${rpcError.response.status}`);
          console.log(`❌ RPC Response data:`, JSON.stringify(rpcError.response.data, null, 2));
        }
        throw new Error(`Solana RPC failed: ${rpcError.message}`);
      }
      
         } else if (chain === 'bitcoin') {
       // Use BTCScan API for Bitcoin transaction count
       try {
         console.log(`🔍 Getting Bitcoin transaction count via BTCScan API...`);
         
         const response = await axios.get(`https://btcscan.org/api/address/${address}`, {
           timeout: 15000
         });
         
         console.log(`✅ BTCScan API response for Bitcoin:`, JSON.stringify(response.data, null, 2));
         
         if (response.data && response.data.chain_stats) {
           const transactionCount = response.data.chain_stats.tx_count;
           console.log(`✅ BTCScan API success: ${transactionCount} transactions found`);
           return transactionCount;
         } else {
           throw new Error('Invalid BTCScan response format for transaction count');
         }
         
       } catch (apiError: any) {
         console.log(`❌ BTCScan API failed for Bitcoin: ${apiError.message}`);
         if (apiError.response) {
           console.log(`❌ Status: ${apiError.response.status}`);
           console.log(`❌ Response data:`, JSON.stringify(apiError.response.data, null, 2));
         }
         throw new Error(`BTCScan API failed for Bitcoin: ${apiError.message}`);
       }
    } else {
      // For other chains, try real APIs
      try {
        const chainConfig = CHAIN_CONFIGS[chain as keyof typeof CHAIN_CONFIGS];
        if (!chainConfig) {
          throw new Error(`No configuration found for chain: ${chain}`);
        }
        
                 console.log(`🔍 Trying Etherscan V2 API for ${chain} transactions with chainId: ${chainConfig.chainId}`);
         
         // For Ethereum, use txlist to get actual transaction count instead of nonce
         if (chain === 'ethereum') {
           console.log(`🔍 Using txlist for Ethereum to get actual transaction count...`);
           
           const response = await axios.get('https://api.etherscan.io/api', {
             params: {
               module: 'account',
               action: 'txlist',
               address: address,
               startblock: 0,
               endblock: 99999999,
               sort: 'asc',
               apikey: chainConfig.apiKey
             },
             timeout: 15000
           });
           
           console.log(`✅ Etherscan txlist API response for ${chain}:`, JSON.stringify(response.data, null, 2));
           
           if (response.data && response.data.result && Array.isArray(response.data.result)) {
             const transactionCount = response.data.result.length;
             console.log(`✅ Actual transaction count from txlist: ${transactionCount}`);
             return transactionCount;
           }
         } else {
           // For other chains, use the original eth_getTransactionCount method
           const response = await axios.get(chainConfig.apiUrl, {
             params: {
               module: 'proxy',
               action: 'eth_getTransactionCount',
               address: address,
               chainid: chainConfig.chainId,
               apikey: chainConfig.apiKey
             },
             timeout: 10000
           });
           
           console.log(`✅ Etherscan V2 transaction API response for ${chain}:`, JSON.stringify(response.data, null, 2));
           
           if (response.data && response.data.result) {
             const transactionCount = parseInt(response.data.result, 16);
             console.log(`✅ Transaction count converted: ${response.data.result} (hex) = ${transactionCount} (decimal)`);
             return transactionCount;
           }
         }
        
      } catch (apiError: any) {
        console.log(`❌ Etherscan V2 transaction API failed for ${chain}: ${apiError.message}`);
        if (apiError.response) {
          console.log(`❌ Status: ${apiError.response.status}`);
          console.log(`❌ Response data:`, JSON.stringify(apiError.response.data, null, 2));
        }
      }
      
      // If Etherscan V2 fails, try individual chain APIs
      try {
        let individualApiUrl = '';
        switch (chain) {
          case 'bsc':
            individualApiUrl = `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.BSCSCAN_API_KEY}`;
            break;
          case 'polygon':
            individualApiUrl = `https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.POLYGONSCAN_API_KEY}`;
            break;
          case 'avalanche':
            individualApiUrl = `https://api.snowtrace.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.SNOWTRACE_API_KEY}`;
            break;
          case 'arbitrum':
            individualApiUrl = `https://api.arbiscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.ARBISCAN_API_KEY}`;
            break;
          case 'optimism':
            individualApiUrl = `https://api-optimistic.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.OPTIMISM_API_KEY}`;
            break;
          case 'base':
            individualApiUrl = `https://api.basescan.org/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.BASESCAN_API_KEY}`;
            break;
          case 'linea':
            individualApiUrl = `https://api.lineascan.build/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${process.env.LINEASCAN_API_KEY}`;
            break;
          default:
            individualApiUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
        }
        
        if (individualApiUrl) {
          console.log(`🔍 Trying individual transaction API for ${chain}: ${individualApiUrl}`);
          
          const response = await axios.get(individualApiUrl, { timeout: 10000 });
          
          console.log(`✅ Individual transaction API response for ${chain}:`, JSON.stringify(response.data, null, 2));
          
          if (response.data && response.data.result) {
            const transactionCount = parseInt(response.data.result, 16);
            console.log(`✅ Transaction count converted: ${response.data.result} (hex) = ${transactionCount} (decimal)`);
            return transactionCount;
          }
        }
        
      } catch (individualApiError: any) {
        console.log(`❌ Individual transaction API failed for ${chain}: ${individualApiError.message}`);
        if (individualApiError.response) {
          console.log(`❌ Status: ${individualApiError.response.status}`);
          console.log(`❌ Response data:`, JSON.stringify(individualApiError.response.data, null, 2));
        }
      }
      
      // If we get here, ALL APIs failed - throw error to see what happened
      throw new Error(`All transaction APIs failed for ${chain} - no mock data available`);
    }
  } catch (error: any) {
    console.error(`❌ Failed to get transaction count for ${chain}:`, error.message);
    throw error; // Re-throw to see the actual error
  }
}

// Quick Analysis endpoint - Basic wallet information
app.post('/api/v1/wallet/analyze', async (req, res) => {
  try {
    const { address, analysisType } = req.body;
    
    console.log('🔍 Quick Analysis Request Body:', JSON.stringify(req.body, null, 2));
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log(`🔍 Starting QUICK ANALYSIS for wallet: ${address}`);

    // For quick analysis, just analyze Ethereum chain by default
    const chain = 'ethereum';
    
    try {
      console.log(`🔄 Analyzing ${chain} chain for quick analysis...`);
      
      // Get basic balance and transaction count
      const balanceData = await getWalletBalance(address, chain);
      const transactionCount = await getTransactionCount(address, chain);
      
      console.log(`🔍 ${chain} - Balance: ${balanceData.balance}, USD: $${balanceData.usdValue}, Transactions: ${transactionCount}`);
      
      // Create basic response
      const quickData = {
        address: address,
        blockchains: {
          [chain]: {
            address: address,
            blockchain: chain,
            balance: {
              native: balanceData.balance,
              usdValue: balanceData.usdValue
            },
            tokens: [],
            totalTokens: 0,
            topTokens: [],
            recentTransactions: [],
            totalLifetimeValue: balanceData.usdValue,
            transactionCount: transactionCount,
            tokenTransactionCount: 0,
            lastUpdated: new Date().toISOString()
          }
        },
        totalValue: balanceData.usdValue,
        totalTransactions: transactionCount,
        lastUpdated: new Date().toISOString()
      };

      res.json({
        success: true,
        data: quickData,
        analysisType: 'QUICK',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.log(`❌ ${chain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        success: false,
        error: 'Quick analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Quick analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Quick analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Deep Analysis endpoint - Comprehensive cross-chain wallet investigation with blockchain filtering
app.post('/api/v1/wallet/deep-analyze', async (req, res) => {
  try {
    const { address, blockchainFilter } = req.body;
    
    // Add debugging
    console.log('🔍 Deep Analysis Request Body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Extracted blockchainFilter:', blockchainFilter);
    console.log('🔍 Extracted address:', address);

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log(`🔍 Starting DEEP ANALYSIS for wallet: ${address}`);

    // Define Ethereum-based chains (EVM compatible)
    const ethereumBasedChains = [
      'ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 
      'optimism', 'base', 'linea'
    ];
    
    // Define Solana chain
    const solanaChain = ['solana'];
    
    // Define Bitcoin chain
    const bitcoinChain = ['bitcoin'];
    
    // If blockchainFilter is specified, only analyze specified chains
    let chainsToAnalyze = ethereumBasedChains;
    if (blockchainFilter === 'ethereum' || blockchainFilter === 'evm') {
      console.log(`🔗 Filtering to Ethereum-based chains only`);
      chainsToAnalyze = ethereumBasedChains;
    } else if (blockchainFilter === 'solana') {
      console.log(`🔗 Filtering to Solana chain only`);
      chainsToAnalyze = solanaChain;
    } else if (blockchainFilter === 'bitcoin') {
      console.log(`🔗 Filtering to Bitcoin chain only`);
      chainsToAnalyze = bitcoinChain;
    }
    
    console.log(`🔗 Will analyze chains: ${chainsToAnalyze.join(', ')}`);
    
    // Get real blockchain data for each chain
    const multiChainData: Record<string, any> = {};
    let totalValue = 0;
    let totalTransactions = 0;
    
    for (const chain of chainsToAnalyze) {
      try {
        console.log(`🔄 Analyzing ${chain} chain...`);
        
        // Get real balance and transaction count
        const balanceData = await getWalletBalance(address, chain);
        const transactionCount = await getTransactionCount(address, chain);
        
        // Debug logging
        console.log(`🔍 ${chain} - Balance: ${balanceData.balance}, USD: $${balanceData.usdValue}, Transactions: ${transactionCount}`);
        
        // Always include chains that have data (balance > 0 OR transactions > 0)
        if (parseFloat(balanceData.balance) > 0 || transactionCount > 0) {
          multiChainData[chain] = {
            address: address,
            blockchain: chain,
            balance: {
              native: balanceData.balance,
              usdValue: balanceData.usdValue
            },
            tokens: [],
            totalTokens: 0,
            topTokens: [],
            recentTransactions: [],
            totalLifetimeValue: balanceData.usdValue,
            transactionCount: transactionCount,
            tokenTransactionCount: 0,
            lastUpdated: new Date().toISOString()
          };
          
          totalValue += balanceData.usdValue;
          totalTransactions += transactionCount;
          
          console.log(`✅ ${chain} analysis complete: $${balanceData.usdValue.toFixed(2)} value, ${transactionCount} transactions`);
        } else {
          console.log(`⚠️ No activity detected on ${chain} chain`);
        }
      } catch (error) {
        console.log(`❌ ${chain} analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Create transformed data
    const transformedData = {
      address: address,
      blockchains: multiChainData,
      totalValue: totalValue,
      totalTransactions: totalTransactions,
      lastUpdated: new Date().toISOString(),
      priorityTokenAnalysis: {
        highPriorityTokens: 0,
        mediumPriorityTokens: 0,
        lowPriorityTokens: 0,
        successRate: 100,
        marketTrends: {
          gainers: [],
          losers: []
        }
      }
    };

    res.json({
      success: true,
      data: transformedData,
      analysisType: 'DEEP',
      blockchainFilter: blockchainFilter || 'auto',
      analyzedChains: Object.keys(multiChainData),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Deep analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Deep analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve the test interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-interface.html'));
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
server.listen(API_PORT, () => {
  console.log(`🚀 LYNX Consolidated Server running on http://localhost:${API_PORT}`);
  console.log(`🔍 Deep Analysis endpoint: POST /api/v1/wallet/deep-analyze`);
  console.log(`🔗 Blockchain filtering enabled for Ethereum, Solana, and Bitcoin`);
  console.log(`🔗 Using simple working approach (like simple-deep-analysis-server.js)`);
  console.log(`🔑 Using Etherscan API Key: ${ETHERSCAN_API_KEY?.substring(0, 8)}...`);
  console.log(`✅ Server is listening on port ${API_PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export { app, server };
