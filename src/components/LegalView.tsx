import React from 'react';
import { ArrowLeft, Shield, FileText, AlertTriangle, Cookie } from 'lucide-react';
import { GHAZI_INFO } from '../data/content';

interface LegalViewProps {
  type: 'privacy-policy' | 'terms-of-service' | 'disclaimer' | 'cookie-policy';
  navigate: (route: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, navigate }) => {
  const titles = {
    'privacy-policy': { title: 'Privacy Policy', icon: Shield, emoji: '🔒' },
    'terms-of-service': { title: 'Terms of Service', icon: FileText, emoji: '📜' },
    'disclaimer': { title: 'Disclaimer', icon: AlertTriangle, emoji: '⚠️' },
    'cookie-policy': { title: 'Cookie Policy', icon: Cookie, emoji: '🍪' },
  };

  const current = titles[type];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('')}
        className="inline-flex items-center gap-2 text-sm text-[#a8a7b3] hover:text-[#e8c872] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="mb-8 pb-6 border-b border-[#2a2a38]">
        <span className="text-4xl mb-3 block">{current.emoji}</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
          {current.title}
        </h1>
        <p className="text-xs text-[#a8a7b3]">
          Last updated: October 3, 2026 · Official governance of Ghazi Wazir, Back for Brand LLC, and Bab Al-Khaleej
        </p>
      </div>

      <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-[#a8a7b3] leading-relaxed">
        {type === 'privacy-policy' && (
          <>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">1. Who We Are</h2>
              <p>
                This website is operated by Ghazi Wazir, Chief Executive Officer of Back for Brand LLC (Florida, USA), providing global technology services, and business consultant at Bab Al-Khaleej, providing business registration, visa issuance, document consultancy, and application tracking in the Kingdom of Bahrain.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Direct contact information: Full name, business email address, phone/WhatsApp number.</li>
                <li>Application documents: Passport scans, company details, or business plans submitted to evaluate eligibility.</li>
                <li>Technical diagnostics: Anonymized IP addresses, browser types, and navigation activity to ensure site integrity.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">3. How Your Information Is Used</h2>
              <p>
                We use collected information solely to process your requests, communicate transparently regarding your commercial applications, deliver technology deliverables, and fulfill legal compliance mandates. We never sell, rent, or trade your data to third-party brokers.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">4. Government Submissions</h2>
              <p>
                For Bahrain business registration and visa applications, information is transferred exclusively to authorized Bahrain ministries (MOIC, LMRA, NPRA) as required by Bahrain law for official commercial licensing.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">5. Contact & Data Rights</h2>
              <p>
                You may request access to, correction of, or permanent deletion of your personal records at any time by contacting{' '}
                <a href={`mailto:${GHAZI_INFO.email}`} className="text-[#e8c872] underline">
                  {GHAZI_INFO.email}
                </a>
                .
              </p>
            </div>
          </>
        )}

        {type === 'terms-of-service' && (
          <>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">1. Scope of Services</h2>
              <p>
                We provide professional business consultancy (Bahrain company incorporation, investor and worker visa facilitation, document organization, and tracking) and technology services (search engine optimization, GEO/AEO, digital marketing, AI agents, and web design). Engagements are defined by mutual written agreement.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">2. Independent Advisory Status & No Outcomes Guarantee</h2>
              <p>
                Final approvals, commercial registrations, and visa grants are strictly within the sovereign discretion of the relevant Bahrain government bodies (MOIC, LMRA, NPRA). Similarly, third-party search engines and AI platforms determine search rankings and answer citations. While we apply diligent expert methodology, we cannot guarantee specific sovereign approvals or algorithm rankings.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">3. Client Responsibilities</h2>
              <p>
                Clients agree to furnish authentic, unaltered, and complete documentation. Delays arising from fraudulent credentials or unverified documents remain the sole responsibility of the client.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">4. Invoicing and Government Disbursements</h2>
              <p>
                Professional advisory fees are agreed prior to work commencement. Government administrative fees, official translations, and embassy attestations are separate out-of-pocket disbursements unless explicitly bundled.
              </p>
            </div>
          </>
        )}

        {type === 'disclaimer' && (
          <>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">1. Not Formal Legal or Tax Counsel</h2>
              <p>
                The materials and guides published on this website are provided for informational and procedural orientation only. They do not constitute formal legal counsel, statutory tax advice, or official governmental pronouncements. Regulations, statutory fees, and legal structures change regularly.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">2. Private Consultancy Distinction</h2>
              <p>
                Bab Al-Khaleej is a private commercial consultancy in the Kingdom of Bahrain. We are not an organ of the Bahraini government or any ministry.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">3. Technology & Marketing Results</h2>
              <p>
                Traffic statistics, keyword rank estimations, and AI agent outputs depend on proprietary third-party algorithms (Google, OpenAI, Anthropic, Meta). No past result constitutes a warranty of identical performance.
              </p>
            </div>
          </>
        )}

        {type === 'cookie-policy' && (
          <>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">1. What Are Cookies?</h2>
              <p>
                Cookies are small encrypted text tokens stored on your device that allow our website to remember your session preferences, maintain fast load times, and analyze traffic volume.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">2. Types of Cookies We Use</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-white">Essential Cookies:</strong> Required to enable navigation, security, and booking calendar functionality.</li>
                <li><strong className="text-white">Preference Cookies:</strong> Stores your acknowledgement of our cookie notice.</li>
                <li><strong className="text-white">Performance Analytics:</strong> Helps us understand which guides and services visitors find most valuable.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#e8c872] mb-2">3. Controlling Your Settings</h2>
              <p>
                You can configure your browser to block or alert you about cookies. Note that disabling essential cookies may impact interactive appointment scheduling.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
