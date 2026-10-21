import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { projects } from '../data/content'
import CaseStudy from './CaseStudy'

function readSlug() {
  const match = window.location.hash.match(/^#case-(.+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

export default function CaseStudyHost() {
  const [slug, setSlug] = useState(readSlug)

  useEffect(() => {
    const sync = () => setSlug(readSlug())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const close = useCallback(() => {
    window.location.hash = 'projects'
  }, [])

  const project = slug ? projects.find((p) => p.caseStudy?.slug === slug) : null

  return (
    <AnimatePresence>
      {project && <CaseStudy key={slug} project={project} onClose={close} />}
    </AnimatePresence>
  )
}