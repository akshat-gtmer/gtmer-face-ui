import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    number: '01',
    label: 'STEP 01',
    icon: '⛏',
    title: 'Prospect Discovery',
    shortTitle: 'Discover',
    body: 'AI crawls 100+ B2B data sources daily — LinkedIn, Crunchbase, G2, job boards, and funding databases — to surface companies matching your Ideal Customer Profile.',
    linkAction: 'data-engine',
  },
  {
    number: '02',
    label: 'STEP 02',
    icon: '⚡',
    title: 'ICP Scoring & Enrichment',
    shortTitle: 'Score',
    body: 'Every prospect is enriched with firmographic, technographic, and intent signals, then scored against your ICP criteria. Only qualified leads advance to outreach.',
    linkAction: 'agents',
  },
  {
    number: '03',
    label: 'STEP 03',
    icon: '✉',
    title: 'AI-Written Outreach',
    shortTitle: 'Engage',
    body: 'AI SDR agents craft unique, hyper-personalized emails and LinkedIn messages for each prospect — no templates, no copy-paste. Every touchpoint references real buyer context.',
    linkAction: 'agents',
  },
  {
    number: '04',
    label: 'STEP 04',
    icon: '📅',
    title: 'Autonomous Meeting Booking',
    shortTitle: 'Book',
    body: 'Engaged prospects are auto-scheduled into your team\'s calendar. Follow-ups, reply handling, and rescheduling — fully managed by the AI agent.',
    linkAction: 'product',
  },
  {
    number: '05',
    label: 'STEP 05',
    icon: '📊',
    title: 'Live Pipeline Tracking',
    shortTitle: 'Track',
    body: 'Every conversation is tracked in a real-time kanban board. Leads move automatically through stages — New, Contacted, Replied, Qualified — so your team always knows pipeline status.',
    linkAction: 'product',
  },
]


/* ===== GLIMPSE SUB-COMPONENTS (showcase versions) ===== */

const GlimpseCrawl = () => (
  <div className={styles.showcaseContent} role="img" aria-label="Live data feed showing companies being discovered from LinkedIn, Crunchbase, Product Hunt, and G2">
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>Live Prospect Feed</span>
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
        <span className={styles.statLabel}>Prospects Today</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>100+</span>
        <span className={styles.statLabel}>Data Sources</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>98.2%</span>
        <span className={styles.statLabel}>Data Accuracy</span>
      </div>
    </div>
  </div>
)

const GlimpseScore = () => (
  <div className={styles.showcaseContent} role="img" aria-label="Lead scoring engine showing ICP match analysis with buyer intent signals">
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>ICP Scoring Engine</span>
      <span className={styles.showcaseSubLabel}>Buyer Intent Analysis</span>
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
  <div className={styles.showcaseContent} role="img" aria-label="AI-generated personalized sales email with dynamic merge fields for prospect name and company">
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>AI-Generated Email</span>
      <span className={styles.showcaseSubLabel}>Context-Aware · Personalized</span>
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
  <div className={styles.showcaseContent} role="img" aria-label="Autonomous demo booking calendar showing a confirmed meeting with Tessera Labs">
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>Auto-Scheduled Meeting</span>
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
          <span className={styles.successTitle}>Meeting Booked Autonomously</span>
          <span className={styles.successSub}>Calendar invite sent to all attendees</span>
        </div>
      </div>
    </div>
  </div>
)

const KANBAN_COLUMNS = [
  { title: 'New Lead', dot: '#4da8da', cards: [
    { name: 'Arjun Mehta', company: 'Tessera Labs', meta: 'Added from YC batch' },
    { name: 'Sophie Keller', company: 'Crossbeam SaaS', meta: 'Added from YC batch' },
    { name: 'Nikhil Rao', company: 'Heron Analytics', meta: 'Added from YC batch' },
  ]},
  { title: 'Contacted', dot: '#a78bfa', cards: [
    { name: 'Clara Voss', company: 'Relay.xyz', meta: 'LinkedIn message sent' },
    { name: 'Tomás Aguilar', company: 'Compvox', meta: 'Follow-up email sent' },
  ]},
  { title: 'Replied', dot: '#fb923c', cards: [
    { name: 'Marcus Chen', company: 'Firelane', meta: 'Interested in demo' },
  ]},
  { title: 'Qualified', dot: '#34d399', cards: [
    { name: 'Lena Strickland', company: 'Bridgepoint', meta: 'Demo booked Feb 18' },
    { name: 'Viktor Jansen', company: 'SoleFire', meta: 'Pricing discussion' },
  ]},
]

