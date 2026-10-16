export interface SocialLinkItem {
  id: string;
  name: string;
  category: 'social' | 'professional' | 'reviews';
  url: string;
  handle: string;
  color: string;
  active: boolean;
  sampleUrl: string;
  description: string;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  // 1. Direct Messaging & Community
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    url: 'https://wa.me/97335628353',
    sampleUrl: 'https://wa.me/97335628353',
    handle: '+973 3562 8353',
    color: '#25D366',
    active: true,
    description: 'Direct executive line for Bahrain business setup & corporate client inquiries',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'social',
    url: 'https://t.me/ghaziwazir',
    sampleUrl: 'https://t.me/ghaziwazir',
    handle: '@ghaziwazir',
    color: '#26A5E4',
    active: true,
    description: 'Encrypted channel for direct messaging & cross-border investor communication',
  },
  // 2. Executive Professional Networks
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'professional',
    url: 'https://linkedin.com/in/ghaziwazir',
    sampleUrl: 'https://linkedin.com/in/ghaziwazir',
    handle: 'in/ghaziwazir',
    color: '#0A66C2',
    active: true,
    description: 'CEO leadership updates, Gulf commercial legal frameworks & executive insights',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'professional',
    url: 'https://github.com/ghaziwazir',
    sampleUrl: 'https://github.com/ghaziwazir',
    handle: 'github.com/ghaziwazir',
    color: '#24292e',
    active: true,
    description: 'Open-source AI automation templates, Gemini integrations & developer repos',
  },
  {
    id: 'x_twitter',
    name: 'X (Twitter)',
    category: 'social',
    url: 'https://x.com/ghaziwazir',
    sampleUrl: 'https://x.com/ghaziwazir',
    handle: '@ghaziwazir',
    color: '#1DA1F2',
    active: true,
    description: 'Daily takes on Gulf market expansion, AI agent workflows, and SEO/GEO/AEO',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    url: 'https://youtube.com/@ghaziwazir',
    sampleUrl: 'https://youtube.com/@ghaziwazir',
    handle: '@ghaziwazir',
    color: '#FF0000',
    active: true,
    description: 'Masterclasses on Bahrain company registration, Sijilat MOIC filings & AI systems',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    url: 'https://instagram.com/ghaziwazir',
    sampleUrl: 'https://instagram.com/ghaziwazir',
    handle: '@ghaziwazir',
    color: '#E4405F',
    active: true,
    description: 'Behind the scenes: Kingdom of Bahrain, Dubai delegations, and Florida operations',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    url: 'https://facebook.com/ghaziwazir.ceo',
    sampleUrl: 'https://facebook.com/ghaziwazir.ceo',
    handle: 'fb.com/ghaziwazir.ceo',
    color: '#1877F2',
    active: true,
    description: 'Official corporate page & Gulf business community updates',
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'social',
    url: 'https://threads.net/@ghaziwazir',
    sampleUrl: 'https://threads.net/@ghaziwazir',
    handle: '@ghaziwazir',
    color: '#333344',
    active: true,
    description: 'Conversations on AI twins, brand building, and international founder life',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    url: 'https://tiktok.com/@ghaziwazir',
    sampleUrl: 'https://tiktok.com/@ghaziwazir',
    handle: '@ghaziwazir',
    color: '#00f2fe',
    active: true,
    description: 'Quick 60-second answers to Bahrain commercial registration & visa regulations',
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'professional',
    url: 'https://medium.com/@ghaziwazir',
    sampleUrl: 'https://medium.com/@ghaziwazir',
    handle: '@ghaziwazir',
    color: '#292929',
    active: true,
    description: 'In-depth articles: 100% Foreign Ownership in Bahrain, Sijilat, and Generative AI',
  },
  // 3. Freelance & Enterprise Marketplaces
  {
    id: 'upwork',
    name: 'Upwork Enterprise',
    category: 'professional',
    url: 'https://upwork.com/freelancers/~ghaziwazir',
    sampleUrl: 'https://upwork.com/freelancers/~ghaziwazir',
    handle: '~ghaziwazir',
    color: '#14a800',
    active: true,
    description: 'Top Rated Plus Enterprise Architect & AI Systems Strategist',
  },
  {
    id: 'fiverr',
    name: 'Fiverr Pro',
    category: 'professional',
    url: 'https://fiverr.com/ghaziwazir',
    sampleUrl: 'https://fiverr.com/ghaziwazir',
    handle: '@ghaziwazir',
    color: '#1DBF73',
    active: true,
    description: 'Pro verified consultant for corporate setup, SEO audit, and tech scaling',
  },
  {
    id: 'peopleperhour',
    name: 'PeoplePerHour',
    category: 'professional',
    url: 'https://peopleperhour.com/freelancer/technology/ghazi-wazir',
    sampleUrl: 'https://peopleperhour.com/freelancer/technology/ghazi-wazir',
    handle: 'ghazi-wazir',
    color: '#ff6600',
    active: true,
    description: 'Direct project advisory and high-impact digital consulting',
  },
  // 4. Verification, Reviews & Directories
  {
    id: 'google_business',
    name: 'Google Business',
    category: 'reviews',
    url: 'https://maps.google.com/?q=Ghazi+Wazir+Bahrain',
    sampleUrl: 'https://maps.google.com/?q=Ghazi+Wazir+Bahrain',
    handle: 'Ghazi Wazir (Verified)',
    color: '#4285F4',
    active: true,
    description: 'Verified Google Knowledge Panel & physical Bahrain corporate headquarters',
  },
  {
    id: 'clutch',
    name: 'Clutch.co',
    category: 'reviews',
    url: 'https://clutch.co/profile/back-for-brand',
    sampleUrl: 'https://clutch.co/profile/back-for-brand',
    handle: 'back-for-brand',
    color: '#ef4335',
    active: true,
    description: 'Verified 5-star B2B corporate agency client reviews and ratings',
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    category: 'reviews',
    url: 'https://trustpilot.com/review/backforbrand.com',
    sampleUrl: 'https://trustpilot.com/review/backforbrand.com',
    handle: 'backforbrand.com',
    color: '#00B67A',
    active: true,
    description: 'Verified global customer satisfaction score & legal consultancy feedback',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'social',
    url: 'https://snapchat.com/add/ghaziwazir',
    sampleUrl: 'https://snapchat.com/add/ghaziwazir',
    handle: 'ghaziwazir',
    color: '#FFFC00',
    active: true,
    description: 'Gulf region mobile stories & on-site ministry visits',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'social',
    url: 'https://pinterest.com/ghaziwazir',
    sampleUrl: 'https://pinterest.com/ghaziwazir',
    handle: 'ghaziwazir',
    color: '#BD081C',
    active: true,
    description: 'Brand identity moodboards, tech infographics, and executive design',
  },
];

const STORAGE_KEY = 'gw_custom_social_links';

export const getStoredSocialLinks = (): SocialLinkItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with defaults to guarantee new fields
        return DEFAULT_SOCIAL_LINKS.map((def) => {
          const match = parsed.find((p: any) => p.id === def.id || p.name === def.name);
          return match ? { ...def, ...match } : def;
        });
      }
    }
  } catch (e) {
    console.warn('[SocialStore] Error reading social links:', e);
  }
  return DEFAULT_SOCIAL_LINKS;
};

export const saveSocialLinks = (links: SocialLinkItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new CustomEvent('gw_social_links_updated', { detail: links }));
  } catch (e) {
    console.warn('[SocialStore] Error saving social links:', e);
  }
};

export const resetToSampleLinks = (): SocialLinkItem[] => {
  saveSocialLinks(DEFAULT_SOCIAL_LINKS);
  return DEFAULT_SOCIAL_LINKS;
};
