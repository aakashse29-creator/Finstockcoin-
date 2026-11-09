import React, { useState } from 'react';
import { SpotPair } from '../types/exchange';
import { TrendingUp, Landmark, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface OtherMarketsViewProps {
  pairs: SpotPair[];
  onTradePair: (pair: SpotPair) => void;
  currencySymbol: string;
}

export const OtherMarketsView: React.FC<OtherMarketsViewProps> = ({
  pairs,
  onTradePair,
  currencySymbol,
}) => {
  const [filter, setFilter] = useState<'all' | 'equities' | 'commodities'>('all');

  const otherMarkets = pairs.filter(
    (p) => p.category === 'equities' || p.category === 'commodities'
  );

  const filtered = filter === 'all'
    ? otherMarkets
    : otherMarkets.filter((p) => p.category === filter);

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Regulated Partner Brokerage Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Equities &amp; Commodities (NSE / BSE / NASDAQ / MCX)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Trade Indian blue-chip stocks, US mega-cap tech shares, and physical-grade 24K Gold and Crude Oil via authorized custodian partner rails seamlessly from your Finstock account.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Multi-Assets' },
          { id: 'equities', label: 'Equities (NSE & NASDAQ)' },
          { id: 'commodities', label: 'Commodities (Gold 24K & Oil)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0f141f] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#0f141f] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white text-base">{item.symbol}</h3>
                  <span className="text-[11px] text-slate-400 capitalize">{item.category} • Partner Custody</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono-numbers ${
                  item.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 my-3 font-mono-numbers">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Latest Price</span>
                <div className="text-xl font-bold text-white">
                  {item.quoteAsset === 'INR' ? '₹' : '$'}{item.lastPrice.toLocaleString()} {item.quoteAsset}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  24h High: {item.quoteAsset === 'INR' ? '₹' : '$'}{item.high24h.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onTradePair(item)}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Trade {item.baseAsset}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
