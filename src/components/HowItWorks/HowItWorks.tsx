import { useState, useEffect, useCallback } from 'react'
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


/* ===== GLIMPSE SUB-COMPONENTS (showcase versions) ===== */

const GlimpseCrawl = () => (
  <div className={styles.showcaseContent}>
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>Live Data Feed</span>
      <span className={styles.showcaseBadgeLive}>
        <span className={styles.liveDot} />
        Crawling
      </span>
    </div>
    <div className={styles.showcaseRows}>
      {[
        { company: 'Tessera Labs', source: 'LinkedIn', count: '1,847', time: '2s ago' },
        { company: 'Heron Analytics', source: 'YC Batch', count: '942', time: '5s ago' },
        { company: 'Relay.xyz', source: 'Product Hunt', count: '3,210', time: '8s ago' },
        { company: 'Compvox AI', source: 'Crunchbase', count: '756', time: '12s ago' },
        { company: 'Nova Systems', source: 'G2 Reviews', count: '2,104', time: '15s ago' },
      ].map((row, i) => (
        <div className={styles.feedRow} key={i} style={{ animationDelay: `${i * 120}ms` }}>
          <span className={styles.feedDot} />
          <span className={styles.feedCompany}>{row.company}</span>
          <span className={styles.feedTag}>{row.source}</span>
          <span className={styles.feedCount}>{row.count}</span>
          <span className={styles.feedTime}>{row.time}</span>
        </div>
      ))}
    </div>
    <div className={styles.showcaseStats}>
      <div className={styles.statItem}>
        <span className={styles.statValue}>12,847</span>
        <span className={styles.statLabel}>Records Today</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>100+</span>
        <span className={styles.statLabel}>Sources</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>98.2%</span>
        <span className={styles.statLabel}>Accuracy</span>
      </div>
    </div>
  </div>
)

