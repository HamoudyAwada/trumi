import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './GoalDetail.css'

/* ─── Constants ──────────────────────────────── */

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DIFFICULTY_LABELS = {
  1: 'Very light',
  2: 'Light',
  3: 'Moderate',
  4: 'Challenging',
  5: 'Intense',
}

/* ─── Helpers ────────────────────────────────── */

function loadGoal(id) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    return goals.find(g => String(g.id) === String(id)) ?? null
  } catch { return null }
}

function saveGoal(updatedGoal) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    const next = goals.map(g => String(g.id) === String(updatedGoal.id) ? updatedGoal : g)
    localStorage.setItem('trumi_goals', JSON.stringify(next))
  } catch { /* noop */ }
}

/** Returns the 7 days of the current Mon–Sun week */
function getCurrentWeekDays() {
  const today = new Date()
  const dow = today.getDay() // 0=Sun, 1=Mon … 6=Sat
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))

  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      name,
      date:      d.getDate(),
      isToday:   d.toDateString() === today.toDateString(),
      isoDate:   d.toISOString().split('T')[0],
    }
  })
}

function weeklyStatusMessage(loggedCount, target) {
  if (target == null || target === 0) return null
  if (loggedCount > target) return 'You EXCEEDED your goal for this week, great job!'
  if (loggedCount === target) return 'You hit your goal for this week — well done!'
  if (loggedCount > 0) return `You've logged ${loggedCount} of ${target} sessions this week — keep going.`
  return null
}

/* ─── Sub-components ─────────────────────────── */

function TrumiLogo() {
  return (
    <svg className="gd-header__logo-mark" viewBox="0 0 1080 1080" fill="none" aria-hidden="true">
      <path fill="var(--color-horizon-violet)" d="M540,815.11c-167.07,0-328.6-50.77-454.82-142.95-21.21-15.49-25.85-45.25-10.36-66.46,15.49-21.21,45.25-25.85,66.46-10.36,110.06,80.38,251.66,124.65,398.72,124.65s288.71-44.26,398.71-124.64c21.21-15.5,50.97-10.87,66.46,10.34,15.5,21.21,10.87,50.97-10.34,66.46-126.17,92.19-287.7,142.96-454.83,142.96Z"/>
      <circle fill="var(--color-horizon-violet)" cx="540" cy="493.34" r="171.15"/>
      <path fill="var(--color-horizon-violet)" d="M540,870.61h0c-55.43,0-102.98,39.53-113.09,94.03l-16.15,87.05c-2.73,14.72,8.57,28.31,23.54,28.31h211.41c14.97,0,26.27-13.59,23.54-28.31l-16.15-87.05c-10.11-54.5-57.66-94.03-113.09-94.03Z"/>
      <path fill="var(--color-horizon-violet)" d="M484.05,98.64C484.05,32.54,509.1,0,540,0c30.9,0,55.95,32.54,55.95,98.64,0,50.3-32.4,128.39-47.89,162.85-3.13,6.96-12.99,6.96-16.12,0-15.49-34.45-47.89-112.54-47.89-162.85Z"/>
      <path fill="var(--color-horizon-violet)" d="M900.56,224.81c46.74-46.74,87.46-52.04,109.31-30.19,21.85,21.85,16.55,62.57-30.19,109.31-35.57,35.57-113.7,67.88-149.01,81.29-7.13,2.71-14.1-4.27-11.4-11.4,13.41-35.31,45.72-113.44,81.29-149.01Z"/>
      <path fill="var(--color-horizon-violet)" d="M100.32,303.93c-46.74-46.74-52.04-87.46-30.19-109.31,21.85-21.85,62.57-16.55,109.31,30.19,35.57,35.57,67.88,113.7,81.29,149.01,2.71,7.13-4.27,14.1-11.4,11.4-35.31-13.41-113.44-45.72-149.01-81.29Z"/>
    </svg>
  )
}

function FlameIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C12 2 6.5 8.5 6.5 13.5C6.5 16.54 9.02 19 12 19C14.98 19 17.5 16.54 17.5 13.5C17.5 8.5 12 2 12 2Z"
        fill={active ? 'var(--color-horizon-violet)' : 'var(--color-horizon-violet-200)'}
      />
      {active && (
        <path
          d="M12 9C12 9 10 12 10 13.8C10 14.96 10.9 15.9 12 15.9C13.1 15.9 14 14.96 14 13.8C14 12 12 9 12 9Z"
          fill="var(--color-horizon-violet-300)"
        />
      )}
    </svg>
  )
}

/** Simple celebrating mascot illustration */
function CelebrationCharacter() {
  return (
    <svg className="gd-character-svg" viewBox="0 0 120 130" fill="none" aria-hidden="true">
      {/* Body */}
      <ellipse cx="60" cy="95" rx="28" ry="32" fill="var(--color-horizon-violet-100)" stroke="var(--color-tranquil-night)" strokeWidth="2.5"/>
      {/* Head */}
      <circle cx="60" cy="52" r="26" fill="var(--color-cloud)" stroke="var(--color-tranquil-night)" strokeWidth="2.5"/>
      {/* Eyes */}
      <circle cx="52" cy="50" r="3.5" fill="var(--color-tranquil-night)"/>
      <circle cx="68" cy="50" r="3.5" fill="var(--color-tranquil-night)"/>
      {/* Smile */}
      <path d="M51 59 Q60 67 69 59" stroke="var(--color-tranquil-night)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Left arm raised */}
      <path d="M33 82 Q18 60 22 44" stroke="var(--color-tranquil-night)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Right arm raised */}
      <path d="M87 82 Q102 60 98 44" stroke="var(--color-tranquil-night)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Star in left hand */}
      <polygon points="22,44 24,38 26,44 33,44 28,48 30,54 24,50 18,54 20,48 15,44" fill="var(--color-lucent-green)" stroke="var(--color-tranquil-night)" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

/* ════════════════════════════════════════
   GoalDetail Page
   ════════════════════════════════════════ */
export default function GoalDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [goal, setGoal] = useState(() => loadGoal(id))
  const [addingReason, setAddingReason]   = useState(false)
  const [reasonInput,  setReasonInput]    = useState('')

  if (!goal) {
    return (
      <div className="gd-not-found">
        <p className="gd-not-found__text">This goal couldn't be found.</p>
        <button className="gd-not-found__btn" onClick={() => navigate('/goals')}>
          Back to Goals
        </button>
      </div>
    )
  }

  const isPaused   = goal.status === 'paused'
  const termLabel  = goal.term === 'long' ? 'Long Term Goal' : 'Short Term Goal'
  const weekDays   = getCurrentWeekDays()
  const loggedDays = goal.loggedDays ?? []
  const loggedThisWeek = weekDays.filter(d => loggedDays.includes(d.isoDate)).length
  const weekMsg    = weeklyStatusMessage(loggedThisWeek, goal.weeklyTimes)
  const reasons    = goal.reasons ?? []
  const intensity  = goal.perceivedDifficulty ?? goal.intensity ?? 0

  function handleAddReason() {
    const trimmed = reasonInput.trim()
    if (!trimmed) { setAddingReason(false); return }
    const updated = { ...goal, reasons: [...reasons, trimmed] }
    setGoal(updated)
    saveGoal(updated)
    setReasonInput('')
    setAddingReason(false)
  }

  function handlePause() {
    const now = new Date()
    const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const updated = { ...goal, status: 'paused', pausedDate: dateLabel }
    setGoal(updated)
    saveGoal(updated)
  }

  function handleUnpause() {
    const updated = { ...goal, status: 'active', pausedDate: null }
    setGoal(updated)
    saveGoal(updated)
  }

  return (
    <div className="gd-page">

      {/* ── App header ───────────────────── */}
      <header className="gd-header">
        <div className="gd-header__brand">
          <TrumiLogo />
          <span className="gd-header__wordmark">trumi</span>
        </div>
        <span className="gd-header__term-label">{termLabel}</span>
      </header>

      {/* ── Back + title row ─────────────── */}
      <div className="gd-title-bar">
        <button className="gd-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="gd-title">{goal.title}</h1>
        <button className="gd-edit-btn" onClick={() => {}}>Edit</button>
      </div>

      {/* ── Dates ───────────────────────── */}
      <div className="gd-dates">
        <span className="gd-dates__started">
          Goal Started: <u>{goal.startDate}</u>
        </span>
        {goal.dueDate && (
          <span className="gd-dates__due">Ideal Finish Date: {goal.dueDate}</span>
        )}
      </div>

      {/* ── Minimum version quote ────────── */}
      {goal.minimumVersion && (
        <p className="gd-quote">"{goal.minimumVersion}"</p>
      )}

      {/* ── Action buttons ───────────────── */}
      <div className="gd-actions">
        <button className="gd-actions__primary">Log Progress</button>
        <button className="gd-actions__secondary">See All Entries</button>
      </div>

      {/* ── This Week calendar ───────────── */}
      <div className="gd-week">
        <p className="gd-week__label">This Week:</p>
        <div className="gd-week__grid">
          {weekDays.map(day => {
            const logged = loggedDays.includes(day.isoDate)
            return (
              <div key={day.isoDate} className="gd-week__day">
                <span className="gd-week__day-name">{day.name}</span>
                <div className={`gd-week__day-cell${logged ? ' gd-week__day-cell--logged' : ''}${day.isToday ? ' gd-week__day-cell--today' : ''}`}>
                  <span className={`gd-week__day-num${logged ? ' gd-week__day-num--logged' : ''}`}>
                    {day.date}
                  </span>
                </div>
                {day.isToday && <span className="gd-week__today-label">Today</span>}
              </div>
            )
          })}
        </div>
        {weekMsg && <p className="gd-week__message">{weekMsg}</p>}
      </div>

      {/* ── Average Intensity/Effort ─────── */}
      <div className="gd-intensity">
        <span className="gd-intensity__label">Average Intensity/Effort:</span>
        <div className="gd-intensity__flames">
          {[1, 2, 3, 4, 5].map(i => (
            <FlameIcon key={i} active={!isPaused && i <= intensity} />
          ))}
        </div>
      </div>

      {/* ── Why I'm Doing This ───────────── */}
      <section className="gd-why">
        <h2 className="gd-why__heading">Why I'm Doing This</h2>
        <div className="gd-why__chips">
          {reasons.map((r, i) => (
            <span key={i} className="gd-why__chip">{r}</span>
          ))}
        </div>
        {addingReason ? (
          <div className="gd-why__add-form">
            <input
              className="gd-why__add-input"
              type="text"
              value={reasonInput}
              onChange={e => setReasonInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddReason()}
              placeholder="e.g. I want to feel stronger"
              autoFocus
              maxLength={80}
            />
            <button className="gd-why__add-save" onClick={handleAddReason}>Add</button>
            <button className="gd-why__add-cancel" onClick={() => { setAddingReason(false); setReasonInput('') }}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="gd-why__add-btn" onClick={() => setAddingReason(true)}>
            Add reason
          </button>
        )}
      </section>

      {/* ── This Goal Supports Your Values ── */}
      <section className="gd-values-section">
        <div className="gd-values-section__character-wrap">
          <CelebrationCharacter />
          <div className="gd-values-section__banner">
            This Goal Supports your Values
          </div>
        </div>
        {goal.values?.length > 0 && (
          <div className="gd-values-section__chips">
            {goal.values.map(v => (
              <button key={v} className="gd-values-section__chip">{v}</button>
            ))}
          </div>
        )}
      </section>

      {/* ── Insights ────────────────────── */}
      <section className="gd-insights">
        <h2 className="gd-insights__heading">Insights</h2>
        <p className="gd-insights__text">
          {goal.insights
            ? goal.insights
            : 'Keep logging progress and patterns will start to emerge here.'}
        </p>
      </section>

      {/* ── Pause / Unpause ─────────────── */}
      <div className="gd-footer">
        {isPaused ? (
          <button className="gd-footer__unpause" onClick={handleUnpause}>Unpause Goal</button>
        ) : (
          <button className="gd-footer__pause" onClick={handlePause}>Pause Goal</button>
        )}
      </div>

    </div>
  )
}
