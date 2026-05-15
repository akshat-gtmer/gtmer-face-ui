import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'https://gtmer.ai'

interface HeadConfig {
  title: string
  description: string
}

const VIEW_HEAD: Record<string, HeadConfig> = {
  '/': {
    title: 'GTMer — AI SDR Agents for Autonomous Outbound & Go-To-Market Execution',
    description:
      'GTMer is an AI-powered autonomous SDR platform. AI agents prospect, enrich, and engage your ideal buyers across email, LinkedIn, and calls — booking qualified meetings on autopilot.',
  },
  '/agents': {
    title: 'GTMer AI Agents — Custom AI SDR & Sales Automation Agents for GTM',
    description:
      'GTMer builds custom AI sales agents tailored to your exact GTM workflow — prospecting, enrichment, personalized outbound at scale, nurturing, and conversion. Six AI SDR agent types or fully custom.',
  },
  '/data-engine': {
    title: 'GTMer Data Engine — Real-Time B2B Intelligence for AI SDR Enrichment',
    description:
      'GTMer Data Engine powers AI SDR sales automation with real-time enrichment from 100+ B2B sources — firmographics, technographics, intent signals, verified emails, and phone numbers.',
  },
  '/product': {
    title: 'GTMer Product — AI SDR Sales Automation Command Center',
    description:
      'One AI sales automation command center where AI SDR agents source, enrich, engage, and book meetings autonomously. Real-time pipeline tracking, intent scoring, and personalized outbound at scale.',
  },
  '/pricing': {
    title: 'GTMer Pricing — AI SDR Agent Plans & Tiers',
    description:
      'Simple, transparent pricing for GTMer AI SDR agents. Starter ($499/mo), Growth ($1,499/mo), and Enterprise plans. 14-day free trial, no credit card required.',
  },
  '/security': {
    title: 'GTMer Security — Enterprise-Grade Data Protection & SOC 2 Compliance',
    description:
      'GTMer is SOC 2 Type II compliant with AES-256 encryption, tenant isolation, GDPR compliance, SSO/SAML, and role-based access controls.',
  },
  '/integrations': {
    title: 'GTMer Integrations — 100+ Connected CRM, Data & Communication Tools',
    description:
      'GTMer integrates with Salesforce, HubSpot, LinkedIn, Apollo, ZoomInfo, Clearbit, G2, Bombora, Slack, and 100+ more tools out of the box.',
  },
  '/about': {
    title: 'About GTMer — Our Mission to Automate Go-To-Market Execution',
    description:
      'GTMer was founded in 2024 to make outbound sales fully autonomous. AI agents replace manual prospecting, enrichment, and outreach — so teams focus on closing.',
  },
  '/gtm-automation': {
    title: 'GTM Automation Platform — Automate Go-To-Market Execution with AI | GTMer',
    description:
      'GTMer is the leading GTM automation platform. AI SDR agents automate your entire go-to-market pipeline — lead sourcing, data enrichment, personalized outbound at scale, and meeting booking. 10× faster pipeline, 70% lower CAC.',
  },
}

/**
 * Updates document <title>, <meta name="description">, canonical URL,
 * Open Graph, and Twitter Card meta tags based on the current route.
 * Ensures each page has unique, SEO-critical head tags for proper indexing.
 */
export function useDocumentHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const config = VIEW_HEAD[pathname] || VIEW_HEAD['/']
    const canonicalUrl = pathname === '/'
      ? `${BASE_URL}/`
      : `${BASE_URL}${pathname}`

    // Title
    document.title = config.title

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', config.description)
    }

    // Canonical URL — critical for preventing duplicate content across routes
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl)
    } else {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      canonicalLink.setAttribute('href', canonicalUrl)
      document.head.appendChild(canonicalLink)
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', config.title)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', config.description)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl)

    // Twitter Card tags
    const twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', config.title)

    const twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', config.description)
  }, [pathname])
}
