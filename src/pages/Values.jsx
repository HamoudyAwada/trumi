import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Values.css'

/* ── Trumi logo mark (same as Goals.jsx) ── */
function TrumiLogo() {
  return (
    <svg className="values-header__logo-mark" viewBox="0 0 1080 1080" fill="none" aria-hidden="true">
      <path fill="var(--color-horizon-violet)" d="M540,815.11c-167.07,0-328.6-50.77-454.82-142.95-21.21-15.49-25.85-45.25-10.36-66.46,15.49-21.21,45.25-25.85,66.46-10.36,110.06,80.38,251.66,124.65,398.72,124.65s288.71-44.26,398.71-124.64c21.21-15.5,50.97-10.87,66.46,10.34,15.5,21.21,10.87,50.97-10.34,66.46-126.17,92.19-287.7,142.96-454.83,142.96Z"/>
      <circle fill="var(--color-horizon-violet)" cx="540" cy="493.34" r="171.15"/>
      <path fill="var(--color-horizon-violet)" d="M540,870.61h0c-55.43,0-102.98,39.53-113.09,94.03l-16.15,87.05c-2.73,14.72,8.57,28.31,23.54,28.31h211.41c14.97,0,26.27-13.59,23.54-28.31l-16.15-87.05c-10.11-54.5-57.66-94.03-113.09-94.03Z"/>
      <path fill="var(--color-horizon-violet)" d="M484.05,98.64C484.05,32.54,509.1,0,540,0c30.9,0,55.95,32.54,55.95,98.64,0,50.3-32.4,128.39-47.89,162.85-3.13,6.96-12.99,6.96-16.12,0-15.49-34.45-47.89-112.54-47.89-162.85Z"/>
      <path fill="var(--color-horizon-violet)" d="M900.56,224.81c46.74-46.74,87.46-52.04,109.31-30.19,21.85,21.85,16.55,62.57-30.19,109.31-35.57,35.57-113.7,67.88-149.01,81.29-7.13,2.71-14.1-4.27-11.4-11.4,13.41-35.31,45.72-113.44,81.29-149.01Z"/>
      <path fill="var(--color-horizon-violet)" d="M100.32,303.93c-46.74-46.74-52.04-87.46-30.19-109.31,21.85-21.85,62.57-16.55,109.31,30.19,35.57,35.57,67.88,113.7,81.29,149.01,2.71,7.13-4.27,14.1-11.4,11.4-35.31-13.41-113.44-45.72-149.01-81.29Z"/>
    </svg>
  )
}

/* ── 4-pointed sparkle star ── */
function Sparkle({ size = 16 }) {
  const h = size / 2
  const t = h * 0.18
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <path
        d={`M${h},0 L${h + t},${h - t} L${size},${h} L${h + t},${h + t} L${h},${size} L${h - t},${h + t} L0,${h} L${h - t},${h - t} Z`}
        fill="var(--color-horizon-violet-200)"
      />
    </svg>
  )
}

/* ── Diamond gem illustration (paths derived from the Figma diamond shape) ── */
function DiamondIllustration() {
  return (
    <div className="values-hero__diamond-wrap" aria-hidden="true">
      {/* Left sparkle (flipped) */}
      <span className="values-hero__sparkle values-hero__sparkle--left">
        <Sparkle size={30} />
      </span>
      {/* Right sparkle */}
      <span className="values-hero__sparkle values-hero__sparkle--right">
        <Sparkle size={22} />
      </span>
      {/* Small accent sparkles */}
      <span className="values-hero__sparkle values-hero__sparkle--top-right-sm">
        <Sparkle size={11} />
      </span>
      <span className="values-hero__sparkle values-hero__sparkle--left-sm">
        <Sparkle size={18} />
      </span>

      {/* Diamond gem — same proportions as the diamond in the Values button, scaled 3× */}
      <svg className="values-hero__gem" viewBox="0 0 120 68" fill="none">
        {/* Outer facets */}
        <path
          d="M36,0 H84 L106,22 L60,66 L14,22 Z"
          fill="var(--color-horizon-violet-100)"
          stroke="var(--color-horizon-violet)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center facet (inner kite) */}
        <path
          d="M80,22 L60,66 L40,22 L60,0 Z"
          fill="var(--color-horizon-violet-50)"
          stroke="var(--color-horizon-violet-400)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Girdle — horizontal dividing line */}
        <line
          x1="14" y1="22" x2="106" y2="22"
          stroke="var(--color-horizon-violet-300)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/* ── Alignment trend icon — 3 variants ── */
function AlignmentTrend({ trend }) {
  if (trend === 'up') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Improving alignment">
        <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="3.25" stroke="var(--color-horizon-violet-200)" strokeWidth="1"/>
        <polyline
          points="3,18 8,13 13,15 21,7"
          stroke="#4a9d6f"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="7" r="1.5" fill="#4a9d6f"/>
      </svg>
    )
  }
  if (trend === 'down') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Declining alignment">
        <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="3.25" stroke="var(--color-horizon-violet-200)" strokeWidth="1"/>
        <polyline
          points="3,7 8,11 13,9 21,18"
          stroke="#c05555"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="18" r="1.5" fill="#c05555"/>
      </svg>
    )
  }
  /* stable */
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Stable alignment">
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="3.25" stroke="var(--color-horizon-violet-200)" strokeWidth="1"/>
      <polyline
        points="3,13 8,11 13,13 21,11"
        stroke="var(--color-horizon-violet-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="11" r="1.5" fill="var(--color-horizon-violet-400)"/>
    </svg>
  )
}

