import { useNavigate } from 'react-router-dom'
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
   Badge image assets — fetched from Figma MCP.
   These URLs are valid for 7 days.
   For production: save to /public/assets/badges/
   and update the paths below.
───────────────────────────────────────────────── */

// Badge background shells
const BG_OUTER_BLUE     = 'https://www.figma.com/api/mcp/asset/71123275-abcc-4d81-9c40-5e7ab882634c'
const BG_INNER_BLUE     = 'https://www.figma.com/api/mcp/asset/7ed3d33f-4db3-4e67-94a4-ccbe87ff62d2'
const BG_OUTER_ORANGE   = 'https://www.figma.com/api/mcp/asset/070a6585-28ef-4dd2-958c-66d58d24664a'
const BG_INNER_ORANGE   = 'https://www.figma.com/api/mcp/asset/8b9522c5-ef92-4566-b742-a8f498200c5d'
const BG_OUTER_PURPLE   = 'https://www.figma.com/api/mcp/asset/a7304804-3159-4e39-aa47-47c9e40597d6'
const BG_INNER_PURPLE   = 'https://www.figma.com/api/mcp/asset/69654cd1-c49b-4048-b76a-341d7fe447dd'
const BG_OUTER_INACTIVE = 'https://www.figma.com/api/mcp/asset/4e7d36ac-aad7-4d4a-9843-88066fd3d199'

