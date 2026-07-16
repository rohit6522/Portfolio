import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    function handleResize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 }

    function handleMouseMove(e) {
      mouse.tx = e.clientX
      mouse.ty = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const gridSize = 45
    let count = 0
    let frameId

    function draw() {
      ctx.clearRect(0, 0, width, height)

      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08

      count += 0.015
      ctx.lineWidth = 1

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        for (let x = 0; x < width; x += 10) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = Math.max(0, (250 - dist) / 250)

          const waveY = Math.sin(x * 0.005 + count) * 12 + Math.cos(y * 0.005 + count) * 12
          const mouseShiftY = force * (dy / dist) * -40

          const finalY = y + waveY + (isNaN(mouseShiftY) ? 0 : mouseShiftY)

          if (x === 0) ctx.moveTo(x, finalY)
          else ctx.lineTo(x, finalY)
        }
        ctx.strokeStyle = 'rgba(184, 155, 90, 0.07)'
        ctx.stroke()
      }

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        for (let y = 0; y < height; y += 10) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = Math.max(0, (250 - dist) / 250)

          const waveX = Math.sin(x * 0.005 + count) * 12 + Math.cos(y * 0.005 + count) * 12
          const mouseShiftX = force * (dx / dist) * -40

          const finalX = x + waveX + (isNaN(mouseShiftX) ? 0 : mouseShiftX)

          if (y === 0) ctx.moveTo(finalX, y)
          else ctx.lineTo(finalX, y)
        }
        ctx.strokeStyle = 'rgba(184, 155, 90, 0.07)'
        ctx.stroke()
      }

      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 200)
      gradient.addColorStop(0, 'rgba(184, 155, 90, 0.05)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      frameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className="bg-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-canvas" />
    </div>
  )
}