const GlimpseScore = () => (
  <div className={styles.showcaseContent}>
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>Lead Scoring Engine</span>
      <span className={styles.showcaseSubLabel}>ICP Match Analysis</span>
    </div>
    <div className={styles.scoreShowcase}>
      {/* Lead 1 */}
      <div className={styles.scoreProfileRow}>
        <div className={styles.scoreAvatarLg}>AM</div>
        <div className={styles.scoreProfileInfo}>
          <span className={styles.scoreProfileName}>Arjun Mehta</span>
          <span className={styles.scoreProfileRole}>CTO · Tessera Labs · Series A</span>
        </div>
        <div className={styles.signalGrid} style={{ flex: 1 }}>
          {[
            { signal: 'Uses Salesforce', strength: 'high' },
            { signal: 'Hiring 3 SDRs', strength: 'high' },
            { signal: 'B2B SaaS', strength: 'medium' },
          ].map((s, i) => (
            <div className={`${styles.signalChip} ${styles[`signal${s.strength}`]}`} key={i}>
              <span className={styles.signalDot} />
              {s.signal}
            </div>
          ))}
        </div>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 36 36" className={styles.scoreRing}>
            <path className={styles.scoreRingBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className={styles.scoreRingFill} strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span className={styles.scoreNum}>92</span>
        </div>
      </div>
      {/* Lead 2 */}
      <div className={styles.scoreProfileRow}>
        <div className={styles.scoreAvatarLg} style={{ background: '#fce7f3', color: '#be185d' }}>PS</div>
        <div className={styles.scoreProfileInfo}>
          <span className={styles.scoreProfileName}>Priya Sharma</span>
          <span className={styles.scoreProfileRole}>VP Sales · Helix AI · Series B</span>
        </div>
        <div className={styles.signalGrid} style={{ flex: 1 }}>
          {[
            { signal: 'HubSpot User', strength: 'high' },
            { signal: 'Expanding Team', strength: 'medium' },
            { signal: '$8M ARR', strength: 'high' },
          ].map((s, i) => (
            <div className={`${styles.signalChip} ${styles[`signal${s.strength}`]}`} key={`ps-${i}`}>
              <span className={styles.signalDot} />
              {s.signal}
            </div>
          ))}
        </div>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 36 36" className={styles.scoreRing}>
            <path className={styles.scoreRingBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className={styles.scoreRingFill} strokeDasharray="78, 100" style={{ stroke: '#f59e0b' }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span className={styles.scoreNum} style={{ color: '#f59e0b' }}>78</span>
        </div>
      </div>
      {/* Lead 3 */}
      <div className={styles.scoreProfileRow}>
        <div className={styles.scoreAvatarLg} style={{ background: '#fef3c7', color: '#92400e' }}>NP</div>
        <div className={styles.scoreProfileInfo}>
          <span className={styles.scoreProfileName}>Neel Patel</span>
          <span className={styles.scoreProfileRole}>Founder · StackBridge · Seed</span>
        </div>
        <div className={styles.signalGrid} style={{ flex: 1 }}>
          {[
            { signal: 'No CRM', strength: 'low' },
            { signal: 'Solo Founder', strength: 'low' },
            { signal: 'Pre-Revenue', strength: 'low' },
          ].map((s, i) => (
            <div className={`${styles.signalChip} ${styles[`signal${s.strength}`]}`} key={`np-${i}`}>
              <span className={styles.signalDot} />
              {s.signal}
            </div>
          ))}
        </div>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 36 36" className={styles.scoreRing}>
            <path className={styles.scoreRingBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className={styles.scoreRingFill} strokeDasharray="45, 100" style={{ stroke: '#94a3b8' }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span className={styles.scoreNum} style={{ color: '#94a3b8' }}>45</span>
        </div>
      </div>
    </div>
  </div>
)

const GlimpseEmail = () => (
  <div className={styles.showcaseContent}>
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>AI Email Draft</span>
      <span className={styles.showcaseSubLabel}>Auto-Generated · Personalised</span>
    </div>
    <div className={styles.emailShowcase}>
      <div className={styles.emailMeta}>
        <div className={styles.emailMetaRow}>
          <span className={styles.emailMetaLabel}>To</span>
          <span className={styles.emailMetaValue}>arjun@tesseralabs.com</span>
        </div>
        <div className={styles.emailMetaRow}>
          <span className={styles.emailMetaLabel}>Subj</span>
          <span className={styles.emailMetaValue}>
            Re: scaling outbound at{' '}
            <span className={styles.emailHighlight}>{'{{company}}'}</span>
          </span>
        </div>
      </div>
      <div className={styles.emailDraftBody}>
        <p>
          Hi <span className={styles.emailHighlight}>{'{{first_name}}'}</span>,
        </p>
        <p>
          Noticed <span className={styles.emailHighlight}>{'{{company}}'}</span> just closed a
          Series A — congrats. Most teams at your stage hit a wall scaling outbound without a
          dedicated ops person.
        </p>
        <p>
          We've helped 3 similar B2B SaaS companies automate their entire pipeline — from data
          sourcing to demo booking — in under a week.
        </p>
        <p className={styles.emailSignature}>
          Worth a 15-min chat?
          <br />
          — GTMER AI
        </p>
      </div>
      <div className={styles.emailActions}>
        <span className={styles.emailActionBtn}>✓ Send</span>
        <span className={styles.emailActionBtnOutline}>✎ Edit</span>
        <span className={styles.emailActionBtnOutline}>⟳ Regenerate</span>
      </div>
    </div>
  </div>
)

const GlimpseBooking = () => (
  <div className={styles.showcaseContent}>
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>Demo Scheduler</span>
      <span className={styles.showcaseBadgeConfirmed}>✓ Confirmed</span>
    </div>
    <div className={styles.bookingShowcase}>
      <div className={styles.calendarGrid}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
          <div
            key={day}
            className={`${styles.calDay} ${i === 2 ? styles.calDayActive : ''}`}
          >
            <span className={styles.calDayName}>{day}</span>
            <span className={styles.calDayNumber}>{14 + i}</span>
            {i === 2 && <span className={styles.calDayDot} />}
          </div>
        ))}
      </div>
      <div className={styles.bookingCard}>
        <div className={styles.bookingCardLeft}>
          <div className={styles.bookingCardTitle}>Demo with Tessera Labs</div>
          <div className={styles.bookingCardTime}>Wed 16 · 2:00 PM EST · 30 min</div>
        </div>
        <div className={styles.bookingCardRight}>
          <div className={styles.bookingAvatarStack}>
            <span className={styles.bAvatar}>AM</span>
            <span className={styles.bAvatar}>LS</span>
            <span className={styles.bAvatarPlus}>+1</span>
          </div>
        </div>
      </div>
      <div className={styles.bookingSuccess}>
        <div className={styles.successIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#16a34a" strokeWidth="2" />
            <path d="M7 12.5l3 3 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className={styles.successText}>
          <span className={styles.successTitle}>Meeting Booked</span>
          <span className={styles.successSub}>Calendar invite sent to all attendees</span>
        </div>
      </div>
    </div>
  </div>
)

const SHOWCASE_COMPONENTS = [GlimpseCrawl, GlimpseScore, GlimpseEmail, GlimpseBooking]

/* ===== MAIN COMPONENT ===== */

const HowItWorks = ({ onAgentsClick, onDataEngineClick, onProductClick }: HowItWorksProps) => {
  const headerReveal = useScrollReveal({ threshold: 0.2 })
  const showcaseReveal = useScrollReveal({ threshold: 0.1 })
  const [activeStep, setActiveStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)

  const goToStep = useCallback(
    (step: number) => {
      if (step === activeStep || isTransitioning) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveStep(step)
        setTimeout(() => setIsTransitioning(false), 60)
      }, 300)
    },
    [activeStep, isTransitioning]
  )

  // Auto-cycle once through all 4 steps (1s each), then stop
  useEffect(() => {
    if (!showcaseReveal.isVisible || introComplete) return
    let step = 0
    const timer = setInterval(() => {
      step++
      if (step >= STEPS.length) {
        clearInterval(timer)
        setIntroComplete(true)
        return
      }
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveStep(step)
        setTimeout(() => setIsTransitioning(false), 60)
      }, 250)
    }, 1000)
    return () => clearInterval(timer)
  }, [showcaseReveal.isVisible, introComplete])

  const ActiveShowcase = SHOWCASE_COMPONENTS[activeStep]

  const handleLinkClick = (action: string) => {
    if (action === 'data-engine') onDataEngineClick?.()
    else if (action === 'agents') onAgentsClick?.()
    else if (action === 'product') onProductClick?.()
  }

  return (
    <section className={styles.section} id="how-it-works">
      {/* Header */}
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
          <span className={styles.headlineAccent}>4 Steps.</span> Zero Manual Work.
        </h2>


      </div>

      {/* ===== SHOWCASE — The Main Stage ===== */}
      <div
        ref={showcaseReveal.ref}
        className={`${styles.showcaseArea} ${showcaseReveal.isVisible ? styles.showcaseVisible : ''}`}
      >
        {/* Showcase stage label */}
        <div className={styles.showcaseStageLabel}>
          <span className={styles.showcaseStageBadge}>{STEPS[activeStep].label}</span>
          <span className={styles.showcaseStageIcon}>{STEPS[activeStep].icon}</span>
          <span className={styles.showcaseStageTitle}>{STEPS[activeStep].title}</span>
        </div>

        {/* The white showcase panel */}
        <div className={styles.showcasePanel}>
          <div
            className={`${styles.showcaseInner} ${isTransitioning ? styles.showcaseExit : styles.showcaseEnter
              }`}
            key={activeStep}
          >
            <ActiveShowcase />
          </div>
        </div>

        {/* Decorative glow behind the showcase */}
        <div className={styles.showcaseGlow} />
      </div>

      <div className={styles.stepCards}>
        {STEPS.map((step, index) => (
          <div
            className={`${styles.stepCard} ${index === activeStep ? styles.stepCardActive : ''}`}
            key={step.number}
            onClick={() => goToStep(index)}
            role="button"
            tabIndex={0}
          >
            <span className={styles.stepCardNumber}>{step.number}</span>
            <span className={styles.stepCardIcon}>{step.icon}</span>
            <span className={styles.stepCardTitle}>{step.title}</span>
            <div className={styles.stepCardIndicator} />
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
