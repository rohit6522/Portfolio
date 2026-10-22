import { motion, useReducedMotion } from 'framer-motion'
import { profile, education, aboutBento } from '../data/content'
import IconBadge from './IconBadge'
import SkillIcon from '../data/skillIcons'

// '[' se shuru hone wali placeholder lines hide ho jati hain
const isFilled = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('[')

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

function BentoCard({ className = '', index = 0, children }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`bento-card ${className}`}
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.45,
        delay: reduce ? 0 : Math.min(index, 6) * 0.06,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutBento() {
  const story = isFilled(aboutBento?.story) ? aboutBento.story : profile.bio || profile.tagline
  const learning = (aboutBento?.learning || []).filter(isFilled)
  const funFact = isFilled(aboutBento?.funFact) ? aboutBento.funFact : ''
  const stack = aboutBento?.stackHighlights || []
  const location = (profile.location || '').replace(/^Based in\s+/i, '')
  const edu = education?.[0]

  // Row 4 ka layout: optional cards kitne hain us hisaab se CTA ki width
  const extras = [learning.length > 0, Boolean(funFact)].filter(Boolean).length
  const ctaSpan = extras === 1 ? 'bento-span-2' : 'bento-span-4'

  return (
    <section id="about" className="section section-dark" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head-row">
          <IconBadge>
            <UserIcon />
          </IconBadge>
          <div>
            <span className="eyebrow">About</span>
            <h2 id="about-title" className="section-title" style={{ marginTop: '4px' }}>
              A bit about me
            </h2>
          </div>
        </div>

        <div className="bento-grid">
          <BentoCard className="bento-photo" index={0}>
            <img src="/avatar.jpg" alt={`Photo of ${profile.name}`} loading="lazy" />
          </BentoCard>

          <BentoCard className="bento-span-3" index={1}>
            <span className="bento-label">Story</span>
            <p className="bento-story-text">{story}</p>
          </BentoCard>

          {location && (
            <BentoCard index={2}>
              <span className="bento-pin" aria-hidden="true">
                <PinIcon />
              </span>
              <span className="bento-label">Based in</span>
              <p className="bento-value">{location}</p>
            </BentoCard>
          )}

          {edu && (
            <BentoCard className="bento-education" index={3}>
              <span className="bento-label">Education</span>
              <p className="bento-value">{edu.school}</p>
              <p className="bento-sub">
                {[edu.degree, edu.period].filter(Boolean).join(' · ')}
              </p>
            </BentoCard>
          )}

          {stack.length > 0 && (
            <BentoCard className="bento-span-4" index={4}>
              <span className="bento-label">Stack I use most</span>
              <div className="bento-chips">
                {stack.map((name) => (
                  <span key={name} className="bento-chip">
                    <SkillIcon name={name} />
                    {name}
                  </span>
                ))}
              </div>
            </BentoCard>
          )}

          {learning.length > 0 && (
            <BentoCard className="bento-span-2" index={5}>
              <span className="bento-label">Currently learning</span>
              <ul className="bento-list">
                {learning.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </BentoCard>
          )}

          {funFact && (
            <BentoCard className="bento-span-2" index={6}>
              <span className="bento-label">Fun fact</span>
              <p className="bento-value bento-value-light">{funFact}</p>
            </BentoCard>
          )}

          <BentoCard className={`bento-cta-card ${ctaSpan}`} index={7}>
            <a href="#contact" className="bento-cta">
              <div>
                <p className="bento-cta-title">Have a project or an opportunity in mind?</p>
                <p className="bento-sub">Let's talk. Get in touch</p>
              </div>
              <span className="bento-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}