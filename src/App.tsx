import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

/* Extend Window to include GTM dataLayer — avoids TypeScript errors */
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

import { useDocumentHead } from './hooks/useDocumentHead'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Numbers from './components/Numbers/Numbers'
import HowItWorks from './components/HowItWorks/HowItWorks'
import UseCases from './components/UseCases/UseCases'
import Testimonials from './components/Testimonials/Testimonials'
import FAQ from './components/FAQ/FAQ'
import Footer from './components/Footer/Footer'
import Agents from './components/Agents/Agents'
import DataEngine from './components/DataEngine/DataEngine'
import ProductDashboard from './components/ProductDashboard/ProductDashboard'
import Pricing from './components/Pricing/Pricing'
import Security from './components/Security/Security'
import IntegrationsPage from './components/IntegrationsPage/IntegrationsPage'
import About from './components/About/About'
import GtmAutomation from './components/GtmAutomation/GtmAutomation'
import Signup from './components/Signup/Signup'
import Scraper from './components/Scraper/Scraper'
import VisitorIntelligence from './components/Admin/VisitorIntelligence'
import AdminLeads from './components/AdminLeads/AdminLeads'
import CookieBanner from './components/CookieBanner/CookieBanner'
import AuthCallback from './components/Auth/AuthCallback'
import GoogleOneTapPopup from './components/GoogleOneTap/GoogleOneTapPopup'

import { getOrCreateVisitorId, captureAttributionData, getUrlQueryParameters } from './utils/cookieUtils'
import { initTelemetry } from './utils/telemetry'

/* Scroll to top + push page_view event to GTM dataLayer on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Initialize Visitor ID, UTM Attribution Cookies, and Tokenized Magic Link parameters on load
    getOrCreateVisitorId()
    captureAttributionData()
    getUrlQueryParameters()

    /* Scroll to top */
    window.scrollTo({ top: 0, behavior: 'smooth' })

    /* Push page_view event to GTM dataLayer */
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'page_view',
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
        visitor_id: getOrCreateVisitorId(),
      })
    }
  }, [pathname])

  return null
}

/* Landing page — focused: Hero + Numbers + HowItWorks + Footer */
const LandingPage = () => (
  <>
    <Hero />
    <Numbers />
    <HowItWorks />
    <Footer />
  </>
)

/* Wrapper for sub-pages that need their own footer */
const PageWithFooter = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Footer />
  </>
)

const App = () => {
  // Initialize telemetry once on app mount
  React.useEffect(() => {
    initTelemetry()
  }, [])

  // Dynamic <title> and <meta> per route
  useDocumentHead()

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<PageWithFooter><ProductDashboard /></PageWithFooter>} />
          <Route path="/agents" element={<PageWithFooter><Agents /></PageWithFooter>} />
          <Route path="/data-engine" element={<PageWithFooter><DataEngine /></PageWithFooter>} />
          <Route path="/use-cases" element={<PageWithFooter><UseCases /></PageWithFooter>} />
          <Route path="/pricing" element={<PageWithFooter><Pricing /></PageWithFooter>} />
          <Route path="/security" element={<PageWithFooter><Security /></PageWithFooter>} />
          <Route path="/integrations" element={<PageWithFooter><IntegrationsPage /></PageWithFooter>} />
          <Route path="/about" element={<PageWithFooter><About /></PageWithFooter>} />
          <Route path="/testimonials" element={<PageWithFooter><Testimonials /></PageWithFooter>} />
          <Route path="/faq" element={<PageWithFooter><FAQ /></PageWithFooter>} />
          <Route path="/gtm-automation" element={<PageWithFooter><GtmAutomation /></PageWithFooter>} />
          <Route path="/signup" element={<PageWithFooter><Signup /></PageWithFooter>} />
          <Route path="/signup/success" element={<Navigate to="/" replace />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/scraper" element={<PageWithFooter><Scraper /></PageWithFooter>} />
          <Route path="/admin/leads" element={<PageWithFooter><AdminLeads /></PageWithFooter>} />
          <Route path="/admin/visitor-intelligence" element={<PageWithFooter><VisitorIntelligence /></PageWithFooter>} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
        <GoogleOneTapPopup />
        <CookieBanner />
      </main>
    </>
  )
}

export default App


