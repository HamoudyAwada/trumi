import { useNavigate } from 'react-router-dom'
import FlameIcon from '../components/ui/FlameIcon'
import './Achievements.css'

/* ── Data helpers ─────────────────────────────── */

function loadGoals() {
  try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
}

function computeStats(goals) {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const active = goals.filter(g => !g.paused)
  const allLoggedDays = new Set(goals.flatMap(g => g.loggedDays || []))

  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const k = d.toISOString().split('T')[0]
    if (allLoggedDays.has(k)) streak++
    else if (i > 0) break
  }

  const loggedTodayCount = goals.filter(g => (g.loggedDays || []).includes(todayStr)).length
  const weeklyAchieved = goals.some(g =>
    (g.loggedDays || []).some(d => d >= weekStartStr)
  )

  return {
    totalGoals:   goals.length,
    activeGoals:  active.length,
    streak,
    loggedToday:  loggedTodayCount,
    weeklyAchieved,
  }
}

/* ─────────────────────────────────────────────────
   Figma image assets — saved in /public/assets/figma
───────────────────────────────────────────────── */

/* Journey Map — Figma node 427:4673 (single flattened image) */
const JOURNEY_MAP = '/assets/figma/achievements/journey-map.svg'

/* Badge assets — Figma node 400:2977 */
const BG_OUTER_BLUE     = '/assets/figma/badges/outer-blue.svg'
const BG_INNER_BLUE     = '/assets/figma/badges/inner-blue.svg'
const BG_OUTER_ORANGE   = '/assets/figma/badges/outer-orange.svg'
const BG_INNER_ORANGE   = '/assets/figma/badges/inner-orange.svg'
// Gym Enthusiast and Inactive are single flattened badges in Figma (shell + icon)
const BADGE_GYM         = '/assets/figma/badges/gym-enthusiast.svg'
const BADGE_INACTIVE    = '/assets/figma/badges/inactive.svg'
const ICON_TARGET       = '/assets/figma/badges/icon-target.svg'
const ICON_FLAME        = '/assets/figma/badges/icon-fire.svg'

/* ─────────────────────────────────────────────────
   AchievementBadge
   Pixel-accurate recreation of the Figma component.
   Container: 90×115 px — all child positions match
   the Figma spec exactly.
───────────────────────────────────────────────── */

function AchievementBadge({ variant, count }) {
  // variant: 'goal-setter' | 'streak-master' | 'gym-enthusiast' | 'inactive'

  const SHELL = {
    'goal-setter':    { outer: BG_OUTER_BLUE,     inner: BG_INNER_BLUE,   pillBorder: '#0f1c3f' },
    'streak-master':  { outer: BG_OUTER_ORANGE,   inner: BG_INNER_ORANGE, pillBorder: '#ff8b0b' },
    'gym-enthusiast': { outer: BADGE_GYM,         inner: null,            pillBorder: null, full: true },
    'inactive':       { outer: BADGE_INACTIVE,    inner: null,            pillBorder: null, full: true },
  }[variant]

  const LABEL = {
    'goal-setter':    ['Goal', 'Setter'],
    'streak-master':  ['Streak', 'Master'],
    'gym-enthusiast': ['Gym', 'Enthusiast'],
    'inactive':       ['Locked', ''],
  }[variant]

  const showPill = SHELL.pillBorder !== null && count !== undefined

  return (
    <div className="ach-badge">
      <div className="ach-badge__container">

        {/* Outer shell — fills the badge silhouette
            Figma: inset-[1.26%_0_1.42%_0] of 90×115 */}
        <div className={`ach-badge__outer-wrap${SHELL.full ? ' ach-badge__outer-wrap--full' : ''}`}>
          <img src={SHELL.outer} alt="" aria-hidden="true" className="ach-badge__bg-img" />
        </div>

        {/* Inner shell — positioned exactly at Figma spec
            Figma: left-[13px] top-[12.5px] w-[63px] h-[88px]
                   inner inset: 0.87%_0_0.98%_0 */}
        {SHELL.inner && (
          <div className="ach-badge__inner-wrap">
            <img src={SHELL.inner} alt="" aria-hidden="true" className="ach-badge__bg-img" />
          </div>
        )}

        {/* Goal Setter icon — Target
            Figma: inset-[20.87%_21.11%_33.04%_20%] of 90×115
            → top:24px  left:18px  width:53px  height:53px */}
        {variant === 'goal-setter' && (
          <div className="ach-badge__icon ach-badge__icon--target">
            <img src={ICON_TARGET} alt="Target" />
          </div>
        )}

        {/* Streak Master icon — Fire
            Figma: left-[27px] top-[30px] w-[34px] h-[40px] */}
        {variant === 'streak-master' && (
          <div className="ach-badge__icon ach-badge__icon--flame">
            <img src={ICON_FLAME} alt="Flame" className="ach-badge__flame-body" />
          </div>
        )}


        {/* Count pill
            Figma: top-[77px] left-[20px] w-[50px] h-[19px]
                   border-b-3 border-solid, rounded-[25px] */}
        {showPill && (
          <div
            className="ach-badge__pill"
            style={{ borderBottomColor: SHELL.pillBorder }}
          >
            <span className="ach-badge__pill-num">{count}</span>
          </div>
        )}

      </div>

      {/* Label below the badge */}
      <p className="ach-badge__name">
        {LABEL[0]}{LABEL[1] ? <><br />{LABEL[1]}</> : null}
      </p>
    </div>
  )
}

