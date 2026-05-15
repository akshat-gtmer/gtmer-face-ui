import { type ReactNode } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { IconMail, IconArrowRight, IconPhone } from '../Icons'
import styles from './Footer.module.css'

/* ===== FOOTER LINKS ===== */

interface FooterLink {
  label: string
  path?: string
  scroll?: string
  href?: string
}

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Platform: [
    { label: 'Product Overview', path: '/product' },
    { label: 'AI SDR Agents', path: '/agents' },
    { label: 'Data Engine', path: '/data-engine' },
    { label: 'Integrations', path: '/integrations' },
    { label: 'Pricing', path: '/pricing' },
  ],
  Company: [
    { label: 'About GTMer', path: '/about' },
    { label: 'Security & Compliance', path: '/security' },
    { label: 'Contact Us', scroll: 'contact' },
  ],
  Resources: [
    { label: 'How It Works', scroll: 'how-it-works' },
    { label: 'Use Cases', scroll: 'use-cases' },
    { label: 'FAQ', scroll: 'faq' },
    { label: 'Customer Stories', scroll: 'testimonials' },
  ],
}

/* ===== CONTACT METHODS ===== */

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
    label: 'Primary Phone',
    value: '+91 8989 606 740',
    href: 'tel:+918989606740',
    sub: 'Mon–Fri · 9 AM – 7 PM IST',
  },
  {
    icon: <IconPhone size={16} />,
    label: 'Alternate Phone',
    value: '+91 8291 111 188',
    href: 'tel:+918291111188',
    sub: 'Mon–Fri · 9 AM – 7 PM IST',
  },
  {
    icon: 'in',
    label: 'LinkedIn',
    value: 'GTMer AI',
    href: 'https://www.linkedin.com/company/gtmer-ai',
    sub: 'Follow for updates & insights',
  },
]

/* ===== COMPONENT ===== */

const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const textReveal = useScrollReveal({ threshold: 0.2 })
  const cardsReveal = useScrollReveal({ threshold: 0.1 })

  const handleClick = (link: FooterLink) => {
    if (link.path) {
      navigate(link.path)
      return
    }
    if (link.scroll) {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(link.scroll!)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById(link.scroll)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      className={styles.footer}
      id="contact"
      aria-label="GTMer contact information and site navigation"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <meta itemProp="name" content="GTMer AI" />
      <meta itemProp="url" content="https://gtmer.ai" />
      <meta itemProp="email" content="akshat@gtmer.ai" />
      <meta itemProp="telephone" content="+91-8989-606-740" />
      <link itemProp="sameAs" href="https://www.linkedin.com/company/gtmer-ai" />
      <div className={styles.inner}>

        {/* ===== CONTACT SECTION ===== */}
        <div className={styles.contactSection}>
          {/* Text block */}
          <div
            ref={textReveal.ref}
            className={`${styles.textBlock} ${textReveal.isVisible ? styles.visible : ''}`}
          >
            <div className={styles.contactLabel}>Get in Touch</div>
            <h2 className={styles.headline}>
              Ready to Automate Your Outbound?
            </h2>
            <p className={styles.subtext}>
              Book a free live demo and see GTMer's AI SDR agents prospect,
              enrich, and engage your ICP — in real time. No commitment required.
            </p>

            <div className={styles.demoNote}>
              <span className={styles.demoNoteIcon}>◎</span>
              <div className={styles.demoNoteText}>
                <strong>Free personalized demo</strong>
                <br />
                We'll run a real prospecting cycle on your ICP so you can see
                actual leads, enrichment, and AI-generated outreach before signing up.
              </div>
            </div>

            <a
              href="mailto:akshat@gtmer.ai?subject=Demo%20Request%20-%20GTMer&body=Hi%2C%20I%27d%20like%20to%20book%20a%20demo%20of%20GTMer."
              className={styles.bookDemoBtn}
              id="contact-book-demo"
              aria-label="Book a free demo of GTMer via email"
            >
              Book a Demo — It's Free
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
                    aria-label={`${method.label}: ${method.value}`}
                  >
                    <div className={styles.contactCardIcon}>{method.icon}</div>
                    <div className={styles.contactCardBody}>
                      <div className={styles.contactCardLabel}>{method.label}</div>
                      <div className={styles.contactCardValue}>{method.value}</div>
                      <div className={styles.contactCardSub}>{method.sub}</div>
                    </div>
                    <span className={styles.contactCardArrow} aria-hidden="true"><IconArrowRight size={14} /></span>
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <div className={styles.windowFooter}>
                <span className={styles.contactPulse} />
                <span className={styles.contactPulseText}>
                  Typically respond within 2 hours during business hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className={styles.divider} />

        {/* ===== FOOTER LINKS ===== */}
        <nav className={styles.topSection} aria-label="Footer navigation">
          {/* Brand */}
          <div className={styles.brandBlock}>
            <div className={styles.brandName}>
              <span className={styles.brandSlash}>/</span>gtmer
            </div>
            <p className={styles.brandDesc}>
              AI-powered sales automation platform for go-to-market execution. Autonomous
              AI SDR agents that prospect, enrich, send personalized outbound at scale,
              and book meetings — replacing manual SDR teams entirely.
            </p>
            <div className={styles.systemStatus}>
              <span className={styles.statusDot} />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Link columns — proper href for crawlability */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div className={styles.linkColumn} key={title}>
              <div className={styles.columnTitle}>{title}</div>
              {links.map(link => {
                const href = link.href && link.href.startsWith('http')
                  ? link.href
                  : link.path
                    ? link.path
                    : link.scroll
                      ? `/#${link.scroll}`
                      : '#'
                return (
                  <a
                    key={link.label}
                    href={href}
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
                )
              })}
            </div>
          ))}
        </nav>

        {/* ===== BOTTOM BAR ===== */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} GTMer AI. All rights reserved.
          </span>
          <div className={styles.legalLinks}>
            <a href="/privacy" className={styles.legalLink}>Privacy Policy</a>
            <a href="/terms" className={styles.legalLink}>Terms of Service</a>
            <Link to="/security" className={styles.legalLink}>Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
