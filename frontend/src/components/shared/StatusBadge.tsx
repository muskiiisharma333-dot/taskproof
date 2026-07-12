import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.trim().toLowerCase();

  let bgClass = "bg-surface-variant text-on-surface-variant";
  let dotClass = "bg-outline";
  let isPulsing = false;

  if (
    normalized === "verified" ||
    normalized === "completed" ||
    normalized === "done" ||
    normalized === "success" ||
    normalized === "confirmed" ||
    normalized === "passing" ||
    normalized === "active" ||
    normalized === "live"
  ) {
    // Green / Teal / Sky
    if (normalized === "verified" || normalized === "confirmed" || normalized === "active") {
      bgClass = "bg-secondary-container/50 text-on-secondary-container";
      dotClass = "bg-secondary";
    } else if (normalized === "live") {
      bgClass = "bg-error-container text-error";
      dotClass = "bg-error";
      isPulsing = true;
    } else {
      bgClass = "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300";
      dotClass = "bg-green-500";
    }
  } else if (
    normalized === "pending" ||
    normalized === "processing" ||
    normalized === "running" ||
    normalized === "queued" ||
    normalized === "simulating" ||
    normalized === "submitting"
  ) {
    // Orange / Yellow / Lavender / Blue
    if (normalized === "pending" || normalized === "submitting") {
      bgClass = "bg-primary-container/50 text-on-primary-container";
      dotClass = "bg-primary";
    } else if (normalized === "processing" || normalized === "running") {
      bgClass = "bg-secondary-container/40 text-on-secondary-container";
      dotClass = "bg-secondary";
    } else {
      bgClass = "bg-surface-variant text-on-surface-variant";
      dotClass = "bg-outline";
    }
    isPulsing = true;
  } else if (normalized === "failed" || normalized === "error") {
    // Red / Coral
    bgClass = "bg-error-container/50 text-on-error-container";
    dotClass = "bg-error";
  } else if (normalized === "cancelled") {
    // Gray
    bgClass = "bg-surface-container-high/60 text-on-surface-variant";
    dotClass = "bg-outline";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] w-max font-semibold select-none ${bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass} ${isPulsing ? "animate-pulse" : ""}`}></span>
      {status}
    </span>
  );
};
