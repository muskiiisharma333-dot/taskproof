import React, { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useTasks } from "../contexts/TaskContext";
import { useEvents } from "../contexts/EventContext";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "../contexts/ToastContext";
import { StatusBadge } from "../components/shared/StatusBadge";
import { GlassCard } from "../components/shared/GlassCard";
import { Modal } from "../components/shared/Modal";
import { WalletService } from "../services/wallet/walletService";

const TasksPage: React.FC = () => {
  const { tasks, addTask, updateProgress, updateStatus, deleteTask } = useTasks();
  const { addManualProof } = useEvents();
  const { address, isWrongNetwork, executionMode } = useWallet();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("Code");
  const [filter, setFilter] = useState<string>("All");

  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    if (isWrongNetwork) {
      showToast("Please switch to Stellar Testnet to enable smart contract actions.", "error");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast("Please enter a description", "error");
      return;
    }

    const nextIdNum = tasks.length > 0 
      ? Math.max(...tasks.map(t => parseInt(t.id.split("-")[1] || "0"))) + 1 
      : 8493;

    if (executionMode === "testnet") {
      if (!address) {
        showToast("Please connect your wallet first", "error");
        return;
      }
      try {
        setTxHash(null);
        setTxStatus("Initializing task deployment...");
        
        const args = [
          StellarSdk.nativeToScVal(nextIdNum, { type: "u32" }),
          StellarSdk.nativeToScVal(description, { type: "string" }),
          StellarSdk.xdr.ScVal.scvVec([StellarSdk.nativeToScVal(tagInput, { type: "symbol" })]),
          StellarSdk.Address.fromString(address).toScVal()
        ];

        const hash = await WalletService.invokeContractMethod(
          address,
          "create_task",
          args,
          (progress) => setTxStatus(progress)
        );

        setTxHash(hash);
        setTxStatus(`Success! Hash: ${hash.slice(0, 8)}...`);
        addTask(description, [tagInput]);
        showToast("Task created successfully on Stellar Testnet!");
        setDescription("");
        setIsModalOpen(false);
        
        // Clear transaction overlay after 4 seconds
        setTimeout(() => setTxStatus(null), 4000);
      } catch (err: any) {
        setTxStatus("Failed");
        showToast(`Contract execution failed: ${err.message || err}`, "error");
      }
    } else {
      // Simulation mode
      addTask(description, [tagInput]);
      showToast(`Task created!`);
      setDescription("");
      setIsModalOpen(false);
    }
  };

  const handleProgressChange = async (id: string, value: number, taskDesc: string) => {
    const numericId = parseInt(id.split("-")[1] || "0");
    if (value === 100) {
      if (executionMode === "testnet") {
        if (!address) {
          showToast("Please connect your wallet first", "error");
          return;
        }
        try {
          setTxHash(null);
          setTxStatus("Initializing task verification...");
          
          const rawHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
          const hashBytes = new Uint8Array(rawHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
          
          const args = [
            StellarSdk.nativeToScVal(numericId, { type: "u32" }),
            StellarSdk.xdr.ScVal.scvBytes(hashBytes)
          ];

          const hash = await WalletService.invokeContractMethod(
            address,
            "complete_task",
            args,
            (progress) => setTxStatus(progress)
          );

          setTxHash(hash);
          setTxStatus(`Success! Hash: ${hash.slice(0, 8)}...`);
          updateProgress(id, value);
          updateStatus(id, "Completed");
          addManualProof(taskDesc, address, hash, rawHex);
          showToast("Task verified and stored on-chain!");
          
          // Clear transaction overlay after 4 seconds
          setTimeout(() => setTxStatus(null), 4000);
        } catch (err: any) {
          setTxStatus("Failed");
          showToast(`Verification failed: ${err.message || err}`, "error");
        }
      } else {
        // Simulation mode
        updateProgress(id, value);
        showToast(`Task completed! Initiating Stellar contract verification...`, "info");
        updateStatus(id, "Pending"); // set to pending verification
        addManualProof(taskDesc, address || "GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF");

        // Auto transition task to completed after simulated blockchain time
        setTimeout(() => {
          updateStatus(id, "Completed");
          showToast(`Soroban Contract: Task verified and stored on-chain!`);
        }, 4000);
      }
    } else {
      updateProgress(id, value);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-3xl text-primary font-bold">Tasks</h1>
          <p className="font-body-md text-on-surface-variant">Update task progress and emit cryptographic proofs to Soroban contracts.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className={`font-label-sm text-label-sm px-6 py-2.5 rounded-full transition-all shadow-md flex items-center gap-2 font-bold select-none ${
            isWrongNetwork
              ? "bg-slate-400 dark:bg-slate-700 text-on-surface-variant cursor-not-allowed opacity-50"
              : "bg-primary text-on-primary hover:opacity-90 active:scale-95"
          }`}
        >
          <span className="material-symbols-outlined font-bold select-none">add_task</span>
          Create Task
        </button>
      </div>

      {txStatus && (
        <GlassCard className="p-4 bg-primary-container/20 border border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-3 select-none">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <span className="font-body-md text-xs font-bold text-on-primary-container">
              Stellar Transaction: {txStatus}
            </span>
          </div>
          {txHash && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
            >
              Hash: {txHash.slice(0, 12)}... <span className="material-symbols-outlined text-[13px] font-bold">open_in_new</span>
            </a>
          )}
        </GlassCard>
      )}

      {/* Interactive Process Stepper Map */}
      <GlassCard className="p-6 bg-white/40 dark:bg-inverse-surface/40 border border-white/20 select-none">
        <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-4">Task Verification Protocol</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {[
            { step: "01", title: "Create Task", desc: "Define description and tagging" },
            { step: "02", title: "Complete Work", desc: "Slide progress up to 100%" },
            { step: "03", title: "Freighter Sign", desc: "Authorize contract execution" },
            { step: "04", title: "Verified Ledger", desc: "Block hash written on-chain" }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start relative z-10">
              <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center border border-white">
                {item.step}
              </span>
              <div>
                <h4 className="font-headline-md text-xs text-on-surface font-bold">{item.title}</h4>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 select-none">
        {["All", "Pending", "Processing", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full font-label-sm text-xs border transition-colors font-semibold ${
              filter === status
                ? "bg-primary-container text-on-primary-container border-primary-container"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <GlassCard key={task.id} className="p-6 flex flex-col justify-between gap-4 h-[210px] bg-white/70 dark:bg-inverse-surface/75">
              <div className="flex justify-between items-start gap-4">
                <div className="truncate">
                  <span className="font-mono text-xs text-secondary font-bold uppercase">{task.id}</span>
                  <h3 className="font-headline-md text-sm text-on-surface font-bold mt-0.5 leading-snug truncate" title={task.description}>
                    {task.description}
                  </h3>
                </div>
                <StatusBadge status={task.status} />
              </div>

              {/* Tags */}
              <div className="flex gap-2 select-none">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-[9px] font-bold border border-outline-variant bg-surface-container-low text-on-surface-variant uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5 mt-2">
                <div className="flex justify-between text-xs text-on-surface-variant font-bold">
                  <span>Progress Slider</span>
                  <span>{task.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  disabled={task.status === "Completed" || task.status === "Pending" || isWrongNetwork}
                  onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value), task.description)}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-white/20 text-xs">
                <span className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  {task.time}
                </span>
                {task.status !== "Completed" && task.status !== "Pending" && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-error hover:text-red-700 transition-colors font-bold font-label-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-2 text-center py-20 bg-white/30 rounded-card border border-white/20 select-none">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 select-none">playlist_remove</span>
            <p className="font-decorative-callout text-2xl text-tertiary">No tasks match this filter</p>
            <p className="text-on-surface-variant text-sm mt-1">Create a new workflow above to get started.</p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Task Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none"
              placeholder="Deploy multi-signature contract..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Category Tag
            </label>
            <div className="flex gap-2">
              {["Code", "Design", "Testing", "DevOps"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTagInput(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    tagInput === t
                      ? "bg-secondary-container text-on-secondary-container border-secondary-container"
                      : "bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/20 select-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="glass-card bg-transparent border border-outline-variant px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all shadow-md font-bold"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksPage;
