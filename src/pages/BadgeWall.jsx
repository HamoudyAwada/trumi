import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import './BadgeWall.css'

/* ── Badge image assets ──────────────────────────────────────────────────── */

const BG_OUTER_BLUE     = 'https://www.figma.com/api/mcp/asset/71123275-abcc-4d81-9c40-5e7ab882634c'
const BG_INNER_BLUE     = 'https://www.figma.com/api/mcp/asset/7ed3d33f-4db3-4e67-94a4-ccbe87ff62d2'
const BG_OUTER_ORANGE   = 'https://www.figma.com/api/mcp/asset/070a6585-28ef-4dd2-958c-66d58d24664a'
const BG_INNER_ORANGE   = 'https://www.figma.com/api/mcp/asset/8b9522c5-ef92-4566-b742-a8f498200c5d'
const BG_OUTER_PURPLE   = 'https://www.figma.com/api/mcp/asset/a7304804-3159-4e39-aa47-47c9e40597d6'
const BG_INNER_PURPLE   = 'https://www.figma.com/api/mcp/asset/69654cd1-c49b-4048-b76a-341d7fe447dd'
const BG_OUTER_INACTIVE = 'https://www.figma.com/api/mcp/asset/4e7d36ac-aad7-4d4a-9843-88066fd3d199'
const ICON_TARGET        = 'https://www.figma.com/api/mcp/asset/ac0b099d-5857-4d41-b8f2-7288a4b17c21'
const ICON_FLAME         = 'https://www.figma.com/api/mcp/asset/24d15f61-e545-4616-a029-840992387580'
const ICON_FLAME_ELLIPSE = 'https://www.figma.com/api/mcp/asset/ee074580-5dbf-4844-bf57-82aa4e58c0ed'
const ICON_DUMBBELL      = 'https://www.figma.com/api/mcp/asset/262f77b2-62cf-4ae5-9099-1702487cf564'

/* ── Data ────────────────────────────────────────────────────────────────── */

function loadStats() {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    const today = new Date()
    const allLoggedDays = new Set(goals.flatMap(g => g.loggedDays ?? []))

    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (allLoggedDays.has(d.toISOString().split('T')[0])) streak++
      else if (i > 0) break
    }

    return {
      totalGoals: goals.length,
      streak,
      totalLoggedDays: allLoggedDays.size,
    }
  } catch {
    return { totalGoals: 0, streak: 0, totalLoggedDays: 0 }
  }
}

/* ── Badge definitions ───────────────────────────────────────────────────── */
// Logic placeholders — full trigger conditions will be added later.

const BADGE_DEFS = [
  {
    id:          'goal-setter',
    name:        'Goal Setter',
    description: 'Create your first goal',
    shell:       'blue',
    icon:        'target',
    pillColor:   '#0f1c3f',
    earned:      s => s.totalGoals >= 1,
    count:       s => s.totalGoals,
  },
  {
    id:          'streak-master',
    name:        'Streak Master',
    description: 'Log a goal 3 days in a row',
    shell:       'orange',
    icon:        'flame',
    pillColor:   '#ff8b0b',
    earned:      s => s.streak >= 3,
    count:       s => s.streak,
  },
  {
    id:          'gym-enthusiast',
    name:        'Gym Enthusiast',
    description: 'Coming soon',
    shell:       'purple',
    icon:        'dumbbell',
    pillColor:   null,
    earned:      () => false,
    count:       () => undefined,
  },
  {
    id:          'first-step',
    name:        'First Step',
    description: 'Log your very first entry',
    shell:       'locked',
    icon:        null,
    pillColor:   null,
    earned:      s => s.totalLoggedDays >= 1,
    count:       () => undefined,
  },
  {
    id:          'week-warrior',
    name:        'Week Warrior',
    description: 'Log every day for a full week',
    shell:       'locked',
    icon:        null,
    pillColor:   null,
    earned:      s => s.streak >= 7,
    count:       () => undefined,
  },
  {
    id:          'committed',
    name:        'Committed',
    description: 'Keep a goal active for 30 days',
    shell:       'locked',
    icon:        null,
    pillColor:   null,
    earned:      () => false,
    count:       () => undefined,
  },
  {
    id:          'reflective',
    name:        'Reflective',
    description: 'Complete 10 journal entries',
    shell:       'locked',
    icon:        null,
    pillColor:   null,
    earned:      () => false,
    count:       () => undefined,
  },
  {
    id:          'multi-goal',
    name:        'Overachiever',
    description: 'Track 3 goals at once',
    shell:       'locked',
    icon:        null,
    pillColor:   null,
    earned:      s => s.totalGoals >= 3,
    count:       () => undefined,
  },
  {
    id:          'legend',
    name:        'Legend',
    description: 'Reach a 30-day streak',
    shell:       'locked',
    icon:        null,
    pillColor:   null,
    earned:      s => s.streak >= 30,
    count:       () => undefined,
  },
]

