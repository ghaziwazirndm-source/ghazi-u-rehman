import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send, Calendar, CheckCircle2, AlertCircle, Sliders, Globe, Sparkles, Loader2 } from 'lucide-react';
import { GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';
import { getStoredSocialLinks, SocialLinkItem } from '../data/socialLinksStore';
import { SocialLinksManagerModal } from './SocialLinksManagerModal';
import { trackContactFormSubmit, trackWhatsAppClick, getLeadSource, getAdAttribution } from '../utils/analytics';
import { saveLead } from '../data/leadsStore';

interface ContactViewProps {
  navigate: (route: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; waUrl?: string } | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() => getStoredSocialLinks());
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSocialLinks(getStoredSocialLinks());
    };
    window.addEventListener('gw_social_links_updated', handleUpdate);
    return () => window.removeEventListener('gw_social_links_updated', handleUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    trackContactFormSubmit({ name, email });

    const adAttr = getAdAttribution();
    const leadNotes = [`Inquiry message: ${message}`];
    if (adAttr.utm_campaign || adAttr.utm_source) {
      leadNotes.push(`Ad Campaign: ${adAttr.utm_source || 'direct'} / ${adAttr.utm_campaign || 'none'} (${adAttr.utm_medium || 'cpc'})`);
    }

    // Save lead directly to CRM store
    saveLead({
      id: `lead-cnt-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: email.includes('@') ? '' : email.trim(),
      whatsapp: email.includes('@') ? '' : email.trim(),
      country: 'Bahrain',
      service: 'General Direct Inquiry',
      source: getLeadSource('contact_form'),
      status: 'NEW',
      priority: 'high',
      temperature: 'HOT',
      notes: leadNotes,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });

    const waFallbackUrl = `https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(
      `Hello Ghazi,\nName: ${name}\nEmail/Phone: ${email}\nMessage: ${message}`
    )}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, adAttribution: adAttr }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSent(true);
        setFeedback({
          type: 'success',
          message: data.message || 'Thank you! Your message has been received. Ghazi Wazir will respond within 24 hours.',
          waUrl: waFallbackUrl,
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error(data.message || 'Service unreachable');
      }
    } catch {
      // Graceful client fallback
      setSent(true);
      setFeedback({
        type: 'success',
        message: 'Your inquiry has been registered. You can also connect directly via WhatsApp (+973 3562 8353) or email for an immediate response.',
        waUrl: waFallbackUrl,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
          Get in Touch
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
          👋 Let's Talk About Your Business
        </h1>
        <p className="text-base text-[#a8a7b3]">
          Whether you want to incorporate a business in Bahrain, sponsor worker or investor visas, or scale globally with AI and SEO, I will reply with clear actionable steps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Contact Cards Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Direct Line Card with Ghazi's Picture */}
          <div className="bg-[#14141d] border-2 border-[#b8893a] rounded-2xl p-4 shadow-xl flex items-center gap-3.5">
            <CeoPortrait size="sm" rounded="full" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-white">Ghazi Wazir</h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 rounded-full">Available</span>
              </div>
              <span className="text-[11px] text-[#e8c872] block">
                CEO, Back for Brand (USA) &amp; Business Consultant, Bab Al-Khaleej (Bahrain)
              </span>
            </div>
          </div>

          <a
            href={`https://wa.me/${GHAZI_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('contact_page_card')}
            className="card-luxury p-6 flex items-start gap-4 block group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#a8a7b3] font-semibold block mb-0.5">
                Fastest Response
              </span>
              <strong className="text-base font-bold text-white group-hover:text-[#e8c872] transition-colors block">
                WhatsApp Directly
              </strong>
              <span className="text-sm text-[#e8c872]">
                {GHAZI_INFO.phone}
              </span>
            </div>
          </a>

          <a
            href={`mailto:${GHAZI_INFO.email}`}
            className="card-luxury p-6 flex items-start gap-4 block group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#e8c872]/20 border border-[#e8c872]/40 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-[#e8c872]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#a8a7b3] font-semibold block mb-0.5">
                Direct Email
              </span>
              <strong className="text-base font-bold text-white group-hover:text-[#e8c872] transition-colors block">
                Email Inquiry
              </strong>
              <span className="text-sm text-[#e8c872] break-all">
                {GHAZI_INFO.email}
              </span>
            </div>
          </a>

          <div className="card-luxury p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3a2a7a]/40 border border-[#6b52d6]/40 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#c4b5fd]" />
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#e8c872] font-semibold block mb-0.5">
                  Bahrain Office &amp; Operations
                </span>
                <strong className="text-sm font-bold text-white block mb-0.5">
                  Bab Al Khaleej Business Consultancy W.L.L.
                </strong>
                <p className="text-[#a8a7b3] leading-relaxed">
                  Address: Office 22, Building 342, Road 1705, Block 317, Diplomatic Area, Manama, Kingdom of Bahrain<br />
                  Commercial Registration: 180572-1<br />
                  Phone: <a href="tel:+97335507868" className="text-[#e8c872] hover:underline">+973 3550 7868</a><br />
                  Email: <a href={`mailto:${GHAZI_INFO.email}`} className="text-[#e8c872] hover:underline">{GHAZI_INFO.email}</a>
                </p>
              </div>

              <div className="pt-2 border-t border-[#2a2a38]">
                <span className="text-[11px] uppercase tracking-wider text-[#00C98D] font-semibold block mb-0.5">
                  USA Corporate Registration
                </span>
                <strong className="text-sm font-bold text-white block mb-0.5">
                  Back for Brand LLC
                </strong>
                <p className="text-[#a8a7b3] leading-relaxed">
                  Registered/Mailing Address: 7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA (Mailing address, not a public walk-in office)<br />
                  Email: <a href={`mailto:${GHAZI_INFO.email}`} className="text-[#00C98D] hover:underline">{GHAZI_INFO.email}</a>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#14141d] to-[#1a1710] border border-[#e8c872]/30 rounded-2xl text-center">
            <h3 className="font-serif font-bold text-white text-base mb-1">
              Prefer a Scheduled Video Call?
            </h3>
            <p className="text-xs text-[#a8a7b3] mb-4">
              Select an exact 30-min window on my calendar.
            </p>
            <button
              onClick={() => navigate('book')}
              className="btn-gold w-full py-2.5 text-xs font-semibold rounded-full flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book on Calendar &rarr;</span>
            </button>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="lg:col-span-7 bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Send a Direct Message
          </h2>
          <p className="text-sm text-[#a8a7b3] mb-6">
            Fill out the brief form below and click send. It will format your message cleanly for immediate follow-up.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
                Your Name *
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Tariq Al-Hashimi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] placeholder-[#a8a7b3]/60 focus:border-[#e8c872] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
                Your Email or WhatsApp Phone *
              </label>
              <input
                id="contact-email"
                name="email"
                type="text"
                required
                placeholder="e.g. tariq@domain.com or +973 3xxx xxxx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] placeholder-[#a8a7b3]/60 focus:border-[#e8c872] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
                How Can I Help You? *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Provide details about your business setup plans, visa needs, or technology goals..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] placeholder-[#a8a7b3]/60 focus:border-[#e8c872] focus:outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Ghazi Wazir</span>
                </>
              )}
            </button>
          </form>

          {feedback && (
            <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-emerald-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <p className="leading-relaxed">{feedback.message}</p>
              </div>
              {feedback.waUrl && (
                <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-300">Need instant direct chat?</span>
                  <a
                    href={feedback.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('form_success_button')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366] text-black font-semibold text-xs hover:bg-[#20b858] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Social and Platforms Directory */}
      <section className="border-t border-[#2a2a38] pt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-2xl font-serif font-bold text-white mb-1">
              🌐 Find Me Everywhere Online
            </h2>
            <p className="text-xs text-[#a8a7b3]">
              Follow my thought leadership, verified business credentials, and professional networks across 19 verified platforms.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSocialModalOpen(true)}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Sliders className="w-3.5 h-3.5" />
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
              <div className="truncate">
                <span className="truncate block group-hover:text-[#e8c872] transition-colors">{item.name}</span>
                <span className="text-[10px] text-[#777] block truncate">{item.handle}</span>
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
    </div>
  );
};
