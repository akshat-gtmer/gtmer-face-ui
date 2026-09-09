import React, { useState, useEffect } from 'react'
import { API_BASE } from '../../config/api'
import { type ScraperResult } from '../../services/scraperEngine'
import {
  setScrapedLeadPayload,
  getOrCreateScrapeSessionId,
  getScrapedLeadPayload,
  saveDraftLocally,
  getLocalDrafts,
  type SavedEmailDraft
} from '../../utils/cookieUtils'
import {
  IconSend,
  IconRefresh,
  IconSettings,
  IconSearch,
  IconEdit,
  IconCheck,
  IconBolt,
  IconBarChart,
  IconUsers,
  IconBot,
  IconCalendar,
  IconTrendingUp,
  IconMail
} from '../Icons'
import styles from './EmailCenterView.module.css'

interface EmailCenterViewProps {
  results: ScraperResult
  onBack?: () => void
}

export const EmailCenterView: React.FC<EmailCenterViewProps> = ({ results, onBack }) => {
  const companyName = results.companyName || results.domain || 'Target Prospect'
  const domain = results.domain || 'company.com'
  const primaryIndustry = results.primaryIndustry || 'Software & Services'
  const headline = results.pages[0]?.h1[0] || results.tagline || 'Leading Solutions'

  // Default Email Subject & Body
  const defaultSubject = `Partnership Idea for ${companyName}`
  const defaultBody = `Hi there,\n\nI wanted to reach out regarding ${companyName}'s impressive standing in ${primaryIndustry}. With your primary focus around "${headline}", your organization represents a significant opportunity for innovative strategic collaboration.\n\nAt GTMer, we specialize in autonomous AI SDR agents and prospect intelligence. Given your company's growth trajectory and technical capabilities (${results.techStack.slice(0, 3).join(', ')}), we see strong potential to help streamline your customer acquisition and expand market reach.\n\nI'd love to share some tailored ideas that could benefit your team. Would you be open to a brief 15-minute call to explore possibilities?\n\nBest,\nThe GTMer Team`

  const existingPayload = getScrapedLeadPayload()

  const [subject, setSubject] = useState<string>(existingPayload?.generatedSubject || defaultSubject)
  const [emailBody, setEmailBody] = useState<string>(existingPayload?.generatedEmail || defaultBody)
  const [isEditing, setIsEditing] = useState<boolean>(true)
  const [saveStatus, setSaveStatus] = useState<string>('Saved')
  const [localDraftsList, setLocalDraftsList] = useState<SavedEmailDraft[]>(() => getLocalDrafts())

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const nowDate = new Date().toISOString().split('T')[0]
  const formattedTimestamp = `${nowDate} ${nowTime}`

  // Scroll to top on mount when Email Center view opens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Auto-save changes into lead payload cookie, localStorage, & dispatch CustomEvent
  useEffect(() => {
    const sessionId = getOrCreateScrapeSessionId()
    const leadEmail = `contact@${domain}`

    setScrapedLeadPayload({
      sessionId,
      domain: results.domain,
      companyName: results.companyName,
      primaryIndustry: results.primaryIndustry,
      techStack: results.techStack,
      totalPagesScraped: results.totalPagesScraped,
      primaryHeadline: headline,
      scrapedAt: new Date().toISOString(),
      generatedSubject: subject,
      generatedEmail: emailBody,
    })

    // Option B: Save via Local Storage (Instant Client Sync)
    saveDraftLocally({
      email: leadEmail,
      name: companyName,
      subject: subject,
      body: emailBody,
    })

    // Backend Ingest Endpoint Sync
    fetch(`${API_BASE}/scraper/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        domain: domain,
        company_name: companyName,
        generated_subject: subject,
        generated_email: emailBody,
        scraped_payload: {
          ...results,
          generatedSubject: subject,
          generatedEmail: emailBody,
        },
      }),
    }).catch(() => { /* silent fallback */ })

    setLocalDraftsList(getLocalDrafts())
    setSaveStatus('Saved')
  }, [subject, emailBody, results, headline, domain, companyName])

  const handleSend = () => {
    const sessionId = getOrCreateScrapeSessionId()
    setScrapedLeadPayload({
      sessionId,
      domain: results.domain,
      companyName: results.companyName,
      primaryIndustry: results.primaryIndustry,
      techStack: results.techStack,
      totalPagesScraped: results.totalPagesScraped,
      primaryHeadline: headline,
      scrapedAt: new Date().toISOString(),
      generatedSubject: subject,
      generatedEmail: emailBody,
    })

    saveDraftLocally({
      email: `contact@${domain}`,
      name: companyName,
      subject: subject,
      body: emailBody,
    })

    const queryParams = new URLSearchParams({
      session_id: sessionId,
      domain: domain,
      companyName: companyName,
      industry: primaryIndustry,
      subject: subject,
      emailBody: emailBody,
      action: 'claim_lead',
      redirect: '/dashboard',
    })

    const devGtmerUrl = `https://dev.gtmer.ai/login?${queryParams.toString()}`
    window.location.href = devGtmerUrl
  }

  return (
    <div className={styles.emailCenterWrapper}>
      {/* Outer Window Chrome Header Bar - White Background */}
      <div className={styles.windowChromeHeader}>
        <div className={styles.windowDots}>
          <span className={styles.windowDotRed} />
          <span className={styles.windowDotYellow} />
          <span className={styles.windowDotGreen} />
        </div>
        <div className={styles.windowChromeTitle}>
          <IconBolt size={14} />
          gtmer / email-center-endpoint
        </div>
        <div className={styles.windowChromeStatus}>
          <span className={styles.statusLiveDot} />
          <span className={styles.statusText}>Live Endpoint</span>
          {onBack && (
            <button className={styles.closeBtn} onClick={onBack} aria-label="Close Email Center">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Internal Navigation Sub-header Bar */}
      <div className={styles.topNavbar}>
        <div className={styles.navLeft}>
          <span className={styles.brandSlash}>/gtmer</span>
          <span className={styles.navTitle}>Email Center</span>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navToolBtn}>
            <IconSend size={14} /> Send Queue
          </button>
          <button className={styles.navToolBtn}>📋 Templates</button>
          <button className={styles.navToolBtn}>
            <IconSettings size={14} /> Settings
          </button>
          <button className={styles.navToolBtn}>
            <IconRefresh size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* App Body Container: Sidebars + Main Content */}
      <div className={styles.appBodyLayout}>
        {/* 1. Main Primary Vertical Sidebar (Static) */}
        <aside className={styles.primarySidebar}>
          <div className={styles.sidebarLogo}>/gtmer</div>

          <nav className={styles.primaryNav}>
            <div className={styles.navItem}>
              <IconBarChart size={18} />
              <span>Overview</span>
            </div>
            <div className={styles.navItem}>
              <IconUsers size={18} />
              <span>Leads</span>
            </div>
            <div className={`${styles.navItem} ${styles.navItemActive}`}>
              <IconSend size={18} />
              <span>Outreach</span>
            </div>
            <div className={styles.navItem}>
              <IconBot size={18} />
              <span>AI & Tools</span>
            </div>
            <div className={styles.navItem}>
              <IconCalendar size={18} />
              <span>Scheduling</span>
            </div>
            <div className={styles.navItem}>
              <IconTrendingUp size={18} />
              <span>Analytics</span>
            </div>
            <div className={`${styles.navItem} ${styles.navItemBottom}`}>
              <IconSettings size={18} />
              <span>Setup</span>
            </div>
          </nav>
        </aside>

        {/* 2. Secondary Sub-Navigation Sidebar (Static Outreach Menu) */}
        <aside className={styles.secondarySidebar}>
          <div className={styles.subSidebarHeader}>OUTREACH</div>
          
          <div className={styles.subCategoryGroup}>
            <div className={styles.subCategoryTitle}>
              <span>▾ EMAIL</span>
            </div>
            <div className={styles.subMenuList}>
              <div className={`${styles.subMenuItem} ${styles.subMenuItemActive}`}>
                <IconMail size={14} />
                <span>Email Center</span>
              </div>
              <div className={styles.subMenuItem}>
                <IconSend size={14} />
                <span>Send Queue</span>
              </div>
              <div className={styles.subMenuItem}>
                <span>📋 Templates</span>
              </div>
              <div className={styles.subMenuItem}>
                <IconSettings size={14} />
                <span>Email Settings</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 3. Main Content Workspace Area */}
        <main className={styles.contentContainer}>
          {/* Title Header */}
          <div className={styles.pageTitleHeader}>
            <div className={styles.titleRow}>
              <h1 className={styles.mainTitle}>Email Center</h1>
              {onBack && (
                <button className={styles.backBtn} onClick={onBack}>
                  ← Return to Scraper
                </button>
              )}
            </div>
            <div className={styles.subtitleText}>1 conversation · campaign-{domain.replace(/\./g, '-')}</div>
          </div>

          {/* 7 Top Metric Cards */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>TOTAL</div>
              <div className={styles.metricVal}>1</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>DRAFTS</div>
              <div className={styles.metricVal}>1</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>APPROVED</div>
              <div className={styles.metricVal}>0</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>SENT</div>
              <div className={styles.metricVal}>0</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>OPEN RATE</div>
              <div className={styles.metricVal}>0%</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>CLICK RATE</div>
              <div className={styles.metricVal}>0%</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>BOUNCES</div>
              <div className={styles.metricVal}>0</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className={styles.mainGrid}>
            {/* Left Column: Prospect Filter & List */}
            <div className={styles.leftColumn}>
              {/* Filter Pills */}
              <div className={styles.filterPillsRow}>
                <span className={styles.filterPill}>All 1</span>
                <span className={`${styles.filterPill} ${styles.filterPillActive}`}>Drafts 1</span>
                <span className={styles.filterPill}>Approved 0</span>
                <span className={styles.filterPill}>Rejected 0</span>
                <span className={styles.filterPill}>Sent 0</span>
                <span className={styles.filterPill}>Bounced 0</span>
              </div>

              {/* Batch Toolbar & Search */}
              <div className={styles.batchToolbar}>
                <button className={styles.approveAllBtn} onClick={handleSend}>
                  <IconCheck size={13} /> Approve (1)
                </button>
                <button className={styles.autoApproveBtn}>⚙ Auto-approve OFF</button>
              </div>
              <div className={styles.searchBoxWrapper}>
                <IconSearch size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search leads, subjects, message text..."
                />
              </div>

              {/* Prospects List Item */}
              <div className={styles.leadList}>
                <div className={`${styles.leadCard} ${styles.leadCardSelected}`}>
                  <div className={styles.leadAvatar}>{companyName.charAt(0).toUpperCase()}</div>
                  <div className={styles.leadMeta}>
                    <div className={styles.leadNameRow}>
                      <span className={styles.leadName}>{companyName}</span>
                      <span className={styles.timeTag}>Today</span>
                    </div>
                    <div className={styles.leadSnippet}>
                      You: {subject} — {emailBody.substring(0, 40)}...
                    </div>
                  </div>
                  <span className={styles.toApproveBadge}>1 to approve</span>
                </div>
              </div>
            </div>

            {/* Right Column: Email Draft Editor Card */}
            <div className={styles.rightColumn}>
              <div className={styles.draftCard}>
                {/* Card Header Info */}
                <div className={styles.draftHeader}>
                  <div className={styles.prospectHeaderInfo}>
                    <h2 className={styles.prospectTitle}>{companyName}</h2>
                    <div className={styles.prospectSubText}>
                      contact@{domain} · 0 sent · 0 replies
                    </div>
                  </div>
                  <div className={styles.metaBadgeRow}>
                    <span className={styles.userTag}>You</span>
                    <span className={styles.draftBadge}>Draft</span>
                    <span className={styles.timestampTag}>{formattedTimestamp}</span>
                  </div>
                </div>

                {/* Light Cream Container */}
                <div className={styles.emailBodyContainer}>
                  {/* Editable Subject Field */}
                  <div className={styles.subjectFieldGroup}>
                    <label className={styles.fieldLabel}>Subject:</label>
                    <input
                      type="text"
                      className={styles.subjectInput}
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Enter email subject..."
                    />
                  </div>

                  {/* Editable Email Body Field */}
                  <div className={styles.bodyFieldGroup}>
                    <textarea
                      className={styles.emailBodyTextarea}
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                      rows={12}
                      placeholder="Compose email body..."
                    />
                  </div>
                </div>

                {/* Bottom Action Toolbar */}
                <div className={styles.draftFooterToolbar}>
                  <div className={styles.footerStatus}>
                    <span className={styles.savedDot} /> {saveStatus}
                  </div>

                  <div className={styles.footerActions}>
                    <button
                      className={styles.editToggleBtn}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <IconEdit size={14} /> {isEditing ? 'Editing' : 'Edit Email'}
                    </button>

                    <button className={styles.sendCtaBtn} onClick={handleSend}>
                      <IconSend size={15} />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmailCenterView
