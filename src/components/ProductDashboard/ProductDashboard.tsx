import styles from './ProductDashboard.module.css'

interface ProductDashboardProps {
  onBack: () => void
}

/* ===== VISUAL CARD DATA ===== */

interface MiniMetric {
  icon: string
  label: string
  value: string
}

const MINI_METRICS: MiniMetric[] = [
  { icon: '◎', label: 'Leads', value: '2,847' },
  { icon: '⬡', label: 'Enriched', value: '1,204' },
  { icon: '△', label: 'Sent', value: '847' },
  { icon: '◇', label: 'Booked', value: '23' },
]

interface MiniPipelineRow {
  label: string
  width: string
  color: string
  count: number
}

const MINI_PIPELINE: MiniPipelineRow[] = [
  { label: 'Sourced', width: '100%', color: '#3b82f6', count: 1204 },
  { label: 'Enriched', width: '82%', color: '#8b5cf6', count: 987 },
  { label: 'Contacted', width: '51%', color: '#f59e0b', count: 612 },
  { label: 'Replied', width: '15%', color: '#06b6d4', count: 184 },
  { label: 'Qualified', width: '7%', color: '#10b981', count: 89 },
  { label: 'Booked', width: '2%', color: '#f43f5e', count: 23 },
]

interface MiniLead {
  initials: string
  name: string
  company: string
  intent: number
  stage: string
  stageColor: string
}

const MINI_LEADS: MiniLead[] = [
  { initials: 'AM', name: 'Arjun Mehta', company: 'Tessera Labs', intent: 92, stage: 'Qualified', stageColor: '#10b981' },
  { initials: 'CV', name: 'Clara Voss', company: 'Relay.xyz', intent: 87, stage: 'Replied', stageColor: '#06b6d4' },
  { initials: 'SK', name: 'Sophie Keller', company: 'Crossbeam', intent: 84, stage: 'Contacted', stageColor: '#f59e0b' },
  { initials: 'MC', name: 'Marcus Chen', company: 'Firelane', intent: 91, stage: 'Qualified', stageColor: '#10b981' },
  { initials: 'LS', name: 'Lena Strickland', company: 'Bridgepoint', intent: 78, stage: 'Enriched', stageColor: '#8b5cf6' },
]

interface AgentLine {
  agent: string
  color: string
  action: string
}

const AGENT_LINES: AgentLine[] = [
  { agent: 'Scout', color: '#3b82f6', action: 'sourced 47 leads from YC W26' },
  { agent: 'Enricher', color: '#8b5cf6', action: 'enriched Tessera Labs (+6 fields)' },
  { agent: 'Writer', color: '#f59e0b', action: 'generated sequence for Clara Voss' },
  { agent: 'Sender', color: '#06b6d4', action: 'delivered email to marcus@firelane' },
]

const CHECKLIST = [
  'Universal data bucket — all your leads, contacts, and accounts in one live view',
  'Pipeline funnel with real-time conversion rates across every stage',
  'AI agent activity feed — see Scout, Enricher, Writer, and Sender working in real-time',
  'Intent scoring that surfaces your hottest prospects automatically',
  'Source attribution showing which channels drive the best leads',
  'Autonomous outreach sequences that adapt based on engagement signals',
  'Meeting scheduling that works — no back-and-forth, no friction',
  'Full enrichment with 100+ data sources, refreshed continuously',
]

const CAPABILITIES = [
  { icon: '◎', title: 'Unified Data Layer', sub: 'Every lead, every field, one view' },
  { icon: '⬡', title: 'Real-Time Enrichment', sub: '100+ sources, always fresh' },
  { icon: '△', title: 'Autonomous Outreach', sub: 'Personalized at scale' },
  { icon: '◇', title: 'Intent Detection', sub: 'Know who is ready to buy' },
  { icon: '⊞', title: 'Pipeline Intelligence', sub: 'Conversion insights, live' },
  { icon: '⊕', title: 'Agent Orchestration', sub: 'AI agents working 24/7' },
]

/* ===== COMPONENT ===== */

