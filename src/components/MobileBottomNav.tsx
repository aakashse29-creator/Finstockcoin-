import React from 'react';
import { MainNavTab } from '../types/exchange';
import {
  Home,
  TrendingUp,
  ArrowLeftRight,
  Zap,
  Wallet,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenMegaMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMegaMenu,
}) => {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070a11]/95 backdrop-blur-lg border-t border-slate-800/90 px-1 py-1 safe-bottom shadow-[0_-8px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-6 items-center max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'overview' || activeTab === 'home'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Markets */}
        <button
          type="button"
          onClick={() => onSelectTab('markets')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'markets'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Markets</span>
        </button>

        {/* 3. Trade / Spot (Center glowing button) */}
        <button
          type="button"
          onClick={() => onSelectTab('spot')}
          className="flex flex-col items-center justify-center -mt-3 cursor-pointer group"
        >
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
              activeTab === 'spot'
                ? 'bg-blue-600 text-white shadow-blue-500/40 ring-2 ring-blue-400/50'
                : 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-blue-900/50'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-1 ${
              activeTab === 'spot' ? 'text-blue-400 font-bold' : 'text-slate-300'
            }`}
          >
            Trade
          </span>
        </button>

        {/* 4. Futures */}
        <button
          type="button"
          onClick={() => onSelectTab('futures')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'futures'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Futures</span>
        </button>

        {/* 5. Wallet */}
        <button
          type="button"
          onClick={() => onSelectTab('wallet')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'wallet'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Wallet</span>
        </button>

        {/* 6. All Features Menu */}
        <button
          type="button"
          onClick={onOpenMegaMenu}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#070a11]" />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-slate-300">Menu</span>
        </button>
      </div>
    </nav>
  );
};
