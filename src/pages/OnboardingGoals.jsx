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

  const [goals, setGoals]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError]           = useState(null)
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState(null)
  const [expanded, setExpanded]     = useState(null)   // index of expanded goal card
  const [added, setAdded]           = useState(new Set()) // indices of added goals

  const surveyData = { top10, top3, valueLooks, tradeoffs, alignment, obstacles }

  async function fetchGoals({ initial = false } = {}) {
    if (top3.length === 0 && top10.length === 0) {
      setError('No survey data found. Head back through the onboarding steps to get personalised goal suggestions.')
      setLoading(false)
      return
    }

    if (initial) setLoading(true)
    else setRegenerating(true)

    setError(null)

    try {
      const result = await suggestGoals(surveyData)
      setGoals(Array.isArray(result) ? result : [])
      setAdded(new Set()) // reset added when goals change
      setExpanded(null)
    } catch (err) {
      console.error('[OnboardingGoals]', err)
      setError('We had trouble generating your goals. You can still continue — you can set goals any time inside the app.')
    } finally {
      if (initial) setLoading(false)
      else setRegenerating(false)
    }
  }

  useEffect(() => {
    fetchGoals({ initial: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function toggleAdd(i) {
    setAdded(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  async function handleContinue() {
    setSaving(true)
    setSaveError(null)
    try {
      await saveOnboardingResponses(surveyData)

      // Persist added goals to localStorage for the Goals page to read
      const addedGoalsList = goals.filter((_, i) => added.has(i))
      if (addedGoalsList.length > 0) {
        const existing = (() => {
          try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
        })()
        const now = new Date()
        const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        const newGoals = addedGoalsList.map((g, idx) => ({
          id: Date.now() + idx,
          title: g.title,
          description: g.why || '',
          aka: g.description || '',
          startDate: dateLabel,
          pausedDate: null,
          status: 'active',
          term: 'short',
          intensity: 2,
          progress: 0,
          progressMessage: '',
          values: g.values || [],
        }))
        localStorage.setItem('trumi_goals', JSON.stringify([...existing, ...newGoals]))
      }

      // Save the user's values so the add-goal flow can suggest and pre-select them
      localStorage.setItem('trumi_values', JSON.stringify({ top10, top3 }))
      localStorage.setItem('trumi_onboarded', 'true')
      navigate('/')
    } catch (err) {
      console.error('[OnboardingGoals] save failed:', err)
      setSaveError('Something went wrong saving your responses. Please try again.')
      setSaving(false)
    }
  }

  const addedGoals = goals.filter((_, i) => added.has(i))

  return (
    <div className="ob-page">

      {/* Header */}
      <div className="ob-header">
        <button
          className="ob-back-btn"
          onClick={() => navigate('/onboarding/step/5', { state: surveyData })}
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
          <>
            <ul className="ob-goals__list">
              {goals.map((goal, i) => {
                const isExpanded = expanded === i
                const isAdded    = added.has(i)
                return (
                  <li key={i} className={`ob-goals__card${isAdded ? ' ob-goals__card--added' : ''}`}>

                    {/* Card header — toggle expand */}
                    <button
                      className="ob-goals__card-header"
                      onClick={() => setExpanded(isExpanded ? null : i)}
                      aria-expanded={isExpanded}
                    >
                      <span className="ob-goals__card-title">{goal.title}</span>
                      <div className="ob-goals__card-header-right">
                        {isAdded && (
                          <span className="ob-goals__added-badge" aria-label="Added to your goals">✓</span>
                        )}
                        <svg
                          className={`ob-goals__card-chevron${isExpanded ? ' ob-goals__card-chevron--open' : ''}`}
                          width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                        >
                          <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>

                    {/* Expanded body */}
                    {isExpanded && (
                      <div className="ob-goals__card-body">

                        {/* Values chips */}
                        {goal.values?.length > 0 && (
                          <div className="ob-goals__card-values">
                            <span className="ob-goals__card-values-label">Connects to your values:</span>
                            <div className="ob-goals__card-values-chips">
                              {goal.values.map(v => (
                                <span key={v} className="ob-goals__card-value-chip">{v}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Why / explanation */}
                        <p className="ob-goals__card-why">{goal.why}</p>

                        {goal.description && (
                          <p className="ob-goals__card-description">{goal.description}</p>
                        )}

                        {/* Sub-goals */}
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

                        {/* Add / remove button */}
                        <button
                          className={`ob-goals__add-btn${isAdded ? ' ob-goals__add-btn--added' : ''}`}
                          onClick={() => toggleAdd(i)}
                        >
                          {isAdded ? 'Remove from your goals' : 'Add to your goals'}
                        </button>

                      </div>
                    )}
                  </li>
                )
              })}
            </ul>

            {/* Regenerate */}
            <div className="ob-goals__regen-row">
              <button
                className="ob-goals__regen-btn"
                onClick={() => fetchGoals()}
                disabled={regenerating || saving}
              >
                {regenerating ? (
                  <>
                    <span className="ob-goals__regen-spinner" aria-hidden="true" />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Try different suggestions
                  </>
                )}
              </button>
            </div>
          </>
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
          {saving
            ? 'Saving\u2026'
            : addedGoals.length > 0
              ? `Let's go — ${addedGoals.length} goal${addedGoals.length > 1 ? 's' : ''} added`
              : "Let's go"}
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
