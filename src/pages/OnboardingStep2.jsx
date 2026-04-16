import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Onboarding.css'

const LOOKS_LIKE = {
  Peace:          ['Quiet mornings', 'Reading a book', 'Headphones on, listening to music', 'Calm heart rate', 'No obligations', 'Time alone'],
  Balance:        ['Equal work and rest', 'Planned breaks', 'Time for myself', 'Not overcommitting', 'Flexible schedule'],
  Happiness:      ['Laughing with friends', 'Doing things I love', 'Feeling light', 'Celebrating small wins', 'Gratitude moments'],
  'Self-Love':    ['Taking care of my body', 'Setting aside me-time', 'Being gentle with myself', 'Saying no when needed'],
  Simplicity:     ['Decluttered space', 'One thing at a time', 'Fewer commitments', 'Clear head', 'Minimal distractions'],
  Mindfulness:    ['Morning meditation', 'Being present in conversations', 'Phone-free time', 'Deep breathing', 'Journaling'],
  Growth:         ['Learning something new', 'Reading regularly', 'Reflecting on mistakes', 'Stepping outside comfort zone'],
  Discipline:     ['Sticking to a routine', 'Finishing what I start', 'Saying no to distractions', 'Showing up consistently'],
  Achievement:    ['Completing a goal', 'Tracking progress', 'Celebrating milestones', 'Raising the bar for myself'],
  Purpose:        ['Work that feels meaningful', 'Helping others', 'Knowing my why', 'Aligned daily actions'],
  Family:         ['Quality time together', 'Showing up for them', 'Open conversations', 'Shared meals', 'Checking in regularly'],
  Faith:          ['Prayer or reflection', 'Community practice', 'Living by my values', 'Trusting the process'],
  Connection:     ['Deep conversations', 'Feeling seen by others', 'Being present with people I care about', 'Shared experiences'],
  Friendship:     ['Reaching out first', 'Being a reliable friend', 'Shared laughs', 'Honest conversations'],
  Kindness:       ['Small acts of generosity', 'Listening without judgment', 'Checking in on people', 'Giving my time'],
  Integrity:      ['Keeping my word', 'Being honest even when hard', 'Aligned actions and values', 'Owning my mistakes'],
  Courage:        ['Speaking my truth', 'Taking the first step', 'Facing discomfort', 'Asking for help'],
  Responsibility: ['Following through on commitments', 'Owning my impact', 'Planning ahead', "Admitting when I'm wrong"],
  Freedom:        ['Flexible schedule', 'Making my own choices', 'Not being controlled by fear', 'Space to explore'],
  Adventure:      ['Trying new experiences', 'Traveling somewhere new', 'Saying yes to spontaneity', 'Learning a new skill'],
  Stability:      ['Consistent routine', 'Financial security', 'Knowing what to expect', 'Reliable relationships'],
  Creativity:     ['Making something', 'Brainstorming freely', 'Time without structure', 'Following curiosity'],
  Impact:         ['Work that helps others', 'Volunteering', 'Creating something lasting', 'Inspiring people around me'],
  Wealth:         ['Financial security', 'Saving regularly', 'Investing in myself', 'Living without financial stress'],
  Leadership:     ['Guiding others', 'Taking initiative', 'Being accountable to my team', 'Sharing my vision'],
  Health:         ['Regular movement', 'Eating well', 'Sleeping enough', 'Annual checkups', 'Listening to my body'],
  Energy:         ['Morning movement', 'Enough sleep', 'Avoiding energy drains', 'Doing things that light me up'],
  Sleep:          ['7+ hours a night', 'Consistent bedtime', 'Wind-down routine', 'Restful environment'],
}

const DEFAULT_CHIPS = ['Living it daily', "Something I'm working toward", 'Being intentional', '+ Use My Own Words']

