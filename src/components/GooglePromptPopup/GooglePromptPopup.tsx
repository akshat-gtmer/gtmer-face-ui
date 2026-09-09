import { useState, useEffect } from 'react'
import { getOrCreateVisitorId, getScrapedLeadPayload, getCookie, setCookie } from '../../utils/cookieUtils'
import styles from './GooglePromptPopup.module.css'

export const GooglePromptPopup = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Permanent check across all sessions/reloads: LocalStorage + 365-day Cookie
    const isDismissedLocal = typeof window !== 'undefined' ? localStorage.getItem('gtmr_google_popup_dismissed') : null
    const isDismissedCookie = getCookie('gtmr_google_popup_dismissed')
    if (isDismissedLocal === 'true' || isDismissedCookie === 'true') return

    // Trigger popup after 30 seconds (30,000 ms)
    const timer = setTimeout(() => {
      setVisible(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    // Save permanent dismissal in both LocalStorage & 1-Year Cookie
    try {
      localStorage.setItem('gtmr_google_popup_dismissed', 'true')
    } catch {
      /* pass */
    }
    setCookie('gtmr_google_popup_dismissed', 'true', 365)
  }

  const handleGoogleSignIn = () => {
    const visitorId = getOrCreateVisitorId()
    const leadPayload = getScrapedLeadPayload()
    const targetDomain = leadPayload?.domain || ''
    const apiBase = 'https://dev.gtmer.ai'
    window.location.href = `${apiBase}/api/v1/auth/google?visitor_id=${encodeURIComponent(visitorId)}&domain=${encodeURIComponent(targetDomain)}`
  }


  if (!visible) return null

  return (
    <div className={styles.popupCard} role="dialog" aria-label="Sign in with Google prompt">
      <div className={styles.header}>
        <div className={styles.brandInfo}>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandName}>gtmer</span>
        </div>
        <button onClick={handleDismiss} className={styles.closeBtn} aria-label="Close prompt">
          ✕
        </button>
      </div>

      <div className={styles.body}>
        <h4 className={styles.title}>Continue with Google</h4>
        <p className={styles.subtitle}>
          Sign in instantly to automate prospect research & AI outbound campaigns.
        </p>

        <button type="button" onClick={handleGoogleSignIn} className={styles.googleButton}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className={styles.footer}>
        <span>Secure 1-Click Authentication</span>
      </div>
    </div>
  )
}

export default GooglePromptPopup
