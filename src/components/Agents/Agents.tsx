import { Link } from 'react-router-dom'
import { IconBarChart, IconBolt, IconMail, IconRefresh, IconTarget, IconCpu, IconBot, IconArrowLeft, IconArrowRight } from '../Icons'
import styles from './Agents.module.css'



/* ===== NETWORK NODES ===== */

const NODES = [
  { id: 'data',     label: 'Data',     x: 50, y: 15,  cls: 'nodeData' },
  { id: 'enrich',   label: 'Enrich',   x: 22, y: 55,  cls: 'nodeEnrich' },
  { id: 'score',    label: 'Score',     x: 55, y: 50,  cls: 'nodeScore' },
  { id: 'outreach', label: 'Outreach',  x: 78, y: 40,  cls: 'nodeOutreach' },
  { id: 'action1',  label: 'Action',    x: 30, y: 90,  cls: 'nodeAction' },
  { id: 'action2',  label: 'Followup',  x: 60, y: 88,  cls: 'nodeAction' },
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 2], [2, 3], [1, 4], [2, 5], [3, 5], [4, 5],
]

/* ===== AGENT TYPES ===== */

interface AgentType {
  icon: React.ReactNode
  iconClass: string
  title: string
  desc: string
  features: string[]
}

const AGENT_TYPES: AgentType[] = [
  {
    icon: <IconBarChart size={18} />,
    iconClass: 'iconBlue',
    title: 'Data Agent',
    desc: 'Continuously monitors target markets and collects intelligence specific to your ICP — from niche data sources standard platforms don\'t cover.',
    features: ['Custom data source integration', 'Domain-specific intelligence', 'Real-time account monitoring'],
  },
  {
    icon: <IconBolt size={18} />,
    iconClass: 'iconGreen',
    title: 'Prospecting Agent',
    desc: 'Identifies prospects matching highly specific criteria unique to your market — niche verticals, specialised roles, or complex qualification logic.',
    features: ['Niche market prospecting', 'Multi-stage qualification', 'Partner ecosystem identification'],
  },
  {
    icon: <IconMail size={18} />,
    iconClass: 'iconPurple',
    title: 'Outreach Agent',
    desc: 'Generates outreach calibrated to your unique brand voice, specific offer, and target persona — not generic AI copy.',
    features: ['Brand voice calibration', 'Technical persona messaging', 'Multi-product outreach'],
  },
  {
    icon: <IconRefresh size={18} />,
    iconClass: 'iconOrange',
    title: 'Nurture Agent',
    desc: 'Manages complex, long-cycle B2B nurture sequences with content personalised to each prospect\'s stage and behaviour.',
    features: ['Long-cycle B2B nurture', 'Event-triggered sequences', 'Multi-stakeholder coordination'],
  },
  {
    icon: <IconTarget size={18} />,
    iconClass: 'iconPink',
    title: 'Conversion Agent',
    desc: 'Monitors active deals for risk signals and takes targeted action to prevent pipeline from going dark.',
    features: ['Deal health monitoring', 'Re-engagement sequences', 'Stakeholder multi-threading'],
  },
  {
    icon: <IconCpu size={18} />,
    iconClass: 'iconCyan',
    title: 'Custom Agent',
    desc: 'Any GTM function you need automated — if it can be defined, we can build an agent for it.',
    features: ['Any custom workflow', 'Proprietary data integration', 'Unique business logic'],
  },
]

/* ===== COMPONENT ===== */

