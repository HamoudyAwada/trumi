import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { suggestSingleGoal } from '../services/ai'
import './AddGoal.css'

/* ─── Constants ─────────────────────────────────────── */

const TOTAL_STEPS = 9

// Values that conflict with high intensity
const PEACE_ADJACENT = new Set([
  'Peace', 'Balance', 'Rest', 'Calm', 'Serenity', 'Harmony', 'Wellness', 'Mindfulness',
])



/* ─── Flame icon — reused in StepIntensity & StepConfirmation ── */

function FlameIcon({ active, size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C12 2 6.5 8.5 6.5 13.5C6.5 16.54 9.02 19 12 19C14.98 19 17.5 16.54 17.5 13.5C17.5 8.5 12 2 12 2Z"
        fill={active ? 'var(--color-horizon-violet)' : 'var(--color-horizon-violet-200)'}
        style={{ transition: 'fill 150ms ease' }}
      />
      {active && (
        <path
          d="M12 9C12 9 10 12 10 13.8C10 14.96 10.9 15.9 12 15.9C13.1 15.9 14 14.96 14 13.8C14 12 12 9 12 9Z"
          fill="var(--color-horizon-violet-300)"
        />
      )}
    </svg>
  )
}

const DIFFICULTY_LABELS = {
  1: 'Very light — easy to fit into your day',
  2: 'Light — manageable with some consistency',
  3: 'Moderate — requires real commitment',
  4: 'Challenging — you\'ll need to push yourself',
  5: 'Intense — a serious stretch goal',
}

/* ─── Helpers ───────────────────────────────────────── */

function loadUserValues() {
  try { return JSON.parse(localStorage.getItem('trumi_values') ?? '{}') } catch { return {} }
}

function computeAlignment(form, userValues) {
  const { intensity, values: chosen } = form
  const top3 = userValues.top3 ?? []

  const hasConflict = intensity >= 4 && top3.some(v => PEACE_ADJACENT.has(v))
  if (hasConflict) {
    const v = top3.find(v => PEACE_ADJACENT.has(v))
    return {
      aligned: false,
      message: `This might put some pressure on your ${v}. You can always dial back the intensity when you need to — that's not giving up, that's knowing yourself.`,
    }
  }

  const referenced = (chosen.length > 0 ? chosen : top3).slice(0, 2)
  if (referenced.length > 0) {
    return {
      aligned: true,
      message: `This goal supports your ${referenced.join(' and ')} and fits well with where you are right now.`,
    }
  }
  return {
    aligned: true,
    message: 'This goal looks well-aligned with who you are. You\'ve thought it through.',
  }
}

/* ─── Step 1 — Define the Goal ──────────────────────── */

function StepDefine({ form, setForm, userValues }) {
  const [suggesting,   setSuggesting]   = useState(false)
  const [suggestError, setSuggestError] = useState(null)

  async function handleSuggest() {
    setSuggesting(true)
    setSuggestError(null)
    try {
      const goal = await suggestSingleGoal(userValues)
      setForm(f => ({
        ...f,
        title:             goal.title,
        aiConnectedValues: goal.values ?? [],
        values:            goal.values ?? [],  // pre-select; user confirms on step 3
      }))
    } catch {
      setSuggestError('Couldn\'t reach Trumi\'s AI — try again in a moment.')
      setTimeout(() => setSuggestError(null), 4000)
    } finally {
      setSuggesting(false)
    }
  }

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">🎯</span>
        <h2 className="ag-step__title">What do you want to accomplish?</h2>
        <p className="ag-step__subtitle">Be as specific as you like — this is entirely yours.</p>
      </div>

      <textarea
        className="ag-textarea"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="e.g. Meditate for 10 minutes each morning"
        rows={3}
        autoFocus
      />

      {/* AI-powered suggestion */}
      <button
        className="ag-ai-suggest-btn"
        onClick={handleSuggest}
        disabled={suggesting}
      >
        {suggesting ? (
          <>
            <span className="ag-ai-suggest-btn__spinner" aria-hidden="true" />
            Thinking…
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 0L8.26 5.74L14 7L8.26 8.26L7 14L5.74 8.26L0 7L5.74 5.74Z" fill="currentColor"/>
            </svg>
            {form.title.trim() ? 'Try a different suggestion' : 'Suggest one for me'}
          </>
        )}
      </button>

      {suggestError && <p className="ag-ai-suggest-error">{suggestError}</p>}
    </div>
  )
}

/* ─── Step 2 — Timeframe ────────────────────────────── */

