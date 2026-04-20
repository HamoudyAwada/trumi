import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TrumiCharacter from '../components/character/TrumiCharacter'
import { DEFAULT_CHARACTER } from '../components/character/characterAssets'
import GoalCard from '../components/goals/GoalCard'
import './Home.css'

const BULLSEYE_IMG = '/assets/Bullseye and Arrows.svg'

/* ── Figma asset URLs (valid 7 days from Apr 17 2026) ─────────────────────── */

// Journey map
const JM_COIN_FILLED = 'https://www.figma.com/api/mcp/asset/7e13a82b-1c76-4e73-a8d9-4ff4ee06ca41'
const JM_COIN_ALT    = 'https://www.figma.com/api/mcp/asset/e8032e8c-d7ed-4a91-94ca-bb228ff4f6f5'
const JM_CONNECTOR_1 = 'https://www.figma.com/api/mcp/asset/46b9f14f-8c65-44db-b8c4-dcd9e8fb04c3'
const JM_CONNECTOR_2 = 'https://www.figma.com/api/mcp/asset/4e3ce6f3-7a71-45d3-91b0-7240e1da3837'
const JM_CONNECTOR_3 = 'https://www.figma.com/api/mcp/asset/374d4a70-5c68-4a51-af4f-861903cd536a'
const JM_CONNECTOR_4 = 'https://www.figma.com/api/mcp/asset/9453daf6-6688-45e1-b2f2-ebc3c84561cc'
const JM_STAR        = 'https://www.figma.com/api/mcp/asset/5b950663-0fe4-4c9c-a7d7-b8362426a38c'
const JM_POLYGON_2   = 'https://www.figma.com/api/mcp/asset/10fda037-433d-4a77-800c-ea19cf3257d8'
const JM_POLYGON_3   = 'https://www.figma.com/api/mcp/asset/a9371da9-b4ec-4789-84ae-7cb2e28712a0'

// Badge shells
const BG_OUTER_BLUE     = 'https://www.figma.com/api/mcp/asset/71123275-abcc-4d81-9c40-5e7ab882634c'
const BG_INNER_BLUE     = 'https://www.figma.com/api/mcp/asset/7ed3d33f-4db3-4e67-94a4-ccbe87ff62d2'
const BG_OUTER_ORANGE   = 'https://www.figma.com/api/mcp/asset/070a6585-28ef-4dd2-958c-66d58d24664a'
const BG_INNER_ORANGE   = 'https://www.figma.com/api/mcp/asset/8b9522c5-ef92-4566-b742-a8f498200c5d'
const BG_OUTER_PURPLE   = 'https://www.figma.com/api/mcp/asset/a7304804-3159-4e39-aa47-47c9e40597d6'
const BG_INNER_PURPLE   = 'https://www.figma.com/api/mcp/asset/69654cd1-c49b-4048-b76a-341d7fe447dd'
const ICON_TARGET        = 'https://www.figma.com/api/mcp/asset/ac0b099d-5857-4d41-b8f2-7288a4b17c21'
const ICON_FLAME         = 'https://www.figma.com/api/mcp/asset/24d15f61-e545-4616-a029-840992387580'
const ICON_FLAME_ELLIPSE = 'https://www.figma.com/api/mcp/asset/ee074580-5dbf-4844-bf57-82aa4e58c0ed'
const ICON_DUMBBELL      = 'https://www.figma.com/api/mcp/asset/262f77b2-62cf-4ae5-9099-1702487cf564'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function loadGoals() {
  try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
}

function loadCharacter() {
  try {
    const saved = localStorage.getItem('trumi_character')
    return saved ? { ...DEFAULT_CHARACTER, ...JSON.parse(saved) } : DEFAULT_CHARACTER
  } catch { return DEFAULT_CHARACTER }
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Welcome back'
}

function computeStreak(allLoggedDays = []) {
  const logged = new Set(allLoggedDays)
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (logged.has(d.toISOString().split('T')[0])) streak++
    else if (i > 0) break
  }
  return streak
}

/* ── HomeBadge ────────────────────────────────────────────────────────────── */

