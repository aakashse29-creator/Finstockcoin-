import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Grid,
  Share2,
  Download,
  CloudCheck,
  Database
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
  onOpenShareModal: () => void;
  firebaseConnected?: boolean;
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
  onOpenShareModal,
  firebaseConnected = true,
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
    <header className="sticky top-0 z-40 bg-[#080b11] border-b border-slate-800/80 text-xs font-sans">
      <div className="max-w-[1720px] mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Brand Logo + Mega-Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className="flex items-center text-left cursor-pointer group"
          >
            {/* Desktop Full Logo */}
            <div className="hidden sm:block">
              <FinstockLogo variant="full" size="md" showTagline={false} />
            </div>
            {/* Mobile Compact Logo */}
            <div className="sm:hidden flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#080b11] rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs">
                  FS
                </div>
              </div>
              <span className="font-black text-sm tracking-tight text-white">
                FINSTOCK
              </span>
              <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-extrabold border border-emerald-500/30">
                FIU
              </span>
            </div>
          </button>

          {/* Desktop All Features Menu Button */}
          <button
            type="button"
            onClick={onOpenMegaMenu}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>All Features Menu</span>
          </button>
        </div>

        {/* Global Search Bar (Prominent Desktop) */}
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

        {/* Right Controls: APK Download, Share, Currency, Pro Mode, Wallet, Notifications, Profile, Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Prominent Android APK Download Button (Visible on ALL devices) */}
          <button
            type="button"
            onClick={onOpenDownloadModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold transition-all shadow-sm active:scale-95"
            title="Download Official Android APK"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline text-[11px]">APK</span>
            <span className="xs:hidden text-[10px]">APK</span>
          </button>

          {/* Prominent App Share Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 hover:text-blue-200 font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Share FinstockCoin App"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline text-[11px]">Share</span>
          </button>

          {/* Quick Search Button (Mobile/Tablet) */}
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            title="Search Coins & Features"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Simple vs Pro Mode Switch (Desktop/Tablet) */}
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

          {/* Currency Dropdown (Desktop/Tablet) */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 font-bold text-slate-200 transition-colors"
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

          {/* Desktop/Tablet Balance with Privacy Eye */}
          <div className="hidden sm:flex items-center bg-blue-600/15 border border-blue-500/30 rounded-xl overflow-hidden font-mono-numbers">
            <button
              type="button"
              onClick={() => onSelectTab('wallet')}
              className="px-2.5 py-1.5 text-blue-400 font-bold flex items-center gap-1.5 hover:bg-blue-600/25 transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 shrink-0" />
              <span>
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
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#080b11]" />
            </button>

            <NotificationCenter
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* User Profile Trigger Button */}
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-md hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer shrink-0"
            title="User Profile & Settings"
          >
            <div className="w-full h-full bg-[#080b11] rounded-full flex items-center justify-center text-white">
              <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
            </div>
          </button>

          {/* Top Mobile Menu Button (Hamburger Drawer) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Profile Dropdown / Bottom Sheet on Mobile */}
      {typeof document !== 'undefined' && showUserMenu && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-start justify-center sm:justify-end sm:p-4"
          onClick={() => setShowUserMenu(false)}
        >
          <div
            className="bg-[#0f141f] border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-3 w-full max-w-lg sm:max-w-none sm:w-72 sm:mt-12 text-xs relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="font-bold text-white text-sm">Account Overview</span>
              <button
                type="button"
                onClick={() => setShowUserMenu(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 mb-3">
              <div className="font-bold text-white text-sm">Aakash Sharma</div>
              <div className="text-[11px] text-slate-400 font-mono-numbers">UID: 809555649</div>
              <div className="mt-1 flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FIU-IND Verified (Tier 2)</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Cloud Storage:</span>
                <span className="text-blue-400 font-mono flex items-center gap-1">
                  <Database className="w-3 h-3 text-blue-400" />
                  <span>Firebase Firestore</span>
                </span>
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
                <span>13. Security &amp; Firebase 2FA</span>
                <span className="text-[10px] text-emerald-400 font-bold">Passkey</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab('wallet');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold transition-colors flex items-center justify-between"
              >
                <span>8. Spot &amp; Fiat Wallet</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold">₹{(totalUsdValue * rateToUSD).toFixed(0)}</span>
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

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenDownloadModal();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-bold transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Android APK</span>
                </button>

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
        </div>,
        document.body
      )}

      {/* Mobile Top Drawer (Menu) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0e17] border-b border-slate-800 px-4 py-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Quick Action Cards: APK Download & Share */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenDownloadModal();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Android APK</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenShareModal();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share App</span>
            </button>
          </div>

          {/* Quick Currency and Trading Mode Row */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-400">Currency:</span>
              <div className="flex gap-1">
                {(['INR', 'USD'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => onSelectCurrency(curr)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currency === curr ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleTradingMode}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
                tradingMode === 'pro'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{tradingMode === 'pro' ? 'Pro Scalper' : 'Simple Mode'}</span>
            </button>
          </div>

          {/* Full 14-Module Navigation List */}
          <div className="pt-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Exchange Modules
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between border ${
                    activeTab === item.id || (item.id === 'overview' && activeTab === 'home')
                      ? 'bg-blue-600/25 border-blue-500/40 text-blue-400'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[9px] shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
