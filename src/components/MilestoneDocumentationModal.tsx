import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  Building2,
  Landmark,
  Sparkles,
  Info
} from 'lucide-react';
import { GHAZI_INFO } from '../data/content';

export interface MilestoneDocRequirement {
  id: string;
  stepNumber: number;
  phase: 'submission' | 'review' | 'approval' | 'activation';
  phaseTitle: string;
  title: string;
  authority: string;
  authorityBadge: string;
  baseDays: number;
  calculatedDays?: number;
  targetDateFormatted?: string;
  description: string;
  requiredDocuments: string[];
  documentSpecs?: {
    format: string;
    attestationRequirement: string;
    validityRequirement: string;
  };
  clientPreparation?: string[];
  babAlKhaleejRole: string;
  proTip: string;
  isCriticalPath?: boolean;
}

interface MilestoneDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneDocRequirement | null;
  allMilestones?: MilestoneDocRequirement[];
  onSelectMilestone?: (milestone: MilestoneDocRequirement) => void;
  onBookConsultation?: () => void;
}

export const MilestoneDocumentationModal: React.FC<MilestoneDocumentationModalProps> = ({
  isOpen,
  onClose,
  milestone,
  allMilestones = [],
  onSelectMilestone,
  onBookConsultation,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'guidelines' | 'babAlKhaleej'>('documents');

  // Reset checked docs on milestone change or initialize
  useEffect(() => {
    if (milestone) {
      setCheckedDocs({});
      setCopiedChecklist(false);
    }
  }, [milestone?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !milestone) return null;

  const toggleDocChecked = (docIndex: number) => {
    const key = `${milestone.id}_${docIndex}`;
    setCheckedDocs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const completedDocsCount = milestone.requiredDocuments.filter(
    (_, idx) => !!checkedDocs[`${milestone.id}_${idx}`]
  ).length;

  const totalDocsCount = milestone.requiredDocuments.length;
  const docsProgressPercent = totalDocsCount > 0 ? Math.round((completedDocsCount / totalDocsCount) * 100) : 0;

  // Previous & Next navigation
  const currentIndex = allMilestones.findIndex((m) => m.id === milestone.id);
  const prevMilestone = currentIndex > 0 ? allMilestones[currentIndex - 1] : null;
  const nextMilestone = currentIndex >= 0 && currentIndex < allMilestones.length - 1 ? allMilestones[currentIndex + 1] : null;

  const handleCopyChecklist = () => {
    const lines = [
      `🇧🇭 Bahrain Company Registration - Documentation Checklist`,
      `Phase: ${milestone.phaseTitle}`,
      `Milestone: Step ${milestone.stepNumber} - ${milestone.title}`,
      `Authority: ${milestone.authority}`,
      `Projected Turnaround: ${milestone.calculatedDays || milestone.baseDays} Working Days`,
      ``,
      `REQUIRED DOCUMENTS:`,
      ...milestone.requiredDocuments.map((doc, i) => `[${checkedDocs[`${milestone.id}_${i}`] ? 'X' : ' '}] ${i + 1}. ${doc}`),
      ``,
      `PRO-TIP: ${milestone.proTip}`,
      `CONSULTANCY: Bab Al-Khaleej / Ghazi Wazir (WhatsApp: +${GHAZI_INFO.whatsappNumber})`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ghazi, I am reviewing the documentation requirements for Step ${milestone.stepNumber}: "${milestone.title}" in Bahrain company registration. Could you please advise on how to prepare the required documents?`
  );
  const whatsappUrl = `https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${whatsappMessage}`;

  const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
    submission: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    review: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    approval: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    activation: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
    },
  };

  const currentPhaseStyle = phaseColors[milestone.phase] || phaseColors.submission;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#11111a] border border-[#2d2d42] rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl z-10 text-[#f5f1e8]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#242436] bg-[#161623] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#a8a7b3] hover:text-white bg-[#222233] hover:bg-[#2e2e45] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2 pr-10">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${currentPhaseStyle.bg} ${currentPhaseStyle.text} ${currentPhaseStyle.border}`}
            >
              {milestone.phaseTitle}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Landmark className="w-2.5 h-2.5" />
              {milestone.authorityBadge}
            </span>
            {milestone.isCriticalPath && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Critical Path Phase
              </span>
            )}
          </div>

          <div className="flex items-start gap-3 mt-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8c872] to-[#b8893a] text-black font-bold font-serif text-lg flex items-center justify-center shrink-0 shadow-md">
              {milestone.stepNumber}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {milestone.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#a8a7b3] mt-0.5 leading-relaxed">
                Documentation requirements, dossier guidelines, and official verification criteria.
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#252538] text-xs">
            <div className="flex items-center gap-1.5 text-[#dedce6]">
              <Clock className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>
                Estimated Turnaround:{' '}
                <strong className="text-white">
                  {milestone.calculatedDays || milestone.baseDays} Working Days
                </strong>
              </span>
            </div>
            {milestone.targetDateFormatted && (
              <div className="flex items-center gap-1.5 text-[#dedce6]">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Target Completion:{' '}
                  <strong className="text-emerald-300">{milestone.targetDateFormatted}</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[#dedce6] col-span-2 sm:col-span-1">
              <FileText className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>
                Required Files:{' '}
                <strong className="text-white">{milestone.requiredDocuments.length} Documents</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 border-b border-[#222234] bg-[#12121d]">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#e8c872] text-[#e8c872] bg-[#1c1c2b]'
                : 'border-transparent text-[#a8a7b3] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Required Documents ({completedDocsCount}/{totalDocsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'border-[#e8c872] text-[#e8c872] bg-[#1c1c2b]'
                : 'border-transparent text-[#a8a7b3] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Format & Attestation Specs</span>
          </button>
          <button
            onClick={() => setActiveTab('babAlKhaleej')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'babAlKhaleej'
                ? 'border-[#e8c872] text-[#e8c872] bg-[#1c1c2b]'
                : 'border-transparent text-[#a8a7b3] hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Executive Handling & Pro-Tips</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Tab 1: Checklist & Required Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Progress counter bar */}
              <div className="bg-[#181826] p-3.5 rounded-xl border border-[#2b2b3f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span>Document Readiness Checklist:</span>
                    <span className="text-[#e8c872] font-bold">
                      {completedDocsCount} of {totalDocsCount} Prepared ({docsProgressPercent}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a8a7b3] mt-0.5">
                    Click each item to mark whether you have it ready or need Bab Al-Khaleej to prepare it.
                  </p>
                </div>

                <button
                  onClick={handleCopyChecklist}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#242436] hover:bg-[#303046] text-[#e8c872] border border-[#3d3d54] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {copiedChecklist ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Checklist!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Checklist</span>
                    </>
                  )}
                </button>
              </div>

              {/* Document List with interactive checkboxes */}
              <div className="space-y-2.5">
                {milestone.requiredDocuments.map((doc, idx) => {
                  const isChecked = !!checkedDocs[`${milestone.id}_${idx}`];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleDocChecked(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 shadow-sm'
                          : 'bg-[#151522] border-[#272738] hover:border-[#3a3a52] text-[#dedce6]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-[#4a4a64] bg-[#1d1d2d]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              isChecked ? 'line-through text-emerald-300' : 'text-white'
                            }`}
                          >
                            Document #{idx + 1}
                          </span>
                          <span className="text-[10px] text-[#a8a7b3]">
                            {isChecked ? 'Ready to Submit' : 'Pending Upload / Draft'}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isChecked ? 'text-emerald-200/80' : 'text-[#dedce6]'}`}>
                          {doc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-phase Authority callout */}
              <div className="bg-[#141420] border border-[#262638] rounded-xl p-3.5 flex items-center gap-3">
                <Landmark className="w-5 h-5 text-[#e8c872] shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Receiving Government Authority:</div>
                  <div className="text-[#a8a7b3]">{milestone.authority}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Guidelines & Attestation */}
          {activeTab === 'guidelines' && (
            <div className="space-y-4">
              <div className="bg-[#151522] border border-[#272738] rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#e8c872] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory Document Specifications (Kingdom of Bahrain)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-[#101018] p-3 rounded-xl border border-[#232334]">
                    <div className="font-semibold text-white mb-1">Digital Resolution</div>
                    <p className="text-[#a8a7b3] text-[11px] leading-relaxed">
                      Color PDF scans at minimum 300 DPI. No mobile photos with glare or cropped borders.
                    </p>
                  </div>
                  <div className="bg-[#101018] p-3 rounded-xl border border-[#232334]">
                    <div className="font-semibold text-white mb-1">Apostille / Attestation</div>
                    <p className="text-[#a8a7b3] text-[11px] leading-relaxed">
                      Foreign corporate resolutions & POAs must be notarized and apostilled or Bahrain Embassy stamped.
                    </p>
                  </div>
                  <div className="bg-[#101018] p-3 rounded-xl border border-[#232334]">
                    <div className="font-semibold text-white mb-1">Bilingual Translation</div>
                    <p className="text-[#a8a7b3] text-[11px] leading-relaxed">
                      All non-Arabic/English documents must be accompanied by certified Arabic legal translations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase Specific Instructions */}
              <div className="bg-[#151522] border border-[#272738] rounded-2xl p-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#e8c872]" />
                  <span>Phase Details & Review Criteria</span>
                </h4>
                <p className="text-xs text-[#dedce6] leading-relaxed">
                  {milestone.description}
                </p>
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 leading-relaxed">
                  ⚠️ <strong>Important Note:</strong> Under the latest Sijilat 3.0 regulations, incomplete document uploads will pause review and restart queuing timers. Having Bab Al-Khaleej pre-validate documents guarantees immediate initial acceptance.
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bab Al-Khaleej Role & Insider Tips */}
          {activeTab === 'babAlKhaleej' && (
            <div className="space-y-4">
              {/* Executive Role */}
              <div className="bg-[#151522] border border-[#272738] rounded-2xl p-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Bab Al-Khaleej Executive Actions</span>
                </h4>
                <p className="text-xs text-[#dedce6] leading-relaxed">
                  {milestone.babAlKhaleejRole}
                </p>
              </div>

              {/* Insider Strategy & Pro Tip */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Executive Pro-Tip & Delay Avoidance</span>
                </h4>
                <p className="text-xs text-[#f5f1e8] leading-relaxed">
                  💡 {milestone.proTip}
                </p>
              </div>

              {/* Direct advisory callout */}
              <div className="bg-[#171728] border border-[#2f2f45] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-semibold text-white">Need custom document drafting or legal proxy?</div>
                  <div className="text-[#a8a7b3]">
                    Ghazi Wazir and Bab Al-Khaleej prepare all Power of Attorney and MOA clauses directly.
                  </div>
                </div>
                {onBookConsultation && (
                  <button
                    onClick={() => {
                      onClose();
                      onBookConsultation();
                    }}
                    className="btn-gold px-4 py-2 text-xs font-bold rounded-full shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Document Review</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#242436] bg-[#141420] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Stepper pagination (Prev / Next) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => prevMilestone && onSelectMilestone && onSelectMilestone(prevMilestone)}
              disabled={!prevMilestone}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                prevMilestone
                  ? 'bg-[#1e1e2f] hover:bg-[#29293f] text-[#f5f1e8] border border-[#323247] cursor-pointer'
                  : 'opacity-40 bg-[#151520] text-[#6e6d7d] border border-[#222230] cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Step {prevMilestone ? prevMilestone.stepNumber : ''}</span>
            </button>

            <span className="text-[11px] text-[#a8a7b3] font-medium">
              Phase {milestone.stepNumber} of {allMilestones.length || 9}
            </span>

            <button
              onClick={() => nextMilestone && onSelectMilestone && onSelectMilestone(nextMilestone)}
              disabled={!nextMilestone}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                nextMilestone
                  ? 'bg-[#1e1e2f] hover:bg-[#29293f] text-[#f5f1e8] border border-[#323247] cursor-pointer'
                  : 'opacity-40 bg-[#151520] text-[#6e6d7d] border border-[#222230] cursor-not-allowed'
              }`}
            >
              <span>Step {nextMilestone ? nextMilestone.stepNumber : ''}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/50 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#222233] hover:bg-[#2d2d42] text-white border border-[#38384f] transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
