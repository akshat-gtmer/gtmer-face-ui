import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getOrCreateVisitorId, setCookie } from '../../utils/cookieUtils'
import { API_BASE } from '../../config/api'

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [statusText, setStatusText] = useState('Completing Google Sign-In...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const errParam = searchParams.get('error')

    if (errParam) {
      setError(`Authentication failed: ${errParam}`)
      setStatusText('Authentication Error')
      return
    }

    if (accessToken) {
      // 1. Store JWT Tokens in LocalStorage & Cookies
      localStorage.setItem('gtmer_access_token', accessToken)
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('token', accessToken)
      setCookie('gtmer_access_token', accessToken, 30)
      setCookie('access_token', accessToken, 30)

      if (refreshToken) {
        localStorage.setItem('gtmer_refresh_token', refreshToken)
        localStorage.setItem('refresh_token', refreshToken)
        setCookie('gtmer_refresh_token', refreshToken, 30)
        setCookie('refresh_token', refreshToken, 30)
      }

      // 2. Link Visitor ID with Auth Session
      const visitorId = getOrCreateVisitorId()

      // Helper to associate verified email with VisitorLead
      const linkVisitorLead = (email: string, name: string) => {
        if (!email || !email.includes('@')) return
        fetch(`${API_BASE}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            email,
            name: name || '',
            source: 'google_login',
          }),
        }).catch((leadErr) => {
          console.warn('[AuthCallback] Non-blocking lead association notice:', leadErr)
        })
      }

      // 3. Extract Google email & name from JWT or /auth/me profile
      let tokenEmail = ''
      let tokenName = ''
      try {
        const payloadBase64 = accessToken.split('.')[1]
        if (payloadBase64) {
          const jsonPayload = decodeURIComponent(
            atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
          const data = JSON.parse(jsonPayload)
          // Strictly ensure email has an '@' symbol and never fallback to UUID (sub)
          if (data.email && typeof data.email === 'string' && data.email.includes('@')) {
            tokenEmail = data.email
          }
          tokenName = data.name || data.full_name || ''

          if (tokenEmail) {
            localStorage.setItem('gtmer_user_email', tokenEmail)
            setCookie('gtmer_user_email', tokenEmail, 30)
            if (tokenName) localStorage.setItem('gtmer_user_name', tokenName)
            linkVisitorLead(tokenEmail, tokenName)
          }
        }
      } catch (err) {
        console.warn('[AuthCallback] Failed to parse access token:', err)
      }

      // Fetch authentic user profile from /auth/me for guaranteed accuracy
      fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json()
          return null
        })
        .then((profile) => {
          if (profile && profile.email && profile.email.includes('@')) {
            const verifiedEmail = profile.email
            const verifiedName = profile.full_name || tokenName
            localStorage.setItem('gtmer_user_email', verifiedEmail)
            setCookie('gtmer_user_email', verifiedEmail, 30)
            if (verifiedName) localStorage.setItem('gtmer_user_name', verifiedName)
            if (!tokenEmail) {
              linkVisitorLead(verifiedEmail, verifiedName)
            }
          }
        })
        .catch((err) => {
          console.warn('[AuthCallback] Could not retrieve profile from /auth/me:', err)
        })

      // 4. Dispatch auth event so UI components refresh immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('gtmer_auth_changed'))
      }

      // 5. Mark auth status and redirect directly to face-ui
      setStatusText('Signed in successfully! Redirecting to GTMer...')
      setTimeout(() => {
        navigate('/', {
          replace: true,
        })
      }, 400)
    } else {
      setError('No authentication token received.')
      setStatusText('Authentication failed')
    }
  }, [searchParams, navigate])

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#131b2e',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
      }}>
        {/* Google Icon Animation */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {error ? 'Google Sign-In Error' : 'Google Authentication'}
        </h3>

        <p style={{ fontSize: '0.875rem', color: error ? '#f87171' : '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          {error || statusText}
        </p>

        {error ? (
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '0.6rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Back to Sign Up
          </button>
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
        )}
      </div>
    </div>
  )
}

export default AuthCallback
