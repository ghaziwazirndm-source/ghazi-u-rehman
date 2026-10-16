// System Configuration Store
// Central management for all platform configuration options:
// Mail & SMTP Delivery, AI Agents Fleet, Payment Gateways, Jurisdictions & RBAC Security
import { db, OperationType, handleFirestoreError } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface SystemConfig {
  mail: {
    activeOption: 'option1_resend' | 'option2_smtp' | 'option3_simulator';
    resendApiKey: string;
    resendFromEmail: string;
    resendFromName: string;
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUser: string;
    smtpPass: string;
    replyTo: string;
    autoProcessQueue: boolean;
    notificationCc: string;
  };
  aiFleet: {
    defaultModel: 'gemini-3.8-flash' | 'gemini-1.5-pro' | 'gemini-2.5-flash';
    creativityTemperature: number;
    autonomousMode: boolean;
    masterPromptPrefix: string;
    languageMode: 'bilingual' | 'en' | 'ar';
    maxDailyTasksPerAgent: number;
  };
  payments: {
    enableBenefitPay: boolean;
    enableTap: boolean;
    enableStripe: boolean;
    enableTamara: boolean;
    enableWhatsAppCheckout: boolean;
    defaultCurrency: 'BHD' | 'USD' | 'SAR';
    vatRatePercent: number;
  };
  tenant: {
    activeJurisdiction: 'bahrain' | 'usa';
    companyNameBahrain: string;
    crNumberBahrain: string;
    companyNameUsa: string;
    ceoName: string;
    ceoEmail: string;
    ceoPhone: string;
    bahrainAddress: string;
    usaAddress: string;
  };
  security: {
    strictPublicIsolation: boolean;
    sessionTimeoutMinutes: number;
    enableDevSecurityPanel: boolean;
    logVerbosity: 'minimal' | 'standard' | 'verbose';
  };
  domain: {
    domainName: string;
    subdomain: string;
    provider: 'hostinger' | 'cloudflare' | 'godaddy' | 'custom';
    status: 'CONNECTED' | 'DNS_PENDING' | 'CONFIGURED';
    sslStatus: 'ACTIVE' | 'ISSUING' | 'PENDING';
    nameservers: string[];
    aRecordIp: string;
    cnameTarget: string;
    verificationTxt: string;
    emailRouting: 'hostinger_titan' | 'google_workspace' | 'resend';
    hpanelUrl: string;
    lastDnsCheck?: string;
    dnsPropagated?: boolean;
    autoSslRenew?: boolean;
  };
  integrations: {
    hostinger: {
      domainName: string;
      nameservers: string[];
      hpanelStatus: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
      dnsVerificationStatus: 'VERIFIED' | 'PROPAGATING' | 'PENDING';
      zoneFileActive: boolean;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    whatsapp: {
      metaAppId: string;
      phoneNumberId: string;
      systemUserToken: string;
      webhookVerifyToken: string;
      webhookCallbackUrl: string;
      customDirectNumber: string;
      defaultPrefilledMessage: string;
      embeddedWidgetActive: boolean;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    googleCalendar: {
      clientId: string;
      calendarId: string;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    metaAds: {
      pixelId: string;
      conversionsApiKey: string;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    linkedIn: {
      partnerId: string;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    googleBusiness: {
      listingName: string;
      locationId: string;
      status: 'CONNECTED';
    };
    resend: {
      apiKey: string;
      fromEmail: string;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    benefitPay: {
      merchantId: string;
      secretKey: string;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    stripe: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
      status: 'CONNECTED' | 'CONFIGURATION REQUIRED' | 'NOT CONNECTED';
    };
    gemini: {
      apiKey: string;
      status: 'CONNECTED';
    };
  };
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  mail: {
    activeOption: 'option1_resend',
    resendApiKey: 're_live_84f923b0a7c4912e8417',
    resendFromEmail: 'advisory@backforbrand.com',
    resendFromName: 'Ghazi Wazir · Bab Al-Khaleej & Back for Brand',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpSecure: true,
    smtpUser: 'ghaziwazirndm@gmail.com',
    smtpPass: '••••••••••••••••',
    replyTo: 'ghaziwazirndm@gmail.com',
    autoProcessQueue: true,
    notificationCc: 'ghaziwazirndm@gmail.com',
  },
  aiFleet: {
    defaultModel: 'gemini-3.8-flash',
    creativityTemperature: 0.4,
    autonomousMode: true,
    masterPromptPrefix:
      'You are an executive autonomous agent in Ghazi Wazir\'s 25-agent business fleet for Bab Al-Khaleej (Bahrain) and Back for Brand LLC (Florida, USA). Deliver precise, elite, actionable corporate outputs with zero fluff.',
    languageMode: 'bilingual',
    maxDailyTasksPerAgent: 100,
  },
  payments: {
    enableBenefitPay: true,
    enableTap: true,
    enableStripe: true,
    enableTamara: true,
    enableWhatsAppCheckout: true,
    defaultCurrency: 'BHD',
    vatRatePercent: 10,
  },
  tenant: {
    activeJurisdiction: 'bahrain',
    companyNameBahrain: 'Bab Al-Khaleej for Business & Corporate Services',
    crNumberBahrain: 'CR-99210-BH',
    companyNameUsa: 'Back for Brand LLC (Florida, USA)',
    ceoName: 'Ghazi Wazir',
    ceoEmail: 'ghaziwazirndm@gmail.com',
    ceoPhone: '+973 3562 8353',
    bahrainAddress: 'Financial Harbour Tower, Manama, Kingdom of Bahrain',
    usaAddress: 'Suite 400, Brickell Ave, Miami, FL 33131, USA',
  },
  security: {
    strictPublicIsolation: true,
    sessionTimeoutMinutes: 480,
    enableDevSecurityPanel: true,
    logVerbosity: 'standard',
  },
  domain: {
    domainName: 'backforbrand.com',
    subdomain: '@',
    provider: 'hostinger',
    status: 'CONNECTED',
    sslStatus: 'ACTIVE',
    nameservers: ['ns1.dns-parking.com', 'ns2.dns-parking.com'],
    aRecordIp: '216.239.32.21',
    cnameTarget: 'backforbrand.com',
    verificationTxt: 'gw-verify=ai-studio-ghaziwazirceobac-a35dbe61-b2cd-4a60-9020-9af974f55f65',
    emailRouting: 'hostinger_titan',
    hpanelUrl: 'https://hpanel.hostinger.com',
    lastDnsCheck: new Date().toISOString(),
    dnsPropagated: true,
    autoSslRenew: true,
  },
  integrations: {
    hostinger: {
      domainName: 'backforbrand.com',
      nameservers: ['ns1.dns-parking.com', 'ns2.dns-parking.com'],
      hpanelStatus: 'CONNECTED',
      dnsVerificationStatus: 'VERIFIED',
      zoneFileActive: true,
      status: 'CONNECTED',
    },
    whatsapp: {
      metaAppId: '109481920491823',
      phoneNumberId: '104819204910291',
      systemUserToken: 'EAAG9ZCZAPxxxx...live_access_token',
      webhookVerifyToken: 'gw_bahrain_secret_webhook_verify_2026',
      webhookCallbackUrl: 'https://ais-dev-vfegt5lvnikj3aiyge36jz-377619237809.europe-west2.run.app/api/webhook/whatsapp',
      customDirectNumber: '+973 3562 8353',
      defaultPrefilledMessage: 'Hello Ghazi Wazir, I am inquiring about Bahrain company formation and corporate services with Bab Al-Khaleej.',
      embeddedWidgetActive: true,
      status: 'CONNECTED',
    },
    googleCalendar: {
      clientId: '467995895862-te47m08k5n690ca5v7u32r3df6ns6n4p.apps.googleusercontent.com',
      calendarId: 'ghaziwazirndm@gmail.com',
      status: 'CONNECTED',
    },
    metaAds: {
      pixelId: '984102941094',
      conversionsApiKey: 'EAAX89210_live_capi',
      status: 'CONNECTED',
    },
    linkedIn: {
      partnerId: '5041920',
      status: 'CONNECTED',
    },
    googleBusiness: {
      listingName: 'Bab Al-Khaleej Business Consultancy - Manama',
      locationId: 'locations/1094810294',
      status: 'CONNECTED',
    },
    resend: {
      apiKey: 're_live_84f923b0a7c4912e8417',
      fromEmail: 'advisory@backforbrand.com',
      status: 'CONNECTED',
    },
    benefitPay: {
      merchantId: 'BP-MERCHANT-88129',
      secretKey: 'sec_live_benefit_bahrain',
      status: 'CONNECTED',
    },
    stripe: {
      publishableKey: 'pk_live_51P92kL2eZvKYlo2C',
      secretKey: 'sk_live_51P92kL2eZvKYlo2C...',
      webhookSecret: 'whsec_9918204912',
      status: 'CONNECTED',
    },
    gemini: {
      apiKey: 'AIzaSyCLsHu7X5apW34qVblL-BCwkDzA3LlCgS4',
      status: 'CONNECTED',
    },
  },
};

const SYSTEM_CONFIG_STORAGE_KEY = 'gw_system_configuration_v3';

export const getStoredSystemConfig = (): SystemConfig => {
  try {
    const raw = localStorage.getItem(SYSTEM_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        mail: { ...DEFAULT_SYSTEM_CONFIG.mail, ...(parsed.mail || {}) },
        aiFleet: { ...DEFAULT_SYSTEM_CONFIG.aiFleet, ...(parsed.aiFleet || {}) },
        payments: { ...DEFAULT_SYSTEM_CONFIG.payments, ...(parsed.payments || {}) },
        tenant: { ...DEFAULT_SYSTEM_CONFIG.tenant, ...(parsed.tenant || {}) },
        security: { ...DEFAULT_SYSTEM_CONFIG.security, ...(parsed.security || {}) },
        domain: { ...DEFAULT_SYSTEM_CONFIG.domain, ...(parsed.domain || {}) },
        integrations: {
          hostinger: { ...DEFAULT_SYSTEM_CONFIG.integrations.hostinger, ...(parsed.integrations?.hostinger || {}) },
          whatsapp: { ...DEFAULT_SYSTEM_CONFIG.integrations.whatsapp, ...(parsed.integrations?.whatsapp || {}) },
          googleCalendar: { ...DEFAULT_SYSTEM_CONFIG.integrations.googleCalendar, ...(parsed.integrations?.googleCalendar || {}) },
          metaAds: { ...DEFAULT_SYSTEM_CONFIG.integrations.metaAds, ...(parsed.integrations?.metaAds || {}) },
          linkedIn: { ...DEFAULT_SYSTEM_CONFIG.integrations.linkedIn, ...(parsed.integrations?.linkedIn || {}) },
          googleBusiness: { ...DEFAULT_SYSTEM_CONFIG.integrations.googleBusiness, ...(parsed.integrations?.googleBusiness || {}) },
          resend: { ...DEFAULT_SYSTEM_CONFIG.integrations.resend, ...(parsed.integrations?.resend || {}) },
          benefitPay: { ...DEFAULT_SYSTEM_CONFIG.integrations.benefitPay, ...(parsed.integrations?.benefitPay || {}) },
          stripe: { ...DEFAULT_SYSTEM_CONFIG.integrations.stripe, ...(parsed.integrations?.stripe || {}) },
          gemini: { ...DEFAULT_SYSTEM_CONFIG.integrations.gemini, ...(parsed.integrations?.gemini || {}) },
        },
      };
    }
  } catch (e) {
    console.warn('[SystemConfig] Failed to read stored config:', e);
  }
  return DEFAULT_SYSTEM_CONFIG;
};

export const saveSystemConfig = (config: SystemConfig): void => {
  try {
    localStorage.setItem(SYSTEM_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('gw_system_config_updated', { detail: config }));
  } catch (e) {
    console.warn('[SystemConfig] Failed to save config:', e);
  }

  // Persist to Cloud Firestore
  const pathForWrite = 'system_settings/default';
  setDoc(doc(db, 'system_settings', 'default'), {
    id: 'default',
    configJson: JSON.stringify(config),
    updatedAt: new Date().toISOString(),
    updatedBy: 'Ghazi Wazir (CEO)',
  }).catch((err) => {
    try {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    } catch (e) {
      console.warn('[Firestore] System config write handled:', e);
    }
  });
};

export const resetSystemConfig = (): SystemConfig => {
  saveSystemConfig(DEFAULT_SYSTEM_CONFIG);
  return DEFAULT_SYSTEM_CONFIG;
};
