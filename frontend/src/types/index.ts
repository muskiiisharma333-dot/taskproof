export interface Task {
  id: string; // e.g., "TK-8492"
  description: string;
  tags: string[]; // e.g., ["Design", "Code"]
  status: "Completed" | "Processing" | "Pending" | "Failed";
  progress: number; // 0 to 100
  owner: string; // e.g., "Sarah" or wallet address
  time: string; // relative time, e.g., "2 mins ago"
  timestamp: string; // absolute timestamp
}

export interface Proof {
  hash: string;
  taskName: string;
  timestamp: string;
  owner: string;
  status: "Verified" | "Pending" | "Failed";
}

export interface Transaction {
  hash: string;
  sourceAccount: string;
  contractId: string;
  timestamp: string;
  status: "Confirmed" | "Submitting" | "Simulating" | "Failed" | "Pending";
}

export interface EventLog {
  id: string;
  type: "TaskCreated" | "ProofStored" | "RegistryUpdated" | "TaskCompleted" | "VerificationFailed";
  contract: string;
  timestamp: string;
  txHash: string;
  payload: string; // JSON string
  status: "Confirmed" | "Pending" | "Failed";
}

export interface PipelineStage {
  name: string;
  status: "Done" | "Success" | "Running" | "Pending" | "Failed" | "Queued" | "Cancelled";
  logs: string[];
}

export interface TestSuite {
  name: string;
  category: "Contract" | "Frontend" | "Integration";
  total: number;
  passed: number;
  status: "Passing" | "Failed" | "Running";
  duration: string; // e.g., "45ms"
}
