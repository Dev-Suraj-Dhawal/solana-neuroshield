import React, { useState } from 'react';
import { X, Printer, Copy, Check, ShieldCheck, Key, QrCode, AlertTriangle } from 'lucide-react';
import { BurnerWallet, NetworkType } from '../types';
import { useToast } from './Toast';
import { playSuccessChime } from '../services/soundEffects';

interface PaperWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: BurnerWallet | null;
  network: NetworkType;
}

export const PaperWalletModal: React.FC<PaperWalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  network,
}) => {
  const { showToast } = useToast();
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || !wallet) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAll = () => {
    const backupText = `=========================================
SOLANA NEUROSHIELD PAPER WALLET BACKUP
=========================================
Network: ${network.toUpperCase()}
Generated: ${wallet.createdTime}
Public Address: ${wallet.publicKey}
Secret Key (Ed25519 Base58): ${wallet.secretKey}
=========================================
IMPORT INSTRUCTIONS:
Open Phantom or Solflare -> Settings -> Add / Connect Wallet -> Import Private Key -> Paste the secret key string above.
=========================================`;

    navigator.clipboard.writeText(backupText);
    setCopiedAll(true);
    playSuccessChime();
    showToast('Complete paper wallet backup copied to clipboard', 'success', 'Backup Copied');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#141728] to-[#090b14] border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paper-wallet-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-[#14F195]">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  COLD STORAGE BACKUP
                </span>
                <span className="text-xs text-slate-400 font-mono">Ed25519 Curve</span>
              </div>
              <h3 id="paper-wallet-title" className="text-xl font-extrabold text-white mt-0.5">
                Printable Paper Wallet Certificate
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Paper Certificate Frame */}
        <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-purple-500/40 space-y-6 print:border-black print:bg-white print:text-black">
          {/* Certificate Title & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-black tracking-widest text-[#14F195] uppercase">
                ⚡ SOLANA NEUROSHIELD
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">Air-Gapped Keypair Backup</h4>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-400">
              <div>Network: <strong className="text-white">{network.toUpperCase()}</strong></div>
              <div>Created: {new Date(wallet.createdTime).toLocaleDateString()}</div>
            </div>
          </div>

          {/* QR Code and Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Public Address */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-center">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Public Address (Receive SOL)
              </span>
              <div className="w-32 h-32 bg-white p-2 rounded-lg mx-auto flex items-center justify-center shadow">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=solana:${wallet.publicKey}`}
                  alt="Public Key QR"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 break-all select-all">
                {wallet.publicKey}
              </div>
            </div>

            {/* Secret Key */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-center">
              <span className="text-xs font-bold text-rose-300 block uppercase tracking-wider flex items-center justify-center gap-1">
                <Key className="w-3.5 h-3.5 text-rose-400" />
                <span>Secret Key (Never Share)</span>
              </span>
              <div className="w-32 h-32 bg-white p-2 rounded-lg mx-auto flex items-center justify-center shadow">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${wallet.secretKey}`}
                  alt="Secret Key QR"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-rose-300 break-all select-all">
                {wallet.secretKey}
              </div>
            </div>
          </div>

          {/* Security Advisory Checklist */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#14F195]" />
              <span>Cold Storage Instructions:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 leading-relaxed">
              <li>Keep this paper certificate in a secure physical location away from moisture and direct sunlight.</li>
              <li>To restore this account, open <strong>Phantom</strong> or <strong>Solflare</strong>, choose <em>"Add Wallet &gt; Import Private Key"</em>, and scan the Secret Key QR code.</li>
              <li>This in-memory keypair is not tracked on any centralized server. Losing this paper backup means permanent loss of access if your browser cache clears.</li>
            </ul>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#14F195] hover:opacity-95 text-slate-950 font-extrabold text-xs transition cursor-pointer shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF Certificate</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Backup Copied' : 'Copy Backup Text'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
