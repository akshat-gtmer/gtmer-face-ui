import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { IconSearch, IconTarget, IconMail, IconCalendar, IconBarChart, IconCheck, IconEdit, IconRefresh, IconArrowRight, IconArrowLeftRight } from '../Icons'
import styles from './HowItWorks.module.css'

const STEP_ICONS: ReactNode[] = [
  <IconSearch />,
  <IconTarget />,
  <IconMail />,
  <IconCalendar />,
  <IconBarChart />,
]

const STEPS = [
  {
    number: '01',
    label: 'STEP 01',
    title: 'Prospect Discovery',
    shortTitle: 'Discover',
    body: 'AI crawls 100+ B2B data sources daily — LinkedIn, Crunchbase, G2, job boards, and funding databases — to surface companies matching your Ideal Customer Profile.',
  },
  {
    number: '02',
    label: 'STEP 02',
    title: 'ICP Scoring & Enrichment',
    shortTitle: 'Score',
    body: 'Every prospect is enriched with firmographic, technographic, and intent signals, then scored against your ICP criteria. Only qualified leads advance to outreach.',
  },
  {
    number: '03',
    label: 'STEP 03',
    title: 'AI-Written Outreach',
    shortTitle: 'Engage',
    body: 'AI SDR agents craft unique, hyper-personalized emails and LinkedIn messages for each prospect — no templates, no copy-paste.',
  },
  {
    number: '04',
    label: 'STEP 04',
    title: 'Meeting Booking',
    shortTitle: 'Book',
    body: 'Engaged prospects are auto-scheduled into your team\'s calendar. Follow-ups, reply handling, and rescheduling — fully managed by the AI agent.',
  },
  {
    number: '05',
    label: 'STEP 05',
    title: 'Pipeline Tracking',
    shortTitle: 'Track',
    body: 'Every conversation is tracked in a real-time kanban board. Leads move automatically through stages so your team always knows pipeline status.',
  },
]

/* ===== SHOWCASE PANELS ===== */

const PanelDiscover = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Live Prospect Feed</span>
      <span className={styles.panelBadgeLive}><span className={styles.liveDot} />Crawling</span>
    </div>
    <div className={styles.panelRows}>
      {[
        { co: 'Tessera Labs', src: 'LinkedIn', n: '1,847', t: '2s ago' },
        { co: 'Heron Analytics', src: 'YC Batch', n: '942', t: '5s ago' },
        { co: 'Relay.xyz', src: 'Product Hunt', n: '3,210', t: '8s ago' },
        { co: 'Compvox AI', src: 'Crunchbase', n: '756', t: '12s ago' },
      ].map((r, i) => (
        <div className={styles.row} key={i}>
          <span className={styles.rowDot} />
          <span className={styles.rowName}>{r.co}</span>
          <span className={styles.rowTag}>{r.src}</span>
          <span className={styles.rowNum}>{r.n}</span>
          <span className={styles.rowTime}>{r.t}</span>
        </div>
      ))}
    </div>
    <div className={styles.panelStats}>
      <div><strong>12,847</strong><span>Prospects Today</span></div>
      <div><strong>100+</strong><span>Data Sources</span></div>
      <div><strong>98.2%</strong><span>Accuracy</span></div>
    </div>
  </div>
)

const PanelScore = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>ICP Scoring Engine</span>
      <span className={styles.panelSub}>Buyer Intent Analysis</span>
    </div>
    {[
      { init: 'AM', name: 'Arjun Mehta', role: 'CTO · Tessera Labs', score: 92, color: '#16a34a', chips: ['Uses Salesforce', 'Hiring 3 SDRs', 'B2B SaaS'] },
      { init: 'PS', name: 'Priya Sharma', role: 'VP Sales · Helix AI', score: 78, color: '#f59e0b', chips: ['HubSpot User', 'Expanding Team', '$8M ARR'] },
      { init: 'NP', name: 'Neel Patel', role: 'Founder · StackBridge', score: 45, color: '#94a3b8', chips: ['No CRM', 'Solo Founder', 'Pre-Revenue'] },
    ].map((l, i) => (
      <div className={styles.scoreRow} key={i}>
        <div className={styles.scoreAvatar} style={i === 1 ? { background: '#fce7f3', color: '#be185d' } : i === 2 ? { background: '#fef3c7', color: '#92400e' } : undefined}>{l.init}</div>
        <div className={styles.scoreInfo}>
          <span className={styles.scoreName}>{l.name}</span>
          <span className={styles.scoreRole}>{l.role}</span>
        </div>
        <div className={styles.scoreChips}>
          {l.chips.map((c, j) => <span key={j} className={styles.chip}>{c}</span>)}
        </div>
        <div className={styles.scoreVal} style={{ color: l.color }}>{l.score}</div>
      </div>
    ))}
  </div>
)

