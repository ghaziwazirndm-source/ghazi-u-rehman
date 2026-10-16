import React from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import { GuideItem, GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';

interface GuideDetailViewProps {
  guide: GuideItem;
  otherGuides: GuideItem[];
  navigate: (route: string) => void;
}

export const GuideDetailView: React.FC<GuideDetailViewProps> = ({
  guide,
  otherGuides,
  navigate,
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <article className="min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('blog')}
        className="inline-flex items-center gap-2 text-sm text-[#a8a7b3] hover:text-[#e8c872] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Guides</span>
      </button>

      {/* Guide Header */}
      <header className="mb-10 pb-8 border-b border-[#2a2a38]">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Practical Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
          {guide.title}
        </h1>
        
        <p className="text-lg text-[#a8a7b3] mb-6 leading-relaxed">
          {guide.summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#a8a7b3] pt-4 border-t border-[#2a2a38]/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <div className="w-7 h-7 rounded-full border border-[#e8c872] overflow-hidden shrink-0">
                <CeoPortrait size="xs" rounded="full" className="w-full h-full" showBorder={false} />
              </div>
              <span>By {GHAZI_INFO.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#b8893a]" />
              <span>Updated {guide.date}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#a8a7b3]" />
              <span>4 min read</span>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2a2a38] hover:border-[#e8c872] text-[#f5f1e8] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#e8c872]" />
            <span>Share Guide</span>
          </button>
        </div>
      </header>

      {/* Guide Content Sections */}
      <div className="space-y-8 text-base text-[#f5f1e8]/90 leading-relaxed font-sans">
        {guide.sections.map((sec, index) => (
          <section key={index} className="bg-[#14141d]/50 p-6 rounded-2xl border border-[#2a2a38]/60">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#e8c872] mb-3">
              {sec.heading}
            </h2>
            <p className="text-[#a8a7b3] leading-relaxed text-sm sm:text-base">
              {sec.body}
            </p>
          </section>
        ))}
      </div>

      {/* Advisory Callout Box */}
      <div className="mt-12 bg-gradient-to-br from-[#14141d] to-[#1c1810] border border-[#e8c872]/40 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          Need personalized advice on this?
        </h3>
        <p className="text-sm text-[#a8a7b3] max-w-xl mx-auto mb-6">
          Every company and visa application is unique. Book a free 20-minute consultation with Ghazi Wazir to map your exact requirements and timeline.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('book')}
            className="btn-gold px-6 py-3 text-sm font-semibold rounded-full shadow-lg"
          >
            📅 Book a Free Consultation
          </button>
          <a
            href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Ghazi, I just read your guide "${guide.title}" and have a question.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-6 py-3 text-sm rounded-full"
          >
            💬 Ask via WhatsApp
          </a>
        </div>
      </div>

      {/* Author Profile Box */}
      <div className="mt-14 bg-[#14141d] border-2 border-[#b8893a] rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative shrink-0">
          <CeoPortrait size="md" rounded="2xl" />
        </div>
        <div className="space-y-1.5 flex-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872]">
            About the Author
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            {GHAZI_INFO.name}
          </h3>
          <div className="text-xs text-[#e8c872] font-semibold space-y-0.5">
            <div>🇺🇸 CEO · Back for Brand LLC (Florida, USA)</div>
            <div>🇧🇭 CEO & Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)</div>
          </div>
          <p className="text-xs text-[#a8a7b3] pt-1 leading-relaxed">
            Leading international company registration and licensing in Bahrain while engineering digital growth and AI systems worldwide.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => navigate('apply')}
              className="btn-gold px-5 py-2 text-xs font-semibold rounded-full cursor-pointer"
            >
              Book Consultation
            </button>
            <button
              onClick={() => navigate('about')}
              className="text-xs text-[#a8a7b3] hover:text-[#e8c872] underline cursor-pointer"
            >
              Read full biography
            </button>
          </div>
        </div>
      </div>

      {/* Related Guides */}
      {otherGuides.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#2a2a38]">
          <h3 className="text-2xl font-serif font-bold text-white mb-6">
            📚 More Recommended Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherGuides.slice(0, 3).map((g) => (
              <button
                key={g.id}
                onClick={() => navigate(g.id)}
                className="card-luxury p-5 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-2xl mb-2 block">{g.emoji}</span>
                  <h4 className="text-sm font-semibold text-[#e8c872] group-hover:text-white transition-colors mb-2 line-clamp-2">
                    {g.title}
                  </h4>
                  <p className="text-xs text-[#a8a7b3] line-clamp-2">
                    {g.summary}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#e8c872] mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read guide &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
