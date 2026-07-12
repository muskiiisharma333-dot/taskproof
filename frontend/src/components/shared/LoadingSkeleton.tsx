import React from "react";
import { GlassCard } from "./GlassCard";

export const CardSkeleton: React.FC = () => (
  <GlassCard className="animate-pulse bg-white/40 dark:bg-inverse-surface/30">
    <div className="h-6 w-1/3 bg-surface-container-high rounded mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-surface-container-high rounded"></div>
      <div className="h-4 bg-surface-container-high rounded w-5/6"></div>
      <div className="h-4 bg-surface-container-high rounded w-2/3"></div>
    </div>
  </GlassCard>
);

export const TableSkeleton: React.FC = () => (
  <div className="animate-pulse w-full bg-white/40 dark:bg-inverse-surface/30 rounded-2xl overflow-hidden border border-white/20 p-6 space-y-4">
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 bg-surface-container-high rounded w-48"></div>
      <div className="h-8 bg-surface-container-high rounded w-24"></div>
    </div>
    <div className="space-y-3">
      <div className="h-6 bg-surface-container-high rounded"></div>
      <div className="h-6 bg-surface-container-high rounded"></div>
      <div className="h-6 bg-surface-container-high rounded"></div>
      <div className="h-6 bg-surface-container-high rounded"></div>
      <div className="h-6 bg-surface-container-high rounded"></div>
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <GlassCard className="animate-pulse bg-white/40 dark:bg-inverse-surface/30 h-80 flex flex-col justify-between">
    <div className="h-6 bg-surface-container-high rounded w-1/3 mb-6"></div>
    <div className="flex-1 flex items-end gap-3 px-4">
      <div className="w-full bg-surface-container-high rounded-t h-1/3"></div>
      <div className="w-full bg-surface-container-high rounded-t h-2/3"></div>
      <div className="w-full bg-surface-container-high rounded-t h-1/2"></div>
      <div className="w-full bg-surface-container-high rounded-t h-4/5"></div>
      <div className="w-full bg-surface-container-high rounded-t h-2/5"></div>
    </div>
  </GlassCard>
);

export const PipelineSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-surface-container-high rounded w-1/4"></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
      {Array.from({ length: 7 }).map((_, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-surface-container-high"></div>
          <div className="h-3 bg-surface-container-high rounded w-12"></div>
        </div>
      ))}
    </div>
  </div>
);
export const LoadingPage: React.FC = () => (
  <div className="space-y-gutter">
    <div className="flex justify-between items-end mb-8 animate-pulse">
      <div>
        <div className="h-4 bg-surface-container-high rounded w-24 mb-2"></div>
        <div className="h-8 bg-surface-container-high rounded w-48"></div>
      </div>
      <div className="h-10 bg-surface-container-high rounded w-32 hidden sm:block"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <div className="col-span-1 md:col-span-8 space-y-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
      <div className="col-span-1 md:col-span-4 space-y-gutter">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  </div>
);
export default LoadingPage;
