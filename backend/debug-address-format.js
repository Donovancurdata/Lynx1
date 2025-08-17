console.log('🔍 Analyzing Bitcoin Address Format...');

const ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';

console.log(`Original address: ${ADDRESS}`);
console.log(`Length: ${ADDRESS.length} characters`);
console.log(`Starts with 'bc1': ${ADDRESS.startsWith('bc1')}`);

// Analyze the end section for duplication
const endSection = ADDRESS.substring(ADDRESS.length - 20);
console.log(`Last 20 characters: ${endSection}`);

// Check for repeated patterns
const patterns = ['hspx', 'ey86', 'hspxexda'];
patterns.forEach(pattern => {
  const count = (ADDRESS.match(new RegExp(pattern, 'g')) || []).length;
  console.log(`Pattern '${pattern}' appears ${count} times`);
});

// Try to identify the correct address
console.log('\n🔍 Attempting to fix the address...');

// Remove the duplicate section
const fixedAddress = ADDRESS.replace('hspxey86hspxexda', 'hspxexda');
console.log(`Fixed address: ${fixedAddress}`);
console.log(`Fixed length: ${fixedAddress.length} characters`);

// Check if the fixed address looks more reasonable
if (fixedAddress.length < ADDRESS.length) {
  console.log('✅ Address length reduced - duplicate section removed');
} else {
  console.log('❌ No duplicate section found');
}

console.log('\n💡 The issue appears to be a duplicate section in the address.');
console.log('   Please verify the correct Bitcoin address format.');
