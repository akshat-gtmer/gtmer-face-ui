import styles from './IntegrationsPage.module.css'

interface IntegrationsPageProps {
  onBack: () => void
}

interface Integration {
  code: string
  name: string
  desc: string
  status: 'live' | 'beta' | 'soon'
}

const CATEGORIES: { title: string; items: Integration[] }[] = [
  {
    title: 'CRM & Sales',
    items: [
      { code: 'SF', name: 'Salesforce', desc: 'Bi-directional sync, custom objects', status: 'live' },
      { code: 'HS', name: 'HubSpot', desc: 'Contacts, deals, sequences', status: 'live' },
      { code: 'PD', name: 'Pipedrive', desc: 'Leads, activities, pipeline', status: 'live' },
      { code: 'CL', name: 'Close', desc: 'Contacts and sequences', status: 'beta' },
    ],
  },
  {
    title: 'Data Providers',
    items: [
      { code: 'AP', name: 'Apollo', desc: 'Contact and company data', status: 'live' },
      { code: 'ZI', name: 'ZoomInfo', desc: 'B2B intelligence', status: 'live' },
      { code: 'CB', name: 'Clearbit', desc: 'Enrichment API', status: 'live' },
      { code: 'LI', name: 'LinkedIn', desc: 'Profile and company data', status: 'live' },
      { code: 'HU', name: 'Hunter.io', desc: 'Email verification', status: 'live' },
      { code: 'CR', name: 'Crunchbase', desc: 'Funding and company intel', status: 'live' },
    ],
  },
  {
    title: 'Intent & Signals',
    items: [
      { code: 'G2', name: 'G2', desc: 'Buyer intent signals', status: 'live' },
      { code: 'BO', name: 'Bombora', desc: 'Surge intent data', status: 'live' },
      { code: '6S', name: '6sense', desc: 'Account identification', status: 'soon' },
      { code: 'DG', name: 'DemandBase', desc: 'ABM intent signals', status: 'soon' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { code: 'SL', name: 'Slack', desc: 'Notifications and alerts', status: 'live' },
      { code: 'GM', name: 'Gmail', desc: 'Email sending and tracking', status: 'live' },
      { code: 'OL', name: 'Outlook', desc: 'Email integration', status: 'live' },
      { code: 'CA', name: 'Calendly', desc: 'Meeting scheduling', status: 'beta' },
    ],
  },
  {
    title: 'Analytics & Ops',
    items: [
      { code: 'SE', name: 'Segment', desc: 'Event tracking', status: 'beta' },
      { code: 'NT', name: 'Notion', desc: 'Workspace sync', status: 'live' },
      { code: 'ZP', name: 'Zapier', desc: '5000+ app connections', status: 'live' },
      { code: 'WH', name: 'Webhooks', desc: 'Custom HTTP callbacks', status: 'live' },
    ],
  },
]

const STATUS_LABELS = { live: 'Live', beta: 'Beta', soon: 'Coming Soon' }
const STATUS_COLORS = { live: '#34d399', beta: '#f59e0b', soon: '#8ba4bd' }

const IntegrationsPage = ({ onBack }: IntegrationsPageProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.backBar}>
        <button className={styles.backButton} onClick={onBack}>
          <span className={styles.backArrow}>←</span>
          Back to <span className={styles.backSlash}>/</span>gtmer
        </button>
      </div>

      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Integration Ecosystem</span>
        </div>
        <h2 className={styles.headline}>
          Connects To
          <span className={styles.headlineAccent}> Everything.</span>
        </h2>
        <p className={styles.subtext}>
          GTMer plugs into your existing stack. CRMs, data providers, intent
          platforms, communication tools — all connected out of the box.
        </p>
      </div>

      {/* Categories */}
      {CATEGORIES.map(cat => (
        <div key={cat.title} className={styles.category}>
          <h3 className={styles.categoryTitle}>{cat.title}</h3>
          <div className={styles.integrationGrid}>
            {cat.items.map(item => (
              <div key={item.name} className={styles.integrationCard}>
                <div className={styles.integrationTop}>
                  <span className={styles.integrationCode}>{item.code}</span>
                  <span
                    className={styles.statusBadge}
                    style={{ color: STATUS_COLORS[item.status], borderColor: `${STATUS_COLORS[item.status]}40` }}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
                <div className={styles.integrationName}>{item.name}</div>
                <div className={styles.integrationDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.bottomNote}>
        <p>Don't see your tool? We build custom integrations.</p>
        <a href="mailto:akshat@gtmer.ai?subject=Integration%20Request" className={styles.bottomLink}>
          Request an Integration →
        </a>
      </div>
    </div>
  )
}

export default IntegrationsPage
