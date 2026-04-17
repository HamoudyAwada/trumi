import { useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import './Values.css'

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
      <PageHeader title="My Values" />

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
