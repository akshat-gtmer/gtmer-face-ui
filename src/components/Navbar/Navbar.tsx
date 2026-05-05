import { useState, useEffect, useRef } from 'react'
import styles from './Navbar.module.css'

interface NavbarProps {
  onNavigate: (view: string) => void
  activeView: string
}

interface DropdownItem {
  id: string
  icon: string
  label: string
  desc: string
  action: 'view' | 'scroll'
  target: string
}

const PLATFORM_ITEMS: DropdownItem[] = [
  { id: 'dd-product', icon: '⊞', label: '/gtmer-product', desc: 'Command center overview', action: 'view', target: 'product' },
  { id: 'dd-agents', icon: '⚡', label: '/gtmer-agents', desc: 'Custom-built GTM agents', action: 'view', target: 'agents' },
  { id: 'dd-data-engine', icon: '◎', label: '/gtmer-data-engine', desc: 'Real-time B2B intelligence', action: 'view', target: 'data-engine' },
]

const EXPLORE_ITEMS: DropdownItem[] = [
  { id: 'dd-pricing', icon: '◇', label: '/gtmer-pricing', desc: 'Plans & tiers', action: 'view', target: 'pricing' },
  { id: 'dd-security', icon: '⬡', label: '/gtmer-security', desc: 'Compliance & data protection', action: 'view', target: 'security' },
  { id: 'dd-integrations', icon: '⊕', label: '/gtmer-integrations', desc: '100+ connected tools', action: 'view', target: 'integrations' },
  { id: 'dd-about', icon: '△', label: '/gtmer-about', desc: 'Our mission & team', action: 'view', target: 'about' },
]

/* Sections for the center tab switcher */
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

const Navbar = ({ onNavigate, activeView }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero-section')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (activeView !== 'main') return
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
  }, [activeView])

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
    if (item.action === 'view') {
      onNavigate(item.target)
    } else {
      if (activeView !== 'main') {
        onNavigate('main')
        setTimeout(() => {
          document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleSectionClick = (sectionId: string) => {
    setSectionMenuOpen(false)
    if (activeView !== 'main') {
      onNavigate('main')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
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

      {/* Center: Section tab switcher */}
      {scrolled && activeView === 'main' && (
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
          onClick={() => {
            if (activeView !== 'main') {
              onNavigate('main')
              setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
            } else {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          Start Automating
        </button>
      </div>
    </nav>
  )
}

export default Navbar
