import { useState, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './HowItWorks.module.css'

interface HowItWorksProps {
  onAgentsClick?: () => void
  onDataEngineClick?: () => void
  onProductClick?: () => void
}

const STEPS = [
  {
    number: '01',
    label: 'STEP 01',
    icon: '⛏',
    title: 'Crawl Data',
    body: '100+ sources scraped automatically, every day. Firmographics, technographics, hiring signals — all indexed.',
    link: 'Learn more',
    linkAction: 'data-engine',
  },
  {
    number: '02',
    label: 'STEP 02',
    icon: '⚡',
    title: 'Score Leads',
    body: 'Every lead profiled & scored against your ICP. Only high-intent prospects move forward.',
    link: 'Learn more',
    linkAction: 'agents',
  },
  {
    number: '03',
    label: 'STEP 03',
    icon: '✉',
    title: 'Send Emails',
    body: 'AI writes unique, personalised emails per prospect. No templates. Every message is contextual.',
    link: 'Learn more',
    linkAction: 'agents',
  },
  {
    number: '04',
    label: 'STEP 04',
    icon: '📅',
    title: 'Book Demos',
    body: 'Engaged leads auto-convert to booked demos. Follow-ups, replies, scheduling — all handled.',
    link: 'Learn more',
    linkAction: 'product',
  },
]

const HowItWorks = ({ onAgentsClick, onDataEngineClick, onProductClick }: HowItWorksProps) => {
  const headerReveal = useScrollReveal({ threshold: 0.2 })
  const pipelineReveal = useScrollReveal({ threshold: 0.1 })
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  // Stagger card reveals
  useEffect(() => {
    if (!pipelineReveal.isVisible) return
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i])
      }, 200 * i)
    })
  }, [pipelineReveal.isVisible])

  return (
    <section className={styles.section} id="how-it-works">
      {/* Header block — reveals on scroll */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <div className={styles.badgeInner}>
            <span className={styles.badgeDot} />
            <span>Fully Automated Pipeline</span>
          </div>
        </div>

        <h2 className={styles.headline}>
          How GTMER Works.
          <span className={styles.headlineAccent}>4 Steps. Zero Manual Work.</span>
        </h2>

        <p className={styles.subtext}>
          From raw data to a booked demo — four AI stages that feed each other
          automatically.
        </p>
      </div>

      {/* Pipeline Cards — staggered reveal */}
      <div ref={pipelineReveal.ref} className={styles.pipeline}>
        {STEPS.map((step, index) => (
          <div
            className={`${styles.card} ${visibleCards.includes(index) ? styles.cardVisible : ''}`}
            key={step.number}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <span className={styles.stepWatermark}>{step.number}</span>
            <span className={styles.stepLabel}>{step.label}</span>

            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>{step.icon}</span>
              <h3 className={styles.cardTitle}>{step.title}</h3>
            </div>

            <p className={styles.cardBody}>{step.body}</p>

            <button
              className={styles.cardLink}
              onClick={() => {
                if (step.linkAction === 'data-engine') onDataEngineClick?.()
                else if (step.linkAction === 'agents') onAgentsClick?.()
                else if (step.linkAction === 'product') onProductClick?.()
              }}
            >
              {step.link}
              <span className={styles.cardLinkChevron}>▾</span>
            </button>

            {index < STEPS.length - 1 && (
              <div className={styles.connectorDot} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.ctaWrapper}>
        <button
          className={styles.ctaButton}
          id="how-cta-explore"
          onClick={() => onProductClick?.()}
        >
          Explore Platform
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>
    </section>
  )
}

export default HowItWorks
