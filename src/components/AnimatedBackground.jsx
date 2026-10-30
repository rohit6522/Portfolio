import { useEffect, useRef } from 'react'

// ✏️ Yahan se tweak karo
const GRID_SIZE = 45 // grid lines ke beech gap (px)
const SAMPLE_STEP = 16 // line par har itne px baad ek point (bada = halka)
const TARGET_FPS = 30 // wave ki speed same rehti hai, sirf redraw kam hota hai
const LINE_COLOR = 'rgba(34, 211, 238, 0.018)'
const GLOW_COLOR = 'rgba(34, 211, 238, 0.02)'
const MOUSE_RADIUS = 250
const MOUSE_PUSH = 40
const ANIMATE = true // false karoge to background hamesha static rahega

const FRAME_MS = 1000 / TARGET_FPS

function canAnimate() {
  if (typeof window === 'undefined') return false
  const query = (q) => window.matchMedia(q).matches
  if (query('(prefers-reduced-motion: reduce)')) return false
  if (query('(pointer: coarse)')) return false // phone/tablet
  if (window.innerWidth < 900) return false
  if (navigator.connection?.saveData) return false
  return true
}

// Mouse ke paas wali point ko door dhakelta hai. (dx, dy) = point minus mouse
function pushFactor(dx, dy) {
  if (dx >= MOUSE_RADIUS || dx <= -MOUSE_RADIUS || dy >= MOUSE_RADIUS || dy <= -MOUSE_RADIUS) {
    return 0
  }
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0 || dist >= MOUSE_RADIUS) return 0
  return ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * (-MOUSE_PUSH / dist)
}

function draw(ctx, w, h, phase, mouse) {
  ctx.clearRect(0, 0, w, h)
  ctx.lineWidth = 1
  ctx.strokeStyle = LINE_COLOR

  const cols = Math.ceil(w / SAMPLE_STEP) + 1
  const rows = Math.ceil(h / SAMPLE_STEP) + 1

  // Har frame mein trig sirf yahan: baaki sab in tables se
  const sinX = new Float32Array(cols)
  for (let i = 0; i < cols; i++) sinX[i] = Math.sin(i * SAMPLE_STEP * 0.005 + phase) * 12
  const cosY = new Float32Array(rows)
  for (let j = 0; j < rows; j++) cosY[j] = Math.cos(j * SAMPLE_STEP * 0.005 + phase) * 12

  // Horizontal lines: ek hi path, ek hi stroke
  ctx.beginPath()
  for (let y = 0; y < h; y += GRID_SIZE) {
    const waveBase = Math.cos(y * 0.005 + phase) * 12
    for (let i = 0; i < cols; i++) {
      const x = i * SAMPLE_STEP
      let py = y + sinX[i] + waveBase
      if (mouse.active) {
        const dy = y - mouse.y
        py += dy * pushFactor(x - mouse.x, dy)
      }
      if (i === 0) ctx.moveTo(x, py)
      else ctx.lineTo(x, py)
    }
  }
  ctx.stroke()

  // Vertical lines
  ctx.beginPath()
  for (let x = 0; x < w; x += GRID_SIZE) {
    const waveBase = Math.sin(x * 0.005 + phase) * 12
    for (let j = 0; j < rows; j++) {
      const y = j * SAMPLE_STEP
      let px = x + waveBase + cosY[j]
      if (mouse.active) {
        const dx = x - mouse.x
        px += dx * pushFactor(dx, y - mouse.y)
      }
      if (j === 0) ctx.moveTo(px, y)
      else ctx.lineTo(px, y)
    }
  }
  ctx.stroke()

  // Mouse glow: sirf cursor ke aas-paas ka box fill hota hai, poori screen nahi
  if (mouse.active) {
    const r = 200
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, r)
    g.addColorStop(0, GLOW_COLOR)
    g.addColorStop(1, 'rgba(34, 211, 238, 0)')
    ctx.fillStyle = g
    ctx.fillRect(mouse.x - r, mouse.y - r, r * 2, r * 2)
  }
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const animated = ANIMATE && canAnimate()
    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      active: animated,
    }

    let width = 0
    let height = 0
    let frameId = 0
    let last = 0
    let resizeTimer

    function setSize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    function loop(now) {
      frameId = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      mouse.x += (mouse.tx - mouse.x) * 0.15
      mouse.y += (mouse.ty - mouse.y) * 0.15
      draw(ctx, width, height, now * 0.0009, mouse)
    }

    function onMouseMove(e) {
      mouse.tx = e.clientX
      mouse.ty = e.clientY
    }

    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth
        const h = window.innerHeight
        // Mobile URL bar ke chhote height changes ignore
        if (w === width && Math.abs(h - height) < 150) return
        setSize()
        if (!animated) draw(ctx, width, height, 0, mouse)
      }, 150)
    }

    setSize()

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(frameId)
      } else if (animated) {
        last = performance.now()
        frameId = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    if (animated) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      frameId = requestAnimationFrame(loop)
    } else {
      draw(ctx, width, height, 0, mouse)
    }
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      cancelAnimationFrame(frameId)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="bg-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-canvas" />
    </div>
  )
}