import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ArchivePage from './ArchivePage'

function isArchiveOpen() {
  return window.location.hash === '#archive'
}

export default function ArchiveHost() {
  const [open, setOpen] = useState(isArchiveOpen)

  useEffect(() => {
    const sync = () => setOpen(isArchiveOpen())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const close = useCallback(() => {
    window.location.hash = 'projects'
  }, [])

  return (
    <AnimatePresence>
      {open && <ArchivePage key="archive-page" onClose={close} />}
    </AnimatePresence>
  )
}

