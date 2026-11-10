import React, { useState, useEffect } from 'react';
import {
  MainNavTab,
  FiatCurrency,
  TradingMode,
  SpotPair,
  SpotOrder,
  FuturesContract,
  FuturesPosition,
  OptionItem,
  EarnPool,
  WalletAssetBalance,
  BankAccount,
  NomineeDetails,
  KYCData,
  AdminStats,
  AuditLog,
  Candle
} from './types/exchange';
import {
  CURRENCY_RATES,
  INITIAL_SPOT_PAIRS,
  INITIAL_FUTURES_CONTRACTS,
  INITIAL_POSITIONS,
  INITIAL_OPTIONS,
  INITIAL_EARN_POOLS,
  INITIAL_WALLET_BALANCES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_NOMINEE,
  INITIAL_KYC,
  INITIAL_ADMIN_STATS,
  INITIAL_AUDIT_LOGS,
  generateInitialCandles
} from './data/mockExchangeData';
import { Header } from './components/Header';
import { HomeOverview } from './components/HomeOverview';
import { MarketsView } from './components/MarketsView';
import { SpotTradingTerminal } from './components/SpotTradingTerminal';
import { FuturesTerminal } from './components/FuturesTerminal';
import { OptionsTerminal } from './components/OptionsTerminal';
import { EarnView } from './components/EarnView';
import { Web3VaultView } from './components/Web3VaultView';
import { OtherMarketsView } from './components/OtherMarketsView';
import { StocksView } from './components/StocksView';
import { CommoditiesView } from './components/CommoditiesView';
import { WalletView } from './components/WalletView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { AccountComplianceView } from './components/AccountComplianceView';
import { SecurityView } from './components/SecurityView';
import { HelpSupportView } from './components/HelpSupportView';
import { FinstockFunView } from './components/FinstockFunView';
import { FeeCenterView } from './components/FeeCenterView';
import { ApiDocsView } from './components/ApiDocsView';
import { AdminPortal } from './components/AdminPortal';
import { MegaMenuModal } from './components/MegaMenuModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { MobileDownloadModal } from './components/MobileDownloadModal';
import { SupportChatModal } from './components/SupportChatModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ShareAppModal } from './components/ShareAppModal';
import { testConnection } from './lib/firebase';
import { persistOrderToFirestore } from './lib/firestoreService';
import { MessageSquare, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('overview');
  const [currency, setCurrency] = useState<FiatCurrency>('INR');
  const [tradingMode, setTradingMode] = useState<TradingMode>('pro');
  const [hideBalance, setHideBalance] = useState<boolean>(false);

  // Modals & Drawers
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [supportChatOpen, setSupportChatOpen] = useState<boolean>(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [firebaseActive, setFirebaseActive] = useState<boolean>(true);

  // Initialize Firebase connection test on startup (required by firebase skill)
  useEffect(() => {
    testConnection().then((connected) => {
      setFirebaseActive(connected);
    });
  }, []);

  // Exchange State
  const [pairs, setPairs] = useState<SpotPair[]>(INITIAL_SPOT_PAIRS);
  const [selectedPair, setSelectedPair] = useState<SpotPair>(INITIAL_SPOT_PAIRS[0]);
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(INITIAL_SPOT_PAIRS[0].lastPrice, 40));
  const [orders, setOrders] = useState<SpotOrder[]>([
    {
      id: 'ord-init-1',
      pairId: 'FST_USDT',
      side: 'buy',
      type: 'limit',
      price: 8.25,
      amount: 150,
      filled: 0,
      status: 'open',
      timestamp: Date.now() - 3600000,
      fee: 0.12,
    },
  ]);

  const [futuresContracts, setFuturesContracts] = useState<FuturesContract[]>(INITIAL_FUTURES_CONTRACTS);
  const [futuresPositions, setFuturesPositions] = useState<FuturesPosition[]>(INITIAL_POSITIONS);
  const [options, setOptions] = useState<OptionItem[]>(INITIAL_OPTIONS);
  const [earnPools, setEarnPools] = useState<EarnPool[]>(INITIAL_EARN_POOLS);
  const [walletBalances, setWalletBalances] = useState<WalletAssetBalance[]>(INITIAL_WALLET_BALANCES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [nominee, setNominee] = useState<NomineeDetails>(INITIAL_NOMINEE);
  const [kyc, setKyc] = useState<KYCData>(INITIAL_KYC);
  const [adminStats, setAdminStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Currency calculations
  const currencyRate = CURRENCY_RATES[currency] || CURRENCY_RATES['USD'];
  const totalUsdValue = walletBalances.reduce((sum, b) => sum + b.usdValue, 0);

  // Quick lookup dictionary for user available balance per asset
  const userBalanceMap: { [asset: string]: number } = {};
  walletBalances.forEach((b) => {
    userBalanceMap[b.asset] = b.available;
  });

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Regenerate candles when selectedPair changes
  const handleSelectPair = (pair: SpotPair) => {
    setSelectedPair(pair);
    setCandles(generateInitialCandles(pair.lastPrice, 40));
    setActiveTab('spot');
  };

  // Live market price simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.49) * (p.lastPrice * 0.0008);
          const newPrice = Math.max(0.001, Number((p.lastPrice + delta).toFixed(p.pricePrecision)));
          return {
            ...p,
            lastPrice: newPrice,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update selectedPair price when pairs update
  useEffect(() => {
    const updated = pairs.find((p) => p.id === selectedPair.id);
    if (updated && updated.lastPrice !== selectedPair.lastPrice) {
      setSelectedPair(updated);
    }
  }, [pairs, selectedPair.id]);

  // Order Placement
  const handlePlaceOrder = (newOrderData: Omit<SpotOrder, 'id' | 'timestamp' | 'status' | 'filled'>) => {
    const orderId = `ord-${Date.now()}`;
    const newOrder: SpotOrder = {
      ...newOrderData,
      id: orderId,
      timestamp: Date.now(),
      status: newOrderData.type === 'market' ? 'filled' : 'open',
      filled: newOrderData.type === 'market' ? newOrderData.amount : 0,
    };

    setOrders((prev) => [newOrder, ...prev]);
    persistOrderToFirestore(newOrder); // Sync to Firebase Firestore

    // Update balances
    const [baseAsset, quoteAsset] = newOrder.pairId.split('_');
    const cost = newOrder.amount * newOrder.price;

    setWalletBalances((prev) =>
      prev.map((b) => {
        if (newOrder.side === 'buy') {
          if (b.asset === quoteAsset) {
            return {
              ...b,
              available: Math.max(0, b.available - cost),
              locked: newOrder.type === 'limit' ? b.locked + cost : b.locked,
            };
          }
          if (b.asset === baseAsset && newOrder.type === 'market') {
            return {
              ...b,
              total: b.total + newOrder.amount,
              available: b.available + newOrder.amount,
            };
          }
        } else {
          // Sell
          if (b.asset === baseAsset) {
            return {
              ...b,
              available: Math.max(0, b.available - newOrder.amount),
              locked: newOrder.type === 'limit' ? b.locked + newOrder.amount : b.locked,
            };
          }
          if (b.asset === quoteAsset && newOrder.type === 'market') {
            const netReceived = cost - (newOrder.tdsDeduction || 0) - newOrder.fee;
            return {
              ...b,
              total: b.total + netReceived,
              available: b.available + netReceived,
            };
          }
        }
        return b;
      })
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
  };

  // Futures Position Management
  const handleOpenPosition = (
    posData: Omit<FuturesPosition, 'id' | 'unrealizedPnL' | 'roePercent'>
  ) => {
    const newPos: FuturesPosition = {
      ...posData,
      id: `pos-${Date.now()}`,
      unrealizedPnL: 0,
      roePercent: 0,
    };
    setFuturesPositions((prev) => [newPos, ...prev]);

    // Lock margin in USDT
    setWalletBalances((prev) =>
      prev.map((b) =>
        b.asset === 'USDT'
          ? { ...b, available: Math.max(0, b.available - posData.margin), locked: b.locked + posData.margin }
          : b
      )
    );
  };

  const handleClosePosition = (positionId: string) => {
    const pos = futuresPositions.find((p) => p.id === positionId);
    if (!pos) return;

    setFuturesPositions((prev) => prev.filter((p) => p.id !== positionId));

    // Release margin back to USDT
    setWalletBalances((prev) =>
      prev.map((b) =>
        b.asset === 'USDT'
          ? { ...b, available: b.available + pos.margin + pos.unrealizedPnL, locked: Math.max(0, b.locked - pos.margin) }
          : b
      )
    );
  };

  // Staking
  const handleStake = (poolId: string, amount: number) => {
    setEarnPools((prev) =>
      prev.map((p) =>
        p.id === poolId
          ? { ...p, userStaked: p.userStaked + amount, totalStaked: p.totalStaked + amount }
          : p
      )
    );

    const pool = earnPools.find((p) => p.id === poolId);
    if (pool) {
      setWalletBalances((prev) =>
        prev.map((b) =>
          b.asset === pool.asset
            ? { ...b, available: Math.max(0, b.available - amount), locked: b.locked + amount }
            : b
        )
      );
    }
  };

  const handleRedeem = (poolId: string) => {
    const pool = earnPools.find((p) => p.id === poolId);
    if (!pool || pool.userStaked <= 0) return;

    const returnAmount = pool.userStaked + pool.earnedRewards;

    setEarnPools((prev) =>
      prev.map((p) =>
        p.id === poolId
          ? { ...p, userStaked: 0, earnedRewards: 0, totalStaked: Math.max(0, p.totalStaked - pool.userStaked) }
          : p
      )
    );

    setWalletBalances((prev) =>
      prev.map((b) =>
        b.asset === pool.asset
          ? { ...b, available: b.available + returnAmount, locked: Math.max(0, b.locked - pool.userStaked), total: b.total + pool.earnedRewards }
          : b
      )
    );
  };

  // Wallet Fiat Deposit
  const handleDepositFiat = (amount: number, method: string) => {
    setWalletBalances((prev) =>
      prev.map((b) =>
        b.asset === 'INR'
          ? {
              ...b,
              total: b.total + amount,
              available: b.available + amount,
              usdValue: (b.total + amount) / 87.5,
            }
          : b
      )
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: `Fiat INR Deposit of ₹${amount.toLocaleString()} via ${method} (Penny Drop Verified)`,
        actor: 'user:self',
        timestamp: Date.now(),
        ipAddress: '103.212.14.88',
        status: 'success',
        hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      },
      ...prev,
    ]);
  };

  // Wallet Withdrawal
  const handleWithdraw = (asset: string, amount: number, address: string) => {
    setWalletBalances((prev) =>
      prev.map((b) =>
        b.asset === asset
          ? {
              ...b,
              total: Math.max(0, b.total - amount),
              available: Math.max(0, b.available - amount),
            }
          : b
      )
    );
  };

  // Internal Transfer
  const handleTransfer = (asset: string, fromAccount: string, toAccount: string, amount: number) => {
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: `Internal Transfer ${amount} ${asset} from ${fromAccount} to ${toAccount}`,
        actor: 'user:self',
        timestamp: Date.now(),
        ipAddress: '103.212.14.88',
        status: 'success',
        hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      },
      ...prev,
    ]);
  };

  // Admin Circuit Breaker
  const handleToggleCircuitBreaker = () => {
    setAdminStats((prev) => ({
      ...prev,
      circuitBreakerActive: !prev.circuitBreakerActive,
    }));
  };

  const handleApproveKyc = (userId: string) => {
    setAdminStats((prev) => ({
      ...prev,
      pendingKycCount: Math.max(0, prev.pendingKycCount - 1),
    }));
  };

  const handleRejectKyc = (userId: string, reason: string) => {
    setAdminStats((prev) => ({
      ...prev,
      pendingKycCount: Math.max(0, prev.pendingKycCount - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Global Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currency={currency}
        onSelectCurrency={setCurrency}
        tradingMode={tradingMode}
        onToggleTradingMode={() => setTradingMode((prev) => (prev === 'pro' ? 'simple' : 'pro'))}
        totalUsdValue={totalUsdValue}
        currencySymbol={currencyRate.symbol}
        rateToUSD={currencyRate.rateToUSD}
        hideBalance={hideBalance}
        onToggleHideBalance={() => setHideBalance((prev) => !prev)}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
        onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
        onOpenMegaMenu={() => setMegaMenuOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
        firebaseConnected={firebaseActive}
      />

      {/* Main View Switcher with bottom padding for mobile navigation */}
      <main className="flex-1 w-full pb-24 md:pb-16">
        {(activeTab === 'overview' || activeTab === 'home') && (
          <HomeOverview
            pairs={pairs}
            balances={walletBalances}
            currency={currency}
            currencySymbol={currencyRate.symbol}
            rateToUSD={currencyRate.rateToUSD}
            hideBalance={hideBalance}
            onToggleHideBalance={() => setHideBalance((prev) => !prev)}
            onNavigateTab={setActiveTab}
            onSelectPair={handleSelectPair}
            onOpenDownloadModal={() => setDownloadModalOpen(true)}
            onOpenShareModal={() => setShareModalOpen(true)}
          />
        )}

        {activeTab === 'markets' && (
          <MarketsView
            pairs={pairs}
            onSelectPair={handleSelectPair}
            currency={currency}
            currencySymbol={currencyRate.symbol}
          />
        )}

        {activeTab === 'spot' && (
          <SpotTradingTerminal
            currentPair={selectedPair}
            pairs={pairs}
            onSelectPair={setSelectedPair}
            candles={candles}
            orders={orders}
            onPlaceOrder={handlePlaceOrder}
            onCancelOrder={handleCancelOrder}
            userBalances={userBalanceMap}
            tradingMode={tradingMode}
            onToggleTradingMode={() => setTradingMode((prev) => (prev === 'pro' ? 'simple' : 'pro'))}
            currency={currency}
            currencySymbol={currencyRate.symbol}
          />
        )}

        {activeTab === 'futures' && (
          <FuturesTerminal
            contracts={futuresContracts}
            positions={futuresPositions}
            onOpenPosition={handleOpenPosition}
            onClosePosition={handleClosePosition}
            availableUsdt={userBalanceMap['USDT'] || 0}
          />
        )}

        {activeTab === 'options' && (
          <OptionsTerminal
            options={options}
            btcSpotPrice={pairs.find((p) => p.id === 'BTC_USDT')?.lastPrice || 91450}
          />
        )}

        {activeTab === 'earn' && (
          <EarnView
            pools={earnPools}
            onStake={handleStake}
            onRedeem={handleRedeem}
            userBalances={userBalanceMap}
          />
        )}

        {activeTab === 'web3' && <Web3VaultView />}

        {activeTab === 'stocks' && <StocksView />}

        {activeTab === 'commodities' && <CommoditiesView />}

        {activeTab === 'other-markets' && (
          <OtherMarketsView
            pairs={pairs}
            onTradePair={handleSelectPair}
            currencySymbol={currencyRate.symbol}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletView
            balances={walletBalances}
            bankAccounts={bankAccounts}
            currency={currency}
            currencySymbol={currencyRate.symbol}
            rateToUSD={currencyRate.rateToUSD}
            onDepositFiat={handleDepositFiat}
            onWithdraw={handleWithdraw}
            onTransfer={handleTransfer}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistoryView
            currency={currency}
            currencySymbol={currencyRate.symbol}
          />
        )}

        {activeTab === 'account' && (
          <AccountComplianceView
            kyc={kyc}
            bankAccounts={bankAccounts}
            nominee={nominee}
            onUpdateNominee={setNominee}
            onAddBankAccount={(bank) => setBankAccounts((prev) => [...prev, bank])}
          />
        )}

        {activeTab === 'security' && <SecurityView />}

        {activeTab === 'support' && (
          <HelpSupportView onOpenLiveChat={() => setSupportChatOpen(true)} />
        )}

        {activeTab === 'fun' && (
          <FinstockFunView
            onRewardClaim={(text, amt) => {
              setWalletBalances((prev) =>
                prev.map((b) =>
                  b.asset === 'FST' ? { ...b, available: b.available + amt, total: b.total + amt } : b
                )
              );
            }}
          />
        )}

        {activeTab === 'fees' && <FeeCenterView />}

        {activeTab === 'api' && <ApiDocsView />}

        {activeTab === 'admin' && (
          <AdminPortal
            stats={adminStats}
            auditLogs={auditLogs}
            onToggleCircuitBreaker={handleToggleCircuitBreaker}
            onApproveKyc={handleApproveKyc}
            onRejectKyc={handleRejectKyc}
          />
        )}
      </main>

      {/* Floating 24/7 Support Assistant Button (positioned above mobile bottom navigation bar) */}
      <button
        type="button"
        onClick={() => setSupportChatOpen(true)}
        className="fixed bottom-16 md:bottom-5 right-4 md:right-5 z-30 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        title="24/7 AI Concierge & Support"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">24/7 AI Concierge &amp; Support</span>
      </button>

      {/* Persistent Mobile Bottom Navigation Bar (Fixed for mobile phone viewports) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMegaMenu={() => setMegaMenuOpen(true)}
      />

      {/* Modals and Overlays */}
      <MegaMenuModal
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
      />

      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        pairs={pairs}
        onSelectPair={handleSelectPair}
        onNavigateTab={setActiveTab}
      />

      <SupportChatModal
        isOpen={supportChatOpen}
        onClose={() => setSupportChatOpen(false)}
      />

      <MobileDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

      <ShareAppModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Regulatory & Institutional Footer */}
      <footer className="border-t border-slate-800 bg-[#06080e] text-slate-500 py-10 px-4 text-xs font-sans">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <span>FINSTOCKCOIN GLOBAL ECOSYSTEM</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">
                FIU-IND COMPLIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Virtual Digital Assets (VDA) are unregulated in certain jurisdictions. Trading cryptocurrencies carries financial risk.
              Indian residents are subject to Section 194S 1% TDS and Section 115BBH 30% flat taxation on net transfer consideration.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs">
            <button type="button" onClick={() => setActiveTab('overview')} className="hover:text-white">Overview</button>
            <button type="button" onClick={() => setActiveTab('spot')} className="hover:text-white">Spot</button>
            <button type="button" onClick={() => setActiveTab('stocks')} className="hover:text-white">Stocks</button>
            <button type="button" onClick={() => setActiveTab('commodities')} className="hover:text-white">Gold 24K</button>
            <button type="button" onClick={() => setActiveTab('history')} className="hover:text-white">History</button>
            <button type="button" onClick={() => setActiveTab('support')} className="hover:text-white">Help Center</button>
            <button type="button" onClick={() => setActiveTab('admin')} className="hover:text-white text-rose-400">Admin Control</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
