import { profile, stackNodes } from '../data/content'

function StackDiagram() {
  const cx = 260
  const cy = 260
  const radius = 190
  const count = stackNodes.length

  const points = stackNodes.map((label, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return { label, x, y }
  })

  return (
    <svg
      className="hero-diagram"
      viewBox="0 0 520 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram connecting the developer to their core tech stack"
    >
      {/* connecting lines */}
      {points.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="#b98b3d"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      ))}

      {/* outer ring, faint */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#b98b3d"
        strokeOpacity="0.15"
      />

      {/* stack nodes */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="30" fill="#141b2b" stroke="#b98b3d" strokeWidth="1.5" />
          <text
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            className="node-label"
            style={{ fontSize: p.label.length > 8 ? 9.5 : 11 }}
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* center node: you */}
      <circle cx={cx} cy={cy} r="52" fill="#d4a656" />
      <text x={cx} y={cy - 4} textAnchor="middle" className="node-center-label" style={{ fontSize: 14 }}>
        {profile.name.split(' ')[0]}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#0e1420' }}
      >
        {profile.role.toUpperCase()}
      </text>
    </svg>
  )
}

export default function Hero() {
  return (
    <section id="top" className="hero grid-bg">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">{profile.location}</span>
          <h1 className="hero-name">
            {profile.name}
            <br />
            {profile.role}
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="#projects">
              View projects
            </a>
            <a className="btn" href={profile.resumeUrl} download>
              Download resume
            </a>

          </div>
        </div>
        <div>
          <StackDiagram />
        </div>
      </div>
    </section>
  )
}
