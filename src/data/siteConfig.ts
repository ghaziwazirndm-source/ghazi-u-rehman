/**
 * Authoritative Single Source of Truth for Entity Data, Contact Information & Branding
 * Back for Brand LLC (USA) & Bab Al Khaleej Business Consultancy W.L.L. (Bahrain)
 */

export const SITE_CONFIG = {
  person: {
    name: 'Ghazi Wazir',
    alternateName: 'Ghazi Ur Rehman',
    legalName: 'Ghazi Ur Rehman',
    title: 'CEO · Back for Brand LLC (USA) & Business Consultant · Bab Al-Khaleej (Bahrain)',
    bahrainTitle: 'Business Consultant · Bab Al Khaleej Business Consultancy W.L.L. (Kingdom of Bahrain)',
    usTitle: 'CEO · Back for Brand LLC (Florida, USA)',
    // Single verified primary phone and email across entire codebase
    phone: '+973 3562 8353',
    phoneRaw: '+97335628353',
    whatsappNumber: '97335628353',
    email: 'ghaziwazirndm@gmail.com',
    domain: 'https://ghaziurrehamn.com',
    photoUrl: '/assets/ghazi-wazir.jpg',
  },

  // Entity 1: Back for Brand LLC (United States)
  backForBrand: {
    legalName: 'Back for Brand LLC',
    entityType: 'Florida limited liability company',
    filingDate: '04 Dec 2024',
    registeredAddress: '7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA',
    addressNote: 'Registered/mailing address, not a public office',
    jurisdiction: 'Florida, USA',
    hubUrl: 'https://ghaziurrehamn.com/technology-services',
    services: [
      'Search Engine Optimization (SEO)',
      'Answer Engine Optimization (AEO)',
      'Generative Engine Optimization (GEO)',
      'Digital Marketing',
      'Autonomous AI Agents',
      'Workflow Automation',
    ],
  },

  // Entity 2: Bab Al Khaleej Business Consultancy W.L.L. (Kingdom of Bahrain)
  babAlKhaleej: {
    legalName: 'Bab Al Khaleej Business Consultancy W.L.L.',
    entityType: 'Kingdom of Bahrain (Limited Liability Company)',
    crStatus: 'Active',
    registeredAddress: 'Manama Center, Block 304, Road 385, Building 111, Flat/Shop 39, Manama, Bahrain',
    addressLocality: 'Manama',
    addressCountry: 'BH',
    jurisdiction: 'Kingdom of Bahrain',
    hubUrl: 'https://ghaziurrehamn.com/bahrain-business-setup',
    registeredActivities: [
      'Other Marketing/Promotion Activities',
      'Management consultancy activities',
    ],
    regulatoryDisclaimer:
      'We provide consultancy and document support. Approvals are issued exclusively by the competent Bahraini authorities (MOIC, LMRA, NPRA). We do not provide investment services or handle client funds.',
  },

  social: {
    linkedin: 'https://www.linkedin.com/in/ghazi-wazir', // TODO(owner): verify exact personal/corporate URL
    whatsapp: 'https://wa.me/97335628353',
  },
} as const;

export default SITE_CONFIG;
