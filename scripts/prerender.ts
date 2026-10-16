import fs from 'fs';
import path from 'path';
import {
  GHAZI_INFO,
  BACK_FOR_BRAND_INFO,
  BAB_AL_KHALEEJ_INFO,
  BAHRAIN_SERVICES,
  TECH_SERVICES,
  GUIDES,
} from '../src/data/content';
import { SITE_CONFIG } from '../src/data/siteConfig';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_URL = 'https://ghaziurrehamn.com';
const TODAY_ISO = '2026-10-16';

interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  lead: string;
  contentHtml: string;
  schema?: Record<string, any>;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error('[Prerender] Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('[Prerender] Error: dist/index.html template not found.');
  process.exit(1);
}

const indexTemplate = fs.readFileSync(templatePath, 'utf8');

// Global Entity Schema Definitions for @id references
const PERSON_SCHEMA_ID = `${BASE_URL}/#ghazi-wazir`;
const BACK_FOR_BRAND_SCHEMA_ID = `${BASE_URL}/#back-for-brand`;
const BAB_AL_KHALEEJ_SCHEMA_ID = `${BASE_URL}/#bab-al-khaleej`;

const routes: RouteMetadata[] = [
  // 1. Home
  {
    path: '/',
    title: 'Ghazi Wazir — Bahrain Business Setup & AI Search (SEO, AEO)',
    description: 'CEO of Back for Brand LLC (USA) and consultant at Bab Al-Khaleej (Bahrain). Turnkey commercial registration, investor visas, SEO, and AI automation.',
    canonical: `${BASE_URL}/`,
    h1: 'Ghazi Wazir — Bahrain Business Setup & AI Search (SEO, AEO, GEO)',
    lead: 'Executive consulting for turnkey Bahrain commercial registration (CR), investor and worker visas, combined with international SEO, Generative Engine Optimization (GEO), and autonomous AI systems.',
    contentHtml: `
      <section>
        <h2>Executive Profile: Ghazi Wazir</h2>
        <p>Ghazi Wazir (legally Ghazi Ur Rehman) operates two distinct professional organizations across the United States and the Kingdom of Bahrain.</p>
        <div>
          <h3>Back for Brand LLC (Florida, USA)</h3>
          <p>Providing enterprise-grade Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), international Technical SEO, and AI workflow automation.</p>
        </div>
        <div>
          <h3>Bab Al Khaleej Business Consultancy W.L.L. (Kingdom of Bahrain)</h3>
          <p>Delivering commercial registration (CR) guidance, investor visa advisory, worker visa support, and ministry clearance. Approvals are issued exclusively by the competent Bahraini government authorities (MOIC, LMRA, NPRA).</p>
        </div>
      </section>
      <section>
        <h2>Bahrain Business Setup Services</h2>
        <ul>
          ${BAHRAIN_SERVICES.map(s => `<li><h3><a href="/bahrain-business-setup/${s.id}">${s.title}</a></h3><p>${s.lead}</p></li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>Technology & AI Search Services</h2>
        <ul>
          ${TECH_SERVICES.map(s => `<li><h3><a href="/technology-services/${s.id}">${s.title}</a></h3><p>${s.lead}</p></li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>Authoritative Knowledge & Guides</h2>
        <ul>
          ${GUIDES.map(g => `<li><h3><a href="/blog/${g.id.replace('guide-', '')}">${g.title}</a></h3><p>${g.summary}</p></li>`).join('')}
        </ul>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          'url': `${BASE_URL}/`,
          'name': 'Ghazi Wazir',
          'description': 'Bahrain Business Setup & AI Search (SEO, AEO, GEO)',
          'publisher': { '@id': PERSON_SCHEMA_ID }
        },
        {
          '@type': 'Person',
          '@id': PERSON_SCHEMA_ID,
          'name': SITE_CONFIG.person.name,
          'alternateName': SITE_CONFIG.person.alternateName,
          'jobTitle': 'CEO & Business Consultant',
          'url': `${BASE_URL}/`,
          'telephone': SITE_CONFIG.person.phoneRaw,
          'email': SITE_CONFIG.person.email,
          'worksFor': [
            { '@id': BACK_FOR_BRAND_SCHEMA_ID },
            { '@id': BAB_AL_KHALEEJ_SCHEMA_ID }
          ],
          'knowsAbout': [
            'Bahrain Commercial Registration',
            'Investor Visas',
            'Search Engine Optimization',
            'Generative Engine Optimization',
            'Answer Engine Optimization',
            'AI Automation'
          ]
        },
        {
          '@type': 'Organization',
          '@id': BACK_FOR_BRAND_SCHEMA_ID,
          'name': SITE_CONFIG.backForBrand.legalName,
          'legalName': SITE_CONFIG.backForBrand.legalName,
          'url': SITE_CONFIG.backForBrand.hubUrl,
          'founder': { '@id': PERSON_SCHEMA_ID },
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': '7901 4th St N, Ste 19566',
            'addressLocality': 'St. Petersburg',
            'addressRegion': 'FL',
            'postalCode': '33702',
            'addressCountry': 'US'
          },
          'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': SITE_CONFIG.person.phoneRaw,
            'email': SITE_CONFIG.person.email,
            'contactType': 'customer service'
          }
        },
        {
          '@type': 'ProfessionalService',
          '@id': BAB_AL_KHALEEJ_SCHEMA_ID,
          'name': SITE_CONFIG.babAlKhaleej.legalName,
          'legalName': SITE_CONFIG.babAlKhaleej.legalName,
          'url': SITE_CONFIG.babAlKhaleej.hubUrl,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': SITE_CONFIG.babAlKhaleej.registeredAddress,
            'addressLocality': SITE_CONFIG.babAlKhaleej.addressLocality,
            'addressCountry': SITE_CONFIG.babAlKhaleej.addressCountry
          },
          'areaServed': 'Kingdom of Bahrain',
          'telephone': SITE_CONFIG.person.phoneRaw,
          'email': SITE_CONFIG.person.email
        }
      ]
    }
  },

  // 2. Bahrain Hub
  {
    path: '/bahrain-business-setup',
    title: 'Bahrain Business Setup: CR, Visas & Documents | Bab Al-Khaleej',
    description: 'Bahrain company registration (CR), investor residency visas, LMRA work permits, and document attestation consultancy by Bab Al Khaleej in Manama.',
    canonical: `${BASE_URL}/bahrain-business-setup`,
    h1: 'Bahrain Business Setup: CR, Visas & Documents',
    lead: 'Consultancy and procedural support for establishing your commercial entity in the Kingdom of Bahrain. Provided by Bab Al Khaleej Business Consultancy W.L.L.',
    contentHtml: `
      <section>
        <h2>What is Included in Bahrain Setup</h2>
        <ul>
          ${BAHRAIN_SERVICES.map(s => `<li><h3><a href="/bahrain-business-setup/${s.id}">${s.title}</a></h3><p>${s.lead}</p></li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>Regulatory Compliance & Notice</h2>
        <p>${SITE_CONFIG.babAlKhaleej.regulatoryDisclaimer}</p>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${BASE_URL}/bahrain-business-setup#page`,
          'name': 'Bahrain Business Setup: CR, Visas & Documents',
          'description': 'Bahrain company registration (CR), investor residency visas, LMRA work permits, and document attestation consultancy.',
          'url': `${BASE_URL}/bahrain-business-setup`,
          'provider': { '@id': BAB_AL_KHALEEJ_SCHEMA_ID }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/bahrain-business-setup#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Bahrain Business Setup', 'item': `${BASE_URL}/bahrain-business-setup` }
          ]
        }
      ]
    }
  },

  // 3. Tech Hub
  {
    path: '/technology-services',
    title: 'SEO, AEO, GEO & AI Automation | Back for Brand LLC',
    description: 'Enterprise Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), technical SEO, and autonomous AI agents by Back for Brand LLC.',
    canonical: `${BASE_URL}/technology-services`,
    h1: 'SEO, AEO, GEO & AI Automation Services',
    lead: 'Next-generation search optimization and autonomous AI architecture for modern enterprises. Delivered by Back for Brand LLC (Florida, USA).',
    contentHtml: `
      <section>
        <h2>Advanced Technology Capabilities</h2>
        <ul>
          ${TECH_SERVICES.map(s => `<li><h3><a href="/technology-services/${s.id}">${s.title}</a></h3><p>${s.lead}</p></li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>Search Paradigm Comparison: SEO vs AEO vs GEO</h2>
        <table>
          <thead>
            <tr><th>Dimension</th><th>Traditional SEO</th><th>Answer Engine (AEO)</th><th>Generative Engine (GEO)</th></tr>
          </thead>
          <tbody>
            <tr><td>Target Platform</td><td>Google, Bing</td><td>Voice, Featured Snippets</td><td>ChatGPT, Perplexity, Gemini</td></tr>
            <tr><td>Core Goal</td><td>10 Blue Links</td><td>Direct Immediate Answer</td><td>Synthesized Citation & Source Link</td></tr>
          </tbody>
        </table>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${BASE_URL}/technology-services#page`,
          'name': 'SEO, AEO, GEO & AI Automation Services',
          'description': 'Enterprise Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), technical SEO, and autonomous AI agents.',
          'url': `${BASE_URL}/technology-services`,
          'provider': { '@id': BACK_FOR_BRAND_SCHEMA_ID }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/technology-services#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Technology Services', 'item': `${BASE_URL}/technology-services` }
          ]
        }
      ]
    }
  },

  // 4. About
  {
    path: '/about',
    title: 'About Ghazi Wazir | CEO Back for Brand & Bab Al-Khaleej',
    description: 'Learn about Ghazi Wazir (Ghazi Ur Rehman), CEO of Back for Brand LLC (Florida, USA) and business consultant at Bab Al Khaleej (Kingdom of Bahrain).',
    canonical: `${BASE_URL}/about`,
    h1: 'About Ghazi Wazir',
    lead: 'Technology executive and commercial business consultant bridging GCC enterprise formation and modern American AI search engineering.',
    contentHtml: `
      <section>
        <h2>Professional Background & Dual Roles</h2>
        <div>
          <h3>Back for Brand LLC (Florida, USA)</h3>
          <p>Registered mailing address: 7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA. Specializes in SEO, AEO, GEO, and AI Automation.</p>
        </div>
        <div>
          <h3>Bab Al Khaleej Business Consultancy W.L.L. (Bahrain)</h3>
          <p>Address: Manama Center, Block 304, Road 385, Building 111, Flat/Shop 39, Manama, Bahrain. Active CR in marketing and management consultancy.</p>
        </div>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${BASE_URL}/about#page`,
          'name': 'About Ghazi Wazir',
          'url': `${BASE_URL}/about`,
          'mainEntity': { '@id': PERSON_SCHEMA_ID }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/about#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'About', 'item': `${BASE_URL}/about` }
          ]
        }
      ]
    }
  },

  // 5. Contact
  {
    path: '/contact',
    title: 'Contact Ghazi Wazir | Direct WhatsApp & Executive Desk',
    description: 'Contact Ghazi Wazir via WhatsApp or email for commercial registration advisory in Bahrain or global enterprise AI search optimization (AEO/GEO).',
    canonical: `${BASE_URL}/contact`,
    h1: 'Contact Ghazi Wazir',
    lead: 'Direct executive inquiries, consultation bookings, and authorized ministry support.',
    contentHtml: `
      <section>
        <h2>Contact Details</h2>
        <p>WhatsApp: ${SITE_CONFIG.person.phone} | Email: ${SITE_CONFIG.person.email}</p>
        <div>
          <h3>Bahrain Office</h3>
          <p>${SITE_CONFIG.babAlKhaleej.registeredAddress}</p>
        </div>
        <div>
          <h3>USA Mailing Address</h3>
          <p>${SITE_CONFIG.backForBrand.registeredAddress} (${SITE_CONFIG.backForBrand.addressNote})</p>
        </div>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${BASE_URL}/contact#page`,
          'name': 'Contact Ghazi Wazir',
          'url': `${BASE_URL}/contact`
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/contact#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Contact', 'item': `${BASE_URL}/contact` }
          ]
        }
      ]
    }
  },

  // 6. Book
  {
    path: '/book',
    title: 'Book a Strategy Consultation | Ghazi Wazir',
    description: 'Schedule a confidential 1-on-1 executive consultation with Ghazi Wazir for turnkey Bahrain company setup or enterprise AI search engineering.',
    canonical: `${BASE_URL}/book`,
    h1: 'Book a Strategy Consultation',
    lead: 'Schedule a confidential 30-minute executive session directly with Ghazi Wazir.',
    contentHtml: `
      <section>
        <h2>Consultation Scheduling</h2>
        <p>Select an available date and time for your personalized consultation.</p>
      </section>
    `,
  },

  // 7. Packages
  {
    path: '/packages',
    title: 'Consultancy & Service Packages | Ghazi Wazir',
    description: 'Transparent executive packages for Bahrain commercial registration, foreign investor residency, document clearance, and enterprise SEO retainers.',
    canonical: `${BASE_URL}/packages`,
    h1: 'Consultancy Packages & Retainers',
    lead: 'Structured formation and search optimization packages designed for fast, predictable execution.',
    contentHtml: `
      <section>
        <h2>Available Packages</h2>
        <p>Consultancy and technical retainers for companies expanding to Bahrain or scaling in AI search engines.</p>
      </section>
    `,
  },

  // 8. Blog
  {
    path: '/blog',
    title: 'Authoritative Business & AI Guides | Ghazi Wazir',
    description: 'Authoritative executive guides on Bahrain company formation, Sijilat licensing, LMRA visas, foreign ownership rules, and modern AI search (AEO/GEO).',
    canonical: `${BASE_URL}/blog`,
    h1: 'Authoritative Guides & Publications',
    lead: 'Technical insights and regulatory walkthroughs for founders, investors, and enterprise executives.',
    contentHtml: `
      <section>
        <h2>Featured Guides</h2>
        <ul>
          ${GUIDES.map(g => `<li><h3><a href="/blog/${g.id.replace('guide-', '')}">${g.title}</a></h3><p>${g.summary}</p></li>`).join('')}
        </ul>
      </section>
    `,
  },

  // 9. Privacy
  {
    path: '/privacy',
    title: 'Privacy Policy | Ghazi Wazir & Back for Brand LLC',
    description: 'Official privacy policy for Ghazi Wazir, Back for Brand LLC, and Bab Al Khaleej Business Consultancy W.L.L. governing data processing and privacy rights.',
    canonical: `${BASE_URL}/privacy`,
    h1: 'Privacy Policy',
    lead: 'Our commitment to data privacy, confidentiality, and regulatory compliance across our platforms.',
    contentHtml: `
      <section>
        <h2>1. Who We Are</h2>
        <p>This website is operated by Ghazi Wazir, Chief Executive Officer of Back for Brand LLC (Florida, USA), providing global technology services, and business consultant at Bab Al Khaleej Business Consultancy W.L.L., providing company registration and visa support in Bahrain.</p>
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Direct contact information: Full name, business email address, phone/WhatsApp number.</li>
          <li>Application documents: Passport scans, company details, or business plans submitted to evaluate eligibility.</li>
          <li>Technical diagnostics: Anonymized IP addresses, browser types, and navigation activity to ensure site integrity.</li>
        </ul>
        <h2>3. How Your Information Is Used</h2>
        <p>We use collected information solely to process your requests, communicate regarding your applications, and fulfill compliance mandates. We never sell, rent, or trade your data.</p>
        <h2>4. Government Submissions</h2>
        <p>For Bahrain business registration and visa applications, information is transferred exclusively to authorized Bahrain ministries (MOIC, LMRA, NPRA) as required by Bahrain law.</p>
        <h2>5. Contact & Data Rights</h2>
        <p>You may request access to, correction of, or permanent deletion of your personal records at any time by contacting ${SITE_CONFIG.person.email}.</p>
      </section>
    `,
  },

  // 10. Terms
  {
    path: '/terms',
    title: 'Terms of Service | Ghazi Wazir & Back for Brand LLC',
    description: 'Terms of service and engagement disclaimers for Back for Brand LLC and Bab Al Khaleej Business Consultancy W.L.L. governing consultancy services.',
    canonical: `${BASE_URL}/terms`,
    h1: 'Terms of Service',
    lead: 'Legal engagement terms and jurisdictional disclaimers for business consulting and technical services.',
    contentHtml: `
      <section>
        <h2>1. Scope of Services</h2>
        <p>We provide professional business consultancy (Bahrain company incorporation, investor and worker visa facilitation, document organization, and tracking) and technology services (search engine optimization, GEO/AEO, digital marketing, AI agents, and web design).</p>
        <h2>2. Independent Advisory Status & No Outcomes Guarantee</h2>
        <p>Final approvals, commercial registrations, and visa grants are strictly within the sovereign discretion of the relevant Bahrain government bodies (MOIC, LMRA, NPRA). Similarly, search engines determine rankings. We cannot guarantee sovereign approvals or algorithmic rankings.</p>
        <h2>3. Client Responsibilities</h2>
        <p>Clients agree to furnish authentic, unaltered, and complete documentation. Delays arising from fraudulent credentials or unverified documents remain the sole responsibility of the client.</p>
        <h2>4. Invoicing and Government Disbursements</h2>
        <p>Professional advisory fees are agreed prior to work commencement. Government administrative fees, official translations, and embassy attestations are separate out-of-pocket disbursements.</p>
      </section>
    `,
  },
];

