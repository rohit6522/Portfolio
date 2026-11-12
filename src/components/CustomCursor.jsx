import { useEffect, useRef } from 'react'

function resolveCursorState(target) {
  if (!(target instanceof Element)) {
    return { mode: 'default', label: '' }
  }

  if (target.closest('[data-cursor-disable]')) {
    return { mode: 'hidden', label: '' }
  }

  if (
    target.closest(
      'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]'
    )
  ) {
    return { mode: 'text', label: '' }
  }

  const customLabelEl = target.closest('[data-cursor-text]')
  if (customLabelEl) {
    const label = customLabelEl.getAttribute('data-cursor-text') || ''
    return { mode: label ? 'label' : 'pointer', label }
  }

  if (target.closest('a, button, [role="button"], select, summary, .bento-cta, .nav-logo-link')) {
    return { mode: 'pointer', label: '' }
  }

  if (target.closest('.footer-terminal')) {
    return { mode: 'label', label: 'COPY' }
  }

  if (target.closest('.project-flip-outer')) {
    return { mode: 'label', label: 'VIEW' }
  }

  return { mode: 'default', label: '' }
}

export default function CustomCursor() {
  const rootRef = useRef(null)
  const dotPosRef = useRef(null)
  const ringPosRef = useRef(null)
  const labelRef = useRef(null)
  const rippleRef = useRef(null)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouchDevice || prefersReducedMotion) return

    const root = rootRef.current
    const dotPos = dotPosRef.current
    const ringPos = ringPosRef.current
    const labelEl = labelRef.current
    const rippleEl = rippleRef.current
    if (!root || !dotPos || !ringPos || !labelEl || !rippleEl) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let frameId = null
    let visible = false
    let currentMode = 'default'
    let currentLabel = ''

    function applyState(nextMode, nextLabel) {
      if (nextMode !== currentMode) {
        currentMode = nextMode
        root.dataset.mode = nextMode
      }
      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel
        labelEl.textContent = nextLabel
      }
    }

    function animateRing() {
      const dx = mouseX - ringX
      const dy = mouseY - ringY

      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ringX = mouseX
        ringY = mouseY
        ringPos.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
        frameId = null
        return
      }

      ringX += dx * 0.2
      ringY += dy * 0.2
      ringPos.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frameId = requestAnimationFrame(animateRing)
    }

    function ensureAnimating() {
      if (frameId === null) {
        frameId = requestAnimationFrame(animateRing)
      }
    }

    function handleMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!visible) {
        visible = true
        ringX = mouseX
        ringY = mouseY
        ringPos.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
        root.classList.add('is-visible')
      }

      dotPos.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      ensureAnimating()

      const { mode, label } = resolveCursorState(e.target)
      applyState(mode, label)
    }

    function handleMouseDown() {
      root.classList.add('is-pressed')
      if (currentMode !== 'hidden' && currentMode !== 'text') {
        rippleEl.animate(
          [
            { transform: 'translate(-50%, -50%) scale(0.45)', opacity: 0.7 },
            { transform: 'translate(-50%, -50%) scale(1.75)', opacity: 0 },
          ],
          { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        )
      }
    }

    function handleMouseUp() {
      root.classList.remove('is-pressed')
      // Re-resolve in case a click navigated or unmounted the hovered target
      const el = document.elementFromPoint(mouseX, mouseY)
      const { mode, label } = resolveCursorState(el)
      applyState(mode, label)
    }

    function handleMouseLeave() {
      visible = false
      root.classList.remove('is-visible', 'is-pressed')
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    function handleScroll() {
      if (!visible) return
      const el = document.elementFromPoint(mouseX, mouseY)
      const { mode, label } = resolveCursorState(el)
      applyState(mode, label)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    document.body.classList.add('custom-cursor-active')

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('scroll', handleScroll)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      if (frameId !== null) cancelAnimationFrame(frameId)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <div ref={rootRef} className="cursor-root" data-mode="default" aria-hidden="true">
      <div ref={ringPosRef} className="cursor-pos cursor-pos-ring">
        <div className="cursor-ring-inner">
          <span ref={labelRef} className="cursor-pill-label" />
        </div>
      </div>

      <div ref={dotPosRef} className="cursor-pos cursor-pos-dot">
        <div ref={rippleRef} className="cursor-click-ripple" />
        <div className="cursor-dot-inner" />
      </div>
    </div>
  )
}
