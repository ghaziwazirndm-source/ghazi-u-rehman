import React, { useState } from 'react';
import { ArrowLeft, Check, Calendar, MessageSquare, Mail, HelpCircle, CreditCard, Shield, MapPin, Compass, FileText } from 'lucide-react';
import { ServiceItem, GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { BahrainRegistrationRoadmap, MILESTONES, Milestone } from './BahrainRegistrationRoadmap';
import { MilestoneDocumentationModal } from './MilestoneDocumentationModal';
import { trackWhatsAppClick } from '../utils/analytics';

interface ServiceDetailViewProps {
  service: ServiceItem;
  relatedServices: ServiceItem[];
  navigate: (route: string) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  service,
  relatedServices,
  navigate,
}) => {
  const isBahrain = service.category === 'bahrain';
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showTechRoadmap, setShowTechRoadmap] = useState(false);
  const [selectedMilestoneForDocs, setSelectedMilestoneForDocs] = useState<Milestone | null>(null);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('')}
        className="inline-flex items-center gap-2 text-sm text-[#a8a7b3] hover:text-[#e8c872] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
          {isBahrain ? "🇧🇭 Bab Al-Khaleej · Business Consultancy" : "🌍 Back for Brand LLC · Technology Services"}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 flex items-center gap-3">
          <span>{service.emoji}</span>
          <span>{service.title}</span>
        </h1>
        <p className="text-lg text-[#a8a7b3] max-w-3xl leading-relaxed">
          {service.description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => navigate('apply')}
            className="btn-gold px-6 py-3 text-sm font-semibold rounded-full flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Consultation</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="btn-gold px-6 py-3 text-sm font-bold rounded-full flex items-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-black border border-emerald-400 shadow-lg"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Retainer (BenefitPay · Cards)</span>
          </button>
          <button
            onClick={() => navigate(`vsl-${service.id}`)}
            className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2 cursor-pointer"
          >
            <span>🎯 Open Sales Funnel</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('bahrain-roadmap-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2 cursor-pointer border-[#e8c872]/60 hover:bg-[#e8c872]/15 text-[#e8c872]"
          >
            <Compass className="w-4 h-4 text-[#e8c872]" />
            <span>Interactive Timeline Roadmap</span>
          </button>
          <button
            onClick={() => setSelectedMilestoneForDocs(MILESTONES[0])}
            className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2 cursor-pointer border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Phase Documentation Modal</span>
          </button>
          <a
            href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I am interested in ${service.title}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>Ask on WhatsApp</span>
          </a>
          <a
            href={`mailto:${GHAZI_INFO.email}?subject=${encodeURIComponent(`Inquiry about ${service.title}`)}`}
            className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email Me</span>
          </a>
        </div>
      </div>

      {/* What is Included */}
      <section className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 sm:p-8 mb-10 shadow-lg">
        <h2 className="text-2xl font-serif font-bold text-[#e8c872] mb-6 flex items-center gap-2">
          <span>✅ What Is Included</span>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.included.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-[#f5f1e8]">
              <div className="w-5 h-5 rounded-full bg-[#e8c872]/20 border border-[#e8c872] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#e8c872]" />
              </div>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bahrain Registration Roadmap Section */}
      <div id="bahrain-roadmap-section">
        {/* Quick Phase Documentation Inspector Pill Bar */}
        {(isBahrain || showTechRoadmap) && (
          <div className="bg-[#141421] border border-[#2b2b3f] rounded-2xl p-4 mb-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e8c872] animate-pulse" />
                <h3 className="text-xs uppercase font-bold tracking-wider text-[#e8c872] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Phase Documentation Requirements Inspector</span>
                </h3>
              </div>
              <span className="text-[11px] text-[#a8a7b3]">
                Click any milestone below to inspect exact documentation requirements & attestation criteria
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5">
              {MILESTONES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMilestoneForDocs(m)}
                  className={`text-[11px] px-3 py-1.5 rounded-xl border font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedMilestoneForDocs?.id === m.id
                      ? 'bg-[#e8c872] text-black font-bold border-[#e8c872] shadow-sm'
                      : 'bg-[#181827] hover:bg-[#232338] text-[#dedce6] border-[#303046] hover:border-[#e8c872]/60'
                  }`}
                  title={`Click to view documentation requirements for Step ${m.stepNumber}: ${m.title}`}
                >
                  <span className="font-bold text-[10px] opacity-75">Step {m.stepNumber}</span>
                  <span className="truncate max-w-[140px]">{m.title.split(' ')[0]} {m.title.split(' ')[1]}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-[#e8c872] border border-[#e8c872]/20">
                    {m.requiredDocuments.length} docs
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isBahrain ? (
          <BahrainRegistrationRoadmap
            serviceTitle={service.title}
            onBookConsultation={() => navigate('apply')}
            onSelectMilestoneDocs={(milestone) => setSelectedMilestoneForDocs(milestone)}
          />
        ) : (
          <div className="bg-[#14141f] border border-[#2a2a38] rounded-2xl p-6 mb-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#e8c872] uppercase tracking-wider mb-1 flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>🇧🇭 Kingdom of Bahrain Corporate Expansion</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Need a legal entity or regional holding company in Bahrain for this service?
                </h3>
                <p className="text-xs text-[#a8a7b3] mt-1">
                  Explore our dynamic Sijilat 3.0 registration timeline, from document submission to commercial registration and bank opening.
                </p>
              </div>
              <button
                onClick={() => setShowTechRoadmap(!showTechRoadmap)}
                className="btn-gold px-5 py-2.5 text-xs font-bold rounded-full flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{showTechRoadmap ? 'Hide Registration Roadmap' : 'Explore Bahrain Roadmap'}</span>
              </button>
            </div>

            {showTechRoadmap && (
              <div className="mt-6 pt-6 border-t border-[#2a2a38]">
                <BahrainRegistrationRoadmap
                  serviceTitle="Bahrain Commercial Registration"
                  onBookConsultation={() => navigate('apply')}
                  onSelectMilestoneDocs={(milestone) => setSelectedMilestoneForDocs(milestone)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Direct Advisory with Ghazi Wazir */}
      <section className="bg-gradient-to-r from-[#17142e] to-[#101018] border-2 border-[#b8893a] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative shrink-0">
            <CeoPortrait size="md" rounded="2xl" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0a0a0f]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-2.5 py-0.5 rounded-full inline-block">
              Direct Executive Advisory
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Consult Directly with {GHAZI_INFO.name}
            </h3>
            <div className="text-xs text-[#e8c872] font-semibold space-y-0.5">
              <div>🇺🇸 CEO · Back for Brand LLC (Florida, USA)</div>
              <div>🇧🇭 Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</div>
            </div>
            <p className="text-xs sm:text-sm text-[#a8a7b3] pt-1 leading-relaxed">
              Have specific questions about {service.title}? I provide direct guidance on legal entity structure, ministry requirements, timelines, or technology infrastructure.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => navigate('apply')}
                className="btn-gold px-6 py-2.5 text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule a Free Call</span>
              </button>
              <a
                href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I am inquiring about ${service.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('service_detail')}
                className="btn-outline-gold px-5 py-2.5 text-xs rounded-full flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-[#101018] border border-[#2a2a38] rounded-2xl p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-serif font-bold text-[#e8c872] mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#b8893a]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-4">
          {(service.faqs || [service.faq]).map((faqItem, idx) => (
            <div key={idx} className="bg-[#14141d] border border-[#2a2a38]/80 rounded-xl p-5">
              <h3 className="font-semibold text-white text-base mb-2">
                {faqItem.q}
              </h3>
              <p className="text-sm text-[#a8a7b3] leading-relaxed">
                {faqItem.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[#2a2a38] pt-10">
          <h2 className="text-2xl font-serif font-bold text-white mb-6">
            🔗 Related Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedServices.slice(0, 3).map((rel) => (
              <button
                key={rel.id}
                onClick={() => navigate(rel.id)}
                className="card-luxury p-5 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-3xl mb-3 block">{rel.emoji}</span>
                  <h3 className="text-base font-semibold text-[#e8c872] group-hover:text-white transition-colors mb-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-[#a8a7b3] line-clamp-2">
                    {rel.lead}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#e8c872] mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Learn more &rarr;
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Unified Payment & Retainer Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        serviceTitle={service.title}
        serviceId={service.id}
        defaultAmountBhd={350}
      />

      {/* Milestone Documentation Requirements Modal */}
      <MilestoneDocumentationModal
        isOpen={!!selectedMilestoneForDocs}
        onClose={() => setSelectedMilestoneForDocs(null)}
        milestone={selectedMilestoneForDocs}
        allMilestones={MILESTONES}
        onSelectMilestone={(m) => setSelectedMilestoneForDocs(m as Milestone)}
        onBookConsultation={() => navigate('apply')}
      />
    </div>
  );
};
