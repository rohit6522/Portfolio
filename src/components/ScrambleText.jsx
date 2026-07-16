import { useEffect, useRef } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export default function ScrambleText({ text, delay = 0, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    let frameRequest
    const queue = Array.from(text).map((ch) => {
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      return { to: ch, start, end, char: '' }
    })

    function update() {
      let output = ''
      let complete = 0
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        if (frame >= item.end) {
          complete++
          output += item.to
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = randomChar()
          }
          output += `<span class="scramble-char">${item.char}</span>`
        }
      }
      el.innerHTML = output
      if (complete === queue.length) {
        cancelAnimationFrame(frameRequest)
      } else {
        frame++
        frameRequest = requestAnimationFrame(update)
      }
    }

    const timer = setTimeout(update, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frameRequest)
    }
  }, [text, delay])

  return <h3 ref={ref} className={className}>_</h3>
}