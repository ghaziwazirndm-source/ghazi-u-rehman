import React from 'react';
import { CheckCircle2, MessageSquare, Clock, FileText, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';
import { trackWhatsAppClick } from '../utils/analytics';

interface ThankYouViewProps {
  navigate: (route: string) => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3.5 py-1 rounded-full mb-3">
        Step 3 of 3 · Request Dispatched
      </div>

      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
        Your Request Is on Its Way
      </h1>

      <p className="text-base sm:text-lg text-[#a8a7b3] max-w-xl mx-auto leading-relaxed mb-10">
        Please make sure you hit <strong>Send</strong> in the WhatsApp chat that opened. I will review your chosen slot and confirm your consultation there.
      </p>

      {/* Personal Confirmation Card from Ghazi Wazir */}
      <div className="bg-[#14141d] border-2 border-[#b8893a] rounded-3xl p-6 sm:p-7 mb-10 shadow-2xl max-w-2xl mx-auto text-left flex flex-col sm:flex-row items-center gap-5">
        <div className="relative shrink-0">
          <CeoPortrait size="md" rounded="2xl" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0a0a0f]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            Personal Message From Ghazi Wazir
          </span>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
            "I'm personally reviewing your application."
          </h3>
          <div className="text-xs text-[#e8c872] font-semibold">
            CEO, Back for Brand LLC (USA) &amp; Business Consultant, Bab Al-Khaleej (Bahrain)
          </div>
          <p className="text-xs text-[#a8a7b3] pt-1 leading-relaxed">
            I respond personally to every qualified inquiry on WhatsApp. Expect my confirmation within a few business hours.
          </p>
        </div>
      </div>

      {/* 3 Step Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
        <div className="card-luxury p-6">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center mb-4">
            <MessageSquare className="w-5 h-5 text-[#25D366]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-white mb-1">
            1. Send the Message
          </h3>
          <p className="text-xs text-[#a8a7b3] leading-relaxed">
            Press the send button in WhatsApp with your booking details.
          </p>
        </div>

        <div className="card-luxury p-6">
          <div className="w-10 h-10 rounded-xl bg-[#e8c872]/20 border border-[#e8c872]/40 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-[#e8c872]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-white mb-1">
            2. I Confirm Your Time
          </h3>
          <p className="text-xs text-[#a8a7b3] leading-relaxed">
            I will promptly review and confirm the exact meeting date and time.
          </p>
        </div>

        <div className="card-luxury p-6">
          <div className="w-10 h-10 rounded-xl bg-[#b8893a]/20 border border-[#b8893a]/40 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-[#e8c872]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-white mb-1">
            3. Prepare Documents
          </h3>
          <p className="text-xs text-[#a8a7b3] leading-relaxed">
            Have your preliminary ideas, questions, or passport scans ready.
          </p>
        </div>
      </div>

      {/* Fallback button if WhatsApp didn't open */}
      <div className="space-y-4 max-w-md mx-auto">
        <a
          href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Ghazi, I just submitted the consultation request on your website and would like to confirm my booking.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('thank_you_fallback')}
          className="btn-gold w-full py-4 text-sm font-semibold rounded-full flex items-center justify-center gap-2 shadow-xl"
        >
          <MessageSquare className="w-4 h-4 text-[#16120a]" />
          <span>WhatsApp did not open? Tap here</span>
        </a>

        <button
          onClick={() => navigate('')}
          className="text-xs text-[#a8a7b3] hover:text-[#e8c872] transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
