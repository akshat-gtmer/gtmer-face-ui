import { useState, useEffect, useCallback } from 'react'
import styles from './Hero.module.css'

const Hero = () => {
  const [agents, setAgents] = useState(3)
  const [leads, setLeads] = useState(847)
  const [messages, setMessages] = useState(12400)

  const tick = useCallback(() => {
    setLeads(prev => prev + Math.floor(Math.random() * 3))
    setMessages(prev => prev + Math.floor(Math.random() * 8))
    if (Math.random() > 0.85) setAgents(prev => (prev === 3 ? 4 : 3))
  }, [])

  useEffect(() => {
    const id = setInterval(tick, 3000)
    return () => clearInterval(id)
  }, [tick])

  const formatNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

  return (
    <section className={styles.hero} id="hero-section">
      <div className={styles.heroContent}>
        {/* System status badge */}
        <div className={styles.systemStatus}>
          <span className={styles.statusIndicator} />
          <span>system online — agents deployed</span>
        </div>

        {/* /gtmer text mark */}
        <div className={styles.heroMark}>
          <span className={styles.markSlash}>/</span>
          <span className={styles.markName}>gtmer</span>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          <span className={styles.headlineAccent}>Missing 5x sales? </span>
          Let the {' '}
          <span className={styles.headlineAccent}>GTMers </span>
          handle it
        </h1>

        {/* Subtext */}
        <p className={styles.subtext}>
          AI agents that find, enrich, and engage your ideal prospects
          autonomously. Set the rules. The system runs outbound at scale,
          with every message personalized and every reply tracked.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaGroup}>
          <button
            className={styles.ctaPrimary}
            id="hero-cta-start"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Automating
          </button>
          <button
            className={styles.ctaSecondary}
            id="hero-cta-how"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See How It Works
          </button>
        </div>
      </div>

      {/* Scroll down chevron */}
      <div
        className={styles.scrollChevron}
        onClick={() => document.getElementById('numbers-section')?.scrollIntoView({ behavior: 'smooth' })}
        role="button"
        aria-label="Scroll down"
      >
        <span className={styles.chevronIcon}>⌄</span>
      </div>

      {/* Activity indicators */}
      <div className={styles.activityLayer}>
        <div className={styles.activityItem}>
          <div className={styles.activityDot} />
          <span>{agents} agents running</span>
        </div>
        <div className={styles.activityItem}>
          <div className={styles.activityDot} />
          <span>{leads.toLocaleString()} leads enriched today</span>
        </div>
        <div className={styles.activityItem}>
          <div className={styles.activityDot} />
          <span>{formatNum(messages)} messages sent this week</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
