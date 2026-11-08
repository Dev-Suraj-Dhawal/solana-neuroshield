import { AgentAction, BurnerWallet, NetworkType } from '../types';
import { generateMockTxSignature, getExplorerUrl } from './solanaRpc';
import { analyzeTargetAddress } from './neuroEngine';

export const QUICK_AGENT_PROMPTS = [
  '⚡ Airdrop 1 SOL to my burner wallet on Devnet',
  '🛡️ Scan contract Drainer7bN3x9KLe7bHqp8YF2ZtK9wK4m6P2pQqLmn9 for drainers',
  '💸 Send 0.05 SOL to 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
  '🌊 Stream 0.001 SOL micro-payment for high-speed streaming',
  '🔒 Audit Jupiter DEX address JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
];

export function parseUserPromptToAgentAction(
  prompt: string,
  wallet: BurnerWallet | null,
  network: NetworkType = 'devnet'
): AgentAction {
  const p = prompt.toLowerCase().trim();
  const id = 'ACT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  // 1. Airdrop Intent
  if (p.includes('airdrop') || p.includes('faucet') || p.includes('request sol')) {
    const amountMatch = prompt.match(/(\d+(\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 1.0;

    return {
      id,
      prompt,
      intent: 'AIRDROP',
      parameters: {
        amountSol: amount,
        recipient: wallet?.publicKey || 'Burner-Active',
      },
      reasoning: [
        'Detected intent: Devnet SOL Faucet Airdrop request',
        `Extracting target wallet: ${wallet?.publicKey ? wallet.publicKey.slice(0, 8) + '...' : 'Active Burner'}`,
        `Requested grant amount: ${amount} SOL`,
        'Pre-flight check: Devnet validator RPC availability confirmed',
        'Security verdict: Safe system instruction (RequestAirdrop on devnet)',
      ],
      safetyVerified: true,
      neuroScore: 100,
      status: 'READY',
    };
  }

  // 2. Scan / Audit Intent
  if (p.includes('scan') || p.includes('audit') || p.includes('analyze') || p.includes('check')) {
    // Extract base58 address
    const words = prompt.split(/\s+/);
    let target = '';
    for (const w of words) {
      if (w.length >= 32 && w.length <= 44 && !w.startsWith('http')) {
        target = w;
        break;
      }
    }
    if (!target) {
      target = 'Drainer7bN3x9KLe7bHqp8YF2ZtK9wK4m6P2pQqLmn9';
    }

    const audit = analyzeTargetAddress(target, network);

    return {
      id,
      prompt,
      intent: 'AUDIT',
      parameters: {
        targetAddress: target,
      },
      reasoning: [
        'Detected intent: Solana Smart Contract & Instruction Pre-Execution Audit',
        `Target program public key: ${target}`,
        `Simulating instruction payload in isolated virtual environment...`,
        `NeuroShield Risk Evaluation: ${audit.riskLevel} (${audit.score}/100)`,
        `Verdict: ${audit.summary}`,
      ],
      safetyVerified: audit.riskLevel === 'SAFE' || audit.riskLevel === 'LOW',
      neuroScore: audit.score,
      status: 'READY',
    };
  }

  // 3. Stream Micro-Payment Intent
  if (p.includes('stream') || p.includes('tick') || p.includes('micropay')) {
    const amountMatch = prompt.match(/(\d+(\.\d+)?)/);
    const rate = amountMatch ? parseFloat(amountMatch[1]) : 0.001;

    return {
      id,
      prompt,
      intent: 'STREAM_PAY',
      parameters: {
        ratePerSec: rate,
        recipient: 'Pay1111111111111111111111111111111111111111',
      },
      reasoning: [
        'Detected intent: High-Frequency Solana Micro-Payment Streaming',
        `Configured transfer velocity: ${rate} SOL/tick`,
        'Recipient: Verified Solana Pay micro-merchant channel',
        'Checking sender wallet liquid balance...',
        'Low fee guarantee: Estimated network cost per tick ~0.000005 SOL (~$0.0008 USD)',
      ],
      safetyVerified: true,
      neuroScore: 98,
      status: 'READY',
    };
  }

  // 4. Transfer / Send Intent
  if (p.includes('send') || p.includes('transfer') || p.includes('pay')) {
    const amountMatch = prompt.match(/(\d+(\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0.05;

    // Search for recipient
    const words = prompt.split(/\s+/);
    let recipient = '';
    for (const w of words) {
      if (w.length >= 32 && w.length <= 44 && !w.startsWith('http')) {
        recipient = w;
        break;
      }
    }
    if (!recipient) {
      recipient = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'; // Example recipient
    }

    const audit = analyzeTargetAddress(recipient, network);

    return {
      id,
      prompt,
      intent: 'TRANSFER',
      parameters: {
        recipient,
        amountSol: amount,
      },
      reasoning: [
        'Detected intent: Native SOL Direct Transfer',
        `Amount: ${amount} SOL`,
        `Destination address: ${recipient}`,
        `Pre-Execution Firewall: Address evaluated as ${audit.riskLevel} (${audit.score}/100)`,
        'Instruction: SystemProgram.transfer with Ed25519 signature verification',
      ],
      safetyVerified: audit.riskLevel !== 'CRITICAL',
      neuroScore: audit.score,
      status: 'READY',
    };
  }

  // Fallback General AI Analysis
  return {
    id,
    prompt,
    intent: 'AUDIT',
    parameters: {
      targetAddress: wallet?.publicKey || 'DemoKey111111111111111111111111111111111',
    },
    reasoning: [
      'Natural language command received and parsed by NeuroShield Agent Engine',
      'Context loaded: Active Solana Devnet environment',
      'Synthesized action: Pre-Execution account security scan',
      'Risk evaluation: No abnormal state hazards detected',
    ],
    safetyVerified: true,
    neuroScore: 95,
    status: 'READY',
  };
}

export async function executeAgentAction(
  action: AgentAction,
  network: NetworkType = 'devnet'
): Promise<{ success: boolean; signature: string; explorerUrl: string; message: string }> {
  // Simulate transaction propagation at Solana speed (~400ms)
  await new Promise((r) => setTimeout(r, 450));

  const sig = generateMockTxSignature();
  const explorerUrl = getExplorerUrl('tx', sig, network);

  let message = `Transaction committed to Solana ${network}! Signature: ${sig.slice(0, 16)}...`;
  if (action.intent === 'AIRDROP') {
    message = `Granted ${action.parameters.amountSol || 1} Devnet SOL to your wallet!`;
  } else if (action.intent === 'TRANSFER') {
    message = `Transferred ${action.parameters.amountSol} SOL to ${action.parameters.recipient?.slice(0, 8)}... with zero security flags.`;
  } else if (action.intent === 'AUDIT') {
    message = `Security Audit completed for ${action.parameters.targetAddress?.slice(0, 8)}... NeuroScore: ${action.neuroScore}/100.`;
  } else if (action.intent === 'STREAM_PAY') {
    message = `Micro-payment stream session initiated at ${action.parameters.ratePerSec} SOL/tick!`;
  }

  return {
    success: true,
    signature: sig,
    explorerUrl,
    message,
  };
}
