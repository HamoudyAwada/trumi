import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getValueAlignment } from '../services/ai'
import './GoalDetail.css'

/* ─── Helpers ────────────────────────────────── */

function loadGoal(id) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    return goals.find(g => String(g.id) === String(id)) ?? null
  } catch { return null }
}

function saveGoal(updatedGoal) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    const next = goals.map(g => String(g.id) === String(updatedGoal.id) ? updatedGoal : g)
    localStorage.setItem('trumi_goals', JSON.stringify(next))
  } catch { /* noop */ }
}

function loadEntriesForGoal(goalId) {
  try {
    const entries = JSON.parse(localStorage.getItem('trumi_log_entries') ?? '[]')
    return entries.filter(e => String(e.goalId) === String(goalId))
  } catch { return [] }
}

function loadUserValues() {
  try { return JSON.parse(localStorage.getItem('trumi_values') ?? '{}') } catch { return {} }
}

function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

/** Array of 31 days: 30 days ago → today (today is last / rightmost). */
function generateDayRange() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      iso:      d.toISOString().split('T')[0],
      dayNum:   d.getDate(),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday:  i === 0,
    })
  }
  return days
}

const CONTRIBUTION_LABELS = {
  lot:       'Yes, a lot!',
  somewhat:  'Somewhat',
  not_today: 'Not Today',
}

const FALLBACK_VALUES = [
  'Health', 'Growth', 'Connection', 'Peace', 'Family',
  'Creativity', 'Freedom', 'Balance', 'Play', 'Mental Health',
  'Self Care', 'Adventure',
]

/* ─── Mood SVG faces ─────────────────────────── */

function FaceHappy() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#136F1F"/>
      <circle cx="17" cy="20" r="3" fill="white"/>
      <circle cx="31" cy="20" r="3" fill="white"/>
      <path d="M15 29c2.5 4 15.5 4 18 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function FaceNeutral() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#DFBC0E"/>
      <circle cx="17" cy="20" r="3" fill="white"/>
      <circle cx="31" cy="20" r="3" fill="white"/>
      <path d="M16 30h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function FaceSad() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#B01B11"/>
      <circle cx="17" cy="20" r="3" fill="white"/>
      <circle cx="31" cy="20" r="3" fill="white"/>
      <path d="M15 33c2.5-4 15.5-4 18 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

const MOOD_FACES = { happy: FaceHappy, neutral: FaceNeutral, sad: FaceSad }

/* ─── ValuesCharacter illustration ──────────── */

