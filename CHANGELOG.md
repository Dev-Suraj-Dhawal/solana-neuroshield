# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-11-15

### Added
- **Interactive Exploit Simulation Sandbox (`AttackSimulationLab.tsx`)**: Live attack reproduction lab demonstrating 4 critical Solana threat vectors (Unlimited Delegate Drainer, Token-2022 Transfer-Hook Honeypot, Unverified Upgrade Authority Backdoor, MEV Slippage Sandwich) with 380ms multi-stage simulation, stake-at-risk selectors ($10, $50, $100 SOL), and real-time defense neutralization linked directly to the Activity & Audit feed.
- **Physical Cold-Storage Paper Backup (`PaperWalletModal.tsx`)**: High-contrast, printable cold-storage voucher with dual QR codes (Public Key & Private Key), air-gapped security guidelines, `window.print()` styling, and 1-click clipboard export.
- **Stream Budget Escrow Capping & Progress Bar (`MicroStreamCard.tsx`)**: Added automated stream ceiling controls (`0.005`, `0.01`, `0.05` SOL, and Unlimited) with real-time percentage utilization progress bar and auto-termination when the budget cap is reached.
- **Synthesized Web Audio Cyber Engine (`soundEffects.ts`)**: Built-in Web Audio API synthesizer for threat warnings, shield activation chimes, and transaction success audio cues without external asset dependencies.
- **Solana Cluster Telemetry Diagnostics & Multi-Chain Gas Comparator (`ClusterBenchmarkModal.tsx`)**: Comprehensive RPC slot, latency, and multi-chain gas fee benchmark dialog (comparing Solana vs Ethereum, Arbitrum, and Polygon).
- **JSON Security Audit Certificate & BPF Disassembly Inspector**: Downloadable JSON audit proof verifying simulation signatures and compute unit consumption for on-chain compliance.
- **Global Emergency Circuit Breaker**: Instant kill-switch freezing outbound transaction execution, autonomous agent actions, and micro-payment streams during detected exploits.
- **Power User Keyboard Navigation**: Instant hotkeys (<kbd>1</kbd>–<kbd>4</kbd> for tab navigation, <kbd>Esc</kbd> for closing modals).

---

## [1.2.0] - 2026-11-09

### Added
- **In-App Toast Notification System**: Replaced native blocking browser `alert()` dialogs with sleek, non-intrusive floating toasts with auto-dismiss and multi-level status styling (`Toast.tsx`).
- **Cyberpunk Threat Interception Modal**: Introduced `SecurityConfirmationModal.tsx` for intercepted `CRITICAL` drainer transactions with explicit threat analysis breakdown, recommended safe abort, and bypass options.
- **Permanent Companion Wallet Anchor**: Fixed desktop layout shifting between tabs in `App.tsx` by permanently anchoring `WalletCard` in the desktop sidebar (`lg:col-span-4`).
- **Live Security & Tx Activity Stream**: Added a dedicated `ActivityFeed.tsx` workstation tracking real-time audits, RPC balance syncs, and micro-payment transfers with Solana Explorer links.
- **Interactive Quick-Start Stepper Tour**: Added `QuickStartGuide.tsx` delivering a 60-second guided onboarding progress checklist (Keypair generation, Threat Sentinel test, AI Agent execution, and Micro-Payment stream).
- **Keypair Security & Export Accordion**: Added secret key reveal/hide toggle, one-click export for Phantom and Solflare testnet imports, and a secure session wipe mechanism in `WalletCard.tsx`.
- **Stream Velocity Selector**: Added rate selection controls (`0.0001` to `0.001` SOL/tick) with real-time USD estimations in `MicroStreamCard.tsx`.
- **Zero-Risk Devnet Indicator**: Added reassurance badge in `Navbar.tsx` demystifying testnet environment safety for beginners.

### Changed
- Refactored `onRefreshBalance` from an empty callback to a live RPC query using `fetchWalletBalance`.
- Added mobile safe area padding `pb-[max(0.6rem,env(safe-area-inset-bottom))]` to ensure full visibility on smartphones.
- Updated threat preset buttons in `AIFirewallCard.tsx` with color-coded risk tags (`DRAINER`, `HONEYPOT`, `SAFE`, `MICROPAY`).

---

## [1.1.0] - 2026-11-08

### Added
- **AI Threat Sentinel Engine (`neuroEngine.ts`)**: 400ms heuristic simulation and risk scoring across drainers, honeypots, and delegation backdoors.
- **Autonomous Prompt-to-Solana Agent (`agentEngine.ts`)**: NLP agent executing Solana actions from plain-English inputs.
- **Real-Time Micro-Payment Streamer (`MicroStreamCard.tsx`)**: High-frequency value transfer demonstrating Solana sub-second finality.
- **Ephemeral Gasless Burner Wallet (`WalletCard.tsx`)**: Zero-install browser keypair creation with instant Devnet airdrop faucet boost.
- **Live Solana Cluster Telemetry (`solanaRpc.ts`)**: Real-time TPS, epoch slot, latency, and fee tracking.

---

## [1.0.0] - 2026-11-06

### Added
- Initial project architecture and production deployment setup for Solana Hackathon 2026.
- Full TypeScript strict configuration with React 19, Vite, and Tailwind CSS v4.
- GitHub Actions automated CI/CD pipeline for GitHub Pages deployment.
- Initial submission metadata for 5 MLH Solana Hackathon tracks (AI Track, Best Beginner Hack, DeFi, Gaming, Top 3 Overall).
