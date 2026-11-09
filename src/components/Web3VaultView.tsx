import React, { useState } from 'react';
import { Shield, ExternalLink, ArrowRightLeft, CheckCircle2, Copy, Wallet, Globe } from 'lucide-react';

export const Web3VaultView: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [selectedChain, setSelectedChain] = useState<string>('Ethereum');
  const [fromToken, setFromToken] = useState<string>('ETH');
  const [toToken, setToToken] = useState<string>('FST');
  const [swapAmount, setSwapAmount] = useState<string>('0.5');
  const [swapFeedback, setSwapFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const walletAddress = '0x71C...89Fa';

  const chains = [
    { name: 'Ethereum', icon: '🔷', gas: '12 Gwei' },
    { name: 'Polygon', icon: '🟣', gas: '35 Gwei' },
    { name: 'Arbitrum', icon: '🔵', gas: '0.1 Gwei' },
    { name: 'Solana', icon: '🟣', gas: '0.000005 SOL' },
  ];

  const dapps = [
    { name: 'Uniswap V3', desc: 'Decentralized Token Swaps', cat: 'DEX', icon: '🦄' },
    { name: 'Aave V3', desc: 'Non-Custodial Liquidity Market', cat: 'Lending', icon: '👻' },
    { name: 'OpenSea', desc: 'NFT Marketplace & Creator Hub', cat: 'NFT', icon: '⛵' },
    { name: 'Curve Finance', desc: 'Deep Stablecoin Liquidity', cat: 'Yield', icon: '📐' },
  ];

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setSwapFeedback(`DEX Route: 1inch aggregator routing ${swapAmount} ${fromToken} -> 1,842.50 ${toToken} on ${selectedChain}`);
    setTimeout(() => setSwapFeedback(null), 4000);
  };

  const copyAddress = () => {
    navigator.clipboard?.writeText('0x71C83e54b39E6e5D9F4e25a2e6189918aFc889Fa');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Web3 Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-blue-950/60 border border-purple-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Finstock Web3 Self-Custody Vault</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Your Keys, Your Crypto. Seamless Multi-Chain Web3 Access.
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect hardware wallets, Metamask, or use the secure built-in MPC vault to interact with smart contracts directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono-numbers">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">{walletAddress}</span>
            <button
              type="button"
              onClick={copyAddress}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
          </div>
        </div>
      </div>

      {/* Network Selector Bar */}
      <div className="flex flex-wrap gap-2">
        {chains.map((chain) => (
          <button
            key={chain.name}
            type="button"
            onClick={() => setSelectedChain(chain.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedChain === chain.name
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                : 'bg-[#0f141f] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{chain.icon}</span>
            <span>{chain.name}</span>
            <span className="text-[10px] font-normal text-slate-400 font-mono-numbers">({chain.gas})</span>
          </button>
        ))}
      </div>

      {/* Web3 Swap & DApps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* On-Chain DEX Swap (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg text-xs font-mono-numbers">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
              Non-Custodial DEX Aggregator
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              Optimal Route: 0.1% Slippage
            </span>
          </div>

          <form onSubmit={handleSwap} className="space-y-4">
            {/* Pay Token */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>You Pay</span>
                <span>Balance: 2.85 {fromToken}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white focus:outline-none"
                />
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-bold"
                >
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="SOL">SOL</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={() => {
                  const temp = fromToken;
                  setFromToken(toToken);
                  setToToken(temp);
                }}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md transition-colors"
              >
                ↓
              </button>
            </div>

            {/* Receive Token */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>You Receive (Estimated)</span>
                <span>Balance: 1,240.0 {toToken}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full text-lg font-bold text-emerald-400">
                  {swapAmount ? (parseFloat(swapAmount) * 3685).toFixed(2) : '0.00'}
                </div>
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-bold"
                >
                  <option value="FST">FST</option>
                  <option value="USDT">USDT</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400 px-1">
              <div className="flex justify-between">
                <span>Network Fee (Gas):</span>
                <span className="text-slate-200 font-semibold">$0.85 (0.00028 ETH)</span>
              </div>
              <div className="flex justify-between">
                <span>Price Impact:</span>
                <span className="text-emerald-400">&lt; 0.01%</span>
              </div>
            </div>

            {swapFeedback && (
              <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-300 text-[11px]">
                {swapFeedback}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all cursor-pointer"
            >
              Execute On-Chain Swap
            </button>
          </form>
        </div>

        {/* DApp Ecosystem Hub (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Verified DApp Directory ({selectedChain})
              </h3>
              <span className="text-xs text-slate-500">Auto-injects Provider</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dapps.map((dapp) => (
                <div
                  key={dapp.name}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{dapp.icon}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-400">
                      {dapp.cat}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs group-hover:text-purple-400 transition-colors flex items-center gap-1">
                    {dapp.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{dapp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Security Audited Smart Contracts &amp; Phishing Filter Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
