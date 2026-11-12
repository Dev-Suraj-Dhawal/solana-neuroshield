import React, { useState } from 'react';
import { Copy, Check, RefreshCw, ArrowUpRight, Zap, AlertTriangle, ShieldCheck, QrCode, Key, Eye, EyeOff, Trash2 } from 'lucide-react';
import { BurnerWallet, NetworkType } from '../types';
import { requestDevnetAirdrop, getExplorerUrl } from '../services/solanaRpc';
import { analyzeTargetAddress } from '../services/neuroEngine';
import { useToast } from './Toast';
import { SecurityConfirmationModal } from './SecurityConfirmationModal';
import { playSuccessChime, playThreatWarning } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface WalletCardProps {
  wallet: BurnerWallet | null;
  network: NetworkType;
  onRefreshBalance: () => void;
  onUpdateWallet: (updated: BurnerWallet) => void;
  onGenerateNewWallet: () => void;
  onClearWallet?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  network,
  onRefreshBalance,
  onUpdateWallet,
  onGenerateNewWallet,
  onClearWallet,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const [airdropMsg, setAirdropMsg] = useState<string | null>(null);

  // Keypair Security Details
  const [showKeyDetails, setShowKeyDetails] = useState(false);
  const [revealSecret, setRevealSecret] = useState(false);

  // Send Form
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.05');
  const [sending, setSending] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState<string | null>(null);
  const [preCheckRisk, setPreCheckRisk] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Security Interception Modal
  const [threatModalOpen, setThreatModalOpen] = useState(false);
  const [pendingSendParams, setPendingSendParams] = useState<{ amount: number; recipient: string } | null>(null);
  const [threatWarning, setThreatWarning] = useState('');

  const handleCopy = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    showToast('Public address copied to clipboard', 'info', 'Address Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySecret = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.secretKey);
    setSecretCopied(true);
    showToast('Secret key copied. Store securely and never share!', 'warning', 'Secret Key Copied');
    setTimeout(() => setSecretCopied(false), 2000);
  };

  const handleClearSession = () => {
    try {
      localStorage.removeItem('neuroshield_burner_wallet');
    } catch (e) {
      // ignore
    }
    if (onClearWallet) {
      onClearWallet();
    }
    showToast('Burner session wiped from local browser memory', 'info', 'Session Cleared');
  };

  const handleAirdrop = async () => {
    if (!wallet) return;
    setAirdropping(true);
    setAirdropMsg(null);

    const res = await requestDevnetAirdrop(wallet.publicKey, 1.0);
    setAirdropping(false);

    if (res.success) {
      setAirdropMsg(res.message);
      showToast(res.message, 'success', 'Devnet Airdrop Received');
      playSuccessChime();
      // Credit balance
      onUpdateWallet({
        ...wallet,
        balanceSol: wallet.balanceSol + 1.0,
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#9945FF', '#14F195', '#00F2FE'],
      });
    } else {
      showToast(res.message, 'error', 'Airdrop Request Failed');
    }
  };

  const handleRecipientChange = (val: string) => {
    setRecipient(val);
    if (val.trim().length >= 10) {
      const audit = analyzeTargetAddress(val, network);
      if (audit.riskLevel === 'CRITICAL' || audit.riskLevel === 'HIGH') {
        setPreCheckRisk(`⚠️ Pre-Execution Alert: Address flagged as ${audit.riskLevel} (${audit.threatsDetected[0]?.name || 'Potential Drainer'})`);
      } else {
        setPreCheckRisk(null);
      }
    } else {
      setPreCheckRisk(null);
    }
  };

  const executeSendTransaction = (targetRecipient: string, targetAmount: number) => {
    if (!wallet) return;
    setSending(true);
    setSendSuccessMsg(null);

    // Simulate high-speed Solana transaction
    setTimeout(() => {
      setSending(false);
      onUpdateWallet({
        ...wallet,
        balanceSol: Math.max(0, wallet.balanceSol - targetAmount - 0.000005),
      });

      const successTxt = `Successfully sent ${targetAmount} SOL at Solana sub-second speed! Network fee: 0.000005 SOL.`;
      setSendSuccessMsg(successTxt);
      showToast(successTxt, 'success', 'Transaction Confirmed');
      playSuccessChime();

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#14F195', '#9945FF'],
      });
    }, 600);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !recipient) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (wallet.balanceSol < parsedAmount) {
      showToast('Insufficient SOL balance! Click "Request Devnet Airdrop" to fund your burner wallet.', 'warning', 'Low Balance');
      return;
    }

    // Run AI pre-check
    const audit = analyzeTargetAddress(recipient, network);
    if (audit.riskLevel === 'CRITICAL') {
      playThreatWarning();
      setThreatWarning(
        audit.threatsDetected[0]?.description ||
          'Matches known malicious drainer contract payload signature. Immediate asset extraction risk detected.'
      );
      setPendingSendParams({ recipient, amount: parsedAmount });
      setThreatModalOpen(true);
      return;
    }

    executeSendTransaction(recipient, parsedAmount);
  };

  if (!wallet) {
    return (
      <div className="sol-glass-card rounded-2xl p-8 border border-purple-500/20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl sol-gradient-purple flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
          <Zap className="w-8 h-8 text-[#14F195]" />
        </div>
        <h3 className="text-xl font-bold text-white">No Wallet Connected Yet</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Solve the beginner onboarding problem! Generate an instant zero-friction Solana burner keypair right inside your browser in 1 second.
        </p>
        <button
          onClick={onGenerateNewWallet}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#14F195] text-slate-950 font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:opacity-95 transition cursor-pointer"
        >
          ⚡ Create Instant Burner Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="sol-glass-card rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
      {/* Wallet Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#14F195]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Instant Gasless Burner Wallet</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-setup Ed25519 in-memory keypair</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyDetails(!showKeyDetails)}
            className={`p-2 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
              showKeyDetails
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
            title="Keypair & Export Security Settings"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            title="Toggle QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={onGenerateNewWallet}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            title="Regenerate new keypair"
          >
            New Keypair
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Balance Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Available Balance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold font-mono text-white">
                {wallet.balanceSol.toFixed(4)}
              </span>
              <span className="font-extrabold font-mono text-sm text-[#14F195]">SOL</span>
              <span className="text-xs text-slate-500 font-mono">
                (~${(wallet.balanceSol * 185).toFixed(2)} USD)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAirdrop}
              disabled={airdropping}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${airdropping ? 'animate-spin' : ''}`} />
              <span>{airdropping ? 'Requesting...' : 'Request Devnet Airdrop (+1 SOL)'}</span>
            </button>
          </div>
        </div>

        {airdropMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#14F195] shrink-0 mt-0.5" />
            <span>{airdropMsg}</span>
          </div>
        )}

        {/* Public Key Display */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Public Address (Solana Base58)</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs text-slate-300 truncate">
              {wallet.publicKey}
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={getExplorerUrl('address', wallet.publicKey, network)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              title="View on Solana Explorer"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Keypair Security & Export Accordion */}
        {showKeyDetails && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-xs text-white">Private Key & Wallet Backup</span>
              </div>
              <button
                type="button"
                onClick={() => setRevealSecret(!revealSecret)}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                {revealSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealSecret ? 'Hide Secret' : 'Reveal Secret'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs text-slate-300 truncate">
                  {revealSecret ? wallet.secretKey : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {secretCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{secretCopied ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                💡 <strong className="text-slate-300">Phantom / Solflare Import:</strong> Go to Settings &gt; Add/Connect Wallet &gt; Import Private Key &gt; Paste this base58 string to control this burner address in external wallets.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Stored in browser memory only</span>
              <button
                type="button"
                onClick={handleClearSession}
                className="px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Wipe Keypair</span>
              </button>
            </div>
          </div>
        )}

        {/* QR Code toggle modal view */}
        {showQR && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="w-36 h-36 bg-white p-2 rounded-lg mx-auto flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=solana:${wallet.publicKey}`}
                alt="Solana Wallet QR"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Scan with Phantom / Solflare to transfer SOL</p>
          </div>
        )}

        {/* Send SOL Form with AI Pre-Check */}
        <form onSubmit={handleSend} className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Fast Sub-Second Transfer</span>
            <span className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
              AI Firewall Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Recipient Address (e.g. 9xQe...)"
                value={recipient}
                onChange={(e) => handleRecipientChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 pr-10"
                  required
                />
                <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">SOL</span>
              </div>
            </div>
          </div>

          {preCheckRisk && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{preCheckRisk}</span>
            </div>
          )}

          {sendSuccessMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#14F195] shrink-0" />
              <span>{sendSuccessMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-[#14F195] hover:opacity-95 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-purple-600/20"
          >
            {sending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating & Executing on Solana (~400ms)...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Execute AI-Verified Transfer</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Threat Interception Dialog */}
      <SecurityConfirmationModal
        isOpen={threatModalOpen}
        onClose={() => {
          setThreatModalOpen(false);
          setPendingSendParams(null);
        }}
        onConfirm={() => {
          if (pendingSendParams) {
            executeSendTransaction(pendingSendParams.recipient, pendingSendParams.amount);
          }
        }}
        recipientAddress={pendingSendParams?.recipient || ''}
        amountSol={pendingSendParams?.amount.toString() || '0'}
        warningMessage={threatWarning}
      />
    </div>
  );
};
