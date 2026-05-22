import { useEffect, useState, useRef, useCallback } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Numbers.module.css'

/* ===== DATA ===== */

const INTEGRATIONS = [
  { code: 'SF', name: 'Salesforce' },
  { code: 'HS', name: 'HubSpot' },
  { code: 'LI', name: 'LinkedIn' },
  { code: 'AP', name: 'Apollo' },
  { code: 'ZI', name: 'ZoomInfo' },
  { code: 'OR', name: 'Outreach' },
  { code: 'G2', name: 'G2' },
  { code: 'CB', name: 'Clearbit' },
  { code: 'PD', name: 'Pipedrive' },
  { code: 'SL', name: 'Slack' },
  { code: 'NT', name: 'Notion' },
  { code: 'BO', name: 'Bombora' },
]

interface Stat {
  value: number
  suffix: string
  label: string
  sub: string
}

const STATS: Stat[] = [
  { value: 10, suffix: '×', label: 'More Pipeline', sub: 'vs. a manual SDR hire in the same period' },
  { value: 18, suffix: '%', label: 'Avg. Reply Rate', sub: 'industry avg. is 1.8% — that\'s a 10× uplift' },
  { value: 70, suffix: '%', label: 'Lower CAC', sub: 'most teams break even within the first 90 days' },
]

/* ===== COUNTER ===== */

function useCountUp(target: number, isActive: boolean) {
  const [current, setCurrent] = useState(0)
  const animRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    const start = performance.now()
    const duration = 1500
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }, [target])

  useEffect(() => {
    if (isActive) animate()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [isActive, animate])

  return current
}

/* ===== STAT CARD ===== */

const StatCard = ({ stat, isVisible }: { stat: Stat; isVisible: boolean }) => {
  const count = useCountUp(stat.value, isVisible)
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>
        {count}{stat.suffix}
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
      <div className={styles.statSub}>{stat.sub}</div>
    </div>
  )
}

/* ===== MAIN ===== */

const Numbers = () => {
  const tickerReveal = useScrollReveal({ threshold: 0.1 })
  const statsReveal = useScrollReveal({ threshold: 0.2 })

  const tickerItems = [...INTEGRATIONS, ...INTEGRATIONS]

  return (
    <section className={styles.section} id="numbers-section" aria-label="GTMer integrations and performance metrics">
      {/* GEO: Crawlable summary */}
      <div className="sr-only" role="note" aria-label="GTMer performance metrics summary">
        <p>
          GTMer's AI SDR agents deliver: 10× faster pipeline generation, 18% average reply rate
          (vs. 1.8% industry average), and 70% lower customer acquisition cost. Integrates with
          Salesforce, HubSpot, LinkedIn, Apollo, ZoomInfo, and 30+ GTM tools.
        </p>
      </div>

      {/* Integration Ticker */}
      <div
        ref={tickerReveal.ref}
        className={`${styles.tickerSection} ${tickerReveal.isVisible ? styles.visible : ''}`}
      >
        <p className={styles.tickerLabel}>
          Works with the tools you already use
        </p>
        <div className={styles.tickerTrack}>
          <div className={styles.tickerInner}>
            {tickerItems.map((item, i) => (
              <span className={styles.tickerBadge} key={`t-${i}`}>
                <span className={styles.tickerCode}>{item.code}</span>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsReveal.ref}
        className={`${styles.statsSection} ${statsReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.statsGrid}>
          {STATS.map(stat => (
            <StatCard key={stat.label} stat={stat} isVisible={statsReveal.isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Numbers
