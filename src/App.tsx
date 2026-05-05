import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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

/* Scroll to top on route change — preserves SPA feel */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

/* Landing page — the main "/" view with all scroll sections */
const LandingPage = () => (
  <>
    <Hero />
    <Numbers />
    <HowItWorks />
    <UseCases />
    <Testimonials />
    <FAQ />
    <Footer />
  </>
)

const App = () => {
  // Dynamic <title> and <meta> per route — SEO/AEO critical
  useDocumentHead()

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/data-engine" element={<DataEngine />} />
          <Route path="/product" element={<ProductDashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/security" element={<Security />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  )
}

export default App