// Service descriptions strictly 140–155 chars ending in a period
const BAHRAIN_SERVICE_DESCRIPTIONS: Record<string, string> = {
  'business-registration': 'Turnkey Bahrain commercial registration (CR) guidance from activity selection and Sijilat MOIC filings to municipal clearance and corporate bank setup.',
  'investor-visa': 'Comprehensive Bahrain investor residency visa guidance, document attestation, LMRA security clearance filing, and smart CPR issuance support.',
  'worker-visa': 'End-to-end Bahrain employee work visa support, LMRA quota allocation checks, credential attestation, medicals, and residence permit tracking.',
  'document-consultancy': 'Professional document consultancy, apostille guidance, legal Arabic translation, and ministry attestation audits to ensure zero filing rejection.',
  'application-tracking': 'Daily monitoring and proactive follow-up for Bahrain Sijilat, LMRA, and municipal applications with immediate status alerts and milestone updates.',
  'ongoing-support': 'Annual Bahrain commercial registration renewals, municipal licensing, LMRA compliance reviews, and Sijilat amendment support for corporate entities.',
};

const TECH_SERVICE_DESCRIPTIONS: Record<string, string> = {
  'seo': 'Comprehensive technical SEO audits, site speed architecture, high-intent keyword strategy, and conversion optimization by Back for Brand LLC.',
  'geo-aeo': 'Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) to secure brand citations in ChatGPT, Perplexity, Gemini, and Claude.',
  'digital-marketing': 'High-intent Google and LinkedIn advertising campaigns engineered to acquire qualified corporate clients with full UTM lead attribution tracking.',
  'ai-agents': 'Autonomous conversational voice and chat AI agents built on Google Gemini to qualify prospective leads, answer questions, and schedule meetings 24/7.',
  'automation': 'Custom enterprise workflow automation connecting CRM, billing, email, and WhatsApp to eliminate repetitive administrative tasks across departments.',
  'websites-funnels': 'High-converting, mobile-responsive funnels and websites engineered with React, Tailwind, and lightning-fast load times to maximize consultation bookings.',
};

