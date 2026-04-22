import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createChatSession } from '../services/ai'
import {
  startChatSession,
  appendChatMessage,
  fetchChatSessions,
  fetchChatMessages,
  deleteChatSession,
} from '../services/supabase'
import { DEFAULT_CHARACTER } from '../components/character/characterAssets'
import { CharacterAvatar } from '../components/ui/GlobalHeader'
import './Chat.css'

const STARTERS = [
  "How am I doing with my goals?",
  "I want to reflect on something",
  "I'm feeling overwhelmed",
  "I need some encouragement",
  "I want to think through a decision",
  "Something's been on my mind",
  "I'm not sure how I'm feeling",
  "I had a really good day",
]

function pickStarters() {
  const shuffled = [...STARTERS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

function buildGreeting(goals) {
  const hour = new Date().getHours()
  const active = goals.filter(g => g.status === 'active')
  const timeLabel = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  const pool = active.length > 0 ? [
    `Hey! How are you feeling about everything going on with your goals lately?`,
    `Hey — good to see you. How are things feeling today?`,
    `Hi! How's your ${timeLabel} going so far?`,
    `Hey. What's on your mind today?`,
  ] : [
    `Hey! Good ${timeLabel}. What's on your mind?`,
    `Hi! I'm here whenever you want to talk. How are you doing?`,
    `Hey — what's going on for you today?`,
    `Hey! How are you feeling right now?`,
  ]

  return pool[Math.floor(Math.random() * pool.length)]
}

function loadUserContext() {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    const survey = JSON.parse(localStorage.getItem('trumi_survey') ?? '{}')
    const goalTitles = goals.filter(g => g.status === 'active').map(g => g.title)
    const values = survey.top3 ?? survey.top10?.slice(0, 5) ?? []
    return { goals: goalTitles, values }
  } catch {
    return null
  }
}

function loadGoalsForGreeting() {
  try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
}

function MessageText({ text }) {
  const paragraphs = text.split(/\n\n+/)
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={`chat-bubble__text${i > 0 ? ' chat-bubble__text--mt' : ''}`}>
          {para.split('\n').map((line, j, arr) => (
            <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
          ))}
        </p>
      ))}
    </>
  )
}

function formatRelativeDate(isoString) {
  const date   = new Date(isoString)
  const now    = new Date()
  const diffMs = now - date
  const mins   = Math.floor(diffMs / 60_000)
  const hours  = Math.floor(diffMs / 3_600_000)
  const days   = Math.floor(diffMs / 86_400_000)

  if (mins  <  1) return 'Just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  ===1) return 'Yesterday'
  if (days  <  7) return `${days} days ago`
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export default function Chat() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const characterName = location.state?.name?.trim() || 'Your Tru-mi'
  const character     = location.state?.character ?? DEFAULT_CHARACTER

  // ── User context + greeting (computed once on mount) ─────────────────────
  const userContextRef  = useRef(loadUserContext())
  const initialGreeting = useRef(buildGreeting(loadGoalsForGreeting()))
  const startersRef     = useRef(pickStarters())

  // ── Chat session ──────────────────────────────────────────────────────────
  const sessionRef = useRef(null)
  if (!sessionRef.current) {
    sessionRef.current = createChatSession(characterName, [], userContextRef.current)
  }

  // ── Chat messages ─────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([{ role: 'ai', text: initialGreeting.current }])
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [showStarters, setShowStarters] = useState(true)
  const scrollRef = useRef(null)

  // ── Voice recording ───────────────────────────────────────────────────────
  const [isRecording,    setIsRecording]    = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef   = useRef([])

  // ── Supabase session tracking ─────────────────────────────────────────────
  const [sessionId,  setSessionId]  = useState(null)

  // ── History panel ─────────────────────────────────────────────────────────
  const [historyOpen,     setHistoryOpen]     = useState(false)
  const [sessions,        setSessions]        = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [deletingId,      setDeletingId]      = useState(null)

  // ── On mount: create a new DB session and save the greeting ───────────────
  useEffect(() => {
    startChatSession(characterName)
      .then(id => {
        setSessionId(id)
        return appendChatMessage(id, 'ai', initialGreeting.current)
      })
      .catch(err => console.warn('[Chat] Could not start session:', err))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // ── Persist a message (fire-and-forget — never blocks the UI) ────────────
  function persist(role, text) {
    if (!sessionId) return
    appendChatMessage(sessionId, role, text)
      .catch(err => console.warn('[Chat] Could not save message:', err))
  }

  // ── Send a message ────────────────────────────────────────────────────────
  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text || sending) return

    setShowStarters(false)
    setMessages(prev => [...prev, { role: 'user', text }])
    persist('user', text)
    setInput('')
    setSending(true)

    try {
      const reply = await sessionRef.current.sendMessage(text)
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
      persist('ai', reply)
    } catch (err) {
      console.error('[Gemini]', err)
      const fallback = "I'm having a little trouble connecting right now — try again in a moment."
      setMessages(prev => [...prev, { role: 'ai', text: fallback }])
      persist('ai', fallback)
    } finally {
      setSending(false)
    }
  }

  // ── Voice recording helpers ───────────────────────────────────────────────
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      audioChunksRef.current   = []

      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob   = new Blob(audioChunksRef.current, { type: mimeType })
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result.split(',')[1])
          reader.onerror   = reject
          reader.readAsDataURL(blob)
        })

        setIsTranscribing(true)
        try {
          const res = await fetch('/api/transcribe', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ audio: base64, mimeType }),
          })
          const { text } = await res.json()
          if (text?.trim()) {
            setInput(prev => prev ? `${prev} ${text.trim()}` : text.trim())
          }
        } catch (err) {
          console.error('[Transcribe]', err)
        } finally {
          setIsTranscribing(false)
        }
      }

      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('[Mic] Permission denied or unavailable:', err)
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  function handleMicToggle() {
    if (isRecording) stopRecording()
    else startRecording()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Open history panel ────────────────────────────────────────────────────
  async function openHistory() {
    setHistoryOpen(true)
    setSessionsLoading(true)
    try {
      const data = await fetchChatSessions()
      setSessions(data)
    } catch (err) {
      console.warn('[Chat] Could not load sessions:', err)
    } finally {
      setSessionsLoading(false)
    }
  }

  // ── Load a past session ───────────────────────────────────────────────────
  async function loadSession(session) {
    setHistoryOpen(false)
    try {
      const msgs = await fetchChatMessages(session.id)

      // Map DB rows → UI format
      const uiMessages = msgs.length > 0
        ? msgs.map(m => ({ role: m.role, text: m.content }))
        : [{ role: 'ai', text: initialGreeting.current }]

      setMessages(uiMessages)
      setShowStarters(false)
      setSessionId(session.id)

      // Rebuild Gemini context from the last 20 messages so the AI remembers
      const context = msgs.slice(-20)
      const history = context.map(m => ({
        role:  m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))
      sessionRef.current = createChatSession(session.character_name, history)
    } catch (err) {
      console.warn('[Chat] Could not load session:', err)
    }
  }

  // ── Delete a session ──────────────────────────────────────────────────────
  async function handleDeleteSession(e, id) {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await deleteChatSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.warn('[Chat] Could not delete session:', err)
    } finally {
      setDeletingId(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="chat-page">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="chat-header">
        <div className="chat-header__left">
          <CharacterAvatar character={character} />
          <span className="chat-header__name">{characterName}</span>
        </div>

        <div className="chat-header__actions">
          {/* History button */}
          <button
            className="chat-header__icon-btn"
            onClick={openHistory}
            aria-label="Chat history"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
          </button>

          {/* Close button */}
          <button
            className="chat-header__icon-btn"
            onClick={() => navigate('/character')}
            aria-label="Close chat"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Message list ─────────────────────────────────────────────────── */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-row chat-bubble-row--${msg.role}`}>
            <div className={`chat-bubble chat-bubble--${msg.role}`}>
              <MessageText text={msg.text} />
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

        {/* Conversation starters — shown until first user message */}
        {showStarters && !sending && (
          <div className="chat-starters">
            {startersRef.current.map(starter => (
              <button
                key={starter}
                className="chat-starter-chip"
                onClick={() => handleSend(starter)}
              >
                {starter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div className="chat-input-area">
        <div className="chat-input-bar">
          <textarea
            className="chat-input-bar__field"
            rows={1}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              // Auto-grow: reset height first so shrinking works
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight}px`
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${characterName}…`}
            aria-label="Type a message"
            disabled={sending}
          />

          {/* Smart right button: send when text present, mic otherwise */}
          {input.trim() && !isRecording ? (
            <button
              className="chat-input-bar__icon-btn"
              aria-label="Send message"
              onClick={() => handleSend()}
              disabled={sending}
            >
              {/* Send arrow */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          ) : (
            <button
              className={`chat-input-bar__icon-btn${isRecording ? ' chat-input-bar__icon-btn--recording' : ''}`}
              aria-label={isRecording ? 'Stop recording' : 'Voice input'}
              onClick={handleMicToggle}
              disabled={sending || isTranscribing}
            >
              {isTranscribing ? (
                <div className="chat-mic-spinner" aria-hidden="true" />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <path d="M19 10a7 7 0 0 1-14 0" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── History panel ────────────────────────────────────────────────── */}

      {/* Backdrop — click to dismiss */}
      <div
        className={`chat-history-backdrop${historyOpen ? ' chat-history-backdrop--open' : ''}`}
        onClick={() => setHistoryOpen(false)}
        aria-hidden="true"
      />

      {/* Sliding panel */}
      <aside
        className={`chat-history-panel${historyOpen ? ' chat-history-panel--open' : ''}`}
        aria-label="Chat history"
      >
        <div className="chat-history-panel__header">
          <h2 className="chat-history-panel__title">Chat History</h2>
          <button
            className="chat-history-panel__close"
            onClick={() => setHistoryOpen(false)}
            aria-label="Close history"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="chat-history-panel__body">
          {sessionsLoading && (
            <div className="chat-history-panel__loading">
              <div className="chat-history-panel__spinner" aria-hidden="true" />
              <p>Loading your chats…</p>
            </div>
          )}

          {!sessionsLoading && sessions.length === 0 && (
            <p className="chat-history-panel__empty">
              No saved chats yet. Start a conversation and it will appear here.
            </p>
          )}

          {!sessionsLoading && sessions.length > 0 && (
            <ul className="chat-history-list">
              {sessions.map(session => (
                <li
                  key={session.id}
                  className={`chat-history-item${deletingId === session.id ? ' chat-history-item--deleting' : ''}`}
                >
                  <button
                    className="chat-history-item__main"
                    onClick={() => loadSession(session)}
                  >
                    <div className="chat-history-item__meta">
                      <span className="chat-history-item__name">{session.character_name}</span>
                      <span className="chat-history-item__date">{formatRelativeDate(session.last_message_at)}</span>
                    </div>
                    {session.preview && (
                      <p className="chat-history-item__preview">{session.preview}</p>
                    )}
                  </button>

                  <button
                    className="chat-history-item__delete"
                    onClick={e => handleDeleteSession(e, session.id)}
                    disabled={deletingId === session.id}
                    aria-label="Delete this chat"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

    </div>
  )
}