function ValuesCharacter() {
  return (
    <svg className="gd-values__character" width="99" height="99" viewBox="0 0 99 99" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M31.8055 24.5998C31.8055 24.5998 -0.0950812 46.2986 15.113 80.7665C15.6664 82.0297 16.3046 83.3305 16.9841 84.63L20.968 92.1802L36.8474 86.8361C36.8474 86.8361 18.2289 57.9567 28.2351 44.6054C30.5237 41.8478 32.5417 41.469 33.0715 39.3281L29.1317 38.5033L31.7624 24.5601L31.8055 24.5998Z" fill="white"/>
      <path d="M20.9826 92.5113L21.0651 92.5077L36.9445 87.1636C37.0275 87.16 37.1068 87.0734 37.1444 86.9886L37.1318 86.6985C36.9532 86.416 18.7223 57.8523 28.5344 44.7997C29.4803 43.6372 30.3631 42.9342 31.1648 42.2764C32.248 41.3985 33.0909 40.7388 33.4479 39.3944L33.437 39.1457C33.3917 39.0647 33.3069 39.0268 33.2226 38.989L29.5766 38.2345L32.1782 24.5832C32.1728 24.4589 32.1674 24.3346 32.0395 24.2571C31.9117 24.1796 31.7875 24.185 31.7081 24.2716C31.627 24.3166 23.6051 29.8576 17.5913 39.5466C12.0023 48.5111 7.0258 62.9307 14.9095 80.8582C15.4647 82.1627 16.1025 83.464 16.7824 84.763L20.7664 92.3131C20.813 92.4356 20.9391 92.4719 21.0633 92.4665L20.9826 92.5113Z" fill="black"/>
      <path d="M40.3732 42.9546C40.3732 42.9546 42.4949 47.8037 37.5227 47.1071C32.5506 46.4105 18.6349 46.3119 23.0674 65.0964L44.1756 55.8697C44.1756 55.8697 47.6551 53.7659 46.0162 48.5636C44.3774 43.3613 40.3314 42.9564 40.3314 42.9564L40.3732 42.9546Z" fill="black"/>
      <path d="M44.5342 55.5212C44.5342 55.5212 42.3611 56.1562 41.26 54.7093C41.26 54.7093 40.0148 56.6324 37.3045 56.3769C34.5942 56.1213 34.2803 53.6848 34.2803 53.6848C34.2803 53.6848 33.9508 56.6064 31.3216 57.2607C28.6924 57.9156 25.4726 60.2569 25.8677 62.6481C25.8948 63.2697 25.3341 62.7959 25.1306 61.9326C24.977 61.2752 23.7428 61.5366 23.3357 61.7207C20.8021 62.6616 21.2097 66.2982 22.4123 68.1559C23.6145 70.0135 23.3312 69.2368 24.009 69.5398C24.009 69.5398 26.0236 79.5425 24.8274 81.6297L50.7552 78.1724C50.7552 78.1724 47.0814 71.0657 46.7275 65.8073C46.3735 60.549 44.493 55.523 44.493 55.523L44.5342 55.5212Z" fill="white"/>
      <path d="M79.7217 15.906C79.7217 15.906 41.7556 7.09824 35.6539 7.15688L28.8198 38.0188L71.6931 46.9862C71.6931 46.9862 79.6541 21.0167 79.7217 15.906Z" fill="#6666CC"/>
      <path d="M55.8181 17.1987C56.9103 17.4832 57.87 24.2517 57.87 24.2517C57.87 24.2517 64.619 24.7462 64.2751 26.3807C63.9311 28.0153 58.8404 29.3587 58.8404 29.3587C58.8404 29.3587 60.8942 36.4531 59.5661 36.4696C58.2379 36.486 53.1874 30.1868 53.1874 30.1868C53.1874 30.1868 47.5041 34.1306 45.0895 33.0318C42.6745 31.9329 48.8528 26.9707 48.8528 26.9707C48.8528 26.9707 43.9395 22.8664 44.1631 22.2752C44.3862 21.6842 51.7373 22.6507 51.7373 22.6507C51.7373 22.6507 54.8521 16.9501 55.8596 17.1968L55.8181 17.1987Z" fill="#6666CC"/>
      <path d="M20.9683 92.1801C20.7429 88.9094 21.4664 85.5141 23.3437 82.8575C25.5743 79.7285 29.2324 77.9077 32.9733 77.0385C36.0564 76.3225 39.2464 76.142 42.4128 76.3776C47.9109 76.7604 52.6003 79.5456 58.0374 80.4294C58.5384 80.4907 59.0412 80.5937 59.5007 80.6563C62.3391 80.9894 65.3251 80.9004 67.9325 79.7486C70.54 78.5964 71.6084 77.3874 72.7326 75.5527C73.8568 73.7179 74.5521 71.5694 75.0004 69.4735C75.8576 65.3252 75.2423 60.7428 74.3586 56.6699C74.1512 55.7237 73.9366 54.612 73.3634 53.848C71.8222 51.8389 68.4754 49.3689 68.1974 46.8063L71.2917 47.2942C71.0845 47.3032 70.6698 46.3662 70.5383 46.2059C70.1813 45.6401 69.8244 45.0743 69.5089 44.5067C68.8348 43.3318 68.2813 42.0686 68.0991 40.7477C68.0396 40.3351 67.9782 39.8809 68.0863 39.5025C68.1943 39.124 68.4664 38.6969 68.8755 38.5544C69.3242 38.3688 69.8702 38.511 70.2595 38.8678C70.6488 39.2246 70.8741 39.63 71.1409 40.0336C71.4077 40.4372 71.6349 40.8841 71.9809 41.2012C72.8875 41.9922 74.6752 42.0387 74.6497 40.5034C74.6334 40.1304 73.9377 39.4132 74.0061 39.078L75.42 34.3653C75.3497 34.6591 77.6027 36.8032 77.8208 37.0428C79.7981 39.5312 81.4943 42.2395 82.9058 45.0848C89.2747 57.8046 90.0719 73.2179 84.7922 86.4043C79.5124 99.5913 83.7637 89.4809 83.515 89.4917" fill="white"/>
      <path d="M23.8674 34.9125L30.1035 28.4113L30.502 28.9752L30.691 29.5069C30.691 29.5069 27.9632 31.7022 29.524 33.2121C31.0848 34.722 32.6448 31.4564 33.0375 30.9409C33.4307 30.4254 34.3493 29.5964 35.1603 30.1008C35.9714 30.6053 35.296 33.2094 33.8781 34.9739C32.4602 36.7384 29.4694 39.5681 29.4694 39.5681" fill="white"/>
    </svg>
  )
}

