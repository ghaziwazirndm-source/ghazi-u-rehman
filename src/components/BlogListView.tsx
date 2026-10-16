import React, { useState } from 'react';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { GUIDES } from '../data/content';

interface BlogListViewProps {
  navigate: (route: string) => void;
}

export const BlogListView: React.FC<BlogListViewProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
          📚 Guides & Insights
        </h1>
        <p className="text-base text-[#a8a7b3]">
          Practical answers on business setup in Bahrain, commercial registration, investor & worker visas, and growing online with modern SEO, GEO, AEO, and AI agents.
        </p>

        {/* Search Bar */}
        <div className="relative mt-8 max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#a8a7b3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, visas, SEO, or regulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#14141d] border border-[#2a2a38] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#f5f1e8] placeholder-[#a8a7b3]/60 focus:border-[#e8c872] focus:outline-none shadow-inner"
          />
        </div>
      </div>

      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => navigate(guide.id)}
              className="card-luxury p-6 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-3xl mb-3 block">{guide.emoji}</span>
                <span className="text-[11px] font-medium text-[#b8893a] uppercase tracking-wider block mb-1">
                  {guide.date}
                </span>
                <h2 className="text-lg font-serif font-bold text-[#e8c872] group-hover:text-white transition-colors mb-2">
                  {guide.title}
                </h2>
                <p className="text-sm text-[#a8a7b3] leading-relaxed line-clamp-3">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#2a2a38]/60 flex items-center justify-between text-xs font-semibold text-[#e8c872]">
                <span>Read full guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#14141d] border border-[#2a2a38] rounded-2xl p-8">
          <p className="text-base text-[#a8a7b3]">No guides match your search term "{searchTerm}".</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 btn-gold px-4 py-2 text-xs font-semibold rounded-full"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};
