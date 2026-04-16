import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Onboarding.css'

function getPairs(arr) {
  const pairs = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]])
    }
  }
  return pairs
}

export default function OnboardingStep3() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { top10 = [], top3 = [], valueLooks = {} } = state ?? {}

  const pairs = getPairs(top3)

  // tradeoffs: { 'A|B': 'A' or 'B' }
  const [tradeoffs, setTradeoffs] = useState({})

  function choose(a, b, choice) {
    setTradeoffs(prev => ({ ...prev, [`${a}|${b}`]: choice }))
  }

  const pairKey = (a, b) => `${a}|${b}`
  const canContinue = pairs.every(([a, b]) => tradeoffs[pairKey(a, b)])

  function buildQuestions(pairs) {
    const templates = [
      ([a, b]) => `Would you choose ${a} over ${b} if you had to pick one this week?`,
      ([a, b]) => `Would you choose more ${a} or your ${b}?`,
      ([a, b]) => `Would you choose your ${a} or ${b}?`,
    ]
    return pairs.map((pair, i) => ({
      pair,
      question: (templates[i] ?? templates[0])(pair),
    }))
  }

  const questions = buildQuestions(pairs)

  return (
    <div className="ob-page">

      {/* Header */}
      <div className="ob-header">
        <button className="ob-back-btn" onClick={() => navigate('/onboarding/step/2', { state: { top10, top3, valueLooks } })} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ob-page-label">Trade-Offs</span>
      </div>

      {/* Illustration */}
      <img
        src="/assets/manager-desk.png"
        alt="Person at a desk making decisions"
        className="ob-s3__illustration"
      />

      <p className="ob-s3__intro">
        Sometimes we have to make sacrifices in one area in order to maintain our values in others.
        Help us learn about what trade-offs you would make.
      </p>

      {/* Pair questions */}
      <div className="ob-s3__pairs">
        {questions.map(({ pair: [a, b], question }) => {
          const key    = pairKey(a, b)
          const chosen = tradeoffs[key]
          return (
            <div key={key} className="ob-tradeoff">
              <p className="ob-tradeoff__q">
                {question.split(a).map((part, i, arr) => (
                  i < arr.length - 1
                    ? <span key={i}>{part}<strong>{a}</strong></span>
                    : part.split(b).map((p2, j, arr2) => (
                        j < arr2.length - 1
                          ? <span key={j}>{p2}<strong>{b}</strong></span>
                          : p2
                      ))
                ))}
              </p>
              <div className="ob-tradeoff__choices">
                <button
                  className={`ob-chip${chosen === a ? ' ob-chip--active' : ''}${chosen === b ? ' ob-chip--faded' : ''}`}
                  onClick={() => choose(a, b, a)}
                  style={{ minWidth: '100px', textAlign: 'center' }}
                >
                  {a}
                </button>
                <button
                  className={`ob-chip${chosen === b ? ' ob-chip--active' : ''}${chosen === a ? ' ob-chip--faded' : ''}`}
                  onClick={() => choose(a, b, b)}
                  style={{ minWidth: '100px', textAlign: 'center' }}
                >
                  {b}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="ob-footer" style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <button
          className="ob-btn"
          disabled={!canContinue}
          onClick={() => navigate('/onboarding/step/4', { state: { top10, top3, valueLooks, tradeoffs } })}
        >
          Continue
        </button>
        <p className="ob-step-label">Step 3 of 5</p>
      </div>

    </div>
  )
}