/* ── BadgeTile ───────────────────────────────────────────────────────────── */

function BadgeTile({ def, stats }) {
  const isEarned = def.earned(stats)
  const count    = def.count(stats)
  const showPill = def.pillColor !== null && count !== undefined && isEarned

  // Pick shell images
  const shells = {
    blue:   { outer: BG_OUTER_BLUE,   inner: BG_INNER_BLUE   },
    orange: { outer: BG_OUTER_ORANGE, inner: BG_INNER_ORANGE },
    purple: { outer: BG_OUTER_PURPLE, inner: BG_INNER_PURPLE },
    locked: { outer: BG_OUTER_INACTIVE, inner: null          },
  }
  const shell = isEarned ? shells[def.shell] : shells.locked

  return (
    <div className={`bw-tile${isEarned ? ' bw-tile--earned' : ' bw-tile--locked'}`}>
      <div className="bw-tile__badge">

        <div className="bw-tile__outer-wrap">
          <img src={shell.outer} alt="" aria-hidden="true" className="bw-tile__bg-img" />
        </div>

        {shell.inner && (
          <div className="bw-tile__inner-wrap">
            <img src={shell.inner} alt="" aria-hidden="true" className="bw-tile__bg-img" />
          </div>
        )}

        {isEarned && def.icon === 'target' && (
          <div className="bw-tile__icon bw-tile__icon--target">
            <img src={ICON_TARGET} alt="" aria-hidden="true" />
          </div>
        )}

        {isEarned && def.icon === 'flame' && (
          <div className="bw-tile__icon bw-tile__icon--flame">
            <img src={ICON_FLAME} alt="" aria-hidden="true" className="bw-tile__flame-body" />
            <div className="bw-tile__flame-ellipse">
              <img src={ICON_FLAME_ELLIPSE} alt="" aria-hidden="true" />
            </div>
          </div>
        )}

        {isEarned && def.icon === 'dumbbell' && (
          <div className="bw-tile__icon bw-tile__icon--dumbbell">
            <img src={ICON_DUMBBELL} alt="" aria-hidden="true" />
          </div>
        )}

        {!isEarned && (
          <div className="bw-tile__lock" aria-hidden="true">
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <rect x="2" y="10" width="16" height="13" rx="3" fill="#b0b0c0" />
              <path d="M5 10V7a5 5 0 0 1 10 0v3" stroke="#b0b0c0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        )}

        {showPill && (
          <div className="bw-tile__pill" style={{ borderBottomColor: def.pillColor }}>
            <span className="bw-tile__pill-num">{count}</span>
          </div>
        )}

      </div>

      <p className="bw-tile__name">{def.name}</p>
      <p className="bw-tile__desc">{def.description}</p>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function BadgeWall() {
  const navigate = useNavigate()
  const stats    = loadStats()

  const earned = BADGE_DEFS.filter(d => d.earned(stats))
  const locked = BADGE_DEFS.filter(d => !d.earned(stats))

  return (
    <div className="bw-page">
      <PageHeader title="Achievements" />

      <div className="bw-content">

        {/* Earned count pill */}
        <div className="bw-summary">
          <span className="bw-summary__count">{earned.length}</span>
          <span className="bw-summary__label"> / {BADGE_DEFS.length} badges earned</span>
        </div>

        {/* Earned badges */}
        {earned.length > 0 && (
          <section className="bw-section">
            <h2 className="bw-section__heading">Earned</h2>
            <div className="bw-grid">
              {earned.map(def => (
                <BadgeTile key={def.id} def={def} stats={stats} />
              ))}
            </div>
          </section>
        )}

        {/* Locked badges */}
        {locked.length > 0 && (
          <section className="bw-section">
            <h2 className="bw-section__heading">Locked</h2>
            <div className="bw-grid">
              {locked.map(def => (
                <BadgeTile key={def.id} def={def} stats={stats} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {earned.length === 0 && (
          <p className="bw-empty">
            Start logging your goals to earn your first badge.
          </p>
        )}

      </div>
    </div>
  )
}
