import React, { useState, useEffect } from 'react';
import {
  Bot,
  Zap,
  Play,
  Pause,
  CheckCircle2,
  Sliders,
  Search,
  ExternalLink,
  Copy,
  Check,
  Code,
  Sparkles,
  ShieldCheck,
  Send,
  Radio,
  RefreshCw,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Globe,
  DollarSign,
  FileText,
  MessageSquare,
  X,
} from 'lucide-react';
import {
  AgentSquadItem,
  getStoredAgentsArmy,
  saveAgentsArmy,
  resetAgentsArmy,
} from '../data/agentsArmyStore';

export const AgentsArmyCommandCenter: React.FC = () => {
  const [agents, setAgents] = useState<AgentSquadItem[]>(() => getStoredAgentsArmy());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<string>('all');

  // Task Runner Modal State
  const [activeTaskAgent, setActiveTaskAgent] = useState<AgentSquadItem | null>(null);
  const [taskPrompt, setTaskPrompt] = useState('');
  const [taskResponse, setTaskResponse] = useState<string | null>(null);
  const [isRunningTask, setIsRunningTask] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Embed Modal State
  const [activeEmbedAgent, setActiveEmbedAgent] = useState<AgentSquadItem | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Agent Configuration Options Modal State
  const [activeConfigAgent, setActiveConfigAgent] = useState<AgentSquadItem | null>(null);
  const [configForm, setConfigForm] = useState<Partial<AgentSquadItem>>({});
  const [configSavedToast, setConfigSavedToast] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setAgents(getStoredAgentsArmy());
    };
    window.addEventListener('gw_agents_army_updated', handleUpdate);
    return () => window.removeEventListener('gw_agents_army_updated', handleUpdate);
  }, []);

  // Filter Agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSquad = selectedSquad === 'all' || agent.squad === selectedSquad;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.channels.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSquad && matchesSearch;
  });

  const activeCount = agents.filter((a) => a.status === 'active').length;

  const handleToggleAgentStatus = (id: string) => {
    const updated = agents.map((a) =>
      a.id === id ? { ...a, status: a.status === 'active' ? ('standby' as const) : ('active' as const) } : a
    );
    setAgents(updated);
    saveAgentsArmy(updated);
  };

  const handleActivateAll = () => {
    const updated = agents.map((a) => ({ ...a, status: 'active' as const }));
    setAgents(updated);
    saveAgentsArmy(updated);
  };

  const handlePauseAll = () => {
    const updated = agents.map((a) => ({ ...a, status: 'standby' as const }));
    setAgents(updated);
    saveAgentsArmy(updated);
  };

  const handleOpenTaskRunner = (agent: AgentSquadItem) => {
    setActiveTaskAgent(agent);
    setTaskPrompt(agent.defaultPrompt);
    setTaskResponse(null);
  };

  const handleRunTask = async () => {
    if (!activeTaskAgent || !taskPrompt.trim() || isRunningTask) return;
    setIsRunningTask(true);
    setTaskResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[DIRECT AGENT TASK DISPATCH: Agent #${activeTaskAgent.number} ${activeTaskAgent.name} (${activeTaskAgent.codeName}) | Squad: ${activeTaskAgent.squad}]:\n\nPrompt: ${taskPrompt}`,
        }),
      });
      const data = await res.json();
      setTaskResponse(data.reply || 'Task completed successfully with output generated.');

      // Update tasks count
      const updated = agents.map((a) =>
        a.id === activeTaskAgent.id ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a
      );
      setAgents(updated);
      saveAgentsArmy(updated);
    } catch (err: any) {
      setTaskResponse(`Error executing task: ${err?.message || 'Server error'}`);
    } finally {
      setIsRunningTask(false);
    }
  };

  const copyTaskOutput = () => {
    if (!taskResponse) return;
    navigator.clipboard.writeText(taskResponse);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleOpenConfig = (agent: AgentSquadItem) => {
    setActiveConfigAgent(agent);
    setConfigForm({
      name: agent.name,
      codeName: agent.codeName,
      model: agent.model,
      status: agent.status,
      defaultPrompt: agent.defaultPrompt,
      channels: [...agent.channels],
      description: agent.description,
    });
    setConfigSavedToast(false);
  };

  const handleSaveConfig = () => {
    if (!activeConfigAgent) return;
    const updated = agents.map((a) =>
      a.id === activeConfigAgent.id ? ({ ...a, ...configForm } as AgentSquadItem) : a
    );
    setAgents(updated);
    saveAgentsArmy(updated);
    setConfigSavedToast(true);
    setTimeout(() => {
      setConfigSavedToast(false);
      setActiveConfigAgent(null);
    }, 1200);
  };

  const getEmbedCode = (agent: AgentSquadItem) => {
    return `<!-- Ghazi Wazir 25 Agents Army — ${agent.name} (#${agent.number}) -->
<iframe 
  src="${window.location.origin}/agent/${agent.embedSlug}" 
  width="100%" 
  height="380" 
  frameborder="0" 
  title="${agent.name}">
</iframe>`;
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Executive Command Header */}
      <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872] bg-[#e8c872]/15 border border-[#e8c872]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#e8c872]" />
                Complete 25 Agents Army · CEO Control Portal
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {activeCount}/25 Autonomous Agents Active
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              End-to-End Autonomous Business Fleet
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a7b3] mt-1 max-w-3xl leading-relaxed">
              Supervising every stage of Ghazi Wazir's enterprises: Google Business Profile (GMB), organic SEO/GEO/AEO,
              Meta & Google Ads, viral video scripts, B2B funnels, WhatsApp triage, BenefitPay/Stripe payment collections,
              and MOIC/LMRA government clearance.
            </p>
          </div>

          {/* Master Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleActivateAll}
              className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-102 transition-transform"
            >
              <Zap className="w-4 h-4" />
              <span>Activate All 25</span>
            </button>

            <button
              type="button"
              onClick={handlePauseAll}
              className="px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] text-xs font-semibold text-[#a8a7b3] hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Standby All</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const defs = resetAgentsArmy();
                setAgents(defs);
              }}
              className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] text-[#a8a7b3] hover:text-[#e8c872] cursor-pointer"
              title="Reset to Default Squad Presets"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fleet KPI Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#2a2a38]">
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#a8a7b3]">Active Fleet Capacity</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">100% Autonomous</div>
            <div className="text-[11px] text-[#777]">Gemini 3.8 Live & Flash</div>
          </div>

          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#a8a7b3]">Total Tasks Handled</div>
            <div className="text-lg font-bold text-[#e8c872] mt-0.5">11,875 Operations</div>
            <div className="text-[11px] text-[#777]">Content & Conversions</div>
          </div>

          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#a8a7b3]">Payment Recovery Rate</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">99.2% Collected</div>
            <div className="text-[11px] text-[#777]">BenefitPay, Stripe & Wire</div>
          </div>

          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#a8a7b3]">Supervision Mode</div>
            <div className="text-lg font-bold text-white mt-0.5">CEO Controlled</div>
            <div className="text-[11px] text-emerald-400">Zero Unauthorized Guarantees</div>
          </div>
        </div>
      </div>

      {/* Squad Navigation Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Squad Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { id: 'all', label: `All 25 Agents (${agents.length})` },
              { id: 'Executive & Strategy', label: 'Executive (2)' },
              { id: 'SEO, AEO & Local GMB', label: 'SEO, GMB & AEO (4)' },
              { id: 'Paid Ads & Traffic', label: 'Paid Ads & Video (4)' },
              { id: 'Social Media & Content', label: 'Social & Content (4)' },
              { id: 'Funnels & Lead Conversion', label: 'Funnels & WhatsApp (4)' },
              { id: 'Payments & Collections', label: 'Payments & Dunning (2)' },
              { id: 'Operations & Government', label: 'Government Clearance (5)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSquad(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedSquad === tab.id
                    ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                    : 'bg-[#14141d] text-[#a8a7b3] hover:text-white border border-[#2a2a38]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a7b3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent, channel, GMB, SEO..."
              className="w-full bg-[#14141d] border border-[#2a2a38] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
            />
          </div>
        </div>
      </div>

      {/* 25 Agents Army Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className={`bg-[#14141d] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
              agent.status === 'active'
                ? 'border-[#2a2a38] hover:border-[#e8c872]/60 shadow-lg'
                : 'border-[#222230] opacity-60'
            }`}
          >
            <div>
              {/* Card Top: Number, Squad & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0a0a0f] border border-[#2a2a38] flex items-center justify-center font-mono text-[11px] font-bold text-[#e8c872]">
                    #{String(agent.number).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#a8a7b3] truncate max-w-[150px]">
                    {agent.squad}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      agent.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {agent.status.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleAgentStatus(agent.id)}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                      agent.status === 'active' ? 'bg-[#e8c872]' : 'bg-[#2a2a38]'
                    }`}
                    title={agent.status === 'active' ? 'Standby Agent' : 'Activate Agent'}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-black transition-transform ${
                        agent.status === 'active' ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Agent Name & CodeName */}
              <div className="mb-2">
                <h3 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  <span>{agent.name}</span>
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-[#e8c872] bg-[#e8c872]/10 px-1.5 py-0.2 rounded border border-[#e8c872]/20">
                    {agent.codeName}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {agent.model}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#a8a7b3] line-clamp-2 mb-3 leading-relaxed">
                {agent.description}
              </p>

              {/* Target Channels */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {agent.channels.map((ch, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#0a0a0f] border border-[#2a2a38] text-[#ccc] px-2 py-0.5 rounded-md"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions & Stats */}
            <div className="pt-3 border-t border-[#2a2a38] flex items-center justify-between gap-2">
              <div className="text-[10px] font-mono text-[#777]">
                <span className="text-[#a8a7b3] font-bold">{agent.tasksCompleted}</span> ops · {agent.successRate}%
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenConfig(agent)}
                  className="p-1.5 bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a38] hover:border-cyan-400 rounded-lg text-cyan-400 hover:text-white cursor-pointer transition-colors"
                  title="Configure Agent Options & Model"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEmbedAgent(agent)}
                  className="p-1.5 bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a38] hover:border-[#e8c872] rounded-lg text-[#a8a7b3] hover:text-white cursor-pointer transition-colors"
                  title="Embed / Webhook Link"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenTaskRunner(agent)}
                  className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow hover:scale-102 transition-transform"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Dispatch Task</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Runner Live Modal */}
      {activeTaskAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Header */}
            <div className="p-5 border-b border-[#2a2a38] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] flex items-center justify-center font-mono font-bold text-xs text-[#e8c872]">
                  #{String(activeTaskAgent.number).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-white text-base">
                    Dispatch Task: {activeTaskAgent.name}
                  </h3>
                  <div className="text-xs text-[#a8a7b3]">
                    Squad: <strong className="text-white">{activeTaskAgent.squad}</strong> · Model:{' '}
                    <span className="text-cyan-400 font-mono">{activeTaskAgent.model}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTaskAgent(null)}
                className="p-1.5 text-[#a8a7b3] hover:text-white rounded-full bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Agent Task Instruction / Prompt:</label>
                <textarea
                  rows={3}
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder="Enter specific task for this agent..."
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                />
              </div>

              {/* Sample Prompts */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTaskPrompt(activeTaskAgent.defaultPrompt)}
                  className="text-[11px] text-[#e8c872] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Use Recommended Blueprint Task</span>
                </button>
              </div>

              {/* Response Display */}
              {isRunningTask && (
                <div className="p-4 bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl flex items-center justify-center gap-2 text-xs text-[#e8c872] animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agent #{activeTaskAgent.number} ({activeTaskAgent.codeName}) executing task via Gemini 3.8...</span>
                </div>
              )}

              {taskResponse && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Task Completed Output:</span>
                    </span>
                    <button
                      type="button"
                      onClick={copyTaskOutput}
                      className="text-[11px] text-[#a8a7b3] hover:text-[#e8c872] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedResponse ? 'Copied!' : 'Copy Output'}</span>
                    </button>
                  </div>

                  <div className="bg-[#0a0a0f] border border-emerald-500/30 p-4 rounded-2xl text-xs text-[#f5f1e8] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
                    {taskResponse}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2a2a38] bg-[#0a0a0f]/80 flex items-center justify-between">
              <span className="text-[11px] text-[#a8a7b3]">
                Channels: {activeTaskAgent.channels.join(', ')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskAgent(null)}
                  className="px-4 py-2 rounded-xl bg-[#14141d] text-xs text-[#a8a7b3] hover:text-white border border-[#2a2a38] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRunTask}
                  disabled={isRunningTask || !taskPrompt.trim()}
                  className="btn-gold px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningTask ? 'Running...' : 'Execute Task Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed / Webhook Modal */}
      {activeEmbedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
              <div>
                <h3 className="font-serif font-bold text-white text-base">
                  Embed & Webhook: {activeEmbedAgent.name}
                </h3>
                <span className="text-[10px] text-[#e8c872] font-mono">
                  Agent ID: #{activeEmbedAgent.number} · {activeEmbedAgent.codeName}
                </span>
              </div>
              <button
                onClick={() => setActiveEmbedAgent(null)}
                className="p-1.5 text-[#a8a7b3] hover:text-white rounded-full bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#a8a7b3] font-medium block mb-1">Direct Iframe Embed Code:</label>
                <pre className="p-3 bg-[#0a0a0f] border border-[#2a2a38] rounded-xl text-[11px] font-mono text-[#e8c872] overflow-x-auto">
                  {getEmbedCode(activeEmbedAgent)}
                </pre>
              </div>

              <div>
                <label className="text-[#a8a7b3] font-medium block mb-1">Internal REST / Webhook Endpoint:</label>
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/api/agents/${activeEmbedAgent.embedSlug}/dispatch`}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 font-mono text-[11px] text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#2a2a38] flex items-center justify-between">
              <span className="text-[10px] text-emerald-400">Zero-configuration secure proxy</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getEmbedCode(activeEmbedAgent));
                  setCopiedEmbed(true);
                  setTimeout(() => setCopiedEmbed(false), 2000);
                }}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Copied Code!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Configuration Options Modal */}
      {activeConfigAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#14141d] border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 text-left shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-base">
                    Configure Agent Options: {activeConfigAgent.name}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Agent #{activeConfigAgent.number} · {activeConfigAgent.codeName} · Squad: {activeConfigAgent.squad}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveConfigAgent(null)}
                className="p-1.5 text-[#a8a7b3] hover:text-white rounded-full bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a8a7b3] font-medium block mb-1">Agent Name</label>
                  <input
                    type="text"
                    value={configForm.name || ''}
                    onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#a8a7b3] font-medium block mb-1">Codename / Designation</label>
                  <input
                    type="text"
                    value={configForm.codeName || ''}
                    onChange={(e) => setConfigForm({ ...configForm, codeName: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#a8a7b3] font-medium block mb-1">Foundation AI Model</label>
                  <select
                    value={configForm.model || 'gemini-3.8-flash'}
                    onChange={(e) => setConfigForm({ ...configForm, model: e.target.value as any })}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Real-Time Ultra-Fast Speed)</option>
                    <option value="gemini-3.8-live">gemini-3.8-live (Low-Latency Audio & Multi-turn)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#a8a7b3] font-medium block mb-1">Status / Readiness</label>
                  <select
                    value={configForm.status || 'active'}
                    onChange={(e) => setConfigForm({ ...configForm, status: e.target.value as any })}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="active">Active (Dispatched on Demand)</option>
                    <option value="standby">Standby (Paused)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#a8a7b3] font-medium block mb-1">Target Operational Channels (Comma-separated)</label>
                <input
                  type="text"
                  value={(configForm.channels || []).join(', ')}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      channels: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="WhatsApp, Google Business Profile, Email, Meta Ads"
                />
              </div>

              <div>
                <label className="text-[#a8a7b3] font-medium block mb-1">Default System Instruction / Prompt Override</label>
                <textarea
                  rows={4}
                  value={configForm.defaultPrompt || ''}
                  onChange={(e) => setConfigForm({ ...configForm, defaultPrompt: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none font-mono text-xs"
                  placeholder="Task directive for this agent..."
                />
              </div>
            </div>

            {configSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Agent configuration options saved and applied to fleet!</span>
              </div>
            )}

            <div className="pt-3 border-t border-[#2a2a38] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveConfigAgent(null)}
                className="px-4 py-2 rounded-xl border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="btn-gold px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-102 transition-transform"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Agent Options</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