const PanelEngage = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>AI-Generated Email</span>
      <span className={styles.panelSub}>Context-Aware · Personalized</span>
    </div>
    <div className={styles.emailBlock}>
      <div className={styles.emailMeta}>
        <span className={styles.emailLabel}>To</span><span>arjun@tesseralabs.com</span>
      </div>
      <div className={styles.emailMeta}>
        <span className={styles.emailLabel}>Subj</span><span>Re: scaling outbound at <span className={styles.hl}>{'{{company}}'}</span></span>
      </div>
      <div className={styles.emailBody}>
        <p>Hi <span className={styles.hl}>{'{{first_name}}'}</span>,</p>
        <p>Noticed <span className={styles.hl}>{'{{company}}'}</span> just closed a Series A — congrats. Most teams at your stage hit a wall scaling outbound without a dedicated ops person.</p>
        <p>We've helped 3 similar B2B SaaS companies automate their entire pipeline — from data sourcing to demo booking — in under a week.</p>
        <p className={styles.emailSig}>Worth a 15-min chat?<br />— GTMER AI</p>
      </div>
      <div className={styles.emailActions}>
        <span className={styles.btnPrimary}><IconCheck /> Send</span>
        <span className={styles.btnOutline}><IconEdit /> Edit</span>
        <span className={styles.btnOutline}><IconRefresh /> Regenerate</span>
      </div>
    </div>
  </div>
)

const PanelBook = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Auto-Scheduled Meeting</span>
      <span className={styles.panelBadgeGreen}><IconCheck /> Confirmed</span>
    </div>
    <div className={styles.calRow}>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
        <div key={d} className={`${styles.calDay} ${i === 2 ? styles.calDayActive : ''}`}>
          <span className={styles.calLabel}>{d}</span>
          <span className={styles.calNum}>{14 + i}</span>
        </div>
      ))}
    </div>
    <div className={styles.meetingCard}>
      <div><strong>Demo with Tessera Labs</strong><br /><span className={styles.meetingTime}>Wed 16 · 2:00 PM EST · 30 min</span></div>
    </div>
    <div className={styles.meetingSuccess}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#16a34a" strokeWidth="2" /><path d="M7 12.5l3 3 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div><strong>Meeting Booked Autonomously</strong><br /><span className={styles.meetingTime}>Calendar invite sent to all attendees</span></div>
    </div>
  </div>
)

const PanelTrack = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Sales Pipeline</span>
      <span className={styles.panelSub}><IconArrowLeftRight /> Auto-Updated</span>
    </div>
    <div className={styles.kanban}>
      {[
        { title: 'New Lead', dot: '#4da8da', cards: ['Arjun Mehta', 'Sophie Keller', 'Nikhil Rao'] },
        { title: 'Contacted', dot: '#a78bfa', cards: ['Clara Voss', 'Tomás Aguilar'] },
        { title: 'Replied', dot: '#fb923c', cards: ['Marcus Chen'] },
        { title: 'Qualified', dot: '#34d399', cards: ['Lena Strickland', 'Viktor Jansen'] },
      ].map(col => (
        <div className={styles.kanbanCol} key={col.title}>
          <div className={styles.kanbanHeader}>
            <span className={styles.kanbanDot} style={{ background: col.dot }} />
            <span>{col.title}</span>
            <span className={styles.kanbanCount}>{col.cards.length}</span>
          </div>
          {col.cards.map((c, i) => <div className={styles.kanbanCard} key={i}>{c}</div>)}
        </div>
      ))}
    </div>
  </div>
)

const PANELS = [PanelDiscover, PanelScore, PanelEngage, PanelBook, PanelTrack]

/* ===== MAIN ===== */

const HowItWorks = () => {
  const navigate = useNavigate()
  const reveal = useScrollReveal({ threshold: 0.15 })
  const [active, setActive] = useState(0)
  const Panel = PANELS[active]

  return (
    <section
      className={styles.section}
      id="how-it-works"
      aria-label="How GTMer's autonomous outbound pipeline works in 5 steps"
    >
      <div ref={reveal.ref} className={`${styles.inner} ${reveal.isVisible ? styles.visible : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Autonomous Outbound Pipeline
          </div>
          <h2 className={styles.headline}>
            <span className={styles.accent}>How GTMer Works:</span> AI SDR in 5 Steps
          </h2>
          <p className={styles.sub}>
            GTM automation in action: AI SDR agents handle prospecting, enrichment, personalized outbound at scale, and meeting booking — fully autonomous.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {STEPS.map((s, i) => (
            <button
              key={s.number}
              className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
              onClick={() => setActive(i)}
              role="tab"
              aria-selected={i === active}
            >
              <span className={styles.tabNum}>{s.number}</span>
              <span className={styles.tabIcon}>{STEP_ICONS[i]}</span>
              <span className={styles.tabLabel}>{s.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Carousel body */}
        <div className={styles.carousel}>
          {/* Left: step info */}
          <div className={styles.stepInfo} key={`info-${active}`}>
            <span className={styles.stepBadge}>{STEPS[active].label}</span>
            <h3 className={styles.stepTitle}>{STEPS[active].title}</h3>
            <p className={styles.stepBody}>{STEPS[active].body}</p>
          </div>

          {/* Right: showcase panel */}
          <div className={styles.panel} key={`panel-${active}`}>
            <Panel />
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <button className={styles.ctaBtn} id="how-cta-explore" onClick={() => navigate('/product')}>
            See the Full Pipeline in Action <span className={styles.ctaArrow}><IconArrowRight /></span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
