import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../../config/api'
import styles from './AdminLeads.module.css'

interface LeadRecord {
  id: string
  visitorId: string
  email?: string
  phone?: string
  fullName?: string
  orgName?: string
  scrapedDomain?: string
  source: string
  clientIp?: string
  clientSpecs?: Record<string, unknown>
  attribution?: Record<string, unknown>
  receivedAt: string
}

interface TelemetryEvent {
  id: string
  eventType: 'pageview' | 'click'
  pagePath: string
  pageTitle?: string
  buttonText?: string
  buttonId?: string
  targetUrl?: string
  userEmail?: string
  visitorId: string
  receivedAt: string
}

interface UserJourney {
  userKey: string
  userEmail?: string | null
  visitorId: string
  fullName?: string | null
  orgName?: string | null
  pageviewCount: number
  clickCount: number
  totalEvents: number
  firstSeenAt: string
  lastActiveAt: string
  timeline: TelemetryEvent[]
}

interface AnalyticsSummary {
  totalPageviews: number
  totalClicks: number
  totalEvents: number
  uniqueVisitors: number
  totalUniqueUsers?: number
  topPages: Array<{ path: string; count: number }>
  topButtons: Array<{ name: string; count: number }>
  userJourneys?: UserJourney[]
  events: TelemetryEvent[]
}

