import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
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
   Figma image assets — fetched from Figma MCP.
   URLs valid for 7 days.
   For production: save to /public/assets/ and
   update paths below.
───────────────────────────────────────────────── */

/* Journey Map assets — refreshed 2026-04-16 (expire after 7 days) */
const JM_COIN_FILLED  = 'https://www.figma.com/api/mcp/asset/7e13a82b-1c76-4e73-a8d9-4ff4ee06ca41'
const JM_COIN_ALT     = 'https://www.figma.com/api/mcp/asset/e8032e8c-d7ed-4a91-94ca-bb228ff4f6f5'
const JM_CONNECTOR_1  = 'https://www.figma.com/api/mcp/asset/46b9f14f-8c65-44db-b8c4-dcd9e8fb04c3'
const JM_CONNECTOR_2  = 'https://www.figma.com/api/mcp/asset/4e3ce6f3-7a71-45d3-91b0-7240e1da3837'
const JM_CONNECTOR_3  = 'https://www.figma.com/api/mcp/asset/374d4a70-5c68-4a51-af4f-861903cd536a'
const JM_CONNECTOR_4  = 'https://www.figma.com/api/mcp/asset/9453daf6-6688-45e1-b2f2-ebc3c84561cc'
const JM_STAR         = 'https://www.figma.com/api/mcp/asset/5b950663-0fe4-4c9c-a7d7-b8362426a38c'
const JM_POLYGON_2    = 'https://www.figma.com/api/mcp/asset/10fda037-433d-4a77-800c-ea19cf3257d8'
const JM_POLYGON_3    = 'https://www.figma.com/api/mcp/asset/a9371da9-b4ec-4789-84ae-7cb2e28712a0'

/* Badge assets */

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

/* ── Stat icons ───────────────────────────────── */

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

/* ── Journey Map ──────────────────────────────────
   Pixel-accurate recreation of Figma node 427-4673.
   Natural canvas: 305 × 100.815 px.
   All child positions are direct % insets from Figma.
   The canvas scales to fill its wrapper via aspect-ratio.
─────────────────────────────────────────────────── */

