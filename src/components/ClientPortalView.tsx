import React, { useState } from 'react';
import {
  User,
  Building,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  LogOut,
  Sparkles,
  Key,
  Download,
  Plus,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from 'recharts';
import { UserAccount } from '../types/auth';
import { authService } from '../services/AuthService';
import { getStoredBookings } from '../data/leadsStore';
import { getStoredTransactions } from '../data/paymentsStore';
import { GHAZI_INFO } from '../data/content';
import { PasswordGeneratorBox } from './PasswordGeneratorBox';
import { CeoPortrait } from './CeoPortrait';

interface ClientPortalViewProps {
  user: UserAccount;
  navigate: (route: string) => void;
  onLogout: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  user,
  navigate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'bookings' | 'invoices' | 'security'>('dossier');
  const [chartMode, setChartMode] = useState<'milestones' | 'timeline'>('milestones');

  const allBookings = getStoredBookings();
  const userBookings = allBookings.filter(
    (b) => b.email.toLowerCase() === user.email.toLowerCase() || user.role === 'CEO'
  );

  const allTransactions = getStoredTransactions();
  const userTransactions = allTransactions.filter(
    (t) => t.clientEmail.toLowerCase() === user.email.toLowerCase() || user.role === 'CEO'
  );

  // Business Registration & Visa Stage Milestone Data for Recharts
  const milestoneData = [
    {
      stage: '1. Legal Intake',
      fullStage: 'Document Intake & Notarization',
      completion: 100,
      daysElapsed: 2,
      targetDays: 2,
      status: 'Completed',
      department: 'Compliance',
    },
    {
      stage: '2. MOIC Sijilat',
      fullStage: 'MOIC Sijilat CR Registration',
      completion: 85,
      daysElapsed: 3,
      targetDays: 4,
      status: 'In Progress',
      department: 'Ministry of Industry & Commerce',
    },
    {
      stage: '3. LMRA Visa',
      fullStage: 'LMRA Investor & Work Visa',
      completion: 45,
      daysElapsed: 2,
      targetDays: 3,
      status: 'In Progress',
      department: 'Labour Market Regulatory Authority',
    },
    {
      stage: '4. Bank & Handover',
      fullStage: 'Corporate Bank Account & CR Final Handover',
      completion: 15,
      daysElapsed: 0,
      targetDays: 2,
      status: 'Scheduled',
      department: 'NBB / Al Salam / Central Bank',
    },
  ];

  // Turnaround Progress Timeline Data for Recharts AreaChart
  const timelineData = [
    { day: 'Day 1', progress: 20, crProgress: 25, visaProgress: 10, label: 'Document intake & KYC cleared' },
    { day: 'Day 2', progress: 40, crProgress: 50, visaProgress: 20, label: 'Shareholder resolutions certified' },
    { day: 'Day 3', progress: 60, crProgress: 75, visaProgress: 30, label: 'Sijilat preliminary approval issued' },
    { day: 'Day 4', progress: 72, crProgress: 85, visaProgress: 45, label: 'Municipality zoning & address active' },
    { day: 'Day 5', progress: 80, crProgress: 95, visaProgress: 60, label: 'Commercial Registration (CR) minted' },
    { day: 'Day 6', progress: 88, crProgress: 100, visaProgress: 75, label: 'LMRA establishment file open' },
    { day: 'Day 7', progress: 94, crProgress: 100, visaProgress: 90, label: 'Biometrics & investor residency stamped' },
    { day: 'Day 8 (Target)', progress: 100, crProgress: 100, visaProgress: 100, label: 'Corporate bank account & final handover' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-6xl mx-auto text-left">
      {/* Client Header Card */}
      <div className="bg-gradient-to-r from-[#17142e] to-[#101018] border-2 border-[#b8893a] rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0a0a0f] border-2 border-[#e8c872] flex items-center justify-center text-[#e8c872] text-2xl font-bold shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {user.accountType} ACCOUNT
              </span>
              <span className="text-[10px] text-[#a8a7b3] font-mono">ID: {user.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {user.name}
            </h1>
            <p className="text-xs text-[#e8c872] font-medium">
              {user.companyName || 'Private International Investor'} · {user.country}
            </p>
          </div>
        </div>

        {/* Portal Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('book')}
            className="px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] text-xs text-white hover:border-[#e8c872] flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#e8c872]" />
            <span>Book Consultation</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2a2a38] pb-3 mb-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('dossier')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'dossier'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Filing Dossier & Status</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'bookings'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Consultations ({userBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'invoices'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Invoices & Retainers ({userTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'security'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Password Generator & Security</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FILING DOSSIER                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'dossier' && (
        <div className="space-y-6">
          {/* Government Filing Progress Tracker */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2a2a38] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#e8c872]">
                  Kingdom of Bahrain · Active Application Dossier
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  Commercial Registration & Visa Clearance Workflow
                </h3>
                <p className="text-xs text-[#a8a7b3] mt-0.5">
                  Live government SLA tracking across MOIC, LMRA, Municipality, and Central Bank.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Status: 72% Overall Completion
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0f] border border-emerald-500/40 p-4 rounded-2xl relative">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs mb-2">
                  ✓
                </div>
                <h4 className="font-bold text-white text-xs">1. Document Intake</h4>
                <p className="text-[11px] text-[#a8a7b3] mt-1">Passports & shareholder resolutions verified.</p>
              </div>

              <div className="bg-[#0a0a0f] border border-[#e8c872] p-4 rounded-2xl relative shadow-[0_0_15px_rgba(232,200,114,0.1)]">
                <div className="w-7 h-7 rounded-full bg-[#e8c872] text-black flex items-center justify-center font-bold text-xs mb-2">
                  2
                </div>
                <h4 className="font-bold text-[#e8c872] text-xs">2. MOIC Sijilat Filing</h4>
                <p className="text-[11px] text-white mt-1">Activity codes & commercial address verification.</p>
              </div>

              <div className="bg-[#0a0a0f] border border-[#2a2a38] p-4 rounded-2xl opacity-60">
                <div className="w-7 h-7 rounded-full bg-[#2a2a38] text-[#a8a7b3] flex items-center justify-center font-bold text-xs mb-2">
                  3
                </div>
                <h4 className="font-bold text-[#a8a7b3] text-xs">3. LMRA Establishment</h4>
                <p className="text-[11px] text-[#777] mt-1">Employer file opening & expat visa quotas.</p>
              </div>

              <div className="bg-[#0a0a0f] border border-[#2a2a38] p-4 rounded-2xl opacity-60">
                <div className="w-7 h-7 rounded-full bg-[#2a2a38] text-[#a8a7b3] flex items-center justify-center font-bold text-xs mb-2">
                  4
                </div>
                <h4 className="font-bold text-[#a8a7b3] text-xs">4. Final Handover</h4>
                <p className="text-[11px] text-[#777] mt-1">Official CR certificate & corporate bank account.</p>
              </div>
            </div>

            {/* Recharts Progress & Timeline Visualizer */}
            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1f1f2e] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#e8c872]" />
                  <h4 className="text-sm font-serif font-bold text-white">
                    Application Velocity & Milestone Visualizer
                  </h4>
                </div>

                {/* Chart Toggle */}
                <div className="flex items-center gap-1.5 bg-[#14141d] p-1 rounded-xl border border-[#2a2a38]">
                  <button
                    type="button"
                    onClick={() => setChartMode('milestones')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      chartMode === 'milestones'
                        ? 'bg-[#e8c872] text-black shadow'
                        : 'text-[#a8a7b3] hover:text-white'
                    }`}
                  >
                    Stage Milestones (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('timeline')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      chartMode === 'timeline'
                        ? 'bg-[#e8c872] text-black shadow'
                        : 'text-[#a8a7b3] hover:text-white'
                    }`}
                  >
                    8-Day Turnaround Timeline
                  </button>
                </div>
              </div>

              {/* Chart Render Area */}
              <div className="h-64 w-full">
                {chartMode === 'milestones' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={milestoneData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222230" vertical={false} />
                      <XAxis
                        dataKey="stage"
                        stroke="#a8a7b3"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#2a2a38' }}
                      />
                      <YAxis
                        stroke="#a8a7b3"
                        fontSize={11}
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={{ stroke: '#2a2a38' }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#14141d',
                          borderColor: '#b8893a',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                        formatter={(val: any, name: any, item: any) => [
                          `${val}% (Elapsed: ${item.payload.daysElapsed}d / SLA: ${item.payload.targetDays}d)`,
                          item.payload.fullStage,
                        ]}
                      />
                      <Bar dataKey="completion" radius={[8, 8, 0, 0]} name="Progress %">
                        {milestoneData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.completion === 100
                                ? '#10B981'
                                : entry.completion >= 70
                                ? '#E8C872'
                                : entry.completion >= 40
                                ? '#06B6D4'
                                : '#6366F1'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e8c872" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#e8c872" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCR" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorVisa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222230" vertical={false} />
                      <XAxis
                        dataKey="day"
                        stroke="#a8a7b3"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#2a2a38' }}
                      />
                      <YAxis
                        stroke="#a8a7b3"
                        fontSize={11}
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={{ stroke: '#2a2a38' }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#14141d',
                          borderColor: '#b8893a',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Area
                        type="monotone"
                        dataKey="crProgress"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorCR)"
                        name="MOIC Commercial Reg."
                      />
                      <Area
                        type="monotone"
                        dataKey="visaProgress"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#colorVisa)"
                        name="LMRA Investor Visa"
                      />
                      <Area
                        type="monotone"
                        dataKey="progress"
                        stroke="#e8c872"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOverall)"
                        name="Overall Filing Velocity"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Status Breakdown Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3">
                  <div className="text-[10px] uppercase font-bold text-[#e8c872]">Commercial Registration (CR)</div>
                  <div className="text-sm font-bold text-white mt-0.5">85% Complete</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Sijilat MOIC: Address Zoning Active</div>
                </div>

                <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3">
                  <div className="text-[10px] uppercase font-bold text-cyan-400">Investor Residency Visa</div>
                  <div className="text-sm font-bold text-white mt-0.5">45% Complete</div>
                  <div className="text-[11px] text-cyan-300 mt-1">LMRA: Security Cleared, Medical Next</div>
                </div>

                <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3">
                  <div className="text-[10px] uppercase font-bold text-purple-400">Corporate Bank Account</div>
                  <div className="text-sm font-bold text-white mt-0.5">15% Complete</div>
                  <div className="text-[11px] text-[#a8a7b3] mt-1">NBB / Al Salam: Documentation Queued</div>
                </div>
              </div>
            </div>

            {/* Assigned Executive Advisor */}
            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CeoPortrait size="sm" rounded="full" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#e8c872]">Assigned Executive Advisor</div>
                  <h4 className="font-bold text-sm text-white">{GHAZI_INFO.name}</h4>
                  <p className="text-[11px] text-[#a8a7b3]">{GHAZI_INFO.roleTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I am checking my client filing status for ${user.companyName || user.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Advisor Directly</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY CONSULTATIONS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-white text-base">Your Scheduled Sessions</h3>
              <p className="text-xs text-[#a8a7b3]">Appointments booked for 1-on-1 advisory with Ghazi Wazir.</p>
            </div>
            <button
              onClick={() => navigate('book')}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book New Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userBookings.length === 0 ? (
              <div className="col-span-2 bg-[#14141d] border border-[#2a2a38] rounded-2xl p-8 text-center text-[#a8a7b3] text-xs">
                No consultations booked under this email yet.
              </div>
            ) : (
              userBookings.map((b) => (
                <div key={b.id} className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
                    <span className="text-[10px] font-mono text-[#e8c872]">{b.id}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{b.serviceName}</h4>
                  <div className="text-xs text-[#a8a7b3] space-y-1">
                    <div>📅 {b.date} at {b.timeSlot} (Bahrain Time, GMT+3)</div>
                    <div>📍 Format: {b.consultationType.replace('_', ' ')}</div>
                  </div>
                  {b.meetingLink && (
                    <a
                      href={b.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INVOICES & PAYMENTS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-white text-base">Payment Receipts & Retainers</h3>
              <p className="text-xs text-[#a8a7b3]">Official invoices processed via BenefitPay, Fawri+, Stripe, or Bank Wire.</p>
            </div>
            <button
              onClick={() => navigate('packages')}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Make New Payment</span>
            </button>
          </div>

          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0a0f] border-b border-[#2a2a38] text-[#a8a7b3] text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Ref Number</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a38]">
                  {userTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#a8a7b3]">
                        No transactions recorded for this account.
                      </td>
                    </tr>
                  ) : (
                    userTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#1a1a26]">
                        <td className="py-3 px-4 font-mono font-bold text-[#e8c872]">{tx.referenceNumber}</td>
                        <td className="py-3 px-4 text-white font-medium">{tx.serviceTitle}</td>
                        <td className="py-3 px-4 text-[#a8a7b3]">{tx.gatewayName}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {tx.amountBhd} BHD <span className="text-[10px] text-[#777] font-normal">(~${tx.amountUsd} USD)</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-emerald-400 font-bold uppercase text-[10px]">{tx.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PASSWORD GENERATOR & SECURITY                                      */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5">
            <h3 className="font-serif font-bold text-white text-base mb-1">
              Account Security & Cryptographic Tools
            </h3>
            <p className="text-xs text-[#a8a7b3]">
              Generate high-entropy passwords for your Bahrain Sijilat, LMRA, or corporate email accounts.
            </p>
          </div>

          <PasswordGeneratorBox />
        </div>
      )}

      {/* End of Client Portal */}
    </div>
  );
};
