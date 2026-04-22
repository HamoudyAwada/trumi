import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import './LogEntry.css'

/* ── Emoji face SVGs — exact paths from Figma node 1034:11563 ── */

function FaceHappy() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#136F1F" d="M24 4.5C20.1433 4.5 16.3731 5.64366 13.1664 7.78634C9.95962 9.92903 7.46026 12.9745 5.98435 16.5377C4.50844 20.1008 4.12228 24.0216 4.87469 27.8043C5.6271 31.5869 7.48429 35.0615 10.2114 37.7886C12.9385 40.5157 16.4131 42.3729 20.1957 43.1253C23.9784 43.8777 27.8992 43.4916 31.4623 42.0156C35.0255 40.5397 38.071 38.0404 40.2137 34.8336C42.3563 31.6269 43.5 27.8567 43.5 24C43.4945 18.83 41.4383 13.8732 37.7826 10.2174C34.1268 6.56167 29.17 4.50546 24 4.5ZM24 40.5C20.7366 40.5 17.5465 39.5323 14.8331 37.7192C12.1197 35.9062 10.0048 33.3293 8.75599 30.3143C7.50714 27.2993 7.18039 23.9817 7.81704 20.781C8.4537 17.5803 10.0252 14.6403 12.3327 12.3327C14.6403 10.0252 17.5803 8.4537 20.781 7.81704C23.9817 7.18039 27.2993 7.50714 30.3143 8.75599C33.3293 10.0048 35.9062 12.1197 37.7192 14.8331C39.5323 17.5465 40.5 20.7366 40.5 24C40.495 28.3745 38.7551 32.5685 35.6618 35.6618C32.5685 38.7551 28.3745 40.495 24 40.5ZM15 20.25C15 19.805 15.132 19.37 15.3792 19C15.6264 18.63 15.9778 18.3416 16.389 18.1713C16.8001 18.001 17.2525 17.9564 17.689 18.0432C18.1254 18.13 18.5263 18.3443 18.841 18.659C19.1557 18.9737 19.37 19.3746 19.4568 19.811C19.5436 20.2475 19.499 20.6999 19.3287 21.111C19.1584 21.5222 18.87 21.8736 18.5 22.1208C18.13 22.368 17.695 22.5 17.25 22.5C16.6533 22.5 16.081 22.2629 15.659 21.841C15.2371 21.419 15 20.8467 15 20.25ZM33 20.25C33 20.695 32.868 21.13 32.6208 21.5C32.3736 21.87 32.0222 22.1584 31.611 22.3287C31.1999 22.499 30.7475 22.5436 30.311 22.4568C29.8746 22.37 29.4737 22.1557 29.159 21.841C28.8443 21.5263 28.63 21.1254 28.5432 20.689C28.4564 20.2525 28.501 19.8001 28.6713 19.389C28.8416 18.9778 29.13 18.6264 29.5 18.3792C29.87 18.132 30.305 18 30.75 18C31.3467 18 31.919 18.2371 32.341 18.659C32.7629 19.081 33 19.6533 33 20.25ZM32.7994 29.25C30.87 32.5856 27.6619 34.5 24 34.5C20.3381 34.5 17.1319 32.5875 15.2025 29.25C15.094 29.0793 15.0211 28.8884 14.9883 28.6887C14.9554 28.4891 14.9633 28.2849 15.0114 28.0884C15.0596 27.8919 15.147 27.7072 15.2683 27.5453C15.3897 27.3835 15.5426 27.2479 15.7177 27.1466C15.8929 27.0454 16.0867 26.9806 16.2875 26.9562C16.4883 26.9318 16.692 26.9483 16.8863 27.0047C17.0806 27.0611 17.2615 27.1561 17.4181 27.2842C17.5747 27.4123 17.7037 27.5707 17.7975 27.75C19.1981 30.1706 21.3994 31.5 24 31.5C26.6006 31.5 28.8019 30.1687 30.2006 27.75C30.3995 27.4054 30.7272 27.1539 31.1115 27.0509C31.4959 26.9478 31.9054 27.0017 32.25 27.2006C32.5946 27.3995 32.8461 27.7272 32.9491 28.1115C33.0522 28.4959 32.9983 28.9054 32.7994 29.25Z"/>
    </svg>
  )
}

