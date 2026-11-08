import React from 'react';
import { ShieldCheck, Zap, Bot, ArrowRight, Lock, Flame, Cpu, Terminal } from 'lucide-react';
import { NetworkTelemetry } from '../types';

interface HeroSectionProps {
  telemetry: NetworkTelemetry;
  onSelectTab: (tab: 'scanner' | 'agent' | 'stream' | 'wallet') => void;
  onGenerateWallet: () => void;
  hasWallet: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  telemetry,
  onSelectTab,
  onGenerateWallet,
  hasWallet,
}) => {
  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-600/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* MLH Hackathon Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#14F195] animate-ping" />
          <span className="font-semibold text-white">Solana Hackathon 2026</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400">Competing in 5 Prize Tracks</span>
        </div>

        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Autonomous{' '}
              <span className="sol-gradient-text">AI Pre-Execution Firewall</span>{' '}
              & Instant Micro-Payments on Solana
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Never sign a malicious drainer contract or blind approval again.
              <strong className="text-white"> NeuroShield AI</strong> inspects instruction payloads in sub-400ms,
              scores honeypot risks, and enables zero-friction instant micro-payment streams powered by Solana speed.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!hasWallet ? (
                <button
                  onClick={onGenerateWallet}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#14F195] text-slate-950 font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:opacity-95 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Generate Instant Gasless Wallet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onSelectTab('scanner')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#14F195] text-slate-950 font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:opacity-95 transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Launch AI Pre-Execution Scanner</span>
                </button>
              )}

              <button
                onClick={() => onSelectTab('agent')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl sol-glass hover:bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold transition cursor-pointer"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Prompt-to-Solana Agent</span>
              </button>

              <button
                onClick={() => onSelectTab('stream')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl sol-glass hover:bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold transition cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#14F195]" />
                <span>Micro-Payment Streamer</span>
              </button>
            </div>

            {/* Hackathon Category Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-purple-500/30 text-purple-300 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                AI Track Top Prize ($100)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Best Beginner Hack ($100)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                DeFi Track Top Prize ($100)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-amber-500/30 text-amber-300 font-medium flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Top 3 Overall ($1,000 Microgrant)
              </span>
            </div>
          </div>

          {/* Hero Live Telemetry Card */}
          <div className="lg:col-span-4">
            <div className="sol-glass-card rounded-2xl p-5 border border-purple-500/20 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14F195]"></span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    Solana Devnet Live RPC
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  99.98% UPTIME
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-0.5">Real-Time Throughput</div>
                  <div className="text-2xl font-black font-mono text-[#14F195]">
                    {telemetry.tps.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Transactions / Sec</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-0.5">Slot Settlement</div>
                  <div className="text-2xl font-black font-mono text-cyan-300">
                    {telemetry.blockTimeMs}ms
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sub-second Finality</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-0.5">Avg Network Fee</div>
                  <div className="text-lg font-bold font-mono text-purple-300">
                    $0.00025
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">0.000005 SOL</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-0.5">Current Epoch</div>
                  <div className="text-lg font-bold font-mono text-amber-300">
                    #{telemetry.epoch}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Slot: {telemetry.slot.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#14F195]" />
                  <span>AI Pre-Execution Defense:</span>
                </span>
                <span className="font-bold text-emerald-400">ACTIVE & SECURED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
