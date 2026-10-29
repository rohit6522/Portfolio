import { useState } from 'react'
import { profile } from '../data/content'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const handleCopyConsole = () => {
    navigator.clipboard?.writeText('console.log("Thanks for visiting!");')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    if (typeof window !== 'undefined' && window.console) {
      console.log(
        '%c> console.log("Thanks for visiting!");\n%c🚀 Thanks for checking out my portfolio! Let\'s build something great: ' + (profile.email || ''),
        'color: #22d3ee; font-family: monospace; font-size: 13px; font-weight: bold;',
        'color: #e8e8e8; font-family: sans-serif; font-size: 12px;'
      )
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navLinks = [
    { href: '#top', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contributions', label: 'Activity' },
    { href: '#contact', label: 'Contact' },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-v2">
      <div className="container footer-v2-container">
        {/* Top 3-Column Grid */}
        <div className="footer-top-grid">
          {/* Col 1: Identity & Availability */}
          <div className="footer-brand-col">
            <a href="#top" className="footer-brand-link">
              <span className="footer-brand-dot" />
              <span className="footer-brand-name">{profile.name}</span>
            </a>
            <p className="footer-brand-role">{profile.role}</p>
            <p className="footer-brand-desc">
              Building functional web apps and high-performance digital experiences.
            </p>
            <div className="footer-status-pill">
              <span className="footer-status-dot" />
              <span>Available for opportunities</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Socials & Connect */}
          <div className="footer-social-col">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-social-grid">
              {(profile.social || []).map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  <span>{s.label}</span>
                  <span className="footer-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="footer-social-btn"
                >
                  <span>Email</span>
                  <span className="footer-arrow" aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Centerpiece: Interactive Terminal Card for console.log */}
        <div className="footer-terminal-wrap">
          <div
            className="footer-terminal"
            onClick={handleCopyConsole}
            title="Click to copy & run in console"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCopyConsole()}
          >
            <div className="footer-terminal-head">
              <div className="footer-terminal-dots">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
              </div>
              <span className="footer-terminal-title">dev-console.js</span>
              <span className="footer-terminal-action">
                {copied ? '✓ Copied' : 'Click to copy'}
              </span>
            </div>
            <div className="footer-terminal-body">
              <span className="footer-terminal-prompt">&gt;</span>
              <p className="footer-console-log">
                console.log(<span className="footer-console-string">"Thanks for visiting!"</span>);
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {currentYear} {profile.name} · All rights reserved.
          </p>
          <p className="footer-built-with">
            Designed &amp; Built with React, Vite &amp; Plus Jakarta Sans
          </p>
          <button
            onClick={scrollToTop}
            className="footer-back-to-top"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
