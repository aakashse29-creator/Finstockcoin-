import React, { useState } from 'react';
import { WalletAssetBalance, FiatCurrency, BankAccount } from '../types/exchange';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  QrCode,
  Copy,
  CheckCircle,
  ShieldCheck,
  Building,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface WalletViewProps {
  balances: WalletAssetBalance[];
  bankAccounts: BankAccount[];
  currency: FiatCurrency;
  currencySymbol: string;
  rateToUSD: number;
  onDepositFiat: (amount: number, method: string) => void;
  onWithdraw: (asset: string, amount: number, address: string) => void;
  onTransfer: (asset: string, fromAccount: string, toAccount: string, amount: number) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  balances,
  bankAccounts,
  currency,
  currencySymbol,
  rateToUSD,
  onDepositFiat,
  onWithdraw,
  onTransfer,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'transfer'>('overview');
  const [selectedAsset, setSelectedAsset] = useState<string>('USDT');
  const [network, setNetwork] = useState<string>('TRC20');
  const [copied, setCopied] = useState<boolean>(false);

  // Deposit state
  const [depositFiatAmount, setDepositFiatAmount] = useState<string>('25000');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'imps' | 'card'>('upi');
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawFeedback, setWithdrawFeedback] = useState<string | null>(null);

  // Transfer state
  const [transferFrom, setTransferFrom] = useState<string>('Spot');
  const [transferTo, setTransferTo] = useState<string>('Futures');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferFeedback, setTransferFeedback] = useState<string | null>(null);

  const totalUsdValue = balances.reduce((sum, b) => sum + b.usdValue, 0);
  const totalLocalValue = totalUsdValue * rateToUSD;

  const currentAssetBalance = balances.find((b) => b.asset === selectedAsset) || balances[0];

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFiatDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositFiatAmount);
    if (!amt || amt <= 0) return;
    onDepositFiat(amt, paymentMethod.toUpperCase());
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 4000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawFeedback('Please enter a valid withdrawal amount');
      return;
    }
    if (amt > currentAssetBalance.available) {
      setWithdrawFeedback(`Insufficient available balance. You have ${currentAssetBalance.available} ${selectedAsset}`);
      return;
    }
    if (!withdrawAddress.trim()) {
      setWithdrawFeedback('Please enter a valid destination address');
      return;
    }

    onWithdraw(selectedAsset, amt, withdrawAddress);
    setWithdrawFeedback(`Withdrawal initiated: ${amt} ${selectedAsset} to ${withdrawAddress.substring(0, 8)}... (1% TDS Certificate generated)`);
    setWithdrawAmount('');
    setTimeout(() => setWithdrawFeedback(null), 5000);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) {
      setTransferFeedback('Please enter a valid transfer amount');
      return;
    }
    onTransfer(selectedAsset, transferFrom, transferTo, amt);
    setTransferFeedback(`Transferred ${amt} ${selectedAsset} from ${transferFrom} to ${transferTo}`);
    setTransferAmount('');
    setTimeout(() => setTransferFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Portfolio Total Card */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Total Estimated Portfolio Balance
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono-numbers">
              {currencySymbol}{totalLocalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-semibold text-slate-400 font-mono-numbers">
              ≈ ${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24h Profit: +{currencySymbol}{(totalLocalValue * 0.042).toFixed(2)} (+4.20%)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('deposit')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdraw')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'overview', label: 'Assets Overview' },
          { id: 'deposit', label: 'Deposit (Crypto & INR/Fiat)' },
          { id: 'withdraw', label: 'Withdraw (with TDS Certificate)' },
          { id: 'transfer', label: 'Internal Transfer (Zero Fee)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-numbers text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Total Balance</th>
                  <th className="py-3 px-4 text-right">Available</th>
                  <th className="py-3 px-4 text-right">In Orders / Locked</th>
                  <th className="py-3 px-4 text-right">Value ({currency})</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {balances.map((item) => {
                  const localVal = item.usdValue * rateToUSD;
                  return (
                    <tr key={item.asset} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                            style={{ backgroundColor: item.iconColor }}
                          >
                            {item.asset.substring(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">{item.asset}</span>
                            <span className="text-[11px] text-slate-400">{item.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-200 font-bold text-sm">
                        {item.total.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-medium">
                        {item.available.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400">
                        {item.locked.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-100 font-bold">
                        {currencySymbol}{localVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAsset(item.asset);
                              setActiveTab('deposit');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-semibold"
                          >
                            Deposit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAsset(item.asset);
                              setActiveTab('withdraw');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                          >
                            Withdraw
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Deposit */}
      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Crypto Deposit (6 cols) */}
          <div className="lg:col-span-6 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-400" />
              Deposit Cryptocurrency
            </h3>
            <p className="text-xs text-slate-400 mb-4">Select coin and network to generate your dedicated deposit address</p>

            <div className="space-y-4 text-xs font-mono-numbers">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Select Asset</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                >
                  <option value="USDT">USDT (Tether USD)</option>
                  <option value="FST">FST (Finstock Token)</option>
                  <option value="BTC">BTC (Bitcoin)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                  <option value="SOL">SOL (Solana)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Deposit Network</label>
                <div className="grid grid-cols-3 gap-2">
                  {['TRC20', 'ERC20', 'BEP20'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setNetwork(net)}
                      className={`py-2 rounded-lg font-bold text-xs transition-colors ${
                        network === net ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code and Address Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center">
                {/* SVG QR Code Simulation */}
                <div className="w-36 h-36 bg-white p-2 rounded-lg shadow-md mb-3 flex items-center justify-center">
                  <div className="w-full h-full border-4 border-black p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-black" />
                      <div className="w-6 h-6 bg-black" />
                    </div>
                    <div className="text-[9px] font-bold text-black tracking-widest uppercase">
                      FINSTOCK {selectedAsset}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-black" />
                      <div className="w-3 h-3 bg-black self-end" />
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 uppercase mb-1">Your {network} Deposit Address</span>
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 max-w-full">
                  <span className="text-slate-200 font-semibold text-xs truncate">
                    TQn7Z45xM928Vj7cR98K3BvL1028sFxA
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('TQn7Z45xM928Vj7cR98K3BvL1028sFxA')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <span className="text-[10px] text-emerald-400 mt-1">Copied to clipboard!</span>}
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Send only {selectedAsset} to this address via {network}. Deposits require 12 network confirmations before crediting.</span>
              </div>
            </div>
          </div>

          {/* Fiat Deposit (INR UPI / IMPS / Wire) (6 cols) */}
          <div className="lg:col-span-6 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              Instant Fiat Deposit (INR / UPI / IMPS)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Zero deposit fees. Approved by FIU-IND with automated penny-drop verification.</p>

            <form onSubmit={handleFiatDepositSubmit} className="space-y-4 text-xs font-mono-numbers">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'imps', label: 'IMPS / NEFT' },
                    { id: 'card', label: 'Card / Wire' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-2 rounded-lg font-bold text-xs transition-colors ${
                        paymentMethod === m.id ? 'bg-emerald-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Amount to Deposit</label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={depositFiatAmount}
                    onChange={(e) => setDepositFiatAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">INR (₹)</span>
                </div>
              </div>

              {/* UPI Beneficiary Info */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Virtual UPI ID:</span>
                    <span className="text-emerald-400 font-bold">finstock.pay@hdfcbank</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Merchant Name:</span>
                    <span className="text-slate-200">FINSTOCK TECH PVT LTD</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Supported Apps:</span>
                    <span className="text-slate-200">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              )}

              {/* IMPS Beneficiary Info */}
              {paymentMethod === 'imps' && (
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Account Name:</span>
                    <span className="text-slate-200 font-semibold">FINSTOCK TECH PVT LTD</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Virtual Account:</span>
                    <span className="text-emerald-400 font-bold">FINS8095556495</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IFSC Code:</span>
                    <span className="text-slate-200 font-semibold">HDFC0000001</span>
                  </div>
                </div>
              )}

              {depositSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Instant deposit of ₹{depositFiatAmount} received and credited to your INR wallet!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                Deposit ₹{depositFiatAmount} via {paymentMethod.toUpperCase()}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Withdraw */}
      {activeTab === 'withdraw' && (
        <div className="max-w-xl mx-auto w-full bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-rose-400" />
            Secure Withdrawal &amp; Tax Compliance
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Under Indian Finance Act Sec 194S, 1% TDS is automatically computed and remitted to the Income Tax Department with instant certificate generation.
          </p>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-mono-numbers">
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Select Asset</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              >
                {balances.map((b) => (
                  <option key={b.asset} value={b.asset}>
                    {b.asset} - Available: {b.available}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Destination Address / IBAN / Account</label>
              <input
                type="text"
                placeholder="Enter whitelisted destination address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                <span>Withdrawal Amount</span>
                <span>Max: {currentAssetBalance.available} {selectedAsset}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(currentAssetBalance.available.toString())}
                  className="absolute right-2 top-2 px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 text-[10px] font-bold"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* TDS & Net Breakdown */}
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Network / Processing Fee:</span>
                <span className="text-slate-200">0.001 {selectedAsset}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  1% Section 194S TDS:
                </span>
                <span>{withdrawAmount ? (parseFloat(withdrawAmount) * 0.01).toFixed(4) : '0.0000'} {selectedAsset}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-white font-bold text-xs">
                <span>Net You Receive:</span>
                <span className="text-emerald-400">
                  {withdrawAmount ? (parseFloat(withdrawAmount) * 0.99 - 0.001).toFixed(4) : '0.0000'} {selectedAsset}
                </span>
              </div>
            </div>

            {withdrawFeedback && (
              <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs">
                {withdrawFeedback}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
            >
              Confirm Withdrawal
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Internal Transfer */}
      {activeTab === 'transfer' && (
        <div className="max-w-xl mx-auto w-full bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
            Internal Account Transfer
          </h3>
          <p className="text-xs text-slate-400 mb-4">Instant balance transfer between Spot, Futures, Staking, and Web3 accounts. Zero fees.</p>

          <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs font-mono-numbers">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">From Account</label>
                <select
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                >
                  <option value="Spot">Spot Wallet</option>
                  <option value="Futures">Futures Margin</option>
                  <option value="Earn">Earn Vault</option>
                  <option value="Web3">Web3 Vault</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">To Account</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                >
                  <option value="Futures">Futures Margin</option>
                  <option value="Spot">Spot Wallet</option>
                  <option value="Earn">Earn Vault</option>
                  <option value="Web3">Web3 Vault</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Asset</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              >
                {balances.map((b) => (
                  <option key={b.asset} value={b.asset}>
                    {b.asset} ({b.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Amount</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {transferFeedback && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                {transferFeedback}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all cursor-pointer"
            >
              Transfer Funds
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
