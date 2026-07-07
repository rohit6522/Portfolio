export default function AnimatedBackground() {
  const particles = Array.from({ length: 14 })

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-grid-pan" />
      {particles.map((_, i) => (
        <span key={i} className={`bg-particle bg-particle-${i % 7}`} />
      ))}
    </div>
  )
}