// Badge icons
const ICON_TARGET        = 'https://www.figma.com/api/mcp/asset/ac0b099d-5857-4d41-b8f2-7288a4b17c21'
const ICON_FLAME         = 'https://www.figma.com/api/mcp/asset/24d15f61-e545-4616-a029-840992387580'
const ICON_FLAME_ELLIPSE = 'https://www.figma.com/api/mcp/asset/ee074580-5dbf-4844-bf57-82aa4e58c0ed'
const ICON_DUMBBELL      = 'https://www.figma.com/api/mcp/asset/262f77b2-62cf-4ae5-9099-1702487cf564'

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
    'gym-enthusiast': { outer: BG_OUTER_PURPLE,   inner: BG_INNER_PURPLE, pillBorder: null },
    'inactive':       { outer: BG_OUTER_INACTIVE, inner: null,            pillBorder: null },
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
        <div className="ach-badge__outer-wrap">
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

        {/* Streak Master icon — Flame + inner ellipse
            Figma: left-[27px] top-[30px] w-[34px] h-[40px]
            Inner ellipse: inset-[32.17%_18.58%_10.43%_20.93%] */}
        {variant === 'streak-master' && (
          <div className="ach-badge__icon ach-badge__icon--flame">
            <img src={ICON_FLAME} alt="Flame" className="ach-badge__flame-body" />
            <div className="ach-badge__flame-ellipse">
              <img src={ICON_FLAME_ELLIPSE} alt="" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Gym Enthusiast icon — Dumbbell
            Figma: left-[8px] top-[33px] w-[74.6px] h-[43.1px]
                   rotation: 3.92deg */}
        {variant === 'gym-enthusiast' && (
          <div className="ach-badge__icon ach-badge__icon--dumbbell">
            <img src={ICON_DUMBBELL} alt="Dumbbell" />
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

/* ── Shared header icons ──────────────────────── */

function TrumiLogo() {
  return (
    <svg className="ach-header__logo-mark" viewBox="0 0 1080 1080" fill="none" aria-hidden="true">
      <path fill="var(--color-horizon-violet)" d="M540,815.11c-167.07,0-328.6-50.77-454.82-142.95-21.21-15.49-25.85-45.25-10.36-66.46,15.49-21.21,45.25-25.85,66.46-10.36,110.06,80.38,251.66,124.65,398.72,124.65s288.71-44.26,398.71-124.64c21.21-15.5,50.97-10.87,66.46,10.34,15.5,21.21,10.87,50.97-10.34,66.46-126.17,92.19-287.7,142.96-454.83,142.96Z"/>
      <circle fill="var(--color-horizon-violet)" cx="540" cy="493.34" r="171.15"/>
      <path fill="var(--color-horizon-violet)" d="M540,870.61h0c-55.43,0-102.98,39.53-113.09,94.03l-16.15,87.05c-2.73,14.72,8.57,28.31,23.54,28.31h211.41c14.97,0,26.27-13.59,23.54-28.31l-16.15-87.05c-10.11-54.5-57.66-94.03-113.09-94.03Z"/>
      <path fill="var(--color-horizon-violet)" d="M484.05,98.64C484.05,32.54,509.1,0,540,0c30.9,0,55.95,32.54,55.95,98.64,0,50.3-32.4,128.39-47.89,162.85-3.13,6.96-12.99,6.96-16.12,0-15.49-34.45-47.89-112.54-47.89-162.85Z"/>
      <path fill="var(--color-horizon-violet)" d="M900.56,224.81c46.74-46.74,87.46-52.04,109.31-30.19,21.85,21.85,16.55,62.57-30.19,109.31-35.57,35.57-113.7,67.88-149.01,81.29-7.13,2.71-14.1-4.27-11.4-11.4,13.41-35.31,45.72-113.44,81.29-149.01Z"/>
      <path fill="var(--color-horizon-violet)" d="M100.32,303.93c-46.74-46.74-52.04-87.46-30.19-109.31,21.85-21.85,62.57-16.55,109.31,30.19,35.57,35.57,67.88,113.7,81.29,149.01,2.71,7.13-4.27,14.1-11.4,11.4-35.31-13.41-113.44-45.72-149.01-81.29Z"/>
    </svg>
  )
}

function StreakFlameIcon({ size = 22 }) {
  const h = Math.round(size * 1.32)
  return (
    <svg width={size} height={h} viewBox="0 0 22 29" fill="none" aria-hidden="true">
      <path d="M11 29C15.418 29 19 26.25 19 21.375C19 19.125 18.225 15.375 15.525 12.375C15.9 14.625 13.65 15.375 13.65 15.375C14.85 11.625 11.85 6.375 7.35 5.625C7.881 8.625 8.1 11.625 4.35 14.625C2.475 16.125 1.35 18.7185 1.35 21.375C1.35 26.25 6.582 29 11 29Z"
        fill="#FF8B0B" />
      <ellipse cx="11" cy="22.5" rx="5" ry="5.5" fill="#FFD060" opacity="0.75" />
    </svg>
  )
}

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

/* ── Journey Map ──────────────────────────────── */

function JourneyMap({ goalsCount }) {
  const achieved = Math.min(goalsCount, 3)

  const nodes = [
    { cx: 35,  cy: 52 },
    { cx: 120, cy: 80 },
    { cx: 215, cy: 38 },
    { cx: 298, cy: 68 },
  ]

  return (
    <svg className="ach-journey__svg" viewBox="0 0 335 115" fill="none" aria-label="Your journey map">
      <path d="M 53,52 C 72,52 100,80 120,80"
        stroke="var(--color-horizon-violet-300)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 138,80 C 160,80 192,38 215,38"
        stroke="var(--color-horizon-violet-300)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 233,38 C 254,38 276,68 298,68"
        stroke="var(--color-horizon-violet-300)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={achieved >= 3 ? '0' : '7,4'} />

      <polygon points="116,76 123,80 116,84" fill="var(--color-horizon-violet-300)" />
      <polygon points="211,34 218,38 211,42" fill="var(--color-horizon-violet-300)" />
      <polygon points="294,64 301,68 294,72" fill="var(--color-horizon-violet-300)" />

      <polygon
        points="83,18 85,24 91,24 86,28 88,34 83,30 78,34 80,28 75,24 81,24"
        fill="var(--color-horizon-violet-300)" opacity="0.65" />
      <polygon
        points="186,88 190,95 186,102 182,95"
        fill="var(--color-horizon-violet-300)" opacity="0.5" />
      <polygon
        points="258,22 261,27 258,32 255,27"
        fill="var(--color-horizon-violet-300)" opacity="0.5" />

      {nodes.map((node, i) => {
        const isAchieved = i < achieved
        return (
          <g key={i}>
            {isAchieved ? (
              <>
                <circle cx={node.cx} cy={node.cy} r="18" fill="var(--color-horizon-violet)" />
                <circle cx={node.cx} cy={node.cy} r="12" fill="var(--color-horizon-violet-300)" />
                <circle cx={node.cx} cy={node.cy} r="5"  fill="var(--color-cloud)" />
              </>
            ) : (
              <>
                <circle cx={node.cx} cy={node.cy} r="18"
                  stroke="var(--color-horizon-violet-300)" strokeWidth="2"
                  strokeDasharray="5,3" fill="var(--color-horizon-violet-50)" />
                <circle cx={node.cx} cy={node.cy} r="12" fill="var(--color-horizon-violet-100)" />
              </>
            )}
          </g>
        )
      })}
    </svg>
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

      {/* App Header */}
      <div className="ach-header">
        <div className="ach-header__brand">
          <TrumiLogo />
          <span className="ach-header__wordmark">trumi</span>
        </div>
      </div>

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
            <StreakFlameIcon size={22} />
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
      <div className="ach-badges-box">
        <div className="ach-badges-row">
          <AchievementBadge variant="goal-setter"    count={stats.totalGoals} />
          <AchievementBadge variant="streak-master"  count={stats.streak} />
          <AchievementBadge variant="gym-enthusiast" />
        </div>
      </div>

      <button
        className="ach-view-all-btn"
        onClick={() => {/* TODO: navigate to full achievements list */}}
      >
        View All Achievements
      </button>

      {/* ── My Journey ── */}
      <h2 className="ach-page__heading">My Journey</h2>
      <div className="ach-journey-box">
        <JourneyMap goalsCount={stats.totalGoals} />
      </div>

    </div>
  )
}
