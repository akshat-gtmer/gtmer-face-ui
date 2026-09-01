/**
 * Web Scraper Engine & Endpoint Handler
 * Simulates deep website crawling or queries backend scraper API.
 */

export interface ScrapedPageDetail {
  path: string
  url: string
  title: string
  metaDescription: string
  executiveSummary: string
  targetAudience: string
  outboundPitchHook: string
  h1: string[]
  h2: string[]
  h3: string[]
  techTags: string[]
  keySignals: string[]
  relevanceScore: number
  status: 'Scraped' | 'Analyzed' | 'Indexed'
  discoveredLinksCount: number
}

export interface ScraperResult {
  domain: string
  companyName: string
  tagline: string
  totalPagesScraped: number
  totalDiscoveredLinks: number
  techStack: string[]
  primaryIndustry: string
  pages: ScrapedPageDetail[]
}

/**
 * Helper to generate 12 full, distinct scraped page details for any domain
 */
const build12ScrapedPages = (cleanDomain: string, brandName: string): ScrapedPageDetail[] => [
  {
    path: '/',
    url: `https://${cleanDomain}/`,
    title: `${brandName} | Official Enterprise Platform & Business Solutions`,
    metaDescription: `Official homepage for ${brandName}. Discover innovative software services designed to accelerate business operations and increase revenue.`,
    executiveSummary: `This is the primary storefront landing page for ${brandName}. It introduces their flagship enterprise platform, highlighting system reliability, automated workflows, and cloud architecture built for scaling modern companies.`,
    targetAudience: 'Chief Executive Officers (CEOs), VP of Operations, IT Directors, and Business Unit Leaders.',
    outboundPitchHook: `Leveraging ${brandName}'s core platform capabilities, GTMer's AI sales agents can automate outbound sales engagement to generate high-intent pipeline.`,
    h1: [`Transform your enterprise operations with ${brandName}`],
    h2: ['Enterprise-grade reliability and security', 'Seamless API integration across cloud systems', 'Automated workflow intelligence'],
    h3: ['Real-time executive analytics', 'Customer engagement automation'],
    techTags: ['Enterprise Software', 'API Integration', 'Cloud Infrastructure'],
    keySignals: ['Active Scaling Signal', 'High Growth Trajectory', 'Hiring Operations Team'],
    relevanceScore: 95,
    status: 'Scraped',
    discoveredLinksCount: 18,
  },
  {
    path: '/about',
    url: `https://${cleanDomain}/about`,
    title: `About Us | ${brandName} Story, Mission & Executive Leadership`,
    metaDescription: `Learn about ${brandName}'s company history, core team values, executive leadership, and technology milestones.`,
    executiveSummary: `The About page details ${brandName}'s organizational founding story, corporate culture, executive leadership background, and long-term vision empowering enterprise partners globally.`,
    targetAudience: 'Enterprise clients, strategic partners, talent recruits, and industry analysts.',
    outboundPitchHook: `Highlighting ${brandName}'s corporate milestones and headcount growth, we can engage similar mid-market companies seeking autonomous AI SDR outreach.`,
    h1: [`Our mission to empower modern organizations worldwide`],
    h2: ['Founded by veteran technology leaders', 'Serving thousands of clients across global markets'],
    h3: ['Core team values & vision', 'Global office locations'],
    techTags: ['Company Culture', 'Executive Leadership', 'Global Expansion'],
    keySignals: ['Global Footprint', 'Rapid Hiring Phase'],
    relevanceScore: 82,
    status: 'Analyzed',
    discoveredLinksCount: 12,
  },
  {
    path: '/product',
    url: `https://${cleanDomain}/product`,
    title: `${brandName} Product Suite & Feature Architecture`,
    metaDescription: `Explore the comprehensive ${brandName} product suite, feature matrix, developer documentation, and core architecture.`,
    executiveSummary: `This page provides a functional breakdown of ${brandName}'s software architecture. It showcases automated data processing, custom executive dashboards, strict security controls, and RESTful API connectors.`,
    targetAudience: 'VP of Engineering, System Architects, Product Managers, and IT Security Officers.',
    outboundPitchHook: `Target tech leaders interested in ${brandName}'s integration architecture with a personalized pitch demonstrating GTMer's automated SDR agents.`,
    h1: [`Automate enterprise workflows with ${brandName} Engine`],
    h2: ['Modular API architecture', 'Built for strict enterprise compliance'],
    h3: ['Custom reporting triggers', 'Role-based access controls'],
    techTags: ['Workflow Automation', 'Reporting APIs', 'Security Controls'],
    keySignals: ['High Tech Maturity', 'Integration Opportunities'],
    relevanceScore: 90,
    status: 'Indexed',
    discoveredLinksCount: 11,
  },
  {
    path: '/pricing',
    url: `https://${cleanDomain}/pricing`,
    title: `${brandName} Pricing Plans & Custom Subscription Licensing`,
    metaDescription: `Compare ${brandName} pricing tiers: Starter, Growth, and Enterprise options with flexible licensing and onboarding support.`,
    executiveSummary: `This page outlines ${brandName}'s subscription pricing model. It compares entry-level plans with custom enterprise tier SLAs, dedicated success managers, and high-volume volume licensing terms.`,
    targetAudience: 'Chief Financial Officers (CFOs), Procurement Officers, and Finance Decision-Makers.',
    outboundPitchHook: `Leverage ${brandName}'s enterprise pricing model to target companies evaluating ROI on automated outbound sales tooling.`,
    h1: ['Simple, predictable pricing built for every stage of growth'],
    h2: ['Starter plan for growing teams', 'Enterprise plan with custom SLAs'],
    h3: ['Dedicated account management', 'Onboarding & migration assistance'],
    techTags: ['Tiered Licensing', 'Enterprise Support', 'SLA Guarantees'],
    keySignals: ['High Ticket Prospect', 'Dedicated Sales Pipeline'],
    relevanceScore: 88,
    status: 'Scraped',
    discoveredLinksCount: 8,
  },
  {
    path: '/solutions',
    url: `https://${cleanDomain}/solutions`,
    title: `${brandName} Solutions | Industry & Departmental Use Cases`,
    metaDescription: `Discover how ${brandName} delivers tailored solutions for Financial Services, Healthcare, SaaS, and Ecommerce brands.`,
    executiveSummary: `The Solutions page outlines tailored industry packages and departmental workflows. It highlights specific value multipliers for sales operations, customer success, and executive reporting.`,
    targetAudience: 'Industry Vertical Leaders, Department Heads, and Sales Strategy Directors.',
    outboundPitchHook: `Target vertical leaders using ${brandName}'s industry solutions with tailored AI campaign templates created by GTMer.`,
    h1: ['Tailored enterprise solutions for every industry sector'],
    h2: ['Finance & Commerce workflows', 'Scalable SaaS deployment architectures'],
    h3: ['Departmental alignment tools', 'Automated ROI tracking'],
    techTags: ['Industry Verticalization', 'Workplace Solutions'],
    keySignals: ['Industry Specialization', 'Multi-Department Sales'],
    relevanceScore: 86,
    status: 'Analyzed',
    discoveredLinksCount: 14,
  },
  {
    path: '/features',
    url: `https://${cleanDomain}/features`,
    title: `${brandName} Platform Features & Automation Tools`,
    metaDescription: `Detailed feature breakdown of ${brandName}: real-time analytics, automated alerts, custom dashboards, and integrations.`,
    executiveSummary: `This feature catalog indexes ${brandName}'s primary functional modules. It details real-time data streaming, customizable notification triggers, automated audit logs, and workflow orchestration.`,
    targetAudience: 'Operations Lead Specialist, IT Administrators, and Power Users.',
    outboundPitchHook: `Showcase how GTMer complements ${brandName}'s feature set by adding autonomous prospect discovery and multi-channel email outreach.`,
    h1: ['Comprehensive automation features for modern teams'],
    h2: ['Real-time telemetry and alerting', 'Customizable dashboard widgets'],
    h3: ['Automated background scheduling', 'Export & analytics reporting'],
    techTags: ['Feature Catalog', 'Real-Time Telemetry', 'Dashboard Widgets'],
    keySignals: ['Active Feature Updates', 'User Adoption Focus'],
    relevanceScore: 85,
    status: 'Scraped',
    discoveredLinksCount: 15,
  },
  {
    path: '/customers',
    url: `https://${cleanDomain}/customers`,
    title: `${brandName} Customer Stories, Reviews & Case Studies`,
    metaDescription: `Read customer success stories and case studies from market leaders using ${brandName} to scale operations.`,
    executiveSummary: `The Customers page presents verified case studies, testimonial quotes, and quantifiable business outcomes achieved by global brands deploying ${brandName} across their organizations.`,
    targetAudience: 'Prospective Enterprise Buyers, Procurement Teams, and Risk Officers.',
    outboundPitchHook: `Engage companies featured in ${brandName}'s customer roster with personalized outbound campaigns referencing proven ROI metrics.`,
    h1: ['Trusted by category-defining global enterprises'],
    h2: ['3× operational speed increase', '70% cost savings verified by clients'],
    h3: ['Featured customer stories', 'Industry ROI benchmark reports'],
    techTags: ['Social Proof', 'Verified Reviews', 'Case Studies'],
    keySignals: ['Strong Social Proof', 'High Retention Rate'],
    relevanceScore: 89,
    status: 'Indexed',
    discoveredLinksCount: 16,
  },
  {
    path: '/integrations',
    url: `https://${cleanDomain}/integrations`,
    title: `${brandName} Ecosystem Integrations & API Directory`,
    metaDescription: `Connect ${brandName} with Salesforce, HubSpot, Slack, Zendesk, and 50+ business tools seamlessly out of the box.`,
    executiveSummary: `This integrations portal indexes pre-built connectors for major CRMs, communication channels, and data warehouses. It provides 1-click authentication and webhooks support.`,
    targetAudience: 'Integration Engineers, CRM Administrators, and Sales Operations Managers.',
    outboundPitchHook: `Highlight GTMer's seamless integration capabilities alongside ${brandName}'s API ecosystem to streamline CRM data syncing.`,
    h1: ['Connect ${brandName} to your existing technology stack'],
    h2: ['Pre-built CRM connectors', 'Bi-directional webhook sync engine'],
    h3: ['Custom API developer docs', 'App marketplace directory'],
    techTags: ['CRM Connectors', 'Webhooks Engine', 'API Marketplace'],
    keySignals: ['Extensible Tech Ecosystem', 'API First Architecture'],
    relevanceScore: 92,
    status: 'Scraped',
    discoveredLinksCount: 20,
  },
  {
    path: '/security',
    url: `https://${cleanDomain}/security`,
    title: `${brandName} Trust Center | Security, SOC2 & GDPR Compliance`,
    metaDescription: `Learn about ${brandName}'s security architecture, SOC2 Type II compliance, AES-256 encryption, and data protection standards.`,
    executiveSummary: `The Trust Center outlines ${brandName}'s security posture: SOC2 Type II certification, end-to-end data encryption, automated vulnerability testing, and GDPR compliance policies.`,
    targetAudience: 'Chief Information Security Officers (CISOs), Compliance Officers, and Security Review Committees.',
    outboundPitchHook: `Reassure enterprise security officers evaluating ${brandName} that GTMer maintains strict SOC2 compliance and data privacy standards.`,
    h1: ['Enterprise-grade data security & compliance infrastructure'],
    h2: ['SOC 2 Type II certified', 'AES-256 encryption at rest and in transit'],
    h3: ['GDPR & CCPA compliance', 'Single Sign-On (SSO / SAML)'],
    techTags: ['SOC 2 Type II', 'AES-256 Encryption', 'SSO / SAML'],
    keySignals: ['Strict Security Mandate', 'Enterprise Compliance'],
    relevanceScore: 87,
    status: 'Analyzed',
    discoveredLinksCount: 10,
  },
  {
    path: '/resources',
    url: `https://${cleanDomain}/resources`,
    title: `${brandName} Resource Center | Documentation & Whitepapers`,
    metaDescription: `Access ${brandName} technical guides, whitepapers, webinar recordings, and developer documentation.`,
    executiveSummary: `The Resource Center aggregates technical documentation, architectural whitepapers, implementation guides, and video walkthroughs designed to assist developer teams.`,
    targetAudience: 'Technical Architects, Developers, and Implementation Consultants.',
    outboundPitchHook: `Leverage ${brandName}'s published whitepapers to craft hyper-relevant outbound sales hooks referencing specific technical topics.`,
    h1: ['Developer documentation and knowledge repository'],
    h2: ['Technical architecture whitepapers', 'On-demand video walkthroughs'],
    h3: ['SDK code samples', 'Best practice implementation guides'],
    techTags: ['Developer Docs', 'Technical Whitepapers', 'SDK Samples'],
    keySignals: ['Developer Community', 'Thought Leadership'],
    relevanceScore: 80,
    status: 'Scraped',
    discoveredLinksCount: 14,
  },
  {
    path: '/careers',
    url: `https://${cleanDomain}/careers`,
    title: `Careers at ${brandName} | Join Our Global Engineering Team`,
    metaDescription: `Explore open engineering, sales, and product positions at ${brandName} and join our mission to build the future.`,
    executiveSummary: `The Careers page highlights open job openings, company benefit perks, remote work culture, and team growth trajectories across engineering, sales, and marketing divisions.`,
    targetAudience: 'Potential job applicants, HR Recruiters, and Competitive Intelligence Analysts.',
    outboundPitchHook: `With ${brandName} actively hiring sales and engineering personnel, GTMer can help their growing sales team book qualified meetings immediately.`,
    h1: [`Join our team and help shape the future of ${brandName}`],
    h2: ['Open engineering & sales positions', 'Competitive health benefits & equity options'],
    h3: ['Inclusive remote team culture', 'Career development programs'],
    techTags: ['Talent Recruiting', 'Hiring Growth', 'Culture'],
    keySignals: ['Active Sales Hiring', 'Headcount Expansion'],
    relevanceScore: 76,
    status: 'Analyzed',
    discoveredLinksCount: 12,
  },
  {
    path: '/contact',
    url: `https://${cleanDomain}/contact`,
    title: `Contact ${brandName} Sales & Customer Support`,
    metaDescription: `Get in touch with ${brandName} sales specialists for custom demo bookings, pricing inquiries, or technical support.`,
    executiveSummary: `The Contact page offers direct contact methods for enterprise inquiries: sales scheduling forms, phone lines, support ticketing, and physical headquarters address info.`,
    targetAudience: 'Prospective Customers, Partner Inquiries, and Existing Account Holders.',
    outboundPitchHook: `Target outbound prospects visiting ${brandName}'s contact portal with automated GTMer campaigns that convert high-intent traffic.`,
    h1: ['Speak with our sales & solutions experts'],
    h2: ['Schedule a personalized demo', '24/7 dedicated support team'],
    h3: ['Global office contact numbers', 'Partnership inquiry desk'],
    techTags: ['Sales Demo', 'Enterprise Contact', '24/7 Support'],
    keySignals: ['Active Lead Capture', 'Inbound Demo Requests'],
    relevanceScore: 91,
    status: 'Scraped',
    discoveredLinksCount: 9,
  },
]

