import React, { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { TopNavbar } from "../components/shared/TopNavbar";
import { Sidebar } from "../components/shared/Sidebar";
import { MobileNavbar } from "../components/shared/MobileNavbar";
import { ShaderBackground } from "../components/shared/ShaderBackground";
import { ErrorBoundary } from "../components/shared/ErrorState";
import { LoadingPage } from "../components/shared/LoadingSkeleton";
import { useSidebar } from "../contexts/SidebarContext";
import { useWallet } from "../hooks/useWallet";

export const DashboardLayout: React.FC = () => {
  const { isConnected, address, isRestoring, isWrongNetwork } = useWallet();
  const { isCollapsed, isOpen, setIsOpen } = useSidebar();

  // Guard routing flow: Wait for restoring session checks
  if (isRestoring) {
    return <LoadingPage />;
  }

  // Guard routing flow: boot unauthenticated users back to landing page
  if (!isConnected || !address) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen relative overflow-x-hidden">
      {/* Background Shader animation */}
      <ShaderBackground />

      {/* Top Header Navigation */}
      <TopNavbar />

      {/* Wrong Network Warning Banner */}
      {isWrongNetwork && (
        <div className="fixed top-[72px] left-0 right-0 z-45 bg-error-container/95 text-on-error-container backdrop-blur-md px-6 py-2 text-center text-xs font-bold shadow flex items-center justify-center gap-2 select-none border-b border-error/20 transition-all duration-300">
          <span className="material-symbols-outlined text-sm text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <span>Please switch to Stellar Testnet in your Freighter wallet extension to enable smart contract actions.</span>
        </div>
      )}

      {/* Side drawer overlay for mobile screens */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-45"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div
        className={`lg:block fixed top-[72px] bottom-0 z-48 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <Sidebar />
      </div>

      {/* Main Content Canvas Container */}
      <div
        className={`transition-all duration-300 min-h-screen pt-[72px] pb-24 lg:pb-8 flex flex-col ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        } ${isWrongNetwork ? "pt-[108px]" : ""}`}
      >
        <main className="flex-1 p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
          <ErrorBoundary>
            <Suspense fallback={<LoadingPage />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileNavbar />
    </div>
  );
};
export default DashboardLayout;
