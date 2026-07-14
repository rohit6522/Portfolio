import { useState } from 'react'
import { projects, achievements, archiveCategories, archiveProjects } from '../data/content'
import useReveal from '../hooks/useReveal'

function ProjectCard({ project }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = project.images || []

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="blueprint-card project-card" onMouseMove={handleMouseMove}>
      <span className="card-glow" />

      {images.length > 0 && (
        <div className="project-media">
          <img src={images[imgIndex]} alt={project.title} className="project-image" />
          {images.length > 1 && (
            <div className="project-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`project-dot ${i === imgIndex ? 'active' : ''}`}
                  onClick={() => setImgIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="project-body">
        {project.category && (
          <div className="project-badges">
            <span className="project-badge">[{project.category}]</span>
          </div>
        )}
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
    </div>
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
          {projects.map((project) => (
            <ProjectCard project={project} key={project.title} />
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
              <span className="achievement-stat">{a.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