/**
 * Preset data structure for Stripe with 12 complete pages
 */
const PRESET_SCRAPE_DATA: Record<string, ScraperResult> = {
  'stripe.com': {
    domain: 'stripe.com',
    companyName: 'Stripe',
    tagline: 'Financial infrastructure for the internet',
    totalPagesScraped: 12,
    totalDiscoveredLinks: 64,
    techStack: ['React', 'GraphQL', 'Ruby on Rails', 'Stripe Connect', 'AWS'],
    primaryIndustry: 'Fintech & Payment Gateway',
    pages: build12ScrapedPages('stripe.com', 'Stripe'),
  },
  'linear.app': {
    domain: 'linear.app',
    companyName: 'Linear',
    tagline: 'The purpose-built tool for modern software development',
    totalPagesScraped: 12,
    totalDiscoveredLinks: 48,
    techStack: ['React', 'TypeScript', 'GraphQL', 'Electron', 'TailwindCSS'],
    primaryIndustry: 'DevTools & Issue Tracking',
    pages: build12ScrapedPages('linear.app', 'Linear'),
  },
}

/**
 * Standard generator for any custom user-submitted URL returning 12 complete pages
 */
const generateCustomScrapeData = (rawUrl: string): ScraperResult => {
  let cleanDomain = rawUrl.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  if (!cleanDomain) cleanDomain = 'example.com'
  const brandName = cleanDomain.split('.')[0].toUpperCase()
  const pagesList = build12ScrapedPages(cleanDomain, brandName)

  return {
    domain: cleanDomain,
    companyName: brandName,
    tagline: `Next-generation ${brandName} enterprise platform and cloud solutions`,
    totalPagesScraped: pagesList.length,
    totalDiscoveredLinks: 48,
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS CloudFront', 'Docker'],
    primaryIndustry: 'B2B Software & Enterprise Technology',
    pages: pagesList,
  }
}

