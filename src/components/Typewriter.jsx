import { useEffect, useState } from 'react'

export default function Typewriter({ phrases, typingSpeed = 65, deletingSpeed = 35, pauseDuration = 1800 }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(phrases[0])
      return
    }

    const currentPhrase = phrases[phraseIndex]
    let timeout

    if (!isDeleting && displayed.length < currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentPhrase.slice(0, displayed.length + 1))
      }, typingSpeed)
    } else if (!isDeleting && displayed.length === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentPhrase.slice(0, displayed.length - 1))
      }, deletingSpeed)
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      }, 300)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className="typewriter-text" role="text" aria-label={phrases[phraseIndex]}>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  )
}