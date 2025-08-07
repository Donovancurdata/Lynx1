import dotenv from 'dotenv';
import path from 'path';

console.log('🔍 Testing .env loading...');
console.log('================================');

// Load .env from root directory
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
console.log('\n📁 .env loading result:', result);

// Check if environment variables are loaded
console.log('\n🔑 Environment Variables:');
console.log('  ETHERSCAN_API_KEY:', process.env['ETHERSCAN_API_KEY'] ? '✅ Found' : '❌ Not found');
console.log('  INFURA_PROJECT_ID:', process.env['INFURA_PROJECT_ID'] ? '✅ Found' : '❌ Not found');
console.log('  ETHEREUM_RPC_URL:', process.env['ETHEREUM_RPC_URL'] ? '✅ Found' : '❌ Not found');
console.log('  BTCSCAN_API_URL:', process.env['BTCSCAN_API_URL'] ? '✅ Found' : '❌ Not found');
console.log('  BSCSCAN_API_KEY:', process.env['BSCSCAN_API_KEY'] ? '✅ Found' : '❌ Not found');
console.log('  POLYGONSCAN_API_KEY:', process.env['POLYGONSCAN_API_KEY'] ? '✅ Found' : '❌ Not found');
console.log('  SOLSCAN_API_KEY:', process.env['SOLSCAN_API_KEY'] ? '✅ Found' : '❌ Not found');

// Show actual values (masked for security)
console.log('\n🔐 API Key Values (masked):');
console.log('  ETHERSCAN_API_KEY:', process.env['ETHERSCAN_API_KEY'] ? `${process.env['ETHERSCAN_API_KEY'].substring(0, 8)}...` : 'Not set');
console.log('  INFURA_PROJECT_ID:', process.env['INFURA_PROJECT_ID'] ? `${process.env['INFURA_PROJECT_ID'].substring(0, 8)}...` : 'Not set');
console.log('  ETHEREUM_RPC_URL:', process.env['ETHEREUM_RPC_URL'] ? 'Set' : 'Not set');
console.log('  BTCSCAN_API_URL:', process.env['BTCSCAN_API_URL'] ? 'Set' : 'Not set');
console.log('  BSCSCAN_API_KEY:', process.env['BSCSCAN_API_KEY'] ? `${process.env['BSCSCAN_API_KEY'].substring(0, 8)}...` : 'Not set');
console.log('  POLYGONSCAN_API_KEY:', process.env['POLYGONSCAN_API_KEY'] ? `${process.env['POLYGONSCAN_API_KEY'].substring(0, 8)}...` : 'Not set');
console.log('  SOLSCAN_API_KEY:', process.env['SOLSCAN_API_KEY'] ? `${process.env['SOLSCAN_API_KEY'].substring(0, 20)}...` : 'Not set');

console.log('\n🎯 Summary:');
const hasEthereum = !!(process.env['ETHERSCAN_API_KEY'] || process.env['INFURA_PROJECT_ID']);
const hasBitcoin = !!process.env['BTCSCAN_API_URL'];
const hasBinance = !!process.env['BSCSCAN_API_KEY'];
const hasPolygon = !!process.env['POLYGONSCAN_API_KEY'];
const hasSolana = !!process.env['SOLSCAN_API_KEY'];

console.log('  Ethereum APIs:', hasEthereum ? '✅ Available' : '❌ Not available');
console.log('  Bitcoin APIs:', hasBitcoin ? '✅ Available' : '❌ Not available');
console.log('  Binance APIs:', hasBinance ? '✅ Available' : '❌ Not available');
console.log('  Polygon APIs:', hasPolygon ? '✅ Available' : '❌ Not available');
console.log('  Solana APIs:', hasSolana ? '✅ Available' : '❌ Not available');

console.log('\n🚀 Ready to test wallets:', hasEthereum || hasBitcoin || hasBinance || hasPolygon || hasSolana ? '✅ Yes' : '❌ No'); 