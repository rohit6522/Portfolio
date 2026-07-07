import { about } from '../data/content'
import useReveal from '../hooks/useReveal'

function EduBlock({ title, children }) {
  return (
    <div style={{ marginTop: '28px' }}>
      <span className="eyebrow" style={{ color: '#8a6522', marginBottom: '12px' }}>
        {title}
      </span>
      <div style={{ marginTop: '12px' }}>{children}</div>
    </div>
  )
}

export default function About() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="about"
      ref={ref}
      className={`section section-paper reveal ${visible ? 'reveal-visible' : ''}`}
    >

      <div className="container about-grid">
        <div className="about-text">
          <span className="eyebrow" style={{ color: '#8a6522' }}>
            About
          </span>
          <h2 className="section-title" style={{ margin: '12px 0 24px' }}>
            How I work
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="blueprint-card" style={{ borderColor: 'rgba(184,155,90,0.5)', alignSelf: 'start' }}>
          <div className="corner-br" style={{ top: 'auto', bottom: '-1px', left: '-1px', borderRight: 'none', borderTop: 'none' }} />
          <div className="corner-bl" style={{ top: '-1px', right: '-1px', left: 'auto', borderLeft: 'none', borderBottom: 'none' }} />
          <span className="eyebrow" style={{ color: '#8a6522', marginBottom: '20px' }}>
            At a glance
          </span>

          <div className="stat-row" style={{ flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {about.stats.map((s) => (
              <div className="stat-block" key={s.label} style={{ borderColor: '#b98b3d' }}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <EduBlock title="Education">
            {about.education.map((e) => (
              <div key={e.degree} style={{ marginBottom: '10px' }}>
                <div style={{ color: '#0e1420', fontWeight: 600, fontSize: '15px' }}>{e.degree}</div>
                <div style={{ color: '#5c6270', fontSize: '13px' }}>
                  {e.school} · {e.period}
                </div>
              </div>
            ))}
          </EduBlock>

          <EduBlock title="Certifications">
            {about.certifications.map((c) => (
              <div key={c.name} style={{ color: '#3a3f47', fontSize: '13.5px', marginBottom: '6px' }}>
                {c.name} <span style={{ color: '#8a97a8' }}>— {c.year}</span>
              </div>
            ))}
          </EduBlock>


        </div>
      </div>
    </section>
  )
}
