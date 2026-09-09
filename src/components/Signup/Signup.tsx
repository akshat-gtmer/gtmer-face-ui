import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  getScrapedLeadPayload,
  getOrCreateScrapeSessionId,
  getLocalDrafts,
  clearScrapeSession,
  getOrCreateVisitorId,
  getUrlQueryParameters,
  getWhatsAppVerifyUrl,
  sendLeadWebhookPayload,
  setStoredUserEmail,
  type SavedEmailDraft,
} from '../../utils/cookieUtils'
import { setUserEmail } from '../../utils/telemetry'
import { API_BASE } from '../../config/api'

import { IconArrowRight, IconMail, IconLock, IconUsers, IconGlobe } from '../Icons'
import styles from './Signup.module.css'

export const Signup = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    orgName: '',
    companyUrl: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapedDomain, setScrapedDomain] = useState<string | null>(null)
  const [attachedDraft, setAttachedDraft] = useState<SavedEmailDraft | null>(null)
  const [showWebhookFallback, setShowWebhookFallback] = useState(false)
  const [webhookSubmitting, setWebhookSubmitting] = useState(false)
  const [webhookSent, setWebhookSent] = useState(false)

  useEffect(() => {
    if (location.pathname === '/signup/success') {
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])


  useEffect(() => {
    // Read scraped lead payload & URL search parameters (Magic Link Tokens)
    const urlParams = getUrlQueryParameters()
    const leadPayload = getScrapedLeadPayload()
    const drafts = getLocalDrafts()

    // URL Magic Link pre-fill support
    if (urlParams.email || urlParams.phone) {
      setFormData(prev => ({
        ...prev,
        email: urlParams.email || prev.email,
        phone: urlParams.phone || prev.phone,
        domain: urlParams.domain || prev.orgName,
      }))
    }

    const domainToUse = urlParams.domain || leadPayload?.domain || (drafts[0]?.name) || null
    if (domainToUse) {
      setScrapedDomain(domainToUse)
      setFormData(prev => ({
        ...prev,
        companyUrl: prev.companyUrl || (domainToUse.startsWith('http') ? domainToUse : `https://${domainToUse}`),
      }))
    }

    if (urlParams.subject && urlParams.emailBody) {
      setAttachedDraft({
        email: urlParams.email || `contact@${domainToUse || 'lead.com'}`,
        name: domainToUse || 'Lead',
        subject: urlParams.subject,
        body: urlParams.emailBody,
        status: 'draft',
        created_at: new Date().toISOString(),
      })
    } else if (drafts.length > 0) {
      setAttachedDraft(drafts[0])
    }

    const handleSync = () => {
      const updatedDrafts = getLocalDrafts()
      if (updatedDrafts.length > 0) {
        setAttachedDraft(updatedDrafts[0])
      }
    }

    window.addEventListener('gtmr_draft_created', handleSync)
    return () => window.removeEventListener('gtmr_draft_created', handleSync)
  }, [location])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'email' && !prev.companyUrl && value.includes('@')) {
        const domainPart = value.split('@')[1]?.toLowerCase()
        if (domainPart && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domainPart)) {
          next.companyUrl = `https://${domainPart}`
        }
      }
      return next
    })
    setError(null)
  }

  // Tier 3: Send Lead Webhook Fallback Payload
  const handleWebhookFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setWebhookSubmitting(true)
    if (formData.email) {
      setUserEmail(formData.email.trim())
    }
    const success = await sendLeadWebhookPayload({
      email: formData.email,
      phone: formData.phone,
      fullName: formData.fullName,
      orgName: formData.orgName,
      scrapedDomain: scrapedDomain || '',
      source: 'tier3_webhook',
    })
    setWebhookSubmitting(false)
    if (success || true) {
      setWebhookSent(true)
      setTimeout(() => {
        setShowWebhookFallback(false)
        setWebhookSent(false)
      }, 2500)
    }
  }

  // Tier 2: Submit Smart Autofill Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validations
    if (!formData.fullName.trim()) return setError('Full name is required.')
    if (!formData.email.trim()) return setError('Email address is required.')
    if (!formData.orgName.trim()) return setError('Organization name is required.')

    let normalizedCompanyUrl = (formData.companyUrl.trim() || scrapedDomain || '').trim()
    if (!normalizedCompanyUrl && formData.email.includes('@')) {
      const domainPart = formData.email.split('@')[1]?.toLowerCase()
      if (domainPart && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domainPart)) {
        normalizedCompanyUrl = domainPart
      }
    }
    if (!normalizedCompanyUrl) {
      return setError('Company website is mandatory to register your organization workspace.')
    }
    if (!normalizedCompanyUrl.startsWith('http://') && !normalizedCompanyUrl.startsWith('https://')) {
      normalizedCompanyUrl = `https://${normalizedCompanyUrl}`
    }

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long.')
    }

    setLoading(true)
    setError(null)
    setUserEmail(formData.email.trim())

    const visitorId = getOrCreateVisitorId()

    // 1. Immediately link visitor lead with phone and company details
    fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: visitorId,
        email: formData.email.trim(),
        name: formData.fullName.trim(),
        fullName: formData.fullName.trim(),
        company: formData.orgName.trim(),
        orgName: formData.orgName.trim(),
        companyUrl: normalizedCompanyUrl || undefined,
        phone: formData.phone.trim() || undefined,
        source: 'signup_form',
      }),
    }).catch(() => { /* non-blocking */ })

    // Persist identity into localStorage so success screen and subsequent sessions retain it
    setStoredUserEmail(formData.email.trim())
    if (typeof window !== 'undefined') {
      localStorage.setItem('gtmer_user_name', formData.fullName.trim())
      localStorage.setItem('gtmer_user_org', formData.orgName.trim())
      if (formData.phone.trim()) {
        localStorage.setItem('gtmer_user_phone', formData.phone.trim())
      }
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_name: formData.orgName.trim(),
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          company_url: normalizedCompanyUrl,
          password: formData.password,
          saved_drafts: getLocalDrafts(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg =
          typeof errorData.detail === 'string'
            ? errorData.detail
            : Array.isArray(errorData.detail)
            ? errorData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ')
            : errorData.message || 'Signup request failed. Please try again.'

        // For user/validation conflicts (400, 409, 422), render cleanly without popup modal
        if (response.status === 409 || errorMsg.toLowerCase().includes('already registered') || errorMsg.toLowerCase().includes('already taken')) {
          throw new Error(`${errorMsg}. Please sign in to your existing account.`)
        }
        if (response.status === 400 || response.status === 422) {
          throw new Error(errorMsg)
        }

        throw new Error(errorMsg || 'Server encountered an error processing registration. Please try again.')
      }

      // Clear scrape session payload once successfully submitted
      clearScrapeSession()

      // Success -> redirect directly to faceui
      navigate('/', { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  const leadPayload = getScrapedLeadPayload()
  const activeDomain = scrapedDomain || leadPayload?.domain || null
  const sessionId = leadPayload?.sessionId || getOrCreateScrapeSessionId()
  const whatsappUrl = getWhatsAppVerifyUrl('15550199200', activeDomain || undefined)

  const portalRedirectUrl = activeDomain
    ? `https://dev.gtmer.ai/login?session_id=${encodeURIComponent(sessionId)}&domain=${encodeURIComponent(activeDomain)}&companyName=${encodeURIComponent(leadPayload?.companyName || '')}&industry=${encodeURIComponent(leadPayload?.primaryIndustry || '')}&action=claim_lead&redirect=/dashboard`
    : `https://dev.gtmer.ai/login?session_id=${encodeURIComponent(sessionId)}&redirect=/dashboard`

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Technical Back Button */}
        <Link to="/" className={styles.backLink}>
          ← Back to /gtmer
        </Link>

        {/* Window Container */}
        <div className={styles.signupWindow}>
          {/* Header Bar */}
          <div className={styles.windowHeader}>
            <div className={styles.windowDot} />
            <div className={styles.windowDot} />
            <div className={styles.windowDot} />
            <span className={styles.windowTitle}>gtmer / account-registration</span>
          </div>

          <div className={styles.windowBody}>
            <div className={styles.headerText}>
                  <h1 className={styles.title}>Start Automating Outbound</h1>
                  <p className={styles.subtitle}>
                    Create your GTMer workspace to deploy autonomous AI agents, automate prospect research, and generate hyper-personalized sales campaigns.
                  </p>
                  {(scrapedDomain || attachedDraft) && (
                    <div style={{ marginTop: '10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '10px 14px', fontSize: '0.82rem', color: '#92400e' }}>
                      ⚡ <strong>Scraped Lead & Customized Email Draft Attached:</strong> Registering will automatically import <strong>{scrapedDomain || attachedDraft?.name}</strong> with your customized email subject: <em>"{attachedDraft?.subject || leadPayload?.generatedSubject || `Partnership Idea for ${scrapedDomain}`}"</em>!
                    </div>
                  )}
                </div>

                {error && (
                  <div className={styles.errorAlert} role="alert">
                    <span>⚠️ {error}</span>
                  </div>
                )}

                {/* Google One-Tap / SSO Sign Up Button */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'https://gtmer.ai/auth/callback'
                      window.location.href = `https://dev.gtmer.ai/api/v1/oauth/login/google?redirect_url=${encodeURIComponent(redirectUrl)}`
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.borderColor = '#9ca3af'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  </div>
                </div>

                {/* TIER 2: SMART AUTOFILL FORM */}
                <form onSubmit={handleSubmit} className={styles.form}>

                  <div className={styles.inputGroup}>
                    <label htmlFor="orgName" className={styles.inputLabel}>
                      Organization / Company Name
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconGlobe className={styles.inputIcon} size={16} />
                      <input
                        type="text"
                        id="orgName"
                        name="orgName"
                        value={formData.orgName}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className={styles.input}
                        autoComplete="organization"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="companyUrl" className={styles.inputLabel}>
                      Company Website URL
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconGlobe className={styles.inputIcon} size={16} />
                      <input
                        type="text"
                        id="companyUrl"
                        name="companyUrl"
                        value={formData.companyUrl}
                        onChange={handleChange}
                        placeholder="acme.com or https://acme.com"
                        className={styles.input}
                        autoComplete="url"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="fullName" className={styles.inputLabel}>
                      Full Name
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconUsers className={styles.inputIcon} size={16} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Alex Morgan"
                        className={styles.input}
                        autoComplete="name"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.inputLabel}>
                      Work Email Address
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconMail className={styles.inputIcon} size={16} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@acme.com"
                        className={styles.input}
                        autoComplete="email"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.inputLabel}>
                      Phone Number (Optional)
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconUsers className={styles.inputIcon} size={16} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className={styles.input}
                        autoComplete="tel"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.inputLabel}>
                      Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconLock className={styles.inputIcon} size={16} />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={styles.input}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                      />
                    </div>
                    <span className={styles.helpText}>Minimum 8 characters</span>
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Start Automating'}
                    {!loading && <IconArrowRight className={styles.btnArrow} size={14} />}
                  </button>
                </form>

                <p className={styles.footerNote}>
                  Already have an account?{' '}
                  <a href={portalRedirectUrl} className={styles.loginLink}>
                    Sign in here
                  </a>
                </p>
          </div>
        </div>
      </div>

      {/* TIER 3: THIRD-PARTY WEBHOOK FALLBACK MODAL */}
      {showWebhookFallback && (
        <div className={styles.webhookOverlay}>
          <div className={styles.webhookModal}>
            <div className={styles.webhookModalHeader}>
              <h3 className={styles.webhookModalTitle}>⚡ Quick Demo Request</h3>
              <button onClick={() => setShowWebhookFallback(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>
            <p className={styles.webhookModalDesc}>
              Having trouble registering? Send your email directly via our instant lead webhook to claim your workspace.
            </p>
            {webhookSent ? (
              <div style={{ padding: '12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', textAlign: 'center', fontSize: '0.85rem' }}>
                ✅ Webhook Dispatched! Our team will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleWebhookFallbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" className={styles.webhookSubmitBtn} disabled={webhookSubmitting}>
                  {webhookSubmitting ? 'Sending Webhook...' : 'Request Instant Webhook Demo'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Signup

