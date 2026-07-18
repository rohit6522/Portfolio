import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { profile, stackNodes } from '../data/content'
import useMagnetic from '../hooks/useMagnetic'

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

function StackDiagram() {
  const cx = 260
  const cy = 260
  const radius = 190
  const count = stackNodes.length

  const points = stackNodes.map((label, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return { label, x, y }
  })

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 20 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="diagram-tilt-wrap"
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="hero-diagram"
        viewBox="0 0 520 520"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Diagram connecting the developer to their core tech stack"
      >
        {points.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#b98b3d"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        ))}

        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#b98b3d" strokeOpacity="0.15" />

        {points.map((p, i) => (
          <motion.g
            key={i}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            whileHover={{ scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <circle cx={p.x} cy={p.y} r="30" fill="#141b2b" stroke="#b98b3d" strokeWidth="1.5" />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              className="node-label"
              style={{ fontSize: p.label.length > 8 ? 9.5 : 11 }}
            >
              {p.label}
            </text>
          </motion.g>
        ))}

        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <circle cx={cx} cy={cy} r="52" fill="#d4a656" />
          <text x={cx} y={cy - 4} textAnchor="middle" className="node-center-label" style={{ fontSize: 14 }}>
            {profile.name.split(' ')[0]}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#0e1420' }}
          >
            {profile.role.toUpperCase()}
          </text>
        </motion.g>
      </svg>
    </motion.div>
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
}

function MagneticLink({ className, href, download, children }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic()
  return (
    <motion.a
      ref={ref}
      className={className}
      href={href}
      download={download}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.a>
  )
}

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">{profile.location}</span>
          <h1 className="hero-name">
            <SplitReveal text={profile.name} />
            <br />
            <SplitReveal text={profile.role} />
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <MagneticLink className="btn btn-solid" href="#projects">
              View projects
            </MagneticLink>
            <MagneticLink className="btn" href={profile.resumeUrl} download>
              Download resume
            </MagneticLink>
          </div>

          <div className="hero-social">
            {profile.social.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hero-social-link"
                aria-label={s.label}
              >
                {icons[s.label] || s.label}
              </a>
            ))}
            <a href={`mailto:${profile.email}`} className="hero-social-link" aria-label="Email">
              {icons.Email}
            </a>
          </div>
        </div>
        <div>
          <StackDiagram />
        </div>
      </div>
    </section>
  )
}