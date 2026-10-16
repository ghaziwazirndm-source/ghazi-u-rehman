import React from 'react';
import { Shield, ArrowRight, CheckCircle, FileText, Building2, Briefcase, Clock, Phone } from 'lucide-react';
import { BAHRAIN_SERVICES, GHAZI_INFO } from '../data/content';
import { SITE_CONFIG } from '../data/siteConfig';
import { trackWhatsAppClick } from '../utils/analytics';
import { BahrainRegistrationRoadmap } from './BahrainRegistrationRoadmap';

interface BahrainHubViewProps {
  navigate: (route: string) => void;
}

export const BahrainHubView: React.FC<BahrainHubViewProps> = ({ navigate }) => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto space-y-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8c872]/10 border border-[#e8c872]/30 text-[#e8c872] text-xs font-semibold">
          <span>🇧🇭 Bab Al Khaleej Business Consultancy W.L.L.</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
          Bahrain Business Setup: CR, Visas & Documents
        </h1>
        <p className="text-[#a8a7b3] text-base sm:text-lg leading-relaxed">
          Consultancy, documentation preparation, and procedural support for establishing your corporate entity in the Kingdom of Bahrain.
        </p>
      </header>

      {/* Regulatory Compliance Notice */}
      <aside
        aria-label="Bahrain Regulatory Notice"
        className="bg-[#14141d] border border-[#e8c872]/30 rounded-2xl p-5 text-xs text-[#a8a7b3] leading-relaxed max-w-4xl mx-auto shadow-lg"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#e8c872] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#e8c872] block mb-1">
              Official Regulatory Notice & Operational Scope
            </span>
            <p>
              {SITE_CONFIG.babAlKhaleej.regulatoryDisclaimer} Approvals are issued solely by the competent Bahraini authorities (MOIC Sijilat, Labour Market Regulatory Authority - LMRA, and NPRA). Bab Al Khaleej Business Consultancy W.L.L. operates under commercial registration for marketing and management consultancy.
            </p>
          </div>
        </div>
      </aside>

      {/* Services Grid (6 Bahrain Services) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Comprehensive Corporate Formation Services
          </h2>
          <p className="text-sm text-[#a8a7b3]">
            Select a service below for detailed ministerial requirements, checklists, and procedural timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BAHRAIN_SERVICES.map((service) => (
            <article
              key={service.id}
              className="bg-[#14141d] border border-[#2a2a38] hover:border-[#e8c872]/50 transition-all rounded-2xl p-6 flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#e8c872]/10 border border-[#e8c872]/20 flex items-center justify-center text-2xl">
                  <span aria-hidden="true">{service.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#e8c872] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[#a8a7b3] leading-relaxed">
                  {service.lead}
                </p>

                <div className="pt-2 border-t border-[#2a2a38] space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-[#e8c872] block">Key Inclusions:</span>
                  {service.included.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#888]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => navigate(`bahrain-business-setup/${service.id}`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1b1b26] hover:bg-[#e8c872] text-white hover:text-[#0a0a0f] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Procedural Formation Roadmap */}
      <section className="space-y-6 pt-8 border-t border-[#2a2a38]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Standard 6-Step Formation Roadmap
          </h2>
          <p className="text-sm text-[#a8a7b3]">
            Transparent milestones from initial activity selection to municipal clearance and corporate bank account activation.
          </p>
        </div>
        <BahrainRegistrationRoadmap onBookConsultation={() => navigate('contact')} />
      </section>

      {/* Direct Executive Contact & Consultation CTA */}
      <section className="bg-gradient-to-br from-[#14141d] to-[#1c182a] border border-[#e8c872]/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
          Begin Your Bahrain Business Setup Today
        </h2>
        <p className="text-[#a8a7b3] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Speak directly with Ghazi Wazir and the Bab Al Khaleej consultancy team for complete guidance on entity structure, investor quotas, and document clearance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('book')}
            className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <span>Book 1-on-1 Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/${SITE_CONFIG.person.whatsappNumber}?text=${encodeURIComponent('Hello Ghazi, I am inquiring about Bahrain commercial registration (CR) and business setup.')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('bahrain_hub_cta')}
            className="btn-outline-gold px-8 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Direct WhatsApp ({SITE_CONFIG.person.phone})</span>
          </a>
        </div>
      </section>
    </div>
  );
};
