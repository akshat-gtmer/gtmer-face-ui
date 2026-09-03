/**
 * Utility functions for session cookie management & lead payload transfer.
 * Rule 1: Cookie collection & session lead tracking.
 * Rule 2: 1-company scrape limit for anonymous demo users.
 */

const COOKIE_NAME = 'gtmer_scraped_company'
const LEAD_PAYLOAD_COOKIE = 'gtmer_lead_payload'
const SESSION_ID_COOKIE = 'gtmer_scrape_session_id'
const VISITOR_ID_COOKIE = 'gtmer_visitor_id'
const ATTRIBUTION_COOKIE = 'gtmer_attribution'

export interface ScrapedCompanyCookie {
  domain: string
  scrapedAt: string
}

export interface AttributionData {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer: string
  landingPage: string
  firstSeenAt: string
}

export interface FullLeadPayload {
  sessionId?: string
  domain: string
  companyName: string
  primaryIndustry: string
  techStack: string[]
  totalPagesScraped: number
  primaryHeadline: string
  scrapedAt: string
  generatedSubject?: string
  generatedEmail?: string
}

/**
 * Gets a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length))
  }
  return null
}

/**
 * Sets a cookie with specified expiration in days
 */
export const setCookie = (name: string, value: string, days = 30): void => {
  if (typeof document === 'undefined') return
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`
}

/**
 * Gets or creates a unique session ID for tracking anonymous scrape sessions
 */
export const getOrCreateScrapeSessionId = (): string => {
  if (typeof window !== 'undefined') {
    const localId = localStorage.getItem(SESSION_ID_COOKIE)
    if (localId) return localId
  }
  const cookieId = getCookie(SESSION_ID_COOKIE)
  if (cookieId) return cookieId

  const newId = `session_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  setCookie(SESSION_ID_COOKIE, newId, 30)
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(SESSION_ID_COOKIE, newId) } catch { /* pass */ }
  }
  return newId
}

/**
 * Retrieves the previously scraped company data from cookie
 */
export const getScrapedCompanyCookie = (): ScrapedCompanyCookie | null => {
  const val = getCookie(COOKIE_NAME)
  if (!val) return null
  try {
    return JSON.parse(val)
  } catch {
    return { domain: val, scrapedAt: new Date().toISOString() }
  }
}

/**
 * Saves the scraped company data to cookie
 */
export const setScrapedCompanyCookie = (domain: string): void => {
  const data: ScrapedCompanyCookie = {
    domain: domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0],
    scrapedAt: new Date().toISOString(),
  }
  setCookie(COOKIE_NAME, JSON.stringify(data), 7)
}

/**
 * Saves the full structured lead payload to cookie & localStorage
 */
export const setScrapedLeadPayload = (payload: FullLeadPayload): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEAD_PAYLOAD_COOKIE, JSON.stringify(payload))
    } catch {
      // fallback
    }
  }
  setCookie(LEAD_PAYLOAD_COOKIE, JSON.stringify(payload), 7)
}

/**
 * Gets the stored lead payload
 */
export const getScrapedLeadPayload = (): FullLeadPayload | null => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LEAD_PAYLOAD_COOKIE)
    if (local) {
      try { return JSON.parse(local) } catch { /* pass */ }
    }
  }
  const val = getCookie(LEAD_PAYLOAD_COOKIE)
  if (!val) return null
  try { return JSON.parse(val) } catch { return null }
}

/**
 * Clears the session ID, scraped company cookie, lead payload, and local drafts
 * Called immediately after a user successfully registers or claims a lead session.
 */
export const clearScrapeSession = (): void => {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${LEAD_PAYLOAD_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${SESSION_ID_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LEAD_PAYLOAD_COOKIE)
      localStorage.removeItem(SESSION_ID_COOKIE)
      localStorage.removeItem('gtmr_generated_drafts')
    } catch { /* pass */ }
  }
}

/**
 * Clears the scraped company cookie
 */
export const clearScrapedCompanyCookie = (): void => {
  clearScrapeSession()
}

/**
 * Checks if user is trying to scrape a second distinct company domain
 * Returns true if blocked (demo limit reached).
 */
export const checkDemoLimitBlocked = (newDomain: string): { blocked: boolean; existingDomain?: string } => {
  const existing = getScrapedCompanyCookie()
  if (!existing || !existing.domain) return { blocked: false }

  const cleanNew = newDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  const cleanExisting = existing.domain.toLowerCase()

  if (cleanNew !== cleanExisting) {
    return { blocked: true, existingDomain: cleanExisting }
  }

  return { blocked: false, existingDomain: cleanExisting }
}

export interface SavedEmailDraft {
  email: string
  name: string
  subject: string
  body: string
  status: 'draft'
  created_at: string
}

/**
 * Save via Local Storage (Instant Client Sync)
 */
export const saveDraftLocally = (draftData: { email: string; name: string; subject: string; body: string }) => {
  if (typeof window === 'undefined') return
  try {
    const drafts: SavedEmailDraft[] = JSON.parse(localStorage.getItem('gtmr_generated_drafts') || '[]')
    const existingIndex = drafts.findIndex(d => d.email === draftData.email || d.name === draftData.name)
    const newDraft: SavedEmailDraft = {
      email: draftData.email,
      name: draftData.name,
      subject: draftData.subject,
      body: draftData.body,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    if (existingIndex >= 0) {
      drafts[existingIndex] = newDraft
    } else {
      drafts.unshift(newDraft)
    }
    localStorage.setItem('gtmr_generated_drafts', JSON.stringify(drafts))
    window.dispatchEvent(new CustomEvent('gtmr_draft_created'))
  } catch (e) {
    console.error('Error saving draft locally:', e)
  }
}

/**
 * Get all locally saved email drafts
 */
export const getLocalDrafts = (): SavedEmailDraft[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('gtmr_generated_drafts') || '[]')
  } catch {
    return []
  }
}

/**
 * Gets or generates a unique synthetic Anonymous Visitor ID for unauthenticated users
 */
export const getOrCreateVisitorId = (): string => {
  if (typeof window === 'undefined') return ''
  const localId = localStorage.getItem(VISITOR_ID_COOKIE)
  if (localId) return localId

  const cookieId = getCookie(VISITOR_ID_COOKIE)
  if (cookieId) return cookieId

  const newId = `anon_usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  setCookie(VISITOR_ID_COOKIE, newId, 365)
  try { localStorage.setItem(VISITOR_ID_COOKIE, newId) } catch { /* pass */ }

  return newId
}

/**
 * Captures UTM parameters, referrer, and initial landing page on first visit
 */
export const captureAttributionData = (): AttributionData | null => {
  if (typeof window === 'undefined') return null

  const existing = getCookie(ATTRIBUTION_COOKIE)
  if (existing) {
    try { return JSON.parse(existing) } catch { /* pass */ }
  }

  const params = new URLSearchParams(window.location.search)
  const data: AttributionData = {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    referrer: document.referrer || 'direct',
    landingPage: window.location.pathname,
    firstSeenAt: new Date().toISOString(),
  }

  setCookie(ATTRIBUTION_COOKIE, JSON.stringify(data), 30)
  try { localStorage.setItem(ATTRIBUTION_COOKIE, JSON.stringify(data)) } catch { /* pass */ }

  return data
}


