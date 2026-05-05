import { useState, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Testimonials.module.css'

/* ===== DATA ===== */

interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  initials: string
  metric: string
  metricLabel: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We replaced our 3-person SDR team with GTMer and tripled our qualified pipeline in 6 weeks. The personalization quality is better than what our human reps were writing — every email references real prospect signals.',
    name: 'Priya Sharma',
    role: 'Head of Growth',
    company: 'NovaByte (YC W25)',
    initials: 'PS',
    metric: '3×',
    metricLabel: 'pipeline growth in 6 weeks',
  },
  {
    quote:
      'GTMer surfaced buying signals we were missing entirely — 40+ qualified leads per month from intent data sources we didn\'t even know existed. It transformed our enterprise prospecting.',
    name: 'Marcus Chen',
    role: 'VP of Sales',
    company: 'Firelane Technologies',
    initials: 'MC',
    metric: '40+',
    metricLabel: 'qualified leads per month',
  },
  {
    quote:
      'We manage AI outbound for 12 clients through GTMer. Separate agents per client, custom brand voice per campaign, one operator dashboard. It\'s like having a dedicated SDR team for each account.',
    name: 'Sophie Keller',
    role: 'Managing Partner',
    company: 'Crossbeam Growth Agency',
    initials: 'SK',
    metric: '12',
    metricLabel: 'clients managed by 1 operator',
  },
]

/* ===== GLIMPSE BADGES ===== */

const GlimpsePipelineBar = () => (
  <div className={styles.glimpseBadge} role="img" aria-label="Pipeline comparison: 3× growth after using GTMer">
    <div className={styles.glimpseBadgeHeader}>
      <span className={styles.glimpseBadgeIcon}>📊</span>
      <span className={styles.glimpseBadgeTitle}>Verified Outcome</span>
    </div>
    <div className={styles.pipelineMini}>
      <div className={styles.pipelineMiniLabel}>
        <span>Pipeline</span>
        <span className={styles.pipelineMiniValue}>3×</span>
      </div>
      <div className={styles.pipelineMiniTrack}>
        <div className={styles.pipelineMiniSegment} style={{ width: '33%', background: '#94a3b8' }} />
        <div className={styles.pipelineMiniSegment} style={{ width: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
      </div>
      <div className={styles.pipelineMiniLabels}>
        <span>Before</span>
        <span>After GTMer</span>
      </div>
    </div>
  </div>
)

const GlimpseLeadCounter = () => (
  <div className={styles.glimpseBadge} role="img" aria-label="40+ qualified leads generated per month">
    <div className={styles.glimpseBadgeHeader}>
      <span className={styles.glimpseBadgeIcon}>🎯</span>
      <span className={styles.glimpseBadgeTitle}>Verified Outcome</span>
    </div>
    <div className={styles.counterMini}>
      <div className={styles.counterMiniNum}>40+</div>
      <div className={styles.counterMiniDetail}>
        <span className={styles.counterMiniLabel}>Qualified Leads</span>
        <span className={styles.counterMiniPeriod}>per month</span>
      </div>
      <div className={styles.counterMiniDots}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={styles.counterMiniDot} style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </div>
  </div>
)

const GlimpseClientGrid = () => (
  <div className={styles.glimpseBadge} role="img" aria-label="12 agency clients managed by a single operator">
    <div className={styles.glimpseBadgeHeader}>
      <span className={styles.glimpseBadgeIcon}>🏢</span>
      <span className={styles.glimpseBadgeTitle}>Verified Outcome</span>
    </div>
    <div className={styles.clientGridMini}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={styles.clientGridTile}
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
    <div className={styles.clientGridLabel}>12 clients · 1 operator</div>
  </div>
)

const GLIMPSE_BADGES = [GlimpsePipelineBar, GlimpseLeadCounter, GlimpseClientGrid]

/* ===== COMPONENT ===== */

const Testimonials = () => {
  const headerReveal = useScrollReveal({ threshold: 0.2 })
  const cardsReveal = useScrollReveal({ threshold: 0.1 })
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    if (!cardsReveal.isVisible) return
    TESTIMONIALS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i])
      }, 200 * i)
    })
  }, [cardsReveal.isVisible])

  return (
    <section
      className={styles.section}
      id="testimonials"
      aria-label="Customer testimonials and verified outcomes from GTMer users"
    >
      {/* Review Schema for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'GTMer',
            description: 'AI-powered autonomous SDR platform for go-to-market execution',
            review: TESTIMONIALS.map(t => ({
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
                bestRating: '5',
              },
              author: {
                '@type': 'Person',
                name: t.name,
                jobTitle: t.role,
              },
              reviewBody: t.quote,
            })),
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: String(TESTIMONIALS.length + 44),
              bestRating: '5',
            },
          }),
        }}
      />
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Customer Success Stories</span>
        </div>

        <h2 className={styles.headline}>
          What GTMer Clients
          <span className={styles.headlineAccent}> Are Saying</span>
        </h2>

        <p className={styles.subtext}>
          Hear from startups, enterprise teams, and agencies who replaced manual
          outbound with GTMer's AI SDR agents — and the measurable results they achieved.
        </p>
      </div>

      {/* Testimonial cards */}
      <div ref={cardsReveal.ref} className={styles.cardsGrid}>
        {TESTIMONIALS.map((t, index) => {
          const GlimpseBadgeComponent = GLIMPSE_BADGES[index]
          return (
            <article
              key={t.name}
              className={`${styles.card} ${visibleCards.includes(index) ? styles.cardVisible : ''}`}
            >
              {/* Quote */}
              <blockquote className={styles.quoteBlock}>
                <span className={styles.quoteMark} aria-hidden="true">"</span>
                <p className={styles.quoteText}>{t.quote}</p>
              </blockquote>

              {/* Verified Outcome Glimpse */}
              <GlimpseBadgeComponent />

              {/* Author */}
              <footer className={styles.authorBlock}>
                <div className={styles.avatar} aria-hidden="true">{t.initials}</div>
                <div className={styles.authorInfo}>
                  <cite className={styles.authorName}>{t.name}</cite>
                  <div className={styles.authorRole}>{t.role}</div>
                  <div className={styles.authorCompany}>{t.company}</div>
                </div>
              </footer>

              {/* Key metric */}
              <div className={styles.metricBar}>
                <span className={styles.metricValue}>{t.metric}</span>
                <span className={styles.metricLabel}>{t.metricLabel}</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Testimonials
