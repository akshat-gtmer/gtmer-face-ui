import React, { useEffect, useState } from 'react'
import { API_BASE } from '../../config/api'
import { isConsumerIsp, getRealOrganization } from '../../utils/organizationUtils'

export interface Visitor {
  id: string
  visitorId: string
  firstSeenAt: string
  lastSeenAt: string
  consentStatus: string
  sessionCount: number
  eventCount: number
  intentScore: number
  intentLevel: 'High' | 'Medium' | 'Low'
  acquisitionSource?: string
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  } | null
  organization?: {
    organizationName: string
    domain: string
    industry: string
    employeeRange: string
    country: string
    confidenceScore: number
  } | null
  lead?: any | null
}

export interface VisitorDetail extends Visitor {
  sessions?: Array<{
    sessionId: string
    startedAt: string
    landingPage?: string
    referrer?: string
    referrerSource?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
    deviceType?: string
    browser?: string
    operatingSystem?: string
  }>
  consentRecord?: {
    essential: boolean
    functional: boolean
    analytics: boolean
    marketing: boolean
    timestamp: string
  }
  activitySummary?: {
    pricing_views: number
    demo_views: number
    feature_views: number
    cta_clicks: number
    form_submissions: number
  }
  events?: Array<{
    id: string
    eventType: string
    pageUrl: string
    pageTitle: string
    eventData?: any
    timestamp: string
  }>
}

