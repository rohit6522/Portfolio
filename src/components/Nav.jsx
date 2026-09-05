import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { profile } from '../data/content'

const links = [
  { href: '#top', label: 'Home' },
  { href: '#skills', label: 'About' },
  { href: '#contributions', label: 'Contributions' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
]

const desktopLinks = links
const mobileLinks = links
const sectionIds = links.map((l) => l.href.replace('#', ''))

export default function Nav() {
  const [showPhoto, setShowPhoto] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [activeSection, setActiveSection] = useState('top')

  const { scrollY } = useScroll()
  const maxWidth = useTransform(scrollY, [0, 220], [2200, 760])
  const marginTop = useTransform(scrollY, [0, 220], [0, 14])
  const height = useTransform(scrollY, [0, 220], [68, 56])
  const borderRadius = useTransform(scrollY, [0, 220], [0, 999])
  const borderOpacity = useTransform(scrollY, [0, 220], [0, 0.3])
  const shadowOpacity = useTransform(scrollY, [0, 220], [0, 0.5])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <nav className="nav">


        <motion.div
          className="nav-inner"
          style={{
            maxWidth,
            marginTop,
            height,
            borderRadius,
            background: 'rgba(10, 10, 10, 0.92)',
            border: useTransform(borderOpacity, (v) => `1px solid rgba(34, 211, 238, ${v})`),
            boxShadow: useTransform(shadowOpacity, (v) => `0 10px 32px rgba(0, 0, 0, ${v})`),
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
                alt={`${profile.name} — click to view full photo`}
              />
            </button>


            <span className="nav-divider" />
          </div>

          <ul className="nav-links" onMouseLeave={() => setHovered(null)}>
            {desktopLinks.map((link) => {
              const isActive = hovered === link.href || (!hovered && activeSection === link.href.replace('#', ''))
              return (
                <li key={link.href} className="nav-link-item" onMouseEnter={() => setHovered(link.href)}>
                  <a href={link.href}>{link.label}</a>
                  {isActive && (
                    <motion.span
                      className="nav-underline"
                      layoutId="nav-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>



          <a href="#contact" className="nav-cta-pill">
            Get in touch
          </a>

                  <button
          className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
          </button>


        </motion.div>
        {mobileOpen && (
          <ul className="mobile-menu">
            {mobileLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mobile-menu-cta-item">
              <a
                href="#contact"
                className="mobile-menu-cta"
                onClick={() => setMobileOpen(false)}
              >
                Get in touch
              </a>
            </li>
          </ul>
        )}

      </nav>

      {showPhoto && (
        <div className="photo-modal" onClick={() => setShowPhoto(false)}>
          <div className="photo-modal-frame" onClick={(e) => e.stopPropagation()}>
            <img src="/avatar.jpg" alt={profile.name} className="photo-modal-img" loading="lazy" decoding="async" />
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

