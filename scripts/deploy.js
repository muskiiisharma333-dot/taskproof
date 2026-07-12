const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCmd(cmd, cwd, ignoreError = false) {
  console.log(`Executing: ${cmd}`);
  try {
    return execSync(cmd, { cwd, encoding: 'utf8' }).trim();
  } catch (error) {
    if (ignoreError) {
      console.log(`(Ignored) Command failed: ${cmd}`);
      return '';
    }
    console.error(`Command execution failed: ${cmd}\n`, error.stdout || error.message);
    process.exit(1);
  }
}

// Set CARGO_TARGET_DIR if not already provided to avoid rust-analyzer locks
if (!process.env.CARGO_TARGET_DIR) {
  process.env.CARGO_TARGET_DIR = "C:\\Users\\SPANDEY\\AppData\\Local\\Temp\\cargo_taskproof_target_wasm_22";
}

// Set RUSTFLAGS to ensure Wasm target compatibility on Rust 1.82+
process.env.RUSTFLAGS = "-C target-feature=-reference-types,-multi-value";

// 1. Build WASM contract targets
console.log('--- Step 1: Building smart contracts to optimized WASMs ---');
const contractsDir = path.join(__dirname, '..', 'contracts');
runCmd('stellar contract build', contractsDir);

// 2. Generate and fund deployer account
console.log('\n--- Step 2: Generating and funding deployer key on Testnet ---');
runCmd('stellar keys generate deployer --network testnet --fund', null, true);

const deployerAddress = runCmd('stellar keys address deployer');
console.log(`Deployer Public Key: ${deployerAddress}`);

// Define dynamic build targets based on the CARGO_TARGET_DIR env
const targetDir = process.env.CARGO_TARGET_DIR;
const registryWasmPath = path.join(targetDir, 'wasm32v1-none', 'release', 'registry_contract.wasm');
const taskWasmPath = path.join(targetDir, 'wasm32v1-none', 'release', 'task_contract.wasm');

// 3. Deploy Progress Registry Contract
console.log('\n--- Step 3: Deploying Progress Registry Contract ---');
const deployRegistryCmd = `stellar contract deploy --wasm "${registryWasmPath}" --source deployer --network testnet -- --admin "${deployerAddress}" --task_contract "${deployerAddress}"`;
const registryId = runCmd(deployRegistryCmd);
console.log(`Progress Registry Contract ID: ${registryId}`);

// 4. Deploy Task Contract
console.log('\n--- Step 4: Deploying Task Contract ---');
const deployTaskCmd = `stellar contract deploy --wasm "${taskWasmPath}" --source deployer --network testnet -- --registry "${registryId}"`;
const taskId = runCmd(deployTaskCmd);
console.log(`Task Contract ID: ${taskId}`);

// 5. Mutual linkage configuration
console.log('\n--- Step 5: Invoking Registry set_task_contract ---');
const linkCmd = `stellar contract invoke --id "${registryId}" --source deployer --network testnet -- set_task_contract --task_contract "${taskId}"`;
runCmd(linkCmd);
console.log('Circular address configuration link finalized on-chain.');

// 6. Export addresses to React client config
console.log('\n--- Step 6: Syncing deployment configuration to React client ---');
const configPath = path.join(__dirname, '..', 'frontend', 'src', 'config.json');
const configData = {
  NETWORK: 'testnet',
  RPC_URL: 'https://soroban-testnet.stellar.org',
  REGISTRY_CONTRACT_ID: registryId,
  TASK_CONTRACT_ID: taskId,
  DEPLOYER_ADDRESS: deployerAddress,
  DEPLOYED_AT: new Date().toISOString()
};

fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');
console.log(`Config written successfully to: ${configPath}`);
console.log('\n🎉 Stellar Level 3 Contract Deployment complete!');
