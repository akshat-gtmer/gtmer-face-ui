import { Link } from 'react-router-dom'
import { IconArrowLeft, IconArrowRight } from '../Icons'
import styles from './About.module.css'



const VALUES = [
  {
    icon: '⊕', title: 'Autonomy First',
    desc: 'We build systems that run without humans in the loop. Not tools that need babysitting — agents that execute.',
  },
  {
    icon: '◎', title: 'Data Integrity',
    desc: 'Everything starts with accurate data. We obsess over enrichment quality, verification, and real-time freshness.',
  },
  {
    icon: '⬡', title: 'Personalisation at Scale',
    desc: 'Every prospect is unique. Our AI writes like a human who did their research — because the agents actually do.',
  },
  {
    icon: '△', title: 'Measurable Outcomes',
    desc: 'We don\'t sell "engagement." We sell pipeline. Every metric we report ties directly to booked meetings and revenue.',
  },
]

const TIMELINE = [
  { year: '2024', event: 'Founded with a mission to automate GTM execution' },
  { year: '2024', event: 'First 10 clients onboarded — 100% retention' },
  { year: '2025', event: 'Launched custom agent builder and data engine' },
  { year: '2025', event: '100+ data source integrations live' },
  { year: '2026', event: 'Processing 1M+ leads monthly across all clients' },
]

const About = () => {
  return (
    <article className={styles.page} aria-label="About GTMer — Our Mission">
      {/* Breadcrumb for crawlers */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">GTMer</a></li>
          <li aria-current="page">About</li>
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'About GTMer — Our Mission to Automate Go-To-Market Execution',
            description: 'GTMer was founded in 2024 to make outbound sales fully autonomous. AI agents replace manual prospecting, enrichment, and outreach — so teams focus on closing.',
            url: 'https://gtmer.ai/about',
            isPartOf: { '@type': 'WebSite', name: 'GTMer', url: 'https://gtmer.ai' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'GTMer', item: 'https://gtmer.ai/' },
                { '@type': 'ListItem', position: 2, name: 'About', item: 'https://gtmer.ai/about' },
              ],
            },
          }),
        }}
      />
      <div className={styles.backBar}>
        <Link to="/" className={styles.backButton}>
          <span className={styles.backArrow}><IconArrowLeft size={14} /></span>
          Back to <span className={styles.backSlash}>/</span>gtmer
        </Link>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>About GTMer</span>
        </div>
        <h1 className={styles.headline}>
          The GTM Problem Is
          <span className={styles.headlineAccent}> Execution.</span>
        </h1>
        <p className={styles.subtext}>
          Every company knows who they want to sell to. The problem is doing the
          work — finding, enriching, writing, sending, following up, booking.
          We built GTMer to make that work disappear.
        </p>
      </div>

      {/* Mission */}
      <div className={styles.missionSection}>
        <div className={styles.missionCard}>
          <div className={styles.missionLabel}>Our Mission</div>
          <h3 className={styles.missionHeadline}>
            Make outbound sales fully autonomous — so founders and sales teams
            can focus on closing, not prospecting.
          </h3>
          <p className={styles.missionBody}>
            GTMer was born from a simple frustration: outbound sales is
            90% manual research, data entry, and repetitive follow-ups.
            AI can do all of it better, faster, and 24/7. We're building the
            execution layer that turns intent into booked meetings — autonomously.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className={styles.valuesSection}>
        <h3 className={styles.sectionTitle}>What We Believe</h3>
        <div className={styles.valuesGrid}>
          {VALUES.map(v => (
            <div key={v.title} className={styles.valueCard}>
              <div className={styles.valueIcon}>{v.icon}</div>
              <h4 className={styles.valueTitle}>{v.title}</h4>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timelineSection}>
        <h3 className={styles.sectionTitle}>Our Journey</h3>
        <div className={styles.timeline}>
          {TIMELINE.map((t, i) => (
            <div key={i} className={styles.timelineItem}>
              <span className={styles.timelineYear}>{t.year}</span>
              <div className={styles.timelineDot} />
              <span className={styles.timelineEvent}>{t.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <h3 className={styles.ctaHeadline}>Want to work with us?</h3>
        <p className={styles.ctaSubtext}>
          We're always looking for exceptional engineers, data scientists, and
          GTM practitioners who want to shape the future of autonomous sales.
        </p>
        <a href="mailto:akshat@gtmer.ai?subject=Careers%20at%20GTMer" className={styles.ctaButton}>
          Get In Touch <IconArrowRight size={14} />
        </a>
      </div>
    </article>
  )
}

export default About