/**
 * Execute scrape function (simulates endpoint + live streaming steps)
 */
export const executeWebScrape = async (
  inputUrl: string,
  onProgress?: (log: string, stage: number) => void
): Promise<ScraperResult> => {
  const cleanDomain = inputUrl.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]

  // Step 1: Connecting
  if (onProgress) onProgress(`[1/5] ➜ Initializing headless crawler connection to ${cleanDomain}...`, 1)
  await new Promise(r => setTimeout(r, 600))

  // Step 2: DOM Parsing
  if (onProgress) onProgress(`[2/5] ➜ Fetching HTML DOM tree & parsing meta tags from root /...`, 2)
  await new Promise(r => setTimeout(r, 700))

  // Step 3: Link Discovery
  if (onProgress) onProgress(`[3/5] ➜ Discovered 12 internal routes (/about, /product, /pricing, /solutions, /features, /customers, /integrations, /security, /resources, /careers, /contact)...`, 3)
  await new Promise(r => setTimeout(r, 650))

  // Step 4: Extracting Signals
  if (onProgress) onProgress(`[4/5] ➜ Extracting executive summaries, headlines, tech tags, and sales pitch context across 12 pages...`, 4)
  await new Promise(r => setTimeout(r, 750))

  // Step 5: Finalizing
  if (onProgress) onProgress(`[5/5] ✔ Scrape complete! Indexed 12/12 pages & generated sales outreach intelligence.`, 5)
  await new Promise(r => setTimeout(r, 400))

  if (PRESET_SCRAPE_DATA[cleanDomain]) {
    return PRESET_SCRAPE_DATA[cleanDomain]
  }

  return generateCustomScrapeData(inputUrl)
}
