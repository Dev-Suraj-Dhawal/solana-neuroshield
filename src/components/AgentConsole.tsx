import React, { useState } from 'react';
import { Bot, Terminal, Send, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';
import { AgentAction, BurnerWallet, NetworkType } from '../types';
import { QUICK_AGENT_PROMPTS, parseUserPromptToAgentAction, executeAgentAction } from '../services/agentEngine';
import confetti from 'canvas-confetti';

interface AgentConsoleProps {
  wallet: BurnerWallet | null;
  network: NetworkType;
  onWalletUpdated: (wallet: BurnerWallet) => void;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({
  wallet,
  network,
  onWalletUpdated,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [currentAction, setCurrentAction] = useState<AgentAction | null>(() =>
    parseUserPromptToAgentAction('⚡ Airdrop 1 SOL to my burner wallet on Devnet', wallet, network)
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<{
    signature?: string;
    explorerUrl?: string;
    message?: string;
  } | null>(null);

  const handleParsePrompt = (promptText: string) => {
    setPromptInput(promptText);
    setExecutionLog(null);
    const action = parseUserPromptToAgentAction(promptText, wallet, network);
    setCurrentAction(action);
  };

  const handleExecute = async () => {
    if (!currentAction) return;

    setIsExecuting(true);
    const res = await executeAgentAction(currentAction, network);
    setIsExecuting(false);

    setExecutionLog({
      signature: res.signature,
      explorerUrl: res.explorerUrl,
      message: res.message,
    });

    // Update wallet balance if airdrop or transfer
    if (wallet) {
      if (currentAction.intent === 'AIRDROP') {
        const added = currentAction.parameters.amountSol || 1;
        onWalletUpdated({
          ...wallet,
          balanceSol: wallet.balanceSol + added,
        });
      } else if (currentAction.intent === 'TRANSFER') {
        const deducted = currentAction.parameters.amountSol || 0.05;
        onWalletUpdated({
          ...wallet,
          balanceSol: Math.max(0, wallet.balanceSol - deducted - 0.000005),
        });
      }
    }

    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#9945FF', '#14F195', '#00F2FE'],
    });
  };

  return (
    <div className="sol-glass-card rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">Prompt-to-Solana AI Agent</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUTONOMOUS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Translate plain-English instructions into verified Solana on-chain transactions
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 block">
            Try Example Natural Language Prompts
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_AGENT_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleParsePrompt(p)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition cursor-pointer text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (promptInput) handleParsePrompt(promptInput);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. Send 0.05 SOL to Alice with security scan..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Parse</span>
          </button>
        </form>

        {/* Parsed Action & Agent Reasoning View */}
        {currentAction && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
              <span className="text-slate-400">Action ID: {currentAction.id}</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                INTENT: {currentAction.intent}
              </span>
            </div>

            {/* Reasoning steps */}
            <div className="space-y-1.5 text-slate-300">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-sans font-semibold">
                Autonomous Reasoning Chain:
              </div>
              {currentAction.reasoning.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                  <span className="text-purple-400 font-bold">0{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Safety Verification Badge */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-1.5">
                {currentAction.safetyVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                    <span className="text-emerald-400 font-bold font-sans">
                      NeuroShield Safety Checks Passed (Score: {currentAction.neuroScore}/100)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400 font-bold font-sans">
                      Threat Warning: Execution Requires Manual Override
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Execution Result Log */}
            {executionLog && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-[#14F195]" />
                  <span>{executionLog.message}</span>
                </div>
                {executionLog.signature && (
                  <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-slate-400">
                    <span className="truncate max-w-xs">
                      Sig: {executionLog.signature}
                    </span>
                    <a
                      href={executionLog.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:underline flex items-center gap-1 ml-2 shrink-0"
                    >
                      <span>Solana Explorer</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-[#14F195] hover:opacity-95 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-purple-600/20"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing & Committing Instruction on Solana...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execute AI-Verified Action on Solana</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
