import React, { createContext, useContext, useState, useEffect } from "react";
import type { EventLog, Proof, Transaction } from "../types";
import { 
  initialEvents, 
  initialProofs, 
  initialTransactions, 
  generateHash, 
  generateStellarAddress 
} from "../services/mockData";
import { useWallet } from "../hooks/useWallet";
import { WalletService } from "../services/wallet/walletService";
import contractConfig from "../config.json";

interface EventContextType {
  events: EventLog[];
  proofs: Proof[];
  transactions: Transaction[];
  addManualProof: (taskName: string, owner: string, customTxHash?: string, customProofHash?: string) => void;
  clearAll: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { executionMode } = useWallet();
  const [events, setEvents] = useState<EventLog[]>(initialEvents);
  const [proofs, setProofs] = useState<Proof[]>(initialProofs);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // List of possible mock events to generate
  const eventTemplates = [
    {
      type: "TaskCreated" as const,
      contract: "TP-Manager-v1",
      payloadGen: () => ({
        taskId: Math.floor(Math.random() * 1000) + 5000,
        worker: ["Mike", "Alex", "Sarah", "Stellar Dev"][Math.floor(Math.random() * 4)],
        reward: `${(Math.floor(Math.random() * 10) + 1) * 100} XLM`
      })
    },
    {
      type: "ProofStored" as const,
      contract: "TP-Registry-v2",
      payloadGen: () => ({
        proofId: `pf-${Math.floor(Math.random() * 900) + 100}`,
        hash: generateHash(10),
        owner: truncateMiddle(generateStellarAddress())
      })
    },
    {
      type: "RegistryUpdated" as const,
      contract: "TP-Registry-v2",
      payloadGen: () => ({
        rootHash: generateHash(12),
        totalProofs: Math.floor(Math.random() * 2000) + 1000
      })
    },
    {
      type: "TaskCompleted" as const,
      contract: "TP-Manager-v1",
      payloadGen: () => ({
        taskId: Math.floor(Math.random() * 1000) + 8000,
        reward: `${(Math.floor(Math.random() * 5) + 1) * 100} XLM`,
        verifier: "TP-Verifier-v1"
      })
    },
    {
      type: "VerificationFailed" as const,
      contract: "TP-Verifier-v1",
      payloadGen: () => ({
        taskId: Math.floor(Math.random() * 1000) + 8000,
        reason: ["invalid_signature", "checksum_mismatch", "timeout"][Math.floor(Math.random() * 3)],
        proofHash: generateHash(10)
      })
    }
  ];

  function truncateMiddle(str: string): string {
    if (str.length < 12) return str;
    return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
  }

