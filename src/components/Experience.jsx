import { experience } from '../data/content'

export default function Experience() {
  return (
    <section id="experience" className="section section-paper">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow" style={{ color: '#8a6522' }}>
            Experience
          </span>
          <h2 className="section-title" style={{ marginTop: '12px', color: '#0e1420' }}>
            Where I've worked
          </h2>
        </div>
        <div className="timeline">
          {experience.map((job) => (
            <div className="timeline-item" key={job.company + job.period}>
              <span className="timeline-period">{job.period}</span>
              <h3 className="timeline-role" style={{ color: '#0e1420' }}>
                {job.role}
              </h3>
              <div className="timeline-company" style={{ color: '#5c6270' }}>
                {job.company}
              </div>
              <ul style={{ color: '#3a3f47' }}>
                {job.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
