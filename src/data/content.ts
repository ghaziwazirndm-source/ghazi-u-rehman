export interface ServiceItem {
  id: string;
  category: 'bahrain' | 'tech';
  title: string;
  vslHeadline: string;
  emoji: string;
  lead: string;
  description: string;
  included: string[];
  faq: { q: string; a: string };
}

export interface GuideItem {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  date: string;
  sections: { heading: string; body: string }[];
}

export interface ReviewItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  country: string;
}

import { GHAZI_PHOTO_URL, GHAZI_PHOTO_PINK_URL } from '../assets/images/ceoPhoto';

export const GHAZI_INFO = {
  name: "Ghazi Wazir",
  alternateName: "Ghazi Ur Rehman",
  legalName: "Ghazi Ur Rehman",
  roleTitle: "CEO · Back for Brand LLC (USA) & Business Consultant · Bab Al-Khaleej (Bahrain)",
  bahrainTitle: "Business Consultant · Bab Al-Khaleej (Kingdom of Bahrain)",
  usTitle: "CEO · Back for Brand LLC (Florida, USA)",
  dualTitle: "CEO, Back for Brand LLC (Florida, USA) & Business Consultant, Bab Al-Khaleej (Bahrain)",
  headline: "Your business in Bahrain, powered by technology.",
  bio: "CEO of Back for Brand LLC (Florida, USA) delivering global technology, SEO, AEO, GEO, and AI automation, and business consultant at Bab Al-Khaleej (Kingdom of Bahrain) delivering turnkey company formation, investor and employee visas, and full corporate setup.",
  email: "ghaziwazirndm@gmail.com",
  phone: "+973 3562 8353",
  whatsappNumber: "97335628353",
  photoUrl: GHAZI_PHOTO_URL,
  photoPinkUrl: GHAZI_PHOTO_PINK_URL,
  logoUrl: "/back-for-brand-logo.svg",
};

export const BACK_FOR_BRAND_INFO = {
  legalName: "Back for Brand LLC",
  entityType: "Florida limited liability company",
  filingDate: "04 Dec 2024",
  registeredAddress: "7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA",
  addressNote: "Registered/mailing address, not a public office",
  services: ["SEO", "AEO", "GEO", "Digital Marketing", "AI Automation"],
};

export const BAB_AL_KHALEEJ_INFO = {
  legalName: "Bab Al Khaleej Business Consultancy W.L.L.",
  jurisdiction: "Kingdom of Bahrain (Limited Liability Company)",
  crStatus: "Active",
  registeredAddress: "Manama Center, Block 304, Road 385, Building 111, Flat/Shop 39, Manama, Bahrain",
  registeredActivities: [
    "Other Marketing/Promotion Activities",
    "Management consultancy activities",
  ],
};

