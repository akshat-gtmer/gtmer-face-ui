import { useState, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './UseCases.module.css'

/* ===== DATA ===== */

interface UseCase {
  icon: string
  tag: string
  title: string
  description: string
  bullets: string[]
  metric: string
  metricLabel: string
}

const USE_CASES: UseCase[] = [
  {
    icon: '⚡',
    tag: 'SAAS STARTUPS',
    title: 'Scale Outbound Without Hiring',
    description:
      'Early-stage teams can\'t afford a 5-person SDR team. GTMer replaces the entire top-of-funnel motion with AI agents that prospect, enrich, and engage — 24/7.',
    bullets: [
      'Auto-source from YC batches, Product Hunt, and LinkedIn',
      'AI writes hyper-personalised cold emails per ICP',
      'Follow-up sequences that adapt to reply signals',
      'Pipeline built in days, not quarters',
    ],
    metric: '10×',
    metricLabel: 'pipeline velocity',
  },
  {
    icon: '🏢',
    tag: 'ENTERPRISE SALES',
    title: 'Multi-Thread Every Deal',
    description:
      'Enterprise cycles are long and complex. GTMer agents monitor buying committees, enrich stakeholder data, and keep every thread warm — automatically.',
    bullets: [
      'Map entire buying committees across departments',
      'Intent-scored outreach to champions and decision-makers',
      'Automated nurture sequences for long-cycle deals',
      'CRM-synced pipeline with real-time deal health scoring',
    ],
    metric: '70%',
    metricLabel: 'lower CAC',
  },
  {
    icon: '🎯',
    tag: 'AGENCIES & CONSULTANCIES',
    title: 'White-Label GTM-as-a-Service',
    description:
      'Agencies managing outbound for multiple clients get a unified platform. Custom agents per client, separate pipelines, shared reporting dashboard.',
    bullets: [
      'Multi-tenant setup — separate data per client',
      'Custom brand voice calibration per campaign',
      'Real-time reporting dashboards for client visibility',
      'Scale to 50+ clients without adding headcount',
    ],
    metric: '50+',
    metricLabel: 'clients per operator',
  },
]

/* ===== COMPONENT ===== */

const UseCases = () => {
  const headerReveal = useScrollReveal({ threshold: 0.2 })
  const cardsReveal = useScrollReveal({ threshold: 0.1 })
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    if (!cardsReveal.isVisible) return
    USE_CASES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i])
      }, 200 * i)
    })
  }, [cardsReveal.isVisible])

  return (
    <section className={styles.section} id="use-cases">
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Built For Your Vertical</span>
        </div>

        <h2 className={styles.headline}>
          Who Uses GTMer?
          <span className={styles.headlineAccent}> Everyone Who Sells.</span>
        </h2>

        <p className={styles.subtext}>
          Whether you're a 3-person startup or a 300-person sales org — GTMer
          adapts to your workflow, your data, and your market.
        </p>
      </div>

      {/* Cards */}
      <div ref={cardsReveal.ref} className={styles.cardsGrid}>
        {USE_CASES.map((uc, index) => (
          <div
            key={uc.tag}
            className={`${styles.card} ${visibleCards.includes(index) ? styles.cardVisible : ''}`}
          >
            <div className={styles.cardTop}>
              <span className={styles.cardIcon}>{uc.icon}</span>
              <span className={styles.cardTag}>{uc.tag}</span>
            </div>

            <h3 className={styles.cardTitle}>{uc.title}</h3>
            <p className={styles.cardDesc}>{uc.description}</p>

            <ul className={styles.cardBullets}>
              {uc.bullets.map(b => (
                <li key={b} className={styles.cardBullet}>
                  <span className={styles.bulletCheck}>✓</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className={styles.cardMetric}>
              <span className={styles.metricValue}>{uc.metric}</span>
              <span className={styles.metricLabel}>{uc.metricLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default UseCases
