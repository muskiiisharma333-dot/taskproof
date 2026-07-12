import React, { createContext, useContext, useState, useEffect } from "react";
import { generateStellarAddress } from "../services/mockData";
import {
  isFreighterConnected,
  isFreighterAllowed,
  setFreighterAllowed,
  getFreighterAddress,
} from "../utils/freighter";
import { WalletService } from "../services/wallet/walletService";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  isRestoring: boolean;
  isWrongNetwork: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  executionMode: "simulation" | "testnet";
  setExecutionMode: (mode: "simulation" | "testnet") => void;
  refetchBalance: () => Promise<void>;
  checkNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialMode = (localStorage.getItem("taskproof_execution_mode") as "simulation" | "testnet") || "simulation";

  const [executionMode, setExecutionModeState] = useState<"simulation" | "testnet">(initialMode);
  const [isConnected, setIsConnected] = useState<boolean>(initialMode === "simulation");
  const [address, setAddress] = useState<string | null>(initialMode === "simulation" ? "GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF" : null);
  const [balance, setBalance] = useState<string | null>(initialMode === "simulation" ? "4,250.00" : null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(initialMode === "testnet");
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);

  // Sync execution mode and reset connections when switched
  const setExecutionMode = (mode: "simulation" | "testnet") => {
    setExecutionModeState(mode);
    localStorage.setItem("taskproof_execution_mode", mode);
    if (mode === "simulation") {
      setIsConnected(true);
      setAddress("GCE3P25XSKL9XWERTUION7YXZPQR456789ABCDEF");
      setBalance("4,250.00");
      setIsWrongNetwork(false);
    } else {
      setIsConnected(false);
      setAddress(null);
      setBalance(null);
      setIsWrongNetwork(false);
    }
  };

  const refetchBalance = async () => {
    if (executionMode === "testnet" && address) {
      try {
        const bal = await WalletService.fetchAccountBalance(address);
        setBalance(bal);
      } catch (err) {
        setBalance("0.00 (Unfunded)");
      }
    }
  };

  const checkNetwork = async () => {
    if (executionMode === "testnet" && address) {
      try {
        const { isTestnet } = await WalletService.validateNetwork();
        setIsWrongNetwork(!isTestnet);
      } catch (err) {
        setIsWrongNetwork(true);
      }
    } else {
      setIsWrongNetwork(false);
    }
  };

  // Auto-restore Freighter connection if already authorized by the user
  useEffect(() => {
    const restoreConnection = async () => {
      if (executionMode === "testnet") {
        try {
          const installed = await isFreighterConnected();
          if (installed) {
            const allowed = await isFreighterAllowed();
            if (allowed) {
              const activeAddress = await getFreighterAddress();
              if (activeAddress) {
                setAddress(activeAddress);
                setIsConnected(true);
                // Pre-run validations
                const { isTestnet } = await WalletService.validateNetwork();
                setIsWrongNetwork(!isTestnet);
                const bal = await WalletService.fetchAccountBalance(activeAddress);
                setBalance(bal);
              }
            }
          }
        } catch (e) {
          console.error("Auto-connect check failed", e);
        } finally {
          setIsRestoring(false);
        }
      } else {
        setIsRestoring(false);
      }
    };
    restoreConnection();
  }, [executionMode]);

  // Periodic polling for network switch and balance updates
  useEffect(() => {
    let interval: any = null;
    if (executionMode === "testnet" && isConnected && address) {
      interval = setInterval(() => {
        refetchBalance();
        checkNetwork();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [address, isConnected, executionMode]);

  const connectWallet = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      if (executionMode === "testnet") {
        // 1. Check installed
        const installed = await isFreighterConnected();
        if (!installed) {
          if (window.confirm("Freighter Wallet is required to use TaskProof. Would you like to install it now?")) {
            window.open("https://www.freighter.app/", "_blank");
          }
          setIsConnecting(false);
          return false;
        }

        // 2. Request permission / Set allowed
        const allowed = await setFreighterAllowed();
        if (!allowed) {
          alert("Permission to connect was rejected. Please approve wallet requests to proceed.");
          setIsConnecting(false);
          return false;
        }

        // 3. Get public address
        const activeAddress = await getFreighterAddress();
        if (!activeAddress) {
          alert("Wallet is locked or address query failed. Please unlock your Freighter wallet.");
          setIsConnecting(false);
          return false;
        }

        // 4. Validate network passphrase matches Stellar Testnet
        const { isTestnet } = await WalletService.validateNetwork();
        setIsWrongNetwork(!isTestnet);

        // 5. Fetch balance
        let bal = "0.00";
        try {
          bal = await WalletService.fetchAccountBalance(activeAddress);
        } catch (err) {
          bal = "0.00 (Unfunded)";
        }

        // Save session states
        setAddress(activeAddress);
        setBalance(bal);
        setIsConnected(true);
        setIsConnecting(false);
        return true;
      } else {
        // Simulation mode login
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newAddress = generateStellarAddress();
        setAddress(newAddress);
        setBalance("10,000.00");
        setIsConnected(true);
        setIsWrongNetwork(false);
        setIsConnecting(false);
        return true;
      }
    } catch (error) {
      console.error("Wallet connection failed", error);
      alert("An unexpected error occurred while connecting your wallet.");
      setIsConnecting(false);
      return false;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    setIsWrongNetwork(false);
    localStorage.removeItem("taskproof_execution_mode");
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isConnecting,
        isRestoring,
        isWrongNetwork,
        connectWallet,
        disconnectWallet,
        executionMode,
        setExecutionMode,
        refetchBalance,
        checkNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
