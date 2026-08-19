import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import dotenv from 'dotenv'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim())

app.use(
  cors({
    origin: allowedOrigins,
  })
)
app.use(express.json())

const resend = new Resend(process.env.RESEND_API_KEY)

app.get('/', (req, res) => {
  res.send('Portfolio contact API is running.')
})

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' })
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <rohitworks.dev>', // swap once you verify your own domain
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${subject} — from ${firstName} ${lastName}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email send failed:', err)
    res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})