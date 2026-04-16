import { useState } from 'react'
import GoalCard from '../components/goals/GoalCard'
import './Goals.css'

/* ── Trumi logo mark (inline SVG, matches OnboardingStep5) ── */
function TrumiLogo() {
  return (
    <svg className="goals-header__logo-mark" viewBox="0 0 1080 1080" fill="none" aria-hidden="true">
      <path fill="var(--color-horizon-violet)" d="M540,815.11c-167.07,0-328.6-50.77-454.82-142.95-21.21-15.49-25.85-45.25-10.36-66.46,15.49-21.21,45.25-25.85,66.46-10.36,110.06,80.38,251.66,124.65,398.72,124.65s288.71-44.26,398.71-124.64c21.21-15.5,50.97-10.87,66.46,10.34,15.5,21.21,10.87,50.97-10.34,66.46-126.17,92.19-287.7,142.96-454.83,142.96Z"/>
      <circle fill="var(--color-horizon-violet)" cx="540" cy="493.34" r="171.15"/>
      <path fill="var(--color-horizon-violet)" d="M540,870.61h0c-55.43,0-102.98,39.53-113.09,94.03l-16.15,87.05c-2.73,14.72,8.57,28.31,23.54,28.31h211.41c14.97,0,26.27-13.59,23.54-28.31l-16.15-87.05c-10.11-54.5-57.66-94.03-113.09-94.03Z"/>
      <path fill="var(--color-horizon-violet)" d="M484.05,98.64C484.05,32.54,509.1,0,540,0c30.9,0,55.95,32.54,55.95,98.64,0,50.3-32.4,128.39-47.89,162.85-3.13,6.96-12.99,6.96-16.12,0-15.49-34.45-47.89-112.54-47.89-162.85Z"/>
      <path fill="var(--color-horizon-violet)" d="M900.56,224.81c46.74-46.74,87.46-52.04,109.31-30.19,21.85,21.85,16.55,62.57-30.19,109.31-35.57,35.57-113.7,67.88-149.01,81.29-7.13,2.71-14.1-4.27-11.4-11.4,13.41-35.31,45.72-113.44,81.29-149.01Z"/>
      <path fill="var(--color-horizon-violet)" d="M100.32,303.93c-46.74-46.74-52.04-87.46-30.19-109.31,21.85-21.85,62.57-16.55,109.31,30.19,35.57,35.57,67.88,113.7,81.29,149.01,2.71,7.13-4.27,14.1-11.4,11.4-35.31-13.41-113.44-45.72-149.01-81.29Z"/>
    </svg>
  )
}

