import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, ShieldCheck, X, Sparkles } from 'lucide-react';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your 24/7 Finstock AI Trading Assistant. How can I assist you with spot trades, 100x futures, UPI/INR deposits, or Indian 1% TDS tax compliance today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');

  if (!isOpen) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { sender: 'user', text: userText, time: now };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Automated knowledgeable response
    setTimeout(() => {
      let reply = 'Our support desk has received your inquiry. A specialist is also monitoring this channel.';
      const lower = userText.toLowerCase();

      if (lower.includes('tds') || lower.includes('tax')) {
        reply = 'Under Section 194S of the Indian Income Tax Act, 1% TDS is deducted on gross crypto sales/transfers. Finstock automatically remits this to the Income Tax Department quarterly and gives you downloadable Form 16A certificates in your Tax Center.';
      } else if (lower.includes('deposit') || lower.includes('upi') || lower.includes('inr')) {
        reply = 'INR deposits via UPI (GPay, PhonePe, Paytm) and IMPS/NEFT are instantaneous 24/7. Your account is pre-verified via automated penny-drop matching your PAN KYC name.';
      } else if (lower.includes('futures') || lower.includes('leverage') || lower.includes('liquidation')) {
        reply = 'Futures perpetual contracts support up to 100x leverage. Your liquidation price is calculated as: Entry × (1 - 1/Lev + MMR). Finstock backs every trade with an $18.9M Insurance Fund with zero clawbacks.';
      } else if (lower.includes('fst') || lower.includes('earn') || lower.includes('stake')) {
        reply = 'Holding FST provides a 25% trading fee discount across all markets. You can also stake FST in the Earn Ecosystem Vault for up to 18.5% APY with daily compounded payouts.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-full bg-[#0f141f] border border-slate-700 rounded-3xl shadow-2xl flex flex-col h-[520px] overflow-hidden font-sans text-xs">
      {/* Header */}
      <div className="p-4 bg-[#0b0e14] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>FINSTOCK AI Concierge</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <span className="text-[10px] text-slate-400">FIU-IND &amp; Global Exchange Support</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0d121d]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#0b0e14] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        {['Explain 1% TDS', 'Deposit INR via UPI', 'Futures Liquidation Math', 'FST Staking APY'].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-[#0f141f] border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask anything about trading, taxes, deposits..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
