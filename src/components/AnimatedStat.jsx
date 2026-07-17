import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

export default function AnimatedStat({ value }) {
  const match = value.match(/^(\d+)(.*)$/)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(match ? '0' + match[2] : value)

  useEffect(() => {
    if (!inView || !match) return
    const target = parseInt(match[1], 10)
    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate(v) {
        setDisplay(Math.floor(v) + match[2])
      },
    })
    return () => controls.stop()
  }, [inView])

  if (!match) {
    return <span ref={ref}>{value}</span>
  }

  return <span ref={ref}>{display}</span>
}