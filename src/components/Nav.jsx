import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/content'

const links = [
  { href: '#top', label: 'Home' },
  { href: '#skills', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [showPhoto, setShowPhoto] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-left">

            <button
              className="nav-avatar-btn"
              onClick={() => setShowPhoto(true)}
              aria-label="View full photo"
            >
              <img
                className="nav-avatar"
                src="/rohit.jpg"
                alt={profile.name}
              />
            </button>


            <span className="nav-divider" />
          </div>

        <ul className="nav-links" onMouseLeave={() => setHovered(null)}>
          {links.map((link) => (
            <li key={link.href} className="nav-link-item" onMouseEnter={() => setHovered(link.href)}>
              <a href={link.href}>{link.label}</a>
              {hovered === link.href && (
                <motion.span
                  className="nav-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>
        <span className="nav-right-spacer" />

        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <ul className="mobile-menu">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>

      {showPhoto && (
      <div className="photo-modal" onClick={() => setShowPhoto(false)}>
        <div className="photo-modal-frame" onClick={(e) => e.stopPropagation()}>
          <img src="/rohit.jpg" alt={profile.name} className="photo-modal-img" />
          <div className="photo-modal-caption">
            <div className="photo-modal-tag">
              <span className="photo-modal-dash" />
              SYSTEM_SESSION_ACTIVE
            </div>
            <h3 className="photo-modal-name">{profile.name}</h3>
            <p className="photo-modal-role">{profile.role.toUpperCase()}</p>
          </div>
        </div>
        <button className="photo-modal-close" aria-label="Close" onClick={() => setShowPhoto(false)}>×</button>
      </div>
    )}
    </>
  )
}

