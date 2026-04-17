import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { suggestSingleGoal } from '../services/ai'
import PageHeader from '../components/ui/PageHeader'
import FlameIcon from '../components/ui/FlameIcon'
import './AddGoal.css'

/* ─── Constants ─────────────────────────────── */

const TOTAL_STEPS = 7
const MAX_TITLE   = 800
const MAX_MIN     = 300

// dot progress per step (5 dots total, steps 1+)
const DOT_PROGRESS = [0, 1, 1, 2, 3, 4, 5]

/* ─── Helpers ────────────────────────────────── */

function loadUserValues() {
  try { return JSON.parse(localStorage.getItem('trumi_values') ?? '{}') } catch { return {} }
}

/* ─── Step 0 — Goal type ─────────────────────── */

function StepGoalType({ form, setForm }) {
  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <h2 className="ag-step__title">What Type of Goal Do You Have?</h2>
        <p className="ag-step__subtitle">
          Where Trumi really comes to life is after the onboarding — we ask detailed questions because we want to find the best possible methods to help you <em>actually</em> achieve your goals.
        </p>
      </div>

      <div className="ag-type-cards">
        <button
          className={`ag-type-card${form.goalType === 'short' ? ' ag-type-card--selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, goalType: 'short' }))}
        >
          <div className="ag-type-card__header">
            <span className="ag-type-card__name">Short-Term</span>
            <span className="ag-type-card__icon" aria-hidden="true">⏩</span>
          </div>
          <p className="ag-type-card__body">
            Short-Term goals are goals that you could achieve within <strong>days</strong>, <strong>weeks</strong>, or a few <strong>months.</strong>
          </p>
          <p className="ag-type-card__cta">
            Use this option for any goals you have that you want to complete in 6-months or less
          </p>
        </button>

        <button
          className={`ag-type-card${form.goalType === 'long' ? ' ag-type-card--selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, goalType: 'long' }))}
        >
          <div className="ag-type-card__header">
            <span className="ag-type-card__name">Long-Term</span>
            <span className="ag-type-card__icon" aria-hidden="true">🏃</span>
          </div>
          <p className="ag-type-card__body">
            Long-Term goals require sustained commitment and dedication for at least <strong>6-months</strong> to <strong>a year,</strong> if not longer.
          </p>
          <p className="ag-type-card__cta">
            Use this option for any goals that are long term, or continuous goals you want to achieve for at least 6-months.
          </p>
        </button>
      </div>
    </div>
  )
}

/* ─── Step 1 — What to accomplish ───────────── */

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
        values:            goal.values ?? [],
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
        <h2 className="ag-step__title">What do you want to accomplish?</h2>
        <p className="ag-step__subtitle">Be as specific as you like — this is entirely yours.</p>
      </div>

      <div className="ag-textarea-wrap">
        <textarea
          className="ag-textarea"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value.slice(0, MAX_TITLE) }))}
          placeholder="e.g. Meditate for 10 minutes each morning"
          rows={5}
          autoFocus
        />
        <span className="ag-textarea__counter">{form.title.length > 0 ? `${form.title.length}/800` : '/800'}</span>
      </div>

      <button
        className="ag-ai-suggest-btn"
        onClick={handleSuggest}
        disabled={suggesting}
      >
        {suggesting ? (
          <><span className="ag-ai-suggest-btn__spinner" aria-hidden="true" />Thinking…</>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 0L8.26 5.74L14 7L8.26 8.26L7 14L5.74 8.26L0 7L5.74 5.74Z" fill="currentColor"/>
            </svg>
            {form.title.trim() ? 'Try a different suggestion' : '+ Suggest one for me'}
          </>
        )}
      </button>

      {suggestError && <p className="ag-ai-suggest-error">{suggestError}</p>}
    </div>
  )
}

/* ─── Step 2 — Define success ────────────────── */

