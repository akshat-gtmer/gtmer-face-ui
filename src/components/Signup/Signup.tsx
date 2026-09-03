import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getScrapedLeadPayload, getOrCreateScrapeSessionId, getLocalDrafts, clearScrapeSession, type SavedEmailDraft } from '../../utils/cookieUtils'
import { IconArrowRight, IconMail, IconLock, IconUsers, IconGlobe, IconCheck } from '../Icons'
import styles from './Signup.module.css'

export const Signup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isSuccess = location.pathname === '/signup/success'
  const successEmail = location.state?.email || ''

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orgName: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scrapedDomain, setScrapedDomain] = useState<string | null>(null)
  const [attachedDraft, setAttachedDraft] = useState<SavedEmailDraft | null>(null)

  useEffect(() => {
    // Read scraped lead payload & URL search parameters
    const searchParams = new URLSearchParams(location.search)
    const domainFromUrl = searchParams.get('domain')
    const subjectFromUrl = searchParams.get('subject')
    const bodyFromUrl = searchParams.get('emailBody')
    const leadPayload = getScrapedLeadPayload()
    const drafts = getLocalDrafts()

    const domainToUse = domainFromUrl || leadPayload?.domain || (drafts[0]?.name) || null
    if (domainToUse) {
      setScrapedDomain(domainToUse)
    }

    if (subjectFromUrl && bodyFromUrl) {
      setAttachedDraft({
        email: `contact@${domainToUse || 'lead.com'}`,
        name: domainToUse || 'Lead',
        subject: subjectFromUrl,
        body: bodyFromUrl,
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
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validations
    if (!formData.fullName.trim()) return setError('Full name is required.')
    if (!formData.email.trim()) return setError('Email address is required.')
    if (!formData.orgName.trim()) return setError('Organization name is required.')
    if (formData.password.length < 8) return setError('Password must be at least 8 characters long.')

    setLoading(true)
    setError(null)

    const leadPayload = getScrapedLeadPayload()

    try {
      const response = await fetch('https://dev.gtmer.ai/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_name: formData.orgName.trim(),
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          scraped_lead: leadPayload || (scrapedDomain ? { domain: scrapedDomain } : null),
          saved_drafts: getLocalDrafts(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || 'Signup failed. Please try again.')
      }

      // Clear scrape session payload once successfully submitted
      clearScrapeSession()

      // Success -> navigate to success screen
      navigate('/signup/success', { state: { email: formData.email.trim() } })
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
            {!isSuccess ? (
              <>
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
                  <div className={styles.errorBox} role="alert">
                    <span>⚠️ {error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="orgName" className={styles.label}>
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
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.label}>
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
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
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
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
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
              </>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successBadge}>
                  <IconCheck size={28} />
                </div>
                <h2 className={styles.successTitle}>Verify Your Email</h2>
                <p className={styles.successDesc}>
                  We have sent a verification link to <strong>{successEmail || formData.email}</strong>.
                  Please click the link in the email to activate your account and log in.
                </p>
                <div className={styles.successActions}>
                  <a href={portalRedirectUrl} className={styles.successBtn}>
                    Go to Portal Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup
