import React, { useState } from 'react'
import { getStoredConsent, saveConsent } from '../../utils/consentManager'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const CookiePreferencesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const current = getStoredConsent()
  const [functional, setFunctional] = useState(current.functional)
  const [analytics, setAnalytics] = useState(current.analytics)
  const [marketing, setMarketing] = useState(current.marketing)

  if (!isOpen) return null

  const handleSave = () => {
    saveConsent({
      essential: true,
      functional,
      analytics,
      marketing,
      consentStatus: 'custom',
    })
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '1rem',
        maxWidth: '36rem',
        width: '100%',
        padding: '1.75rem',
        color: '#1a1a1a',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🛡️</span>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1a1a1a',
              margin: 0,
              fontFamily: "'Apercu Pro', -apple-system, sans-serif",
            }}>
              Cookie & Privacy Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#999999',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <p style={{ color: '#666666', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Customize your privacy preferences below. Essential cookies are required to deliver core functionality, security, and session management.
        </p>

        {/* Category List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1rem',
            backgroundColor: '#faf9f5',
            borderRadius: '0.6rem',
            border: '1px solid rgba(0, 0, 0, 0.04)',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>Essential Cookies</div>
              <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.15rem' }}>Required for secure site navigation and basic operation. Always active.</div>
            </div>
            <input
              type="checkbox"
              checked
              disabled
              style={{ width: '1.2rem', height: '1.2rem', accentColor: '#d4952a' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1rem',
            backgroundColor: '#faf9f5',
            borderRadius: '0.6rem',
            border: '1px solid rgba(0, 0, 0, 0.04)',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>Functional Preferences</div>
              <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.15rem' }}>Saves theme and language personalization choices.</div>
            </div>
            <input
              type="checkbox"
              checked={functional}
              onChange={(e) => setFunctional(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem', accentColor: '#d4952a', cursor: 'pointer' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1rem',
            backgroundColor: '#faf9f5',
            borderRadius: '0.6rem',
            border: '1px solid rgba(0, 0, 0, 0.04)',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>Analytics & Intelligence</div>
              <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.15rem' }}>Allows B2B company identification, UTM analytics & pageview metrics.</div>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem', accentColor: '#d4952a', cursor: 'pointer' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1rem',
            backgroundColor: '#faf9f5',
            borderRadius: '0.6rem',
            border: '1px solid rgba(0, 0, 0, 0.04)',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>Marketing & Campaign Attribution</div>
              <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.15rem' }}>Used to attribute Google Search and campaign conversions.</div>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem', accentColor: '#d4952a', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
              color: '#555555',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
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
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookiePreferencesModal
