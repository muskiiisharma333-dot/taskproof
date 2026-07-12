import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container floating element */}
      <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full select-none pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  let bgClass = "bg-white/95 dark:bg-inverse-surface/95 border-secondary-container text-secondary";
  let icon = "info";

  if (toast.type === "success") {
    bgClass = "bg-white/95 dark:bg-inverse-surface/95 border-green-200 text-green-600";
    icon = "check_circle";
  } else if (toast.type === "error") {
    bgClass = "bg-white/95 dark:bg-inverse-surface/95 border-error-container text-error";
    icon = "error";
  }

  return (
    <div
      onClick={onClose}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg backdrop-blur-md animate-slide-in cursor-pointer hover:opacity-90 ${bgClass}`}
      style={{
        animation: "slide-in 0.3s ease forwards"
      }}
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] select-none">{icon}</span>
        <span className="font-label-sm text-sm text-on-surface font-semibold">{toast.message}</span>
      </div>
      <button className="text-on-surface-variant/50 hover:text-on-surface ml-4" aria-label="Dismiss Alert">
        <span className="material-symbols-outlined text-[16px] select-none">close</span>
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
