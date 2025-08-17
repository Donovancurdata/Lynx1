console.log('🔍 Comparing Bitcoin Addresses...');

const WORKING_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const USER_ADDRESS = 'bc1q2ygmnk2uqrrft28yl3h8qwrh2f2vanr0sdvhqey86hspxexda';

console.log(`Working address: ${WORKING_ADDRESS}`);
console.log(`Working length: ${WORKING_ADDRESS.length} characters`);
console.log(`Working format: ${WORKING_ADDRESS.startsWith('bc1') ? 'Bech32' : 'Other'}`);

console.log(`\nUser address: ${USER_ADDRESS}`);
console.log(`User length: ${USER_ADDRESS.length} characters`);
console.log(`User format: ${USER_ADDRESS.startsWith('bc1') ? 'Bech32' : 'Other'}`);

// Check for invalid characters
const validChars = /^[a-z0-9]+$/;
console.log(`\nWorking address valid chars: ${validChars.test(WORKING_ADDRESS)}`);
console.log(`User address valid chars: ${validChars.test(USER_ADDRESS)}`);

// Check for potential checksum issues
console.log('\n🔍 Analyzing potential issues...');

// Look for repeated patterns in the user address
const userEnd = USER_ADDRESS.substring(USER_ADDRESS.length - 15);
console.log(`User address last 15 chars: ${userEnd}`);

// Check if there are any obvious duplications
if (userEnd.includes('hspx') && userEnd.includes('ey86')) {
  console.log('⚠️  Potential duplication detected in end section');
  
  // Try to identify the correct end
  const possibleEnds = [
    'hspxexda',
    'ey86hspxexda',
    'hspxey86hspxexda'
  ];
  
  console.log('\n🔍 Possible correct endings:');
  possibleEnds.forEach((ending, index) => {
    const testAddress = USER_ADDRESS.substring(0, USER_ADDRESS.length - ending.length) + ending;
    console.log(`   Option ${index + 1}: ${testAddress} (length: ${testAddress.length})`);
  });
}

console.log('\n💡 The user address appears to have a format issue.');
console.log('   Please verify the correct Bitcoin address from your source.');
console.log('   The address should be a valid bech32 format starting with "bc1".');
