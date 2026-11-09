import React, { useState } from 'react';
import { SpotPair, MainNavTab } from '../types/exchange';
import { Search, TrendingUp, HelpCircle, FileText, Settings, X, ArrowRight, Wallet } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairs: SpotPair[];
  onSelectPair: (pair: SpotPair) => void;
  onNavigateTab: (tab: MainNavTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  pairs,
  onSelectPair,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const quickFeatures = [
    { label: 'Spot Trading Terminal', tab: 'spot' as MainNavTab, category: 'Trading' },
    { label: 'Futures 100x Margin', tab: 'futures' as MainNavTab, category: 'Trading' },
    { label: 'Options Chain & Greeks', tab: 'options' as MainNavTab, category: 'Trading' },
    { label: 'Deposit INR via UPI / IMPS', tab: 'wallet' as MainNavTab, category: 'Wallet' },
    { label: 'Crypto Wallet & Whitelist', tab: 'wallet' as MainNavTab, category: 'Wallet' },
    { label: 'Complete Transaction History', tab: 'history' as MainNavTab, category: 'Ledger' },
    { label: 'Download Section 194S TDS Statement', tab: 'account' as MainNavTab, category: 'Compliance' },
    { label: 'Indian Stocks (NSE/BSE)', tab: 'stocks' as MainNavTab, category: 'Markets' },
    { label: '24K Gold & Crude Oil', tab: 'commodities' as MainNavTab, category: 'Markets' },
    { label: '2FA Passkeys & Biometrics', tab: 'security' as MainNavTab, category: 'Security' },
    { label: 'Help Center & Ticket Tracker', tab: 'support' as MainNavTab, category: 'Support' },
  ];

  const matchedPairs = pairs.filter(
    (p) =>
      p.symbol.toLowerCase().includes(query.toLowerCase()) ||
      p.baseAsset.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedFeatures = quickFeatures.filter(
    (f) =>
      f.label.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16 sm:pt-24 font-sans animate-in fade-in duration-150">
      <div className="bg-[#0b0f19] border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-xs">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#070a12] border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search coins, pairs, features, wallet, TDS statements, help articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Pairs Results */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
              Trading Pairs ({matchedPairs.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchedPairs.slice(0, 6).map((pair) => (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => {
                    onSelectPair(pair);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                      {pair.baseAsset.slice(0, 3)}
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">{pair.symbol}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{pair.category}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono-numbers">
                    <div className="font-bold text-slate-200">
                      {pair.quoteAsset === 'INR' ? '₹' : '$'}{pair.lastPrice.toLocaleString(undefined, { minimumFractionDigits: pair.pricePrecision })}
                    </div>
                    <div className={`text-[10px] font-bold ${pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions & Navigation Results */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
              Modules &amp; Settings ({matchedFeatures.length})
            </span>
            <div className="space-y-1">
              {matchedFeatures.map((feat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onNavigateTab(feat.tab);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-400">
                      {feat.category}
                    </span>
                    <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      {feat.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#070a12] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Search anything across FINSTOCKCOIN</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
