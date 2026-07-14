import { useState } from 'react'
import { skills, education, certifications, experience } from '../data/content'
import useReveal from '../hooks/useReveal'

const tabs = [
  { key: 'skills', label: 'Skills', icon: '</>' },
  { key: 'education', label: 'Education', icon: '📘' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'certifications', label: 'Certifications', icon: '🏆' },
]

function handleCardGlow(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

export default function SkillsTabs() {
  const [active, setActive] = useState('skills')
  const [ref, visible] = useReveal()

  return (
    <section
      id="skills"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >


      <div className="container">
        <div className="tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${active === tab.key ? 'active' : ''}`}
              onClick={() => setActive(tab.key)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

       {active === 'skills' && (
          <div className="skills-grid tab-panel">
            {skills.map((group) => (
              <div className="skill-card" key={group.category} onMouseMove={handleCardGlow}>
                <span className="card-glow" />
                <div className="skill-card-inner">
                  <h3>{group.category}</h3>
                  <div className="skill-tags">
                    {group.items.map((item) => (
                      <span className="skill-tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === 'education' && (
          <div className="edu-timeline tab-panel">

            {education.map((e) => (
              <div className="edu-item" key={e.school}>
                <span className="edu-check" />
                <h3 className="edu-degree">{e.school}</h3>
                <div className="edu-meta">
                  {e.period} — {e.degree}
                </div>
                <p className="edu-desc">{e.description}</p>
              </div>
            ))}
          </div>
        )}

        {active === 'experience' && (
          <div className="coming-soon tab-panel">
            <span className="coming-soon-icon">🚧</span>
            <h3>Experience — Coming Soon</h3>
            <p>
              I'm just getting started and haven't taken on a professional role yet.
              This section will fill up soon — check back later!
            </p>
          </div>
        )}

        {active === 'certifications' && (
          <div className="cert-grid tab-panel">


            {certifications.map((c) => (
              <div className="blueprint-card cert-card" key={c.title}>
                <div className="cert-top">
                  <span className="cert-icon">🏆</span>
                  <span className="cert-date">{c.date}</span>
                </div>
                <h3 className="cert-title">{c.title}</h3>
                <div className="cert-issuer">{c.issuer}</div>
                <a className="cert-link" href={c.credentialUrl} target="_blank" rel="noreferrer">
                  View credential →
                </a>
              </div>
            ))}
          </div>
        )}



      </div>
    </section>
  )
}