function StepSuccess({ form, setForm }) {
  return (
    <div className="ag-step">
      <p className="ag-goal-echo">"{form.title}"</p>
      <div className="ag-step__prompt">
        <h2 className="ag-step__title">Define Success For this Goal</h2>
        <p className="ag-step__subtitle">Is this goal more:</p>
      </div>

      <div className="ag-success-cards">
        <button
          className={`ag-success-card${form.successType === 'outcome' ? ' ag-success-card--selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, successType: 'outcome' }))}
        >
          <p className="ag-success-card__label"><u>Outcome-Based?:</u></p>
          <p className="ag-success-card__motto">"I'll succeed when I reach a <u>specific target</u>"</p>
          <div className="ag-success-card__body">
            <p className="ag-success-card__for">For clear, one-time goals, e.g:</p>
            <ul className="ag-success-card__examples">
              <li>"Run a <u>marathon</u>"</li>
              <li>"Learn <u>500</u> spanish words"</li>
              <li>"Save <u>$5,000</u>"</li>
            </ul>
          </div>
        </button>

        <button
          className={`ag-success-card${form.successType === 'habit' ? ' ag-success-card--selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, successType: 'habit' }))}
        >
          <p className="ag-success-card__label"><u>Habit-Based?:</u></p>
          <p className="ag-success-card__motto">"I'll succeed by staying <u>consistent</u>"</p>
          <div className="ag-success-card__body">
            <p className="ag-success-card__for">For Goals that primarily need consistency, e.g:</p>
            <ul className="ag-success-card__examples">
              <li>"Go to bed before 10pm"</li>
              <li>"Workout Regularly"</li>
              <li>"Journal Daily"</li>
            </ul>
          </div>
        </button>
      </div>
    </div>
  )
}

/* ─── Step 3 — Tracking window ───────────────── */

const DAY_OPTIONS = [
  { label: '1 week', value: 7 },
  { label: '2 weeks', value: 14 },
  { label: '1 month', value: 30 },
  { label: '2 months', value: 60 },
  { label: '3 months', value: 90 },
]

const FRICTION_OPTIONS = ['Time', 'Energy', 'Motivation', 'Get Too Busy / Other Priorities']

const EXEC_OPTIONS = [
  { key: 'daily',    icon: '☀️', label: 'Daily Habit',        desc: 'Every Single Day' },
  { key: 'weekly',   icon: '🗓️', label: 'A Few Times A Week', desc: 'Consistent, but not daily' },
  { key: 'flexible', icon: '🌊', label: 'Flexible',            desc: 'Whenever the moment feels right' },
]

function StepTracking({ form, setForm }) {
  function toggleFriction(v) {
    setForm(f => ({
      ...f,
      friction: f.friction.includes(v) ? f.friction.filter(x => x !== v) : [...f.friction, v],
    }))
  }

  return (
    <div className="ag-step">
      <p className="ag-goal-echo">"{form.title}"</p>

      {/* Timeframe */}
      <div className="ag-section">
        <h2 className="ag-section__title">Tracking Window</h2>
        <p className="ag-step__subtitle">Do you want to add an ideal completion date?</p>

        <div className="ag-tab-row">
          <button
            className={`ag-tab${form.timeframeType === 'date' ? ' ag-tab--active' : ''}`}
            onClick={() => setForm(f => ({ ...f, timeframeType: 'date', dueDays: null }))}
          >
            Set a Date
          </button>
          <button
            className={`ag-tab${form.timeframeType === 'days' ? ' ag-tab--active' : ''}`}
            onClick={() => setForm(f => ({ ...f, timeframeType: 'days', dueDate: '' }))}
          >
            Within a Timeframe
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
          <div className="ag-chips ag-chips--wrap">
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

      {/* Execution style */}
      <div className="ag-section">
        <h2 className="ag-section__title">How Do You Want to Approach This?</h2>
        <div className="ag-exec-cards">
          {EXEC_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`ag-exec-card${form.executionStyle === opt.key ? ' ag-exec-card--selected' : ''}`}
              onClick={() => setForm(f => ({ ...f, executionStyle: opt.key }))}
            >
              <span className="ag-exec-card__icon" aria-hidden="true">{opt.icon}</span>
              <div className="ag-exec-card__text">
                <span className="ag-exec-card__label">{opt.label}</span>
                <span className="ag-exec-card__desc">{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {form.executionStyle === 'weekly' && (
          <div className="ag-weekly">
            <p className="ag-weekly__label">How many times per week?</p>
            <div className="ag-chips">
              {[2,3,4,5,6,7].map(n => (
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

      {/* Friction */}
      <div className="ag-section">
        <h2 className="ag-section__title">What Might Get in the Way?</h2>
        <p className="ag-step__subtitle">What are some common roadblocks you've run into when tackling your goals?</p>
        <div className="ag-friction-chips">
          {FRICTION_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`ag-friction-chip${form.friction.includes(opt) ? ' ag-friction-chip--selected' : ''}`}
              onClick={() => toggleFriction(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4 — Difficulty + Minimum version ─── */

const INTENSITY_LABELS = {
  1: 'Very Light — Easy to fit into your day',
  2: 'Light — Manageable with some consistency',
  3: 'Moderate — Requires real commitment',
  4: 'Challenging — You\'ll need to push yourself',
  5: 'Intense — A serious stretch goal',
}

function StepEffort({ form, setForm }) {
  return (
    <div className="ag-step">
      <p className="ag-goal-echo">"{form.title}"</p>

      {/* Intensity */}
      <div className="ag-section">
        <h2 className="ag-section__title">How Hard Do You Think This Will Be?</h2>
        <p className="ag-step__subtitle">Your honest prediction — Trumi will ask you later how it actually felt, so you can see the difference.</p>

        <div className="ag-flame-row">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              className="ag-flame-btn"
              onClick={() => setForm(f => ({ ...f, intensity: n }))}
              aria-label={`${n} out of 5`}
            >
              <FlameIcon active={form.intensity !== null && n <= form.intensity} />
            </button>
          ))}
        </div>
        {form.intensity ? (
          <p className="ag-flame-label">{INTENSITY_LABELS[form.intensity]}</p>
        ) : (
          <p className="ag-flame-label ag-flame-label--empty">Tap a flame to rate the difficulty</p>
        )}
      </div>

      {/* Minimum version */}
      <div className="ag-section">
        <h2 className="ag-section__title">What's the Smallest Version of This Goal?</h2>
        <p className="ag-step__subtitle">
          On a difficult, or busy day, what would still count as showing up for this goal?{' '}
          <strong>Even 5% is still progress.</strong>
        </p>

        <div className="ag-example-row">
          <span className="ag-example-row__ex">Ex.</span>
          <p className="ag-example-row__text">
            If your goal is to run 5km, your minimum might be:{' '}
            "Put on my shoes and walk to the end of the block."
          </p>
        </div>

        <p className="ag-min-label">On a busy day I can still...</p>
        <div className="ag-textarea-wrap">
          <textarea
            className="ag-textarea"
            value={form.minimumVersion}
            onChange={e => setForm(f => ({ ...f, minimumVersion: e.target.value.slice(0, MAX_MIN) }))}
            placeholder="Walk around the block"
            rows={4}
          />
          <span className="ag-textarea__counter">
            {form.minimumVersion.length > 0 ? `${form.minimumVersion.length}/300` : '/300'}
          </span>
        </div>

        <button className="ag-ai-suggest-btn" disabled>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 0L8.26 5.74L14 7L8.26 8.26L7 14L5.74 8.26L0 7L5.74 5.74Z" fill="currentColor"/>
          </svg>
          + Suggest for me
        </button>
      </div>
    </div>
  )
}

/* ─── Step 5 — Values ────────────────────────── */

function StepValues({ form, setForm, userValues }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customVal, setCustomVal]   = useState('')

  const aiConnected = form.aiConnectedValues ?? []
  const all = [...new Set([...(userValues.top3 ?? []), ...(userValues.top10 ?? [])])]
  const fallback = ['Health','Growth','Connection','Peace','Family','Creativity','Freedom','Balance','Play','Mental Health','Self Care','Adventure']
  const pool = all.length > 0 ? all : fallback

  const primaryChips  = aiConnected.length > 0 ? aiConnected : pool.slice(0, 8)
  const secondaryPool = pool.filter(v => !primaryChips.includes(v))

  function toggle(v) {
    setForm(f => ({
      ...f,
      values: f.values.includes(v) ? f.values.filter(x => x !== v) : [...f.values, v],
    }))
  }

  function addCustom() {
    const v = customVal.trim()
    if (!v) return
    setForm(f => ({ ...f, values: [...f.values, v] }))
    setCustomVal('')
    setShowCustom(false)
  }

  const hasAi = aiConnected.length > 0

  return (
    <div className="ag-step">
      <p className="ag-goal-echo">"{form.title}"</p>

      <div className="ag-step__prompt">
        <h2 className="ag-step__title">Does This Feel Right?</h2>
        <p className="ag-step__subtitle">
          {hasAi
            ? "Trumi thinks that this goal supports these values. Tap to deselect any that don't fit, or add more below."
            : 'Which of your values does this goal support? Select one or more.'}
        </p>
      </div>

      <div className="ag-value-chips">
        {primaryChips.map(v => (
          <button
            key={v}
            className={`ag-value-chip${form.values.includes(v) ? ' ag-value-chip--selected' : ''}`}
            onClick={() => toggle(v)}
          >
            {v}
          </button>
        ))}
      </div>

      {secondaryPool.length > 0 && (
        <div className="ag-values-more">
          <p className="ag-values-more__label">+ Add Others</p>
          <div className="ag-value-chips">
            {secondaryPool.map(v => (
              <button
                key={v}
                className={`ag-value-chip${form.values.includes(v) ? ' ag-value-chip--selected' : ''}`}
                onClick={() => toggle(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {!showCustom ? (
        <button className="ag-value-chip ag-value-chip--custom" onClick={() => setShowCustom(true)}>
          + Use my own words
        </button>
      ) : (
        <div className="ag-custom-form">
          <input
            className="ag-custom-form__input"
            value={customVal}
            onChange={e => setCustomVal(e.target.value)}
            placeholder="Type a value…"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && addCustom()}
          />
          <button className="ag-custom-form__add" onClick={addCustom}>Add</button>
          <button className="ag-custom-form__cancel" onClick={() => setShowCustom(false)}>✕</button>
        </div>
      )}
    </div>
  )
}

/* ─── Step 6 — Confirmation ──────────────────── */

function StepConfirmation({ form }) {
  function formatDue() {
    if (form.timeframeType === 'date' && form.dueDate) {
      return new Date(form.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
    if (form.timeframeType === 'days' && form.dueDays) {
      const d = new Date()
      d.setDate(d.getDate() + form.dueDays)
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
    return null
  }

  function formatExec() {
    if (form.executionStyle === 'daily')    return 'Every day'
    if (form.executionStyle === 'weekly')   return `${form.weeklyTimes}× per week`
    if (form.executionStyle === 'flexible') return 'Flexible — whenever you can'
    return null
  }

  const today    = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const dueLabel = formatDue()
  const execLabel = formatExec()

  return (
    <div className="ag-step">
      <div className="ag-step__prompt">
        <h2 className="ag-step__title">Here's Your Goal</h2>
        <p className="ag-step__subtitle">If everything looks right, go ahead and add it to your active goals!</p>
      </div>

      <div className="ag-confirm-card">
        {/* Title band */}
        <div className="ag-confirm-card__band">
          <h3 className="ag-confirm-card__title">{form.title}</h3>
        </div>

        {/* Meta row */}
        <div className="ag-confirm-card__meta">
          <span className="ag-confirm-card__meta-item">
            Goal Started: <u>{today}</u>
          </span>
          {dueLabel && (
            <span className="ag-confirm-card__meta-item ag-confirm-card__meta-item--right">
              Current Tracking Window: Until <u>{dueLabel}</u>
            </span>
          )}
        </div>

        <div className="ag-confirm-card__body">
          {/* Execution */}
          {execLabel && (
            <p className="ag-confirm-card__exec">{execLabel}</p>
          )}

          {/* Flames */}
          {form.intensity && (
            <div className="ag-confirm-card__flames">
              {[1,2,3,4,5].map(n => (
                <FlameIcon key={n} active={n <= form.intensity} size={20} />
              ))}
              <span className="ag-confirm-card__intensity-text">
                {INTENSITY_LABELS[form.intensity]}
              </span>
            </div>
          )}

          {/* Values */}
          {form.values.length > 0 && (
            <div className="ag-confirm-card__values">
              {form.values.map(v => (
                <span key={v} className="ag-confirm-value-chip">{v}</span>
              ))}
            </div>
          )}

          {/* Minimum version */}
          {form.minimumVersion && (
            <div className="ag-confirm-card__min">
              <span className="ag-confirm-card__min-label">On a busy day:</span>
              <span className="ag-confirm-card__min-text">{form.minimumVersion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────── */

export default function AddGoal() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    goalType:          null,
    title:             '',
    aiConnectedValues: [],
    successType:       null,
    timeframeType:     null,
    dueDate:           '',
    dueDays:           null,
    executionStyle:    null,
    weeklyTimes:       3,
    friction:          [],
    intensity:         null,
    minimumVersion:    '',
    values:            [],
  })
  const [userValues] = useState(loadUserValues)

  function canAdvance() {
    switch (step) {
      case 0: return form.goalType !== null
      case 1: return form.title.trim().length > 0
      case 2: return true
      case 3: return form.executionStyle !== null
      case 4: return true
      case 5: return true
      default: return true
    }
  }

  const canSkip = step === 2 || step === 3 || step === 4 || step === 5

  function handleNext() { setStep(s => s + 1) }

  function handleBack() {
    if (step === 0) navigate('/goals')
    else setStep(s => s - 1)
  }

  function handleSave() {
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
    })()

    const now      = new Date()
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
      id:                   Date.now(),
      title:                form.title,
      description:          form.minimumVersion ? `On a busy day: ${form.minimumVersion}` : '',
      aka:                  '',
      startDate:            dateLabel,
      dueDate:              dueDateLabel,
      pausedDate:           null,
      status:               'active',
      term:                 form.goalType === 'long' ? 'long' : 'short',
      successType:          form.successType,
      intensity:            form.intensity,
      perceivedDifficulty:  form.intensity,
      progress:             0,
      progressMessage:      '',
      values:               form.values,
      executionStyle:       form.executionStyle,
      weeklyTimes:          form.weeklyTimes,
      friction:             form.friction,
      minimumVersion:       form.minimumVersion,
      loggedDays:           [],
    }

    localStorage.setItem('trumi_goals', JSON.stringify([...existing, newGoal]))
    navigate('/goals')
  }

  const isFinal = step === TOTAL_STEPS - 1
  const dotsFilled = DOT_PROGRESS[step] ?? 0

  return (
    <div className="ag-page">

      {/* Header */}
      <PageHeader title="Add a Goal" />

      {/* Step dots — visible only for steps 1–6 */}
      {step > 0 && (
        <div className="ag-dots" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`ag-dot${i < dotsFilled ? ' ag-dot--filled' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Back button */}
      <button className="ag-back-btn" onClick={handleBack} aria-label="Go back">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Step content */}
      <div className="ag-content" key={step}>
        {step === 0 && <StepGoalType    form={form} setForm={setForm} />}
        {step === 1 && <StepDefine      form={form} setForm={setForm} userValues={userValues} />}
        {step === 2 && <StepSuccess     form={form} setForm={setForm} />}
        {step === 3 && <StepTracking    form={form} setForm={setForm} />}
        {step === 4 && <StepEffort      form={form} setForm={setForm} />}
        {step === 5 && <StepValues      form={form} setForm={setForm} userValues={userValues} />}
        {step === 6 && <StepConfirmation form={form} />}
      </div>

      {/* Footer */}
      <div className="ag-footer">
        {isFinal ? (
          <button className="ag-cta-btn" onClick={handleSave}>
            Add to My Goals
          </button>
        ) : (
          <div className="ag-footer__row">
            <button
              className="ag-cta-btn"
              onClick={handleNext}
              disabled={!canAdvance()}
            >
              Next
            </button>
            {canSkip && (
              <button className="ag-skip-btn" onClick={handleNext}>
                {step === 2 ? "I'm not sure... skip" : 'skip'}
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
