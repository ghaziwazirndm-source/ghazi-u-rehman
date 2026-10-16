import React from 'react';
import { ArrowRight, CheckCircle, Cpu, Search, Sparkles, BarChart3, Globe, Code, Phone } from 'lucide-react';
import { TECH_SERVICES, GHAZI_INFO } from '../data/content';
import { SITE_CONFIG } from '../data/siteConfig';
import { trackWhatsAppClick } from '../utils/analytics';

interface TechHubViewProps {
  navigate: (route: string) => void;
}

export const TechHubView: React.FC<TechHubViewProps> = ({ navigate }) => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto space-y-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <span>🇺🇸 Back for Brand LLC · Florida, USA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
          SEO, AEO, GEO & AI Automation Services
        </h1>
        <p className="text-[#a8a7b3] text-base sm:text-lg leading-relaxed">
          Advanced generative engine optimization, answer engine optimization, technical SEO, and enterprise autonomous AI agents engineered by Back for Brand LLC.
        </p>
      </header>

      {/* Services Grid (6 Tech Services) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Enterprise Technology & Search Capabilities
          </h2>
          <p className="text-sm text-[#a8a7b3]">
            Architected for first-page Google visibility and top-source recommendations across AI answer engines (ChatGPT, Perplexity, Gemini, Claude).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_SERVICES.map((service) => (
            <article
              key={service.id}
              className="bg-[#14141d] border border-[#2a2a38] hover:border-cyan-500/50 transition-all rounded-2xl p-6 flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-2xl">
                  <span aria-hidden="true">{service.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[#a8a7b3] leading-relaxed">
                  {service.lead}
                </p>

                <div className="pt-2 border-t border-[#2a2a38] space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-cyan-400 block">Capabilities Included:</span>
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
                  onClick={() => navigate(`technology-services/${service.id}`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1b1b26] hover:bg-cyan-500 text-white hover:text-[#0a0a0f] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SEO vs GEO vs AEO Architectural Comparison Table */}
      <section className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Search Paradigm Comparison: SEO vs. AEO vs. GEO
          </h2>
          <p className="text-xs text-[#a8a7b3]">
            Understanding how traditional search engines differ from modern Large Language Model answer engines.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a38] text-[#e8c872]">
                <th className="py-3 px-4 font-semibold">Dimension</th>
                <th className="py-3 px-4 font-semibold">Traditional SEO</th>
                <th className="py-3 px-4 font-semibold">Answer Engine (AEO)</th>
                <th className="py-3 px-4 font-semibold">Generative Engine (GEO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a38]/60 text-[#bbb]">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Target Platforms</td>
                <td className="py-3 px-4">Google, Bing, Yahoo</td>
                <td className="py-3 px-4">Siri, Alexa, Google Voice, Featured Snippets</td>
                <td className="py-3 px-4">ChatGPT, Perplexity, Gemini, Claude</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Primary Metric</td>
                <td className="py-3 px-4">Rankings, Clicks, Impressions</td>
                <td className="py-3 px-4">Direct Answer Placement, Zero-Click Answers</td>
                <td className="py-3 px-4">LLM Citations, Source Links, AI Synthesis Share</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Key Technique</td>
                <td className="py-3 px-4">Keywords, Backlinks, Meta Tags</td>
                <td className="py-3 px-4">Schema FAQ, Q&A Architecture, Direct Definitions</td>
                <td className="py-3 px-4">Entity Verification, llms.txt, Unambiguous Statements</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Content Structure</td>
                <td className="py-3 px-4">Long-form Articles (1,500+ words)</td>
                <td className="py-3 px-4">Concise 40–60 word Direct Answers</td>
                <td className="py-3 px-4">Structured Data, Semantic Tables, Entity Graphs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Strategy Booking Call CTA */}
      <section className="bg-gradient-to-br from-[#14141d] to-[#0f1d2e] border border-cyan-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
          Scale Your Enterprise with AI Search & Autonomous Systems
        </h2>
        <p className="text-[#a8a7b3] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Book an executive strategy consultation with Ghazi Wazir to architect your GEO/AEO search campaign and autonomous AI workflows.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('book')}
            className="btn-gold px-8 py-3.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <span>Book Strategy Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/${SITE_CONFIG.person.whatsappNumber}?text=${encodeURIComponent('Hello Ghazi, I am inquiring about Back for Brand LLC technology services, SEO, and AI automation.')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('tech_hub_cta')}
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