const GlimpsePipeline = () => (
  <div className={styles.showcaseContent} role="img" aria-label="Real-time sales pipeline kanban board showing leads across New, Contacted, Replied, and Qualified stages">
    <div className={styles.showcaseInnerHeader}>
      <span className={styles.showcaseInnerTitle}>Sales Pipeline</span>
      <span className={styles.showcaseSubLabel}>↔ Auto-Updated</span>
    </div>
    <div className={styles.kanbanBoard}>
      {KANBAN_COLUMNS.map((col) => (
        <div className={styles.kanbanCol} key={col.title}>
          <div className={styles.kanbanColHeader}>
            <span className={styles.kanbanColTitle}>
              <span className={styles.kanbanDot} style={{ background: col.dot }} />
              {col.title}
            </span>
            <span className={styles.kanbanCount}>{col.cards.length}</span>
          </div>
          {col.cards.map((card, i) => (
            <div className={styles.kanbanCard} key={i}>
              <div className={styles.kanbanCardName}>{card.name}</div>
              <div className={styles.kanbanCardCompany}>{card.company}</div>
              <div className={styles.kanbanCardMeta}>{card.meta}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)

const SHOWCASE_COMPONENTS = [GlimpseCrawl, GlimpseScore, GlimpseEmail, GlimpseBooking, GlimpsePipeline]

/* ===== MAIN COMPONENT ===== */

const HowItWorks = () => {
  const navigate = useNavigate()
  const headerReveal = useScrollReveal({ threshold: 0.2 })
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isLockedRef = useRef(false)
  const activeStepRef = useRef(0)
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const engagedRef = useRef(false)
  const isSnappingRef = useRef(false)
  const justReleasedRef = useRef(false) // prevents immediate re-engagement

  useEffect(() => {
    activeStepRef.current = activeStep
  }, [activeStep])

  // ── Helper: advance or retreat one step ──
  const advanceStep = (direction: 'down' | 'up') => {
    if (isLockedRef.current) return
    isLockedRef.current = true

    const step = activeStepRef.current
    const nextStep = direction === 'down'
      ? Math.min(STEPS.length - 1, step + 1)
      : Math.max(0, step - 1)

    setActiveStep(nextStep)
    activeStepRef.current = nextStep

    if (cooldownTimer.current) clearTimeout(cooldownTimer.current)
    cooldownTimer.current = setTimeout(() => {
      isLockedRef.current = false
    }, 600)
  }

  // ── Release helper ──
  const releaseScroll = () => {
    engagedRef.current = false
    justReleasedRef.current = true
    setTimeout(() => { justReleasedRef.current = false }, 1200)
  }

  // ── Wheel-hijack ──
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleWheel = (e: WheelEvent) => {
      if (isSnappingRef.current) {
        e.preventDefault()
        return
      }

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const step = activeStepRef.current
      const scrollingDown = e.deltaY > 0
      const scrollingUp = e.deltaY < 0

      // ── NOT ENGAGED ──
      if (!engagedRef.current) {
        // Don't re-engage right after releasing
        if (justReleasedRef.current) return

        // Scrolling DOWN: engage when section top enters viewport
        if (scrollingDown && rect.top > 0 && rect.top < vh * 0.7) {
          engagedRef.current = true
          setActiveStep(0)
          activeStepRef.current = 0
          e.preventDefault()
          isSnappingRef.current = true
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => { isSnappingRef.current = false }, 800)
          return
        }

        // Scrolling UP: engage when section is partially above viewport
        if (scrollingUp && rect.top < 0 && rect.bottom > vh * 0.3) {
          engagedRef.current = true
          setActiveStep(STEPS.length - 1)
          activeStepRef.current = STEPS.length - 1
          e.preventDefault()
          isSnappingRef.current = true
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => { isSnappingRef.current = false }, 800)
          return
        }

        return
      }

      // ── ENGAGED ──

      // Release DOWN: at last step, let scroll continue
      if (scrollingDown && step === STEPS.length - 1) {
        releaseScroll()
        return
      }

      // Release UP: at first step, let scroll continue
      if (scrollingUp && step === 0) {
        releaseScroll()
        return
      }

      // Otherwise block scroll and step
      e.preventDefault()
      advanceStep(scrollingDown ? 'down' : 'up')
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current)
    }
  }, [])

  // ── Touch support ──
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!engagedRef.current) return
      const step = activeStepRef.current
      const deltaY = touchStartY - e.touches[0].clientY
      if (deltaY > 0 && step === STEPS.length - 1) return
      if (deltaY < 0 && step === 0) return
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSnappingRef.current) return

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const deltaY = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(deltaY) < 50) return

      const scrollingDown = deltaY > 0
      const scrollingUp = deltaY < 0

      if (!engagedRef.current) {
        if (justReleasedRef.current) return
        if (scrollingDown && rect.top > 0 && rect.top < vh * 0.7) {
          engagedRef.current = true
          setActiveStep(0)
          activeStepRef.current = 0
          isSnappingRef.current = true
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => { isSnappingRef.current = false }, 800)
          return
        }
        return
      }

      const step = activeStepRef.current
      if (scrollingDown && step === STEPS.length - 1) { releaseScroll(); return }
      if (scrollingUp && step === 0) { releaseScroll(); return }

      advanceStep(scrollingDown ? 'down' : 'up')
    }

    section.addEventListener('touchstart', handleTouchStart, { passive: true })
    section.addEventListener('touchmove', handleTouchMove, { passive: false })
    section.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      section.removeEventListener('touchstart', handleTouchStart)
      section.removeEventListener('touchmove', handleTouchMove)
      section.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Click a step card to jump directly
  const handleStepClick = (index: number) => {
    if (index === activeStep) return
    setActiveStep(index)
    activeStepRef.current = index
  }

  return (
    <section
      className={styles.section}
      id="how-it-works"
      ref={sectionRef}
      aria-label="How GTMer's autonomous outbound pipeline works in 5 steps"
    >
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <div className={styles.badgeInner}>
            <span className={styles.badgeDot} />
            <span>Autonomous Outbound Pipeline</span>
          </div>
        </div>

        <h2 className={styles.headline}>
          <span className={styles.headlineAccent}>How GTMer Works:</span>{' '}
          From Data to Booked Meeting
        </h2>

        <p className={styles.subtext}>
          GTMer runs your entire outbound sales pipeline autonomously — prospecting, enrichment,
          personalized outreach, and meeting booking — without any manual effort from your team.
        </p>
      </div>

      {/* ===== SHOWCASE — The Main Stage ===== */}
      <div className={styles.showcaseArea}>
        {/* Showcase stage label — crossfades on step change */}
        <div className={styles.stageLabelWrap} key={`label-${activeStep}`}>
          <div className={styles.showcaseStageLabel}>
            <span className={styles.showcaseStageBadge}>{STEPS[activeStep].label}</span>
            <span className={styles.showcaseStageIcon} aria-hidden="true">{STEPS[activeStep].icon}</span>
            <h3 className={styles.showcaseStageTitle}>{STEPS[activeStep].title}</h3>
          </div>
          <p className={styles.showcaseDescription}>{STEPS[activeStep].body}</p>
        </div>

        {/* The white showcase panel — horizontal slide track */}
        <div className={styles.showcasePanel}>
          <div
            className={styles.slideTrack}
            style={{ transform: `translateX(-${activeStep * 100}%)` }}
          >
            {SHOWCASE_COMPONENTS.map((Comp, i) => (
              <div className={styles.slide} key={i}>
                <Comp />
              </div>
            ))}
          </div>
        </div>

        {/* Slide dot indicators */}
        <div className={styles.slideDots} aria-hidden="true">
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`${styles.slideDot} ${i === activeStep ? styles.slideDotActive : ''}`}
              onClick={() => handleStepClick(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Decorative glow behind the showcase */}
        <div className={styles.showcaseGlow} />
      </div>

      {/* Step cards */}
      <div className={styles.stepNavigation}>
        <div className={styles.stepCards} role="tablist" aria-label="Pipeline steps">
          {STEPS.map((step, index) => (
            <div
              className={`${styles.stepCard} ${index === activeStep ? styles.stepCardActive : ''} ${index < activeStep ? styles.stepCardDone : ''}`}
              key={step.number}
              onClick={() => handleStepClick(index)}
              role="tab"
              tabIndex={0}
              aria-selected={index === activeStep}
              aria-label={`Step ${step.number}: ${step.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleStepClick(index)
                }
              }}
            >
              <span className={styles.stepCardNumber}>{step.number}</span>
              <span className={styles.stepCardIcon} aria-hidden="true">{step.icon}</span>
              <span className={styles.stepCardTitle}>{step.shortTitle}</span>
              <div className={styles.stepCardIndicator} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaWrapper}>
        <button
          className={styles.ctaButton}
          id="how-cta-explore"
          onClick={() => navigate('/product')}
          aria-label="See GTMer's full autonomous pipeline in action"
        >
          See the Full Pipeline in Action
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>
    </section>
  )
}

export default HowItWorks
