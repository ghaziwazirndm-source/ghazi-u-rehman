import React, { useState } from 'react';
import {
  Globe,
  Building,
  Zap,
  Shield,
  ArrowRight,
  Radio,
  ExternalLink,
  CheckCircle2,
  Activity,
  Layers,
  MapPin,
  Bot,
  Compass,
  Sparkles,
} from 'lucide-react';

interface MapNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  type: 'local_bahrain' | 'global_tech' | 'gcc_regional' | 'international_client';
  entity: 'Bab Al-Khaleej (Bahrain)' | 'Back for Brand LLC (USA)';
  x: number; // SVG coordinate percent (0-1000)
  y: number; // SVG coordinate percent (0-500)
  services: string[];
  metrics: string;
  turnaround: string;
  leadDesc: string;
  isHub?: boolean;
}

const MAP_NODES: MapNode[] = [
  {
    id: 'manama-hq',
    name: 'Manama (Seef & Financial Harbour)',
    country: 'Bahrain',
    flag: '🇧🇭',
    type: 'local_bahrain',
    entity: 'Bab Al-Khaleej (Bahrain)',
    x: 615,
    y: 220,
    isHub: true,
    services: [
      'Commercial Registration (CR) Formation via MOIC Sijilat',
      'LMRA Expat Visas & Investor 10-Year Golden Residency',
      'Ministry Municipal Approvals & Document Clearing',
      'Corporate Bank Account Opening & VIP Notarization',
    ],
    metrics: '850+ Companies Incorporated',
    turnaround: '3 - 5 Business Days MOIC Sijilat Expedited',
    leadDesc: 'On-the-ground operational headquarters. Sovereign ministerial tracking, document clearance, and direct presence at Bahrain government ministries.',
  },
  {
    id: 'florida-hq',
    name: 'Miami & Orlando, Florida',
    country: 'United States',
    flag: '🇺🇸',
    type: 'global_tech',
    entity: 'Back for Brand LLC (USA)',
    x: 255,
    y: 228,
    isHub: true,
    services: [
      'Generative Engine Optimization (GEO & AEO for ChatGPT/Perplexity/Gemini)',
      '25 Autonomous AI Agents Army Fleet Engineering',
      'High-Conversion International SaaS & Tech Funnels',
      'Enterprise Software Architecture & Global Brand Systems',
    ],
    metrics: '28+ Countries Actively Served',
    turnaround: '24/7/365 Autonomous Cloud Systems',
    leadDesc: 'Global technology headquarters. Registered Florida LLC managing worldwide artificial intelligence growth systems, LLM citation search engines, and tech infrastructure.',
  },
  {
    id: 'khobar-causeway',
    name: 'Al Khobar & Eastern Province (Causeway Link)',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    type: 'gcc_regional',
    entity: 'Bab Al-Khaleej (Bahrain)',
    x: 605,
    y: 218,
    services: [
      'King Fahd Causeway Cross-Border Business Expansion',
      'Saudi Investor Fast-Track CR Registration in Bahrain',
      'Bilingual Ministry Document Attestation',
    ],
    metrics: 'Daily Causeway Transit & Advisory',
    turnaround: '24 - 48 Hours Cross-Border Filing',
    leadDesc: 'Direct transit bridge connecting Saudi business owners and GCC corporate groups to Bahrain commercial incorporation and tax incentives.',
  },
  {
    id: 'riyadh',
    name: 'Riyadh Corporate Corridor',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    type: 'gcc_regional',
    entity: 'Bab Al-Khaleej (Bahrain)',
    x: 595,
    y: 232,
    services: [
      'GCC Dual-Licensing Structuring',
      'Bahrain Holding Entity Formation for Saudi Ventures',
      'Regional Tax & Ministry Compliance',
    ],
    metrics: '120+ Cross-Border Portfolios',
    turnaround: '48h Ministry Attestation',
    leadDesc: 'Corporate advisory for Saudi capital founders seeking Bahrain regional holding structures and foreign ownership benefits.',
  },
  {
    id: 'dubai-uae',
    name: 'Dubai & Abu Dhabi',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    type: 'gcc_regional',
    entity: 'Bab Al-Khaleej (Bahrain)',
    x: 638,
    y: 232,
    services: [
      'GCC Commercial Registration Attestation',
      'Free Zone vs Mainland Expansion Consulting',
      'Golden Visa Cross-Border Consultation',
    ],
    metrics: '85+ GCC Founder Files',
    turnaround: '3 Days Clearance',
    leadDesc: 'Seamless coordination between Bahrain and UAE financial centers for founders managing dual-jurisdiction entities.',
  },
  {
    id: 'silicon-valley',
    name: 'Silicon Valley / California',
    country: 'United States',
    flag: '🇺🇸',
    type: 'international_client',
    entity: 'Back for Brand LLC (USA)',
    x: 180,
    y: 195,
    services: [
      'SaaS Generative Engine Optimization (GEO)',
      'Autonomous Code & Marketing AI Agents Deployment',
      'ChatGPT Citation Authority Engineering',
    ],
    metrics: 'Top 3 Search Citation Ranking',
    turnaround: 'Instant AI Dispatch',
    leadDesc: 'Tech startups leveraging Back for Brand LLC for next-generation generative search engine visibility on ChatGPT and Gemini.',
  },
  {
    id: 'new-york',
    name: 'New York Financial District',
    country: 'United States',
    flag: '🇺🇸',
    type: 'international_client',
    entity: 'Back for Brand LLC (USA)',
    x: 285,
    y: 182,
    services: [
      'Enterprise Fintech Organic Visibility',
      'Executive Brand Digital Asset Strategy',
      'Automated Lead Intake Pipelines',
    ],
    metrics: '14 Enterprise Retainers',
    turnaround: 'Dedicated US Account Lead',
    leadDesc: 'B2B tech and advisory firms scaling international online revenue through enterprise AI conversion funnels.',
  },
  {
    id: 'london-uk',
    name: 'London & Tech City',
    country: 'United Kingdom',
    flag: '🇬🇧',
    type: 'international_client',
    entity: 'Back for Brand LLC (USA)',
    x: 485,
    y: 152,
    services: [
      'Transatlantic Brand Architecture',
      'GCC Market Entry Tech Preparation',
      'Perplexity & Claude Citation Audits',
    ],
    metrics: '22 Active Client Systems',
    turnaround: 'Same-Day Sprint Cycles',
    leadDesc: 'UK-based enterprises expanding into both the US and GCC markets with coordinated brand and technical positioning.',
  },
  {
    id: 'tokyo-japan',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    type: 'international_client',
    entity: 'Back for Brand LLC (USA)',
    x: 825,
    y: 205,
    services: [
      'Global Cross-Border Tech Distribution',
      'Bahrain Golden Visa Investment Feasibility',
      'International Search Optimization',
    ],
    metrics: '8 Institutional Contracts',
    turnaround: 'Multilingual Coordination',
    leadDesc: 'East Asian investors and software companies routing capital into Bahrain while scaling global visibility in the US market.',
  },
  {
    id: 'singapore',
    name: 'Singapore Fintech Hub',
    country: 'Singapore',
    flag: '🇸🇬',
    type: 'international_client',
    entity: 'Back for Brand LLC (USA)',
    x: 755,
    y: 290,
    services: [
      'AI Search Presence (GEO)',
      'Middle East Market Licensing Advisory',
      'High-Speed Conversion Funnels',
    ],
    metrics: '18 Regional Clients',
    turnaround: '24/7 Operations Coverage',
    leadDesc: 'Southeast Asian high-growth startups utilizing Back for Brand LLC AI infrastructure and exploring GCC expansion via Bahrain.',
  },
];

