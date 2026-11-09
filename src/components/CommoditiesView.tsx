import React, { useState } from 'react';
import { Coins, ShieldCheck, ArrowRight, Award, Lock } from 'lucide-react';

interface CommodityItem {
  id: string;
  name: string;
  unit: string;
  currency: 'INR' | 'USD';
  price: number;
  change24h: number;
  purity: string;
  storageVault: string;
  minPurchase: string;
}

export const CommoditiesView: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityItem | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<string>('1');
  const [feedback, setFeedback] = useState<string | null>(null);

  const commodities: CommodityItem[] = [
    {
      id: 'gold-24k',
      name: 'Physical Digital Gold 24K',
      unit: 'per 10 Grams',
      currency: 'INR',
      price: 78500.0,
      change24h: 0.45,
      purity: '99.9% 24 Karat LBMA-accredited',
      storageVault: 'Brinks & Sequel Vaults (Mumbai/Zurich)',
      minPurchase: '0.1 Gram (₹785)',
    },
    {
      id: 'silver-999',
      name: 'Physical Digital Silver',
      unit: 'per 1 Kilogram',
      currency: 'INR',
      price: 92400.0,
      change24h: 1.15,
      purity: '99.9% Fine Silver',
      storageVault: 'Sequel Secure Vaults (Hyderabad)',
      minPurchase: '10 Grams (₹924)',
    },
    {
      id: 'crude-oil-wti',
      name: 'Crude Oil WTI Futures',
      unit: 'per Barrel (bbl)',
      currency: 'USD',
      price: 72.85,
      change24h: -1.8,
      purity: 'Light Sweet Crude (NYMEX/MCX)',
      storageVault: 'Cash-Settled Benchmark',
      minPurchase: '1 Contract',
    },
    {
      id: 'natural-gas',
      name: 'Natural Gas Henry Hub',
      unit: 'per MMBtu',
      currency: 'USD',
      price: 2.82,
      change24h: 3.2,
      purity: 'Henry Hub Benchmark',
      storageVault: 'Cash-Settled Derivative',
      minPurchase: '10 MMBtu',
    },
  ];

  const handleBuyCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommodity) return;
    setFeedback(
      `Purchased ${purchaseQuantity} unit(s) of ${selectedCommodity.name}. Physical metal vaulted with 100% insurance in ${selectedCommodity.storageVault}.`
    );
    setTimeout(() => {
      setFeedback(null);
      setSelectedCommodity(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-yellow-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Coins className="w-3.5 h-3.5" />
            <span>Physical Vaulted Gold &amp; Energy Commodities</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Institutional Gold 24K, Silver &amp; Energy Commodities
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            100% physically backed 24K 99.9% pure gold and silver stored in insured Brinks vaults. Convert to physical doorstep delivery or trade seamlessly on-screen.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-amber-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>LBMA-Accredited 99.9% Purity Certified</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {commodities.map((item) => (
          <div
            key={item.id}
            className="bg-[#0f141f] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-base">{item.name}</h3>
                  <span className="text-[11px] text-slate-400">{item.unit}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono-numbers ${
                  item.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                </span>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 my-3 font-mono-numbers">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Live Metal Price</span>
                <div className="text-2xl font-black text-white">
                  {item.currency === 'INR' ? '₹' : '$'}{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Zero Storage Fee for First 12 Months</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 mb-4 font-mono-numbers">
                <div className="flex justify-between">
                  <span>Purity Standard:</span>
                  <span className="text-slate-200 font-semibold">{item.purity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Custody Vault:</span>
                  <span className="text-slate-200">{item.storageVault}</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Order:</span>
                  <span className="text-amber-400 font-bold">{item.minPurchase}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCommodity(item)}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 transition-colors cursor-pointer"
            >
              <span>Invest in {item.name.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Buy Modal */}
      {selectedCommodity && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-[#0f141f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Purchase {selectedCommodity.name}</h3>
                <span className="text-xs text-slate-400">{selectedCommodity.unit}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCommodity(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBuyCommodity} className="space-y-4 text-xs font-mono-numbers">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  step="any"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Price Rate:</span>
                  <span className="text-white font-bold">
                    {selectedCommodity.currency === 'INR' ? '₹' : '$'}{selectedCommodity.price}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Amount Payable:</span>
                  <span className="text-amber-400 font-bold text-base">
                    {selectedCommodity.currency === 'INR' ? '₹' : '$'}{(selectedCommodity.price * (parseFloat(purchaseQuantity) || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {feedback && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg transition-all cursor-pointer"
              >
                Confirm Vault Purchase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
