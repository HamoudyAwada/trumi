import { useNavigate, useLocation } from 'react-router-dom'
import './Onboarding.css'

export default function OnboardingStep5() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { top10 = [], top3 = [], valueLooks = {}, tradeoffs = {}, alignment = {}, obstacles = {} } = state ?? {}

  // Find best and worst aligned value
  const sorted    = [...top3].sort((a, b) => (alignment[b] ?? 0) - (alignment[a] ?? 0))
  const bestValue  = sorted[0] ?? top3[0]
  const worstValue = sorted[sorted.length - 1] ?? top3[top3.length - 1]

  function handleNext() {
    navigate('/onboarding/goals', { state: { top10, top3, valueLooks, tradeoffs, alignment, obstacles } })
  }

  return (
    <div className="ob-page">

      {/* Back navigation */}
      <div className="ob-header">
        <button className="ob-back-btn" onClick={() => navigate('/onboarding/step/4', { state: { top10, top3, valueLooks, tradeoffs, alignment, obstacles } })} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span />
      </div>

      {/* Trumi logo mark */}
      <svg className="ob-s5__logo" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Trumi">
        <path fill="#6666cc" d="M540,815.11c-167.07,0-328.6-50.77-454.82-142.95-21.21-15.49-25.85-45.25-10.36-66.46,15.49-21.21,45.25-25.85,66.46-10.36,110.06,80.38,251.66,124.65,398.72,124.65s288.71-44.26,398.71-124.64c21.21-15.5,50.97-10.87,66.46,10.34,15.5,21.21,10.87,50.97-10.34,66.46-126.17,92.19-287.7,142.96-454.83,142.96Z"/>
        <circle fill="#6666cc" cx="540" cy="493.34" r="171.15"/>
        <path fill="#6666cc" d="M540,870.61h0c-55.43,0-102.98,39.53-113.09,94.03l-16.15,87.05c-2.73,14.72,8.57,28.31,23.54,28.31h211.41c14.97,0,26.27-13.59,23.54-28.31l-16.15-87.05c-10.11-54.5-57.66-94.03-113.09-94.03Z"/>
        <path fill="#6666cc" d="M484.05,98.64C484.05,32.54,509.1,0,540,0c30.9,0,55.95,32.54,55.95,98.64,0,50.3-32.4,128.39-47.89,162.85-3.13,6.96-12.99,6.96-16.12,0-15.49-34.45-47.89-112.54-47.89-162.85Z"/>
        <path fill="#6666cc" d="M900.56,224.81c46.74-46.74,87.46-52.04,109.31-30.19,21.85,21.85,16.55,62.57-30.19,109.31-35.57,35.57-113.7,67.88-149.01,81.29-7.13,2.71-14.1-4.27-11.4-11.4,13.41-35.31,45.72-113.44,81.29-149.01Z"/>
        <path fill="#6666cc" d="M100.32,303.93c-46.74-46.74-52.04-87.46-30.19-109.31,21.85-21.85,62.57-16.55,109.31,30.19,35.57,35.57,67.88,113.7,81.29,149.01,2.71,7.13-4.27,14.1-11.4,11.4-35.31-13.41-113.44-45.72-149.01-81.29Z"/>
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
        <button className="ob-btn" onClick={handleNext}>
          See your goals
        </button>
        <p className="ob-step-label">Step 5 of 5</p>
      </div>

    </div>
  )
}
