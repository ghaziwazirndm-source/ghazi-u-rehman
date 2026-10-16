import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  ShieldCheck,
  AlertCircle,
  Share2,
  ArrowRight,
  Sparkles,
  Download,
  Check,
  RotateCcw,
  Landmark,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { GHAZI_INFO } from '../data/content';
import { generateBahrainRoadmapPdf } from '../utils/roadmapPdfGenerator';

export type EntityType = 'wll' | 'spc' | 'sole' | 'branch';
export type ActivityType = 'standard' | 'regulated' | 'industrial';

import { MilestoneDocRequirement, MilestoneDocumentationModal } from './MilestoneDocumentationModal';

export interface Milestone extends MilestoneDocRequirement {
  startDay?: number;
  endDay?: number;
  isCompleted?: boolean;
}

export const MILESTONES: Milestone[] = [
  // Phase 1: Document Submission
  {
    id: 'm1_name_reservation',
    stepNumber: 1,
    phase: 'submission',
    phaseTitle: 'Phase 1: Document Submission & Filings',
    title: 'Commercial Name Reservation & Activity Code Selection',
    authority: 'MOIC (Ministry of Industry & Commerce · Sijilat 3.0)',
    authorityBadge: 'MOIC / Sijilat',
    baseDays: 1,
    description: 'Filing 3 proposed commercial trade names in Arabic and English, plus matching primary and secondary ISIC-4 commercial business activity codes.',
    requiredDocuments: [
      '3 Proposed Trade Names (Arabic & English translation)',
      'Primary Business Activity Description & Business Model Summary',
      'Passport copies of all shareholders and prospective managers'
    ],
    babAlKhaleejRole: 'Pre-screens names against MOIC trademark databases to avoid rejections; maps exact ISIC activity codes to optimize capital and licensing requirements.',
    proTip: 'Providing 3 distinct name choices avoids delays if the primary choice has phonetic conflict with an existing trademark in the GCC.',
    isCriticalPath: true
  },
  {
    id: 'm2_dossier_assembly',
    stepNumber: 2,
    phase: 'submission',
    phaseTitle: 'Phase 1: Document Submission & Filings',
    title: 'Constitutive Dossier Assembly & Identity Verification',
    authority: 'Information & eGovernment Authority (iGA) / MOIC',
    authorityBadge: 'iGA / eKey',
    baseDays: 1,
    description: 'Preparation of the draft Memorandum of Association (MOA), shareholder resolution, power of attorney (POA), and biometric eKey account activation for foreign or resident directors.',
    requiredDocuments: [
      'Passport copies with valid GCC entry stamp or Bahrain CPR',
      'Power of Attorney (POA) for Bab Al-Khaleej legal representation',
      'Proof of address (utility bill or bank statement within 90 days)',
      'Draft Articles of Association / MOA tailored to equity splits'
    ],
    babAlKhaleejRole: 'Drafts bespoke MOA clauses guaranteeing 100% foreign ownership control, dividend repatriation rights, and management voting thresholds.',
    proTip: 'All non-GCC corporate parent documents require apostille or Bahrain Embassy attestation in the home jurisdiction prior to final filing.'
  },

  // Phase 2: Government Review
  {
    id: 'm3_sijilat_review',
    stepNumber: 3,
    phase: 'review',
    phaseTitle: 'Phase 2: Government Review & Clearance',
    title: 'MOIC Security & Compliance Review (Initial Approval)',
    authority: 'MOIC Commercial Registration Directorate',
    authorityBadge: 'MOIC Directorate',
    baseDays: 2,
    description: 'Official screening of share capital structure, ultimate beneficial owners (UBO), and anti-money laundering (AML) compliance in the central Sijilat system.',
    requiredDocuments: [
      'Completed Sijilat 3.0 Electronic Application',
      'Ultimate Beneficial Owner (UBO) declaration form',
      'Auditor consent letter from a Bahrain-licensed audit firm'
    ],
    babAlKhaleejRole: 'Liaises directly with MOIC case officers to expedite file queuing and handle any query notifications within 2 business hours.',
    proTip: 'Preliminary approval locks in your company registration number (CR Number) while secondary clearances proceed.',
    isCriticalPath: true
  },
  {
    id: 'm4_ministry_approvals',
    stepNumber: 4,
    phase: 'review',
    phaseTitle: 'Phase 2: Government Review & Clearance',
    title: 'External Ministry Clearance & Municipal Zoning',
    authority: 'Ministry of Municipalities / Special Regulatory Agencies',
    authorityBadge: 'Inter-Agency',
    baseDays: 2,
    description: 'Statutory approvals from external regulatory bodies depending on chosen business activities (e.g., NHRA for medical, CBB for fintech, BTEA for tourism, Municipality for physical site approval).',
    requiredDocuments: [
      'Proposed commercial address lease (Tawtheeq registered) or Incubator Agreement',
      'Ministry-specific technical dossier or director qualification certificates',
      'Civil Defence & Environmental assessment (if industrial or F&B)'
    ],
    babAlKhaleejRole: 'Provides approved commercial virtual incubator addresses or coordinates commercial lease inspection clearances.',
    proTip: 'Choosing standard consulting, management, or software activities bypasses heavy technical ministry scrutiny and completes within 24 hours.'
  },
  {
    id: 'm5_electronic_notary',
    stepNumber: 5,
    phase: 'review',
    phaseTitle: 'Phase 2: Government Review & Clearance',
    title: 'Ministry of Justice Electronic MOA Notarization',
    authority: 'Ministry of Justice, Islamic Affairs and Waqf (MOJ)',
    authorityBadge: 'Ministry of Justice',
    baseDays: 1,
    description: 'Formal authentication and signing of the company Memorandum of Association through the Ministry of Justice Private Notary portal.',
    requiredDocuments: [
      'Approved MOA text verified by MOIC',
      'Signatory CPR or eKey electronic signing authentication',
      'Legal representative authorized POA'
    ],
    babAlKhaleejRole: 'Signs as your authorized legal proxy before the Bahrain Notary Public, eliminating the requirement for overseas founders to travel during formation.',
    proTip: 'Digital notarization in Bahrain is fully recognized across the GCC and internationally under the Hague Apostille convention.'
  },

  // Phase 3: Final Approval
  {
    id: 'm6_cr_issuance',
    stepNumber: 6,
    phase: 'approval',
    phaseTitle: 'Phase 3: Final Approval & Registration Issuance',
    title: 'Final Commercial Registration (CR) Certificate Issuance',
    authority: 'Kingdom of Bahrain · Ministry of Industry & Commerce',
    authorityBadge: 'Official CR Active',
    baseDays: 1,
    description: 'Issuance of the official Commercial Registration Certificate (CR Extracts) granting full legal personality to conduct trade and sign commercial contracts.',
    requiredDocuments: [
      'Settled MOIC statutory fee payment receipt',
      'Notarized MOA certificate reference',
      'Municipality registration reference'
    ],
    babAlKhaleejRole: 'Obtains official bilingual gold-stamped electronic CR certificates, extracts with QR validation, and business activity permits.',
    proTip: 'Your active CR is instantly verifiable online by banks, suppliers, and government portals via the national Sijilat QR code.',
    isCriticalPath: true
  },
  {
    id: 'm7_bcci_membership',
    stepNumber: 7,
    phase: 'approval',
    phaseTitle: 'Phase 3: Final Approval & Registration Issuance',
    title: 'Bahrain Chamber of Commerce & Industry (BCCI) Enrollment',
    authority: 'Bahrain Chamber of Commerce & Industry (BCCI)',
    authorityBadge: 'BCCI Chamber',
    baseDays: 1,
    description: 'Automatic linkage and registration with the Bahrain Chamber of Commerce, granting access to GCC trade delegations, certificates of origin, and international business networks.',
    requiredDocuments: [
      'Active Bahrain CR Certificate',
      'Authorized signatory card',
      'BCCI annual membership settlement'
    ],
    babAlKhaleejRole: 'Finalizes the chamber registration record and issues official membership certification for corporate tender eligibility.',
    proTip: 'BCCI membership allows your entity to participate in bilateral trade missions and export across Saudi Arabia, UAE, Kuwait, Oman, and Qatar.'
  },

  // Phase 4: Operational Activation
  {
    id: 'm8_lmra_file',
    stepNumber: 8,
    phase: 'activation',
    phaseTitle: 'Phase 4: Post-Approval Operational Activation',
    title: 'LMRA Employer File & Visa Work Permit Quota Allocation',
    authority: 'Labour Market Regulatory Authority (LMRA)',
    authorityBadge: 'LMRA Portal',
    baseDays: 2,
    description: 'Opening the enterprise file at the Labour Market Regulatory Authority to authorize investor visa residency and staff work permits.',
    requiredDocuments: [
      'Active CR Copy and BCCI Certificate',
      'Commercial Lease Agreement with Municipal Certificate',
      'Enterprise Responsible Person Nomination Form'
    ],
    babAlKhaleejRole: 'Submits the employer enrollment file and coordinates work permit quota (Bahrainisation tier calculator) to maximize eligible visas.',
    proTip: 'Investor residence permits enjoy fast-track VIP appointments at the Expatriate Services Centre for medical screening and CPR collection.'
  },
  {
    id: 'm9_corporate_bank',
    stepNumber: 9,
    phase: 'activation',
    phaseTitle: 'Phase 4: Post-Approval Operational Activation',
    title: 'Corporate Bank Account Opening & Capital Deposit',
    authority: 'Bahrain Commercial Banking Sector (NBB, BBK, ila, AUB, etc.)',
    authorityBadge: 'Banking Sector',
    baseDays: 3,
    description: 'In-person or remote video KYC onboarding for multicurrency corporate bank account (BHD, USD, EUR, SAR) and capital deposit verification.',
    requiredDocuments: [
      'Complete CR Dossier, Notarized MOA, and Chamber Certificate',
      'Shareholder source of funds & 6-month personal or company bank statements',
      'Company profile, invoices/contracts, and client list'
    ],
    babAlKhaleejRole: 'Provides warm introductions to dedicated corporate relationship managers across tier-1 Bahraini banks and digital corporate banking providers.',
    proTip: 'Digital banks like ila Bank and ABC offer accelerated account opening within 3-5 days when supported by a vetted consultancy introduction.',
    isCriticalPath: true
  }
];

