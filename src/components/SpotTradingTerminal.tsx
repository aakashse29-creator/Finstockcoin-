import React, { useState } from 'react';
import {
  SpotPair,
  SpotOrder,
  TradingMode,
  FiatCurrency,
  Candle
} from '../types/exchange';
import { CandleChart } from './CandleChart';
import { OrderBook } from './OrderBook';
import {
  calculateIndianTDS,
  calculateTradeFee,
  matchOrderAgainstBook
} from '../utils/exchangeMath';
import {
  Zap,
  ShieldCheck,
  Percent,
  Sliders,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Search,
  Sparkles
} from 'lucide-react';

interface SpotTradingTerminalProps {
  currentPair: SpotPair;
  pairs: SpotPair[];
  onSelectPair: (pair: SpotPair) => void;
  candles: Candle[];
  orders: SpotOrder[];
  onPlaceOrder: (order: Omit<SpotOrder, 'id' | 'timestamp' | 'status' | 'filled'>) => void;
  onCancelOrder: (orderId: string) => void;
  userBalances: { [asset: string]: number };
  tradingMode: TradingMode;
  onToggleTradingMode: () => void;
  currency: FiatCurrency;
  currencySymbol: string;
}

export const SpotTradingTerminal: React.FC<SpotTradingTerminalProps> = ({
  currentPair,
  pairs,
  onSelectPair,
  candles,
  orders,
  onPlaceOrder,
  onCancelOrder,
  userBalances,
  tradingMode,
  onToggleTradingMode,
  currencySymbol,
}) => {
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop_limit' | 'convert'>('limit');
  const [priceInput, setPriceInput] = useState<string>(currentPair.lastPrice.toString());
  const [amountInput, setAmountInput] = useState<string>('');
  const [percentSlider, setPercentSlider] = useState<number>(0);
  const [payFeeWithFST, setPayFeeWithFST] = useState<boolean>(true);
  const [vipTier, setVipTier] = useState<number>(1);
  const [stopPriceInput, setStopPriceInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPairDropdown, setShowPairDropdown] = useState<boolean>(false);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Balances
  const baseAssetBalance = userBalances[currentPair.baseAsset] || 0;
  const quoteAssetBalance = userBalances[currentPair.quoteAsset] || 0;

  const numericPrice = orderType === 'market' ? currentPair.lastPrice : parseFloat(priceInput) || currentPair.lastPrice;
  const numericAmount = parseFloat(amountInput) || 0;
  const totalValue = numericPrice * numericAmount;

  // Indian TDS: Section 194S (1% on sale consideration or INR markets)
  const isIndianOrINR = currentPair.quoteAsset === 'INR' || orderSide === 'sell';
  const tdsInfo = isIndianOrINR
    ? calculateIndianTDS(numericAmount, numericPrice, 0.01)
    : null;

  // Fee calculation with 25% discount if paid with FST
  const feeInfo = calculateTradeFee(
    numericAmount,
    numericPrice,
    orderType === 'limit',
    vipTier,
    payFeeWithFST
  );

  const handlePercentClick = (pct: number) => {
    setPercentSlider(pct);
    if (orderSide === 'buy') {
      const maxSpendable = quoteAssetBalance * (pct / 100);
      if (numericPrice > 0) {
        const calculatedAmount = maxSpendable / numericPrice;
        setAmountInput(calculatedAmount.toFixed(currentPair.amountPrecision));
      }
    } else {
      const calculatedAmount = baseAssetBalance * (pct / 100);
      setAmountInput(calculatedAmount.toFixed(currentPair.amountPrecision));
    }
  };

  const handlePriceSelect = (price: number) => {
    setPriceInput(price.toFixed(currentPair.pricePrecision));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setOrderFeedback('Please enter a valid amount');
      return;
    }

    if (orderSide === 'buy' && totalValue > quoteAssetBalance) {
      setOrderFeedback(`Insufficient ${currentPair.quoteAsset} balance`);
      return;
    }

    if (orderSide === 'sell' && numericAmount > baseAssetBalance) {
      setOrderFeedback(`Insufficient ${currentPair.baseAsset} balance`);
      return;
    }

    onPlaceOrder({
      pairId: currentPair.id,
      side: orderSide,
      type: orderType === 'convert' ? 'market' : orderType,
      price: numericPrice,
      amount: numericAmount,
      fee: feeInfo.feeAmount,
      tdsDeduction: tdsInfo ? tdsInfo.tdsDeduction : 0,
    });

    setOrderFeedback(`Order placed: ${orderSide.toUpperCase()} ${numericAmount} ${currentPair.baseAsset}`);
    setAmountInput('');
    setPercentSlider(0);
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  const filteredPairs = pairs.filter((p) =>
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.baseAsset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 p-2 sm:p-4 max-w-[1720px] mx-auto w-full">
      {/* Ticker & Pair Bar */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Pair Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPairDropdown(!showPairDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {currentPair.baseAsset.substring(0, 3)}
            </div>
            <div className="text-left">
              <span className="font-bold text-white text-sm block leading-tight">{currentPair.symbol}</span>
              <span className="text-[10px] text-slate-400 uppercase">{currentPair.category}</span>
            </div>
            <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showPairDropdown && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-[#0d121d] border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-xs">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredPairs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPair(p);
                      setShowPairDropdown(false);
                      setPriceInput(p.lastPrice.toString());
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-left transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{p.symbol}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5">{p.category}</span>
                    </div>
                    <div className="text-right font-mono-numbers">
                      <div className="text-slate-200 font-medium">{p.lastPrice.toFixed(p.pricePrecision)}</div>
                      <div className={`text-[10px] ${p.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {p.change24h >= 0 ? '+' : ''}{p.change24h}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 24h Stats Ribbon */}
        <div className="flex flex-wrap items-center gap-6 font-mono-numbers text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Last Price</div>
            <div className={`text-base font-bold ${currentPair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentPair.lastPrice.toFixed(currentPair.pricePrecision)} <span className="text-[11px] font-normal text-slate-400">{currentPair.quoteAsset}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">24h Change</div>
            <div className={`font-semibold ${currentPair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">24h High</div>
            <div className="text-slate-200 font-semibold">{currentPair.high24h.toFixed(currentPair.pricePrecision)}</div>
          </div>

          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">24h Low</div>
            <div className="text-slate-200 font-semibold">{currentPair.low24h.toFixed(currentPair.pricePrecision)}</div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">24h Volume ({currentPair.quoteAsset})</div>
            <div className="text-slate-200 font-semibold">{currentPair.volume24h.toLocaleString()}</div>
          </div>
        </div>

        {/* Mode Switcher Badge (Simple vs Pro Scalper) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTradingMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              tradingMode === 'pro'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-blue-600/20 border-blue-500/40 text-blue-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{tradingMode === 'pro' ? 'Pro Scalper Mode' : 'Simple Beginner Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chart + OrderBook + Order Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Chart Column (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col min-h-[420px]">
          <CandleChart
            candles={candles}
            symbol={currentPair.symbol}
            lastPrice={currentPair.lastPrice}
            currencySymbol={currencySymbol}
            onPriceSelect={handlePriceSelect}
          />
        </div>

        {/* Order Book Column (2 cols on lg, or 3 cols) */}
        <div className="lg:col-span-2 hidden md:flex flex-col min-h-[420px]">
          <OrderBook
            lastPrice={currentPair.lastPrice}
            change24h={currentPair.change24h}
            pricePrecision={currentPair.pricePrecision}
            onSelectPrice={handlePriceSelect}
            onSelectAmount={(amt) => setAmountInput(amt.toString())}
          />
        </div>

        {/* Order Placement Form Column (3 cols on lg) */}
        <div className="lg:col-span-3 flex flex-col bg-[#0f141f] border border-slate-800/80 rounded-xl p-4 shadow-lg text-xs">
          {/* Buy / Sell Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setOrderSide('buy')}
              className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                orderSide === 'buy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Buy {currentPair.baseAsset}
            </button>
            <button
              type="button"
              onClick={() => setOrderSide('sell')}
              className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                orderSide === 'sell'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Sell {currentPair.baseAsset}
            </button>
          </div>

          {/* Order Type Toggle */}
          <div className="flex items-center justify-between bg-slate-900/80 rounded-lg p-1 border border-slate-800 mb-3 text-[11px]">
            {(['limit', 'market', 'stop_limit', 'convert'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`flex-1 py-1 rounded font-medium capitalize transition-colors ${
                  orderType === type
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'stop_limit' ? 'Stop' : type}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="flex flex-col gap-3 flex-1 justify-between">
            <div className="space-y-3">
              {/* Balances Display */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono-numbers">
                <span>Avail:</span>
                <span className="text-slate-200 font-semibold">
                  {orderSide === 'buy'
                    ? `${quoteAssetBalance.toLocaleString()} ${currentPair.quoteAsset}`
                    : `${baseAssetBalance.toFixed(currentPair.amountPrecision)} ${currentPair.baseAsset}`}
                </span>
              </div>

              {/* Stop Price Input if stop_limit */}
              {orderType === 'stop_limit' && (
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">
                    Stop Trigger Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={stopPriceInput}
                      onChange={(e) => setStopPriceInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono-numbers text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-slate-500">{currentPair.quoteAsset}</span>
                  </div>
                </div>
              )}

              {/* Price Input (Disabled if Market or Convert) */}
              {orderType !== 'market' && orderType !== 'convert' && (
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono-numbers text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-slate-500">{currentPair.quoteAsset}</span>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase mb-1">
                  <span>Amount</span>
                  <span className="text-slate-500 font-normal">Min: 0.001</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      setPercentSlider(0);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono-numbers text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-500">{currentPair.baseAsset}</span>
                </div>
              </div>

              {/* Percentage Quick Selector */}
              <div className="grid grid-cols-4 gap-1.5">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentClick(pct)}
                    className={`py-1 rounded text-[10px] font-semibold transition-colors ${
                      percentSlider === pct
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Summary / Calculation Box */}
              <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800 space-y-1.5 font-mono-numbers text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Order Value:</span>
                  <span className="text-slate-200 font-semibold">
                    {totalValue.toFixed(2)} {currentPair.quoteAsset}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    Est. Fee:
                    <span className="text-[10px] text-amber-400">(VIP {vipTier})</span>
                  </span>
                  <span className="text-slate-300">
                    {feeInfo.feeAmount.toFixed(4)} {currentPair.quoteAsset}
                  </span>
                </div>

                {/* Indian Section 194S TDS compliance breakdown */}
                {isIndianOrINR && tdsInfo && (
                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-amber-400 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      1% Section 194S TDS:
                    </span>
                    <span>-{tdsInfo.tdsDeduction.toFixed(2)} {currentPair.quoteAsset}</span>
                  </div>
                )}
              </div>

              {/* Pay Fees with FST token toggle (25% off) */}
              <label className="flex items-center justify-between text-[11px] text-slate-400 cursor-pointer px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use FST for 25% fee discount</span>
                </span>
                <input
                  type="checkbox"
                  checked={payFeeWithFST}
                  onChange={(e) => setPayFeeWithFST(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
              </label>

              {orderFeedback && (
                <div className="p-2 rounded-lg bg-blue-900/30 border border-blue-700/50 text-blue-300 text-[11px]">
                  {orderFeedback}
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer ${
                orderSide === 'buy'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
              }`}
            >
              {orderSide === 'buy' ? 'Buy' : 'Sell'} {currentPair.baseAsset}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Tabs: Open Orders, Order History, Trade History */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg mt-1 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-[#0b0e14]">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-xs">Orders & History</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[11px] font-mono-numbers">
              {orders.filter((o) => o.status === 'open').length} Open
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-numbers">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Pair</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Side</th>
                <th className="py-2.5 px-4 text-right">Price</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-right">Filled</th>
                <th className="py-2.5 px-4 text-right">TDS (1%)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 italic">
                    No orders placed yet. Enter an order above to start trading.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">{order.pairId.replace('_', '/')}</td>
                    <td className="py-2.5 px-4 text-slate-400 capitalize">{order.type}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-semibold uppercase ${order.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-200">{order.price.toFixed(2)}</td>
                    <td className="py-2.5 px-4 text-right text-slate-200">{order.amount.toFixed(4)}</td>
                    <td className="py-2.5 px-4 text-right text-slate-400">{order.filled.toFixed(4)}</td>
                    <td className="py-2.5 px-4 text-right text-amber-400">
                      {order.tdsDeduction ? `₹${order.tdsDeduction.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.status === 'open'
                          ? 'bg-blue-500/20 text-blue-400'
                          : order.status === 'filled'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {order.status === 'open' && (
                        <button
                          type="button"
                          onClick={() => onCancelOrder(order.id)}
                          className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-semibold text-[10px] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