export const BAHRAIN_SERVICES: ServiceItem[] = [
  {
    id: "business-registration",
    category: "bahrain",
    title: "Business Registration",
    vslHeadline: "Register your company in Bahrain the right way, without the guesswork",
    emoji: "🏢",
    lead: "Company formation and licensing, from choosing the legal form to receiving your commercial registration.",
    description: "We guide you from idea to a registered company in Bahrain: choosing the right activity and legal form, preparing documents and completing the commercial registration.",
    included: [
      "Business activity and legal form advice",
      "Company name reservation and document preparation",
      "Submission of your commercial registration (CR) and licensing application",
      "Follow-up with ministries and municipalities until CR issuance",
    ],
    faq: {
      q: "How long does registration take in Bahrain?",
      a: "It depends on your activity, legal form and any specialized ministry approvals required. After reviewing your plan, we give you a realistic timeline before you start."
    }
  },
  {
    id: "investor-visa",
    category: "bahrain",
    title: "Investor Visa",
    vslHeadline: "Invest in Bahrain with the right residency, prepared correctly the first time",
    emoji: "💼",
    lead: "Guidance and filing for investor residency linked to your Bahrain company.",
    description: "If you are investing in a Bahrain company, we help you understand the investor residency options, legal thresholds, and prepare a complete application.",
    included: [
      "Eligibility review for your specific corporate holding",
      "Document checklist and authorized attestation preparation",
      "Application submission to LMRA/NPRA and direct follow-up",
      "Guidance on CPR issuance and future renewals",
    ],
    faq: {
      q: "Who can apply for an investor visa in Bahrain?",
      a: "Eligibility depends on your company structure, your investment share, and current regulations of the relevant authorities. We review your case and explain the exact options that apply."
    }
  },
  {
    id: "worker-visa",
    category: "bahrain",
    title: "Worker Visa",
    vslHeadline: "Bring your team to Bahrain with visas and permits handled step by step",
    emoji: "🛂",
    lead: "Work visas and residence permits for your employees, handled step by step.",
    description: "Hiring from abroad or inside Bahrain? We help you prepare and track work visa and residence permit applications for your team seamlessly.",
    included: [
      "Checking role requirements and LMRA quota availability",
      "Preparing employee credential verification and company documentation",
      "Submitting and tracking each work permit application",
      "Support with medical checks, biometrics, and residence permits",
    ],
    faq: {
      q: "Can you handle visas for several employees at once?",
      a: "Yes. We organize the documents for your whole team and track each application separately, so you always know where each permit stands."
    }
  },
  {
    id: "document-consultancy",
    category: "bahrain",
    title: "Document Consultancy",
    vslHeadline: "Stop losing weeks to missing or wrong documents",
    emoji: "📄",
    lead: "We check, prepare and organize your documents so applications are right the first time.",
    description: "Missing or incorrect documents cause most delays with government authorities. We review, prepare and organize everything before it is submitted.",
    included: [
      "Tailored document checklist for your case",
      "Detailed review for errors, discrepancies, and missing stamps",
      "Guidance on embassy attestation, Apostille, and legal Arabic translation",
      "A clean, organized submission-ready dossier",
    ],
    faq: {
      q: "Do my documents need to be attested or translated?",
      a: "Requirements depend on the issuing country and the Bahrain government department. We advise you exactly what is required for your case before you spend unnecessary time or money."
    }
  },
  {
    id: "application-tracking",
    category: "bahrain",
    title: "Application Tracking",
    vslHeadline: "Always know exactly where your application stands",
    emoji: "📍",
    lead: "Follow every registration and visa application with clear, proactive status updates.",
    description: "Know exactly where every application stands. We actively monitor every submission and keep you updated at each milestone.",
    included: [
      "Real-time status checks on every CR and visa application",
      "Clear updates delivered directly via WhatsApp or email",
      "Immediate alerts whenever an authority requests clarification",
      "A consolidated audit log of all submissions and approvals",
    ],
    faq: {
      q: "How often will I receive updates?",
      a: "By WhatsApp or email, whichever you prefer, at every milestone or whenever there is any status change from the government portal."
    }
  },
  {
    id: "ongoing-support",
    category: "bahrain",
    title: "Ongoing Support",
    vslHeadline: "Keep your Bahrain company compliant long after you register",
    emoji: "🤝",
    lead: "Renewals, corporate amendments, and advisory answers whenever you need them.",
    description: "Your company requires continuous compliance after registration. We stay by your side for CR renewals, adding partners, changing addresses, and regulatory guidance.",
    included: [
      "Timely commercial registration and permit renewal filing",
      "Official amendments to company details, partners, or activities",
      "Quick answers to day-to-day administrative questions",
      "One dedicated local contact for your Bahrain business operations",
    ],
    faq: {
      q: "Can I use your ongoing support if I registered my company elsewhere?",
      a: "Yes! We welcome existing companies in Bahrain. Contact us with your current commercial registration details and we will audit your compliance needs."
    }
  },
];

