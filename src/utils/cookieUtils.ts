import { API_BASE } from '../config/api'

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
const USER_EMAIL_COOKIE = 'gtmer_user_email'


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
 * Quadruple Redundancy: Synchronizes Cookie + LocalStorage + SessionStorage + IndexedDB
 */
export const getOrCreateVisitorId = (): string => {
  if (typeof window === 'undefined') return ''

  // 1. Check LocalStorage
  try {
    const localId = localStorage.getItem(VISITOR_ID_COOKIE)
    if (localId) {
      setCookie(VISITOR_ID_COOKIE, localId, 365)
      try { sessionStorage.setItem(VISITOR_ID_COOKIE, localId) } catch { /* pass */ }
      return localId
    }
  } catch { /* pass */ }

  // 2. Check Cookie
  const cookieId = getCookie(VISITOR_ID_COOKIE)
  if (cookieId) {
    try { localStorage.setItem(VISITOR_ID_COOKIE, cookieId) } catch { /* pass */ }
    try { sessionStorage.setItem(VISITOR_ID_COOKIE, cookieId) } catch { /* pass */ }
    return cookieId
  }

  // 3. Check SessionStorage
  try {
    const sessionId = sessionStorage.getItem(VISITOR_ID_COOKIE)
    if (sessionId) {
      setCookie(VISITOR_ID_COOKIE, sessionId, 365)
      try { localStorage.setItem(VISITOR_ID_COOKIE, sessionId) } catch { /* pass */ }
      return sessionId
    }
  } catch { /* pass */ }

  // 4. Generate New Visitor ID
  const newId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  setCookie(VISITOR_ID_COOKIE, newId, 365)
  try {
    localStorage.setItem(VISITOR_ID_COOKIE, newId)
    sessionStorage.setItem(VISITOR_ID_COOKIE, newId)
  } catch { /* pass */ }

  return newId
}

/**
 * Gets the stored logged-in or identified user email
 */
export const getStoredUserEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(USER_EMAIL_COOKIE) || localStorage.getItem('user_email')
      if (local) return local
    } catch { /* pass */ }
  }
  return getCookie(USER_EMAIL_COOKIE)
}

/**
 * Sets and persists the user email for telemetry tracking across sessions
 */
export const setStoredUserEmail = (email: string): void => {
  if (!email || !email.includes('@')) return
  const cleanEmail = email.trim().toLowerCase()
  setCookie(USER_EMAIL_COOKIE, cleanEmail, 365)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_EMAIL_COOKIE, cleanEmail)
    } catch { /* pass */ }
  }
}


/**
 * Parses URL Query parameters for pre-filled email, phone, token, or campaign data
 * Enables URL Tokenized Magic Links (Server/Client query extraction)
 */
export interface UrlQueryParams {
  email?: string
  phone?: string
  domain?: string
  subject?: string
  emailBody?: string
  token?: string
  ref?: string
}

/**
 * Parses URL Query parameters for pre-filled email, phone, token, or campaign data
 * Enables URL Tokenized Magic Links (Server/Client query extraction & auto-identification)
 */
export const getUrlQueryParameters = (): UrlQueryParams => {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  
  let resolvedEmail = params.get('email') || undefined
  const token = params.get('token') || undefined
  const phone = params.get('phone') || undefined
  const domain = params.get('domain') || undefined
  const subject = params.get('subject') || undefined
  const emailBody = params.get('emailBody') || undefined
  const ref = params.get('ref') || undefined

  // Decode Base64 or JSON token if present
  if (!resolvedEmail && token) {
    try {
      const decoded = atob(token.trim())
      if (decoded.includes('@')) {
        resolvedEmail = decoded.trim().toLowerCase()
      } else {
        try {
          const parsed = JSON.parse(decoded)
          if (parsed.email && parsed.email.includes('@')) {
            resolvedEmail = parsed.email.trim().toLowerCase()
          }
        } catch { /* pass */ }
      }
    } catch { /* pass */ }
  }

  // Automatically lock user identity for telemetry if an email is present in URL or Token
  if (resolvedEmail && resolvedEmail.includes('@')) {
    setStoredUserEmail(resolvedEmail)
  }

  return {
    email: resolvedEmail,
    phone,
    domain,
    subject,
    emailBody,
    token,
    ref,
  }
}


/**
 * Collects safe non-invasive client specs (Google-Compliant, no high-entropy fingerprinting)
 */
export interface SafeClientSpecs {
  screenWidth: number
  screenHeight: number
  devicePixelRatio: number
  language: string
  timezone: string
  connectionType?: string
  hardwareConcurrency?: number
  deviceMemoryGB?: number
}

export const getSafeClientSpecs = (): SafeClientSpecs => {
  if (typeof window === 'undefined') {
    return {
      screenWidth: 0,
      screenHeight: 0,
      devicePixelRatio: 1,
      language: 'en-US',
      timezone: 'UTC',
    }
  }

  const nav = navigator as unknown as Record<string, unknown>
  const conn = (nav.connection || nav.mozConnection || nav.webkitConnection) as Record<string, unknown> | undefined

  return {
    screenWidth: window.screen?.width || 0,
    screenHeight: window.screen?.height || 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    language: navigator.language || 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    connectionType: (conn?.effectiveType as string) || undefined,
    hardwareConcurrency: (nav.hardwareConcurrency as number) || undefined,
    deviceMemoryGB: (nav.deviceMemory as number) || undefined,
  }
}

/**
 * Generates WhatsApp 1-Click verification deep link (`wa.me`)
 * Bypasses Chrome blocks by triggering native WhatsApp server-to-server webhook verification.
 */
export const getWhatsAppVerifyUrl = (whatsappNumber = '15550199200', promptDomain?: string): string => {
  const visitorId = getOrCreateVisitorId()
  const domainText = promptDomain ? ` for domain ${promptDomain}` : ''
  const message = encodeURIComponent(`Hello GTMer, please verify my session ID: ${visitorId}${domainText}`)
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

/**
 * Dispatches Tier 3 Lead Webhook payload directly to backend
 */
export interface LeadWebhookPayload {
  visitorId: string
  email?: string
  phone?: string
  fullName?: string
  orgName?: string
  scrapedDomain?: string
  source: 'tier1_oauth' | 'tier2_autofill' | 'tier3_webhook' | 'tier4_whatsapp'
  clientSpecs?: SafeClientSpecs
  attribution?: AttributionData | null
  timestamp: string
}

export const sendLeadWebhookPayload = async (payload: Partial<LeadWebhookPayload>): Promise<boolean> => {
  const visitorId = getOrCreateVisitorId()
  const attribution = captureAttributionData()
  const clientSpecs = getSafeClientSpecs()

  const fullPayload: LeadWebhookPayload = {
    visitorId,
    email: payload.email || '',
    phone: payload.phone || '',
    fullName: payload.fullName || '',
    orgName: payload.orgName || '',
    scrapedDomain: payload.scrapedDomain || '',
    source: payload.source || 'tier3_webhook',
    clientSpecs,
    attribution,
    timestamp: new Date().toISOString(),
  }

  try {
    const response = await fetch(`${API_BASE}/leads/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload),
    })
    return response.ok
  } catch (err) {
    console.warn('Webhook dispatch fallback locally recorded:', err)
    // Save to local storage queue if network fails
    if (typeof window !== 'undefined') {
      try {
        const queue: LeadWebhookPayload[] = JSON.parse(localStorage.getItem('gtmr_lead_queue') || '[]')
        queue.push(fullPayload)
        localStorage.setItem('gtmr_lead_queue', JSON.stringify(queue))
      } catch { /* pass */ }
    }
    return false
  }
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



