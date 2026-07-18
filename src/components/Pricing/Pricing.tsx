import { Link } from 'react-router-dom'
import { IconArrowLeft, IconArrowRight, IconMessageCircle, IconBolt, IconCheck } from '../Icons'
import styles from './Pricing.module.css'


const TIERS = [
  {
    name: 'Starter',
    tagline: 'Get your first meetings booked',
    desc: 'For early-stage teams testing AI-powered outbound.',
    price: '149',
    period: '/mo',
    leads: '800',
    perLead: '$0.19',
    highlight: false,
    cta: 'Get Started',
    features: [
      '800 leads processed/month',
      '5 AI Workers (Crawl, Summary, Contact, Draft, Send)',
      '3 active projects',
      'Soul Setup — brand voice configuration',
      'Email analytics (opens, clicks, replies)',
      'CSV import + HubSpot sync',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    tagline: '10× your pipeline this quarter',
    desc: 'For scaling teams ready to replace manual SDR work entirely.',
    price: '399',
    period: '/mo',
    leads: '2,500',
    perLead: '$0.16',
    highlight: true,
    badge: 'Most Popular',
    cta: 'Get Started',
    features: [
      '2,500 leads processed/month',
      '5 AI Workers — unlimited concurrent projects',
      'Soul Setup — full brand voice engine',
      'Competitor Analysis — side-by-side positioning',
      'Market Intelligence — on-demand research reports',
      'Website Tracking — see who visits your site',
      'Full email analytics with top-performing emails',
      'Salesforce, HubSpot, Pipedrive integrations',
      'Priority support + Slack channel',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Full platform, no limits',
    desc: 'For organizations that need dedicated support, custom integrations, and unlimited scale.',
    price: 'Custom',
    period: '',
    leads: 'Unlimited',
    perLead: '',
    highlight: false,
    cta: 'Contact Sales',
    features: [
      'Unlimited leads and projects',
      '5 AI Workers + custom workflow configuration',
      'Everything in Growth, plus:',
      'AI Chatbot builder for inbound lead capture',
      'Custom integrations and API access',
      'SOC 2 Type II compliance',
      'SSO / SAML authentication',
      'Dedicated success manager',
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
          <span className={styles.backArrow}><IconArrowLeft size={14} /></span>
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
          Transparent pricing based on leads processed.
          Every plan includes all 5 AI workers. Start free, scale when you're ready.
        </p>
      </div>

      {/* Contact CTA Banner */}
      <div className={styles.contactBanner}>
        <div className={styles.contactBannerInner}>
          <div className={styles.contactBannerText}>
            <span className={styles.contactBannerIcon}><IconMessageCircle size={20} /></span>
            <div>
              <p className={styles.contactBannerHeadline}>Need a Custom Quote?</p>
              <p className={styles.contactBannerSub}>
                Processing more than 2,500 leads/month? Let's craft a plan that fits your pipeline goals and budget.
              </p>
            </div>
          </div>
          <a href="mailto:admin@gtmer.online" className={styles.contactBannerCta}>
            Contact Sales <IconArrowRight size={14} />
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
              <span className={styles.leadsIcon}><IconBolt size={12} /></span>
              <span>{tier.leads} leads</span>
              {tier.perLead && (
                <span className={styles.perLead}>({tier.perLead}/lead)</span>
              )}
            </div>

            <p className={styles.tierDesc}>{tier.desc}</p>

            <ul className={styles.featureList}>
              {tier.features.map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.featureCheck}><IconCheck size={12} /></span>
                  {f}
                </li>
              ))}
            </ul>

            {tier.cta === 'Contact Sales' ? (
              <a
                href="mailto:admin@gtmer.online"
                className={`${styles.tierCta} ${tier.highlight ? styles.tierCtaHighlight : ''}`}
              >
                {tier.cta}
              </a>
            ) : (
              <Link
                to="/signup"
                className={`${styles.tierCta} ${tier.highlight ? styles.tierCtaHighlight : ''}`}
              >
                {tier.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className={styles.bottomNote}>
        <p>We offer flexible billing — monthly, quarterly, and annual options available.</p>
        <p className={styles.bottomMuted}>
          Questions? Reach us at{' '}
          <a href="mailto:admin@gtmer.online" className={styles.bottomLink}>admin@gtmer.online</a>
        </p>
      </div>
    </article>
  )
}

export default Pricing
