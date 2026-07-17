import { useState } from 'react'


import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { skills, education, certifications, experience } from '../data/content'
import useReveal from '../hooks/useReveal'
import ScrambleText from './ScrambleText'

const tabOrder = ['skills', 'education', 'experience', 'certifications']

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -60 : 60 }),
}


function TiltCertCard({ c, index }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 220, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 22 })
  const shineOpacity = useTransform(x, [-0.5, 0.5], [0, 0.35])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="blueprint-card cert-card cert-card-tilt"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.035 }}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    >
      <motion.div className="cert-shine" style={{ opacity: shineOpacity }} />
      <div className="cert-top">
        <span className="cert-icon">🏆</span>
        <span className="cert-date">{c.date}</span>
      </div>
      <h3 className="cert-title">{c.title}</h3>
      <div className="cert-issuer">{c.issuer}</div>
      <a className="cert-link" href={c.credentialUrl} target="_blank" rel="noreferrer">
        View credential →
      </a>
    </motion.div>
  )
}

const tabs = [
  { key: 'skills', label: 'Skills', icon: '</>' },
  { key: 'education', label: 'Education', icon: '📘' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'certifications', label: 'Certifications', icon: '🏆' },
]

function handleCardGlow(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

function TiltSkillCard({ group, index }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 22 })
  const shineOpacity = useTransform(x, [-0.5, 0.5], [0, 0.35])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="skill-card skill-card-tilt"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.035 }}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    >
      <motion.div className="cert-shine" style={{ opacity: shineOpacity }} />
      <div className="skill-card-inner">
        <h3>{group.category}</h3>
        <div className="skill-tags">
          {group.items.map((item) => (
            <span className="skill-tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
export default function SkillsTabs() {
  const [active, setActive] = useState('skills')
  const [direction, setDirection] = useState(0)
  const [ref, visible] = useReveal()

  function selectTab(key) {
    const newDir = tabOrder.indexOf(key) > tabOrder.indexOf(active) ? 1 : -1
    setDirection(newDir)
    setActive(key)
  }

  return (
    <section
      id="skills"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >


      <div className="container">
        <div className="tabs-bar">

          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${active === tab.key ? 'active' : ''}`}
              onClick={() => selectTab(tab.key)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-panel-clip">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {active === 'skills' && (
                <div className="skills-grid">
                  {skills.map((group, i) => (
                    <TiltSkillCard group={group} index={i} key={group.category} />
                  ))}
                </div>
              )}

              {active === 'education' && (
                <div className="edu-timeline">
                  {education.map((e, i) => (
                    <div className="edu-item-scramble" key={e.school}>
                      <span className="edu-node-diamond" />
                      <div className="edu-item-content">
                        <ScrambleText text={e.school} delay={i * 400} className="edu-scramble-title" />
                        <div className="edu-meta">
                          {e.period} — {e.degree}
                        </div>
                        <p className="edu-desc">{e.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {active === 'experience' && (
                <div className="coming-soon">
                  <span className="coming-soon-icon">🚧</span>
                  <h3>Experience — Coming Soon</h3>
                  <p>
                    I'm just getting started and haven't taken on a professional role yet.
                    This section will fill up soon — check back later!
                  </p>
                </div>
              )}

              {active === 'certifications' && (
                <div className="cert-grid">
                  {certifications.map((c, i) => (
                    <TiltCertCard c={c} index={i} key={c.title} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>



      </div>
    </section>
  )
}