/* ── Stat icons ───────────────────────────────── */


function DumbbellStatIcon({ size = 26 }) {
  return (
    <svg width={size} height={Math.round(size * 0.63)} viewBox="0 0 44 28" fill="none" aria-hidden="true">
      <rect x="0" y="6" width="9" height="16" rx="3" fill="var(--color-horizon-violet)" />
      <rect x="8" y="2" width="5" height="24" rx="2.5" fill="var(--color-horizon-violet)" />
      <rect x="13" y="11" width="18" height="6" rx="3" fill="var(--color-horizon-violet)" />
      <rect x="31" y="2" width="5" height="24" rx="2.5" fill="var(--color-horizon-violet)" />
      <rect x="35" y="6" width="9" height="16" rx="3" fill="var(--color-horizon-violet)" />
    </svg>
  )
}

function CalendarStatIcon({ day }) {
  return (
    <svg width="28" height="30" viewBox="0 0 28 30" fill="none" aria-hidden="true">
      <rect x="0.75" y="4.75" width="26.5" height="24.5" rx="3.25" fill="white" stroke="var(--color-tranquil-night)" strokeWidth="1.5" />
      <rect x="0.75" y="4.75" width="26.5" height="8" rx="3.25" fill="#FF4646" />
      <rect x="0.75" y="9.25" width="26.5" height="3.5" fill="#FF4646" />
      <rect x="6.5" y="0" width="3.5" height="7.5" rx="1.75" fill="var(--color-tranquil-night)" />
      <rect x="18" y="0" width="3.5" height="7.5" rx="1.75" fill="var(--color-tranquil-night)" />
      <text x="14" y="25" textAnchor="middle"
        fontFamily="Lexend, sans-serif" fontWeight="500" fontSize="11"
        fill="var(--color-tranquil-night)">
        {day}
      </text>
    </svg>
  )
}

/* ── Journey Map ──────────────────────────────────
   Figma node 427-4673, exported as one image.
   Natural canvas: 305 × 100.815 px.
   The canvas scales to fill its wrapper via aspect-ratio.
─────────────────────────────────────────────────── */

function JourneyMap() {
  return (
    /* Wrapper fills the box width; canvas maintains Figma proportions */
    <div className="ach-journey__wrapper">
      <div className="ach-journey__canvas">
        {/* Figma: inset-[-1.98%_0_0_0] */}
        <div className="ach-journey__node" style={{ top: '-1.98%', right: 0, bottom: 0, left: 0 }}>
          <img src={JOURNEY_MAP} alt="" aria-hidden="true" className="ach-journey__fill-img" />
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────── */

export default function Achievements() {
  const navigate = useNavigate()
  const goals        = loadGoals()
  const stats        = computeStats(goals)
  const calendarDay  = new Date().getDate()

  return (
    <div className="ach-page">



      {/* ── Goals Summary ── */}
      <section className="ach-section">
        <h2 className="ach-section__heading">Goals Summary</h2>
        <div className="ach-stats-grid">

          <div className="ach-stat-card ach-stat-card--text-only">
            <span className="ach-stat-card__label">
              {stats.loggedToday}/{stats.activeGoals || stats.totalGoals} Tasks Complete
            </span>
          </div>

          <div className="ach-stat-card">
            <DumbbellStatIcon size={26} />
            <div className="ach-stat-card__stacked">
              <span>{stats.loggedToday > 0 ? 'Goal' : 'No Goals'}</span>
              <span>{stats.loggedToday > 0 ? 'Logged' : 'Logged Today'}</span>
            </div>
          </div>

          <div className="ach-stat-card">
            <FlameIcon active size={28} />
            <span className="ach-stat-card__label">
              <strong>{stats.streak}</strong> Day Streak
            </span>
          </div>

          <div className="ach-stat-card">
            <CalendarStatIcon day={calendarDay} />
            <div className="ach-stat-card__stacked">
              <span>Weekly Goal</span>
              <strong>{stats.weeklyAchieved ? 'Achieved' : 'In Progress'}</strong>
            </div>
          </div>

        </div>
      </section>

      {/* ── Achievements ── */}
      <h2 className="ach-page__heading">Achievements</h2>
      <div className="ach-badges-box" onClick={() => navigate('/badges')} style={{ cursor: 'pointer' }}>
        <div className="ach-badges-row">
          <AchievementBadge variant="goal-setter"    count={stats.totalGoals} />
          <AchievementBadge variant="streak-master"  count={stats.streak} />
          <AchievementBadge variant="gym-enthusiast" />
        </div>
      </div>

      <button
        className="ach-view-all-btn"
        onClick={() => navigate('/badges')}
      >
        View All Achievements
      </button>

      {/* ── My Journey ── */}
      <h2 className="ach-page__heading">My Journey</h2>
      <div
        className="ach-journey-box"
        onClick={() => navigate('/journey')}
        style={{ cursor: 'pointer' }}
      >
        <JourneyMap />
      </div>

    </div>
  )
}
