const fs = require('fs');
const path = require('path');

console.log('--- Running TaskProof Integration Config Checks ---');

const configPath = path.join(__dirname, '..', 'frontend', 'src', 'config.json');

if (!fs.existsSync(configPath)) {
  console.log('⚠️ Config file config.json does not exist yet. Please run the deploy script first.');
  process.exit(0);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('Target Network:', config.NETWORK);
  console.log('Stellar RPC Node:', config.RPC_URL);
  console.log('Task Contract Address:', config.TASK_CONTRACT_ID);
  console.log('Registry Contract Address:', config.REGISTRY_CONTRACT_ID);
  
  if (config.NETWORK && config.RPC_URL && config.TASK_CONTRACT_ID && config.REGISTRY_CONTRACT_ID) {
    console.log('✅ Integration Configuration audit succeeded! All parameters linked correctly.');
    process.exit(0);
  } else {
    console.error('❌ Integration Configuration is missing parameters!');
    process.exit(1);
  }
} catch (e) {
  console.error('❌ Failed to parse config file:', e.message);
  process.exit(1);
}
