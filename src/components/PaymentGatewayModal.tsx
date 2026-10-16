import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  DollarSign,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Send,
  Mail,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PaymentGatewayType, PaymentTransaction } from '../types/payments';
import { saveTransaction, generateWhatsAppPaymentDispatch, generateEmailNotificationTemplate } from '../data/paymentsStore';
import { saveLead } from '../data/leadsStore';
import { mailService } from '../services/MailService';
import { GHAZI_INFO } from '../data/content';
import {
  trackPaymentInitiate,
  trackPaymentSuccess,
  trackWhatsAppClick,
  getLeadSource,
  getAdAttribution,
} from '../utils/analytics';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  serviceId: string;
  packageTier?: string;
  defaultAmountBhd?: number;
  onSuccess?: (tx: PaymentTransaction) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  serviceId,
  packageTier = 'Executive Retainer',
  defaultAmountBhd = 350,
  onSuccess,
}) => {
  // Selected Gateway
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>('benefit_pay');

  // Amounts
  const [amountBhd, setAmountBhd] = useState<number>(defaultAmountBhd);
  const amountUsd = Math.round(amountBhd * 2.66);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCountry, setClientCountry] = useState('Bahrain');

  // Card Simulator Details (Stripe / Tap)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Fawri / Benefit Reference
  const [fawriRef, setFawriRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<{ subject: string; body: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      trackPaymentInitiate(serviceTitle, amountUsd);
    }
  }, [isOpen, serviceTitle, amountUsd]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim() || clientName.trim().length < 2) {
      setErrorMsg('Please enter your full client/business name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail.trim() || !emailRegex.test(clientEmail.trim())) {
      setErrorMsg('Please enter a valid email address for receipt and government dossier dispatch.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 7) {
      setErrorMsg('Please provide an active mobile or WhatsApp number with country code.');
      return;
    }

    if (selectedGateway === 'stripe_card' || selectedGateway === 'tap_gcc') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        setErrorMsg('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !cardCvc) {
        setErrorMsg('Please enter card expiry date (MM/YY) and CVC.');
        return;
      }
    }

    setIsProcessing(true);

    const refNumber = `TX-${Date.now().toString().slice(-6)}`;
    const gatewayNames: Record<PaymentGatewayType, string> = {
      benefit_pay: 'BenefitPay (Bahrain)',
      fawri_plus: 'Fawri / Fawri+ (Bahrain IBAN)',
      tap_gcc: 'Tap Payments (GCC Debit / Mada)',
      stripe_card: 'Stripe International Card',
      paypal: 'PayPal International',
      bank_wire: 'Corporate Bank Wire',
    };

    const newTx: PaymentTransaction = {
      id: refNumber,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      clientCountry: clientCountry.trim(),
      serviceId,
      serviceTitle,
      packageTier,
      amountBhd,
      amountUsd,
      gateway: selectedGateway,
      gatewayName: gatewayNames[selectedGateway],
      status: selectedGateway === 'benefit_pay' || selectedGateway === 'fawri_plus' || selectedGateway === 'bank_wire'
        ? 'PENDING_VERIFICATION'
        : 'SETTLED',
      referenceNumber: refNumber,
      fawriReference: fawriRef.trim() || undefined,
      notes: `Initiated online checkout for ${serviceTitle} (${packageTier}).`,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      saveTransaction(newTx);

      const adAttr = getAdAttribution();
      const leadNotes = [
        `Payment initiated via ${gatewayNames[selectedGateway]}. Ref: ${refNumber}.`,
        `Amount: ${amountBhd} BHD ($${amountUsd} USD).`,
      ];
      if (adAttr.utm_campaign || adAttr.utm_source) {
        leadNotes.push(`Ad Attribution: ${adAttr.utm_source || 'direct'} / ${adAttr.utm_campaign || 'none'} (${adAttr.utm_medium || 'cpc'})`);
      }

      // Also record as a hot lead in the CRM
      saveLead({
        id: `lead-tx-${Date.now().toString().slice(-5)}`,
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        whatsapp: clientPhone.trim(),
        country: clientCountry.trim(),
        service: serviceTitle,
        package: packageTier,
        budget: `${amountBhd} BHD (~$${amountUsd} USD)`,
        source: getLeadSource('payment_gateway'),
        status: 'WON',
        priority: 'urgent',
        temperature: 'HOT',
        notes: leadNotes,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      });

      // Fire conversion telemetry
      trackPaymentSuccess(refNumber, amountUsd, serviceTitle);

      // Dispatch outgoing payment receipt to client and executive desk alert
      mailService.enqueue('PAYMENT_RECEIPT', clientEmail.trim(), {
        referenceNumber: refNumber,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        serviceTitle,
        packageTier,
        amountBhd,
        amountUsd,
        gatewayName: gatewayNames[selectedGateway],
        status: newTx.status,
      });

      mailService.enqueue('EXECUTIVE_NEW_LEAD_ALERT', 'ghaziwazirndm@gmail.com', {
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        country: clientCountry.trim(),
        service: serviceTitle,
        budget: `${amountBhd} BHD (~$${amountUsd} USD)`,
        source: 'payment_gateway',
        notes: [`Payment initiated via ${gatewayNames[selectedGateway]} (Ref: ${refNumber})`],
      });

      setEmailTemplate(generateEmailNotificationTemplate(newTx));
      setCompletedTx(newTx);
      setIsProcessing(false);
      if (onSuccess) {
        onSuccess(newTx);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#14141d] border-2 border-[#e8c872]/50 rounded-3xl max-w-3xl w-full p-5 sm:p-8 relative shadow-[0_0_50px_rgba(232,200,114,0.15)] my-auto animate-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a8a7b3] hover:text-white p-2 rounded-full bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ---------------------------------------------------- */}
        {/* CONFIRMATION / RECEIPT SCREEN                        */}
        {/* ---------------------------------------------------- */}
        {completedTx ? (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full">
              Payment & Retainer Recorded
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Thank You, {completedTx.clientName}!
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a7b3] max-w-md mx-auto">
              Your engagement request for <strong className="text-white">{completedTx.serviceTitle}</strong> has been secured in the executive pipeline.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-xl mx-auto">
              <div className="flex justify-between pb-2 border-b border-[#2a2a38]">
                <span className="text-[#a8a7b3]">Transaction Ref ID</span>
                <span className="font-mono font-bold text-[#e8c872]">{completedTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#2a2a38]">
                <span className="text-[#a8a7b3]">Payment Method</span>
                <span className="font-semibold text-white">{completedTx.gatewayName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#2a2a38]">
                <span className="text-[#a8a7b3]">Amount</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {completedTx.amountBhd} BHD <span className="text-xs text-[#a8a7b3] font-normal">(~${completedTx.amountUsd} USD)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a8a7b3]">Settlement Status</span>
                <span className="font-bold text-emerald-400 uppercase text-[11px]">
                  {completedTx.status}
                </span>
              </div>
            </div>

            {/* Multi-Channel Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-xl mx-auto">
              <a
                href={generateWhatsAppPaymentDispatch(completedTx)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('payment_receipt_dispatch')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Notify Ghazi Wazir on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  if (emailTemplate) {
                    const mailtoUrl = `mailto:${completedTx.clientEmail}?subject=${encodeURIComponent(
                      emailTemplate.subject
                    )}&body=${encodeURIComponent(emailTemplate.body)}`;
                    window.location.href = mailtoUrl;
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-full btn-outline-gold text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Open Email Receipt</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="text-xs text-[#a8a7b3] hover:text-white underline cursor-pointer"
              >
                Done and Return to Website
              </button>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* GATEWAY SELECTION & CHECKOUT FORM                    */
          /* ---------------------------------------------------- */
          <div>
            {/* Header */}
            <div className="mb-6 border-b border-[#2a2a38] pb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#e8c872] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Official Sovereign & Global Payment Gateway</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {serviceTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#a8a7b3] mt-1">
                <span>Tier: <strong className="text-white">{packageTier}</strong></span>
                <span>•</span>
                <span>Dual Registry: Bab Al-Khaleej (Bahrain) & Back for Brand LLC (USA)</span>
              </div>
            </div>

            {/* Gateway Selection Tabs */}
            <div className="mb-6">
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#a8a7b3] mb-2.5">
                Select Your Preferred Payment Gateway:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. BenefitPay */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('benefit_pay')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    selectedGateway === 'benefit_pay'
                      ? 'border-[#e8c872] bg-[#e8c872]/15 text-white shadow-md'
                      : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">BenefitPay</div>
                    <div className="text-[10px] text-[#a8a7b3]">Bahrain National QR</div>
                  </div>
                </button>

                {/* 2. Fawri / Fawri+ */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('fawri_plus')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    selectedGateway === 'fawri_plus'
                      ? 'border-[#e8c872] bg-[#e8c872]/15 text-white shadow-md'
                      : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Fawri / Fawri+</div>
                    <div className="text-[10px] text-[#a8a7b3]">Bahrain IBAN Transfer</div>
                  </div>
                </button>

                {/* 3. Tap Payments */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('tap_gcc')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    selectedGateway === 'tap_gcc'
                      ? 'border-[#e8c872] bg-[#e8c872]/15 text-white shadow-md'
                      : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Tap GCC Gateway</div>
                    <div className="text-[10px] text-[#a8a7b3]">Mada, KNET, Benefit</div>
                  </div>
                </button>

                {/* 4. Stripe Cards */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('stripe_card')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    selectedGateway === 'stripe_card'
                      ? 'border-[#e8c872] bg-[#e8c872]/15 text-white shadow-md'
                      : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Stripe Card</div>
                    <div className="text-[10px] text-[#a8a7b3]">Visa / MC / Apple Pay</div>
                  </div>
                </button>

                {/* 5. PayPal */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('paypal')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    selectedGateway === 'paypal'
                      ? 'border-[#e8c872] bg-[#e8c872]/15 text-white shadow-md'
                      : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">PayPal</div>
                    <div className="text-[10px] text-[#a8a7b3]">Global Balance & Cards</div>
                  </div>
                </button>

                {/* 6. Corporate Bank Wire */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('bank_wire')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    selectedGateway === 'bank_wire'
                      ? 'border-[#e8c872] bg-[#e8c872]/15 text-white shadow-md'
                      : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Corporate Wire</div>
                    <div className="text-[10px] text-[#a8a7b3]">Official Proforma SWIFT</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Gateway Specific UI Panels */}
            <div className="mb-6 bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 sm:p-5">
              {/* BENEFIT PAY INSTRUCTIONS */}
              {selectedGateway === 'benefit_pay' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Simulated BenefitPay QR Box */}
                    <div className="w-32 h-32 rounded-2xl bg-white p-2.5 flex flex-col items-center justify-center shrink-0 border-2 border-red-500 shadow-lg">
                      <QrCode className="w-20 h-20 text-black" />
                      <span className="text-[9px] font-black text-red-600 tracking-tighter uppercase mt-1">
                        BenefitPay
                      </span>
                    </div>

                    <div className="text-xs space-y-2 text-[#a8a7b3]">
                      <div className="text-white font-bold text-sm">
                        Scan with your BenefitPay App (Bahrain)
                      </div>
                      <p>
                        Transfer to official consultancy account or phone number:
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#14141d] border border-[#2a2a38] px-3 py-1.5 rounded-lg font-mono text-white text-xs font-bold">
                          +973 3562 8353
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy('+97335628353', 'phone')}
                          className="px-2.5 py-1 rounded bg-[#2a2a38] text-xs text-white hover:bg-[#3a3a4e] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#e8c872]">
                        Beneficiary: <strong>Bab Al-Khaleej / Ghazi Wazir</strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-white font-semibold mb-1">
                      Fawri+ / BenefitPay Reference Number (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BP-829104 or last 4 digits of transfer"
                      value={fawriRef}
                      onChange={(e) => setFawriRef(e.target.value)}
                      className="w-full bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                    />
                  </div>
                </div>
              )}

              {/* FAWRI / FAWRI+ IBAN INSTRUCTIONS */}
              {selectedGateway === 'fawri_plus' && (
                <div className="space-y-3 text-xs">
                  <div className="text-white font-bold text-sm">
                    Bahrain Electronic Fund Transfer (Fawri / Fawri+)
                  </div>
                  <p className="text-[#a8a7b3]">
                    Direct bank-to-bank settlement across all Bahraini and GCC institutions via the Central Bank of Bahrain network.
                  </p>

                  <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#a8a7b3]">Bank Name:</span>
                      <strong className="text-white">National Bank of Bahrain (NBB)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#a8a7b3]">Beneficiary:</span>
                      <strong className="text-white">Bab Al-Khaleej Commercial Services</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#a8a7b3]">IBAN:</span>
                      <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                        <span>BH12 NBOB 0000 0012 3456 78</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('BH12NBOB00000012345678', 'iban')}
                          className="p-1 hover:text-white"
                        >
                          {copiedField === 'iban' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STRIPE & TAP CARD FORM */}
              {(selectedGateway === 'stripe_card' || selectedGateway === 'tap_gcc') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-white mb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>256-Bit SSL Encrypted Card Processing</span>
                    </span>
                    <span className="text-[10px] text-[#a8a7b3]">
                      {selectedGateway === 'stripe_card' ? 'Stripe USA' : 'Tap GCC'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#a8a7b3] mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e8c872]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#a8a7b3] mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e8c872]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#a8a7b3] mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="882"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-[#14141d] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#e8c872]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYPAL INSTRUCTIONS */}
              {selectedGateway === 'paypal' && (
                <div className="space-y-3 text-xs">
                  <div className="text-white font-bold text-sm">PayPal Checkout & Buyer Protection</div>
                  <p className="text-[#a8a7b3]">
                    Pay instantly using your PayPal balance, bank account, or international credit card in USD.
                  </p>
                  <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3 text-xs text-[#e8c872]">
                    Total: <strong>${amountUsd} USD</strong> ({amountBhd} BHD) · Processed via Back for Brand LLC corporate PayPal account.
                  </div>
                </div>
              )}

              {/* CORPORATE WIRE INSTRUCTIONS */}
              {selectedGateway === 'bank_wire' && (
                <div className="space-y-3 text-xs">
                  <div className="text-white font-bold text-sm">
                    Back for Brand LLC (USA) Corporate Treasury Wire
                  </div>
                  <p className="text-[#a8a7b3]">
                    For international founders and corporate institutions transferring funds directly to Florida, USA.
                  </p>
                  <div className="bg-[#14141d] border border-[#2a2a38] rounded-xl p-3.5 space-y-1.5 font-mono text-[11px]">
                    <div>Entity: <strong className="text-white font-sans">Back for Brand LLC (Florida, USA)</strong></div>
                    <div>Routing (ACH/Wire): <strong className="text-white">063100277</strong></div>
                    <div>SWIFT / BIC: <strong className="text-emerald-400">CHASUS33</strong></div>
                    <div>Reference: <span className="text-[#e8c872]">INV-{serviceId.slice(0, 4).toUpperCase()}</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Client Contact Form */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white mb-1">
                    Full Name / Corporate Entity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tariq Al-Mansoor"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-white mb-1">
                    Corporate Email (for Invoice & Receipt) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., tariq@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white mb-1">
                    WhatsApp / Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+973 3562 8353"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-white mb-1">
                    Country of Jurisdiction <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bahrain, Saudi Arabia, UAE, USA..."
                    value={clientCountry}
                    onChange={(e) => setClientCountry(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e8c872]"
                  />
                </div>
              </div>

              {/* Amount Customization */}
              <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#a8a7b3] block">Deposit / Retainer Amount:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-serif font-bold text-[#e8c872]">{amountBhd} BHD</span>
                    <span className="text-xs text-[#a8a7b3]">(~${amountUsd} USD)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {[250, 350, 500, 750].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountBhd(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                        amountBhd === amt
                          ? 'border-[#e8c872] bg-[#e8c872] text-black font-bold'
                          : 'border-[#2a2a38] bg-[#14141d] text-[#a8a7b3] hover:text-white'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Securing Transaction...</span>
                  ) : (
                    <>
                      <span>Confirm & Generate Official Receipt</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
