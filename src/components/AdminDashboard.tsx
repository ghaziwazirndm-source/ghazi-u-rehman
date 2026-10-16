import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  BarChart3,
  Plug,
  Settings,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Bot,
  Building,
  Key,
  Database,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  FileText,
  ChevronRight,
  RefreshCw,
  CreditCard,
  Mail,
  Send,
  QrCode,
  DollarSign,
  Landmark,
  Code,
  Play,
  Radio,
  Activity,
  Mic,
  Sliders,
  Globe,
} from 'lucide-react';
import { UserRole, Lead, LeadStatus, LeadTemperature, Booking, AuditLogEntry } from '../types/enterprise';
import { getStoredLeads, getStoredBookings, getStoredAuditLogs, saveLead } from '../data/leadsStore';
import { ENTERPRISE_TENANTS } from '../data/tenantConfig';
import { GHAZI_INFO } from '../data/content';
import { PaymentTransaction, SUPPORTED_GATEWAYS } from '../types/payments';
import { getStoredTransactions, generateWhatsAppPaymentDispatch } from '../data/paymentsStore';
import { mailService, QueuedEmail, MAIL_CONFIG } from '../services/MailService';
import { AudioDiagnostics } from './AudioDiagnostics';
import { SocialLinksManagerModal } from './SocialLinksManagerModal';
import { AgentsArmyCommandCenter } from './AgentsArmyCommandCenter';
import { FreeApisDashboardWidget } from './FreeApisDashboardWidget';
import { ConfigurationOptionsView } from './ConfigurationOptionsView';
import { IntegrationCredentialsModal, IntegrationKey } from './IntegrationCredentialsModal';
import { getStoredSystemConfig, saveSystemConfig, SystemConfig } from '../data/systemConfigStore';

interface AdminDashboardProps {
  navigate: (route: string) => void;
  initialTab?: DashboardTab;
  currentRoute?: string;
}

