import { EVMService } from './src/services/blockchain/EVMService';
import { logger } from './src/utils/logger';

async function testWalletInvestigation() {
  const evmService = new EVMService();
  const testAddress = '0x5ad7f4aA390497FE4Cc14c983553961Cb3b8b44b';
  const chain = 'ethereum';
  
  console.log('🔍 Testing Comprehensive Wallet Investigation');
  console.log('============================================');
  console.log(`Address: ${testAddress}`);
  console.log(`Chain: ${chain}`);
  console.log('');
  
  try {
    // Test 1: Basic wallet data
    console.log('1. Getting basic wallet data...');
    const walletData = await evmService.getWalletData(testAddress, chain);
    console.log('✅ Basic wallet data retrieved');
    console.log(`   Native Balance: ${walletData.balance.balance} ETH ($${walletData.balance.usdValue.toFixed(2)})`);
    console.log(`   Total Tokens: ${walletData.enhancedBalance.tokens.length}`);
    console.log(`   Total Portfolio Value: $${walletData.enhancedBalance.totalUsdValue.toFixed(2)}`);
    console.log(`   Transaction Count: ${walletData.transactionAnalysis.transactionCount}`);
    console.log('');
    
    // Test 2: Comprehensive investigation
    console.log('2. Running comprehensive wallet investigation...');
    const investigation = await evmService.investigateWallet(testAddress, chain);
    console.log('✅ Comprehensive investigation completed');
    console.log('');
    
    // Display investigation results
    console.log('📊 INVESTIGATION RESULTS:');
    console.log('========================');
    
    // Wallet Opinion
    console.log('\n🎯 WALLET OPINION:');
    console.log(`   Type: ${investigation.walletOpinion.type}`);
    console.log(`   Activity Level: ${investigation.walletOpinion.activityLevel}`);
    console.log(`   Estimated Value: $${investigation.walletOpinion.estimatedValue.toFixed(2)}`);
    console.log(`   Confidence: ${investigation.walletOpinion.confidence}`);
    console.log(`   Risk Score: ${investigation.walletOpinion.riskScore}/100`);
    console.log(`   Risk Factors: ${investigation.walletOpinion.riskFactors.join(', ')}`);
    
    // Transaction Analysis
    console.log('\n💰 TRANSACTION ANALYSIS:');
    console.log(`   Total Lifetime Volume: $${investigation.transactionAnalysis.lifetimeVolume.toFixed(2)}`);
    console.log(`   Total Incoming: $${investigation.transactionAnalysis.totalIncoming.toFixed(2)}`);
    console.log(`   Total Outgoing: $${investigation.transactionAnalysis.totalOutgoing.toFixed(2)}`);
    console.log(`   Net Flow: $${investigation.transactionAnalysis.netFlow.toFixed(2)}`);
    console.log(`   Largest Transaction: $${investigation.transactionAnalysis.largestTransaction.toFixed(2)}`);
    console.log(`   Average Transaction: $${investigation.transactionAnalysis.averageTransaction.toFixed(2)}`);
    console.log(`   Transaction Count: ${investigation.transactionAnalysis.transactionCount}`);
    
    // Token Portfolio
    console.log('\n🪙 TOKEN PORTFOLIO:');
    console.log(`   Native Balance: ${investigation.enhancedBalance.native.balance} ETH ($${investigation.enhancedBalance.native.usdValue.toFixed(2)})`);
    console.log(`   Total Tokens: ${investigation.enhancedBalance.tokens.length}`);
    if (investigation.enhancedBalance.tokens.length > 0) {
      console.log('   Top Tokens:');
      investigation.enhancedBalance.tokens
        .sort((a, b) => b.usdValue - a.usdValue)
        .slice(0, 5)
        .forEach((token, index) => {
          console.log(`     ${index + 1}. ${token.tokenName} (${token.tokenSymbol}): ${token.balance} = $${token.usdValue.toFixed(2)}`);
        });
    }
    
    // Recent Transactions
    console.log('\n📈 RECENT TRANSACTIONS (Last 10):');
    investigation.recentTransactions.forEach((tx, index) => {
      const date = new Date(tx.timestamp).toLocaleDateString();
      const time = new Date(tx.timestamp).toLocaleTimeString();
      console.log(`   ${index + 1}. ${date} ${time} - ${tx.value} ${tx.currency} (${tx.type})`);
      console.log(`      From: ${tx.from}`);
      console.log(`      To: ${tx.to}`);
      console.log(`      Hash: ${tx.hash}`);
    });
    
    // Fund Flows
    console.log('\n💸 FUND FLOWS (Last 5 Days):');
    investigation.fundFlows.forEach((flow, index) => {
      console.log(`   ${flow.date}: Incoming $${flow.incoming.toFixed(2)}, Outgoing $${flow.outgoing.toFixed(2)}, Net $${flow.netFlow.toFixed(2)} (${flow.transactionCount} txs)`);
    });
    
    // Risk Assessment
    console.log('\n⚠️ RISK ASSESSMENT:');
    console.log(`   Risk Score: ${investigation.riskAssessment.score}/100`);
    console.log(`   Risk Factors: ${investigation.riskAssessment.factors.join(', ')}`);
    console.log('   Recommendations:');
    investigation.riskAssessment.recommendations.forEach((rec, index) => {
      console.log(`     ${index + 1}. ${rec}`);
    });
    
    // Blockchain Info
    console.log('\n🔗 BLOCKCHAIN INFO:');
    console.log(`   Name: ${investigation.blockchainInfo.name}`);
    console.log(`   Symbol: ${investigation.blockchainInfo.symbol}`);
    console.log(`   Chain ID: ${investigation.blockchainInfo.chainId}`);
    console.log(`   Explorer: ${investigation.blockchainInfo.explorerUrl}`);
    
    console.log('\n🎉 Investigation completed successfully!');
    
  } catch (error) {
    console.error('❌ Investigation failed:', error);
  }
}

// Test with a different wallet if the first one fails
async function testAlternativeWallet() {
  const evmService = new EVMService();
  const testAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'; // Vitalik's wallet
  const chain = 'ethereum';
  
  console.log('\n🔄 Testing with alternative wallet...');
  console.log(`Address: ${testAddress}`);
  
  try {
    const investigation = await evmService.investigateWallet(testAddress, chain);
    console.log('✅ Alternative wallet investigation completed');
    console.log(`Wallet Type: ${investigation.walletOpinion.type}`);
    console.log(`Risk Score: ${investigation.walletOpinion.riskScore}/100`);
    console.log(`Total Value: $${investigation.walletOpinion.estimatedValue.toFixed(2)}`);
  } catch (error) {
    console.error('❌ Alternative wallet investigation also failed:', error);
  }
}

// Run the test
testWalletInvestigation()
  .then(() => testAlternativeWallet())
  .catch(console.error); 