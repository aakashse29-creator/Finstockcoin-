import React, { useState } from 'react';
import { MainNavTab, FiatCurrency, TradingMode } from '../types/exchange';
import { FinstockLogo } from './FinstockLogo';
import { NotificationCenter } from './NotificationCenter';
import {
  TrendingUp,
  Wallet,
  ShieldCheck,
  User,
  Zap,
  Globe,
  Smartphone,
  Menu,
  X,
  ChevronDown,
  Lock,
  Search,
  Bell,
  Eye,
  EyeOff,
  Grid
} from 'lucide-react';

interface HeaderProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  currency: FiatCurrency;
  onSelectCurrency: (c: FiatCurrency) => void;
  tradingMode: TradingMode;
  onToggleTradingMode: () => void;
  totalUsdValue: number;
  currencySymbol: string;
  rateToUSD: number;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  onOpenDownloadModal: () => void;
  onOpenGlobalSearch: () => void;
  onOpenMegaMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currency,
  onSelectCurrency,
  tradingMode,
  onToggleTradingMode,
  totalUsdValue,
  currencySymbol,
  rateToUSD,
  hideBalance,
  onToggleHideBalance,
  onOpenDownloadModal,
  onOpenGlobalSearch,
  onOpenMegaMenu,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const localBalance = totalUsdValue * rateToUSD;

  // The 14 official Master Navigation items
  const mainNavItems: { id: MainNavTab; label: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'markets', label: 'Markets' },
    { id: 'spot', label: 'Spot' },
    { id: 'futures', label: 'Futures', badge: '100x' },
    { id: 'options', label: 'Options' },
    { id: 'earn', label: 'Earn', badge: '18.5%' },
    { id: 'web3', label: 'Web3' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'history', label: 'History' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'commodities', label: 'Commodities' },
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'support', label: 'Support' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080b11]/95 backdrop-blur-md border-b border-slate-800/80 text-xs font-sans">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Lockup: Brand Logo + Mega-Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Logo with Hex crest and wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className="flex items-center text-left cursor-pointer group"
          >
            <FinstockLogo variant="full" size="md" showTagline={false} />
          </button>

          {/* All Features Menu Button */}
          <button
            type="button"
            onClick={onOpenMegaMenu}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>All Features Menu</span>
          </button>
        </div>

        {/* Global Search Bar (Prominent) */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-2">
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0d121d] border border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs">Search pairs, wallet, TDS...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Primary Desktop Nav Links (Visible high-priority) */}
        <nav className="hidden 2xl:flex items-center gap-1">
          {mainNavItems.slice(0, 9).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === item.id || (item.id === 'overview' && activeTab === 'home')
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Tools: Currency, Simple/Pro Mode, Privacy Eye, Wallet, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Simple vs Pro Scalper Switch */}
          <button
            type="button"
            onClick={onToggleTradingMode}
            title="Toggle Beginner Simple Mode / Pro Scalper Mode"
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
              tradingMode === 'pro'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{tradingMode === 'pro' ? 'Pro' : 'Simple'}</span>
          </button>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 font-bold text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCurrencyMenu && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-[#0f141f] border border-slate-700 rounded-xl shadow-2xl p-1 z-50">
                {(['INR', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => {
                      onSelectCurrency(curr);
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currency === curr ? 'text-blue-400 bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>{curr}</span>
                    <span className="text-slate-500">
                      {curr === 'INR' ? '₹' : curr === 'USD' ? '$' : curr === 'EUR' ? '€' : '£'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Balance with Privacy Hide/Show Eye Toggle */}
          <div className="flex items-center bg-blue-600/15 border border-blue-500/30 rounded-xl overflow-hidden font-mono-numbers">
            <button
              type="button"
              onClick={() => onSelectTab('wallet')}
              className="px-3 py-1.5 text-blue-400 font-bold flex items-center gap-1.5 hover:bg-blue-600/25 transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {hideBalance ? '••••••••' : `${currencySymbol}${localBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              </span>
            </button>
            <button
              type="button"
              onClick={onToggleHideBalance}
              title={hideBalance ? 'Show balance' : 'Hide balance for privacy'}
              className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-l border-blue-500/30"
            >
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#080b11]" />
            </button>

            <NotificationCenter
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Mobile Download CTA */}
          <button
            type="button"
            onClick={onOpenDownloadModal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>App</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-md hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
            >
              <div className="w-full h-full bg-[#080b11] rounded-full flex items-center justify-center text-white">
                <User className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f141f] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 mb-2">
                  <div className="font-bold text-white text-sm">Aakash Sharma</div>
                  <div className="text-[11px] text-slate-400 font-mono-numbers">UID: 809555649</div>
                  <div className="mt-2 flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>FIU-IND Verified (Tier 2)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('account');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>12. Account &amp; KYC</span>
                    <span className="text-[10px] text-emerald-400 font-bold">1% TDS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('security');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>13. Security &amp; 2FA</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Passkey</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('history');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>9. Transaction History</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('support');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>14. Help &amp; Support</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 font-bold transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-400" />
                      <span>Admin Control Panel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="2xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-[#0a0e17] border-b border-slate-800 px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onOpenMegaMenu();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 mb-2"
          >
            <Grid className="w-4 h-4" />
            <span>Open All 14 Features Menu</span>
          </button>

          {mainNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center justify-between ${
                activeTab === item.id || (item.id === 'overview' && activeTab === 'home')
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
