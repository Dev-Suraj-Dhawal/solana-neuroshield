import React from 'react';
import { X, Command, Keyboard, ShieldAlert, Bot, Flame, History, Gauge, Award, Power, Sparkles } from 'lucide-react';
import { playSuccessChime } from '../services/soundEffects';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'scanner' | 'agent' | 'stream' | 'activity') => void;
  onOpenBenchmark: () => void;
  onOpenSubmission: () => void;
  onToggleCircuitBreaker: () => void;
}

interface ShortcutItem {
  keys: string[];
  actionName: string;
  category: 'Navigation' | 'Modals' | 'Security';
  icon: React.ReactNode;
  onClick: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenBenchmark,
  onOpenSubmission,
  onToggleCircuitBreaker,
}) => {
  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    {
      keys: ['1'],
      actionName: 'Switch to AI Threat Sentinel & Attack Lab',
      category: 'Navigation',
      icon: <ShieldAlert className="w-4 h-4 text-[#14F195]" />,
      onClick: () => {
        onSelectTab('scanner');
        onClose();
      },
    },
    {
      keys: ['2'],
      actionName: 'Switch to Prompt-to-Solana Agent',
      category: 'Navigation',
      icon: <Bot className="w-4 h-4 text-purple-300" />,
      onClick: () => {
        onSelectTab('agent');
        onClose();
      },
    },
    {
      keys: ['3'],
      actionName: 'Switch to Real-Time Micro-Payment Stream',
      category: 'Navigation',
      icon: <Flame className="w-4 h-4 text-[#14F195]" />,
      onClick: () => {
        onSelectTab('stream');
        onClose();
      },
    },
    {
      keys: ['4'],
      actionName: 'Switch to Live Activity & Audit Log',
      category: 'Navigation',
      icon: <History className="w-4 h-4 text-cyan-300" />,
      onClick: () => {
        onSelectTab('activity');
        onClose();
      },
    },
    {
      keys: ['B'],
      actionName: 'Open Cluster Benchmark & Gas Comparator',
      category: 'Modals',
      icon: <Gauge className="w-4 h-4 text-purple-400" />,
      onClick: () => {
        onClose();
        onOpenBenchmark();
      },
    },
    {
      keys: ['M'],
      actionName: 'Open MLH Hackathon Criteria & Submission Details',
      category: 'Modals',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      onClick: () => {
        onClose();
        onOpenSubmission();
      },
    },
    {
      keys: ['C'],
      actionName: 'Toggle Emergency Circuit Breaker Kill-Switch',
      category: 'Security',
      icon: <Power className="w-4 h-4 text-rose-400" />,
      onClick: () => {
        onToggleCircuitBreaker();
        onClose();
      },
    },
    {
      keys: ['?', 'or', 'K'],
      actionName: 'Open Keyboard Shortcuts Cheatsheet',
      category: 'Modals',
      icon: <Command className="w-4 h-4 text-slate-400" />,
      onClick: () => {},
    },
    {
      keys: ['Esc'],
      actionName: 'Close Any Open Modal or Dialog',
      category: 'Modals',
      icon: <X className="w-4 h-4 text-slate-400" />,
      onClick: onClose,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#141624] to-[#0a0c14] border border-purple-500/30 p-6 sm:p-7 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-[#14F195]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  POWER USER
                </span>
                <span className="text-xs text-slate-400 font-mono">Global Hotkeys</span>
              </div>
              <h3 id="shortcuts-title" className="text-lg font-extrabold text-white">
                Keyboard Shortcuts Cheatsheet
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              onClick={sc.onClick}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-purple-950/30 border border-slate-800/80 hover:border-purple-500/40 transition cursor-pointer group"
              title={`Click to execute: ${sc.actionName}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-purple-500/30 transition">
                  {sc.icon}
                </div>
                <span className="text-xs text-slate-300 group-hover:text-white transition font-medium">
                  {sc.actionName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {sc.keys.map((k, idx) => (
                  <span key={idx}>
                    {k === 'or' ? (
                      <span className="text-[10px] text-slate-500 px-1">{k}</span>
                    ) : (
                      <kbd className="px-2 py-1 rounded bg-black/60 border border-slate-700/80 text-purple-300 font-mono text-[11px] font-bold shadow-inner">
                        {k}
                      </kbd>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#14F195]" />
            <span>Shortcuts work anywhere across the workstation</span>
          </span>
          <span className="font-mono text-[11px] text-slate-500">Press Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
