import React, { useState } from 'react';
import { Shield, Zap, ExternalLink, Activity, Sparkles, Award, ShieldCheck, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { NetworkTelemetry, NetworkType, BurnerWallet } from '../types';
import { getSoundEnabled, setSoundEnabled, playShieldActivate } from '../services/soundEffects';

interface NavbarProps {
  network: NetworkType;
  setNetwork: (n: NetworkType) => void;
  telemetry: NetworkTelemetry;
  wallet: BurnerWallet | null;
  onOpenSubmissionModal: () => void;
  onOpenBenchmarkModal: () => void;
  isCircuitBreakerActive: boolean;
  onToggleCircuitBreaker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  network,
  setNetwork,
  telemetry,
  wallet,
  onOpenSubmissionModal,
  onOpenBenchmarkModal,
  isCircuitBreakerActive,
  onToggleCircuitBreaker,
}) => {
  const [isSoundOn, setIsSoundOn] = useState(getSoundEnabled());

  const handleToggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    setSoundEnabled(next);
    if (next) playShieldActivate();
  };
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
              Solana Autonomous Security & Micro-Payments Engine · by{' '}
              <a
                href="https://github.com/Dev-Suraj-Dhawal"
                target="_blank"
                rel="author me external noopener noreferrer"
                className="text-[#14F195] hover:underline font-semibold"
                title="Suraj Dhawal (@Dev-Suraj-Dhawal) Official Profile"
              >
                Suraj Dhawal
              </a>
            </p>
          </div>
        </div>

        {/* Live Network Telemetry & Zero-Risk Reassurance */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Zero Financial Risk Badge */}
          {network === 'devnet' && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-300"
              title="Devnet testnet mode active: Transactions use free test tokens. Zero real funds at risk."
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
              <span>Zero-Risk Sandbox</span>
            </div>
          )}

          <button
            onClick={onOpenBenchmarkModal}
            className="flex items-center gap-4 bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800 hover:border-purple-500/50 rounded-full px-4 py-1.5 text-xs text-slate-300 transition cursor-pointer group shadow-sm hover:shadow-purple-500/10"
            title="Click to open Live Cluster Benchmark & Gas Comparator"
          >
            <div
              className="flex items-center gap-1.5"
              title="Transactions Per Second currently processed by the Solana cluster"
            >
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse"></span>
              <span className="font-mono text-slate-400">TPS:</span>
              <span className="font-mono font-semibold text-[#14F195]">{telemetry.tps.toLocaleString()}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div
              className="flex items-center gap-1.5"
              title="Average block creation latency on Solana (~400 milliseconds)"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-slate-400">Latency:</span>
              <span className="font-mono text-cyan-300">{telemetry.blockTimeMs}ms</span>
            </div>
            <span className="text-slate-700">|</span>
            <div
              className="flex items-center gap-1.5"
              title="Predictable sub-cent Solana transaction fee"
            >
              <span className="font-mono text-slate-400">Fee:</span>
              <span className="font-mono text-purple-300">&lt;$0.0003</span>
            </div>
            <span className="hidden xl:inline-block text-[10px] font-mono text-purple-400 group-hover:text-purple-300 pl-1 border-l border-slate-800">
              ⚡ Benchmark
            </span>
          </button>
        </div>

        {/* Actions & Network Switch */}
        <div className="flex items-center gap-2.5">
          {/* Emergency Circuit Breaker Kill-Switch */}
          <button
            onClick={onToggleCircuitBreaker}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
              isCircuitBreakerActive
                ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/50 text-rose-300 animate-pulse shadow-lg shadow-rose-950/50'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-emerald-400'
            }`}
            title={
              isCircuitBreakerActive
                ? 'Circuit Breaker ENGAGED: Outbound transactions are locked. Click to restore normal operation.'
                : 'Emergency Circuit Breaker: Click to instantly freeze all outbound transactions.'
            }
          >
            {isCircuitBreakerActive ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span className="hidden sm:inline">CIRCUIT BREAKER ON</span>
                <span className="sm:hidden">LOCKED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
                <span className="hidden md:inline text-slate-400">Kill Switch</span>
              </>
            )}
          </button>

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

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title={isSoundOn ? 'Cyber Sound FX: Active (Click to mute)' : 'Cyber Sound FX: Muted (Click to enable)'}
            aria-label="Toggle Sound Effects"
          >
            {isSoundOn ? (
              <Volume2 className="w-4 h-4 text-[#14F195]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
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
