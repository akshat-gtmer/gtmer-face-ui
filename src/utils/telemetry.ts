import { getStoredConsent } from './consentManager'
import { setStoredUserEmail } from './cookieUtils'
import { API_BASE } from '../config/api'

/**
 * Get or create persistent visitor ID
 */
const getVisitorId = (): string => {
  let id = localStorage.getItem('gtmer_visitor_id')
  if (!id) {
    id = 'anon_usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7)
    localStorage.setItem('gtmer_visitor_id', id)
  }
  return id
}

/**
 * Get or create session ID (per browser tab session)
 */
const getSessionId = (): string => {
  let id = sessionStorage.getItem('gtmer_session_id')
  if (!id) {
    id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7)
    sessionStorage.setItem('gtmer_session_id', id)
  }
  return id
}

/**
 * Send a single telemetry event to the backend
 */
export const sendTelemetryEvent = (
  eventType: string,
  pagePath: string,
  eventData?: Record<string, any>
) => {
  const consent = getStoredConsent()

  // Essential tracking (pageview and click events) is always permitted under essential consent
  const isEssentialTracking = eventType === 'pageview' || eventType === 'click'
  if (!isEssentialTracking && !consent.analytics && consent.consentStatus !== 'not_set') {
    console.warn('[Telemetry Dropped] Optional telemetry consent not granted.')
    return
  }

  const visitorId = getVisitorId()
  const sessionId = getSessionId()

  const payload = {
    visitorId,
    sessionId,
    eventType,
    pagePath: pagePath || window.location.pathname,
    pageTitle: document.title,
    eventData: eventData || {},
  }

  console.log(`[Telemetry] Sending ${eventType} event for ${pagePath}`)

  fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) console.error('[Telemetry] Server returned', res.status)
      else console.log(`[Telemetry] ${eventType} event recorded successfully`)
    })
    .catch((err) => console.error('[Telemetry Error]', err))
}

/**
 * Track a pageview event — call on every route change
 */
export const trackPageView = (path?: string, pageTitle?: string) => {
  const pagePath = path || window.location.pathname
  sendTelemetryEvent('pageview', pagePath, {
    url: window.location.href,
    referrer: document.referrer,
    pageTitle: pageTitle || document.title,
  })
}

/**
 * Track a button/CTA click event
 */
export const trackClick = (buttonText: string, buttonId?: string, targetUrl?: string) => {
  sendTelemetryEvent('click', window.location.pathname, {
    buttonText,
    buttonId: buttonId || '',
    targetUrl: targetUrl || '',
  })
}

/**
 * Track button/action click with pagePath support (alias for backward compatibility with TelemetryTracker)
 */
export const trackButtonClick = (
  buttonText: string,
  buttonId?: string,
  pagePath?: string,
  targetUrl?: string
) => {
  sendTelemetryEvent('click', pagePath || window.location.pathname, {
    buttonText,
    buttonId: buttonId || '',
    targetUrl: targetUrl || '',
  })
}

/**
 * Record and persist identified user email
 */
export const setUserEmail = (email: string): void => {
  if (!email) return
  try {
    setStoredUserEmail(email)
  } catch (err) {
    console.error('[Telemetry] Error setting user email', err)
  }
}

/**
 * Initialize telemetry: session init, automatic pageview tracking, and global click listener
 */
let _telemetryInitialized = false

