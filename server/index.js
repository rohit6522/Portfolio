
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing from environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const PORTFOLIO_CONTEXT = `
You are a helpful assistant embedded in Rohit Kumar's developer portfolio website. Answer visitor questions only using the information below. Be friendly, concise, usually 2-4 sentences, and speak about Rohit in third person. If asked something not covered here, politely say you don't have that information and suggest using the contact form. Never invent projects, skills, or experience.

ABOUT ROHIT:
- Full-Stack Developer based in India
- Focused on building clean, functional, practical web applications
- Believes in reducing friction and making software genuinely useful

SKILLS:
- Languages: Python, JavaScript, TypeScript, Java, C, C++, SQL
- Frontend: HTML, CSS, React, Next.js, Tailwind CSS, Vite, Redux
- Backend: Node.js, Express.js, REST APIs, JWT Authentication, MongoDB, GraphQL
- Tools: Git, GitHub, VS Code, Postman, Docker, Firebase

PROJECTS:
- Fitness Training Portal using React, Node.js, MongoDB, and JWT authentication
- Smart Hospital Emergency Response System with AI-powered routing
- Other web applications listed in the Projects section of the portfolio

EDUCATION:
- Studying Computer Science, including Data Structures and Algorithms, Object-Oriented Programming, and Computer Networks

CERTIFICATIONS:
- Programming Using C++ (Infosys Springboard)
- Computer Programming (LPU/iamNeo)
- Programming in JAVA

CODING PROFILES:
- Active on LeetCode and GitHub
- Contribution graph and solved-problem count are displayed on the portfolio

CONTACT:
- Visitors can contact Rohit using the website contact form.
`

async function askGemini(message, history = []) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    systemInstruction: PORTFOLIO_CONTEXT,
  })

  const normalizedHistory = Array.isArray(history)
    ? history
        .filter(
          (item) =>
            item &&
            (item.role === 'user' || item.role === 'model') &&
            Array.isArray(item.parts)
        )
        .map((item) => ({
          role: item.role,
          parts: item.parts
            .filter(
              (part) =>
                part &&
                typeof part.text === 'string' &&
                part.text.trim().length > 0
            )
            .map((part) => ({ text: part.text })),
        }))
        .filter((item) => item.parts.length > 0)
    : []

  const validHistory = []

  for (const item of normalizedHistory) {
    if (validHistory.length === 0) {
      if (item.role === 'user') {
        validHistory.push(item)
      }
      continue
    }

    const previous = validHistory[validHistory.length - 1]

    if (item.role !== previous.role) {
      validHistory.push(item)
    }
  }

  while (
    validHistory.length > 0 &&
    validHistory[validHistory.length - 1].role === 'user'
  ) {
    validHistory.pop()
  }

  const chat = model.startChat({
    history: validHistory,
  })

  const result = await chat.sendMessage(message.trim())

  return result.response.text()
}

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

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'Message is required.',
    })
  }

  if (message.length > 500) {
    return res.status(400).json({
      error: 'Message is too long.',
    })
  }

  if (
    history !== undefined &&
    (!Array.isArray(history) || history.length > 30)
  ) {
    return res.status(400).json({
      error: 'Invalid chat history.',
    })
  }

  try {
    const reply = await askGemini(message, history)

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Gemini API error:', err)

    return res.status(500).json({
      error: 'Failed to get a response. Please try again.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
