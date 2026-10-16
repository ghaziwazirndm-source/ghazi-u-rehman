import React, { useState } from 'react';
import {
  Crown,
  Bot,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Building,
  Settings,
  Activity,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileText,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Lock,
  Database,
} from 'lucide-react';
import { AgentsArmyCommandCenter } from './AgentsArmyCommandCenter';
import { AdminDashboard } from './AdminDashboard';
import { CeoPortrait } from './CeoPortrait';
import { ConfigurationOptionsView } from './ConfigurationOptionsView';
import { GHAZI_INFO } from '../data/content';
import { authService } from '../services/AuthService';

interface CeoExecutivePortalProps {
  navigate: (route: string) => void;
  initialTab?: string;
}

export const CeoExecutivePortal: React.FC<CeoExecutivePortalProps> = ({
  navigate,
  initialTab = 'executive',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const currentUser = authService.getCurrentUser();

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f1e8] pb-24">
      {/* CEO Executive Top Bar */}
      <header className="bg-gradient-to-r from-[#14141d] via-[#1a1429] to-[#14141d] border-b border-[#e8c872]/30 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <CeoPortrait size="md" rounded="full" className="ring-2 ring-[#e8c872] shadow-[0_0_25px_rgba(232,200,114,0.3)]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#e8c872] text-[#0a0a0f] flex items-center justify-center shadow">
                <Crown className="w-3.5 h-3.5 font-bold" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded-full bg-[#e8c872]/20 text-[#e8c872] border border-[#e8c872]/40">
                  CONFIDENTIAL · CEO COCKPIT
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Ghazi Wazir · Executive Cockpit
              </h1>
              <p className="text-xs text-[#a8a7b3]">
                CEO of Back for Brand LLC (USA) & Bab Al-Khaleej (Bahrain)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('portal')}
              className="px-3.5 py-1.5 rounded-xl border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white bg-[#14141d] hover:bg-[#1a1a26] transition-colors cursor-pointer"
            >
              View Customer View
            </button>
            <button
              onClick={() => {
                authService.logout();
                navigate('');
              }}
              className="px-3.5 py-1.5 rounded-xl border border-red-500/40 text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Secure Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* CEO Executive Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#2a2a38] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'executive'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-lg'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activeTab === 'agents'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] border-cyan-300'
                : 'bg-cyan-950/40 text-cyan-300 hover:text-white border-cyan-500/40 hover:bg-cyan-900/40'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>25 AI Agents Army (CEO Fleet)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'revenue'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-lg'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Company Financials & P&L</span>
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'operations'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-lg'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Admin Console & Operations</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activeTab === 'settings'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-[0_0_15px_rgba(232,200,114,0.3)] border-[#e8c872]'
                : 'bg-[#14141d] text-[#e8c872] hover:text-white border-[#e8c872]/40 hover:bg-[#1a1429]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#e8c872]" />
            <span>System Settings & Config</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activeTab === 'database'
                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-400'
                : 'bg-[#14141d] text-emerald-400 hover:text-white border-emerald-500/40 hover:bg-[#12241b]'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Cloud Database (Firestore)</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activeTab === 'domain'
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-400'
                : 'bg-[#14141d] text-purple-300 hover:text-white border-purple-500/40 hover:bg-[#1f1730]'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Hostinger Domain</span>
          </button>

          <button
            onClick={() => navigate('live-agent')}
            className="px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer bg-[#14141d] text-[#a8a7b3] hover:text-cyan-300 border border-[#2a2a38]"
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Live Agent Desk</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'executive' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 shadow">
                <div className="flex items-center justify-between text-xs text-[#a8a7b3] mb-2">
                  <span>Monthly Recurring Retainers</span>
                  <DollarSign className="w-4 h-4 text-[#e8c872]" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">$84,250</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> +22.4% vs last month (Bahrain & USA)
                </div>
              </div>

              <div className="bg-[#14141d] border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <div className="flex items-center justify-between text-xs text-[#a8a7b3] mb-2">
                  <span>Autonomous AI Fleet</span>
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">25 / 25 Active</div>
                <div className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> Dispatched 142 autonomous tasks today
                </div>
              </div>

              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 shadow">
                <div className="flex items-center justify-between text-xs text-[#a8a7b3] mb-2">
                  <span>Active Client Filings</span>
                  <Building className="w-4 h-4 text-[#e8c872]" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">18 Dossiers</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  MOIC Sijilat & LMRA clearances on track
                </div>
              </div>

              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 shadow">
                <div className="flex items-center justify-between text-xs text-[#a8a7b3] mb-2">
                  <span>Security & RBAC Enforcement</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 font-serif">Strict 100%</div>
                <div className="text-[11px] text-[#a8a7b3] mt-1">
                  Zero unauthorized leaks · Role isolated
                </div>
              </div>
            </div>

            {/* Quick 25 Agents Launcher Card */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-[#14141d] to-[#14141d] border border-cyan-500/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-900/40 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow">
                  <Bot className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      CEO Proprietary Weaponry
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      25/25 Ready
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                    25 Autonomous AI Agents Army Command Center
                  </h3>
                  <p className="text-xs text-[#a8a7b3] max-w-2xl mt-1">
                    GMB Local Pack, GEO/AEO optimization, Meta & Google Ads conversion, viral TikTok/Reels scripts, WhatsApp drip funnels, and automated Bahrain MOIC & LMRA filings.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('agents')}
                className="btn-gold px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-lg hover:scale-102 transition-transform"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Agents Army Center</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Strategic Overview: Dual Jurisdiction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-[#2a2a38] pb-3">
                  <div>
                    <span className="text-[10px] text-[#e8c872] font-bold uppercase font-mono">Jurisdiction I</span>
                    <h4 className="font-serif font-bold text-white text-base">Bab Al-Khaleej · Kingdom of Bahrain</h4>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">CR-99210-BH</span>
                </div>
                <div className="space-y-3 text-xs text-[#a8a7b3]">
                  <div className="flex justify-between py-1 border-b border-[#2a2a38]/40">
                    <span>Active Corporate Registrations:</span>
                    <strong className="text-white">12 W.L.L. / SPC Companies</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2a2a38]/40">
                    <span>Investor & Worker Visas (LMRA):</span>
                    <strong className="text-white">38 Visas In Process</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2a2a38]/40">
                    <span>Average Turnaround Time:</span>
                    <strong className="text-[#e8c872]">5.2 Business Days</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Ministerial Clearance SLA:</span>
                    <strong className="text-emerald-400">99.4% On-Time</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-[#2a2a38] pb-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono">Jurisdiction II</span>
                    <h4 className="font-serif font-bold text-white text-base">Back for Brand LLC · Florida, USA</h4>
                  </div>
                  <span className="text-xs text-cyan-300 font-bold bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">USA Entity</span>
                </div>
                <div className="space-y-3 text-xs text-[#a8a7b3]">
                  <div className="flex justify-between py-1 border-b border-[#2a2a38]/40">
                    <span>Global Tech & AI Retainers:</span>
                    <strong className="text-white">14 Enterprise Clients</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2a2a38]/40">
                    <span>GEO & AEO Rankings Monitored:</span>
                    <strong className="text-white">1,420 Brand Entities</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2a2a38]/40">
                    <span>AI Cloud & Gemini API Uptime:</span>
                    <strong className="text-emerald-400">99.98%</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Average Monthly Retention:</span>
                    <strong className="text-[#e8c872]">96.8%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 25 AI AGENTS ARMY */}
        {activeTab === 'agents' && (
          <div className="animate-in fade-in duration-150">
            <AgentsArmyCommandCenter />
          </div>
        )}

        {/* TAB 3: COMPANY FINANCIALS */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[#2a2a38] pb-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#e8c872] tracking-wider font-mono">
                    CONFIDENTIAL FINANCIAL LEDGER
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">
                    Consolidated Enterprise Revenue & Profitability
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#a8a7b3]">Total YTD Revenue</div>
                  <div className="text-2xl font-serif font-bold text-emerald-400">$842,600</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a38]">
                  <div className="text-xs text-[#a8a7b3] mb-1">Bahrain Setup Retainers</div>
                  <div className="text-xl font-bold text-white">BHD 142,500</div>
                  <div className="text-[10px] text-emerald-400 mt-1">MOIC Packages, VIP Attestation</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a38]">
                  <div className="text-xs text-[#a8a7b3] mb-1">Florida Tech & AI Contracts</div>
                  <div className="text-xl font-bold text-white">$465,000</div>
                  <div className="text-[10px] text-cyan-400 mt-1">GEO/AEO, AI Agents Fleet</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a38]">
                  <div className="text-xs text-[#a8a7b3] mb-1">Consolidated Net Profit Margin</div>
                  <div className="text-xl font-bold text-[#e8c872]">68.4%</div>
                  <div className="text-[10px] text-emerald-400 mt-1">High-margin software & consulting</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN OPERATIONS (EMBEDDED FOR CEO DIRECT CONTROL) */}
        {activeTab === 'operations' && (
          <div className="animate-in fade-in duration-150">
            <AdminDashboard navigate={navigate} initialTab="overview" />
          </div>
        )}

        {/* TAB 5: SYSTEM SETTINGS & CONFIGURATION OPTIONS */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-150">
            <ConfigurationOptionsView />
          </div>
        )}

        {/* TAB 6: CLOUD DATABASE (FIRESTORE) */}
        {activeTab === 'database' && (
          <div className="animate-in fade-in duration-150">
            <ConfigurationOptionsView initialSection="database" />
          </div>
        )}

        {/* TAB 7: HOSTINGER CUSTOM DOMAIN */}
        {activeTab === 'domain' && (
          <div className="animate-in fade-in duration-150">
            <ConfigurationOptionsView initialSection="domain" />
          </div>
        )}
      </main>
    </div>
  );
};