function StepTimeframe({ form, setForm }) {
  const DAY_OPTIONS = [
    { label: '1 week',   value: 7  },
    { label: '2 weeks',  value: 14 },
    { label: '1 month',  value: 30 },
    { label: '2 months', value: 60 },
    { label: '3 months', value: 90 },
  ]

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">⏱</span>
        <h2 className="ag-step__title">When do you want to complete this?</h2>
        <p className="ag-step__subtitle">A rough timeframe helps keep this alive — no pressure to be exact.</p>
      </div>

      <div className="ag-timeframe">
        <div className="ag-timeframe__tabs">
          <button
            className={`ag-timeframe__tab${form.timeframeType === 'date' ? ' ag-timeframe__tab--active' : ''}`}
            onClick={() => setForm(f => ({ ...f, timeframeType: 'date', dueDays: null }))}
          >
            Set a date
          </button>
          <button
            className={`ag-timeframe__tab${form.timeframeType === 'days' ? ' ag-timeframe__tab--active' : ''}`}
            onClick={() => setForm(f => ({ ...f, timeframeType: 'days', dueDate: '' }))}
          >
            Within a timeframe
          </button>
        </div>

        {form.timeframeType === 'date' && (
          <input
            type="date"
            className="ag-date-input"
            value={form.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          />
        )}

        {form.timeframeType === 'days' && (
          <div className="ag-chips">
            {DAY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`ag-chip${form.dueDays === opt.value ? ' ag-chip--selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, dueDays: opt.value }))}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Step 3 — Value Connection ─────────────────────── */

function StepValues({ form, setForm, userValues }) {
  const aiConnected = form.aiConnectedValues ?? []
  const hasAiValues = aiConnected.length > 0

  const all = [...new Set([...(userValues.top3 ?? []), ...(userValues.top10 ?? [])])]
  const fallback = ['Health', 'Growth', 'Connection', 'Peace', 'Family', 'Creativity', 'Freedom', 'Balance']
  const allOptions = all.length > 0 ? all : fallback

  // Options not already surfaced by the AI (shown in the "add more" section)
  const remainingOptions = allOptions.filter(v => !aiConnected.includes(v))

  function toggle(v) {
    setForm(f => ({
      ...f,
      values: f.values.includes(v) ? f.values.filter(x => x !== v) : [...f.values, v],
    }))
  }

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">💎</span>
        <h2 className="ag-step__title">
          {hasAiValues ? 'Does this feel right?' : 'Which of your values does this support?'}
        </h2>
        <p className="ag-step__subtitle">
          {hasAiValues
            ? 'Trumi connected your goal to these values. Tap to deselect any that don\'t fit, or add more below.'
            : 'This is how Trumi connects your goals to what matters most to you. Select one or more.'}
        </p>
      </div>

      {/* AI-connected values — shown as a confirmation block */}
      {hasAiValues && (
        <div className="ag-ai-values">
          <p className="ag-ai-values__label">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 0L8.26 5.74L14 7L8.26 8.26L7 14L5.74 8.26L0 7L5.74 5.74Z" fill="currentColor"/>
            </svg>
            Connected by Trumi
          </p>
          <div className="ag-chips ag-chips--wrap">
            {aiConnected.map(v => (
              <button
                key={v}
                className={`ag-chip ag-chip--value${form.values.includes(v) ? ' ag-chip--selected' : ''}`}
                onClick={() => toggle(v)}
                aria-pressed={form.values.includes(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No AI suggestion: full picker */}
      {!hasAiValues && (
        <div className="ag-chips ag-chips--wrap">
          {allOptions.map(v => (
            <button
              key={v}
              className={`ag-chip ag-chip--value${form.values.includes(v) ? ' ag-chip--selected' : ''}`}
              onClick={() => toggle(v)}
              aria-pressed={form.values.includes(v)}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* AI suggestion: secondary section for adding more */}
      {hasAiValues && remainingOptions.length > 0 && (
        <div className="ag-values-more">
          <p className="ag-values-more__label">Add others if you'd like:</p>
          <div className="ag-chips ag-chips--wrap">
            {remainingOptions.map(v => (
              <button
                key={v}
                className={`ag-chip ag-chip--value${form.values.includes(v) ? ' ag-chip--selected' : ''}`}
                onClick={() => toggle(v)}
                aria-pressed={form.values.includes(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Step 4 — Perceived Difficulty ────────────────── */

function StepIntensity({ form, setForm }) {
  const label = form.intensity ? DIFFICULTY_LABELS[form.intensity] : 'Tap a flame to rate the difficulty'

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">🔥</span>
        <h2 className="ag-step__title">How hard do you think this will be?</h2>
        <p className="ag-step__subtitle">Your honest prediction — Trumi will ask you later how it actually felt, so you can see the difference.</p>
      </div>

      <div className="ag-flame-scale">
        <div className="ag-flame-scale__row">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className="ag-flame-btn"
              onClick={() => setForm(f => ({ ...f, intensity: n }))}
              aria-label={`${n} out of 5`}
              aria-pressed={form.intensity >= n}
            >
              <FlameIcon active={form.intensity !== null && n <= form.intensity} />
            </button>
          ))}
        </div>
        <p className="ag-flame-scale__label">{label}</p>
      </div>
    </div>
  )
}

/* ─── Step 5 — Execution Style ──────────────────────── */

const EXECUTION_OPTIONS = [
  { key: 'daily',    label: 'Daily habit',      desc: 'Every single day',                  icon: '☀️' },
  { key: 'weekly',   label: 'A few times a week', desc: 'Consistent, not daily',             icon: '📆' },
  { key: 'flexible', label: 'Flexible',          desc: 'Whenever the moment feels right',   icon: '🌊' },
]

function StepExecution({ form, setForm }) {
  const WEEKLY_TIMES = [2, 3, 4, 5, 6, 7]

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">📅</span>
        <h2 className="ag-step__title">How do you want to approach this?</h2>
        <p className="ag-step__subtitle">Pick the rhythm that genuinely fits your life.</p>
      </div>

      <div className="ag-option-cards">
        {EXECUTION_OPTIONS.map(opt => (
          <button
            key={opt.key}
            className={`ag-option-card${form.executionStyle === opt.key ? ' ag-option-card--selected' : ''}`}
            onClick={() => setForm(f => ({ ...f, executionStyle: opt.key }))}
            aria-pressed={form.executionStyle === opt.key}
          >
            <span className="ag-option-card__icon" aria-hidden="true">{opt.icon}</span>
            <div className="ag-option-card__text">
              <span className="ag-option-card__label">{opt.label}</span>
              <span className="ag-option-card__desc">{opt.desc}</span>
            </div>
            {form.executionStyle === opt.key && (
              <svg className="ag-option-card__check" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="var(--color-horizon-violet)"/>
                <path d="M5.5 9L7.5 11L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>

      {form.executionStyle === 'weekly' && (
        <div className="ag-weekly">
          <p className="ag-weekly__label">How many times per week?</p>
          <div className="ag-chips">
            {WEEKLY_TIMES.map(n => (
              <button
                key={n}
                className={`ag-chip${form.weeklyTimes === n ? ' ag-chip--selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, weeklyTimes: n }))}
              >
                {n}×
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Step 6 — Friction Prediction ─────────────────── */

const FRICTION_OPTIONS = ['Time', 'Energy', 'Motivation', 'Other priorities']

function StepFriction({ form, setForm }) {
  function toggle(v) {
    setForm(f => ({
      ...f,
      friction: f.friction.includes(v) ? f.friction.filter(x => x !== v) : [...f.friction, v],
    }))
  }

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">🚧</span>
        <h2 className="ag-step__title">What might get in the way?</h2>
        <p className="ag-step__subtitle">Knowing your friction points helps Trumi reach out at the right moment. Select all that apply.</p>
      </div>

      <div className="ag-friction-list">
        {FRICTION_OPTIONS.map(opt => (
          <button
            key={opt}
            className={`ag-friction-item${form.friction.includes(opt) ? ' ag-friction-item--selected' : ''}`}
            onClick={() => toggle(opt)}
            aria-pressed={form.friction.includes(opt)}
          >
            <span className="ag-friction-item__label">{opt}</span>
            {form.friction.includes(opt) && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8L6.5 11L12.5 5" stroke="var(--color-horizon-violet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Step 7 — Minimum Version ──────────────────────── */

function StepMinimumVersion({ form, setForm }) {
  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <span className="ag-step__emoji" aria-hidden="true">🔁</span>
        <h2 className="ag-step__title">What's the smallest version of this goal?</h2>
        <p className="ag-step__subtitle">On a hard or busy day, what would still count as showing up? Even 10% is real progress.</p>
      </div>

      <div className="ag-callout">
        <p className="ag-callout__text">
          If your goal is to run 5km, your minimum might be: <em>"Put on my shoes and walk to the end of the block."</em>
        </p>
      </div>

      <textarea
        className="ag-textarea"
        value={form.minimumVersion}
        onChange={e => setForm(f => ({ ...f, minimumVersion: e.target.value }))}
        placeholder="On a busy day, I can still…"
        rows={3}
      />
    </div>
  )
}

/* ─── Step 8 — Alignment Check ──────────────────────── */

function StepAlignment({ checking, result }) {
  return (
    <div className="ag-step ag-step--centered">
      {checking && (
        <div className="ag-alignment-loading">
          <div className="ag-alignment-spinner" aria-hidden="true" />
          <p className="ag-alignment-loading__text">Trumi is reading your goal…</p>
        </div>
      )}

      {!checking && result && (
        <div className={`ag-alignment-result${result.aligned ? ' ag-alignment-result--aligned' : ' ag-alignment-result--caution'}`}>
          <span className="ag-alignment-result__icon" aria-hidden="true">
            {result.aligned ? (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="var(--color-lucent-green, #cdff6d)" fillOpacity="0.3"/>
                <path d="M11 18.5L15.5 23L25 13" stroke="var(--color-tranquil-night, #0f1c3f)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#fff0cc"/>
                <path d="M18 12v8M18 22v2" stroke="#b07800" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </span>
          <p className="ag-alignment-result__message">{result.message}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Step 9 — Confirmation ─────────────────────────── */

function StepConfirmation({ form }) {
  function formatTimeframe() {
    if (form.timeframeType === 'date' && form.dueDate) {
      return new Date(form.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    }
    if (form.timeframeType === 'days' && form.dueDays) {
      const d = new Date()
      d.setDate(d.getDate() + form.dueDays)
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
    return null
  }

  function formatExecution() {
    if (form.executionStyle === 'daily')    return 'Every day'
    if (form.executionStyle === 'weekly')   return `${form.weeklyTimes}× per week`
    if (form.executionStyle === 'flexible') return 'Flexible — whenever you can'
    return null
  }

  const timeframe = formatTimeframe()
  const execution = formatExecution()

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <h2 className="ag-step__title">Here's your goal</h2>
        <p className="ag-step__subtitle">Everything looks good. Whenever you're ready, add it.</p>
      </div>

      <div className="ag-confirm-card">
        <h3 className="ag-confirm-card__title">{form.title}</h3>

        {timeframe && (
          <div className="ag-confirm-row">
            <span className="ag-confirm-row__label">Complete by</span>
            <span className="ag-confirm-row__value">{timeframe}</span>
          </div>
        )}

        {execution && (
          <div className="ag-confirm-row">
            <span className="ag-confirm-row__label">Approach</span>
            <span className="ag-confirm-row__value">{execution}</span>
          </div>
        )}

        {form.intensity && (
          <div className="ag-confirm-row">
            <span className="ag-confirm-row__label">Predicted effort</span>
            <div className="ag-confirm-flames">
              {[1, 2, 3, 4, 5].map(n => (
                <FlameIcon key={n} active={n <= form.intensity} size={18} />
              ))}
            </div>
          </div>
        )}

        {form.values.length > 0 && (
          <div className="ag-confirm-values">
            {form.values.map(v => (
              <span key={v} className="ag-confirm-value-chip">{v}</span>
            ))}
          </div>
        )}

        {form.minimumVersion && (
          <div className="ag-confirm-minimum">
            <span className="ag-confirm-minimum__label">On a busy day:</span>
            <span className="ag-confirm-minimum__text">{form.minimumVersion}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main AddGoal component ────────────────────────── */

export default function AddGoal() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '',
    timeframeType: null,  // 'date' | 'days'
    dueDate: '',
    dueDays: null,
    values: [],
    aiConnectedValues: [],// values the AI returned with its suggestion (empty = user typed their own goal)
    intensity: null,      // 1–5 perceived difficulty (null = not yet set)
    executionStyle: null, // 'daily' | 'weekly' | 'flexible'
    weeklyTimes: 3,
    friction: [],
    minimumVersion: '',
  })
  const [alignmentResult,   setAlignmentResult]   = useState(null)
  const [alignmentChecking, setAlignmentChecking] = useState(false)
  const [userValues] = useState(loadUserValues)

  // Trigger alignment check when landing on step 7
  useEffect(() => {
    if (step !== 7) return
    setAlignmentChecking(true)
    setAlignmentResult(null)
    const timer = setTimeout(() => {
      setAlignmentResult(computeAlignment(form, userValues))
      setAlignmentChecking(false)
    }, 1800)
    return () => clearTimeout(timer)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  function canAdvance() {
    switch (step) {
      case 0: return form.title.trim().length > 0
      case 1: return form.timeframeType === 'date'
                ? form.dueDate !== ''
                : form.dueDays !== null
      case 2: return form.values.length > 0
      case 3: return form.intensity !== null
      case 4: return form.executionStyle !== null
      case 5: return true  // friction is optional
      case 6: return true  // minimum version is optional
      case 7: return !alignmentChecking && alignmentResult !== null
      default: return true
    }
  }

  function handleNext() {
    const next = step + 1
    // Pre-select top3 values when arriving at the values step — but only if AI hasn't already set them
    if (next === 2 && form.values.length === 0 && form.aiConnectedValues.length === 0 && userValues.top3?.length > 0) {
      setForm(f => ({ ...f, values: userValues.top3.slice(0, 2) }))
    }
    setStep(next)
  }

  function handleBack() {
    if (step === 0) navigate('/goals')
    else setStep(s => s - 1)
  }

  function handleSave() {
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
    })()

    const now       = new Date()
    const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    let dueDateLabel = null
    if (form.timeframeType === 'date' && form.dueDate) {
      dueDateLabel = new Date(form.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    } else if (form.timeframeType === 'days' && form.dueDays) {
      const d = new Date()
      d.setDate(d.getDate() + form.dueDays)
      dueDateLabel = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    const newGoal = {
      id:              Date.now(),
      title:           form.title,
      description:     form.minimumVersion ? `On a busy day: ${form.minimumVersion}` : '',
      aka:             '',
      startDate:       dateLabel,
      dueDate:         dueDateLabel,
      pausedDate:      null,
      status:          'active',
      term:            'short',
      intensity:            form.intensity,
      perceivedDifficulty:  form.intensity,   // captured at creation; actualDifficulty filled on progress log
      progress:        0,
      progressMessage: '',
      values:          form.values,
      executionStyle:  form.executionStyle,
      weeklyTimes:     form.weeklyTimes,
      friction:        form.friction,
      minimumVersion:  form.minimumVersion,
    }

    localStorage.setItem('trumi_goals', JSON.stringify([...existing, newGoal]))
    navigate('/goals')
  }


  function ctaLabel() {
    if (step === 6) return 'See how this feels'
    if (step === 7) return alignmentResult?.aligned ? 'This works for me' : 'I\'ll keep that in mind'
    return 'Continue'
  }

  const isFinalStep = step === TOTAL_STEPS - 1
  const canSkip     = step === 5 || step === 6

  return (
    <div className="add-goal-page">

      {/* Progress bar */}
      <div className="add-goal__progress-track" aria-hidden="true">
        <div
          className="add-goal__progress-fill"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="add-goal__header">
        <button className="add-goal__back-btn" onClick={handleBack} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Step dots */}
        <div className="add-goal__dots" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`add-goal__dot${i < step ? ' add-goal__dot--past' : ''}${i === step ? ' add-goal__dot--current' : ''}`}
            />
          ))}
        </div>

        <span style={{ width: 32 }} />
      </div>

      {/* Step content */}
      <div className="add-goal__content" key={step}>
        {step === 0 && <StepDefine          form={form} setForm={setForm} userValues={userValues} />}
        {step === 1 && <StepTimeframe       form={form} setForm={setForm} />}
        {step === 2 && <StepValues          form={form} setForm={setForm} userValues={userValues} />}
        {step === 3 && <StepIntensity       form={form} setForm={setForm} />}
        {step === 4 && <StepExecution       form={form} setForm={setForm} />}
        {step === 5 && <StepFriction        form={form} setForm={setForm} />}
        {step === 6 && <StepMinimumVersion  form={form} setForm={setForm} />}
        {step === 7 && <StepAlignment       checking={alignmentChecking} result={alignmentResult} />}
        {step === 8 && <StepConfirmation    form={form} />}
      </div>

      {/* Footer */}
      <div className="add-goal__footer">
        {isFinalStep ? (
          <>
            <button className="add-goal__cta-btn" onClick={handleSave}>
              Add to my goals
            </button>
            <button className="add-goal__ghost-btn" onClick={() => navigate('/goals')}>
              Maybe later
            </button>
          </>
        ) : (
          <>
            <button
              className="add-goal__cta-btn"
              onClick={handleNext}
              disabled={!canAdvance()}
            >
              {ctaLabel()}
            </button>
            {canSkip && (
              <button className="add-goal__ghost-btn" onClick={handleNext}>
                Skip for now
              </button>
            )}
          </>
        )}
      </div>

    </div>
  )
}