export const TECH_SERVICES: ServiceItem[] = [
  {
    id: "seo",
    category: "tech",
    title: "Search Engine Optimization (SEO)",
    vslHeadline: "Get found on Google by customers who are ready to buy",
    emoji: "🔍",
    lead: "Technical and content SEO that ranks you at the top of Google in your target markets.",
    description: "We improve your website's technical foundation, keyword targeting, content structure, and authority so high-intent buyers find your brand organically.",
    included: [
      "Comprehensive technical SEO audit and site speed optimization",
      "High-intent keyword and commercial content strategy",
      "On-page optimization, meta tags, and internal link architecture",
      "Transparent monthly ranking, traffic, and conversion reports",
    ],
    faq: {
      q: "How long does SEO take to produce measurable results?",
      a: "SEO is a compound growth strategy. Noticeable rank and traffic shifts typically emerge within 60 to 90 days, with exponential gains over 6 to 12 months."
    }
  },
  {
    id: "geo-aeo",
    category: "tech",
    title: "GEO and AEO (AI Search Visibility)",
    vslHeadline: "Become the business that AI assistants recommend",
    emoji: "🤖",
    lead: "Be cited by ChatGPT, Gemini, and Perplexity, winning AI summaries and direct answers.",
    description: "People now ask AI assistants for recommendations. Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) position your brand to be cited and recommended by LLMs.",
    included: [
      "Content structured specifically for AI answer engines and embeddings",
      "Advanced JSON-LD schema markup and entity graph optimization",
      "High-authority FAQ and conversational Q&A content",
      "Regular tracking of AI chat citations across ChatGPT, Perplexity, and Gemini",
    ],
    faq: {
      q: "Can you guarantee my business will be cited in every AI answer?",
      a: "No one can guarantee specific LLM outputs, but we engineer the exact semantic and entity signals that modern retrieval-augmented generation (RAG) models look for when citing sources."
    }
  },
  {
    id: "digital-marketing",
    category: "tech",
    title: "Digital Marketing",
    vslHeadline: "Turn your marketing into qualified clients",
    emoji: "📣",
    lead: "Social, content, and paid campaigns engineered to bring in verified, qualified clients.",
    description: "We build and execute digital marketing campaigns with tight tracking so you see direct return on ad spend and client acquisitions.",
    included: [
      "Multi-channel paid media campaigns (Meta, Google Search, LinkedIn)",
      "High-converting creative assets and persuasive ad copy",
      "Email marketing and WhatsApp nurture sequences",
      "Full analytics tracking and return-on-ad-spend (ROAS) reporting",
    ],
    faq: {
      q: "Which advertising platforms do you recommend?",
      a: "We choose channels based on where your exact target audience spends time and makes buying decisions, whether that is LinkedIn B2B or Instagram/Meta."
    }
  },
  {
    id: "ai-agents",
    category: "tech",
    title: "AI Agents",
    vslHeadline: "Let an AI agent answer your leads around the clock",
    emoji: "🧠",
    lead: "Custom AI agents that qualify leads, support customers, and automate administrative tasks 24/7.",
    description: "We deploy intelligent conversational and workflow agents that capture enquiries instantly, answer complex questions, and seamlessly hand off to human teams when appropriate.",
    included: [
      "24/7 intelligent WhatsApp and website lead-qualification agents",
      "Customer support assistants trained on your internal documentation",
      "Internal productivity agents that summarize documents and draft replies",
      "Comprehensive testing, prompt engineering, and staff training",
    ],
    faq: {
      q: "What can an AI agent do for my small business?",
      a: "It eliminates lead drop-off by responding to enquiries in seconds, answers frequent questions accurately, books calendar appointments, and updates your CRM automatically."
    }
  },
  {
    id: "automation",
    category: "tech",
    title: "Business Automation",
    vslHeadline: "Automate the busywork and get hours back every week",
    emoji: "⚙️",
    lead: "Workflows that connect your business tools and eliminate hours of manual admin each week.",
    description: "We bridge your CRM, email, spreadsheets, WhatsApp, and invoicing tools so information flows automatically with zero double entry.",
    included: [
      "Connecting lead capture forms directly to CRM and WhatsApp alerts",
      "Automatic customer onboarding and follow-up email sequences",
      "Automated weekly reporting dashboards and invoice reminders",
      "Custom workflow architecture using Make, Zapier, and API integrations",
    ],
    faq: {
      q: "Do I need to migrate to entirely new software?",
      a: "Usually not! We prefer connecting the tools you already rely on to keep disruption minimal."
    }
  },
  {
    id: "websites-funnels",
    category: "tech",
    title: "Websites and Funnels",
    vslHeadline: "A fast website and funnel that turns visitors into enquiries",
    emoji: "🌐",
    lead: "Ultra-fast, mobile-first websites and conversion funnels engineered to convert visitors into booked calls.",
    description: "We build high-performance websites and lead-generating funnels with clean code, persuasive copy, and seamless integrations.",
    included: [
      "Lightning-fast, mobile-responsive custom design",
      "Conversion-focused landing pages and multi-step funnels",
      "Built-in calendar booking, WhatsApp CTAs, and analytics tracking",
      "Technical SEO foundation and Schema.org structured data from day one",
    ],
    faq: {
      q: "Which platforms do you build websites on?",
      a: "We work with modern stacks including React, modern CMSs, and no-code builders like Systeme.io depending on your budget and maintenance goals."
    }
  },
];

