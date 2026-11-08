import React from 'react';
import { Shield, Zap, ExternalLink, Activity, Sparkles, Award } from 'lucide-react';
import { NetworkTelemetry, NetworkType, BurnerWallet } from '../types';

interface NavbarProps {
  network: NetworkType;
  setNetwork: (n: NetworkType) => void;
  telemetry: NetworkTelemetry;
  wallet: BurnerWallet | null;
  onOpenSubmissionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  network,
  setNetwork,
  telemetry,
  wallet,
  onOpenSubmissionModal,
}) => {
  return (
    <header className="sticky top-0 z-50 sol-glass border-b border-purple-500/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl sol-gradient-purple p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0d0f1a] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#14F195]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#14F195]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight sol-gradient-text">
                NEUROSHIELD
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI SENTINEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Solana Autonomous Security & Micro-Payments Engine
            </p>
          </div>
        </div>

        {/* Live Network Telemetry Pill */}
        <div className="hidden md:flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse"></span>
            <span className="font-mono text-slate-400">TPS:</span>
            <span className="font-mono font-semibold text-[#14F195]">{telemetry.tps.toLocaleString()}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-400">Latency:</span>
            <span className="font-mono text-cyan-300">{telemetry.blockTimeMs}ms</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-slate-400">Fee:</span>
            <span className="font-mono text-purple-300">&lt;$0.0003</span>
          </div>
        </div>

        {/* Actions & Network Switch */}
        <div className="flex items-center gap-2.5">
          {/* Hackathon Criteria Button */}
          <button
            onClick={onOpenSubmissionModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition cursor-pointer"
            title="View Solana Hackathon Submission Details"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Hackathon Track Criteria</span>
            <span className="sm:hidden">MLH</span>
          </button>

          {/* Network Switcher */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setNetwork('devnet')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                network === 'devnet'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Devnet
            </button>
            <button
              onClick={() => setNetwork('mainnet-beta')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                network === 'mainnet-beta'
                  ? 'bg-[#14F195] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mainnet
            </button>
          </div>

          {/* Wallet Balance Pill */}
          {wallet && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs">
              <Zap className="w-3.5 h-3.5 text-[#14F195]" />
              <span className="font-mono font-bold text-white">
                {wallet.balanceSol.toFixed(3)} SOL
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
