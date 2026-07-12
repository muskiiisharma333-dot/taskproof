import * as StellarSdk from "@stellar/stellar-sdk";
import contractConfig from "../../config.json";
import { signFreighterTransaction } from "../../utils/freighter";

export interface WalletDetails {
  address: string;
  balance: string;
  networkPassphrase: string;
  isTestnet: boolean;
}

export class WalletService {
  private static horizonServer = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

  /**
   * Fetches account native XLM balance from Horizon.
   */
  public static async fetchAccountBalance(address: string): Promise<string> {
    try {
      const account = await this.horizonServer.loadAccount(address);
      const nativeBal = account.balances.find((b: any) => b.asset_type === "native");
      if (nativeBal) {
        return parseFloat(nativeBal.balance).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      return "0.00";
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        return "0.00 (Unfunded)";
      }
      throw new Error("Account loading failed. Target address may be unfunded on Testnet.");
    }
  }

  /**
   * Validates target network credentials against Stellar Testnet.
   */
  public static async validateNetwork(): Promise<{ isTestnet: boolean; passphrase: string }> {
    const rpc = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");
    try {
      await rpc.getLatestLedger();
      // If we can read from testnet RPC, check passphrase
      const TESTNET_PASSPHRASE = StellarSdk.Networks.TESTNET;
      return {
        isTestnet: true,
        passphrase: TESTNET_PASSPHRASE,
      };
    } catch (e) {
      return { isTestnet: false, passphrase: "" };
    }
  }

  /**
   * Connects and aggregates wallet properties.
   */
  public static async getConnectedDetails(): Promise<WalletDetails | null> {
    const address = await getFreighterAddress();
    if (!address) return null;

    const { isTestnet, passphrase } = await this.validateNetwork();
    let balance = "0.00";
    try {
      balance = await this.fetchAccountBalance(address);
    } catch (err) {
      balance = "0.00 (Unfunded)";
    }

    return {
      address,
      balance,
      networkPassphrase: passphrase,
      isTestnet,
    };
  }

  /**
   * Invokes a Soroban smart contract method with proper simulation, signing, and submission parameters.
   */
  public static async invokeContractMethod(
    sourceAddress: string,
    method: string,
    args: StellarSdk.xdr.ScVal[],
    onProgress: (status: string) => void
  ): Promise<string> {
    const rpc = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");
    
    onProgress("Fetching account details...");
    const account = await rpc.getAccount(sourceAddress);
    const contract = new StellarSdk.Contract(contractConfig.TASK_CONTRACT_ID);

    onProgress("Building transaction...");
    let tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(180)
      .build();

    onProgress("Simulating transaction on-chain...");
    const simulation = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    onProgress("Assembling transaction footprint...");
    tx = StellarSdk.rpc.assembleTransaction(tx, simulation).build();

    onProgress("Waiting for Freighter signature...");
    const xdr = tx.toXDR();
    const signResult = await signFreighterTransaction(xdr, {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    if (signResult.error || !signResult.signedTxXdr) {
      throw new Error(signResult.error || "User rejected signature request");
    }

    onProgress("Submitting transaction to network...");
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signResult.signedTxXdr,
      StellarSdk.Networks.TESTNET
    ) as StellarSdk.Transaction;
    
    const sendResponse = await rpc.sendTransaction(signedTx);
    if (sendResponse.status === "ERROR") {
      throw new Error(`Submission failed: ${sendResponse.errorResult}`);
    }

    onProgress("Waiting for block confirmation...");
    let pollResponse = await rpc.getTransaction(sendResponse.hash);
    while (pollResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      pollResponse = await rpc.getTransaction(sendResponse.hash);
    }

    if (pollResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
      return sendResponse.hash;
    } else {
      throw new Error(`Transaction finalized with status: ${pollResponse.status}`);
    }
  }

  /**
   * Retrieves events from the Soroban RPC nodes for the Task Contract.
   */
  public static async pollContractEvents(startLedgerOffset = 5000): Promise<any[]> {
    const rpc = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");
    try {
      const latestLedger = await rpc.getLatestLedger();
      const sequence = latestLedger.sequence;
      const startLedger = Math.max(1, sequence - startLedgerOffset);

      const response = await rpc.getEvents({
        startLedger,
        filters: [
          {
            type: "contract",
            contractIds: [contractConfig.TASK_CONTRACT_ID],
          },
        ],
        limit: 50,
      });

      if (!response.events || response.events.length === 0) {
        return [];
      }

      return response.events.map((ev) => {
        const topics = ev.topic;
        const typeSymbol = topics[0];
        let eventType = "unknown";

        if (typeSymbol) {
          try {
            const typeStr = StellarSdk.scValToNative(typeSymbol);
            if (typeStr === "task_created" || typeStr === "create_task") eventType = "task_created";
            else if (typeStr === "task_completed" || typeStr === "complete_task") eventType = "task_completed";
            else if (typeStr === "task_updated") eventType = "task_updated";
          } catch (_) {}
        }

        let value = "";
        try {
          const valObj = ev.value;
          if (valObj) {
            value = StellarSdk.scValToNative(valObj).toString();
          }
        } catch (_) {}

        let taskId = 0;
        try {
          if (topics[1] !== undefined) {
            taskId = Number(StellarSdk.scValToNative(topics[1]));
          }
        } catch (_) {}

        return {
          id: ev.id,
          txHash: ev.txHash,
          type: eventType,
          taskId,
          value,
          time: ev.ledgerClosedAt ? new Date(ev.ledgerClosedAt).toLocaleTimeString() : "Just now",
        };
      });
    } catch (e) {
      console.error("Failed to poll Soroban RPC events", e);
      return [];
    }
  }
}

async function getFreighterAddress() {
  const { getFreighterAddress } = await import("../../utils/freighter");
  return getFreighterAddress();
}

export default WalletService;
