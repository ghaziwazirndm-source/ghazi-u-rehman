import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MessageSquare,
  Mail,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  FileText,
  Users,
  Zap,
  Radio,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingCalendar } from './components/BookingCalendar';
import { CookieBanner } from './components/CookieBanner';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { ServiceDetailView } from './components/ServiceDetailView';
import { GuideDetailView } from './components/GuideDetailView';
import { BlogListView } from './components/BlogListView';
import { PackagesView } from './components/PackagesView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { LegalView } from './components/LegalView';
import { VslFunnelView } from './components/VslFunnelView';
import { FunnelsListView } from './components/FunnelsListView';
import { ApplyView } from './components/ApplyView';
import { ThankYouView } from './components/ThankYouView';
import { RoleBadge } from './components/RoleBadge';
import { CeoPortrait } from './components/CeoPortrait';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { ClientPortalView } from './components/ClientPortalView';
import { AiVoiceAgentModal } from './components/AiVoiceAgentModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AccessDeniedView } from './components/AccessDeniedView';
import { CeoExecutivePortal } from './components/CeoExecutivePortal';
import { LiveAgentDashboard } from './components/LiveAgentDashboard';
import { CeoLoginView } from './components/CeoLoginView';
import { AdminLoginView } from './components/AdminLoginView';
import { AgentLoginView } from './components/AgentLoginView';
import { SecurityTestPanel } from './components/SecurityTestPanel';
import regeneratedImage from './assets/images/regenerated_image_1791099313510.jpg';
import { authService } from './services/AuthService';
import { UserAccount } from './types/auth';
import { LanguageCode, getTranslation } from './data/i18n';
import { getStoredSocialLinks, SocialLinkItem } from './data/socialLinksStore';
import { SocialLinksManagerModal } from './components/SocialLinksManagerModal';
import { GlobalReachMapVisualization } from './components/GlobalReachMapVisualization';
import { getStoredSystemConfig, SystemConfig } from './data/systemConfigStore';
import { Sliders } from 'lucide-react';

import {
  GHAZI_INFO,
  BAHRAIN_SERVICES,
  TECH_SERVICES,
  GUIDES,
  ServiceItem,
  GuideItem,
} from './data/content';
import { BahrainHubView } from './components/BahrainHubView';
import { TechHubView } from './components/TechHubView';
import { NotFoundView } from './components/NotFoundView';
import { trackWhatsAppClick, trackPageView } from './utils/analytics';

