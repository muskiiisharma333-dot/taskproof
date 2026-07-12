import { useWallet as useWalletContext } from "../contexts/WalletContext";

export const useWallet = () => {
  return useWalletContext();
};

export default useWallet;
