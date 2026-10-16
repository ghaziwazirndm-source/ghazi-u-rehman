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
  faqs: { q: string; a: string }[];
}

export interface GuideItem {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  date: string; // ISO date YYYY-MM-DD
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
import { SITE_CONFIG } from './siteConfig';

export const GHAZI_INFO = {
  name: SITE_CONFIG.person.name,
  alternateName: SITE_CONFIG.person.alternateName,
  legalName: SITE_CONFIG.person.legalName,
  roleTitle: SITE_CONFIG.person.title,
  bahrainTitle: SITE_CONFIG.person.bahrainTitle,
  usTitle: SITE_CONFIG.person.usTitle,
  dualTitle: SITE_CONFIG.person.title,
  headline: "Your business in Bahrain, powered by technology.",
  bio: "CEO of Back for Brand LLC (Florida, USA) delivering global technology, SEO, AEO, GEO, and AI automation, and business consultant at Bab Al-Khaleej (Kingdom of Bahrain) delivering turnkey company formation, investor and employee visas, and full corporate setup.",
  email: SITE_CONFIG.person.email,
  phone: SITE_CONFIG.person.phone,
  whatsappNumber: SITE_CONFIG.person.whatsappNumber,
  photoUrl: GHAZI_PHOTO_URL,
  photoPinkUrl: GHAZI_PHOTO_PINK_URL,
  logoUrl: "/back-for-brand-logo.svg",
};

export const BACK_FOR_BRAND_INFO = {
  legalName: SITE_CONFIG.backForBrand.legalName,
  entityType: SITE_CONFIG.backForBrand.entityType,
  filingDate: SITE_CONFIG.backForBrand.filingDate,
  registeredAddress: SITE_CONFIG.backForBrand.registeredAddress,
  addressNote: SITE_CONFIG.backForBrand.addressNote,
  services: [...SITE_CONFIG.backForBrand.services],
};

export const BAB_AL_KHALEEJ_INFO = {
  legalName: SITE_CONFIG.babAlKhaleej.legalName,
  jurisdiction: SITE_CONFIG.babAlKhaleej.entityType,
  crStatus: SITE_CONFIG.babAlKhaleej.crStatus,
  registeredAddress: SITE_CONFIG.babAlKhaleej.registeredAddress,
  registeredActivities: [...SITE_CONFIG.babAlKhaleej.registeredActivities],
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
      a: "Commercial registration typically takes between 3 to 10 working days, depending on your commercial activities, legal structure (e.g. W.L.L. or branch), and specialized ministry approvals."
    },
    faqs: [
      {
        q: "How long does company registration take in Bahrain?",
        a: "Commercial registration typically takes between 3 to 10 working days, depending on your commercial activities, legal structure (e.g. W.L.L. or branch), and specialized ministry approvals."
      },
      {
        q: "Can foreign nationals own 100% of a Bahrain company?",
        a: "Yes, Bahrain allows 100% foreign ownership in most commercial, consulting, and technology sectors under Sijilat regulations without requiring a local Bahraini partner."
      },
      {
        q: "What is the minimum capital requirement for a W.L.L. in Bahrain?",
        a: "Under current Bahrain Commercial Companies Law, many commercial activities no longer require statutory minimum deposited capital upfront, though capital is declared in the Memorandum of Association."
      },
      {
        q: "Is a physical commercial office required to obtain an active Commercial Registration (CR)?",
        a: "Yes, Bahrain regulations require an approved commercial address (such as a dedicated office or approved business incubator) verified by municipal inspection before final active CR activation."
      },
      {
        q: "Do I need to be physically in Bahrain to register the company?",
        a: "Initial approvals and company reservation can be initiated remotely with digital authorization; physical presence is needed later for biometrics and banking."
      }
    ]
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
      a: "Foreign company shareholders and partners registered in an active Bahrain Commercial Registration (CR) can apply for Bahrain investor residency status."
    },
    faqs: [
      {
        q: "Who can apply for an investor visa in Bahrain?",
        a: "Foreign company shareholders and partners registered in an active Bahrain Commercial Registration (CR) can apply for Bahrain investor residency status."
      },
      {
        q: "How long is the Bahrain investor residency visa valid?",
        a: "Bahrain investor visas are typically issued for 1 or 2 years, renewable upon maintaining active company status and compliance with LMRA and NPRA regulations."
      },
      {
        q: "Can investor visa holders sponsor their family members?",
        a: "Yes, verified investor visa holders can sponsor family residency permits for their spouse and dependent children in the Kingdom of Bahrain."
      },
      {
        q: "What documents are required for investor residency processing?",
        a: "Key documents include a valid passport (minimum 6 months validity), active Commercial Registration copy, company Memorandum of Association, and security clearance submission."
      },
      {
        q: "Does the investor visa grant a Bahrain CPR identity card?",
        a: "Yes, once the residency permit is endorsed by NPRA, you receive an official Bahrain CPR (smart identity card) enabling banking and telecommunications access."
      }
    ]
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
      a: "Yes. We organize credentials and track batch LMRA work permit applications simultaneously, providing clear status tracking for each employee."
    },
    faqs: [
      {
        q: "Can you handle visas for several employees at once?",
        a: "Yes. We organize credentials and track batch LMRA work permit applications simultaneously, providing clear status tracking for each employee."
      },
      {
        q: "What is an LMRA work visa quota?",
        a: "Quota refers to the authorized foreign worker allocation granted to your commercial registration based on your office space, registered activities, and Bahrainisation tier."
      },
      {
        q: "How long does it take to process an employee work permit in Bahrain?",
        a: "Standard LMRA work permit processing takes approximately 5 to 14 working days from document verification to digital permit issuance."
      },
      {
        q: "Are medical checkups mandatory for incoming foreign workers?",
        a: "Yes, foreign workers must complete an accredited pre-employment medical check in their home country and complete local Bahrain medical clearance upon arrival."
      },
      {
        q: "Can an employee transfer their visa to our new Bahrain company?",
        a: "Yes, local worker transfers from another Bahrain employer are supported in compliance with LMRA regulations and required notice periods."
      }
    ]
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
      a: "Corporate and personal documents issued outside Bahrain require Apostille or embassy attestation from the Bahrain Ministry of Foreign Affairs (MOFA) before ministry submission."
    },
    faqs: [
      {
        q: "Do my documents need embassy attestation or Apostille?",
        a: "Corporate and personal documents issued outside Bahrain require Apostille or embassy attestation from the Bahrain Ministry of Foreign Affairs (MOFA) before ministry submission."
      },
      {
        q: "Is legal Arabic translation required for official filings?",
        a: "Yes, official documents submitted to the Ministry of Industry and Commerce (MOIC) and judicial authorities must be translated into Arabic by a sworn, licensed translator."
      },
      {
        q: "How do you prevent document rejection at ministry submission?",
        a: "We perform comprehensive pre-submission audits, verifying legal names, jurisdiction seals, authorized signatory titles, and valid validity dates across all papers."
      },
      {
        q: "What is the typical timeframe for document attestation in Bahrain?",
        a: "Local MOFA and legal translation clearance in Bahrain is generally completed within 2 to 4 business days once primary certificates are delivered."
      },
      {
        q: "Can you assist with board resolutions and Power of Attorney drafting?",
        a: "Yes, we prepare standard corporate resolutions, powers of attorney, and statutory declarations aligned with Bahrain Ministry of Industry and Commerce standards."
      }
    ]
  },
  {
    id: "application-tracking",
    category: "bahrain",
    title: "Application Tracking",
    vslHeadline: "Always know where your application stands, every single day",
    emoji: "🧭",
    lead: "Clear updates and active follow-up on your submissions with Bahrain authorities.",
    description: "Instead of wondering what is happening with your registration or visas, we monitor your applications daily and keep you informed at each step.",
    included: [
      "Daily status checks on Sijilat, LMRA, and related ministry portals",
      "Immediate alerts when action, clarification, or signature is required",
      "Direct follow-up with relevant departments to resolve bottlenecks",
      "A dedicated point of contact throughout the entire process",
    ],
    faq: {
      q: "How often will I receive updates on my application?",
      a: "We monitor portals daily and send you milestone updates, plus immediate WhatsApp notifications whenever an authority action or signature is required."
    },
    faqs: [
      {
        q: "How do we track our application status across ministries?",
        a: "We monitor your Sijilat and LMRA application portals daily, notifying you immediately of authority requests, inspections, or stage approvals."
      },
      {
        q: "What causes delays in Bahrain ministry approvals?",
        a: "Common causes of delay include municipal zoning clearance queries, specialized security checks, or requests for clarifying documentation on parent entity activities."
      },
      {
        q: "Do you coordinate directly with ministry case officers?",
        a: "Yes, our consultancy team directly liaises with relevant officers at MOIC, LMRA, and municipal directorates to clarify inquiries and expedite milestones."
      },
      {
        q: "How frequently will our team receive status updates?",
        a: "You receive status briefs at every official milestone, plus direct WhatsApp and email notifications whenever action or documentation is required."
      },
      {
        q: "What happens if an authority requests an amendment?",
        a: "We evaluate the amendment request immediately, prepare the required supplementary paperwork, and re-submit within official response windows."
      }
    ]
  },
  {
    id: "ongoing-support",
    category: "bahrain",
    title: "Ongoing Support",
    vslHeadline: "Keep your company compliant, renewed and running smoothly in Bahrain",
    emoji: "🛡️",
    lead: "Annual renewals, CR amendments, and day-to-day administrative guidance.",
    description: "Running a business in Bahrain comes with regular compliance deadlines. We help you stay compliant year after year without unexpected fines or interruptions.",
    included: [
      "Annual Commercial Registration (CR) and municipal license renewal",
      "LMRA monthly invoicing and Bahrainisation quota compliance review",
      "Activity additions, deletions, and partner share transfer amendments",
      "Corporate bank account maintenance and administrative guidance",
    ],
    faq: {
      q: "Can you help after my company is registered?",
      a: "Yes. Many clients retain us for annual CR renewals, activity changes, visa renewals, and ongoing government compliance support."
    },
    faqs: [
      {
        q: "What ongoing compliance is required for a Bahrain company?",
        a: "Annual requirements include commercial registration renewal, municipal license renewal, LMRA monthly invoicing compliance, and annual financial returns submission."
      },
      {
        q: "When is annual Commercial Registration (CR) renewal due?",
        a: "CR renewal occurs annually before the registration expiration date; timely renewal avoids administrative fines or commercial activity suspensions."
      },
      {
        q: "Can you assist with changing commercial activities or adding partners?",
        a: "Yes, we manage CR amendments on Sijilat, including adding new commercial activities, transferring partner shares, or updating authorized signatories."
      },
      {
        q: "What is Bahrain Wage Protection System (WPS) compliance?",
        a: "The Wage Protection System requires companies to disburse employee salaries through licensed Bahrain financial institutions with digital records submitted to LMRA."
      },
      {
        q: "Do you provide corporate address renewal and lease contract advisory?",
        a: "Yes, we ensure commercial lease agreements remain compliant with municipal requirements and facilitate lease registration renewals."
      }
    ]
  },
];