export default function App() {
  const getCleanPathFromLocation = (): string => {
    if (typeof window === 'undefined') return '';
    // If old hash link like #/about, clean it and update history
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const fromHash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
      window.history.replaceState(null, '', fromHash ? `/${fromHash}` : '/');
      return fromHash;
    }
    return window.location.pathname.replace(/^\/|\/$/g, '');
  };

  const [route, setRoute] = useState<string>(getCleanPathFromLocation);

  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() => getStoredSocialLinks());
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => getStoredSystemConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setSocialLinks(getStoredSocialLinks());
    };
    const handleSysConfigUpdate = (e: any) => {
      if (e?.detail) setSystemConfig(e.detail);
      else setSystemConfig(getStoredSystemConfig());
    };
    window.addEventListener('gw_social_links_updated', handleUpdate);
    window.addEventListener('gw_system_config_updated', handleSysConfigUpdate);
    return () => {
      window.removeEventListener('gw_social_links_updated', handleUpdate);
      window.removeEventListener('gw_system_config_updated', handleSysConfigUpdate);
    };
  }, []);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('gw_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('gw_auth_state_changed', handleAuthChange);
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    const isRtl = lang === 'ar' || lang === 'ur';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const handlePopState = () => {
      const cleanRoute = getCleanPathFromLocation();
      setRoute(cleanRoute);
      trackPageView(window.location.pathname, document.title);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newRoute: string) => {
    const clean = newRoute.replace(/^#\/?/, '').replace(/^\//, '').replace(/\/$/, '');
    const targetUrl = clean ? `/${clean}` : '/';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    setRoute(clean);
    trackPageView(targetUrl, document.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Intercept standard internal links for single-page client transitions
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        e.preventDefault();
        navigate(href);
      }
    };
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  // Check if route is an admin / CRM route
  const isAdminRoute = [
    'admin',
    'dashboard',
    'crm',
    'integrations',
    'analytics',
    'tenants',
    'security',
    'settings',
    'configuration',
    'config',
    'options',
    'system-settings',
    'diagnostics',
    'agents',
    'army',
    'ai-agents',
    'agents-army',
    'ceo-agents',
    'ceo-dashboard',
    'ceo',
  ].includes(route);

  // Hub Routes
  const isBahrainHub = route === 'bahrain-business-setup';
  const isTechHub = route === 'technology-services';

  // Check if current route matches a service (supports /bahrain-business-setup/:id, /technology-services/:id, or legacy :id)
  const serviceSlug = route.startsWith('bahrain-business-setup/')
    ? route.replace('bahrain-business-setup/', '')
    : route.startsWith('technology-services/')
    ? route.replace('technology-services/', '')
    : route;

  const matchedBahrainService = BAHRAIN_SERVICES.find((s) => s.id === serviceSlug);
  const matchedTechService = TECH_SERVICES.find((s) => s.id === serviceSlug);
  const matchedService = (route.startsWith('bahrain-business-setup/') || route.startsWith('technology-services/') || BAHRAIN_SERVICES.some((s) => s.id === route) || TECH_SERVICES.some((s) => s.id === route))
    ? (matchedBahrainService || matchedTechService)
    : null;

  // Check if current route is a VSL funnel: e.g. "vsl-business-registration" or "vsl-seo"
  const isVsl = route.startsWith('vsl-');
  const vslId = isVsl ? route.replace('vsl-', '') : '';
  const matchedVslService = isVsl
    ? (BAHRAIN_SERVICES.find((s) => s.id === vslId) || TECH_SERVICES.find((s) => s.id === vslId))
    : null;

  // Check if current route matches a guide (supports /blog/:slug, /guide-:slug, or :slug)
  const guideSlug = route.startsWith('blog/')
    ? route.replace('blog/', '')
    : route.startsWith('guide-')
    ? route.replace('guide-', '')
    : route;

  const matchedGuide = (route.startsWith('blog/') || route.startsWith('guide-') || GUIDES.some((g) => g.id === route))
    ? GUIDES.find((g) => g.id === `guide-${guideSlug}` || g.id === guideSlug)
    : null;

  // Legal routes
  const isLegalRoute = [
    'privacy',
    'privacy-policy',
    'terms',
    'terms-of-service',
    'disclaimer',
    'cookie-policy',
  ].includes(route);

  const legalType: 'privacy-policy' | 'terms-of-service' | 'disclaimer' | 'cookie-policy' =
    route === 'privacy' || route === 'privacy-policy'
      ? 'privacy-policy'
      : route === 'terms' || route === 'terms-of-service'
      ? 'terms-of-service'
      : route === 'cookie-policy'
      ? 'cookie-policy'
      : 'disclaimer';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f1e8] relative selection:bg-[#e8c872]/30 selection:text-[#e8c872]">
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Persistent Navigation */}
      <Navbar
        currentRoute={route}
        navigate={navigate}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenVoiceAgent={() => setIsVoiceModalOpen(true)}
      />

      {/* Main View Switcher with Strict ProtectedRoute Guards */}
      <main>
        {/* Dedicated Internal Authentication Routes */}
        {['ceo/login', 'ceo-login', 'ceologin', 'ceo_login', 'ceo/entrance', 'ceo-signin'].includes(route) ? (
          <CeoLoginView navigate={navigate} />
        ) : ['admin/login', 'admin-login', 'adminlogin', 'admin_login'].includes(route) ? (
          <AdminLoginView navigate={navigate} />
        ) : ['agent/login', 'agent-login', 'agentlogin'].includes(route) ? (
          <AgentLoginView navigate={navigate} />
        ) : /* 1. Strict CEO Portal Route (Role === 'CEO' only) */
        ['ceo', 'ceo/cockpit', 'ceo-dashboard', 'cockpit'].includes(route) ? (
          <ProtectedRoute allowedRoles={['CEO']} currentRoute={route} navigate={navigate}>
            <CeoExecutivePortal navigate={navigate} />
          </ProtectedRoute>
        ) : /* CEO Hostinger Domain Control */
        ['ceo/domain', 'ceo-domain', 'ceo-hostinger'].includes(route) ? (
          <ProtectedRoute allowedRoles={['CEO']} currentRoute={route} navigate={navigate}>
            <CeoExecutivePortal navigate={navigate} initialTab="domain" />
          </ProtectedRoute>
        ) : /* 2. Strict 25 AI Agents Fleet Control (Role === 'CEO' only) */
        ['agents', 'army', 'ai-agents', 'agents-army', 'ceo-agents'].includes(route) ? (
          <ProtectedRoute allowedRoles={['CEO']} currentRoute={route} navigate={navigate}>
            <CeoExecutivePortal navigate={navigate} initialTab="agents" />
          </ProtectedRoute>
        ) : /* 3. Strict Live Agent Desk Route (Roles === AGENT, STAFF, ADMIN, CEO) */
        route === 'live-agent' || route === 'agent' ? (
          <ProtectedRoute allowedRoles={['AGENT', 'STAFF', 'ADMIN', 'CEO']} currentRoute={route} navigate={navigate}>
            <LiveAgentDashboard navigate={navigate} />
          </ProtectedRoute>
        ) : /* 4. Strict Admin Console & CRM Routes (Roles === ADMIN, CEO) */
        [
          'admin',
          'dashboard',
          'crm',
          'automation',
          'integrations',
          'analytics',
          'tenants',
          'security',
          'settings',
          'configuration',
          'config',
          'options',
          'system-settings',
          'diagnostics',
          'database',
          'db',
          'firestore',
          'data',
          'detabeas',
          'domain',
          'hostinger',
          'custom-domain',
          'dns',
        ].includes(route) ? (
          <ProtectedRoute allowedRoles={['ADMIN', 'CEO']} currentRoute={route} navigate={navigate}>
            <AdminDashboard
              navigate={navigate}
              currentRoute={route}
              initialTab={
                ['domain', 'hostinger', 'custom-domain', 'dns'].includes(route)
                  ? 'domain'
                  : ['database', 'db', 'firestore', 'data', 'detabeas'].includes(route)
                  ? 'database'
                  : ['settings', 'configuration', 'config', 'options', 'system-settings', 'automation'].includes(route)
                  ? 'settings'
                  : route === 'crm'
                  ? 'crm'
                  : route === 'diagnostics'
                  ? 'diagnostics'
                  : route === 'integrations'
                  ? 'integrations'
                  : route === 'analytics'
                  ? 'analytics'
                  : route === 'tenants'
                  ? 'tenants'
                  : route === 'security'
                  ? 'security'
                  : undefined
              }
            />
          </ProtectedRoute>
        ) : route === 'portal' ? (
          currentUser ? (
            <ClientPortalView
              user={currentUser}
              navigate={navigate}
              onLogout={() => {
                authService.logout();
                navigate('');
              }}
            />
          ) : (
            <AuthView navigate={navigate} initialMode="login" />
          )
        ) : route === 'login' ? (
          <AuthView navigate={navigate} initialMode="login" />
        ) : route === 'signup' || route === 'register' ? (
          <AuthView navigate={navigate} initialMode="signup" />
        ) : matchedVslService ? (
          <VslFunnelView service={matchedVslService} navigate={navigate} />
        ) : route === 'funnels' ? (
          <FunnelsListView navigate={navigate} />
        ) : route === 'apply' ? (
          <ApplyView navigate={navigate} />
        ) : route === 'thank-you' ? (
          <ThankYouView navigate={navigate} />
        ) : isBahrainHub ? (
          <BahrainHubView navigate={navigate} />
        ) : isTechHub ? (
          <TechHubView navigate={navigate} />
        ) : matchedService ? (
          <ServiceDetailView
            service={matchedService}
            relatedServices={
              matchedService.category === 'bahrain'
                ? BAHRAIN_SERVICES.filter((s) => s.id !== matchedService.id)
                : TECH_SERVICES.filter((s) => s.id !== matchedService.id)
            }
            navigate={navigate}
          />
        ) : matchedGuide ? (
          <GuideDetailView
            guide={matchedGuide}
            otherGuides={GUIDES.filter((g) => g.id !== matchedGuide.id)}
            navigate={navigate}
          />
        ) : route === 'blog' ? (
          <BlogListView navigate={navigate} />
        ) : route === 'packages' ? (
          <PackagesView navigate={navigate} />
        ) : route === 'about' ? (
          <AboutView navigate={navigate} />
        ) : route === 'contact' ? (
          <ContactView navigate={navigate} />
        ) : route === 'book' ? (
          <ApplyView navigate={navigate} />
        ) : isLegalRoute ? (
          <LegalView type={legalType} navigate={navigate} />
        ) : route === '' ? (
          /* HOME VIEW */
          <div>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 border-b border-[#2a2a38]/60">
              {/* Decorative Glowing Orbs */}
              <div className="absolute -right-24 top-10 w-96 h-96 bg-[#b8893a]/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
              <div className="absolute -left-24 bottom-0 w-80 h-80 bg-[#3a2a7a]/30 rounded-full blur-[90px] pointer-events-none"></div>

              {/* Floating Emblems */}
              <span className="hidden sm:block absolute left-[8%] top-[30%] text-3xl opacity-40 select-none animate-float pointer-events-none">
                🌍
              </span>
              <span className="hidden sm:block absolute right-[10%] top-[18%] text-3xl opacity-40 select-none animate-float pointer-events-none [animation-delay:-2s]">
                💼
              </span>
              <span className="hidden sm:block absolute left-[12%] bottom-[12%] text-3xl opacity-40 select-none animate-float pointer-events-none [animation-delay:-4s]">
                🤖
              </span>
              <span className="hidden sm:block absolute right-[14%] bottom-[10%] text-3xl opacity-40 select-none animate-float pointer-events-none [animation-delay:-1s]">
                📈
              </span>

              <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Column: Headline and Call-to-actions */}
                  <div className="lg:col-span-7 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
                      <span>🇺🇸 CEO · Back for Brand (USA) &amp; 🇧🇭 Consultant · Bab Al-Khaleej (Bahrain)</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6">
                      Your business in Bahrain,{' '}
                      <span className="gold">powered by technology.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-[#a8a7b3] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                      CEO of Back for Brand LLC (Florida, USA) delivering global technology, SEO, AEO, GEO, and AI automation, and business consultant at Bab Al-Khaleej (Kingdom of Bahrain) delivering company formation, investor and worker visas, document clearance, and active ministry application tracking.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                      <button
                        onClick={() => navigate('book')}
                        className="btn-gold w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book a Free Consultation</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Hero Portrait */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-64 sm:w-72 lg:w-80 aspect-square">
                      {/* Decorative outer rotated border */}
                      <div className="absolute inset-0 rounded-3xl border border-[#b8893a] rotate-6 transition-transform hover:rotate-0 duration-700 pointer-events-none"></div>

                      <CeoPortrait size="hero" rounded="3xl" />

                      {/* Animated Sliding Role Badge */}
                      <RoleBadge />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TRUST BAR */}
            <div className="bg-[#101018] border-b border-[#2a2a38] py-6">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="p-2 transition-transform hover:-translate-y-1">
                    <span className="text-2xl mb-1 block">🇧🇭</span>
                    <strong className="block text-[#e8c872] font-serif text-lg font-bold">Bahrain</strong>
                    <span className="text-xs text-[#a8a7b3]">Registration & visas</span>
                  </div>
                  <div className="p-2 transition-transform hover:-translate-y-1">
                    <span className="text-2xl mb-1 block">🇺🇸</span>
                    <strong className="block text-[#e8c872] font-serif text-lg font-bold">Florida LLC</strong>
                    <span className="text-xs text-[#a8a7b3]">Registered in USA</span>
                  </div>
                  <div className="p-2 transition-transform hover:-translate-y-1">
                    <span className="text-2xl mb-1 block">🌍</span>
                    <strong className="block text-[#e8c872] font-serif text-lg font-bold">Worldwide</strong>
                    <span className="text-xs text-[#a8a7b3]">Technology services</span>
                  </div>
                  <div className="p-2 transition-transform hover:-translate-y-1">
                    <span className="text-2xl mb-1 block">✅</span>
                    <strong className="block text-[#e8c872] font-serif text-lg font-bold">Tracked</strong>
                    <span className="text-xs text-[#a8a7b3]">Every application</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICES SECTION */}
            <section id="services" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
              {/* Part A: Bahrain Business Setup */}
              <div className="mb-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
                  <div>
                    <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
                      🇧🇭 Bab Al-Khaleej · Business Consultancy
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                      🏛️ Start & Stay <span className="gold">Compliant in Bahrain</span>
                    </h2>
                    <p className="text-base text-[#a8a7b3] max-w-2xl mt-2">
                      Everything you need to register, license, staff, and run your company in Bahrain with complete regulatory peace of mind.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('funnels')}
                    className="btn-outline-gold px-4 py-2 text-xs font-semibold rounded-full mt-4 sm:mt-0 flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <span>🎯 Explore VSL Funnels</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {BAHRAIN_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(s.id)}
                      aria-label={`Explore ${s.title}`}
                      className="card-luxury p-6 text-left flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">
                          {s.emoji}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-[#e8c872] group-hover:text-white transition-colors mb-2">
                          {s.title}
                        </h3>
                        <p className="text-sm text-[#a8a7b3] leading-relaxed">
                          {s.lead}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#e8c872] mt-6 pt-3 border-t border-[#2a2a38]/60">
                        <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                          Learn more<span className="sr-only"> about {s.title}</span> &rarr;
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`vsl-${s.id}`);
                          }}
                          className="text-[11px] text-[#a8a7b3] hover:text-[#e8c872] bg-[#101018] px-2.5 py-1 rounded-md border border-[#2a2a38] transition-colors"
                        >
                          🎯 Sales Funnel
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE OPERATIONS MAP: GLOBAL REACH (USA) VS. LOCAL BAHRAIN */}
              <GlobalReachMapVisualization
                onNavigateService={(id) => navigate(id)}
                onOpenConsultation={() => navigate('book')}
              />

              {/* Part B: Global Technology Services */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#14141d] border border-[#e8c872]/40 p-1 flex items-center justify-center shadow-md shrink-0">
                        <img
                          src={GHAZI_INFO.logoUrl}
                          alt="Back for Brand LLC Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#00C98D] bg-[#00C98D]/10 border border-[#00C98D]/25 px-3 py-1 rounded-full">
                        Back for Brand LLC (Florida, USA) · Technology Services Worldwide
                      </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
                      📈 Scale Online, <span className="gold">Anywhere in the World</span>
                    </h2>
                    <p className="text-base text-[#a8a7b3] max-w-2xl">
                      High-intent organic SEO, Generative AI Search (GEO & AEO for ChatGPT, Perplexity, Gemini), custom AI agents, and automated conversion funnels.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('funnels')}
                    className="btn-outline-gold px-4 py-2 text-xs font-semibold rounded-full mt-4 sm:mt-0 flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <span>🎯 Explore Tech Funnels</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TECH_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(s.id)}
                      aria-label={`Explore ${s.title}`}
                      className="card-luxury p-6 text-left flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">
                          {s.emoji}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-[#e8c872] group-hover:text-white transition-colors mb-2">
                          {s.title}
                        </h3>
                        <p className="text-sm text-[#a8a7b3] leading-relaxed">
                          {s.lead}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-[#e8c872] mt-6 pt-3 border-t border-[#2a2a38]/60">
                        <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                          Learn more<span className="sr-only"> about {s.title}</span> &rarr;
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`vsl-${s.id}`);
                          }}
                          className="text-[11px] text-[#a8a7b3] hover:text-[#e8c872] bg-[#101018] px-2.5 py-1 rounded-md border border-[#2a2a38] transition-colors"
                        >
                          🎯 Sales Funnel
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* PROCESS SECTION */}
            <section className="bg-[#101018] border-y border-[#2a2a38] py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-14">
                  <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
                    Methodology
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                    🧭 A Simple, <span className="gold">Transparent</span> Process
                  </h2>
                  <p className="text-base text-[#a8a7b3]">
                    Clear steps, predictable timelines, and no surprises.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card-luxury p-6 relative">
                    <span className="font-serif font-bold text-4xl text-[#b8893a]/50 block mb-2">
                      01
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
                      Discovery
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a8a7b3]">
                      We map your business goals, licensing needs, budget, and ideal launch timeline.
                    </p>
                  </div>

                  <div className="card-luxury p-6 relative">
                    <span className="font-serif font-bold text-4xl text-[#b8893a]/50 block mb-2">
                      02
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
                      Register
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a8a7b3]">
                      Your Bahrain company, licenses, attestations, and visas are filed meticulously.
                    </p>
                  </div>

                  <div className="card-luxury p-6 relative">
                    <span className="font-serif font-bold text-4xl text-[#b8893a]/50 block mb-2">
                      03
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
                      Track
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a8a7b3]">
                      Every submission is monitored daily until final official commercial registration approval.
                    </p>
                  </div>

                  <div className="card-luxury p-6 relative">
                    <span className="font-serif font-bold text-4xl text-[#b8893a]/50 block mb-2">
                      04
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#e8c872] mb-1">
                      Grow
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a8a7b3]">
                      Deploy AI agents, SEO/GEO rankings, and marketing funnels to capture customers worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* REVIEWS & TESTIMONIALS */}
            <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
                  Verified Client Trust
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                  ⭐ What Clients <span className="gold">Say</span>
                </h2>
                <p className="text-base text-[#a8a7b3]">
                  Direct feedback from founders and business operators who partnered with Ghazi Wazir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-luxury p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#e8c872] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#e8c872]" />
                      ))}
                    </div>
                    <blockquote className="text-sm sm:text-base text-white/90 leading-relaxed italic mb-6">
                      "Ghazi handled our commercial registration and partner visas in Bahrain with complete precision. No delays, proactive WhatsApp updates, and total transparency on government fees."
                    </blockquote>
                  </div>
                  <div className="pt-4 border-t border-[#2a2a38]">
                    <strong className="block text-sm font-bold text-[#e8c872]">Kareem Mansoor</strong>
                    <span className="text-xs text-[#a8a7b3]">Managing Director, Logistics Co · Bahrain</span>
                  </div>
                </div>

                <div className="card-luxury p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#e8c872] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#e8c872]" />
                      ))}
                    </div>
                    <blockquote className="text-sm sm:text-base text-white/90 leading-relaxed italic mb-6">
                      "Back for Brand transformed our organic search results. Within three months we were ranking on page one for commercial search terms and being cited by Perplexity AI."
                    </blockquote>
                  </div>
                  <div className="pt-4 border-t border-[#2a2a38]">
                    <strong className="block text-sm font-bold text-[#e8c872]">David Richardson</strong>
                    <span className="text-xs text-[#a8a7b3]">Co-Founder, B2B SaaS · United States</span>
                  </div>
                </div>

                <div className="card-luxury p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#e8c872] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#e8c872]" />
                      ))}
                    </div>
                    <blockquote className="text-sm sm:text-base text-white/90 leading-relaxed italic mb-6">
                      "The custom AI agent Ghazi built for our client onboarding automatically qualifies leads 24/7 on WhatsApp and books calendar calls. It saves our team 15+ hours every week."
                    </blockquote>
                  </div>
                  <div className="pt-4 border-t border-[#2a2a38]">
                    <strong className="block text-sm font-bold text-[#e8c872]">Dr. Farah Al-Khatib</strong>
                    <span className="text-xs text-[#a8a7b3]">Executive Director, Healthcare Group · GCC</span>
                  </div>
                </div>
              </div>
            </section>

            {/* LATEST GUIDES SECTION */}
            <section className="bg-[#101018] border-t border-[#2a2a38] py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                  <div>
                    <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
                      Knowledge Base
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                      📚 Latest Guides & Insights
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('blog')}
                    className="text-sm font-semibold text-[#e8c872] hover:underline mt-4 sm:mt-0 flex items-center gap-1"
                  >
                    <span>View all {GUIDES.length} guides</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {GUIDES.slice(0, 3).map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => navigate(guide.id)}
                      className="card-luxury p-6 text-left flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-3xl mb-3 block">{guide.emoji}</span>
                        <h3 className="text-lg font-serif font-bold text-[#e8c872] group-hover:text-white transition-colors mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#a8a7b3] leading-relaxed line-clamp-3">
                          {guide.summary}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#e8c872] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read guide &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* SOCIAL AND PLATFORMS DIRECTORY */}
            <section id="socials" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                <div className="text-left">
                  <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-2">
                    Verified Ecosystem
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-1">
                    🌐 Find Me Everywhere Online
                  </h2>
                  <p className="text-sm text-[#a8a7b3]">
                    Connect with Ghazi Wazir across professional networks, social profiles, and industry directories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(true)}
                  className="btn-gold px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform shrink-0"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Customize & Embed Links</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.active && item.url && item.url !== '#' ? item.url : '#'}
                    target={item.active && item.url && item.url !== '#' ? "_blank" : undefined}
                    rel={item.active && item.url && item.url !== '#' ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!item.active || !item.url || item.url === '#') {
                        e.preventDefault();
                        setIsSocialModalOpen(true);
                      }
                    }}
                    className={`p-3 rounded-xl border border-[#2a2a38] bg-[#14141d] hover:border-[#e8c872] flex items-center gap-2.5 transition-all text-xs font-medium text-[#f5f1e8] group ${
                      !item.active ? "opacity-50 hover:opacity-100" : ""
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate text-left">
                      <span className="truncate block group-hover:text-[#e8c872] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[#777] block truncate">
                        {item.handle}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Social Links Manager Modal */}
            <SocialLinksManagerModal
              isOpen={isSocialModalOpen}
              onClose={() => setIsSocialModalOpen(false)}
            />

            {/* FINAL CTA SECTION */}
            <section className="bg-gradient-to-b from-[#14141d] to-[#0a0a0f] border-t border-[#2a2a38] py-20 text-center relative overflow-hidden">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative mb-3">
                    <CeoPortrait size="md" rounded="full" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0a0a0f]">
                      <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-[#0a0a0f]" />
                    </div>
                  </div>
                  <strong className="text-white text-lg font-serif">Ghazi Wazir</strong>
                  <span className="text-xs text-[#e8c872] font-medium">
                    CEO, Back for Brand (USA) &amp; Business Consultant, Bab Al-Khaleej (Bahrain)
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
                  Ready to Launch <span className="gold">with Confidence?</span>
                </h2>
                <p className="text-base sm:text-lg text-[#a8a7b3] leading-relaxed max-w-xl mx-auto mb-8">
                  Tell me about your business goals and I will respond with a clear regulatory plan, document checklist, and next steps.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('book')}
                    className="btn-gold px-8 py-3.5 text-sm font-semibold rounded-full flex items-center gap-2 shadow-2xl"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book a Call</span>
                  </button>

                  <a
                    href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Ghazi, I would like to discuss my business.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('final_cta_button')}
                    className="btn-outline-gold px-6 py-3.5 text-sm rounded-full flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Me</span>
                  </a>

                  <a
                    href={`mailto:${GHAZI_INFO.email}`}
                    className="btn-outline-gold px-6 py-3.5 text-sm rounded-full flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Me</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* 404 NOT FOUND VIEW */
          <NotFoundView navigate={navigate} />
        )}
      </main>

      {/* Floating WhatsApp Action Button with Pulse Effect (Embedded Integration) */}
      {systemConfig.integrations?.whatsapp?.embeddedWidgetActive !== false && (
        <a
          href={`https://wa.me/${(systemConfig.integrations?.whatsapp?.customDirectNumber || GHAZI_INFO.whatsappNumber).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            systemConfig.integrations?.whatsapp?.defaultPrefilledMessage ||
              'Hello Ghazi Wazir, I would like to consult on business services in Bahrain and global tech solutions.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp Chat with Ghazi Wazir"
          onClick={() => trackWhatsAppClick('floating_button')}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl wa-pulse hover:scale-110 transition-transform cursor-pointer"
        >
          <MessageSquare className="w-7 h-7 fill-white" />
        </a>
      )}

      {/* Floating Gemini 3.8 Live Voice Agent Button (CEO AI Voice Twin) */}
      <button
        type="button"
        onClick={() => setIsVoiceModalOpen(true)}
        aria-label="Talk Live with Ghazi Wazir AI Voice Agent"
        className="fixed bottom-6 left-6 z-40 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#14141d]/95 backdrop-blur-md border-2 border-cyan-400 text-cyan-300 flex items-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:scale-105 transition-all cursor-pointer group"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full border border-cyan-400 overflow-hidden">
            <img
              src={regeneratedImage}
              alt="Ghazi Wazir CEO AI"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
            <span>Gemini 3.8 Live</span>
          </div>
          <div className="text-xs font-serif font-bold text-white group-hover:text-cyan-300">
            Talk to CEO AI
          </div>
        </div>
      </button>

      {/* Persistent Footer */}
      <Footer navigate={navigate} />

      {/* Cookie Consent Banner */}
      <CookieBanner onPolicyClick={() => navigate('cookie-policy')} />

      {/* Sovereign Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authModalMode}
          navigate={navigate}
        />
      )}

      {/* Gemini 3.8 Live API Voice Agent Modal */}
      {isVoiceModalOpen && (
        <AiVoiceAgentModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          navigate={navigate}
        />
      )}

      {/* DEV-ONLY STRICT RBAC SECURITY TEST BENCH */}
      <SecurityTestPanel currentRoute={route} navigate={navigate} />
    </div>
  );
}
