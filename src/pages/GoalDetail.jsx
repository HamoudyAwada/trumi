import { useNavigate, useParams } from 'react-router-dom'
import './GoalDetail.css'

/* ── Difficulty labels (matches AddGoal) ── */
const DIFFICULTY_LABELS = {
  1: 'Very light — easy to fit into your day',
  2: 'Light — manageable with some consistency',
  3: 'Moderate — requires real commitment',
  4: 'Challenging — you\'ll need to push yourself',
  5: 'Intense — a serious stretch goal',
}

/* ── Flame icon ─────────────────────────── */
function FlameIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/* ── Trumi logo mark ────────────────────── */
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

/* ── Load a single goal from localStorage ── */
function loadGoal(id) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    return goals.find(g => String(g.id) === String(id)) ?? null
  } catch {
    return null
  }
}

/* ════════════════════════════════════════
   GoalDetail Page
   ════════════════════════════════════════ */
export default function GoalDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const goal     = loadGoal(id)

  if (!goal) {
    return (
      <div className="gd-page gd-page--not-found">
        <p className="gd-not-found__text">This goal couldn't be found.</p>
        <button className="gd-not-found__btn" onClick={() => navigate('/goals')}>
          Back to Goals
        </button>
      </div>
    )
  }

  const isPaused  = goal.status === 'paused'
  const termLabel = goal.term === 'long' ? 'Long Term Goal' : 'Short Term Goal'
  const progress  = goal.progress ?? 0

  return (
    <div className="gd-page">

      {/* ── Header ─────────────────────────── */}
      <header className="gd-header">
        <div className="gd-header__brand">
          <TrumiLogo />
          <span className="gd-header__wordmark">trumi</span>
        </div>
        <span className="gd-header__term-label">{termLabel}</span>
      </header>

      {/* ── Back button ────────────────────── */}
      <button className="gd-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Scrollable body ────────────────── */}
      <div className="gd-body">

        {/* Title + intensity */}
        <div className="gd-title-section">
          <h1 className={`gd-title${isPaused ? ' gd-title--paused' : ''}`}>{goal.title}</h1>
          <div className="gd-intensity" aria-label={`Intensity: ${goal.intensity} out of 5`}>
            {[1, 2, 3, 4, 5].map(i => (
              <FlameIcon key={i} active={!isPaused && i <= goal.intensity} />
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="gd-section">
          <div className="gd-progress-header">
            <span className="gd-section-label">Progress</span>
            <span className="gd-progress-pct">{progress}%</span>
          </div>
          <div className="gd-progress-track">
            <div
              className={`gd-progress-fill${isPaused ? ' gd-progress-fill--paused' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="gd-section gd-dates">
          <div className="gd-date-row">
            <span className="gd-date-label">Started</span>
            <span className="gd-date-value">{goal.startDate}</span>
          </div>
          {goal.dueDate && (
            <div className="gd-date-row">
              <span className="gd-date-label">Due by</span>
              <span className="gd-date-value">{goal.dueDate}</span>
            </div>
          )}
          {isPaused && goal.pausedDate && (
            <div className="gd-date-row">
              <span className="gd-date-label">Paused</span>
              <span className="gd-date-value">{goal.pausedDate}</span>
            </div>
          )}
        </div>

        {/* Values */}
        {goal.values?.length > 0 && (
          <div className="gd-section">
            <p className="gd-section-label">Aligns with your values</p>
            <div className="gd-chips">
              {goal.values.map(v => (
                <span key={v} className="gd-chip">{v}</span>
              ))}
            </div>
          </div>
        )}

        {/* How you'll do it */}
        {goal.executionStyle && (
          <div className="gd-section">
            <p className="gd-section-label">How you'll do it</p>
            <p className="gd-detail-text">
              {goal.executionStyle}
              {goal.weeklyTimes ? ` · ${goal.weeklyTimes}× per week` : ''}
            </p>
          </div>
        )}

        {/* Minimum version */}
        {goal.minimumVersion && (
          <div className="gd-section">
            <p className="gd-section-label">Your minimum version</p>
            <p className="gd-detail-text gd-detail-text--quoted">"{goal.minimumVersion}"</p>
          </div>
        )}

        {/* Friction */}
        {goal.friction?.length > 0 && (
          <div className="gd-section">
            <p className="gd-section-label">Possible friction</p>
            <div className="gd-chips gd-chips--friction">
              {goal.friction.map(f => (
                <span key={f} className="gd-chip gd-chip--friction">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Perceived difficulty */}
        {goal.perceivedDifficulty && (
          <div className="gd-section gd-section--last">
            <p className="gd-section-label">How hard you thought this would be</p>
            <div className="gd-difficulty">
              <div className="gd-difficulty__flames">
                {[1, 2, 3, 4, 5].map(i => (
                  <FlameIcon key={i} active={i <= goal.perceivedDifficulty} />
                ))}
              </div>
              <p className="gd-difficulty__label">
                {DIFFICULTY_LABELS[goal.perceivedDifficulty]}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ── Footer actions ─────────────────── */}
      <div className="gd-footer">
        {isPaused ? (
          <button className="gd-footer__primary">Unpause Goal</button>
        ) : (
          <>
            <button className="gd-footer__primary">Log Progress</button>
            <button className="gd-footer__setback">Log Setback</button>
            <button className="gd-footer__pause">Pause Goal</button>
          </>
        )}
      </div>

    </div>
  )
}
