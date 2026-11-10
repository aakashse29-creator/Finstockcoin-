import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Send, Twitter, QrCode, X, Sparkles } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://finstockcoin.com';
  const shareText = 'Trade crypto, futures, options & earn with FinstockCoin — World-Class Global Crypto Exchange.';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FINSTOCKCOIN — Global Crypto Exchange',
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        console.log('Share canceled or error', err);
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} Join now: ${shareUrl}`
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-[#0f141f] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-xs">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 mx-auto mb-3 shadow-lg">
            <div className="w-full h-full bg-[#0a0e17] rounded-[14px] flex items-center justify-center text-blue-400">
              <Share2 className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white">Share FINSTOCKCOIN</h2>
          <p className="text-xs text-slate-400 mt-1">
            Invite fellow traders to India &amp; global's premier crypto, futures, and multi-asset ecosystem.
          </p>
        </div>

        {/* Native Web Share Button if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full mb-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Open System Share Menu (WhatsApp / Telegram / Apps)</span>
          </button>
        )}

        {/* Social Quick Share Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-bold flex flex-col items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-[11px]">WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-300 font-bold flex flex-col items-center gap-1.5 transition-colors"
          >
            <Send className="w-5 h-5 text-sky-400" />
            <span className="text-[11px]">Telegram</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex flex-col items-center gap-1.5 transition-colors"
          >
            <Twitter className="w-5 h-5 text-blue-400" />
            <span className="text-[11px]">X / Twitter</span>
          </a>
        </div>

        {/* Copy App Link */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">Exchange Referral &amp; App Link</label>
          <div className="flex items-center gap-2 bg-[#090d16] border border-slate-700 rounded-xl p-1.5 pl-3">
            <span className="text-slate-300 truncate font-mono text-[11px] flex-1">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-[11px] text-slate-400">
          <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Friends can scan your screen with any camera or QR scanner to open the exchange instantly.</span>
        </div>
      </div>
    </div>
  );
};
