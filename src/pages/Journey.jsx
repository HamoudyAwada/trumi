import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import './Journey.css'

/* ── Assets (Figma node 652:5057) ─────────────────────────────────────────
   Map blocks (coin nodes)
──────────────────────────────────────────────────────────────────────────── */
const MAP_STAR  = 'https://www.figma.com/api/mcp/asset/49f42fe6-49f4-42f3-837d-fbb5ca7cc1fd'
const MAP_HEX_A = 'https://www.figma.com/api/mcp/asset/e51f36ec-41b9-4de1-a627-748c9859d33d'
const MAP_HEX_B = 'https://www.figma.com/api/mcp/asset/1d798633-d922-4498-aa7e-27cef9718458'
const MAP_HEX_C = 'https://www.figma.com/api/mcp/asset/c4420389-6c0f-4b7e-b9ae-fffce2a20173'
const MAP_HEX_D = 'https://www.figma.com/api/mcp/asset/1615d8d5-18a8-406e-a64e-0975e43daa95'
const MAP_HEX_E = 'https://www.figma.com/api/mcp/asset/57dc0dc0-b032-4c92-ab21-8a3e4d75bd61'

/* Connector path images (ordered top → bottom = path 0→1, 1→2, … 5→6) */
const CONN_A = 'https://www.figma.com/api/mcp/asset/c37dd538-e3c8-45ab-99ac-b7613b303c48'
const CONN_B = 'https://www.figma.com/api/mcp/asset/422bfd7a-b2d4-4086-9a48-3d7800c8f507'
const CONN_C = 'https://www.figma.com/api/mcp/asset/8e9f932b-959f-40b6-884b-82c5f812787b'
const CONN_D = 'https://www.figma.com/api/mcp/asset/570b38bb-da51-47da-bd05-17101e77dc07'
const CONN_E = 'https://www.figma.com/api/mcp/asset/c0338ec6-9b66-432b-8c9c-9d05aca4fbce'
const CONN_F = 'https://www.figma.com/api/mcp/asset/71bb04ba-f376-4442-8a7d-51a797576378'

/* Character illustrations */
const CHAR_LEFT      = 'https://www.figma.com/api/mcp/asset/632f9c7f-892c-4838-a3d9-dad7abc92571'
const CHAR_TOP_RIGHT = 'https://www.figma.com/api/mcp/asset/eae13101-56a7-486e-a1f2-a49bf54f9590'
const CHAR_MID_RIGHT = 'https://www.figma.com/api/mcp/asset/6f9b6302-3e8f-4cc0-9f87-5a34487a1c36'

/* ── Badge progression ─────────────────────────────────────────────────── */

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
    return { totalGoals: goals.length, streak, totalLoggedDays: allLoggedDays.size }
  } catch { return { totalGoals: 0, streak: 0, totalLoggedDays: 0 } }
}

// 6 badge checks — each badge unlocks the next node (node 0 always active)
const BADGE_CHECKS = [
  s => s.totalGoals >= 1,
  s => s.streak >= 3,
  () => false,
  s => s.totalLoggedDays >= 1,
  s => s.streak >= 7,
  () => false,
]

function countEarnedBadges(stats) {
  return BADGE_CHECKS.filter(check => check(stats)).length
}

/* ── Map layout data ───────────────────────────────────────────────────── */
// All positions are exact Figma inset values (top right bottom left)
// for a 326.902 × 943 container

const NODES = [
  { src: MAP_STAR,  inset: '8.17% 74% 84.52% 0%'          },  // 0 — star (always active)
  { src: MAP_HEX_A, inset: '22.77% 27.81% 69.91% 46.19%'  },  // 1
  { src: MAP_HEX_B, inset: '36.27% 36.07% 56.42% 37.93%'  },  // 2
  { src: MAP_HEX_C, inset: '53.98% 65.13% 38.71% 8.87%'   },  // 3
  { src: MAP_HEX_D, inset: '69.46% 1.81% 23.22% 72.19%'   },  // 4
  { src: MAP_HEX_D, inset: '81.12% 76.14% 11.56% -2.14%'  },  // 5
  { src: MAP_HEX_E, inset: '92.68% 7.31% 0% 66.69%'       },  // 6
]

