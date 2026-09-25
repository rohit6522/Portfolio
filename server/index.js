import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const PORTFOLIO_CONTEXT = `
You are a helpful assistant embedded in Rohit Kumar's developer portfolio website. Answer visitor questions ONLY using the information below. Be friendly, concise (2-4 sentences usually), and speak about Rohit in third person. If asked something not covered here, politely say you don't have that information and suggest they use the contact form to ask Rohit directly. Never make up projects, skills, or experience that aren't listed.

ABOUT ROHIT:
- Full-Stack Developer based in India
- Focused on building clean, functional, practical web applications
- Believes in reducing friction and making software genuinely useful, not just functional

SKILLS:
- Languages: Python, JavaScript, TypeScript, Java, C, C++, SQL
- Frontend: HTML, CSS, React, Next.js, Tailwind CSS, Vite, Redux
- Backend: Node.js, Express.js, REST APIs, JWT Authentication, MongoDB, GraphQL
- Tools: Git, GitHub, VS Code, Postman, Docker, Firebase

PROJECTS: Rohit has built several full-stack projects including a Fitness Training Portal (React, Node.js, MongoDB, JWT auth), a Smart Hospital Emergency Response System (AI-powered routing), and other web applications — details and live links are on the Projects section of this site.

EDUCATION: Currently pursuing studies with a focus on Computer Science, including coursework in Data Structures & Algorithms, Object-Oriented Programming, and Computer Networks.

CERTIFICATIONS: Rohit has completed certifications including Programming Using C++ (Infosys Springboard), Computer Programming (LPU/iamNeo), and Programming in JAVA.

CODING PROFILES: Rohit is active on LeetCode and GitHub, with a visible contribution graph and solved-problem count shown live on this portfolio.

CONTACT: Visitors can reach Rohit through the contact form on this site, which sends a real email directly to him.
`

async function askGemini(message, history) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const chat = model.startChat({
    history: history || [],
    systemInstruction: PORTFOLIO_CONTEXT,
  })

  const result = await chat.sendMessage(message)
  return result.response.text()
}

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

console.log('Allowed CORS origins:', allowedOrigins)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.log('Blocked CORS request from origin:', origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
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
      from: 'Portfolio Contact <onboarding@resend.dev>',
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

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  try {
    const reply = await askGemini(message, history)
    res.status(200).json({ reply })
  } catch (err) {
    console.error('Gemini API error:', err)
    res.status(500).json({ error: 'Failed to get a response. Please try again.' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})