const Agents = () => {
  return (
    <article className={styles.page} aria-label="GTMer AI Agents — Custom-Built SDR Agents">
      {/* Breadcrumb for crawlers */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">GTMer</a></li>
          <li aria-current="page">AI Agents</li>
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'GTMer AI Agents — Custom-Built SDR Agents for Your GTM Workflow',
            description: 'GTMer builds custom AI agents tailored to your exact GTM workflow — prospecting, enrichment, outreach, nurturing, and conversion.',
            url: 'https://gtmer.ai/agents',
            isPartOf: { '@type': 'WebSite', name: 'GTMer', url: 'https://gtmer.ai' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'GTMer', item: 'https://gtmer.ai/' },
                { '@type': 'ListItem', position: 2, name: 'AI Agents', item: 'https://gtmer.ai/agents' },
              ],
            },
          }),
        }}
      />

      {/* Back button */}
      <div className={styles.backBar}>
        <Link to="/" className={styles.backButton}>
          <span className={styles.backArrow}><IconArrowLeft size={14} /></span>
          Back to /gtmer
        </Link>
      </div>

      {/* ===== Hero Section ===== */}
      <div className={styles.heroSection}>

        {/* Text side */}
        <div className={styles.textBlock}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}><IconBot size={16} /></span>
            <span className={styles.badgeLabel}>Custom AI Agents</span>
          </div>

          <h1 className={styles.headline}>
            Built Specifically.
            <span className={styles.headlineAccent}>For Your GTM.</span>
          </h1>

          <p className={styles.subtext}>
            Not every GTM challenge fits a standard template. We build fully
            custom AI agents tailored to your exact workflow, data sources,
            and market. If it can be defined, we can automate it.
          </p>

          <button className={styles.ctaButton}>
            Tell Us Your Use Case
            <span className={styles.ctaArrow}><IconArrowRight size={14} /></span>
          </button>

          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>2–4 wks</span>
              <span className={styles.miniStatLabel}>Avg build time</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>100%</span>
              <span className={styles.miniStatLabel}>Custom built</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>Any</span>
              <span className={styles.miniStatLabel}>GTM workflow</span>
            </div>
          </div>
        </div>

        {/* Visualization side */}
        <div className={styles.vizBlock}>
          <div className={styles.vizWindow}>
            <div className={styles.vizHeader}>
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <span className={styles.vizTitle}>agent-network / active</span>
              <span className={styles.vizStatus}>● LIVE</span>
            </div>

            <div className={styles.networkCanvas}>
              <svg className={styles.edgesSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                {EDGES.map(([from, to], i) => (
                  <line
                    key={i}
                    className={styles.edgeLine}
                    x1={`${NODES[from].x}%`}
                    y1={`${NODES[from].y}%`}
                    x2={`${NODES[to].x}%`}
                    y2={`${NODES[to].y}%`}
                    stroke="rgba(77, 168, 218, 0.25)"
                    strokeWidth="0.4"
                  />
                ))}
              </svg>

              {NODES.map((node) => (
                <div
                  key={node.id}
                  className={`${styles.node} ${styles[node.cls]}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className={styles.nodeCircle}>
                    {node.id === 'data' && '⊕'}
                    {node.id === 'enrich' && '⧫'}
                    {node.id === 'score' && '▲'}
                    {node.id === 'outreach' && '⊳'}
                    {node.id === 'action1' && '◆'}
                    {node.id === 'action2' && '◇'}
                  </div>
                  <span className={styles.nodeLabel}>{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ===== Agent Types Section ===== */}
      <div className={styles.agentTypesSection}>
        <h2 className={styles.typesHeadline}>Agent Types</h2>
        <p className={styles.typesSubtext}>
          Six purpose-built agent types — or we build one entirely from scratch for
          your use case.
        </p>

        <div className={styles.typesGrid}>
          {AGENT_TYPES.map((agent) => (
            <div className={styles.typeCard} key={agent.title}>
              <div className={`${styles.typeCardIcon} ${styles[agent.iconClass]}`}>
                {agent.icon}
              </div>
              <h3 className={styles.typeCardTitle}>{agent.title}</h3>
              <p className={styles.typeCardDesc}>{agent.desc}</p>
              <ul className={styles.typeCardFeatures}>
                {agent.features.map((feat) => (
                  <li className={styles.typeCardFeature} key={feat}>
                    <span className={styles.featureDot}>•</span> {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </article>
  )
}

export default Agents
