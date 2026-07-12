import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";
import { useWallet } from "../../hooks/useWallet";
import { truncateAddress } from "../../services/mockData";

export const Sidebar: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const { isConnected, address, balance, connectWallet } = useWallet();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/tasks", label: "Tasks", icon: "assignment" },
    { path: "/proof-registry", label: "Proof Registry", icon: "verified" },
    { path: "/activity", label: "Activity", icon: "stream" },
    { path: "/analytics", label: "Analytics", icon: "analytics" },
    { path: "/settings", label: "Settings", icon: "settings" },
  ];

  const handleWalletClick = () => {
    if (!isConnected) {
      connectWallet();
    }
  };

  return (
    <aside
      className={`hidden lg:flex flex-col h-full py-8 px-4 bg-surface/60 dark:bg-inverse-surface/60 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-sm transition-all duration-300 fixed left-0 top-[72px] bottom-0 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Wallet Status Area */}
      {!isCollapsed && (
        <div className="mb-8 px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant/30 shadow-sm overflow-hidden select-none">
              {isConnected ? (
                <img
                  alt="Wallet Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd-a_zoIKCYN4ON9rObtRS4jXg4piM4NIjB3TFJ302zEU2H5gjByKoldhcP49pEpcoB_m5eNJm-HdfXfDEQ-x0DOT26FXxDV4P04YM5-FBZN5mrJiNiQIFeKI5zSKrWy7P4_aYoR-s_Yf80A6BwB7O5pXmDI883NI6fm4Qo5Z9uMN_FbCZ6qkwPOyHnTN4D6mCi8oK1w804zhHfOeyaw7kKQqVt3Gm44VidWqojxu4tUIVMZrnyl-iGEAPgZ-9VtxVbl0TqNiLP-aM"
                />
              ) : (
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              )}
            </div>
            <div>
              <div className="font-headline-md text-sm text-primary dark:text-primary-fixed-dim select-none font-bold">
                {isConnected ? "Stellar Dev" : "Disconnected"}
              </div>
              <div className="font-label-sm text-[11px] text-on-surface-variant select-none">
                {isConnected ? "Mainnet Active" : "No Wallet Linked"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 no-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-200 ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="font-label-sm text-label-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Connect Wallet Button */}
      <div className="mt-auto pt-4">
        {isConnected ? (
          !isCollapsed ? (
            <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 flex flex-col gap-1 select-none">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Connected Wallet</span>
              <span className="font-mono text-xs text-secondary truncate font-semibold">{truncateAddress(address || "")}</span>
              <span className="text-xs text-primary font-bold mt-0.5">{balance} XLM</span>
            </div>
          ) : (
            <button
              onClick={handleWalletClick}
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-md mx-auto"
              title="Wallet Connected"
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </button>
          )
        ) : (
          <button
            onClick={handleWalletClick}
            className={`w-full bg-primary text-on-primary font-label-sm text-label-sm rounded-full shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 ${
              isCollapsed ? "py-3 px-0 rounded-full" : "py-3 px-4"
            }`}
          >
            <span className="material-symbols-outlined select-none">account_balance_wallet</span>
            {!isCollapsed && <span>Connect Wallet</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
