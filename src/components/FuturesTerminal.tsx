import React, { useState } from 'react';
import { FuturesContract, FuturesPosition } from '../types/exchange';
import {
  calculateFuturesLiquidationPrice,
  calculateFuturesPnL
} from '../utils/exchangeMath';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Percent,
  CheckCircle
} from 'lucide-react';

interface FuturesTerminalProps {
  contracts: FuturesContract[];
  positions: FuturesPosition[];
  onOpenPosition: (pos: Omit<FuturesPosition, 'id' | 'unrealizedPnL' | 'roePercent'>) => void;
  onClosePosition: (positionId: string) => void;
  availableUsdt: number;
}

export const FuturesTerminal: React.FC<FuturesTerminalProps> = ({
  contracts,
  positions,
  onOpenPosition,
  onClosePosition,
  availableUsdt,
}) => {
  const [selectedContract, setSelectedContract] = useState<FuturesContract>(contracts[0]);
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [marginType, setMarginType] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(20);
  const [amountInput, setAmountInput] = useState<string>('0.5');
  const [tpInput, setTpInput] = useState<string>('');
  const [slInput, setSlInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const numericSize = parseFloat(amountInput) || 0;
  const positionValue = numericSize * selectedContract.markPrice;
  const marginRequired = leverage > 0 ? positionValue / leverage : 0;

  const estLiquidationPrice = calculateFuturesLiquidationPrice(
    selectedContract.markPrice,
    leverage,
    side,
    0.005
  );

  const handleOpenPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericSize <= 0) {
      setFeedback('Please enter a valid position size');
      return;
    }
    if (marginRequired > availableUsdt) {
      setFeedback(`Insufficient USDT margin. Required: $${marginRequired.toFixed(2)}, Available: $${availableUsdt.toFixed(2)}`);
      return;
    }

    onOpenPosition({
      contractId: selectedContract.id,
      symbol: selectedContract.symbol,
      side,
      leverage,
      marginType,
      entryPrice: selectedContract.markPrice,
      markPrice: selectedContract.markPrice,
      size: numericSize,
      margin: marginRequired,
      liquidationPrice: estLiquidationPrice,
      takeProfit: tpInput ? parseFloat(tpInput) : undefined,
      stopLoss: slInput ? parseFloat(slInput) : undefined,
    });

    setFeedback(`Opened ${leverage}x ${side.toUpperCase()} position on ${selectedContract.symbol}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col gap-3 p-2 sm:p-4 max-w-[1720px] mx-auto w-full font-sans">
      {/* Futures Header Ribbon */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg text-xs font-mono-numbers">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {contracts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedContract(c)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedContract.id === c.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Mark Price</div>
            <div className="text-base font-bold text-slate-100">${selectedContract.markPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Index Price</div>
            <div className="text-slate-300 font-semibold">${selectedContract.indexPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Funding Rate / Countdown</div>
            <div className="text-amber-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {(selectedContract.fundingRate * 100).toFixed(4)}% in 03:42:15
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">24h Volume</div>
            <div className="text-slate-300 font-semibold">${(selectedContract.volume24h / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Futures Chart / Info + Order Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Info & Leverage Explainer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Institutional Perpetual Futures Engine
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Trade perpetual contracts with up to {selectedContract.maxLeverage}x leverage. Finstock employs a multi-tier liquidation engine,
              sub-millisecond risk checks, and deep liquidity pools with zero clawback guarantees.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs font-mono-numbers">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Maintenance Margin</span>
                <span className="text-slate-200 font-semibold">0.50%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Max Leverage</span>
                <span className="text-amber-400 font-bold">{selectedContract.maxLeverage}x</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Settlement Asset</span>
                <span className="text-slate-200 font-semibold">{selectedContract.quoteAsset}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Liquidation Fee</span>
                <span className="text-slate-200 font-semibold">0.5% to Insurance Fund</span>
              </div>
            </div>
          </div>

          {/* Active Positions Table */}
          <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg flex-1">
            <div className="px-4 py-3 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-white text-xs">Active Positions ({positions.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono-numbers text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                    <th className="py-2.5 px-4">Contract</th>
                    <th className="py-2.5 px-4">Side / Lev</th>
                    <th className="py-2.5 px-4 text-right">Size</th>
                    <th className="py-2.5 px-4 text-right">Entry Price</th>
                    <th className="py-2.5 px-4 text-right">Mark Price</th>
                    <th className="py-2.5 px-4 text-right">Liq Price</th>
                    <th className="py-2.5 px-4 text-right">Margin</th>
                    <th className="py-2.5 px-4 text-right">Unrealized PnL (ROE)</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                        No active futures positions. Open a long or short position on the right.
                      </td>
                    </tr>
                  ) : (
                    positions.map((pos) => {
                      const pnlInfo = calculateFuturesPnL(
                        pos.entryPrice,
                        selectedContract.markPrice,
                        pos.size,
                        pos.leverage,
                        pos.side
                      );
                      const isProfit = pnlInfo.pnl >= 0;
                      return (
                        <tr key={pos.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-200">{pos.symbol}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              pos.side === 'long'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {pos.side.toUpperCase()} {pos.leverage}x
                            </span>
                            <span className="text-[10px] text-slate-500 ml-1">({pos.marginType})</span>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-200">{pos.size}</td>
                          <td className="py-3 px-4 text-right text-slate-300">${pos.entryPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-slate-300">${selectedContract.markPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-amber-400 font-semibold">${pos.liquidationPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-slate-300">${pos.margin.toFixed(2)}</td>
                          <td className={`py-3 px-4 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}${pnlInfo.pnl.toFixed(2)} ({isProfit ? '+' : ''}{pnlInfo.roePercent.toFixed(2)}%)
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onClosePosition(pos.id)}
                              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-semibold text-[10px] transition-colors"
                            >
                              Close Market
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Futures Order Entry Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#0f141f] border border-slate-800/80 rounded-xl p-4 shadow-lg text-xs font-mono-numbers">
          {/* Margin Mode & Leverage Selector */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setMarginType('cross')}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                  marginType === 'cross' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Cross
              </button>
              <button
                type="button"
                onClick={() => setMarginType('isolated')}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                  marginType === 'isolated' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Isolated
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-amber-400 font-bold">
              <span>{leverage}x</span>
            </div>
          </div>

          {/* Leverage Slider */}
          <div className="mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
              <span>Leverage</span>
              <span className="text-amber-400">{leverage}x Multiplier</span>
            </div>
            <input
              type="range"
              min="1"
              max={selectedContract.maxLeverage}
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>1x</span>
              <span>25x</span>
              <span>50x</span>
              <span>{selectedContract.maxLeverage}x</span>
            </div>
          </div>

          {/* Long / Short Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSide('long')}
              className={`py-2.5 rounded-lg font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
                side === 'long'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Open Long
            </button>
            <button
              type="button"
              onClick={() => setSide('short')}
              className={`py-2.5 rounded-lg font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
                side === 'short'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Open Short
            </button>
          </div>

          <form onSubmit={handleOpenPosition} className="space-y-3">
            {/* Position Size Input */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Contract Size ({selectedContract.baseAsset})</span>
                <span className="text-slate-300">Avail: ${availableUsdt.toLocaleString()}</span>
              </div>
              <input
                type="number"
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono-numbers text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Optional TP / SL Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Take Profit (TP)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Optional"
                  value={tpInput}
                  onChange={(e) => setTpInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono-numbers text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Stop Loss (SL)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Optional"
                  value={slInput}
                  onChange={(e) => setSlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono-numbers text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Risk & Margin Calculations Box */}
            <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Position Value:</span>
                <span className="text-slate-200 font-semibold">${positionValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Required Margin:</span>
                <span className="text-slate-200 font-semibold">${marginRequired.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>Est. Liq. Price:</span>
                <span>${estLiquidationPrice.toFixed(2)}</span>
              </div>
            </div>

            {feedback && (
              <div className="p-2 rounded-lg bg-blue-900/30 border border-blue-700/50 text-blue-300 text-[11px]">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer ${
                side === 'long'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
              }`}
            >
              Open {side.toUpperCase()} ({leverage}x)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
