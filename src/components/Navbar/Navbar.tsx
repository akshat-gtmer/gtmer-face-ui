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

const SCROLL_ITEMS: DropdownItem[] = [
  { id: 'dd-how', icon: '→', label: '/gtmer-how-it-works', desc: '4-step pipeline', action: 'scroll', target: 'how-it-works' },
  { id: 'dd-pipeline', icon: '→', label: '/gtmer-pipeline', desc: 'Live kanban board', action: 'scroll', target: 'pipeline-section' },
  { id: 'dd-usecases', icon: '→', label: '/gtmer-use-cases', desc: 'Who uses GTMer', action: 'scroll', target: 'use-cases' },
  { id: 'dd-testimonials', icon: '→', label: '/gtmer-testimonials', desc: 'Proven results', action: 'scroll', target: 'testimonials' },
  { id: 'dd-faq', icon: '→', label: '/gtmer-faq', desc: 'Common questions', action: 'scroll', target: 'faq' },
  { id: 'dd-contact', icon: '→', label: '/gtmer-contact', desc: 'Get in touch', action: 'scroll', target: 'contact' },
]

const NAV_SECTIONS = [
  { id: 'hero-section' }, { id: 'numbers-section' }, { id: 'how-it-works' },
  { id: 'pipeline-section' }, { id: 'use-cases' }, { id: 'testimonials' },
  { id: 'faq' }, { id: 'contact' },
]

const Navbar = ({ onNavigate, activeView }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero-section')
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    setDropdownOpen(false)
    if (item.action === 'view') {
      onNavigate(item.target)
    } else {
      // If we're not on main view, go home first then scroll
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
          <span className={styles.itemIcon}>{item.icon}</span>
          <div className={styles.itemText}>
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemDesc}>{item.desc}</span>
          </div>
        </button>
      ))}
    </div>
  )

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
          <img src="/logo-dark.jpg" alt="GTMer logo" className={styles.logoImage} />
          <span className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
        </button>

        {/* Mega Dropdown */}
        <div
          className={`${styles.dropdown} ${dropdownOpen ? styles.visible : ''}`}
          role="menu"
          id="nav-dropdown-menu"
        >
          <div className={styles.dropdownInner}>
            <div className={styles.dropdownCol}>
              {renderGroup('Platform', PLATFORM_ITEMS)}
              {renderGroup('Explore', EXPLORE_ITEMS)}
            </div>
            <div className={styles.dropdownCol}>
              {renderGroup('Sections', SCROLL_ITEMS)}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Logo text + dots */}
      {scrolled && <div className={styles.center}>
        <button
          className={styles.logoTextBtn}
          onClick={() => onNavigate('main')}
          aria-label="Go home"
        >
          <span className={styles.logoSlash}>/</span>gtmer
        </button>
        {activeView === 'main' && (
          <div className={styles.sectionDots}>
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                className={`${styles.sectionDot} ${activeSection === s.id ? styles.sectionDotActive : ''}`}
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                aria-label={`Go to ${s.id}`}
              />
            ))}
          </div>
        )}
      </div>}

      {/* Right: CTA only */}
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