function FaceNeutral() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#DFBC0E" d="M24 4.5C20.1433 4.5 16.3731 5.64366 13.1664 7.78634C9.95962 9.92903 7.46026 12.9745 5.98435 16.5377C4.50844 20.1008 4.12228 24.0216 4.87469 27.8043C5.6271 31.5869 7.48429 35.0615 10.2114 37.7886C12.9385 40.5157 16.4131 42.3729 20.1957 43.1253C23.9784 43.8777 27.8992 43.4916 31.4623 42.0156C35.0255 40.5397 38.071 38.0404 40.2137 34.8336C42.3563 31.6269 43.5 27.8567 43.5 24C43.4945 18.83 41.4383 13.8732 37.7826 10.2174C34.1268 6.56167 29.17 4.50546 24 4.5ZM24 40.5C20.7366 40.5 17.5465 39.5323 14.8331 37.7192C12.1197 35.9062 10.0048 33.3293 8.75599 30.3143C7.50714 27.2993 7.18039 23.9817 7.81704 20.781C8.4537 17.5803 10.0252 14.6403 12.3327 12.3327C14.6403 10.0252 17.5803 8.4537 20.781 7.81704C23.9817 7.18039 27.2993 7.50714 30.3143 8.75599C33.3293 10.0048 35.9062 12.1197 37.7192 14.8331C39.5323 17.5465 40.5 20.7366 40.5 24C40.495 28.3745 38.7551 32.5685 35.6618 35.6618C32.5685 38.7551 28.3745 40.495 24 40.5ZM33 30C33 30.3978 32.842 30.7794 32.5607 31.0607C32.2794 31.342 31.8978 31.5 31.5 31.5H16.5C16.1022 31.5 15.7206 31.342 15.4393 31.0607C15.158 30.7794 15 30.3978 15 30C15 29.6022 15.158 29.2206 15.4393 28.9393C15.7206 28.658 16.1022 28.5 16.5 28.5H31.5C31.8978 28.5 32.2794 28.658 32.5607 28.9393C32.842 29.2206 33 29.6022 33 30ZM15 20.25C15 19.805 15.132 19.37 15.3792 19C15.6264 18.63 15.9778 18.3416 16.389 18.1713C16.8001 18.001 17.2525 17.9564 17.689 18.0432C18.1254 18.13 18.5263 18.3443 18.841 18.659C19.1557 18.9737 19.37 19.3746 19.4568 19.811C19.5436 20.2475 19.499 20.6999 19.3287 21.111C19.1584 21.5222 18.87 21.8736 18.5 22.1208C18.13 22.368 17.695 22.5 17.25 22.5C16.6533 22.5 16.081 22.2629 15.659 21.841C15.2371 21.419 15 20.8467 15 20.25ZM33 20.25C33 20.695 32.868 21.13 32.6208 21.5C32.3736 21.87 32.0222 22.1584 31.611 22.3287C31.1999 22.499 30.7475 22.5436 30.311 22.4568C29.8746 22.37 29.4737 22.1557 29.159 21.841C28.8443 21.5263 28.63 21.1254 28.5432 20.689C28.4564 20.2525 28.501 19.8001 28.6713 19.389C28.8416 18.9778 29.13 18.6264 29.5 18.3792C29.87 18.132 30.305 18 30.75 18C31.3467 18 31.919 18.2371 32.341 18.659C32.7629 19.081 33 19.6533 33 20.25Z"/>
    </svg>
  )
}

