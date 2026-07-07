import AnimatedBackground from './components/AnimatedBackground'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'

import SkillsTabs from './components/SkillsTabs'
import Projects from './components/Projects'

import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <Nav />

      <Hero />
      <About />

      <SkillsTabs />
      <Projects />

      <Contact />
      <Footer />
    </>
  )
}
