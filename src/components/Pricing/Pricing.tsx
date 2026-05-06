import { Link } from 'react-router-dom'
import styles from './Pricing.module.css'



const TIERS = [
  {
    name: 'Starter',
    tagline: 'Launch your AI-powered outbound',
    desc: 'For early-stage teams starting with AI-powered outbound.',
    highlight: false,
    features: [
      '1 AI Agent (Scout)',
      'Up to 500 leads/month',
      '3 email sequences active',
      'Basic enrichment (10 fields)',
      'HubSpot or Pipedrive sync',
      'Email support',
      'Weekly performance reports',
    ],
  },
  {
    name: 'Growth',
    tagline: 'Scale your autonomous GTM',
    desc: 'For scaling teams that need full autonomous GTM.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      '4 AI Agents (Scout, Enricher, Writer, Sender)',
      'Up to 5,000 leads/month',
      'Unlimited email sequences',
      'Full enrichment (50+ fields)',
      'Salesforce, HubSpot, Pipedrive',
      'Intent signal monitoring',
      'Priority support + Slack channel',
      'Custom ICP configuration',
      'Real-time pipeline dashboard',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Custom-built for your org',
    desc: 'For organizations needing custom agents and dedicated support.',
    highlight: false,
    features: [
      '6+ AI Agents (including custom)',
      'Unlimited leads',
      'Custom agent development',
      'Dedicated data sources',
      'SOC 2 Type II compliance',
      'SSO / SAML authentication',
      'Dedicated success manager',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment option',
    ],
  },
]

const Pricing = () => {
  return (
    <article className={styles.page} aria-label="GTMer Pricing — AI SDR Agent Plans & Tiers">
      {/* Breadcrumb for crawlers */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">GTMer</a></li>
          <li aria-current="page">Pricing</li>
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
          <span>Flexible Plans</span>
        </div>
        <h1 className={styles.headline}>
          Built for Your
          <span className={styles.headlineAccent}> Scale.</span>
        </h1>
        <p className={styles.subtext}>
          Every team is different. We'll work with you to find the right plan — 
          tailored to your outreach volume, integrations, and growth goals.
        </p>
      </div>

      {/* Contact CTA Banner */}
      <div className={styles.contactBanner}>
        <div className={styles.contactBannerInner}>
          <div className={styles.contactBannerText}>
            <span className={styles.contactBannerIcon}>💬</span>
            <div>
              <p className={styles.contactBannerHeadline}>Get a Custom Quote</p>
              <p className={styles.contactBannerSub}>
                Talk to our team and we'll craft a plan that fits your pipeline goals and budget.
              </p>
            </div>
          </div>
          <a href="mailto:akshat@gtmer.ai" className={styles.contactBannerCta}>
            Contact Sales →
          </a>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className={styles.tiersGrid}>
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={`${styles.tierCard} ${tier.highlight ? styles.tierHighlight : ''}`}
          >
            {'badge' in tier && tier.badge && <div className={styles.tierBadge}>{tier.badge}</div>}
            <div className={styles.tierName}>{tier.name}</div>
            <div className={styles.tierTagline}>{tier.tagline}</div>
            <p className={styles.tierDesc}>{tier.desc}</p>

            <ul className={styles.featureList}>
              {tier.features.map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.featureCheck}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="mailto:akshat@gtmer.ai"
              className={`${styles.tierCta} ${tier.highlight ? styles.tierCtaHighlight : ''}`}
            >
              Get Pricing
            </a>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className={styles.bottomNote}>
        <p>We offer flexible billing — monthly, quarterly, and annual options available.</p>
        <p className={styles.bottomMuted}>
          Questions? Reach us at{' '}
          <a href="mailto:akshat@gtmer.ai" className={styles.bottomLink}>akshat@gtmer.ai</a>
        </p>
      </div>
    </article>
  )
}

export default Pricing