export const TECH_SERVICES: ServiceItem[] = [
  {
    id: "seo",
    category: "tech",
    title: "Search Engine Optimization (SEO)",
    vslHeadline: "Get found by the people who are ready to buy from you",
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
      a: "Technical and algorithmic index improvements typically materialize within 60 to 90 days, with substantial organic traffic and revenue growth compounding over 6 to 12 months."
    },
    faqs: [
      {
        q: "How long does enterprise SEO take to produce measurable results?",
        a: "Technical and algorithmic index improvements typically materialize within 60 to 90 days, with substantial organic traffic and revenue growth compounding over 6 to 12 months."
      },
      {
        q: "What separates technical SEO from standard blogging?",
        a: "Technical SEO optimizes site crawlability, indexation architecture, Core Web Vitals, semantic schema graphs, and internal link equity, ensuring search bots fully comprehend page authority."
      },
      {
        q: "Do you specialize in international and multi-regional SEO?",
        a: "Yes, we implement clean hreflang architecture, geo-targeted canonical signals, and localized content strategies for businesses operating across the GCC, North America, and Europe."
      },
      {
        q: "How do you measure and report organic search performance?",
        a: "We provide transparent monthly dashboards tracking keyword rankings, organic impressions, Google Search Console clicks, and bottom-line lead conversions."
      },
      {
        q: "Will SEO continue to matter alongside AI search engines?",
        a: "Absolutely; AI models rely heavily on traditionally indexed and authoritative search results to ground their responses and generate web citations."
      }
    ]
  },
  {
    id: "geo-aeo",
    category: "tech",
    title: "GEO and AEO (AI Search)",
    vslHeadline: "Make sure ChatGPT, Perplexity and Google cite your brand first",
    emoji: "🤖",
    lead: "Optimization so AI answer engines recommend your business when potential clients ask questions.",
    description: "Search is changing fast. We structure your brand's digital footprint so Large Language Models and AI answer engines cite your services as the authoritative answer.",
    included: [
      "AI search visibility audit across ChatGPT, Perplexity, and Gemini",
      "Entity authority optimization and structured Schema.org graphs",
      "Answer-first content architecture matching conversational intent",
      "Tracking brand citation frequency in generative AI responses",
    ],
    faq: {
      q: "What is the difference between GEO and traditional SEO?",
      a: "Traditional SEO aims to rank 10 blue links on Google, whereas Generative Engine Optimization (GEO) structures digital assets so LLMs (ChatGPT, Perplexity, Gemini) synthesize and cite your brand."
    },
    faqs: [
      {
        q: "What is the difference between GEO and traditional SEO?",
        a: "Traditional SEO aims to rank 10 blue links on Google, whereas Generative Engine Optimization (GEO) structures digital assets so LLMs (ChatGPT, Perplexity, Gemini) synthesize and cite your brand."
      },
      {
        q: "How do AI search engines decide which sources to cite?",
        a: "LLMs favor entities with verified schema data, unambiguous factual statements, topical authority, clean markdown, and consistent citations across authoritative domains."
      },
      {
        q: "What is llms.txt and why is it essential for AEO?",
        a: "llms.txt is an emerging standard file placed in your root directory that presents concise, structured markdown summaries of your brand, offerings, and documentation for LLM ingestion."
      },
      {
        q: "Can small businesses rank in ChatGPT and Perplexity answers?",
        a: "Yes, because LLMs prioritize contextual precision and structured factual answers over pure domain authority, niche leaders can capture significant recommendation share."
      },
      {
        q: "How do we track brand citations inside LLM responses?",
        a: "We track citation frequency and sentiment across automated query suites executed regularly on target engines including ChatGPT Search, Perplexity, and Gemini."
      }
    ]
  },
  {
    id: "digital-marketing",
    category: "tech",
    title: "Digital Marketing",
    vslHeadline: "Targeted campaigns that bring real business enquiries, not vanity clicks",
    emoji: "📈",
    lead: "High-intent paid advertising and performance marketing that generates qualified client consultations.",
    description: "We build and manage targeted advertising campaigns on Google and LinkedIn focused squarely on acquiring high-value clients profitably.",
    included: [
      "Campaign strategy targeting commercial-intent decision makers",
      "Persuasive ad copywriting and high-converting landing page design",
      "Conversion tracking, UTM attribution, and CRM lead integration",
      "Continuous A/B testing and return-on-ad-spend (ROAS) optimization",
    ],
    faq: {
      q: "Which platforms do you recommend for B2B lead generation?",
      a: "High-intent Google Search Ads capturing active commercial queries combined with LinkedIn hyper-targeted executive campaigns deliver the highest qualified consultation bookings."
    },
    faqs: [
      {
        q: "Which advertising platforms deliver the highest ROI for B2B consulting?",
        a: "High-intent Google Search Ads capturing active commercial queries combined with LinkedIn hyper-targeted executive campaigns deliver the highest qualified consultation bookings."
      },
      {
        q: "How do you track ad spend attribution to real client deals?",
        a: "We implement end-to-end UTM parameter passing from first click through CRM pipeline stages, tracking exact revenue generated per ad campaign."
      },
      {
        q: "What budget is recommended for testing digital advertising?",
        a: "We typically recommend establishing a verified baseline with a targeted monthly budget of $1,500 to $3,500 focused solely on high-intent commercial terms."
      },
      {
        q: "Do you create custom landing pages and conversion copy?",
        a: "Yes, we engineer custom conversion funnels and dedicated landing pages built specifically to match the intent and messaging of your paid ad campaigns."
      },
      {
        q: "How quickly can digital marketing campaigns launch?",
        a: "Once tracking pixels, ad accounts, and conversion funnels are configured, initial campaigns can launch and begin generating lead traffic within 3 to 5 business days."
      }
    ]
  },
  {
    id: "ai-agents",
    category: "tech",
    title: "AI Agents",
    vslHeadline: "AI assistants that answer, qualify, and book clients 24 hours a day",
    emoji: "⚡",
    lead: "Custom conversational AI voice and text agents that handle client inquiries, qualify leads, and schedule appointments around the clock.",
    description: "Never miss a prospective client again. We deploy customized AI voice and chat agents that engage incoming leads instantly, qualify their needs, and book consultations directly on your calendar.",
    included: [
      "Custom conversational voice and text agent configuration",
      "Trained on your specific services, pricing guides, and FAQs",
      "Seamless integration with WhatsApp, your website, and CRM",
      "Real-time voice streaming with human-like responsiveness",
    ],
    faq: {
      q: "Will an AI agent sound robotic or make promises we cannot keep?",
      a: "No. We build on state-of-the-art models like Gemini 3.8 with strict guardrails so responses remain authentic, professional, and within your approved knowledge base."
    },
    faqs: [
      {
        q: "What tasks can autonomous AI agents handle for our business?",
        a: "Autonomous agents handle customer qualification, 24/7 lead intake, appointment booking, CRM data synchronization, preliminary document inspection, and workflow dispatch."
      },
      {
        q: "How do you prevent hallucinations in customer-facing AI agents?",
        a: "We employ strict Retrieval-Augmented Generation (RAG) and guardrailed system prompts that instruct agents to cite verified knowledge base records and route ambiguous queries to humans."
      },
      {
        q: "Can AI agents integrate with our existing CRM and calendar tools?",
        a: "Yes, agents connect seamlessly via REST APIs and webhooks to Google Calendar, HubSpot, Salesforce, Firestore, Stripe, and WhatsApp Cloud API."
      },
      {
        q: "What is the difference between text chatbots and voice AI agents?",
        a: "Voice AI agents stream bidirectional audio in real time using models like Gemini Live, enabling natural spoken conversation with human-like latency and voice inflection."
      },
      {
        q: "Is confidential company data safe with autonomous AI agents?",
        a: "Yes, enterprise deployments utilize private API tokens where prompts and client data are never used for model training or public indexing."
      }
    ]
  },
  {
    id: "automation",
    category: "tech",
    title: "Automation",
    vslHeadline: "Stop copying and pasting. Let your systems run themselves.",
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
    },
    faqs: [
      {
        q: "What business processes benefit most from workflow automation?",
        a: "Repetitive tasks such as client onboarding, invoice generation, payment receipts, government document sorting, and multi-platform data syncing benefit immediately."
      },
      {
        q: "What technology stack do you use for enterprise automation?",
        a: "We utilize Node.js/TypeScript microservices, serverless webhooks, and secure cloud databases alongside standard integration platforms."
      },
      {
        q: "How do automations handle system or API failures?",
        a: "We implement idempotent retries, exponential backoff, dead-letter queues, and real-time administrator alerts to ensure zero data loss during third-party outages."
      },
      {
        q: "Can automations trigger real-time WhatsApp and SMS notifications?",
        a: "Yes, verified webhooks instantly trigger personalized alerts to clients and executive team members upon milestone completions or payment receipts."
      },
      {
        q: "How much operational time can automation save our team?",
        a: "Most organizations reclaim 15 to 30 administrative hours per week per department by automating data entry, status follow-ups, and document dispatch."
      }
    ]
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
      a: "We build modern funnels using Vite, React 19, Tailwind CSS, and edge hosting, ensuring lightning-fast load times under 1 second on mobile networks."
    },
    faqs: [
      {
        q: "Why do custom funnels outperform standard corporate websites?",
        a: "Traditional websites present too many distracting links, whereas focused funnels direct visitors through a singular, frictionless conversion journey tailored to their exact need."
      },
      {
        q: "What tech stack is used for high-converting funnels?",
        a: "We build modern funnels using Vite, React 19, Tailwind CSS, and edge hosting, ensuring lightning-fast load times under 1 second on mobile networks."
      },
      {
        q: "How do you optimize funnels for mobile conversion?",
        a: "Every interface is engineered mobile-first with sticky call-to-actions, thumb-friendly form controls, zero layout shift, and instant one-tap WhatsApp routing."
      },
      {
        q: "Are your funnels optimized for SEO and Core Web Vitals?",
        a: "Yes, all funnels achieve 95+ scores on Google Lighthouse with semantic headings, prerendered static HTML, and compressed next-generation images."
      },
      {
        q: "Can we run A/B split tests on funnel headlines and offers?",
        a: "Yes, we implement clean split-testing architecture to test headlines, video sales letters, and pricing models against real conversion metrics."
      }
    ]
  },
];

