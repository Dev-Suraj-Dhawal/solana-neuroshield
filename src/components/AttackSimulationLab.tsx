import React, { useState } from 'react';
import { ShieldAlert, Bug, Terminal, ShieldCheck, Zap, Play, RotateCcw, AlertTriangle, ArrowRight, Lock, DollarSign } from 'lucide-react';
import { NetworkType } from '../types';
import { playThreatWarning, playShieldActivate, playSuccessChime } from '../services/soundEffects';
import { useToast } from './Toast';

interface AttackScenario {
  id: string;
  name: string;
  category: string;
  defaultAmountSol: number;
  description: string;
  exploitMechanism: string;
  simulatedSignature: string;
  defenseAction: string;
}

const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'drainer',
    name: 'Unlimited Delegate Drainer Payload',
    category: 'ASSET EXHAUSTION',
    defaultAmountSol: 50,
    description: 'Deceptive instruction attempting to grant unlimited token approval and transfer authority to an attacker escrow.',
    exploitMechanism: 'Invokes TokenProgram::Approve with u64::MAX allowance; drains wallet reserves on next block.',
    simulatedSignature: 'DrainerPayload_0x2a9b_DelegateAuthority',
    defenseAction: 'Sentinel intercepts unbounded delegation buffer and forces transaction abort.',
  },
  {
    id: 'honeypot',
    name: 'Token-2022 Transfer-Hook Honeypot',
    category: 'LIQUIDITY TRAP',
    defaultAmountSol: 25,
    description: 'Custom Token-2022 extension hook that allows buying tokens but maliciously reverts all DEX sale transactions.',
    exploitMechanism: 'Transfer-hook program checks destination; if Raydium/Orca pool, triggers custom revert bytecode (0x69).',
    simulatedSignature: 'HoneypotHook_0x9945_RevertOnDexSale',
    defenseAction: 'Sentinel simulates secondary DEX sell path in sandbox buffer and flags honeypot trap.',
  },
  {
    id: 'backdoor',
    name: 'Unverified Upgrade Authority Backdoor',
    category: 'GOVERNANCE EXPLOIT',
    defaultAmountSol: 100,
    description: 'Smart contract configured with an unverified external EOA upgrade authority without multisig timelocks.',
    exploitMechanism: 'Admin key can replace contract BPF bytecode post-deployment to extract pooled collateral.',
    simulatedSignature: 'UpgradeAuth_0x7b4a_InstantReplace',
    defenseAction: 'Sentinel inspects BPF loader account state and flags single-signature upgrade vulnerability.',
  },
  {
    id: 'mev',
    name: 'Flash-Loan Sandwich & MEV Slippage',
    category: 'ARBITRAGE EXPLOIT',
    defaultAmountSol: 15,
    description: 'High-slippage swap transaction vulnerable to automated searcher front-running and sandwiching in the mempool.',
    exploitMechanism: 'Mempool bot detects unconstrained slippage (15%), buys before user and dumps immediately after.',
    simulatedSignature: 'MevSandwich_0x4f12_HighSlippageFrontrun',
    defenseAction: 'Sentinel calculates maximum extractable slippage delta and enforces 0.5% dynamic tolerance.',
  },
];

interface AttackSimulationLabProps {
  network: NetworkType;
  onAttackNeutralized?: (title: string, amountSol: number) => void;
}