export default function OnboardingStep2() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const top10 = state?.top10 ?? []

  const [top3, setTop3]           = useState([])
  const [valueLooks, setValueLooks] = useState({})
  const [customInputs, setCustom] = useState({})
  const [showCustom, setShowCustom] = useState({})

  function toggleTop3(value) {
    setTop3(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= 3) return prev
      return [...prev, value]
    })
  }

  function toggleChip(value, chip) {
    if (chip === '+ Use My Own Words') {
      setShowCustom(prev => ({ ...prev, [value]: true }))
      return
    }
    setValueLooks(prev => {
      const current = prev[value] ?? []
      const next = current.includes(chip)
        ? current.filter(c => c !== chip)
        : [...current, chip]
      return { ...prev, [value]: next }
    })
  }

  function addCustomWord(value) {
    const word = (customInputs[value] ?? '').trim()
    if (!word) return
    setValueLooks(prev => ({
      ...prev,
      [value]: [...(prev[value] ?? []), word],
    }))
    setCustom(prev => ({ ...prev, [value]: '' }))
    setShowCustom(prev => ({ ...prev, [value]: false }))
  }

  const canContinue = top3.length === 3

  return (
    <div className="ob-page">

      {/* Header */}
      <div className="ob-header">
        <button className="ob-back-btn" onClick={() => navigate('/onboarding/step/1', { state: { top10 } })} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ob-page-label">Most Important Values</span>
      </div>

      <h2 className="ob-s2__title">
        What 3 Values matter most to you <em>right now?</em>
      </h2>

      {/* Top 10 chips — pick 3 */}
      <div className="ob-s2__grid">
        {top10.map(value => {
          const isActive = top3.includes(value)
          const isFaded  = !isActive && top3.length >= 3
          return (
            <button
              key={value}
              className={`ob-chip${isActive ? ' ob-chip--active' : ''}${isFaded ? ' ob-chip--faded' : ''}`}
              onClick={() => toggleTop3(value)}
              disabled={isFaded}
              aria-pressed={isActive}
            >
              {value}
            </button>
          )
        })}
      </div>

      <div className="ob-s2__divider" />

      {/* Value look-like cards */}
      <div className="ob-s2__scroll-area">
        {top3.map(value => {
          const chips   = LOOKS_LIKE[value] ?? DEFAULT_CHIPS
          const selected = valueLooks[value] ?? []
          return (
            <div key={value} className="ob-value-card">
              <p className="ob-value-card__question">
                What does <em>{value}</em> look like in your life?
              </p>
              <div className="ob-card-box">
                {chips.map(chip => (
                  <button
                    key={chip}
                    className={`ob-card-chip${selected.includes(chip) ? ' ob-card-chip--active' : ''}`}
                    onClick={() => toggleChip(value, chip)}
                  >
                    {chip}
                  </button>
                ))}
                <button
                  className="ob-card-chip"
                  onClick={() => toggleChip(value, '+ Use My Own Words')}
                >
                  + Use My Own Words
                </button>
                {selected.filter(c => !chips.includes(c)).map(custom => (
                  <button
                    key={custom}
                    className="ob-card-chip ob-card-chip--active"
                    onClick={() => toggleChip(value, custom)}
                  >
                    {custom}
                  </button>
                ))}
              </div>
              {showCustom[value] && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    className="ob-custom-input"
                    type="text"
                    placeholder="Describe what it looks like…"
                    value={customInputs[value] ?? ''}
                    onChange={e => setCustom(prev => ({ ...prev, [value]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addCustomWord(value)}
                  />
                  <button className="ob-btn" style={{ padding: '4px 16px', fontSize: '13px' }} onClick={() => addCustomWord(value)}>Add</button>
                </div>
              )}
            </div>
          )
        })}

        {top3.length === 0 && (
          <p style={{ textAlign: 'center', color: '#8585d6', fontFamily: 'var(--font-primary)', fontSize: '14px', padding: '24px 0' }}>
            Select 3 values above to continue
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="ob-footer">
        <button
          className="ob-btn"
          disabled={!canContinue}
          onClick={() => navigate('/onboarding/step/3', { state: { top10, top3, valueLooks } })}
        >
          Continue
        </button>
        <p className="ob-step-label">Step 2 of 5</p>
      </div>

    </div>
  )
}
