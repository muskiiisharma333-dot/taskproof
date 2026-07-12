# TaskProof 🚀

TaskProof is a production-grade decentralized application (dApp) built on the Stellar network. It enables developers and teams to create tasks, log progress milestones, and record cryptographic proof hashes securely on-chain.

TaskProof satisfies all **Stellar Level 3 Audit Requirements**, featuring:
* Advanced Smart Contract Development with modular state design.
* Deterministic Mutual Linkage to resolve deploy-time circular references.
* Live event publishing and polling subscriptions on-chain.
* Real Freighter wallet integration with automatic Testnet balance queries.
* Comprehensive Rust contract unit tests and Vitest frontend state tests.
* Fully automated deployment scripting.

---

## 📂 Project Directory Structure

The repository is structured as an NPM and Cargo workspace monorepo:
* **`frontend/`**: Vite React SPA client codebase.
* **`contracts/`**: Cargo workspace for Soroban smart contracts.
  * **`task/`**: Logic for task lifecycles, states, and dynamic cross-contract calls.
  * **`registry/`**: Ledger entries mapping task IDs to cryptographic hashes.
* **`scripts/`**: Deploy scripts compiling contract targets, managing testnet keys, and configuring links.
* **`tests/`**: Integration checks audits.
* **`docs/`**: Diagrams and deep-dive architecture specs.
* **`.github/workflows/`**: GitHub Actions continuous integration scripts.

---

## ⚙️ Prerequisites

To run TaskProof locally, install the following:
* [Node.js v20+](https://nodejs.org/)
* [Rust & Cargo](https://rustup.rs/) (Target `wasm32-unknown-unknown` enabled)
* [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools) (For deployments)
* [Freighter Wallet](https://www.freighter.app/) (For real Testnet operations)

---

## 🛠️ Installation & Setup

1. **Install workspace dependencies**:
   ```bash
   npm run install:all
   ```

2. **Compile Smart Contracts to WASM**:
   ```bash
   cd contracts
   cargo build --target wasm32-unknown-unknown --release
   ```

---

## 🧪 Running Test Suites

### 1. Contract Unit Tests
To run contract verification test cases (testing task creation, completion, progress updates, and registry inter-calls):
```bash
cd contracts
cargo test
```

### 2. Frontend Unit Tests
To run Vitest specs verifying Freighter mock connections, disconnect states, task creations, and timeline updates:
```bash
npm run test:frontend
```

### 3. Config Integration Check
To verify exported contract configs match:
```bash
npm run test:integration
```

---

## 🚀 Automated Contract Deployment

TaskProof features a single-command deployment pipeline that builds contract targets, provisions and funds testnet addresses, deploys WASM binaries, links contracts together, and updates client configs.

```bash
npm run deploy
```

---

## 💻 Local Development Run

To launch the local development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

*Note: In Settings, you can switch between **Simulation Mode** (which runs mock-side for instant testing with no wallet setup required) and **Freighter Testnet Mode** (which triggers live Freighter transactions and loads real Testnet balances).*
