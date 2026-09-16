import { motion } from 'framer-motion'

export default function RollingText({ text }) {
  const letters = text.split('')

  return (
    <span className="rolling-text">
      {letters.map((char, i) => (
        <span className="rolling-text-mask" key={i}>
          <motion.span
            className="rolling-text-inner"
            variants={{
              rest: { y: '0%' },
              hover: { y: '-50%' },
            }}
            transition={{
              duration: 0.4,
              ease: [0.65, 0, 0.35, 1],
              delay: i * 0.025,
            }}
          >
            <span className="rolling-text-line">{char === ' ' ? '\u00A0' : char}</span>
            <span className="rolling-text-line">{char === ' ' ? '\u00A0' : char}</span>
          </motion.span>
        </span>
      ))}
    </span>
  )
}