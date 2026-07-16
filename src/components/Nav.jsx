import { useState } from 'react'
import { profile } from '../data/content'

const links = [
  { href: '#top', label: 'Home' },
  { href: '#skills', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [showPhoto, setShowPhoto] = useState(false)

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
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

        </div>
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