export interface BahrainRegistrationRoadmapProps {
  onBookConsultation?: () => void;
  serviceTitle?: string;
  onSelectMilestoneDocs?: (milestone: Milestone) => void;
}

export const BahrainRegistrationRoadmap: React.FC<BahrainRegistrationRoadmapProps> = ({
  onBookConsultation,
  serviceTitle = 'Business Registration',
  onSelectMilestoneDocs,
}) => {
  // State for interactive configuration
  const [entityType, setEntityType] = useState<EntityType>('wll');
  const [activityType, setActivityType] = useState<ActivityType>('standard');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('m1_name_reservation');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    m1_name_reservation: true // defaulted first step as demo preview
  });
  const [startDateStr, setStartDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [internalModalMilestone, setInternalModalMilestone] = useState<Milestone | null>(null);

  const handleOpenMilestoneDocs = (milestone: Milestone) => {
    if (onSelectMilestoneDocs) {
      onSelectMilestoneDocs(milestone);
    } else {
      setInternalModalMilestone(milestone);
      setInternalModalOpen(true);
    }
  };

  // Multiplier for duration based on entity & activity
  const durationMultiplier = useMemo(() => {
    let factor = 1.0;
    if (entityType === 'spc') factor = 0.9;
    if (entityType === 'sole') factor = 0.75;
    if (entityType === 'branch') factor = 1.35;

    if (activityType === 'regulated') factor *= 1.45;
    if (activityType === 'industrial') factor *= 1.6;

    return factor;
  }, [entityType, activityType]);

  // Calculate milestones with adjusted days and projected dates
  const calculatedMilestones = useMemo(() => {
    let accumulatedDays = 0;
    const start = new Date(startDateStr);

    return MILESTONES.map((m) => {
      let days = Math.round(m.baseDays * durationMultiplier);
      if (days < 1) days = 1;

      // Adjust for regulated activity on external ministry phase
      if (activityType === 'regulated' && m.id === 'm4_ministry_approvals') {
        days = Math.max(days, 5);
      } else if (activityType === 'industrial' && m.id === 'm4_ministry_approvals') {
        days = Math.max(days, 7);
      }

      const milestoneStartDay = accumulatedDays;
      accumulatedDays += days;
      const milestoneEndDay = accumulatedDays;

      // Calculate working date (skipping Friday/Saturday weekend in Bahrain)
      const targetDate = addWorkingDays(start, milestoneEndDay);

      return {
        ...m,
        calculatedDays: days,
        startDay: milestoneStartDay,
        endDay: milestoneEndDay,
        targetDateFormatted: targetDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        isCompleted: !!completedSteps[m.id]
      };
    });
  }, [startDateStr, durationMultiplier, activityType, completedSteps]);

  // Overall total estimated working days
  const totalWorkingDays = useMemo(() => {
    if (calculatedMilestones.length === 0) return 7;
    return calculatedMilestones[calculatedMilestones.length - 1].endDay;
  }, [calculatedMilestones]);

  const targetCompletionDate = useMemo(() => {
    const start = new Date(startDateStr);
    const end = addWorkingDays(start, totalWorkingDays);
    return end.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [startDateStr, totalWorkingDays]);

  // Currently active milestone object
  const activeMilestone = useMemo(() => {
    return (
      calculatedMilestones.find((m) => m.id === selectedMilestoneId) ||
      calculatedMilestones[0]
    );
  }, [calculatedMilestones, selectedMilestoneId]);

  // Progress metrics
  const completedCount = useMemo(() => {
    return Object.values(completedSteps).filter(Boolean).length;
  }, [completedSteps]);

  const progressPercentage = useMemo(() => {
    return Math.round((completedCount / MILESTONES.length) * 100);
  }, [completedCount]);

  // Toggle milestone completion
  const toggleMilestone = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSimulateAll = (complete: boolean) => {
    if (complete) {
      const all: Record<string, boolean> = {};
      MILESTONES.forEach((m) => {
        all[m.id] = true;
      });
      setCompletedSteps(all);
    } else {
      setCompletedSteps({});
    }
  };

  // Helper to construct WhatsApp message
  const whatsappUrl = useMemo(() => {
    const entityLabel =
      entityType === 'wll'
        ? 'W.L.L. Company'
        : entityType === 'spc'
        ? 'Single Person Company'
        : entityType === 'sole'
        ? 'Individual Establishment'
        : 'Foreign Branch';

    const text = `Hello Ghazi, I evaluated the Bahrain Company Registration Roadmap on your platform:\n• Entity: ${entityLabel}\n• Activity: ${activityType}\n• Estimated Timeline: ${totalWorkingDays} working days (Target: ${targetCompletionDate})\n• Current Phase: Step ${activeMilestone.stepNumber} (${activeMilestone.title})\nI would like to start the registration process with Bab Al-Khaleej.`;
    return `https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [entityType, activityType, totalWorkingDays, targetCompletionDate, activeMilestone]);

  const copyRoadmapSummary = () => {
    const text = `Bahrain Company Registration Timeline Plan:\nEntity: ${entityType.toUpperCase()}\nEstimated Timeline: ${totalWorkingDays} working days\nTarget Completion: ${targetCompletionDate}\n\nMilestones:\n${calculatedMilestones
      .map(
        (m) =>
          `[${m.stepNumber}] ${m.title} (${m.calculatedDays}d, Target: ${m.targetDateFormatted})`
      )
      .join('\n')}\n\nManaged by Bab Al-Khaleej (Ghazi Wazir).`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const ok = generateBahrainRoadmapPdf({
        entityType,
        activityType,
        totalWorkingDays,
        startDateStr,
        targetCompletionDate,
        milestones: calculatedMilestones,
        serviceTitle,
      });
      if (ok) {
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to generate roadmap PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#14141f] via-[#101018] to-[#0c0c12] border-2 border-[#e8c872]/30 rounded-3xl p-5 sm:p-8 my-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient gold aura */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#e8c872]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Badges */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2a2a3a]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#e8c872]/15 text-[#e8c872] border border-[#e8c872]/30 flex items-center gap-1.5 shadow-sm">
              <span>🇧🇭</span> Sijilat 3.0 Project Roadmap
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ⚡ Fast-Track Pipeline
            </span>
            <span className="text-[11px] text-[#a8a7b3]">
              100% Foreign Ownership Eligible
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Bahrain Company Registration Timeline
          </h2>
          <p className="text-xs sm:text-sm text-[#a8a7b3] mt-1 max-w-2xl leading-relaxed">
            Dynamic milestone tracking from document preparation through government inter-agency clearance to final commercial registration and operational bank account.
          </p>
        </div>

        {/* High-level summary widget */}
        <div className="bg-[#1a1a27] border border-[#333345] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shrink-0 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8c872] to-[#b8893a] flex items-center justify-center text-black font-bold text-xl shadow-lg">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] text-[#a8a7b3] uppercase tracking-wider font-semibold">
                Estimated Duration
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#e8c872]">
                {totalWorkingDays} Working Days
              </div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span>Target:</span>
                <span className="font-semibold text-white">{targetCompletionDate}</span>
              </div>
            </div>
          </div>

          <div className="sm:border-l sm:border-[#2f2f42] sm:pl-4 w-full sm:w-auto flex sm:flex-col justify-end">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-[#e8c872]/20 hover:bg-[#e8c872]/30 text-[#e8c872] border border-[#e8c872]/40 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Download formal branded PDF roadmap summary"
            >
              {isGeneratingPdf ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Entity, Activity & Kick-off Date */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 my-6 bg-[#0e0e16]/80 p-4 rounded-2xl border border-[#262638]">
        {/* Entity Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#e8c872]" />
            <span>Legal Entity Structure</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setEntityType('wll')}
              className={`text-xs px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                entityType === 'wll'
                  ? 'bg-[#e8c872] text-black font-bold border-[#e8c872] shadow-md'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              W.L.L. (Standard)
            </button>
            <button
              onClick={() => setEntityType('spc')}
              className={`text-xs px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                entityType === 'spc'
                  ? 'bg-[#e8c872] text-black font-bold border-[#e8c872] shadow-md'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              Single Person (SPC)
            </button>
            <button
              onClick={() => setEntityType('sole')}
              className={`text-xs px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                entityType === 'sole'
                  ? 'bg-[#e8c872] text-black font-bold border-[#e8c872] shadow-md'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              Sole Establishment
            </button>
            <button
              onClick={() => setEntityType('branch')}
              className={`text-xs px-2.5 py-2 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                entityType === 'branch'
                  ? 'bg-[#e8c872] text-black font-bold border-[#e8c872] shadow-md'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              Branch of Foreign Co.
            </button>
          </div>
        </div>

        {/* Activity Complexity Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#e8c872]" />
            <span>Commercial Activity Type</span>
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setActivityType('standard')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                activityType === 'standard'
                  ? 'bg-[#e8c872]/20 text-[#e8c872] border-[#e8c872] font-semibold'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              ⚡ Commercial / Consulting (Standard Fast-Track)
            </button>
            <button
              onClick={() => setActivityType('regulated')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                activityType === 'regulated'
                  ? 'bg-[#e8c872]/20 text-[#e8c872] border-[#e8c872] font-semibold'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              🏛️ Regulated (Fintech, Health, Education, Tourism)
            </button>
            <button
              onClick={() => setActivityType('industrial')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all text-left cursor-pointer border ${
                activityType === 'industrial'
                  ? 'bg-[#e8c872]/20 text-[#e8c872] border-[#e8c872] font-semibold'
                  : 'bg-[#151520] text-[#a8a7b3] border-[#2b2b3d] hover:text-white'
              }`}
            >
              🏭 Industrial / Manufacturing / Logistics
            </button>
          </div>
        </div>

        {/* Projected Start Date Picker & Simulator Controls */}
        <div className="flex flex-col justify-between">
          <div>
            <label className="block text-xs font-semibold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>Projected Filing Kickoff Date</span>
            </label>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8c872]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#a8a7b3]">
              Simulation: {completedCount}/{MILESTONES.length} completed
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSimulateAll(true)}
                className="text-[10px] px-2 py-1 rounded bg-[#202030] text-[#e8c872] hover:bg-[#28283e] border border-[#333348] cursor-pointer"
              >
                Mark All Done
              </button>
              <button
                onClick={() => handleSimulateAll(false)}
                className="text-[10px] px-2 py-1 rounded bg-[#202030] text-[#a8a7b3] hover:text-white border border-[#333348] cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Progress Meter */}
      <div className="relative z-10 mb-8 bg-[#12121b] border border-[#252535] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-[#f5f1e8] flex items-center gap-2">
            <span>Overall Roadmap Progress:</span>
            <span className="text-[#e8c872] font-bold">{progressPercentage}%</span>
          </span>
          <span className="text-[11px] text-[#a8a7b3]">
            {progressPercentage === 100
              ? '🎉 Ready for Trading & Corporate Banking'
              : `Next Critical Step: Step ${activeMilestone.stepNumber}`}
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#1f1f2e] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#b8893a] via-[#e8c872] to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Roadmap Navigation: 4 Core Phases and Milestone Stepper */}
      <div className="relative z-10 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {[
            {
              phase: 'submission',
              label: '1. Document Submission',
              sub: 'Days 1–2',
              count: 2,
              emoji: '📄'
            },
            {
              phase: 'review',
              label: '2. Government Review',
              sub: 'Days 3–5',
              count: 3,
              emoji: '⚖️'
            },
            {
              phase: 'approval',
              label: '3. Final Approval',
              sub: 'Days 6–7',
              count: 2,
              emoji: '🎖️'
            },
            {
              phase: 'activation',
              label: '4. Bank & LMRA Setup',
              sub: 'Days 8–10',
              count: 2,
              emoji: '🏦'
            }
          ].map((ph) => {
            const isPhaseActive = activeMilestone.phase === ph.phase;
            return (
              <div
                key={ph.phase}
                onClick={() => {
                  const firstMilestone = calculatedMilestones.find((m) => m.phase === ph.phase);
                  if (firstMilestone) {
                    setSelectedMilestoneId(firstMilestone.id);
                    handleOpenMilestoneDocs(firstMilestone);
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                  isPhaseActive
                    ? 'bg-[#1c1a2e] border-[#e8c872] shadow-md ring-1 ring-[#e8c872]/40'
                    : 'bg-[#101018] border-[#222230] hover:border-[#3d3d52]'
                }`}
                title="Click to view documentation requirements for this phase"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-0.5">
                  <span className="group-hover:text-[#e8c872] transition-colors">
                    {ph.emoji} {ph.label}
                  </span>
                  <span className="text-[10px] text-[#e8c872]">{ph.sub}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#a8a7b3] mt-1">
                  <span>{ph.count} key milestones</span>
                  <span className="text-[10px] text-[#e8c872] underline font-medium opacity-80 group-hover:opacity-100 flex items-center gap-0.5">
                    <span>View Docs</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Stepper Horizontal Nodes */}
        <div className="overflow-x-auto pb-3 pt-1">
          <div className="flex items-center gap-2 min-w-[760px]">
            {calculatedMilestones.map((m, idx) => {
              const isSelected = m.id === selectedMilestoneId;
              const isDone = m.isCompleted;

              return (
                <React.Fragment key={m.id}>
                  <button
                    onClick={() => {
                      setSelectedMilestoneId(m.id);
                      handleOpenMilestoneDocs(m);
                    }}
                    className={`relative p-3 rounded-xl flex flex-col items-start transition-all cursor-pointer text-left shrink-0 w-48 border group ${
                      isSelected
                        ? 'bg-[#211f38] border-[#e8c872] shadow-xl ring-2 ring-[#e8c872]/30'
                        : isDone
                        ? 'bg-[#131b1c] border-emerald-500/40 text-emerald-300'
                        : 'bg-[#13131d] border-[#262638] text-[#a8a7b3] hover:border-[#3d3d52]'
                    }`}
                    title={`Click to view documentation requirements for Step ${m.stepNumber}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#e8c872] text-black'
                            : isDone
                            ? 'bg-emerald-500 text-black'
                            : 'bg-[#242436] text-[#a8a7b3]'
                        }`}
                      >
                        Step {m.stepNumber}
                      </span>
                      <span className="text-[10px] text-[#e8c872] font-medium">
                        +{m.calculatedDays}d
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-white line-clamp-2 leading-snug group-hover:text-[#e8c872] transition-colors">
                      {m.title}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#232334] flex items-center justify-between w-full text-[10px]">
                      <span className="flex items-center gap-1 text-[#e8c872] font-semibold group-hover:underline">
                        <FileText className="w-3 h-3" />
                        <span>Docs Modal</span>
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[#a8a7b3]">{m.requiredDocuments.length} docs</span>
                      )}
                    </div>
                  </button>

                  {idx < calculatedMilestones.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#3d3d52] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Milestone Deep-Dive Card */}
      <div className="relative z-10 bg-[#161624] border border-[#2d2d42] rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-5 border-b border-[#2d2d42]">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e8c872]/15 border border-[#e8c872]/40 flex items-center justify-center shrink-0 text-[#e8c872] font-serif font-bold text-lg shadow-inner">
              {activeMilestone.stepNumber}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-2.5 py-0.5 rounded-full">
                  {activeMilestone.phaseTitle}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {activeMilestone.authorityBadge}
                </span>
                {activeMilestone.isCriticalPath && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Critical Path
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {activeMilestone.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a8a7b3] mt-1 leading-relaxed">
                {activeMilestone.description}
              </p>
            </div>
          </div>

          {/* Milestone Action & Completion Toggle */}
          <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => handleOpenMilestoneDocs(activeMilestone)}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Phase Docs Modal ({activeMilestone.requiredDocuments.length} files)</span>
            </button>
            <button
              onClick={() => toggleMilestone(activeMilestone.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all border ${
                activeMilestone.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-[#222234] text-white border-[#38384f] hover:bg-[#2b2b40]'
              }`}
            >
              {activeMilestone.isCompleted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Marked as Completed</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#a8a7b3]" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
            <div className="text-[11px] text-[#e8c872] font-semibold">
              Projected Date: {activeMilestone.targetDateFormatted}
            </div>
          </div>
        </div>

        {/* Detailed 3-Column Info Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Required Documents Checklist */}
          <div className="bg-[#101018] border border-[#252538] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#e8c872] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Required Submissions</span>
              </h4>
              <button
                onClick={() => handleOpenMilestoneDocs(activeMilestone)}
                className="text-[11px] text-[#e8c872] hover:text-white underline font-medium flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Modal</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <ul className="space-y-2.5">
              {activeMilestone.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#dedce6]">
                  <div className="w-4 h-4 rounded bg-[#e8c872]/20 border border-[#e8c872] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#e8c872]" />
                  </div>
                  <span className="leading-snug">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Bab Al-Khaleej / Ghazi Wazir Executive Role */}
          <div className="bg-[#101018] border border-[#252538] rounded-xl p-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Bab Al-Khaleej Action</span>
            </h4>
            <p className="text-xs text-[#a8a7b3] leading-relaxed">
              {activeMilestone.babAlKhaleejRole}
            </p>
            <div className="mt-4 pt-3 border-t border-[#222232] text-[11px] text-[#e8c872] flex items-center gap-1.5 font-medium">
              <Landmark className="w-3.5 h-3.5" />
              <span>Official Authority: {activeMilestone.authority}</span>
            </div>
          </div>

          {/* Column 3: Insider Strategy & Pro-Tip */}
          <div className="bg-[#101018] border border-[#252538] rounded-xl p-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Pro-Tip & Delay Prevention</span>
            </h4>
            <p className="text-xs text-[#dedce6] bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              💡 {activeMilestone.proTip}
            </p>
            <div className="mt-3 text-[10px] text-[#a8a7b3]">
              * Timelines based on actual 2026 Sijilat 3.0 processing cycles.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Conversion & Advisory Action Bar */}
      <div className="relative z-10 bg-gradient-to-r from-[#17142d] via-[#10101a] to-[#151328] border-2 border-[#b8893a]/50 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-[#e8c872] flex items-center justify-center sm:justify-start gap-1.5">
            <span>🇧🇭 Bab Al-Khaleej · Executive White-Glove Guarantee</span>
          </div>
          <h4 className="text-base sm:text-lg font-serif font-bold text-white">
            Ready to initiate this timeline for your company?
          </h4>
          <p className="text-xs text-[#a8a7b3]">
            We handle power of attorney, trade names, MOA notarization, and banking referrals with zero travel required.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <button
            onClick={copyRoadmapSummary}
            className="px-4 py-2.5 rounded-full text-xs font-semibold bg-[#212130] hover:bg-[#2c2c40] text-[#f5f1e8] border border-[#38384f] flex items-center gap-2 transition-all cursor-pointer"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#e8c872]/20 hover:bg-[#e8c872]/30 text-[#e8c872] border border-[#e8c872]/50 flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Branded PDF</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/50 flex items-center gap-2 transition-all shadow-md"
          >
            <span>💬 Send Roadmap to WhatsApp</span>
          </a>

          {onBookConsultation && (
            <button
              onClick={onBookConsultation}
              className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Priority Filing</span>
            </button>
          )}
        </div>
      </div>

      {/* Standalone Fallback Modal (if parent doesn't provide onSelectMilestoneDocs) */}
      {!onSelectMilestoneDocs && internalModalMilestone && (
        <MilestoneDocumentationModal
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
          milestone={internalModalMilestone}
          allMilestones={calculatedMilestones}
          onSelectMilestone={(m) => setInternalModalMilestone(m as Milestone)}
          onBookConsultation={onBookConsultation}
        />
      )}
    </section>
  );
};

// Helper function to calculate working days (skipping Friday & Saturday in Bahrain)
function addWorkingDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let count = 0;
  while (count < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // 5 = Friday, 6 = Saturday (Bahrain weekend)
    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
      count++;
    }
  }
  return result;
}