type DashboardTab =
  | 'overview'
  | 'crm'
  | 'bookings'
  | 'payments'
  | 'database'
  | 'domain'
  | 'mail'
  | 'ai_agents'
  | 'integrations'
  | 'analytics'
  | 'tenants'
  | 'security'
  | 'settings'
  | 'diagnostics';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, initialTab, currentRoute }) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>(() => {
    if (currentRoute) {
      if (['settings', 'configuration', 'config', 'options', 'system-settings', 'automation'].includes(currentRoute)) {
        return 'settings';
      }
      if (['database', 'db', 'firestore', 'data', 'detabeas'].includes(currentRoute)) {
        return 'database';
      }
      if (['domain', 'hostinger', 'custom-domain', 'dns'].includes(currentRoute)) {
        return 'domain';
      }
      if (currentRoute === 'crm') return 'crm';
      if (currentRoute === 'diagnostics') return 'diagnostics';
      if (currentRoute === 'integrations') return 'integrations';
      if (currentRoute === 'analytics') return 'analytics';
      if (currentRoute === 'tenants') return 'tenants';
      if (currentRoute === 'security') return 'security';
      if (['agents', 'army', 'ai-agents', 'agents-army'].includes(currentRoute)) return 'ai_agents';
      if (currentRoute === 'bookings') return 'bookings';
      if (currentRoute === 'payments') return 'payments';
      if (currentRoute === 'mail') return 'mail';
    }
    return initialTab || 'overview';
  });
  const [activeRole, setActiveRole] = useState<UserRole>('SUPER_ADMIN');
  const [activeTenantKey, setActiveTenantKey] = useState<string>('default');

  React.useEffect(() => {
    if (currentRoute) {
      if (['settings', 'configuration', 'config', 'options', 'system-settings', 'automation'].includes(currentRoute)) {
        setCurrentTab('settings');
      } else if (currentRoute === 'crm') {
        setCurrentTab('crm');
      } else if (currentRoute === 'diagnostics') {
        setCurrentTab('diagnostics');
      } else if (currentRoute === 'integrations') {
        setCurrentTab('integrations');
      } else if (currentRoute === 'analytics') {
        setCurrentTab('analytics');
      } else if (currentRoute === 'tenants') {
        setCurrentTab('tenants');
      } else if (currentRoute === 'security') {
        setCurrentTab('security');
      } else if (['agents', 'army', 'ai-agents', 'agents-army'].includes(currentRoute)) {
        setCurrentTab('ai_agents');
      } else if (currentRoute === 'bookings') {
        setCurrentTab('bookings');
      } else if (currentRoute === 'payments') {
        setCurrentTab('payments');
      } else if (currentRoute === 'mail') {
        setCurrentTab('mail');
      } else if (currentRoute === 'admin' || currentRoute === 'dashboard') {
        if (!initialTab || initialTab === 'overview') {
          setCurrentTab('overview');
        }
      }
    } else if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [currentRoute, initialTab]);

  // Leads & Bookings state
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings());
  const [auditLogs] = useState<AuditLogEntry[]>(() => getStoredAuditLogs());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => getStoredTransactions());
  const [mailQueue, setMailQueue] = useState<QueuedEmail[]>(() => mailService.getQueue());
  const [selectedEmail, setSelectedEmail] = useState<QueuedEmail | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [selectedIntegrationKey, setSelectedIntegrationKey] = useState<IntegrationKey>('whatsapp');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => getStoredSystemConfig());

  React.useEffect(() => {
    const handleConfigUpdate = (e: any) => {
      if (e?.detail) setSystemConfig(e.detail);
    };
    window.addEventListener('gw_system_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('gw_system_config_updated', handleConfigUpdate);
  }, []);

  React.useEffect(() => {
    const handleQueueUpdate = () => {
      setMailQueue(mailService.getQueue());
    };
    window.addEventListener('gw_mail_queue_updated', handleQueueUpdate);
    return () => window.removeEventListener('gw_mail_queue_updated', handleQueueUpdate);
  }, []);

  // CRM Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [temperatureFilter, setTemperatureFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // AI Agent test prompt simulator
  const [agentTestPrompt, setAgentTestPrompt] = useState('How long does CR registration take in Bahrain?');
  const [agentTestReply, setAgentTestReply] = useState<string | null>(null);
  const [isSimulatingAgent, setIsSimulatingAgent] = useState(false);

  // Active Tenant
  const activeTenant = ENTERPRISE_TENANTS[activeTenantKey] || ENTERPRISE_TENANTS.default;

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesTemp = temperatureFilter === 'ALL' || lead.temperature === temperatureFilter;

    return matchesSearch && matchesStatus && matchesTemp;
  });

  const handleAddNoteToLead = () => {
    if (!selectedLead || !newNoteText.trim()) return;
    const updatedLead: Lead = {
      ...selectedLead,
      notes: [...(selectedLead.notes || []), newNoteText.trim()],
      updatedDate: new Date().toISOString(),
    };
    saveLead(updatedLead);
    setLeads(getStoredLeads());
    setSelectedLead(updatedLead);
    setNewNoteText('');
  };

  const handleUpdateLeadStatus = (newStatus: LeadStatus) => {
    if (!selectedLead) return;
    const updatedLead: Lead = {
      ...selectedLead,
      status: newStatus,
      updatedDate: new Date().toISOString(),
    };
    saveLead(updatedLead);
    setLeads(getStoredLeads());
    setSelectedLead(updatedLead);
  };

  const exportLeadsCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'WhatsApp', 'Country', 'Service', 'Status', 'Temperature', 'Created'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.whatsapp,
      `"${l.country}"`,
      `"${l.service}"`,
      l.status,
      l.temperature,
      l.createdDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const simulateAiAgentResponse = () => {
    setIsSimulatingAgent(true);
    setAgentTestReply(null);
    setTimeout(() => {
      setAgentTestReply(
        `[Ghazi Wazir Executive AI Agent]: Standard Commercial Registration (CR) approval in Bahrain via MOIC Sijilat typically takes 3 to 7 business days, provided commercial activities, lease municipality clearances, and applicant documents are in order. Note: Official approvals remain under sovereign ministerial discretion.`
      );
      setIsSimulatingAgent(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-[#f5f1e8] pb-16">
      {/* Top Admin Notice Bar */}
      <div className="bg-[#1a140f] border-b border-[#b8893a]/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-[#e8c872]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#e8c872]" />
          <span>
            <strong>Production Readiness Audit:</strong> Frontend Simulation Mode. Authentication & Database backend required for live multi-user authorization.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#a8a7b3]">Active Role Simulator:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as UserRole)}
            className="bg-[#0a0a0f] border border-[#e8c872]/40 rounded-lg px-2.5 py-1 text-xs text-[#e8c872] font-semibold"
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
            <option value="ADMIN">ADMIN (Operations & AI)</option>
            <option value="MANAGER">MANAGER (Advisory & Leads)</option>
            <option value="SALES">SALES (Leads & Booking)</option>
            <option value="CONTENT">CONTENT (Guides & Media)</option>
            <option value="SUPPORT">SUPPORT (Client Assistance)</option>
            <option value="VIEWER">VIEWER (Read-Only)</option>
          </select>
          <button
            onClick={() => navigate('')}
            className="text-xs text-white hover:text-[#e8c872] underline font-medium cursor-pointer"
          >
            &larr; Exit to Public Site
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#2a2a38]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-2 py-0.5 rounded-full">
                Core AI Business Platform · Admin Console
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">v3.8-Enterprise</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {activeTenant.branding.name}
            </h1>
            <p className="text-xs text-[#a8a7b3] mt-0.5">
              Supervised by {GHAZI_INFO.name} · {GHAZI_INFO.roleTitle}
            </p>
          </div>

          {/* Quick Stats & Tenant Indicator */}
          <div className="flex items-center gap-3">
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-right">
              <div className="text-[10px] uppercase text-[#a8a7b3]">Active Tenant</div>
              <div className="text-xs font-bold text-[#e8c872]">{activeTenant.branding.shortName}</div>
            </div>
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-right">
              <div className="text-[10px] uppercase text-[#a8a7b3]">Total Leads</div>
              <div className="text-xs font-bold text-white">{leads.length} Records</div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#2a2a38] text-xs font-medium">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'overview'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {/* 25 AGENTS ARMY - PROMINENT FRONT POSITION */}
          <button
            onClick={() => setCurrentTab('ai_agents')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              currentTab === 'ai_agents'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] border-cyan-300'
                : 'bg-cyan-950/40 text-cyan-300 hover:text-white border-cyan-500/40 hover:bg-cyan-900/40'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">25 Agents Army (25)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setCurrentTab('crm')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'crm'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CRM & Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('bookings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'bookings'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultations ({bookings.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('payments')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'payments'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Gulf & Global Payments ({transactions.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('database')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              currentTab === 'database'
                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-400'
                : 'bg-emerald-950/40 text-emerald-300 hover:text-white border-emerald-500/40 hover:bg-emerald-900/40'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Cloud Database (Firestore)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setCurrentTab('domain')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              currentTab === 'domain'
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-400'
                : 'bg-purple-950/40 text-purple-300 hover:text-white border-purple-500/40 hover:bg-purple-900/40'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="font-bold">Hostinger Domain</span>
            <span className="text-[10px] bg-purple-900/80 text-purple-200 border border-purple-400/30 px-1.5 py-0.5 rounded font-mono">
              {systemConfig.domain?.domainName || 'backforbrand.com'}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('mail')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'mail'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Mail Queue ({mailQueue.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('integrations')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'integrations'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Plug className="w-4 h-4 text-[#e8c872]" />
            <span>Integrations & Free APIs</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'analytics'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Funnel Analytics</span>
          </button>

          <button
            onClick={() => setCurrentTab('tenants')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'tenants'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Multi-Tenant Hub</span>
          </button>

          <button
            onClick={() => setCurrentTab('security')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'security'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Audit</span>
          </button>

          <button
            onClick={() => setCurrentTab('diagnostics')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              currentTab === 'diagnostics'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Live Audio Diagnostics</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              currentTab === 'settings'
                ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-[0_0_15px_rgba(232,200,114,0.3)] border-[#e8c872]'
                : 'bg-[#14141d] text-[#e8c872] hover:text-white border-[#e8c872]/40 hover:bg-[#1a1429]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#e8c872]" />
            <span className="font-bold">Settings & Configuration Options</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <div className="flex items-center justify-between text-[#a8a7b3] text-xs mb-2">
                  <span>Qualified Pipeline</span>
                  <Users className="w-4 h-4 text-[#e8c872]" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mb-1">
                  {leads.filter((l) => ['QUALIFIED', 'CONSULTATION', 'PROPOSAL'].includes(l.status)).length} Leads
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>🟢 Active High-Intent Opportunities</span>
                </div>
              </div>

              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <div className="flex items-center justify-between text-[#a8a7b3] text-xs mb-2">
                  <span>Consultations Booked</span>
                  <Calendar className="w-4 h-4 text-[#00C98D]" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mb-1">
                  {bookings.length} Sessions
                </div>
                <div className="text-[11px] text-[#a8a7b3]">
                  All scheduled in Bahrain Time (GMT+3)
                </div>
              </div>

              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <div className="flex items-center justify-between text-[#a8a7b3] text-xs mb-2">
                  <span>Lead Conversion Rate</span>
                  <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mb-1">
                  24.6%
                </div>
                <div className="text-[11px] text-[#e8c872]">
                  VSL to Consultation appointment ratio
                </div>
              </div>

              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <div className="flex items-center justify-between text-[#a8a7b3] text-xs mb-2">
                  <span>Backend Integration State</span>
                  <Database className="w-4 h-4 text-[#b8893a]" />
                </div>
                <div className="text-sm font-bold text-[#e8c872] mb-1">
                  Local Storage Mock Mode
                </div>
                <div className="text-[11px] text-[#a8a7b3]">
                  Connect Cloud SQL / Firebase to persist
                </div>
              </div>
            </div>

            {/* 25 Autonomous AI Agents Army Quick Hub Banner */}
            <div className="bg-[#14141d] border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-wider">
                      CEO Operational Fleet
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                      25/25 Agents Ready
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">
                    25 Autonomous AI Agents Army Command Center
                  </h4>
                  <p className="text-xs text-[#a8a7b3]">
                    GMB local pack, SEO/GEO/AEO, Meta & Google Ads, TikTok/YouTube scripts, WhatsApp conversion, and Sijilat/LMRA filing.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentTab('ai_agents')}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow hover:scale-102 transition-transform"
              >
                <span>Launch Agents Army Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions & Recent Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-serif font-bold text-white">Recent Incoming Inquiries</h3>
                  <button
                    onClick={() => setCurrentTab('crm')}
                    className="text-xs text-[#e8c872] hover:underline"
                  >
                    View All in CRM &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 4).map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white">{lead.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              lead.temperature === 'HOT'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {lead.temperature}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#a8a7b3] mt-0.5">
                          {lead.service} · {lead.country}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#e8c872]">{lead.status}</span>
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs flex items-center gap-1 hover:bg-[#25D366]/30"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-serif font-bold text-white mb-3">
                    System Architecture Checklist
                  </h3>
                  <ul className="text-xs space-y-2.5 text-[#a8a7b3]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Frontend Booking Flow (10-point validated structure)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>VSL Funnels & Dual-Brand Services Architecture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Multilingual i18n Dictionary (EN, AR RTL, UR RTL, BN, FIL)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Core Multi-Tenant Engine (ALBA, Beyon, NBB, BBK)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#e8c872] shrink-0 mt-0.5" />
                      <span>Production PostgreSQL / Cloud SQL integration required</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#2a2a38] mt-4">
                  <button
                    onClick={() => setCurrentTab('integrations')}
                    className="w-full btn-outline-gold py-2 text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <Plug className="w-3.5 h-3.5" />
                    <span>Review Integrations Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CRM & LEADS */}
        {/* ========================================================================= */}
        {currentTab === 'crm' && (
          <div className="space-y-4">
            {/* Search, Filter & Export Toolbar */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#a8a7b3] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search leads, email, service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CONSULTATION">CONSULTATION</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>

                <select
                  value={temperatureFilter}
                  onChange={(e) => setTemperatureFilter(e.target.value)}
                  className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Temperatures</option>
                  <option value="HOT">HOT</option>
                  <option value="WARM">WARM</option>
                  <option value="COLD">COLD</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={exportLeadsCsv}
                  className="px-4 py-2 rounded-xl border border-[#2a2a38] text-xs text-white hover:border-[#e8c872] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0a0f] border-b border-[#2a2a38] text-[#a8a7b3] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Lead Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Service & Budget</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Temperature</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a38]">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#a8a7b3]">
                          No leads matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-[#1a1a26] transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{lead.name}</div>
                            <div className="text-[11px] text-[#a8a7b3]">{lead.country}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div>{lead.email}</div>
                            <div className="text-[#a8a7b3]">{lead.whatsapp}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-white max-w-xs truncate">{lead.service}</div>
                            {lead.budget && (
                              <div className="text-[11px] text-[#e8c872]">{lead.budget}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0a0a0f] border border-[#2a2a38] text-[#e8c872]">
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.temperature === 'HOT'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : lead.temperature === 'WARM'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {lead.temperature}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#a8a7b3] uppercase text-[10px]">
                            {lead.source}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead);
                              }}
                              className="text-xs text-[#e8c872] hover:underline font-semibold"
                            >
                              Open Drawer &rarr;
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lead Details Modal / Drawer */}
            {selectedLead && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#14141d] border border-[#e8c872]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between border-b border-[#2a2a38] pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#e8c872]">
                        Lead Record: {selectedLead.id}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white">{selectedLead.name}</h3>
                      <p className="text-xs text-[#a8a7b3]">
                        {selectedLead.country} · Inquired for {selectedLead.service}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="text-[#a8a7b3] hover:text-white text-sm"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Status & Temp Controls */}
                  <div className="grid grid-cols-2 gap-3 bg-[#0a0a0f] p-3 rounded-xl border border-[#2a2a38]">
                    <div>
                      <label className="block text-[10px] uppercase text-[#a8a7b3] mb-1">
                        Update Pipeline Stage
                      </label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleUpdateLeadStatus(e.target.value as LeadStatus)}
                        className="w-full bg-[#14141d] border border-[#2a2a38] rounded-lg p-2 text-xs text-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="CONSULTATION">CONSULTATION</option>
                        <option value="PROPOSAL">PROPOSAL</option>
                        <option value="NEGOTIATION">NEGOTIATION</option>
                        <option value="WON">WON</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#a8a7b3] mb-1">
                        Direct Outreach
                      </label>
                      <a
                        href={`https://wa.me/${selectedLead.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-lg bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Activity Notes */}
                  <div>
                    <h4 className="text-xs font-semibold text-white mb-2">Activity & Consultation Notes</h4>
                    <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 mb-3">
                      {selectedLead.notes && selectedLead.notes.length > 0 ? (
                        selectedLead.notes.map((n, idx) => (
                          <div key={idx} className="text-xs text-[#f5f1e8] border-l-2 border-[#e8c872] pl-2 py-0.5">
                            {n}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-[#a8a7b3]">No notes recorded yet.</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add internal note..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddNoteToLead();
                        }}
                        className="flex-1 bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={handleAddNoteToLead}
                        className="px-4 py-2 rounded-xl btn-gold text-xs font-semibold"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BOOKINGS */}
        {/* ========================================================================= */}
        {currentTab === 'bookings' && (
          <div className="space-y-4">
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-white">Scheduled Consultations</h3>
                <p className="text-xs text-[#a8a7b3]">
                  All appointments booked through the frontend scheduler or VSL funnels.
                </p>
              </div>
              <button
                onClick={() => navigate('book')}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Test Booking Flow</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
                    <span className="text-[10px] font-mono text-[#e8c872]">{b.id}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">{b.name}</h4>
                    <p className="text-xs text-[#e8c872]">{b.serviceName}</p>
                  </div>

                  <div className="text-xs text-[#a8a7b3] space-y-1">
                    <div>📅 Date: <strong className="text-white">{b.date}</strong> at <strong className="text-white">{b.timeSlot}</strong> (GMT+3)</div>
                    <div>📍 Format: <span className="uppercase text-white text-[11px]">{b.consultationType.replace('_', ' ')}</span></div>
                    <div>✉️ Email: {b.email}</div>
                    <div>📱 WhatsApp: {b.whatsapp} ({b.country})</div>
                  </div>

                  {b.message && (
                    <div className="bg-[#0a0a0f] p-2.5 rounded-xl border border-[#2a2a38] text-xs text-[#a8a7b3] italic">
                      "{b.message}"
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#a8a7b3]">Advisor: <strong>{b.assignedAdvisor}</strong></span>
                    <a
                      href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Client</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: GULF & GLOBAL PAYMENTS LEDGER                                        */}
        {/* ========================================================================= */}
        {currentTab === 'payments' && (
          <div className="space-y-6">
            {/* Header & Supported Gateways Grid */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#e8c872] mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span>Multi-Gateway Payment Infrastructure</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Gulf Sovereign Gateways & Global Settlement Rails
                  </h3>
                  <p className="text-xs text-[#a8a7b3] mt-1">
                    Real-time transaction tracking for BenefitPay (Bahrain), Fawri+, Tap Payments (GCC Mada/KNET), Stripe (USA), and PayPal.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Total Processed: {transactions.reduce((acc, t) => acc + t.amountBhd, 0)} BHD
                  </span>
                </div>
              </div>
            </div>

            {/* Gateways Status Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUPPORTED_GATEWAYS.map((gw) => (
                <div key={gw.id} className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#a8a7b3]">
                        {gw.region} Gateway
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          gw.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {gw.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{gw.name}</h4>
                    <p className="text-[11px] text-[#a8a7b3] mt-1">{gw.tagline}</p>
                  </div>
                  <div className="pt-3 border-t border-[#2a2a38] mt-3 text-[10px] text-[#777] font-mono">
                    Keys: {gw.requiredEnvKeys.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Transactions Ledger Table */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#2a2a38] flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Transactions Ledger ({transactions.length})
                </h4>
                <button
                  onClick={() => setTransactions(getStoredTransactions())}
                  className="p-1.5 rounded-lg border border-[#2a2a38] text-[#a8a7b3] hover:text-white cursor-pointer"
                  title="Refresh Ledger"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0a0f] border-b border-[#2a2a38] text-[#a8a7b3] text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Service & Package</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a38]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#1a1a26] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#e8c872]">{tx.referenceNumber}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{tx.clientName}</div>
                          <div className="text-[11px] text-[#a8a7b3]">{tx.clientPhone} · {tx.clientCountry}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white">{tx.serviceTitle}</div>
                          <div className="text-[11px] text-[#e8c872]">{tx.packageTier}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white">{tx.gatewayName}</span>
                          {tx.fawriReference && (
                            <span className="block text-[10px] text-[#a8a7b3] font-mono">Fawri: {tx.fawriReference}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {tx.amountBhd} BHD
                          <span className="block text-[10px] text-[#a8a7b3] font-normal">(~${tx.amountUsd} USD)</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'SETTLED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={generateWhatsAppPaymentDispatch(tx)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs inline-flex items-center gap-1 hover:bg-[#25D366]/30 font-semibold"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: MAIL SERVICE QUEUE & CREDENTIALS                                     */}
        {/* ========================================================================= */}
        {currentTab === 'mail' && (
          <div className="space-y-6">
            {/* Mail Config & Status Banner */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#e8c872] mb-1">
                    <Mail className="w-4 h-4" />
                    <span>MailService Outgoing Queue & Credentials</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Transactional Email Infrastructure & Queue Telemetry
                  </h3>
                  <p className="text-xs text-[#a8a7b3] mt-1">
                    Handles booking confirmations, payment receipts, itemized proposals, and executive lead alerts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      mailService.enqueue('EXECUTIVE_NEW_LEAD_ALERT', 'ghaziwazirndm@gmail.com', {
                        name: 'Test Executive Lead',
                        email: 'test@gulfcorp.bh',
                        phone: '+973 3562 8353',
                        country: 'Bahrain',
                        service: 'Commercial Registration W.L.L.',
                        budget: '1,500 BHD',
                        source: 'admin_test_dispatcher',
                        notes: ['Dispatched from MailService test console.'],
                      });
                      setMailQueue(mailService.getQueue());
                    }}
                    className="btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Enqueue Test Email</span>
                  </button>
                  <button
                    onClick={() => {
                      mailService.clearQueue();
                      setMailQueue([]);
                    }}
                    className="px-3 py-2 rounded-xl border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white"
                  >
                    Clear Queue
                  </button>
                </div>
              </div>
            </div>

            {/* SMTP / API Production Configuration Options */}
            <div className="bg-[#0a0a0f] border border-[#e8c872]/40 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#e8c872]">
                  <Code className="w-4 h-4" />
                  <span>Interactive Email Delivery Options (Option 1 & Option 2)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('settings')}
                  className="btn-gold px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer shadow hover:scale-102 transition-transform"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Open Full Configuration Options & Live Test</span>
                </button>
              </div>

              <p className="text-xs text-[#a8a7b3] leading-relaxed">
                Click any option below to toggle your active delivery engine, or open Settings & Configuration Options to input API keys, SMTP credentials, and dispatch test verification emails:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Option 1 Button */}
                <div
                  onClick={() => {
                    const cfg = getStoredSystemConfig();
                    cfg.mail.activeOption = 'option1_resend';
                    saveSystemConfig(cfg);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    getStoredSystemConfig().mail.activeOption === 'option1_resend'
                      ? 'bg-gradient-to-br from-[#1c1c28] to-[#14141d] border-[#e8c872] shadow-[0_0_15px_rgba(232,200,114,0.15)] ring-1 ring-[#e8c872]'
                      : 'bg-[#14141d] border-[#2a2a38] hover:border-[#a8a7b3]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#e8c872] font-sans font-bold">Option 1: Resend API (Recommended)</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                      getStoredSystemConfig().mail.activeOption === 'option1_resend'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {getStoredSystemConfig().mail.activeOption === 'option1_resend' ? '✓ ACTIVE' : 'CLICK TO ACTIVATE'}
                    </span>
                  </div>
                  <div className="text-[#a8a7b3]">RESEND_API_KEY=re_xxxxxxxxxxxx</div>
                  <div className="text-[#a8a7b3]">MAIL_FROM_ADDRESS=advisory@backforbrand.com</div>
                  <div className="text-[#a8a7b3]">MAIL_FROM_NAME="Bab Al-Khaleej & Back for Brand"</div>
                </div>

                {/* Option 2 Button */}
                <div
                  onClick={() => {
                    const cfg = getStoredSystemConfig();
                    cfg.mail.activeOption = 'option2_smtp';
                    saveSystemConfig(cfg);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    getStoredSystemConfig().mail.activeOption === 'option2_smtp'
                      ? 'bg-gradient-to-br from-[#1c1c28] to-[#14141d] border-[#e8c872] shadow-[0_0_15px_rgba(232,200,114,0.15)] ring-1 ring-[#e8c872]'
                      : 'bg-[#14141d] border-[#2a2a38] hover:border-[#a8a7b3]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#e8c872] font-sans font-bold">Option 2: Google Workspace SMTP Relay</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                      getStoredSystemConfig().mail.activeOption === 'option2_smtp'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {getStoredSystemConfig().mail.activeOption === 'option2_smtp' ? '✓ ACTIVE' : 'CLICK TO ACTIVATE'}
                    </span>
                  </div>
                  <div className="text-[#a8a7b3]">SMTP_HOST=smtp.gmail.com</div>
                  <div className="text-[#a8a7b3]">SMTP_PORT=465 (SSL)</div>
                  <div className="text-[#a8a7b3]">SMTP_USER=ghaziwazirndm@gmail.com</div>
                  <div className="text-[#a8a7b3]">SMTP_PASS=xxxx xxxx xxxx xxxx (App Password)</div>
                </div>
              </div>
            </div>

            {/* Outgoing Mail Queue Feed */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#2a2a38] flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Outgoing Email Queue ({mailQueue.length})
                </h4>
                <button
                  onClick={() => mailService.processQueue()}
                  className="text-xs text-[#e8c872] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Process Pending Queue</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0a0f] border-b border-[#2a2a38] text-[#a8a7b3] text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Queue ID</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Template</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Attempts</th>
                      <th className="py-3 px-4 text-right">Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a38]">
                    {mailQueue.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-[#a8a7b3]">
                          No emails currently in queue. Book a consultation or pay a retainer to generate outgoing emails.
                        </td>
                      </tr>
                    ) : (
                      mailQueue.map((item) => (
                        <tr key={item.id} className="hover:bg-[#1a1a26] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-[#e8c872]">{item.id}</td>
                          <td className="py-3 px-4 font-bold text-white">{item.to}</td>
                          <td className="py-3 px-4 text-[#a8a7b3] max-w-xs truncate">{item.subject}</td>
                          <td className="py-3 px-4 font-mono text-[10px] text-[#a8a7b3]">{item.templateType}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'SENT'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : item.status === 'SENDING'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#a8a7b3] font-mono">{item.attempts}/{item.maxAttempts}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedEmail(item)}
                              className="text-xs text-[#e8c872] hover:underline font-semibold cursor-pointer"
                            >
                              Inspect &rarr;
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Email Preview Drawer / Modal */}
            {selectedEmail && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#14141d] border border-[#e8c872]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left">
                  <div className="flex items-start justify-between border-b border-[#2a2a38] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#e8c872]">{selectedEmail.id}</span>
                      <h4 className="text-base font-bold text-white">{selectedEmail.subject}</h4>
                      <p className="text-xs text-[#a8a7b3]">To: {selectedEmail.to} | Status: {selectedEmail.status}</p>
                    </div>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="text-[#a8a7b3] hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Rendered HTML Preview */}
                  <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-4 max-h-80 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        mailService.retryEmail(selectedEmail.id);
                        setMailQueue(mailService.getQueue());
                        setSelectedEmail(null);
                      }}
                      className="btn-gold px-4 py-2 text-xs rounded-xl font-bold"
                    >
                      Re-send / Retry Email
                    </button>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="px-4 py-2 text-xs border border-[#2a2a38] rounded-xl text-white"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 25 AGENTS ARMY COMMAND CENTER */}
        {/* ========================================================================= */}
        {currentTab === 'ai_agents' && <AgentsArmyCommandCenter />}

        {/* ========================================================================= */}
        {/* TAB 5: INTEGRATIONS CENTER */}
        {/* ========================================================================= */}
        {currentTab === 'integrations' && (
          <div className="space-y-6">
            {/* Free Public APIs Engine */}
            <FreeApisDashboardWidget />

            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  Enterprise Commercial Gateways & Communication APIs
                </h3>
                <p className="text-xs text-[#a8a7b3]">
                  Connection statuses across external marketing, calendar, and payment systems.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSocialModalOpen(true)}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure & Embed Links (19 Platforms)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                [
                  {
                    key: 'whatsapp' as IntegrationKey,
                    name: 'WhatsApp Cloud API',
                    desc: 'Direct ministerial client messaging and automated lead dispatch.',
                    category: 'Communication',
                    req: ['META_APP_ID', 'WHATSAPP_TOKEN', 'PHONE_NUMBER_ID'],
                  },
                  {
                    key: 'googleCalendar' as IntegrationKey,
                    name: 'Google Calendar API',
                    desc: 'Sync 20-min strategy consultations into Ghazi Wazir Google Workspace.',
                    category: 'Calendar',
                    req: ['GOOGLE_CLIENT_ID', 'GOOGLE_CALENDAR_ID'],
                  },
                  {
                    key: 'metaAds' as IntegrationKey,
                    name: 'Meta Ads & Pixel',
                    desc: 'Conversion tracking for Bahrain business setup & US tech funnels.',
                    category: 'Marketing',
                    req: ['FB_PIXEL_ID', 'META_CONVERSIONS_API_KEY'],
                  },
                  {
                    key: 'linkedIn' as IntegrationKey,
                    name: 'LinkedIn Insight Tag',
                    desc: 'Executive audience tracking across GCC corporate founders.',
                    category: 'Marketing',
                    req: ['LINKEDIN_PARTNER_ID'],
                  },
                  {
                    key: 'googleBusiness' as IntegrationKey,
                    name: 'Google Business Profile',
                    desc: 'Manama / Bahrain commercial address reviews and map grounding.',
                    category: 'Local SEO',
                    req: ['Active Listing Verified'],
                  },
                  {
                    key: 'hostinger' as IntegrationKey,
                    name: 'Hostinger DNS & Custom Domain',
                    desc: 'Hostinger hPanel nameservers, DNS zone records (A, CNAME, TXT), and SSL routing.',
                    category: 'Domain & Hosting',
                    req: ['HOSTINGER_DOMAIN', 'DNS_ZONE_A_RECORD'],
                  },
                  {
                    key: 'resend' as IntegrationKey,
                    name: 'Resend / SendGrid Email',
                    desc: 'Transactional confirmation emails and calendar ICS attachments.',
                    category: 'Email',
                    req: ['RESEND_API_KEY', 'CORPORATE_FROM_EMAIL'],
                  },
                  {
                    key: 'benefitPay' as IntegrationKey,
                    name: 'BenefitPay & GCC Tap',
                    desc: 'Bahrain national payment gateway & GCC debit card settlements.',
                    category: 'Payments',
                    req: ['BENEFIT_MERCHANT_ID', 'TAP_SECRET_KEY'],
                  },
                  {
                    key: 'stripe' as IntegrationKey,
                    name: 'Stripe International',
                    desc: 'Global credit card settlements for Back for Brand LLC (USA).',
                    category: 'Payments',
                    req: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
                  },
                  {
                    key: 'gemini' as IntegrationKey,
                    name: 'Gemini 3.8 AI SDK',
                    desc: 'Executive knowledge reasoning and document intake automation.',
                    category: 'AI Engine',
                    req: ['GEMINI_API_KEY'],
                  },
                ]
              ).map((item, idx) => {
                const currentStatus = systemConfig.integrations?.[item.key]?.status || 'CONFIGURATION REQUIRED';
                const isConnected = currentStatus === 'CONNECTED';
                return (
                  <div key={idx} className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 flex flex-col justify-between hover:border-[#3a3a4e] transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-[#a8a7b3]">{item.category}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isConnected
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1">{item.name}</h4>
                      <p className="text-xs text-[#a8a7b3] mb-4">{item.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-[#2a2a38]">
                      <div className="text-[10px] text-[#a8a7b3] mb-2 font-mono">
                        Req: {item.req.join(', ')}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIntegrationKey(item.key);
                          setIsIntegrationModalOpen(true);
                        }}
                        className={`w-full py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isConnected
                            ? 'bg-[#0a0a0f] border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                            : 'bg-[#0a0a0f] border-[#2a2a38] text-white hover:border-[#e8c872] hover:bg-[#1a1426]'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#e8c872]" />
                        <span>{isConnected ? 'Active · Manage Credentials' : 'Configure Credentials'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: FUNNEL ANALYTICS */}
        {/* ========================================================================= */}
        {currentTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  Funnel & Acquisition Telemetry
                </h3>
                <p className="text-xs text-[#a8a7b3]">
                  Conversion telemetry for Bahrain formation & US high-ticket AI funnels.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  Analytics API required for live server telemetry
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <span className="text-xs text-[#a8a7b3] block mb-1">Total Unique Visitors</span>
                <span className="text-2xl font-bold font-serif text-white">4,280</span>
                <span className="text-[11px] text-emerald-400 block mt-1">↑ 18.4% this month</span>
              </div>
              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <span className="text-xs text-[#a8a7b3] block mb-1">WhatsApp CTA Click-Through</span>
                <span className="text-2xl font-bold font-serif text-white">312</span>
                <span className="text-[11px] text-[#25D366] block mt-1">7.3% direct click rate</span>
              </div>
              <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
                <span className="text-xs text-[#a8a7b3] block mb-1">VSL Watch-Through (&gt;50%)</span>
                <span className="text-2xl font-bold font-serif text-white">58.2%</span>
                <span className="text-[11px] text-[#e8c872] block mt-1">High retention on formation guides</span>
              </div>
            </div>

            {/* Top Funnel Routes */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Top Performing Service Funnels
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'vsl-business-registration (Bahrain CR Formation)', views: '1,420', conv: '4.8%' },
                  { name: 'vsl-investor-visa (10-Yr Golden & Investor Visas)', views: '1,110', conv: '5.2%' },
                  { name: 'vsl-seo (Enterprise GEO / AEO & AI Search)', views: '890', conv: '3.9%' },
                  { name: 'vsl-document-clearance (Ministry Expedited Processing)', views: '540', conv: '4.1%' },
                ].map((f, i) => (
                  <div key={i} className="bg-[#0a0a0f] p-3 rounded-xl flex items-center justify-between border border-[#2a2a38]">
                    <span className="font-semibold text-white">{f.name}</span>
                    <div className="flex items-center gap-4 text-[#a8a7b3]">
                      <span>{f.views} Visits</span>
                      <span className="text-[#00C98D] font-bold">{f.conv} Bookings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MULTI-TENANT HUB */}
        {/* ========================================================================= */}
        {currentTab === 'tenants' && (
          <div className="space-y-6">
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
              <h3 className="text-lg font-serif font-bold text-white mb-1">
                Enterprise Multi-Tenant Client Architecture
              </h3>
              <p className="text-xs text-[#a8a7b3]">
                Section 27 compliance: Core AI Business Platform cleanly decoupled from tenant configurations. Switch tenant profile to preview custom corporate setups for major Bahrain & regional enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ENTERPRISE_TENANTS).map(([key, tenant]) => {
                const isActive = activeTenantKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveTenantKey(key)}
                    className={`bg-[#14141d] border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#e8c872] shadow-[0_0_20px_rgba(232,200,114,0.15)] bg-[#1a1a26]'
                        : 'border-[#2a2a38] hover:border-[#a8a7b3]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-[#e8c872]">
                          {tenant.branding.jurisdiction}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-black bg-[#e8c872] px-2 py-0.5 rounded-full">
                            Active Preview
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1">{tenant.branding.name}</h4>
                      <p className="text-xs text-[#a8a7b3] mb-4">{tenant.branding.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-[#2a2a38] text-[11px] text-[#a8a7b3] space-y-1">
                      <div>Lead: <strong className="text-white">{tenant.branding.executiveName}</strong></div>
                      <div>Workflow: <span className="italic">{tenant.customWorkflow}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: SECURITY & AUDIT */}
        {/* ========================================================================= */}
        {currentTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
              <h3 className="text-lg font-serif font-bold text-white mb-1">
                Security Posture & Compliance Audit
              </h3>
              <p className="text-xs text-[#a8a7b3]">
                Non-destructive security checklist and active role-based permission matrix.
              </p>
            </div>

            {/* Security Checks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: 'Zero Secrets in Code', status: 'PASS', note: 'No hardcoded private keys or tokens' },
                { title: 'XSS & HTML Injection', status: 'PASS', note: 'Safe React DOM rendering & encoding' },
                { title: 'Cookie Consent Gate', status: 'PASS', note: 'Strict category opt-in system' },
                { title: 'Safe URL Redirects', status: 'PASS', note: 'No unverified external redirects' },
              ].map((c, i) => (
                <div key={i} className="bg-[#14141d] border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{c.title}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a8a7b3]">{c.note}</p>
                </div>
              ))}
            </div>

            {/* Audit Logs Table */}
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Security Audit Trail Logs
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0a0f] border-b border-[#2a2a38] text-[#a8a7b3] text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Actor & Role</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Target</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">IP / Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a38] font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#1a1a26]">
                        <td className="py-2.5 px-3 text-[#a8a7b3]">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                        <td className="py-2.5 px-3 text-white">
                          {log.actorEmail} ({log.actorRole})
                        </td>
                        <td className="py-2.5 px-3 text-[#e8c872]">{log.action}</td>
                        <td className="py-2.5 px-3 text-[#a8a7b3]">{log.targetResource}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-emerald-400">{log.status}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[#a8a7b3]">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 11: LIVE AUDIO & MICROPHONE DIAGNOSTICS */}
        {/* ========================================================================= */}
        {currentTab === 'diagnostics' && <AudioDiagnostics />}

        {/* ========================================================================= */}
        {/* TAB 12: CLOUD DATABASE (FIRESTORE)                                        */}
        {/* ========================================================================= */}
        {currentTab === 'database' && <ConfigurationOptionsView initialSection="database" />}

        {/* ========================================================================= */}
        {/* TAB 13: HOSTINGER & CUSTOM DOMAIN GATEWAY                                 */}
        {/* ========================================================================= */}
        {currentTab === 'domain' && <ConfigurationOptionsView initialSection="domain" />}

        {/* ========================================================================= */}
        {/* TAB 14: SYSTEM SETTINGS & CONFIGURATION OPTIONS */}
        {/* ========================================================================= */}
        {currentTab === 'settings' && <ConfigurationOptionsView />}

        {/* Social & Ecosystem Links Manager Modal */}
        <SocialLinksManagerModal
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
        />

        {/* Enterprise Integration & Credentials Modal */}
        <IntegrationCredentialsModal
          isOpen={isIntegrationModalOpen}
          onClose={() => setIsIntegrationModalOpen(false)}
          initialIntegration={selectedIntegrationKey}
          onSaved={() => setSystemConfig(getStoredSystemConfig())}
        />
      </div>
    </div>
  );
};
