import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouchDevice || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY

    function handleMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      dot.classList.add('cursor-visible')
    }

    function handleMouseDown() {
      ring.classList.add('cursor-ring-active')
    }

    function handleMouseUp() {
      ring.classList.remove('cursor-ring-active')
    }

    function handleMouseOver(e) {
      if (e.target.closest('[data-cursor-disable]')) {
        dot.style.opacity = '0'
        ring.style.opacity = '0'
        return
      }
      if (e.target.closest('a, button, [role="button"]')) {
        ring.classList.add('cursor-ring-hover')
      }
    }

    function handleMouseOut(e) {
      if (e.target.closest('[data-cursor-disable]')) {
        dot.style.opacity = ''
        ring.style.opacity = ''
        return
      }
      if (e.target.closest('a, button, [role="button"]')) {
        ring.classList.remove('cursor-ring-hover')
      }
    }

    let frameId
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frameId = requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    animateRing()

    document.body.classList.add('custom-cursor-active')

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(frameId)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
