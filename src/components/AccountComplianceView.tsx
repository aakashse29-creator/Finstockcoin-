import React, { useState } from 'react';
import { KYCData, BankAccount, NomineeDetails } from '../types/exchange';
import {
  ShieldCheck,
  Building,
  Users,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Lock,
  Plus
} from 'lucide-react';

interface AccountComplianceViewProps {
  kyc: KYCData;
  bankAccounts: BankAccount[];
  nominee: NomineeDetails;
  onUpdateNominee: (nominee: NomineeDetails) => void;
  onAddBankAccount: (bank: BankAccount) => void;
}

export const AccountComplianceView: React.FC<AccountComplianceViewProps> = ({
  kyc,
  bankAccounts,
  nominee,
  onUpdateNominee,
  onAddBankAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'kyc' | 'tax' | 'bank' | 'nominee'>('kyc');
  const [showAddBankModal, setShowAddBankModal] = useState<boolean>(false);
  const [newBankName, setNewBankName] = useState<string>('Axis Bank');
  const [newAccountNumber, setNewAccountNumber] = useState<string>('');
  const [newIfsc, setNewIfsc] = useState<string>('UTIB0000045');

  // Nominee editing
  const [nomineeName, setNomineeName] = useState<string>(nominee.fullName);
  const [nomineeRelation, setNomineeRelation] = useState<string>(nominee.relationship);
  const [nomineePan, setNomineePan] = useState<string>(nominee.panNumber);
  const [nomineeFeedback, setNomineeFeedback] = useState<string | null>(null);

  const handleNomineeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNominee({
      ...nominee,
      fullName: nomineeName,
      relationship: nomineeRelation,
      panNumber: nomineePan,
    });
    setNomineeFeedback('Nominee details successfully updated and recorded with exchange registry.');
    setTimeout(() => setNomineeFeedback(null), 4000);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountNumber || newAccountNumber.length < 8) return;
    onAddBankAccount({
      id: `bank-${Date.now()}`,
      bankName: newBankName,
      accountNumber: `•••• •••• ${newAccountNumber.slice(-4)}`,
      ifscCode: newIfsc,
      accountHolder: 'AAKASH SHARMA',
      accountType: 'Savings',
      isVerified: true,
      pennyDropStatus: 'verified',
    });
    setShowAddBankModal(false);
    setNewAccountNumber('');
  };

  const downloadTaxStatement = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Transaction_ID,Date,Asset,Type,Gross_INR,TDS_1_Percent_Sec194S,Net_INR,VDA_Tax_30_Percent_Est\n' +
      'TX-89214,2026-11-01,BTC,SELL,150000,1500,148500,45000\n' +
      'TX-89302,2026-11-04,ETH,SELL,80000,800,79200,24000\n' +
      'TX-89410,2026-11-08,FST,SELL,25000,250,24750,7500\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'FINSTOCK_FY26_27_TDS_Tax_Statement.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Title */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIU-IND Registered &amp; Global Regulatory Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Account, Compliance &amp; Tax Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compliant with Indian Prevention of Money Laundering Act (PMLA), Section 194S VDA TDS, and International VASP standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadTaxStatement}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Annual TDS/Tax Statement</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'kyc', label: 'KYC & Identity Verification' },
          { id: 'tax', label: 'VDA 30% Tax & 1% TDS (Sec 194S)' },
          { id: 'bank', label: 'Linked Bank Accounts (Penny Drop)' },
          { id: 'nominee', label: 'Nominee Management' },
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

      {/* Tab: KYC */}
      {activeTab === 'kyc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Indian Resident KYC Status</h3>
                <span className="text-xs text-slate-400">Verified via DigiLocker &amp; Income Tax Department PAN Database</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Verified &amp; Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-numbers">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">PAN Card Number</span>
                <span className="text-slate-100 font-bold text-sm">{kyc.panNumber}</span>
                <span className="text-emerald-400 text-[10px] block mt-1">Verified with NSDL</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Aadhaar Verification</span>
                <span className="text-slate-100 font-bold text-sm">{kyc.aadhaarNumber}</span>
                <span className="text-emerald-400 text-[10px] block mt-1">UIDAI OTP e-KYC Complete</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">FIU-IND Compliance</span>
                <span className="text-emerald-400 font-bold text-sm">Registered &amp; Screened</span>
                <span className="text-slate-400 text-[10px] block mt-1">Ref: FIU-IND-FINS-2026-992</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Verification Date</span>
                <span className="text-slate-100 font-bold text-sm">{kyc.verifiedAt}</span>
                <span className="text-slate-400 text-[10px] block mt-1">Annual Re-KYC: 2027-03-15</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Data Protection &amp; Privacy
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Your documents and biometric hashes are stored inside SOC-2 Type II certified, encrypted vault storage within India, in strict accordance with CERT-In and RBI data localization guidelines.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 text-xs">
              <span className="font-semibold block mb-1 text-white">Daily Limits</span>
              <div className="flex justify-between font-mono-numbers text-[11px] text-slate-400">
                <span>Crypto Withdrawal:</span>
                <span className="text-emerald-400 font-semibold">100 BTC / day</span>
              </div>
              <div className="flex justify-between font-mono-numbers text-[11px] text-slate-400 mt-1">
                <span>Fiat INR Withdrawal:</span>
                <span className="text-emerald-400 font-semibold">₹10,00,00,000 / day</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tax & TDS */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-numbers">
            <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 uppercase font-semibold">Section 194S TDS Deducted (FY26-27)</span>
              <div className="text-2xl font-black text-amber-400 mt-2">₹2,550.00</div>
              <span className="text-[11px] text-slate-500 mt-1 block">Deposited with NSDL under Form 26AS</span>
            </div>

            <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 uppercase font-semibold">Net Realized VDA Gains</span>
              <div className="text-2xl font-black text-emerald-400 mt-2">₹1,84,200.00</div>
              <span className="text-[11px] text-slate-500 mt-1 block">Subject to 30% Flat Tax (Sec 115BBH)</span>
            </div>

            <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 uppercase font-semibold">Estimated 30% Tax Liability</span>
              <div className="text-2xl font-black text-rose-400 mt-2">₹55,260.00</div>
              <span className="text-[11px] text-slate-500 mt-1 block">+ 4% Health &amp; Education Cess</span>
            </div>
          </div>

          <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base">Downloadable TDS Certificates (Form 16A)</h3>
              <button
                type="button"
                onClick={downloadTaxStatement}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Download CSV
              </button>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              FINSTOCKCOIN automatically files quarterly TDS returns (Form 26Q) on your behalf.
              Every deduction is digitally signed and updated in your Income Tax Portal under Annual Information Statement (AIS) and Form 26AS.
            </div>
          </div>
        </div>
      )}

      {/* Tab: Linked Bank Accounts */}
      {activeTab === 'bank' && (
        <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Linked Bank Accounts</h3>
              <p className="text-xs text-slate-400">Used for instant INR deposits and withdrawals via IMPS/NEFT/RTGS</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddBankModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Link Bank Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{b.bankName}</h4>
                  <div className="text-xs font-mono-numbers text-slate-400 mt-1">
                    <span>{b.accountNumber}</span> • <span>{b.ifscCode}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Holder: {b.accountHolder}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Penny Drop Verified
                </span>
              </div>
            ))}
          </div>

          {/* Add Bank Modal */}
          {showAddBankModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-[#0f141f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white text-base">Add New Bank Account</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddBankModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleBankSubmit} className="space-y-4 text-xs font-mono-numbers">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Bank Name</label>
                    <select
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 5010023456789"
                      value={newAccountNumber}
                      onChange={(e) => setNewAccountNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={newIfsc}
                      onChange={(e) => setNewIfsc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px]">
                    ₹1 will be credited via IMPS to verify account holder name matching your KYC PAN.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer"
                  >
                    Verify &amp; Link Account
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Nominee */}
      {activeTab === 'nominee' && (
        <div className="max-w-xl mx-auto w-full bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Legal Nominee Registration</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Protect your wealth. In case of unexpected demise or incapacity, your verified nominee is entitled to claim account assets following legal succession procedures.
          </p>

          <form onSubmit={handleNomineeSubmit} className="space-y-4 text-xs font-mono-numbers">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Nominee Full Name</label>
              <input
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Relationship</label>
              <select
                value={nomineeRelation}
                onChange={(e) => setNomineeRelation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Nominee PAN Card Number</label>
              <input
                type="text"
                value={nomineePan}
                onChange={(e) => setNomineePan(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Allocation Share (%)</label>
              <input
                type="number"
                disabled
                value="100"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 font-bold"
              />
            </div>

            {nomineeFeedback && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                {nomineeFeedback}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all cursor-pointer"
            >
              Update Nominee Details
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
