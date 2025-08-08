import { Agent1WIA } from './src/Agent1WIA';
import { WalletInvestigationRequest } from './src/types';

/**
 * Example usage of Agent 1 WIA
 * This demonstrates how to use the wallet investigation agent
 */
async function exampleUsage() {
  try {
    console.log('🚀 Starting Agent 1 WIA Example...\n');
    
    // Initialize Agent 1
    const agent1 = new Agent1WIA();
    
    // Get agent information
    const agentInfo = agent1.getAgentInfo();
    console.log('📋 Agent Information:');
    console.log(`  Agent ID: ${agentInfo.agentId}`);
    console.log(`  Version: ${agentInfo.version}`);
    console.log(`  Capabilities: ${agentInfo.capabilities.join(', ')}`);
    console.log(`  Supported Blockchains: ${agentInfo.supportedBlockchains.join(', ')}\n`);
    
    // Test blockchain detection
    console.log('🔍 Testing Blockchain Detection...');
    const testAddresses = [
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Ethereum
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Bitcoin
      '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' // Solana
    ];
    
    for (const address of testAddresses) {
      try {
        const detection = await agent1.detectBlockchain(address);
        console.log(`  ${address}: ${detection.blockchain} (confidence: ${detection.confidence})`);
      } catch (error) {
        console.log(`  ${address}: Detection failed`);
      }
    }
    console.log('');
    
    // Test comprehensive wallet investigation
    console.log('🔬 Testing Comprehensive Wallet Investigation...');
    const investigationRequest: WalletInvestigationRequest = {
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      blockchain: 'ethereum',
      includeTokenTransfers: true,
      includeInternalTransactions: true,
      maxTransactions: 50,
      priority: 'medium'
    };
    
    console.log('  Investigating wallet...');
    const result = await agent1.investigateWallet(investigationRequest);
    
    if (result.success && result.data) {
      const data = result.data;
      console.log('  ✅ Investigation completed successfully!');
      console.log(`  📍 Wallet Address: ${data.walletAddress}`);
      console.log(`  ⛓️  Blockchain: ${data.blockchain}`);
      console.log(`  💰 Balance: ${data.balance.balance} ($${data.balance.usdValue})`);
      console.log(`  📊 Transactions: ${data.transactions.length}`);
      console.log(`  🏷️  Wallet Type: ${data.walletOpinion.walletType}`);
      console.log(`  ⚠️  Risk Level: ${data.riskAssessment.riskLevel}`);
      console.log(`  📈 Activity Level: ${data.walletOpinion.activityLevel}`);
      console.log(`  🎯 Confidence: ${data.walletOpinion.confidence}`);
      console.log('');
      
      // Show some transaction analysis
      const analysis = data.transactionAnalysis;
      console.log('  📈 Transaction Analysis:');
      console.log(`    Total Transactions: ${analysis.totalTransactions}`);
      console.log(`    Average Value: $${analysis.valueDistribution.averageValue}`);
      console.log(`    Unique Counterparties: ${analysis.counterpartyAnalysis.uniqueAddresses}`);
      console.log(`    Risk Score: ${analysis.riskPatterns.riskScore}`);
      console.log('');
      
      // Show fund flows
      console.log('  💸 Fund Flows:');
      console.log(`    Total Flows: ${data.fundFlows.length}`);
      const incomingFlows = data.fundFlows.filter(f => f.flowType === 'incoming').length;
      const outgoingFlows = data.fundFlows.filter(f => f.flowType === 'outgoing').length;
      console.log(`    Incoming: ${incomingFlows}, Outgoing: ${outgoingFlows}`);
      console.log('');
      
    } else {
      console.log('  ❌ Investigation failed:');
      console.log(`    Error: ${result.error?.message}`);
      console.log(`    Code: ${result.error?.code}`);
    }
    
    // Test multi-chain balance check
    console.log('🌐 Testing Multi-Chain Balance Check...');
    const multiChainBalance = await agent1.getMultiChainBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    console.log('  Multi-chain balance results:');
    for (const [blockchain, balance] of Object.entries(multiChainBalance)) {
      console.log(`    ${blockchain}: ${balance.balance} ($${balance.usdValue})`);
    }
    console.log('');
    
    // Test service health
    console.log('🏥 Testing Service Health...');
    const health = await agent1.getServiceHealth();
    console.log('  Service health status:');
    for (const [service, isHealthy] of Object.entries(health)) {
      const status = isHealthy ? '✅' : '❌';
      console.log(`    ${status} ${service}`);
    }
    console.log('');
    
    console.log('🎉 Agent 1 WIA Example completed successfully!');
    
  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Export for use in other modules
export { exampleUsage };

// Run example if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  exampleUsage().catch(console.error);
} 