function HomeBadge({ variant, count }) {
  const SHELL = {
    'goal-setter':    { outer: BG_OUTER_BLUE,   inner: BG_INNER_BLUE,   pillBorder: '#0f1c3f' },
    'streak-master':  { outer: BG_OUTER_ORANGE, inner: BG_INNER_ORANGE, pillBorder: '#ff8b0b' },
    'gym-enthusiast': { outer: BG_OUTER_PURPLE, inner: BG_INNER_PURPLE, pillBorder: null },
  }[variant]

  const LABEL = {
    'goal-setter':    ['Goal', 'Setter'],
    'streak-master':  ['Streak', 'Master'],
    'gym-enthusiast': ['Gym', 'Enthusiast'],
  }[variant]

  const showPill = SHELL.pillBorder !== null && count !== undefined

  return (
    <div className="home-badge">
      <div className="home-badge__container">
        <div className="home-badge__outer-wrap">
          <img src={SHELL.outer} alt="" aria-hidden="true" className="home-badge__bg-img" />
        </div>
        {SHELL.inner && (
          <div className="home-badge__inner-wrap">
            <img src={SHELL.inner} alt="" aria-hidden="true" className="home-badge__bg-img" />
          </div>
        )}

        {variant === 'goal-setter' && (
          <div className="home-badge__icon home-badge__icon--target">
            <img src={ICON_TARGET} alt="Target" />
          </div>
        )}
        {variant === 'streak-master' && (
          <div className="home-badge__icon home-badge__icon--flame">
            <img src={ICON_FLAME} alt="Flame" className="home-badge__flame-body" />
            <div className="home-badge__flame-ellipse">
              <img src={ICON_FLAME_ELLIPSE} alt="" aria-hidden="true" />
            </div>
          </div>
        )}
        {variant === 'gym-enthusiast' && (
          <div className="home-badge__icon home-badge__icon--dumbbell">
            <img src={ICON_DUMBBELL} alt="Dumbbell" />
          </div>
        )}

        {showPill && (
          <div className="home-badge__pill" style={{ borderBottomColor: SHELL.pillBorder }}>
            <span className="home-badge__pill-num">{count}</span>
          </div>
        )}
      </div>
      <p className="home-badge__name">
        {LABEL[0]}{LABEL[1] ? <><br />{LABEL[1]}</> : null}
      </p>
    </div>
  )
}

/* ── HomeJourneyMap ───────────────────────────────────────────────────────── */

