import React, { useState, useEffect, useRef } from 'react';
import { Flame, Play, Pause, RotateCcw, Zap, ExternalLink, ArrowUpRight, Activity, ShieldCheck } from 'lucide-react';
import { BurnerWallet, NetworkType } from '../types';
import { generateMockTxSignature, getExplorerUrl } from '../services/solanaRpc';
import { playSuccessChime } from '../services/soundEffects';
import { useToast } from './Toast';

interface MicroStreamCardProps {
  wallet: BurnerWallet | null;
  network: NetworkType;
  onDeductBalance: (amount: number) => void;
  isCircuitBreakerActive?: boolean;
}

interface StreamTick {
  id: string;
  timestamp: string;
  amountSol: number;
  txSignature: string;
}

export const MicroStreamCard: React.FC<MicroStreamCardProps> = ({
  wallet,
  network,
  onDeductBalance,
  isCircuitBreakerActive = false,
}) => {
  const { showToast } = useToast();
  const [isStreaming, setIsStreaming] = useState(false);
  const [ratePerTick, setRatePerTick] = useState(0.0002); // 0.0002 SOL per tick
  const [budgetCapSol, setBudgetCapSol] = useState<number | null>(0.005); // Auto-cut off cap
  const [ticksCount, setTicksCount] = useState(0);
  const [totalStreamed, setTotalStreamed] = useState(0);
  const [recentTicks, setRecentTicks] = useState<StreamTick[]>([]);
  const intervalRef = useRef<number | null>(null);

  const startStream = () => {
    if (isCircuitBreakerActive) {
      showToast('Stream blocked: Emergency Circuit Breaker is active! Disengage to stream value.', 'error', 'Circuit Breaker Active');
      return;
    }
    if (!wallet || wallet.balanceSol < ratePerTick) {
      showToast('Your wallet balance is too low to stream. Request a Devnet Airdrop in the wallet card!', 'warning', 'Insufficient Balance');
      return;
    }
    setIsStreaming(true);
    showToast(`Micro-payment stream started (${ratePerTick} SOL/tick)`, 'success', 'Streaming Active');
  };

  const pauseStream = () => {
    setIsStreaming(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    showToast('Micro-payment stream paused', 'info', 'Stream Paused');
  };

  const resetStream = () => {
    pauseStream();
    setTicksCount(0);
    setTotalStreamed(0);
    setRecentTicks([]);
    showToast('Stream counters reset', 'info', 'Stream Reset');
  };

  // Auto-pause if Circuit Breaker is engaged while streaming
  useEffect(() => {
    if (isCircuitBreakerActive && isStreaming) {
      pauseStream();
    }
  }, [isCircuitBreakerActive, isStreaming]);

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = window.setInterval(() => {
        // Stop if wallet depleted
        if (wallet && wallet.balanceSol <= ratePerTick) {
          pauseStream();
          showToast('Stream paused: Wallet balance depleted.', 'warning', 'Balance Depleted');
          return;
        }

        // Auto-conclude if budget cap reached
        if (budgetCapSol !== null && totalStreamed + ratePerTick >= budgetCapSol) {
          const finalTickAmount = Number((budgetCapSol - totalStreamed).toFixed(6));
          if (finalTickAmount > 0) {
            const sig = generateMockTxSignature();
            const tick: StreamTick = {
              id: 'TICK-' + Math.random().toString(36).substring(2, 7),
              timestamp: new Date().toLocaleTimeString(),
              amountSol: finalTickAmount,
              txSignature: sig,
            };
            setTicksCount((c) => c + 1);
            setTotalStreamed(budgetCapSol);
            onDeductBalance(finalTickAmount);
            setRecentTicks((prev) => [tick, ...prev.slice(0, 5)]);
          }
          setIsStreaming(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          playSuccessChime();
          showToast(`Stream concluded: Reached budget cap of ${budgetCapSol} SOL`, 'success', 'Cap Reached');
          return;
        }

        const sig = generateMockTxSignature();
        const tick: StreamTick = {
          id: 'TICK-' + Math.random().toString(36).substring(2, 7),
          timestamp: new Date().toLocaleTimeString(),
          amountSol: ratePerTick,
          txSignature: sig,
        };

        setTicksCount((c) => c + 1);
        setTotalStreamed((prev) => prev + ratePerTick);
        onDeductBalance(ratePerTick);
        setRecentTicks((prev) => [tick, ...prev.slice(0, 5)]);
      }, 800); // 800ms stream interval
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, ratePerTick, wallet, budgetCapSol, totalStreamed]);

  return (
    <div className="sol-glass-card rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#14F195]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">Real-Time Solana Micro-Payment Stream</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                DEFI & GAMING TRACK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuous sub-cent value transfers made possible only by Solana's sub-second finality
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isStreaming ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#14F195]"></span>
              STREAMING ACTIVE
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs font-mono">
              STANDBY
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Stream Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Value Streamed</span>
            <div className="text-2xl font-black font-mono text-[#14F195]">
              {totalStreamed.toFixed(5)} <span className="text-xs font-bold">SOL</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              ~${(totalStreamed * 185).toFixed(4)} USD
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Settled Micro-Ticks</span>
            <div className="text-2xl font-black font-mono text-cyan-300">
              {ticksCount}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              @ 800ms interval rate
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Estimated Gas Cost</span>
            <div className="text-2xl font-black font-mono text-purple-300">
              {(ticksCount * 0.000005).toFixed(6)} <span className="text-xs font-bold">SOL</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              &lt; 0.0001% of transaction value
            </span>
          </div>
        </div>

        {/* Stream Controls */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-300 font-medium">Tick Size:</label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { rate: 0.0001, usd: '$0.02' },
                  { rate: 0.0002, usd: '$0.04' },
                  { rate: 0.0005, usd: '$0.09' },
                  { rate: 0.001, usd: '$0.18' },
                ].map(({ rate, usd }) => (
                  <button
                    key={rate}
                    onClick={() => setRatePerTick(rate)}
                    disabled={isStreaming}
                    title={`Stream ${rate} SOL (~${usd}) per tick`}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition cursor-pointer ${
                      ratePerTick === rate
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{rate} SOL</span>
                    <span className="text-[10px] opacity-75 ml-1">({usd})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isStreaming ? (
                <button
                  onClick={startStream}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-[#14F195] text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-purple-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Stream</span>
                </button>
              ) : (
                <button
                  onClick={pauseStream}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Stream</span>
                </button>
              )}

              <button
                onClick={resetStream}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Reset Stream"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Budget Escrow Cap Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
                <span>Budget Escrow Cap:</span>
              </span>
              <div className="flex gap-1.5">
                {[
                  { label: '0.005 SOL', value: 0.005 },
                  { label: '0.01 SOL', value: 0.01 },
                  { label: '0.05 SOL', value: 0.05 },
                  { label: 'Unlimited', value: null },
                ].map((cap) => (
                  <button
                    key={cap.label}
                    onClick={() => setBudgetCapSol(cap.value)}
                    disabled={isStreaming}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                      budgetCapSol === cap.value
                        ? 'bg-emerald-500/20 text-[#14F195] border border-emerald-500/40 font-bold'
                        : 'bg-slate-800/60 text-slate-400 border border-transparent hover:text-slate-200'
                    }`}
                  >
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {budgetCapSol ? `Auto-concludes at ${budgetCapSol} SOL` : 'No automatic ceiling'}
            </span>
          </div>

          {/* Animated Progress Bar when Cap is Set */}
          {budgetCapSol !== null && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Cap Utilization</span>
                <span className="text-[#14F195] font-bold">
                  {((totalStreamed / budgetCapSol) * 100).toFixed(1)}% (
                  {totalStreamed.toFixed(5)} / {budgetCapSol} SOL)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-[#14F195] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (totalStreamed / budgetCapSol) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Stream Micro-Ticks Feed */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-400 block">
            Real-Time Settlement Feed (Last 5 Ticks)
          </span>

          {recentTicks.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-500 font-mono">
              Press "Start Stream" above to broadcast live Solana micro-transactions.
            </div>
          ) : (
            <div className="space-y-1.5 font-mono text-xs">
              {recentTicks.map((tick) => (
                <div
                  key={tick.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#14F195]" />
                    <span className="text-white font-bold">{tick.amountSol} SOL</span>
                    <span className="text-slate-500 text-[10px]">[{tick.timestamp}]</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                      {tick.txSignature}
                    </span>
                    <a
                      href={getExplorerUrl('tx', tick.txSignature, network)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
