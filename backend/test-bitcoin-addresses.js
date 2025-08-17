const axios = require('axios');

console.log('🧪 Testing Multiple Bitcoin Addresses...');

// Test addresses: the one provided and some known valid ones
const TEST_ADDRESSES = [
  'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda', // User provided
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Known valid bech32
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Satoshi's address (legacy)
  '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy' // P2SH address
];

const APIs = [
  {
    name: 'Mempool.space',
    url: 'https://mempool.space/api/address/{address}',
    test: async (address) => {
      try {
        const response = await axios.get(`https://mempool.space/api/address/${address}`, { timeout: 10000 });
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.message, status: error.response?.status };
      }
    }
  },
  {
    name: 'BlockCypher (no key)',
    url: 'https://api.blockcypher.com/v1/btc/main/addrs/{address}',
    test: async (address) => {
      try {
        const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`, { timeout: 10000 });
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.message, status: error.response?.status };
      }
    }
  },
  {
    name: 'Blockstream',
    url: 'https://blockstream.info/api/address/{address}',
    test: async (address) => {
      try {
        const response = await axios.get(`https://blockstream.info/api/address/${address}`, { timeout: 10000 });
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.message, status: error.response?.status };
      }
    }
  }
];

async function testAddresses() {
  for (const address of TEST_ADDRESSES) {
    console.log(`\n🔍 Testing address: ${address}`);
    console.log(`   Format: ${address.startsWith('bc1') ? 'Bech32 (modern)' : address.startsWith('3') ? 'P2SH' : 'Legacy'}`);
    
    for (const api of APIs) {
      console.log(`   Testing ${api.name}...`);
      const result = await api.test(address);
      
      if (result.success) {
        console.log(`   ✅ ${api.name} SUCCESS!`);
        if (result.data.chain_stats) {
          const stats = result.data.chain_stats;
          const balance = ((stats.funded_txo_sum - stats.spent_txo_sum) / Math.pow(10, 8)).toFixed(8);
          console.log(`      Balance: ${balance} BTC, Transactions: ${stats.tx_count}`);
        } else if (result.data.balance !== undefined) {
          const balance = (result.data.balance / Math.pow(10, 8)).toFixed(8);
          console.log(`      Balance: ${balance} BTC, Transactions: ${result.data.n_tx || 'N/A'}`);
        }
      } else {
        console.log(`   ❌ ${api.name} FAILED: ${result.error} (Status: ${result.status || 'N/A'})`);
      }
    }
  }
}

testAddresses().catch(console.error);
