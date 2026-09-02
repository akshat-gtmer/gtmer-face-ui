import React, { useState, useEffect } from 'react'
import { executeWebScrape, type ScraperResult, type ScrapedPageDetail } from '../../services/scraperEngine'
import { checkDemoLimitBlocked, setScrapedCompanyCookie, setScrapedLeadPayload, getOrCreateScrapeSessionId } from '../../utils/cookieUtils'
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
      const sessionId = getOrCreateScrapeSessionId()
      window.location.href = `https://dev.gtmer.ai/login?session_id=${encodeURIComponent(sessionId)}&target_domain=${encodeURIComponent(urlToScrape)}&action=claim_lead&redirect=/dashboard`
      return
    }

    setLoading(true)
    setActiveStage(1)
    setConsoleLog('Connecting to crawler endpoint...')

    try {
      const data = await executeWebScrape(urlToScrape, (log, stage) => {
        setConsoleLog(log)
        setActiveStage(stage)
      })

      // Rule 1: Set cookie & session payload upon scrape completion
      const sessionId = getOrCreateScrapeSessionId()
      setScrapedCompanyCookie(data.domain)
      setScrapedLeadPayload({
        sessionId,
        domain: data.domain,
        companyName: data.companyName,
        primaryIndustry: data.primaryIndustry,
        techStack: data.techStack,
        totalPagesScraped: data.totalPagesScraped,
        primaryHeadline: data.pages[0]?.h1[0] || data.tagline,
        scrapedAt: new Date().toISOString(),
      })

      // Send payload to backend session ingest endpoint
      fetch('https://dev.gtmer.ai/api/v1/scraper/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          domain: data.domain,
          company_name: data.companyName,
          scraped_payload: data,
        }),
      }).catch(() => { /* silent fallback */ })

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
                  {results.pages.map((pg, idx) => {
                    let displayPath = pg.path
                    try { displayPath = decodeURIComponent(pg.path) } catch { /* pass */ }
                    return (
                      <div
                        key={pg.path}
                        className={`${styles.pageRow} ${selectedPageIndex === idx ? styles.pageRowActive : ''}`}
                        onClick={() => setSelectedPageIndex(idx)}
                        title={displayPath}
                      >
                        <span className={styles.pagePath}>🗂️ {displayPath}</span>
                        <span className={styles.pageBadge}>{pg.status}</span>
                      </div>
                    )
                  })}
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
                      <div className={styles.sectionTitle}>Key Value Propositions & Core Focus</div>
                      
                      {selectedPage.h1.length > 0 && (
                        <div style={{ background: 'rgba(77, 168, 218, 0.12)', borderLeft: '3px solid #7dd3fc', padding: '10px 14px', borderRadius: '4px', marginBottom: '10px', color: '#e8f0f8', fontWeight: 600, fontSize: '0.88rem' }}>
                          💡 Main Core Headline: "{selectedPage.h1[0]}"
                        </div>
                      )}

                      {selectedPage.h2.length > 0 && (
                        <div className={styles.headersList} style={{ gap: '6px' }}>
                          {selectedPage.h2.map((feature, i) => (
                            <div key={i} className={styles.headerItem} style={{ background: 'rgba(6, 21, 38, 0.6)', border: '1px solid rgba(77, 168, 218, 0.2)', padding: '7px 12px', borderRadius: '4px', fontSize: '0.83rem', color: '#e8f0f8', display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: '#7dd3fc', fontWeight: 700, marginRight: '8px' }}>✦</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
                  href={`https://dev.gtmer.ai/login?session_id=${getOrCreateScrapeSessionId()}&target_domain=${encodeURIComponent(results.domain)}&action=claim_lead`}
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
