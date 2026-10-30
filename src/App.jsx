import AnimatedBackground from './components/AnimatedBackground'
import { useEffect, useState, lazy, Suspense } from 'react'
import Loader from './components/Loader'
import Nav from './components/Nav'
import CustomCursor from './components/CustomCursor'
import useSmoothScroll from './hooks/useSmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import Hero from './components/Hero'
import SkillsTabs from './components/SkillsTabs'
import AboutBento from './components/AboutBento'
import ContributionGraph from './components/ContributionGraph'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import SectionDots from './components/SectionDots'

// Non-critical interactive overlays deferred off the main critical render path
const ChatWidget = lazy(() => import('./components/ChatWidget'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const CaseStudyHost = lazy(() => import('./components/CaseStudyHost'))

export default function App() {
  useSmoothScroll()

  // Loader tab-session mein ek hi baar. URL mein ?loader lagao to dobara dikhega
  const [showLoader] = useState(() => {
    try {
      if (new URLSearchParams(window.location.search).has('loader')) return true
      return !sessionStorage.getItem('loader-seen')
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem('loader-seen', '1')
    } catch {
      /* storage blocked: loader har baar dikhega */
    }
  }, [])

  return (
    <>
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      {showLoader && <Loader />}
      <CustomCursor />
      <AnimatedBackground />
      <Nav />

      <Hero />
      <AboutBento />
      <SkillsTabs />
      <ContributionGraph />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
      <ScrollToTop />
      <SectionDots />

      <Suspense fallback={null}>
        <ChatWidget />
        <CommandPalette />
        <CaseStudyHost />
      </Suspense>
    </>
  )
}
