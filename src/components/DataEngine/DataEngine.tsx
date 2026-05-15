import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconGlobe, IconLink, IconDollar, IconSettings, IconTarget, IconSend, IconArrowLeft, IconArrowRight, IconCheck, IconBarChart } from '../Icons'
import styles from './DataEngine.module.css'



/* ===== DATA ===== */

const CONTACT_FIELDS = [
  { label: 'Email', value: 'james.h@scaleforce.com' },
  { label: 'Title', value: 'VP of Sales' },
  { label: 'Company', value: 'ScaleForce Inc.' },
  { label: 'Funding', value: 'Series B — $12M' },
  { label: 'Tech Stack', value: 'HubSpot, Salesforce' },
  { label: 'Intent Score', value: 'High (87/100)' },
]

const CHECKLIST_ITEMS = [
  'Verified professional email addresses with deliverability scoring',
  'Direct phone numbers and LinkedIn profile URLs',
  'Firmographics: headcount, revenue, growth trajectory, funding stage',
  'Technographics: full tech stack detected from job postings and web signals',
  'Buying intent signals: active research topics and competitor evaluation',
  'Real-time data decay detection and automatic refresh',
  'Contact change monitoring (job changes, promotions, departures)',
  'News and trigger event monitoring per account',
]

interface SourceCard {
  icon: ReactNode
  iconClass: string
  title: string
  sub: string
}

const DATA_SOURCES: SourceCard[] = [
  { icon: <IconGlobe size={16} />, iconClass: 'srcIconBlue',   title: 'Company Websites', sub: 'Live crawls' },
  { icon: <IconLink size={16} />, iconClass: 'srcIconCyan',    title: 'LinkedIn Data',    sub: 'Professional network' },
  { icon: <IconDollar size={16} />, iconClass: 'srcIconPurple',  title: 'Funding Databases', sub: 'Crunchbase, PitchBook' },
  { icon: <IconSettings size={16} />, iconClass: 'srcIconGreen',   title: 'Tech Intelligence', sub: 'Stack & tool detection' },
  { icon: <IconTarget size={16} />, iconClass: 'srcIconOrange',  title: 'Intent Platforms',  sub: 'Bombora, G2' },
  { icon: <IconSend size={16} />, iconClass: 'srcIconPink',    title: 'News & Events',     sub: 'Real-time feeds' },
]

/* ===== COMPONENT ===== */

const DataEngine = () => {
  return (
    <article className={styles.page} aria-label="GTMer Data Engine — Real-Time B2B Intelligence">
      {/* Breadcrumb for crawlers */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">GTMer</a></li>
          <li aria-current="page">Data Engine</li>
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'GTMer Data Engine — Real-Time B2B Intelligence & Lead Enrichment',
            description: 'GTMer Data Engine enriches prospect data from 100+ B2B sources in real-time — firmographics, technographics, intent signals, verified emails, and phone numbers.',
            url: 'https://gtmer.ai/data-engine',
            isPartOf: { '@type': 'WebSite', name: 'GTMer', url: 'https://gtmer.ai' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'GTMer', item: 'https://gtmer.ai/' },
                { '@type': 'ListItem', position: 2, name: 'Data Engine', item: 'https://gtmer.ai/data-engine' },
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
            <span className={styles.badgeIcon}><IconBarChart size={16} /></span>
            <div className={styles.badgeTextGroup}>
              <span className={styles.badgeLabel}>AI Data Engine</span>
              <span className={styles.badgeSub}>Module 01</span>
            </div>
          </div>

          <h1 className={styles.headline}>
            Real-Time B2B Intelligence.
            <span className={styles.headlineAccent}>
              Always Fresh. Always Accurate.
            </span>
          </h1>

          <p className={styles.subtext}>
            The foundation of effective GTM automation is accurate, enriched,
            real-time data. Continuously collects and enriches prospect data
            from 100+ sources.
          </p>

          <button className={styles.ctaButton}>
            See It In Action
            <span className={styles.ctaArrow}><IconArrowRight size={14} /></span>
          </button>

          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>100+</span>
              <span className={styles.miniStatLabel}>Data Sources</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>95%+</span>
              <span className={styles.miniStatLabel}>Accuracy</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>Real-time</span>
              <span className={styles.miniStatLabel}>Enrichment</span>
            </div>
          </div>
        </div>

        {/* Enrichment visualization */}
        <div className={styles.vizBlock}>
          <div className={styles.vizWindow}>
            <div className={styles.vizHeader}>
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <div className={styles.vizDot} />
              <span className={styles.vizTitle}>data-engine / enriching</span>
              <span className={styles.vizStatus}>● LIVE</span>
            </div>

            <div className={styles.vizBody}>
              {/* Pulling from sources */}
              <div className={styles.pullLine}>
                <span className={styles.pullCaret}>&gt;</span> Pulling from 5 sources...
              </div>

              {/* Source badges */}
              <div className={styles.sourceBadges}>
                <span className={`${styles.sourceBadge} ${styles.srcLinkedIn}`}>LI LinkedIn</span>
                <span className={`${styles.sourceBadge} ${styles.srcCrunchbase}`}>CB Crunchbase</span>
                <span className={`${styles.sourceBadge} ${styles.srcBombora}`}>BO Bombora</span>
                <span className={`${styles.sourceBadge} ${styles.srcZoomInfo}`}>ZI ZoomInfo</span>
                <span className={`${styles.sourceBadge} ${styles.srcHunter}`}>HU Hunter.io</span>
              </div>

              {/* Enriched contact card */}
              <div className={styles.contactCard}>
                <div className={styles.contactHeader}>
                  <div className={styles.contactAvatar}>
                    <div className={styles.avatarCircle}>JH</div>
                    <div className={styles.avatarInfo}>
                      <span className={styles.contactName}>James Hoffman</span>
                      <span className={styles.contactSub}>Enriched contact record</span>
                    </div>
                  </div>
                  <span className={styles.verifiedBadge}><IconCheck size={10} /> Verified</span>
                </div>

                <div className={styles.contactRows}>
                  {CONTACT_FIELDS.map((field) => (
                    <div className={styles.contactRow} key={field.label}>
                      <span className={styles.contactRowLabel}>{field.label}</span>
                      <span className={styles.contactRowValue}>{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing bar */}
              <div className={styles.processingBar}>
                <div className={styles.processingLabel}>Processing speed</div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Section ===== */}
      <div className={styles.bottomSection}>

        {/* Checklist */}
        <div className={styles.checklistBlock}>
          <h3 className={styles.checklistHeadline}>What the Data Engine Delivers</h3>
          <ul className={styles.checklist}>
            {CHECKLIST_ITEMS.map((item) => (
              <li className={styles.checklistItem} key={item}>
                <span className={styles.checkIcon}><IconCheck size={12} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Data Sources grid */}
        <div className={styles.sourcesBlock}>
          <h3 className={styles.sourcesHeadline}>Data Sources</h3>
          <div className={styles.sourcesGrid}>
            {DATA_SOURCES.map((src) => (
              <div className={styles.sourceCard} key={src.title}>
                <div className={`${styles.sourceCardIcon} ${styles[src.iconClass]}`}>
                  {src.icon}
                </div>
                <div className={styles.sourceCardTitle}>{src.title}</div>
                <div className={styles.sourceCardSub}>{src.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </article>
  )
}

export default DataEngine
