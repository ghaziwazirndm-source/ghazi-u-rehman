import React from 'react';
import { Shield, Check, Calendar, Clock, MessageSquare, Award } from 'lucide-react';
import { BookingCalendar } from './BookingCalendar';
import { CeoPortrait } from './CeoPortrait';
import { GHAZI_INFO } from '../data/content';

interface ApplyViewProps {
  navigate: (route: string) => void;
}

export const ApplyView: React.FC<ApplyViewProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3.5 py-1 rounded-full mb-3 shadow-sm">
          Step 2 of 3 · Consultation Scheduler
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
          📅 Book Your Free Consultation
        </h1>
        <p className="text-base text-[#a8a7b3]">
          Choose an available date and time. All slots are shown in Bahrain local time (GMT+3).
        </p>
      </div>

      {/* Host Advisor Banner with Ghazi's Real Picture */}
      <div className="bg-[#14141d] border-2 border-[#b8893a] rounded-3xl p-5 sm:p-6 mb-10 shadow-xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative shrink-0">
          <CeoPortrait size="md" rounded="2xl" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0a0a0f]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block">
            1-on-1 Direct Advisory
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Ghazi Wazir
          </h2>
          <div className="text-xs text-[#e8c872] font-semibold space-y-0.5">
            <div>🇺🇸 CEO · Back for Brand LLC (Florida, USA)</div>
            <div>🇧🇭 Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</div>
          </div>
          <p className="text-xs text-[#a8a7b3] pt-1">
            "You will be speaking directly with me. We will review your company setup or tech scale requirements with transparent timelines and zero hidden fees."
          </p>
        </div>
      </div>

      {/* Embedded Calendar with direct redirect to thank-you */}
      <BookingCalendar onSuccess={() => navigate('thank-you')} />

      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#a8a7b3] mt-8 pt-6 border-t border-[#2a2a38]">
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span>Free 20-minute consultation</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#e8c872]" />
          <span>Your information stays 100% confidential</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#e8c872]" />
          <span>Bahrain Time (GMT+3)</span>
        </span>
      </div>
    </div>
  );
};
