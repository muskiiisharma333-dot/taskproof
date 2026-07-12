import type { Task, Proof, Transaction, EventLog, TestSuite, PipelineStage } from "../types";

// Helper to generate a random Stellar public key
export function generateStellarAddress(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "G";
  for (let i = 0; i < 55; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper to generate a random transaction/proof hash
export function generateHash(length = 20): string {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format address for visual display: e.g. GXXX...A8F2
export function truncateAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

// Format hash for visual display: e.g. 0x8f...2a1c
export function truncateHash(hash: string): string {
  if (hash.length < 10) return hash;
  return `${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}`;
}

// Initial Mock Tasks
export const initialTasks: Task[] = [
  {
    id: "TK-8492",
    description: "Q3 Marketing Campaign Proofs",
    tags: ["Design", "Code"],
    status: "Completed",
    progress: 75,
    owner: "Sarah",
    time: "2 mins ago",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: "TK-8491",
    description: "Smart Contract Audit Fixes",
    tags: ["Code"],
    status: "Processing",
    progress: 40,
    owner: "Mike",
    time: "15 mins ago",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "TK-8490",
    description: "Brand Guidelines Update",
    tags: ["Design"],
    status: "Completed",
    progress: 90,
    owner: "Alex",
    time: "1 hr ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: "TK-8489",
    description: "Stellar RPC Cluster Deployment",
    tags: ["DevOps", "Code"],
    status: "Pending",
    progress: 0,
    owner: "Sarah",
    time: "2 hrs ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "TK-8488",
    description: "Frontend Test Coverage Audit",
    tags: ["Testing"],
    status: "Failed",
    progress: 100,
    owner: "Mike",
    time: "3 hrs ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];

// Initial Mock Proofs
export const initialProofs: Proof[] = [
  {
    hash: "0x7a8b9cf1e2d3b4a5c6d7e8f90011223344556677",
    taskName: "Dataset Curation Alpha",
    timestamp: "2 mins ago",
    owner: "GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF",
    status: "Verified"
  },
  {
    hash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    taskName: "Smart Contract Audit",
    timestamp: "15 mins ago",
    owner: "GAK4M2P1LSJKDFHGURYTOWIEQP1029384756BVCX",
    status: "Pending"
  },
  {
    hash: "0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d",
    taskName: "Asset Generation V2",
    timestamp: "1 hr ago",
    owner: "GXZ9L5K8SJDHFGTRYEOWIQUP1029384756NBVCX",
    status: "Failed"
  },
  {
    hash: "0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    taskName: "Soroban API Integration",
    timestamp: "4 hrs ago",
    owner: "GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF",
    status: "Verified"
  },
  {
    hash: "0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
    taskName: "Telemetry Logging Service",
    timestamp: "1 day ago",
    owner: "GAK4M2P1LSJKDFHGURYTOWIEQP1029384756BVCX",
    status: "Verified"
  }
];

// Initial Mock Transactions
export const initialTransactions: Transaction[] = [
  {
    hash: "0x8f2a1cb3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    sourceAccount: "GABCD345XYZ1234567890ABCDEF1234567890XYZ",
    contractId: "C1234567890ABCDEF1234567890ABCDEF1234567",
    timestamp: "2 mins ago",
    status: "Confirmed"
  },
  {
    hash: "0x3b9d4f2a1cb3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
    sourceAccount: "GBX987654P21234567890ABCDEF1234567890XYZ",
    contractId: "C4567890ABCDEF1234567890ABCDEF1234567890",
    timestamp: "Just now",
    status: "Submitting"
  },
  {
    hash: "0x7c5e8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
    sourceAccount: "GCC123456LMN1234567890ABCDEF1234567890XYZ",
    contractId: "C7890123456ABCDEF1234567890ABCDEF1234567",
    timestamp: "15 secs ago",
    status: "Simulating"
  },
  {
    hash: "0x1a4b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    sourceAccount: "GDE654321QRS1234567890ABCDEF1234567890XYZ",
    contractId: "C0123456789ABCDEF1234567890ABCDEF1234567",
    timestamp: "5 mins ago",
    status: "Failed"
  },
  {
    hash: "0x9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e",
    sourceAccount: "GFG111222TUV1234567890ABCDEF1234567890XYZ",
    contractId: "C3456789012ABCDEF1234567890ABCDEF1234567",
    timestamp: "10 secs ago",
    status: "Pending"
  }
];

// Initial Mock Event Logs
export const initialEvents: EventLog[] = [
  {
    id: "evt-1",
    type: "TaskCreated",
    contract: "TP-Manager-v1",
    timestamp: "Just now",
    txHash: "0x7a3f5b8c9d2e1a4b6c8d7e9f0a1b3c5d6e7f8a9b",
    payload: JSON.stringify({ taskId: 492, worker: "Sarah", reward: "250 XLM" }),
    status: "Confirmed"
  },
  {
    id: "evt-2",
    type: "ProofStored",
    contract: "TP-Registry-v2",
    timestamp: "2 mins ago",
    txHash: "0x1e8d4f1a2b3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
    payload: JSON.stringify({ proofId: "pf-88", hash: "0x7a8b9c...f1e2", owner: "GCE3...KL9X" }),
    status: "Pending"
  },
  {
    id: "evt-3",
    type: "RegistryUpdated",
    contract: "TP-Registry-v2",
    timestamp: "15 mins ago",
    txHash: "0x9c2b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    payload: JSON.stringify({ rootHash: "0x2b3c...8f1e", totalProofs: 850 }),
    status: "Confirmed"
  },
  {
    id: "evt-4",
    type: "TaskCompleted",
    contract: "TP-Manager-v1",
    timestamp: "1 hr ago",
    txHash: "0x4f5a1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    payload: JSON.stringify({ taskId: 480, reward: "500 XLM", verifier: "TP-Verifier-v1" }),
    status: "Confirmed"
  },
  {
    id: "evt-5",
    type: "VerificationFailed",
    contract: "TP-Verifier-v1",
    timestamp: "3 hrs ago",
    txHash: "0x2a1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    payload: JSON.stringify({ taskId: 479, reason: "invalid_sig", proofHash: "0x9c...4d2a" }),
    status: "Failed"
  }
];

// Test Suites Status
export const testSuites: TestSuite[] = [
  {
    name: "Contract Tests",
    category: "Contract",
    total: 5,
    passed: 5,
    status: "Passing",
    duration: "45ms"
  },
  {
    name: "Frontend Tests",
    category: "Frontend",
    total: 4,
    passed: 4,
    status: "Passing",
    duration: "124ms"
  },
  {
    name: "Integration Tests",
    category: "Integration",
    total: 3,
    passed: 3,
    status: "Passing",
    duration: "348ms"
  }
];

// Deployment Pipeline Stages
export const pipelineStages: PipelineStage[] = [
  {
    name: "Git Push",
    status: "Done",
    logs: [
      "[INFO] Git push detected on branch 'main'",
      "[INFO] Commit hash: 0x9f8e7d6c5b4a3c2d1e",
      "[INFO] Triggered by: Stellar Dev <dev@taskproof.co>"
    ]
  },
  {
    name: "Build",
    status: "Success",
    logs: [
      "[INFO] Restoring npm cache...",
      "[INFO] Running typescript compilation check...",
      "[SUCCESS] tsc --noEmit completed with 0 errors",
      "[INFO] Compiling production build...",
      "[SUCCESS] Vite compile completed. Assets outputted: 1.2MB"
    ]
  },
  {
    name: "Contract Tests",
    status: "Success",
    logs: [
      "[INFO] Running cargo test for Soroban contracts...",
      "[INFO] Running task_contract tests... PASS",
      "[INFO] Running registry_contract tests... PASS",
      "[INFO] Running verifier_contract tests... PASS",
      "[SUCCESS] 5/5 test suites completed in 0.045 seconds"
    ]
  },
  {
    name: "Frontend Tests",
    status: "Success",
    logs: [
      "[INFO] Running Vitest test suites...",
      "[INFO] Running sidebar.test.tsx... PASS",
      "[INFO] Running table.test.tsx... PASS",
      "[SUCCESS] 4/4 test suites completed in 0.124 seconds"
    ]
  },
  {
    name: "Deploy Contract",
    status: "Success",
    logs: [
      "[INFO] Connecting to Stellar Mainnet RPC cluster...",
      "[INFO] Deploying WASM bytecode (contract_id: CBK9...3M9P)...",
      "[INFO] Invoking contract initialization script...",
      "[SUCCESS] Contract deployed and upgraded successfully."
    ]
  },
  {
    name: "Deploy Frontend",
    status: "Running",
    logs: [
      "[INFO] Preparing edge deployment to global CDN...",
      "[INFO] Uploading static assets (index.html, JS/CSS bundles)...",
      "[INFO] Purging CDN cache at edge locations...",
      "[RUNNING] Synchronizing databases..."
    ]
  },
  {
    name: "Production",
    status: "Pending",
    logs: [
      "[PENDING] Awaiting final canary validation..."
    ]
  }
];

// Helper functions to generate new log strings
export const testLogs = [
  "PASS  src/contracts/task.test.rs (0.012s) - create_task() returns task ID",
  "PASS  src/contracts/registry.test.rs (0.015s) - store_proof() increments records counter",
  "PASS  src/contracts/verifier.test.rs (0.018s) - verify_proof() returns true for valid signatures",
  "PASS  src/components/dashboard/Sidebar.test.tsx (0.034s) - highlights active route",
  "PASS  src/components/shared/Table.test.tsx (0.041s) - paginates rows correctly",
  "PASS  src/components/shared/Table.test.tsx (0.049s) - filters results dynamically",
  "PASS  src/hooks/useEventStream.test.ts (0.062s) - prepends simulated events in realtime",
  "PASS  src/routes/Router.test.tsx (0.071s) - handles deep paths on refresh"
];
