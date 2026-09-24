
import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion'
import {
  skills,
  education,
  certifications,
  experience,
} from '../data/content'
import IconBadge, {
  GraduationIcon,
  BriefcaseIcon,
  AwardIcon,
  CodeIcon,
} from './IconBadge'
import SkillIcon, { getSkillColor } from '../data/skillIcons'
import RollingText from './RollingText'
import ScrambleText from './ScrambleText'
import { Reveal, RevealItem } from './Reveal'

const tabOrder = ['skills', 'education', 'experience', 'certifications']

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 60 : -60,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -60 : 60,
  }),
}

function TiltCertCard({ c, index }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [10, -10]),
    { stiffness: 220, damping: 22 }
  )

  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-10, 10]),
    { stiffness: 220, damping: 22 }
  )

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
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.035 }}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
    >
      <motion.div className="cert-shine" style={{ opacity: shineOpacity }} />

      <div className="cert-top">
        <span className="cert-icon">🏆</span>
        <span className="cert-date">{c.date}</span>
      </div>

      <h3 className="cert-title">{c.title}</h3>
      <div className="cert-issuer">{c.issuer}</div>

      <a
        className="cert-link"
        href={c.credentialUrl}
        target="_blank"
        rel="noreferrer"
      >
        View credential →
      </a>
    </motion.div>
  )
}

const tabIcons = {
  skills: <CodeIcon />,
  education: <GraduationIcon />,
  experience: <BriefcaseIcon />,
  certifications: <AwardIcon />,
}

const tabs = [
  { key: 'skills', label: 'Skills' },
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'certifications', label: 'Certifications' },
]

export default function SkillsTabs() {
  const [active, setActive] = useState('skills')
  const [direction, setDirection] = useState(0)

  function selectTab(key) {
    if (key === active) return

    const newDirection =
      tabOrder.indexOf(key) > tabOrder.indexOf(active) ? 1 : -1

    setDirection(newDirection)
    setActive(key)
  }

  return (
    <section id="skills" className="section section-dark">
      <div className="container">
        <Reveal className="skills-tabs-reveal">
          <RevealItem>
            <div className="tabs-bar">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.key}
                  type="button"
                  className={`tab-btn ${active === tab.key ? 'active' : ''}`}
                  onClick={() => selectTab(tab.key)}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <IconBadge size={24}>{tabIcons[tab.key]}</IconBadge>
                  <RollingText text={tab.label} />
                </motion.button>
              ))}
            </div>
          </RevealItem>

          <RevealItem>
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
                    <div className="tab-panel">
                      <div className="tech-stack-head">
                        <IconBadge size={32}>
                          <CodeIcon />
                        </IconBadge>
                        <h3 className="tech-stack-title">Tech Stack</h3>
                      </div>

                      <div className="tech-stack-grid">
                        {skills
                          .filter((group) => group.category !== 'Core CS')
                          .flatMap((group) => group.items.map((item) => ({ item, category: group.category })))
                          // .filter(({ item }) => item.toLowerCase().includes(techSearch.toLowerCase()))
                          .map(({ item, category }, i) => (
                            <motion.div
                              className="tech-card"
                              key={item}
                              data-category={category}
                              tabIndex={0}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: '-40px' }}
                              transition={{ duration: 0.35, delay: (i % 10) * 0.03 }}
                              whileHover="hover"
                              whileFocus="hover"
                              animate="rest"
                            >

                              <motion.span
                                className="tech-card-fill"
                                variants={{
                                  rest: {
                                    clipPath: 'circle(0% at 0% 0%)',
                                  },
                                  hover: {
                                    clipPath: 'circle(150% at 0% 0%)',
                                  },
                                }}
                                transition={{
                                  duration: 0.7,
                                  ease: 'easeInOut',
                                }}
                              />

                              <span className="tech-card-content">
                                <span className="tech-card-icon-box">
                                  <SkillIcon name={item} />
                                </span>
                                <span className="tech-card-name">{item}</span>
                              </span>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  )}

                  {active === 'education' && (
                    <div className="edu-timeline">
                      <div
                        className="section-head-row"
                        style={{ marginBottom: '32px' }}
                      >
                        <IconBadge>
                          <GraduationIcon />
                        </IconBadge>
                        <h3
                          className="section-title"
                          style={{ margin: 0, fontSize: '26px' }}
                        >
                          Education
                        </h3>
                      </div>

                      {education.map((item, index) => (
                        <div
                          className="edu-item-scramble"
                          key={item.school}
                        >
                          <span className="edu-node-diamond" />

                          <div className="edu-item-content">
                            <ScrambleText
                              text={item.school}
                              delay={index * 400}
                              className="edu-scramble-title"
                            />

                            <div className="edu-meta">
                              {item.period} — {item.degree}
                            </div>

                            <p className="edu-desc">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {active === 'experience' && (
                    <div className="timeline tab-panel">
                      {experience.map((job) => (
                        <div
                          className="timeline-item"
                          key={job.company + job.period}
                        >
                          <span className="timeline-period">{job.period}</span>
                          <h3 className="timeline-role">{job.role}</h3>
                          <div className="timeline-company">{job.company}</div>

                          <ul>
                            {job.points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>

                          {job.certificateUrl && (
                            <a
                              href={job.certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="timeline-cert-link"
                            >
                              View Certificate ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {active === 'certifications' && (
                    <div className="cert-grid">
                      {certifications.map((certification, index) => (
                        <TiltCertCard
                          c={certification}
                          index={index}
                          key={certification.title}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}