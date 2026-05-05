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
    question: 'What is GTMer and how does it work?',
    answer:
      'GTMer is an AI-powered go-to-market execution platform. It uses autonomous AI SDR agents to prospect, enrich, personalize outreach, and book meetings — replacing the manual work of traditional sales development teams. You define your ICP, connect your CRM, and the AI handles end-to-end outbound.',
  },
  {
    question: 'How quickly can my team go live with GTMer?',
    answer:
      'Most teams are live within 48 hours. We handle onboarding, ICP configuration, data source setup, and initial sequence calibration. You define the targeting criteria — we deploy the AI agents and start prospecting immediately.',
  },
  {
    question: 'Does GTMer replace our CRM?',
    answer:
      'No. GTMer integrates with your existing CRM — Salesforce, HubSpot, or Pipedrive — and syncs data bidirectionally. Think of it as an autonomous execution layer that feeds your CRM with enriched, qualified, and already-engaged leads.',
  },
  {
    question: 'How does GTMer personalize outreach at scale?',
    answer:
      'Each email and LinkedIn message is generated uniquely per prospect using enriched data — their role, company context, tech stack, funding stage, recent news, and real-time intent signals. No templates. Every message reads like it was hand-written by a senior SDR.',
  },
  {
    question: 'What data sources does GTMer pull from?',
    answer:
      'Over 100 B2B data sources including LinkedIn, Apollo, ZoomInfo, Clearbit, Crunchbase, Bombora, G2, job boards, company websites, news feeds, and proprietary web crawlers. All data is continuously refreshed to ensure accuracy.',
  },
  {
    question: 'Is our prospect data secure on GTMer?',
    answer:
      'Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). GTMer is SOC 2 Type II compliant. Your prospect data is isolated in a dedicated tenant — we never share or co-mingle data between clients.',
  },
  {
    question: 'How much does GTMer cost?',
    answer:
      'Pricing is based on the number of active leads in your pipeline and the AI agents you deploy. We offer Starter, Growth, and Enterprise tiers to match your team size. Contact us for a custom quote or start with a free demo.',
  },
  {
    question: 'Can I see a live demo before committing?',
    answer:
      'Absolutely. We offer a free live demo where we run a real prospecting cycle on your ICP. You see real leads, real enrichment, and real AI-generated emails — before you sign anything. Book a demo to get started.',
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
    <section
      className={styles.section}
      id="faq"
      aria-label="Frequently asked questions about GTMer's AI SDR platform"
    >
      {/* FAQPage JSON-LD Schema for AEO — Google AI Overviews, ChatGPT, Perplexity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
      {/* Header */}
      <div
        ref={headerReveal.ref}
        className={`${styles.headerBlock} ${headerReveal.isVisible ? styles.visible : ''}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>GTMer FAQ</span>
        </div>

        <h2 className={styles.headline}>
          Questions About
          <span className={styles.headlineAccent}> GTMer's AI SDR Platform</span>
        </h2>

        <p className={styles.subtext}>
          Answers to the most common questions about how GTMer's autonomous
          AI agents work, integrations, data security, pricing, and getting started.
        </p>
      </div>

      {/* FAQ List */}
      <div
        ref={listReveal.ref}
        className={`${styles.faqList} ${listReveal.isVisible ? styles.visible : ''}`}
        role="list"
      >
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index
          const answerId = `faq-answer-${index}`
          const questionId = `faq-question-${index}`

          return (
            <div
              key={index}
              className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
              role="listitem"
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={answerId}
                id={questionId}
              >
                <span className={styles.faqNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.faqText}>{item.question}</span>
                <span className={styles.faqChevron} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div
                className={styles.faqAnswer}
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                style={{
                  maxHeight: isOpen ? '300px' : '0px',
                }}
              >
                <p className={styles.faqAnswerText}>{item.answer}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className={styles.ctaWrapper}>
        <p className={styles.ctaText}>Still have questions?</p>
        <button
          className={styles.ctaButton}
          id="faq-cta-demo"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Book a free demo of GTMer"
        >
          Book a Free Demo
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>
    </section>
  )
}

export default FAQ
