import React from 'react';
import { MainNavTab } from '../types/exchange';
import {
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  Zap,
  Activity,
  Sparkles,
  Shield,
  Wallet,
  History,
  Landmark,
  Coins,
  User,
  Lock,
  HelpCircle,
  Smartphone,
  Percent,
  Terminal,
  X,
  ChevronRight
} from 'lucide-react';

interface MegaMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: MainNavTab) => void;
  activeTab: MainNavTab;
  onOpenDownloadModal: () => void;
}

export const MegaMenuModal: React.FC<MegaMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  activeTab,
  onOpenDownloadModal,
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Trading & Markets',
      items: [
        { id: 'overview', label: '1. Overview', desc: 'Portfolio P&L, watchlists, news & metrics', icon: LayoutDashboard, color: 'text-blue-400' },
        { id: 'markets', label: '2. Markets', desc: 'All spot, INR, futures & equity screeners', icon: BarChart2, color: 'text-indigo-400' },
        { id: 'spot', label: '3. Spot Trading', desc: 'Order books, limit/market/OCO, 1% TDS preview', icon: TrendingUp, color: 'text-emerald-400', badge: 'Simple & Pro' },
        { id: 'futures', label: '4. Futures 100x', desc: 'Perpetuals, cross/isolated margin, liquidation engine', icon: Zap, color: 'text-amber-400', badge: '100x Lev' },
        { id: 'options', label: '5. Options', desc: 'Call/Put chains, Greeks (Δ, Γ, Θ, ν) & payoff curves', icon: Activity, color: 'text-purple-400' },
        { id: 'stocks', label: '10. Stocks', desc: 'Indian NSE/BSE Blue-chips & US Tech shares', icon: Landmark, color: 'text-cyan-400' },
        { id: 'commodities', label: '11. Commodities', desc: '24K Gold 99.9% purity, Silver, WTI Crude Oil', icon: Coins, color: 'text-yellow-400' },
      ],
    },
    {
      title: 'Custody, DeFi & Yield',
      items: [
        { id: 'wallet', label: '8. Wallet & Fiat', desc: 'Crypto deposit/withdraw & instant UPI/IMPS rails', icon: Wallet, color: 'text-emerald-400' },
        { id: 'earn', label: '6. Earn & Staking', desc: 'Up to 18.5% APY on FST, stablecoins & blue-chips', icon: Sparkles, color: 'text-amber-400', badge: '18.5% APY' },
        { id: 'web3', label: '7. Web3 Vault', desc: 'Non-custodial MPC wallet, multi-chain DEX swaps', icon: Shield, color: 'text-purple-400' },
        { id: 'history', label: '9. Transaction History', desc: 'Complete searchable trade, deposit & TDS ledger', icon: History, color: 'text-blue-400' },
      ],
    },
    {
      title: 'Security, Account & Support',
      items: [
        { id: 'account', label: '12. Account & KYC', desc: 'India FIU-IND, PAN/Aadhaar, Bank Penny-Drop, Nominee', icon: User, color: 'text-blue-400' },
        { id: 'security', label: '13. Security Center', desc: '2FA TOTP, Biometric Passkeys, Anti-Phishing codes', icon: Lock, color: 'text-emerald-400' },
        { id: 'support', label: '14. Help & Support', desc: '24/7 AI Concierge, Knowledge Base & Ticket Tracker', icon: HelpCircle, color: 'text-cyan-400' },
        { id: 'fees', label: 'VIP Fee Schedule', desc: '0.03% maker rates & 25% FST token discount', icon: Percent, color: 'text-slate-400' },
        { id: 'api', label: 'Developer APIs', desc: 'Ultra-low latency REST & WebSocket documentation', icon: Terminal, color: 'text-slate-400' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#070a12] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              ☰
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">
                All Features &amp; Navigation Menu
              </h2>
              <p className="text-[11px] text-slate-400">
                14 Complete Institutional Financial Modules • Direct Jump
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDownloadModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Get Mobile Apps</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {categories.map((cat) => (
            <div key={cat.title}>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 block">
                {cat.title}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (item.id === 'overview' && activeTab === 'home');
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id as MainNavTab);
                        onClose();
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-950/40'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/70 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl bg-slate-800/80 ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[9px] font-extrabold border border-amber-500/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0 self-center" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#070a12] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>FINSTOCKCOIN • Trade Smarter. Grow Stronger.</span>
          <button
            type="button"
            onClick={() => {
              onSelectTab('admin');
              onClose();
            }}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Root Admin Suite</span>
          </button>
        </div>
      </div>
    </div>
  );
};
