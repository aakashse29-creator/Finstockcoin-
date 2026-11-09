import React, { useState } from 'react';
import { EarnPool } from '../types/exchange';
import { Sparkles, Lock, Unlock, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';

interface EarnViewProps {
  pools: EarnPool[];
  onStake: (poolId: string, amount: number) => void;
  onRedeem: (poolId: string) => void;
  userBalances: { [asset: string]: number };
}

export const EarnView: React.FC<EarnViewProps> = ({
  pools,
  onStake,
  onRedeem,
  userBalances,
}) => {
  const [selectedPool, setSelectedPool] = useState<EarnPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [autoCompound, setAutoCompound] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOpenStakeModal = (pool: EarnPool) => {
    setSelectedPool(pool);
    setStakeAmount('');
    setFeedback(null);
  };

  const handleConfirmStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPool) return;
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount < selectedPool.minDeposit) {
      setFeedback(`Minimum deposit is ${selectedPool.minDeposit} ${selectedPool.asset}`);
      return;
    }
    const balance = userBalances[selectedPool.asset] || 0;
    if (amount > balance) {
      setFeedback(`Insufficient ${selectedPool.asset} balance. You have ${balance}`);
      return;
    }

    onStake(selectedPool.id, amount);
    setFeedback(`Successfully staked ${amount} ${selectedPool.asset} at ${selectedPool.apyPercent}% APY!`);
    setTimeout(() => {
      setSelectedPool(null);
      setFeedback(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-purple-900/60 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finstock Earn Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Put Your Assets to Work with Guaranteed Yield
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Earn industry-leading APYs up to 18.5% on FST, stablecoins, and blue-chip cryptocurrencies.
            Daily reward distribution, automatic compounding, and zero lock-in penalties on flexible vaults.
          </p>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pools.map((pool) => {
          const balance = userBalances[pool.asset] || 0;
          return (
            <div
              key={pool.id}
              className="bg-[#0f141f] border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs">
                      {pool.asset}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{pool.asset}</h3>
                      <span className="text-[10px] text-slate-400">{pool.name}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                    pool.type === 'flexible'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {pool.type === 'flexible' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {pool.type === 'flexible' ? 'Flexible' : `${pool.durationDays}D Locked`}
                  </span>
                </div>

                <div className="my-4 p-3 bg-slate-900/80 rounded-lg border border-slate-800/60 font-mono-numbers">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Annual Percentage Yield</span>
                  <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-1">
                    {pool.apyPercent}% <span className="text-xs font-normal text-slate-400">APY</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono-numbers text-slate-400 mb-4">
                  <div className="flex justify-between">
                    <span>Min Deposit:</span>
                    <span className="text-slate-200">{pool.minDeposit} {pool.asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Staked:</span>
                    <span className="text-amber-400 font-bold">{pool.userStaked} {pool.asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accrued Rewards:</span>
                    <span className="text-emerald-400 font-bold">+{pool.earnedRewards} {pool.asset}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenStakeModal(pool)}
                  className="flex-1 py-2 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                >
                  Stake Now
                </button>
                {pool.userStaked > 0 && (
                  <button
                    type="button"
                    onClick={() => onRedeem(pool.id)}
                    className="px-3 py-2 rounded-lg font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Redeem
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stake Modal */}
      {selectedPool && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f141f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base">
                Stake {selectedPool.asset} ({selectedPool.name})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPool(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmStake} className="space-y-4 text-xs font-mono-numbers">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Stake Amount</span>
                  <span>Available: {(userBalances[selectedPool.asset] || 0).toLocaleString()} {selectedPool.asset}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder={`Min ${selectedPool.minDeposit}`}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setStakeAmount((userBalances[selectedPool.asset] || 0).toString())}
                    className="absolute right-2 top-2 px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 text-[10px] font-bold"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Daily Yield:</span>
                  <span className="text-emerald-400 font-bold">
                    {stakeAmount ? ((parseFloat(stakeAmount) * selectedPool.apyPercent) / 36500).toFixed(4) : '0.0000'} {selectedPool.asset}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>APY Rate:</span>
                  <span className="text-slate-200">{selectedPool.apyPercent}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Lock Period:</span>
                  <span className="text-slate-200">{selectedPool.durationDays ? `${selectedPool.durationDays} Days` : 'Flexible (Anytime)'}</span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCompound}
                  onChange={(e) => setAutoCompound(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
                />
                <span>Auto-Compound Daily Rewards (Maximum Growth)</span>
              </label>

              {feedback && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px]">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer"
              >
                Confirm Staking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
