import React, { useEffect, useRef } from "react";
import { GlassCard } from "./GlassCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Lock page scroll
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 dark:bg-black/60 backdrop-blur-md animate-fade-in transition-opacity duration-300"
    >
      <div className="w-full max-w-lg transition-transform duration-300 transform scale-100">
        <GlassCard className="p-6 bg-white/80 dark:bg-inverse-surface/80 border border-white/40 shadow-bloom flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/20 pb-3">
            <h3 className="font-headline-md text-xl text-primary font-bold">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
              aria-label="Close Modal"
            >
              <span className="material-symbols-outlined select-none text-xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto pr-1 no-scrollbar text-on-surface">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 pt-3 border-t border-white/20">
              {footer}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