export const GUIDES: GuideItem[] = [
  {
    id: "guide-register-company-bahrain",
    title: "How to Register a Company in Bahrain: A Step-by-Step Overview",
    emoji: "📝",
    summary: "A clear overview of the main steps to register a company in Bahrain, from choosing an activity to opening a bank account.",
    date: "October 3, 2026",
    sections: [
      {
        heading: "1. Define your business activity",
        body: "Start by writing down exactly what your company will sell and to whom. In Bahrain, commercial activities are classified under international ISIC codes. Your chosen activity decides which municipal, civil defense, or ministry approvals you require."
      },
      {
        heading: "2. Choose a legal structure",
        body: "Bahrain offers various corporate structures, most commonly the W.L.L. (With Limited Liability), Sole Proprietorship, or Branch of a Foreign Company. Many business activities allow 100% foreign ownership with zero personal or corporate income tax."
      },
      {
        heading: "3. Prepare your documents",
        body: "Typical requirements include clear passport copies for all shareholders and managers, verified proof of residential address, draft company memorandum of association, and any specific academic or professional credentials required for regulated sectors."
      },
      {
        heading: "4. Apply for Commercial Registration (CR) and licenses",
        body: "Applications are submitted through the Ministry of Industry and Commerce (MOIC) portal. Once initial approval is secured, lease agreements (physical or virtual address) and municipal approvals are finalized to obtain the official active CR."
      },
      {
        heading: "5. Open a corporate bank account and commence operations",
        body: "After your CR is issued, you can apply for your corporate bank account with leading local or international banks in Bahrain, register with the LMRA for work permits, and set up your accounting infrastructure."
      }
    ]
  },
  {
    id: "guide-investor-visa-vs-worker-visa",
    title: "Investor Visa vs Worker Visa in Bahrain: What Is the Difference?",
    emoji: "🛂",
    summary: "The key differences between an investor visa and a worker visa, and which one fits your situation.",
    date: "October 3, 2026",
    sections: [
      {
        heading: "The core distinction",
        body: "An investor visa is granted on the basis of corporate equity or ownership in a registered Bahraini enterprise. A worker visa is granted based on an employer-employee contractual relationship wherein the company serves as your legal sponsor."
      },
      {
        heading: "Who should choose an Investor Visa?",
        body: "If you are an entrepreneur founding a business, a partner in a W.L.L., or an equity investor holding qualifying shares, the investor residency path gives you autonomy, multi-year residency, and the ability to sponsor your dependents."
      },
      {
        heading: "Who needs a Worker Visa?",
        body: "If your company is bringing in specialized managers, engineers, marketing professionals, or operational staff, each hired individual requires a work permit issued through the Labour Market Regulatory Authority (LMRA)."
      },
      {
        heading: "Documents and procedural requirements",
        body: "Both pathways require authenticated passports, medical examinations, and police clearances where applicable. Investor visas require corporate share verification, while worker visas require employment contracts and verified academic credentials."
      }
    ]
  },
  {
    id: "guide-business-setup-documents-checklist",
    title: "Business Setup Documents Checklist for Bahrain",
    emoji: "🗂️",
    summary: "A practical checklist of documents to prepare before you apply for business registration.",
    date: "October 3, 2026",
    sections: [
      {
        heading: "Owner and shareholder documents",
        body: "Full-color passport scans with at least 6 months validity for all partners. Clear proof of residential address (utility bill or bank statement within the last 3 months). Current CV/resume outlining relevant experience."
      },
      {
        heading: "Company formation materials",
        body: "Three proposed trade names in order of preference. Comprehensive description of the planned commercial activities. Proposed ownership percentages and management appointment resolutions."
      },
      {
        heading: "Lease and address confirmation",
        body: "A valid lease agreement for a physical commercial office or an authorized virtual commercial address (incubator or business center registered in Bahrain)."
      },
      {
        heading: "Attestation and translation guidelines",
        body: "Any foreign corporate documents (such as parent company resolutions for branch registration) must be notarized, Apostilled, or legalized by the Bahrain Embassy and translated into Arabic by an authorized legal translator."
      }
    ]
  },
  {
    id: "guide-what-is-geo-aeo",
    title: "What Are GEO and AEO? Getting Found in AI Search",
    emoji: "✨",
    summary: "A simple explanation of Generative Engine Optimization and Answer Engine Optimization, and why they matter now.",
    date: "October 3, 2026",
    sections: [
      {
        heading: "The transformation of online search",
        body: "Millions of consumers and business decision-makers now bypass traditional 10-blue-link Google searches in favor of conversational AI agents like ChatGPT, Google Gemini, and Perplexity for vendor recommendations."
      },
      {
        heading: "Defining Generative Engine Optimization (GEO)",
        body: "GEO is the practice of optimizing your brand's digital footprint so generative AI models understand your core expertise, trust your domain, and synthesize your business as an authoritative source in generated answers."
      },
      {
        heading: "Defining Answer Engine Optimization (AEO)",
        body: "AEO focuses on structuring content so search engines and voice assistants can extract direct, immediate answers for featured snippets, voice search queries, and AI overviews."
      },
      {
        heading: "Practical strategies that drive AI citations",
        body: "Include comprehensive schema markup, publish authoritative original research, maintain consistent entity records across company directories, and format content with clear Q&A patterns."
      }
    ]
  },
  {
    id: "guide-seo-vs-geo-vs-aeo",
    title: "SEO vs GEO vs AEO: What Is the Difference?",
    emoji: "⚖️",
    summary: "How traditional SEO, GEO, and AEO differ, and how they work together for complete market dominance.",
    date: "October 3, 2026",
    sections: [
      {
        heading: "Traditional SEO: Ranking in search results",
        body: "Traditional SEO focuses on keywords, backlinks, crawlability, and ranking specific landing pages in standard search engine result pages (SERPs)."
      },
      {
        heading: "AEO: Winning the single direct answer",
        body: "AEO focuses on concise, factual clarity so search engines select your answer for 'Position Zero' or voice device playback."
      },
      {
        heading: "GEO: Becoming the cited source in AI synthesis",
        body: "GEO focuses on conceptual relevance, entity depth, and citations across multiple high-trust sources so LLMs reference you when constructing multi-paragraph answers."
      },
      {
        heading: "The unified modern growth playbook",
        body: "You do not have to choose one over the others. Strong technical SEO provides the indexable foundation, AEO captures direct questions, and GEO protects your brand's presence in conversational AI engines."
      }
    ]
  },
  {
    id: "guide-ai-agents-for-small-business",
    title: "How AI Agents Can Help a Small Business",
    emoji: "🚀",
    summary: "Practical ways an AI agent can save time, eliminate missed opportunities, and capture more leads for a small business.",
    date: "October 3, 2026",
    sections: [
      {
        heading: "What exactly is a business AI agent?",
        body: "Unlike basic scripted chatbots, an AI agent understands context, queries your business knowledge base, evaluates intent, and takes action—like booking calls or routing high-value prospects."
      },
      {
        heading: "Instant 24/7 lead qualification",
        body: "Speed to lead is the #1 factor in conversion. An AI agent engages website visitors or WhatsApp inquiries within 5 seconds, asks qualifying budget and timeline questions, and locks in booked meetings on your calendar."
      },
      {
        heading: "Automated customer support",
        body: "Give instant answers to repetitive questions regarding required documents, pricing tiers, operational hours, and application procedures without tying up staff time."
      },
      {
        heading: "How to deploy without business disruption",
        body: "Start with a single high-impact channel (such as a website booking assistant or WhatsApp enquiry bot). Keep human oversight enabled so any complex query is escalated immediately to your phone."
      }
    ]
  },
];