function FaceSad() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#B01B11" d="M24 4.5C20.1433 4.5 16.3731 5.64366 13.1664 7.78634C9.95962 9.92903 7.46026 12.9745 5.98435 16.5377C4.50844 20.1008 4.12228 24.0216 4.87469 27.8043C5.6271 31.5869 7.48429 35.0615 10.2114 37.7886C12.9385 40.5157 16.4131 42.3729 20.1957 43.1253C23.9784 43.8777 27.8992 43.4916 31.4623 42.0156C35.0255 40.5397 38.071 38.0404 40.2137 34.8336C42.3563 31.6269 43.5 27.8567 43.5 24C43.4945 18.83 41.4383 13.8732 37.7826 10.2174C34.1268 6.56167 29.17 4.50546 24 4.5ZM24 40.5C20.7366 40.5 17.5465 39.5323 14.8331 37.7192C12.1197 35.9062 10.0048 33.3293 8.75599 30.3143C7.50714 27.2993 7.18039 23.9817 7.81704 20.781C8.4537 17.5803 10.0252 14.6403 12.3327 12.3327C14.6403 10.0252 17.5803 8.4537 20.781 7.81704C23.9817 7.18039 27.2993 7.50714 30.3143 8.75599C33.3293 10.0048 35.9062 12.1197 37.7192 14.8331C39.5323 17.5465 40.5 20.7366 40.5 24C40.495 28.3745 38.7551 32.5685 35.6618 35.6618C32.5685 38.7551 28.3745 40.495 24 40.5ZM15 20.25C15 19.805 15.132 19.37 15.3792 19C15.6264 18.63 15.9778 18.3416 16.389 18.1713C16.8001 18.001 17.2525 17.9564 17.689 18.0432C18.1254 18.13 18.5263 18.3443 18.841 18.659C19.1557 18.9737 19.37 19.3746 19.4568 19.811C19.5436 20.2475 19.499 20.6999 19.3287 21.111C19.1584 21.5222 18.87 21.8736 18.5 22.1208C18.13 22.368 17.695 22.5 17.25 22.5C16.6533 22.5 16.081 22.2629 15.659 21.841C15.2371 21.419 15 20.8467 15 20.25ZM33 20.25C33 20.695 32.868 21.13 32.6208 21.5C32.3736 21.87 32.0222 22.1584 31.611 22.3287C31.1999 22.499 30.7475 22.5436 30.311 22.4568C29.8746 22.37 29.4737 22.1557 29.159 21.841C28.8443 21.5263 28.63 21.1254 28.5432 20.689C28.4564 20.2525 28.501 19.8001 28.6713 19.389C28.8416 18.9778 29.13 18.6264 29.5 18.3792C29.87 18.132 30.305 18 30.75 18C31.3467 18 31.919 18.2371 32.341 18.659C32.7629 19.081 33 19.6533 33 20.25ZM32.7975 32.25C32.906 32.4207 32.9789 32.6116 33.0117 32.8113C33.0446 33.0109 33.0367 33.2151 32.9886 33.4116C32.9404 33.6081 32.853 33.7928 32.7317 33.9547C32.6103 34.1165 32.4574 34.2521 32.2823 34.3534C32.1071 34.4546 31.9133 34.5194 31.7125 34.5438C31.5117 34.5682 31.308 34.5517 31.1137 34.4953C30.9194 34.4389 30.7385 34.3439 30.5819 34.2158C30.4253 34.0877 30.2963 33.9293 30.2025 33.75C28.8019 31.3294 26.6006 30 24 30C21.3994 30 19.1981 31.3313 17.7975 33.75C17.7037 33.9293 17.5747 34.0877 17.4181 34.2158C17.2615 34.3439 17.0806 34.4389 16.8863 34.4953C16.692 34.5517 16.4883 34.5682 16.2875 34.5438C16.0867 34.5194 15.8929 34.4546 15.7177 34.3534C15.5426 34.2521 15.3897 34.1165 15.2683 33.9547C15.147 33.7928 15.0596 33.6081 15.0114 33.4116C14.9633 33.2151 14.9554 33.0109 14.9883 32.8113C15.0211 32.6116 15.094 32.4207 15.2025 32.25C17.1319 28.9144 20.3381 27 24 27C27.6619 27 30.8681 28.9125 32.7975 32.25Z"/>
    </svg>
  )
}

/* ── Helpers ── */

function loadGoal(id) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    return goals.find(g => String(g.id) === String(id)) ?? null
  } catch { return null }
}

function loadEntries() {
  try { return JSON.parse(localStorage.getItem('trumi_log_entries') ?? '[]') } catch { return [] }
}

function saveEntries(entries) {
  localStorage.setItem('trumi_log_entries', JSON.stringify(entries))
}

function todayISO() {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function formatTodayDisplay() {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
}

function updateGoalLoggedDays(goalId, dateStr) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    const next = goals.map(g => {
      if (String(g.id) !== String(goalId)) return g
      const days = Array.isArray(g.loggedDays) ? g.loggedDays : []
      if (days.includes(dateStr)) return g
      return { ...g, loggedDays: [...days, dateStr] }
    })
    localStorage.setItem('trumi_goals', JSON.stringify(next))
  } catch { /* noop */ }
}

/* ── Contribution options ── */
const CONTRIBUTIONS = [
  { value: 'lot',       label: 'Yes, a lot!' },
  { value: 'somewhat',  label: 'Somewhat'    },
  { value: 'not_today', label: 'Not Today'   },
]

const MAX_SUMMARY = 500

