import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/content'
import useReveal from '../hooks/useReveal'
import useMagnetic from '../hooks/useMagnetic'
import IconBadge from './IconBadge'

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 6v6c0 4.5 3.4 7.7 8 9 4.6-1.3 8-4.5 8-9V6l-8-3Z" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10 6-3v10l-6-3Z" />
    </svg>
  )
}

const trustPoints = [
  { icon: <ClockIcon />, label: 'I usually reply within 24 hours' },
  { icon: <ShieldIcon />, label: 'Privacy & security respected' },
  { icon: <VideoIcon />, label: 'Open to video or voice calls' },
]

function MagneticButton({ className, onClick, children }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic()
  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.button>
  )
}

export default function Contact() {
  const [ref, visible] = useReveal()
  const [showForm, setShowForm] = useState(false)

  const linkedin = profile.social.find((s) => s.label === 'LinkedIn')

  function openCalendly() {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: profile.calendlyUrl })
    } else {
      window.open(profile.calendlyUrl, '_blank')
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >
      <div className="container contact-grid-v2">
        <div>
          <div className="section-head-row" style={{ marginBottom: '4px' }}>
            <IconBadge size={36}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
                <path d="m3 6 9 7 9-7" />
              </svg>
            </IconBadge>
            <span className="eyebrow" style={{ margin: 0 }}>Contact</span>
          </div>
          <h2 className="contact-heading">
            How would you
            <br />
            like to connect?
          </h2>
          <p className="contact-sub">
            I'm flexible and happy to communicate in the way that works best for
            you — whether that's a quick message, an email, or a scheduled call.
          </p>
          <ul className="trust-list">
            {trustPoints.map((t) => (
              <li key={t.label}>
                <span className="trust-icon">{t.icon}</span> {t.label}
              </li>
            ))}
          </ul>
          <MagneticButton className="btn schedule-btn" onClick={openCalendly}>
            📅 Schedule a meeting
          </MagneticButton>
        </div>

        <div>
          <div className="contact-links-list">
            <a className="contact-link-row" href={`mailto:${profile.email}`}>
              <span>Email</span>
              <span className="arrow">↗</span>
            </a>
            {linkedin && (
              <a
                className="contact-link-row"
                href={linkedin.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>LinkedIn</span>
                <span className="arrow">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}