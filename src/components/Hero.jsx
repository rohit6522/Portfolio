import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content'
import useMagnetic from '../hooks/useMagnetic'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function SplitReveal({ text }) {
  const ref = useRef(null)
  const words = text.split(' ')

  useEffect(() => {
    let ctx
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const letters = ref.current.querySelectorAll('.letter')
        gsap.killTweensOf(letters)
        gsap.set(letters, { opacity: 0, y: 30, rotateX: -60 })
        gsap.to(letters, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: 'back.out(1.6)',
          stagger: 0.03,
          delay: 0.1,
        })
      }, ref)
    })

    return () => {
      cancelAnimationFrame(raf)
      ctx?.revert()
    }
  }, [text])

  return (
    <span ref={ref} className="split-reveal">
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="split-word">
            {[...word].map((char, ci) => (
              <span className="letter" key={ci}>
                {char}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

function GlowName({ text }) {
  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <span className="hero-name-glow" onMouseMove={handleMove}>
      <span className="hero-name-base">
        <SplitReveal text={text} />
      </span>
      <span className="hero-name-shine" aria-hidden="true">
        {text}
      </span>
      <span className="hero-cursor-blink" />
    </span>
  )
}

const icons = {
  GitHub: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.24 2.5h3.3l-7.2 8.23L23 21.5h-6.63l-5.2-6.8-5.94 6.8H1.9l7.7-8.8L1.5 2.5h6.8l4.7 6.22L18.24 2.5Zm-1.16 17.02h1.83L7.02 4.38H5.05l12.03 15.14Z" />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  ),
  Resume: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12m0 0-4-4m4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
}

function MagneticLink({ className, href, download, target, rel, children }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic()
  return (
    <motion.a
      ref={ref}
      className={className}
      href={href}
      download={download}
      target={target}
      rel={rel}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.a>
  )
}

function PhotoCard() {
  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="hero-photo-wrap">
      <div className="hero-photo-frame" onMouseMove={handleMove}>
        <img src="/rohit.jpg" alt={profile.name} className="hero-photo-img" />
        <span className="hero-photo-dot" />
      </div>
      <span className="hero-badge hero-badge-top">
        <span className="hero-badge-prefix">&gt;</span> npm run dev
      </span>
      <span className="hero-badge hero-badge-bottom">
        <span className="hero-badge-prefix">&gt;</span> const dev = true
      </span>
    </div>
  )
}

export default function Hero() {
  const [greeting] = useState(getGreeting())

  return (
    <section id="top" className="hero">
      <div className="container hero-grid hero-grid-v2">
        <div>
          <PhotoCard />
        </div>
        <div>
          <span className="hero-greeting">{greeting} —</span>
          <h1 className="hero-name">
            <GlowName text={profile.name} />
          </h1>
          <p className="hero-role-line">{profile.role}</p>
          <p className="hero-tagline">{profile.bio}</p>
          <p className="hero-short-line">{profile.shortLine}</p>

         <div className="hero-actions">
            <MagneticLink className="btn btn-solid hero-resume-btn" href={profile.resumeUrl} download>
              {icons.Resume} Resume
            </MagneticLink>
          </div>

          <div className="hero-social">
            {profile.social
              .filter((s) => s.label === 'LinkedIn')
              .map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-social-link"
                  aria-label={s.label}
                >
                  {icons[s.label]}
                  <span className="social-tooltip">{s.label}</span>
                </a>
              ))}

            <a href={`mailto:${profile.email}`} className="hero-social-link" aria-label="Email">
              {icons.Email}
              <span className="social-tooltip">Mail</span>
            </a>

            {profile.social
              .filter((s) => s.label !== 'LinkedIn')
              .map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-social-link"
                  aria-label={s.label}
                >
                  {icons[s.label] || s.label}
                  <span className="social-tooltip">{s.label}</span>
                </a>
              ))}
          </div>


        </div>
      </div>
    </section>
  )
}