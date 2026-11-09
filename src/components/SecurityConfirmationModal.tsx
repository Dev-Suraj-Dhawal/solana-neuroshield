import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface SecurityConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientAddress: string;
  amountSol: string;
  warningMessage: string;
}

export const SecurityConfirmationModal: React.FC<SecurityConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipientAddress,
  amountSol,
  warningMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#180d19] to-[#0c0d14] border border-rose-500/40 p-6 shadow-2xl shadow-rose-950/50 space-y-5 text-left"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  CRITICAL RISK
                </span>
                <span className="text-xs text-slate-400">Heuristic Firewall Alert</span>
              </div>
              <h3 id="security-modal-title" className="text-lg font-extrabold text-white mt-0.5">
                Potential Malicious Destination
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

        {/* Warning detail box */}
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>AI Threat Analysis:</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-mono">
            {warningMessage}
          </p>
        </div>

        {/* Transaction Summary */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Intended Transfer:</span>
            <span className="font-mono font-bold text-white">{amountSol} SOL</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Flagged Recipient:</span>
            <span className="font-mono text-rose-300 text-[11px] truncate max-w-[240px]">
              {recipientAddress}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          NeuroShield recommends aborting this transfer. If this is a known test address, you may choose to force-execute the simulation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#14F195] text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Abort Transfer (Recommended)</span>
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
          >
            Force Send Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
