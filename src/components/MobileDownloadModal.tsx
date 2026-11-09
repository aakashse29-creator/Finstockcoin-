import React, { useState } from 'react';
import { Smartphone, Apple, Download, QrCode, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDownloadModal: React.FC<MobileDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadStarted, setDownloadStarted] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setDownloadStarted('Downloading Finstock_v2.8.4_Official.apk (42.8 MB)... Verified SHA-256 signed binary.');
    setTimeout(() => {
      // Simulate direct download
      const element = document.createElement('a');
      const file = new Blob(['FINSTOCKCOIN_ANDROID_BINARY_SIGNATURE_OK'], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'finstock-release-v2.8.4.apk';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  const handleDownloadIos = () => {
    setDownloadStarted('Redirecting to Apple App Store / TestFlight beta channel for FINSTOCKCOIN iOS...');
    setTimeout(() => setDownloadStarted(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-[#0f141f] border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-xs">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 mx-auto mb-3 shadow-lg">
            <div className="w-full h-full bg-[#0a0e17] rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
              FS
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Download FINSTOCKCOIN Mobile
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Trade spot, futures, and manage INR fiat deposits on the go with biometric face-unlock and push alerts.
          </p>
        </div>

        {downloadStarted && (
          <div className="mb-4 p-3 rounded-xl bg-blue-950/50 border border-blue-500/40 text-blue-300 font-mono-numbers text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{downloadStarted}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Android Download */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <Smartphone className="w-5 h-5" />
                <span>Android (Google Play &amp; APK)</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-3">
                Supports Android 10+ devices. Includes background push notifications and fast biometric login.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadApk}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official APK</span>
            </button>
          </div>

          {/* iOS Download */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                <Apple className="w-5 h-5" />
                <span>Apple iOS (App Store)</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-3">
                Supports iPhone &amp; iPad iOS 16+. Native Swift performance with Apple Keychain and FaceID.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadIos}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Apple className="w-4 h-4" />
              <span>Apple App Store</span>
            </button>
          </div>
        </div>

        {/* QR Code & Integrity Check */}
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between font-mono-numbers text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-slate-200 font-semibold block">Scan to install directly</span>
              <span>SHA-256: 9f82c...419a (Certified Clean)</span>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
            v2.8.4 Release
          </span>
        </div>
      </div>
    </div>
  );
};
