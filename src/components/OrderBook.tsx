import React, { useState } from 'react';
import { OrderBookItem } from '../types/exchange';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OrderBookProps {
  lastPrice: number;
  change24h: number;
  pricePrecision?: number;
  onSelectPrice: (price: number) => void;
  onSelectAmount?: (amount: number) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  lastPrice,
  change24h,
  pricePrecision = 2,
  onSelectPrice,
  onSelectAmount,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'bids' | 'asks'>('both');
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook');

  // Generate realistic dynamic book rows around lastPrice
  const spreadDelta = lastPrice * 0.0004;

  const asks: OrderBookItem[] = [
    { price: lastPrice + spreadDelta * 5, amount: 1.45, total: 1.45 },
    { price: lastPrice + spreadDelta * 4, amount: 0.88, total: 2.33 },
    { price: lastPrice + spreadDelta * 3, amount: 2.15, total: 4.48 },
    { price: lastPrice + spreadDelta * 2, amount: 3.52, total: 8.0 },
    { price: lastPrice + spreadDelta * 1, amount: 0.95, total: 8.95 },
  ];

  const bids: OrderBookItem[] = [
    { price: lastPrice - spreadDelta * 1, amount: 1.25, total: 1.25 },
    { price: lastPrice - spreadDelta * 2, amount: 2.85, total: 4.1 },
    { price: lastPrice - spreadDelta * 3, amount: 4.12, total: 8.22 },
    { price: lastPrice - spreadDelta * 4, amount: 1.65, total: 9.87 },
    { price: lastPrice - spreadDelta * 5, amount: 3.2, total: 13.07 },
  ];

  const maxTotal = Math.max(
    ...asks.map((a) => a.total),
    ...bids.map((b) => b.total)
  );

  const mockTrades = [
    { price: lastPrice, amount: 0.245, time: '14:22:15', side: 'buy' },
    { price: lastPrice - spreadDelta, amount: 0.812, time: '14:22:10', side: 'sell' },
    { price: lastPrice, amount: 1.15, time: '14:22:04', side: 'buy' },
    { price: lastPrice + spreadDelta, amount: 0.095, time: '14:21:55', side: 'buy' },
    { price: lastPrice - spreadDelta * 2, amount: 0.42, time: '14:21:40', side: 'sell' },
    { price: lastPrice - spreadDelta, amount: 0.55, time: '14:21:28', side: 'sell' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg text-xs font-mono-numbers">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f141f] px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('orderbook')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'orderbook'
                ? 'bg-slate-800 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Order Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trades')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'trades'
                ? 'bg-slate-800 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recent Trades
          </button>
        </div>

        {activeTab === 'orderbook' && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              title="Default (Bids & Asks)"
              className={`p-1 rounded ${viewMode === 'both' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="w-3 h-3 flex flex-col justify-between">
                <span className="h-1 bg-rose-500 rounded-xs"></span>
                <span className="h-1 bg-emerald-500 rounded-xs"></span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('bids')}
              title="Bids only"
              className={`p-1 rounded ${viewMode === 'bids' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="w-3 h-3 flex flex-col justify-end">
                <span className="h-2.5 bg-emerald-500 rounded-xs"></span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('asks')}
              title="Asks only"
              className={`p-1 rounded ${viewMode === 'asks' ? 'bg-slate-800 text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="w-3 h-3 flex flex-col justify-start">
                <span className="h-2.5 bg-rose-500 rounded-xs"></span>
              </div>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'orderbook' ? (
        <div className="flex flex-col flex-1 p-2">
          {/* Columns Header */}
          <div className="grid grid-cols-3 px-2 py-1 text-[10px] text-slate-500 font-semibold uppercase">
            <span>Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sell Orders) */}
          {(viewMode === 'both' || viewMode === 'asks') && (
            <div className="flex flex-col-reverse justify-end flex-1 space-y-reverse space-y-0.5">
              {asks.map((ask, idx) => {
                const depthPercent = Math.min(100, (ask.total / maxTotal) * 100);
                return (
                  <div
                    key={`ask-${idx}`}
                    onClick={() => {
                      onSelectPrice(ask.price);
                      if (onSelectAmount) onSelectAmount(ask.amount);
                    }}
                    className="relative grid grid-cols-3 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-800/60 transition-colors text-[11px]"
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-rose-500/10 pointer-events-none rounded"
                      style={{ width: `${depthPercent}%` }}
                    />
                    <span className="text-rose-400 font-semibold relative z-10">
                      {ask.price.toFixed(pricePrecision)}
                    </span>
                    <span className="text-right text-slate-300 relative z-10">
                      {ask.amount.toFixed(3)}
                    </span>
                    <span className="text-right text-slate-400 relative z-10">
                      {ask.total.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Spread / Middle Ticker */}
          <div className="my-1 py-1.5 px-3 bg-slate-900/80 border-y border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {lastPrice.toFixed(pricePrecision)}
              </span>
              {change24h >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              )}
            </div>
            <span className="text-[10px] text-slate-500">
              Spread: {(spreadDelta * 2).toFixed(pricePrecision)} ({((spreadDelta * 2 / lastPrice) * 100).toFixed(3)}%)
            </span>
          </div>

          {/* Bids (Buy Orders) */}
          {(viewMode === 'both' || viewMode === 'bids') && (
            <div className="flex flex-col justify-start flex-1 space-y-0.5">
              {bids.map((bid, idx) => {
                const depthPercent = Math.min(100, (bid.total / maxTotal) * 100);
                return (
                  <div
                    key={`bid-${idx}`}
                    onClick={() => {
                      onSelectPrice(bid.price);
                      if (onSelectAmount) onSelectAmount(bid.amount);
                    }}
                    className="relative grid grid-cols-3 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-800/60 transition-colors text-[11px]"
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none rounded"
                      style={{ width: `${depthPercent}%` }}
                    />
                    <span className="text-emerald-400 font-semibold relative z-10">
                      {bid.price.toFixed(pricePrecision)}
                    </span>
                    <span className="text-right text-slate-300 relative z-10">
                      {bid.amount.toFixed(3)}
                    </span>
                    <span className="text-right text-slate-400 relative z-10">
                      {bid.total.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Recent Trades Tab */
        <div className="p-2 flex flex-col flex-1">
          <div className="grid grid-cols-3 px-2 py-1 text-[10px] text-slate-500 font-semibold uppercase">
            <span>Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Time</span>
          </div>
          <div className="space-y-1">
            {mockTrades.map((trade, i) => (
              <div
                key={`trade-${i}`}
                className="grid grid-cols-3 px-2 py-1 rounded text-[11px] hover:bg-slate-800/40"
              >
                <span className={trade.side === 'buy' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                  {trade.price.toFixed(pricePrecision)}
                </span>
                <span className="text-right text-slate-300">{trade.amount.toFixed(3)}</span>
                <span className="text-right text-slate-500 text-[10px]">{trade.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
