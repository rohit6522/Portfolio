import { useEffect, useState } from 'react'
import { profile } from '../data/content'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [fading, setFading] = useState(false)
  const [typed, setTyped] = useState('')

  const name = profile.name.split(' ')[0].toUpperCase()

  useEffect(() => {
    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTyped(name.slice(0, i))
      if (i >= name.length) {
        clearInterval(typeInterval)
      }
    }, 140)

    const fadeTimer = setTimeout(() => setFading(true), name.length * 140 + 500)
    const hideTimer = setTimeout(() => setHidden(true), name.length * 140 + 1000)

    return () => {
      clearInterval(typeInterval)
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [name])

  if (hidden) return null

  return (
    <div className={`loader-screen ${fading ? 'loader-fade' : ''}`}>
      <div className="loader-inner">
        <div className="loader-big-name">
          {typed.split('').map((char, i) => (
            <span key={i} className="loader-letter">
              {char}
            </span>
          ))}
          <span className="loader-type-cursor" />
        </div>
      </div>
    </div>
  )
}