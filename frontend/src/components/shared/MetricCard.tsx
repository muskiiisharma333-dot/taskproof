import React from "react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: string;
  colorTheme?: "primary" | "secondary" | "tertiary" | "purple";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  colorTheme = "primary",
}) => {
  let iconBgClass = "bg-primary-container text-on-primary-container";
  if (colorTheme === "secondary") {
    iconBgClass = "bg-secondary-container text-on-secondary-container";
  } else if (colorTheme === "tertiary") {
    iconBgClass = "bg-tertiary-container text-on-tertiary-container";
  } else if (colorTheme === "purple") {
    iconBgClass = "bg-primary-fixed text-on-primary-fixed";
  }

  const isUp = changeType === "up";
  const isDown = changeType === "down";

  return (
    <GlassCard className="flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgClass}`}>
          <span className="material-symbols-outlined select-none" style={{ fontSize: "18px" }}>
            {icon}
          </span>
        </div>
      </div>
      <div>
        <div className="font-display-brand text-display-brand text-on-surface truncate">
          {value}
        </div>
        {change && (
          <div className="font-label-sm text-label-sm text-secondary mt-1 flex items-center gap-1 font-semibold">
            {isUp && (
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "14px" }}>
                trending_up
              </span>
            )}
            {isDown && (
              <span className="material-symbols-outlined text-error" style={{ fontSize: "14px" }}>
                trending_down
              </span>
            )}
            {!isUp && !isDown && (
              <span className="material-symbols-outlined text-outline" style={{ fontSize: "14px" }}>
                drag_handle
              </span>
            )}
            <span className={isDown ? "text-error" : isUp ? "text-secondary" : "text-on-surface-variant"}>
              {change}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
