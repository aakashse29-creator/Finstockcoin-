import React, { useState } from 'react';
import { TransactionRecord, FiatCurrency } from '../types/exchange';
import {
  History,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface TransactionHistoryViewProps {
  currency: FiatCurrency;
  currencySymbol: string;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  currency,
  currencySymbol,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('30d');

  const initialTransactions: TransactionRecord[] = [
    {
      id: 'TX-89421',
      type: 'BUY',
      asset: 'FST',
      amount: 606.0,
      price: 8.42,
      totalValue: 5102.52,
      quoteCurrency: 'USDT',
      fee: 3.82,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 2,
      txHash: '0x9fa1...88c2',
    },
    {
      id: 'TX-89420',
      type: 'DEPOSIT',
      asset: 'INR',
      amount: 25000.0,
      totalValue: 25000.0,
      quoteCurrency: 'INR',
      fee: 0,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 5,
      txHash: 'UPI/492102948291',
    },
    {
      id: 'TX-89418',
      type: 'SELL',
      asset: 'BTC',
      amount: 0.15,
      price: 91400.0,
      totalValue: 13710.0,
      quoteCurrency: 'USDT',
      fee: 10.28,
      tdsDeduction: 137.1, // 1% Section 194S TDS
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 24,
      txHash: '0x3ef4...b701',
    },
    {
      id: 'TX-89415',
      type: 'STAKE',
      asset: 'FST',
      amount: 1200.0,
      totalValue: 10104.0,
      quoteCurrency: 'USDT',
      fee: 0,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 48,
    },
    {
      id: 'TX-89410',
      type: 'REWARD',
      asset: 'FST',
      amount: 18.25,
      totalValue: 153.66,
      quoteCurrency: 'USDT',
      fee: 0,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 72,
    },
    {
      id: 'TX-89405',
      type: 'CONVERT',
      asset: 'USDT',
      amount: 500.0,
      totalValue: 500.0,
      quoteCurrency: 'FST',
      fee: 0,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 96,
    },
    {
      id: 'TX-89401',
      type: 'WITHDRAW',
      asset: 'USDT',
      amount: 1000.0,
      totalValue: 1000.0,
      quoteCurrency: 'USDT',
      fee: 1.0,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 120,
      txHash: '0x8821...4cc9',
    },
  ];

  const filtered = initialTransactions.filter((tx) => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = 'Transaction_ID,Type,Asset,Amount,Price,Total_Value,Currency,Fee,TDS_1_Percent,Status,Date,Hash\n';
    const rows = filtered
      .map(
        (t) =>
          `${t.id},${t.type},${t.asset},${t.amount},${t.price || ''},${t.totalValue},${t.quoteCurrency},${t.fee},${t.tdsDeduction || 0},${t.status},${new Date(t.timestamp).toISOString()},${t.txHash || ''}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FINSTOCK_Transaction_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Title */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Immutable Double-Entry Financial Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Complete Transaction History &amp; Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and export all spot trades, futures margin, deposits, withdrawals, conversions, and Indian 1% Section 194S TDS receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV / Tax Audit Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'BUY', 'SELL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'CONVERT', 'STAKE', 'REWARD'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, asset, hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase bg-[#0b0e14]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Asset / Amount</th>
                <th className="py-3 px-4 text-right">Price / Value</th>
                <th className="py-3 px-4 text-right">Fee</th>
                <th className="py-3 px-4 text-right">TDS (1% Sec 194S)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Blockchain / UTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tx) => {
                const isPositive = tx.type === 'BUY' || tx.type === 'DEPOSIT' || tx.type === 'REWARD';
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{tx.id}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'BUY' || tx.type === 'DEPOSIT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : tx.type === 'SELL' || tx.type === 'WITHDRAW'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {tx.amount.toLocaleString()} {tx.asset}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-200">
                      {tx.quoteCurrency === 'INR' ? '₹' : '$'}{tx.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {tx.fee ? `${tx.fee.toFixed(2)} ${tx.quoteCurrency}` : '0.00'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                      {tx.tdsDeduction ? `₹${tx.tdsDeduction.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {tx.txHash ? (
                        <span className="font-mono">{tx.txHash}</span>
                      ) : (
                        <span className="text-slate-600">Internal Ledger</span>
                      )}
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
