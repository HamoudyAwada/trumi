import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createChatSession } from '../services/gemini'
import './Chat.css'

const INITIAL_AI_MESSAGE = {
  role: 'ai',
  text: "Hey! I'm here whenever you want to talk. What's on your mind?",
}

export default function Chat() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const characterName = location.state?.name?.trim() || 'Your Tru-mi'

  // Create one Gemini session per page mount — ref keeps it stable across renders
  const sessionRef = useRef(null)
  if (!sessionRef.current) {
    sessionRef.current = createChatSession(characterName)
  }

  const [messages, setMessages] = useState([INITIAL_AI_MESSAGE])
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const scrollRef = useRef(null)

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setSending(true)

    try {
      const reply = await sessionRef.current.sendMessage(text)
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch (err) {
      console.error('[Gemini]', err)
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "I'm having a little trouble connecting right now — try again in a moment." },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-page">

      {/* ── Header ────────────────────────────────── */}
      <header className="chat-header">
        <div className="chat-header__left">
          <div className="chat-avatar" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20v-1a7 7 0 0 1 14 0v1" />
            </svg>
          </div>
          <span className="chat-header__name">{characterName}</span>
        </div>

        <button
          className="chat-header__collapse"
          onClick={() => navigate('/character')}
          aria-label="Close chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 3H3v6" />
            <path d="M15 21h6v-6" />
            <path d="M3 9l6-6" />
            <path d="M21 15l-6 6" />
          </svg>
        </button>
      </header>

      {/* ── Message list ──────────────────────────── */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-row chat-bubble-row--${msg.role}`}>
            <div className={`chat-bubble chat-bubble--${msg.role}`}>
              <p className="chat-bubble__text">{msg.text}</p>
            </div>
          </div>
        ))}

        {sending && (
          <div className="chat-bubble-row chat-bubble-row--ai">
            <div className="chat-bubble chat-bubble--ai chat-bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {/* ── Input bar ─────────────────────────────── */}
      <div className="chat-input-area">
        <div className="chat-input-bar">
          <button className="chat-input-bar__icon-btn" aria-label="Add attachment" disabled={sending}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>

          <input
            className="chat-input-bar__field"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message your Tru-mi…"
            aria-label="Type a message"
            disabled={sending}
          />

          <button
            className="chat-input-bar__icon-btn"
            aria-label="Send message"
            onClick={handleSend}
            disabled={sending || !input.trim()}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
              <path d="M19 10a7 7 0 0 1-14 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}
