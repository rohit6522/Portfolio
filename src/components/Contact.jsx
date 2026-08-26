import { useState } from 'react'
import { profile } from '../data/content'
import useReveal from '../hooks/useReveal'
import IconBadge from './IconBadge'
import MagneticText from './MagneticText'
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
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

function ClockIconSmall() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

export default function Contact() {
  const [ref, visible] = useReveal()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
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
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch (err) {
      setErrorMsg('Could not reach the server. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className={`section section-dark reveal ${visible ? 'reveal-visible' : ''}`}
    >
      <div className="container">
        <div className="contact-v3-head">
          <IconBadge size={36}>
            <MailIconSmall />
          </IconBadge>
          <h2 className="contact-v3-title">
            <MagneticText> 

            Get In Touch
            </MagneticText>
            
            </h2>
        </div>
        <p className="contact-v3-sub">Let's discuss your next project or just say hello!</p>

        <div className="contact-v3-grid">
          <div className="contact-v3-info">
            <h3>Let's Connect</h3>
            <p>
              I'm always open to discussing new opportunities, interesting projects, or just
              having a chat about technology and development.
            </p>

            <div className="contact-v3-item">
              <span className="contact-v3-icon-circle">
                <MailIconSmall />
              </span>
              <div>
                <span className="contact-v3-item-label">Email</span>
                <span className="contact-v3-item-value">{profile.email}</span>
              </div>
            </div>

            <div className="contact-v3-item">
              <span className="contact-v3-icon-circle">
                <PinIcon />
              </span>
              <div>
                <span className="contact-v3-item-label">Location</span>
                <span className="contact-v3-item-value">{profile.location.replace('Based in ', '')}</span>
              </div>
            </div>

            <div className="contact-v3-item">
              <span className="contact-v3-icon-circle">
                <ClockIconSmall />
              </span>
              <div>
                <span className="contact-v3-item-label">Response Time</span>
                <span className="contact-v3-item-value">Within 24 hours</span>
              </div>
            </div>
          </div>

          <form className="contact-v3-form" onSubmit={handleSubmit}>
            <div className="form-row-v3">
              <div className="form-field-v3">
                <label>First Name <span className="required-star">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Your first name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field-v3">
                <label>Last Name <span className="required-star">*</span></label>
                <input
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
              <label>Email <span className="required-star">*</span></label>
              <input
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
              <select name="subject" value={form.subject} onChange={handleChange} required>
                <option value="" disabled>
                  Select a subject
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-v3">
              <label>Message <span className="required-star">*</span></label>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell me about your project or how I can help you..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <p className="form-tip">💡 Write a meaningful message with at least 3 words and 10 characters.</p>

            {status === 'error' && <p className="form-status form-status-error">{errorMsg}</p>}
            {status === 'success' && (
              <p className="form-status form-status-success">
                ✓ Message sent successfully! I'll get back to you soon.
              </p>
            )}

            <button type="submit" className="send-message-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}