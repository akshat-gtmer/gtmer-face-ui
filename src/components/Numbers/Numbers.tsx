import { useEffect, useState, useRef, useCallback } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Numbers.module.css'

/* ===== DATA ===== */

const INTEGRATIONS_ROW1 = [
  { code: 'NT', name: 'Notion' },
  { code: 'OR', name: 'Outreach' },
  { code: 'AP', name: 'Apollo' },
  { code: 'ZI', name: 'ZoomInfo' },
  { code: 'G2', name: 'G2' },
  { code: 'BO', name: 'Bombora' },
  { code: 'LI', name: 'LinkedIn' },
  { code: 'CB', name: 'Clearbit' },
  { code: 'SF', name: 'Salesforce' },
  { code: 'HS', name: 'HubSpot' },
  { code: 'PD', name: 'Pipedrive' },
  { code: 'SL', name: 'Slack' },
]

const INTEGRATIONS_ROW2 = [
  { code: 'OR', name: 'Outreach' },
  { code: 'AP', name: 'Apollo' },
  { code: 'ZI', name: 'ZoomInfo' },
  { code: 'G2', name: 'G2' },
  { code: 'BO', name: 'Bombora' },
  { code: 'LI', name: 'LinkedIn' },
  { code: 'CB', name: 'Clearbit' },
  { code: 'SF', name: 'Salesforce' },
  { code: 'HS', name: 'HubSpot' },
  { code: 'PD', name: 'Pipedrive' },
  { code: 'SL', name: 'Slack' },
  { code: 'NT', name: 'Notion' },
]

interface StatData {
  metric: string
  numericValue: number
  suffix: string
  title: string
  vs: string
  desc: string
  colorClass: string
}

const STATS: StatData[] = [
  {
    metric: '10×',
    numericValue: 10,
    suffix: '×',
    title: 'Faster Pipeline',
    vs: 'vs. manual SDR research',
    desc: 'Teams that automate data collection and prospecting build pipeline 10× faster than…',
    colorClass: 'metricGreen',
  },
  {
    metric: '18%',
    numericValue: 18,
    suffix: '%',
    title: 'Reply Rate',
    vs: 'vs. 1.8% industry avg',
    desc: 'AI-personalised emails achieve 18% average reply rates — compared to 1.8% for generic…',
    colorClass: 'metricPurple',
  },
  {
    metric: '70%',
    numericValue: 70,
    suffix: '%',
    title: 'Lower CAC',
    vs: 'after 90 days of automation',
    desc: 'Customer Acquisition Cost drops by an average of 70% within 90 days as AI replaces…',
    colorClass: 'metricCyan',
  },
  {
    metric: '100%',
    numericValue: 100,
    suffix: '%',
    title: 'Follow-up Rate',
    vs: 'zero missed touchpoints',
    desc: 'AI-powered sequences follow up with every single prospect — no lead goes cold due to a…',
    colorClass: 'metricBlue',
  },
  {
    metric: '48h',
    numericValue: 48,
    suffix: 'h',
    title: 'Time to Live',
    vs: 'from signup to first sequence',
    desc: 'Most clients are live and sending their first AI-powered outreach sequences within 4…',
    colorClass: 'metricOrange',
  },
]

/* ===== COUNTER HOOK ===== */

function useCountUp(target: number, isActive: boolean, duration = 1800) {
  const [current, setCurrent] = useState(0)
  const animRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step)
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [target, duration])

  useEffect(() => {
    if (isActive) {
      animate()
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isActive, animate])

  return current
}

/* ===== STAT CARD ===== */

const StatCard = ({ stat, index, parentVisible }: { stat: StatData; index: number; parentVisible: boolean }) => {
  const [cardVisible, setCardVisible] = useState(false)
  const count = useCountUp(stat.numericValue, cardVisible)

  // Stagger card appearance
  useEffect(() => {
    if (!parentVisible) return
    const timer = setTimeout(() => setCardVisible(true), 150 * index)
    return () => clearTimeout(timer)
  }, [parentVisible, index])

  return (
    <div
      className={`${styles.statCard} ${cardVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`${styles.statMetric} ${styles[stat.colorClass]}`}>
        <span className={styles.counterAnimating}>{count}</span>
        {stat.suffix}
      </div>
      <div className={styles.statTitle}>{stat.title}</div>
      <div className={styles.statVs}>{stat.vs}</div>
      <p className={styles.statDesc}>{stat.desc}</p>
    </div>
  )
}

/* ===== MAIN COMPONENT ===== */

const Numbers = () => {
  const tickerReveal = useScrollReveal({ threshold: 0.1 })
  const numbersReveal = useScrollReveal({ threshold: 0.15 })

  // Double the integration arrays for seamless loop
  const row1Items = [...INTEGRATIONS_ROW1, ...INTEGRATIONS_ROW1]
  const row2Items = [...INTEGRATIONS_ROW2, ...INTEGRATIONS_ROW2]

  return (
    <section className={styles.section} id="numbers-section">

      {/* ===== Integration Ticker ===== */}
      <div
        ref={tickerReveal.ref}
        className={`${styles.tickerBlock} ${tickerReveal.isVisible ? styles.visible : ''}`}
      >
        <p className={styles.tickerLabel}>Integrates with your existing GTM stack</p>

        {/* Row 1 — scrolls left */}
        <div className={styles.tickerTrack}>
          <div className={styles.tickerInner}>
            {row1Items.map((item, i) => (
              <span className={styles.tickerBadge} key={`r1-${i}`}>
                <span className={styles.tickerBadgeIcon}>{item.code}</span>
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className={styles.tickerTrack}>
          <div className={styles.tickerInnerReverse}>
            {row2Items.map((item, i) => (
              <span className={styles.tickerBadge} key={`r2-${i}`}>
                <span className={styles.tickerBadgeIcon}>{item.code}</span>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Numbers ===== */}
      <div
        ref={numbersReveal.ref}
        className={`${styles.numbersBlock} ${numbersReveal.isVisible ? styles.visible : ''}`}
      >
        <h2 className={styles.numbersHeadline}>
          Numbers That Actually <span className={styles.numbersAccent}>Matter</span>
        </h2>
        <p className={styles.numbersSubtext}>
          Not vanity metrics. Verified outcomes from real client data — with the
          context that tells you what they actually mean.
        </p>

        <div className={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.title}
              stat={stat}
              index={index}
              parentVisible={numbersReveal.isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Numbers
