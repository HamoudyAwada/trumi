import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

export default function Onboarding() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="ob-page">

      {/* Illustration */}
      <img
        src="/assets/asking-question.svg"
        alt="Person thinking about their values"
        className="ob-intro__illustration"
      />

      {/* Content */}
      <h1 className="ob-intro__title">Understanding Your Values</h1>

      <p className="ob-intro__lead">
        This questionnaire is meant to help you rediscover who you are and what <em>drives you.</em>
      </p>


      {/* Privacy checkbox */}
      <label className="ob-intro__privacy">
        <input
          type="checkbox"
          className="ob-intro__checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
        />
        <span className="ob-intro__privacy-text">
          By Starting this quiz you are agreeing to our privacy policy
        </span>
      </label>

      {/* CTA */}
      <div className="ob-footer">
        <button
          className="ob-btn"
          disabled={!agreed}
          onClick={() => navigate('/onboarding/step/1')}
        >
          Get Started
        </button>
        <p className="ob-intro__disclaimer">
          *Answers will not be saved if you back out of the questionnaire before it's completed.*
        </p>
      </div>

    </div>
  )
}
