import React, { useState } from 'react';
import { AdminStats, AuditLog } from '../types/exchange';
import {
  ShieldAlert,
  AlertOctagon,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Database,
  FileCheck,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminPortalProps {
  stats: AdminStats;
  auditLogs: AuditLog[];
  onToggleCircuitBreaker: () => void;
  onApproveKyc: (userId: string) => void;
  onRejectKyc: (userId: string, reason: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  stats,
  auditLogs,
  onToggleCircuitBreaker,
  onApproveKyc,
  onRejectKyc,
}) => {
  const [adminRole, setAdminRole] = useState<'super_admin' | 'compliance_officer' | 'risk_manager'>('super_admin');
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc_queue' | 'withdrawals' | 'audit_trail'>('overview');
  const [showCircuitBreakerModal, setShowCircuitBreakerModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pendingKycUsers = [
    { id: 'usr-1049', name: 'Vikram Patel', country: 'India', doc: 'PAN + Aadhaar', submitted: '12m ago', risk: 'Low' },
    { id: 'usr-1050', name: 'Elena Rostova', country: 'Germany', doc: 'EU Passport', submitted: '24m ago', risk: 'Low' },
    { id: 'usr-1051', name: 'Rajesh Mehra', country: 'India', doc: 'PAN Card', submitted: '45m ago', risk: 'Medium' },
  ];

  const pendingWithdrawals = [
    { id: 'wd-891', user: 'usr-921', asset: 'USDT', amount: '250,000.00', dest: '0x3a8...e491', status: 'Requires Checker Sign-off' },
    { id: 'wd-892', user: 'usr-441', asset: 'BTC', amount: '12.50', dest: 'bc1q9...7k20', status: 'Requires Checker Sign-off' },
  ];

  const handleCircuitBreakerConfirm = () => {
    onToggleCircuitBreaker();
    setShowCircuitBreakerModal(false);
    setFeedback(stats.circuitBreakerActive ? 'Emergency Circuit Breaker DEACTIVATED. Normal trading resumed.' : 'EMERGENCY CIRCUIT BREAKER ACTIVATED: All matching engine pairs paused.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1500px] mx-auto w-full font-sans">
      {/* Admin Header */}
      <div className="bg-[#0f141f] border border-rose-900/40 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>FINSTOCK ROOT ADMIN &amp; SURVEILLANCE SUITE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Institutional Exchange Control Panel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maker-Checker governance, immutable double-entry ledger audits, and sub-millisecond risk controls.
          </p>
        </div>

        {/* Role Selector & Emergency Circuit Breaker */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-semibold">
            {(['super_admin', 'compliance_officer', 'risk_manager'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setAdminRole(role)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  adminRole === role ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCircuitBreakerModal(true)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              stats.circuitBreakerActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 animate-pulse'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{stats.circuitBreakerActive ? 'Resume Trading Engine' : 'Emergency Circuit Breaker'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-numbers">
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Total Assets Under Management (AUM)</span>
          <div className="text-2xl font-black text-white">${(stats.totalAUM / 1000000).toFixed(1)}M</div>
          <span className="text-emerald-400 text-[11px] font-semibold mt-1 block">+12.4% this month</span>
        </div>

        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">24h System Trading Volume</span>
          <div className="text-2xl font-black text-blue-400">${(stats.volume24h / 1000000).toFixed(1)}M</div>
          <span className="text-slate-400 text-[11px] mt-1 block">Peak 28,450 req/sec</span>
        </div>

        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Proof of Reserves (PoR)</span>
          <div className="text-2xl font-black text-emerald-400">{stats.reserveRatioPercent}%</div>
          <span className="text-slate-400 text-[11px] mt-1 block">Merkle Tree Audited 2h ago</span>
        </div>

        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Engine Circuit Breaker Status</span>
          <div className={`text-2xl font-black ${stats.circuitBreakerActive ? 'text-rose-400' : 'text-emerald-400'}`}>
            {stats.circuitBreakerActive ? 'HALTED' : 'NOMINAL (100%)'}
          </div>
          <span className="text-slate-400 text-[11px] mt-1 block">Sub-ms Matching Latency</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'overview', label: 'System Overview & Liquidity' },
          { id: 'kyc_queue', label: `Pending KYC Approvals (${pendingKycUsers.length})` },
          { id: 'withdrawals', label: `Maker-Checker Large Withdrawals (${pendingWithdrawals.length})` },
          { id: 'audit_trail', label: 'Immutable Audit Log (SHA-256)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Hot Wallet &amp; Cold Multisig Custody Health
            </h3>
            <div className="space-y-2 text-xs font-mono-numbers">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between">
                <span>Cold Storage Multisig (95% Assets):</span>
                <span className="text-emerald-400 font-bold">$236.4M (Fireblocks / Ledger Enterprise)</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between">
                <span>Hot Wallet Operational Liquidity (5%):</span>
                <span className="text-blue-400 font-bold">$12.5M (Instant withdrawals)</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between">
                <span>Emergency Insurance Fund:</span>
                <span className="text-amber-400 font-bold">$18.9M (Zero clawback reserve)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Regulatory Reporting &amp; FIU-IND Gateway
            </h3>
            <div className="space-y-2 text-xs font-mono-numbers">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between">
                <span>FIU-IND Suspicious Transaction Reports (STR):</span>
                <span className="text-slate-300 font-semibold">0 Flags Today</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between">
                <span>Monthly VDA TDS Remittance Status:</span>
                <span className="text-emerald-400 font-bold">100% Up to date (NSDL)</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between">
                <span>Travel Rule Automated Protocol:</span>
                <span className="text-emerald-400 font-bold">Sygna / Notabene Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KYC Queue */}
      {activeTab === 'kyc_queue' && (
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Legal Name</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pendingKycUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-200">{u.id}</td>
                  <td className="py-3 px-4 text-slate-100">{u.name}</td>
                  <td className="py-3 px-4 text-slate-300">{u.country}</td>
                  <td className="py-3 px-4 text-slate-400">{u.doc}</td>
                  <td className="py-3 px-4 text-slate-500">{u.submitted}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {u.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        onApproveKyc(u.id);
                        setFeedback(`Approved KYC for ${u.name}`);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRejectKyc(u.id, 'Document blur');
                        setFeedback(`Rejected KYC for ${u.name}`);
                      }}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Maker-Checker Withdrawals */}
      {activeTab === 'withdrawals' && (
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left font-mono-numbers text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                <th className="py-3 px-4">TX ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Asset &amp; Amount</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Policy Status</th>
                <th className="py-3 px-4 text-right">Maker-Checker Sign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pendingWithdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-200">{w.id}</td>
                  <td className="py-3 px-4 text-slate-300">{w.user}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{w.amount} {w.asset}</td>
                  <td className="py-3 px-4 text-slate-400">{w.dest}</td>
                  <td className="py-3 px-4 text-rose-400 font-semibold">{w.status}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setFeedback(`Authorized withdrawal ${w.id} with Root YubiKey Sign-off`)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Co-Sign Release
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Trail */}
      {activeTab === 'audit_trail' && (
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3 font-mono-numbers text-xs">
          <h3 className="font-bold text-white text-sm mb-3">Immutable SHA-256 Administrative Audit Trail</h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{log.action}</span>
                  <span className="text-[10px] text-slate-500">
                    Actor: {log.actor} • IP: {log.ipAddress} • {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-slate-400 text-[10px] bg-slate-800 px-2 py-1 rounded">
                  Hash: {log.hash}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Circuit Breaker Confirmation Modal */}
      {showCircuitBreakerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f141f] border-2 border-rose-600 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
            <h3 className="font-black text-white text-lg mb-2">
              CONFIRM EMERGENCY CIRCUIT BREAKER
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Triggering the emergency circuit breaker will instantly halt all order matching engines, pause REST/WebSocket order placement APIs, and suspend automated hot wallet disbursements.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCircuitBreakerModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCircuitBreakerConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase shadow-lg shadow-rose-950/60"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
