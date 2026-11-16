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

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim()
}

function isGreeting(message) {
  return kb.greetings.triggers.includes(normalize(message))
}

function findHardcodedReply(message) {
  const text = message.toLowerCase()
  const match = kb.hardcodedReplies.find((r) =>
    r.keywords.some((k) => text.includes(k.toLowerCase()))
  )
  return match ? match.answer : null
}

// In-memory cache for standalone common questions (TTL: 1 hour)
const cache = new Map()
const CACHE_TTL_MS = 60 * 60 * 1000

// Pre-warm cache for the portfolio suggestion chips for instantaneous (0ms) replies
const PREWARMED_FAQ = [
  {
    q: "what are rohits skills",
    reply:
      "Rohit is proficient in Python, JavaScript, TypeScript, Java, and C++. On the frontend, he builds with React, Next.js, and Tailwind CSS. For backend and databases, he works with Node.js, Express.js, Spring Boot, MySQL, and MongoDB.",
  },
  {
    q: "tell me about his projects",
    reply:
      "Rohit has built several full-stack applications: 1) Fitness Training Portal (workout planning and tracking with React, Node.js, MongoDB), 2) Smart Hospital Emergency System (AI emergency routing with React, Spring Boot, MySQL), and 3) Smart Cart (budget-aware shopping platform with Next.js, Spring Boot, and Razorpay).",
  },
  {
    q: "what certifications does he have",
    reply:
      "Rohit has earned certifications in Programming Using C++ (Infosys Springboard), Computer Programming (LPU x iamNeo), Programming in JAVA (iamNeo), and completed the DSA Placement Bootcamp at LPU.",
  },
  {
    q: "how can i contact him",
    reply:
      "You can reach Rohit directly through the contact form in the 'Get in touch' section of this website. You can also connect with him via LinkedIn and GitHub from the links in the hero section.",
  },
]

for (const item of PREWARMED_FAQ) {
  cache.set(item.q, { reply: item.reply, timestamp: Date.now() })
}

function getCachedReply(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.reply
}

function setCachedReply(key, reply) {
  if (cache.size > 200) {
    const oldestKey = cache.keys().next().value
    cache.delete(oldestKey)
  }
  cache.set(key, { reply, timestamp: Date.now() })
}

// Priority list: GEMINI_MODEL (env) pehle, phir fastest low-latency models
function getModelChain() {
  return [
    ...new Set(
      [
        process.env.GEMINI_MODEL,
        'gemini-3.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3-flash-preview',
      ].filter(Boolean)
    ),
  ]
}

async function generateWithFallback(ai, contents) {
  let lastError
  for (const model of getModelChain()) {
    try {
      // 6 second timeout per model attempt to prevent long stalls
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 300,
          temperature: 0.7,
          abortSignal: controller.signal,
        },
      })
      clearTimeout(timeoutId)
      return response
    } catch (err) {
      lastError = err
      console.warn(`Gemini model "${model}" failed:`, err?.status || err?.message)
    }
  }
  throw lastError
}

router.post('/', async (req, res) => {
  const { message, history } = req.body || {}

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' })
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  if (isGreeting(message)) {
    return res.status(200).json({ reply: kb.greetings.reply })
  }

  const fixed = findHardcodedReply(message)
  if (fixed) {
    return res.status(200).json({ reply: fixed })
  }

  // Check cache for standalone queries (no prior conversation context)
  const normalizedMsg = normalize(message)
  const isStandalone = !Array.isArray(history) || history.length === 0
  if (isStandalone && normalizedMsg) {
    const cached = getCachedReply(normalizedMsg)
    if (cached) {
      return res.status(200).json({ reply: cached })
    }
  }

  const ai = getClient()
  if (!ai) {
    return res.status(503).json({ error: 'The chatbot is not configured yet.' })
  }

  // Gemini ko conversation 'user' turn se shuru chahiye (greeting 'model' hota hai, isliye drop)
  // Keep last 4 turns to minimize token processing latency while preserving conversation context
  const past = (Array.isArray(history) ? history : [])
    .filter(
      (m) =>
        (m?.role === 'user' || m?.role === 'model') &&
        typeof m?.parts?.[0]?.text === 'string'
    )
    .slice(-4)
  while (past.length && past[0].role !== 'user') past.shift()

  try {
    const response = await generateWithFallback(ai, [
      ...past,
      { role: 'user', parts: [{ text: message }] },
    ])

    const reply = response.text?.trim()
    const finalReply =
      reply ||
      "Sorry, I couldn't come up with an answer. Please try rephrasing, or use the contact form."

    if (isStandalone && normalizedMsg && reply) {
      setCachedReply(normalizedMsg, finalReply)
    }

    res.status(200).json({ reply: finalReply })
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