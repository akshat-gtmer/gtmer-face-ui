import { type ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { IconMail, IconArrowRight, IconLink, IconPhone } from '../Icons'
import styles from './Contact.module.css'

/* ===== DATA ===== */

interface ContactMethod {
  icon: ReactNode
  label: string
  value: string
  href: string
  sub: string
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: <IconMail size={16} />,
    label: 'Email',
    value: 'akshat@gtmer.ai',
    href: 'mailto:akshat@gtmer.ai',
    sub: 'For demos, partnerships & inquiries',
  },
  {
    icon: <IconPhone size={16} />,
    label: 'Phone',
    value: '+91 8989 606 740',
    href: 'tel:+918989606740',
    sub: 'Primary line',
  },
  {
    icon: <IconPhone size={16} />,
    label: 'Phone',
    value: '+91 8291 111 188',
    href: 'tel:+918291111188',
    sub: 'Alternate line',
  },
  {
    icon: '◆',
    label: 'LinkedIn',
    value: 'GTMer AI',
    href: 'https://www.linkedin.com/company/gtmer-ai',
    sub: 'linkedin.com/company/gtmer-ai',
  },
]

/* ===== COMPONENT ===== */

const Contact = () => {
  const textReveal = useScrollReveal({ threshold: 0.2 })
  const cardsReveal = useScrollReveal({ threshold: 0.1 })

  return (
    <section className={styles.section} id="contact">
      <div className={styles.layout}>

        {/* Text block */}
        <div
          ref={textReveal.ref}
          className={`${styles.textBlock} ${textReveal.isVisible ? styles.visible : ''}`}
        >
          <div className={styles.label}>Contact</div>
          <h2 className={styles.headline}>
            Let's talk.
          </h2>
          <p className={styles.subtext}>
            Ready to see GTMer in action? Want to book a demo, explore a
            partnership, or just chat about autonomous GTM?
            Reach out — we'd love to hear from you.
          </p>
          <p className={styles.subtext}>
            Whether you want to <strong>book a demo</strong>, discuss integrations,
            or learn how AI agents can run your outbound — we're one message away.
          </p>

          <div className={styles.demoNote}>
            <span className={styles.demoNoteIcon}>◎</span>
            <div className={styles.demoNoteText}>
              <strong>Interested in a demo?</strong>
              <br />
              Contact us directly via email or phone and we'll set up a
              personalized walkthrough of the GTMer platform.
            </div>
          </div>

          <a
            href="mailto:akshat@gtmer.ai?subject=Demo%20Request%20-%20GTMer&body=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20GTMer."
            className={styles.bookDemoBtn}
            id="contact-book-demo"
          >
            Book a Demo
            <span className={styles.bookDemoArrow}><IconArrowRight size={14} /></span>
          </a>
        </div>

        {/* Contact cards */}
        <div
          ref={cardsReveal.ref}
          className={`${styles.cardsBlock} ${cardsReveal.isVisible ? styles.visible : ''}`}
        >
          <div className={styles.contactWindow}>
            {/* Window chrome */}
            <div className={styles.windowHeader}>
              <div className={styles.windowDot} />
              <div className={styles.windowDot} />
              <div className={styles.windowDot} />
              <span className={styles.windowTitle}>gtmer / contact</span>
              <span className={styles.windowStatus}>● online</span>
            </div>

            {/* Contact methods */}
            <div className={styles.contactList}>
              {CONTACT_METHODS.map((method, i) => (
                <a
                  key={`${method.label}-${i}`}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={styles.contactCard}
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className={styles.contactCardIcon}>{method.icon}</div>
                  <div className={styles.contactCardBody}>
                    <div className={styles.contactCardLabel}>{method.label}</div>
                    <div className={styles.contactCardValue}>{method.value}</div>
                    <div className={styles.contactCardSub}>{method.sub}</div>
                  </div>
                  <span className={styles.contactCardArrow}><IconArrowRight size={14} /></span>
                </a>
              ))}
            </div>

            {/* Footer note */}
            <div className={styles.windowFooter}>
              <span className={styles.footerPulse} />
              <span className={styles.footerText}>
                Typically respond within a few hours
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Contact
