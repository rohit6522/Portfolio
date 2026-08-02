import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projects, achievements, archiveCategories, archiveProjects } from '../data/content'
import useReveal from '../hooks/useReveal'
import useLeetCodeStats from '../hooks/useLeetCodeStats'
import AnimatedStat from './AnimatedStat'
import IconBadge, { FolderIcon, AwardIcon } from './IconBadge'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9Z" />
    </svg>
  )
}

function ProjectCard({ project, index, compact = false }) {
  const images = project.images || []
  const features = project.features || []
  const [imgIndex, setImgIndex] = useState(0)
  const status = statusConfig[project.status] || statusConfig.STABLE

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 3500)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <motion.div
      className={`project-card-v3 ${compact ? 'project-card-compact' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1, ease: 'easeOut' }}
    >
      {images.length > 0 && (
        <div className="project-flip-outer">
          <div className="project-flip-inner">
            <div className="project-flip-face project-flip-front">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={project.title}
                  className="project-cover-img"
                  style={{ opacity: i === imgIndex ? 1 : 0 }}
                />
              ))}

             <div className="project-cover-overlay" />
              <div className="project-cover-meta-row">
                {project.category && <span className="project-meta-pill">{project.category}</span>}
                <span className={`project-meta-pill ${status.className}`}>{status.label}</span>
              </div>
              <span className="project-cover-title">{project.title}</span>
              {project.period && <span className="project-cover-period">{project.period}</span>}
              <span className="project-hover-pill">
                Hover <span>›</span>
              </span>

              {images.length > 1 && (
                <div className="project-cover-dots">
                  {images.map((_, i) => (
                    <span key={i} className={`project-cover-dot ${i === imgIndex ? 'active' : ''}`} />
                  ))}
                </div>
              )}
            </div>
{/* project-flip-face project-flip-back */}

           <div className="project-flip-face project-flip-back">
              {project.summary && <p className="features-panel-summary">{project.summary}</p>}
              <div className="features-panel-label">
                <span>✓</span> Key Features
              </div>
              <ul className="features-panel-list">

                {features.map((f, i) => (
                  <li key={i}>
                    <span className="features-panel-dot" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="project-footer-v3">
        {project.tags?.length > 0 && (
          <div className="project-tags-row-v3">
            {project.tags.map((tag) => (
              <span className="project-tag-pill-v3" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="project-links-row-v3">
          {project.codeUrl && (
            <a href={project.codeUrl} target="_blank" rel="noreferrer" className="project-link-btn-v3">
              <GithubIcon /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link-btn-v3">
              <GlobeIcon /> Live
            </a>
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
  const leetcode = useLeetCodeStats()

  const liveAchievements = achievements.map((a) =>
    a.label === 'Coding Platforms' && leetcode?.total
      ? { ...a, stat: `${leetcode.total}+ Solved` }
      : a
  )

  return (
    <section
      id="projects"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >
      <div className="container">

       <div className="section-head-row">
          <IconBadge>
            <FolderIcon />
          </IconBadge>
          <div>
            <span className="eyebrow">Projects</span>
            <h2 className="section-title" style={{ marginTop: '4px' }}>
              Personal project
            </h2>
          </div>
        </div>

        <div className="projects-grid-v3">
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
            <div className="projects-grid-v3 projects-grid-compact">
              {archiveProjects
                .filter((p) => p.category === activeCategory)
                .map((project, i) => (
                  <ProjectCard project={project} index={i} key={project.title} compact />
                ))}
            </div>
          </div>
        )}

      <div id="achievements" className="section-head-row" style={{ marginTop: '72px' }}>
          <IconBadge>
            <AwardIcon />
          </IconBadge>
          <div>
            <span className="achievements-eyebrow">Merit &amp; Milestones</span>
            <h3 className="achievements-title" style={{ marginTop: '4px', marginBottom: 0 }}>
              Key achievements.
            </h3>
          </div>
        </div>

       <div className="achievements-grid">
          {liveAchievements.map((a) => (
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