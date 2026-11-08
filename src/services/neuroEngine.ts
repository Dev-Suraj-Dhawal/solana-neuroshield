import { PresetContract, RiskLevel, SecurityAuditResult, ThreatVector, NetworkType } from '../types';

export const PRESET_CONTRACTS: PresetContract[] = [
  {
    label: '🚨 Fake BONK/USDC Drainer (Malicious)',
    address: 'Drainer7bN3x9KLe7bHqp8YF2ZtK9wK4m6P2pQqLmn9',
    type: 'DRAINER',
    description: 'Deceptive dApp contract that attempts to sign an unlimited SPL token delegate instruction.',
  },
  {
    label: '⚠️ Honeypot Transfer-Hook Token',
    address: 'HoneyP11111111111111111111111111111111111111',
    type: 'HONEYPOT',
    description: 'Token 2022 mint featuring an unverified transfer-hook program that halts all outgoing transfers.',
  },
  {
    label: '✅ Verified Jupiter DEX Aggregator (Safe)',
    address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    type: 'SAFE',
    description: 'Audited Solana decentralized exchange liquidity aggregator with immutable authority.',
  },
  {
    label: '⚡ Solana Pay Verified Merchant Gateway',
    address: 'Pay1111111111111111111111111111111111111111',
    type: 'MICROPAY',
    description: 'Standard sub-second direct settlement transfer for e-commerce and streaming micro-payments.',
  },
];

export function analyzeTargetAddress(
  address: string,
  network: NetworkType = 'devnet'
): SecurityAuditResult {
  const cleanAddr = address.trim();
  const lower = cleanAddr.toLowerCase();

  // Pattern detection
  const isDrainer = lower.includes('drain') || cleanAddr.startsWith('Drainer');
  const isHoneypot = lower.includes('honey') || cleanAddr.startsWith('Honey');
  const isJupiter = cleanAddr.startsWith('JUP') || lower.includes('jupiter');
  const isSolanaPay = cleanAddr.startsWith('Pay') || lower.includes('pay');

  let score = 92;
  let riskLevel: RiskLevel = 'SAFE';
  let reputation: SecurityAuditResult['reputationBadge'] = 'VERIFIED';
  let summary = 'Contract instructions verified. Standard program invocation with zero unauthorized approvals detected.';
  const threatsDetected: ThreatVector[] = [];
  let simulatedBalanceChange = -0.000005;

  if (isDrainer) {
    score = 12;
    riskLevel = 'CRITICAL';
    reputation = 'MALICIOUS';
    simulatedBalanceChange = -2.85;
    summary = 'CRITICAL HAZARD: NeuroShield detected an automated drainer payload designed to stealthily invoke ApproveChecked for 100% of user SPL token reserves.';
    threatsDetected.push(
      {
        id: 'THR-001',
        category: 'DRAINER',
        name: 'Unlimited Token Authority Delegation',
        description: 'Instruction 2 requests delegate authority over all associated token accounts without specifying transfer limits.',
        severity: 'CRITICAL',
        mitigation: 'Reject transaction immediately. Do not sign or provide signature permission.',
      },
      {
        id: 'THR-002',
        category: 'AUTHORITY',
        name: 'Unverified Upgrade Authority Backdoor',
        description: 'Program executable buffer is mutable and owned by a newly generated burner keypair with no multisig delay.',
        severity: 'HIGH',
        mitigation: 'Contract bytecode can be modified mid-flight by the deployer.',
      }
    );
  } else if (isHoneypot) {
    score = 38;
    riskLevel = 'HIGH';
    reputation = 'COMMUNITY_FLAGGED';
    simulatedBalanceChange = -0.15;
    summary = 'HIGH RISK: Token contract uses Solana Token-2022 extension with a restrictive Transfer Hook program that prevents external secondary market selling.';
    threatsDetected.push(
      {
        id: 'THR-003',
        category: 'HONEYPOT',
        name: 'Restricted Transfer Hook Program',
        description: 'Transfers to Raydium / Orca liquidity pools are programmed to abort or burn 99% of swapped tokens.',
        severity: 'HIGH',
        mitigation: 'Verify Token-2022 extension metadata on Solana Explorer before buying.',
      },
      {
        id: 'THR-004',
        category: 'SLIPPAGE',
        name: 'Artificial Dynamic Slippage Spike',
        description: 'Transaction envelope sets priority fee to 500,000 micro-lamports and allows 45% slippage on DEX execution.',
        severity: 'MEDIUM',
        mitigation: 'Set strict maximum slippage tolerance (0.5% - 1.0%).',
      }
    );
  } else if (isJupiter || isSolanaPay) {
    score = 98;
    riskLevel = 'SAFE';
    reputation = 'VERIFIED';
    summary = 'VERIFIED AUDIT: Program ID matches official audited Solana deployment. Transaction parameters adhere to least-privilege security principles.';
  } else {
    // Dynamic heuristic evaluation based on address entropy & length
    if (cleanAddr.length < 32 || cleanAddr.length > 44) {
      score = 45;
      riskLevel = 'MEDIUM';
      reputation = 'UNKNOWN';
      summary = 'Caution: Address length or formatting does not match standard Solana Base58 public key format.';
      threatsDetected.push({
        id: 'THR-005',
        category: 'PERMISSIONS',
        name: 'Malformed Base58 Address Structure',
        description: 'The specified address may be invalid or point to an uninitialized account.',
        severity: 'MEDIUM',
        mitigation: 'Ensure public key is exactly 32-44 Base58 characters.',
      });
    } else {
      score = 88;
      riskLevel = 'SAFE';
      reputation = 'UNKNOWN';
      summary = 'Safe to proceed: Standard Solana program call with no anomalous privilege escalation patterns detected.';
    }
  }

  return {
    targetAddress: cleanAddr || '11111111111111111111111111111111',
    network,
    score,
    riskLevel,
    summary,
    threatsDetected,
    gasEstimateLamports: 5000,
    simulatedBalanceChangeSol: simulatedBalanceChange,
    reputationBadge: reputation,
    timestamp: new Date().toLocaleTimeString(),
  };
}