export const GUIDES: GuideItem[] = [
  {
    id: "guide-register-company-bahrain",
    title: "How to Register a Company in Bahrain: A Step-by-Step Overview",
    emoji: "📝",
    summary: "A clear overview of the main steps to register a company in Bahrain, from choosing an activity to opening a bank account.",
    date: "2026-10-03",
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
    date: "2026-10-03",
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
    date: "2026-10-03",
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
    date: "2026-10-03",
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
    date: "2026-10-03",
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
    date: "2026-10-03",
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
        body: "Common repetitive questions about pricing tiers, commercial documentation requirements, and timelines are answered accurately in under 2 seconds, eliminating customer wait time."
      },
      {
        heading: "Autonomous workflow dispatch",
        body: "When high-value opportunities request assistance, the agent routes notifications directly to executive email, enqueues CRM lead profiles, and generates preliminary proposal dossiers."
      }
    ]
  },
];

export interface PackageItem {
  name: string;
  emoji: string;
  subtitle: string;
  priceText: string;
  popular?: boolean;
  features: string[];
}

// TODO(owner): verify exact retainer pricing and package deliverables with Ghazi Wazir
export const PACKAGES: PackageItem[] = [
  {
    name: "Starter",
    emoji: "🚀",
    subtitle: "Consultation & Strategic Roadmap Dossier",
    priceText: "Consultation Retainer Tier",
    popular: false,
    features: [
      "Initial feasibility review for Bahrain CR or Digital Marketing setup",
      "ISIC4 activity code guidance & regulatory pre-screening",
      "Core requirements checklist & procedural timeline",
      "Direct consultation briefing with Ghazi Wazir"
    ]
  },
  {
    name: "Growth",
    emoji: "⚡",
    subtitle: "Entity Formation & Search Architecture",
    priceText: "Full Deployment Retainer Tier",
    popular: false,
    features: [
      "End-to-end documentation support for Bahrain or Florida filing",
      "Technical SEO, AEO, and GEO citation foundation",
      "Investor and manager visa submission coordination",
      "Structured milestone updates and compliance checks"
    ]
  },
  {
    name: "Complete",
    emoji: "👑",
    subtitle: "Full-Spectrum Corporate Setup & AI Automation",
    priceText: "Executive Retainer Tier",
    popular: true,
    features: [
      "Comprehensive commercial registration & corporate bank support",
      "Custom AI agent workflow integration & lead capture system",
      "Complete AEO/GEO brand positioning across AI search engines",
      "Priority direct executive advisory with Ghazi Wazir"
    ]
  }
];
