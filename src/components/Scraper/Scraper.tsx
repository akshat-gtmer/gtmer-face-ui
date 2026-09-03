import { useState } from 'react'
import { Link } from 'react-router-dom'
import { executeWebScrape, type ScraperResult, type ScrapedPageDetail } from '../../services/scraperEngine'
import { checkDemoLimitBlocked, setScrapedCompanyCookie, setScrapedLeadPayload, getOrCreateScrapeSessionId } from '../../utils/cookieUtils'
import { IconArrowRight, IconBolt } from '../Icons'
import EmailCenterView from './EmailCenterView'
import styles from './Scraper.module.css'

export const Scraper = () => {
  const [urlInput, setUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [consoleLog, setConsoleLog] = useState('')
  const [activeStage, setActiveStage] = useState(0)
  const [results, setResults] = useState<ScraperResult | null>(null)
  const [selectedPageIndex, setSelectedPageIndex] = useState(0)
  const [blockedInfo, setBlockedInfo] = useState<{ blocked: boolean; existingDomain?: string } | null>(null)
  const [viewMode, setViewMode] = useState<'scraper' | 'email_center'>('scraper')

  const handleScrape = async (targetUrl?: string) => {
    const urlToScrape = targetUrl || urlInput
    if (!urlToScrape.trim()) return

    // Limit check: 1 company scrape per anonymous demo session. On scanning a 2nd website, redirect directly to login page!
    const limitCheck = checkDemoLimitBlocked(urlToScrape)
    if (limitCheck.blocked) {
      const sessionId = getOrCreateScrapeSessionId()
      const targetDomain = limitCheck.existingDomain || urlToScrape
      window.location.href = `https://dev.gtmer.ai/login?session_id=${encodeURIComponent(sessionId)}&target_domain=${encodeURIComponent(targetDomain)}&action=claim_lead&redirect=/dashboard`
      return
    }

    setBlockedInfo(null)
    setLoading(true)
    setActiveStage(1)
    setConsoleLog('Connecting to web crawler service...')

    try {
      const data = await executeWebScrape(urlToScrape, (log, stage) => {
        setConsoleLog(log)
        setActiveStage(stage)
      })

      // Rule 1: Set session cookie & save full structured lead payload upon scrape completion
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

      // Post to backend session endpoint
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
      setConsoleLog('Error scanning target website. Please check URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedPage: ScrapedPageDetail | null = results && results.pages[selectedPageIndex] ? results.pages[selectedPageIndex] : null

  if (viewMode === 'email_center' && results) {
    return (
      <section className={styles.section} style={{ padding: '24px 32px' }}>
        <div className={styles.container} style={{ maxWidth: '1420px', width: '100%', margin: '0 auto' }}>
          <Link to="/" className={styles.backLink}>
            ← Back to /gtmer
          </Link>
          <div className={styles.scraperWindow} style={{ width: '100%' }}>
            <EmailCenterView results={results} onBack={() => setViewMode('scraper')} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Technical Back Button */}
        <Link to="/" className={styles.backLink}>
          ← Back to /gtmer
        </Link>

        {/* Window Chrome Container */}
        <div className={styles.scraperWindow}>
          <div className={styles.windowHeader}>
            <div className={styles.windowDot} />
            <div className={styles.windowDot} />
            <div className={styles.windowDot} />
            <span className={styles.windowTitle}>gtmer / web-scraper-endpoint</span>
            <span className={styles.windowStatus}>● live endpoint</span>
          </div>

          <div className={styles.windowBody}>
            {/* Header Text */}
            <div className={styles.headerText}>
              <h1 className={styles.title}>Autonomous Web Scraper & Site Intelligence</h1>
              <p className={styles.subtitle}>
                Crawl any company website to extract decision-maker context, key business value propositions, technology signatures, and buying intent signals in seconds.
              </p>
            </div>

            {/* Search Input Box */}
            <div className={styles.searchPanel}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.urlInput}
                  value={urlInput}
                  onChange={e => {
                    setUrlInput(e.target.value)
                    setBlockedInfo(null)
                  }}
                  placeholder="Enter company website URL (e.g. https://yourcompany.com)"
                  disabled={loading}
                />
                <button
                  className={styles.scrapeBtn}
                  onClick={() => handleScrape()}
                  disabled={loading || !urlInput.trim()}
                >
                  {loading ? 'Scanning Website...' : 'Scrape Website'}
                  {!loading && <IconArrowRight size={14} />}
                </button>
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
                <a
                  href={`https://dev.gtmer.ai/login?session_id=${getOrCreateScrapeSessionId()}&domain=${encodeURIComponent(blockedInfo.existingDomain || '')}&action=claim_lead&redirect=/dashboard`}
                  className={styles.alertBtn}
                >
                  Sign In to Scrape Unlimited Companies
                  <IconArrowRight size={14} />
                </a>
              </div>
            )}

            {/* 5-Stage Pipeline Bar */}
            <div className={styles.pipelineStrip}>
              {[
                { step: '1', label: 'Crawl', val: results ? `${results.totalPagesScraped} pages` : '0 pages' },
                { step: '2', label: 'Summary', val: results ? 'Extracted' : 'Ready' },
                { step: '3', label: 'Pages', val: results ? `${results.pages.length} pages` : '0 discovered' },
                { step: '4', label: 'Signals', val: results ? `${results.techStack.length} signals` : '0 signals' },
                { step: '5', label: 'Intelligence', val: results ? 'Complete' : 'Ready' },
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
                {consoleLog || 'Enter any website URL above and click Scrape Website to begin.'}
              </div>
            )}

            {/* Scrape Overview Metrics & Results */}
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
                    <div className={styles.metricLabel}>Detected Technology Tools</div>
                    <div className={styles.metricVal} style={{ fontSize: '0.85rem' }}>{results.techStack.join(', ')}</div>
                  </div>
                </div>

                {/* Master-Detail Explorer */}
                <div className={styles.explorerGrid}>
                  {/* Left Column: Scraped Pages List */}
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
                          <span className={styles.pagePath}>📄 {displayPath}</span>
                          <span className={styles.pageBadge}>{pg.status}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Right Column: Detailed Business Explanation Breakdown */}
                  {selectedPage && (
                    <div className={styles.pageDetailCard}>
                      <div className={styles.detailHeader}>
                        <div className={styles.detailTitle}>{selectedPage.title}</div>
                        <div className={styles.detailUrl}>{selectedPage.url}</div>
                      </div>

                      {/* 1. Page Meta Description & Summary */}
                      <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>Page Summary</div>
                        <div className={styles.sectionValue}>
                          {selectedPage.executiveSummary || selectedPage.metaDescription}
                        </div>
                      </div>

                      {/* 2. Target Buyer Persona / Audience */}
                      {selectedPage.targetAudience && (
                        <div className={styles.sectionBlock}>
                          <div className={styles.sectionTitle}>Target Persona & Audience</div>
                          <div className={styles.sectionValue} style={{ color: '#0369a1', fontWeight: 500 }}>
                            🎯 {selectedPage.targetAudience}
                          </div>
                        </div>
                      )}

                      {/* 3. Key Value Propositions & Section Highlights */}
                      <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>Key Value Propositions & Core Focus</div>
                        
                        {selectedPage.h1.length > 0 && (
                          <div style={{ background: '#f0f9ff', borderLeft: '3px solid #0284c7', padding: '10px 14px', borderRadius: '4px', marginBottom: '10px', color: '#0369a1', fontWeight: 600, fontSize: '0.88rem' }}>
                            💡 Main Core Headline: "{selectedPage.h1[0]}"
                          </div>
                        )}

                        {selectedPage.h2.length > 0 && (
                          <div className={styles.headersList} style={{ gap: '6px' }}>
                            {selectedPage.h2.map((feature, i) => (
                              <div key={i} className={styles.headerItem} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 12px', borderRadius: '4px', fontSize: '0.83rem', color: '#334155', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: '#0284c7', fontWeight: 700, marginRight: '8px' }}>✦</span>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 4. Growth Signals & Technology Capabilities */}
                      <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>Growth Signals & Technology Capabilities</div>
                        <div className={styles.tagGroup}>
                          {selectedPage.keySignals.map(signal => (
                            <span key={signal} className={styles.tagPill}>
                              ⚡ Signal: {signal}
                            </span>
                          ))}
                          {selectedPage.techTags.map(tool => (
                            <span key={tool} className={styles.tagPill} style={{ opacity: 0.85 }}>
                              🛠️ Capability: {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Primary Action Button */}
                <div className={styles.bottomCtaSection}>
                  <button
                    onClick={() => {
                      setViewMode('email_center')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={styles.generateEmailBtn}
                  >
                    <IconBolt size={18} />
                    Generate a Personalized Email
                    <IconArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Scraper
