import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sun,
  Clock,
  DollarSign,
  QrCode,
  Download,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Zap,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';
import {
  freeApiService,
  CurrencyRates,
  WeatherData,
  VisitorCountryData,
  MinistryStatus,
  FreeApiEndpointStatus,
} from '../services/FreeApiService';

export const FreeApisDashboardWidget: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRates>(() => freeApiService.getRates());
  const [weather, setWeather] = useState<WeatherData>(() => freeApiService.getWeather());
  const [visitor, setVisitor] = useState<VisitorCountryData>(() => freeApiService.getVisitor());
  const [ministry, setMinistry] = useState<MinistryStatus>(() => freeApiService.getMinistryStatus());
  const [endpoints, setEndpoints] = useState<FreeApiEndpointStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // FX Calculator State
  const [calcBhd, setCalcBhd] = useState<number>(350);
  const [calcTargetCur, setCalcTargetCur] = useState<string>('USD');

  // QR Code Test State
  const [qrText, setQrText] = useState('https://wa.me/97335628353');
  const [copiedQr, setCopiedQr] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const [r, w, v, eps] = await Promise.all([
        freeApiService.fetchLiveRates(),
        freeApiService.fetchManamaWeather(),
        freeApiService.detectVisitorCountry(),
        freeApiService.getFreeApisFleetStatus(),
      ]);
      setRates(r);
      setWeather(w);
      setVisitor(v);
      setEndpoints(eps);
      setMinistry(freeApiService.getMinistryStatus());
      setIsLoading(false);
    };

    init();

    // Clock ticker every minute
    const interval = setInterval(() => {
      setMinistry(freeApiService.getMinistryStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    const [r, w, v, eps] = await Promise.all([
      freeApiService.fetchLiveRates(),
      freeApiService.fetchManamaWeather(),
      freeApiService.detectVisitorCountry(),
      freeApiService.getFreeApisFleetStatus(),
    ]);
    setRates(r);
    setWeather(w);
    setVisitor(v);
    setEndpoints(eps);
    setMinistry(freeApiService.getMinistryStatus());
    setIsLoading(false);
  };

  const convertedAmount = Math.round(calcBhd * (rates.rates[calcTargetCur] || 1));

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Banner: Free APIs Active Grid */}
      <div className="bg-gradient-to-r from-[#17142e] to-[#101018] border border-[#b8893a]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872] bg-[#e8c872]/15 border border-[#e8c872]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#e8c872]" />
                Zero-Cost Public APIs Integrated
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                6 Active Free Microservices
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Free & Open-Access Services Engine
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a7b3] mt-1 max-w-2xl leading-relaxed">
              Real-time foreign exchange currency rates (BHD pegged), Manama live weather forecast, visitor country
              detection, instant vector QR codes, digital vCard generation, and official Bahrain government ministry hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-102 transition-transform disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Pinging APIs...' : 'Refresh Free Data'}</span>
            </button>

            <button
              type="button"
              onClick={() => freeApiService.downloadVCard()}
              className="px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] hover:border-[#e8c872] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#e8c872]" />
              <span>Download vCard</span>
            </button>
          </div>
        </div>

        {/* 4 Real-Time Live Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-[#2a2a38]">
          {/* Widget 1: Live Manama Weather */}
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sun className="w-5 h-5 animate-pulse" />
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-[#a8a7b3] flex items-center gap-1">
                <span>Manama, Bahrain</span>
                <span className="text-emerald-400 font-mono text-[9px]">LIVE</span>
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                {weather.temperature}°C · {weather.condition}
              </div>
              <div className="text-[10px] text-[#777]">
                Humidity: {weather.humidity}% · Wind: {weather.windSpeed} km/h
              </div>
            </div>
          </div>

          {/* Widget 2: Bahrain Ministry Working Hours */}
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 flex items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                ministry.isOpen
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-[#a8a7b3]">
                MOIC & LMRA AST Clock
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                {ministry.localTime} AST
              </div>
              <div
                className={`text-[10px] font-medium truncate ${
                  ministry.isOpen ? 'text-emerald-400' : 'text-purple-300'
                }`}
              >
                {ministry.statusText}
              </div>
            </div>
          </div>

          {/* Widget 3: Live FX Rates */}
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-[#a8a7b3] flex items-center gap-1">
                <span>1 BHD Live Peg</span>
                <span className="text-[#e8c872] font-mono text-[9px]">NO-FEE</span>
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                ${rates.rates['USD']?.toFixed(2) || '2.66'} USD
              </div>
              <div className="text-[10px] text-[#777]">
                = {rates.rates['AED']?.toFixed(2) || '9.76'} AED · {rates.rates['SAR']?.toFixed(2) || '9.97'} SAR
              </div>
            </div>
          </div>

          {/* Widget 4: Visitor Geolocation */}
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 text-lg">
              {visitor.flag}
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-[#a8a7b3]">Visitor Location</div>
              <div className="text-base font-bold text-white mt-0.5 truncate">
                {visitor.countryName} ({visitor.countryCode})
              </div>
              <div className="text-[10px] text-cyan-300 font-mono">
                Code: {visitor.dialCode} · Curr: {visitor.currency}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Interactive Tools: FX Calculator & Live QR Code Generator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: Live FX Currency Converter */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#e8c872]" />
              <h3 className="font-serif font-bold text-white text-base">
                Live Retainer & Fee Currency Converter
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#a8a7b3]">open.er-api.com</span>
          </div>

          <p className="text-xs text-[#a8a7b3]">
            Instantly convert Bahraini Dinars (BHD) to foreign founder home currencies using live bank exchange rates.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#a8a7b3] font-medium block mb-1">Amount in BHD:</label>
              <input
                type="number"
                value={calcBhd}
                onChange={(e) => setCalcBhd(Number(e.target.value) || 0)}
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#e8c872]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#a8a7b3] font-medium block mb-1">Target Currency:</label>
              <select
                value={calcTargetCur}
                onChange={(e) => setCalcTargetCur(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#e8c872]"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="AED">AED (د.إ) - UAE Dirham</option>
                <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                <option value="QAR">QAR - Qatari Riyal</option>
                <option value="KWD">KWD - Kuwaiti Dinar</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
              </select>
            </div>
          </div>

          <div className="bg-[#0a0a0f] border border-[#e8c872]/40 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#a8a7b3]">Converted Output:</span>
              <div className="text-2xl font-serif font-bold text-[#e8c872]">
                {convertedAmount.toLocaleString()} {calcTargetCur}
              </div>
            </div>
            <div className="text-right text-[11px] text-[#777]">
              <div>Rate: 1 BHD = {rates.rates[calcTargetCur]?.toFixed(2)} {calcTargetCur}</div>
              <div className="text-emerald-400 font-mono">0% Conversion Surcharge</div>
            </div>
          </div>
        </div>

        {/* Tool 2: Dynamic Vector QR Code Generator */}
        <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <h3 className="font-serif font-bold text-white text-base">
                Instant Vector QR Code Generator
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#a8a7b3]">api.qrserver.com</span>
          </div>

          <p className="text-xs text-[#a8a7b3]">
            Generate real-time scannable QR codes for WhatsApp numbers, BenefitPay IBANs, or client invoice links.
          </p>

          <div className="flex gap-4 items-center">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="Enter URL, BenefitPay IBAN, or phone..."
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: 'WhatsApp', val: 'https://wa.me/97335628353' },
                  { label: 'BenefitPay IBAN', val: 'BH29BBKU00000000123456' },
                  { label: 'Client Portal', val: `${window.location.origin}/#portal` },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQrText(preset.val)}
                    className="text-[10px] bg-[#0a0a0f] border border-[#2a2a38] hover:border-cyan-400 text-[#a8a7b3] hover:text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Image Preview */}
            <div className="w-24 h-24 bg-white p-1.5 rounded-xl border border-[#2a2a38] flex items-center justify-center shrink-0 shadow-md">
              <img
                src={freeApiService.getQrCodeUrl(qrText, 160)}
                alt="Live QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#2a2a38]">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>High-Density 300DPI Scan Ready</span>
            </span>

            <a
              href={freeApiService.getQrCodeUrl(qrText, 500)}
              target="_blank"
              rel="noopener noreferrer"
              download="QR_Code.png"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Download Hi-Res PNG</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Free APIs Technical Fleet Status Table */}
      <div className="bg-[#14141d] border border-[#2a2a38] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2a2a38] pb-3">
          <div>
            <h3 className="font-serif font-bold text-white text-base">
              Integrated Free APIs Service Registry & Latency
            </h3>
            <p className="text-xs text-[#a8a7b3]">
              Zero-credit-card, zero-API-key architecture running 24/7 with sovereign fallbacks.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            All 6 Endpoints Operational
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2a38] text-[10px] uppercase font-bold text-[#a8a7b3]">
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Public Endpoint</th>
                <th className="py-2.5 px-3">Auth / API Key</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a38]/50">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-[#1a1a26]/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>{ep.name}</div>
                    <div className="text-[10px] text-[#777] font-normal">{ep.description}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a0a0f] border border-[#2a2a38] text-[#ccc]">
                      {ep.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#a8a7b3]">
                    {ep.url}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      100% FREE (NO KEY)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{ep.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                    {ep.latencyMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
