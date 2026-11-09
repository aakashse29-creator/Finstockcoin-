import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Smartphone,
  Fingerprint,
  Mail,
  Laptop,
  CheckCircle,
  AlertOctagon,
  Lock
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [passkeysEnabled, setPasskeysEnabled] = useState<boolean>(true);
  const [whitelistEnabled, setWhitelistEnabled] = useState<boolean>(true);
  const [antiPhishingCode, setAntiPhishingCode] = useState<string>('FINSTOCK_SECURE_99');
  const [editingAntiPhishing, setEditingAntiPhishing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeSessions = [
    { id: '1', device: 'Chrome on macOS (Current)', ip: '103.212.14.88', location: 'Mumbai, India', status: 'Online' },
    { id: '2', device: 'FINSTOCK Android App', ip: '152.57.19.42', location: 'Bengaluru, India', status: 'Active 2h ago' },
    { id: '3', device: 'Safari on iPhone 15 Pro', ip: '49.36.88.12', location: 'Delhi, India', status: 'Active 1d ago' },
  ];

  const handleSaveAntiPhishing = (e: React.FormEvent) => {
    e.preventDefault();
    setEditingAntiPhishing(false);
    setFeedback(`Anti-phishing code updated to "${antiPhishingCode}". This code will appear in all official Finstock emails.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRevokeSessions = () => {
    setFeedback('All other active device sessions have been revoked. Password/2FA required to log back in.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Title Card */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank-Grade Cybersecurity Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Security &amp; Device Protection Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Institutional multi-signature vault custody, biometric passkeys, and real-time behavioral anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Security Score: 100/100 (Max Protected)
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 2FA & Biometrics */}
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-blue-400" />
            Two-Factor Authentication &amp; Passkeys
          </h3>

          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-white text-xs block">Authenticator App (TOTP)</span>
                <span className="text-[11px] text-slate-400">Google Authenticator or 1Password</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-purple-400" />
              <div>
                <span className="font-bold text-white text-xs block">Passkeys (FIDO2 / WebAuthn)</span>
                <span className="text-[11px] text-slate-400">Touch ID, Face ID, or YubiKey hardware key</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={passkeysEnabled}
                onChange={(e) => setPasskeysEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white text-xs block">Withdrawal Address Whitelist</span>
                <span className="text-[11px] text-slate-400">Withdraw only to pre-approved addresses with 24h delay</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whitelistEnabled}
                onChange={(e) => setWhitelistEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>

        {/* Anti-Phishing & Active Sessions */}
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 pb-3 border-b border-slate-800">
            <Mail className="w-4 h-4 text-emerald-400" />
            Anti-Phishing Protection
          </h3>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Your Anti-Phishing Code</span>
              <button
                type="button"
                onClick={() => setEditingAntiPhishing(!editingAntiPhishing)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                {editingAntiPhishing ? 'Cancel' : 'Change Code'}
              </button>
            </div>

            {editingAntiPhishing ? (
              <form onSubmit={handleSaveAntiPhishing} className="flex gap-2">
                <input
                  type="text"
                  value={antiPhishingCode}
                  onChange={(e) => setAntiPhishingCode(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="font-mono-numbers text-sm font-bold text-amber-400 bg-slate-800 px-3 py-2 rounded-lg">
                {antiPhishingCode}
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-2">
              Every authentic system notification and email from Finstock will include this exact code.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-slate-400" />
                Active Device Logins ({activeSessions.length})
              </span>
              <button
                type="button"
                onClick={handleRevokeSessions}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
              >
                Revoke Other Sessions
              </button>
            </div>

            <div className="space-y-1.5">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">{session.device}</span>
                    <span className="text-[10px] text-slate-500 font-mono-numbers">
                      {session.ip} • {session.location}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold ${
                    session.status.includes('Online') ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
