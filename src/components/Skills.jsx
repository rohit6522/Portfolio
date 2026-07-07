import { skills } from '../data/content'

export default function Skills() {
  return (
    <section id="skills" className="section section-dark">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Skills</span>
          <h2 className="section-title" style={{ marginTop: '12px' }}>
            Tools of the trade
          </h2>
        </div>
        <div className="skills-grid">
          {skills.map((group) => (
            <div className="skill-card" key={group.category}>
              <h3>{group.category}</h3>
              <div className="skill-tags">
                {group.items.map((item) => (
                  <span className="skill-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