// Add individual Bahrain services
BAHRAIN_SERVICES.forEach((service) => {
  const desc = BAHRAIN_SERVICE_DESCRIPTIONS[service.id] || `${service.lead.slice(0, 145)}.`;
  const serviceUrl = `${BASE_URL}/bahrain-business-setup/${service.id}`;
  const faqs = service.faqs || [service.faq];

  routes.push({
    path: `/bahrain-business-setup/${service.id}`,
    title: `${service.title} in Bahrain | Ghazi Wazir`,
    description: desc,
    canonical: serviceUrl,
    h1: `${service.title} in Bahrain`,
    lead: service.lead,
    contentHtml: `
      <article>
        <h2>Overview: ${service.title}</h2>
        <p>${service.description}</p>
        <h2>What is Included</h2>
        <ul>
          ${service.included.map(i => `<li>${i}</li>`).join('')}
        </ul>
        <h2>Frequently Asked Questions</h2>
        ${faqs.map(f => `
          <div>
            <h3>${f.q}</h3>
            <p>${f.a}</p>
          </div>
        `).join('')}
        <div>
          <h2>Official Regulatory Notice</h2>
          <p>${SITE_CONFIG.babAlKhaleej.regulatoryDisclaimer}</p>
        </div>
      </article>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${serviceUrl}#service`,
          'name': `${service.title} in Bahrain`,
          'description': desc,
          'url': serviceUrl,
          'provider': { '@id': BAB_AL_KHALEEJ_SCHEMA_ID }
        },
        {
          '@type': 'FAQPage',
          '@id': `${serviceUrl}#faq`,
          'mainEntity': faqs.map(f => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${serviceUrl}#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Bahrain Business Setup', 'item': `${BASE_URL}/bahrain-business-setup` },
            { '@type': 'ListItem', 'position': 3, 'name': service.title, 'item': serviceUrl }
          ]
        }
      ]
    },
  });
});

