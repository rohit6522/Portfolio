import { useState, useEffect, useRef } from 'react'
import { profile } from '../data/content'
import IconBadge from './IconBadge'
import MagneticText from './MagneticText'
import RollingText from './RollingText'
import { Reveal, RevealItem } from './Reveal'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const subjects = [
  'General Inquiry',
  'Job Opportunity',
  'Freelance Project',
  'Collaboration',
  'Just Saying Hello',
]

function MailIconSmall() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

function ClockIconSmall() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [subjectOpen, setSubjectOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setSubjectOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch {
      setErrorMsg('Could not reach the server. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section section-dark">
      <div className="container">
        <Reveal className="contact-v3-heading-reveal">
          <RevealItem>
            <div className="contact-v3-head">
              <IconBadge size={36}>
                <MailIconSmall />
              </IconBadge>

              <h2 className="contact-v3-title">
                <MagneticText>Get In Touch</MagneticText>
              </h2>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="contact-v3-sub">
              Let's discuss your next project or just say hello!
            </p>
          </RevealItem>
        </Reveal>

        <div className="contact-v3-grid">
          <Reveal className="contact-v3-info">
            <RevealItem>
              <h3>Let's Connect</h3>
            </RevealItem>

            <RevealItem>
              <p>
                I'm always open to discussing new opportunities, interesting
                projects, or just having a chat about technology and development.
              </p>
            </RevealItem>

            <RevealItem>
              <div className="contact-v3-item">
                <span className="contact-v3-icon-circle">
                  <MailIconSmall />
                </span>
                <div>
                  <span className="contact-v3-item-label">Email</span>
                  <span className="contact-v3-item-value">{profile.email}</span>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="contact-v3-item">
                <span className="contact-v3-icon-circle">
                  <PinIcon />
                </span>
                <div>
                  <span className="contact-v3-item-label">Location</span>
                  <span className="contact-v3-item-value">
                    {profile.location.replace('Based in ', '')}
                  </span>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="contact-v3-item">
                <span className="contact-v3-icon-circle">
                  <ClockIconSmall />
                </span>
                <div>
                  <span className="contact-v3-item-label">Response Time</span>
                  <span className="contact-v3-item-value">Within 24 hours</span>
                </div>
              </div>
            </RevealItem>
          </Reveal>

          <Reveal className="contact-v3-form">
            <RevealItem>
              <form onSubmit={handleSubmit}>
                <div className="form-row-v3">
                  <div className="form-field-v3">
                    <label htmlFor="contact-first-name">
                      First Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-first-name"
                      type="text"
                      name="firstName"
                      placeholder="Your first name"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field-v3">
                    <label htmlFor="contact-last-name">
                      Last Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-last-name"
                      type="text"
                      name="lastName"
                      placeholder="Your last name"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field-v3">
                  <label htmlFor="contact-email">
                    Email <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field-v3">
                  <label>Subject <span className="required-star">*</span></label>
                  <div className="custom-select" ref={selectRef}>
                    <button
                      type="button"
                      className="custom-select-trigger"
                      onClick={() => setSubjectOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={subjectOpen}
                    >
                      <span className={form.subject ? '' : 'custom-select-placeholder'}>
                        {form.subject || 'Select a subject'}
                      </span>
                      <svg
                        className={`custom-select-arrow ${subjectOpen ? 'open' : ''}`}
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {subjectOpen && (
                      <ul className="custom-select-menu" role="listbox">
                        {subjects.map((s) => (
                          <li
                            key={s}
                            role="option"
                            aria-selected={form.subject === s}
                            className={`custom-select-option ${form.subject === s ? 'selected' : ''}`}
                            onClick={() => {
                              setForm({ ...form, subject: s })
                              setSubjectOpen(false)
                            }}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}

                    <input type="hidden" name="subject" value={form.subject} required />
                  </div>
                </div>

                <div className="form-field-v3">
                  <label htmlFor="contact-message">
                    Message <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project or how I can help you..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className={`char-count ${form.message.length >= 10 ? 'char-count-ok' : ''
                      }`}
                  >
                    {form.message.length} characters
                  </span>
                </div>

                <p className="form-tip">
                  💡 Write a meaningful message with at least 3 words and 10
                  characters.
                </p>

                {status === 'error' && (
                  <p className="form-status form-status-error" role="alert">
                    {errorMsg}
                  </p>
                )}

                {status === 'success' && (
                  <p className="form-status form-status-success" role="status">
                    ✓ Message sent successfully! I'll get back to you soon.
                  </p>
                )}

                <motion.button
                  type="submit"
                  className="send-message-btn"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                  initial="rest"
                  whileHover={status !== 'sending' ? 'hover' : 'rest'}
                  animate="rest"
                >
                  {status === 'sending' ? (
                    'Sending...'
                  ) : (
                    <RollingText text="Send Message" />
                  )}
                </motion.button>
              </form>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  )
}