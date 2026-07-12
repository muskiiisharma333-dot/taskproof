import {
  isConnected,
  getAddress,
  signTransaction,
  getNetworkDetails,
  isAllowed,
  setAllowed,
} from "@stellar/freighter-api";

export const isFreighterConnected = async (): Promise<boolean> => {
  try {
    const connection = await isConnected();
    return connection.isConnected;
  } catch (e) {
    console.error("Freighter isConnected check failed", e);
    return false;
  }
};

export const isFreighterAllowed = async (): Promise<boolean> => {
  try {
    const allowed = await isAllowed();
    return allowed.isAllowed;
  } catch (e) {
    console.error("Freighter isAllowed check failed", e);
    return false;
  }
};

export const setFreighterAllowed = async (): Promise<boolean> => {
  try {
    const allowed = await setAllowed();
    return allowed.isAllowed;
  } catch (e) {
    console.error("Freighter setAllowed check failed", e);
    return false;
  }
};

export const getFreighterAddress = async (): Promise<string | null> => {
  try {
    const access = await getAddress();
    if (access.error) {
      console.warn("Freighter getAddress returned error:", access.error);
      return null;
    }
    return access.address || null;
  } catch (e) {
    console.error("Freighter getAddress request failed", e);
    return null;
  }
};

export interface FreighterNetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
  sorobanRpcUrl?: string;
  error?: string;
}

export const getFreighterNetworkDetails = async (): Promise<FreighterNetworkDetails | null> => {
  try {
    const details = await getNetworkDetails();
    if (details.error) {
      console.warn("Freighter getNetworkDetails returned error:", details.error);
      return {
        network: "",
        networkUrl: "",
        networkPassphrase: "",
        error: details.error,
      };
    }
    return {
      network: details.network,
      networkUrl: details.networkUrl,
      networkPassphrase: details.networkPassphrase,
      sorobanRpcUrl: details.sorobanRpcUrl,
    };
  } catch (e) {
    console.error("Freighter getNetworkDetails failed", e);
    return null;
  }
};

export interface SignedTransactionResult {
  signedTxXdr?: string;
  signerAddress?: string;
  error?: string;
}

export const signFreighterTransaction = async (
  transactionXdr: string,
  opts?: { networkPassphrase?: string; address?: string }
): Promise<SignedTransactionResult> => {
  try {
    const result = await signTransaction(transactionXdr, opts);
    if (result.error) {
      return { error: result.error };
    }
    return {
      signedTxXdr: result.signedTxXdr,
      signerAddress: result.signerAddress,
    };
  } catch (e: any) {
    console.error("Freighter transaction signing failed", e);
    return { error: e.message || "User rejected or signature request timed out" };
  }
};
