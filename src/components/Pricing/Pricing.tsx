import { Link } from 'react-router-dom'
import styles from './Pricing.module.css'



const TIERS = [
  {
    name: 'Starter',
    price: '$499',
    period: '/month',
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
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: '$1,499',
    period: '/month',
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
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
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
    cta: 'Contact Sales',
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
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className={styles.headline}>
          Plans That Scale
          <span className={styles.headlineAccent}> With You.</span>
        </h1>
        <p className={styles.subtext}>
          Start small, grow fast. Every plan includes AI-powered prospecting,
          enrichment, and outreach — no hidden fees.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className={styles.tiersGrid}>
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={`${styles.tierCard} ${tier.highlight ? styles.tierHighlight : ''}`}
          >
            {tier.badge && <div className={styles.tierBadge}>{tier.badge}</div>}
            <div className={styles.tierName}>{tier.name}</div>
            <div className={styles.tierPrice}>
              <span className={styles.priceValue}>{tier.price}</span>
              <span className={styles.pricePeriod}>{tier.period}</span>
            </div>
            <p className={styles.tierDesc}>{tier.desc}</p>

            <ul className={styles.featureList}>
              {tier.features.map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.featureCheck}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button className={`${styles.tierCta} ${tier.highlight ? styles.tierCtaHighlight : ''}`}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className={styles.bottomNote}>
        <p>All plans include a 14-day free trial. No credit card required.</p>
        <p className={styles.bottomMuted}>
          Need a custom plan? <a href="mailto:akshat@gtmer.ai" className={styles.bottomLink}>Contact us</a>
        </p>
      </div>
    </article>
  )
}

export default Pricing
