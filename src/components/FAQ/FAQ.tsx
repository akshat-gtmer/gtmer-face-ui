import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './FAQ.module.css'

/* ===== DATA ===== */

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How quickly can we go live?',
    answer:
      'Most teams are live within 48 hours. We handle onboarding, ICP configuration, data source setup, and initial sequence calibration. You define the intent — we deploy the agents.',
  },
  {
    question: 'Does GTMer replace our CRM?',
    answer:
      'No. GTMer sits on top of your existing CRM (Salesforce, HubSpot, Pipedrive) and syncs data bidirectionally. Think of it as an autonomous execution layer that feeds your CRM with enriched, engaged leads.',
  },
  {
    question: 'How is outreach personalised?',
    answer:
      'Each email is generated uniquely per prospect using enriched data — their role, company context, tech stack, funding stage, recent news, and intent signals. No templates. Every message reads like it was hand-written.',
  },
  {
    question: 'What data sources do you pull from?',
    answer:
      'Over 100 sources including LinkedIn, Apollo, ZoomInfo, Clearbit, Crunchbase, Bombora, G2, job boards, company websites, news feeds, and proprietary web crawlers. Data is continuously refreshed.',
  },
  {
    question: 'Is our data secure?',
    answer:
      'Yes. All data is encrypted at rest and in transit. We are SOC 2 Type II compliant. Your prospect data is isolated in a dedicated tenant. We never share data between clients.',
  },
  {
    question: 'What if we need a custom workflow?',
    answer:
      'We build fully custom AI agents for any GTM workflow. If it can be defined as a process, we can automate it. Custom agent builds typically take 2–4 weeks.',
  },
  {
    question: 'How does pricing work?',
    answer:
      'Pricing is based on the number of active leads in your pipeline and the agents you deploy. We offer starter, growth, and enterprise tiers. Contact us for a custom quote.',
  },
  {
    question: 'Can I see it in action before committing?',
    answer:
      'Absolutely. We offer a free live demo where we run a real prospecting cycle on your ICP. You see real leads, real enrichment, and real emails — before you sign anything.',
  },
]

/* ===== COMPONENT ===== */

const FAQ = () => {
  const headerReveal = useScrollReveal({ threshold: 0.2 })
  const listReveal = useScrollReveal({ threshold: 0.05 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <section className={styles.section} id="faq">
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Common Questions</span>
        </div>

        <h2 className={styles.headline}>
          Frequently Asked
          <span className={styles.headlineAccent}> Questions</span>
        </h2>

        <p className={styles.subtext}>
          Everything you need to know before getting started.
        </p>
      </div>

      {/* FAQ List */}
      <div
        ref={listReveal.ref}
        className={`${styles.faqList} ${listReveal.isVisible ? styles.visible : ''}`}
      >
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
              id={`faq-item-${index}`}
            >
              <span className={styles.faqNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.faqText}>{item.question}</span>
              <span className={styles.faqChevron}>
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            <div
              className={styles.faqAnswer}
              style={{
                maxHeight: openIndex === index ? '300px' : '0px',
              }}
            >
              <p className={styles.faqAnswerText}>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ
