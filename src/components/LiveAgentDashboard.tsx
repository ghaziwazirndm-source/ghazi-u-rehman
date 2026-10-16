import React, { useState } from 'react';
import {
  Radio,
  MessageSquare,
  Users,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Search,
  Filter,
  UserCheck,
  Shield,
  Bot,
  Copy,
  Check,
} from 'lucide-react';
import { authService } from '../services/AuthService';
import { getStoredLeads } from '../data/leadsStore';
import { Lead } from '../types/enterprise';

interface LiveAgentDashboardProps {
  navigate: (route: string) => void;
}

interface ChatSession {
  id: string;
  clientName: string;
  clientEmail: string;
  channel: 'website_live' | 'whatsapp' | 'voice_inquiry';
  status: 'active' | 'waiting' | 'resolved';
  lastMessage: string;
  timestamp: string;
  assignedAgent: string;
  serviceInterest: string;
}

const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat-101',
    clientName: 'Hamad Al-Thani',
    clientEmail: 'h.althani@dohainvest.com',
    channel: 'website_live',
    status: 'active',
    lastMessage: 'Can we register a single shareholder SPC with 100% foreign ownership in Bahrain?',
    timestamp: '2 mins ago',
    assignedAgent: 'Sarah Jennings',
    serviceInterest: 'Bahrain Business Registration (W.L.L. / SPC)',
  },
  {
    id: 'chat-102',
    clientName: 'Alexander Wright',
    clientEmail: 'a.wright@londonfin.co.uk',
    channel: 'whatsapp',
    status: 'waiting',
    lastMessage: 'Looking to transfer 4 directors under the LMRA investor visa stream.',
    timestamp: '8 mins ago',
    assignedAgent: 'Unassigned',
    serviceInterest: 'Investor Visa & LMRA Fast-Track',
  },
  {
    id: 'chat-103',
    clientName: 'Elena Rostova',
    clientEmail: 'elena@cypruscap.io',
    channel: 'website_live',
    status: 'resolved',
    lastMessage: 'Thank you for sending the document checklist for MOIC filing.',
    timestamp: '1 hour ago',
    assignedAgent: 'Sarah Jennings',
    serviceInterest: 'Corporate Bank Account Opening',
  },
];

const CANNED_REPLIES = [
  {
    title: '100% Foreign Ownership Rule',
    text: 'Under Bahrain Decree Law No. 27 of 2015, foreign nationals and international corporations are permitted 100% foreign ownership for IT, consultancy, software, trading, and engineering activities.',
  },
  {
    title: 'MOIC Sijilat Timeline',
    text: 'Commercial Registration (CR) approval via MOIC Sijilat typically clears within 3 to 7 business days, provided commercial lease municipal clearances are verified.',
  },
  {
    title: 'LMRA Investor Visa Requirements',
    text: 'Investor visas require a valid CR, lease agreement, clean police clearance, passport copy with 6+ months validity, and passport photo. Medical check (NPRA) is scheduled upon entry.',
  },
];