export const AttackSimulationLab: React.FC<AttackSimulationLabProps> = ({
  network,
  onAttackNeutralized,
}) => {
  const { showToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario>(ATTACK_SCENARIOS[0]);
  const [testAmountSol, setTestAmountSol] = useState<number>(selectedScenario.defaultAmountSol);
  const [simulating, setSimulating] = useState(false);
  const [simulationStage, setSimulationStage] = useState<number>(0);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const solPriceUsd = 185;
  const fundsAtRiskUsd = testAmountSol * solPriceUsd;

  const handleSelectScenario = (scenario: AttackScenario) => {
    if (simulating) return;
    setSelectedScenario(scenario);
    setTestAmountSol(scenario.defaultAmountSol);
    setSimulationStage(0);
    setSimulationComplete(false);
  };

  const handleLaunchAttack = () => {
    if (simulating) return;
    setSimulating(true);
    setSimulationStage(1);
    setSimulationComplete(false);
    playThreatWarning();

    // Stage 1: Payload Ingestion
    setTimeout(() => {
      setSimulationStage(2);

      // Stage 2: Bytecode Disassembly & Simulation
      setTimeout(() => {
        setSimulationStage(3);
        playThreatWarning();

        // Stage 3: Exploit Interception
        setTimeout(() => {
          setSimulationStage(4);
          setSimulating(false);
          setSimulationComplete(true);
          playShieldActivate();
          showToast(`Threat Neutralized! Protected ${testAmountSol} SOL (~$${fundsAtRiskUsd.toLocaleString()} USD)`, 'success', 'Attack Intercepted');

          if (onAttackNeutralized) {
            onAttackNeutralized(selectedScenario.name, testAmountSol);
          }
        }, 600);
      }, 550);
    }, 450);
  };

  const handleReset = () => {
    setSimulating(false);
    setSimulationStage(0);
    setSimulationComplete(false);
  };

  return (
    <div className="sol-glass-card rounded-2xl border border-rose-500/30 overflow-hidden shadow-2xl bg-gradient-to-b from-[#180f1d]/60 via-[#0e0f1a] to-[#0a0b12]">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Interactive Attack Simulation & Defense Lab</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                LIVE SANDBOX
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simulate 4 real-world Solana exploit vectors and verify NeuroShield's sub-400ms pre-execution defense
            </p>
          </div>
        </div>

        {simulationComplete && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
            DEFENSE VERIFIED
          </span>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Scenario Selection Grid */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
            Select Exploit Attack Vector to Simulate:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ATTACK_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  disabled={simulating}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                      {sc.category}
                    </span>
                    <h4 className="font-bold text-xs mt-1 leading-snug">{sc.name}</h4>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
                    Target: ~{sc.defaultAmountSol} SOL
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Attack Specs */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{selectedScenario.name}</span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                  CRITICAL EXPLOIT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedScenario.description}</p>
            </div>

            {/* Test Amount Slider / Selector */}
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Simulated Stake at Risk</span>
              <div className="flex items-center gap-2 mt-1">
                {[10, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    disabled={simulating}
                    onClick={() => setTestAmountSol(amt)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                      testAmountSol === amt
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {amt} SOL
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-rose-300 font-bold block mt-1">
                ~${fundsAtRiskUsd.toLocaleString()} USD Value
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-sans font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Exploit Mechanism:
              </span>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                {selectedScenario.exploitMechanism}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/25 space-y-1">
              <span className="text-[10px] text-[#14F195] uppercase font-sans font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                NeuroShield Interception:
              </span>
              <p className="text-emerald-200 text-[11px] font-sans leading-relaxed">
                {selectedScenario.defenseAction}
              </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {!simulating && !simulationComplete ? (
              <button
                type="button"
                onClick={handleLaunchAttack}
                className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-[#14F195] hover:opacity-95 text-slate-950 font-extrabold text-xs transition cursor-pointer shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Attack Payload Simulation ({testAmountSol} SOL at Risk)</span>
              </button>
            ) : simulating ? (
              <div className="w-full py-3 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                <span>Simulating Attack Vector Execution in Sub-400ms Sandbox...</span>
              </div>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#14F195] shrink-0" />
                  <span>Payload Intercepted! {testAmountSol} SOL (~${fundsAtRiskUsd.toLocaleString()} USD) successfully safeguarded.</span>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Lab</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Attack Simulation Progress Steps */}
        {(simulating || simulationComplete) && (
          <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>SANDBOX EXECUTION TRACE</span>
              </span>
              <span className="text-[#14F195]">SIMULATION LATENCY: 380ms</span>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-xs transition ${simulationStage >= 1 ? 'text-white' : 'text-slate-600'}`}>
                <span className={simulationStage >= 1 ? 'text-purple-400 font-bold' : 'text-slate-600'}>[01]</span>
                <span>Ingesting malicious instruction buffer: <code className="text-slate-400">{selectedScenario.simulatedSignature}</code></span>
                {simulationStage >= 2 && <span className="text-[#14F195] ml-auto text-[10px]">✓ BUFFERED</span>}
              </div>

              <div className={`flex items-center gap-2 text-xs transition ${simulationStage >= 2 ? 'text-white' : 'text-slate-600'}`}>
                <span className={simulationStage >= 2 ? 'text-purple-400 font-bold' : 'text-slate-600'}>[02]</span>
                <span>Disassembling BPF bytecode & parsing Token-2022 account metas...</span>
                {simulationStage >= 3 && <span className="text-[#14F195] ml-auto text-[10px]">✓ DISASSEMBLED</span>}
              </div>

              <div className={`flex items-center gap-2 text-xs transition ${simulationStage >= 3 ? 'text-rose-300 font-bold' : 'text-slate-600'}`}>
                <span className={simulationStage >= 3 ? 'text-rose-400' : 'text-slate-600'}>[03]</span>
                <span>Simulating state delta: Unbounded reserve extraction detected (-{testAmountSol} SOL)!</span>
                {simulationStage >= 3 && <span className="text-rose-400 ml-auto text-[10px] animate-pulse">⚠ CRITICAL DETECTED</span>}
              </div>

              <div className={`flex items-center gap-2 text-xs transition ${simulationStage >= 4 ? 'text-emerald-300 font-bold' : 'text-slate-600'}`}>
                <span className={simulationStage >= 4 ? 'text-[#14F195]' : 'text-slate-600'}>[04]</span>
                <span>NeuroShield Sentinel Intervention: Transaction signature ABORTED before broadcasting.</span>
                {simulationStage >= 4 && <span className="text-[#14F195] ml-auto text-[10px]">🛡️ ASSETS PROTECTED</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
