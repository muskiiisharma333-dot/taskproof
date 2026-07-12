import React from "react";
import { GlassCard } from "./GlassCard";

interface ErrorStateProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  resetErrorBoundary,
  message = "An unexpected error occurred in this view.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] w-full max-w-2xl mx-auto">
      <GlassCard className="p-8 border-error-container/50 bg-white/80 dark:bg-inverse-surface/80 flex flex-col items-center gap-6 shadow-lg select-none">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center text-error">
          <span className="material-symbols-outlined text-3xl select-none">warning</span>
        </div>

        <div>
          <h2 className="font-headline-md text-2xl text-primary font-bold mb-2">Something went wrong</h2>
          <p className="font-body-md text-on-surface-variant max-w-md">
            {message}
          </p>
        </div>

        {error && (
          <div className="w-full text-left bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/30 overflow-x-auto text-xs font-mono text-error max-h-40 max-w-full">
            <details className="cursor-pointer">
              <summary className="font-semibold text-on-surface font-label-sm">View Diagnostic Stacktrace</summary>
              <pre className="mt-2 text-left whitespace-pre">{error.stack || error.message}</pre>
            </details>
          </div>
        )}

        <div className="flex gap-4">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md font-semibold"
            >
              Retry Connection / Render
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="glass-card bg-transparent border border-outline-variant text-on-surface font-label-sm text-label-sm px-6 py-2.5 rounded-full hover:bg-surface-container transition-all"
          >
            Reload Page
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  resetBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 w-full">
          <ErrorState error={this.state.error} resetErrorBoundary={this.resetBoundary} />
        </div>
      );
    }

    return this.props.children;
  }
}
