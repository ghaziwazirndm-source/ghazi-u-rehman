import React, { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Check,
  Shield,
  HelpCircle,
  ArrowRight,
  UserCheck,
  Clock,
  Play,
  Award,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ServiceItem, GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { trackWhatsAppClick, trackVslWatch, trackFunnelStep, trackPaymentInitiate } from '../utils/analytics';

interface VslFunnelViewProps {
  service: ServiceItem;
  navigate: (route: string) => void;
}

export const VslFunnelView: React.FC<VslFunnelViewProps> = ({ service, navigate }) => {
  const isBahrain = service.category === 'bahrain';
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Top Category Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-4 py-1.5 rounded-full mb-4 shadow-sm">
          <span>{isBahrain ? "🇧🇭 Bab Al-Khaleej · Bahrain Business Consultancy" : "🌍 Back for Brand LLC · Global Tech & AI"}</span>
        </div>

        {/* Main VSL Headline */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 leading-tight max-w-3xl mx-auto">
          {service.vslHeadline}
        </h1>
        <p className="text-base sm:text-lg text-[#a8a7b3] max-w-2xl mx-auto leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* VSL VIDEO PLAYER SECTION */}
      <div className="relative mb-10 group">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#b8893a] bg-[#101018] shadow-[0_15px_50px_rgba(0,0,0,0.8)] aspect-video max-w-3xl mx-auto flex items-center justify-center">
          {/* Executive Video Poster with Ghazi Wazir Photo */}
          <div className="absolute inset-0">
            <img
              src={GHAZI_INFO.photoUrl}
              alt="Ghazi Wazir VSL Presentation"
              className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-transform duration-700 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          </div>

          {/* Video Metadata Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="flex items-center gap-1.5 bg-[#0a0a0f]/80 backdrop-blur-md border border-[#e8c872]/40 text-[#e8c872] text-xs font-medium px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Executive Briefing · 3:45 min</span>
            </span>
            <span className="bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 text-white text-xs px-2.5 py-1 rounded-md hidden sm:inline">
              HD 1080p
            </span>
          </div>

          {/* Central Play Button */}
          <button
            onClick={() => {
              setIsPlayingVideo(true);
              trackVslWatch(service.title);
            }}
            className="relative z-10 flex flex-col items-center gap-3 group/btn focus:outline-none cursor-pointer"
          >
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#b8893a] to-[#e8c872] text-[#0a0a0f] flex items-center justify-center shadow-[0_0_40px_rgba(232,200,114,0.6)] group-hover/btn:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            </div>
            <span className="text-white text-xs sm:text-sm font-semibold tracking-wide bg-[#0a0a0f]/90 px-4 py-1.5 rounded-full border border-[#e8c872]/50 shadow-md">
              Click to Watch Strategy Breakdown
            </span>
          </button>

          {/* Bottom Video Subtitle Strip */}
          <div className="absolute bottom-4 left-4 right-4 text-left z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#e8c872] overflow-hidden shrink-0">
              <CeoPortrait size="xs" rounded="full" className="w-full h-full" showBorder={false} />
            </div>
            <div className="truncate">
              <strong className="block text-white text-xs sm:text-sm font-serif">
                Ghazi Wazir
              </strong>
              <span className="block text-[11px] text-[#e8c872] truncate">
                CEO, Back for Brand LLC (USA) &amp; Business Consultant, Bab Al-Khaleej (Bahrain)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player (Interactive Simulation) */}
      {isPlayingVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14141d] border-2 border-[#e8c872] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 text-[#a8a7b3] hover:text-white p-2 rounded-full bg-[#101018] border border-[#2a2a38] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <CeoPortrait size="md" rounded="2xl" />
              <div>
                <span className="text-xs uppercase tracking-wider text-[#e8c872] font-semibold block">
                  Personal Executive Briefing
                </span>
                <h3 className="text-xl font-serif font-bold text-white">
                  {service.title} with Ghazi Wazir
                </h3>
                <p className="text-xs text-[#a8a7b3] mt-0.5">
                  CEO, Back for Brand LLC &amp; Business Consultant, Bab Al-Khaleej Bahrain
                </p>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 mb-6 space-y-3">
              <h4 className="text-sm font-semibold text-[#e8c872] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Key Consultation Takeaways:</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#f5f1e8]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Exact legal entity, capital, and activity codes tailored to your industry in Bahrain.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real government timelines and transparent fee breakdown with zero hidden charges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct submission, tracking, and personal representation at ministries and authorities.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsPlayingVideo(false);
                  navigate('apply');
                }}
                className="btn-gold flex-1 py-3 text-sm font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Proceed to Schedule Call</span>
              </button>
              <a
                href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I watched your video briefing on ${service.title} and want to discuss next steps.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('vsl_video_modal')}
                className="btn-outline-gold px-6 py-3 text-sm rounded-full flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Consultant Host Banner with Real Photo & Dual Roles */}
      <div className="bg-gradient-to-r from-[#17142e] to-[#101018] border-2 border-[#b8893a] rounded-3xl p-6 sm:p-7 mb-10 shadow-xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative shrink-0">
          <CeoPortrait size="md" rounded="2xl" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0a0a0f]" title="Verified Official Consultant">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <strong className="block text-xl sm:text-2xl font-serif font-bold text-white">
              {GHAZI_INFO.name}
            </strong>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              Direct Advisory
            </span>
          </div>

          <div className="text-xs text-[#e8c872] font-semibold space-y-0.5">
            <div>🇺🇸 CEO · Back for Brand LLC (Florida, USA)</div>
            <div>🇧🇭 Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</div>
          </div>

          <p className="text-xs sm:text-sm text-[#a8a7b3] pt-1 leading-relaxed">
            "Here is how I can personally help you execute {service.title.toLowerCase()} without delays, bureaucratic guesswork, or hidden fees."
          </p>
        </div>
      </div>

      {/* Primary Funnel Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto mb-6">
        <button
          onClick={() => {
            trackFunnelStep('book_consultation_clicked', service.title);
            navigate('apply');
          }}
          className="btn-gold w-full sm:w-auto px-9 py-4 text-base font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xl text-center"
        >
          <Calendar className="w-5 h-5" />
          <span>Book Your Free Consultation</span>
        </button>

        <a
          href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I am on the ${service.title} funnel and would like to consult with you.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('vsl_primary_cta')}
          className="btn-outline-gold w-full sm:w-auto px-8 py-3.5 text-base rounded-full flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5 text-[#25D366]" />
          <span>Direct WhatsApp Message</span>
        </a>
      </div>

      {/* Trust Points Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#a8a7b3] pb-12 border-b border-[#2a2a38]">
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span>100% Free Consultation</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#e8c872]" />
          <span>Confidentiality Guaranteed</span>
        </span>
        <span className="flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-[#00C98D]" />
          <span>Direct Call with Ghazi Wazir</span>
        </span>
      </div>

      {/* What You Get Section */}
      <section className="py-12 border-b border-[#2a2a38]">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6 flex items-center gap-3">
          <span>{service.emoji}</span>
          <span>What You Get</span>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.included.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-[#14141d] border border-[#2a2a38] rounded-xl p-4 text-sm text-[#f5f1e8]">
              <div className="w-5 h-5 rounded-full bg-[#e8c872]/20 border border-[#e8c872] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#e8c872]" />
              </div>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="py-12 border-b border-[#2a2a38]">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
          🧭 How It Works
        </h2>
        <p className="text-sm text-[#a8a7b3] mb-8">
          A proven, transparent step-by-step process with clear milestones.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card-luxury p-6 relative">
            <span className="text-3xl mb-3 block">📅</span>
            <div className="text-xs uppercase tracking-wider text-[#b8893a] font-bold mb-1">Step 1</div>
            <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
              Book a Free Call
            </h3>
            <p className="text-xs text-[#a8a7b3] leading-relaxed">
              Choose an available 30-minute slot on my calendar that fits your schedule.
            </p>
          </div>

          <div className="card-luxury p-6 relative">
            <span className="text-3xl mb-3 block">📝</span>
            <div className="text-xs uppercase tracking-wider text-[#b8893a] font-bold mb-1">Step 2</div>
            <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
              Get Your Clear Plan
            </h3>
            <p className="text-xs text-[#a8a7b3] leading-relaxed">
              We review your situation and map out the exact required documents, costs, and timeline.
            </p>
          </div>

          <div className="card-luxury p-6 relative">
            <span className="text-3xl mb-3 block">🚀</span>
            <div className="text-xs uppercase tracking-wider text-[#b8893a] font-bold mb-1">Step 3</div>
            <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
              We Make It Happen
            </h3>
            <p className="text-xs text-[#a8a7b3] leading-relaxed">
              We prepare, submit, and track your applications or launch your digital tech system.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Your Consultant Section with Authentic Photo */}
      <section className="py-12 border-b border-[#2a2a38]">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center bg-[#14141d] border-2 border-[#2a2a38] rounded-3xl p-6 sm:p-8">
          <div className="sm:col-span-4 flex justify-center">
            <div className="relative">
              <CeoPortrait size="lg" rounded="2xl" />
              <div className="absolute -bottom-3 inset-x-0 mx-auto w-fit bg-[#0a0a0f] border border-[#e8c872] text-[#e8c872] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                Consultant
              </div>
            </div>
          </div>
          <div className="sm:col-span-8 space-y-3 text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#e8c872]">
              Meet Your Consultant & Advisor
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Ghazi Wazir
            </h3>
            <div className="text-xs text-[#e8c872] font-semibold space-y-1">
              <div>• CEO · Back for Brand LLC (Florida, USA)</div>
              <div>• Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</div>
            </div>
            <p className="text-xs sm:text-sm text-[#a8a7b3] leading-relaxed pt-1">
              Delivering global technology and AI growth infrastructure worldwide from the USA, while personally advising founders on commercial registration, investor and worker visas, document clearance, and active ministry tracking across Bahrain.
            </p>
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-4">
              <button
                onClick={() => navigate('about')}
                className="text-xs font-semibold text-[#e8c872] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read executive biography</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 border-b border-[#2a2a38]">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#b8893a]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-4">
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-5">
            <h4 className="font-semibold text-white text-base mb-1.5">{service.faq.q}</h4>
            <p className="text-sm text-[#a8a7b3] leading-relaxed">{service.faq.a}</p>
          </div>

          <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-5">
            <h4 className="font-semibold text-white text-base mb-1.5">Is the initial consultation really free?</h4>
            <p className="text-sm text-[#a8a7b3] leading-relaxed">
              Yes, 100%. We will review your goals and explain honestly if and how we can assist you, with no obligation.
            </p>
          </div>
        </div>
      </section>

      {/* Final Action Call */}
      <div className="py-12 text-center">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
          Ready to Get Started with {service.title}?
        </h3>
        <p className="text-sm text-[#a8a7b3] max-w-xl mx-auto mb-8">
          Lock in your preferred 30-minute consultation slot on my live calendar or send me a direct WhatsApp note.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              trackFunnelStep('final_schedule_clicked', service.title);
              navigate('apply');
            }}
            className="btn-gold w-full sm:w-auto px-7 py-3.5 text-xs font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule 1-on-1 Consultation</span>
          </button>
          <button
            onClick={() => {
              trackPaymentInitiate(service.title, 350);
              setIsPaymentModalOpen(true);
            }}
            className="btn-gold w-full sm:w-auto px-7 py-3.5 text-xs font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black border border-emerald-400"
          >
            <Shield className="w-4 h-4 text-black" />
            <span>Fast-Track Deposit / Pay (BenefitPay · Cards)</span>
          </button>
          <a
            href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I am ready to begin ${service.title}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('vsl_final_cta')}
            className="btn-outline-gold w-full sm:w-auto px-6 py-3 text-xs rounded-full flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      </div>

      {/* Global & Gulf Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        serviceTitle={service.title}
        serviceId={service.id}
        defaultAmountBhd={350}
      />
    </div>
  );
};
