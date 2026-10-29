import { useState, useRef } from 'react'
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


function Bento3DPhotoVisual({ name, role }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const reduce = useReducedMotion()

  const handleMouseMove = (e) => {
    if (reduce || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const tiltX = (0.5 - y) * 14
    const tiltY = (x - 0.5) * 14

    cardRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
    cardRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
    cardRef.current.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`)
    cardRef.current.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`)
    cardRef.current.style.setProperty('--glare-opacity', '1')
  }

  const handleMouseEnter = () => {
    if (reduce) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (reduce || !cardRef.current) return
    setIsHovered(false)
    cardRef.current.style.setProperty('--tilt-x', '0deg')
    cardRef.current.style.setProperty('--tilt-y', '0deg')
    cardRef.current.style.setProperty('--glare-opacity', '0')
  }

  return (
    <div
      ref={cardRef}
      className={`bento-3d-scene ${isHovered ? 'is-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bento-3d-stage">
        {/* Layer -1: 3D Environmental Backdrop & Volumetric Lighting */}
        <div className="bento-3d-env" aria-hidden="true">
          <div className="bento-3d-ambient-glow" />
          <div className="bento-3d-grid-lines" />
          <div className="bento-3d-depth-circle" />
          <span className="bento-3d-coord bento-3d-coord-tl">SYS // 01</span>
          <span className="bento-3d-coord bento-3d-coord-tr">DEV // 2026</span>
        </div>

        {/* Layer 0: Original Real Photograph with Cinematic Depth Lighting */}
        <div className="bento-3d-photo-container">
          <img
            src="/rohit.jpg"
            alt={`Authentic portrait of ${name}, ${role}`}
            className="bento-3d-img"
            loading="lazy"
            decoding="async"
          />
          <div className="bento-3d-lighting-overlay" aria-hidden="true" />
          <div className="bento-3d-rim-light" aria-hidden="true" />
          <div className="bento-3d-depth-vignette" aria-hidden="true" />
        </div>

        {/* Layer 1: Modern 3D Floating Frame */}
        <div className="bento-3d-floating-frame" aria-hidden="true">
          <div className="bento-3d-glare-sheen" />
          <span className="bento-3d-corner bento-3d-corner-tl" />
          <span className="bento-3d-corner bento-3d-corner-tr" />
          <span className="bento-3d-corner bento-3d-corner-bl" />
          <span className="bento-3d-corner bento-3d-corner-br" />
        </div>

        {/* Layer 2: Floating 3D HUD Elements */}
        <div className="bento-3d-hud" aria-hidden="true">
          <div className="bento-3d-badge bento-3d-badge-status">
            <span className="bento-3d-pulse-dot" />
            <span className="bento-3d-badge-text">Full-Stack Dev</span>
          </div>

          <div className="bento-3d-badge bento-3d-badge-id">
            <div className="bento-3d-id-name">{name}</div>
            <div className="bento-3d-id-tag">
              <span className="bento-3d-code-prefix">&gt;</span> Real Solutions · Clean Code
            </div>
          </div>
        </div>
      </div>
    </div>
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
            {/* <span className="eyebrow">About</span> */}
            <h2 id="about-title" className="section-title" style={{ marginTop: '4px' }}>
              A bit about me
            </h2>
          </div>
        </div>

        <div className="bento-grid">

          <BentoCard className="bento-photo" index={0}>
            <Bento3DPhotoVisual name={profile.name} role={profile.role} />
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