  // Effect to run live simulation OR pull real testnet logs from RPC getEvents
  useEffect(() => {
    if (executionMode !== "testnet") {
      const interval = setInterval(() => {
        // Pick a random event template
        const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const payload = template.payloadGen();
        const txHash = generateHash(20);
        const newEventId = `evt-${Date.now()}`;

        const newEvent: EventLog = {
          id: newEventId,
          type: template.type,
          contract: template.contract,
          timestamp: "Just now",
          txHash: txHash,
          payload: JSON.stringify(payload),
          status: Math.random() > 0.08 ? "Confirmed" : "Failed"
        };

        // 1. Update events (updating previous timestamps to relatives)
        setEvents((prev) => {
          const updatedPrev = prev.map((evt, idx) => {
            if (evt.timestamp === "Just now") return { ...evt, timestamp: "1 min ago" };
            if (evt.timestamp === "1 min ago") return { ...evt, timestamp: `${idx + 1} mins ago` };
            return evt;
          });
          return [newEvent, ...updatedPrev.slice(0, 19)]; // limit to 20 events
        });

        // 2. Add corresponding transactions
        const newTx: Transaction = {
          hash: txHash,
          sourceAccount: generateStellarAddress(),
          contractId: `C${generateHash(16).slice(2).toUpperCase()}`,
          timestamp: "Just now",
          status: newEvent.status === "Confirmed" ? "Confirmed" : "Failed"
        };

        setTransactions((prev) => {
          const updatedPrev = prev.map((tx) => {
            if (tx.timestamp === "Just now") return { ...tx, timestamp: "1 min ago" };
            if (tx.timestamp === "15 secs ago") return { ...tx, timestamp: "30 secs ago" };
            return tx;
          });
          return [newTx, ...updatedPrev.slice(0, 19)];
        });

        // 3. If it's a ProofStored event, insert a mock proof into the registry table
        if (template.type === "ProofStored") {

          const newProof: Proof = {
            hash: generateHash(20),
            taskName: [
              "Smart Contract Integration", 
              "Data Pipeline Curation", 
              "Stellar Anchor Sync", 
              "WASM Upgrades", 
              "Canary Validation"
            ][Math.floor(Math.random() * 5)],
            timestamp: "Just now",
            owner: generateStellarAddress(),
            status: newEvent.status === "Confirmed" ? "Verified" : "Failed"
          };

          setProofs((prev) => {
            const updatedPrev = prev.map((pf) => {
              if (pf.timestamp === "Just now") return { ...pf, timestamp: "1 min ago" };
              return pf;
            });
            return [newProof, ...updatedPrev.slice(0, 19)];
          });
        }
      }, 6000); // Trigger every 6 seconds

      return () => clearInterval(interval);
    }

    // Testnet Mode: Poll live events from RPC server
    const pollEvents = async () => {
      try {
        const liveEvents = await WalletService.pollContractEvents(2000); // query recent ledgers
        if (liveEvents && liveEvents.length > 0) {
          setEvents((prev) => {
            const existingIds = new Set(prev.map(e => e.id));
            const newLogs: EventLog[] = [];
            const newTxs: Transaction[] = [];
            const newProofs: Proof[] = [];

            for (const le of liveEvents) {
              if (!existingIds.has(le.id)) {
                let payloadObj: any = {};
                let taskName = `Task #${le.taskId}`;

                if (le.type === "task_created") {
                  payloadObj = { taskId: le.taskId, worker: "Stellar Dev", owner: le.value };
                } else if (le.type === "task_completed") {
                  payloadObj = { taskId: le.taskId, hash: le.value };
                  newProofs.push({
                    hash: le.value,
                    taskName,
                    timestamp: le.time,
                    owner: "Stellar Dev",
                    status: "Verified"
                  });
                } else if (le.type === "task_updated") {
                  payloadObj = { taskId: le.taskId, progress: `${le.value}%` };
                }

                newLogs.push({
                  id: le.id,
                  type: le.type === "task_created" ? "TaskCreated" : le.type === "task_completed" ? "ProofStored" : "RegistryUpdated",
                  contract: "TP-Manager-v1",
                  timestamp: le.time,
                  txHash: le.txHash,
                  payload: JSON.stringify(payloadObj),
                  status: "Confirmed"
                });

                newTxs.push({
                  hash: le.txHash,
                  sourceAccount: "Stellar Dev",
                  contractId: contractConfig.TASK_CONTRACT_ID,
                  timestamp: le.time,
                  status: "Confirmed"
                });
              }
            }

            if (newLogs.length === 0) return prev;

            setTransactions((prevTx) => {
              const existingHashes = new Set(prevTx.map(t => t.hash));
              const filteredNewTxs = newTxs.filter(t => !existingHashes.has(t.hash));
              return [...filteredNewTxs, ...prevTx].slice(0, 19);
            });

            if (newProofs.length > 0) {
              setProofs((prevProofs) => {
                const existingHashes = new Set(prevProofs.map(p => p.hash));
                const filteredNewProofs = newProofs.filter(p => !existingHashes.has(p.hash));
                return [...filteredNewProofs, ...prevProofs].slice(0, 19);
              });
            }

            return [...newLogs, ...prev].slice(0, 19);
          });
        }
      } catch (err) {
        console.error("RPC event poll cycle error:", err);
      }
    };

    pollEvents();
    const pollInterval = setInterval(pollEvents, 6000);
    return () => clearInterval(pollInterval);
  }, [executionMode]);

  // Method to manually add a proof (e.g. from create task/verify flow)
  const addManualProof = (taskName: string, owner: string, customTxHash?: string, customProofHash?: string) => {
    const txHash = customTxHash || generateHash(20);
    const proofHash = customProofHash || generateHash(20);

    const newProof: Proof = {
      hash: proofHash,
      taskName,
      timestamp: "Just now",
      owner: owner || "GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF",
      status: "Pending"
    };

    const newTx: Transaction = {
      hash: txHash,
      sourceAccount: owner || "GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF",
      contractId: "C1234567890ABCDEF1234567890ABCDEF1234567",
      timestamp: "Just now",
      status: "Submitting"
    };

    const newEvent: EventLog = {
      id: `evt-${Date.now()}`,
      type: "ProofStored",
      contract: "TP-Registry-v2",
      timestamp: "Just now",
      txHash,
      payload: JSON.stringify({ proofId: `pf-${Math.floor(Math.random() * 900) + 100}`, hash: proofHash.slice(0, 10), owner: truncateMiddle(owner) }),
      status: "Pending"
    };

    setProofs((prev) => [newProof, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);
    setEvents((prev) => [newEvent, ...prev]);

    // Automatically confirm manual transaction simulation after 5 seconds if not a real testnet tx
    if (!customTxHash) {
      setTimeout(() => {
        setTransactions((prev) =>
          prev.map((t) => (t.hash === txHash ? { ...t, status: "Confirmed" } : t))
        );
        setEvents((prev) =>
          prev.map((e) => (e.txHash === txHash ? { ...e, status: "Confirmed" } : e))
        );
        setProofs((prev) =>
          prev.map((p) => (p.hash === proofHash ? { ...p, status: "Verified" } : p))
        );
      }, 5000);
    } else {
      // For real testnet transaction, confirm it immediately!
      setTransactions((prev) =>
        prev.map((t) => (t.hash === txHash ? { ...t, status: "Confirmed" } : t))
      );
      setEvents((prev) =>
        prev.map((e) => (e.txHash === txHash ? { ...e, status: "Confirmed" } : e))
      );
      setProofs((prev) =>
        prev.map((p) => (p.hash === proofHash ? { ...p, status: "Verified" } : p))
      );
    }
  };

  const clearAll = () => {
    setEvents([]);
    setProofs([]);
    setTransactions([]);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        proofs,
        transactions,
        addManualProof,
        clearAll
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