// Add individual Tech services
TECH_SERVICES.forEach((service) => {
  const desc = TECH_SERVICE_DESCRIPTIONS[service.id] || `${service.lead.slice(0, 145)}.`;
  const serviceUrl = `${BASE_URL}/technology-services/${service.id}`;
  const faqs = service.faqs || [service.faq];

  routes.push({
    path: `/technology-services/${service.id}`,
    title: `${service.title} | Back for Brand LLC`,
    description: desc,
    canonical: serviceUrl,
    h1: service.title,
    lead: service.lead,
    contentHtml: `
      <article>
        <h2>What is ${service.title}?</h2>
        <p>${service.description}</p>
        <h2>What is Included</h2>
        <ul>
          ${service.included.map(i => `<li>${i}</li>`).join('')}
        </ul>
        <h2>Frequently Asked Questions</h2>
        ${faqs.map(f => `
          <div>
            <h3>${f.q}</h3>
            <p>${f.a}</p>
          </div>
        `).join('')}
      </article>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${serviceUrl}#service`,
          'name': service.title,
          'description': desc,
          'url': serviceUrl,
          'provider': { '@id': BACK_FOR_BRAND_SCHEMA_ID }
        },
        {
          '@type': 'FAQPage',
          '@id': `${serviceUrl}#faq`,
          'mainEntity': faqs.map(f => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${serviceUrl}#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Technology Services', 'item': `${BASE_URL}/technology-services` },
            { '@type': 'ListItem', 'position': 3, 'name': service.title, 'item': serviceUrl }
          ]
        }
      ]
    },
  });
});

