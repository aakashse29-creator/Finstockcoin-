import React, { useState } from 'react';
import { Landmark, Search, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

interface StockItem {
  ticker: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  market: 'India' | 'US';
  currency: 'INR' | 'USD';
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  sector: string;
}

export const StocksView: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<'ALL' | 'India' | 'US'>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [orderShares, setOrderShares] = useState<string>('10');
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const stockList: StockItem[] = [
    {
      ticker: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      exchange: 'NSE',
      market: 'India',
      currency: 'INR',
      price: 2840.5,
      change24h: 1.45,
      volume: '8.4M',
      marketCap: '₹19.2T',
      peRatio: 26.4,
      sector: 'Energy & Retail',
    },
    {
      ticker: 'TCS',
      name: 'Tata Consultancy Services',
      exchange: 'NSE',
      market: 'India',
      currency: 'INR',
      price: 4120.0,
      change24h: 0.82,
      volume: '3.1M',
      marketCap: '₹14.9T',
      peRatio: 30.2,
      sector: 'Information Tech',
    },
    {
      ticker: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      exchange: 'NSE',
      market: 'India',
      currency: 'INR',
      price: 1685.2,
      change24h: -0.45,
      volume: '14.2M',
      marketCap: '₹12.8T',
      peRatio: 18.5,
      sector: 'Banking & Finance',
    },
    {
      ticker: 'INFY',
      name: 'Infosys Limited',
      exchange: 'NSE',
      market: 'India',
      currency: 'INR',
      price: 1845.0,
      change24h: 2.15,
      volume: '7.8M',
      marketCap: '₹7.6T',
      peRatio: 28.1,
      sector: 'Information Tech',
    },
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      exchange: 'NASDAQ',
      market: 'US',
      currency: 'USD',
      price: 228.45,
      change24h: 1.85,
      volume: '42.8M',
      marketCap: '$3.45T',
      peRatio: 33.8,
      sector: 'Consumer Electronics',
    },
    {
      ticker: 'NVDA',
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      market: 'US',
      currency: 'USD',
      price: 148.6,
      change24h: 4.12,
      volume: '68.5M',
      marketCap: '$3.62T',
      peRatio: 52.4,
      sector: 'Semiconductors & AI',
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      exchange: 'NASDAQ',
      market: 'US',
      currency: 'USD',
      price: 422.3,
      change24h: 0.65,
      volume: '18.4M',
      marketCap: '$3.14T',
      peRatio: 34.2,
      sector: 'Enterprise Cloud',
    },
    {
      ticker: 'TSLA',
      name: 'Tesla Inc.',
      exchange: 'NASDAQ',
      market: 'US',
      currency: 'USD',
      price: 212.8,
      change24h: -2.4,
      volume: '54.2M',
      marketCap: '$680B',
      peRatio: 64.1,
      sector: 'EV & Robotics',
    },
  ];

  const filtered = stockList.filter((s) => {
    const matchesMarket = activeMarket === 'ALL' || s.market === activeMarket;
    const matchesSearch =
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sector.toLowerCase().includes(search.toLowerCase());
    return matchesMarket && matchesSearch;
  });

  const handlePlaceStockOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    setOrderFeedback(
      `Order routed to SEBI/FINRA Licensed Brokerage: BUY ${orderShares} shares of ${selectedStock.ticker} at ${selectedStock.currency === 'INR' ? '₹' : '$'}${selectedStock.price}. Demat account credited upon T+1 settlement.`
    );
    setTimeout(() => {
      setOrderFeedback(null);
      setSelectedStock(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Regulated Institutional Equities Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Indian &amp; Global Equities (NSE, BSE &amp; NASDAQ)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Invest in blue-chip Indian companies and US technology leaders with seamless INR/USD settlement, zero depository transfer fees, and institutional custodian segregation.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CDSL / NSDL Demat Partner Integrated</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          {[
            { id: 'ALL', label: 'All Equities' },
            { id: 'India', label: 'Indian Stocks (NSE/BSE)' },
            { id: 'US', label: 'US Equities (NASDAQ)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMarket(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                activeMarket === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#0f141f] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#0f141f] border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase bg-[#0b0e14]">
                <th className="py-3 px-4">Ticker / Company</th>
                <th className="py-3 px-4">Market / Exchange</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right">Market Cap</th>
                <th className="py-3 px-4 text-right">P/E Ratio</th>
                <th className="py-3 px-4 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((stock) => {
                const isGainer = stock.change24h >= 0;
                return (
                  <tr key={stock.ticker} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <span className="font-bold text-white block text-sm">{stock.ticker}</span>
                      <span className="text-[11px] text-slate-400">{stock.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                        {stock.exchange} • {stock.market}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">{stock.sector}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white text-sm">
                      {stock.currency === 'INR' ? '₹' : '$'}{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold ${isGainer ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGainer ? '+' : ''}{stock.change24h}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300">{stock.marketCap}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{stock.peRatio}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStock(stock)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
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

      {/* Stock Order Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-[#0f141f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Trade {selectedStock.ticker}</h3>
                <span className="text-xs text-slate-400">{selectedStock.name} • {selectedStock.exchange}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStock(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceStockOrder} className="space-y-4 text-xs font-mono-numbers">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Number of Shares</label>
                <input
                  type="number"
                  min="1"
                  value={orderShares}
                  onChange={(e) => setOrderShares(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Price per Share:</span>
                  <span className="text-white font-bold">
                    {selectedStock.currency === 'INR' ? '₹' : '$'}{selectedStock.price}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Order Consideration:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {selectedStock.currency === 'INR' ? '₹' : '$'}{(selectedStock.price * (parseFloat(orderShares) || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Brokerage &amp; Depository Fee:</span>
                  <span>₹0.00 (Zero Commission)</span>
                </div>
              </div>

              {orderFeedback && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl">
                  {orderFeedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer"
              >
                Place Demat Market Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