/* ── Chevron icon ── */
function ChevronIcon({ open }) {
  return (
    <svg
      className={`values-row__chevron${open ? ' values-row__chevron--open' : ''}`}
      width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
    >
      <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="var(--color-horizon-violet)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Individual value row ── */
function ValueRow({ name, trend, expanded, onToggle }) {
  return (
    <div className="values-row">
      <button className="values-row__head" onClick={onToggle} aria-expanded={expanded}>
        <span className="values-row__name">{name}</span>
        <div className="values-row__meta">
          <span className="values-row__label">Recent Alignment:</span>
          <AlignmentTrend trend={trend} />
        </div>
        <ChevronIcon open={expanded} />
      </button>
      {/* Expanded detail — body content comes in a follow-up design */}
      {expanded && (
        <div className="values-row__body">
          {/* placeholder — expanded value detail view to be added */}
        </div>
      )}
    </div>
  )
}

/* ── Sample data (will be replaced with user's stored onboarding values) ── */
const PRIORITY_VALUES = [
  { name: 'Peace',      trend: 'stable' },
  { name: 'Connection', trend: 'down'   },
  { name: 'Integrity',  trend: 'up'     },
]

const OTHER_VALUES = [
  { name: 'Friendship',     trend: 'stable' },
  { name: 'Responsibility', trend: 'up'     },
  { name: 'Adventure',      trend: 'down'   },
  { name: 'Health',         trend: 'stable' },
  { name: 'Family',         trend: 'stable' },
  { name: 'Leadership',     trend: 'up'     },
  { name: 'Freedom',        trend: 'down'   },
]

/* ══════════════════════════════════════════════════════════
   Values page
   ══════════════════════════════════════════════════════════ */
export default function Values() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null) // 'section-index' string key

  function toggleRow(key) {
    setExpanded(prev => prev === key ? null : key)
  }

  return (
    <div className="values-page">

      {/* ── App header ── */}
      <header className="values-header">
        <div className="values-header__brand">
          <TrumiLogo />
          <span className="values-header__wordmark">trumi</span>
        </div>

        {/* Goals nav button — mirrors the diamond Values btn on Goals page */}
        <button
          className="values-header__goals-btn"
          aria-label="Go to Goals"
          onClick={() => navigate('/goals')}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="9.5" stroke="var(--color-horizon-violet)" strokeWidth="1.5"/>
            <circle cx="11" cy="11" r="5.5" stroke="var(--color-horizon-violet)" strokeWidth="1.5"/>
            <circle cx="11" cy="11" r="2.2" fill="var(--color-horizon-violet)"/>
          </svg>
          <span className="values-header__goals-label">Goals</span>
        </button>
      </header>

      {/* Scrollable body */}
      <div className="values-scroll">

        {/* ── Diamond hero + title ── */}
        <div className="values-hero">
          <DiamondIllustration />
          <h1 className="values-title">My Values</h1>
        </div>

        {/* ── Values cloud ── */}
        <div className="values-cloud">
          {/* Row 1 — top 3 priority values: larger, violet-filled */}
          <div className="values-cloud__row">
            {PRIORITY_VALUES.map(v => (
              <span key={v.name} className="values-chip values-chip--priority">{v.name}</span>
            ))}
          </div>

          {/* Row 2 — next 3 */}
          <div className="values-cloud__row">
            {OTHER_VALUES.slice(0, 3).map(v => (
              <span key={v.name} className="values-chip">{v.name}</span>
            ))}
          </div>

          {/* Row 3 — remaining */}
          <div className="values-cloud__row">
            {OTHER_VALUES.slice(3).map(v => (
              <span key={v.name} className="values-chip">{v.name}</span>
            ))}
          </div>
        </div>

        {/* ── Goals-Values Alignment section ── */}
        <p className="values-alignment-heading">Goals-Values Alignment</p>

        <div className="values-list">

          {/* Section 1: Priority values (top 3) */}
          <div className="values-list__section">
            {PRIORITY_VALUES.map((v, i) => (
              <ValueRow
                key={v.name}
                name={v.name}
                trend={v.trend}
                expanded={expanded === `p-${i}`}
                onToggle={() => toggleRow(`p-${i}`)}
              />
            ))}
          </div>

          <div className="values-list__divider" />

          {/* Section 2: All other values */}
          <div className="values-list__section">
            {OTHER_VALUES.map((v, i) => (
              <ValueRow
                key={v.name}
                name={v.name}
                trend={v.trend}
                expanded={expanded === `o-${i}`}
                onToggle={() => toggleRow(`o-${i}`)}
              />
            ))}
          </div>

        </div>

        {/* bottom breathing room above the nav bar */}
        <div className="values-bottom-spacer" />

      </div>
    </div>
  )
}
