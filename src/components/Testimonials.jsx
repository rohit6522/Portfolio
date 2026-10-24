
import { motion, useReducedMotion } from 'framer-motion'
import { testimonials } from '../data/content'
import IconBadge from './IconBadge'

// '[' se shuru hone wali placeholder lines hide ho jati hain
const isFilled = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('[')
const isLink = (v) => typeof v === 'string' && /^https?:\/\//i.test(v)

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
      <path d="M7.2 6C4.9 6 3 7.9 3 10.2V18h6.6v-6.6H6.2c0-1.5 1.1-2.7 2.6-2.7V6H7.2Zm9 0c-2.3 0-4.2 1.9-4.2 4.2V18h6.6v-6.6h-3.4c0-1.5 1.1-2.7 2.6-2.7V6h-1.6Z" />
    </svg>
  )
}

export default function Testimonials() {
  const reduce = useReducedMotion()
  const items = (testimonials || []).filter((t) => isFilled(t?.quote) && isFilled(t?.name))

  // Koi asli entry nahi to poora section render hi nahi hota
  if (items.length === 0) return null

  return (
    <section id="testimonials" className="section section-dark" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="section-head-row">
          <IconBadge>
            <QuoteIcon />
          </IconBadge>
          <div>
            <span className="eyebrow">Testimonials</span>
            <h2 id="testimonials-title" className="section-title" style={{ marginTop: '4px' }}>
              What people say
            </h2>
          </div>
        </div>

        <div className={`testimonials-grid ${items.length === 1 ? 'is-single' : ''}`}>
          {items.map((t, i) => (
            <motion.figure
              className="testimonial-card"
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: reduce ? 0 : Math.min(i, 5) * 0.08, ease: 'easeOut' }}
            >
              <span className="testimonial-quote-icon">
                <QuoteIcon />
              </span>

              <blockquote className="testimonial-quote">{t.quote}</blockquote>

              <figcaption className="testimonial-person">
                <span className="testimonial-avatar" aria-hidden="true">
                  {initials(t.name)}
                </span>
                <span>
                  <span className="testimonial-name">
                    {isLink(t.link) ? (
                      <a href={t.link} target="_blank" rel="noopener noreferrer">
                        {t.name}
                      </a>
                    ) : (
                      t.name
                    )}
                  </span>
                  {isFilled(t.role) && <span className="testimonial-role">{t.role}</span>}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}