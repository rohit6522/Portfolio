import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { archiveCategories, archiveProjects } from '../data/content'
import { ProjectCard } from './Projects'

export default function ArchivePage({ onClose }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const categories = ['All', ...archiveCategories]
  const [activeCategory, setActiveCategory] = useState('All')

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

  const getCount = (category) => {
    if (category === 'All') return archiveProjects.length
    return archiveProjects.filter((p) => p.category === category).length
  }

  const filteredArchive =
    activeCategory === 'All'
      ? archiveProjects
      : archiveProjects.filter((project) => project.category === activeCategory)

  return (
    <motion.div
      className="case-overlay archive-overlay"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-page-title"
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : 24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="archive-page-inner">
        <div className="case-topbar">
          <button type="button" className="case-back" onClick={onClose}>
            ← Back to projects
          </button>
          <button
            type="button"
            ref={closeRef}
            className="case-close"
            onClick={onClose}
            aria-label="Close archive"
          >
            ×
          </button>
        </div>

        <header className="archive-page-head">
          <span className="archive-page-eyebrow">ARCHIVE // COMPLETE COLLECTION</span>
          <h2 id="archive-page-title" className="archive-page-title">
            Project Archive
          </h2>
          <p className="archive-page-sub">
            Browse archived builds, SaaS prototypes, and upcoming releases filtered by category.
          </p>
        </header>

        <div className="archive-categories archive-page-categories" role="tablist" aria-label="Project categories">
          {categories.map((category) => {
            const count = getCount(category)
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`archive-cat-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <span>{category}</span>
                <span className="archive-cat-count">{count}</span>
              </button>
            )
          })}
        </div>

        {filteredArchive.length === 0 ? (
          <motion.div
            key={`empty-${activeCategory}`}
            className="archive-empty-card"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="archive-empty-state">
              <span className="archive-empty-icon">🚧</span>
              <h3>Coming Soon</h3>
              <p>
                No projects listed under <strong>{activeCategory}</strong> yet — currently building and
                shipping new things. Check back soon!
              </p>
              <button
                type="button"
                className="archive-empty-reset"
                onClick={() => setActiveCategory('All')}
              >
                View All Projects ({archiveProjects.length})
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            className="projects-grid-v3 archive-page-grid"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filteredArchive.map((project) => (
              <ProjectCard key={project.title} project={project} compact />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

