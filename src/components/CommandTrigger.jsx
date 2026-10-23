import { useEffect, useState } from 'react'

// CommandPalette isi event ko sunta hai
export const OPEN_PALETTE_EVENT = 'open-command-palette'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default function CommandTrigger() {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 100 : false
  )

  useEffect(() => {
    function onScroll() {
      const next = window.scrollY > 100
      setCompact((prev) => (prev === next ? prev : next))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/i.test(navigator.userAgentData?.platform || navigator.platform || '')
  const mod = isMac ? '⌘' : 'Ctrl'

  return (
    <button
      type="button"
      className={`cmdk-trigger ${compact ? 'is-compact' : ''}`}
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-label="Open quick search"
      aria-keyshortcuts="Control+K Meta+K"
      title={`Quick search (${mod} K)`}
    >
      <SearchIcon />
      <span className="cmdk-trigger-label">Search</span>
      <kbd className="cmdk-kbd cmdk-trigger-kbd">{mod} K</kbd>
    </button>
  )
}