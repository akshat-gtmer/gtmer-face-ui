import { useEffect, useState, useRef, useCallback } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Numbers.module.css'

/* ===== DATA ===== */

const INTEGRATIONS_ROW1 = [
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
    title: 'Faster Pipeline Generation',
    vs: 'vs. manual SDR prospecting',
    desc: 'Teams using GTMer build qualified sales pipeline 10× faster than manual research and cold outreach. AI agents source, score, and engage prospects in minutes — not weeks.',
    colorClass: 'metricGreen',
  },
  {
    metric: '18%',
    numericValue: 18,
    suffix: '%',
    title: 'Average Reply Rate',
    vs: 'vs. 1.8% industry average',
    desc: 'AI-personalized outreach achieves 18% reply rates by referencing each prospect\'s company signals, tech stack, and recent milestones — 10× higher than generic template campaigns.',
    colorClass: 'metricPurple',
  },
  {
    metric: '70%',
    numericValue: 70,
    suffix: '%',
    title: 'Lower Acquisition Cost',
    vs: 'after 90 days of AI outbound',
    desc: 'Customer Acquisition Cost drops an average of 70% within 90 days as AI SDR agents replace expensive manual outbound while delivering higher-quality meetings to your AEs.',
    colorClass: 'metricCyan',
  },
  {
    metric: '100%',
    numericValue: 100,
    suffix: '%',
    title: 'Follow-up Coverage',
    vs: 'zero missed touchpoints',
    desc: 'Every single prospect receives timely, relevant follow-ups. AI sequences never forget, never get busy, and never let a warm lead go cold due to human bandwidth limits.',
    colorClass: 'metricBlue',
  },
  {
    metric: '48h',
    numericValue: 48,
    suffix: 'h',
    title: 'Deployment Time',
    vs: 'from signup to first outreach',
    desc: 'Most GTMer clients go live within 48 hours — connecting their CRM, defining their ICP, and launching their first AI-powered outreach sequence the same week they sign up.',
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
      role="figure"
      aria-label={`${stat.metric} — ${stat.title}`}
    >
      <div className={`${styles.statMetric} ${styles[stat.colorClass]}`}>
        <span className={styles.counterAnimating}>{count}</span>
        {stat.suffix}
      </div>
      <h3 className={styles.statTitle}>{stat.title}</h3>
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
    <section
      className={styles.section}
      id="numbers-section"
      aria-label="GTMer platform performance metrics and integration partners"
    >
      {/* GEO: Crawlable summary of key performance claims */}
      <div className="sr-only" role="note" aria-label="GTMer performance metrics summary">
        <p>
          GTMer's AI SDR agents and sales automation platform deliver proven results: 10× faster pipeline generation
          compared to manual SDR prospecting, 18% average reply rate on personalized outbound at scale (versus the
          1.8% industry average for generic cold email), 70% lower customer acquisition cost within 90 days of
          AI sales automation, 100% follow-up coverage with zero missed touchpoints, and 48-hour deployment time
          from signup to first AI-powered outreach. GTMer integrates with Salesforce, HubSpot, LinkedIn, Apollo,
          ZoomInfo, Outreach, G2, Clearbit, Pipedrive, Slack, Notion, and Bombora.
        </p>
      </div>

      {/* ===== Integration Ticker ===== */}
      <div
        ref={tickerReveal.ref}
        className={`${styles.tickerBlock} ${tickerReveal.isVisible ? styles.visible : ''}`}
      >
        <p className={styles.tickerLabel}>
          Connects to Salesforce, HubSpot, LinkedIn, Apollo & 30+ GTM tools
        </p>

        {/* Row 1 — scrolls left */}
        <div className={styles.tickerTrack} aria-label="Integration partner logos scrolling">
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
          Proven AI SDR & Sales Automation <span className={styles.numbersAccent}>Results</span>
        </h2>
        <p className={styles.numbersSubtext}>
          Real performance data from GTMer's AI sales agents. These are verified outcomes
          from autonomous SDR campaigns running personalized outbound at scale — not projections.
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
