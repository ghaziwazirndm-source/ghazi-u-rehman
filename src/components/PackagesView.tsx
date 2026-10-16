import React, { useState } from 'react';
import { Check, Sparkles, Calendar, MessageSquare, Send, CreditCard, Shield, ArrowRight, QrCode } from 'lucide-react';
import { PACKAGES, GHAZI_INFO } from '../data/content';
import { CeoPortrait } from './CeoPortrait';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { saveLead } from '../data/leadsStore';
import { mailService } from '../services/MailService';
import { trackWhatsAppClick, trackEvent, getLeadSource, getAdAttribution } from '../utils/analytics';

interface PackagesViewProps {
  navigate: (route: string) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({ navigate }) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('Complete');
  const [customNotes, setCustomNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [formError, setFormError] = useState('');

  // Payment Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [modalPkgName, setModalPkgName] = useState('Complete Package');
  const [modalAmountBhd, setModalAmountBhd] = useState(650);

  const getPackagePriceBhd = (name: string): number => {
    switch (name) {
      case 'Starter':
        return 280;
      case 'Growth':
        return 450;
      case 'Complete':
        return 650;
      case 'Enterprise':
        return 950;
      default:
        return 450;
    }
  };

  const handleOpenPayment = (pkgName: string) => {
    setModalPkgName(`${pkgName} Package`);
    setModalAmountBhd(getPackagePriceBhd(pkgName));
    setIsPaymentModalOpen(true);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!clientName.trim() || !clientContact.trim()) {
      setFormError('Please provide your name and contact details.');
      return;
    }
    const msg = `Hello Ghazi,\nI am requesting a formal itemized proposal for the "${selectedPackage}" package.\n\n👤 Name: ${clientName.trim()}\n📱 Contact: ${clientContact.trim()}${customNotes ? `\n📝 Project Notes: ${customNotes.trim()}` : ''}`;
    const url = `https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e8c872] bg-[#e8c872]/10 border border-[#e8c872]/20 px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Engagement & Multi-Gateway Checkout</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
          🎁 Packages & Instant Retainers
        </h1>
        <p className="text-base text-[#a8a7b3]">
          Every business setup and technology scaling requirement has distinct legal activities and timelines. Choose your tier to pay the retainer online via BenefitPay, Fawri+, Stripe, or PayPal, or request a custom proposal.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`card-luxury p-6 sm:p-8 flex flex-col justify-between relative ${
              pkg.popular ? 'border-2 border-[#e8c872] shadow-[0_0_30px_rgba(232,200,114,0.18)]' : ''
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e8c872] to-[#b8893a] text-[#16120a] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            <div>
              <span className="text-4xl mb-3 block">{pkg.emoji}</span>
              <h2 className="text-2xl font-serif font-bold text-[#e8c872] mb-1">
                {pkg.name}
              </h2>
              <p className="text-xs text-[#a8a7b3] mb-4">
                {pkg.subtitle}
              </p>
              <div className="text-sm font-semibold text-white/90 bg-[#101018] py-2 px-3 rounded-lg border border-[#2a2a38] mb-6 inline-block">
                {pkg.priceText}
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#f5f1e8]">
                    <div className="w-4 h-4 rounded-full bg-[#e8c872]/20 text-[#e8c872] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#2a2a38]">
              {/* Instant Pay / Checkout Button */}
              <button
                type="button"
                onClick={() => handleOpenPayment(pkg.name)}
                className="w-full py-3 text-center text-xs font-bold rounded-full transition-all cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-black shadow-lg hover:brightness-110 flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Retainer (BenefitPay · Cards)</span>
              </button>

              {/* Request Proposal Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPackage(pkg.name);
                  const formEl = document.getElementById('quote-form');
                  formEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full py-2.5 text-center text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  pkg.popular ? 'btn-gold' : 'btn-outline-gold'
                }`}
              >
                Request Itemized Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Request Form Section */}
      <div id="quote-form" className="bg-[#14141d] border-2 border-[#b8893a] rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left mb-6 pb-6 border-b border-[#2a2a38]">
          <CeoPortrait size="sm" rounded="full" />
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Request an Itemized Proposal
            </h3>
            <span className="text-xs text-[#e8c872] block">
              Personally assessed by Ghazi Wazir · CEO, Back for Brand (USA) & Bab Al-Khaleej (Bahrain)
            </span>
          </div>
        </div>

        <form onSubmit={handleSendQuote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
              Selected Package
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] focus:border-[#e8c872] focus:outline-none"
            >
              {PACKAGES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.emoji} {p.name} — {p.subtitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] focus:border-[#e8c872] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
              WhatsApp or Email Address *
            </label>
            <input
              type="text"
              required
              placeholder="+973 3562 8353 or name@company.com"
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] focus:border-[#e8c872] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a8a7b3] uppercase tracking-wider mb-1.5">
              Specific Activities, Timeline, or Requirements
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Setting up an IT consulting firm with 2 foreign investor visas and US LLM search optimization..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-2.5 text-sm text-[#f5f1e8] focus:border-[#e8c872] focus:outline-none"
            ></textarea>
          </div>

          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {formError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="btn-gold w-full sm:flex-1 py-3 text-center text-sm font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Send Proposal Inquiry</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenPayment(selectedPackage)}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 cursor-pointer"
            >
              Pay Retainer Online
            </button>
          </div>
        </form>
      </div>

      {/* Unified Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        serviceTitle={modalPkgName}
        serviceId="package-tier"
        packageTier={modalPkgName}
        defaultAmountBhd={modalAmountBhd}
      />
    </div>
  );
};