export const initTelemetry = () => {
  if (typeof window === 'undefined') return
  if (_telemetryInitialized) return
  _telemetryInitialized = true

  const visitorId = getVisitorId()
  const sessionId = getSessionId()

  // 1. Register session on backend
  fetch(`${API_BASE}/visitor/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      sessionId,
      landingPage: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      browser: getBrowserName(),
      operatingSystem: getOSName(),
      ...getUtmParams(),
      referrerSource: classifyReferrer(document.referrer),
    }),
  })
    .then(() => console.log('[Telemetry] Session initialized'))
    .catch(() => {})

  // 2. Track initial pageview
  trackPageView()

  // 3. Listen for SPA route changes (popstate + pushState/replaceState)
  let lastPath = window.location.pathname
  const checkRouteChange = () => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname
      trackPageView(lastPath)
    }
  }

  window.addEventListener('popstate', checkRouteChange)

  // Intercept pushState and replaceState for SPA navigation
  const originalPushState = history.pushState.bind(history)
  const originalReplaceState = history.replaceState.bind(history)

  history.pushState = function (data: unknown, unused: string, url?: string | URL | null) {
    originalPushState(data, unused, url)
    setTimeout(checkRouteChange, 50)
  }
  history.replaceState = function (data: unknown, unused: string, url?: string | URL | null) {
    originalReplaceState(data, unused, url)
    setTimeout(checkRouteChange, 50)
  }

  // 4. Global click listener for buttons, links, and CTA elements
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target) return

    // Find the closest interactive element
    const clickable = target.closest('button, a, [data-track], [role="button"]') as HTMLElement | null
    if (!clickable) return

    const consent = getStoredConsent()
    if (!consent.essential && !consent.analytics && consent.consentStatus !== 'not_set') return

    const buttonText = clickable.textContent?.trim().substring(0, 100) || ''
    const buttonId = clickable.id || clickable.getAttribute('data-track') || ''
    const targetUrl = (clickable as HTMLAnchorElement).href || ''

    // Skip empty or close/dismiss button noise (e.g. "×", "x", "close", "dismiss")
    if (buttonText.length === 0) return

    const lowerText = buttonText.toLowerCase()
    const isCloseButton = (
      buttonText === '×' ||
      buttonText === '✕' ||
      buttonText === '✖' ||
      buttonText === '&times;' ||
      lowerText === 'x' ||
      lowerText === 'close' ||
      lowerText === 'dismiss' ||
      clickable.getAttribute('aria-label')?.toLowerCase() === 'close' ||
      clickable.getAttribute('title')?.toLowerCase() === 'dismiss' ||
      clickable.hasAttribute('data-no-track')
    )

    if (isCloseButton) return

    trackClick(buttonText, buttonId, targetUrl)
  })

  console.log('[Telemetry] Fully initialized: session, pageview tracking, click tracking')
}

/**
 * Parse UTM parameters from current URL
 */
function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  const mapping: Record<string, string> = {
    utm_source: 'utmSource',
    utm_medium: 'utmMedium',
    utm_campaign: 'utmCampaign',
    utm_term: 'utmTerm',
    utm_content: 'utmContent',
  }
  for (const [param, key] of Object.entries(mapping)) {
    const val = params.get(param)
    if (val) utm[key] = val
  }
  return utm
}

/**
 * Classify referrer source (Google Search, Social, Direct, etc.)
 */
function classifyReferrer(referrer: string): string {
  if (!referrer) return 'direct'
  const r = referrer.toLowerCase()
  if (r.includes('google.com/search') || r.includes('google.co.') || (r.includes('google.') && !r.includes('googleads'))) return 'google_search'
  if (r.includes('bing.com')) return 'bing_search'
  if (r.includes('yahoo.com')) return 'yahoo_search'
  if (r.includes('duckduckgo.com')) return 'duckduckgo_search'
  if (r.includes('linkedin.com')) return 'linkedin'
  if (r.includes('twitter.com') || r.includes('x.com')) return 'twitter'
  if (r.includes('facebook.com') || r.includes('fb.com')) return 'facebook'
  if (r.includes('instagram.com')) return 'instagram'
  if (r.includes('youtube.com')) return 'youtube'
  if (r.includes('reddit.com')) return 'reddit'
  if (r.includes('github.com')) return 'github'
  if (r.includes('producthunt.com')) return 'producthunt'
  return 'referral'
}

function getBrowserName(): string {
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  return 'Other'
}

function getOSName(): string {
  const ua = navigator.userAgent
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac OS')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return 'Other'
}
