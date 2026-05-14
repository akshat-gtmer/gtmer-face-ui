import { Link } from 'react-router-dom'
import styles from './Pricing.module.css'


const TIERS = [
  {
    name: 'Starter',
    tagline: 'Launch your AI-powered outbound',
    desc: 'For early-stage teams starting with AI-powered outbound.',
    price: '149',
    period: '/mo',
    leads: '800',
    perLead: '$0.19',
    highlight: false,
    cta: 'Get Started',
    features: [
      '800 leads processed/month',
      '1 AI Agent (Scout)',
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
    price: '399',
    period: '/mo',
    leads: '2,500',
    perLead: '$0.16',
    highlight: true,
    badge: 'Most Popular',
    cta: 'Get Started',
    features: [
      '2,500 leads processed/month',
      '4 AI Agents (Scout, Enricher, Writer, Sender)',
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
    price: 'Custom',
    period: '',
    leads: 'Unlimited',
    perLead: '',
    highlight: false,
    cta: 'Contact Sales',
    features: [
      'Unlimited leads',
      '6+ AI Agents (including custom)',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'GTMer Pricing — AI SDR Agent Plans & Tiers',
            description: 'Simple, transparent pricing for GTMer AI SDR agents. Starter, Growth, and Enterprise plans to match your team size.',
            url: 'https://gtmer.ai/pricing',
            isPartOf: { '@type': 'WebSite', name: 'GTMer', url: 'https://gtmer.ai' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'GTMer', item: 'https://gtmer.ai/' },
                { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://gtmer.ai/pricing' },
              ],
            },
          }),
        }}
      />
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
          <span>Simple Pricing</span>
        </div>
        <h1 className={styles.headline}>
          Pay per Lead.
          <span className={styles.headlineAccent}> Scale on Demand.</span>
        </h1>
        <p className={styles.subtext}>
          Transparent pricing based on the leads you process.
          No hidden fees. No surprises. Start small, scale as you grow.
        </p>
      </div>

      {/* Contact CTA Banner */}
      <div className={styles.contactBanner}>
        <div className={styles.contactBannerInner}>
          <div className={styles.contactBannerText}>
            <span className={styles.contactBannerIcon}>💬</span>
            <div>
              <p className={styles.contactBannerHeadline}>Need a Custom Quote?</p>
              <p className={styles.contactBannerSub}>
                Processing more than 2,500 leads/month? Let's craft a plan that fits your pipeline goals and budget.
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

            {/* Price block */}
            <div className={styles.priceBlock}>
              {tier.price !== 'Custom' ? (
                <>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceAmount}>{tier.price}</span>
                  <span className={styles.pricePeriod}>{tier.period}</span>
                </>
              ) : (
                <span className={styles.priceCustom}>Custom</span>
              )}
            </div>

            {/* Leads volume pill */}
            <div className={styles.leadsPill}>
              <span className={styles.leadsIcon}>⚡</span>
              <span>{tier.leads} leads</span>
              {tier.perLead && (
                <span className={styles.perLead}>({tier.perLead}/lead)</span>
              )}
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

            <a
              href={tier.cta === 'Contact Sales' ? 'mailto:akshat@gtmer.ai' : 'https://app.gtmer.ai'}
              target={tier.cta === 'Contact Sales' ? undefined : '_blank'}
              rel={tier.cta === 'Contact Sales' ? undefined : 'noopener noreferrer'}
              className={`${styles.tierCta} ${tier.highlight ? styles.tierCtaHighlight : ''}`}
            >
              {tier.cta}
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