function HomeJourneyMap() {
  return (
    <div className="home-journey__wrapper">
      <div className="home-journey__canvas">

        {/* Coins */}
        <div className="home-journey__node" style={{ top:'8.71%', right:'85.9%', bottom:'56.54%', left:'0' }}>
          <img src={JM_COIN_FILLED} alt="Milestone 1" className="home-journey__fill-img" />
        </div>
        <div className="home-journey__node" style={{ top:'65.25%', right:'72.13%', bottom:'0', left:'13.77%' }}>
          <img src={JM_COIN_ALT} alt="Milestone 2" className="home-journey__fill-img" />
        </div>
        <div className="home-journey__node" style={{ top:'8.71%', right:'26.23%', bottom:'56.54%', left:'59.67%' }}>
          <img src={JM_COIN_FILLED} alt="Milestone 3" className="home-journey__fill-img" />
        </div>
        <div className="home-journey__node" style={{ top:'22.59%', right:'0', bottom:'42.65%', left:'85.9%' }}>
          <img src={JM_COIN_FILLED} alt="Milestone 4" className="home-journey__fill-img" />
        </div>

        {/* Connector 1 */}
        <div className="home-journey__connector" style={{ top:'49.38%', right:'87.21%', bottom:'30.79%', left:'5.25%' }}>
          <div className="home-journey__connector-inner" style={{ top:'-10%', right:'-8.7%', bottom:'-10%', left:'-8.7%' }}>
            <img src={JM_CONNECTOR_1} alt="" aria-hidden="true" className="home-journey__fill-img" />
          </div>
        </div>

        {/* Connector 2 */}
        <div className="home-journey__connector" style={{ top:'48.38%', right:'38.52%', bottom:'19.37%', left:'31.64%' }}>
          <div className="home-journey__connector-inner" style={{ top:'-6.15%', right:'-2.2%', bottom:'-6.15%', left:'-2.2%' }}>
            <img src={JM_CONNECTOR_2} alt="" aria-hidden="true" className="home-journey__fill-img" />
          </div>
        </div>

        {/* Connector 3 */}
        <div className="home-journey__connector" style={{ top:'0', right:'3.61%', bottom:'81.37%', left:'74.75%' }}>
          <div className="home-journey__connector-inner" style={{ top:'-10.65%', right:'-3.03%', bottom:'-10.65%', left:'-3.03%' }}>
            <img src={JM_CONNECTOR_3} alt="" aria-hidden="true" className="home-journey__fill-img" />
          </div>
        </div>

        {/* Connector 4 — CSS container query + hypot() rotation */}
        <div
          className="home-journey__connector home-journey__connector--cq"
          style={{ top:'62.27%', right:'-0.31%', bottom:'5.05%', left:'86.23%',
                   overflow:'visible', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <div style={{
            flexShrink: 0,
            width: 'hypot(-82.0868cqw, -48.0086cqh)',
            height: 'hypot(17.9132cqw, -51.9914cqh)',
            transform: 'rotate(-155.82deg)',
            position: 'relative',
          }}>
            <div style={{ position:'absolute', top:'-10.65%', right:'-5.18%', bottom:'-10.65%', left:'-5.18%' }}>
              <img src={JM_CONNECTOR_4} alt="" aria-hidden="true" className="home-journey__fill-img" />
            </div>
          </div>
        </div>

        {/* Decorative shapes */}
        {/* Star — inset: 10.69% 86.62% 67.99% 0.98% */}
        <div className="home-journey__connector"
          style={{ top:'10.69%', right:'86.62%', bottom:'67.99%', left:'0.98%', overflow:'visible',
                   display:'flex', alignItems:'center', justifyContent:'center', containerType:'size' }}>
          <div style={{
            flexShrink:0,
            width:'hypot(95.7668cqw, -14.7198cqh)',
            height:'hypot(4.23316cqw, 85.2802cqh)',
            transform:'rotate(-4.99deg)', position:'relative',
          }}>
            <div style={{ position:'absolute', top:'1.38%', right:'11.93%', bottom:'6.73%', left:'11.77%' }}>
              <img src={JM_STAR} alt="" aria-hidden="true" className="home-journey__fill-img" />
            </div>
          </div>
        </div>

        {/* Polygon 2 — inset: 72.19% 74.64% 14.84% 16.72% */}
        <div className="home-journey__connector"
          style={{ top:'72.19%', right:'74.64%', bottom:'14.84%', left:'16.72%', overflow:'visible',
                   display:'flex', alignItems:'center', justifyContent:'center', containerType:'size' }}>
          <div style={{
            flexShrink:0,
            width:'hypot(99.5571cqw, -1.82434cqh)',
            height:'hypot(0.44293cqw, 98.1757cqh)',
            transform:'rotate(-0.52deg)', position:'relative',
          }}>
            <div style={{ position:'absolute', top:'-4.54%', right:'1.44%', bottom:'-12.14%', left:'1.53%' }}>
              <img src={JM_POLYGON_2} alt="" aria-hidden="true" className="home-journey__fill-img" />
            </div>
          </div>
        </div>

        {/* Polygon 3 — inset: 15.65% 28.74% 71.38% 62.62% */}
        <div className="home-journey__connector"
          style={{ top:'15.65%', right:'28.74%', bottom:'71.38%', left:'62.62%', overflow:'visible',
                   display:'flex', alignItems:'center', justifyContent:'center', containerType:'size' }}>
          <div style={{
            flexShrink:0,
            width:'hypot(99.5571cqw, -1.82434cqh)',
            height:'hypot(0.44293cqw, 98.1757cqh)',
            transform:'rotate(-0.52deg)', position:'relative',
          }}>
            <div style={{ position:'absolute', top:'-4.54%', right:'1.44%', bottom:'-12.14%', left:'1.53%' }}>
              <img src={JM_POLYGON_3} alt="" aria-hidden="true" className="home-journey__fill-img" />
            </div>
          </div>
        </div>

        {/* Polygon 3 again — inset: 29.54% 2.51% 57.49% 88.85% */}
        <div className="home-journey__connector"
          style={{ top:'29.54%', right:'2.51%', bottom:'57.49%', left:'88.85%', overflow:'visible',
                   display:'flex', alignItems:'center', justifyContent:'center', containerType:'size' }}>
          <div style={{
            flexShrink:0,
            width:'hypot(99.5571cqw, -1.82434cqh)',
            height:'hypot(0.44293cqw, 98.1757cqh)',
            transform:'rotate(-0.52deg)', position:'relative',
          }}>
            <div style={{ position:'absolute', top:'-4.54%', right:'1.44%', bottom:'-12.14%', left:'1.53%' }}>
              <img src={JM_POLYGON_3} alt="" aria-hidden="true" className="home-journey__fill-img" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Home ─────────────────────────────────────────────────────────────────── */

export default function Home() {
  const navigate = useNavigate()
  const [goals, setGoals]         = useState([])
  const [character, setCharacter] = useState(DEFAULT_CHARACTER)

  useEffect(() => {
    setGoals(loadGoals())
    setCharacter(loadCharacter())
  }, [])

  const firstGoal    = goals.find(g => g.status === 'active') ?? goals[0] ?? null
  const allLoggedDays = goals.flatMap(g => g.loggedDays ?? [])
  const streak        = computeStreak(allLoggedDays)
  const greeting      = getGreeting()

  const greetingText = firstGoal
    ? `${greeting}!\nHere's how your goals are looking.`
    : `${greeting}!\nReady to start your journey?`

  return (
    <div className="home-page">


      <main className="home-content">

        {/* ── Greeting ──────────────────────────────── */}
        <p className="home-greeting">
          {greetingText.split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </p>

        {/* ── My Goals ──────────────────────────────── */}
        <section className="home-section">
          <h2 className="home-section__title">My Goals</h2>
          <div
            className="home-card home-card--goals home-card--clickable"
            onClick={() => navigate('/goals')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/goals')}
          >
            {firstGoal ? (
              <div className="home-goals__preview-row">
                <img src={BULLSEYE_IMG} alt="" aria-hidden="true" className="home-goals__bullseye" />
                <div className="home-goals__preview-wrap">
                  <div className="home-goals__preview-zoom">
                    <GoalCard isPreview {...firstGoal} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="home-goals__empty">
                <p>No goals yet — tap to add one.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── My Achievements ───────────────────────── */}
        <section className="home-section">
          <h2 className="home-section__title">My Achievements</h2>
          <div
            className="home-card home-card--achievements home-card--clickable"
            onClick={() => navigate('/badges')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/achievements')}
          >
            <HomeBadge variant="goal-setter"    count={goals.length} />
            <HomeBadge variant="streak-master"  count={streak} />
            <HomeBadge variant="gym-enthusiast" />
          </div>
        </section>

        {/* ── My Journey ────────────────────────────── */}
        <section className="home-section">
          <h2 className="home-section__title">My Journey</h2>
          <div
            className="home-card home-card--journey home-card--clickable"
            onClick={() => navigate('/journey')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/journey')}
          >
            <HomeJourneyMap />
          </div>
        </section>

        {/* ── My Trumi ──────────────────────────────── */}
        <section className="home-section">
          <h2 className="home-section__title">My Trumi</h2>
          <div
            className="home-card home-card--trumi home-card--clickable"
            onClick={() => navigate('/character')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/character')}
          >
            <div className="home-trumi__canvas-wrap">
              <TrumiCharacter
                selections={character}
                skinColor={character.skinColor}
                hairColor={character.hairColor}
                eyeColor={character.eyeColor}
                browColor={character.browColor}
                lipColor={character.lipColor}
                size={200}
              />
            </div>
            {character.name && (
              <p className="home-trumi__name">{character.name}</p>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
