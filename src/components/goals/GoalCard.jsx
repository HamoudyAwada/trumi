import './GoalCard.css'

/* ── Helpers ──────────────────────────────────────────────────────────── */

function getWeekDays() {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      label,
      dateStr: d.toISOString().split('T')[0],
      dayNum:  d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

function computeStreak(loggedDays = []) {
  const logged = new Set(loggedDays)
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (logged.has(d.toISOString().split('T')[0])) streak++
    else if (i > 0) break
  }
  return streak
}

function getTrackingEnd(startDateStr) {
  try {
    const d = new Date(startDateStr)
    if (isNaN(d)) return 'N/A'
    d.setDate(d.getDate() + 30)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch { return 'N/A' }
}

/* ══════════════════════════════════════════════════════════════════════
   GoalCard
   Props:
     id              number | string
     title           string
     aka             string
     startDate       string
     status          'active' | 'paused'
     loggedDays      string[]          — dates where daily goal was completed (pct >= 100)
     dailyLogs       { [dateStr]: number } — 0–100 pct per day; set by quick-complete or entry
     unit            string | undefined  — AI: "Minutes", "Runs", etc.
     actionLabel     string | null       — AI: "Meditated", "Ran Today"; null = hide button
     onQuickComplete (id) => void        — sets today to 100%
     onCreateEntry   (id) => void        — navigate to log entry screen
     onSettings      () => void
   ══════════════════════════════════════════════════════════════════════ */
export default function GoalCard({
  id,
  title,
  aka,
  startDate,
  status = 'active',
  loggedDays = [],
  dailyLogs = {},
  unit,
  actionLabel,
  onQuickComplete,
  onCreateEntry,
  onSettings,
}) {
  const isPaused      = status === 'paused'
  const weekDays      = getWeekDays()
  const loggedSet     = new Set(loggedDays)
  const streak        = computeStreak(loggedDays)
  const thisWeekCount = weekDays.filter(d => loggedSet.has(d.dateStr)).length
  const trackingEnd   = getTrackingEnd(startDate)
  const todayStr      = new Date().toISOString().split('T')[0]

  // Ring = today's progress (0–100)
  const todayPct      = Math.min(100, Math.max(0, dailyLogs[todayStr] ?? 0))
  const todayDone     = todayPct >= 100

  const displayUnit   = unit ?? 'Sessions'
  const showSecondary = Boolean(actionLabel) && !isPaused

  const ringSize = 78
  const r        = (ringSize - 8) / 2
  const circ     = 2 * Math.PI * r
  const offset   = circ * (1 - todayPct / 100)

  return (
    <article className={`goal-card goal-card--${status}`}>

      {/* ── Settings button ── */}
      <button
        className="goal-card__settings-btn"
        onClick={e => { e.stopPropagation(); onSettings?.() }}
        aria-label="Goal options"
      >
        <svg width="13" height="3" viewBox="0 0 13 3" fill="none" aria-hidden="true">
          <circle cx="1.5"  cy="1.5" r="1.5" fill="var(--color-tranquil-night)" />
          <circle cx="6.5"  cy="1.5" r="1.5" fill="var(--color-tranquil-night)" />
          <circle cx="11.5" cy="1.5" r="1.5" fill="var(--color-tranquil-night)" />
        </svg>
      </button>

      {/* ── Header ── */}
      <div className="goal-card__header">
        <span className="goal-card__title">{title}</span>
        {aka && (
          <div className="goal-card__mini">
            <span className="goal-card__mini-label">Mini Goal:</span>
            <span className="goal-card__mini-text">{aka}</span>
          </div>
        )}
      </div>

      {/* ── Meta row ── */}
      <div className="goal-card__meta">
        <span className="goal-card__meta-item">
          Goal Started: <span className="goal-card__meta-val">{startDate}</span>
        </span>
        <span className="goal-card__meta-item">
          Until: <span className="goal-card__meta-val">{trackingEnd}</span>
        </span>
      </div>

      {/* ── Streak label ── */}
      <p className="goal-card__streak-label">
        Days Logged This Week:{' '}
        <span className="goal-card__streak-val">
          {streak > 0 ? `${streak} Day Streak!` : 'Start your streak!'}
        </span>
      </p>

      {/* ── Week calendar ── */}
      <div className="goal-card__week">
        {weekDays.map(day => {
          const pct    = dailyLogs[day.dateStr] ?? 0
          const done   = pct >= 100
          const partial = pct > 0 && pct < 100
          return (
            <div key={day.dateStr} className="goal-card__week-col">
              <span className="goal-card__week-label">{day.label.slice(0, 3)}</span>
              <div className={[
                'goal-card__week-box',
                done    ? 'goal-card__week-box--filled' : '',
                partial ? 'goal-card__week-box--partial' : '',
                day.isToday && !done && !partial ? 'goal-card__week-box--today' : '',
                isPaused ? 'goal-card__week-box--paused' : '',
              ].filter(Boolean).join(' ')}>
                <span className={`goal-card__week-num${done ? ' goal-card__week-num--filled' : ''}`}>
                  {day.dayNum}
                </span>
              </div>
              {day.isToday && <span className="goal-card__week-today">Today</span>}
            </div>
          )
        })}
      </div>

      {/* ── Insight + today's ring ── */}
      <div className="goal-card__insight-row">
        <div className="goal-card__insight-left">
          <svg className="goal-card__flame" width="28" height="34" viewBox="0 0 22 29" fill="none" aria-hidden="true">
            <path d="M11 29C15.418 29 19 26.25 19 21.375C19 19.125 18.225 15.375 15.525 12.375C15.9 14.625 13.65 15.375 13.65 15.375C14.85 11.625 11.85 6.375 7.35 5.625C7.881 8.625 8.1 11.625 4.35 14.625C2.475 16.125 1.35 18.7185 1.35 21.375C1.35 26.25 6.582 29 11 29Z" fill="#FF8B0B"/>
            <ellipse cx="11" cy="22.5" rx="5" ry="5.5" fill="#FFD060" opacity="0.75"/>
          </svg>
          <p className="goal-card__insight-text">
            {isPaused
              ? "This goal is paused. Resume whenever you're ready."
              : todayDone
                ? `Today's done! You've also logged ${thisWeekCount} day${thisWeekCount !== 1 ? 's' : ''} this week.`
                : thisWeekCount > 0
                  ? `You've logged ${thisWeekCount} day${thisWeekCount > 1 ? 's' : ''} this week. Keep it going!`
                  : 'Start logging to build your streak and track your progress.'}
          </p>
        </div>

        <div className="goal-card__tracker">
          <p className="goal-card__tracker-label">
            Today<br />
            <span className={`goal-card__tracker-count${todayDone ? ' goal-card__tracker-count--done' : ''}`}>
              {todayDone ? 'Complete!' : `${todayPct}%`}
            </span>
          </p>
          <div className="goal-card__tracker-ring">
            <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} aria-hidden="true">
              <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none" stroke="#e0e0f5" strokeWidth="7" />
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={r}
                fill="none"
                stroke={
                  isPaused  ? 'var(--color-fogstone, #66747f)'      :
                  todayDone ? 'var(--color-lucent-green, #cdff6d)'  :
                  'var(--color-horizon-violet, #6666cc)'
                }
                strokeWidth="7"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                style={{ transition: 'stroke-dashoffset 500ms ease, stroke 300ms ease' }}
              />
            </svg>
            <span className={`goal-card__tracker-pct${todayDone ? ' goal-card__tracker-pct--done' : ''}`}>
              {todayDone ? '✓' : `${todayPct}%`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      {!isPaused && (
        <div className="goal-card__actions">
          <button
            className={`goal-card__btn goal-card__btn--filled${todayDone ? ' goal-card__btn--done' : ''}`}
            onClick={() => onCreateEntry?.(id)}
          >
            {todayDone ? '✓ Entry Logged' : 'Create Entry'}
          </button>

          {showSecondary && (
            <button
              className={`goal-card__btn goal-card__btn--outline${todayDone ? ' goal-card__btn--outline-done' : ''}`}
              onClick={() => !todayDone && onQuickComplete?.(id)}
              disabled={todayDone}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}

      {isPaused && (
        <div className="goal-card__actions">
          <button className="goal-card__btn goal-card__btn--unpause">
            Resume Goal
          </button>
        </div>
      )}

    </article>
  )
}
