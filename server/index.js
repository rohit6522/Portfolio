
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import chatRouter from './chat.js'
import dotenv from 'dotenv'

dotenv.config()




const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

console.log('Allowed CORS origins:', allowedOrigins)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.log('Blocked CORS request from origin:', origin)
      return callback(new Error('Not allowed by CORS'))
    },
  })
)

app.use(express.json({ limit: '20kb' }))

const resend = new Resend(process.env.RESEND_API_KEY)

app.get('/', (req, res) => {
  res.send('Portfolio contact API is running.')
})

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body

  if (
    ![firstName, lastName, email, subject, message].every(
      (value) => typeof value === 'string' && value.trim()
    )
  ) {
    return res.status(400).json({
      error: 'All fields are required.',
    })
  }

  if (message.trim().length < 10) {
    return res.status(400).json({
      error: 'Message must be at least 10 characters.',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: 'Please provide a valid email address.',
    })
  }

  if (!process.env.RESEND_API_KEY || !process.env.RECEIVER_EMAIL) {
    console.error('Resend environment variables are missing')

    return res.status(500).json({
      error: 'Contact service is not configured.',
    })
  }

  try {
    const escapeHtml = (value) =>
      value.replace(
        /[&<>"']/g,
        (character) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[character]
      )

    const safeFirstName = escapeHtml(firstName.trim())
    const safeLastName = escapeHtml(lastName.trim())
    const safeEmail = escapeHtml(email.trim())
    const safeSubject = escapeHtml(subject.trim())
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>')

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.RECEIVER_EMAIL,
      replyTo: email.trim(),
      subject: `[Portfolio] ${subject.trim()} — from ${firstName.trim()} ${lastName.trim()}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    })

    if (error) {
      console.error('Email send failed:', error)

      return res.status(500).json({
        error: 'Failed to send message. Please try again later.',
      })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email send failed:', err)

    return res.status(500).json({
      error: 'Failed to send message. Please try again later.',
    })
  }
})


app.use('/api/chat', chatRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
