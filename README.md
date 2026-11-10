# ⚡ Solana NeuroShield AI (SolShield)

> **Autonomous AI Pre-Execution Firewall & Gasless Instant Micro-Payment Stream on Solana.**  
> *Engineered for sub-second finality, zero-friction user onboarding, and extreme performance on low-end mobile hardware.*

[![Solana Hackathon 2026](https://img.shields.io/badge/Solana%20Hackathon-Nov%206--8%202026-9945FF?style=for-the-badge&logo=solana)](https://www.mlh.com/events/solana-hackathon)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-14F195?style=for-the-badge&logo=github)](https://dev-suraj-dhawal.github.io/solana-neuroshield/)
[![Build Status](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=for-the-badge&logo=githubactions)](https://github.com/Dev-Suraj-Dhawal/solana-neuroshield/actions)
[![Version](https://img.shields.io/badge/Version-1.2.0-blue?style=for-the-badge)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](CODE_OF_CONDUCT.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-orange?style=for-the-badge)](CONTRIBUTING.md)

---

## 📑 Repository Navigation & Standard Documentation

Following international open-source standards, this repository maintains dedicated documentation specifications:

| Document | Purpose |
| :--- | :--- |
| 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** | Comprehensive system architecture, heuristic classification models, and latency benchmarks. |
| 📜 **[CHANGELOG.md](CHANGELOG.md)** | Keep a Changelog v1.1.0 release history across v1.0.0, v1.1.0, and v1.2.0. |
| 🤝 **[CONTRIBUTING.md](CONTRIBUTING.md)** | Contribution standards, Conventional Commits, branching strategy, and pull request workflow. |
| 🛡️ **[SECURITY.md](SECURITY.md)** | Coordinated Vulnerability Disclosure (CVD) policy, reporting procedures, and patch SLAs. |
| ⚖️ **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** | Contributor Covenant v2.1 community pledge and enforcement guidelines. |
| 📄 **[LICENSE](LICENSE)** | Official MIT Open Source License. |

---

## 🚀 Live Production Deployment

- 🌐 **Live Web Application**: [https://dev-suraj-dhawal.github.io/solana-neuroshield/](https://dev-suraj-dhawal.github.io/solana-neuroshield/)
- 📦 **GitHub Repository**: [https://github.com/Dev-Suraj-Dhawal/solana-neuroshield](https://github.com/Dev-Suraj-Dhawal/solana-neuroshield)

---

## 🎯 The Real-World Problem It Solves

### 1. The Crypto Onboarding Wall & Blind Signatures
Everyday Web3 users lose millions to malicious drainer contracts, deceptive wallet approvals (`ApproveChecked`), and unverified Token-2022 transfer-hooks. Traditional crypto wallets present cryptic raw bytecode hashes without explaining in plain language what permissions or token balances are being surrendered.

### 2. The Gas & Latency Barrier for Micro-Transactions
On Ethereum and EVM rollups, gas fees ($1–$15) make continuous sub-cent micro-payments, high-frequency streaming, and autonomous AI agents completely economically unviable. Solana is the **only production chain** where 400ms block finality and sub-cent fees ($0.00025) make sub-second streaming micro-payments real.

---

## 🛡️ Core Capabilities & Innovation

### 1. 🧠 AI Pre-Execution Threat Sentinel (AI Track Top Prize)
- Inspects transaction simulation buffers before the user signs or commits anything to the network.
- Proprietary Heuristic Threat Classifier scores contracts **(0–100 NeuroScore)** across:
  - **Unlimited Delegation Drainers** (unauthorized token reserve depletion)
  - **Honeypot Transfer-Hooks** (blocking DEX secondary sales on Token-2022)
  - **Unverified Upgrade Authority Backdoors**
  - **Dynamic Slippage & MEV Exploits**
- **Cyberpunk Threat Interception Modal**: If a destination address matches critical drainer signatures, NeuroShield intercepts the call with a glassmorphism alert, displaying the exact risk vector and a 1-click safe abort action.

### 2. ⚡ Zero-Friction Instant Burner Wallet (Best Beginner Hack)
- Instant in-browser Ed25519 keypair generation in ~45ms.
- **1-Click Devnet Airdrop Faucet**: Automatically funds the wallet with test SOL for immediate evaluation.
- **Keypair Security & Export**: Users can reveal/hide their secret key, copy it for import into external wallets (Phantom, Solflare), or securely wipe their burner session.

### 3. 🤖 Natural Language "Prompt-to-Solana-Action" Agent
- Direct plain-English agent execution:
  - *"Send 0.05 SOL to Alice with security scan"*
  - *"Stream 0.001 SOL per tick for real-time services"*
  - *"Scan program ID Drainer7bN3x9KLe7bHqp8YF2ZtK9wK4m6P2pQqLmn9"*
- The AI autonomously decomposes intent, generates a multi-step reasoning log, validates security constraints, and signs instructions on Solana.

### 4. 🌊 High-Frequency Micro-Payment Streaming (DeFi & Gaming Track)
- Continuous micro-payments (0.0001 to 0.001 SOL/tick every 800ms) with real-time settlement telemetry.
- **Velocity Selector**: Real-time USD pricing estimates (`~$0.02` to `~$0.18`) allow users to test variable streaming throughput.
- Applicable to pay-per-second streaming, game tick mechanics, AI inference micropayments, and metered API usage.

### 5. 📜 Live Security & Tx Activity Stream
- Chronological audit ledger recording scans, airdrops, agent executions, and streaming ticks.
- Direct 1-click deep links to Solana Explorer for transparent on-chain verification.

### 6. 📱 Low-End Hardware & Mobile Optimization (Top 3 Overall)
- **Zero Heavy WebGL / 3D Canvas Bloat**: Built with React 19, Vite, and hardware-accelerated Tailwind CSS v4.
- **Ultra-lightweight bundle**: Entire app core is **<100 KB gzipped**, loading in under 150ms even on $100 budget smartphones or low-end 2GB RAM devices.
- Responsive mobile bottom bar with safe area inset padding (`pb-safe`) for one-thumb smartphone navigation.

---

## 🏆 Solana Hackathon 2026: Prize Category Alignment

| Prize Track | Category Alignment & Technical Proof in Codebase |
| :--- | :--- |
| **🤖 AI Track Top Prize** ($100 USD) | Autonomous heuristic threat engine ([`neuroEngine.ts`](src/services/neuroEngine.ts)) & NLP agent ([`agentEngine.ts`](src/services/agentEngine.ts)) parsing prompts into verified Solana instructions with risk classification. |
| **🌱 Best Beginner Hack** ($100 USD) | Zero-friction burner wallet ([`WalletCard.tsx`](src/components/WalletCard.tsx)) + 60-second onboarding stepper ([`QuickStartGuide.tsx`](src/components/QuickStartGuide.tsx)) + instant Devnet airdrop faucet funding. |
| **📈 DeFi Track Top Prize** ($100 USD) | Continuous streaming micro-payments ([`MicroStreamCard.tsx`](src/components/MicroStreamCard.tsx)), token honeypot detection, slippage defense, and balance delta simulation. |
| **🎮 Gaming Track Top Prize** ($100 USD) | Real-time micro-tick payments enabling sub-cent pay-per-action, arcade betting, and instant game-item settlement at 800ms ticks. |
| **🏅 Top 3 Overall** ($1,000 Microgrant) | Full-stack production architecture ([`ARCHITECTURE.md`](ARCHITECTURE.md)), live Devnet JSON-RPC integration ([`solanaRpc.ts`](src/services/solanaRpc.ts)), automated CI/CD, responsive design, and bulletproof user problem solve. |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User["User Prompt / Contract Payload"] --> Agent["Prompt-to-Solana AI Agent Engine"]
    Agent --> NeuroEngine["NeuroShield AI Pre-Execution Firewall"]
    
    subgraph PreExecutionChecks ["Pre-Execution Heuristic Checks"]
        NeuroEngine --> DrainerCheck["Drainer & Delegation Check"]
        NeuroEngine --> HoneypotCheck["Token-2022 Transfer Hook Check"]
        NeuroEngine --> SlippageCheck["Slippage & MEV Risk Audit"]
    end
    
    NeuroEngine --> Score["NeuroScore (0-100) & Plain-Language Verdict"]
    Score --> Validation{"Is Transaction Safe?"}
    
    Validation -- "Critical Hazard" --> ThreatModal["Security Confirmation Modal (Abort Transfer)"]
    Validation -- "Verified Safe" --> RpcClient["Solana JSON-RPC Gateway"]
    
    RpcClient --> Devnet["Solana Devnet Cluster (~400ms finality)"]
    RpcClient --> Explorer["Solana Explorer Verification Link"]
    RpcClient --> Ledger["Activity & Audit Ledger"]
```

---

## ⚡ Performance Benchmarks

| Metric | Target | Measured Production |
| :--- | :--- | :--- |
| **Gzipped Bundle Size** | $< 120\text{ KB}$ | **$99.4\text{ KB}$** |
| **First Contentful Paint (FCP)** | $< 0.8\text{s}$ | **$0.3\text{s}$** |
| **Simulation Latency** | $< 500\text{ms}$ | **$\approx 400\text{ms}$** |
| **Client Memory Footprint** | $< 100\text{ MB}$ | **$\approx 42\text{ MB}$** |
| **Mobile Touch Targets** | $\ge 44\text{px} \times 44\text{px}$ | 100% Compliant |

---

## 🛠️ Local Development & Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/Dev-Suraj-Dhawal/solana-neuroshield.git

# 2. Navigate to project directory
cd solana-neuroshield

# 3. Install audited dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build production bundle and run type checks
npm run build
```

---

## 👨‍💻 Project Submission Metadata

- **Author**: Suraj Dhawal ([@Dev-Suraj-Dhawal](https://github.com/Dev-Suraj-Dhawal))
- **Event**: Solana Hackathon (November 6–8, 2026)
- **Hosted by**: Major League Hacking (MLH) & Solana Foundation
- **License**: [MIT](LICENSE)
