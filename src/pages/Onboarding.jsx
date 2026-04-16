import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

export default function Onboarding() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="ob-page">

      {/* Header — no back button, this is the entry point */}
      <div className="ob-header">
        <span />
        <span />
      </div>

      {/* Illustration */}
      <img
        src="/assets/asking-question.png"
        alt="Person thinking about their values"
        className="ob-intro__illustration"
      />

      {/* Content */}
      <h1 className="ob-intro__title">Understanding Your Values</h1>

      <p className="ob-intro__lead">
        This questionnaire is meant to help you rediscover who you are and what <em>drives you.</em>
      </p>

      <p className="ob-intro__question">
        Trumi wants to help you answer the question:<br />
        "How Can I Become More Truly and Authentically <em>Me</em>"
      </p>

      <p className="ob-intro__body">
        Understanding your values will help you better recognize what actually matters to you.<br /><br />
        Trumi helps you ensure that your goals and daily living, matches with your best self — based on <em>your values.</em>
      </p>

      <p className="ob-intro__nudge">What you put in is what you get out:</p>
      <p className="ob-intro__timing">
        This Questionnaire Takes about 10–15 minutes, depending on your amount of detail.
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
