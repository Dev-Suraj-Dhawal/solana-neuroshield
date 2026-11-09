import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WalletCard } from './components/WalletCard';
import { AIFirewallCard } from './components/AIFirewallCard';
import { AgentConsole } from './components/AgentConsole';
import { MicroStreamCard } from './components/MicroStreamCard';
import { ActivityFeed, ActivityEvent } from './components/ActivityFeed';
import { QuickStartGuide } from './components/QuickStartGuide';
import { HackathonDrawer } from './components/HackathonDrawer';
import { Footer } from './components/Footer';
import { NetworkTelemetry, NetworkType, BurnerWallet } from './types';
import { fetchSolanaTelemetry, generateEphemeralSolanaWallet, fetchWalletBalance } from './services/solanaRpc';
import { useToast } from './components/Toast';
import { ShieldAlert, Bot, Flame, History, Wallet, Sparkles } from 'lucide-react';

export function App() {
  const { showToast } = useToast();
  const [network, setNetwork] = useState<NetworkType>('devnet');
  const [telemetry, setTelemetry] = useState<NetworkTelemetry>({
    tps: 2840,
    blockTimeMs: 410,
    epoch: 684,
    slot: 345892400,
    status: 'operational',
    avgFeeSol: 0.000005,
    lastUpdated: 'Just now',
  });

  const [wallet, setWallet] = useState<BurnerWallet | null>(() => {
    try {
      const saved = localStorage.getItem('neuroshield_burner_wallet');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'scanner' | 'agent' | 'stream' | 'activity' | 'wallet'>('scanner');
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // Live Activity Log
  const [events, setEvents] = useState<ActivityEvent[]>([
    {
      id: 'init-1',
      type: 'AUDIT',
      title: 'NeuroShield Sentinel Engine Initialized',
      description: 'Devnet heuristic inspection node online with 400ms payload simulation.',
      timestamp: 'Just now',
      status: 'SAFE',
    },
    {
      id: 'init-2',
      type: 'AIRDROP',
      title: 'Solana Devnet Telemetry Connected',
      description: 'Cluster health operational at 2,800+ TPS with sub-$0.0003 average fee.',
      timestamp: 'Just now',
      status: 'SUCCESS',
    },
  ]);

  const addActivityEvent = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: 'ev-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 49)]); // keep latest 50
  };

  // Poll Solana Telemetry
  useEffect(() => {
    let isMounted = true;
    const updateStats = async () => {
      const stats = await fetchSolanaTelemetry(network);
      if (isMounted) setTelemetry(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 12000); // 12s poll
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [network]);

  // Sync wallet balance
  useEffect(() => {
    if (!wallet) return;
    let isMounted = true;
    const checkBalance = async () => {
      const realBal = await fetchWalletBalance(wallet.publicKey, network);
      if (isMounted && realBal > 0) {
        setWallet((prev) => (prev ? { ...prev, balanceSol: realBal } : null));
      }
    };
    checkBalance();
  }, [wallet?.publicKey, network]);

  const handleRefreshBalance = async () => {
    if (!wallet) {
      showToast('Generate a burner wallet first to check balance.', 'info');
      return;
    }
    showToast('Querying Solana RPC cluster...', 'info', 'Refreshing Balance');
    const realBal = await fetchWalletBalance(wallet.publicKey, network);
    setWallet((prev) => (prev ? { ...prev, balanceSol: realBal } : null));
    showToast(`Balance updated: ${realBal.toFixed(4)} SOL`, 'success', 'Balance Synced');
    addActivityEvent({
      type: 'TRANSFER',
      title: 'Balance Synced via RPC',
      description: `Queried Solana Devnet state: ${realBal.toFixed(4)} SOL available.`,
      status: 'SUCCESS',
      amountSol: realBal,
    });
  };

  const handleGenerateWallet = () => {
    const ephem = generateEphemeralSolanaWallet();
    const newWallet: BurnerWallet = {
      publicKey: ephem.publicKey,
      secretKey: ephem.secretKey,
      balanceSol: 1.0, // Initial Devnet sponsor boost
      network,
      createdTime: new Date().toISOString(),
    };
    setWallet(newWallet);
    try {
      localStorage.setItem('neuroshield_burner_wallet', JSON.stringify(newWallet));
    } catch (e) {
      // ignore
    }

    showToast('New burner keypair generated with +1.0 SOL devnet boost!', 'success', 'Wallet Ready');
    addActivityEvent({
      type: 'AIRDROP',
      title: 'Ephemeral Burner Keypair Created',
      description: `Initialized zero-setup Ed25519 wallet (${ephem.publicKey.substring(0, 6)}...${ephem.publicKey.slice(-4)}) with 1.0 SOL Devnet boost.`,
      status: 'SUCCESS',
      amountSol: 1.0,
    });
  };

  const handleClearWallet = () => {
    setWallet(null);
    try {
      localStorage.removeItem('neuroshield_burner_wallet');
    } catch (e) {
      // ignore
    }
    addActivityEvent({
      type: 'AUDIT',
      title: 'Burner Keypair Wiped',
      description: 'Session destroyed from browser localStorage memory.',
      status: 'SAFE',
    });
  };

  const handleUpdateWallet = (updated: BurnerWallet) => {
    setWallet(updated);
    try {
      localStorage.setItem('neuroshield_burner_wallet', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleDeductBalance = (amount: number) => {
    if (!wallet) return;
    const updated = {
      ...wallet,
      balanceSol: Math.max(0, wallet.balanceSol - amount),
    };
    setWallet(updated);
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col hardware-accelerated">
      {/* Top Navigation */}
      <Navbar
        network={network}
        setNetwork={setNetwork}
        telemetry={telemetry}
        wallet={wallet}
        onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-12">
        {/* Hero Section */}
        <HeroSection
          telemetry={telemetry}
          onSelectTab={(tab) => setActiveTab(tab)}
          onGenerateWallet={handleGenerateWallet}
          hasWallet={!!wallet}
        />

        {/* 60-Second Onboarding Tour */}
        <QuickStartGuide
          hasWallet={!!wallet}
          onGenerateWallet={handleGenerateWallet}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Feature Modules Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
          {/* Module Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('scanner')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
                  activeTab === 'scanner'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#14F195]" />
                <span>AI Threat Sentinel</span>
              </button>

              <button
                onClick={() => setActiveTab('agent')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
                  activeTab === 'agent'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Bot className="w-4 h-4 text-purple-300" />
                <span>Prompt-to-Solana Agent</span>
              </button>

              <button
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
                  activeTab === 'stream'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Flame className="w-4 h-4 text-[#14F195]" />
                <span>Micro-Payment Stream</span>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
                  activeTab === 'activity'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <History className="w-4 h-4 text-cyan-300" />
                <span>Activity & Audit Log</span>
                {events.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300">
                    {events.length}
                  </span>
                )}
              </button>

              {/* Mobile-Only Wallet Tab for Bottom Nav Sync */}
              <button
                onClick={() => setActiveTab('wallet')}
                className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
                  activeTab === 'wallet'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-300" />
                <span>Burner Wallet</span>
              </button>
            </div>

            {/* Quick Helper */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#14F195]"></span>
              <span>Fast 400ms Solana Sandbox & Live Devnet</span>
            </div>
          </div>

          {/* Tab Views */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Interactive Workstation (Left 8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === 'scanner' && <AIFirewallCard network={network} />}
              {activeTab === 'agent' && (
                <AgentConsole
                  wallet={wallet}
                  network={network}
                  onWalletUpdated={(updated) => {
                    handleUpdateWallet(updated);
                    addActivityEvent({
                      type: 'AGENT',
                      title: 'Autonomous Agent Action Confirmed',
                      description: 'AI translated natural language prompt into executed Solana Devnet transaction.',
                      status: 'SUCCESS',
                    });
                  }}
                />
              )}
              {activeTab === 'stream' && (
                <MicroStreamCard
                  wallet={wallet}
                  network={network}
                  onDeductBalance={(amt) => {
                    handleDeductBalance(amt);
                  }}
                />
              )}
              {activeTab === 'activity' && (
                <ActivityFeed
                  events={events}
                  network={network}
                  onClearEvents={() => setEvents([])}
                />
              )}
              {activeTab === 'wallet' && (
                <div className="lg:hidden">
                  <WalletCard
                    wallet={wallet}
                    network={network}
                    onRefreshBalance={handleRefreshBalance}
                    onUpdateWallet={handleUpdateWallet}
                    onGenerateNewWallet={handleGenerateWallet}
                    onClearWallet={handleClearWallet}
                  />
                </div>
              )}
            </div>

            {/* Side Companion Panel (Right 4 Columns): Permanent Anchor on Desktop */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <WalletCard
                wallet={wallet}
                network={network}
                onRefreshBalance={handleRefreshBalance}
                onUpdateWallet={handleUpdateWallet}
                onGenerateNewWallet={handleGenerateWallet}
                onClearWallet={handleClearWallet}
              />

              {/* Hackathon Quick Summary Box */}
              <div className="sol-glass rounded-2xl p-5 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    MLH Solana Hackathon
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#14F195] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    5 TRACKS
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engineered specifically for the Solana Hackathon: AI Track, Best Beginner Hack, DeFi Track, Gaming Track, and Top 3 Overall.
                </p>
                <button
                  onClick={() => setIsSubmissionModalOpen(true)}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition cursor-pointer border border-amber-500/20"
                >
                  View Submission Documentation
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Sticky Bottom Navigation with Safe Area Padding */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 px-4 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around backdrop-blur-lg">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${
            activeTab === 'scanner' ? 'text-[#14F195]' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span>Sentinel</span>
        </button>

        <button
          onClick={() => setActiveTab('agent')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${
            activeTab === 'agent' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>Agent</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${
            activeTab === 'stream' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${
            activeTab === 'activity' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Activity</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${
            activeTab === 'wallet' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Wallet</span>
        </button>
      </div>

      {/* Footer */}
      <Footer onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)} />

      {/* Hackathon Criteria Modal */}
      <HackathonDrawer
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      />
    </div>
  );
}

export default App;