/* ── Bullseye + arrows icon ── */
function BullseyeIcon() {
  return (
    <svg className="goals-bullseye__icon" viewBox="0 0 100 70" fill="none" aria-hidden="true">
      {/* Outer ring */}
      <circle cx="50" cy="35" r="30" stroke="var(--color-horizon-violet)" strokeWidth="2.5" />
      {/* Middle ring */}
      <circle cx="50" cy="35" r="18" stroke="var(--color-horizon-violet)" strokeWidth="2.5" />
      {/* Bullseye fill */}
      <circle cx="50" cy="35" r="8"  fill="var(--color-horizon-violet)" />
      {/* Left arrow → pointing right into target */}
      <line x1="2"  y1="35" x2="20" y2="35" stroke="var(--color-horizon-violet)" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="14,29 21,35 14,41" stroke="var(--color-horizon-violet)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right arrow → pointing left into target */}
      <line x1="98" y1="35" x2="80" y2="35" stroke="var(--color-horizon-violet)" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="86,29 79,35 86,41" stroke="var(--color-horizon-violet)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Top tick */}
      <line x1="50" y1="1" x2="50" y2="8" stroke="var(--color-horizon-violet)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Sample data (will be replaced with Supabase queries) ── */
const SAMPLE_GOALS = [
  {
    id: 1,
    title: 'Run 3x Per Week',
    description: 'Run outside 3 times a week, for a month!',
    aka: 'Run 12 times in a month!',
    startDate: 'April 2, 2026',
    pausedDate: null,
    status: 'active',
    term: 'short',
    intensity: 2,
    progress: 75,
    progressMessage: 'Only 3 More Runs to Go!',
    values: ['Health', 'Commitment', 'Responsibility'],
  },
  {
    id: 2,
    title: 'Meal Prep 1/Week',
    description: 'Meal prep every week this month',
    aka: 'Make enough food to not eat out at all this month!',
    startDate: 'April 2, 2026',
    pausedDate: null,
    status: 'active',
    term: 'short',
    intensity: 4,
    progress: 75,
    progressMessage: '',
    values: ['Health', 'Commitment', 'Financial Responsibility'],
  },
  {
    id: 3,
    title: 'Learn Guitar',
    description: 'Practice guitar 20 minutes every day',
    aka: 'Get through the beginner course!',
    startDate: 'March 16, 2026',
    pausedDate: 'April 3',
    status: 'paused',
    term: 'short',
    intensity: 2,
    progress: 60,
    progressMessage: '',
    values: ['Creativity', 'Discipline', 'Growth'],
  },
]

const TERMS = [
  { key: 'short', label: 'Short Term' },
  { key: 'long',  label: 'Long Term' },
  { key: 'all',   label: 'All' },
]

export default function Goals() {
  const [termFilter,   setTermFilter]   = useState('short')
  const [statusFilter, setStatusFilter] = useState('active')

  const activeCount = SAMPLE_GOALS.filter(g => g.status === 'active').length
  const pausedCount = SAMPLE_GOALS.filter(g => g.status === 'paused').length

  const filtered = SAMPLE_GOALS.filter(g => {
    const termOk   = termFilter === 'all' || g.term === termFilter
    const statusOk = g.status === statusFilter
    return termOk && statusOk
  })

  return (
    <div className="goals-page">

      {/* ── App header ─────────────────────────── */}
      <header className="goals-header">
        <div className="goals-header__brand">
          <TrumiLogo />
          <span className="goals-header__wordmark">trumi</span>
        </div>
        <button className="goals-header__values-btn" aria-label="Your Values">
          {/* Diamond icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h12l4 6-10 13L2 9z" />
            <line x1="2" y1="9" x2="22" y2="9" />
          </svg>
          <span>Values</span>
        </button>
      </header>

      {/* ── Bullseye icon ───────────────────────── */}
      <div className="goals-bullseye" aria-hidden="true">
        <BullseyeIcon />
      </div>

      {/* ── Short Term / Long Term / All nav ────── */}
      <nav className="goals-term-nav" aria-label="Filter goals by term">
        {TERMS.map(({ key, label }, i) => (
          <span key={key} className="goals-term-nav__item">
            {i > 0 && <span className="goals-term-nav__sep" aria-hidden="true">|</span>}
            <button
              className={`goals-term-nav__btn${termFilter === key ? ' goals-term-nav__btn--active' : ''}`}
              onClick={() => setTermFilter(key)}
            >
              {label}
            </button>
          </span>
        ))}
      </nav>

      {/* ── Status tabs + scrollable cards area ── */}
      <div className="goals-content">

        {/* Tab row — aligned to bottom, sitting just above the border */}
        <div className="goals-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={statusFilter === 'active'}
            className={`goals-tab${statusFilter === 'active' ? ' goals-tab--selected' : ' goals-tab--dim'}`}
            onClick={() => setStatusFilter('active')}
          >
            <u>{activeCount}</u> Active Goals
          </button>
          <button
            role="tab"
            aria-selected={statusFilter === 'paused'}
            className={`goals-tab${statusFilter === 'paused' ? ' goals-tab--selected' : ' goals-tab--dim'}`}
            onClick={() => setStatusFilter('paused')}
          >
            <u>{pausedCount}</u> Paused Goals
          </button>
        </div>

        {/* Bordered card area */}
        <div className="goals-cards-area">
          {filtered.length === 0 ? (
            <p className="goals-empty">
              No {statusFilter} goals yet. Tap + to add one whenever you're ready.
            </p>
          ) : (
            <ul className="goals-cards-list">
              {filtered.map(goal => (
                <li key={goal.id}>
                  <GoalCard
                    {...goal}
                    onLogProgress={() => {}}
                    onLogSetback={() => {}}
                    onUnpause={() => {}}
                    onSettings={() => {}}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  )
}
