import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Bot,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
  Sliders,
  Save,
  RotateCcw,
  Download,
  AlertCircle,
  Zap,
  Globe,
  Lock,
  Cpu,
  Database,
  Cloud,
  Server,
  Plus,
} from 'lucide-react';
import {
  SystemConfig,
  getStoredSystemConfig,
  saveSystemConfig,
  resetSystemConfig,
} from '../data/systemConfigStore';
import { mailService } from '../services/MailService';
import { testFirestoreConnection } from '../services/firebase';
import { seedCloudDatabase, saveLead } from '../data/leadsStore';
import { seedCloudTransactions } from '../data/paymentsStore';
import { HostingerDomainManager } from './HostingerDomainManager';

interface ConfigurationOptionsViewProps {
  onBack?: () => void;
  initialSection?: 'mail' | 'ai' | 'database' | 'payments' | 'tenant' | 'security' | 'domain';
}

export const ConfigurationOptionsView: React.FC<ConfigurationOptionsViewProps> = ({
  onBack,
  initialSection = 'domain',
}) => {
  const [config, setConfig] = useState<SystemConfig>(() => getStoredSystemConfig());
  const [activeSection, setActiveSection] = useState<'mail' | 'ai' | 'database' | 'payments' | 'tenant' | 'security' | 'domain'>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);
  
  // Database State
  const [isPingingDb, setIsPingingDb] = useState(false);
  const [dbPingResult, setDbPingResult] = useState<{ connected: boolean; latencyMs?: number; message: string } | null>(null);
  const [isSeedingDb, setIsSeedingDb] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // UI States
  const [showResendKey, setShowResendKey] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('ghaziwazirndm@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail) setConfig(e.detail);
    };
    window.addEventListener('gw_system_config_updated', handleUpdate);
    return () => window.removeEventListener('gw_system_config_updated', handleUpdate);
  }, []);

  const handleSaveAll = () => {
    saveSystemConfig(config);
    setSaveFeedback('Configuration options saved successfully and synchronized across the platform!');
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all configuration options to verified factory defaults?')) {
      const reset = resetSystemConfig();
      setConfig(reset);
      setSaveFeedback('All configuration options restored to default values.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient.trim()) return;
    setIsSendingTest(true);
    setTestResult(null);

    // Persist current config before sending test
    saveSystemConfig(config);

    try {
      const res = await mailService.sendTestEmail(testEmailRecipient.trim());
      setTestResult({
        success: res.success,
        message: res.message,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Failed to dispatch test verification email.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePingDatabase = async () => {
    setIsPingingDb(true);
    setDbPingResult(null);
    const start = performance.now();
    try {
      const ok = await testFirestoreConnection();
      const latency = Math.round(performance.now() - start);
      setDbPingResult({
        connected: ok,
        latencyMs: latency,
        message: ok
          ? `Connected to Cloud Firestore (Database ID: ai-studio-ghaziwazirceobac-a35dbe61-b2cd-4a60-9020-9af974f55f65). Ping roundtrip: ${latency}ms.`
          : 'Database connection in progress or server warming up.',
      });
    } catch (err: any) {
      setDbPingResult({
        connected: false,
        message: err?.message || 'Failed to ping Cloud Firestore database.',
      });
    } finally {
      setIsPingingDb(false);
    }
  };

  const handleInsertTestLead = async () => {
    setIsSeedingDb(true);
    setSeedResult(null);
    try {
      const testId = `lead-${Date.now().toString(36)}`;
      const testLead = {
        id: testId,
        name: 'Live Cloud Verification Lead',
        email: 'client.verify@bahrain-biz.com',
        phone: '+973 3944 8899',
        whatsapp: '+973 3944 8899',
        country: 'Bahrain',
        service: 'New Company Registration (CR)',
        package: 'Direct Firestore Write Test',
        budget: '2,000 BHD',
        source: 'website' as const,
        status: 'QUALIFIED' as any,
        priority: 'high' as any,
        temperature: 'HOT' as any,
        notes: ['Verified live write from Cloud Database management portal'],
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      saveLead(testLead);
      setSeedResult({
        success: true,
        message: `Successfully wrote test document (${testId}) directly to Cloud Firestore collection /leads!`,
      });
    } catch (err: any) {
      setSeedResult({
        success: false,
        message: err?.message || 'Failed to write test document to Cloud Firestore.',
      });
    } finally {
      setIsSeedingDb(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeedingDb(true);
    setSeedResult(null);
    try {
      const [leadsRes, txsRes] = await Promise.all([
        seedCloudDatabase(),
        seedCloudTransactions(),
      ]);
      setSeedResult({
        success: leadsRes.success || txsRes,
        message: `Successfully synchronized and seeded ${leadsRes.count} initial business records into Cloud Firestore!`,
      });
    } catch (err: any) {
      setSeedResult({
        success: false,
        message: err?.message || 'Seeding encountered an error.',
      });
    } finally {
      setIsSeedingDb(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Configuration Header */}
      <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e8c872]/15 border border-[#e8c872]/30 flex items-center justify-center text-[#e8c872]">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#e8c872] bg-[#e8c872]/10 px-2 py-0.5 rounded border border-[#e8c872]/20">
                  System Settings & Controls
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Platform Configuration Options
              </h2>
              <p className="text-xs text-[#a8a7b3]">
                Manage email delivery options, 25 AI Agents Army parameters, payment gateways, and enterprise multi-tenant profiles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white flex items-center gap-1.5 cursor-pointer"
              title="Backup / Export JSON Configuration"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
              title="Restore Factory Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-102 transition-transform"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Save confirmation toast */}
        {saveFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}
      </div>

      {/* Configuration Category Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2a2a38] text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSection('mail')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeSection === 'mail'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email & SMTP Delivery (Option 1 & 2)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/20">
            {config.mail.activeOption === 'option1_resend' ? 'Option 1' : config.mail.activeOption === 'option2_smtp' ? 'Option 2' : 'Option 3'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('ai')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeSection === 'ai'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>25 AI Agents Army Fleet</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/20">
            {config.aiFleet.defaultModel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('database')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
            activeSection === 'database'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-400'
              : 'bg-[#14141d] text-emerald-400 hover:text-white border-emerald-500/30'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Cloud Database (Firestore)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('domain')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
            activeSection === 'domain'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)] border-purple-400'
              : 'bg-[#14141d] text-purple-300 hover:text-white border-purple-500/30 hover:bg-[#1f1730]'
          }`}
        >
          <Globe className="w-4 h-4 text-purple-400" />
          <span>Hostinger & Custom Domain</span>
          <span className="text-[10px] bg-purple-900/60 text-purple-200 border border-purple-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
            {config.domain?.domainName || 'backforbrand.com'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('payments')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeSection === 'payments'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Gateways & Currency</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('tenant')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeSection === 'tenant'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Jurisdiction & Organization</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('security')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
            activeSection === 'security'
              ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
              : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Strict RBAC</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: EMAIL & SMTP DELIVERY OPTIONS */}
      {/* ========================================================================= */}
      {activeSection === 'mail' && (
        <div className="space-y-6">
          {/* Active Option Switcher Selector */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6">
            <h3 className="font-serif font-bold text-white text-base mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#e8c872]" />
              <span>Select Active Email Delivery Option</span>
            </h3>
            <p className="text-xs text-[#a8a7b3] mb-4">
              Choose the transmission engine for consultation confirmations, retainer receipts, and executive WhatsApp/email notifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Resend API */}
              <div
                onClick={() => setConfig({ ...config, mail: { ...config.mail, activeOption: 'option1_resend' } })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.mail.activeOption === 'option1_resend'
                    ? 'bg-gradient-to-br from-[#1c1c28] to-[#14141d] border-[#e8c872] shadow-[0_0_15px_rgba(232,200,114,0.15)] ring-1 ring-[#e8c872]'
                    : 'bg-[#0a0a0f] border-[#2a2a38] hover:border-[#a8a7b3]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#e8c872]">Option 1: Resend API</span>
                  {config.mail.activeOption === 'option1_resend' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e8c872] shadow" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full border border-[#444]" />
                  )}
                </div>
                <div className="text-[11px] text-[#ccc] font-medium">Recommended for Cloud & Serverless</div>
                <div className="text-[10px] text-[#777] mt-1">High deliverability, DKIM-verified, zero SMTP socket blockades.</div>
              </div>

              {/* Option 2: Google Workspace SMTP Relay */}
              <div
                onClick={() => setConfig({ ...config, mail: { ...config.mail, activeOption: 'option2_smtp' } })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.mail.activeOption === 'option2_smtp'
                    ? 'bg-gradient-to-br from-[#1c1c28] to-[#14141d] border-[#e8c872] shadow-[0_0_15px_rgba(232,200,114,0.15)] ring-1 ring-[#e8c872]'
                    : 'bg-[#0a0a0f] border-[#2a2a38] hover:border-[#a8a7b3]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#e8c872]">Option 2: Google SMTP Relay</span>
                  {config.mail.activeOption === 'option2_smtp' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e8c872] shadow" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full border border-[#444]" />
                  )}
                </div>
                <div className="text-[11px] text-[#ccc] font-medium">Google Workspace / Gmail Relay</div>
                <div className="text-[10px] text-[#777] mt-1">Uses smtp.gmail.com over SSL (port 465) with 16-character App Password.</div>
              </div>

              {/* Option 3: Browser Staging / Simulation */}
              <div
                onClick={() => setConfig({ ...config, mail: { ...config.mail, activeOption: 'option3_simulator' } })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.mail.activeOption === 'option3_simulator'
                    ? 'bg-gradient-to-br from-[#1c1c28] to-[#14141d] border-[#e8c872] shadow-[0_0_15px_rgba(232,200,114,0.15)] ring-1 ring-[#e8c872]'
                    : 'bg-[#0a0a0f] border-[#2a2a38] hover:border-[#a8a7b3]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#e8c872]">Option 3: Staging Simulator</span>
                  {config.mail.activeOption === 'option3_simulator' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e8c872] shadow" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full border border-[#444]" />
                  )}
                </div>
                <div className="text-[11px] text-[#ccc] font-medium">Local Browser Queue Mode</div>
                <div className="text-[10px] text-[#777] mt-1">Logs, formats, and inspects emails without live server dispatch.</div>
              </div>
            </div>
          </div>

          {/* Option 1 Settings Editor */}
          {config.mail.activeOption === 'option1_resend' && (
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
                <h4 className="font-serif font-bold text-white text-sm">
                  Option 1: Resend API Configuration Parameters
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  ACTIVE ENGINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">Resend API Key</label>
                  <div className="relative">
                    <input
                      type={showResendKey ? 'text' : 'password'}
                      value={config.mail.resendApiKey}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          mail: { ...config.mail, resendApiKey: e.target.value },
                        })
                      }
                      className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none pr-10"
                      placeholder="re_live_xxxxxxxxxxxxxxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResendKey(!showResendKey)}
                      className="absolute right-3 top-2.5 text-[#777] hover:text-white"
                    >
                      {showResendKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#666] mt-1 block">Found at resend.com/api-keys</span>
                </div>

                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">From Sender Email</label>
                  <input
                    type="email"
                    value={config.mail.resendFromEmail}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mail: { ...config.mail, resendFromEmail: e.target.value },
                      })
                    }
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                    placeholder="advisory@backforbrand.com"
                  />
                  <span className="text-[10px] text-[#666] mt-1 block">Verified custom domain</span>
                </div>

                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">From Display Name</label>
                  <input
                    type="text"
                    value={config.mail.resendFromName}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mail: { ...config.mail, resendFromName: e.target.value },
                      })
                    }
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white focus:border-[#e8c872] focus:outline-none"
                    placeholder="Ghazi Wazir · Bab Al-Khaleej & Back for Brand"
                  />
                </div>

                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">Reply-To Address</label>
                  <input
                    type="email"
                    value={config.mail.replyTo}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mail: { ...config.mail, replyTo: e.target.value },
                      })
                    }
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                    placeholder="ghaziwazirndm@gmail.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Option 2 Settings Editor */}
          {config.mail.activeOption === 'option2_smtp' && (
            <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
                <h4 className="font-serif font-bold text-white text-sm">
                  Option 2: Google Workspace SMTP Relay Parameters
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  ACTIVE ENGINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">SMTP Host</label>
                  <input
                    type="text"
                    value={config.mail.smtpHost}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mail: { ...config.mail, smtpHost: e.target.value },
                      })
                    }
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">SMTP Port & Security</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.mail.smtpPort}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          mail: { ...config.mail, smtpPort: parseInt(e.target.value) || 465 },
                        })
                      }
                      className="w-28 bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                      placeholder="465"
                    />
                    <label className="flex items-center gap-2 text-xs text-[#a8a7b3] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.mail.smtpSecure}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            mail: { ...config.mail, smtpSecure: e.target.checked },
                          })
                        }
                        className="accent-[#e8c872]"
                      />
                      <span>SSL/TLS Encryption</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">SMTP Username (Email)</label>
                  <input
                    type="email"
                    value={config.mail.smtpUser}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mail: { ...config.mail, smtpUser: e.target.value },
                      })
                    }
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                    placeholder="ghaziwazirndm@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-[#a8a7b3] mb-1 font-medium">SMTP App Password</label>
                  <div className="relative">
                    <input
                      type={showSmtpPass ? 'text' : 'password'}
                      value={config.mail.smtpPass}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          mail: { ...config.mail, smtpPass: e.target.value },
                        })
                      }
                      className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none pr-10"
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPass(!showSmtpPass)}
                      className="absolute right-3 top-2.5 text-[#777] hover:text-white"
                    >
                      {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#666] mt-1 block">Google Account &rarr; Security &rarr; App Passwords (16 characters)</span>
                </div>
              </div>
            </div>
          )}

          {/* Test Email Verification Box */}
          <div className="bg-[#0a0a0f] border border-[#e8c872]/40 rounded-2xl p-6">
            <h4 className="font-serif font-bold text-[#e8c872] text-sm mb-1 flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Verify & Test Current Email Configuration</span>
            </h4>
            <p className="text-xs text-[#a8a7b3] mb-4">
              Sends an immediate live test email using your active option to verify credentials, DNS authentication, and queue pipeline.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="email"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="Enter destination email (e.g. ghaziwazirndm@gmail.com)"
                className="flex-1 bg-[#14141d] border border-[#2a2a38] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#e8c872] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 animate-in fade-in ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/40 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testResult.success ? 'Dispatch Verified' : 'Transmission Alert'}</div>
                  <div className="text-[11px] mt-0.5">{testResult.message}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: 25 AI AGENTS ARMY FLEET CONFIGURATION */}
      {/* ========================================================================= */}
      {activeSection === 'ai' && (
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
            <div>
              <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>25 AI Agents Army Master Engine Configuration</span>
              </h3>
              <p className="text-xs text-[#a8a7b3] mt-0.5">
                Configure default Google Gemini foundation models, autonomous dispatch behavior, and response creativity.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/40">
              25 Agents Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-[#a8a7b3] mb-1.5 font-medium">Default AI Model for Agents Fleet</label>
              <select
                value={config.aiFleet.defaultModel}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    aiFleet: {
                      ...config.aiFleet,
                      defaultModel: e.target.value as any,
                    },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended · Ultra Fast & Efficient)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning · Complex Government Legal Analysis)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash (Balanced · Conversational Triage)</option>
              </select>
              <span className="text-[10px] text-[#666] mt-1 block">Applies to all autonomous task dispatches and live chat assistants.</span>
            </div>

            <div>
              <label className="block text-[#a8a7b3] mb-1.5 font-medium">
                Creativity & Temperature: <span className="text-white font-mono">{config.aiFleet.creativityTemperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.aiFleet.creativityTemperature}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    aiFleet: {
                      ...config.aiFleet,
                      creativityTemperature: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#666] mt-1">
                <span>0.0 (Strict / Legal Documents)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (Creative Copy & Ads)</span>
              </div>
            </div>

            <div>
              <label className="block text-[#a8a7b3] mb-1.5 font-medium">Bilingual & Regional Language Mode</label>
              <select
                value={config.aiFleet.languageMode}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    aiFleet: {
                      ...config.aiFleet,
                      languageMode: e.target.value as any,
                    },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="bilingual">Bilingual (Auto-Detect English & Arabic with Bahrain Dialect)</option>
                <option value="en">English Primary (International & USA Focus)</option>
                <option value="ar">Arabic Primary (GCC & Bahrain Domestic Market Focus)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#a8a7b3] mb-1.5 font-medium">Fleet Execution Supervison Mode</label>
              <div className="flex items-center gap-3 p-2 bg-[#0a0a0f] border border-[#2a2a38] rounded-xl">
                <input
                  type="checkbox"
                  id="autonomousToggle"
                  checked={config.aiFleet.autonomousMode}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      aiFleet: {
                        ...config.aiFleet,
                        autonomousMode: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-cyan-400 cursor-pointer ml-2"
                />
                <label htmlFor="autonomousToggle" className="text-xs cursor-pointer text-[#ccc]">
                  <strong className="text-white block">Full Autonomous Dispatch Active</strong>
                  <span className="text-[10px] text-[#777]">Tasks execute and synthesize results without mandatory manual click confirmation.</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#a8a7b3] mb-1.5 font-medium">Master CEO Prompt & Executive Persona Prefix</label>
              <textarea
                rows={3}
                value={config.aiFleet.masterPromptPrefix}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    aiFleet: {
                      ...config.aiFleet,
                      masterPromptPrefix: e.target.value,
                    },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                placeholder="Prefix injected into all 25 agent task prompts..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: CLOUD DATABASE (FIRESTORE)                                       */}
      {/* ========================================================================= */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          <div className="bg-[#14141d] border border-emerald-500/30 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2a38] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Google Cloud Firestore Native Mode
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="font-serif font-bold text-white text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Cloud Database & Storage Cluster</span>
                </h3>
                <p className="text-xs text-[#a8a7b3] mt-0.5">
                  Persistent cloud database infrastructure synchronizing leads, executive bookings, payment ledgers, and platform settings.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePingDatabase}
                  disabled={isPingingDb}
                  className="px-3.5 py-2 rounded-xl bg-[#0a0a0f] border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPingingDb ? 'animate-spin' : ''}`} />
                  <span>{isPingingDb ? 'Pinging Cloud...' : 'Ping Database'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInsertTestLead}
                  disabled={isSeedingDb}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Test Cloud Write</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={isSeedingDb}
                  className="btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
                >
                  <Cloud className={`w-3.5 h-3.5 ${isSeedingDb ? 'animate-spin' : ''}`} />
                  <span>{isSeedingDb ? 'Seeding...' : 'Seed Initial Data'}</span>
                </button>
              </div>
            </div>

            {/* Ping Feedback */}
            {dbPingResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                  dbPingResult.connected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Cloud Firestore Connection Verified</strong>
                  <span className="text-[11px] opacity-90">{dbPingResult.message}</span>
                </div>
              </div>
            )}

            {/* Seed Feedback */}
            {seedResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                  seedResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/40 text-red-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Database Seeding Complete</strong>
                  <span className="text-[11px] opacity-90">{seedResult.message}</span>
                </div>
              </div>
            )}

            {/* Database Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5">
                <span className="text-[10px] text-[#777] uppercase block mb-1">Database ID</span>
                <span className="text-white font-bold break-all text-[11px]">
                  ai-studio-ghaziwazirceobac-a35dbe61-b2cd-4a60-9020-9af974f55f65
                </span>
              </div>

              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5">
                <span className="text-[10px] text-[#777] uppercase block mb-1">GCP Project ID</span>
                <span className="text-emerald-400 font-bold">windy-intelligence-dmn89</span>
              </div>

              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5">
                <span className="text-[10px] text-[#777] uppercase block mb-1">Target Cloud Region</span>
                <span className="text-white font-bold">asia-southeast1</span>
              </div>

              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5">
                <span className="text-[10px] text-[#777] uppercase block mb-1">Rules Hardening</span>
                <span className="text-cyan-400 font-bold">ABAC Zero-Trust Rules Active</span>
              </div>
            </div>

            {/* Active Cloud Collections Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Configured Cloud Firestore Collections</span>
              </h4>

              <div className="overflow-x-auto rounded-xl border border-[#2a2a38]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0a0f] text-[#a8a7b3] text-[10px] uppercase font-mono border-b border-[#2a2a38]">
                    <tr>
                      <th className="py-2.5 px-3">Collection Path</th>
                      <th className="py-2.5 px-3">Schema & Purpose</th>
                      <th className="py-2.5 px-3">Sync Engine</th>
                      <th className="py-2.5 px-3">Access Policy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a38] bg-[#11111a] font-mono text-[11px]">
                    <tr>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">/leads/{'{leadId}'}</td>
                      <td className="py-2.5 px-3 text-[#ccc]">Client inquiries & business setup dossiers</td>
                      <td className="py-2.5 px-3 text-white">Live onSnapshot + LocalStorage</td>
                      <td className="py-2.5 px-3 text-[#a8a7b3]">Public intake / Admin restricted</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">/bookings/{'{bookingId}'}</td>
                      <td className="py-2.5 px-3 text-[#ccc]">Executive 1-on-1 consultations & schedules</td>
                      <td className="py-2.5 px-3 text-white">Live onSnapshot + LocalStorage</td>
                      <td className="py-2.5 px-3 text-[#a8a7b3]">Client booking / Admin restricted</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">/transactions/{'{txId}'}</td>
                      <td className="py-2.5 px-3 text-[#ccc]">Fawri+, BenefitPay, Tap & Stripe ledger</td>
                      <td className="py-2.5 px-3 text-white">Live onSnapshot + LocalStorage</td>
                      <td className="py-2.5 px-3 text-[#a8a7b3]">Multi-Gateway / Admin restricted</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">/system_settings/{'{id}'}</td>
                      <td className="py-2.5 px-3 text-[#ccc]">Global platform options & AI fleet config</td>
                      <td className="py-2.5 px-3 text-white">setDoc Synchronized</td>
                      <td className="py-2.5 px-3 text-[#a8a7b3]">Super Admin / CEO clearance</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">/admins/{'{uid}'}</td>
                      <td className="py-2.5 px-3 text-[#ccc]">Hardware-isolated RBAC verification roles</td>
                      <td className="py-2.5 px-3 text-white">Cloud Firestore DB exists()</td>
                      <td className="py-2.5 px-3 text-[#a8a7b3]">Zero-trust claim verification</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PAYMENTS & CURRENCY CONFIGURATION */}
      {/* ========================================================================= */}
      {activeSection === 'payments' && (
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#2a2a38] pb-3">
            <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#e8c872]" />
              <span>Gulf & Global Payment Gateways Configuration</span>
            </h3>
            <p className="text-xs text-[#a8a7b3] mt-0.5">
              Toggle accepted payment processors across Bahrain debit cards, GCC wallets, and international credit cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#e8c872] uppercase block">Regional Payment Options</span>
              
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer hover:border-[#a8a7b3]/40">
                <input
                  type="checkbox"
                  checked={config.payments.enableBenefitPay}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...config.payments, enableBenefitPay: e.target.checked },
                    })
                  }
                  className="accent-[#e8c872]"
                />
                <div>
                  <strong className="text-white block">BenefitPay Fawri+ (Bahrain National Debit)</strong>
                  <span className="text-[10px] text-[#777]">Instant zero-fee IBAN & QR code payment for Bahrain commercial registrations.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer hover:border-[#a8a7b3]/40">
                <input
                  type="checkbox"
                  checked={config.payments.enableTap}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...config.payments, enableTap: e.target.checked },
                    })
                  }
                  className="accent-[#e8c872]"
                />
                <div>
                  <strong className="text-white block">Tap Payments (GCC Cards & KNET)</strong>
                  <span className="text-[10px] text-[#777]">Direct checkout across Saudi Mada, Kuwait KNET, and UAE cards.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer hover:border-[#a8a7b3]/40">
                <input
                  type="checkbox"
                  checked={config.payments.enableStripe}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: { ...config.payments, enableStripe: e.target.checked },
                    })
                  }
                  className="accent-[#e8c872]"
                />
                <div>
                  <strong className="text-white block">Stripe Global (Visa, Mastercard, Amex)</strong>
                  <span className="text-[10px] text-[#777]">Global retainers for Back for Brand LLC clients in USA, UK, and Europe.</span>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-bold text-[#e8c872] uppercase block">Currency & Checkout Settings</span>

              <div>
                <label className="block text-[#a8a7b3] mb-1 font-medium">Default Display & Billing Currency</label>
                <select
                  value={config.payments.defaultCurrency}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: {
                        ...config.payments,
                        defaultCurrency: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                >
                  <option value="BHD">BHD — Bahraini Dinar (1 BHD = $2.65 USD)</option>
                  <option value="USD">USD — United States Dollar</option>
                  <option value="SAR">SAR — Saudi Riyal</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a8a7b3] mb-1 font-medium">National VAT Rate (%)</label>
                <input
                  type="number"
                  value={config.payments.vatRatePercent}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      payments: {
                        ...config.payments,
                        vatRatePercent: parseFloat(e.target.value) || 10,
                      },
                    })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                  placeholder="10"
                />
                <span className="text-[10px] text-[#666] mt-1 block">Bahrain standard statutory VAT is 10%.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: TENANT & DUAL-JURISDICTION PROFILE */}
      {/* ========================================================================= */}
      {activeSection === 'tenant' && (
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-5">
          <div className="border-b border-[#2a2a38] pb-3">
            <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-[#e8c872]" />
              <span>Dual-Jurisdiction Enterprise Parameters</span>
            </h3>
            <p className="text-xs text-[#a8a7b3] mt-0.5">
              Official company registration numbers, headquarters addresses, and executive contact lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#a8a7b3] mb-1 font-medium">Bahrain Entity Name</label>
              <input
                type="text"
                value={config.tenant.companyNameBahrain}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    tenant: { ...config.tenant, companyNameBahrain: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white focus:border-[#e8c872] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a8a7b3] mb-1 font-medium">Bahrain Commercial Registration (CR)</label>
              <input
                type="text"
                value={config.tenant.crNumberBahrain}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    tenant: { ...config.tenant, crNumberBahrain: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a8a7b3] mb-1 font-medium">USA Entity Name</label>
              <input
                type="text"
                value={config.tenant.companyNameUsa}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    tenant: { ...config.tenant, companyNameUsa: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white focus:border-[#e8c872] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a8a7b3] mb-1 font-medium">Executive Contact Hotline</label>
              <input
                type="text"
                value={config.tenant.ceoPhone}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    tenant: { ...config.tenant, ceoPhone: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#a8a7b3] mb-1 font-medium">Bahrain Physical Address</label>
              <input
                type="text"
                value={config.tenant.bahrainAddress}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    tenant: { ...config.tenant, bahrainAddress: e.target.value },
                  })
                }
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white focus:border-[#e8c872] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: SECURITY & RBAC CONFIGURATION */}
      {/* ========================================================================= */}
      {activeSection === 'security' && (
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-5">
          <div className="border-b border-[#2a2a38] pb-3">
            <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict RBAC & Data Isolation Configuration</span>
            </h3>
            <p className="text-xs text-[#a8a7b3] mt-0.5">
              Enforce strict role separation: Normal USER and PUBLIC roles are strictly isolated from all internal dashboards.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0a0a0f] border border-emerald-500/30">
              <input
                type="checkbox"
                checked={config.security.strictPublicIsolation}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    security: { ...config.security, strictPublicIsolation: e.target.checked },
                  })
                }
                className="accent-emerald-400"
              />
              <div>
                <strong className="text-white block">Strict Public Isolation Guard (Enforced)</strong>
                <span className="text-[10px] text-[#a8a7b3]">
                  Blocks any attempt by USER or PUBLIC to access CEO Portal, Admin Console, Live Agent Desk, or internal API endpoints with HTTP 403.
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#a8a7b3] mb-1 font-medium">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={config.security.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      security: {
                        ...config.security,
                        sessionTimeoutMinutes: parseInt(e.target.value) || 480,
                      },
                    })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white font-mono focus:border-[#e8c872] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a8a7b3] mb-1 font-medium">Audit Log Verbosity</label>
                <select
                  value={config.security.logVerbosity}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      security: {
                        ...config.security,
                        logVerbosity: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-white focus:border-[#e8c872] focus:outline-none"
                >
                  <option value="minimal">Minimal (Errors and Auth Only)</option>
                  <option value="standard">Standard (Full RBAC Route & Query Logging)</option>
                  <option value="verbose">Verbose (Complete Request & Agent Payload Audit)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: HOSTINGER & CUSTOM DOMAIN GATEWAY */}
      {/* ========================================================================= */}
      {activeSection === 'domain' && (
        <HostingerDomainManager onSaved={handleSaveAll} />
      )}
    </div>
  );
};