export default function LogEntry() {
  const navigate       = useNavigate()
  const { id }         = useParams()
  const location       = useLocation()

  const goal           = loadGoal(id)
  const goalTitle      = goal?.title ?? location.state?.goalTitle ?? 'Your Goal'

  const today          = todayISO()
  const alreadyLogged  = loadEntries().some(e => String(e.goalId) === String(id) && e.date === today)

  const [contribution, setContribution] = useState(null)
  const [summary,      setSummary]      = useState('')
  const [mood,         setMood]         = useState(null)

  const canSubmit = contribution !== null && mood !== null

  function handleSubmit() {
    if (!canSubmit) return

    const entry = {
      id:           `${id}_${today}`,
      goalId:       String(id),
      date:         today,
      contribution,
      summary:      summary.trim(),
      mood,
    }

    const entries = loadEntries()
    saveEntries([...entries, entry])

    if (contribution !== 'not_today') {
      updateGoalLoggedDays(id, today)
    }

    navigate(`/goal/${id}`, { replace: true })
  }

  /* ── Already logged state ── */
  if (alreadyLogged) {
    return (
      <div className="log-entry">
        <div className="log-entry__nav">
          <button className="log-entry__back" onClick={() => navigate(`/goal/${id}`)} aria-label="Go back">
            <svg width="10" height="20" viewBox="0 0 10 20" fill="none" aria-hidden="true">
              <path d="M9 1L1 10L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="log-entry__goal-title">{goalTitle}</p>
          <div className="log-entry__back-placeholder" />
        </div>

        <div className="log-entry__already-logged">
          <p className="log-entry__already-logged__emoji">✓</p>
          <p className="log-entry__already-logged__heading">Already logged today</p>
          <p className="log-entry__already-logged__body">
            You've already made an entry for this goal today. Come back tomorrow — every day is a new chance to grow.
          </p>
          <button className="log-entry__submit-btn" onClick={() => navigate(`/goal/${id}`)}>
            Back to Goal
          </button>
        </div>
      </div>
    )
  }

  /* ── Main form ── */
  return (
    <div className="log-entry">

      {/* ── Back nav + goal title ── */}
      <div className="log-entry__nav">
        <button className="log-entry__back" onClick={() => navigate(`/goal/${id}`)} aria-label="Go back">
          <svg width="10" height="20" viewBox="0 0 10 20" fill="none" aria-hidden="true">
            <path d="M9 1L1 10L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="log-entry__goal-title">{goalTitle}</p>
        <div className="log-entry__back-placeholder" />
      </div>

      {/* ── Section 1: Contribution ── */}
      <section className="log-entry__section">
        <h2 className="log-entry__section-heading">Were you able to contribute to your goal today?</h2>
        <div className="log-entry__contribution-options">
          {CONTRIBUTIONS.map(opt => (
            <button
              key={opt.value}
              className={`log-entry__contrib-btn${contribution === opt.value ? ' log-entry__contrib-btn--selected' : ''}`}
              onClick={() => setContribution(opt.value)}
              aria-pressed={contribution === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <div className="log-entry__divider" />

      {/* ── Section 2: Written summary ── */}
      <section className="log-entry__section">
        <h2 className="log-entry__section-heading">How did you contribute to your goal?</h2>
        <div className="log-entry__textarea-wrap">
          <textarea
            className="log-entry__textarea"
            value={summary}
            onChange={e => setSummary(e.target.value.slice(0, MAX_SUMMARY))}
            placeholder="Write about what you did today..."
            rows={4}
            aria-label="Describe how you contributed to your goal"
          />
          <span className="log-entry__char-count">{summary.length}/{MAX_SUMMARY}</span>
        </div>
      </section>

      <div className="log-entry__divider" />

      {/* ── Section 3: Mood ── */}
      <section className="log-entry__section log-entry__section--centered">
        <h2 className="log-entry__section-heading">How did you feel?</h2>
        <div className="log-entry__mood-row">
          <button
            className={`log-entry__mood-btn${mood === 'sad' ? ' log-entry__mood-btn--selected' : ''}`}
            onClick={() => setMood('sad')}
            aria-pressed={mood === 'sad'}
            aria-label="Sad"
          >
            <FaceSad />
          </button>
          <button
            className={`log-entry__mood-btn${mood === 'neutral' ? ' log-entry__mood-btn--selected' : ''}`}
            onClick={() => setMood('neutral')}
            aria-pressed={mood === 'neutral'}
            aria-label="Neutral"
          >
            <FaceNeutral />
          </button>
          <button
            className={`log-entry__mood-btn${mood === 'happy' ? ' log-entry__mood-btn--selected' : ''}`}
            onClick={() => setMood('happy')}
            aria-pressed={mood === 'happy'}
            aria-label="Happy"
          >
            <FaceHappy />
          </button>
        </div>
      </section>

      {/* ── Submit ── */}
      <button
        className={`log-entry__submit-btn${!canSubmit ? ' log-entry__submit-btn--disabled' : ''}`}
        onClick={handleSubmit}
        disabled={!canSubmit}
        aria-disabled={!canSubmit}
      >
        Finish Entry
      </button>

      {/* ── Footer note ── */}
      <div className="log-entry__footer">
        <p className="log-entry__footer__date">Logging Progress for {formatTodayDisplay()}</p>
        <p className="log-entry__footer__hint">You can only log 1 entry per-goal, per-day. Make it count!</p>
      </div>

    </div>
  )
}
