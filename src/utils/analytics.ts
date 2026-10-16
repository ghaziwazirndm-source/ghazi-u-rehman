// Enterprise Analytics & Ad Campaign Attribution Engine
// Supports GA4 (placeholder: YOUR_GA4_ID) and Meta Pixel (placeholder: YOUR_META_PIXEL_ID).
// Automatically parses and persists UTM parameters, gclid, and fbclid for ad-readiness.

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export interface AdAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt?: string;
}

const ATTRIBUTION_STORAGE_KEY = 'gw_ad_attribution_v1';

/**
 * Initialize and capture URL advertising campaign parameters
 */
export function initAdAttribution(): AdAttribution {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    
    // Also check hash query string (e.g. #/apply?utm_source=fb)
    let hashParams = new URLSearchParams();
    if (window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      hashParams = new URLSearchParams(hashQuery);
    }

    const utm_source = searchParams.get('utm_source') || hashParams.get('utm_source');
    const utm_medium = searchParams.get('utm_medium') || hashParams.get('utm_medium');
    const utm_campaign = searchParams.get('utm_campaign') || hashParams.get('utm_campaign');
    const utm_term = searchParams.get('utm_term') || hashParams.get('utm_term');
    const utm_content = searchParams.get('utm_content') || hashParams.get('utm_content');
    const gclid = searchParams.get('gclid') || hashParams.get('gclid');
    const fbclid = searchParams.get('fbclid') || hashParams.get('fbclid');

    if (utm_source || utm_medium || utm_campaign || gclid || fbclid) {
      const attribution: AdAttribution = {
        utm_source: utm_source || (fbclid ? 'meta_ads' : gclid ? 'google_ads' : undefined),
        utm_medium: utm_medium || (fbclid || gclid ? 'cpc' : undefined),
        utm_campaign: utm_campaign || undefined,
        utm_term: utm_term || undefined,
        utm_content: utm_content || undefined,
        gclid: gclid || undefined,
        fbclid: fbclid || undefined,
        referrer: document.referrer || undefined,
        landingPage: window.location.href,
        capturedAt: new Date().toISOString(),
      };

      localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
      return attribution;
    }

    const saved = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore storage issues
  }

  return {};
}

/**
 * Retrieve current ad campaign attribution
 */
export function getAdAttribution(): AdAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return {};
}

/**
 * Generate human-readable lead source reflecting ad campaign
 */
export function getLeadSource(defaultSource: string = 'website'): string {
  const attr = getAdAttribution();
  if (attr.utm_source) {
    if (attr.utm_campaign) {
      return `${attr.utm_source} / ${attr.utm_campaign}`;
    }
    return attr.utm_source;
  }
  return defaultSource;
}

/**
 * Core event dispatcher to GA4 and Meta Pixel
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  const attr = getAdAttribution();
  const enrichedParams = {
    ...params,
    ...attr,
    timestamp: new Date().toISOString(),
  };

  // 1. Google Analytics 4 (GA4)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, enrichedParams);
  }

  // 2. Meta Pixel (Facebook Ads)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    const metaStandardEvents: Record<string, string> = {
      generate_lead: 'Lead',
      contact_form_submit: 'Contact',
      whatsapp_click: 'Contact',
      schedule_consultation: 'Schedule',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      page_view: 'PageView',
      select_content: 'ViewContent',
    };

    const fbEvent = metaStandardEvents[eventName] || 'Custom';
    if (fbEvent === 'Custom') {
      window.fbq('trackCustom', eventName, enrichedParams);
    } else {
      window.fbq('track', fbEvent, enrichedParams);
    }
  }
}

/**
 * Track route / virtual page views
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/**
 * WhatsApp CTA click telemetry
 */
export function trackWhatsAppClick(location: string = 'general') {
  trackEvent('whatsapp_click', {
    contact_method: 'whatsapp',
    phone_number: '+973 3562 8353',
    click_location: location,
  });
}

/**
 * Contact form submission telemetry
 */
export function trackContactFormSubmit(formData: { name: string; email: string }) {
  trackEvent('contact_form_submit', {
    form_name: 'contact_form',
    contact_intent: 'inquiry',
  });
  trackEvent('generate_lead', {
    lead_type: 'contact_inquiry',
    source: getLeadSource('contact_form'),
  });
}

/**
 * Booking consultation submission telemetry
 */
export function trackBookingSubmit(bookingData: {
  name: string;
  email: string;
  service: string;
  date: string;
}) {
  trackEvent('schedule_consultation', {
    service_name: bookingData.service,
    consultation_date: bookingData.date,
  });
  trackEvent('generate_lead', {
    lead_type: 'booked_consultation',
    service: bookingData.service,
    source: getLeadSource('booking_calendar'),
  });
}

/**
 * Checkout / retainer initiated telemetry
 */
export function trackPaymentInitiate(serviceTitle: string, amountUsd: number) {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: amountUsd,
    items: [{ item_name: serviceTitle, price: amountUsd }],
  });
}

/**
 * Payment success telemetry
 */
export function trackPaymentSuccess(
  transactionId: string,
  amountUsd: number,
  serviceTitle: string
) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    currency: 'USD',
    value: amountUsd,
    items: [{ item_name: serviceTitle, price: amountUsd }],
  });
}

/**
 * VSL Video engagement telemetry
 */
export function trackVslWatch(serviceTitle: string) {
  trackEvent('select_content', {
    content_type: 'vsl_video',
    item_id: serviceTitle,
  });
}

/**
 * Funnel step advancement telemetry
 */
export function trackFunnelStep(stepName: string, serviceTitle: string) {
  trackEvent('funnel_step', {
    step_name: stepName,
    service: serviceTitle,
  });
}

// Auto-run attribution capture on import
if (typeof window !== 'undefined') {
  initAdAttribution();
}
