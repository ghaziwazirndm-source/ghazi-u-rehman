import React, { useState, useEffect } from 'react';

export const RoleBadge: React.FC = () => {
  const roles = [
    {
      id: 'bahrain',
      flag: '🇧🇭',
      tag: 'BAHRAIN BUSINESS CONSULTANCY',
      title: 'CEO & Business Consultant, Bab Al-Khaleej',
      sub: 'Manama, Bahrain · CR Formation, Visas & Clearance',
      accent: '#e8c872',
    },
    {
      id: 'usa',
      flag: '🇺🇸',
      tag: 'GLOBAL TECH & AI SYSTEMS',
      title: 'CEO, Back for Brand LLC',
      sub: 'Florida, USA · Global Web, SEO, AI & Funnels',
      accent: '#00C98D',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [roles.length]);

  const current = roles[currentIndex];

  return (
    <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-[#0a0a0f]/95 border-2 border-[#e8c872] rounded-2xl p-3 sm:px-4 sm:py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-[290px] sm:max-w-[340px] transition-all duration-500 z-20">
      <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-[#2a2a38]/80 pb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse shrink-0"></div>
          <strong className="block text-[#e8c872] text-sm sm:text-base font-serif font-bold">
            Ghazi Wazir
          </strong>
        </div>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % roles.length)}
          className="text-[9px] uppercase tracking-wider text-[#a8a7b3] hover:text-[#e8c872] bg-[#14141d] px-2 py-0.5 rounded border border-[#2a2a38] transition-colors cursor-pointer"
          title="Click to switch title"
        >
          Slide ⇄
        </button>
      </div>

      {/* Sliding animated role container */}
      <div className="overflow-hidden min-h-[42px] flex flex-col justify-center">
        <div
          key={currentIndex}
          className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-white leading-tight">
            <span className="text-base shrink-0">{current.flag}</span>
            <span className="truncate">{current.title}</span>
          </div>
          <span className="block text-[11px] text-[#a8a7b3] truncate mt-1">
            {current.sub}
          </span>
        </div>
      </div>

      {/* Progress pill indicator & Dual Quick View */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2a2a38]/50">
        <div className="flex items-center gap-1.5">
          {roles.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? 'w-7 bg-[#e8c872]' : 'w-2 bg-[#2a2a38] hover:bg-[#a8a7b3]'
              }`}
              title={r.title}
            />
          ))}
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[#a8a7b3]">
          Dual Leadership
        </span>
      </div>
    </div>
  );
};