export const AdminLeads = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'telemetry'>('leads')
  const [telemetrySubView, setTelemetrySubView] = useState<'journeys' | 'stream'>('journeys')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserJourney, setSelectedUserJourney] = useState<UserJourney | null>(null)
  const [modalTab, setModalTab] = useState<'all' | 'pages' | 'clicks'>('all')

  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getApiBase = () => {
    return 'https://dev.gtmer.ai'
  }

  const fetchDashboardData = async (query = searchQuery) => {
    setLoading(true)
    setError(null)

    try {
      // 1. Fetch Captured Leads
      const leadsRes = await fetch(`${API_BASE}/leads`)
      if (!leadsRes.ok) throw new Error('Could not connect to backend engine.')
      const leadsData = await leadsRes.json()
      setLeads(leadsData.leads || [])

      // 2. Fetch Analytics & Telemetry Summary
      const queryParam = query ? `?search=${encodeURIComponent(query)}` : ''
      const analyticsRes = await fetch(`${API_BASE}/analytics/summary${queryParam}`)
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDashboardData(searchQuery)
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header Bar */}
        <div className={styles.headerBar}>
          <div>
            <h1 className={styles.title}>GTMer Analytics & Lead Control Center</h1>
            <p className={styles.subtitle}>
              Real-time inspection dashboard for user leads, per-user page navigation, and button click traces.
            </p>
          </div>
          <button onClick={() => fetchDashboardData(searchQuery)} className={styles.refreshBtn} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh Live Data'}
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>
            ⚠️ {error} — Ensure your backend server is running (`cd backend && npm start`).
          </div>
        )}

        {/* Real-Time Metric Counter Cards */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📊</div>
            <div>
              <div className={styles.metricLabel}>Total Page Views</div>
              <div className={styles.metricValue}>{analytics ? analytics.totalPageviews.toLocaleString() : '0'}</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>🖱️</div>
            <div>
              <div className={styles.metricLabel}>Total Button Clicks</div>
              <div className={styles.metricValue}>{analytics ? analytics.totalClicks.toLocaleString() : '0'}</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>👥</div>
            <div>
              <div className={styles.metricLabel}>Tracked Users / Visitors</div>
              <div className={styles.metricValue}>{analytics ? (analytics.totalUniqueUsers || analytics.uniqueVisitors).toLocaleString() : '0'}</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>⚡</div>
            <div>
              <div className={styles.metricLabel}>Captured Lead Accounts</div>
              <div className={styles.metricValue}>{leads.length.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Top Activity Breakdown Widgets */}
        {analytics && (analytics.topPages.length > 0 || analytics.topButtons.length > 0) && (
          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>🔝 Top Visited Pages</h3>
              {analytics.topPages.length === 0 ? (
                <p className={styles.emptyText}>No pageviews recorded yet.</p>
              ) : (
                <ul className={styles.breakdownList}>
                  {analytics.topPages.map((item, idx) => (
                    <li key={idx} className={styles.breakdownItem}>
                      <span className={styles.breakdownName}>{item.path}</span>
                      <span className={styles.breakdownBadge}>{item.count} views</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>🎯 Top Clicked Buttons & CTAs</h3>
              {analytics.topButtons.length === 0 ? (
                <p className={styles.emptyText}>No button clicks recorded yet.</p>
              ) : (
                <ul className={styles.breakdownList}>
                  {analytics.topButtons.map((item, idx) => (
                    <li key={idx} className={styles.breakdownItem}>
                      <span className={styles.breakdownName}>{item.name}</span>
                      <span className={styles.breakdownBadgeClick}>{item.count} clicks</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Main Tab Selector */}
        <div className={styles.tabHeader}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'leads' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            👥 Captured User Leads ({leads.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'telemetry' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            📍 Per-User Telemetry & Click Traces ({analytics ? (analytics.userJourneys?.length || analytics.events.length) : 0})
          </button>
        </div>

        {/* TAB 1: Captured User Leads */}
        {activeTab === 'leads' && (
          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Captured Lead Records ({leads.length})</span>
            </div>

            {leads.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No captured leads yet. Go to <Link to="/signup">/signup</Link> or test the Google prompt to generate test records!</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Email Address</th>
                      <th>Full Name</th>
                      <th>Phone</th>
                      <th>Org / Domain</th>
                      <th>Tier / Source</th>
                      <th>Visitor ID</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td className={styles.monoCell}>
                          {new Date(lead.receivedAt).toLocaleTimeString()}
                        </td>
                        <td className={styles.highlightCell}>
                          {lead.email || <span className={styles.muted}>N/A</span>}
                        </td>
                        <td>{lead.fullName || <span className={styles.muted}>Anonymous</span>}</td>
                        <td>{lead.phone || <span className={styles.muted}>N/A</span>}</td>
                        <td>{lead.scrapedDomain || lead.orgName || <span className={styles.muted}>Direct</span>}</td>
                        <td>
                          <span className={styles.badge}>{lead.source}</span>
                        </td>
                        <td className={styles.monoCell}>{lead.visitorId}</td>
                        <td className={styles.monoCell}>
                          {lead.clientIp || '127.0.0.1'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Per-User Telemetry & Click Traces */}
        {activeTab === 'telemetry' && (
          <div className={styles.tableCard}>
            {/* Sub-view Controls & Search */}
            <div className={styles.controlsBar}>
              <div className={styles.viewToggleGroup}>
                <button
                  className={`${styles.viewToggleBtn} ${telemetrySubView === 'journeys' ? styles.activeViewToggle : ''}`}
                  onClick={() => setTelemetrySubView('journeys')}
                >
                  👤 Per-User Activity ({analytics?.userJourneys?.length || 0})
                </button>
                <button
                  className={`${styles.viewToggleBtn} ${telemetrySubView === 'stream' ? styles.activeViewToggle : ''}`}
                  onClick={() => setTelemetrySubView('stream')}
                >
                  ⚡ Live Activity Stream ({analytics?.events?.length || 0})
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className={styles.searchInputWrapper}>
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Filter by user email, visitor ID, button text, or page path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </form>
            </div>

            {/* VIEW A: Per-User Activity Journeys */}
            {telemetrySubView === 'journeys' && (
              <>
                {!analytics || !analytics.userJourneys || analytics.userJourneys.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No user activity sessions found matching your filter criteria.</p>
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>User / Visitor Identity</th>
                          <th>Full Name / Org</th>
                          <th>Pages Visited</th>
                          <th>Buttons Clicked</th>
                          <th>Total Events</th>
                          <th>Last Active</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.userJourneys.map(user => (
                          <tr key={user.userKey}>
                            <td>
                              {user.userEmail ? (
                                <span className={styles.emailTag}>📧 {user.userEmail}</span>
                              ) : (
                                <span className={styles.monoCell}>👤 {user.visitorId}</span>
                              )}
                            </td>
                            <td>
                              {user.fullName ? (
                                <strong>{user.fullName} {user.orgName ? `(${user.orgName})` : ''}</strong>
                              ) : (
                                <span className={styles.muted}>Anonymous Visitor</span>
                              )}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedUserJourney(user)
                                  setModalTab('pages')
                                }}
                                className={`${styles.pageviewBadge} ${styles.clickableBadge}`}
                                title={`Click to view pages visited by ${user.fullName || user.userEmail || user.visitorId}`}
                              >
                                📄 {user.pageviewCount} pages
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedUserJourney(user)
                                  setModalTab('clicks')
                                }}
                                className={`${styles.clickBadge} ${styles.clickableBadge}`}
                                title={`Click to view buttons clicked by ${user.fullName || user.userEmail || user.visitorId}`}
                              >
                                🖱️ {user.clickCount} clicks
                              </button>
                            </td>
                            <td className={styles.monoCell}>{user.totalEvents} events</td>
                            <td className={styles.monoCell}>{new Date(user.lastActiveAt).toLocaleString()}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedUserJourney(user)
                                  setModalTab('all')
                                }}
                                className={styles.inspectBtn}
                              >
                                🔍 Inspect Activity Log
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* VIEW B: Flat Live Event Stream */}
            {telemetrySubView === 'stream' && (
              <>
                {!analytics || analytics.events.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No real-time telemetry events recorded yet. Navigate across pages or click buttons to view live activity traces!</p>
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Event Type</th>
                          <th>Page Path</th>
                          <th>Click / Details</th>
                          <th>User / Visitor ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.events.map(event => (
                          <tr key={event.id}>
                            <td className={styles.monoCell}>
                              {new Date(event.receivedAt).toLocaleTimeString()}
                            </td>
                            <td>
                              {event.eventType === 'pageview' ? (
                                <span className={styles.pageviewBadge}>📄 Page View</span>
                              ) : (
                                <span className={styles.clickBadge}>🖱️ Click</span>
                              )}
                            </td>
                            <td className={styles.highlightCell}>{event.pagePath}</td>
                            <td>
                              {event.eventType === 'click' ? (
                                <strong className={styles.clickDetail}>
                                  "{event.buttonText || 'Button'}"
                                  {event.targetUrl && <span className={styles.targetUrl}> ➔ {event.targetUrl}</span>}
                                </strong>
                              ) : (
                                <span className={styles.muted}>{event.pageTitle || 'Navigation'}</span>
                              )}
                            </td>
                            <td className={styles.monoCell}>
                              {event.userEmail ? (
                                <span className={styles.emailTag}>📧 {event.userEmail}</span>
                              ) : (
                                <span>{event.visitorId}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* USER ACTIVITY TIMELINE & DETAILED LOG MODAL */}
      {selectedUserJourney && (() => {
        const eventsToDisplay = selectedUserJourney.timeline.filter(ev => {
          if (modalTab === 'pages') return ev.eventType === 'pageview'
          if (modalTab === 'clicks') return ev.eventType === 'click'
          return true
        })

        // Calculate unique pages breakdown for modal Tab 'pages' or summary
        const pageBreakdownObj = selectedUserJourney.timeline
          .filter(ev => ev.eventType === 'pageview')
          .reduce((acc, ev) => {
            const key = ev.pagePath || '/'
            if (!acc[key]) {
              acc[key] = { count: 0, title: ev.pageTitle, lastVisited: ev.receivedAt }
            }
            acc[key].count += 1
            if (new Date(ev.receivedAt) > new Date(acc[key].lastVisited)) {
              acc[key].lastVisited = ev.receivedAt
            }
            return acc
          }, {} as Record<string, { count: number; title?: string; lastVisited: string }>)
        const pageBreakdownList = Object.entries(pageBreakdownObj)

        // Calculate unique buttons breakdown for modal Tab 'clicks' or summary
        const buttonBreakdownObj = selectedUserJourney.timeline
          .filter(ev => ev.eventType === 'click')
          .reduce((acc, ev) => {
            const key = `${ev.buttonText || 'Button'}@${ev.pagePath}`
            if (!acc[key]) {
              acc[key] = {
                buttonText: ev.buttonText || 'Button',
                buttonId: ev.buttonId,
                pagePath: ev.pagePath,
                targetUrl: ev.targetUrl,
                count: 0,
                lastClicked: ev.receivedAt
              }
            }
            acc[key].count += 1
            if (new Date(ev.receivedAt) > new Date(acc[key].lastClicked)) {
              acc[key].lastClicked = ev.receivedAt
            }
            return acc
          }, {} as Record<string, { buttonText: string; buttonId?: string; pagePath: string; targetUrl?: string; count: number; lastClicked: string }>)
        const buttonBreakdownList = Object.values(buttonBreakdownObj)

        return (
          <div className={styles.modalOverlay} onClick={() => setSelectedUserJourney(null)}>
            <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <span>🔍 User Activity Journey Log</span>
                </div>
                <button className={styles.modalCloseBtn} onClick={() => setSelectedUserJourney(null)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* User Metadata Header Bar */}
                <div className={styles.userSummaryBar}>
                  <div className={styles.userSummaryItem}>
                    <span className={styles.userSummaryLabel}>User Identifier</span>
                    <span className={styles.userSummaryVal}>
                      {selectedUserJourney.userEmail ? `📧 ${selectedUserJourney.userEmail}` : selectedUserJourney.visitorId}
                    </span>
                  </div>
                  <div className={styles.userSummaryItem}>
                    <span className={styles.userSummaryLabel}>Full Name / Org</span>
                    <span className={styles.userSummaryVal}>
                      {selectedUserJourney.fullName || 'Anonymous Visitor'} {selectedUserJourney.orgName ? `(${selectedUserJourney.orgName})` : ''}
                    </span>
                  </div>
                  <div
                    className={`${styles.userSummaryItem} ${styles.clickableSummaryItem}`}
                    onClick={() => setModalTab('pages')}
                    title="Filter modal by pages visited"
                  >
                    <span className={styles.userSummaryLabel}>Page Views</span>
                    <span className={styles.userSummaryVal}>📄 {selectedUserJourney.pageviewCount}</span>
                  </div>
                  <div
                    className={`${styles.userSummaryItem} ${styles.clickableSummaryItem}`}
                    onClick={() => setModalTab('clicks')}
                    title="Filter modal by buttons clicked"
                  >
                    <span className={styles.userSummaryLabel}>Button Clicks</span>
                    <span className={styles.userSummaryVal}>🖱️ {selectedUserJourney.clickCount}</span>
                  </div>
                  <div
                    className={`${styles.userSummaryItem} ${styles.clickableSummaryItem}`}
                    onClick={() => setModalTab('all')}
                    title="Show all activity events"
                  >
                    <span className={styles.userSummaryLabel}>Total Events</span>
                    <span className={styles.userSummaryVal}>{selectedUserJourney.totalEvents}</span>
                  </div>
                </div>

                {/* Sub-view Filter Tabs in Modal */}
                <div className={styles.modalTabSelector}>
                  <button
                    className={`${styles.modalTabBtn} ${modalTab === 'all' ? styles.activeModalTab : ''}`}
                    onClick={() => setModalTab('all')}
                  >
                    📋 All Activity ({selectedUserJourney.totalEvents})
                  </button>
                  <button
                    className={`${styles.modalTabBtn} ${modalTab === 'pages' ? styles.activeModalTab : ''}`}
                    onClick={() => setModalTab('pages')}
                  >
                    📄 Pages Visited ({selectedUserJourney.pageviewCount})
                  </button>
                  <button
                    className={`${styles.modalTabBtn} ${modalTab === 'clicks' ? styles.activeModalTab : ''}`}
                    onClick={() => setModalTab('clicks')}
                  >
                    🖱️ Buttons Clicked ({selectedUserJourney.clickCount})
                  </button>
                </div>

                {/* VISITED PAGES SUMMARY BOX (When modalTab === 'pages') */}
                {modalTab === 'pages' && (
                  <div className={styles.modalBreakdownCard}>
                    <div className={styles.modalBreakdownHeader}>
                      <span>📄 Visited Pages Summary ({pageBreakdownList.length} Unique Pages)</span>
                    </div>
                    {pageBreakdownList.length === 0 ? (
                      <p className={styles.emptyText}>No page views recorded for this user.</p>
                    ) : (
                      <div className={styles.modalBreakdownGrid}>
                        {pageBreakdownList.map(([path, data], i) => (
                          <div key={i} className={styles.modalBreakdownPill}>
                            <div className={styles.modalBreakdownPillLeft}>
                              <span className={styles.highlightCell}>{path}</span>
                              {data.title && <span className={styles.targetUrl}> ({data.title})</span>}
                            </div>
                            <div className={styles.modalBreakdownPillRight}>
                              <span className={styles.pageviewBadge}>{data.count} views</span>
                              <span className={styles.monoCell}>{new Date(data.lastVisited).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CLICKED BUTTONS SUMMARY BOX (When modalTab === 'clicks') */}
                {modalTab === 'clicks' && (
                  <div className={styles.modalBreakdownCard}>
                    <div className={styles.modalBreakdownHeader}>
                      <span>🖱️ Clicked Buttons Summary ({buttonBreakdownList.length} Unique Buttons)</span>
                    </div>
                    {buttonBreakdownList.length === 0 ? (
                      <p className={styles.emptyText}>No button clicks recorded for this user.</p>
                    ) : (
                      <div className={styles.modalBreakdownGrid}>
                        {buttonBreakdownList.map((item, i) => (
                          <div key={i} className={styles.modalBreakdownPill}>
                            <div className={styles.modalBreakdownPillLeft}>
                              <strong>"{item.buttonText}"</strong>
                              <span className={styles.targetUrl}> on {item.pagePath}</span>
                              {item.targetUrl && <span className={styles.targetUrl}> ➔ {item.targetUrl}</span>}
                            </div>
                            <div className={styles.modalBreakdownPillRight}>
                              <span className={styles.clickBadge}>{item.count} clicks</span>
                              <span className={styles.monoCell}>{new Date(item.lastClicked).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Chronological Event Timeline */}
                <div className={styles.timelineTitle}>
                  ⏱️ {modalTab === 'pages' ? 'Page Navigation History' : modalTab === 'clicks' ? 'Button Click Log' : 'Chronological User Trace'} ({eventsToDisplay.length} Events)
                </div>

                {eventsToDisplay.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No {modalTab === 'pages' ? 'pageview' : 'button click'} events found for this user.</p>
                  </div>
                ) : (
                  <div className={styles.timelineList}>
                    {eventsToDisplay.map((ev, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <div className={`${styles.timelineItemDot} ${ev.eventType === 'click' ? styles.timelineItemDotClick : ''}`} />
                        <div className={styles.timelineItemHeader}>
                          <span className={ev.eventType === 'pageview' ? styles.pageviewBadge : styles.clickBadge}>
                            {ev.eventType === 'pageview' ? '📄 Page View' : '🖱️ Button Click'}
                          </span>
                          <span className={styles.timelineTime}>
                            {new Date(ev.receivedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className={styles.timelineContent}>
                          {ev.eventType === 'pageview' ? (
                            <div>
                              Visited page <strong className={styles.highlightCell}>{ev.pagePath}</strong>
                              {ev.pageTitle && <span className={styles.targetUrl}> ({ev.pageTitle})</span>}
                            </div>
                          ) : (
                            <div>
                              Clicked button <strong>"{ev.buttonText || 'Button'}"</strong> on page <span className={styles.highlightCell}>{ev.pagePath}</span>
                              {ev.targetUrl && <span className={styles.targetUrl}> ➔ {ev.targetUrl}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}

export default AdminLeads

