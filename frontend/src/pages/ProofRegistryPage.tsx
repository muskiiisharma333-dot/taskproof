import React, { useState } from "react";
import { useEvents } from "../contexts/EventContext";
import { useToast } from "../contexts/ToastContext";
import { Table } from "../components/shared/Table";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Modal } from "../components/shared/Modal";
import { truncateAddress, truncateHash } from "../services/mockData";
import { GlassCard } from "../components/shared/GlassCard";

const ProofRegistryPage: React.FC = () => {
  const { proofs } = useEvents();
  const { showToast } = useToast();

  const [selectedProof, setSelectedProof] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Hash copied to clipboard!");
  };

  const handleVerify = (row: any) => {
    showToast(`Soroban Contract: Verifying signature and Merkle root...`, "info");
    setTimeout(() => {
      showToast(`Verification success! Root validated for block.`);
      setSelectedProof(row);
    }, 1200);
  };

  const columns = [
    {
      key: "taskName",
      header: "Task Workspace Name",
      sortable: true,
      render: (val: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-secondary-container/30 text-on-secondary-container flex items-center justify-center select-none border border-white">
            <span className="material-symbols-outlined text-sm font-bold">assignment</span>
          </div>
          <span className="font-bold text-on-background text-sm">{val}</span>
        </div>
      ),
    },
    {
      key: "hash",
      header: "Registry Hash",
      sortable: true,
      render: (val: any) => (
        <code 
          onClick={() => copyToClipboard(val)}
          className="font-mono text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
          title="Copy full cryptographic hash"
        >
          {truncateHash(val)}
        </code>
      ),
    },
    {
      key: "owner",
      header: "Task Owner",
      sortable: true,
      render: (val: any) => (
        <div className="flex items-center gap-2 text-xs font-semibold select-none">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-sm"></div>
          <span className="font-mono text-on-surface-variant">{truncateAddress(val)}</span>
        </div>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (val: any) => <span className="text-on-surface-variant text-xs font-bold">{val}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (val: any) => <StatusBadge status={val} />,
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-1 select-none">
          <button
            onClick={() => handleVerify(row)}
            className="px-3 py-1 rounded bg-primary text-on-primary font-label-sm text-xs hover:opacity-90 active:scale-95 transition-all font-semibold"
          >
            Verify
          </button>
        </div>
      ),
    },
  ];

  // Filtering logic
  const filteredData = proofs.filter((row) => {
    if (filter === "All") return true;
    return row.status === filter;
  });

  // Mobile Cards Render
  const renderMobileCard = (row: any) => (
    <GlassCard 
      onClick={() => setSelectedProof(row)}
      className="p-4 flex flex-col gap-3 border border-white/20 bg-white/40"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-on-surface-variant font-bold">{row.timestamp}</span>
          <h4 className="font-body-md text-sm text-on-background font-bold mt-0.5">{row.taskName}</h4>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <div className="flex justify-between items-center text-[11px] border-t border-white/10 pt-2">
        <code className="font-mono text-secondary">{truncateHash(row.hash)}</code>
        <button
          onClick={(e) => { e.stopPropagation(); handleVerify(row); }}
          className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-bold"
        >
          Verify
        </button>
      </div>
    </GlassCard>
  );

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-3xl text-primary font-bold">Proof Explorer</h2>
          <p className="text-on-surface-variant font-body-md">
            Verify and audit cryptographic proofs registered on-chain.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 select-none bg-white/40 dark:bg-inverse-surface/30 p-1.5 rounded-xl border border-white/20">
          {["All", "Verified", "Pending"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-1 rounded-lg font-label-sm text-xs transition-colors font-bold ${
                filter === st
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Table */}
      <div className="glass-card overflow-hidden bg-white/70 dark:bg-inverse-surface/75 border border-white/40">
        <Table
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search hash, task, or owner..."
          searchFields={["taskName", "hash", "owner"]}
          initialRowsPerPage={5}
          mobileCardRender={renderMobileCard}
        />
      </div>

      {/* Proof Verification Detail Modal */}
      {selectedProof && (
        <Modal
          isOpen={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          title="Stellar verification proof"
        >
          <div className="space-y-4">
            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 font-mono text-xs text-on-surface-variant space-y-1">
              <span className="font-bold font-label-sm uppercase text-[10px]">Stellar Ledger Status</span>
              <p className="text-secondary font-bold">Block Finalized</p>
            </div>
            
            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 space-y-1 text-xs">
              <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px]">Task Name</span>
              <p className="font-semibold text-on-surface text-sm">{selectedProof.taskName}</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 space-y-1 text-xs break-all">
              <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px]">Proof Hash</span>
              <p className="font-mono text-primary font-semibold text-xs">{selectedProof.hash}</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 space-y-1 text-xs break-all">
              <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px]">Owner Public Key</span>
              <p className="font-mono text-on-surface text-xs">{selectedProof.owner}</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-0.5">Verification status</span>
                <StatusBadge status={selectedProof.status} />
              </div>
              <div>
                <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] block mb-0.5 text-right">Timestamp</span>
                <span className="font-semibold text-on-surface">{selectedProof.timestamp}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProofRegistryPage;
