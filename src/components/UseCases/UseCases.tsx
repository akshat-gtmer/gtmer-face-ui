import { useState, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { IconBolt, IconUsers, IconTarget, IconCheck, IconArrowRight } from '../Icons'
import styles from './UseCases.module.css'

/* ===== DATA ===== */

interface UseCase {
  icon: ReactNode
  tag: string
  title: string
  description: string
  bullets: string[]
  metric: string
  metricLabel: string
}

const USE_CASES: UseCase[] = [
  {
    icon: <IconBolt size={18} />,
    tag: 'B2B SAAS & STARTUPS',
    title: 'Build Pipeline Fast — Without Hiring',
    description:
      'You can\'t afford a 5-person SDR team. But you can run GTMer. Upload your target list, and the AI workers crawl, research, and write emails for every company. Teams go from zero outbound to qualified pipeline in under a week.',
    bullets: [
      'Import companies from YC batches, Product Hunt, or LinkedIn',
      'AI researches each company and writes unique, context-rich emails',
      'Fit scoring ensures your reps only talk to companies that match',
      'First qualified pipeline within 5 business days, not 5 months',
    ],
    metric: '10×',
    metricLabel: 'more pipeline vs. manual SDR',
  },
  {
    icon: <IconUsers size={18} />,
    tag: 'ENTERPRISE & MID-MARKET',
    title: 'Multi-Thread Deals Without Burning Out',
    description:
      'Enterprise deals involve 4-8 stakeholders and take 6+ months. GTMer maps the buying committee, finds every decision-maker\'s contact, and keeps all threads warm with personalized follow-ups — so nothing goes cold.',
    bullets: [
      'Research summaries generated for every company in your pipeline',
      'Multi-threaded outreach to champions, budget holders, and execs',
      'Each email references the prospect\'s actual business context',
      'Email analytics show exactly who opened, clicked, and replied',
    ],
    metric: '70%',
    metricLabel: 'lower customer acquisition cost',
  },
  {
    icon: <IconTarget size={18} />,
    tag: 'AGENCIES & CONSULTANCIES',
    title: 'Run 50 Client Campaigns From One Dashboard',
    description:
      'Running outbound for 10+ clients? GTMer gives you a multi-tenant workspace. Each client gets their own pipeline, brand voice (via Soul Setup), and email analytics. You manage everything from one dashboard.',
    bullets: [
      'Separate projects per client with isolated data and pipelines',
      'Soul Setup configures brand voice and positioning per client',
      'Full email analytics dashboards for transparent client reporting',
      'Scale to 50+ clients without adding ops headcount',
    ],
    metric: '50+',
    metricLabel: 'clients managed per operator',
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
      <div className={styles.launchBtn}>Deploy Agent <IconArrowRight size={12} /></div>
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
    <section
      className={styles.section}
      id="use-cases"
      aria-label="GTMer use cases for SaaS startups, enterprise sales, and agencies"
    >
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Use Cases by Team Type</span>
        </div>

        <h2 className={styles.headline}>
          Who Is GTMer For?
          <span className={styles.headlineAccent}> Real Results for Every Team.</span>
        </h2>

        <p className={styles.subtext}>
          Whether you're a startup needing pipeline fast, an enterprise team running complex deals,
          or an agency managing outbound for 50 clients — here's how teams like yours use GTMer
          to book more meetings and close more revenue.
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
                    <span className={styles.bulletCheck}><IconCheck size={12} /></span>
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

      {/* Bottom CTA */}
      <div className={styles.ctaWrapper}>
        <Link
          className={styles.ctaButton}
          id="usecases-cta-start"
          to="/signup"
        >
          Start Automating <IconArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}

export default UseCases
