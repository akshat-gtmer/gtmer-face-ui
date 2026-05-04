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
      'We replaced our 3-person SDR team with GTMer and tripled our pipeline in 6 weeks. The personalisation quality is better than what our human reps were writing.',
    name: 'Priya Sharma',
    role: 'Head of Growth',
    company: 'NovaByte (YC W25)',
    initials: 'PS',
    metric: '3×',
    metricLabel: 'pipeline growth',
  },
  {
    quote:
      'GTMer found buying signals we were missing entirely. It surfaced 40+ qualified leads from intent data sources we didn\'t even know existed. Game-changing for enterprise.',
    name: 'Marcus Chen',
    role: 'VP of Sales',
    company: 'Firelane Technologies',
    initials: 'MC',
    metric: '40+',
    metricLabel: 'qualified leads / month',
  },
  {
    quote:
      'We manage outbound for 12 clients. GTMer lets us run separate AI agents per client with custom brand voice. It\'s like having a dedicated SDR team for each account.',
    name: 'Sophie Keller',
    role: 'Managing Partner',
    company: 'Crossbeam Growth Agency',
    initials: 'SK',
    metric: '12',
    metricLabel: 'clients, one operator',
  },
]

/* ===== GLIMPSE BADGES ===== */

const GlimpsePipelineBar = () => (
  <div className={styles.glimpseBadge}>
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
  <div className={styles.glimpseBadge}>
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
  <div className={styles.glimpseBadge}>
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
    <section className={styles.section} id="testimonials">
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Proven Results</span>
        </div>

        <h2 className={styles.headline}>
          Trusted by Teams That
          <span className={styles.headlineAccent}> Ship Revenue.</span>
        </h2>

        <p className={styles.subtext}>
          Real outcomes from real teams — not vanity metrics from a demo account.
        </p>
      </div>

      {/* Testimonial cards */}
      <div ref={cardsReveal.ref} className={styles.cardsGrid}>
        {TESTIMONIALS.map((t, index) => {
          const GlimpseBadgeComponent = GLIMPSE_BADGES[index]
          return (
            <div
              key={t.name}
              className={`${styles.card} ${visibleCards.includes(index) ? styles.cardVisible : ''}`}
            >
              {/* Quote */}
              <div className={styles.quoteBlock}>
                <span className={styles.quoteMark}>"</span>
                <p className={styles.quoteText}>{t.quote}</p>
              </div>

              {/* Verified Outcome Glimpse */}
              <GlimpseBadgeComponent />

              {/* Author */}
              <div className={styles.authorBlock}>
                <div className={styles.avatar}>{t.initials}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorRole}>{t.role}</div>
                  <div className={styles.authorCompany}>{t.company}</div>
                </div>
              </div>

              {/* Key metric */}
              <div className={styles.metricBar}>
                <span className={styles.metricValue}>{t.metric}</span>
                <span className={styles.metricLabel}>{t.metricLabel}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Testimonials
