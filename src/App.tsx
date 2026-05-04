import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Numbers from './components/Numbers/Numbers'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Pipeline from './components/Pipeline/Pipeline'
import UseCases from './components/UseCases/UseCases'
import Testimonials from './components/Testimonials/Testimonials'
import FAQ from './components/FAQ/FAQ'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import Agents from './components/Agents/Agents'
import DataEngine from './components/DataEngine/DataEngine'
import ProductDashboard from './components/ProductDashboard/ProductDashboard'
import Pricing from './components/Pricing/Pricing'
import Security from './components/Security/Security'
import IntegrationsPage from './components/IntegrationsPage/IntegrationsPage'
import About from './components/About/About'

type ActiveView = 'main' | 'agents' | 'data-engine' | 'product' | 'pricing' | 'security' | 'integrations' | 'about'

const App = () => {
  const [activeView, setActiveView] = useState<ActiveView>('main')

  const navigate = (view: string) => {
    setActiveView(view as ActiveView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => navigate('main')

  return (
    <>
      <Navbar
        onNavigate={navigate}
        activeView={activeView}
      />

      {activeView === 'main' && (
        <>
          <Hero />
          <Numbers />
          <HowItWorks
            onAgentsClick={() => navigate('agents')}
            onDataEngineClick={() => navigate('data-engine')}
            onProductClick={() => navigate('product')}
          />
          <Pipeline />
          <UseCases />
          <Testimonials />
          <FAQ />
          <Contact />
          <Footer onNavigate={navigate} />
        </>
      )}

      {activeView === 'agents' && <Agents onBack={goHome} />}
      {activeView === 'data-engine' && <DataEngine onBack={goHome} />}
      {activeView === 'product' && <ProductDashboard onBack={goHome} />}
      {activeView === 'pricing' && <Pricing onBack={goHome} />}
      {activeView === 'security' && <Security onBack={goHome} />}
      {activeView === 'integrations' && <IntegrationsPage onBack={goHome} />}
      {activeView === 'about' && <About onBack={goHome} />}
    </>
  )
}

export default App
