// Gulf and Global Payment Gateway Types & Models

export type PaymentGatewayType =
  | 'benefit_pay'
  | 'fawri_plus'
  | 'tap_gcc'
  | 'stripe_card'
  | 'paypal'
  | 'bank_wire';

export type PaymentStatus =
  | 'PENDING_VERIFICATION'
  | 'SETTLED'
  | 'FAILED'
  | 'REFUNDED'
  | 'AUTHORIZED';

export interface PaymentTransaction {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCountry: string;
  serviceId: string;
  serviceTitle: string;
  packageTier?: string;
  amountBhd: number;
  amountUsd: number;
  gateway: PaymentGatewayType;
  gatewayName: string;
  status: PaymentStatus;
  referenceNumber: string;
  fawriReference?: string;
  notes?: string;
  receiptUrl?: string;
  timestamp: string;
}

export interface GatewayConfig {
  id: PaymentGatewayType;
  name: string;
  tagline: string;
  region: 'Bahrain' | 'GCC' | 'Global';
  badgeColor: string;
  iconName: string;
  currencies: string[];
  testMode: boolean;
  status: 'ACTIVE' | 'CONFIGURATION_REQUIRED' | 'READY_FOR_KEYS';
  requiredEnvKeys: string[];
}

export const SUPPORTED_GATEWAYS: GatewayConfig[] = [
  {
    id: 'benefit_pay',
    name: 'BenefitPay (Bahrain)',
    tagline: 'Instant QR and mobile debit transfer via the National Electronic Network (Bahrain).',
    region: 'Bahrain',
    badgeColor: '#EF4444',
    iconName: 'QrCode',
    currencies: ['BHD'],
    testMode: false,
    status: 'ACTIVE',
    requiredEnvKeys: ['BENEFIT_MERCHANT_ID', 'BENEFIT_SECRET_KEY'],
  },
  {
    id: 'fawri_plus',
    name: 'Fawri / Fawri+ (IBAN Transfer)',
    tagline: 'Direct Electronic Fund Transfer System across all Bahrain & GCC banks within 30 seconds.',
    region: 'Bahrain',
    badgeColor: '#10B981',
    iconName: 'Building2',
    currencies: ['BHD', 'SAR', 'AED'],
    testMode: false,
    status: 'ACTIVE',
    requiredEnvKeys: ['CORPORATE_IBAN_BAHRAIN'],
  },
  {
    id: 'tap_gcc',
    name: 'Tap Payments (GCC Debit / Mada / KNET)',
    tagline: 'Accepts Mada (KSA), KNET (Kuwait), Benefit (Bahrain), and Qatar debit cards.',
    region: 'GCC',
    badgeColor: '#3B82F6',
    iconName: 'CreditCard',
    currencies: ['BHD', 'SAR', 'AED', 'KWD', 'QAR'],
    testMode: true,
    status: 'CONFIGURATION_REQUIRED',
    requiredEnvKeys: ['TAP_PUBLIC_KEY', 'TAP_SECRET_KEY'],
  },
  {
    id: 'stripe_card',
    name: 'Stripe (Visa / Mastercard / Apple Pay)',
    tagline: 'Global credit and debit cards processed through Back for Brand LLC (Florida, USA).',
    region: 'Global',
    badgeColor: '#6366F1',
    iconName: 'CreditCard',
    currencies: ['USD', 'BHD', 'EUR', 'GBP'],
    testMode: true,
    status: 'CONFIGURATION_REQUIRED',
    requiredEnvKeys: ['STRIPE_PUBLISHABLE_KEY', 'STRIPE_SECRET_KEY'],
  },
  {
    id: 'paypal',
    name: 'PayPal International',
    tagline: 'Instant PayPal balance or international credit card with buyer protection.',
    region: 'Global',
    badgeColor: '#0284C7',
    iconName: 'DollarSign',
    currencies: ['USD', 'EUR', 'GBP'],
    testMode: true,
    status: 'CONFIGURATION_REQUIRED',
    requiredEnvKeys: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'],
  },
  {
    id: 'bank_wire',
    name: 'Official Corporate Bank Wire',
    tagline: 'Direct treasury settlement with proforma invoice for Bab Al-Khaleej or Back for Brand LLC.',
    region: 'Global',
    badgeColor: '#D97706',
    iconName: 'Landmark',
    currencies: ['BHD', 'USD'],
    testMode: false,
    status: 'ACTIVE',
    requiredEnvKeys: ['CHASE_ACH_ROUTING', 'NBB_SWIFT_BIC'],
  },
];
