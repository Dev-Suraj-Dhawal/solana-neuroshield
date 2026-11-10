# Security Policy

## Supported Versions

Security updates and patches are actively maintained for the following versions:

| Version | Supported          | Release Status |
| :------ | :----------------: | :------------- |
| `1.2.x` | :white_check_mark: | Latest Stable  |
| `1.1.x` | :white_check_mark: | Active         |
| `1.0.x` | :x:                | Deprecated     |
| `< 1.0` | :x:                | Unsupported    |

---

## Reporting a Vulnerability

The **Solana NeuroShield** engineering team takes the security of smart contract simulation, heuristic classification, and ephemeral keypair isolation seriously.

If you discover a security vulnerability in NeuroShield, please report it via private coordinated disclosure. **Do not create public GitHub issues for security vulnerabilities.**

### Disclosure Channel

Please email your vulnerability report to:
📧 **surajdhawal.dev@gmail.com**

Please include the subject line:
`[SECURITY DISCLOSURE] Solana NeuroShield - <Brief Vulnerability Title>`

### What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:
1. **Description**: Clear description of the vulnerability and its potential impact (e.g. key leakage, heuristic bypass, denial of service).
2. **Reproduction Steps**: Detailed step-by-step instructions or Proof of Concept (PoC).
3. **Affected Environment**: Browser, OS version, Node version, and Solana cluster (Devnet / Mainnet).
4. **Remediation Suggestion**: Any proposed fix or mitigation if available.

---

## Response & Patch Service Level Agreement (SLA)

| Stage | Timeline |
| :--- | :--- |
| **Initial Acknowledgment** | Within **24 hours** |
| **Triage & Severity Assessment** | Within **48 hours** |
| **Patch Development & Testing** | Within **5 business days** |
| **Public Coordinated Disclosure** | Within **14 business days** or after patch rollout |

---

## Security Architecture & Design Guarantees

1. **Zero Server-Side Key Custody**:
   - Ephemeral burner wallets are generated client-side using `tweetnacl` / `@solana/web3.js` Ed25519 curves.
   - Private keys are stored exclusively in the user's browser `localStorage` and never transmitted across network boundaries.

2. **Pre-Execution Simulation**:
   - Transactions are simulated and audited by the heuristic sentinel before signing.
   - Malicious contracts matching drainer signatures or Token-2022 hook exploits trigger an immediate firewall barrier.

3. **Isolated Test Environments**:
   - Devnet mode is strictly separated from Mainnet-Beta to prevent accidental fund disbursement.
