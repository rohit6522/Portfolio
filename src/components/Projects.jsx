import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { projects, achievements, archiveCategories, archiveProjects } from '../data/content'
import { profile } from '../data/content'
import useReveal from '../hooks/useReveal'
import AnimatedStat from './AnimatedStat'

const statusConfig = {
  STABLE: { label: 'Completed', className: 'status-completed' },
  'IN PROGRESS': { label: 'In Progress', className: 'status-progress' },
  PLANNED: { label: 'Planned', className: 'status-planned' },
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  )
}

function ProjectCard({ project, index }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = project.images || []
  const features = project.features || []
  const trackRef = useRef(null)
  const status = statusConfig[project.status] || statusConfig.STABLE

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
      className="project-card-v2"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1, ease: 'easeOut' }}
    >
      {images.length > 0 && (
        <div className="project-media">
          {project.featured && <span className="project-featured-pill">★ Featured</span>}
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

      <div className="project-body-v2">
        <div className="project-meta-row">
          <span className="project-category-v2">{'</>'} {project.category}</span>
          <span className={`status-pill ${status.className}`}>{status.label}</span>
        </div>

        <h3 className="project-title-v2">{project.title}</h3>
        <p className="project-summary-v2">{project.summary}</p>

        {project.tags?.length > 0 && (
          <div className="project-tags-row">
            {project.tags.map((tag, i) => (
              <span className={`project-tag-chip chip-${i % 5}`} key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div className="project-features-v2">
            <span className="features-label">Key Features</span>
            <ul>
              {features.map((f, i) => (
                <li key={i}>
                  <span className="feature-dot" /> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="project-footer-v2">
          <span className="project-period">
            <CalendarIcon /> {project.period || ''}
          </span>
          <div className="project-footer-links">
            {project.codeUrl && (
              <a href={project.codeUrl} target="_blank" rel="noreferrer" className="project-icon-link" aria-label="Source code">
                <GithubIcon />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="live-demo-pill">
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [ref, visible] = useReveal()
  const [showArchive, setShowArchive] = useState(false)
  const [activeCategory, setActiveCategory] = useState(archiveCategories[0])
  const github = profile.social.find((s) => s.label === 'GitHub')

  return (
    <section
      id="projects"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >
      <div className="container">
        <div className="section-head projects-head-row">
          <div>
            <span className="eyebrow">Portfolio &amp; Work</span>
            <h2 className="section-title" style={{ marginTop: '12px' }}>
              Featured Projects
            </h2>
          </div>
          {github && (
            <a href={github.url} target="_blank" rel="noreferrer" className="view-github-pill">
              View all on GitHub ↗
            </a>
          )}
        </div>

        <div className="projects-grid-v2">
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