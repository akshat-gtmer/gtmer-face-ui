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
        {TESTIMONIALS.map((t, index) => (
          <div
            key={t.name}
            className={`${styles.card} ${visibleCards.includes(index) ? styles.cardVisible : ''}`}
          >
            {/* Quote */}
            <div className={styles.quoteBlock}>
              <span className={styles.quoteMark}>"</span>
              <p className={styles.quoteText}>{t.quote}</p>
            </div>

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
        ))}
      </div>
    </section>
  )
}

export default Testimonials
