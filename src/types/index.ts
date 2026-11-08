export type NetworkType = 'devnet' | 'mainnet-beta';

export interface NetworkTelemetry {
  tps: number;
  blockTimeMs: number;
  epoch: number;
  slot: number;
  status: 'operational' | 'degraded' | 'offline';
  avgFeeSol: number;
  lastUpdated: string;
}

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ThreatVector {
  id: string;
  category: 'DRAINER' | 'HONEYPOT' | 'PERMISSIONS' | 'SLIPPAGE' | 'MEV' | 'AUTHORITY';
  name: string;
  description: string;
  severity: RiskLevel;
  mitigation: string;
}

export interface SecurityAuditResult {
  targetAddress: string;
  network: NetworkType;
  score: number; // 0 (catastrophic) to 100 (pristine)
  riskLevel: RiskLevel;
  summary: string;
  threatsDetected: ThreatVector[];
  gasEstimateLamports: number;
  simulatedBalanceChangeSol: number;
  reputationBadge: 'VERIFIED' | 'COMMUNITY_FLAGGED' | 'UNKNOWN' | 'MALICIOUS';
  timestamp: string;
}

export interface BurnerWallet {
  publicKey: string;
  secretKey: string;
  balanceSol: number;
  network: NetworkType;
  createdTime: string;
}

export interface AgentAction {
  id: string;
  prompt: string;
  intent: 'TRANSFER' | 'AIRDROP' | 'AUDIT' | 'STREAM_PAY' | 'REVOKE_AUTH';
  parameters: {
    recipient?: string;
    amountSol?: number;
    targetAddress?: string;
    ratePerSec?: number;
  };
  reasoning: string[];
  safetyVerified: boolean;
  neuroScore: number;
  status: 'IDLE' | 'ANALYZING' | 'READY' | 'EXECUTING' | 'CONFIRMED' | 'FAILED';
  txSignature?: string;
  explorerUrl?: string;
}

export interface StreamSession {
  id: string;
  recipient: string;
  ratePerSec: number;
  totalSentSol: number;
  ticksCount: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startTime: number;
  latestTxId?: string;
}

export interface PresetContract {
  label: string;
  address: string;
  type: 'SAFE' | 'DRAINER' | 'HONEYPOT' | 'MICROPAY';
  description: string;
}