interface GlobalReachMapVisualizationProps {
  onNavigateService?: (serviceId: string) => void;
  onOpenConsultation?: () => void;
}

export const GlobalReachMapVisualization: React.FC<GlobalReachMapVisualizationProps> = ({
  onNavigateService,
  onOpenConsultation,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'usa' | 'bahrain'>('all');
  const [selectedNode, setSelectedNode] = useState<MapNode>(MAP_NODES[0]); // Default to Manama HQ

  const filteredNodes = MAP_NODES.filter((node) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'bahrain') {
      return node.type === 'local_bahrain' || node.type === 'gcc_regional';
    }
    if (selectedFilter === 'usa') {
      return node.type === 'global_tech' || node.type === 'international_client';
    }
    return true;
  });

  return (
    <div className="bg-[#0e0e16] border border-[#2a2a38] rounded-3xl p-6 sm:p-8 my-16 shadow-2xl relative overflow-hidden text-left">
      {/* Background Ambience */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#e8c872]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Header & Operational Thesis */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#2a2a38] pb-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#e8c872]" />
            <span>Dual Operational Command · Global Tech vs. Local Bahrain Gateway</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Interactive Operations Map:{' '}
            <span className="text-[#00C98D]">Global Technology</span> vs.{' '}
            <span className="text-[#e8c872]">Local Bahrain Presence</span>
          </h3>

          <p className="text-xs sm:text-sm text-[#a8a7b3] max-w-3xl mt-2 leading-relaxed">
            Experience our dual-hub operating model in real time: <strong>Back for Brand LLC (Florida, USA)</strong> engineering global AI agents, Generative Engine Optimization (GEO/AEO), and high-conversion SaaS funnels across 28+ countries, seamlessly paired with <strong>Bab Al-Khaleej (Kingdom of Bahrain)</strong> executing on-the-ground sovereign ministerial filings, investor visas, and MOIC company registrations.
          </p>
        </div>

        {/* View Mode Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#14141f] border border-[#2a2a38] rounded-2xl shrink-0 self-start lg:self-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-[#e8c872] to-[#b8893a] text-[#0a0a0f] shadow-md'
                : 'text-[#a8a7b3] hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>All Dual Operations</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedFilter('bahrain');
              setSelectedNode(MAP_NODES[0]);
            }}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFilter === 'bahrain'
                ? 'bg-[#e8c872] text-[#0a0a0f] shadow-md'
                : 'text-[#e8c872] hover:text-white'
            }`}
          >
            <span>🇧🇭 Bab Al-Khaleej (Bahrain)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedFilter('usa');
              setSelectedNode(MAP_NODES[1]);
            }}
            className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFilter === 'usa'
                ? 'bg-cyan-500 text-[#0a0a0f] shadow-md'
                : 'text-cyan-300 hover:text-white'
            }`}
          >
            <span>🇺🇸 Back for Brand (USA)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Graphic (Self-Contained SVG Topology with Fiber Arc) */}
      <div className="relative w-full aspect-[2/1] min-h-[340px] max-h-[480px] bg-[#07070c] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Subtle Grid Lat/Long Lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2a2a38_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* SVG Visualization Canvas */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain relative z-10 select-none"
        >
          <defs>
            {/* Glowing Transatlantic Gradient */}
            <linearGradient id="transatlanticGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#e8c872" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="gccGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e8c872" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e8c872" stopOpacity="0.4" />
            </linearGradient>

            {/* Hub Glow Filter */}
            <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Continents Vector Graphic (World Silhouette Outline) */}
          <g fill="#161622" stroke="#252538" strokeWidth="0.8" opacity="0.6">
            {/* North America Silhouette */}
            <path d="M140,90 Q220,70 300,100 T330,170 T280,240 T220,290 T180,250 T130,180 Z" />
            {/* South America Silhouette */}
            <path d="M280,280 Q340,300 370,360 T320,440 T280,410 T260,330 Z" />
            {/* Europe Silhouette */}
            <path d="M460,90 Q540,80 570,130 T510,180 T450,150 Z" />
            {/* Africa Silhouette */}
            <path d="M470,190 Q560,190 570,270 T540,380 T470,350 T440,260 Z" />
            {/* Asia Silhouette */}
            <path d="M570,90 Q720,70 850,130 T880,220 T780,280 T680,250 T580,200 Z" />
            {/* Middle East & Arabian Peninsula Silhouette */}
            <path d="M580,190 Q650,200 660,260 T590,265 Z" fill="#201f30" stroke="#e8c872" strokeWidth="0.8" opacity="0.75" />
            {/* Australia Silhouette */}
            <path d="M780,330 Q860,320 880,370 T820,420 T760,380 Z" />
          </g>

          {/* TRANSATLANTIC DATA BRIDGE: Florida HQ (x:255, y:228) ⇄ Bahrain HQ (x:615, y:220) */}
          {selectedFilter !== 'bahrain' && (
            <g>
              {/* Outer Glow Path */}
              <path
                d="M 255 228 Q 435 90 615 220"
                fill="none"
                stroke="url(#transatlanticGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
                opacity="0.8"
              />
              {/* High-Speed Animated Data Pulse */}
              <circle r="4" fill="#e8c872" filter="url(#glowGold)">
                <animateMotion
                  path="M 255 228 Q 435 90 615 220"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="3" fill="#06b6d4" filter="url(#glowCyan)">
                <animateMotion
                  path="M 615 220 Q 435 90 255 228"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}

          {/* Regional GCC Radiating Links (Bahrain to KSA, UAE, Qatar) */}
          {(selectedFilter === 'all' || selectedFilter === 'bahrain') && (
            <g stroke="#e8c872" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65">
              {/* Bahrain ⇄ Causeway / Khobar */}
              <line x1="615" y1="220" x2="605" y2="218" />
              {/* Bahrain ⇄ Riyadh */}
              <line x1="615" y1="220" x2="595" y2="232" />
              {/* Bahrain ⇄ Dubai */}
              <line x1="615" y1="220" x2="638" y2="232" />
            </g>
          )}

          {/* Florida Radiating Global Links */}
          {(selectedFilter === 'all' || selectedFilter === 'usa') && (
            <g stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" opacity="0.45">
              {/* Florida ⇄ Silicon Valley */}
              <line x1="255" y1="228" x2="180" y2="195" />
              {/* Florida ⇄ New York */}
              <line x1="255" y1="228" x2="285" y2="182" />
              {/* Florida ⇄ London */}
              <path d="M 255 228 Q 370 160 485 152" fill="none" />
              {/* Florida ⇄ Tokyo */}
              <path d="M 255 228 Q 540 120 825 205" fill="none" />
              {/* Florida ⇄ Singapore */}
              <path d="M 255 228 Q 505 310 755 290" fill="none" />
            </g>
          )}

          {/* RENDER ALL INTERACTIVE NODES */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isBahrainSide = node.type === 'local_bahrain' || node.type === 'gcc_regional';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                {/* Hub Radar Pulse Rings */}
                {node.isHub && (
                  <>
                    <circle
                      r="16"
                      fill="none"
                      stroke={isBahrainSide ? '#e8c872' : '#06b6d4'}
                      strokeWidth="1"
                      className="animate-ping"
                      opacity="0.3"
                    />
                    <circle
                      r="10"
                      fill="none"
                      stroke={isBahrainSide ? '#e8c872' : '#06b6d4'}
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                  </>
                )}

                {/* Node Outer Selection Ring */}
                <circle
                  r={node.isHub ? (isSelected ? '9' : '7') : isSelected ? '7' : '5'}
                  fill={isBahrainSide ? '#e8c872' : '#06b6d4'}
                  filter={node.isHub ? (isBahrainSide ? 'url(#glowGold)' : 'url(#glowCyan)') : undefined}
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Node Core Center */}
                <circle
                  r={node.isHub ? '4' : '2.5'}
                  fill="#0a0a0f"
                />

                {/* Text Label on Map */}
                <text
                  x={node.x > 750 ? -12 : 12}
                  y={node.isHub ? 4 : 3}
                  textAnchor={node.x > 750 ? 'end' : 'start'}
                  fill={isSelected ? '#ffffff' : '#a8a7b3'}
                  fontSize={node.isHub ? '11' : '9'}
                  fontFamily="sans-serif"
                  fontWeight={node.isHub ? 'bold' : 'normal'}
                  className="pointer-events-none select-none transition-colors"
                >
                  {node.flag} {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Legend Watermark Overlay */}
        <div className="absolute bottom-3 left-4 z-20 flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#a8a7b3] bg-[#0a0a0f]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#2a2a38]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e8c872] shadow-[0_0_8px_#e8c872]" />
            <span className="text-white font-bold">🇧🇭 Bab Al-Khaleej (Bahrain Sovereign HQ)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span className="text-white font-bold">🇺🇸 Back for Brand LLC (Florida Tech HQ)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#e8c872] border-t border-dashed" />
            <span>Encrypted Fiber Data Bridge (114ms)</span>
          </div>
        </div>

        {/* Top-Right Quick Interaction Hint */}
        <div className="absolute top-3 right-4 z-20 hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#777] bg-[#0a0a0f]/80 px-2.5 py-1 rounded-lg border border-[#2a2a38]">
          <Sparkles className="w-3 h-3 text-[#e8c872]" />
          <span>Click any node to inspect regional operations</span>
        </div>
      </div>

      {/* Selected Node Regional Dossier Card */}
      {selectedNode && (
        <div className="mt-6 bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 sm:p-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2a38] pb-4 mb-5">
            <div className="flex items-start gap-3.5">
              <span className="text-3xl shrink-0 p-2 rounded-2xl bg-[#0a0a0f] border border-[#2a2a38]">
                {selectedNode.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedNode.type === 'local_bahrain' || selectedNode.type === 'gcc_regional'
                        ? 'bg-[#e8c872]/15 text-[#e8c872] border-[#e8c872]/30'
                        : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {selectedNode.entity}
                  </span>
                  <span className="text-xs text-[#a8a7b3]">· {selectedNode.country}</span>
                </div>
                <h4 className="text-xl font-serif font-bold text-white mt-1">
                  {selectedNode.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-[#777] uppercase block">Regional Capacity</span>
                <span className="text-xs font-mono font-bold text-white">{selectedNode.metrics}</span>
              </div>

              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <span>Book Consultation for this Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-[#a8a7b3] leading-relaxed mb-5">
            {selectedNode.leadDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5">
              <span className="text-[10px] text-[#777] uppercase block mb-1">Turnaround / Execution Mode</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedNode.turnaround}</span>
              </span>
            </div>

            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5 md:col-span-2">
              <span className="text-[10px] text-[#777] uppercase block mb-1.5">Core Active Regional Capabilities</span>
              <ul className="space-y-1 text-[#ccc]">
                {selectedNode.services.map((srv, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8c872]" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Dual Hub Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 text-xs">
        {/* Hub A: Bab Al-Khaleej (Bahrain) */}
        <div className="bg-[#12121c] border border-[#e8c872]/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇧🇭</span>
                <strong className="font-serif font-bold text-white text-base">
                  Bab Al-Khaleej
                </strong>
              </div>
              <span className="text-[10px] font-mono text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-2 py-0.5 rounded">
                Sovereign Ministry Operations
              </span>
            </div>

            <p className="text-[#a8a7b3] text-xs leading-relaxed mb-4">
              Local incorporation and regulatory powerhouse licensed in the Kingdom of Bahrain (CR-99210-BH). Provides direct liaison with Ministry of Industry & Commerce (MOIC), LMRA expat licensing, NPRA golden residency visas, and municipal zoning clearances.
            </p>

            <div className="space-y-2 font-mono text-[11px] text-[#ccc]">
              <div className="flex items-center justify-between py-1 border-b border-[#2a2a38]">
                <span className="text-[#777]">Physical Location:</span>
                <span className="text-white font-sans">Financial Harbour Tower, Manama, Bahrain</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#2a2a38]">
                <span className="text-[#777]">Operating Days:</span>
                <span className="text-white">Sunday - Thursday (GCC Ministerial Hours)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#2a2a38]">
                <span className="text-[#777]">Government Gateways:</span>
                <span className="text-[#e8c872]">Sijilat 3.0, LMRA EMS, Bahrain Customs</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-bold">✓ 100% On-the-Ground Presence</span>
            <span className="text-[11px] text-[#777]">Bahrain Domestic & GCC</span>
          </div>
        </div>

        {/* Hub B: Back for Brand LLC (Florida, USA) */}
        <div className="bg-[#12121c] border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇺🇸</span>
                <strong className="font-serif font-bold text-white text-base">
                  Back for Brand LLC
                </strong>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                Global Technology & AI Systems
              </span>
            </div>

            <p className="text-[#a8a7b3] text-xs leading-relaxed mb-4">
              Registered Florida Limited Liability Company (USA) delivering global software architecture, Generative Engine Optimization (GEO/AEO) for ChatGPT and Perplexity, automated conversion funnels, and autonomous 25-agent corporate AI workforce management.
            </p>

            <div className="space-y-2 font-mono text-[11px] text-[#ccc]">
              <div className="flex items-center justify-between py-1 border-b border-[#2a2a38]">
                <span className="text-[#777]">US Registration:</span>
                <span className="text-white font-sans">Florida LLC (Miami / Orlando Corridor)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#2a2a38]">
                <span className="text-[#777]">Cloud Infrastructure:</span>
                <span className="text-white">Google Cloud & Gemini 3.8 / 1.5 Pro</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#2a2a38]">
                <span className="text-[#777]">Global Reach:</span>
                <span className="text-cyan-300">28+ Countries (North America, Europe, Asia)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
            <span className="text-[11px] text-cyan-400 font-bold">✓ 24/7 Autonomous AI Fleet</span>
            <span className="text-[11px] text-[#777]">Worldwide International Scope</span>
          </div>
        </div>
      </div>
    </div>
  );
};
