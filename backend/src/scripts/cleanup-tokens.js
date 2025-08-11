// Load environment variables
const path = require('path');
const envPath = path.resolve(__dirname, '../../../.env');
console.log('🔍 Loading .env from:', envPath);
require('dotenv').config({ path: envPath });

// Debug environment variables
console.log('🔧 Environment Variables Check:');
console.log('AZURE_STORAGE_ACCOUNT_NAME:', process.env.AZURE_STORAGE_ACCOUNT_NAME ? '✅ Set' : '❌ Not set');
console.log('AZURE_TENANT_ID:', process.env.AZURE_TENANT_ID ? '✅ Set' : '❌ Not set');
console.log('AZURE_CLIENT_ID:', process.env.AZURE_CLIENT_ID ? '✅ Set' : '❌ Not set');
console.log('AZURE_CLIENT_SECRET:', process.env.AZURE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
console.log('Current working directory:', process.cwd());
console.log('');

const { TokenDataCollector } = require('../../dist/services/TokenDataCollector');

async function cleanupTokens() {
  console.log('🧹 Starting token cleanup and ETH price fix...\n');
  
  const collector = new TokenDataCollector();
  
  try {
    // Step 1: Read current tokens from Azure
    console.log('📖 Step 1: Reading current tokens from Azure...');
    const tokens = await collector.readTokens();
    console.log(`✅ Found ${tokens.length} tokens in Azure storage`);
    
    // Step 2: Identify duplicates and problematic entries
    console.log('\n🔍 Step 2: Analyzing tokens for duplicates and issues...');
    
    const tokenMap = new Map();
    const duplicates = [];
    const problematic = [];
    
    tokens.forEach(token => {
      const key = `${token.symbol.toLowerCase()}-${token.blockchain}`;
      
      if (tokenMap.has(key)) {
        duplicates.push({
          original: tokenMap.get(key),
          duplicate: token,
          key: key
        });
      } else {
        tokenMap.set(key, token);
      }
      
      // Check for problematic ETH entries
      if (token.symbol === 'ETH' && token.blockchain === 'ethereum') {
        problematic.push(token);
      }
    });
    
    console.log(`📊 Analysis Results:`);
    console.log(`   • Unique tokens: ${tokenMap.size}`);
    console.log(`   • Duplicates found: ${duplicates.length}`);
    console.log(`   • Problematic ETH entries: ${problematic.length}`);
    
    // Step 3: Show duplicates
    if (duplicates.length > 0) {
      console.log('\n🔄 Duplicate Entries Found:');
      duplicates.forEach((dup, index) => {
        console.log(`   ${index + 1}. ${dup.key}:`);
        console.log(`      Original: ${dup.original.id} (${dup.original.address || 'no address'})`);
        console.log(`      Duplicate: ${dup.duplicate.id} (${dup.duplicate.address || 'no address'})`);
      });
    }
    
    // Step 4: Show problematic ETH entries
    if (problematic.length > 0) {
      console.log('\n⚠️ Problematic ETH Entries:');
      problematic.forEach((eth, index) => {
        console.log(`   ${index + 1}. ID: ${eth.id}`);
        console.log(`      Address: ${eth.address || 'no address'}`);
        console.log(`      Name: ${eth.name}`);
        console.log(`      Created: ${eth.createdAt}`);
      });
    }
    
    // Step 5: Create cleaned token list
    console.log('\n🧹 Step 3: Creating cleaned token list...');
    
    const cleanedTokens = [];
    const seenKeys = new Set();
    
    // Keep only the first occurrence of each symbol-blockchain combination
    tokens.forEach(token => {
      const key = `${token.symbol.toLowerCase()}-${token.blockchain}`;
      
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        
        // Special handling for ETH on Ethereum - ensure we have the correct one
        if (token.symbol === 'ETH' && token.blockchain === 'ethereum') {
          // Prefer WETH over ETH for Ethereum blockchain
          if (token.name && token.name.toLowerCase().includes('wrapped')) {
            cleanedTokens.push(token);
          } else if (token.address && token.address !== '0x0000000000000000000000000000000000000000') {
            cleanedTokens.push(token);
          } else {
            console.log(`⚠️ Skipping problematic ETH entry: ${token.id}`);
          }
        } else {
          cleanedTokens.push(token);
        }
      } else {
        console.log(`🔄 Skipping duplicate: ${token.symbol} on ${token.blockchain}`);
      }
    });
    
    console.log(`✅ Cleaned tokens: ${cleanedTokens.length} (removed ${tokens.length - cleanedTokens.length} duplicates)`);
    
    // Step 6: Update tokens.json in Azure
    console.log('\n📝 Step 4: Updating tokens.json in Azure...');
    await collector.storeTokens(cleanedTokens);
    console.log('✅ Updated tokens.json in Azure storage');
    
    // Step 7: Collect fresh prices for all tokens
    console.log('\n💰 Step 5: Collecting fresh prices for all tokens...');
    const tokenValues = await collector.collectCurrentPrices();
    console.log(`✅ Collected fresh prices for ${tokenValues.length} tokens`);
    
    // Step 8: Show summary of ETH-related tokens
    console.log('\n📊 ETH-Related Tokens Summary:');
    const ethTokens = cleanedTokens.filter(t => 
      t.symbol === 'ETH' || t.symbol === 'WETH' || t.symbol.includes('ETH')
    );
    
    ethTokens.forEach(token => {
      console.log(`   • ${token.symbol} (${token.blockchain}): ${token.address || 'no address'}`);
    });
    
    console.log('\n🎉 Token cleanup completed successfully!');
    console.log('📁 Updated files: tokens.json, token-values-YYYY-MM-DD.json');
    
  } catch (error) {
    console.error('❌ Error during token cleanup:', error);
    throw error;
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupTokens().catch(console.error);
}

module.exports = { cleanupTokens };
