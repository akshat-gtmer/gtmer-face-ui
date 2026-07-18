import { Link, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconArrowRight, IconCheck } from '../Icons'
import styles from './ProductDashboard.module.css'



/* ===== VISUAL CARD DATA ===== */

interface MiniMetric {
  icon: string
  label: string
  value: string
}

const MINI_METRICS: MiniMetric[] = [
  { icon: '◎', label: 'Records', value: '2,847' },
  { icon: '⬡', label: 'Enriched', value: '1,204' },
  { icon: '△', label: 'Emails Sent', value: '847' },
  { icon: '◇', label: 'Demos Booked', value: '23' },
]

interface MiniPipelineRow {
  label: string
  width: string
  color: string
  count: number
}

const MINI_PIPELINE: MiniPipelineRow[] = [
  { label: 'Imported', width: '100%', color: '#3b82f6', count: 2847 },
  { label: 'Crawled', width: '85%', color: '#8b5cf6', count: 2420 },
  { label: 'Summarized', width: '82%', color: '#a855f7', count: 2334 },
  { label: 'Contacts Found', width: '60%', color: '#f59e0b', count: 1708 },
  { label: 'Drafts Ready', width: '42%', color: '#06b6d4', count: 1204 },
  { label: 'Sent', width: '30%', color: '#10b981', count: 847 },
]

interface MiniLead {
  initials: string
  name: string
  company: string
  fit: number
  status: string
  statusColor: string
}

const MINI_LEADS: MiniLead[] = [
  { initials: 'KL', name: 'Klenty', company: 'klenty.com', fit: 75, status: 'Approved', statusColor: '#10b981' },
  { initials: 'PO', name: 'Postman', company: 'postman.com', fit: 80, status: 'Approved', statusColor: '#10b981' },
  { initials: 'AM', name: 'Amagi', company: 'amagi.com', fit: 35, status: 'Draft', statusColor: '#f59e0b' },
  { initials: 'OB', name: 'Observe.AI', company: 'observe.ai', fit: 45, status: 'Pending', statusColor: '#94a3b8' },
  { initials: 'SC', name: 'Scapic', company: 'scapic.com', fit: 55, status: 'Draft', statusColor: '#f59e0b' },
]

interface WorkerAgent {
  name: string
  description: string
  status: string
}

const WORKER_AGENTS: WorkerAgent[] = [
  { name: 'Crawl Worker', description: 'Scrapes and indexes target company websites', status: 'Active' },
  { name: 'Summary Worker', description: 'Generates AI research dossier per company', status: 'Active' },
  { name: 'Contact Worker', description: 'Discovers & verifies decision-maker emails', status: 'Active' },
  { name: 'Email Draft Worker', description: 'Writes unique, context-rich outreach per lead', status: 'Active' },
  { name: 'Email Send Worker', description: 'Sends approved emails with tracking & analytics', status: 'Active' },
]

const PLATFORM_FEATURES = [
  {
    title: 'Project-Based Workflow',
    desc: 'Organize leads into projects. Each project runs its own pipeline — import, crawl, research, draft, send. Track everything in one view.',
    result: 'Teams manage 10+ campaigns simultaneously without context switching',
  },
  {
    title: '5-Worker Automation Pipeline',
    desc: 'Five autonomous AI workers process every lead: Crawl → Summarize → Find Contacts → Draft Email → Send. Each runs independently, scales infinitely.',
    result: '4 hours of manual SDR work compressed into 90 seconds per lead',
  },
  {
    title: 'Soul Setup — Brand Voice Engine',
    desc: 'Configure your company positioning, tone of voice, and key differentiators once. Every email draft is written in your brand\'s voice, not generic AI-speak.',
    result: 'Emails sound like your best rep wrote them, not a chatbot',
  },
  {
    title: 'AI Research Summaries',
    desc: 'For every company in your list, GTMer generates a deep-dive research brief — recent news, product launches, funding, team growth — used to personalize every email.',
    result: '18% avg. reply rates because every email references real context',
  },
  {
    title: 'Competitor Analysis',
    desc: 'Side-by-side competitor positioning tool. Understand how you stack up, sharpen your messaging, and identify gaps your outreach can exploit.',
    result: 'Better positioning = higher conversion on every touchpoint',
  },
  {
    title: 'Market Intelligence',
    desc: 'On-demand AI research reports about any market, technology, or company. Generate intelligence briefs that inform your ICP definition and outreach strategy.',
    result: 'Find untapped segments your competitors aren\'t reaching',
  },
]

const AI_TOOLS = [
  { title: 'Chatbot Builder', desc: 'Build an AI chatbot trained on your product to capture inbound leads and answer prospect questions 24/7.' },
  { title: 'Website Tracking', desc: 'See which companies visit your website, what pages they read, and trigger automated outreach based on intent signals.' },
  { title: 'Email Analytics', desc: 'Track opens, clicks, replies, and bounce rates per campaign. See which subject lines and email bodies perform best.' },
  { title: 'Demo Booking', desc: 'Prospects who reply positively are auto-routed to your calendar. No back-and-forth scheduling — just booked meetings.' },
]

const CHECKLIST = [
  'Upload 25 companies → get 25 personalized emails in under 10 minutes',
  'Every email references real company context (funding, launches, hires)',
  'Fit scoring filters out bad-fit leads before any outreach happens',
  'Approve/edit/regenerate any draft before it sends',
  'Full email tracking: opens, clicks, replies, bounce rates',
  'Competitor analysis tool for sharper positioning in every email',
  'Inbound chatbot + website visitor tracking for warm lead capture',
  'One dashboard view: drafts, sent, opens, clicks, demos booked',
]

/* ===== COMPONENT ===== */

