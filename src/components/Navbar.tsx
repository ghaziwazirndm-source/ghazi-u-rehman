import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  Globe,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Bot,
  Crown,
  Radio,
  LogIn,
  Layers,
  Settings,
  Database,
} from 'lucide-react';
import regeneratedImage from '../assets/images/regenerated_image_1791099313510.jpg';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../data/i18n';
import { authService } from '../services/AuthService';
import { UserAccount, AppRole } from '../types/auth';
import { normalizeRole } from '../permissions/accessControl';
import { freeApiService } from '../services/FreeApiService';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  currentLang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onOpenVoiceAgent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  currentLang = 'en',
  onLanguageChange,
  onOpenAuth,
  onOpenVoiceAgent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('gw_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('gw_auth_state_changed', handleAuthChange);
  }, []);

  const currentRole: AppRole = currentUser ? normalizeRole(currentUser.role) : 'PUBLIC';

  const [tickerInfo, setTickerInfo] = useState({
    temp: 28,
    cond: 'Sunny',
    time: 'AST Clock',
    isOpen: true,
  });

  useEffect(() => {
    const updateTicker = async () => {
      const w = await freeApiService.fetchManamaWeather();
      const m = freeApiService.getMinistryStatus();
      setTickerInfo({
        temp: w.temperature,
        cond: w.condition,
        time: `${m.localTime} AST`,
        isOpen: m.isOpen,
      });
    };
    updateTicker();
    const interval = setInterval(updateTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUserDropdownOpen(false);
    navigate('');
  };

  const currentLanguageMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Public & Customer Navigation Links
  const customerNavLinks = [
    { label: "Home", route: "" },
    { label: "Bahrain Setup", route: "business-registration" },
    { label: "Tech & SEO", route: "seo" },
    { label: "Packages", route: "packages" },
    { label: "Guides", route: "blog" },
    { label: "About", route: "about" },
    { label: "Contact", route: "contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#2a2a38]/80">
      {/* Real-Time Free APIs Status Ticker Bar */}
      <div className="bg-[#0e0e16] border-b border-[#222230] py-1 px-4 text-[10px] text-[#a8a7b3]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>🇧🇭 Manama AST: {tickerInfo.time}</span>
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="hidden sm:flex items-center gap-1 text-amber-300">
              <span>☀️ {tickerInfo.temp}°C {tickerInfo.cond}</span>
            </span>
            <span className="hidden md:inline text-zinc-700">|</span>
            <span className="hidden md:flex items-center gap-1 text-[#e8c872]">
              <span>💱 1 BHD = $2.66 USD</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#888]">
              {tickerInfo.isOpen ? '🟢 MOIC Sijilat Open' : '🟡 Ministerial Portal Automated'}
            </span>
            <span className="text-zinc-700">|</span>
            <button
              type="button"
              onClick={() => freeApiService.downloadVCard()}
              className="text-[10px] text-[#e8c872] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Download CEO vCard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & CEO Photo */}
        <button
          onClick={() => handleNav("")}
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-full border-2 border-[#e8c872] overflow-hidden shadow-[0_0_15px_rgba(232,200,114,0.25)] group-hover:border-white transition-all">
            <img
              src={regeneratedImage}
              alt="Ghazi Wazir — CEO of Back for Brand LLC and Business Consultant at Bab Al-Khaleej"
              width="40"
              height="40"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-white text-base sm:text-lg tracking-wide group-hover:text-[#e8c872] transition-colors block leading-tight">
              Ghazi Wazir
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#e8c872] font-semibold tracking-wider uppercase">
                Official Site
              </span>
              <span className="w-1 h-1 rounded-full bg-[#e8c872]/60 inline-block" />
              <span className="text-[10px] text-[#a8a7b3] font-medium">
                CEO
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          {customerNavLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.route)}
              className={`text-xs font-medium transition-colors cursor-pointer ${
                currentRoute === link.route
                  ? "text-[#e8c872] font-semibold"
                  : "text-[#a8a7b3] hover:text-[#f5f1e8]"
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-[#a8a7b3] hover:text-white px-2.5 py-1.5 rounded-lg border border-[#2a2a38] bg-[#14141d] cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>{currentLanguageMeta.flag}</span>
              <span className="text-[11px] font-semibold">{currentLanguageMeta.name.slice(0, 2).toUpperCase()}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#14141d] border border-[#2a2a38] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in duration-150">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      if (onLanguageChange) onLanguageChange(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer hover:bg-[#1a1a26] ${
                      currentLang === l.code ? 'text-[#e8c872] font-bold' : 'text-[#a8a7b3]'
                    }`}
                  >
                    <span>{l.flag} {l.name}</span>
                    <span className="text-[10px] text-[#666]">{l.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* NAVIGATION RBAC SEPARATION:                                     */}
          {/* 1. PUBLIC: Show Customer Sign In button                         */}
          {/* 2. USER: Show Customer Dashboard + Profile                      */}
          {/* 3. INTERNAL (STAFF, AGENT, ADMIN, CEO): Show privileged tools    */}
          {/* ============================================================== */}

          {currentRole === 'PUBLIC' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav('login')}
                className="px-3.5 py-1.5 rounded-full border border-[#2a2a38] hover:border-[#e8c872] text-[#e8c872] text-xs font-semibold flex items-center gap-1.5 bg-[#14141d] cursor-pointer transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Client Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('ceo/login')}
                className="px-3 py-1.5 rounded-full border border-[#e8c872]/40 hover:border-[#e8c872] text-[#e8c872] bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent hover:from-amber-500/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_12px_rgba(232,200,114,0.15)]"
                title="CEO Executive Entrance"
              >
                <Crown className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>CEO Login</span>
              </button>
            </div>
          )}

          {currentRole === 'USER' && currentUser && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav('portal')}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  currentRoute === 'portal'
                    ? 'border-[#e8c872] bg-[#e8c872]/20 text-[#e8c872]'
                    : 'border-[#2a2a38] hover:border-[#e8c872] text-white bg-[#14141d]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>My Dashboard</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#2a2a38] bg-[#14141d] hover:border-[#e8c872] transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#e8c872] text-[#0a0a0f] font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#a8a7b3]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#14141d] border border-[#2a2a38] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150 text-left">
                    <div className="px-3 py-2 border-b border-[#2a2a38] mb-1">
                      <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-[#a8a7b3] truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Client Account
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('portal')}
                      className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-[#e8c872]" />
                      <span>My Documents & Status</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 cursor-pointer pt-2 border-t border-[#2a2a38]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INTERNAL_NAV: CEO ROLE */}
          {currentRole === 'CEO' && currentUser && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav('ceo')}
                className="px-3 py-1.5 rounded-full border border-[#e8c872] bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-[#e8c872] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(232,200,114,0.25)]"
                title="CEO Executive Cockpit"
              >
                <Crown className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>CEO Cockpit</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#e8c872]/40 bg-[#14141d] hover:border-[#e8c872] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#e8c872] text-[#0a0a0f] font-bold text-xs flex items-center justify-center">
                    G
                  </div>
                  <span className="text-xs font-bold text-[#e8c872]">CEO</span>
                  <ChevronDown className="w-3 h-3 text-[#a8a7b3]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#14141d] border border-[#2a2a38] rounded-2xl shadow-2xl p-2 z-50 text-left">
                    <div className="px-3 py-2 border-b border-[#2a2a38] mb-1">
                      <div className="font-bold text-xs text-white">Ghazi Wazir</div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#e8c872] border border-amber-500/30">
                        CHIEF EXECUTIVE OFFICER
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('ceo')}
                      className="w-full text-left px-3 py-2 text-xs text-[#e8c872] hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>CEO Cockpit & Financials</span>
                    </button>

                    <button
                      onClick={() => handleNav('admin')}
                      className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Admin Console & CRM</span>
                    </button>

                    <button
                      onClick={() => handleNav('live-agent')}
                      className="w-full text-left px-3 py-2 text-xs text-cyan-300 hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Live Agent Desk</span>
                    </button>

                    <button
                      onClick={() => handleNav('settings')}
                      className="w-full text-left px-3 py-2 text-xs text-[#e8c872] hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#e8c872]" />
                      <span>Settings & Configuration Options</span>
                    </button>

                    <button
                      onClick={() => handleNav('database')}
                      className="w-full text-left px-3 py-2 text-xs text-emerald-300 hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cloud Database (Firestore)</span>
                    </button>

                    <button
                      onClick={() => handleNav('domain')}
                      className="w-full text-left px-3 py-2 text-xs text-purple-300 hover:bg-[#1a1a26] rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Hostinger Custom Domain</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 cursor-pointer pt-2 border-t border-[#2a2a38]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INTERNAL_NAV: ADMIN ROLE */}
          {currentRole === 'ADMIN' && currentUser && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="px-3 py-1.5 rounded-full border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#2a2a38] bg-[#14141d]"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#a8a7b3]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#14141d] border border-[#2a2a38] rounded-2xl shadow-2xl p-2 z-50 text-left">
                    <div className="px-3 py-2 border-b border-[#2a2a38] mb-1">
                      <div className="font-bold text-xs text-white">{currentUser.name}</div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        SYSTEM ADMIN
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('admin')}
                      className="w-full text-left px-3 py-2 text-xs text-cyan-300 hover:bg-[#1a1a26] rounded-xl flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Console & CRM</span>
                    </button>

                    <button
                      onClick={() => handleNav('live-agent')}
                      className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a1a26] rounded-xl flex items-center gap-2"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Live Agent Desk</span>
                    </button>

                    <button
                      onClick={() => handleNav('settings')}
                      className="w-full text-left px-3 py-2 text-xs text-cyan-300 hover:bg-[#1a1a26] rounded-xl flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Settings & Configuration Options</span>
                    </button>

                    <button
                      onClick={() => handleNav('domain')}
                      className="w-full text-left px-3 py-2 text-xs text-purple-300 hover:bg-[#1a1a26] rounded-xl flex items-center gap-2"
                    >
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Hostinger Custom Domain</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 pt-2 border-t border-[#2a2a38]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INTERNAL_NAV: AGENT & STAFF ROLE */}
          {(currentRole === 'AGENT' || currentRole === 'STAFF') && currentUser && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav('live-agent')}
                className="px-3 py-1.5 rounded-full border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Agent Desk</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* LIVE AI VOICE AGENT BUTTON (CUSTOMER-FACING DIGITAL TWIN) */}
          <button
            type="button"
            onClick={onOpenVoiceAgent}
            className="px-3.5 py-1.5 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 hover:from-cyan-900/60 hover:to-emerald-900/60 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all hover:scale-105"
            title="Talk Live with Ghazi Wazir's AI Voice Agent"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Talk to CEO AI</span>
          </button>

          <button
            onClick={() => handleNav("book")}
            className="btn-gold px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Consultation</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => {
              const nextIndex = (SUPPORTED_LANGUAGES.findIndex((l) => l.code === currentLang) + 1) % SUPPORTED_LANGUAGES.length;
              if (onLanguageChange) onLanguageChange(SUPPORTED_LANGUAGES[nextIndex].code);
            }}
            className="p-1.5 text-xs rounded-lg border border-[#2a2a38] bg-[#14141d] flex items-center gap-1"
          >
            <span>{currentLanguageMeta.flag}</span>
          </button>

          {currentRole === 'USER' && (
            <button
              onClick={() => handleNav('portal')}
              className="w-8 h-8 rounded-full bg-[#e8c872] text-[#0a0a0f] font-bold text-xs flex items-center justify-center shadow"
              title="My Dashboard"
            >
              {currentUser?.name.charAt(0)}
            </button>
          )}

          {currentRole === 'CEO' && (
            <button
              onClick={() => handleNav('ceo')}
              className="w-8 h-8 rounded-full bg-[#e8c872] text-[#0a0a0f] font-bold text-xs flex items-center justify-center shadow"
              title="CEO Cockpit"
            >
              👑
            </button>
          )}

          <button
            onClick={() => handleNav("book")}
            className="btn-gold px-3 py-1.5 text-[11px] font-semibold rounded-full flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            <span>Book</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#a8a7b3] hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0f]/98 border-b border-[#2a2a38] px-4 pt-2 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {customerNavLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.route)}
                className={`py-2 text-left text-sm font-medium border-b border-[#2a2a38]/40 flex items-center justify-between ${
                  currentRoute === link.route ? "text-[#e8c872]" : "text-[#a8a7b3]"
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </button>
            ))}

            {/* Mobile Auth Options */}
            {currentRole === 'PUBLIC' && (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className="py-2.5 text-left text-sm font-semibold text-[#e8c872] flex items-center gap-2 border-b border-[#2a2a38]/40"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Client Sign In</span>
                </button>
                <button
                  onClick={() => handleNav('ceo/login')}
                  className="py-2.5 text-left text-sm font-semibold text-[#e8c872] flex items-center gap-2 border-b border-[#2a2a38]/40"
                >
                  <Crown className="w-4 h-4 text-[#e8c872]" />
                  <span>CEO Executive Login</span>
                </button>
              </>
            )}

            {currentRole === 'USER' && (
              <>
                <button
                  onClick={() => handleNav('portal')}
                  className="py-2.5 text-left text-sm font-semibold text-[#e8c872] flex items-center justify-between border-b border-[#2a2a38]/40"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>My Dashboard & Filings</span>
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-xs font-semibold text-red-400 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {currentRole === 'CEO' && (
              <>
                <button
                  onClick={() => handleNav('ceo')}
                  className="py-2.5 text-left text-sm font-semibold text-[#e8c872] flex items-center gap-2 border-b border-[#2a2a38]/40"
                >
                  <Crown className="w-4 h-4" />
                  <span>CEO Executive Cockpit</span>
                </button>
                <button
                  onClick={() => handleNav('admin')}
                  className="py-2 text-left text-xs text-[#a8a7b3] flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-xs font-semibold text-red-400 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            <div className="pt-4 border-t border-[#2a2a38] flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVoiceAgent?.();
                }}
                className="w-full py-2.5 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-950/70 to-emerald-950/70 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Talk to CEO AI (Voice Agent)</span>
              </button>

              <button
                onClick={() => handleNav("book")}
                className="btn-gold w-full py-3 text-center text-sm font-semibold rounded-full flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Free Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
