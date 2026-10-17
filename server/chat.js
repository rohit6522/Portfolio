import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'
import rateLimit from 'express-rate-limit'
import * as kb from './knowledge.js'

const router = Router()

// Ek IP se 1 minute mein max 8 messages (zaroorat ho to number badal lo)
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a minute and try again.' },
})

// Client lazily banta hai, kyunki .env ESM imports ke baad load hota hai
let client = null
function getClient() {
  if (!client && process.env.GEMINI_API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }
  return client
}

function buildSystemPrompt() {
  const faq = kb.personalFaq
    .filter((item) => !item.a.trim().startsWith('['))
    .map((item) => `Q: ${item.q}\nA: ${item.a}`)
    .join('\n\n')

  return `You are ${kb.botName}, a chat assistant on Rohit Kumar's portfolio website.

RULES:
${kb.rules}

ABOUT ROHIT:
${kb.about}

SKILLS:
${kb.skills}

PROJECTS:
${kb.projects}

EDUCATION:
${kb.education}

CERTIFICATIONS:
${kb.certifications}

CODING PROFILES:
${kb.codingProfiles}

CONTACT:
${kb.contact}

PERSONAL FAQ (when a visitor asks something similar to one of these questions, answer with the given answer. You may rephrase lightly, but keep the facts exactly as written):
${faq || '(none yet)'}`
}

const SYSTEM_PROMPT = buildSystemPrompt()

function findHardcodedReply(message) {
  const text = message.toLowerCase()
  const match = kb.hardcodedReplies.find((r) =>
    r.keywords.some((k) => text.includes(k.toLowerCase()))
  )
  return match ? match.answer : null
}

router.post('/', async (req, res) => {
  const { message, history } = req.body || {}

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' })
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  const fixed = findHardcodedReply(message)
  if (fixed) {
    return res.status(200).json({ reply: fixed })
  }

  const ai = getClient()
  if (!ai) {
    return res.status(503).json({ error: 'The chatbot is not configured yet.' })
  }

  // Gemini ko conversation 'user' turn se shuru chahiye (greeting 'model' hota hai, isliye drop)
  const past = (Array.isArray(history) ? history : [])
    .filter(
      (m) =>
        (m?.role === 'user' || m?.role === 'model') &&
        typeof m?.parts?.[0]?.text === 'string'
    )
    .slice(-10)
  while (past.length && past[0].role !== 'user') past.shift()

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      contents: [...past, { role: 'user', parts: [{ text: message }] }],
      config: { systemInstruction: SYSTEM_PROMPT },
    })

    const reply = response.text?.trim()
    res.status(200).json({
      reply:
        reply ||
        "Sorry, I couldn't come up with an answer. Please try rephrasing, or use the contact form.",
    })
  } catch (err) {
    console.error('Gemini API error:', err?.message || err)
    if (err?.status === 429) {
      return res
        .status(429)
        .json({ error: "The assistant is busy right now. Please try again in a bit." })
    }
    res.status(500).json({ error: 'Failed to get a response. Please try again.' })
  }
})

export default router