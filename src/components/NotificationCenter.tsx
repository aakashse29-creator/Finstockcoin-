import React, { useState } from 'react';
import { Bell, Check, ShieldAlert, ArrowDownLeft, TrendingUp, Sparkles, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'trade' | 'deposit' | 'security' | 'reward';
  isRead: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Order Executed • BUY 606 FST',
      message: 'Your Limit Buy order on FST/USDT filled at $8.42. 0.075% fee deducted via FST discount.',
      time: '5m ago',
      type: 'trade',
      isRead: false,
    },
    {
      id: 'n2',
      title: 'UPI INR Deposit Credited',
      message: '₹25,000 received via UPI (UTR: 492102948291). Penny-drop matched with PAN AAKASH SHARMA.',
      time: '1h ago',
      type: 'deposit',
      isRead: false,
    },
    {
      id: 'n3',
      title: '1% Section 194S TDS Certificate Ready',
      message: 'Quarterly TDS voucher generated for Form 26AS. Download available in Account & Tax Center.',
      time: '3h ago',
      type: 'security',
      isRead: true,
    },
    {
      id: 'n4',
      title: 'Earn Staking Reward Distributed',
      message: '+18.25 FST daily interest credited from FST Ecosystem Vault (18.5% APY).',
      time: '6h ago',
      type: 'reward',
      isRead: true,
    },
    {
      id: 'n5',
      title: 'New Device Login Authorized',
      message: 'Chrome on macOS (Mumbai, India • 103.212.14.88) verified via Passkey Biometrics.',
      time: '1d ago',
      type: 'security',
      isRead: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'trade':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'reward':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0f141f] border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans text-xs flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0a0e17] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white text-xs">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 transition-colors flex items-start gap-3 ${
              item.isRead ? 'bg-transparent hover:bg-slate-800/40' : 'bg-blue-950/20 hover:bg-blue-900/30'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-800 shrink-0">
              {getTypeIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-bold text-slate-100 text-xs truncate">{item.title}</span>
                <span className="text-[10px] text-slate-500 font-mono-numbers shrink-0">{item.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-[#0a0e17] border-t border-slate-800 text-center">
        <span className="text-[10px] text-slate-400">
          Push &amp; Email alerts synchronized with device settings
        </span>
      </div>
    </div>
  );
};
