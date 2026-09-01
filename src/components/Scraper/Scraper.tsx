import { useState } from 'react'
import { Link } from 'react-router-dom'
import { executeWebScrape, type ScraperResult, type ScrapedPageDetail } from '../../services/scraperEngine'
import { checkDemoLimitBlocked, setScrapedCompanyCookie, setScrapedLeadPayload } from '../../utils/cookieUtils'
import { IconArrowRight, IconBolt } from '../Icons'
import styles from './Scraper.module.css'

export const Scraper = () => {
  const [urlInput, setUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [consoleLog, setConsoleLog] = useState('')
  const [activeStage, setActiveStage] = useState(0)
  const [results, setResults] = useState<ScraperResult | null>(null)
  const [selectedPageIndex, setSelectedPageIndex] = useState(0)
  const [blockedInfo, setBlockedInfo] = useState<{ blocked: boolean; existingDomain?: string } | null>(null)
  const [showEmailCard, setShowEmailCard] = useState(false)
  const [copiedState, setCopiedState] = useState(false)

  const handleScrape = async (targetUrl?: string) => {
    const urlToScrape = targetUrl || urlInput
    if (!urlToScrape.trim()) return

    // Rule 2 Check: Limit 1 company scrape per session (triggers only on 2nd DIFFERENT company scan)
    const limitCheck = checkDemoLimitBlocked(urlToScrape)
    if (limitCheck.blocked) {
      setBlockedInfo(limitCheck)
      return
    }

    setBlockedInfo(null)
    setShowEmailCard(false)
    setLoading(true)
    setActiveStage(1)
    setConsoleLog('Connecting to web crawler service...')

    try {
      const data = await executeWebScrape(urlToScrape, (log, stage) => {
        setConsoleLog(log)
        setActiveStage(stage)
      })

      // Rule 1: Set session cookie & save full structured lead payload upon scrape completion
      setScrapedCompanyCookie(data.domain)
      setScrapedLeadPayload({
        domain: data.domain,
        companyName: data.companyName,
        primaryIndustry: data.primaryIndustry,
        techStack: data.techStack,
        totalPagesScraped: data.totalPagesScraped,
        primaryHeadline: data.pages[0]?.h1[0] || data.tagline,
        scrapedAt: new Date().toISOString(),
      })

      setResults(data)
      setSelectedPageIndex(0)
    } catch {
      setConsoleLog('Error scanning target website. Please check URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedPage: ScrapedPageDetail | null = results && results.pages[selectedPageIndex] ? results.pages[selectedPageIndex] : null

  // Generate Email Content
  const primaryPage = results?.pages[0]
  const headlineExcerpt = primaryPage?.h1[0] || 'your core business capabilities'
  const emailSubject = `Quick question on ${results?.companyName || 'your'}'s outbound pipeline`
  const emailBody = `Hi [Decision-Maker Name],

I was checking out ${results?.domain || 'your website'} and noticed your focus on "${headlineExcerpt}".

With ${results?.companyName || 'your team'} expanding operations in ${results?.primaryIndustry || 'B2B Software'}, GTMer's autonomous AI SDR workers can help your team discover qualified decision-makers, extract deep site context, and send hyper-personalized email campaigns on autopilot.

Would you be open to a quick 5-min demo this Thursday to see how GTMer delivers 18% reply rates?

Best regards,
GTMer AI SDR Agent`

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`)
    setCopiedState(true)
    setTimeout(() => setCopiedState(false), 2500)
  }

  // Construct full lead transfer link for login/portal redirect
  const leadLoginUrl = results
    ? `https://app.gtmer.ai/login?domain=${encodeURIComponent(results.domain)}&companyName=${encodeURIComponent(results.companyName)}&industry=${encodeURIComponent(results.primaryIndustry)}&action=import_scraped_lead&redirect=/dashboard`
    : 'https://app.gtmer.ai/login?redirect=/dashboard'

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
                  href={`https://app.gtmer.ai/login?domain=${encodeURIComponent(blockedInfo.existingDomain || '')}&action=import_scraped_lead&redirect=/leads`}
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
                { step: '5', label: 'Outreach', val: results ? 'Campaign Ready' : 'Ready' },
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
                    {results.pages.map((pg, idx) => (
                      <div
                        key={pg.path}
                        className={`${styles.pageRow} ${selectedPageIndex === idx ? styles.pageRowActive : ''}`}
                        onClick={() => setSelectedPageIndex(idx)}
                      >
                        <span className={styles.pagePath}>📄 {pg.path}</span>
                        <span className={styles.pageBadge}>{pg.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Detailed Business Explanation Breakdown */}
                  {selectedPage && (
                    <div className={styles.pageDetailCard}>
                      <div className={styles.detailHeader}>
                        <div className={styles.detailTitle}>{selectedPage.title}</div>
                        <div className={styles.detailUrl}>{selectedPage.url}</div>
                      </div>

                      {/* 1. Executive Page Summary */}
                      <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>Executive Page Summary</div>
                        <div className={styles.sectionValue}>
                          {selectedPage.executiveSummary || selectedPage.metaDescription}
                        </div>
                      </div>

                      {/* 2. Target Buyer Persona / Audience */}
                      {selectedPage.targetAudience && (
                        <div className={styles.sectionBlock}>
                          <div className={styles.sectionTitle}>Target Buyer Persona & Audience</div>
                          <div className={styles.sectionValue} style={{ color: '#0369a1', fontWeight: 500 }}>
                            🎯 {selectedPage.targetAudience}
                          </div>
                        </div>
                      )}

                      {/* 3. Core Value Propositions & Headlines */}
                      <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>Key Value Propositions & Main Headlines</div>
                        <div className={styles.headersList}>
                          {selectedPage.h1.map((headline, i) => (
                            <div key={i} className={styles.headerItem}>
                              <span style={{ color: '#64748b' }}>•</span>
                              <span><strong>Primary Value Proposition:</strong> "{headline}"</span>
                            </div>
                          ))}
                          {selectedPage.h2.map((feature, i) => (
                            <div key={i} className={styles.headerItem} style={{ opacity: 0.9 }}>
                              <span style={{ color: '#64748b' }}>•</span>
                              <span><strong>Key Feature Highlight:</strong> "{feature}"</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Sales Outreach Hook Suggestion */}
                      {selectedPage.outboundPitchHook && (
                        <div className={styles.sectionBlock} style={{ background: '#fef3c7', padding: '10px 12px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                          <div className={styles.sectionTitle} style={{ color: '#92400e' }}>💡 Suggested AI Outreach Email Angle</div>
                          <div className={styles.sectionValue} style={{ color: '#78350f', fontSize: '0.83rem', fontStyle: 'italic' }}>
                            "{selectedPage.outboundPitchHook}"
                          </div>
                        </div>
                      )}

                      {/* 5. Growth Signals & Technology Capabilities */}
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
                    onClick={() => setShowEmailCard(true)}
                    className={styles.generateEmailBtn}
                  >
                    <IconBolt size={18} />
                    Generate a Personalized Email
                    <IconArrowRight size={16} />
                  </button>
                </div>

                {/* Interactive AI Personalized Email Draft Card (Renders directly inside page) */}
                {showEmailCard && (
                  <div className={styles.emailDraftCard}>
                    <div className={styles.emailDraftHeader}>
                      <div className={styles.emailDraftTitle}>
                        <IconBolt size={20} style={{ color: '#d4952a' }} />
                        Generated AI Sales Outreach Email Draft
                      </div>
                      <span className={styles.pageBadge}>Ready to Send</span>
                    </div>

                    <div className={styles.emailMetaRow}>
                      <div className={styles.emailMetaItem}>
                        <strong>Target Domain:</strong> {results.domain}
                      </div>
                      <div className={styles.emailMetaItem}>
                        <strong>To Prospect:</strong> Decision-Maker (VP / Founder) @ {results.domain}
                      </div>
                      <div className={styles.emailMetaItem}>
                        <strong>Subject Line:</strong> {emailSubject}
                      </div>
                    </div>

                    <div className={styles.emailBodyText}>
                      {emailBody}
                    </div>

                    <div className={styles.emailActionRow}>
                      <button onClick={handleCopyEmail} className={styles.copyBtn}>
                        {copiedState ? '✓ Copied to Clipboard!' : '📋 Copy Email Draft'}
                      </button>
                      <a
                        href={leadLoginUrl}
                        className={styles.launchBtn}
                      >
                        🚀 Launch Automated Outreach Campaign
                        <IconArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Scraper
