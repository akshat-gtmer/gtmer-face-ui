import styles from './Footer.module.css'

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
    { label: 'Contact', scroll: 'contact' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Status', href: '#' },
  ],
}

interface FooterProps {
  onNavigate: (view: string) => void
}

const Footer = ({ onNavigate }: FooterProps) => {
  const handleClick = (link: { action?: string; scroll?: string; href?: string }) => {
    if (link.action) { onNavigate(link.action); return }
    if (link.scroll) {
      document.getElementById(link.scroll)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
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
