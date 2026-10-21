import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// '[' se shuru hone wali placeholder lines hide ho jati hain
const isFilled = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('[')
const isRealLink = (v) => typeof v === 'string' && v !== '' && v !== '#'

const STATUS_LABEL = {
  STABLE: 'Completed',
  'IN PROGRESS': 'In Progress',
  PLANNED: 'Planned',
}

function Block({ title, children }) {
  return (
    <section className="case-block">
      <h3 className="case-block-title">{title}</h3>
      {children}
    </section>
  )
}

export default function CaseStudy({ project, onClose }) {
  const cs = project.caseStudy
  const reduce = useReducedMotion()
  const closeRef = useRef(null)

  useEffect(() => {
    const trigger = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      trigger?.focus?.()
    }
  }, [onClose])

  const images = project.images || []
  const gallery = images.slice(1)
  const features = project.features || []
  const challenges = (cs.challenges || []).filter((c) => isFilled(c.title) && isFilled(c.detail))
  const outcome = (cs.outcome || []).filter(isFilled)

  return (
    <motion.div
      className="case-overlay"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : 24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="case-inner">
        <div className="case-topbar">
          <button type="button" className="case-back" onClick={onClose}>
            ← Back to projects
          </button>
          <button
            type="button"
            ref={closeRef}
            className="case-close"
            onClick={onClose}
            aria-label="Close case study"
          >
            ×
          </button>
        </div>

        <div className="case-meta">
          {project.category && <span className="case-pill">{project.category}</span>}
          {project.status && (
            <span className="case-pill">{STATUS_LABEL[project.status] || project.status}</span>
          )}
          {project.period && <span className="case-pill">{project.period}</span>}
        </div>

        <h2 id="case-title" className="case-title">
          {project.title}
        </h2>
        {isFilled(project.summary) && <p className="case-lead">{project.summary}</p>}

        {images[0] && (
          <img
            src={images[0]}
            alt={`${project.title} main screenshot`}
            className="case-hero-img"
            loading="lazy"
          />
        )}

        <div className="case-facts">
          {isFilled(cs.role) && (
            <div>
              <span className="case-fact-label">My role</span>
              <span className="case-fact-value">{cs.role}</span>
            </div>
          )}
          {project.tags?.length > 0 && (
            <div>
              <span className="case-fact-label">Tech stack</span>
              <div className="case-stack">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isFilled(cs.problem) && (
          <Block title="The problem">
            <p className="case-text">{cs.problem}</p>
          </Block>
        )}

        {isFilled(cs.solution) && (
          <Block title="The solution">
            <p className="case-text">{cs.solution}</p>
          </Block>
        )}

        {features.length > 0 && (
          <Block title="Key features">
            <ul className="case-list">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Block>
        )}

        {challenges.length > 0 && (
          <Block title="Challenges and how I solved them">
            {challenges.map((c, i) => (
              <div className="case-challenge" key={i}>
                <p className="case-challenge-title">{c.title}</p>
                <p className="case-text">{c.detail}</p>
              </div>
            ))}
          </Block>
        )}

        {outcome.length > 0 && (
          <Block title="Outcome">
            <ul className="case-list">
              {outcome.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </Block>
        )}

        {gallery.length > 0 && (
          <Block title="Screenshots">
            <div className="case-gallery">
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 2}`}
                  loading="lazy"
                />
              ))}
            </div>
          </Block>
        )}

        <div className="case-links">
          {isRealLink(project.liveUrl) && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="case-link-btn case-link-primary"
            >
              View live ↗
            </a>
          )}
          {isRealLink(project.codeUrl) && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="case-link-btn"
            >
              Source code ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}