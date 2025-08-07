import dotenv from 'dotenv';
import path from 'path';

console.log('🔍 Testing .env loading...');
console.log('================================');

// Test different paths
const possiblePaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, 'agents/agent1-wia/.env'),
  path.resolve(__dirname, 'agents/agent1-wia/src/.env'),
  path.resolve(__dirname, 'agents/agent1-wia/src/utils/.env'),
];

console.log('Current directory:', __dirname);
console.log('Looking for .env files at:');
possiblePaths.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p}`);
});

// Try to load .env from root
const result = dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log('\n📁 .env loading result:', result);

// Check if environment variables are loaded
console.log('\n🔑 Environment Variables:');
console.log('  ETHERSCAN_API_KEY:', process.env['ETHERSCAN_API_KEY'] ? '✅ Found' : '❌ Not found');
console.log('  INFURA_PROJECT_ID:', process.env['INFURA_PROJECT_ID'] ? '✅ Found' : '❌ Not found');
console.log('  ETHEREUM_RPC_URL:', process.env['ETHEREUM_RPC_URL'] ? '✅ Found' : '❌ Not found');
console.log('  BTCSCAN_API_URL:', process.env['BTCSCAN_API_URL'] ? '✅ Found' : '❌ Not found');

// Test the config loading
import { config } from './agents/agent1-wia/src/utils/config';

console.log('\n⚙️ Config Test:');
const ethereumConfig = config.getEthereumConfig();
console.log('  Ethereum Config:', {
  hasEtherscanKey: !!ethereumConfig.etherscanApiKey,
  hasInfuraId: !!ethereumConfig.infuraProjectId,
  rpcUrl: ethereumConfig.rpcUrl
});

const bitcoinConfig = config.getBitcoinConfig();
console.log('  Bitcoin Config:', {
  hasBtcscanUrl: !!bitcoinConfig.btcscanApiUrl,
  hasBlockcypherKey: !!bitcoinConfig.blockcypherApiKey
});

console.log('\n🎯 API Key Validation:');
console.log('  Ethereum:', config.hasEthereumApiKeys());
console.log('  Bitcoin:', config.hasBitcoinApiKeys());
console.log('  Binance:', config.hasBinanceApiKeys());
console.log('  Polygon:', config.hasPolygonApiKeys());
console.log('  Solana:', config.hasSolanaApiKeys()); 