export const PACKAGES = [
  {
    name: "Essential",
    emoji: "🌱",
    subtitle: "Plan your setup with expert guidance",
    priceText: "Custom Quote",
    popular: false,
    features: [
      "1-on-1 strategic consultation and business plan review",
      "Commercial activity selection & legal structure advice",
      "Personalized document preparation checklist",
      "Name reservation and eligibility verification",
      "Cost breakdown of government fees and capital requirements",
    ]
  },
  {
    name: "Complete",
    emoji: "💎",
    subtitle: "End-to-end registration and visas handled for you",
    priceText: "Most Popular",
    popular: true,
    features: [
      "Everything in the Essential package",
      "Full Commercial Registration (CR) and license filing",
      "Investor or worker visa documentation & LMRA submission",
      "Real-time application tracking with WhatsApp alerts",
      "Virtual/physical office compliance facilitation",
      "Assistance with corporate bank account introduction",
    ]
  },
  {
    name: "Setup + Growth",
    emoji: "🚀",
    subtitle: "Launch compliant and get clients from day one",
    priceText: "Full Solution",
    popular: false,
    features: [
      "Everything in the Complete package",
      "Custom, high-speed website or conversion funnel",
      "Complete SEO, GEO & AEO search foundation",
      "Custom 24/7 AI lead qualification agent for WhatsApp/web",
      "Workflow automation connecting CRM, forms & follow-ups",
      "Priority advisory support for 3 months post-launch",
    ]
  }
];

