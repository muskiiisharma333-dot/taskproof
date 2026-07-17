const { execSync } = require('child_process');
const config = require('../frontend/src/config.json');

function runCmd(cmd) {
  console.log(`Executing: ${cmd}`);
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Command failed: ${cmd}\n`, error.stdout || error.message);
    process.exit(1);
  }
}

const taskId = config.TASK_CONTRACT_ID;
const deployer = config.DEPLOYER_ADDRESS;

console.log('--- Step 1: Invoking create_task ---');
// Escape double quotes as \" for shell compatibility
const createCmd = `stellar contract invoke --id "${taskId}" --source deployer --network testnet -- create_task --id 1 --description "Verify deployment evidence" --tags "[\\"Code\\"]" --owner "${deployer}"`;
const createTx = runCmd(createCmd);
console.log(`Create Task Tx Hash/Result: ${createTx}\n`);

console.log('--- Step 2: Invoking update_progress ---');
const updateCmd = `stellar contract invoke --id "${taskId}" --source deployer --network testnet -- update_progress --id 1 --progress 50`;
const updateTx = runCmd(updateCmd);
console.log(`Update Progress Tx Hash/Result: ${updateTx}\n`);

console.log('--- Step 3: Invoking complete_task ---');
const proofHash = "0707070707070707070707070707070707070707070707070707070707070707";
const completeCmd = `stellar contract invoke --id "${taskId}" --source deployer --network testnet -- complete_task --id 1 --hash "${proofHash}"`;
const completeTx = runCmd(completeCmd);
console.log(`Complete Task Tx Hash/Result: ${completeTx}\n`);

console.log('Done!');
