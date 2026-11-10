import React from 'react';
import { SpotPair, WalletAssetBalance, FiatCurrency } from '../types/exchange';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Lock,
  Layers,
  Award,
  Download,
  Share2
} from 'lucide-react';

interface HomeOverviewProps {
  pairs: SpotPair[];
  balances: WalletAssetBalance[];
  currency: FiatCurrency;
  currencySymbol: string;
  rateToUSD: number;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectPair: (pair: SpotPair) => void;
  onOpenDownloadModal: () => void;
  onOpenShareModal?: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  pairs,
  balances,
  currency,
  currencySymbol,
  rateToUSD,
  hideBalance,
  onToggleHideBalance,
  onNavigateTab,
  onSelectPair,
  onOpenDownloadModal,
  onOpenShareModal,
}) => {
  const totalUsdValue = balances.reduce((sum, b) => sum + b.usdValue, 0);
  const totalLocalValue = totalUsdValue * rateToUSD;

  const topGainers = [...pairs].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const trendingPairs = pairs.filter((p) => p.isHot).slice(0, 4);

  return (
    <div className="flex flex-col gap-6 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Real-Time Market Ticker Marquee */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl px-4 py-2.5 overflow-x-auto flex items-center gap-6 shadow-md text-xs font-mono-numbers">
        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3" /> Live Markets:
        </span>
        {pairs.slice(0, 6).map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectPair(p)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          >
            <span className="font-bold text-slate-200">{p.symbol}</span>
            <span className="text-slate-100">
              {p.quoteAsset === 'INR' ? '₹' : '$'}{p.lastPrice.toLocaleString(undefined, { minimumFractionDigits: p.pricePrecision, maximumFractionDigits: p.pricePrecision })}
            </span>
            <span className={`text-[11px] font-bold ${p.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {p.change24h >= 0 ? '+' : ''}{p.change24h}%
            </span>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Hero Card (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#0e1628] via-[#0b101d] to-[#121829] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>FINSTOCKCOIN • Trade Smarter. Grow Stronger.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              The World's Most Powerful Financial Trading Ecosystem
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
              Institutional-grade Spot, 100x Futures, European Options, Indian Rupee (INR) direct banking rails,
              Web3 non-custodial custody, and compliant 1% Section 194S TDS handling.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => onNavigateTab('spot')}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/50 transition-all cursor-pointer"
            >
              Start Spot Trading
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('wallet')}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit INR / Crypto</span>
            </button>
            {/* Prominent Android APK Download Button */}
            <button
              type="button"
              onClick={onOpenDownloadModal}
              className="px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Android APK (v2.8.4)</span>
            </button>
            {/* App Share Button */}
            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-blue-300 border border-blue-500/30 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Share App</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateTab('earn')}
              className="px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Earn 18.5% APY
            </button>
          </div>
        </div>

        {/* Right Portfolio Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#0f141f] border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Portfolio Balance</span>
                <button
                  type="button"
                  onClick={onToggleHideBalance}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title={hideBalance ? 'Show balance' : 'Hide balance for privacy'}
                >
                  {hideBalance ? '👁️' : '🔒'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('wallet')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Wallet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-3xl font-black text-white font-mono-numbers">
              {hideBalance ? '••••••••' : `${currencySymbol}${totalLocalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className="text-xs text-slate-400 font-mono-numbers mt-1">
              {hideBalance ? '••••••••' : `≈ $${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`}
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono-numbers">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.20% (+$4,210.50 today)</span>
            </div>

            {/* Asset Distribution Mini List */}
            <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4 font-mono-numbers text-xs">
              {balances.slice(0, 3).map((b) => (
                <div key={b.asset} className="flex justify-between items-center text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.iconColor }} />
                    <span className="font-bold">{b.asset}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white">{b.total.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">
                      ${b.usdValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('wallet')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Manage Balances &amp; Transfer
          </button>
        </div>
      </div>

      {/* Market Highlights Grid (Gainers & Trending) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Gainers */}
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Top 24h Market Gainers
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('markets')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {topGainers.map((pair) => (
              <div
                key={pair.id}
                onClick={() => onSelectPair(pair)}
                className="p-3 bg-slate-900/60 hover:bg-slate-800/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition-colors font-mono-numbers text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center font-sans">
                    {pair.baseAsset.substring(0, 3)}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{pair.symbol}</span>
                    <span className="text-[10px] text-slate-500">{pair.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-200 block">
                    {pair.quoteAsset === 'INR' ? '₹' : '$'}{pair.lastPrice.toLocaleString(undefined, { minimumFractionDigits: pair.pricePrecision })}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    +{pair.change24h}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot / Trending */}
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Hot Ecosystem Pairs
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('markets')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {trendingPairs.map((pair) => (
              <div
                key={pair.id}
                onClick={() => onSelectPair(pair)}
                className="p-3 bg-slate-900/60 hover:bg-slate-800/60 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition-colors font-mono-numbers text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-sans">
                    {pair.baseAsset.substring(0, 3)}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{pair.symbol}</span>
                    <span className="text-[10px] text-slate-500">Vol: ${(pair.volume24h / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-200 block">
                    {pair.quoteAsset === 'INR' ? '₹' : '$'}{pair.lastPrice.toLocaleString(undefined, { minimumFractionDigits: pair.pricePrecision })}
                  </span>
                  <span className={`text-[11px] font-bold ${pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Architecture & Regulatory Trust Banner */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Institutional Financial Infrastructure &amp; Regulatory Compliance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="font-bold text-white text-sm mb-1">FIU-IND Registered</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              100% compliant with Indian Anti-Money Laundering (PMLA) regulations and real-time sanctions screening.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <Lock className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="font-bold text-white text-sm mb-1">102.4% Proof of Reserves</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All user deposits backed 1:1 in segregated institutional multi-signature cold storage with Merkle Tree audits.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <Layers className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="font-bold text-white text-sm mb-1">1% Section 194S TDS</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Automated deduction and remittance to the Income Tax Department with instant digital TDS certificates.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <Award className="w-5 h-5 text-purple-400 mb-2" />
            <h4 className="font-bold text-white text-sm mb-1">Zero Clawback Guarantee</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              $18.9M insurance fund to safeguard all perpetual futures trades and extreme volatility events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
