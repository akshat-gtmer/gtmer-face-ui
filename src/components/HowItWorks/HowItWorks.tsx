import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { IconSearch, IconMail, IconCalendar, IconCheck, IconEdit, IconRefresh, IconArrowRight } from '../Icons'
import styles from './HowItWorks.module.css'

/* ===== 3-step flow — reflects the actual worker pipeline ===== */

const STEPS = [
  {
    number: '1',
    title: 'Upload your target list',
    description: 'Drop a CSV of companies or connect your CRM. GTMer scores each one for ICP fit — so your team only talks to companies that actually match.',
    icon: <IconSearch size={20} />,
  },
  {
    number: '2',
    title: 'AI workers do the grunt work',
    description: 'Five workers run back-to-back — crawling websites, writing research summaries, finding verified contacts, and drafting emails. What takes an SDR 4 hours happens in 90 seconds.',
    icon: <IconMail size={20} />,
  },
  {
    number: '3',
    title: 'Approve drafts. Watch replies come in.',
    description: "Every email references real context — a product launch, a new hire, a funding round. That's why teams see 18% reply rates. You approve, GTMer sends.",
    icon: <IconCalendar size={20} />,
  },
]

/* ===== Panel sub-components ===== */

const PanelImport = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Records — 25 companies imported</span>
      <span className={styles.panelBadge}><span className={styles.liveDot} />csv_import</span>
    </div>
    <div className={styles.panelRows}>
      {[
        { co: 'Klenty', url: 'klenty.com', fit: 75, status: 'Ready' },
        { co: 'WizCommerce', url: 'wizcommerce.com', fit: 75, status: 'Ready' },
        { co: 'Observe.AI', url: 'observe.ai', fit: 45, status: 'Ready' },
        { co: 'Rephrase.ai', url: 'rephrase.ai', fit: 65, status: 'Ready' },
        { co: 'HyperVerge', url: 'hyperverge.co', fit: 72, status: 'Ready' },
      ].map((r, i) => (
        <div className={styles.row} key={i}>
          <span className={styles.rowAvatar}>{r.co.charAt(0)}</span>
          <span className={styles.rowName}>{r.co}</span>
          <span className={styles.rowTag}>{r.url}</span>
          <span className={styles.rowScore}>{r.fit}</span>
          <span className={styles.rowTime}>{r.status}</span>
        </div>
      ))}
    </div>
  </div>
)

const PanelWorkers = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Automation Pipeline</span>
      <span className={styles.panelSub}>5 worker agents · autonomous</span>
    </div>
    <div className={styles.workerPipeline}>
      {[
        { name: 'Crawl Worker', desc: 'Scrapes company websites for deep context', status: '25/25 ✓', active: false },
        { name: 'Summary Worker', desc: 'Generates AI research dossier per company', status: '25/25 ✓', active: false },
        { name: 'Contact Worker', desc: 'Finds & verifies decision-maker emails', status: '18/25 ◉', active: true },
        { name: 'Email Draft Worker', desc: 'Writes personalized outreach per contact', status: 'Queued', active: false },
        { name: 'Email Send Worker', desc: 'Delivers approved emails at scale', status: 'Queued', active: false },
      ].map((w, i) => (
        <div className={`${styles.workerRow} ${w.active ? styles.workerActive : ''}`} key={i}>
          <span className={`${styles.workerNum} ${w.status.includes('✓') ? styles.workerDone : ''} ${w.active ? styles.workerRunning : ''}`}>
            {i + 1}
          </span>
          <div className={styles.workerInfo}>
            <strong>{w.name}</strong>
            <span>{w.desc}</span>
          </div>
          <span className={`${styles.workerStat} ${w.status.includes('✓') ? styles.workerStatDone : ''} ${w.active ? styles.workerStatRunning : ''}`}>
            {w.status}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const PanelOutreach = () => (
  <div className={styles.panelContent}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Outreach Drafts — Review & Send</span>
      <span className={styles.panelBadgeGreen}><IconCheck size={12} /> 24 ready</span>
    </div>
    <div className={styles.emailBlock}>
      <div className={styles.emailMeta}>
        <span className={styles.emailLabel}>To</span><span>baskar@amagi.com</span>
      </div>
      <div className={styles.emailMeta}>
        <span className={styles.emailLabel}>Subject</span><span>scaling sales for FAST expansion</span>
      </div>
      <div className={styles.emailBody}>
        <p>Hi Baskar,</p>
        <p>Congrats on the momentum in the FAST market — saw the <span className={styles.hl}>Cox Media Group case study</span>, that's strong enterprise traction.</p>
        <p>As you scale into <span className={styles.hl}>English-speaking markets</span>, outbound prospecting at that level usually means adding headcount. We've helped 3 similar media-tech companies automate that entirely.</p>
        <p className={styles.emailSig}>Worth a 15-min look?<br />— GTMer</p>
      </div>
      <div className={styles.emailActions}>
        <span className={styles.btnPrimary}><IconCheck size={12} /> Approve & Send</span>
        <span className={styles.btnOutline}><IconEdit size={12} /> Edit</span>
        <span className={styles.btnOutline}><IconRefresh size={12} /> Regenerate</span>
      </div>
    </div>
  </div>
)

const PANELS = [PanelImport, PanelWorkers, PanelOutreach]

/* ===== MAIN ===== */

const HowItWorks = () => {
  const navigate = useNavigate()
  const reveal = useScrollReveal({ threshold: 0.1 })
  const [active, setActive] = useState(0)
  const Panel = PANELS[active]

  return (
    <section className={styles.section} id="how-it-works" aria-label="How GTMer's autonomous outbound pipeline works in 3 steps">
      <div ref={reveal.ref} className={`${styles.inner} ${reveal.isVisible ? styles.visible : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            How GTMer Works
          </div>
          <h2 className={styles.headline}>
            From cold list to <span className={styles.accent}>booked meetings</span> — in hours.
          </h2>
          <p className={styles.sub}>
            Most outbound tools make you write templates. GTMer researches each company
            and writes unique emails. Here's the 3-step workflow.
          </p>
        </div>

        {/* 3-step columns */}
        <div className={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <button
              key={step.number}
              className={`${styles.stepColumn} ${i === active ? styles.stepActive : ''}`}
              onClick={() => setActive(i)}
            >
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </button>
          ))}
        </div>

        {/* Line separator */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${((active + 1) / 3) * 100}%` }} />
        </div>

        {/* Showcase panel */}
        <div className={styles.panel} key={`panel-${active}`}>
          <Panel />
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <button className={styles.ctaBtn} onClick={() => navigate('/product')}>
            Explore the Full Platform <IconArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
