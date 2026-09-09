export interface CookieConsentState {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  consentStatus: 'accepted_all' | 'rejected_all' | 'custom' | 'not_set'
  timestamp: string
}

const CONSENT_STORAGE_KEY = 'gtmer_cookie_consent'

export const getDefaultConsent = (): CookieConsentState => ({
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  consentStatus: 'not_set',
  timestamp: new Date().toISOString(),
})

export const getStoredConsent = (): CookieConsentState => {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return getDefaultConsent()
    return JSON.parse(raw) as CookieConsentState
  } catch (e) {
    return getDefaultConsent()
  }
}

export const saveConsent = (consent: Partial<CookieConsentState>): CookieConsentState => {
  const current = getStoredConsent()
  const updated: CookieConsentState = {
    ...current,
    ...consent,
    essential: true,
    timestamp: new Date().toISOString(),
  }

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated))

  // Dispatch custom event so components update immediately
  window.dispatchEvent(new CustomEvent('gtmer_consent_updated', { detail: updated }))

  // Sync choice with backend API
  let visitorId = localStorage.getItem('gtmer_visitor_id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('gtmer_visitor_id', visitorId)
  }

  fetch('https://dev.gtmer.ai/api/v1/consent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      essential: updated.essential,
      functional: updated.functional,
      analytics: updated.analytics,
      marketing: updated.marketing,
      consentStatus: updated.consentStatus,
    }),
  }).catch((err) => console.error('[Consent Sync Error]', err))

  return updated
}

export const acceptAllConsent = (): CookieConsentState => {
  return saveConsent({
    essential: true,
    functional: true,
    analytics: true,
    marketing: true,
    consentStatus: 'accepted_all',
  })
}

export const rejectAllConsent = (): CookieConsentState => {
  return saveConsent({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    consentStatus: 'rejected_all',
  })
}


// ─── Functional Preferences (gated by functional consent) ───

const FUNCTIONAL_PREFS_KEY = 'gtmer_functional_prefs'

export interface FunctionalPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
}

const getDefaultPrefs = (): FunctionalPreferences => ({
  theme: 'system',
  language: navigator.language || 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
})

/**
 * Save a functional preference (only if functional consent is granted)
 */
export const saveFunctionalPref = (key: keyof FunctionalPreferences, value: string): boolean => {
  const consent = getStoredConsent()
  if (!consent.functional) {
    console.warn('[Functional Prefs] Blocked: functional consent not granted')
    return false
  }

  const prefs = getFunctionalPrefs()
  ;(prefs as any)[key] = value
  localStorage.setItem(FUNCTIONAL_PREFS_KEY, JSON.stringify(prefs))
  return true
}

/**
 * Get stored functional preferences (returns defaults if consent not granted)
 */
export const getFunctionalPrefs = (): FunctionalPreferences => {
  const consent = getStoredConsent()
  if (!consent.functional) return getDefaultPrefs()

  try {
    const raw = localStorage.getItem(FUNCTIONAL_PREFS_KEY)
    if (!raw) return getDefaultPrefs()
    return { ...getDefaultPrefs(), ...JSON.parse(raw) }
  } catch {
    return getDefaultPrefs()
  }
}

/**
 * Clear functional preferences (called when consent is revoked)
 */
export const clearFunctionalPrefs = (): void => {
  localStorage.removeItem(FUNCTIONAL_PREFS_KEY)
}
