import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Product', path: '/product' },
  { label: 'Use Cases', path: '/use-cases' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'About', path: '/about' },
]

const MORE_LINKS = [
  { label: 'Integrations', path: '/integrations' },
  { label: 'Security', path: '/security' },
  { label: 'FAQ', path: '/faq' },
  { label: 'GTM Automation', path: '/gtm-automation' },
  { label: 'Data Engine', path: '/data-engine' },
]

const Navbar = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isMoreActive = MORE_LINKS.some(link => location.pathname === link.path)

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.navInner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="GTMer Home">
          <span className={styles.logoSlash}>/</span>
          <span className={styles.logoName}>gtmer</span>
        </Link>

        {/* Center: Nav Links (desktop) */}
        <div className={styles.navLinks}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${location.pathname === link.path ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className={styles.moreWrapper}>
            <button
              className={`${styles.navLink} ${styles.moreButton} ${isMoreActive ? styles.moreButtonActive : ''}`}
              aria-haspopup="true"
            >
              More
              <span className={styles.moreChevron}>▾</span>
            </button>
            <div className={styles.moreDropdown}>
              {MORE_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${styles.moreLink} ${location.pathname === link.path ? styles.moreLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: CTAs */}
        <div className={styles.navRight}>
          <a
            href="https://app.gtmer.ai"
            className={styles.signInLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign in
          </a>
          <Link
            className={styles.ctaButton}
            id="nav-cta-start"
            to="/signup"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileToggleOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={styles.mobileLink}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className={styles.mobileDivider} />
        {MORE_LINKS.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={styles.mobileLink}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className={styles.mobileCta}>
          <Link
            to="/signup"
            className={styles.ctaButton}
            onClick={() => setMobileOpen(false)}
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
