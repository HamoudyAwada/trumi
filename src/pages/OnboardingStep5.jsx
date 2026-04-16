import { useNavigate, useLocation } from 'react-router-dom'
import './Onboarding.css'

export default function OnboardingStep5() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { top10 = [], top3 = [], valueLooks = {}, tradeoffs = {}, alignment = {}, obstacles = {} } = state ?? {}

  // Find best and worst aligned value
  const sorted   = [...top3].sort((a, b) => (alignment[b] ?? 0) - (alignment[a] ?? 0))
  const bestValue = sorted[0] ?? top3[0]
  const worstValue = sorted[sorted.length - 1] ?? top3[top3.length - 1]

  // Format top3 list as "X, Y, and Z"
  function formatList(arr) {
    if (arr.length === 0) return ''
    if (arr.length === 1) return arr[0]
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`
    return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`
  }

  return (
    <div className="ob-page">

      {/* Header */}
      <div className="ob-header">
        <button className="ob-back-btn" onClick={() => navigate('/onboarding/step/4', { state: { top10, top3, valueLooks, tradeoffs, alignment, obstacles } })} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span />
      </div>

      {/* Trumi logo mark */}
      <svg className="ob-s5__logo" viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Trumi logo">
        <circle cx="71.5" cy="71.5" r="71.5" fill="#6666cc" opacity="0.12"/>
        <circle cx="71.5" cy="82" r="28" fill="#6666cc"/>
        <ellipse cx="71.5" cy="46" rx="16" ry="16" fill="#6666cc"/>
        <path d="M43 108 Q71.5 88 100 108" stroke="#6666cc" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M52 60 Q42 52 38 42" stroke="#6666cc" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M91 60 Q101 52 105 42" stroke="#6666cc" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M67 32 Q65 20 60 14" stroke="#6666cc" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M76 32 Q78 20 83 14" stroke="#6666cc" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M71.5 32 Q71.5 18 71.5 12" stroke="#6666cc" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>

      {/* Thank you message */}
      <p className="ob-s5__thankyou">
        Thank you for your time in completing this onboarding.{' '}
        Here's what we've learned about you so far:
      </p>

      {/* Values summary */}
      {top3.length > 0 && (
        <p className="ob-s5__summary">
          You Value{' '}
          {top3.map((v, i) => (
            <span key={v}>
              <strong>{v}</strong>
              {i < top3.length - 2 ? ', ' : i === top3.length - 2 ? ', and ' : ''}
            </span>
          ))}{' '}
          Most.
        </p>
      )}

      {/* Alignment insight */}
      {top3.length > 0 && (
        <p className="ob-s5__insight">
          Right now,<br />
          You're doing well with <strong>{bestValue}</strong>,<br />
          {bestValue !== worstValue && (
            <>But, <strong>{worstValue}</strong> seems out of balance.</>
          )}
        </p>
      )}

      {/* Motivational close */}
      <p className="ob-s5__close">
        Let's help you grow in a way that feels authentic to <em>you</em> — at your own pace.
      </p>

      {/* Footer */}
      <div className="ob-footer" style={{ marginTop: 'auto' }}>
        <button
          className="ob-btn"
          onClick={() => navigate('/')}
        >
          Finish
        </button>
        <p className="ob-step-label">Step 5 of 5</p>
      </div>

    </div>
  )
}
