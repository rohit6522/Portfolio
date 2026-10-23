import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { profile, projects } from '../data/content'
import { OPEN_PALETTE_EVENT } from './CommandTrigger'

const GROUP_ORDER = ['Navigate', 'Projects', 'Actions', 'Links']

const isRealLink = (u) =>
  typeof u === 'string' && u !== '' && u !== '#' && !/yourhandle|your-/i.test(u)

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.location.hash === `#${id}`) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    // nav link click jaisa hi behaviour; ye khula hua case study bhi band kar deta hai
    window.location.hash = id
  }
}

// Items group order mein push hote hain: Navigate, Projects, Actions, Links
function buildItems(toast) {
  const items = []

  const sections = [
    ['top', 'Home', 'hero start top'],
    ['about', 'About', 'story bio me'],
    ['skills', 'Skills', 'tech stack education experience certifications'],
    ['projects', 'Projects', 'work apps portfolio'],
    ['achievements', 'Achievements', 'milestones'],
    ['contributions', 'Contributions', 'github leetcode graph activity'],
    ['contact', 'Contact', 'message hire email form'],
  ]
  sections.forEach(([id, label, keywords]) => {
    if (document.getElementById(id)) {
      items.push({
        id: `go-${id}`,
        group: 'Navigate',
        label: `Go to ${label}`,
        keywords,
        run: () => goTo(id),
      })
    }
  })

  projects.forEach((p) => {
    const tags = (p.tags || []).join(' ')
    if (p.caseStudy?.slug) {
      items.push({
        id: `case-${p.caseStudy.slug}`,
        group: 'Projects',
        label: `Case study: ${p.title}`,
        keywords: `${tags} details`,
        run: () => {
          window.location.hash = `case-${p.caseStudy.slug}`
        },
      })
    }
    if (isRealLink(p.liveUrl)) {
      items.push({
        id: `live-${p.title}`,
        group: 'Projects',
        label: `Live demo: ${p.title}`,
        keywords: `${tags} open website`,
        run: () => window.open(p.liveUrl, '_blank', 'noopener,noreferrer'),
      })
    }
  })

  if (profile.resumeUrl && profile.resumeUrl !== '#') {
    items.push({
      id: 'resume',
      group: 'Actions',
      label: 'Download resume',
      keywords: 'cv pdf',
      run: () => {
        const a = document.createElement('a')
        a.href = profile.resumeUrl
        a.download = ''
        document.body.appendChild(a)
        a.click()
        a.remove()
      },
    })
  }

  if (profile.email) {
    items.push({
      id: 'copy-email',
      group: 'Actions',
      label: 'Copy email address',
      keywords: 'mail contact',
      run: async () => {
        try {
          await navigator.clipboard.writeText(profile.email)
          toast('Email copied to clipboard')
        } catch {
          toast(`Couldn't copy. Email: ${profile.email}`)
        }
      },
    })
  }

  if (document.querySelector('.chat-fab')) {
    items.push({
      id: 'chat',
      group: 'Actions',
      label: 'Ask the assistant',
      keywords: 'chat bot ai question help',
      run: () => {
        if (!document.querySelector('.chat-panel')) {
          document.querySelector('.chat-fab')?.click()
        }
      },
    })
  }

  ;(profile.social || []).forEach((s) => {
    if (isRealLink(s.url)) {
      items.push({
        id: `link-${s.label}`,
        group: 'Links',
        label: `Open ${s.label}`,
        keywords: `${s.label} profile social`,
        run: () => window.open(s.url, '_blank', 'noopener,noreferrer'),
      })
    }
  })

  return items
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function PalettePanel({ onClose, onToast }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const items = useMemo(() => buildItems(onToast), [onToast])

  const flat = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return items
    return items.filter((item) => {
      const hay = `${item.label} ${item.keywords || ''}`.toLowerCase()
      return tokens.every((t) => hay.includes(t))
    })
  }, [items, query])

  const groups = GROUP_ORDER.map((name) => ({
    name,
    rows: flat.filter((i) => i.group === name),
  })).filter((g) => g.rows.length > 0)

  const activeIndex = Math.min(active, flat.length - 1)
  const current = flat[activeIndex]

  // Scroll lock + focus; band hone par purani state wapas
  useEffect(() => {
    const trigger = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      trigger?.focus?.({ preventScroll: true })
    }
  }, [])

  // Esc sirf palette band kare: case study ya chat ko nahi (capture phase + stopPropagation)
  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onEsc, true)
    return () => window.removeEventListener('keydown', onEsc, true)
  }, [onClose])

  useEffect(() => {
    if (!current) return
    document.getElementById(`cmdk-opt-${current.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [current])

  function runItem(item) {
    if (!item) return
    item.run()
    onClose()
  }

  function onInputKeyDown(e) {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (flat.length) setActive((activeIndex + 1) % flat.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (flat.length) setActive((activeIndex - 1 + flat.length) % flat.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runItem(current)
    }
  }

  return (
    <div
      className="cmdk-backdrop"
      data-lenis-prevent
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault()
            inputRef.current?.focus()
          }
        }}
      >
        <div className="cmdk-input-row">
          <SearchIcon />
          <input
            ref={inputRef}
            className="cmdk-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-autocomplete="list"
            aria-activedescendant={current ? `cmdk-opt-${current.id}` : undefined}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onInputKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="cmdk-kbd">Esc</kbd>
        </div>

        <div className="cmdk-list" id="cmdk-list" role="listbox">
          {flat.length === 0 ? (
            <p className="cmdk-empty">No results for “{query}”</p>
          ) : (
            groups.map((g) => (
              <div key={g.name} role="group" aria-label={g.name}>
                <p className="cmdk-group-title" aria-hidden="true">
                  {g.name}
                </p>
                {g.rows.map((item) => {
                  const idx = flat.indexOf(item)
                  const isActive = idx === activeIndex
                  return (
                    <div
                      key={item.id}
                      id={`cmdk-opt-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                      className={`cmdk-option ${isActive ? 'is-active' : ''}`}
                      onMouseMove={() => {
                        if (!isActive) setActive(idx)
                      }}
                      onClick={() => runItem(item)}
                    >
                      {item.label}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="cmdk-footer">
          <span>
            <kbd className="cmdk-kbd">↑</kbd>
            <kbd className="cmdk-kbd">↓</kbd> navigate
          </span>
          <span>
            <kbd className="cmdk-kbd">↵</kbd> select
          </span>
          <span>
            <kbd className="cmdk-kbd">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const close = useCallback(() => setOpen(false), [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && typeof e.key === 'string' && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Navbar ke Search button se bhi khule
  useEffect(() => {
    const openIt = () => setOpen(true)
    window.addEventListener(OPEN_PALETTE_EVENT, openIt)
    return () => window.removeEventListener(OPEN_PALETTE_EVENT, openIt)
  }, [])

  // Ek baar use kar liya to hint dobara nahi dikhega
  useEffect(() => {
    if (!open) return
    setHint(false)
    try {
      localStorage.setItem('cmdk-used', '1')
    } catch {
      /* storage unavailable */
    }
  }, [open])

  // One-time hint: sirf desktop (mouse + keyboard), session mein ek baar
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let skip = false
    try {
      skip = !!sessionStorage.getItem('cmdk-hint-shown') || !!localStorage.getItem('cmdk-used')
    } catch {
      /* storage unavailable */
    }
    if (skip) return

    const show = setTimeout(() => {
      setHint(true)
      try {
        sessionStorage.setItem('cmdk-hint-shown', '1')
      } catch {
        /* storage unavailable */
      }
    }, 4500)
    const hide = setTimeout(() => setHint(false), 9500)

    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/i.test(navigator.userAgentData?.platform || navigator.platform || '')

  return (
    <>
      {hint && !open && (
        <button type="button" className="cmdk-hint" onClick={() => setOpen(true)}>
          Press <kbd className="cmdk-kbd">{isMac ? '⌘' : 'Ctrl'}</kbd>{' '}
          <kbd className="cmdk-kbd">K</kbd> to jump anywhere
        </button>
      )}

      {open && <PalettePanel onClose={close} onToast={showToast} />}

      {toast && (
        <div className="cmdk-toast" role="status">
          {toast}
        </div>
      )}
    </>
  )
}