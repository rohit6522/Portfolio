import { useState, useEffect } from 'react'
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className="nav">
        <motion.div
          className="nav-inner"
          animate={{
            maxWidth: scrolled ? 760 : 1320,
            marginTop: scrolled ? 14 : 0,
            height: scrolled ? 56 : 64,
            borderRadius: scrolled ? 999 : 0,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            background: scrolled ? 'rgba(20, 27, 43, 0.85)' : 'rgba(14, 20, 32, 0.85)',
            border: scrolled ? '1px solid rgba(184, 155, 90, 0.35)' : '1px solid transparent',
            boxShadow: scrolled ? '0 10px 32px rgba(0, 0, 0, 0.35)' : 'none',
          }}
        >
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


        </motion.div>

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

