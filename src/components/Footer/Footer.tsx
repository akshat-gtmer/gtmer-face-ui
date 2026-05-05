import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Footer.module.css'

/* ===== FOOTER LINKS ===== */

interface FooterLink {
  label: string
  action?: string
  scroll?: string
  href?: string
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Platform: [
    { label: 'Product Overview', action: 'product' },
    { label: 'AI Agents', action: 'agents' },
    { label: 'Data Engine', action: 'data-engine' },
    { label: 'Integrations', action: 'integrations' },
  ],
  Company: [
    { label: 'About', action: 'about' },
    { label: 'Pricing', action: 'pricing' },
    { label: 'Security', action: 'security' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Status', href: '#' },
  ],
}

/* ===== CONTACT METHODS ===== */

interface ContactMethod {
  icon: string
  label: string
  value: string
  href: string
  sub: string
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: '✉',
    label: 'Email',
    value: 'akshat@gtmer.ai',
    href: 'mailto:akshat@gtmer.ai',
    sub: 'For demos, partnerships & inquiries',
  },
  {
    icon: '☎',
    label: 'Phone',
    value: '+91 8989 606 740',
    href: 'tel:+918989606740',
    sub: 'Primary line',
  },
  {
    icon: '☎',
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

interface FooterProps {
  onNavigate: (view: string) => void
}

const Footer = ({ onNavigate }: FooterProps) => {
  const textReveal = useScrollReveal({ threshold: 0.2 })
  const cardsReveal = useScrollReveal({ threshold: 0.1 })

  const handleClick = (link: { action?: string; scroll?: string; href?: string }) => {
    if (link.action) { onNavigate(link.action); return }
    if (link.scroll) {
      document.getElementById(link.scroll)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>

        {/* ===== CONTACT SECTION ===== */}
        <div className={styles.contactSection}>
          {/* Text block */}
          <div
            ref={textReveal.ref}
            className={`${styles.textBlock} ${textReveal.isVisible ? styles.visible : ''}`}
          >
            <div className={styles.contactLabel}>Contact</div>
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
              <span className={styles.bookDemoArrow}>→</span>
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
                    <span className={styles.contactCardArrow}>→</span>
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <div className={styles.windowFooter}>
                <span className={styles.contactPulse} />
                <span className={styles.contactPulseText}>
                  Typically respond within a few hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className={styles.divider} />

        {/* ===== FOOTER LINKS ===== */}
        <div className={styles.topSection}>
          {/* Brand */}
          <div className={styles.brandBlock}>
            <div className={styles.brandName}>
              <span className={styles.brandSlash}>/</span>gtmer
            </div>
            <p className={styles.brandDesc}>
              Autonomous GTM execution. AI agents that find, enrich, and
              engage your ideal prospects at scale.
            </p>
            <div className={styles.systemStatus}>
              <span className={styles.statusDot} />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div className={styles.linkColumn} key={title}>
              <div className={styles.columnTitle}>{title}</div>
              {links.map(link => (
                <a
                  key={link.label}
                  href={link.href && link.href.startsWith('http') ? link.href : undefined}
                  target={link.href && link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href && link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={styles.footerLink}
                  onClick={(e) => {
                    if (!link.href || !link.href.startsWith('http')) {
                      e.preventDefault()
                      handleClick(link)
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} GTMer AI. All rights reserved.
          </span>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy</a>
            <a href="#" className={styles.legalLink}>Terms</a>
            <a href="#" className={styles.legalLink}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
