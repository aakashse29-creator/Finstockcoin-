import React, { useState, useRef, useEffect } from 'react';
import { OptionItem } from '../types/exchange';
import { calculateBlackScholesGreeks } from '../utils/exchangeMath';
import { ShieldCheck, BarChart2, Activity, Info } from 'lucide-react';

interface OptionsTerminalProps {
  options: OptionItem[];
  btcSpotPrice: number;
}

export const OptionsTerminal: React.FC<OptionsTerminalProps> = ({
  options,
  btcSpotPrice,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionItem>(options[0]);
  const [contractsCount, setContractsCount] = useState<number>(1);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('26 NOV 2026');
  const [feedback, setFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Payoff chart rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 500;
    const height = 220;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, width, height);

    const strike = selectedOption.strikePrice;
    const premium = selectedOption.lastPrice;
    const isCall = selectedOption.optionType === 'call';

    const minPrice = strike * 0.75;
    const maxPrice = strike * 1.25;
    const priceRange = maxPrice - minPrice;

    const priceToX = (p: number) => ((p - minPrice) / priceRange) * (width - 40) + 20;

    // Zero PnL line Y
    const zeroY = height / 2;

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();

    // Strike line
    const strikeX = priceToX(strike);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(strikeX, 10);
    ctx.lineTo(strikeX, height - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Payoff Curve
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isCall ? '#10b981' : '#3b82f6';
    ctx.beginPath();

    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const p = minPrice + (priceRange / steps) * i;
      const x = priceToX(p);
      let pnl = 0;
      if (isCall) {
        pnl = (Math.max(0, p - strike) - premium) * contractsCount;
      } else {
        pnl = (Math.max(0, strike - p) - premium) * contractsCount;
      }

      // scale PnL to canvas Y
      const maxPnLScale = premium * 3 * contractsCount || 1000;
      const y = zeroY - (pnl / maxPnLScale) * (height / 2 - 25);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`Strike: $${strike.toLocaleString()}`, strikeX + 5, 20);
    ctx.fillText('0 PnL Break-even', 25, zeroY - 4);
  }, [selectedOption, contractsCount]);

  const liveGreeks = calculateBlackScholesGreeks(
    btcSpotPrice,
    selectedOption.strikePrice,
    17 / 365,
    0.04,
    selectedOption.iv / 100
  );

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(`Order placed: BUY ${contractsCount}x ${selectedOption.underlying} $${selectedOption.strikePrice} ${selectedOption.optionType.toUpperCase()}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col gap-3 p-2 sm:p-4 max-w-[1720px] mx-auto w-full font-sans">
      {/* Header */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg text-xs">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            European Cash-Settled Crypto Options
          </h2>
          <p className="text-[11px] text-slate-400">Underlying: BTC Spot at ${btcSpotPrice.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Expiry:</span>
          {['26 NOV 2026', '31 DEC 2026', '29 JAN 2027'].map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => setSelectedExpiry(exp)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                selectedExpiry === exp
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Options Chain Table + Payoff & Greeks Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Options Chain Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f141f] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-[#0b0e14] border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs">BTC Option Chain</span>
            <span className="text-[10px] text-slate-400">Click a contract to inspect Greeks & Payoff</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-numbers text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Strike</th>
                  <th className="py-2.5 px-3 text-right">Bid / Ask</th>
                  <th className="py-2.5 px-3 text-right">Last</th>
                  <th className="py-2.5 px-3 text-right">IV %</th>
                  <th className="py-2.5 px-3 text-right">Delta (Δ)</th>
                  <th className="py-2.5 px-3 text-right">Open Int</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {options.map((opt) => {
                  const isSelected = selectedOption.id === opt.id;
                  const isCall = opt.optionType === 'call';
                  return (
                    <tr
                      key={opt.id}
                      onClick={() => setSelectedOption(opt)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-purple-900/30 border-l-4 border-purple-500' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCall ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {opt.optionType.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">
                        ${opt.strikePrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        ${opt.bid} / ${opt.ask}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-100 font-bold">
                        ${opt.lastPrice}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {opt.iv}%
                      </td>
                      <td className="py-2.5 px-3 text-right text-purple-300">
                        {opt.delta > 0 ? '+' : ''}{opt.delta.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        {opt.openInterest}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Greeks & Payoff Calculator Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Greeks Card */}
          <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl p-4 shadow-lg text-xs font-mono-numbers">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center justify-between">
              <span>Selected Option Greeks</span>
              <span className="text-purple-400 text-xs">
                ${selectedOption.strikePrice} {selectedOption.optionType.toUpperCase()}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                <span className="text-[10px] text-slate-500 uppercase block">Delta (Δ)</span>
                <span className="text-slate-200 font-bold text-sm">
                  {selectedOption.optionType === 'call' ? liveGreeks.callDelta : liveGreeks.putDelta}
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                <span className="text-[10px] text-slate-500 uppercase block">Gamma (Γ)</span>
                <span className="text-slate-200 font-bold text-sm">{liveGreeks.gamma}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                <span className="text-[10px] text-slate-500 uppercase block">Theta (Θ/day)</span>
                <span className="text-rose-400 font-bold text-sm">{liveGreeks.theta}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                <span className="text-[10px] text-slate-500 uppercase block">Vega (ν)</span>
                <span className="text-blue-400 font-bold text-sm">{liveGreeks.vega}</span>
              </div>
            </div>

            {/* Payoff Chart Canvas */}
            <div className="bg-[#0b0e14] border border-slate-800 rounded-lg p-2 mb-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1 flex items-center justify-between">
                <span>Expiration Payoff Curve</span>
                <span className="text-purple-400">Contracts: {contractsCount}x</span>
              </div>
              <div className="w-full h-[180px]">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>

            {/* Order execution */}
            <form onSubmit={handleOrderSubmit} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-1">Quantity (Contracts)</label>
                  <input
                    type="number"
                    min="1"
                    value={contractsCount}
                    onChange={(e) => setContractsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex-1 text-right">
                  <span className="block text-[10px] text-slate-400 mb-1">Total Premium Cost</span>
                  <span className="text-base font-bold text-purple-400">
                    ${(selectedOption.lastPrice * contractsCount).toLocaleString()}
                  </span>
                </div>
              </div>

              {feedback && (
                <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-700/50 text-purple-300 text-[11px]">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                Trade Option Contract
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
