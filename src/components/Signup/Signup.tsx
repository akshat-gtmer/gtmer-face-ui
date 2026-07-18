import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowRight, IconMail, IconLock, IconUsers, IconGlobe, IconCheck } from '../Icons'
import styles from './Signup.module.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orgName: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

    try {
      const response = await fetch('https://app.gtmer.ai/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_name: formData.orgName.trim(),
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed. Please try again.')
      }

      // Success
      setSuccess(true)

      // GTM Conversion tracking push
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'signup_complete',
          method: 'email',
        })
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Technical Back Button */}
        <Link to="/" className={styles.backLink}>
          ← Back to /gtmer
        </Link>

        <div className={styles.signupWindow}>
          {/* Window Chrome Header */}
          <div className={styles.windowHeader}>
            <div className={styles.windowDot} />
            <div className={styles.windowDot} />
            <div className={styles.windowDot} />
            <span className={styles.windowTitle}>gtmer / register-account</span>
            <span className={styles.windowStatus}>● secure</span>
          </div>

          <div className={styles.windowBody}>
            {!success ? (
              <>
                <div className={styles.headerText}>
                  <h1 className={styles.title}>Create Your Account</h1>
                  <p className={styles.subtitle}>
                    Start deploying autonomous AI SDR agents to automate your outbound GTM pipeline.
                  </p>
                </div>

                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
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
                        placeholder="John Doe"
                        className={styles.input}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.inputLabel}>
                      Work Email
                    </label>
                    <div className={styles.inputWrapper}>
                      <IconMail className={styles.inputIcon} size={16} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className={styles.input}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="orgName" className={styles.inputLabel}>
                      Organization Name
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
                  <a href="https://app.gtmer.ai" className={styles.loginLink}>
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
                  We have sent a verification link to <strong>{formData.email}</strong>. 
                  Please click the link in the email to activate your account and log in.
                </p>
                <div className={styles.successActions}>
                  <a href="https://app.gtmer.ai" className={styles.successBtn}>
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
