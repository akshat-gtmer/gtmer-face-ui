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

/* ===== GLIMPSE SUB-COMPONENTS ===== */

const GlimpseQuickLaunch = () => (
  <div className={styles.glimpse}>
    <div className={styles.glimpseHeader}>
      <span className={styles.glimpseTitle}>Quick Launch</span>
      <span className={styles.glimpseSubtitle}>New Campaign</span>
    </div>
    <div className={styles.launchForm}>
      <div className={styles.launchField}>
        <span className={styles.launchLabel}>Source</span>
        <div className={styles.launchSelect}>
          <span>YC W25 Batch</span>
          <span className={styles.launchChevron}>▾</span>
        </div>
      </div>
      <div className={styles.launchField}>
        <span className={styles.launchLabel}>ICP</span>
        <div className={styles.launchSelect}>
          <span>B2B SaaS · Seed–A</span>
          <span className={styles.launchChevron}>▾</span>
        </div>
      </div>
      <div className={styles.launchProgress}>
        <div className={styles.launchProgressBar}>
          <div className={styles.launchProgressFill} />
        </div>
        <span className={styles.launchProgressLabel}>3 agents ready</span>
      </div>
      <div className={styles.launchBtn}>Deploy Agent →</div>
    </div>
  </div>
)

const GlimpseBuyingCommittee = () => (
  <div className={styles.glimpse}>
    <div className={styles.glimpseHeader}>
      <span className={styles.glimpseTitle}>Buying Committee</span>
      <span className={styles.glimpseSubtitle}>Bridgepoint Inc.</span>
    </div>
    <div className={styles.committeeList}>
      {[
        { initials: 'LS', name: 'Lena Strickland', role: 'VP Sales', intent: 'High', intentColor: '#16a34a' },
        { initials: 'RK', name: 'Raj Kumar', role: 'CTO', intent: 'Med', intentColor: '#f59e0b' },
        { initials: 'JW', name: 'James Wu', role: 'CFO', intent: 'Low', intentColor: '#94a3b8' },
        { initials: 'DM', name: 'Diana Miles', role: 'Head Ops', intent: 'High', intentColor: '#16a34a' },
      ].map((person, i) => (
        <div className={styles.committeeRow} key={i}>
          <div className={styles.committeeAvatar}>{person.initials}</div>
          <div className={styles.committeeInfo}>
            <span className={styles.committeeName}>{person.name}</span>
            <span className={styles.committeeRole}>{person.role}</span>
          </div>
          <span
            className={styles.committeeIntent}
            style={{ color: person.intentColor, borderColor: person.intentColor }}
          >
            {person.intent}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const GlimpseClientOverview = () => (
  <div className={styles.glimpse}>
    <div className={styles.glimpseHeader}>
      <span className={styles.glimpseTitle}>Client Overview</span>
      <span className={styles.glimpseSubtitle}>This Month</span>
    </div>
    <div className={styles.clientTable}>
      <div className={styles.clientTableHead}>
        <span>Client</span>
        <span>Leads</span>
        <span>Reply %</span>
        <span>Status</span>
      </div>
      {[
        { name: 'Acme Corp', leads: '342', reply: '14.2%', status: 'active' },
        { name: 'Finova', leads: '218', reply: '18.6%', status: 'active' },
        { name: 'Relaystack', leads: '156', reply: '21.1%', status: 'paused' },
      ].map((client, i) => (
        <div className={styles.clientTableRow} key={i}>
          <span className={styles.clientName}>{client.name}</span>
          <span className={styles.clientLeads}>{client.leads}</span>
          <span className={styles.clientReply}>{client.reply}</span>
          <span className={`${styles.clientStatus} ${styles[client.status]}`}>
            <span className={styles.clientStatusDot} />
          </span>
        </div>
      ))}
    </div>
  </div>
)

const GLIMPSES = [GlimpseQuickLaunch, GlimpseBuyingCommittee, GlimpseClientOverview]

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
        {USE_CASES.map((uc, index) => {
          const GlimpseComponent = GLIMPSES[index]
          return (
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

              {/* Platform UI Glimpse */}
              <GlimpseComponent />

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
          )
        })}
      </div>
    </section>
  )
}

export default UseCases
