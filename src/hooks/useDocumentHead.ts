import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

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
    title: 'GTMer AI Agents — Custom-Built SDR Agents for Your GTM Workflow',
    description:
      'GTMer builds custom AI agents tailored to your exact GTM workflow — prospecting, enrichment, outreach, nurturing, and conversion. Six purpose-built agent types or fully custom.',
  },
  '/data-engine': {
    title: 'GTMer Data Engine — Real-Time B2B Intelligence & Lead Enrichment',
    description:
      'GTMer Data Engine enriches prospect data from 100+ B2B sources in real-time — firmographics, technographics, intent signals, verified emails, and phone numbers.',
  },
  '/product': {
    title: 'GTMer Product — Autonomous Sales Pipeline Command Center',
    description:
      'One command center where AI agents source, enrich, engage, and book meetings autonomously. Real-time pipeline tracking, intent scoring, and agent orchestration.',
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
}

/**
 * Updates document <title> and <meta name="description"> based on the current route.
 * Ensures each page has a unique, keyword-rich title for SEO.
 */
export function useDocumentHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const config = VIEW_HEAD[pathname] || VIEW_HEAD['/']

    document.title = config.title

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', config.description)
    }

    // Also update OG tags for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', config.title)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', config.description)

    const twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', config.title)

    const twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', config.description)
  }, [pathname])
}
