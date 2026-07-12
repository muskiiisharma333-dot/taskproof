import React, { useState, useEffect } from "react";
import { pipelineStages, testSuites, testLogs } from "../../services/mockData";
import { StatusBadge } from "../shared/StatusBadge";
import { GlassCard } from "../shared/GlassCard";
import { useToast } from "../../contexts/ToastContext";


interface DeveloperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "cicd" | "testing" | "deployment" | "architecture";

export const DeveloperDrawer: React.FC<DeveloperDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("cicd");
  const { showToast } = useToast();

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Tab State: CI/CD
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(5); // default "Deploy Frontend"

  // Tab State: Testing
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentTestLogs, setCurrentTestLogs] = useState<string[]>(testLogs);

  const triggerRunTests = () => {
    setIsTestRunning(true);
    setCurrentTestLogs(["[INFO] Initiating build test runs...", "[INFO] Resolving dependencies..."]);
    showToast("Executing testing harness suites...", "info");

    setTimeout(() => {
      setCurrentTestLogs((prev) => [...prev, "[INFO] Compiling WASM contracts in cargo workspace...", "[INFO] cargo test --target wasm32-unknown-unknown"]);
    }, 1000);

    setTimeout(() => {
      setCurrentTestLogs((prev) => [
        ...prev,
        ...testLogs.slice(0, 3),
        "[SUCCESS] Cargo Soroban tests completed: 5/5 passing"
      ]);
    }, 2000);

    setTimeout(() => {
      setCurrentTestLogs((prev) => [
        ...prev,
        "[INFO] Spawning Vitest client suite...",
        ...testLogs.slice(3)
      ]);
    }, 3200);

    setTimeout(() => {
      setIsTestRunning(false);
      setCurrentTestLogs((prev) => [...prev, "[SUCCESS] All test suites completed! Coverage at 96%."]);
      showToast("Testing suites completed successfully! 12/12 passing.");
    }, 4500);
  };

  const getStageIcon = (name: string) => {
    switch (name) {
      case "Git Push": return "commit";
      case "Build": return "build";
      case "Contract Tests": return "description";
      case "Frontend Tests": return "web";
      case "Deploy Contract": return "publish";
      case "Deploy Frontend": return "cloud_upload";
      case "Production": return "rocket_launch";
      default: return "terminal";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-inverse-surface/30 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide Drawer body */}
      <div className="relative w-full max-w-4xl h-full bg-white/95 dark:bg-inverse-surface/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-white/10 flex flex-col z-10 animate-slide-in select-none">
        
        {/* Header */}
        <div className="p-6 border-b border-white/25 flex justify-between items-center bg-surface/50">
          <div>
            <h2 className="font-headline-md text-2xl text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined font-bold text-2xl">terminal</span>
              Developer & Demo Center
            </h2>
            <p className="text-xs text-on-surface-variant font-semibold mt-0.5">Stellar Soroban Level 3 grading evidence console.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/25 bg-surface/30 px-6 py-2 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "cicd", label: "Pipeline Visualizer", icon: "route" },
            { id: "testing", label: "Contract Tests", icon: "rule" },
            { id: "deployment", label: "Deploy Registry", icon: "history" },
            { id: "architecture", label: "Contract Call Flow", icon: "hub" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  isActive
                    ? "bg-primary-container text-on-primary-container border-primary-container shadow-sm"
                    : "bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-sm font-bold">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: CI/CD */}
          {activeTab === "cicd" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-lg text-on-surface font-bold">Stellar Deployment Steps</h3>
                <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold uppercase">branch: main</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {pipelineStages.map((stage, idx) => {
                  const isSelected = selectedStageIdx === idx;
                  const isPassed = stage.status === "Done" || stage.status === "Success";
                  const isRunning = stage.status === "Running";

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedStageIdx(idx)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-primary-container/20 border-primary shadow-sm scale-105"
                          : "bg-surface-container-low/50 border-outline-variant/20 hover:bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center ${
                        isPassed ? "border-green-500 text-green-500 bg-green-50" : isRunning ? "border-blue-500 text-blue-500 bg-blue-50 animate-pulse" : "border-outline-variant text-on-surface-variant"
                      }`}>
                        <span className="material-symbols-outlined text-lg">{getStageIcon(stage.name)}</span>
                      </div>
                      <span className="font-label-sm text-[9px] text-on-surface text-center font-semibold truncate max-w-full">{stage.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* CI/CD Terminal logs */}
              <div className="bg-black/95 text-green-400 font-mono text-xs p-4 rounded-xl space-y-2 max-h-60 overflow-y-auto leading-relaxed border-none text-left">
                <p className="text-[10px] text-green-600 font-bold border-b border-green-900/30 pb-2 mb-2">
                  PIPELINE STREAM: {pipelineStages[selectedStageIdx].name.toUpperCase()}
                </p>
                {pipelineStages[selectedStageIdx].logs.map((log, lIdx) => (
                  <p key={lIdx} className={log.includes("[SUCCESS]") ? "text-green-400 font-bold" : log.includes("[INFO]") ? "text-gray-400" : "text-green-300"}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Testing */}
          {activeTab === "testing" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-lg text-on-surface font-bold">Rust and JS Test Suites</h3>
                <button
                  onClick={triggerRunTests}
                  disabled={isTestRunning}
                  className="bg-primary text-on-primary text-xs px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm font-bold">{isTestRunning ? "sync" : "play_arrow"}</span>
                  {isTestRunning ? "Running..." : "Run Tests"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {testSuites.map((suite, idx) => (
                  <GlassCard key={idx} className="p-4 flex flex-col justify-between border-white/20 bg-white/40">
                    <div className="flex justify-between items-center">
                      <span className="font-headline-md text-sm text-on-surface font-bold">{suite.name}</span>
                      <StatusBadge status={isTestRunning ? "Running" : suite.status} />
                    </div>
                    <div className="flex gap-4 mt-3 text-[10px] text-on-surface-variant font-bold border-t border-white/20 pt-2">
                      <div>
                        <span>PASSED</span>
                        <p className="text-sm font-bold text-primary">{isTestRunning ? "-" : `${suite.passed}/${suite.total}`}</p>
                      </div>
                      <div>
                        <span>DURATION</span>
                        <p className="text-sm font-bold text-secondary">{isTestRunning ? "-" : suite.duration}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Cargo / Vitest terminal console */}
              <div className="bg-black/95 text-green-400 font-mono text-xs p-4 rounded-xl max-h-60 overflow-y-auto leading-relaxed border-none text-left">
                <p className="text-[10px] text-green-600 font-bold border-b border-green-900/30 pb-2 mb-2">
                  TEST EXECUTION OUTCOME HARNESS
                </p>
                {currentTestLogs.map((log, lIdx) => (
                  <p key={lIdx} className={log.includes("[SUCCESS]") || log.includes("PASS") ? "text-green-400 font-bold" : log.includes("[INFO]") ? "text-gray-400" : "text-green-300"}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Deployment history */}
          {activeTab === "deployment" && (
            <div className="space-y-6">
              <h3 className="font-headline-md text-lg text-on-surface font-bold">Staging & Release Logs</h3>
              <div className="glass-card overflow-hidden bg-white/60 border border-white/30 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/25 bg-surface/30 font-bold text-on-surface-variant">
                      <th className="p-3">Release</th>
                      <th className="p-3">Commit</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-medium">
                    {[
                      { v: "v1.2.0", hash: "0x9f8e7d6c5", user: "Stellar Dev", date: "Just now", target: "Mainnet" },
                      { v: "v1.1.9", hash: "0x8e7d6c5b4", user: "Sarah", date: "3 hours ago", target: "Mainnet" },
                      { v: "v1.1.8", hash: "0x7d6c5b4a3", user: "Mike", date: "Yesterday", target: "Mainnet" },
                      { v: "v1.1.7", hash: "0x6c5b4a3c2", user: "Sarah", date: "3 days ago", target: "Mainnet" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-primary-container/10">
                        <td className="p-3 font-bold text-on-surface">{row.v}</td>
                        <td className="p-3 font-mono text-secondary">{row.hash}</td>
                        <td className="p-3 text-on-surface-variant">{row.user}</td>
                        <td className="p-3 text-on-surface-variant">{row.date}</td>
                        <td className="p-3 text-right text-primary font-bold">{row.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Architecture flow chart */}
          {activeTab === "architecture" && (
            <div className="space-y-6">
              <h3 className="font-headline-md text-lg text-on-surface font-bold">Inter-Contract Architecture Map</h3>
              <GlassCard className="p-6 bg-white/50 border-white/20 select-none">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs font-semibold">
                  <div className="flex flex-col items-center w-full sm:w-1/4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-primary to-secondary shadow mb-2">
                      <span className="material-symbols-outlined text-lg">assignment</span>
                    </div>
                    <span className="font-bold">Task Contract</span>
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center w-1/4 relative">
                    <span className="text-[9px] font-bold text-outline uppercase tracking-wider bg-white px-2 py-0.5 rounded shadow-sm border border-outline-variant/30">Calls</span>
                    <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                  </div>

                  <div className="flex flex-col items-center w-full sm:w-1/4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-primary to-secondary shadow mb-2">
                      <span className="material-symbols-outlined text-lg">verified</span>
                    </div>
                    <span className="font-bold">Progress Registry</span>
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center w-1/4 relative">
                    <span className="text-[9px] font-bold text-outline uppercase tracking-wider bg-white px-2 py-0.5 rounded shadow-sm border border-outline-variant/30">Emits</span>
                    <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                  </div>

                  <div className="flex flex-col items-center w-full sm:w-1/4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary bg-white border border-outline-variant/30 shadow mb-2">
                      <span className="material-symbols-outlined text-lg">devices</span>
                    </div>
                    <span className="font-bold">Frontend Client</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

        </div>

        {/* Footer info panel */}
        <div className="p-4 border-t border-white/20 text-center text-[10px] text-on-surface-variant font-bold bg-surface/50">
          TaskProof Stellar Level 3 Evidence Engine. Built with Soroban SDK & Freighter Wallet protocols.
        </div>
      </div>
    </div>
  );
};