const ProductDashboard = () => {
  const navigate = useNavigate()
  return (
    <article className={styles.page} aria-label="GTMer Product — Autonomous Outbound Pipeline">
      {/* Breadcrumb for crawlers */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">GTMer</a></li>
          <li aria-current="page">Product</li>
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'GTMer Product — Autonomous Outbound Pipeline That Books Meetings',
            description: 'Upload a target list. GTMer\'s 5 AI workers crawl each company, research them, find contacts, and draft hyper-personalized emails. Teams see 18% reply rates and 10× more pipeline.',
            url: 'https://gtmer.ai/product',
            isPartOf: { '@type': 'WebSite', name: 'GTMer', url: 'https://gtmer.ai' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'GTMer', item: 'https://gtmer.ai/' },
                { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://gtmer.ai/product' },
              ],
            },
          }),
        }}
      />

      {/* Back button */}
      <div className={styles.backBar}>
        <Link to="/" className={styles.backButton}>
          <span className={styles.backArrow}><IconArrowLeft size={14} /></span>
          Back to <span className={styles.backSlash}>/</span>gtmer
        </Link>
      </div>

      {/* ===== Hero Section ===== */}
      <div className={styles.heroSection}>

        {/* Text side */}
        <div className={styles.textBlock}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⊞</span>
            <div className={styles.badgeTextGroup}>
              <span className={styles.badgeLabel}>GTMer Platform</span>
              <span className={styles.badgeSub}>What You Get</span>
            </div>
          </div>

          <h1 className={styles.headline}>
            The outbound engine that
            <span className={styles.headlineAccent}>
              {' '}replaces your SDR team.
            </span>
          </h1>

          <p className={styles.subtext}>
            Upload 25 companies. Get 25 hyper-personalized emails — each referencing
            that company's actual product launches, funding rounds, and team changes.
            Approve the drafts. GTMer sends them with full tracking. That's it.
          </p>

          <Link
            className={styles.ctaButton}
            to="/signup"
          >
            Start Free — No Card Required
            <span className={styles.ctaArrow}><IconArrowRight size={14} /></span>
          </Link>

          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>5</span>
              <span className={styles.miniStatLabel}>AI Workers</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>18%</span>
              <span className={styles.miniStatLabel}>Reply Rate</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>90s</span>
              <span className={styles.miniStatLabel}>Per Lead</span>
            </div>
          </div>
        </div>

        {/* ===== VISUAL CARD — Dashboard Preview ===== */}
        <div className={styles.vizBlock}>
          <div className={styles.vizCard}>
            {/* Card chrome */}
            <div className={styles.vizHeader}>
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <span className={styles.vizTitle}>gtmer / workflow · GTMer-Bangalore</span>
              <span className={styles.vizLive}>● Workers Running</span>
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
              <div className={styles.vizPipelineTitle}>Worker Pipeline Progress</div>
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
                <span style={{ flex: 1.2 }}>Company</span>
                <span style={{ flex: 1 }}>Domain</span>
                <span style={{ flex: 0.5 }}>Fit</span>
                <span style={{ flex: 0.7 }}>Status</span>
              </div>
              {MINI_LEADS.map(lead => (
                <div key={lead.name} className={styles.vizTableRow}>
                  <div className={styles.vizLeadCell} style={{ flex: 1.2 }}>
                    <span className={styles.vizAvatar}>{lead.initials}</span>
                    <span className={styles.vizLeadName}>{lead.name}</span>
                  </div>
                  <span className={styles.vizCompany} style={{ flex: 1 }}>{lead.company}</span>
                  <span className={styles.vizIntent} style={{ flex: 0.5 }}>{lead.fit}</span>
                  <span style={{ flex: 0.7 }}>
                    <span className={styles.vizStage} style={{ color: lead.statusColor, background: `${lead.statusColor}12`, borderColor: `${lead.statusColor}25` }}>
                      <span className={styles.vizStageDot} style={{ background: lead.statusColor }} />
                      {lead.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Worker agents feed */}
            <div className={styles.vizFeed}>
              <div className={styles.vizFeedTitle}>AI Worker Agents</div>
              {WORKER_AGENTS.map((a, i) => (
                <div key={i} className={styles.vizFeedLine}>
                  <span className={styles.vizFeedDot} style={{ background: '#22c55e' }} />
                  <span className={styles.vizFeedAgent} style={{ color: '#1a1a1a' }}>{a.name}</span>
                  <span className={styles.vizFeedAction}>{a.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Platform Features ===== */}
      <div className={styles.bottomSection}>

        {/* Features grid */}
        <div className={styles.capabilitiesBlock}>
          <h3 className={styles.capabilitiesHeadline}>What GTMer Gives You</h3>
          <div className={styles.capabilitiesGrid}>
            {PLATFORM_FEATURES.map(feat => (
              <div className={styles.capabilityCard} key={feat.title}>
                <div className={styles.capabilityTitle}>{feat.title}</div>
                <div className={styles.capabilitySub}>{feat.desc}</div>
                <div className={styles.capabilityResult}>↳ {feat.result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tools */}
        <div className={styles.capabilitiesBlock}>
          <h3 className={styles.capabilitiesHeadline}>Built-In AI Tools</h3>
          <div className={styles.capabilitiesGrid}>
            {AI_TOOLS.map(tool => (
              <div className={styles.capabilityCard} key={tool.title}>
                <div className={styles.capabilityTitle}>{tool.title}</div>
                <div className={styles.capabilitySub}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className={styles.checklistBlock}>
          <h3 className={styles.checklistHeadline}>What You Can Expect</h3>
          <ul className={styles.checklist}>
            {CHECKLIST.map(item => (
              <li className={styles.checklistItem} key={item}>
                <span className={styles.checkIcon}><IconCheck size={12} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </article>
  )
}

export default ProductDashboard