const GUIDE_DESCRIPTIONS: Record<string, string> = {
  'register-company-bahrain': 'Step-by-step walkthrough to register a company in Bahrain, covering ISIC activities, W.L.L. structures, Sijilat filings, and corporate banking.',
  'investor-visa-vs-worker-visa': 'Detailed comparison between Bahrain investor visas and employee worker permits, detailing eligibility, document requirements, and renewal rules.',
  'business-setup-documents-checklist': 'Essential checklist of personal and corporate documents required for successful Bahrain commercial registration and ministry licensing approval.',
  'what-is-geo-aeo': 'A practical guide explaining Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) for brand discovery in AI answer engines.',
  'seo-vs-geo-vs-aeo': 'In-depth analysis comparing traditional SEO, AEO, and Generative Engine Optimization, showing how to combine them into an authoritative growth engine.',
  'ai-agents-for-small-business': 'Explore how autonomous conversational AI voice and chat agents qualify leads, automate routine customer support, and capture appointments 24/7.',
};

// Add individual Guides
GUIDES.forEach((guide) => {
  const slug = guide.id.replace('guide-', '');
  const guideUrl = `${BASE_URL}/blog/${slug}`;
  const desc = GUIDE_DESCRIPTIONS[slug] || `${guide.summary.slice(0, 145)}.`;

  routes.push({
    path: `/blog/${slug}`,
    title: `${guide.title.slice(0, 45)} | Ghazi Wazir`,
    description: desc,
    canonical: guideUrl,
    h1: guide.title,
    lead: guide.summary,
    contentHtml: `
      <article>
        <div class="takeaway-box">
          <h2>Key Takeaways</h2>
          <p>${guide.summary}</p>
        </div>
        ${guide.sections.map(s => `
          <section>
            <h2>${s.heading}</h2>
            <p>${s.body}</p>
          </section>
        `).join('')}
        ${slug === 'seo-vs-geo-vs-aeo' ? `
          <section>
            <h2>Architectural Comparison Matrix</h2>
            <table>
              <thead>
                <tr><th>Dimension</th><th>Traditional SEO</th><th>Answer Engine (AEO)</th><th>Generative Engine (GEO)</th></tr>
              </thead>
              <tbody>
                <tr><td>Core Goal</td><td>Rank 10 Blue Links</td><td>Win Featured Snippet</td><td>Be Synthesized by LLM</td></tr>
                <tr><td>Key Metric</td><td>Organic Clicks & SERP Rank</td><td>Zero-Click Answer Placement</td><td>AI Recommendation & Citation</td></tr>
              </tbody>
            </table>
          </section>
        ` : ''}
        <section>
          <h2>About the Author & Review</h2>
          <p>Authored by Ghazi Wazir. Published on ${guide.date}. Last reviewed on ${TODAY_ISO}.</p>
        </section>
      </article>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${guideUrl}#article`,
          'headline': guide.title,
          'description': desc,
          'author': { '@id': PERSON_SCHEMA_ID },
          'publisher': { '@id': BACK_FOR_BRAND_SCHEMA_ID },
          'datePublished': guide.date,
          'dateModified': TODAY_ISO,
          'inLanguage': 'en',
          'image': `${BASE_URL}/og-image.jpg`,
          'mainEntityOfPage': guideUrl
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${guideUrl}#breadcrumbs`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': `${BASE_URL}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': guide.title, 'item': guideUrl }
          ]
        }
      ]
    },
  });
});

