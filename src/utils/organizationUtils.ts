/**
 * Utility functions for B2B Organization filtering and classification.
 * Identifies and excludes consumer ISPs, residential cable networks, and mobile carriers
 * so they are never falsely labeled as corporate company organizations.
 */

export interface OrganizationData {
  organizationName?: string
  domain?: string
  industry?: string
  employeeRange?: string
  country?: string
  confidenceScore?: number
}

const CONSUMER_ISP_KEYWORDS = [
  'hathway',
  'airtel',
  'bharti airtel',
  'reliance jio',
  'jio infocomm',
  'bsnl',
  'bharat sanchar',
  'mtnl',
  'act fibernet',
  'atria convergence',
  'vodafone',
  'idea cellular',
  'vi india',
  'comcast',
  'xfinity',
  'charter communication',
  'spectrum',
  'at&t',
  'verizon',
  'centurylink',
  'century link',
  'lumen technologies',
  'cox communication',
  'optimum',
  'suddenlink',
  'frontier communication',
  'windstream',
  't-mobile',
  'deutsche telekom',
  'orange',
  'telefonica',
  'broadband',
  'cable and datacom',
  'cable & datacom',
  'telecom',
  'telecommunications',
  'internet service provider',
  'cable communication',
  'residential',
  'network service provider',
  'asn-',
]

const CONSUMER_ISP_DOMAINS = [
  'hathway.com',
  'airtel.in',
  'airtel.com',
  'jio.com',
  'bsnl.co.in',
  'mtnl.net.in',
  'actcorp.in',
  'comcast.net',
  'comcast.com',
  'spectrum.com',
  'att.com',
  'verizon.com',
  'verizon.net',
  'centurylink.com',
  'lumen.com',
  'cox.com',
  'optimum.com',
  't-mobile.com',
  'telekom.de',
]

export const isConsumerIsp = (org?: OrganizationData | null): boolean => {
  if (!org) return false
  const name = (org.organizationName || '').toLowerCase()
  const domain = (org.domain || '').toLowerCase()

  if (CONSUMER_ISP_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d))) {
    return true
  }

  return CONSUMER_ISP_KEYWORDS.some((kw) => name.includes(kw))
}

export const getRealOrganization = <T extends OrganizationData>(org?: T | null): T | null => {
  if (!org || !org.organizationName) return null
  if (isConsumerIsp(org)) return null
  return org
}
