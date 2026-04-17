import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import './Onboarding.css'

const OBSTACLE_CHIPS = [
  'Lack of Time',
  'Low Motivation',
  'Too Many Goals',
  "Other People's Expectations",
  'Stress',
  'Financial Pressure',
  'Health Issues',
  'Unclear Priorities',
  'Fear of Failure',
  'Perfectionism',
]

const POPDOWN_TEXT = 'Being "aligned" means that your daily actions and choices reflect what matters most to you. For example, if you value Peace but often feel stressed or overwhelmed, your current alignment with Peace might be low.'

export default function OnboardingStep4() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { top10 = [], top3 = [], valueLooks = {}, tradeoffs = {} } = state ?? {}

  // alignment: { ValueName: 0–10 }
  const [alignment, setAlignment]   = useState(() => Object.fromEntries(top3.map(v => [v, 0])))
  // obstacles: { ValueName: string[] }
  const [obstacles, setObstacles]   = useState(() => Object.fromEntries(top3.map(v => [v, []])))
  const [customInputs, setCustom]   = useState({})
  const [showCustom, setShowCustom] = useState({})
  const [infoOpen, setInfoOpen]     = useState(false)

  function setRating(value, rating) {
    setAlignment(prev => ({ ...prev, [value]: rating }))
  }

  function toggleObstacle(value, chip) {
    if (chip === '+ Use My Own Words') {
      setShowCustom(prev => ({ ...prev, [value]: true }))
      return
    }
    setObstacles(prev => {
      const current = prev[value] ?? []
      const next = current.includes(chip)
        ? current.filter(c => c !== chip)
        : [...current, chip]
      return { ...prev, [value]: next }
    })
  }

  function addCustomObstacle(value) {
    const word = (customInputs[value] ?? '').trim()
    if (!word) return
    setObstacles(prev => ({
      ...prev,
      [value]: [...(prev[value] ?? []), word],
    }))
    setCustom(prev => ({ ...prev, [value]: '' }))
    setShowCustom(prev => ({ ...prev, [value]: false }))
  }

  const canContinue = top3.every(v => alignment[v] > 0)

  return (
    <div className="ob-page">

      <PageHeader title="Values Quiz" />

      {/* Back navigation */}
      <div className="ob-header">
        <button className="ob-back-btn" onClick={() => navigate('/onboarding/step/3', { state: { top10, top3, valueLooks, tradeoffs } })} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ob-page-label">Value-Alignment</span>
      </div>

      <h2 className="ob-s4__title">How Aligned are you with these values right now?</h2>

      {/* Popdown info */}
      <div style={{ padding: '0 16px', marginBottom: '12px' }}>
        <div className="ob-popdown">
          <button className="ob-popdown__trigger" onClick={() => setInfoOpen(o => !o)}>
            {infoOpen ? '▾' : '▸'} *What do you mean aligned?
          </button>
          {infoOpen && <p className="ob-popdown__body">{POPDOWN_TEXT}</p>}
        </div>
      </div>

      <div className="ob-s4__scroll-area">
        {top3.map(value => {
          const rating   = alignment[value] ?? 0
          const selected = obstacles[value] ?? []
          return (
            <div key={value} className="ob-alignment-card">

              {/* Value name */}
              <p className="ob-alignment-card__name">{value}</p>

              {/* Rating bubbles */}
              <div className="ob-rating">
                <div className="ob-rating__bubbles" role="group" aria-label={`Rate your alignment with ${value}`}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={i}
                      className={`ob-rating__bubble${i < rating ? ' ob-rating__bubble--filled' : ''}`}
                      onClick={() => setRating(value, i + 1)}
                      aria-label={`${i + 1} out of 10`}
                    />
                  ))}
                </div>
                <span className="ob-rating__score">{rating}/10</span>
              </div>

              {/* Obstacles */}
              <p className="ob-alignment-card__label">
                What's currently getting in the way of living this value?
              </p>
              <div className="ob-card-box">
                {OBSTACLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    className={`ob-card-chip${selected.includes(chip) ? ' ob-card-chip--active' : ''}`}
                    onClick={() => toggleObstacle(value, chip)}
                  >
                    {chip}
                  </button>
                ))}
                <button
                  className="ob-card-chip"
                  onClick={() => toggleObstacle(value, '+ Use My Own Words')}
                >
                  + Use My Own Words
                </button>
                {selected.filter(c => !OBSTACLE_CHIPS.includes(c)).map(custom => (
                  <button
                    key={custom}
                    className="ob-card-chip ob-card-chip--active"
                    onClick={() => toggleObstacle(value, custom)}
                  >
                    {custom}
                  </button>
                ))}
              </div>
              {showCustom[value] && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    className="ob-custom-input"
                    type="text"
                    placeholder="Describe what gets in the way…"
                    value={customInputs[value] ?? ''}
                    onChange={e => setCustom(prev => ({ ...prev, [value]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addCustomObstacle(value)}
                  />
                  <button className="ob-btn" style={{ padding: '4px 16px', fontSize: '13px' }} onClick={() => addCustomObstacle(value)}>Add</button>
                </div>
              )}

            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="ob-footer">
        <button
          className="ob-btn"
          disabled={!canContinue}
          onClick={() => navigate('/onboarding/step/5', { state: { top10, top3, valueLooks, tradeoffs, alignment, obstacles } })}
        >
          Continue
        </button>
        <p className="ob-step-label">Step 4 of 5</p>
      </div>

    </div>
  )
}