console.log(`[Prerender] Generating static HTML for ${routes.length} public routes...`);

routes.forEach((route) => {
  let html = indexTemplate;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );

  // Replace Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // Replace OpenGraph / Twitter tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${route.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:image" content="${BASE_URL}/og-image.jpg" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${route.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${BASE_URL}/og-image.jpg" />`
  );

  // Inject semantic body inside root for crawlers and hydration
  const prerenderBody = `
    <header style="padding: 1.5rem 1rem; border-bottom: 1px solid #2a2a38; background: #0b0b10;">
      <nav aria-label="Main Navigation">
        <a href="/" style="color: #e8c872; font-weight: bold; text-decoration: none;">Ghazi Wazir</a> |
        <a href="/bahrain-business-setup" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Bahrain Setup</a> |
        <a href="/technology-services" style="color: #ffffff; text-decoration: none; margin: 0 8px;">AI & SEO</a> |
        <a href="/blog" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Guides</a> |
        <a href="/contact" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Contact</a>
      </nav>
    </header>
    <main style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; font-family: sans-serif; color: #e2e8f0; line-height: 1.7;">
      <h1 style="color: #e8c872; font-size: 2rem; margin-bottom: 1rem;">${route.h1}</h1>
      <p style="font-size: 1.15rem; color: #a8a7b3; margin-bottom: 2rem;">${route.lead}</p>
      ${route.contentHtml}
    </main>
    <footer style="padding: 2rem 1rem; border-top: 1px solid #2a2a38; text-align: center; color: #a8a7b3; font-size: 0.85rem;">
      <p>© 2026 Ghazi Wazir · Back for Brand LLC (Florida, USA) & Bab Al Khaleej Business Consultancy W.L.L. (Bahrain)</p>
      <p style="font-size: 0.75rem; margin-top: 0.5rem;">Approvals are issued by the competent Bahraini authorities (MOIC, LMRA, NPRA). We provide consultancy and document support.</p>
    </footer>
  `;

  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${prerenderBody}</div>`
  );

  // Inject route schema if available
  if (route.schema) {
    const schemaTag = `\n    <script type="application/ld+json">${JSON.stringify(route.schema, null, 2)}</script>`;
    html = html.replace('</head>', `${schemaTag}\n  </head>`);
  }

  // Determine target directory and file
  const relativePath = route.path === '/' ? '' : route.path.replace(/^\//, '');
  const targetDir = path.join(DIST_DIR, relativePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
});

console.log(`[Prerender] Prerendering ${routes.length} public routes completed.`);

// Generate Clean public/sitemap.xml (Fixing S4: real lastmod, no changefreq/priority)
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${TODAY_ISO}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml, 'utf8');
if (fs.existsSync(path.join(DIST_DIR, 'sitemap.xml'))) {
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
}
console.log(`[Prerender] Updated sitemap.xml with ${routes.length} clean URLs and ISO lastmod dates.`);

// Generate public/llms-full.txt (Phase 4 requirement)
const llmsFull = `# Ghazi Wazir — Full Knowledge Base & Complete Documentation

