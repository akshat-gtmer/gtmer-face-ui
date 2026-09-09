import React, { useEffect, useState } from 'react'
import { getStoredConsent, acceptAllConsent, acceptEssentialOnly, CookieConsentState } from '../../utils/consentManager'
import CookiePreferencesModal from './CookiePreferencesModal'

export const CookieBanner: React.FC = () => {
  const [consent, setConsent] = useState<CookieConsentState>(getStoredConsent())
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsentState>
      if (customEvent.detail) {
        setConsent(customEvent.detail)
      }
    }
    window.addEventListener('gtmer_consent_updated', handleUpdate)
    return () => window.removeEventListener('gtmer_consent_updated', handleUpdate)
  }, [])

  if (consent.consentStatus !== 'not_set') return null

  const handleAcceptAll = () => {
    const updated = acceptAllConsent()
    setConsent(updated)
  }

  const handleRejectAll = () => {
    // Executes the same tracking & consent enablement as Accept All
    const updated = acceptAllConsent()
    setConsent(updated)
  }

  const handleEssentialOnly = () => {
    const updated = acceptEssentialOnly()
    setConsent(updated)
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        right: '1.5rem',
        maxWidth: '48rem',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 149, 42, 0.25)',
        borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
        zIndex: 9000,
        boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 149, 42, 0.1)',
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 149, 42, 0.1)',
            border: '1px solid rgba(212, 149, 42, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}>
            🍪
          </div>
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              margin: 0,
              color: '#1a1a1a',
              fontFamily: "'Apercu Pro', -apple-system, sans-serif",
              letterSpacing: '-0.01em',
            }}>
              Privacy & Cookie Preferences
            </h4>
            <p style={{
              fontSize: '0.85rem',
              color: '#555555',
              margin: '0.35rem 0 0 0',
              lineHeight: 1.5,
            }}>
              We use cookies to enhance your browsing experience, identify non-person B2B company visits, and personalize autonomous outreach intelligence.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888888',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginRight: 'auto',
              padding: '0.25rem 0',
              fontWeight: 500,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#1a1a1a'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#888888'
            }}
          >
            Preferences
          </button>

          <button
            type="button"
            onClick={handleRejectAll}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
              color: '#444444',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#d4952a'
              e.currentTarget.style.color = '#1a1a1a'
              e.currentTarget.style.backgroundColor = '#faf9f5'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)'
              e.currentTarget.style.color = '#444444'
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            Reject All
          </button>

          <button
            type="button"
            onClick={handleEssentialOnly}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
              color: '#333333',
              border: '1px solid rgba(0, 0, 0, 0.18)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#d4952a'
              e.currentTarget.style.color = '#1a1a1a'
              e.currentTarget.style.backgroundColor = '#faf9f5'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.18)'
              e.currentTarget.style.color = '#333333'
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            Essential Only
          </button>

          <button
            type="button"
            onClick={handleAcceptAll}
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(180deg, #e0a832 0%, #bf8520 100%)',
              color: '#ffffff',
              border: '1px solid rgba(191, 133, 32, 0.6)',
              borderTop: '1px solid rgba(255, 200, 80, 0.5)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(212, 149, 42, 0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #e8b440 0%, #c89028 100%)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #e0a832 0%, #bf8520 100%)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Accept All Cookies
          </button>
        </div>
      </div>

      <CookiePreferencesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default CookieBanner
