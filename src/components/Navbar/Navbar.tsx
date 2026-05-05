import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

interface DropdownItem {
  id: string
  icon: string
  label: string
  desc: string
  target: string
}

const PLATFORM_ITEMS: DropdownItem[] = [
  { id: 'dd-product', icon: '⊞', label: '/gtmer-product', desc: 'Command center overview', target: '/product' },
  { id: 'dd-agents', icon: '⚡', label: '/gtmer-agents', desc: 'Custom-built GTM agents', target: '/agents' },
  { id: 'dd-data-engine', icon: '◎', label: '/gtmer-data-engine', desc: 'Real-time B2B intelligence', target: '/data-engine' },
]

const EXPLORE_ITEMS: DropdownItem[] = [
  { id: 'dd-pricing', icon: '◇', label: '/gtmer-pricing', desc: 'Plans & tiers', target: '/pricing' },
  { id: 'dd-security', icon: '⬡', label: '/gtmer-security', desc: 'Compliance & data protection', target: '/security' },
  { id: 'dd-integrations', icon: '⊕', label: '/gtmer-integrations', desc: '100+ connected tools', target: '/integrations' },
  { id: 'dd-about', icon: '△', label: '/gtmer-about', desc: 'Our mission & team', target: '/about' },
]

/* Sections for the center tab switcher (only visible on landing page) */
const NAV_SECTIONS = [
  { id: 'hero-section', label: 'gtmer/home' },
  { id: 'how-it-works', label: 'gtmer/how-it-works' },
  { id: 'numbers-section', label: 'gtmer/numbers' },
  { id: 'pipeline-section', label: 'gtmer/pipeline' },
  { id: 'use-cases', label: 'gtmer/use-cases' },
  { id: 'testimonials', label: 'gtmer/testimonials' },
  { id: 'faq', label: 'gtmer/faq' },
  { id: 'contact', label: 'gtmer/contact' },
]

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isMainPage = location.pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero-section')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (!isMainPage) return
      const scrollPos = window.scrollY + 120
      for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_SECTIONS[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_SECTIONS[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMainPage])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setSectionMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    setDropdownOpen(false)
    navigate(item.target)
  }

  const handleSectionClick = (sectionId: string) => {
    setSectionMenuOpen(false)
    if (!isMainPage) {
      navigate('/')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCtaClick = () => {
    if (!isMainPage) {
      navigate('/')
      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const renderGroup = (title: string, items: DropdownItem[]) => (
    <div className={styles.dropdownGroup}>
      <div className={styles.groupTitle}>{title}</div>
      {items.map(item => (
        <button
          key={item.id}
          className={styles.dropdownItem}
          role="menuitem"
          id={item.id}
          onClick={() => handleItemClick(item)}
        >
          <div className={styles.itemText}>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemDesc}>{item.desc}</span>
          </div>
        </button>
      ))}
    </div>
  )

  const activeSectionLabel = NAV_SECTIONS.find(s => s.id === activeSection)?.label || 'Home'

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Left: Logo + Mega Dropdown */}
      <div className={styles.navLeft} ref={dropdownRef}>
        <button
          className={styles.logoButton}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          id="nav-logo-button"
        >
          <span className={styles.logoMark}>
            <span className={styles.logoSlash}>/</span>
            <span className={styles.logoName}>gtmer</span>
          </span>
          <span className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
        </button>

        {/* Mega Dropdown — Platform + Explore only */}
        <div
          className={`${styles.dropdown} ${dropdownOpen ? styles.visible : ''}`}
          role="menu"
          id="nav-dropdown-menu"
        >
          <div className={styles.dropdownInner}>
            {renderGroup('Platform', PLATFORM_ITEMS)}
            {renderGroup('Explore', EXPLORE_ITEMS)}
          </div>
        </div>
      </div>

      {/* Center: Section tab switcher (only on main landing page) */}
      {scrolled && isMainPage && (
        <div className={styles.center} ref={sectionRef}>
          <button
            className={styles.sectionToggle}
            onClick={() => setSectionMenuOpen(!sectionMenuOpen)}
            aria-expanded={sectionMenuOpen}
          >
            <span className={styles.sectionLabel}>{activeSectionLabel}</span>
            <span className={`${styles.sectionChevron} ${sectionMenuOpen ? styles.sectionChevronOpen : ''}`}>⌄</span>
          </button>

          {/* Section flyout */}
          <div className={`${styles.sectionFlyout} ${sectionMenuOpen ? styles.sectionFlyoutVisible : ''}`}>
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                className={`${styles.sectionItem} ${activeSection === s.id ? styles.sectionItemActive : ''}`}
                onClick={() => handleSectionClick(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Right: CTA */}
      <div className={styles.navRight}>
        <button
          className={styles.ctaButton}
          id="nav-cta-start"
          onClick={handleCtaClick}
        >
          Start Automating
        </button>
      </div>
    </nav>
  )
}

export default Navbar
