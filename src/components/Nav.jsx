import { useState } from 'react'
import { profile } from '../data/content'

const links = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Experience' },
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

      {
        showPhoto && (
          <div className="photo-modal" onClick={() => setShowPhoto(false)}>
            <img src="/rohit.jpg" alt={profile.name} className="photo-modal-img" />
            <button className="photo-modal-close" aria-label="Close">×</button>
          </div>
        )
      }
    </>
  )
}