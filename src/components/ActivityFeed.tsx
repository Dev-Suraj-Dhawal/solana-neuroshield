import React, { useState } from 'react';
import { History, ShieldAlert, ArrowUpRight, CheckCircle2, Flame, Bot, Zap, ExternalLink, Trash2 } from 'lucide-react';
import { NetworkType } from '../types';
import { getExplorerUrl } from '../services/solanaRpc';

export interface ActivityEvent {
  id: string;
  type: 'AUDIT' | 'TRANSFER' | 'AIRDROP' | 'STREAM' | 'AGENT';
  title: string;
  description: string;
  timestamp: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  txSignature?: string;
  amountSol?: number;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  network: NetworkType;
  onClearEvents: () => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  events,
  network,
  onClearEvents,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'AUDIT' | 'TX'>('ALL');

  const filteredEvents = events.filter((ev) => {
    if (filter === 'AUDIT') return ev.type === 'AUDIT';
    if (filter === 'TX') return ev.type === 'TRANSFER' || ev.type === 'AIRDROP' || ev.type === 'STREAM' || ev.type === 'AGENT';
    return true;
  });

  return (
    <div className="sol-glass-card rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">Real-Time Security & Tx Activity Stream</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AUDIT LOG
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live chronological record of simulations, firewall alerts, and on-chain interactions
            </p>
          </div>
        </div>

        {events.length > 0 && (
          <button
            onClick={onClearEvents}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
            title="Clear Activity Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            All Activity ({events.length})
          </button>
          <button
            onClick={() => setFilter('AUDIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'AUDIT'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Security Sentinel Audits
          </button>
          <button
            onClick={() => setFilter('TX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'TX'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Transfers & Streams
          </button>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">No activity logged yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Scan a contract with the Threat Sentinel, test a prompt agent command, or trigger a micro-payment stream to see real-time receipts.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredEvents.map((ev) => {
              const statusBadge = {
                CRITICAL: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
                WARNING: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                SAFE: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                SUCCESS: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
              }[ev.status];

              const icon = {
                AUDIT: <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />,
                TRANSFER: <Zap className="w-4 h-4 text-[#14F195] shrink-0" />,
                AIRDROP: <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />,
                STREAM: <Flame className="w-4 h-4 text-amber-400 shrink-0" />,
                AGENT: <Bot className="w-4 h-4 text-purple-300 shrink-0" />,
              }[ev.type];

              return (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 mt-0.5">{icon}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-white">{ev.title}</span>
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${statusBadge}`}
                        >
                          {ev.status}
                        </span>
                        {ev.amountSol !== undefined && (
                          <span className="text-[11px] font-mono font-bold text-[#14F195]">
                            {ev.amountSol > 0 ? `+${ev.amountSol}` : ev.amountSol} SOL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{ev.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center self-end">
                    <span className="text-[11px] text-slate-500 font-mono">{ev.timestamp}</span>
                    {ev.txSignature && (
                      <a
                        href={getExplorerUrl('tx', ev.txSignature, network)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-mono transition"
                        title="Inspect on Solana Explorer"
                      >
                        <span>Tx</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
