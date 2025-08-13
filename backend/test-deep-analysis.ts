#!/usr/bin/env tsx

/**
 * Test Deep Analysis Service
 * 
 * This script tests the comprehensive deep analysis functionality that:
 * 1. Detects all blockchains a wallet has been active on
 * 2. Analyzes each blockchain comprehensively
 * 3. Discovers and values all tokens using CoinGecko
 * 4. Stores discovered tokens in Azure for future evaluation
 * 5. Stores comprehensive wallet analysis in Azure
 */

import { DeepAnalysisService } from './src/services/DeepAnalysisService';
import { logger } from './src/utils/logger';

async function testDeepAnalysis() {
  console.log('🧪 Testing Deep Analysis Service...\n');
  
  try {
    // Initialize the service
    console.log('🚀 Initializing Deep Analysis Service...');
    await DeepAnalysisService.initialize();
    console.log('✅ Deep Analysis Service initialized successfully\n');
    
    // Test wallet addresses
    const testWallets = [
      '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b', // Ethereum
      'CjDrZ3rduRkcsZMQh7HqgaqTch31h41BQXhKhLXiCZT4', // Solana
      'bc1q2ygmnk2uqrrft2ta8ltzdt28yl3h8qwrh2f2vanr0sdvhqey86hspxexda' // Bitcoin
    ];
    
    for (const walletAddress of testWallets) {
      console.log(`\n🔍 Testing Deep Analysis for: ${walletAddress}`);
      console.log('=' .repeat(60));
      
      try {
        const startTime = Date.now();
        
        // Perform deep analysis
        const result = await DeepAnalysisService.performDeepAnalysis(walletAddress);
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        console.log(`✅ Deep Analysis completed in ${duration.toFixed(2)}s`);
        console.log(`📊 Results:`);
        console.log(`   • Total Value: $${result.totalValue.toFixed(2)}`);
        console.log(`   • Total Transactions: ${result.totalTransactions}`);
        console.log(`   • Active Blockchains: ${Object.keys(result.blockchains).join(', ')}`);
        console.log(`   • Discovered Tokens: ${result.discoveredTokens.length}`);
        console.log(`   • Azure Storage IDs: ${result.azureStorageIds.length}`);
        
        // Show detailed blockchain breakdown
        for (const [blockchain, analysis] of Object.entries(result.blockchains)) {
          if (analysis) {
            console.log(`\n   🔗 ${blockchain.toUpperCase()}:`);
            console.log(`      • Native Balance: ${analysis.nativeBalance}`);
            console.log(`      • Native USD Value: $${analysis.nativeUsdValue.toFixed(2)}`);
            console.log(`      • Tokens: ${analysis.tokens.length}`);
            console.log(`      • Transactions: ${analysis.transactionCount}`);
          }
        }
        
        // Show token discovery summary
        if (result.discoveredTokens.length > 0) {
          console.log(`\n   💎 Top Discovered Tokens:`);
          const topTokens = result.discoveredTokens
            .filter(t => t.isMatched)
            .sort((a, b) => b.usdValue - a.usdValue)
            .slice(0, 5);
          
          topTokens.forEach((token, index) => {
            console.log(`      ${index + 1}. ${token.symbol} (${token.blockchain}) - $${token.usdValue.toFixed(2)}`);
          });
        }
        
      } catch (error) {
        console.error(`❌ Deep Analysis failed for ${walletAddress}:`, error);
      }
    }
    
    console.log('\n🎯 Deep Analysis testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testDeepAnalysis().catch(console.error);
}


