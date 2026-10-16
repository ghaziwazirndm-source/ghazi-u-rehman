import React from 'react';
import { ArrowLeft, Home, Compass } from 'lucide-react';

interface NotFoundViewProps {
  navigate: (route: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ navigate }) => {
  return (
    <div className="py-24 px-4 max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-[#e8c872]/10 border border-[#e8c872]/30 flex items-center justify-center text-[#e8c872] mx-auto">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#e8c872]">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-white">
        Page Not Found
      </h2>
      <p className="text-[#a8a7b3] text-sm leading-relaxed">
        The requested URL does not exist or may have been relocated. Use the navigation above or return to the executive homepage.
      </p>

      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate('')}
          className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('contact')}
          className="btn-outline-gold px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <span>Contact Executive Desk</span>
        </button>
      </div>
    </div>
  );
};
