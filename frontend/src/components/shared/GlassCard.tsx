import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-card-padding flex flex-col relative overflow-hidden transition-all duration-300 ${
        onClick ? "cursor-pointer hover:scale-[1.01] active:scale-[0.99]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
