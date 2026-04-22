import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TrumiCharacter from '../components/character/TrumiCharacter'
import { DEFAULT_CHARACTER } from '../components/character/characterAssets'
import { getUser } from '../services/supabase'
import BackgroundPattern from '../components/ui/BackgroundPattern'
import './Home.css'

const LEAF_ICON    = 'https://www.figma.com/api/mcp/asset/1c0e62cd-a6c0-4762-acb9-3d343bd7ccd3'
const DECOR_LEFT   = 'https://www.figma.com/api/mcp/asset/bdadf008-bb26-431b-9781-2eb2b371bace'
const DECOR_RIGHT  = 'https://www.figma.com/api/mcp/asset/9991db61-3460-4bc0-bd25-5a263c12fc19'
const DECOR_CORNER = 'https://www.figma.com/api/mcp/asset/ab932cec-08e9-4ac6-8777-2d0ef612c677'

function loadGoals() {
  try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
}

function loadCharacter() {
  try {
    const saved = localStorage.getItem('trumi_character')
    return saved ? { ...DEFAULT_CHARACTER, ...JSON.parse(saved) } : DEFAULT_CHARACTER
  } catch { return DEFAULT_CHARACTER }
}

function loadValues() {
  try {
    const stored = localStorage.getItem('trumi_values')
    if (!stored) return []
    const { top3 = [] } = JSON.parse(stored)
    return top3.slice(0, 3)
  } catch { return [] }
}

function getCharacterMessage(name, goals) {
  const h = new Date().getHours()
  const firstName = name ? `, ${name}` : ''
  const hasGoal = goals.some(g => g.status === 'active')

  if (h < 12) {
    return hasGoal
      ? `Good morning${firstName}! Today's a great day to make progress.`
      : `Good morning${firstName}! Ready to start your journey?`
  }
  if (h < 17) {
    return hasGoal
      ? `How's your afternoon going? Keep up the great work!`
      : `Good afternoon${firstName}! Your journey awaits whenever you're ready.`
  }
  if (h < 21) {
    return hasGoal
      ? `Great evening! How did today feel for you?`
      : `Good evening${firstName}! Small steps lead to big change.`
  }
  return hasGoal
    ? `You showed up today. That matters more than you know.`
    : `Welcome back${firstName}! Your story is still unfolding.`
}

/* ── AuthModal ────────────────────────────────────────────────────────────── */

function AuthModal({ onDismiss }) {
  const navigate = useNavigate()

  function handleDismiss() {
    sessionStorage.setItem('trumi_auth_dismissed', 'true')
    onDismiss()
  }

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="auth-modal__card">
        <h2 className="auth-modal__title" id="auth-modal-title">Welcome to Trumi</h2>
        <p className="auth-modal__body">
          Sign in or create an account to save your progress and unlock personalised insights.
        </p>
        <div className="auth-modal__actions">
          <button
            className="auth-modal__btn auth-modal__btn--primary"
            onClick={() => navigate('/account-creation')}
          >
            Create Account
          </button>
          <button
            className="auth-modal__btn auth-modal__btn--secondary"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
        <button className="auth-modal__explore" onClick={handleDismiss}>
          Explore first
        </button>
      </div>
    </div>
  )
}

/* ── Home ─────────────────────────────────────────────────────────────────── */

export default function Home() {
  const navigate = useNavigate()
  const [goals, setGoals]                 = useState([])
  const [character, setCharacter]         = useState(DEFAULT_CHARACTER)
  const [values, setValues]               = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    setGoals(loadGoals())
    setCharacter(loadCharacter())
    setValues(loadValues())
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('trumi_auth_dismissed')) return
    getUser()
      .then(user => { if (!user) setShowAuthModal(true) })
      .catch(() => setShowAuthModal(true))
  }, [])

  const firstActiveGoal = goals.find(g => g.status === 'active') ?? null
  const message         = getCharacterMessage(character.name, goals)

  return (
    <div className="home-page">
      <BackgroundPattern />

      {showAuthModal && (
        <AuthModal onDismiss={() => setShowAuthModal(false)} />
      )}

      <main className="home-content">

        {/* ── Character message ───────────────────── */}
        <p className="home-message">{message}</p>

        {/* ── Character display ───────────────────── */}
        <div className="home-character" onClick={() => navigate('/character')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/character')}>
          {character.name && (
            <h3 className="home-character__name">{character.name}</h3>
          )}
          <div className="home-character__figure">
            <TrumiCharacter
              selections={character}
              skinColor={character.skinColor}
              hairColor={character.hairColor}
              eyeColor={character.eyeColor}
              browColor={character.browColor}
              lipColor={character.lipColor}
              size={208}
            />
          </div>
        </div>

        {/* ── My Trumi Values ─────────────────────── */}
        <div className="home-values" onClick={() => navigate('/goals')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/goals')}>
          <div className="home-values__title-row">
            <span className="home-values__title">My Trumi Values</span>
            <img src={LEAF_ICON} alt="" aria-hidden="true" className="home-values__icon" />
          </div>
          {values.length > 0 ? (
            <div className="home-values__chips">
              {values.map(v => (
                <span key={v} className="home-values__chip">{v}</span>
              ))}
            </div>
          ) : (
            <p className="home-values__empty">Complete onboarding to see your values here.</p>
          )}
        </div>

        {/* ── Next Goal / Today's Focus ────────────── */}
        <div
          className="home-focus"
          onClick={() => navigate('/goals')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/goals')}
        >
          <img src={DECOR_LEFT}   alt="" aria-hidden="true" className="home-focus__decor home-focus__decor--left" />
          <img src={DECOR_RIGHT}  alt="" aria-hidden="true" className="home-focus__decor home-focus__decor--right-top" />
          <img src={DECOR_CORNER} alt="" aria-hidden="true" className="home-focus__decor home-focus__decor--right-bottom" />
          <div className="home-focus__text">
            <span className="home-focus__label">Next Goal/Today's Focus:</span>
            <span className="home-focus__goal">
              {firstActiveGoal ? firstActiveGoal.title : 'Set your first goal'}
            </span>
          </div>
        </div>

      </main>
    </div>
  )
}
