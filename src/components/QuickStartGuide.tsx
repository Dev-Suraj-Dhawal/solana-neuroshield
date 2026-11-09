import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Zap, ShieldAlert, Bot, Flame, X } from 'lucide-react';

interface QuickStartGuideProps {
  hasWallet: boolean;
  onGenerateWallet: () => void;
  onSelectTab: (tab: 'scanner' | 'agent' | 'stream' | 'activity') => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({
  hasWallet,
  onGenerateWallet,
  onSelectTab,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    wallet: hasWallet,
    scanner: false,
    agent: false,
    stream: false,
  });

  const isWalletDone = hasWallet || completedSteps.wallet;
  const isScannerDone = completedSteps.scanner;
  const isAgentDone = completedSteps.agent;
  const isStreamDone = completedSteps.stream;

  const totalDone = [isWalletDone, isScannerDone, isAgentDone, isStreamDone].filter(Boolean).length;
  const progressPercent = Math.round((totalDone / 4) * 100);

  const handleStepClick = (step: 'scanner' | 'agent' | 'stream') => {
    setCompletedSteps((prev) => ({ ...prev, [step]: true }));
    onSelectTab(step);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-6">
      <div className="sol-glass rounded-2xl border border-purple-500/25 overflow-hidden shadow-xl bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-emerald-950/20">
        {/* Toggle Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/30 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#14F195]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight">
                  Quick-Start Interactive Tour
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#14F195] border border-emerald-500/20">
                  {progressPercent}% COMPLETE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Zero-risk devnet walkthrough: Test all 4 Solana core features in under 60 seconds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress mini bar */}
            <div className="hidden sm:flex items-center gap-2 w-32">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-[#14F195] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">{totalDone}/4</span>
            </div>

            <button
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              aria-label={isOpen ? 'Collapse Guide' : 'Expand Guide'}
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 pt-1 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1: Burner Keypair */}
            <div
              className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                isWalletDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Step 1
                  </span>
                  {isWalletDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generate Burner Keypair</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Instant zero-friction in-memory keypair pre-funded with 1 SOL.
                </p>
              </div>

              <div className="pt-2">
                {isWalletDone ? (
                  <span className="text-[10px] font-mono text-[#14F195] font-semibold">
                    ✓ Funded & Active
                  </span>
                ) : (
                  <button
                    onClick={onGenerateWallet}
                    className="w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-[#14F195] text-slate-950 font-bold text-[11px] hover:opacity-95 transition cursor-pointer"
                  >
                    ⚡ Create Keypair (1s)
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: AI Pre-Execution Scanner */}
            <div
              className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                isScannerDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Step 2
                  </span>
                  {isScannerDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  <span>Simulate Drainer Attack</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Run sub-400ms payload heuristic audit on known malicious honeypots.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleStepClick('scanner')}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[11px] border border-purple-500/20 transition cursor-pointer"
                >
                  {isScannerDone ? '✓ Retest Sentinel' : 'Launch Threat Sentinel'}
                </button>
              </div>
            </div>

            {/* Step 3: Natural Language Agent */}
            <div
              className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                isAgentDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Step 3
                  </span>
                  {isAgentDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Prompt-to-Solana Agent</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Turn plain-English instructions into verified Solana Devnet transactions.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleStepClick('agent')}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] border border-cyan-500/20 transition cursor-pointer"
                >
                  {isAgentDone ? '✓ Retest Agent' : 'Launch AI Agent'}
                </button>
              </div>
            </div>

            {/* Step 4: Micro-Payment Stream */}
            <div
              className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                isStreamDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Step 4
                  </span>
                  {isStreamDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#14F195]" />
                  <span>Sub-Cent Streamer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Experience real-time value flow powered by Solana's 400ms finality.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleStepClick('stream')}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#14F195] font-bold text-[11px] border border-emerald-500/20 transition cursor-pointer"
                >
                  {isStreamDone ? '✓ Stream Active' : 'Start Micro-Stream'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
