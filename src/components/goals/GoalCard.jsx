import './GoalCard.css'

/* ── Flame icon — two states: active (filled) vs inactive (ghost) ── */
function FlameIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse
        cx="12" cy="16.5" rx="6" ry="7.5"
        fill={active ? '#D7FF8A' : 'var(--color-fogstone-200)'}
      />
      <path
        d="M12 24C16.971 24 21 21 21 15.75C21 13.5 20.25 9.75 17.25 6.75C17.625 9 15.375 9.75 15.375 9.75C16.5 6 13.5 0.75 9 0C9.5355 3 9.75 6 6 9C4.125 10.5 3 13.0935 3 15.75C3 21 7.029 24 12 24ZM12 22.5C9.5145 22.5 7.5 21 7.5 18.375C7.5 17.25 7.875 15.375 9.375 13.875C9.1875 15 10.5 15.75 10.5 15.75C9.9375 13.875 11.25 10.875 13.5 10.5C13.2315 12 13.125 13.5 15 15C15.9375 15.75 16.5 17.046 16.5 18.375C16.5 21 14.4855 22.5 12 22.5Z"
        fill={active ? '#293316' : 'var(--color-horizon-violet-200)'}
      />
    </svg>
  )
}

/* ── 5-flame intensity row ── */
function IntensityMarker({ level }) {
  return (
    <div className="goal-card__intensity">
      {[1, 2, 3, 4, 5].map(i => (
        <FlameIcon key={i} active={i <= level} />
      ))}
    </div>
  )
}

/* ── Horizontal progress bar ── */
function ProgressBar({ progress, paused }) {
  const clamped = Math.max(0, Math.min(100, progress))
  return (
    <div className="goal-card__progress-track">
      <div
        className={`goal-card__progress-fill${paused ? ' goal-card__progress-fill--paused' : ''}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

/* ── 3-dot settings button SVG ── */
function ThreeDotsIcon() {
  return (
    <svg width="13" height="3" viewBox="0 0 13 3" fill="none" aria-hidden="true">
      <circle cx="1.5"  cy="1.5" r="1.5" fill="var(--color-tranquil-night)" />
      <circle cx="6.5"  cy="1.5" r="1.5" fill="var(--color-tranquil-night)" />
      <circle cx="11.5" cy="1.5" r="1.5" fill="var(--color-tranquil-night)" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════
   GoalCard
   Props:
     title          string
     description    string
     aka            string          — alias shown as bullet
     startDate      string
     pausedDate     string | null
     status         'active' | 'paused'
     intensity      1–5             — number of filled flames
     progress       0–100           — fill percentage
     progressMessage string         — encouraging label above bar
     values         string[]        — aligned value tags
     onLogProgress  () => void
     onLogSetback   () => void
     onUnpause      () => void
     onSettings     () => void
   ══════════════════════════════════════════════════════════ */
export default function GoalCard({
  title,
  description,
  aka,
  startDate,
  pausedDate = null,
  status = 'active',
  intensity = 3,
  progress = 0,
  progressMessage = '',
  values = [],
  onLogProgress,
  onLogSetback,
  onUnpause,
  onSettings,
}) {
  const isActive = status === 'active'
  const isPaused = status === 'paused'

  return (
    <article className={`goal-card goal-card--${status}`}>

      {/* ── Header strip: title + intensity ── */}
      <div className="goal-card__header">
        <h3 className="goal-card__title">{title}</h3>
        <IntensityMarker level={isPaused ? 0 : intensity} />
      </div>

      {/* ── Settings / 3-dot button (absolute, top-right) ── */}
      <button
        className="goal-card__settings-btn"
        onClick={onSettings}
        aria-label="Goal options"
      >
        <ThreeDotsIcon />
      </button>

      {/* ── Dates ── */}
      <div className="goal-card__meta">
        <p className="goal-card__date">
          {'Goal Started: '}
          <u>{startDate}</u>
        </p>
        {isPaused && pausedDate && (
          <p className="goal-card__date">Goal PAUSED: {pausedDate}</p>
        )}
      </div>

      {/* ── Description ── */}
      <p className="goal-card__description">{description}</p>

      {/* ── AKA bullet ── */}
      {aka && (
        <ul className="goal-card__aka-list">
          <li>AKA: {aka}</li>
        </ul>
      )}

      {/* ── Progress section (coloured background strip) ── */}
      <div className="goal-card__progress-section">
        {progressMessage && (
          <p className="goal-card__progress-message">{progressMessage}</p>
        )}
        <ProgressBar progress={progress} paused={isPaused} />
      </div>

      {/* ── Bottom row: values (left) + action (right) ── */}
      <div className="goal-card__bottom">

        <div className="goal-card__values-block">
          <p className="goal-card__values-label">Aligns with your Values:</p>
          <div className="goal-card__values-chips">
            {values.map(v => (
              <span key={v} className="goal-card__value-chip">{v}</span>
            ))}
          </div>
        </div>

        <div className="goal-card__action-block">
          {isActive ? (
            <>
              <button className="goal-card__action-btn" onClick={onLogProgress}>
                Log Progress
              </button>
              <button className="goal-card__setback-link" onClick={onLogSetback}>
                Log Setback
              </button>
            </>
          ) : (
            <button className="goal-card__unpause-btn" onClick={onUnpause}>
              Unpause
            </button>
          )}
        </div>

      </div>

    </article>
  )
}
