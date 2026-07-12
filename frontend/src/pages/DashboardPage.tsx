import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { useTasks } from "../contexts/TaskContext";
import { useEvents } from "../contexts/EventContext";
import { useToast } from "../contexts/ToastContext";
import { truncateAddress } from "../services/mockData";
import { GlassCard } from "../components/shared/GlassCard";
import { ContractStatus } from "../components/dashboard/ContractStatus";
import { DeveloperDrawer } from "../components/dashboard/DeveloperDrawer";

const DashboardPage: React.FC = () => {
  const { isConnected, address, balance, connectWallet, disconnectWallet, executionMode } = useWallet();
  const { tasks, addTask } = useTasks();
  const { events, proofs } = useEvents();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [taskDescription, setTaskDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("Code");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter tasks to show top 3 active workflows (progress < 100)
  const activeWorkflows = tasks.filter((t) => t.status === "Processing" || t.status === "Pending").slice(0, 3);

  // Get top 3 logs for activity feed
  const activityLogs = events.slice(0, 3);

  // Get latest verified proof
  const latestProof = proofs.find(p => p.status === "Verified") || proofs[0];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) {
      showToast("Please enter a task description", "error");
      return;
    }
    addTask(taskDescription, [selectedTag]);
    showToast(`Task created!`);
    setTaskDescription("");
  };

  return (
    <div className="space-y-gutter relative">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="font-decorative-callout text-decorative-callout text-tertiary select-none">Welcome back</h1>
          <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Dashboard</h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-sm text-xs px-5 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md font-bold flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">terminal</span>
            Dev / Demo Drawer
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        {/* Left Column (8 cols) */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-gutter">
          {/* Quick Creator & Contract row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {/* Create Task Card */}
            <GlassCard className="p-6 flex flex-col justify-between group h-full">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary-container/30 rounded-full blur-2xl group-hover:bg-primary-container/50 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline-md text-lg text-on-surface font-bold">New Task</h3>
                <button 
                  onClick={handleCreateTask}
                  className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined font-bold select-none text-lg">add</span>
                </button>
              </div>
              <div className="space-y-3 z-10">
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 font-body-md text-xs text-on-surface placeholder-on-surface-variant/40 focus:ring-0"
                  placeholder="Task description..."
                />
                <div className="flex gap-2">
                  {["Design", "Code"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-lg font-label-sm text-[11px] border transition-colors font-bold ${
                        selectedTag === tag
                          ? "bg-secondary-container text-on-secondary-container border-secondary-container"
                          : "bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Contract Status Widget */}
            <ContractStatus />
          </div>

          {/* Active Workflows Progress Cards */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-decorative-callout text-2xl text-tertiary select-none">Active Workflows</h3>
              <button 
                onClick={() => navigate("/tasks")}
                className="text-primary hover:underline font-label-sm text-xs font-bold"
              >
                View all tasks
              </button>
            </div>
            <div className="space-y-5">
              {activeWorkflows.length > 0 ? (
                activeWorkflows.map((task) => (
                  <div key={task.id} className="group cursor-pointer" onClick={() => navigate("/tasks")}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-body-md text-sm text-on-surface font-semibold hover:text-primary transition-colors">
                        {task.description}
                      </span>
                      <span className="font-label-sm text-xs text-primary font-bold">{task.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden border border-white/50 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#cdb4db] to-[#a8cbe8] rounded-full transition-all duration-500 relative"
                        style={{ width: `${task.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-on-surface-variant font-label-sm text-xs font-bold">
                  No active workflows. Create one to begin.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar Column (4 cols) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-gutter">
          
          {/* Wallet Status Card */}
          <GlassCard className="p-6 justify-between h-auto">
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-secondary-container/30 rounded-full blur-2xl"></div>
            <div>
              <div className="flex items-center gap-2 mb-2 select-none">
                <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-secondary shadow-[0_0_8px_rgba(64,98,123,0.6)] animate-pulse" : "bg-outline"}`}></div>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <h3 className="font-headline-md text-lg text-on-surface truncate font-bold">
                {isConnected ? truncateAddress(address || "") : "Not Connected"}
              </h3>
            </div>
            <div className="mt-4 select-none">
              <p className="font-label-sm text-[10px] text-on-surface-variant mb-0.5">Stellar Balance</p>
              {isConnected ? (
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-lg text-2xl text-primary font-bold">{balance}</span>
                  <span className="font-body-md text-xs text-secondary font-bold">XLM</span>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all shadow"
                >
                  Connect Wallet
                </button>
              )}
              {isConnected && (
                <div className="mt-3 flex justify-between items-center select-none pt-3 border-t border-white/20">
                  <span className="text-[10px] font-bold text-on-surface-variant">
                    Network: <code className="font-mono text-secondary">{executionMode === "testnet" ? "stellar:testnet" : "local:simulation"}</code>
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="text-[10px] text-error hover:text-red-700 transition-colors font-bold flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-xs font-bold">logout</span>
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Latest Verification Block */}
          {latestProof && (
            <GlassCard className="p-6 bg-surface-container-lowest/80 border border-white/40 shadow-sm justify-between">
              <div className="flex items-center gap-2 mb-4 select-none">
                <span className="material-symbols-outlined text-secondary text-xl font-bold select-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                  verified
                </span>
                <h3 className="font-headline-md text-base text-on-surface font-bold">Latest Verification</h3>
              </div>
              <div className="bg-surface-container px-4 py-3.5 rounded-xl border border-outline-variant/30 font-mono text-[11px] text-on-surface-variant break-all leading-relaxed shadow-inner">
                <p className="font-bold text-primary mb-1 truncate">{latestProof.taskName}</p>
                <p className="text-[10px]">Hash: {latestProof.hash.substring(0, 16)}...</p>
                <p className="text-[10px] mt-0.5">Owner: {truncateAddress(latestProof.owner)}</p>
              </div>
              <button 
                onClick={() => navigate("/proof-registry")}
                className="mt-4 w-full py-2.5 rounded-lg border border-primary-container text-primary hover:bg-primary-container/20 active:scale-95 transition-all font-label-sm text-xs font-bold select-none"
              >
                Explorer Registry
              </button>
            </GlassCard>
          )}

          {/* Preview Activity Feed */}
          <GlassCard className="p-6 flex-grow select-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-decorative-callout text-2xl text-tertiary">Live Activity</h3>
              <button 
                onClick={() => navigate("/activity")}
                className="text-primary hover:underline font-label-sm text-xs font-bold"
              >
                View timeline
              </button>
            </div>
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-secondary-fixed-dim before:to-transparent">
              {activityLogs.map((log) => {
                let text = `Event: ${log.type}`;
                if (log.type === "TaskCreated") {
                  const p = JSON.parse(log.payload);
                  text = `Task logged by ${p.worker || "Stellar Dev"}.`;
                } else if (log.type === "ProofStored") {
                  text = `Proof hash written for ledger sync.`;
                } else if (log.type === "RegistryUpdated") {
                  text = `Global Merkle root synchronized.`;
                } else if (log.type === "TaskCompleted") {
                  text = `Verification completed successfully.`;
                } else if (log.type === "VerificationFailed") {
                  text = `Verification signature failure logged.`;
                }

                return (
                  <div key={log.id} className="relative group transition-all duration-200">
                    <div className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full bg-secondary-fixed-dim border-2 border-white shadow-sm z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-label-sm text-xs text-on-surface font-semibold">{text}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {log.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Slide Drawer component */}
      <DeveloperDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default DashboardPage;
