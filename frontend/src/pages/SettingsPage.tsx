import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "../contexts/ToastContext";
import { GlassCard } from "../components/shared/GlassCard";

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isConnected, address, balance, disconnectWallet, connectWallet, executionMode, setExecutionMode } = useWallet();
  const { showToast } = useToast();

  // Profile Form State
  const [profileName, setProfileName] = useState("Stellar Developer");
  const [profileEmail, setProfileEmail] = useState("developer@stellar.org");

  // Notifications State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Settings updated successfully!");
  };

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <header className="mb-6 select-none">
        <h1 className="font-headline-lg text-3xl text-primary font-bold">Settings</h1>
        <p className="font-body-md text-on-surface-variant">Manage profile, connected wallets, notifications, and network targets.</p>
      </header>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Left Column */}
        <div className="space-y-gutter">
          
          {/* Profile Card */}
          <GlassCard className="p-6">
            <h3 className="font-headline-md text-base text-on-surface font-bold mb-4 select-none">Profile Settings</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-body-md text-on-surface font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-body-md text-on-surface font-semibold focus:outline-none"
                />
              </div>
            </div>
          </GlassCard>

          {/* Wallet Settings Card */}
          <GlassCard className="p-6">
            <h3 className="font-headline-md text-base text-on-surface font-bold mb-4 select-none">Wallet Connections</h3>
            <div className="space-y-4">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="p-3 bg-surface-container-low rounded-lg border border-white/40 text-xs break-all">
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Connected Address</span>
                    <code className="font-mono text-secondary text-xs font-bold">{address}</code>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-primary font-bold">{balance} XLM available</span>
                    <button
                      type="button"
                      onClick={disconnectWallet}
                      className="px-4 py-2 rounded-full bg-error-container text-on-error-container hover:opacity-90 active:scale-95 transition-all font-bold"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 select-none">
                  <p className="text-xs text-on-surface-variant font-bold mb-3">No active wallet connected</p>
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="bg-primary text-on-primary text-xs font-bold px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow"
                  >
                    Connect Freighter
                  </button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Theme Preference */}
          <GlassCard className="p-6 select-none">
            <h3 className="font-headline-md text-base text-on-surface font-bold mb-4">Appearance</h3>
            <div className="flex justify-between items-center text-xs font-bold">
              <div>
                <p className="text-on-surface">Application Theme</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Toggle between light and dark display modes.</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary-container/15 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  {theme === "light" ? "dark_mode" : "light_mode"}
                </span>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </GlassCard>

        </div>

        {/* Right Column */}
        <div className="space-y-gutter">
          
          {/* Notifications Panel */}
          <GlassCard className="p-6 select-none">
            <h3 className="font-headline-md text-base text-on-surface font-bold mb-4">Notifications</h3>
            <div className="space-y-4 text-xs font-bold">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-on-surface">Push Notifications</p>
                  <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Notify when task verifications settle.</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-8 h-4 rounded-full bg-surface-container appearance-none checked:bg-primary relative before:absolute before:left-0 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-4 border border-outline-variant cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-on-surface">Email Digests</p>
                  <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Receive weekly cryptographic audit summaries.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="w-8 h-4 rounded-full bg-surface-container appearance-none checked:bg-primary relative before:absolute before:left-0 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-4 border border-outline-variant cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* Network Settings */}
          <GlassCard className="p-6">
            <h3 className="font-headline-md text-base text-on-surface font-bold mb-4 select-none">Execution Mode</h3>
            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 select-none">Target Mode</label>
                <div className="flex gap-2 select-none">
                  {[
                    { key: "simulation", label: "Simulation Node" },
                    { key: "testnet", label: "Freighter Testnet" }
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setExecutionMode(mode.key as any)}
                      className={`px-4 py-1.5 rounded-lg font-bold border transition-colors ${
                        executionMode === mode.key
                          ? "bg-secondary-container text-on-secondary-container border-secondary-container"
                          : "bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 select-none">Stellar RPC Endpoint</label>
                <input
                  type="text"
                  readOnly
                  value={executionMode === "testnet" ? "https://soroban-testnet.stellar.org" : "Local Browser State"}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-body-md text-on-surface font-semibold focus:outline-none opacity-60 cursor-not-allowed"
                />
              </div>
            </div>
          </GlassCard>

          {/* Save Action */}
          <div className="flex justify-end select-none">
            <button
              type="submit"
              className="bg-primary text-on-primary font-label-sm text-sm px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow font-bold"
            >
              Save Settings
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