export const VisitorIntelligence: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorDetail | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('ALL')
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'timeline' | 'clicks' | 'acquisition' | 'consent'>('timeline')

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/visitors`)
      const data = await res.json()
      setVisitors(data.visitors || [])
    } catch (e) {
      console.error('Failed to fetch visitors', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchDetail = async (visitorId: string) => {
    try {
      const res = await fetch(`${API_BASE}/visitors/${visitorId}`)
      const data = await res.json()
      setSelectedVisitor(data)
    } catch (e) {
      console.error('Failed to fetch detail', e)
    }
  }

  const handleConvertToLead = async (visitorId: string, companyName?: string) => {
    setConvertingLeadId(visitorId)
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          companyName: companyName || 'Anonymous Prospect',
          notes: 'Converted from B2B Visitor Intelligence Dashboard',
        }),
      })
      if (res.ok) {
        fetchVisitors()
        if (selectedVisitor && selectedVisitor.visitorId === visitorId) {
          fetchDetail(visitorId)
        }
      }
    } catch (e) {
      console.error('Lead conversion failed', e)
    } finally {
      setConvertingLeadId(null)
    }
  }

  const handleDeleteVisitor = async (visitorId: string) => {
    if (!window.confirm('Delete all data for this visitor (GDPR Right-to-be-Forgotten)?')) return
    try {
      const res = await fetch(`${API_BASE}/visitors/${visitorId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSelectedVisitor(null)
        fetchVisitors()
      }
    } catch (e) {
      console.error('Failed to delete visitor', e)
    }
  }

  const filteredVisitors = visitors.filter((v) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      (v.visitorId || '').toLowerCase().includes(query) ||
      (v.lead?.name || '').toLowerCase().includes(query) ||
      (v.lead?.email || '').toLowerCase().includes(query) ||
      (v.acquisitionSource || '').toLowerCase().includes(query) ||
      (v.utm?.campaign || '').toLowerCase().includes(query)

    if (!matchesSearch) return false

    if (filterLevel === 'HIGH') return v.intentLevel === 'High'
    if (filterLevel === 'MEDIUM') return v.intentLevel === 'Medium'
    if (filterLevel === 'LOW') return v.intentLevel === 'Low'
    if (filterLevel === 'LEADS') return !!v.lead
    return true
  })

  // Metrics
  const totalVisitors = visitors.length
  const highIntentCount = visitors.filter((v) => v.intentLevel === 'High').length
  const totalEvents = visitors.reduce((sum, v) => sum + (v.eventCount || 0), 0)
  const convertedLeadsCount = visitors.filter((v) => !!v.lead).length

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7f5f0',
      color: '#1a1a1a',
      padding: '2.5rem 1.5rem',
      fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>⚡</span>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#1a1a1a',
                margin: 0,
                fontFamily: "'Apercu Pro', -apple-system, sans-serif",
                letterSpacing: '-0.02em',
              }}>
                B2B Visitor Intelligence & Attribution
              </h1>
            </div>
            <p style={{ color: '#666666', fontSize: '0.9rem', margin: 0 }}>
              Autonomous visitor tracking, Google Search & Campaign attribution, and intent scoring pipeline.
            </p>
          </div>

          <button
            onClick={fetchVisitors}
            style={{
              padding: '0.55rem 1.25rem',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '0.5rem',
              color: '#333333',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#d4952a')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* KPI Cards Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            borderTop: '3px solid #d4952a',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Visitors Tracked</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1a1a1a', marginTop: '0.35rem', fontFamily: "'Apercu Pro', sans-serif" }}>{totalVisitors}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>Active tracking pipeline</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            borderTop: '3px solid #16a34a',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>High Intent Prospects</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#16a34a', marginTop: '0.35rem', fontFamily: "'Apercu Pro', sans-serif" }}>{highIntentCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem' }}>Intent Score &gt; 60</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            borderTop: '3px solid #2563eb',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telemetry Actions</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1a1a1a', marginTop: '0.35rem', fontFamily: "'Apercu Pro', sans-serif" }}>{totalEvents}</div>
            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem' }}>Pageviews & button clicks</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            borderTop: '3px solid #9333ea',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Known Leads</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#9333ea', marginTop: '0.35rem', fontFamily: "'Apercu Pro', sans-serif" }}>{convertedLeadsCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem' }}>Identified CRM profiles</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          {/* Search Bar */}
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by Visitor ID, user name, email, or Google campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.25rem',
                backgroundColor: '#faf9f5',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                color: '#1a1a1a',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888888' }}>🔍</span>
          </div>

          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Visitors' },
              { id: 'HIGH', label: '🟢 High Intent' },
              { id: 'MEDIUM', label: '🟡 Medium Intent' },
              { id: 'LOW', label: '⚪ Low Intent' },
              { id: 'LEADS', label: '👤 Known Leads' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterLevel(tab.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: filterLevel === tab.id ? '1px solid #1a1a1a' : '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: filterLevel === tab.id ? '#1a1a1a' : '#ffffff',
                  color: filterLevel === tab.id ? '#ffffff' : '#666666',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visitor Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888888' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            Loading Visitor Intelligence...
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            color: '#666666',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a' }}>No visitors match your criteria</div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>Try changing search filters or browsing pages in another window.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}>
            {filteredVisitors.map((v) => {
              const isHigh = v.intentLevel === 'High'
              const isMed = v.intentLevel === 'Medium'
              const badgeBg = isHigh ? 'rgba(34, 197, 94, 0.1)' : isMed ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              const badgeColor = isHigh ? '#15803d' : isMed ? '#b45309' : '#666666'
              const progressColor = isHigh ? '#16a34a' : isMed ? '#e0a832' : '#94a3b8'

              return (
                <div
                  key={v.id || v.visitorId}
                  style={{
                    backgroundColor: '#ffffff',
                    border: isHigh ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '0.85rem',
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    {/* Header: Visitor ID + Intent Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        color: '#475569',
                        backgroundColor: '#f1f5f9',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.3rem',
                      }}>
                        {v.visitorId}
                      </span>

                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: badgeBg,
                        color: badgeColor,
                      }}>
                        {v.intentLevel} Intent ({v.intentScore})
                      </span>
                    </div>

                    {/* Traffic Source & Google Attribution Badge */}
                    <div style={{ marginBottom: '0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: 'rgba(212, 149, 42, 0.1)',
                        color: '#92400e',
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '0.35rem',
                        fontWeight: 600,
                        border: '1px solid rgba(212, 149, 42, 0.25)',
                      }}>
                        🔍 {v.acquisitionSource || 'Direct / Search'}
                      </span>
                      {v.utm?.campaign && (
                        <span style={{
                          backgroundColor: 'rgba(147, 51, 234, 0.1)',
                          color: '#7e22ce',
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '0.35rem',
                          fontWeight: 600,
                          border: '1px solid rgba(147, 51, 234, 0.2)',
                        }}>
                          📢 {v.utm.campaign}
                        </span>
                      )}
                    </div>

                    {/* User Identity / Visitor Info Section */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      {v.lead && (v.lead.name || v.lead.email) ? (
                        <>
                          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.2rem', fontFamily: "'Apercu Pro', sans-serif" }}>
                            👤 {v.lead.name || 'Identified User'}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                            ✉️ {v.lead.email}
                          </div>
                          {v.lead.phone && (
                            <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.15rem' }}>
                              📞 {v.lead.phone}
                            </div>
                          )}
                          {v.lead.company && (
                            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem' }}>
                              🏢 {v.lead.company}
                            </div>
                          )}
                        </>
                      ) : getRealOrganization(v.organization)?.organizationName ? (
                        <>
                          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.2rem', fontFamily: "'Apercu Pro', sans-serif" }}>
                            🏢 {getRealOrganization(v.organization)?.organizationName}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#666666' }}>
                            {getRealOrganization(v.organization)?.domain || getRealOrganization(v.organization)?.industry || '—'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', fontFamily: "'JetBrains Mono', monospace" }}>
                            ID: {v.visitorId}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem', fontFamily: "'JetBrains Mono', monospace" }}>
                            🆔 {v.visitorId}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#666666' }}>
                            Anonymous Visitor (No form submission yet)
                          </div>
                        </>
                      )}
                    </div>

                    {/* Score Bar */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666666', marginBottom: '0.35rem' }}>
                        <span>Intent Score</span>
                        <span style={{ fontWeight: 600, color: badgeColor }}>{v.intentScore} / 100</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(v.intentScore, 100)}%`, height: '100%', backgroundColor: progressColor, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>

                    {/* Footer Metadata */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#888888',
                      padding: '0.75rem 0 0 0',
                      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                    }}>
                      <span>Events: <strong style={{ color: '#1a1a1a' }}>{v.eventCount}</strong></span>
                      <span>Consent: <strong style={{ color: v.consentStatus === 'accepted_all' ? '#16a34a' : '#dc2626' }}>{v.consentStatus}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                    <button
                      onClick={() => fetchDetail(v.visitorId)}
                      style={{
                        flex: 1,
                        padding: '0.55rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                    >
                      View Journey ➔
                    </button>

                    <button
                      onClick={() => handleConvertToLead(v.visitorId, getRealOrganization(v.organization)?.organizationName)}
                      disabled={convertingLeadId === v.visitorId}
                      style={{
                        padding: '0.55rem 0.85rem',
                        borderRadius: '0.5rem',
                        background: 'linear-gradient(180deg, #e0a832 0%, #bf8520 100%)',
                        color: '#ffffff',
                        border: '1px solid rgba(191, 133, 32, 0.6)',
                        borderTop: '1px solid rgba(255, 200, 80, 0.5)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        opacity: convertingLeadId === v.visitorId ? 0.6 : 1,
                      }}
                    >
                      {convertingLeadId === v.visitorId ? 'Converting...' : 'Claim Lead'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Visitor Journey Modal */}
        {selectedVisitor && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '1rem',
              maxWidth: '52rem',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              color: '#1a1a1a',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
              {/* Modal Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Visitor Activity Journey
                  </span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1a1a1a', fontFamily: "'JetBrains Mono', monospace", marginTop: '0.2rem' }}>
                    {selectedVisitor.visitorId}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVisitor(null)}
                  style={{ background: 'none', border: 'none', color: '#888888', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>

              {/* User Summary Banner */}
              <div style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#faf9f5',
                borderRadius: '0.75rem',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                marginBottom: '1.5rem',
              }}>
                {selectedVisitor.lead && (selectedVisitor.lead.name || selectedVisitor.lead.email) ? (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>
                      👤 {selectedVisitor.lead.name || 'Identified User'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '0.2rem' }}>
                      ✉️ {selectedVisitor.lead.email} {selectedVisitor.lead.phone ? `• 📞 ${selectedVisitor.lead.phone}` : ''}
                    {(selectedVisitor.lead.company || getRealOrganization(selectedVisitor.organization)?.organizationName) && (
                      <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.25rem', fontWeight: 600 }}>
                        🏢 {selectedVisitor.lead.company || getRealOrganization(selectedVisitor.organization)?.organizationName}
                      </div>
                    )}
                    </div>
                  </>
                ) : getRealOrganization(selectedVisitor.organization)?.organizationName ? (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>
                      🏢 {getRealOrganization(selectedVisitor.organization)?.organizationName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '0.2rem' }}>
                      {getRealOrganization(selectedVisitor.organization)?.domain || getRealOrganization(selectedVisitor.organization)?.industry || '—'}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', fontFamily: "'JetBrains Mono', monospace" }}>
                      🆔 Visitor ID: {selectedVisitor.visitorId}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '0.2rem' }}>
                      Anonymous Visitor (No registered email yet)
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>Intent Score: {selectedVisitor.intentScore} ({selectedVisitor.intentLevel})</span>
                  <span style={{ fontSize: '0.85rem', color: selectedVisitor.consentStatus === 'accepted_all' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>Consent: {selectedVisitor.consentStatus}</span>
                </div>
              </div>

              {/* Tabs: Pages | Clicks | Attribution | Consent */}
              {(() => {
                const pageEvents = (selectedVisitor.events || []).filter((e: any) => e.eventType === 'pageview')
                const clickEvents = (selectedVisitor.events || []).filter((e: any) => e.eventType === 'click' || e.eventType === 'CTA_click')

                return (
                  <>
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', marginBottom: '1.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setActiveTab('timeline')}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'none',
                          border: 'none',
                          borderBottom: activeTab === 'timeline' ? '2px solid #d4952a' : '2px solid transparent',
                          color: activeTab === 'timeline' ? '#92400e' : '#666666',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Pages Visited ({pageEvents.length})
                      </button>

                      <button
                        onClick={() => setActiveTab('clicks')}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'none',
                          border: 'none',
                          borderBottom: activeTab === 'clicks' ? '2px solid #d4952a' : '2px solid transparent',
                          color: activeTab === 'clicks' ? '#92400e' : '#666666',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Button Clicks ({clickEvents.length})
                      </button>

                      <button
                        onClick={() => setActiveTab('acquisition')}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'none',
                          border: 'none',
                          borderBottom: activeTab === 'acquisition' ? '2px solid #d4952a' : '2px solid transparent',
                          color: activeTab === 'acquisition' ? '#92400e' : '#666666',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Search & Attribution (Google/UTM)
                      </button>

                      <button
                        onClick={() => setActiveTab('consent')}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'none',
                          border: 'none',
                          borderBottom: activeTab === 'consent' ? '2px solid #d4952a' : '2px solid transparent',
                          color: activeTab === 'consent' ? '#92400e' : '#666666',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Consent Log
                      </button>
                    </div>

                    {/* Tab: Pages Visited */}
                    {activeTab === 'timeline' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pageEvents.length === 0 ? (
                          <div style={{ color: '#888888', fontSize: '0.85rem', padding: '1rem', backgroundColor: '#faf9f5', borderRadius: '0.5rem' }}>
                            No pageview events recorded.
                          </div>
                        ) : (
                          pageEvents.map((e: any, idx: number) => (
                            <div key={e.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#faf9f5', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a' }}>
                                  📄 {e.pageUrl || '/'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.15rem' }}>
                                  {e.pageTitle || 'Page'}
                                </div>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#888888' }}>
                                {e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Just now'}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Tab: Button Clicks */}
                    {activeTab === 'clicks' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {clickEvents.length === 0 ? (
                          <div style={{ color: '#888888', fontSize: '0.85rem', padding: '1rem', backgroundColor: '#faf9f5', borderRadius: '0.5rem' }}>
                            No button click events recorded.
                          </div>
                        ) : (
                          clickEvents.map((e: any, idx: number) => (
                            <div key={e.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#faf9f5', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span>🖱️ Clicked:</span>
                                  <span style={{ backgroundColor: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', border: '1px solid rgba(0,0,0,0.08)', color: '#1a1a1a' }}>
                                    "{e.eventData?.buttonText || 'Button'}"
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.2rem' }}>
                                  Page: {e.pageUrl}
                                </div>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#888888' }}>
                                {e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Just now'}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Tab: Search & Attribution */}
                    {activeTab === 'acquisition' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ backgroundColor: '#faf9f5', border: '1px solid rgba(212, 149, 42, 0.25)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#92400e', fontWeight: 700 }}>
                              Attribution Channel
                            </span>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                              {selectedVisitor.acquisitionSource || 'Direct / Search'}
                            </span>
                          </div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>
                            Google Search & Traffic Attribution
                          </div>
                        </div>

                        {(selectedVisitor.sessions || []).length === 0 ? (
                          <div style={{ backgroundColor: '#faf9f5', padding: '1.25rem', borderRadius: '0.75rem', color: '#666666', fontSize: '0.85rem' }}>
                            No detailed session acquisition record stored for this visitor yet.
                          </div>
                        ) : (
                          (selectedVisitor.sessions || []).map((ses, idx) => (
                            <div key={ses.sessionId || idx} style={{ backgroundColor: '#faf9f5', border: '1px solid rgba(0, 0, 0, 0.06)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderTop: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                <div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
                                    Session {idx + 1}: <span style={{ color: '#92400e' }}>{ses.referrerSource}</span>
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#888888' }}>
                                    Started: {ses.startedAt ? new Date(ses.startedAt).toLocaleString() : 'N/A'}
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#666666', backgroundColor: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                                  {ses.sessionId}
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                                  <div style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', fontWeight: 700 }}>Referrer URL</div>
                                  <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                                    {ses.referrer || 'Direct Entry / None'}
                                  </div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                                  <div style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', fontWeight: 700 }}>Landing Page</div>
                                  <div style={{ fontSize: '0.85rem', color: '#1a1a1a', marginTop: '0.2rem' }}>
                                    {ses.landingPage || '/'}
                                  </div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                                  <div style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', fontWeight: 700 }}>Device & Browser</div>
                                  <div style={{ fontSize: '0.85rem', color: '#1a1a1a', marginTop: '0.2rem' }}>
                                    {ses.deviceType || 'Desktop'} • {ses.browser || 'Browser'}
                                  </div>
                                </div>
                              </div>

                              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666666', marginBottom: '0.5rem' }}>
                                  UTM Campaign Analytics Parameters
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', fontSize: '0.75rem' }}>
                                  <div>
                                    <div style={{ color: '#888888' }}>utm_source</div>
                                    <div style={{ color: ses.utmSource ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>{ses.utmSource || '(none)'}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#888888' }}>utm_medium</div>
                                    <div style={{ color: ses.utmMedium ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>{ses.utmMedium || '(none)'}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#888888' }}>utm_campaign</div>
                                    <div style={{ color: ses.utmCampaign ? '#7e22ce' : '#94a3b8', fontWeight: 600 }}>{ses.utmCampaign || '(none)'}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#888888' }}>utm_term</div>
                                    <div style={{ color: ses.utmTerm ? '#b45309' : '#94a3b8', fontWeight: 600 }}>{ses.utmTerm || '(none)'}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Tab: Consent Log */}
                    {activeTab === 'consent' && (
                      <div style={{ backgroundColor: '#faf9f5', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1rem' }}>
                          GDPR / ePrivacy Consent Choices
                        </div>
                        {selectedVisitor.consentRecord ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                              <div style={{ fontSize: '0.75rem', color: '#888888' }}>Essential</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', marginTop: '0.2rem' }}>✓ Active</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                              <div style={{ fontSize: '0.75rem', color: '#888888' }}>Functional</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedVisitor.consentRecord.functional ? '#16a34a' : '#dc2626', marginTop: '0.2rem' }}>
                                {selectedVisitor.consentRecord.functional ? '✓ Granted' : '✗ Denied'}
                              </div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                              <div style={{ fontSize: '0.75rem', color: '#888888' }}>Analytics</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedVisitor.consentRecord.analytics ? '#16a34a' : '#dc2626', marginTop: '0.2rem' }}>
                                {selectedVisitor.consentRecord.analytics ? '✓ Granted' : '✗ Denied'}
                              </div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                              <div style={{ fontSize: '0.75rem', color: '#888888' }}>Marketing</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedVisitor.consentRecord.marketing ? '#16a34a' : '#dc2626', marginTop: '0.2rem' }}>
                                {selectedVisitor.consentRecord.marketing ? '✓ Granted' : '✗ Denied'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ color: '#888888', fontSize: '0.85rem' }}>No consent record stored yet.</div>
                        )}
                      </div>
                    )}

                    {/* Modal Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0, 0, 0.06)' }}>
                      <button
                        onClick={() => handleDeleteVisitor(selectedVisitor.visitorId)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          border: '1px solid rgba(220, 38, 38, 0.25)',
                          borderRadius: '0.5rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete Visitor (GDPR)
                      </button>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => setSelectedVisitor(null)}
                          style={{
                            padding: '0.55rem 1.25rem',
                            backgroundColor: '#ffffff',
                            color: '#555555',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitorIntelligence
