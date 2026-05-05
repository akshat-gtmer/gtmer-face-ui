import { Link } from 'react-router-dom'
import styles from './Security.module.css'



const SECURITY_FEATURES = [
  {
    icon: '🔒', title: 'End-to-End Encryption',
    desc: 'All data encrypted at rest (AES-256) and in transit (TLS 1.3). Zero plaintext storage of credentials or PII.',
  },
  {
    icon: '🏢', title: 'Tenant Isolation',
    desc: 'Every client operates in a fully isolated data environment. No shared databases, no cross-tenant data leakage.',
  },
  {
    icon: '✅', title: 'SOC 2 Type II',
    desc: 'Annual SOC 2 Type II audits covering security, availability, and confidentiality. Reports available on request.',
  },
  {
    icon: '🔑', title: 'SSO / SAML',
    desc: 'Enterprise SSO support via SAML 2.0 and OpenID Connect. Integrate with Okta, Azure AD, Google Workspace.',
  },
  {
    icon: '📋', title: 'GDPR Compliant',
    desc: 'Full GDPR compliance with data processing agreements, right to deletion, and consent management built in.',
  },
  {
    icon: '🛡', title: 'Access Controls',
    desc: 'Role-based access control (RBAC) with audit logging. Every action is tracked and attributable.',
  },
]

const PRACTICES = [
  'Vulnerability scanning and penetration testing quarterly',
  'Automated dependency security scanning in CI/CD',
  'Employee security training and background checks',
  'Incident response plan with 1-hour SLA for critical issues',
  'Data retention policies with configurable TTL per client',
  '99.9% uptime SLA with real-time status monitoring',
]

const Security = () => {
  return (
    <article className={styles.page} aria-label="GTMer Security — Enterprise-Grade Data Protection">
      {/* Breadcrumb for crawlers */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">GTMer</a></li>
          <li aria-current="page">Security</li>
        </ol>
      </nav>
      <div className={styles.backBar}>
        <Link to="/" className={styles.backButton}>
          <span className={styles.backArrow}>←</span>
          Back to <span className={styles.backSlash}>/</span>gtmer
        </Link>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Enterprise-Grade Security</span>
        </div>
        <h1 className={styles.headline}>
          Your Data Is
          <span className={styles.headlineAccent}> Non-Negotiable.</span>
        </h1>
        <p className={styles.subtext}>
          We handle sensitive prospect data every day. Security isn't a feature —
          it's the foundation everything else is built on.
        </p>
      </div>

      {/* Feature grid */}
      <div className={styles.featuresGrid}>
        {SECURITY_FEATURES.map(f => (
          <div key={f.title} className={styles.featureCard}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Practices */}
      <div className={styles.practicesSection}>
        <h3 className={styles.practicesHeadline}>Security Practices</h3>
        <ul className={styles.practicesList}>
          {PRACTICES.map(p => (
            <li key={p} className={styles.practiceItem}>
              <span className={styles.practiceCheck}>✓</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Trust banner */}
      <div className={styles.trustBanner}>
        <div className={styles.trustText}>
          Need our SOC 2 report, DPA, or security questionnaire?
        </div>
        <a href="mailto:akshat@gtmer.ai?subject=Security%20Documentation%20Request" className={styles.trustCta}>
          Request Documentation →
        </a>
      </div>
    </article>
  )
}

export default Security
