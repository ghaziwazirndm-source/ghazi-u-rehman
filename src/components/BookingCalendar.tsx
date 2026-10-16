import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Video,
  MapPin,
  PhoneCall,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Building,
} from 'lucide-react';
import { GHAZI_INFO, BAHRAIN_SERVICES, TECH_SERVICES } from '../data/content';
import { saveBooking, saveLead } from '../data/leadsStore';
import { mailService } from '../services/MailService';
import { Booking } from '../types/enterprise';
import { trackBookingSubmit, trackWhatsAppClick, getLeadSource, getAdAttribution } from '../utils/analytics';

interface BookingCalendarProps {
  onSuccess?: () => void;
  preselectedServiceId?: string;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onSuccess,
  preselectedServiceId,
}) => {
  // 1. Service Selection
  const allServices = [...BAHRAIN_SERVICES, ...TECH_SERVICES];
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || 'business-registration'
  );

  // 2. Consultation Type
  const [consultationType, setConsultationType] = useState<
    'virtual_meet' | 'in_person_manama' | 'executive_call' | 'whatsapp_direct'
  >('virtual_meet');

  // 3. Date & Time Selection
  const allowedDays = [0, 1, 2, 3, 4]; // Sunday (0) to Thursday (4) - Gulf / Bahrain business week
  const startHour = 10;
  const endHour = 17;
  const stepMinutes = 30;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const now = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // 4. Contact Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('Bahrain');
  const [message, setMessage] = useState('');

  // UI state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // 1: Service & Time, 2: Details, 3: Confirmation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Generate slots for selected date
  const generateSlots = () => {
    const slots: string[] = [];
    for (let m = startHour * 60; m < endHour * 60; m += stepMinutes) {
      const hh = Math.floor(m / 60);
      const mm = m % 60;
      const period = hh >= 12 ? 'PM' : 'AM';
      const displayH = hh % 12 || 12;
      const padM = mm < 10 ? `0${mm}` : `${mm}`;
      slots.push(`${displayH}:${padM} ${period}`);
    }
    return slots;
  };

  // Calendar dates calculation
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev >= new Date(now.getFullYear(), now.getMonth(), 1)) {
      setCurrentMonthDate(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(year, month, day);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (checkDate <= today) return true;
    if (!allowedDays.includes(checkDate.getDay())) return true;
    return false;
  };

  const handleDateSelect = (day: number) => {
    const chosen = new Date(year, month, day);
    setSelectedDate(chosen);
    setSelectedSlot(null);
    setValidationErrors((prev) => ({ ...prev, date: '' }));
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!selectedDate) {
      errors.date = 'Please select an available business day (Sun–Thu).';
    }
    if (!selectedSlot) {
      errors.slot = 'Please choose a consultation time slot.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid corporate or personal email address.';
    }
    const phoneRegex = /^[\d+\-\s()]{7,20}$/;
    if (!whatsapp.trim() || !phoneRegex.test(whatsapp.trim())) {
      errors.whatsapp = 'Please enter a valid phone/WhatsApp number with country code.';
    }
    if (!country.trim()) {
      errors.country = 'Please specify your country of residence or business.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    const chosenService = allServices.find((s) => s.id === selectedServiceId);
    const serviceName = chosenService ? chosenService.title : 'General Consultation';
    const dateStr = selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      serviceId: selectedServiceId,
      serviceName,
      consultationType,
      date: dateStr,
      timeSlot: selectedSlot || '11:00 AM',
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      country: country.trim(),
      message: message.trim(),
      status: 'CONFIRMED',
      meetingLink: 'https://meet.google.com/ais-ghazi-advisory',
      assignedAdvisor: 'Ghazi Wazir',
      createdDate: new Date().toISOString(),
    };

    // Save to CRM leads & bookings local store
    saveBooking(newBooking);

    const adAttr = getAdAttribution();
    const leadNotes = [
      `Booked ${consultationType} on ${dateStr} at ${selectedSlot}.`,
      message ? `Client note: ${message}` : 'No additional note provided.',
    ];
    if (adAttr.utm_campaign || adAttr.utm_source) {
      leadNotes.push(`Ad Attribution: ${adAttr.utm_source || 'direct'} / ${adAttr.utm_campaign || 'none'} (${adAttr.utm_medium || 'cpc'})`);
    }

    saveLead({
      id: `lead-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: whatsapp.trim(),
      whatsapp: whatsapp.trim(),
      country: country.trim(),
      service: serviceName,
      source: getLeadSource('booking_calendar'),
      status: 'CONSULTATION',
      priority: 'high',
      temperature: 'HOT',
      notes: leadNotes,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });

    // Fire Ad & Analytics conversion event
    trackBookingSubmit({
      name: name.trim(),
      email: email.trim(),
      service: serviceName,
      date: dateStr,
    });

    // Enqueue outgoing confirmation email to client and alert to executive desk
    mailService.enqueue('CONSULTATION_CONFIRMATION', email.trim(), {
      name: name.trim(),
      date: dateStr,
      timeSlot: selectedSlot || '11:00 AM',
      serviceName,
      format: consultationType.replace('_', ' '),
      meetingLink: 'https://meet.google.com/ais-ghazi-advisory',
    });

    mailService.enqueue('EXECUTIVE_NEW_LEAD_ALERT', 'ghaziwazirndm@gmail.com', {
      name: name.trim(),
      email: email.trim(),
      phone: whatsapp.trim(),
      country: country.trim(),
      service: serviceName,
      source: 'booking_calendar',
      notes: [`Booked ${consultationType} on ${dateStr} at ${selectedSlot}.`],
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      setCurrentStep(3);
      if (onSuccess) {
        onSuccess();
      }
    }, 600);
  };

  // ----------------------------------------------------
  // STEP 3: CONFIRMATION SCREEN
  // ----------------------------------------------------
  if (currentStep === 3 && confirmedBooking) {
    const formattedDate = new Date(confirmedBooking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const whatsappMessage = encodeURIComponent(
      `Hello Ghazi,\nI have scheduled a consultation for *${confirmedBooking.serviceName}*.\n\n📅 Date: ${formattedDate}\n⏰ Time: ${confirmedBooking.timeSlot} (Bahrain GMT+3)\n👤 Name: ${confirmedBooking.name}\n📍 Type: ${confirmedBooking.consultationType}\n\nPlease confirm availability.`
    );

    return (
      <div className="bg-[#14141d] border-2 border-[#00C98D] rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-400">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
          Consultation Request Confirmed
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
          Your Session is Scheduled!
        </h2>
        <p className="text-sm text-[#a8a7b3] mb-6 max-w-md mx-auto">
          We look forward to meeting with you directly. A calendar invite has been prepared for <strong className="text-white">{confirmedBooking.email}</strong>.
        </p>

        {/* Appointment Card */}
        <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a38]">
            <span className="text-xs text-[#a8a7b3]">Consultant</span>
            <span className="text-sm font-semibold text-[#e8c872]">Ghazi Wazir</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a38]">
            <span className="text-xs text-[#a8a7b3]">Selected Service</span>
            <span className="text-sm font-semibold text-white">{confirmedBooking.serviceName}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a38]">
            <span className="text-xs text-[#a8a7b3]">Date & Time</span>
            <span className="text-sm font-semibold text-emerald-400">
              {formattedDate} at {confirmedBooking.timeSlot} (GMT+3)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a8a7b3]">Meeting Format</span>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              {confirmedBooking.consultationType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Production Backend Requirement Notice */}
        <div className="bg-[#1f1a14] border border-[#b8893a]/40 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#e8c872] shrink-0 mt-0.5" />
            <div className="text-xs text-[#f5f1e8] leading-relaxed">
              <span className="font-bold text-[#e8c872] block mb-1">
                Backend Calendar Integration Notice
              </span>
              This appointment has been safely recorded in your local browser CRM leads repository (ID: <code className="text-[#e8c872]">{confirmedBooking.id}</code>). For live production Google Calendar synchronization and automated email invitations, connect an API backend.
            </div>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/${GHAZI_INFO.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('booking_confirmation')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Notify Ghazi on WhatsApp</span>
          </a>
          <button
            onClick={() => {
              setCurrentStep(1);
              setSelectedDate(null);
              setSelectedSlot(null);
              setConfirmedBooking(null);
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-[#2a2a38] text-[#a8a7b3] hover:text-white hover:border-[#e8c872] text-xs font-medium transition-colors"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STEP 1 & 2: CALENDAR & FORM SECTIONS
  // ----------------------------------------------------
  return (
    <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-5 sm:p-8 max-w-4xl mx-auto shadow-2xl">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-8 border-b border-[#2a2a38] pb-5">
        <button
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2 text-xs font-semibold cursor-pointer ${
            currentStep === 1 ? 'text-[#e8c872]' : 'text-[#a8a7b3] hover:text-white'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
              currentStep === 1
                ? 'bg-[#e8c872] text-black font-bold'
                : 'bg-[#2a2a38] text-white'
            }`}
          >
            1
          </span>
          <span>Date & Service</span>
        </button>

        <div className="w-12 h-0.5 bg-[#2a2a38]"></div>

        <button
          onClick={() => {
            if (validateStep1()) setCurrentStep(2);
          }}
          className={`flex items-center gap-2 text-xs font-semibold cursor-pointer ${
            currentStep === 2 ? 'text-[#e8c872]' : 'text-[#a8a7b3] hover:text-white'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
              currentStep === 2
                ? 'bg-[#e8c872] text-black font-bold'
                : 'bg-[#2a2a38] text-white'
            }`}
          >
            2
          </span>
          <span>Contact Details</span>
        </button>

        <div className="w-12 h-0.5 bg-[#2a2a38]"></div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#a8a7b3]">
          <span className="w-6 h-6 rounded-full bg-[#2a2a38] flex items-center justify-center text-[11px]">
            3
          </span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* STEP 1: SERVICE, MEETING TYPE, DATE & TIME */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Service Selector */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-widest text-[#e8c872] mb-2.5">
              1. Select Advisory Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e8c872] transition-colors"
            >
              <optgroup label="🇧🇭 Kingdom of Bahrain Commercial Advisory">
                {BAHRAIN_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🇺🇸 Back for Brand Global Tech & AI">
                {TECH_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Consultation Type Selector */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-widest text-[#e8c872] mb-2.5">
              2. Choose Consultation Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('virtual_meet')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  consultationType === 'virtual_meet'
                    ? 'border-[#e8c872] bg-[#e8c872]/10 text-white shadow-md'
                    : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                }`}
              >
                <Video className="w-5 h-5 text-[#e8c872] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Google Meet / Zoom</div>
                  <div className="text-[11px] text-[#a8a7b3]">Worldwide HD Video Call</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('in_person_manama')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  consultationType === 'in_person_manama'
                    ? 'border-[#e8c872] bg-[#e8c872]/10 text-white shadow-md'
                    : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                }`}
              >
                <MapPin className="w-5 h-5 text-[#e8c872] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">In-Person Bahrain</div>
                  <div className="text-[11px] text-[#a8a7b3]">Manama / Seef District</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('executive_call')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  consultationType === 'executive_call'
                    ? 'border-[#e8c872] bg-[#e8c872]/10 text-white shadow-md'
                    : 'border-[#2a2a38] bg-[#0a0a0f] text-[#a8a7b3] hover:border-[#a8a7b3]'
                }`}
              >
                <PhoneCall className="w-5 h-5 text-[#e8c872] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Direct Phone Call</div>
                  <div className="text-[11px] text-[#a8a7b3]">Executive Audio Briefing</div>
                </div>
              </button>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Calendar Widget */}
            <div className="md:col-span-7 bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-bold text-sm sm:text-base text-white">
                  {monthNames[month]} {year}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg border border-[#2a2a38] hover:bg-[#2a2a38] text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg border border-[#2a2a38] hover:bg-[#2a2a38] text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#a8a7b3] mb-2">
                {dayNames.map((d, i) => (
                  <div
                    key={d}
                    className={i === 5 || i === 6 ? 'text-red-400/60' : 'text-[#e8c872]'}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day numbers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const disabled = isDateDisabled(day);
                  const isSelected =
                    selectedDate &&
                    selectedDate.getFullYear() === year &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getDate() === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDateSelect(day)}
                      className={`p-2 sm:p-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md scale-105'
                          : disabled
                          ? 'text-[#444352] cursor-not-allowed'
                          : 'text-[#f5f1e8] hover:bg-[#1f1f2e] hover:border-[#e8c872]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-[#a8a7b3] mt-4 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
                <span>🟢 Available: Sunday to Thursday</span>
                <span>🔴 Fri/Sat Weekend</span>
              </div>
              {validationErrors.date && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{validationErrors.date}</span>
                </p>
              )}
            </div>

            {/* Time Slot Picker */}
            <div className="md:col-span-5 bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e8c872] mb-3">
                <Clock className="w-4 h-4" />
                <span>Available Times (GMT+3)</span>
              </div>
              <p className="text-[11px] text-[#a8a7b3] mb-4">
                {selectedDate
                  ? `Select a time for ${selectedDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}:`
                  : 'Select a date on the calendar first.'}
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {generateSlots().map((slot) => {
                  const isSlotSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!selectedDate}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setValidationErrors((prev) => ({ ...prev, slot: '' }));
                      }}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        !selectedDate
                          ? 'border-[#2a2a38] text-[#555] cursor-not-allowed'
                          : isSlotSelected
                          ? 'border-[#e8c872] bg-[#e8c872] text-[#0a0a0f] font-bold shadow-md'
                          : 'border-[#2a2a38] bg-[#14141d] text-white hover:border-[#e8c872]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {validationErrors.slot && (
                <p className="text-red-400 text-xs mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{validationErrors.slot}</span>
                </p>
              )}
            </div>
          </div>

          {/* Continue CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2a2a38]">
            <div className="text-xs text-[#a8a7b3]">
              {selectedDate && selectedSlot ? (
                <span className="text-emerald-400 font-semibold">
                  ✓ Selected: {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedSlot}
                </span>
              ) : (
                'Choose a date and time slot to continue.'
              )}
            </div>
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="btn-gold px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Contact Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONTACT DETAILS & MESSAGE */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmitBooking} className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-[#a8a7b3] block">Consultation Appointment:</span>
              <span className="font-bold text-[#e8c872]">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                at {selectedSlot} (GMT+3)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-[#e8c872] hover:underline font-semibold"
            >
              Change Date &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Tariq Al-Mansoor"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full bg-[#0a0a0f] border rounded-xl px-4 py-3 text-xs text-white focus:outline-none ${
                  validationErrors.name ? 'border-red-400' : 'border-[#2a2a38] focus:border-[#e8c872]'
                }`}
              />
              {validationErrors.name && (
                <p className="text-red-400 text-[11px] mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g., tariq@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={`w-full bg-[#0a0a0f] border rounded-xl px-4 py-3 text-xs text-white focus:outline-none ${
                  validationErrors.email ? 'border-red-400' : 'border-[#2a2a38] focus:border-[#e8c872]'
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-400 text-[11px] mt-1">{validationErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                WhatsApp / Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="+973 3562 8353"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, whatsapp: '' }));
                }}
                className={`w-full bg-[#0a0a0f] border rounded-xl px-4 py-3 text-xs text-white focus:outline-none ${
                  validationErrors.whatsapp ? 'border-red-400' : 'border-[#2a2a38] focus:border-[#e8c872]'
                }`}
              />
              {validationErrors.whatsapp && (
                <p className="text-red-400 text-[11px] mt-1">{validationErrors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Country of Residence / Enterprise <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Bahrain, Saudi Arabia, USA, UAE..."
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, country: '' }));
                }}
                className={`w-full bg-[#0a0a0f] border rounded-xl px-4 py-3 text-xs text-white focus:outline-none ${
                  validationErrors.country ? 'border-red-400' : 'border-[#2a2a38] focus:border-[#e8c872]'
                }`}
              />
              {validationErrors.country && (
                <p className="text-red-400 text-[11px] mt-1">{validationErrors.country}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Project Overview & Questions (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell Ghazi about your proposed commercial activities, timeline, or current bottlenecks..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#e8c872] rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Privacy & Guarantee */}
          <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-xl p-3.5 text-xs text-[#a8a7b3] flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#e8c872] shrink-0" />
            <span>
              100% confidential. Your details are never shared with third parties or advertisers.
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2a2a38]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-full border border-[#2a2a38] text-xs text-[#a8a7b3] hover:text-white"
            >
              &larr; Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold px-8 py-3.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Scheduling Session...</span>
              ) : (
                <>
                  <span>Confirm Free Consultation</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
