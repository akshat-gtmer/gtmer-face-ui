/**
 * Utility functions for session cookie management & lead payload transfer.
 * Rule 1: Cookie collection & session lead tracking.
 * Rule 2: 1-company scrape limit for anonymous demo users.
 */

const COOKIE_NAME = 'gtmer_scraped_company'
const LEAD_PAYLOAD_COOKIE = 'gtmer_lead_payload'
const SESSION_ID_COOKIE = 'gtmer_scrape_session_id'

export interface ScrapedCompanyCookie {
  domain: string
  scrapedAt: string
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
 * Clears the scraped company cookie
 */
export const clearScrapedCompanyCookie = (): void => {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  document.cookie = `${LEAD_PAYLOAD_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LEAD_PAYLOAD_COOKIE)
  }
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
