import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { projects, achievements, archiveCategories, archiveProjects } from '../data/content'
import useReveal from '../hooks/useReveal'
import AnimatedStat from './AnimatedStat'

function ProjectCard({ project, index }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const images = project.images || []
  const features = project.features || []
  const visibleFeatures = expanded ? features : features.slice(0, 2)
  const remaining = features.length - 2
  const trackRef = useRef(null)

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  function scrollToIndex(i) {
    setImgIndex(i)
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: trackRef.current.clientWidth * i, behavior: 'smooth' })
    }
  }

  function prevImg(e) {
    e.stopPropagation()
    scrollToIndex(imgIndex === 0 ? images.length - 1 : imgIndex - 1)
  }

  function nextImg(e) {
    e.stopPropagation()
    scrollToIndex(imgIndex === images.length - 1 ? 0 : imgIndex + 1)
  }

  function handleScroll() {
    if (!trackRef.current) return
    const i = Math.round(trackRef.current.scrollLeft / trackRef.current.clientWidth)
    setImgIndex(i)
  }

  return (
    <motion.div
      className="blueprint-card project-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.12, ease: 'easeOut' }}
    >
      <span className="card-glow" />

      {images.length > 0 && (
        <div className="project-media">
          <div className="project-carousel-track" ref={trackRef} onScroll={handleScroll}>
            {images.map((src, i) => (
              <img key={i} src={src} alt={`${project.title} screenshot ${i + 1}`} className="project-image" />
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button className="carousel-arrow carousel-arrow-left" onClick={prevImg} aria-label="Previous image">
                ‹
              </button>
              <button className="carousel-arrow carousel-arrow-right" onClick={nextImg} aria-label="Next image">
                ›
              </button>
              <div className="project-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`project-dot ${i === imgIndex ? 'active' : ''}`}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="project-body">
        <div className="project-top-row">
          <div className="project-badges">
            {project.category && <span className="project-badge">[{project.category}]</span>}
            {project.featured && (
              <span className="project-badge project-badge-featured">★ FEATURED</span>
            )}
          </div>
          {project.liveUrl && (
            <a className="project-external-link" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Open live project">
              ↗
            </a>
          )}
        </div>

        <h3>{project.title}</h3>
        <div className="project-divider" />
        <p>{project.summary}</p>

        {features.length > 0 && (
          <ul className="project-features">
            {visibleFeatures.map((f, i) => (
              <li key={i}>
                <span className="feature-arrow">&gt;</span> {f}
              </li>
            ))}
            {!expanded && remaining > 0 && (
              <li className="feature-more" onClick={() => setExpanded(true)}>
                +{remaining} addtl logs...
              </li>
            )}
          </ul>
        )}

        <div className="project-links">
          <a href={project.liveUrl}>View live →</a>
          <a href={project.codeUrl}>Source code →</a>
        </div>

        <div className="project-footer-row">
          <div className="skill-tags">
            {project.tags.map((tag) => (
              <span className="skill-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          {project.status && (
            <span className="project-status">[ STATUS: {project.status} ]</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [ref, visible] = useReveal()
  const [showArchive, setShowArchive] = useState(false)
  const [activeCategory, setActiveCategory] = useState(archiveCategories[0])

  return (
    <section
      id="projects"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Projects</span>
          <h2 className="section-title" style={{ marginTop: '12px' }}>
            Selected work
          </h2>
        </div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard project={project} index={i} key={project.title} />
          ))}
        </div>

        <div className="archive-toggle-wrap">
          <button className="archive-toggle" onClick={() => setShowArchive(!showArchive)}>
            [ {showArchive ? 'HIDE_ARCHIVE' : 'ACCESS_ARCHIVE'} ]
            <span>{showArchive ? '▲' : '▼'}</span>
          </button>
        </div>

        {showArchive && (
          <div className="archive-panel tab-panel">
            <div className="archive-categories">
              {archiveCategories.map((cat) => (
                <button
                  key={cat}
                  className={`archive-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="projects-grid">
              {archiveProjects
                .filter((p) => p.category === activeCategory)
                .map((project) => (
                  <div className="blueprint-card project-card" key={project.title}>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="project-links">
                      <a href={project.liveUrl}>View live →</a>
                      <a href={project.codeUrl}>Source code →</a>
                    </div>
                    <div className="skill-tags">
                      {project.tags.map((tag) => (
                        <span className="skill-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="achievements-head">
          <span className="achievements-eyebrow-line" />
          <span className="achievements-eyebrow">Merit &amp; Milestones</span>
        </div>
        <h3 className="achievements-title">Key achievements.</h3>

        <div className="achievements-grid">
          {achievements.map((a) => (
            <div
              className={`achievement-card ${a.highlight ? 'achievement-highlight' : ''}`}
              key={a.label}
            >
              <span className="achievement-icon">{a.icon}</span>
              <span className="achievement-label">{a.label}</span>
              <span className="achievement-stat">
                <AnimatedStat value={a.stat} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}