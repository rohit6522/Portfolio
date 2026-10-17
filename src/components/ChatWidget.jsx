import { useState, useRef, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const STORAGE_KEY = 'portfolio-chat-messages'

const GREETING = {
  role: 'model',
  text: "Hi! I'm Rohit's portfolio assistant. Ask me about his skills, projects, or experience.",
}

const SUGGESTIONS = [
  "What are Rohit's skills?",
  'Tell me about his projects',
  'What certifications does he have?',
  'How can I contact him?',
]

function loadMessages() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // storage unavailable or corrupted: start fresh
  }
  return [GREETING]
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // ignore storage errors
    }
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, open])

  useEffect(() => {
    // Mobile pe auto-focus nahi: keyboard poora panel dhak leta hai
    if (open && !loading && window.matchMedia('(pointer: fine)').matches) {
      inputRef.current?.focus()
    }
  }, [open, loading])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }))

    const withUser = [...messages, { role: 'user', text: trimmed }]
    setMessages(withUser)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages([
          ...withUser,
          { role: 'model', text: data.error || 'Something went wrong.', error: true },
        ])
      } else {
        setMessages([...withUser, { role: 'model', text: data.reply }])
      }
    } catch {
      setMessages([
        ...withUser,
        { role: 'model', text: "Couldn't reach the server. Please try again.", error: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function resetChat() {
    setMessages([GREETING])
    setInput('')
  }

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat with Rohit's assistant">
          <div className="chat-panel-header">
            <div className="chat-panel-title">
              <span className="chat-panel-dot" />
              Ask about Rohit
            </div>
            {messages.length > 1 && (
              <button
                type="button"
                className="chat-reset-btn"
                onClick={resetChat}
                aria-label="Start a new chat"
                title="New chat"
              >
                <ResetIcon />
              </button>
            )}
          </div>

          <div className="chat-messages" ref={scrollRef} aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} ${m.error ? 'chat-bubble-error' : ''}`}
              >
                {m.text}
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chat-chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="chat-bubble chat-bubble-bot chat-typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={500}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              →
            </button>
          </form>
        </div>
      )}
    </>
  )
}