export const LiveAgentDashboard: React.FC<LiveAgentDashboardProps> = ({ navigate }) => {
  const currentUser = authService.getCurrentUser();
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState<ChatSession>(INITIAL_CHATS[0]);
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy' | 'offline'>('available');
  const [replyInput, setReplyInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    setReplyInput('');
  };

  const handleCopyCanned = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setReplyInput(text);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f1e8] pb-20">
      {/* Top Operations Header */}
      <div className="bg-[#14141d] border-b border-[#2a2a38] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  INTERNAL OPERATIONS
                </span>
                <span className="text-xs text-[#a8a7b3]">Live Agent Desk</span>
              </div>
              <h1 className="text-lg font-serif font-bold text-white">
                Customer Inquiries & Live Queue
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Agent Status Toggle */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0f] border border-[#2a2a38] text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  agentStatus === 'available'
                    ? 'bg-emerald-400 animate-pulse'
                    : agentStatus === 'busy'
                    ? 'bg-amber-400'
                    : 'bg-zinc-500'
                }`}
              />
              <span className="text-white capitalize font-semibold">{agentStatus}</span>
              <button
                onClick={() =>
                  setAgentStatus((prev) =>
                    prev === 'available' ? 'busy' : prev === 'busy' ? 'offline' : 'available'
                  )
                }
                className="text-[10px] text-[#a8a7b3] hover:text-[#e8c872] ml-1 underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {currentUser?.role === 'CEO' && (
              <button
                onClick={() => navigate('ceo')}
                className="px-3.5 py-1.5 rounded-xl bg-[#e8c872] text-[#0a0a0f] text-xs font-bold shadow hover:bg-[#d8b862] cursor-pointer"
              >
                CEO Cockpit
              </button>
            )}

            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'CEO') && (
              <button
                onClick={() => navigate('admin')}
                className="px-3.5 py-1.5 rounded-xl border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white bg-[#14141d] hover:bg-[#1a1a26] cursor-pointer"
              >
                Admin Console
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Live Queue Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold">
              <span>Active Inquiries ({chats.length})</span>
              <span className="text-cyan-400 font-mono text-[11px]">SLA: &lt; 3 mins</span>
            </div>

            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedChat.id === chat.id
                      ? 'border-cyan-500/60 bg-cyan-950/20 shadow'
                      : 'border-[#2a2a38] bg-[#0a0a0f] hover:border-[#3a3a4c]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white truncate max-w-[150px]">
                      {chat.clientName}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        chat.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : chat.status === 'waiting'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {chat.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#e8c872] truncate mb-1">
                    {chat.serviceInterest}
                  </div>
                  <p className="text-[11px] text-[#a8a7b3] truncate line-clamp-1">
                    {chat.lastMessage}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-[#666] mt-2 pt-1 border-t border-[#1a1a26]">
                    <span>{chat.channel}</span>
                    <span>{chat.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canned Responses Reference Box */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-4">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>Bahrain Official Canned Knowledge</span>
            </h4>
            <div className="space-y-2">
              {CANNED_REPLIES.map((c, i) => (
                <div
                  key={c.title}
                  onClick={() => handleCopyCanned(c.text, i)}
                  className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] hover:border-[#e8c872]/40 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#e8c872]">
                    <span>{c.title}</span>
                    {copiedIndex === i ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#888]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#a8a7b3] line-clamp-2 mt-1">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Conversation & Lead Desk (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2a2a38] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#e8c872] uppercase">
                  ACTIVE INQUIRY · {selectedChat.channel.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedChat.clientName}
                </h3>
                <span className="text-xs text-[#a8a7b3]">{selectedChat.clientEmail}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Escalated ${selectedChat.clientName} to Ghazi Wazir executive desk.`)}
                  className="px-3 py-1.5 rounded-xl border border-[#e8c872]/40 text-xs text-[#e8c872] hover:bg-[#e8c872]/10 transition-colors cursor-pointer"
                >
                  Escalate to CEO
                </button>
                <button
                  onClick={() => alert(`Marked ${selectedChat.id} as resolved.`)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Mark Resolved
                </button>
              </div>
            </div>

            {/* Conversation Feed */}
            <div className="h-64 overflow-y-auto space-y-3 bg-[#0a0a0f] p-4 rounded-xl border border-[#2a2a38] mb-4">
              <div className="flex items-start gap-2 max-w-lg">
                <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {selectedChat.clientName.charAt(0)}
                </div>
                <div className="bg-[#14141d] border border-[#2a2a38] p-3 rounded-2xl text-xs text-white">
                  {selectedChat.lastMessage}
                  <span className="block text-[9px] text-[#666] mt-1 text-right">{selectedChat.timestamp}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 max-w-lg ml-auto flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-[#e8c872] text-[#0a0a0f] font-bold text-xs flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="bg-[#1a1429] border border-[#e8c872]/30 p-3 rounded-2xl text-xs text-white">
                  Welcome to Bab Al-Khaleej & Back for Brand. Our senior operations desk has received your request regarding {selectedChat.serviceInterest}.
                  <span className="block text-[9px] text-[#666] mt-1 text-right">Just now</span>
                </div>
              </div>
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Type your response to the client..."
                className="flex-1 bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