const ProductDashboard = ({ onBack }: ProductDashboardProps) => {
  return (
    <div className={styles.page}>

      {/* Back button */}
      <div className={styles.backBar}>
        <button className={styles.backButton} onClick={onBack}>
          <span className={styles.backArrow}>←</span>
          Back to <span className={styles.backSlash}>/</span>gtmer
        </button>
      </div>

      {/* ===== Hero Section ===== */}
      <div className={styles.heroSection}>

        {/* Text side */}
        <div className={styles.textBlock}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⊞</span>
            <div className={styles.badgeTextGroup}>
              <span className={styles.badgeLabel}>GTMer Product</span>
              <span className={styles.badgeSub}>Command Center</span>
            </div>
          </div>

          <h2 className={styles.headline}>
            Your Entire GTM Pipeline.
            <span className={styles.headlineAccent}>
              One Autonomous System.
            </span>
          </h2>

          <p className={styles.subtext}>
            A single command center where AI agents source, enrich, engage, and
            book meetings — autonomously. Every lead, every touchpoint, every
            conversion tracked in real-time. No manual work. No context switching.
          </p>

          <button
            className={styles.ctaButton}
            onClick={() => {
              onBack()
              setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300)
            }}
          >
            Start Automating
            <span className={styles.ctaArrow}>→</span>
          </button>

          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>6</span>
              <span className={styles.miniStatLabel}>AI Agents</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>100+</span>
              <span className={styles.miniStatLabel}>Data Sources</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>Real-time</span>
              <span className={styles.miniStatLabel}>Pipeline</span>
            </div>
          </div>
        </div>

        {/* ===== VISUAL CARD — White Dashboard Preview ===== */}
        <div className={styles.vizBlock}>
          <div className={styles.vizCard}>
            {/* Card chrome */}
            <div className={styles.vizHeader}>
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <span className={styles.vizTitle}>gtmer / command-center</span>
              <span className={styles.vizLive}>● LIVE</span>
            </div>

            {/* Mini metrics row */}
            <div className={styles.vizMetrics}>
              {MINI_METRICS.map(m => (
                <div key={m.label} className={styles.vizMetricItem}>
                  <span className={styles.vizMetricIcon}>{m.icon}</span>
                  <div className={styles.vizMetricText}>
                    <span className={styles.vizMetricValue}>{m.value}</span>
                    <span className={styles.vizMetricLabel}>{m.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini pipeline funnel */}
            <div className={styles.vizPipeline}>
              <div className={styles.vizPipelineTitle}>Leads Pipeline</div>
              {MINI_PIPELINE.map(row => (
                <div key={row.label} className={styles.vizPipelineRow}>
                  <div className={styles.vizPipelineBarWrap}>
                    <div
                      className={styles.vizPipelineBar}
                      style={{ width: row.width, background: `linear-gradient(90deg, ${row.color}, ${row.color}88)` }}
                    />
                  </div>
                  <span className={styles.vizPipelineDot} style={{ background: row.color }} />
                  <span className={styles.vizPipelineLabel}>{row.label}</span>
                  <span className={styles.vizPipelineCount}>{row.count.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Mini data table */}
            <div className={styles.vizTable}>
              <div className={styles.vizTableHead}>
                <span style={{ flex: 1.2 }}>Lead</span>
                <span style={{ flex: 1 }}>Company</span>
                <span style={{ flex: 0.5 }}>Intent</span>
                <span style={{ flex: 0.7 }}>Stage</span>
              </div>
              {MINI_LEADS.map(lead => (
                <div key={lead.name} className={styles.vizTableRow}>
                  <div className={styles.vizLeadCell} style={{ flex: 1.2 }}>
                    <span className={styles.vizAvatar}>{lead.initials}</span>
                    <span className={styles.vizLeadName}>{lead.name}</span>
                  </div>
                  <span className={styles.vizCompany} style={{ flex: 1 }}>{lead.company}</span>
                  <span className={styles.vizIntent} style={{ flex: 0.5 }}>{lead.intent}</span>
                  <span style={{ flex: 0.7 }}>
                    <span className={styles.vizStage} style={{ color: lead.stageColor, background: `${lead.stageColor}12`, borderColor: `${lead.stageColor}25` }}>
                      <span className={styles.vizStageDot} style={{ background: lead.stageColor }} />
                      {lead.stage}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Mini agent feed */}
            <div className={styles.vizFeed}>
              <div className={styles.vizFeedTitle}>Agent Activity</div>
              {AGENT_LINES.map((a, i) => (
                <div key={i} className={styles.vizFeedLine}>
                  <span className={styles.vizFeedDot} style={{ background: a.color }} />
                  <span className={styles.vizFeedAgent} style={{ color: a.color }}>{a.agent}</span>
                  <span className={styles.vizFeedAction}>{a.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Section ===== */}
      <div className={styles.bottomSection}>

        {/* Checklist */}
        <div className={styles.checklistBlock}>
          <h3 className={styles.checklistHeadline}>Everything in One Place</h3>
          <ul className={styles.checklist}>
            {CHECKLIST.map(item => (
              <li className={styles.checklistItem} key={item}>
                <span className={styles.checkIcon}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Capabilities grid */}
        <div className={styles.capabilitiesBlock}>
          <h3 className={styles.capabilitiesHeadline}>Core Capabilities</h3>
          <div className={styles.capabilitiesGrid}>
            {CAPABILITIES.map(cap => (
              <div className={styles.capabilityCard} key={cap.title}>
                <div className={styles.capabilityIcon}>{cap.icon}</div>
                <div className={styles.capabilityTitle}>{cap.title}</div>
                <div className={styles.capabilitySub}>{cap.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDashboard
