import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createChatSession } from '../services/gemini'
import {
  startChatSession,
  appendChatMessage,
  fetchChatSessions,
  fetchChatMessages,
  deleteChatSession,
} from '../services/supabase'
import CharacterCanvas from '../components/character/CharacterCanvas'
import { DEFAULT_CHARACTER } from '../components/character/characterAssets'
import './Chat.css'

const INITIAL_AI_TEXT = "Hey! I'm here whenever you want to talk. What's on your mind?"

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

  // ── Gemini session ────────────────────────────────────────────────────────
  const sessionRef = useRef(null)
  if (!sessionRef.current) {
    sessionRef.current = createChatSession(characterName)
  }

  // ── Chat messages ─────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([{ role: 'ai', text: INITIAL_AI_TEXT }])
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const scrollRef = useRef(null)

  // ── Supabase session tracking ─────────────────────────────────────────────
  const [sessionId,  setSessionId]  = useState(null)

  // ── History panel ─────────────────────────────────────────────────────────
  const [historyOpen,     setHistoryOpen]     = useState(false)
  const [sessions,        setSessions]        = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [deletingId,      setDeletingId]      = useState(null)   // optimistic delete

  // ── On mount: create a new DB session and save the greeting ───────────────
  useEffect(() => {
    startChatSession(characterName)
      .then(id => {
        setSessionId(id)
        return appendChatMessage(id, 'ai', INITIAL_AI_TEXT)
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
  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

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
        : [{ role: 'ai', text: INITIAL_AI_TEXT }]

      setMessages(uiMessages)
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
          <div className="chat-avatar" aria-hidden="true">
            <div className="chat-avatar__canvas-wrapper">
              <CharacterCanvas
                selections={character}
                skinTone={character.skinTone}
                browColor={character.browColor}
                eyeColor={character.eyeColor}
                lipColor={character.lipColor}
                hairColor={character.hairColor}
              />
            </div>
          </div>
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

      {/* ── Input bar ────────────────────────────────────────────────────── */}
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
            placeholder={`Message ${characterName}…`}
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