// Connectors with exact Figma rotation + container-query sizing
// outer = bounding box inset; rotation, w, h = hypot dimensions; inner = image bleed
const CONNECTORS = [
  {
    src: CONN_A, outer: '15.78% 61.3% 74.2% 9.36%',
    rotation: '-12.77deg',
    w: 'hypot(81.889cqw, 18.8432cqh)', h: 'hypot(18.111cqw, 81.1568cqh)',
    inner: '-10.29% -10.04%',
  },
  {
    src: CONN_B, outer: '25.96% 0% 59.98% 59.54%',
    rotation: '-115.94deg',
    w: 'hypot(32.8863cqw, 67.4282cqh)', h: 'hypot(67.1137cqw, 32.5718cqh)',
    inner: '-8.19% -8.13%',
  },
  {
    src: CONN_C, outer: '41.94% 69.43% 46.72% 5.38%',
    rotation: '87.83deg',
    w: 'hypot(4.78059cqw, 97.2217cqh)', h: 'hypot(95.2194cqw, 2.77832cqh)',
    inner: '-10.31% -7.77% -10.3% -7.77%',
  },
  {
    src: CONN_D, outer: '59.88% 21.54% 30.58% 39.46%',
    rotation: '173.43deg',
    w: 'hypot(93.1062cqw, 15.1744cqh)', h: 'hypot(6.89379cqw, 84.8256cqh)',
    inner: '-10.52% -6.77%',
  },
  {
    src: CONN_E, outer: '67.27% 38.45% 14.99% 9.77%',
    rotation: '116.8deg',
    w: 'hypot(32.7798cqw, 65.6468cqh)', h: 'hypot(67.2202cqw, 34.3532cqh)',
    inner: '-6.34% -6.57%',
  },
  {
    src: CONN_F, outer: '85.73% 35.76% 5.35% 30.59%',
    rotation: '-13.31deg',
    w: 'hypot(86.7618cqw, 26.8252cqh)', h: 'hypot(13.2382cqw, 73.1748cqh)',
    inner: '-12.78% -8.25%',
  },
]

const LOCKED_FILTER = 'saturate(0.2) opacity(0.45)'

/* ── Map component ─────────────────────────────────────────────────────── */

function JourneyMap({ earned }) {
  return (
    <div className="jn-map">

      {/* Connectors rendered below nodes */}
      {CONNECTORS.map((c, i) => {
        const unlocked = earned >= i + 1
        return (
          <div
            key={i}
            className="jn-connector"
            style={{ inset: c.outer, filter: unlocked ? 'none' : LOCKED_FILTER }}
          >
            <div style={{
              flexShrink: 0,
              width: c.w,
              height: c.h,
              transform: `rotate(${c.rotation})`,
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: c.inner }}>
                <img src={c.src} alt="" aria-hidden="true" className="jn-fill-img" />
              </div>
            </div>
          </div>
        )
      })}

      {/* Character illustrations */}
      <div className="jn-char" style={{ inset: '28.63% 85.09% 59.14% 0.61%' }}>
        <img src={CHAR_LEFT} alt="" aria-hidden="true" className="jn-fill-img" />
      </div>
      <div className="jn-char" style={{ inset: '0% 1.19% 79.21% 70.05%' }}>
        <img src={CHAR_TOP_RIGHT} alt="" aria-hidden="true" className="jn-fill-img" />
      </div>
      <div className="jn-char" style={{ inset: '47.19% 1.19% 37.14% 75.86%' }}>
        <img src={CHAR_MID_RIGHT} alt="" aria-hidden="true" className="jn-fill-img" />
      </div>

      {/* Nodes rendered on top */}
      {NODES.map((node, i) => {
        const unlocked = earned >= i
        return (
          <div
            key={i}
            className="jn-node"
            style={{ inset: node.inset, filter: unlocked ? 'none' : LOCKED_FILTER }}
          >
            <img src={node.src} alt={`Milestone ${i + 1}`} className="jn-fill-img" />
          </div>
        )
      })}

    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function Journey() {
  const navigate = useNavigate()
  const stats    = loadStats()
  const earned   = countEarnedBadges(stats)
  const reached  = Math.min(7, earned + 1)

  return (
    <div className="jn-page">
      <PageHeader title="My Journey" />

      <div className="jn-content">
        <button className="jn-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className="jn-summary">
          <span className="jn-summary__count">{reached}</span>
          <span className="jn-summary__label"> / 7 milestones reached</span>
        </div>

        <JourneyMap earned={earned} />
      </div>
    </div>
  )
}
