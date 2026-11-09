import React, { useState } from 'react';
import { SupportTicket } from '../types/exchange';
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileQuestion,
  ShieldAlert,
  Send,
  Plus,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Clock,
  BookOpen
} from 'lucide-react';

interface HelpSupportViewProps {
  onOpenLiveChat: () => void;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onOpenLiveChat }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'guides' | 'report'>('faq');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-8921',
      subject: 'Inquiry regarding quarterly Form 16A 1% TDS Certificate download',
      category: 'TAX_TDS',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      createdAt: Date.now() - 3600000 * 24 * 3,
      lastReply: 'TDS certificate has been signed and placed in your Tax Center dashboard.',
    },
    {
      id: 'TCK-8935',
      subject: 'Whitelisting hardware Ledger withdrawal address',
      category: 'SECURITY',
      status: 'IN_REVIEW',
      priority: 'HIGH',
      createdAt: Date.now() - 3600000 * 4,
      lastReply: '24-hour security cooling period active. Whitelist activates at 18:00 UTC.',
    },
  ]);

  const [newSubject, setNewSubject] = useState<string>('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('TRADING');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('MEDIUM');
  const [ticketFeedback, setTicketFeedback] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How does the 1% Section 194S TDS deduction work for Indian users?',
      a: 'Under Section 194S of the Indian Income Tax Act (Finance Act 2022), 1% TDS is levied on gross crypto sales, transfers, and crypto-to-crypto swaps. FINSTOCKCOIN automatically deducts this at the exact moment of trade settlement, remits it directly to the Income Tax Department under your PAN, and provides quarterly digitally-signed Form 16A certificates for your annual income tax filing.',
    },
    {
      q: 'How fast are INR deposits via UPI and IMPS?',
      a: 'INR deposits via UPI (Google Pay, PhonePe, Paytm, BHIM) and IMPS virtual accounts are processed instantly within 15 to 60 seconds 24/7/365. Automated penny drop verification matches the bank account holder with your KYC PAN details for 100% regulatory compliance.',
    },
    {
      q: 'What is the Proof of Reserves (PoR) standard used by Finstock?',
      a: 'Finstock maintains a live Proof of Reserves ratio above 100% (currently 102.4%). User balances are cryptographically verifiable through public Merkle Tree root hashes, ensuring all customer assets are held 1:1 in segregated institutional multi-signature custody with Fireblocks and Ledger Enterprise.',
    },
    {
      q: 'What are the benefits of holding and using FST token?',
      a: 'Holding FST entitles you to a 25% discount on all spot and futures trading fees, priority access to initial ecosystem pool listings, and up to 18.5% APY locked staking rewards with daily automated compound distribution.',
    },
    {
      q: 'How does the 100x Perpetual Futures liquidation engine operate?',
      a: 'Our risk engine continuously evaluates margin ratio: (Maintenance Margin / Margin Balance) × 100. If the mark price reaches the liquidation threshold, the position is liquidated in tiers with zero clawback to the counterparty, backed by our $18.9M insurance fund.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const t: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      createdAt: Date.now(),
      status: 'OPEN',
      lastReply: 'Ticket received. Senior compliance / support engineer assigned.',
    };
    setTickets([t, ...tickets]);
    setTicketFeedback(`Ticket ${t.id} successfully created. Tracking initiated.`);
    setNewSubject('');
    setTimeout(() => setTicketFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Title */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 Global Client Support &amp; Knowledge Base</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Help, Support &amp; Incident Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instant AI concierge, ticket tracker, searchable FAQs, trading tutorials, and compliance complaint escalation.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLiveChat}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Launch 24/7 AI Support Chat</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'faq', label: 'Knowledge Base & FAQs' },
          { id: 'tickets', label: `My Support Tickets (${tickets.length})` },
          { id: 'guides', label: 'Trading Tutorials & Guides' },
          { id: 'report', label: 'Report Incident / Grievance' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions, taxes, withdrawals, futures..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0f141f] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0f141f] border border-slate-800/80 rounded-2xl overflow-hidden shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-white font-bold text-sm hover:bg-slate-800/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Support Tickets */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Create Ticket Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Create Support Ticket
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs font-mono-numbers">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of issue..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                >
                  <option value="TRADING">Trading &amp; Matching Engine</option>
                  <option value="DEPOSIT">INR / Crypto Deposit</option>
                  <option value="WITHDRAWAL">Withdrawal Issue</option>
                  <option value="TAX_TDS">TDS 1% &amp; Tax Statement</option>
                  <option value="KYC">KYC &amp; Identity Verification</option>
                  <option value="SECURITY">Security / Suspicious Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 rounded-lg font-bold text-[10px] transition-colors ${
                        newPriority === p ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {ticketFeedback && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px]">
                  {ticketFeedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all cursor-pointer"
              >
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Ticket List (7 cols) */}
          <div className="lg:col-span-7 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-white text-base mb-3">Ticket Status &amp; Correspondence</h3>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 font-mono-numbers">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : t.status === 'IN_REVIEW'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                  <p className="text-[11px] text-slate-300 bg-slate-800/60 p-2.5 rounded-lg">
                    Latest reply: {t.lastReply}
                  </p>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono-numbers">
                    <span>Category: {t.category}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Guides */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Spot Trading 101', desc: 'Understanding Limit vs Market vs OCO orders and avoiding slippage.', icon: BookOpen },
            { title: 'Indian VDA Tax Guide', desc: 'Comprehensive breakdown of Section 194S 1% TDS and Section 115BBH flat 30% tax.', icon: ShieldAlert },
            { title: 'Futures Leverage & Liquidation', desc: 'Managing margin ratio, funding rate cycles, and setting automated TP/SL triggers.', icon: Clock },
          ].map((guide, i) => (
            <div
              key={i}
              className="p-5 bg-[#0f141f] border border-slate-800 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <guide.icon className="w-6 h-6 text-blue-400 mb-3" />
                <h4 className="font-bold text-white text-sm mb-1">{guide.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{guide.desc}</p>
              </div>
              <button
                type="button"
                className="text-xs text-blue-400 font-bold flex items-center gap-1 hover:text-blue-300"
              >
                <span>Read Full Tutorial</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Report Incident */}
      {activeTab === 'report' && (
        <div className="max-w-xl mx-auto w-full bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Consumer Grievance &amp; Security Escalation</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            In compliance with Indian PMLA and CERT-In cybersecurity standards, our Principal Officer and Grievance Officer respond within 24 hours.
          </p>

          <div className="space-y-3 text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Grievance Officer:</span>
              <span className="text-white font-bold">compliance-grievance@finstockcoin.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Phone:</span>
              <span className="text-white font-mono-numbers">+91 (022) 8095-5564</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Physical Address:</span>
              <span className="text-slate-300 text-right">Bandra Kurla Complex (BKC), Mumbai, India</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
