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

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_URL = 'https://ghaziurrehamn.com';

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

// Ensure dist directory exists
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

const routes: RouteMetadata[] = [
  // Home
  {
    path: '/',
    title: 'Ghazi Wazir — Bahrain Business Setup & AI Search (SEO, AEO, GEO)',
    description: 'CEO of Back for Brand LLC (USA) and business consultant at Bab Al-Khaleej (Bahrain). Commercial registration, visas, SEO, AEO, GEO, and AI automation.',
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
  },
  // Bahrain Hub
  {
    path: '/bahrain-business-setup',
    title: 'Bahrain Business Setup: CR, Visas & Documents | Bab Al-Khaleej',
    description: 'Comprehensive business setup in Bahrain: Sijilat commercial registration (CR), foreign investor visas, LMRA work permits, and document attestation.',
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
        <p>Bab Al Khaleej Business Consultancy W.L.L. provides consultancy and document support. Approvals are issued exclusively by the competent Bahraini authorities (MOIC, LMRA, NPRA). We do not provide investment services or handle client funds.</p>
      </section>
    `,
  },
  // Tech Hub
  {
    path: '/technology-services',
    title: 'SEO, AEO, GEO & AI Automation | Back for Brand LLC',
    description: 'International software engineering, Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), SEO, and autonomous AI agents.',
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
    `,
  },
  // About
  {
    path: '/about',
    title: 'About Ghazi Wazir | CEO Back for Brand & Bab Al-Khaleej',
    description: 'Learn about Ghazi Wazir (Ghazi Ur Rehman), CEO of Back for Brand LLC (USA) and business consultant at Bab Al Khaleej Business Consultancy W.L.L. (Bahrain).',
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
  },
  // Contact
  {
    path: '/contact',
    title: 'Contact Ghazi Wazir | Direct WhatsApp & Executive Desk',
    description: 'Schedule a 1-on-1 consultation with Ghazi Wazir for Bahrain commercial registration or international AI search optimization (AEO/GEO).',
    canonical: `${BASE_URL}/contact`,
    h1: 'Contact Ghazi Wazir',
    lead: 'Direct executive inquiries, consultation bookings, and authorized ministry support.',
    contentHtml: `
      <section>
        <h2>Contact Details</h2>
        <p>WhatsApp: +973 3548 9066 | Email: contact@ghaziurrehamn.com</p>
        <div>
          <h3>Bahrain Office</h3>
          <p>Manama Center, Block 304, Road 385, Building 111, Flat/Shop 39, Manama, Kingdom of Bahrain</p>
        </div>
        <div>
          <h3>USA Mailing Address</h3>
          <p>7901 4th St N, Ste 19566, St. Petersburg, FL 33702, USA (Registered mailing address, not a public office)</p>
        </div>
      </section>
    `,
  },
  // Book
  {
    path: '/book',
    title: 'Book a Strategy Consultation | Ghazi Wazir',
    description: 'Book a 1-on-1 strategy call with Ghazi Wazir for Bahrain business setup or enterprise SEO and AI search optimization.',
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
  // Packages
  {
    path: '/packages',
    title: 'Consultancy & Service Packages | Ghazi Wazir',
    description: 'Explore transparent consultancy packages for Bahrain commercial registration, visa support, and AI search optimization retainers.',
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
  // Blog
  {
    path: '/blog',
    title: 'Authoritative Business & AI Guides | Ghazi Wazir',
    description: 'Comprehensive guides on Bahrain commercial registration, investor visas, foreign ownership, and Generative Engine Optimization (GEO/AEO).',
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
  // Privacy
  {
    path: '/privacy',
    title: 'Privacy Policy | Ghazi Wazir',
    description: 'Privacy policy for Ghazi Wazir executive portal, Back for Brand LLC, and Bab Al Khaleej Business Consultancy W.L.L.',
    canonical: `${BASE_URL}/privacy`,
    h1: 'Privacy Policy',
    lead: 'Our commitment to data privacy, confidentiality, and regulatory compliance.',
    contentHtml: `<section><p>Details on how personal and commercial information is securely stored and handled.</p></section>`,
  },
  // Terms
  {
    path: '/terms',
    title: 'Terms of Service | Ghazi Wazir',
    description: 'Terms of service and legal disclaimers for Back for Brand LLC and Bab Al Khaleej Business Consultancy W.L.L.',
    canonical: `${BASE_URL}/terms`,
    h1: 'Terms of Service',
    lead: 'Legal engagement terms and jurisdictional disclaimers.',
    contentHtml: `
      <section>
        <p>Consultancy agreements, scopes of work, and official government authority disclaimers.</p>
      </section>
    `,
  },
];

// Add individual Bahrain services
BAHRAIN_SERVICES.forEach((service) => {
  routes.push({
    path: `/bahrain-business-setup/${service.id}`,
    title: `${service.title} in Bahrain | Ghazi Wazir`,
    description: `${service.lead.slice(0, 150)}...`,
    canonical: `${BASE_URL}/bahrain-business-setup/${service.id}`,
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
        <div>
          <h3>${service.faq.q}</h3>
          <p>${service.faq.a}</p>
        </div>
        <div>
          <p><strong>Regulatory Notice:</strong> We provide consultancy and document support. Approvals are issued by the competent Bahraini authorities (MOIC, LMRA, NPRA). We do not provide investment services or handle client funds.</p>
        </div>
      </article>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${service.title} in Bahrain`,
      description: service.lead,
      provider: {
        '@type': 'Organization',
        name: BAB_AL_KHALEEJ_INFO.legalName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BAB_AL_KHALEEJ_INFO.registeredAddress,
          addressCountry: 'BH',
        },
      },
      url: `${BASE_URL}/bahrain-business-setup/${service.id}`,
    },
  });
});

// Add individual Tech services
TECH_SERVICES.forEach((service) => {
  routes.push({
    path: `/technology-services/${service.id}`,
    title: `${service.title} | Back for Brand LLC`,
    description: `${service.lead.slice(0, 150)}...`,
    canonical: `${BASE_URL}/technology-services/${service.id}`,
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
        <div>
          <h3>${service.faq.q}</h3>
          <p>${service.faq.a}</p>
        </div>
      </article>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.lead,
      provider: {
        '@type': 'Organization',
        name: BACK_FOR_BRAND_INFO.legalName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BACK_FOR_BRAND_INFO.registeredAddress,
          addressCountry: 'US',
        },
      },
      url: `${BASE_URL}/technology-services/${service.id}`,
    },
  });
});

// Add individual Guides
GUIDES.forEach((guide) => {
  const slug = guide.id.replace('guide-', '');
  routes.push({
    path: `/blog/${slug}`,
    title: `${guide.title} | Ghazi Wazir`,
    description: `${guide.summary.slice(0, 150)}...`,
    canonical: `${BASE_URL}/blog/${slug}`,
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
      </article>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.summary,
      author: {
        '@type': 'Person',
        name: GHAZI_INFO.name,
      },
      publisher: {
        '@type': 'Organization',
        name: BACK_FOR_BRAND_INFO.legalName,
      },
      datePublished: guide.date,
      url: `${BASE_URL}/blog/${slug}`,
    },
  });
});

// Execute prerendering
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

  // Inject semantic body inside root for crawlers without JS
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
  console.log(`[Prerender] Wrote: ${targetFile.replace(DIST_DIR, 'dist')}`);
});

console.log('[Prerender] Prerendering completed successfully!');
