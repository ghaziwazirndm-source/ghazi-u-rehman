import React, { useEffect, useState } from 'react';
import { Shield, Settings, Check, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'gw_cookie_preferences_v1';

export const getStoredCookiePreferences = (): CookiePreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    essential: true,
    analytics: false,
    marketing: false,
    updatedAt: '',
  };
};

interface CookieBannerProps {
  onPolicyClick: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onPolicyClick }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setShowBanner(true);
      } else {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalyticsOptIn(parsed.analytics);
        setMarketingOptIn(parsed.marketing);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      // Dispatch custom event so analytics/marketing scripts can listen
      window.dispatchEvent(new CustomEvent('gw_consent_updated', { detail: prefs }));
    } catch {
      // ignore
    }
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleRejectNonEssential = () => {
    saveConsent(false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(analyticsOptIn, marketingOptIn);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent Controls"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 bg-[#14141d]/98 backdrop-blur-xl border border-[#e8c872]/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-xs text-[#a8a7b3] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-[#e8c872]/10 border border-[#e8c872]/30 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-[#e8c872]" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-sm text-white">
            Privacy & Cookie Preferences
          </h4>
          <p className="text-[11px] text-[#a8a7b3] mt-1 leading-relaxed">
            We use strictly essential cookies for site functionality. Non-essential analytics and marketing cookies require your explicit consent under Bahrain personal data protection laws (PDPL) and international standards. Read our{' '}
            <button
              onClick={onPolicyClick}
              className="text-[#e8c872] underline hover:text-white font-medium"
            >
              Cookie Policy
            </button>
            .
          </p>
        </div>
      </div>

      {/* Category Customization Panel */}
      {showPreferences && (
        <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 my-3 space-y-3 animate-in fade-in duration-200">
          {/* Essential */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-xs block">1. Essential Cookies</span>
              <span className="text-[10px] text-[#a8a7b3]">Strictly necessary for security, routing & calendar tokens.</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Always Active
            </span>
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2a2a38]">
            <div>
              <span className="font-bold text-white text-xs block">2. Analytics Cookies</span>
              <span className="text-[10px] text-[#a8a7b3]">Aggregate usage measurement to improve advisory funnels.</span>
            </div>
            <input
              type="checkbox"
              checked={analyticsOptIn}
              onChange={(e) => setAnalyticsOptIn(e.target.checked)}
              className="w-4 h-4 accent-[#e8c872] cursor-pointer"
            />
          </div>

          {/* Marketing */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2a2a38]">
            <div>
              <span className="font-bold text-white text-xs block">3. Marketing & Ad Attribution</span>
              <span className="text-[10px] text-[#a8a7b3]">Attribution pixels for LinkedIn and Meta campaign telemetry.</span>
            </div>
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="w-4 h-4 accent-[#e8c872] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {showPreferences ? (
          <>
            <button
              type="button"
              onClick={handleSaveCustom}
              className="flex-1 py-2 px-3 rounded-full btn-gold text-xs font-bold"
            >
              Save Preferences
            </button>
            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              className="py-2 px-4 rounded-full border border-[#2a2a38] text-white text-xs hover:border-[#a8a7b3]"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="flex-1 py-2 px-3 rounded-full border border-[#2a2a38] text-[#f5f1e8] hover:border-[#e8c872] text-xs font-medium transition-colors"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => setShowPreferences(true)}
              className="py-2 px-3 rounded-full border border-[#2a2a38] text-[#e8c872] hover:border-[#e8c872] text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 py-2 px-3 rounded-full btn-gold text-xs font-bold shadow-md"
            >
              Accept All
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
