export interface AgentSquadItem {
  id: string;
  number: number;
  name: string;
  codeName: string;
  squad:
    | 'Executive & Strategy'
    | 'SEO, AEO & Local GMB'
    | 'Paid Ads & Traffic'
    | 'Social Media & Content'
    | 'Funnels & Lead Conversion'
    | 'Payments & Collections'
    | 'Operations & Government';
  description: string;
  model: 'gemini-3.8-live' | 'gemini-3.8-flash';
  status: 'active' | 'standby';
  channels: string[];
  capabilities: string[];
  defaultPrompt: string;
  embedSlug: string;
  tasksCompleted: number;
  successRate: number;
}

export const AGENTS_ARMY_25: AgentSquadItem[] = [
  // Squad 1: Executive & Strategy
  {
    id: 'agent-01',
    number: 1,
    name: 'Ghazi Executive Digital Twin',
    codeName: 'APEX-CLOSER',
    squad: 'Executive & Strategy',
    description: 'Direct conversational voice and text closer representing CEO Ghazi Wazir in 1-on-1 consultations.',
    model: 'gemini-3.8-live',
    status: 'active',
    channels: ['Live Audio Voice', 'Web Portal', 'WhatsApp Escalations'],
    capabilities: ['Real-Time Voice Streaming', 'Objection Handling', 'Retainer Commitment Closing'],
    defaultPrompt: 'Greet a foreign tech founder asking whether Bahrain allows 100% foreign ownership for their software company.',
    embedSlug: 'ghazi-voice-twin',
    tasksCompleted: 412,
    successRate: 98.6,
  },
  {
    id: 'agent-02',
    number: 2,
    name: 'Business Model & Retainer Architect',
    codeName: 'VALUE-MAX',
    squad: 'Executive & Strategy',
    description: 'Structures pricing proposals, commercial setup retainers, and high-ticket enterprise contracts.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Proposals', 'Client Dossiers', 'Email Quotes'],
    capabilities: ['Scope Value Stacking', 'GCC Tiered Retainers', 'Contract Scope Guardrails'],
    defaultPrompt: 'Create a 3-tier proposal for a London fintech expanding to Bahrain (Starter CR, Full Turnkey W.L.L., Enterprise Growth).',
    embedSlug: 'proposal-architect',
    tasksCompleted: 184,
    successRate: 99.1,
  },

  // Squad 2: SEO, AEO & Local GMB
  {
    id: 'agent-03',
    number: 3,
    name: 'Organic SEO Keyword & Pillar Strategist',
    codeName: 'RANK-MASTER',
    squad: 'SEO, AEO & Local GMB',
    description: 'Extracts high-intent commercial keywords and designs topical authority clusters for Google SERP dominance.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Google SERP', 'Search Console', 'Ahrefs Clusters'],
    capabilities: ['Keyword Clustering', 'Search Intent Mapping', 'Bahrain Business Formation SERP'],
    defaultPrompt: 'List top 10 commercial-intent keyword clusters for "business setup in Bahrain 100% foreign ownership" with search intent.',
    embedSlug: 'seo-pillar-ranker',
    tasksCompleted: 520,
    successRate: 99.4,
  },
  {
    id: 'agent-04',
    number: 4,
    name: 'AEO & GEO Answer Engine Optimizer',
    codeName: 'PERPLEXITY-AI',
    squad: 'SEO, AEO & Local GMB',
    description: 'Optimizes website citations and data structures so ChatGPT, Perplexity, and Gemini quote Ghazi Wazir as the authority.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['ChatGPT Citations', 'Perplexity Pro', 'Gemini Overviews'],
    capabilities: ['Generative Engine Optimization', 'Direct Answer Snippets', 'Knowledge Grounding'],
    defaultPrompt: 'Format an authoritative 150-word answer snippet that ChatGPT and Perplexity will cite when users ask "How to register a company in Bahrain".',
    embedSlug: 'aeo-geo-optimizer',
    tasksCompleted: 395,
    successRate: 99.8,
  },
  {
    id: 'agent-05',
    number: 5,
    name: 'Google Business Profile (GMB) & Local Maps Agent',
    codeName: 'LOCAL-DOMINANCE',
    squad: 'SEO, AEO & Local GMB',
    description: 'Manages Google Maps rankings, local SEO citations, weekly GMB posts, and review response triggers across GCC.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Google Maps', 'Google Business Profile', 'Local Pack'],
    capabilities: ['Manama Geo-Citations', 'Weekly GMB Updates', '5-Star Review SEO Optimization'],
    defaultPrompt: 'Draft 3 Google Business Profile posts highlighting fast W.L.L. commercial registration in Bahrain with call to action.',
    embedSlug: 'gmb-local-pack',
    tasksCompleted: 260,
    successRate: 98.9,
  },
  {
    id: 'agent-06',
    number: 6,
    name: 'Technical SEO & JSON-LD Schema Auditor',
    codeName: 'SCHEMA-SENTINEL',
    squad: 'SEO, AEO & Local GMB',
    description: 'Audits Core Web Vitals, validates Schema.org JSON-LD microdata, OpenGraph tags, and mobile indexing.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Schema.org', 'Lighthouse Audit', 'Robots/Sitemaps'],
    capabilities: ['Structured Data Generation', 'Rich Snippet Validation', 'Speed Optimization Checks'],
    defaultPrompt: 'Generate a complete Schema.org JSON-LD snippet for Ghazi Wazir as CEO of Back for Brand and Bab Al-Khaleej.',
    embedSlug: 'technical-schema-auditor',
    tasksCompleted: 310,
    successRate: 100.0,
  },

  // Squad 3: Paid Ads & Traffic
  {
    id: 'agent-07',
    number: 7,
    name: 'Meta Ads Creative & High-ROAS Copywriter',
    codeName: 'META-SCALE',
    squad: 'Paid Ads & Traffic',
    description: 'Crafts high-converting direct-response hooks, primary text, and carousel copy for Facebook & Instagram GCC founders.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Facebook Ads', 'Instagram Sponsored', 'Meta Advantage+'],
    capabilities: ['High-ROAS Direct Response', 'Founder Problem-Agitate-Solve', 'GCC Expat Angle Targeting'],
    defaultPrompt: 'Write 3 high-converting Meta Ads copy angles targeting foreign tech founders looking to relocate or incorporate in Bahrain.',
    embedSlug: 'meta-ads-copywriter',
    tasksCompleted: 640,
    successRate: 97.8,
  },
  {
    id: 'agent-08',
    number: 8,
    name: 'Google Search & Performance Max Specialist',
    codeName: 'PMAX-ALPHA',
    squad: 'Paid Ads & Traffic',
    description: 'Engineers high-intent Google Search ad headlines, descriptions, callouts, and negative keyword filtering.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Google Search Ads', 'Performance Max', 'YouTube In-Feed'],
    capabilities: ['High-CTR Headline Matrix', 'Negative Keyword Shielding', 'Target CPA Bid Strategy'],
    defaultPrompt: 'Generate 15 responsive search ad headlines (under 30 chars each) and 4 descriptions for Bahrain Commercial Registration.',
    embedSlug: 'google-ads-specialist',
    tasksCompleted: 430,
    successRate: 98.4,
  },
  {
    id: 'agent-09',
    number: 9,
    name: 'TikTok, Reels & Shorts Viral Script Agent',
    codeName: 'VIRAL-REEL',
    squad: 'Paid Ads & Traffic',
    description: 'Writes 30-to-60 second visual scripts with retention hooks, on-screen text cues, and clear consultation calls-to-action.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    capabilities: ['Pattern Interrupt Hooks', 'Visual B-Roll Prompts', '60-Second Regulatory Breakdowns'],
    defaultPrompt: 'Write a 45-second TikTok/Reels script: "3 huge business tax mistakes foreign entrepreneurs make before moving to Bahrain".',
    embedSlug: 'viral-video-scripts',
    tasksCompleted: 580,
    successRate: 99.0,
  },
  {
    id: 'agent-10',
    number: 10,
    name: 'YouTube Authority & VSL Video Scriptwriter',
    codeName: 'YOUTUBE-AUTHORITY',
    squad: 'Paid Ads & Traffic',
    description: 'Scripts 10-15 minute long-form authority deep dives, step-by-step masterclasses, and video case studies.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['YouTube Long-Form', 'VSL Video', 'Webinar Presentations'],
    capabilities: ['Story Arc & Case Study Structure', 'Visual Timestamp Pacing', 'Retainer Pitch Transitions'],
    defaultPrompt: 'Outline a 10-minute authority YouTube video: "The Complete Step-by-Step Guide to Bahrain Commercial Registration in 2026".',
    embedSlug: 'youtube-scriptwriter',
    tasksCompleted: 195,
    successRate: 99.2,
  },

  // Squad 4: Social Media & Content
  {
    id: 'agent-11',
    number: 11,
    name: 'LinkedIn Executive Thought Leadership Ghostwriter',
    codeName: 'LINKEDIN-CEO',
    squad: 'Social Media & Content',
    description: 'Crafts high-impact executive posts, contrarian founder insights, and Gulf business case studies for Ghazi Wazir.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['LinkedIn Feed', 'LinkedIn Articles', 'Executive DMs'],
    capabilities: ['C-Suite Authority Voice', 'Formatting & Line Breaks', 'GCC Business Case Studies'],
    defaultPrompt: 'Write a compelling LinkedIn post by CEO Ghazi Wazir explaining why Bahrain is outperforming other GCC hubs for tech startups.',
    embedSlug: 'linkedin-ghostwriter',
    tasksCompleted: 710,
    successRate: 99.5,
  },
  {
    id: 'agent-12',
    number: 12,
    name: 'X (Twitter) & Threads Multi-Post Ghostwriter',
    codeName: 'THREAD-SURGE',
    squad: 'Social Media & Content',
    description: 'Writes punchy single tweets, viral 7-tweet educational threads, and real-time commentary on Gulf market shifts.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['X (Twitter)', 'Threads', 'Bluesky'],
    capabilities: ['Viral Thread Hooks', 'Data-Dense Bullet Formatting', 'Call to Action Retainer Linking'],
    defaultPrompt: 'Write a 6-part viral X (Twitter) thread on: "How we register companies in Bahrain with 100% foreign ownership in 5-7 days".',
    embedSlug: 'x-threads-writer',
    tasksCompleted: 850,
    successRate: 99.1,
  },
  {
    id: 'agent-13',
    number: 13,
    name: 'Medium, Press Release & Industry Guide Writer',
    codeName: 'PR-WIRE',
    squad: 'Social Media & Content',
    description: 'Generates publication-ready articles, regulatory whitepapers, and syndicated PR news releases.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Medium', 'Press Releases', 'Substack'],
    capabilities: ['Journalistic Tone', 'AP Style PR Formatting', 'Authoritative Regulatory Citations'],
    defaultPrompt: 'Draft an official corporate press release announcing Bab Al-Khaleej expanding expedited W.L.L. registration for European AI companies.',
    embedSlug: 'pr-wire-writer',
    tasksCompleted: 240,
    successRate: 99.6,
  },
  {
    id: 'agent-14',
    number: 14,
    name: 'Email Newsletter & Client Onboarding Drip Agent',
    codeName: 'DRIP-NURTURE',
    squad: 'Social Media & Content',
    description: 'Builds automated email nurture sequences that educate prospects, build trust, and schedule discovery calls.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Resend', 'SendGrid', 'Klaviyo / ActiveCampaign'],
    capabilities: ['5-Part Drip Sequence', 'High Open-Rate Subject Lines', 'Automated Appointment Triggers'],
    defaultPrompt: 'Write Email 1 & Email 2 of a 5-day welcome sequence for founders who downloaded the Bahrain Corporate Setup Guide.',
    embedSlug: 'email-drip-architect',
    tasksCompleted: 490,
    successRate: 98.7,
  },

  // Squad 5: Funnels & Lead Conversion
  {
    id: 'agent-15',
    number: 15,
    name: 'High-Converting VSL & Funnel Copywriter',
    codeName: 'FUNNEL-CONVERT',
    squad: 'Funnels & Lead Conversion',
    description: 'Writes captivating landing page headlines, subheads, bullet benefits, and video sales letter scripts that convert traffic.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['VSL Landing Pages', 'Website Funnels', 'Hero Sections'],
    capabilities: ['Conversion Rate Optimization', 'Objection Inoculation', 'Urgency & Scarcity Frameworks'],
    defaultPrompt: 'Write high-converting hero section copy (headline, subhead, 3 bullet proofs, CTA) for a Bahrain corporate setup landing page.',
    embedSlug: 'vsl-funnel-copywriter',
    tasksCompleted: 360,
    successRate: 99.3,
  },
  {
    id: 'agent-16',
    number: 16,
    name: 'Lead Scoring & Enterprise Qualification Agent',
    codeName: 'LEAD-SCORE-AI',
    squad: 'Funnels & Lead Conversion',
    description: 'Evaluates incoming form submissions, calculates lead temperature (Cold/Warm/Hot), and flags high-budget founders.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['CRM Pipeline', 'Intake Forms', 'Admin Alerts'],
    capabilities: ['Budget & Timeline Scoring', 'Tire-Kicker Elimination', 'Priority Slack/WhatsApp Alerts'],
    defaultPrompt: 'Evaluate a lead: "Founder from Germany, 5 employees, budget $12,000, wants company setup & visas in 30 days". Provide score and next step.',
    embedSlug: 'lead-scoring-agent',
    tasksCompleted: 920,
    successRate: 99.9,
  },
  {
    id: 'agent-17',
    number: 17,
    name: 'WhatsApp 24/7 Concierge & Multi-Language Responder',
    codeName: 'WHATSAPP-DISPATCH',
    squad: 'Funnels & Lead Conversion',
    description: 'Instantly responds to incoming WhatsApp inquiries in English, Arabic, or Urdu, qualifies intent, and sends booking links.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['WhatsApp Cloud API', 'Direct Chat', 'SMS'],
    capabilities: ['Sub-3-Second Response', 'Arabic / English Fluency', 'Auto Meeting Link Dispatch'],
    defaultPrompt: 'Write an instant polite WhatsApp reply to a client asking in Arabic about commercial registration fees and visa requirements.',
    embedSlug: 'whatsapp-concierge',
    tasksCompleted: 1450,
    successRate: 99.7,
  },
  {
    id: 'agent-18',
    number: 18,
    name: 'Calendar & Strategy Call Booking Coordinator',
    codeName: 'BOOKING-PILOT',
    squad: 'Funnels & Lead Conversion',
    description: 'Manages appointment availability, handles timezone conversions, and sends automated SMS/email reminders to prevent no-shows.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Google Calendar', 'Meet Invites', 'SMS Reminders'],
    capabilities: ['Timezone Normalization', 'No-Show Reduction Logic', 'Pre-Meeting Homework Links'],
    defaultPrompt: 'Draft an automated confirmation & pre-meeting preparation reminder for a client booking a 20-minute consultation with Ghazi Wazir.',
    embedSlug: 'booking-coordinator',
    tasksCompleted: 610,
    successRate: 99.4,
  },

  // Squad 6: Payments & Collections
  {
    id: 'agent-19',
    number: 19,
    name: 'Retainer & Invoicing Dispatch Agent',
    codeName: 'PAY-DISPATCH',
    squad: 'Payments & Collections',
    description: 'Generates secure payment dispatches for BenefitPay, Fawri+, Stripe, and Bank Wire transfers with dual Bahrain/US entity details.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['BenefitPay', 'Fawri+', 'Stripe Checkout', 'Bank Wire'],
    capabilities: ['Multi-Gateway Invoicing', 'WhatsApp Payment Links', 'VAT & Corporate Entity Routing'],
    defaultPrompt: 'Generate a complete payment dispatch text for a client paying a BHD 450 (or $1,200) retainer for W.L.L. commercial registration.',
    embedSlug: 'payment-dispatch-agent',
    tasksCompleted: 380,
    successRate: 100.0,
  },
  {
    id: 'agent-20',
    number: 20,
    name: 'Payment Recovery & Dunning Collection Agent',
    codeName: 'DUNNING-GUARD',
    squad: 'Payments & Collections',
    description: 'Monitors pending invoice milestones, tracks due dates, and sends diplomatic, executive payment follow-ups.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['WhatsApp Invoicing', 'Email Statements', 'Accounting CRM'],
    capabilities: ['Diplomatic Follow-Up Cadence', 'Escrow Status Verification', 'Receipt Generation'],
    defaultPrompt: 'Write a courteous yet firm milestone follow-up for a BHD 350 final balance due upon Sijilat registration approval.',
    embedSlug: 'payment-recovery-agent',
    tasksCompleted: 140,
    successRate: 97.5,
  },

  // Squad 7: Operations & Government
  {
    id: 'agent-21',
    number: 21,
    name: 'MOIC Sijilat Government Compliance Specialist',
    codeName: 'SIJILAT-VERIFIER',
    squad: 'Operations & Government',
    description: 'Selects compliant ISIC4 commercial activity codes, verifies capital requirements, and prepares commercial registration dossiers.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['MOIC Sijilat Portal', 'Ministry Records', 'Municipality Zoning'],
    capabilities: ['ISIC4 Activity Mapping', 'Zoning Clearance Rules', '100% Foreign Ownership Eligibility'],
    defaultPrompt: 'Identify the exact ISIC4 activity codes and approvals needed for an AI software and marketing agency in Bahrain.',
    embedSlug: 'moic-sijilat-compliance',
    tasksCompleted: 290,
    successRate: 99.8,
  },
  {
    id: 'agent-22',
    number: 22,
    name: 'LMRA Investor Visa & Expat Quota Strategist',
    codeName: 'LMRA-NAVIGATOR',
    squad: 'Operations & Government',
    description: 'Calculates Bahrainisation ratios, prepares investor Golden residency documentation, and tracks LMRA expat visa quotas.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['LMRA EMS Portal', 'NPRA Residency', 'Immigration Filing'],
    capabilities: ['Investor Residency Rules', 'Expat Quota Math', 'Biometrics & Medical Logistics'],
    defaultPrompt: 'Explain the exact requirements, documents, and medical check steps for a foreign investor obtaining a 10-year residency visa in Bahrain.',
    embedSlug: 'lmra-visa-strategist',
    tasksCompleted: 330,
    successRate: 99.6,
  },
  {
    id: 'agent-23',
    number: 23,
    name: 'Client Onboarding & KYC Document Collector',
    codeName: 'KYC-SHIELD',
    squad: 'Operations & Government',
    description: 'Automates client document collection (passport scans, board resolutions, lease contracts) and validates photo resolution.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Client Portal', 'Upload Webhooks', 'Compliance Vault'],
    capabilities: ['Document Resolution Check', 'Sanctions / PEP Screening Advice', 'Missing Document Chasers'],
    defaultPrompt: 'Generate a clean, professional checklist of all personal and corporate documents required to start a Bahrain W.L.L. company today.',
    embedSlug: 'kyc-collector-agent',
    tasksCompleted: 450,
    successRate: 100.0,
  },
  {
    id: 'agent-24',
    number: 24,
    name: 'Legal Disclaimers & Governance Auditor',
    codeName: 'LEGAL-GOVERNOR',
    squad: 'Operations & Government',
    description: 'Ensures all website funnels, ads, and customer contracts display appropriate Bahrain & US entity disclaimers without overpromising.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Website Footers', 'Sales Contracts', 'Terms of Service'],
    capabilities: ['Regulatory Disclaimer Audits', 'Bahrain Commercial Law Decree 27/2015', 'Florida LLC Protections'],
    defaultPrompt: 'Review our marketing copy and draft a bulletproof legal disclaimer for ministerial decisions and government approvals.',
    embedSlug: 'legal-governor-agent',
    tasksCompleted: 210,
    successRate: 100.0,
  },
  {
    id: 'agent-25',
    number: 25,
    name: 'Post-Sale Retention & 5-Star Review Harvester',
    codeName: 'REPUTATION-MAX',
    squad: 'Operations & Government',
    description: 'Follows up post-handover to ensure client delight and automatically requests 5-star reviews on Google Business, Clutch, and Trustpilot.',
    model: 'gemini-3.8-flash',
    status: 'active',
    channels: ['Google Business Reviews', 'Clutch.co', 'Trustpilot', 'WhatsApp'],
    capabilities: ['Delight Timing Triggers', 'Frictionless Review Link Dispatch', 'Referral Commission Invitations'],
    defaultPrompt: 'Write a warm, celebratory WhatsApp message to a client whose CR just got approved, inviting them to leave a 5-star Google review.',
    embedSlug: 'review-harvester-agent',
    tasksCompleted: 530,
    successRate: 98.9,
  },
];

const STORAGE_KEY = 'gw_agents_army_settings';

export const getStoredAgentsArmy = (): AgentSquadItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 25) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[AgentsStore] Read error:', e);
  }
  return AGENTS_ARMY_25;
};

export const saveAgentsArmy = (agents: AgentSquadItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
    window.dispatchEvent(new CustomEvent('gw_agents_army_updated', { detail: agents }));
  } catch (e) {
    console.warn('[AgentsStore] Save error:', e);
  }
};

export const resetAgentsArmy = (): AgentSquadItem[] => {
  saveAgentsArmy(AGENTS_ARMY_25);
  return AGENTS_ARMY_25;
};
