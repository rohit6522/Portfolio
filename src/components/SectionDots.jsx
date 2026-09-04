import { useEffect, useState } from 'react'

const sections = [
  { id: 'top', label: 'Home' },
  { id: 'skills', label: 'About' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

export default function SectionDots() {
  const [active, setActive] = useState('top')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 200)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!visible) return null

  return (
    <nav className="section-dots" aria-label="Section navigation">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`section-dot ${active === s.id ? 'active' : ''}`}
          aria-label={`Go to ${s.label}`}
        >
          <span className="section-dot-tooltip">{s.label}</span>
        </a>
      ))}
    </nav>
  )
}