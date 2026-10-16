import React from 'react';
import { Crown, Globe } from 'lucide-react';
import { GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';
import { authService } from '../services/AuthService';
import { trackWhatsAppClick } from '../utils/analytics';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const currentRole = authService.getCurrentRole();

  return (
    <footer className="bg-[#101018] border-t border-[#2a2a38] pt-14 pb-12 text-[#a8a7b3] text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Executive Profile Strip */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-5 sm:p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <CeoPortrait size="sm" rounded="full" />
            <div>
              <strong className="block text-white font-serif text-base">
                {GHAZI_INFO.name}
              </strong>
              <span className="text-xs text-[#e8c872] block">
                {GHAZI_INFO.roleTitle}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('book')}
              className="btn-gold px-4 py-2 text-xs font-semibold rounded-full cursor-pointer shadow"
            >
              Book 1-on-1 Consultation
            </button>
            <a
              href={`https://wa.me/${GHAZI_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('footer_strip')}
              className="btn-outline-gold px-4 py-2 text-xs font-semibold rounded-full"
            >
              WhatsApp Direct
            </a>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Bahrain Services */}
          <div className="space-y-3">
            <b className="block text-[#e8c872] text-xs uppercase tracking-widest font-semibold">
              Bahrain Setup
            </b>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('business-registration')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Company Registration (CR)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('investor-visa')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Investor & Partner Visa
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bank-account')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Corporate Bank Account
                </button>
              </li>
              <li>
                <button onClick={() => navigate('accounting-vat')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Accounting & NBR VAT
                </button>
              </li>
              <li>
                <button onClick={() => navigate('tamkeen-support')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Tamkeen Subsidy Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Tech Services */}
          <div className="space-y-3">
            <b className="block text-[#e8c872] text-xs uppercase tracking-widest font-semibold">
              Tech & Growth
            </b>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('seo')} className="hover:text-white transition-colors text-left cursor-pointer">
                  SEO & Organic Search
                </button>
              </li>
              <li>
                <button onClick={() => navigate('geo-aeo')} className="hover:text-white transition-colors text-left cursor-pointer">
                  GEO & AEO Optimization
                </button>
              </li>
              <li>
                <button onClick={() => navigate('web-development')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Web & App Development
                </button>
              </li>
              <li>
                <button onClick={() => navigate('marketing-ads')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Performance Ad Campaigns
                </button>
              </li>
              <li>
                <button onClick={() => navigate('ai-automation')} className="hover:text-white transition-colors text-left cursor-pointer">
                  AI Architecture & Workflows
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Experience */}
          <div className="space-y-3">
            <b className="block text-[#e8c872] text-xs uppercase tracking-widest font-semibold">
              Client Experience
            </b>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('packages')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Packages & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => navigate('apply')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Book a Consultation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('portal')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Guides */}
          <div className="space-y-3">
            <b className="block text-[#e8c872] text-xs uppercase tracking-widest font-semibold">
              Guides
            </b>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('blog')} className="hover:text-white transition-colors text-left cursor-pointer">
                  All Guides & Articles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('guide-register-company-bahrain')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Register in Bahrain
                </button>
              </li>
              <li>
                <button onClick={() => navigate('guide-investor-visa-vs-worker-visa')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Investor vs Worker Visa
                </button>
              </li>
              <li>
                <button onClick={() => navigate('guide-what-is-geo-aeo')} className="hover:text-white transition-colors text-left cursor-pointer">
                  What is GEO & AEO?
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Governance & Compliance */}
          <div className="space-y-3">
            <b className="block text-[#e8c872] text-xs uppercase tracking-widest font-semibold">
              Governance
            </b>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('privacy-policy')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms-of-service')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('disclaimer')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Regulatory Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('cookie-policy')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Cookie Policy
                </button>
              </li>

              <li className="pt-2 border-t border-[#2a2a38]">
                <button
                  onClick={() => navigate('ceo/login')}
                  className="text-[#e8c872] hover:underline text-xs flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Crown className="w-3.5 h-3.5 text-[#e8c872]" />
                  <span>CEO Executive Login</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => navigate('domain')}
                  className="text-purple-300 hover:underline text-xs flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>Hostinger Custom Domain</span>
                </button>
              </li>

              {/* Internal Links for logged-in sessions */}
              {currentRole === 'CEO' && (
                <li className="pt-1">
                  <button
                    onClick={() => navigate('ceo')}
                    className="text-[#e8c872] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>CEO Cockpit</span>
                  </button>
                </li>
              )}
              {currentRole === 'ADMIN' && (
                <li className="pt-2 border-t border-[#2a2a38]">
                  <button
                    onClick={() => navigate('admin')}
                    className="text-cyan-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Admin Console</span>
                  </button>
                </li>
              )}
              {currentRole === 'AGENT' && (
                <li className="pt-2 border-t border-[#2a2a38]">
                  <button
                    onClick={() => navigate('live-agent')}
                    className="text-cyan-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Live Agent Desk</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Plain Text Business Address and Phone (SEO & Local Entity Grounding) */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-5 mb-6 text-xs text-[#a8a7b3] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-white block font-serif text-sm mb-1">🇧🇭 Bab Al Khaleej Business Consultancy W.L.L.</strong>
              <p className="leading-relaxed">
                Address: Office 22, Building 342, Road 1705, Block 317, Diplomatic Area, Manama, Kingdom of Bahrain (CR: 180572-1)<br />
                Phone: +973 3550 7868 | WhatsApp: +973 3562 8353<br />
                Email: {GHAZI_INFO.email}
              </p>
            </div>
            <div>
              <strong className="text-white block font-serif text-sm mb-1">🇺🇸 Back for Brand LLC</strong>
              <p className="leading-relaxed">
                Registered/Mailing Address: 7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA (Mailing address, not a public walk-in office)<br />
                Email: {GHAZI_INFO.email}
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer Notice */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-4 text-[11px] text-[#a8a7b3] leading-relaxed mb-6">
          <span className="font-bold text-[#e8c872] block mb-1">
            ⚖️ Official Regulatory &amp; Jurisdictional Notice:
          </span>
          Consultancy and ministerial document processing are conducted by Bab Al Khaleej Business Consultancy W.L.L. in accordance with the commercial laws of the Kingdom of Bahrain (registered activities: management consultancy and marketing/promotion). Official government decisions, company registration approvals, and visa issuances (MOIC, LMRA, NPRA) remain under the sovereign jurisdiction of the competent Bahraini authorities. Back for Brand LLC is a separate Florida limited liability company (filed 04 Dec 2024; registered/mailing address: 7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA; not a public office), delivering international SEO, AEO, GEO, digital marketing, and AI automation.
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2a2a38] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-center sm:text-left gap-4">
          <p className="text-[#888]">
            © {new Date().getFullYear()} {GHAZI_INFO.name} · Back for Brand LLC (Florida, USA) · Bab Al Khaleej Business Consultancy W.L.L. (Bahrain)
          </p>
          <div className="flex items-center gap-4 text-[#a8a7b3]">
            <a href={`mailto:${GHAZI_INFO.email}`} className="hover:text-[#e8c872] transition-colors">
              {GHAZI_INFO.email}
            </a>
            <span>•</span>
            <a
              href={`https://wa.me/${GHAZI_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('footer_phone')}
              className="hover:text-[#e8c872] transition-colors"
            >
              {GHAZI_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
