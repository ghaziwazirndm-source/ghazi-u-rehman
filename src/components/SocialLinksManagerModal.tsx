import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  Link2,
  Code2,
  Globe,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Save,
} from 'lucide-react';
import {
  SocialLinkItem,
  getStoredSocialLinks,
  saveSocialLinks,
  resetToSampleLinks,
  DEFAULT_SOCIAL_LINKS,
} from '../data/socialLinksStore';

interface SocialLinksManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialLinksManagerModal: React.FC<SocialLinksManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [links, setLinks] = useState<SocialLinkItem[]>(() => getStoredSocialLinks());
  const [activeTab, setActiveTab] = useState<'customize' | 'embed'>('customize');
  const [filterCategory, setFilterCategory] = useState<'all' | 'professional' | 'social' | 'reviews'>('all');
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleUrlChange = (id: string, newUrl: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url: newUrl } : item))
    );
  };

  const handleToggleActive = (id: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleSave = () => {
    saveSocialLinks(links);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleResetToSamples = () => {
    const samples = resetToSampleLinks();
    setLinks(samples);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const filteredLinks = links.filter((l) => {
    if (filterCategory === 'all') return true;
    return l.category === filterCategory;
  });

  const embedCodeSnippet = `<!-- Ghazi Wazir — Verified Executive Presence & Social Directory Widget -->
<div id="ghazi-wazir-presence-widget"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${window.location.origin}/#socials';
    iframe.style.width = '100%';
    iframe.style.height = '480px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '24px';
    iframe.title = 'Ghazi Wazir Official Presence';
    document.getElementById('ghazi-wazir-presence-widget').appendChild(iframe);
  })();
</script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#2a2a38] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872] bg-[#e8c872]/15 border border-[#e8c872]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#e8c872]" />
                Online Presence Integrations
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">19 Verified Platforms</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              Customize & Embed 'Find Me Everywhere' Links
            </h2>
            <p className="text-xs text-[#a8a7b3] mt-0.5">
              Enter your live profile URLs, toggle platforms on/off, or copy embed code for external directories.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#a8a7b3] hover:text-white bg-[#0a0a0f] border border-[#2a2a38] rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs & Actions Bar */}
        <div className="px-6 py-3 border-b border-[#2a2a38] bg-[#0a0a0f]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'customize'
                  ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                  : 'text-[#a8a7b3] hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Links ({links.filter((l) => l.active).length} Active)</span>
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'embed'
                  ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow'
                  : 'text-[#a8a7b3] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Embed Widget Code</span>
            </button>
          </div>

          {activeTab === 'customize' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToSamples}
                className="px-3 py-1.5 rounded-xl bg-[#14141d] border border-[#e8c872]/40 text-[#e8c872] hover:bg-[#e8c872]/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Populate all platforms with Ghazi Wazir sample links"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use Sample Links</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="btn-gold px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Links</span>
              </button>
            </div>
          )}
        </div>

        {/* Success Notice */}
        {savedNotice && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile links updated and saved to local storage!</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'customize' ? (
            <>
              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
                <span className="text-[#a8a7b3] text-[11px] mr-1">Filter:</span>
                {[
                  { key: 'all', label: 'All Platforms' },
                  { key: 'professional', label: 'Executive & Professional' },
                  { key: 'social', label: 'Social & Messaging' },
                  { key: 'reviews', label: 'Reviews & Directories' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFilterCategory(cat.key as any)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      filterCategory === cat.key
                        ? 'bg-[#2a2a38] text-white font-bold'
                        : 'text-[#a8a7b3] hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* List of Platforms */}
              <div className="space-y-3">
                {filteredLinks.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#0a0a0f] border border-[#2a2a38] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#3d3d52] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                              item.active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {item.active ? 'ACTIVE' : 'MUTED'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#a8a7b3] truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => handleUrlChange(item.id, e.target.value)}
                          placeholder={item.sampleUrl}
                          className="w-full bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#e8c872] pr-8"
                        />
                        {item.url && item.url !== '#' && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a8a7b3] hover:text-[#e8c872]"
                            title="Preview Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                          item.active
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'
                        }`}
                      >
                        {item.active ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Embed Widget Tab */
            <div className="space-y-4">
              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white">Embed Anywhere On The Web</h3>
                    <p className="text-xs text-[#a8a7b3]">
                      Embed Ghazi Wazir's verified social badges grid into your personal blogs, partner portals, or PR media kits.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmbedCode}
                    className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Embed Code'}</span>
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-4 bg-[#14141d] border border-[#2a2a38] rounded-xl text-[11px] font-mono text-[#e8c872] overflow-x-auto leading-relaxed">
                    {embedCodeSnippet}
                  </pre>
                </div>
              </div>

              {/* Direct Embed Link Option */}
              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#e8c872]" />
                  <span>Direct URL Deep-Link:</span>
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/#socials`}
                    className="flex-1 bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/#socials`);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#2a2a38] hover:bg-[#3a3a4c] text-white text-xs font-bold cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2a2a38] bg-[#0a0a0f]/80 flex items-center justify-between text-xs text-[#a8a7b3]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sovereign Storage: Links sync automatically across the website.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2a2a38] hover:bg-[#3d3d52] text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