## Dual Entity Executive Overview
- Person: Ghazi Wazir (Alternate: Ghazi Ur Rehman)
- Entity 1: Back for Brand LLC (Florida, USA) — Technology, SEO, AEO, GEO, AI Automation
- Entity 2: Bab Al Khaleej Business Consultancy W.L.L. (Manama, Bahrain) — Corporate Registration, Visas, Document Clearance
- Single Verified WhatsApp: ${SITE_CONFIG.person.phone}
- Single Verified Email: ${SITE_CONFIG.person.email}

## Bahrain Corporate Formation Services
${BAHRAIN_SERVICES.map(s => `
### ${s.title}
- Overview: ${s.description}
- Inclusions:
${s.included.map(i => `  * ${i}`).join('\n')}
- Frequently Asked Questions:
${(s.faqs || [s.faq]).map(f => `  * Q: ${f.q}\n    A: ${f.a}`).join('\n')}
`).join('\n')}

## Technology, SEO & AI Automation Services
${TECH_SERVICES.map(s => `
### ${s.title}
- Overview: ${s.description}
- Inclusions:
${s.included.map(i => `  * ${i}`).join('\n')}
- Frequently Asked Questions:
${(s.faqs || [s.faq]).map(f => `  * Q: ${f.q}\n    A: ${f.a}`).join('\n')}
`).join('\n')}

## Authoritative Knowledge Guides
${GUIDES.map(g => `
### ${g.title}
- Summary: ${g.summary}
- Date: ${g.date}
${g.sections.map(sec => `#### ${sec.heading}\n${sec.body}`).join('\n\n')}
`).join('\n\n')}
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'llms-full.txt'), llmsFull, 'utf8');
if (fs.existsSync(DIST_DIR)) {
  fs.writeFileSync(path.join(DIST_DIR, 'llms-full.txt'), llmsFull, 'utf8');
}
console.log('[Prerender] Generated public/llms-full.txt with complete knowledge corpus.');
