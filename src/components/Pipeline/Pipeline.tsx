import { useState, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Pipeline.module.css'

/* ===== DATA ===== */

interface LeadCard {
  name: string
  company: string
  meta: string
}

interface KanbanColumn {
  title: string
  dotClass: string
  cards: LeadCard[]
}

const COLUMNS: KanbanColumn[] = [
  {
    title: 'New Lead',
    dotClass: 'dotNew',
    cards: [
      { name: 'Arjun Mehta', company: 'Tessera Labs', meta: 'Added from YC batch' },
      { name: 'Sophie Keller', company: 'Crossbeam SaaS', meta: 'Added from YC batch' },
      { name: 'Nikhil Rao', company: 'Heron Analytics', meta: 'Added from YC batch' },
    ],
  },
  {
    title: 'Contacted',
    dotClass: 'dotContacted',
    cards: [
      { name: 'Clara Voss', company: 'Relay.xyz', meta: 'LinkedIn message sent' },
      { name: 'Tomás Aguilar', company: 'Compvox', meta: 'Follow-up email sent' },
    ],
  },
  {
    title: 'Replied',
    dotClass: 'dotReplied',
    cards: [
      { name: 'Marcus Chen', company: 'Firelane', meta: 'Interested in demo' },
    ],
  },
  {
    title: 'Qualified',
    dotClass: 'dotQualified',
    cards: [
      { name: 'Lena Strickland', company: 'Bridgepoint', meta: 'Demo booked Feb 18' },
      { name: 'Viktor Jansen', company: 'SoleFire', meta: 'Pricing discussion' },
    ],
  },
]

/* ===== COMPONENT ===== */

const Pipeline = () => {
  const textReveal = useScrollReveal({ threshold: 0.2 })
  const boardReveal = useScrollReveal({ threshold: 0.1 })
  const [visibleCards, setVisibleCards] = useState<string[]>([])
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null)

  // Stagger card appearances after board enters viewport
  useEffect(() => {
    if (!boardReveal.isVisible) return

    let delay = 0
    COLUMNS.forEach((col) => {
      col.cards.forEach((card) => {
        const key = `${col.title}-${card.name}`
        setTimeout(() => {
          setVisibleCards(prev => [...prev, key])
        }, delay)
        delay += 120
      })
    })
  }, [boardReveal.isVisible])

  // Auto-highlight random cards to simulate live activity
  useEffect(() => {
    if (!boardReveal.isVisible) return
    const allKeys = COLUMNS.flatMap(col => col.cards.map(c => `${col.title}-${c.name}`))
    const interval = setInterval(() => {
      const key = allKeys[Math.floor(Math.random() * allKeys.length)]
      setHighlightedCard(key)
      setTimeout(() => setHighlightedCard(null), 1200)
    }, 3500)
    return () => clearInterval(interval)
  }, [boardReveal.isVisible])

  return (
    <section className={styles.section} id="pipeline-section">
      <div className={styles.layout}>

        {/* Text block */}
        <div
          ref={textReveal.ref}
          className={`${styles.textBlock} ${textReveal.isVisible ? styles.visible : ''}`}
        >
          <div className={styles.label}>Pipeline</div>
          <h2 className={styles.headline}>
            Track every conversation
          </h2>
          <p className={styles.subtext}>
            Drag-and-drop kanban boards auto-update as leads reply. GTMer
            moves cards through your pipeline automatically.
          </p>
        </div>

        {/* Kanban board */}
        <div
          ref={boardReveal.ref}
          className={`${styles.boardWrapper} ${boardReveal.isVisible ? styles.visible : ''}`}
        >
          <div className={styles.boardWindow}>
            {/* Window chrome */}
            <div className={styles.windowHeader}>
              <div className={styles.windowDot} />
              <div className={styles.windowDot} />
              <div className={styles.windowDot} />
              <span className={styles.windowTitle}>Sales Pipeline</span>
              <span className={styles.windowHint}>↔ Drag cards between columns</span>
            </div>

            {/* Board */}
            <div className={styles.board}>
              {COLUMNS.map((col) => (
                <div className={styles.column} key={col.title}>
                  {/* Column header */}
                  <div className={styles.columnHeader}>
                    <span className={styles.columnTitle}>
                      <span className={`${styles.columnDot} ${styles[col.dotClass]}`} />
                      {col.title}
                    </span>
                    <span className={styles.columnCount}>{col.cards.length}</span>
                  </div>

                  {/* Cards */}
                  {col.cards.map((card) => {
                    const key = `${col.title}-${card.name}`
                    return (
                    <div
                        key={key}
                        className={`${styles.card} ${visibleCards.includes(key) ? styles.cardVisible : ''} ${highlightedCard === key ? styles.cardHighlight : ''}`}
                      >
                        <div className={styles.cardName}>{card.name}</div>
                        <div className={styles.cardCompany}>{card.company}</div>
                        <div className={styles.cardMeta}>{card.meta}</div>
                      </div>
                    )
                  })}

                  {/* Add item */}
                  <button className={styles.addItem}>+ Add Item</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Pipeline
