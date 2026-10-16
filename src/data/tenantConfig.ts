// Enterprise Multi-Tenant Platform Architecture
// Separates the reusable CORE AI BUSINESS PLATFORM from CLIENT CONFIGURATION.
// Enables rapid deployment for enterprise clients (e.g., ALBA, Beyon, NBB, BBK, Real Estate, Logistics).

import { TenantBranding } from '../types/enterprise';

export interface EnterpriseTenant {
  branding: TenantBranding;
  features: {
    enableBahrainCr: boolean;
    enableUsAiTech: boolean;
    enableBilingualArabic: boolean;
    enableDirectConsultation: boolean;
    enableAiAgents: boolean;
    enableCrm: boolean;
  };
  customWorkflow: string;
}

export const ENTERPRISE_TENANTS: Record<string, EnterpriseTenant> = {
  default: {
    branding: {
      id: 'ghazi_wazir_default',
      name: 'Ghazi Wazir · Bab Al-Khaleej & Back for Brand',
      shortName: 'Bab Al-Khaleej · Back for Brand',
      tagline: 'Your business in Bahrain, powered by world-class technology.',
      jurisdiction: 'Kingdom of Bahrain & Florida, USA',
      primaryColor: '#e8c872',
      accentColor: '#00C98D',
      logoUrl: '/back-for-brand-logo.svg',
      executiveName: 'Ghazi Wazir',
      executiveRole: 'CEO (Back for Brand LLC) & CEO / Consultant (Bab Al-Khaleej)',
      contactEmail: 'ghaziwazirndm@gmail.com',
      contactPhone: '+973 3562 8353',
      supportedServices: ['CR Formation', 'Investor Visas', 'Document Clearance', 'Enterprise SEO', 'AI Workflows'],
    },
    features: {
      enableBahrainCr: true,
      enableUsAiTech: true,
      enableBilingualArabic: true,
      enableDirectConsultation: true,
      enableAiAgents: true,
      enableCrm: true,
    },
    customWorkflow: 'Dual-jurisdiction cross-border formation and technology integration.',
  },
  alba: {
    branding: {
      id: 'alba_industrial',
      name: 'Aluminium Bahrain (ALBA) · Enterprise AI Procurement',
      shortName: 'ALBA Enterprise AI',
      tagline: 'Sovereign industrial smelting logistics & AI predictive maintenance.',
      jurisdiction: 'Askar, Kingdom of Bahrain',
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
      logoUrl: '/back-for-brand-logo.svg',
      executiveName: 'Industrial Operations Directorate',
      executiveRole: 'Chief Procurement & AI Operations Lead',
      contactEmail: 'enterprise-ai@alba.com.bh',
      contactPhone: '+973 1783 0000',
      supportedServices: ['Supply Chain Automation', 'Predictive Smelter Telemetry', 'ESG Carbon Compliance'],
    },
    features: {
      enableBahrainCr: false,
      enableUsAiTech: true,
      enableBilingualArabic: true,
      enableDirectConsultation: true,
      enableAiAgents: true,
      enableCrm: true,
    },
    customWorkflow: 'High-throughput industrial telemetry, vendor onboarding, and environmental audits.',
  },
  beyon: {
    branding: {
      id: 'beyon_telecom',
      name: 'Beyon Digital · National Cloud & Sovereign AI Infrastructure',
      shortName: 'Beyon Sovereign AI',
      tagline: 'Connecting Bahrain and the GCC with secure sovereign intelligence.',
      jurisdiction: 'Hamala, Kingdom of Bahrain',
      primaryColor: '#8B5CF6',
      accentColor: '#EC4899',
      logoUrl: '/back-for-brand-logo.svg',
      executiveName: 'Digital Transformation Group',
      executiveRole: 'Executive Director of Cloud & Cyber Systems',
      contactEmail: 'digital@beyon.com',
      contactPhone: '+973 1788 1111',
      supportedServices: ['5G Edge Analytics', 'Sovereign Data Residency', 'B2B Enterprise Telco AI'],
    },
    features: {
      enableBahrainCr: false,
      enableUsAiTech: true,
      enableBilingualArabic: true,
      enableDirectConsultation: true,
      enableAiAgents: true,
      enableCrm: true,
    },
    customWorkflow: 'Telco billing mediation, AI subscriber churn retention, and sovereign data compliance.',
  },
  nbb: {
    branding: {
      id: 'nbb_fintech',
      name: 'National Bank of Bahrain (NBB) · Regulatory AI & Wealth Desk',
      shortName: 'NBB Fintech AI',
      tagline: 'Bahrain’s first local bank, pioneering intelligent compliant finance.',
      jurisdiction: 'Government Avenue, Manama, Bahrain',
      primaryColor: '#047857',
      accentColor: '#D97706',
      logoUrl: '/back-for-brand-logo.svg',
      executiveName: 'Institutional Banking Division',
      executiveRole: 'Managing Director of Fintech Compliance & CBB Liaison',
      contactEmail: 'institutional@nbbonline.com',
      contactPhone: '+973 1722 8888',
      supportedServices: ['CBB Sandbox Compliance', 'AI AML Screening', 'Corporate Trade Finance'],
    },
    features: {
      enableBahrainCr: true,
      enableUsAiTech: true,
      enableBilingualArabic: true,
      enableDirectConsultation: true,
      enableAiAgents: true,
      enableCrm: true,
    },
    customWorkflow: 'Central Bank of Bahrain (CBB) regulatory compliance, AML screening, and KYC onboarding.',
  },
  bbk: {
    branding: {
      id: 'bbk_banking',
      name: 'Bank of Bahrain & Kuwait (BBK) · Commercial Credit Systems',
      shortName: 'BBK Commercial AI',
      tagline: 'Cross-border Gulf trade finance and automated credit assessment.',
      jurisdiction: 'Manama, Kingdom of Bahrain & State of Kuwait',
      primaryColor: '#C2410C',
      accentColor: '#2563EB',
      logoUrl: '/back-for-brand-logo.svg',
      executiveName: 'Commercial Credit Committee',
      executiveRole: 'Head of Regional Corporate Credit',
      contactEmail: 'corporate@bbkonline.com',
      contactPhone: '+973 1722 3388',
      supportedServices: ['SME Commercial Loans', 'Trade Letters of Credit', 'Automated Financial Underwriting'],
    },
    features: {
      enableBahrainCr: true,
      enableUsAiTech: true,
      enableBilingualArabic: true,
      enableDirectConsultation: true,
      enableAiAgents: true,
      enableCrm: true,
    },
    customWorkflow: 'Cross-border GCC treasury settlement, credit underwriting, and corporate onboarding.',
  },
  gulf_realestate: {
    branding: {
      id: 'gulf_realestate',
      name: 'Gulf Commercial Real Estate & RERA Licensing Hub',
      shortName: 'Gulf PropTech Advisory',
      tagline: 'Golden Visa property investments, RERA licenses, and high-yield asset management.',
      jurisdiction: 'Bahrain Bay & Seef District, Bahrain',
      primaryColor: '#CA8A04',
      accentColor: '#059669',
      logoUrl: '/back-for-brand-logo.svg',
      executiveName: 'Real Estate Investment Board',
      executiveRole: 'Senior Commercial Property Consultant',
      contactEmail: 'properties@gulfrealestate.bh',
      contactPhone: '+973 3562 8353',
      supportedServices: ['Golden Residency by Property', 'RERA Commercial Brokerage', 'Office Leases & Municipality Zoning'],
    },
    features: {
      enableBahrainCr: true,
      enableUsAiTech: true,
      enableBilingualArabic: true,
      enableDirectConsultation: true,
      enableAiAgents: true,
      enableCrm: true,
    },
    customWorkflow: 'Property Golden Visa facilitation, municipality address approval, and lease registration.',
  },
};
