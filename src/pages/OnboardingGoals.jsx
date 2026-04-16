import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { suggestGoals } from '../services/ai'
import { saveOnboardingResponses } from '../services/supabase'
import './Onboarding.css'
import './OnboardingGoals.css'

export default function OnboardingGoals() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { top10 = [], top3 = [], valueLooks = {}, tradeoffs = {}, alignment = {}, obstacles = {} } = state ?? {}

  const [goals, setGoals]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [expanded, setExpanded]   = useState(null)   // index of expanded goal card

  useEffect(() => {
    // If there's no survey data (e.g. navigated here directly), skip the API call
    if (top3.length === 0 && top10.length === 0) {
      setError('No survey data found. Head back through the onboarding steps to get personalised goal suggestions.')
      setLoading(false)
      return
    }

    let cancelled = false

    suggestGoals({ top10, top3, valueLooks, tradeoffs, alignment, obstacles })
      .then(result => {
        if (!cancelled) {
          setGoals(Array.isArray(result) ? result : [])
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('[OnboardingGoals]', err)
          setError('We had trouble generating your goals. You can still continue — you can set goals any time inside the app.')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleContinue() {
    setSaving(true)
    setSaveError(null)
    try {
      await saveOnboardingResponses({ top10, top3, valueLooks, tradeoffs, alignment, obstacles })
      localStorage.setItem('trumi_onboarded', 'true')
      navigate('/')
    } catch (err) {
      console.error('[OnboardingGoals] save failed:', err)
      setSaveError('Something went wrong saving your responses. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="ob-page">

      {/* Header */}
      <div className="ob-header">
        <button
          className="ob-back-btn"
          onClick={() => navigate('/onboarding/step/5', { state: { top10, top3, valueLooks, tradeoffs, alignment, obstacles } })}
          aria-label="Go back"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span />
      </div>

      {/* Title */}
      <div className="ob-goals__header">
        <h1 className="ob-goals__title">Here's what we see in you</h1>
        <p className="ob-goals__subtitle">
          Based on what you shared, here are some goals that might feel right for where you are right now.
          These are just possibilities — take what resonates, leave what doesn't.
        </p>
      </div>

      {/* Content */}
      <div className="ob-goals__content">

        {loading && (
          <div className="ob-goals__loading">
            <div className="ob-goals__spinner" aria-hidden="true" />
            <p className="ob-goals__loading-text">Trumi is getting to know you…</p>
          </div>
        )}

        {error && !loading && (
          <div className="ob-goals__error">
            <p>{error}</p>
          </div>
        )}

        {!loading && goals.length > 0 && (
          <ul className="ob-goals__list">
            {goals.map((goal, i) => (
              <li key={i} className="ob-goals__card">
                <button
                  className="ob-goals__card-header"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  aria-expanded={expanded === i}
                >
                  <span className="ob-goals__card-title">{goal.title}</span>
                  <svg
                    className={`ob-goals__card-chevron${expanded === i ? ' ob-goals__card-chevron--open' : ''}`}
                    width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                  >
                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {expanded === i && (
                  <div className="ob-goals__card-body">
                    <p className="ob-goals__card-why">{goal.why}</p>
                    {goal.description && (
                      <p className="ob-goals__card-description">{goal.description}</p>
                    )}
                    {goal.subGoals?.length > 0 && (
                      <ul className="ob-goals__subgoals">
                        {goal.subGoals.map((sg, j) => (
                          <li key={j} className="ob-goals__subgoal">
                            <span className="ob-goals__subgoal-dot" aria-hidden="true" />
                            {sg}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* Footer */}
      <div className="ob-footer" style={{ marginTop: 'auto' }}>
        <p className="ob-goals__disclaimer">
          Trumi is your personal growth companion, not a health professional.
          These suggestions are a starting point — your journey belongs to you.
        </p>

        <button
          className="ob-btn"
          onClick={handleContinue}
          disabled={saving || loading}
        >
          {saving ? 'Saving\u2026' : "Let's go"}
        </button>

        {saveError && (
          <p className="ob-goals__save-error">{saveError}</p>
        )}

        {!loading && (
          <button
            className="ob-goals__skip"
            onClick={handleContinue}
            disabled={saving}
          >
            Skip for now
          </button>
        )}
      </div>

    </div>
  )
}