/* ════════════════════════════════════════
   GoalDetail Page
   ════════════════════════════════════════ */
export default function GoalDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [goal,          setGoal]          = useState(() => loadGoal(id))
  const [selectedDate,  setSelectedDate]  = useState(getTodayISO)
  const [selectedValue, setSelectedValue] = useState(null)

  // 3-dot menu
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Add reason
  const [addingReason,  setAddingReason]  = useState(false)
  const [reasonInput,   setReasonInput]   = useState('')

  // Edit mode
  const [isEditing,    setIsEditing]    = useState(false)
  const [editValues,   setEditValues]   = useState([])
  const [regenLoading, setRegenLoading] = useState(false)

  const menuRef  = useRef(null)
  const stripRef = useRef(null)

  const days = generateDayRange()

  // Scroll strip to today (rightmost) on mount
  useEffect(() => {
    if (stripRef.current) {
      stripRef.current.scrollLeft = stripRef.current.scrollWidth
    }
  }, [])

  // Close 3-dot menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  if (!goal) {
    return (
      <div className="gd-not-found">
        <p className="gd-not-found__text">This goal couldn't be found.</p>
        <button className="gd-not-found__btn" onClick={() => navigate('/goals')}>
          Back to Goals
        </button>
      </div>
    )
  }

  const isPaused       = goal.status === 'paused'
  const entries        = loadEntriesForGoal(goal.id)
  const loggedSet      = new Set(entries.map(e => e.date))
  const selectedEntry  = entries.find(e => e.date === selectedDate) ?? null
  const alignedValues  = goal.alignedValues ?? []
  const valueSummaries = goal.valueSummaries ?? {}
  const reasons        = goal.reasons ?? []

  // Build value pool for edit mode
  const userValuesData = loadUserValues()
  const userValuePool  = [...new Set([
    ...(userValuesData.top3  ?? []),
    ...(userValuesData.top10 ?? []),
    ...alignedValues,
  ])]
  const valuePool = userValuePool.length > 0 ? userValuePool : FALLBACK_VALUES

  const MoodFaceComp = selectedEntry?.mood ? MOOD_FACES[selectedEntry.mood] : null

  /* ── Handlers ── */

  function handleDayClick(day) {
    setSelectedDate(day.iso)
    setSelectedValue(null)
  }

  function handleValueChipClick(value) {
    setSelectedValue(v => v === value ? null : value)
  }

  function handlePause() {
    const dateLabel = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const updated = { ...goal, status: 'paused', pausedDate: dateLabel }
    setGoal(updated)
    saveGoal(updated)
    setMenuOpen(false)
  }

  function handleUnpause() {
    const updated = { ...goal, status: 'active', pausedDate: null }
    setGoal(updated)
    saveGoal(updated)
    setMenuOpen(false)
  }

  function handleDelete() {
    try {
      const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
      localStorage.setItem('trumi_goals', JSON.stringify(
        goals.filter(g => String(g.id) !== String(goal.id))
      ))
    } catch { /* noop */ }
    navigate('/goals')
  }

  function handleAddReason() {
    const trimmed = reasonInput.trim()
    if (!trimmed) { setAddingReason(false); return }
    const updated = { ...goal, reasons: [...reasons, trimmed] }
    setGoal(updated)
    saveGoal(updated)
    setReasonInput('')
    setAddingReason(false)
  }

  function handleDeleteReason(index) {
    const updated = { ...goal, reasons: reasons.filter((_, i) => i !== index) }
    setGoal(updated)
    saveGoal(updated)
  }

  function handleEditGoal() {
    setEditValues([...alignedValues])
    setIsEditing(true)
    setMenuOpen(false)
  }

  function toggleEditValue(v) {
    setEditValues(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    )
  }

  async function handleSaveEdits() {
    const valuesChanged =
      JSON.stringify([...editValues].sort()) !== JSON.stringify([...alignedValues].sort())

    if (valuesChanged) {
      setRegenLoading(true)
      try {
        const { alignedValues: newAligned, summaries } = await getValueAlignment({
          goalTitle: goal.title,
          values:    editValues,
        })
        const updated = { ...goal, alignedValues: newAligned, valueSummaries: summaries }
        setGoal(updated)
        saveGoal(updated)
      } catch {
        // If AI fails, save the user's manual selection without summaries
        const updated = { ...goal, alignedValues: editValues, valueSummaries: {} }
        setGoal(updated)
        saveGoal(updated)
      } finally {
        setRegenLoading(false)
      }
    }

    setIsEditing(false)
    setSelectedValue(null)
  }

  function scrollStrip(dir) {
    stripRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  /* ── Render ── */

  return (
    <div className="gd-page">

      {/* ── Nav row: back + title + 3-dot menu or Done ── */}
      <div className="gd-nav">
        <button className="gd-nav__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h1 className="gd-nav__title">{goal.title}</h1>

        {isEditing ? (
          <button
            className={`gd-nav__done-btn${regenLoading ? ' gd-nav__done-btn--loading' : ''}`}
            onClick={handleSaveEdits}
            disabled={regenLoading}
          >
            {regenLoading ? 'Saving…' : 'Done'}
          </button>
        ) : (
          <div className="gd-nav__menu-wrap" ref={menuRef}>
            <button
              className="gd-nav__menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Goal options"
              aria-expanded={menuOpen}
            >
              <svg width="20" height="4" viewBox="0 0 20 4" fill="none" aria-hidden="true">
                <circle cx="2"  cy="2" r="2" fill="#292952"/>
                <circle cx="10" cy="2" r="2" fill="#292952"/>
                <circle cx="18" cy="2" r="2" fill="#292952"/>
              </svg>
            </button>

            {menuOpen && (
              <div className="gd-nav__menu" role="menu">
                <button
                  className="gd-nav__menu-item"
                  role="menuitem"
                  onClick={isPaused ? handleUnpause : handlePause}
                >
                  {isPaused ? 'Resume Goal' : 'Pause Goal'}
                </button>
                <button
                  className="gd-nav__menu-item"
                  role="menuitem"
                  onClick={handleEditGoal}
                >
                  Edit Goal
                </button>
                <button
                  className="gd-nav__menu-item gd-nav__menu-item--danger"
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); setConfirmDelete(true) }}
                >
                  Delete Goal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Goal Started chip ── */}
      <div className="gd-started-chip">
        Goal Started: <span className="gd-started-chip__date">{goal.startDate}</span>
      </div>

      {/* ── Day picker strip ── */}
      <div className="gd-day-picker">
        <button
          className="gd-day-picker__arrow"
          onClick={() => scrollStrip(-1)}
          aria-label="Scroll to earlier dates"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="gd-day-picker__strip" ref={stripRef}>
          {days.map(day => {
            const logged     = loggedSet.has(day.iso)
            const isSelected = day.iso === selectedDate
            return (
              <div key={day.iso} className="gd-day-picker__col">
                <span className="gd-day-picker__label">{day.dayLabel}</span>
                <button
                  className={[
                    'gd-day-picker__cell',
                    logged      ? 'gd-day-picker__cell--logged'   : '',
                    day.isToday ? 'gd-day-picker__cell--today'    : '',
                    isSelected  ? 'gd-day-picker__cell--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleDayClick(day)}
                  aria-pressed={isSelected}
                >
                  {day.dayNum}
                </button>
                {day.isToday && (
                  <span className="gd-day-picker__today-label">Today</span>
                )}
              </div>
            )
          })}
        </div>

        <button
          className="gd-day-picker__arrow"
          onClick={() => scrollStrip(1)}
          aria-label="Scroll to later dates"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.5 14L11.5 9L6.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Log Information (only when entry exists for selected date) ── */}
      {selectedEntry && (
        <section className="gd-log-section">
          <h2 className="gd-log-section__heading">Log Information:</h2>
          <div className="gd-log-card">
            <div className="gd-log-card__top">
              <div className="gd-log-card__face">
                {MoodFaceComp && <MoodFaceComp />}
              </div>
              <div className="gd-log-card__contrib-pill">
                Contribution: {CONTRIBUTION_LABELS[selectedEntry.contribution] ?? selectedEntry.contribution}
              </div>
            </div>
            {selectedEntry.summary && (
              <p className="gd-log-card__summary">{selectedEntry.summary}</p>
            )}
          </div>
        </section>
      )}

      {/* ── Divider ── */}
      <div className="gd-divider" />

      {/* ── This Goal Supports Your Values ── */}
      <section className="gd-values-section">
        <div className="gd-values-section__banner-row">
          <ValuesCharacter />
          <div className="gd-values-section__banner">
            This Goal Supports your Values
          </div>
        </div>

        {isEditing ? (
          /* Edit mode: toggle which values align with this goal */
          <div className="gd-values-section__edit">
            <p className="gd-values-section__edit-label">
              Select the values this goal supports:
            </p>
            <div className="gd-values-section__edit-chips">
              {valuePool.map(v => (
                <button
                  key={v}
                  className={`gd-values-section__edit-chip${editValues.includes(v) ? ' gd-values-section__edit-chip--on' : ''}`}
                  onClick={() => toggleEditValue(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            {regenLoading && (
              <p className="gd-values-section__regen-note">
                Updating your value summaries…
              </p>
            )}
          </div>
        ) : (
          <>
            {alignedValues.length > 0 && (
              <div className="gd-values-section__chips">
                {alignedValues.map(v => (
                  <button
                    key={v}
                    className={`gd-values-section__chip${selectedValue === v ? ' gd-values-section__chip--active' : ''}`}
                    onClick={() => handleValueChipClick(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
            {selectedValue && valueSummaries[selectedValue] && (
              <p className="gd-values-section__value-summary">
                {valueSummaries[selectedValue]}
              </p>
            )}
          </>
        )}
      </section>

      {/* ── Divider ── */}
      <div className="gd-divider" />

      {/* ── Your Why ── */}
      <section className="gd-why-section">
        <h2 className="gd-why-section__heading">Your Why</h2>

        {reasons.length > 0 && (
          <div className="gd-why-section__chips">
            {reasons.map((r, i) => (
              <span key={i} className={`gd-why-section__chip${isEditing ? ' gd-why-section__chip--editing' : ''}`}>
                {r}
                {isEditing && (
                  <button
                    className="gd-why-section__chip-delete"
                    onClick={() => handleDeleteReason(i)}
                    aria-label={`Remove "${r}"`}
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {addingReason ? (
          <div className="gd-why-section__add-form">
            <input
              className="gd-why-section__add-input"
              type="text"
              value={reasonInput}
              onChange={e => setReasonInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddReason()}
              placeholder="e.g. I want to feel stronger"
              autoFocus
              maxLength={80}
            />
            <button className="gd-why-section__add-save" onClick={handleAddReason}>Add</button>
            <button
              className="gd-why-section__add-cancel"
              onClick={() => { setAddingReason(false); setReasonInput('') }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="gd-why-section__add-btn" onClick={() => setAddingReason(true)}>
            Add reason
          </button>
        )}
      </section>

      {/* ── Delete confirmation overlay ── */}
      {confirmDelete && (
        <div className="gd-confirm-overlay" role="dialog" aria-modal="true">
          <div className="gd-confirm-box">
            <p className="gd-confirm-box__title">Delete this goal?</p>
            <p className="gd-confirm-box__body">
              {`"${goal.title}" will be permanently deleted. This can't be undone.`}
            </p>
            <div className="gd-confirm-box__actions">
              <button
                className="gd-confirm-box__btn gd-confirm-box__btn--cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Keep It
              </button>
              <button
                className="gd-confirm-box__btn gd-confirm-box__btn--delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
