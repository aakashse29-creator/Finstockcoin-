import React from 'react';
import { VIP_FEE_TIERS } from '../utils/exchangeMath';
import { Sparkles, Percent, ShieldCheck, Check } from 'lucide-react';

export const FeeCenterView: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finstock VIP Fee Schedule</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Lowest Trading Fees in the Industry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enjoy maker fees as low as 0.03% and get an additional 25% instant discount when paying fees with FST token.
          </p>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold flex items-center gap-2">
          <Percent className="w-4 h-4 text-amber-400" />
          <span>FST Fee Deduction Enabled: 25% Off Active</span>
        </div>
      </div>

      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-[#0b0e14] border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Spot &amp; Futures VIP Tier Matrix</h3>
          <span className="text-xs text-slate-400">Calculated on 30-day trailing volume &amp; FST balance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                <th className="py-3 px-6">VIP Tier</th>
                <th className="py-3 px-6">30d Volume (USD)</th>
                <th className="py-3 px-6">FST Holding</th>
                <th className="py-3 px-6">Spot Maker / Taker</th>
                <th className="py-3 px-6">With FST (25% Off)</th>
                <th className="py-3 px-6">Futures Maker / Taker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(VIP_FEE_TIERS).map(([tierStr, fee]) => {
                const tier = parseInt(tierStr);
                const volumeReq = tier === 0 ? '0' : (tier * 500000).toLocaleString();
                const fstReq = tier === 0 ? '0' : (tier * 1000).toLocaleString();
                return (
                  <tr key={tier} className={`hover:bg-slate-800/30 ${tier === 1 ? 'bg-blue-900/10' : ''}`}>
                    <td className="py-3.5 px-6 font-bold text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[11px]">
                        VIP {tier}
                      </span>
                      {tier === 1 && <span className="text-[10px] text-blue-400 font-normal">(Your Level)</span>}
                    </td>
                    <td className="py-3.5 px-6 text-slate-300">&ge; ${volumeReq}</td>
                    <td className="py-3.5 px-6 text-slate-300">&ge; {fstReq} FST</td>
                    <td className="py-3.5 px-6 text-slate-200">
                      {fee.makerFeePercent}% / {fee.takerFeePercent}%
                    </td>
                    <td className="py-3.5 px-6 text-emerald-400 font-bold">
                      {(fee.makerFeePercent * 0.75).toFixed(3)}% / {(fee.takerFeePercent * 0.75).toFixed(3)}%
                    </td>
                    <td className="py-3.5 px-6 text-slate-300">
                      0.020% / 0.050%
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