function JourneyMap() {
  return (
    /* Wrapper fills the box width; canvas maintains Figma proportions */
    <div className="ach-journey__wrapper">
      <div className="ach-journey__canvas">

        {/* ── Coin nodes ──────────────────────────────
            Figma inset order: top  right  bottom  left   */}

        {/* Node 1 — top-left filled coin
            inset-[8.71%_85.9%_56.54%_0] */}
        <div className="ach-journey__node"
          style={{ top:'8.71%', right:'85.9%', bottom:'56.54%', left:'0' }}>
          <img src={JM_COIN_FILLED} alt="Milestone 1" className="ach-journey__fill-img" />
        </div>

        {/* Node 2 — bottom coin (MapBlock1 — different angle variant)
            inset-[65.25%_72.13%_0_13.77%] */}
        <div className="ach-journey__node"
          style={{ top:'65.25%', right:'72.13%', bottom:'0', left:'13.77%' }}>
          <img src={JM_COIN_ALT} alt="Milestone 2" className="ach-journey__fill-img" />
        </div>

        {/* Node 3 — top-right filled coin
            inset-[8.71%_26.23%_56.54%_59.67%] */}
        <div className="ach-journey__node"
          style={{ top:'8.71%', right:'26.23%', bottom:'56.54%', left:'59.67%' }}>
          <img src={JM_COIN_FILLED} alt="Milestone 3" className="ach-journey__fill-img" />
        </div>

        {/* Node 4 — rightmost coin
            inset-[22.59%_0_42.65%_85.9%] */}
        <div className="ach-journey__node"
          style={{ top:'22.59%', right:'0', bottom:'42.65%', left:'85.9%' }}>
          <img src={JM_COIN_FILLED} alt="Milestone 4" className="ach-journey__fill-img" />
        </div>

        {/* ── Curved connectors ────────────────────── */}

        {/* Connector 1: node 1 → node 2 (curves down-right)
            inset-[49.38%_87.21%_30.79%_5.25%]
            inner bleed: inset-[-10%_-8.7%] */}
        <div className="ach-journey__connector"
          style={{ top:'49.38%', right:'87.21%', bottom:'30.79%', left:'5.25%' }}>
          <div className="ach-journey__connector-inner"
            style={{ top:'-10%', right:'-8.7%', bottom:'-10%', left:'-8.7%' }}>
            <img src={JM_CONNECTOR_1} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
        </div>

        {/* Connector 2: node 2 → node 3 (curves up-right)
            inset-[48.38%_38.52%_19.37%_31.64%]
            inner bleed: inset-[-6.15%_-2.2%] */}
        <div className="ach-journey__connector"
          style={{ top:'48.38%', right:'38.52%', bottom:'19.37%', left:'31.64%' }}>
          <div className="ach-journey__connector-inner"
            style={{ top:'-6.15%', right:'-2.2%', bottom:'-6.15%', left:'-2.2%' }}>
            <img src={JM_CONNECTOR_2} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
        </div>

        {/* Connector 3: node 3 → node 4 (top arc)
            inset-[0_3.61%_81.37%_74.75%]
            inner bleed: inset-[-10.65%_-3.03%] */}
        <div className="ach-journey__connector"
          style={{ top:'0', right:'3.61%', bottom:'81.37%', left:'74.75%' }}>
          <div className="ach-journey__connector-inner"
            style={{ top:'-10.65%', right:'-3.03%', bottom:'-10.65%', left:'-3.03%' }}>
            <img src={JM_CONNECTOR_3} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
        </div>

        {/* Connector 4: curved dashed tail off the last node.
            Figma uses CSS container queries (cqw/cqh) + hypot() to derive the
            pre-rotation natural dimensions of the path image, then rotates it
            into its final position. We replicate that exactly.
            inset-[62.27%_-0.31%_5.05%_86.23%]  containerType:size
            inner element: w=hypot(-82.09cqw,-48.01cqh)  h=hypot(17.91cqw,-51.99cqh)
            rotate: -155.82deg  bleed: inset-[-10.65%_-5.18%] */}
        <div
          className="ach-journey__connector ach-journey__connector--cq"
          style={{ top:'62.27%', right:'-0.31%', bottom:'5.05%', left:'86.23%',
                   overflow:'visible', display:'flex',
                   alignItems:'center', justifyContent:'center' }}
        >
          <div style={{
            flexShrink: 0,
            width:  'hypot(-82.0868cqw, -48.0086cqh)',
            height: 'hypot(17.9132cqw, -51.9914cqh)',
            transform: 'rotate(-155.82deg)',
            position: 'relative',
          }}>
            <div style={{ position:'absolute', top:'-10.65%', right:'-5.18%', bottom:'-10.65%', left:'-5.18%' }}>
              <img src={JM_CONNECTOR_4} alt="" aria-hidden="true" className="ach-journey__fill-img" />
            </div>
          </div>
        </div>

        {/* ── Decorations ──────────────────────────── */}

        {/* Star — between nodes 1 and 3 near top-left
            container: inset-[10.69%_86.62%_67.99%_0.98%]
            inner: inset-[1.38%_11.93%_6.73%_11.77%] */}
        <div className="ach-journey__decor"
          style={{ top:'10.69%', right:'86.62%', bottom:'67.99%', left:'0.98%' }}>
          <div className="ach-journey__decor-inner"
            style={{ top:'1.38%', right:'11.93%', bottom:'6.73%', left:'11.77%' }}>
            <img src={JM_STAR} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
        </div>

        {/* Polygon 2 — below node 2
            container: inset-[72.19%_74.64%_14.84%_16.72%]
            inner: inset-[-4.54%_1.44%_-12.14%_1.53%] */}
        <div className="ach-journey__decor"
          style={{ top:'72.19%', right:'74.64%', bottom:'14.84%', left:'16.72%' }}>
          <div className="ach-journey__decor-inner"
            style={{ top:'-4.54%', right:'1.44%', bottom:'-12.14%', left:'1.53%' }}>
            <img src={JM_POLYGON_2} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
        </div>

        {/* Polygon 3a — between nodes 1 and 3 (upper area)
            container: inset-[15.65%_28.74%_71.38%_62.62%]
            inner: inset-[-4.54%_1.44%_-12.14%_1.53%] */}
        <div className="ach-journey__decor"
          style={{ top:'15.65%', right:'28.74%', bottom:'71.38%', left:'62.62%' }}>
          <div className="ach-journey__decor-inner"
            style={{ top:'-4.54%', right:'1.44%', bottom:'-12.14%', left:'1.53%' }}>
            <img src={JM_POLYGON_3} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
        </div>

        {/* Polygon 3b — right side near node 4
            container: inset-[29.54%_2.51%_57.49%_88.85%]
            inner: inset-[-4.54%_1.44%_-12.14%_1.53%] */}
        <div className="ach-journey__decor"
          style={{ top:'29.54%', right:'2.51%', bottom:'57.49%', left:'88.85%' }}>
          <div className="ach-journey__decor-inner"
            style={{ top:'-4.54%', right:'1.44%', bottom:'-12.14%', left:'1.53%' }}>
            <img src={JM_POLYGON_3} alt="" aria-hidden="true" className="ach-journey__fill-img" />
          </div>
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

      {/* App Header */}
      <PageHeader title="Achievements" />

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
