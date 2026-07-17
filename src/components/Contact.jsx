import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/content'
import useReveal from '../hooks/useReveal'
import useMagnetic from '../hooks/useMagnetic'

const trustPoints = [
  { icon: '⏱', label: 'I usually reply within 24 hours' },
  { icon: '🛡', label: 'Privacy & security respected' },
  { icon: '🎥', label: 'Open to video or voice calls' },
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
          <span className="eyebrow">Contact</span>
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