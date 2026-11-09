import React, { useState } from 'react';
import { SpotPair, FiatCurrency } from '../types/exchange';
import { Search, Star, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MarketsViewProps {
  pairs: SpotPair[];
  onSelectPair: (pair: SpotPair) => void;
  currency: FiatCurrency;
  currencySymbol: string;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  pairs,
  onSelectPair,
  currency,
  currencySymbol,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['FST_USDT', 'BTC_USDT', 'FST_INR']));

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = pairs.filter((p) => {
    const matchesSearch =
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.baseAsset.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === 'favorites') return favorites.has(p.id);
    if (activeCategory === 'all') return true;
    if (activeCategory === 'crypto') return p.category === 'crypto';
    if (activeCategory === 'inr') return p.quoteAsset === 'INR';
    if (activeCategory === 'equities') return p.category === 'equities';
    if (activeCategory === 'commodities') return p.category === 'commodities';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Markets Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time streaming prices across Spot, Indian INR, Equities and Commodities.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search coin, pair, or asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0f141f] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 shadow-md"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Markets' },
          { id: 'favorites', label: 'Watchlist ⭐' },
          { id: 'crypto', label: 'Spot Crypto' },
          { id: 'inr', label: 'Indian INR (₹) Direct' },
          { id: 'equities', label: 'Equities (NSE & US)' },
          { id: 'commodities', label: 'Commodities (Gold & Oil)' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-[#0f141f] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Markets Table */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase bg-[#0b0e14]">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-4">Market / Pair</th>
                <th className="py-3.5 px-4 text-right">Last Price</th>
                <th className="py-3.5 px-4 text-right">24h Change</th>
                <th className="py-3.5 px-4 text-right">24h High</th>
                <th className="py-3.5 px-4 text-right">24h Low</th>
                <th className="py-3.5 px-4 text-right">24h Volume</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((pair) => {
                const isFav = favorites.has(pair.id);
                const isGainer = pair.change24h >= 0;
                return (
                  <tr
                    key={pair.id}
                    onClick={() => onSelectPair(pair)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(pair.id, e)}
                        className={`text-sm ${isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        ★
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-xs text-blue-400 font-sans">
                          {pair.baseAsset.substring(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm group-hover:text-blue-400 transition-colors">
                            {pair.symbol}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">{pair.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-100 font-bold text-sm">
                      {pair.quoteAsset === 'INR' ? '₹' : '$'}{pair.lastPrice.toLocaleString(undefined, { minimumFractionDigits: pair.pricePrecision, maximumFractionDigits: pair.pricePrecision })}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold text-sm ${isGainer ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGainer ? '+' : ''}{pair.change24h}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300">
                      {pair.high24h.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {pair.low24h.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300">
                      {pair.volume24h.toLocaleString()} {pair.quoteAsset}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPair(pair);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      >
                        <span>Trade</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
