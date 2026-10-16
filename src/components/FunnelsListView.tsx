import React from 'react';
import { ArrowRight, Sparkles, Compass, Check } from 'lucide-react';
import { BAHRAIN_SERVICES, TECH_SERVICES, GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';

interface FunnelsListViewProps {
  navigate: (route: string) => void;
}

export const FunnelsListView: React.FC<FunnelsListViewProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3.5 py-1 rounded-full mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Conversion Portals</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
          🎯 Service Funnels
        </h1>
        <p className="text-base text-[#a8a7b3]">
          Explore dedicated video sales pages and streamlined consultation pathways for each business setup and technology service.
        </p>
      </div>

      {/* Executive Host Banner */}
      <div className="bg-[#14141d] border-2 border-[#b8893a] rounded-3xl p-5 sm:p-6 mb-12 shadow-xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative shrink-0">
          <CeoPortrait size="md" rounded="2xl" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0a0a0f]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872]">
            Consultant & Strategist
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Ghazi Wazir
          </h2>
          <div className="text-xs text-[#e8c872] font-semibold space-y-0.5">
            <div>🇺🇸 CEO · Back for Brand LLC (Florida, USA)</div>
            <div>🇧🇭 Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</div>
          </div>
          <p className="text-xs text-[#a8a7b3] pt-1">
            "Every funnel below is designed to give you a clear briefing on legal requirements, investment expectations, or technology blueprints with direct 1-on-1 scheduling."
          </p>
        </div>
      </div>

      {/* Bab Al-Khaleej Funnels */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🇧🇭</span>
          <h2 className="text-2xl font-serif font-bold text-white">
            Bab Al-Khaleej · Bahrain Services
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BAHRAIN_SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`vsl-${s.id}`)}
              className="card-luxury p-6 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-3xl mb-3 block">{s.emoji}</span>
                <h3 className="text-lg font-serif font-bold text-[#e8c872] group-hover:text-white transition-colors mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#a8a7b3] leading-relaxed line-clamp-2">
                  {s.vslHeadline}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#e8c872] mt-5 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Open Funnel &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Back for Brand LLC Funnels */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌍</span>
          <h2 className="text-2xl font-serif font-bold text-white">
            Back for Brand LLC · Technology Services
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`vsl-${s.id}`)}
              className="card-luxury p-6 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-3xl mb-3 block">{s.emoji}</span>
                <h3 className="text-lg font-serif font-bold text-[#e8c872] group-hover:text-white transition-colors mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#a8a7b3] leading-relaxed line-clamp-2">
                  {s.vslHeadline}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#e8c872] mt-5 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Open Funnel &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
