import React, { useState } from "react";
import { useEvents } from "../contexts/EventContext";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Modal } from "../components/shared/Modal";
import { GlassCard } from "../components/shared/GlassCard";
import { truncateHash } from "../services/mockData";
import { useToast } from "../contexts/ToastContext";

const ActivityPage: React.FC = () => {
  const { events } = useEvents();
  const { showToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // Convert contract events to human readable steps
  const getTimelineContent = (evt: any) => {
    const payload = JSON.parse(evt.payload || "{}");
    switch (evt.type) {
      case "TaskCreated":
        return {
          title: "Task Logged",
          desc: `New workspace task "${payload.worker || "Design Alpha"}" logged on contract manager.`,
          icon: "assignment_add",
          color: "text-primary bg-primary-container/20"
        };
      case "ProofStored":
        return {
          title: "Proof Submitted",
          desc: `Cryptographic verification proof written to registry storage by Freighter wallet.`,
          icon: "verified",
          color: "text-secondary bg-secondary-container/20"
        };
      case "RegistryUpdated":
        return {
          title: "Global Anchor Updated",
          desc: `Stellar Ledger synchronised. Merkle root hash anchoring state compiled.`,
          icon: "hub",
          color: "text-tertiary bg-tertiary-container/20"
        };
      case "TaskCompleted":
        return {
          title: "Verification Completed",
          desc: `WASM contract validation check succeeded. Reward unlocked to task owner.`,
          icon: "task_alt",
          color: "text-green-600 bg-green-500/10"
        };
      case "VerificationFailed":
        return {
          title: "Verification Failed",
          desc: `Validator rejected signature. Verification checksum mismatch recorded.`,
          icon: "warning",
          color: "text-error bg-error-container/20"
        };
      default:
        return {
          title: "Transaction Settled",
          desc: `Ledger execution sequence settled successfully on Stellar node.`,
          icon: "sync_alt",
          color: "text-on-surface-variant bg-surface-container/20"
        };
    }
  };

  return (
    <div className="space-y-gutter select-none">
      {/* Header */}
      <header className="mb-8">
        <h2 className="font-headline-lg text-3xl text-primary font-bold flex items-center gap-3">
          Activity Timeline
          <span className="flex items-center gap-1 bg-error-container text-error font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> LIVE
          </span>
        </h2>
        <p className="font-body-md text-on-surface-variant">Clean, unified history of verified tasks, transactions, and contract state changes.</p>
      </header>

      {/* Timeline Section */}
      <GlassCard className="p-8 bg-white/70 dark:bg-inverse-surface/70 border border-white/40">
        <div className="relative border-l border-white/40 dark:border-white/10 pl-6 ml-4 space-y-8">
          {events.length > 0 ? (
            events.map((evt) => {
              const content = getTimelineContent(evt);
              return (
                <div key={evt.id} className="relative group transition-all duration-300">
                  {/* Timeline bullet Icon */}
                  <div className={`absolute -left-[45px] top-1.5 w-9 h-9 rounded-full border-2 border-white dark:border-inverse-surface flex items-center justify-center shadow z-10 group-hover:scale-105 transition-transform ${content.color}`}>
                    <span className="material-symbols-outlined text-[18px] font-bold select-none">{content.icon}</span>
                  </div>

                  {/* Log Detail Card */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/40 group-hover:bg-white/40 border border-white/30 dark:border-white/10 p-4 rounded-xl transition-all shadow-sm">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-md text-sm text-on-surface font-bold">
                          {content.title}
                        </h4>
                        <span className="text-[10px] text-on-surface-variant font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {content.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end select-none">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(evt.txHash, "Tx Hash")}
                          className="px-2.5 py-1 rounded bg-white/60 hover:bg-white border border-white/40 font-mono text-[10px] text-secondary transition-all"
                          title="Copy Transaction Hash"
                        >
                          {truncateHash(evt.txHash)}
                        </button>
                        <button
                          onClick={() => setSelectedItem(evt)}
                          className="px-3 py-1 rounded bg-primary text-on-primary font-label-sm text-xs hover:opacity-90 active:scale-95 transition-all font-semibold"
                        >
                          Inspect
                        </button>
                      </div>
                      <StatusBadge status={evt.status} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-on-surface-variant font-decorative-callout text-2xl select-none">
              No transactions recorded yet
            </div>
          )}
        </div>
      </GlassCard>

      {/* Inspect Event Payload Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Inspect ledger event details"
        >
          <div className="space-y-4">
            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 text-xs">
              <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-1">Source Contract</span>
              <p className="font-mono text-secondary text-sm font-bold">{selectedItem.contract}</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 text-xs break-all">
              <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-1">Transaction Hash</span>
              <p className="font-mono text-primary font-semibold">{selectedItem.txHash}</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 text-xs">
              <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-1">Execution Payload</span>
              <pre className="font-mono bg-black/5 dark:bg-black/30 p-3 rounded-lg text-[11px] overflow-x-auto text-on-surface leading-normal text-left whitespace-pre">
                {JSON.stringify(JSON.parse(selectedItem.payload), null, 2)}
              </pre>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-0.5">Confirmation Status</span>
                <StatusBadge status={selectedItem.status} />
              </div>
              <div>
                <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-0.5 text-right">Inclusion Time</span>
                <span className="font-semibold text-on-surface">{selectedItem.timestamp}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActivityPage;
