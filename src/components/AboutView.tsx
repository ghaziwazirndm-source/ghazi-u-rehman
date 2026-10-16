import React, { useState } from 'react';
import { Calendar, Globe, Building2, ShieldCheck, Mail, MessageSquare, Check, Sparkles } from 'lucide-react';
import { GHAZI_INFO } from '../data/content';
import { RoleBadge } from './RoleBadge';
import { CeoPortrait } from './CeoPortrait';
import { trackWhatsAppClick } from '../utils/analytics';

interface AboutViewProps {
  navigate: (route: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate }) => {
  const [activePhoto, setActivePhoto] = useState<'main' | 'pink'>('main');

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-16">
        {/* Profile Image & Badges */}
        <div className="md:col-span-5 flex flex-col items-center">
          {/* Portrait Selector Tabs */}
          <div className="flex items-center gap-2 mb-3 z-10">
            <button
              onClick={() => setActivePhoto('main')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                activePhoto === 'main'
                  ? 'bg-gradient-to-r from-[#e8c872] to-[#b8893a] text-[#0a0a0f] font-bold shadow-md'
                  : 'bg-[#14141d] text-[#a8a7b3] border border-[#2a2a38] hover:text-white'
              }`}
            >
              Executive (Black & Red)
            </button>
            <button
              onClick={() => setActivePhoto('pink')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                activePhoto === 'pink'
                  ? 'bg-gradient-to-r from-[#e8c872] to-[#b8893a] text-[#0a0a0f] font-bold shadow-md'
                  : 'bg-[#14141d] text-[#a8a7b3] border border-[#2a2a38] hover:text-white'
              }`}
            >
              Corporate (Pink & Blue)
            </button>
          </div>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
            <div className="absolute inset-0 rounded-3xl border-2 border-[#b8893a] rotate-3 transition-transform hover:rotate-0 duration-500 pointer-events-none"></div>
            <CeoPortrait size="hero" rounded="3xl" variant={activePhoto} />
            <RoleBadge />
          </div>
        </div>

        {/* Bio Text */}
        <div className="md:col-span-7">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3.5 py-1 rounded-full mb-3">
            Biography & Leadership
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
            Ghazi Wazir
          </h1>
          <div className="text-base sm:text-lg text-[#e8c872] font-semibold mb-4 space-y-1">
            <p>🇺🇸 CEO · Back for Brand LLC (Florida, USA)</p>
            <p>🇧🇭 Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</p>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-[#a8a7b3] leading-relaxed">
            <p>
              I bridge the gap between regulatory business compliance in the Kingdom of Bahrain and world-class digital technology infrastructure from the United States.
            </p>
            <p>
              Through <strong className="text-white">Bab Al-Khaleej</strong> in Bahrain, my team and I guide regional and international entrepreneurs through company registration, investor and employee visas, regulatory document checks, and active application tracking. We eliminate bureaucratic confusion and deliver approved commercial registrations with zero surprises.
            </p>
            <p>
              Through <strong className="text-white">Back for Brand LLC</strong>, registered in Florida, USA, I engineer digital growth systems for modern companies: from high-intent SEO and next-generation GEO/AEO (getting your brand cited by ChatGPT, Perplexity, and Gemini) to autonomous AI agents, workflow automation, and high-conversion web funnels.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => navigate('book')}
              className="btn-gold px-6 py-3 text-sm font-semibold rounded-full flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Consultation</span>
            </button>
            <a
              href={`https://wa.me/${GHAZI_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('about_page')}
              className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Ghazi</span>
            </a>
            <a
              href={`mailto:${GHAZI_INFO.email}`}
              className="btn-outline-gold px-5 py-3 text-sm rounded-full flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pillar Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-[#2a2a38]">
        {/* Bahrain Pillar */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#e8c872]/10 border border-[#e8c872]/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#e8c872]" />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#e8c872] overflow-hidden shadow-md">
                <CeoPortrait size="xs" rounded="full" variant="pink" className="w-full h-full" showBorder={false} />
              </div>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              🇧🇭 Bab Al-Khaleej (Bahrain)
            </h2>
            <p className="text-sm text-[#a8a7b3] leading-relaxed mb-4">
              Specialized business consultancy based in the Kingdom of Bahrain. We assist international and local investors with end-to-end commercial formation, investor residency permits, worker quotas, and governmental liaison.
            </p>
            <ul className="text-xs text-[#f5f1e8] space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e8c872]" />
                <span>Licensed Commercial Advisory Services</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e8c872]" />
                <span>Direct MOIC, LMRA, NPRA & Municipality Processing</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate('business-registration')}
            className="text-xs font-semibold text-[#e8c872] hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            <span>Explore Bahrain Services &rarr;</span>
          </button>
        </div>

        {/* USA Tech Pillar */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-[#0a0a0f] border border-[#e8c872]/40 p-1 flex items-center justify-center shadow-md">
                <img
                  src={GHAZI_INFO.logoUrl}
                  alt="Back for Brand LLC Logo"
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#00C98D] uppercase tracking-wider block">Florida LLC · Filed 04 Dec 2024</span>
                <h2 className="text-xl font-serif font-bold text-white">
                  Back for Brand LLC (USA)
                </h2>
              </div>
            </div>
            <p className="text-sm text-[#a8a7b3] leading-relaxed mb-4">
              A Florida limited liability company (filed 04 Dec 2024; registered/mailing address: 7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA; not a public office). Delivering international SEO, AEO, GEO, digital marketing, and AI automation worldwide.
            </p>
            <ul className="text-xs text-[#f5f1e8] space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C98D]" />
                <span>Florida LLC · Registered / Mailing Address in St. Petersburg</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C98D]" />
                <span>SEO, AEO, GEO, Digital Marketing &amp; AI Automation</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate('seo')}
            className="text-xs font-semibold text-[#e8c872] hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            <span>Explore Global Tech Services &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