export const SOCIAL_LINKS = [
  { name: "WhatsApp", url: "https://wa.me/97335628353", color: "#25D366", active: true },
  { name: "LinkedIn", url: "https://linkedin.com/in/ghaziwazir", color: "#0A66C2", active: true },
  { name: "Facebook", url: "#", color: "#0866FF", active: false },
  { name: "Instagram", url: "#", color: "#FF0069", active: false },
  { name: "X (Twitter)", url: "#", color: "#2a2a38", active: false },
  { name: "YouTube", url: "#", color: "#FF0000", active: false },
  { name: "TikTok", url: "#", color: "#2a2a38", active: false },
  { name: "Telegram", url: "https://t.me/ghaziwazir", color: "#26A5E4", active: true },
  { name: "Snapchat", url: "#", color: "#FFFC00", active: false },
  { name: "Pinterest", url: "#", color: "#BD081C", active: false },
  { name: "Threads", url: "#", color: "#2a2a38", active: false },
  { name: "Medium", url: "#", color: "#2a2a38", active: false },
  { name: "GitHub", url: "#", color: "#2a2a38", active: false },
  { name: "Google Business", url: "#", color: "#4285F4", active: false },
  { name: "Fiverr", url: "#", color: "#1DBF73", active: false },
  { name: "Upwork", url: "#", color: "#6FDA44", active: false },
  { name: "Freelancer", url: "#", color: "#29B2FE", active: false },
  { name: "PeoplePerHour", url: "#", color: "#f26722", active: false },
  { name: "Clutch", url: "#", color: "#ef4335", active: false },
  { name: "Trustpilot", url: "#", color: "#00B67A", active: false },
];
