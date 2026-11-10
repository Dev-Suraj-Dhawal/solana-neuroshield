import React from 'react';
import { X, Award, CheckCircle2, Cpu, Zap, Lock, Gamepad2, Trophy, ExternalLink, ShieldCheck } from 'lucide-react';

interface HackathonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDrawer: React.FC<HackathonDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto sol-glass-card rounded-2xl border border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl sol-gradient-purple flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Trophy className="w-6 h-6 text-[#14F195]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Solana Hackathon 2026 Submission
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICIAL ENTRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Built for MLH & Solana Online Hackathon (Nov 6–8, 2026)
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Problem Statement & Innovation
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Millions of crypto users lose funds annually to malicious drainer contracts, phishing signatures, and deceptive approval hooks. Meanwhile, traditional blockchains charge several dollars in gas for simple transactions, making high-frequency micro-payments and autonomous AI agent actions economically impossible.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">Solana NeuroShield AI</strong> solves this by pairing Solana’s 400ms sub-cent execution with an autonomous AI pre-execution firewall and prompt-to-action agent.
          </p>
        </div>

        {/* 5 Prize Category Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Prize Category Alignment (All 5 Categories)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* AI Track */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  AI Track Top Prize ($100)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% MATCH</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Autonomous heuristic AI threat classifier that inspects Solana transaction simulation buffers, scores drainer risks (0-100), and translates natural language prompts into verified on-chain actions.
              </p>
            </div>

            {/* Best Beginner Hack */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Best Beginner Hack ($100)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% MATCH</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Solves Web3 onboarding friction: in-browser 1-click burner wallet generation with built-in Devnet airdrop faucet funding. Zero extensions or seed phrase hassle needed to start building.
              </p>
            </div>

            {/* DeFi Track */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  DeFi Track Top Prize ($100)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% MATCH</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Real-time micro-payment streaming protocol and token honeypot defense that safeguards DEX swaps, liquidity pools, and slippage vulnerabilities.
              </p>
            </div>

            {/* Gaming Track */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  Gaming Track Top Prize ($100)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% MATCH</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Sub-second micro-tick streaming allows game engines to stream fractions of a cent per action (pay-per-move, real-time arcade betting, instant item rewards).
              </p>
            </div>

            {/* Top 3 Overall */}
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-gradient-to-r from-purple-900/30 via-slate-900/60 to-emerald-900/30 border border-purple-500/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Top 3 Overall ($1,000 USD Microgrant)
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">PRIME CANDIDATE</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Production-grade architecture, responsive design engineered for low-end mobile hardware, real Devnet RPC integration, dynamic GitHub deployment, and pristine user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-slate-200">🛠️ Technical Stack & Implementation:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-white block">Solana Web3</strong>
              Devnet RPC / Keypairs
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-white block">AI Engine</strong>
              Pre-Execution Heuristics
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-white block">Frontend</strong>
              React 19 + Vite 8
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-white block">Optimization</strong>
              Hardware Accelerated
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <div className="text-slate-400">
            Author:{' '}
            <a
              href="https://github.com/Dev-Suraj-Dhawal"
              target="_blank"
              rel="author me external noopener noreferrer"
              className="text-[#14F195] hover:underline font-bold transition inline-flex items-center gap-1"
              title="Suraj Dhawal - Official GitHub Profile"
            >
              Suraj Dhawal <span className="text-slate-500 font-mono text-[10px]">(@Dev-Suraj-Dhawal)</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
