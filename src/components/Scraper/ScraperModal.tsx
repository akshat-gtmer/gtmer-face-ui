import React, { useState, useEffect } from 'react'
import { executeWebScrape, type ScraperResult, type ScrapedPageDetail } from '../../services/scraperEngine'
import { checkDemoLimitBlocked, setScrapedCompanyCookie } from '../../utils/cookieUtils'
import { IconArrowRight, IconBolt } from '../Icons'
import styles from './ScraperModal.module.css'

interface ScraperModalProps {
  isOpen: boolean
  onClose: () => void
  initialUrl?: string
}

export const ScraperModal: React.FC<ScraperModalProps> = ({ isOpen, onClose, initialUrl = 'https://stripe.com' }) => {
  const [urlInput, setUrlInput] = useState(initialUrl)
  const [loading, setLoading] = useState(false)
  const [consoleLog, setConsoleLog] = useState('')
  const [activeStage, setActiveStage] = useState(0)
  const [results, setResults] = useState<ScraperResult | null>(null)
  const [selectedPageIndex, setSelectedPageIndex] = useState(0)
  const [blockedInfo, setBlockedInfo] = useState<{ blocked: boolean; existingDomain?: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleScrape = async (targetUrl?: string) => {
    const urlToScrape = targetUrl || urlInput
    if (!urlToScrape.trim()) return

    // Rule 2 Check: Limit 1 company scrape per session
    const limitCheck = checkDemoLimitBlocked(urlToScrape)
    if (limitCheck.blocked) {
      setBlockedInfo(limitCheck)
      return
    }

    setBlockedInfo(null)
    setLoading(true)
    setActiveStage(1)
    setConsoleLog('Connecting to crawler endpoint...')

    try {
      const data = await executeWebScrape(urlToScrape, (log, stage) => {
        setConsoleLog(log)
        setActiveStage(stage)
      })

      // Rule 1: Set cookie upon scrape completion
      setScrapedCompanyCookie(data.domain)

      setResults(data)
      setSelectedPageIndex(0)
    } catch {
      setConsoleLog('Error connecting to scraper endpoint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedPage: ScrapedPageDetail | null = results && results.pages[selectedPageIndex] ? results.pages[selectedPageIndex] : null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalWindow} onClick={e => e.stopPropagation()}>
        {/* Window Chrome Header */}
        <div className={styles.windowHeader}>
          <div className={styles.windowDots}>
            <span className={styles.windowDotRed} />
            <span className={styles.windowDotYellow} />
            <span className={styles.windowDotGreen} />
          </div>
          <div className={styles.windowTitle}>
            <IconBolt size={14} />
            gtmer / autonomous-web-scraper
          </div>
          <div className={styles.windowStatus}>
            <span className={styles.statusLiveDot} />
            <span className={styles.statusText}>Live Endpoint</span>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Search Controls */}
          <div className={styles.searchPanel}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.urlInput}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Enter website URL e.g. https://stripe.com"
                disabled={loading}
              />
              <button
                className={styles.scrapeBtn}
                onClick={() => handleScrape()}
                disabled={loading}
              >
                {loading ? 'Scraping...' : 'Scrape Website'}
                {!loading && <IconArrowRight size={14} />}
              </button>
            </div>

            {/* Presets */}
            <div className={styles.presetRow}>
              <span className={styles.presetLabel}>Quick Presets:</span>
              {['https://stripe.com', 'https://linear.app', 'https://vercel.com', 'https://postman.com'].map(preset => (
                <button
                  key={preset}
                  className={styles.presetPill}
                  onClick={() => {
                    setUrlInput(preset)
                    handleScrape(preset)
                  }}
                  disabled={loading}
                >
                  {preset.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Rule 2 Limit Warning Alert */}
          {blockedInfo && blockedInfo.blocked && (
            <div className={styles.limitAlert}>
              <div className={styles.alertHeader}>
                ⚠️ Free Demo Limit Reached (1 Company Scrape per Session)
              </div>
              <div className={styles.alertText}>
                You have already scraped <strong>{blockedInfo.existingDomain}</strong> during this demo session.
                To scrape unlimited company websites and export enriched prospect profiles, please sign in to your GTMer account.
              </div>
              <a href="https://app.gtmer.ai/login" className={styles.alertBtn}>
                Sign In to Scrape Unlimited Companies
                <IconArrowRight size={14} />
              </a>
            </div>
          )}

          {/* 5-Stage Pipeline Bar */}
          <div className={styles.pipelineStrip}>
            {[
              { step: '1', label: 'Crawl', val: results ? `${results.totalPagesScraped} pages` : 'Pending' },
              { step: '2', label: 'Summary', val: results ? 'Extracted' : 'Pending' },
              { step: '3', label: 'Pages', val: results ? `${results.pages.length} pages` : 'Pending' },
              { step: '4', label: 'Signals', val: results ? `${results.techStack.length} signals` : 'Pending' },
              { step: '5', label: 'Outreach', val: results ? 'Ready' : 'Pending' },
            ].map((st, i) => {
              const stageNum = i + 1
              const isDone = activeStage > stageNum || (results && !loading)
              const isActive = activeStage === stageNum && loading
              return (
                <div
                  key={st.label}
                  className={`${styles.stageCard} ${isActive ? styles.stageCardActive : ''} ${isDone ? styles.stageCardDone : ''}`}
                >
                  <div className={styles.stageHeader}>
                    <span className={`${styles.stageStep} ${isDone ? styles.stageStepDone : ''} ${isActive ? styles.stageStepActive : ''}`}>
                      {isDone ? '✓' : st.step}
                    </span>
                    <span className={styles.stageLabel}>{st.label}</span>
                  </div>
                  <span className={styles.stageVal}>{st.val}</span>
                </div>
              )
            })}
          </div>

          {/* Console Log Bar */}
          {(loading || consoleLog) && (
            <div className={styles.consoleBox}>
              {consoleLog || 'Ready to initiate web scraper endpoint.'}
            </div>
          )}

          {/* Scrape Overview Metrics */}
          {results && (
            <>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Total Pages Scraped</div>
                  <div className={styles.metricVal}>{results.totalPagesScraped} pages</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Discovered Links</div>
                  <div className={styles.metricVal}>{results.totalDiscoveredLinks} links</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Primary Industry</div>
                  <div className={styles.metricVal} style={{ fontSize: '0.85rem' }}>{results.primaryIndustry}</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Detected Tech Stack</div>
                  <div className={styles.metricVal} style={{ fontSize: '0.85rem' }}>{results.techStack.join(', ')}</div>
                </div>
              </div>

              {/* Master-Detail Explorer */}
              <div className={styles.explorerGrid}>
                {/* Left: Scraped Pages List */}
                <div className={styles.pageListContainer}>
                  <div className={styles.pageListHeader}>Scraped Pages ({results.pages.length})</div>
                  {results.pages.map((pg, idx) => (
                    <div
                      key={pg.path}
                      className={`${styles.pageRow} ${selectedPageIndex === idx ? styles.pageRowActive : ''}`}
                      onClick={() => setSelectedPageIndex(idx)}
                    >
                      <span className={styles.pagePath}>🗂️ {pg.path}</span>
                      <span className={styles.pageBadge}>{pg.status}</span>
                    </div>
                  ))}
                </div>

                {/* Right: Selected Page Details */}
                {selectedPage && (
                  <div className={styles.pageDetailCard}>
                    <div className={styles.detailHeader}>
                      <div className={styles.detailTitle}>{selectedPage.title}</div>
                      <div className={styles.detailUrl}>{selectedPage.url}</div>
                    </div>

                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionTitle}>Meta Description</div>
                      <div className={styles.sectionValue}>{selectedPage.metaDescription}</div>
                    </div>

                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionTitle}>Extracted Headings (H1 & H2)</div>
                      <div className={styles.headersList}>
                        {selectedPage.h1.map((h, i) => (
                          <div key={i} className={styles.headerItem}>H1: "{h}"</div>
                        ))}
                        {selectedPage.h2.map((h, i) => (
                          <div key={i} className={styles.headerItem} style={{ opacity: 0.85 }}>H2: "{h}"</div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionTitle}>Detected Signals & Tech Tags</div>
                      <div className={styles.tagGroup}>
                        {selectedPage.keySignals.map(sig => (
                          <span key={sig} className={styles.tagPill}>⚡ {sig}</span>
                        ))}
                        {selectedPage.techTags.map(tag => (
                          <span key={tag} className={styles.tagPill} style={{ opacity: 0.8 }}>🛠️ {tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action CTA Button */}
              <div className={styles.bottomCtaSection}>
                <a
                  href={`https://app.gtmer.ai/login?action=generate_email&target_domain=${results.domain}`}
                  className={styles.generateEmailBtn}
                >
                  <IconBolt size={18} />
                  Generate a Personalized Email
                  <IconArrowRight size={16} />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default ScraperModal
