import React from "react";
import { useToast } from "../../contexts/ToastContext";
import contractConfig from "../../config.json";

export const ContractStatus: React.FC = () => {
  const { showToast } = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contractConfig.TASK_CONTRACT_ID);
    showToast("Soroban Task Contract address copied!");
  };

  const truncatedAddress = contractConfig.TASK_CONTRACT_ID 
    ? `${contractConfig.TASK_CONTRACT_ID.slice(0, 6)}...${contractConfig.TASK_CONTRACT_ID.slice(-4)}`
    : "Not Deployed";

  return (
    <div className="bg-surface-container-low/60 rounded-xl p-4 border border-white/40 flex flex-col gap-3 text-xs select-none">
      <div className="flex justify-between items-center">
        <span className="font-bold font-label-sm text-on-surface-variant uppercase text-[10px] tracking-wider">Soroban Node Link</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-bold font-label-sm text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant font-semibold">Task Contract:</span>
          <div className="flex items-center gap-1.5">
            <code className="font-mono text-on-surface font-bold bg-white/50 px-1.5 py-0.5 rounded border border-white/60">{truncatedAddress}</code>
            <button 
              onClick={handleCopyAddress}
              className="text-primary hover:opacity-80 transition-opacity"
              title="Copy Contract Address"
            >
              <span className="material-symbols-outlined text-[14px] font-bold">content_copy</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-on-surface-variant font-semibold">Network:</span>
          <span className="font-bold text-on-surface font-label-sm">stellar:{contractConfig.NETWORK}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-on-surface-variant font-semibold">Health:</span>
          <span className="font-bold text-secondary font-label-sm">100% Operational</span>
        </div>
      </div>

      <div className="border-t border-white/20 pt-2 flex justify-end">
        <a 
          href={`https://stellar.expert/explorer/${contractConfig.NETWORK}/contract/${contractConfig.TASK_CONTRACT_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1 font-bold font-label-sm text-[11px]"
        >
          View Explorer <span className="material-symbols-outlined text-[13px] font-bold">open_in_new</span>
        </a>
      </div>
    </div>
  );
};
export default ContractStatus;
