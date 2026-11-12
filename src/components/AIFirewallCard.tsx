import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Bug, Terminal, ChevronRight, Zap } from 'lucide-react';
import { SecurityAuditResult, NetworkType } from '../types';
import { PRESET_CONTRACTS, analyzeTargetAddress } from '../services/neuroEngine';
import { playThreatWarning, playSuccessChime } from '../services/soundEffects';

interface AIFirewallCardProps {
  network: NetworkType;
}

export const AIFirewallCard: React.FC<AIFirewallCardProps> = ({ network }) => {
  const [addressInput, setAddressInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(() =>
    analyzeTargetAddress(PRESET_CONTRACTS[0].address, network)
  );

  const handleScan = (addrToScan?: string) => {
    const target = addrToScan || addressInput;
    if (!target) return;

    setScanning(true);
    setTimeout(() => {
      const result = analyzeTargetAddress(target, network);
      setAuditResult(result);
      setScanning(false);
      if (result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH') {
        playThreatWarning();
      } else {
        playSuccessChime();
      }
    }, 400); // Solana ~400ms speed
  };

  const selectPreset = (address: string) => {
    setAddressInput(address);
    handleScan(address);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#14F195] border-[#14F195]/40 bg-[#14F195]/10';
    if (score >= 50) return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
    return 'text-rose-500 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="sol-glass-card rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">AI Pre-Execution Threat Sentinel</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI TRACK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Heuristic threat engine inspecting Solana instruction simulation & drainer signatures
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Presets Quick Picker */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block">
            Test Preset Attack Vectors & Verified Contracts
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_CONTRACTS.map((preset, idx) => {
              const typeColor = {
                SAFE: 'bg-emerald-500/15 text-[#14F195] border-emerald-500/30',
                DRAINER: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
                HONEYPOT: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                MICROPAY: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
              }[preset.type];

              return (
                <button
                  key={idx}
                  onClick={() => selectPreset(preset.address)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    addressInput === preset.address
                      ? 'border-purple-500 bg-purple-950/40 shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-200">{preset.label}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${typeColor}`}>
                      {preset.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input & Scan Button */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">
            Or Paste Custom Solana Address / Program ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Drainer7bN3x9KLe7bHqp8YF2ZtK9wK4m6P2pQqLmn9"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleScan()}
              disabled={scanning}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-purple-600/30"
            >
              {scanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#14F195]" />
                  <span>Scan Contract</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results View */}
        {auditResult && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            {/* Top Bar: Score & Risk Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-mono ${getScoreColor(
                    auditResult.score
                  )}`}
                >
                  <span className="text-xl font-black">{auditResult.score}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider">Score</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-md border ${
                        auditResult.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : auditResult.riskLevel === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {auditResult.riskLevel} THREAT LEVEL
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Badge: {auditResult.reputationBadge}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 truncate max-w-xs sm:max-w-md">
                    Target: {auditResult.targetAddress}
                  </div>
                </div>
              </div>

              {/* Simulation balance impact */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Simulated Balance Delta
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    auditResult.simulatedBalanceChangeSol < -0.5
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }`}
                >
                  {auditResult.simulatedBalanceChangeSol} SOL
                </span>
              </div>
            </div>

            {/* Natural Language Summary */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
              {auditResult.riskLevel === 'CRITICAL' || auditResult.riskLevel === 'HIGH' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#14F195] shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="text-white">AI Verdict: </strong>
                {auditResult.summary}
              </div>
            </div>

            {/* Threat Vectors Detailed Breakdown */}
            {auditResult.threatsDetected.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Detected Risk Vectors ({auditResult.threatsDetected.length}):
                </span>
                <div className="space-y-2">
                  {auditResult.threatsDetected.map((thr) => (
                    <div
                      key={thr.id}
                      className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center gap-1.5">
                          <Bug className="w-3.5 h-3.5 text-rose-400" />
                          {thr.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                          {thr.severity}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{thr.description}</p>
                      <div className="text-[11px] text-amber-300/90 pt-1 font-mono">
                        💡 Mitigation: {thr.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#14F195]" />
                <span>Zero malicious vectors identified. Contract signature clean.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
