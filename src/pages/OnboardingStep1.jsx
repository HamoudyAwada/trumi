import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

const MAX = 10

const VALUES_DATA = [
  {
    category: 'Well-Being and Inner State',
    values: ['Peace', 'Balance', 'Happiness', 'Self-Love', 'Simplicity', 'Mindfulness'],
  },
  {
    category: 'Growth & Achievement',
    values: ['Growth', 'Discipline', 'Achievement', 'Purpose'],
  },
  {
    category: 'Relationships & Connection',
    values: ['Family', 'Faith', 'Connection', 'Friendship', 'Kindness'],
  },
  {
    category: 'Integrity & Character',
    values: ['Integrity', 'Courage', 'Responsibility'],
  },
  {
    category: 'Lifestyle & Freedom',
    values: ['Freedom', 'Adventure', 'Stability', 'Creativity'],
  },
  {
    category: 'Work & Impact',
    values: ['Impact', 'Wealth', 'Leadership'],
  },
  {
    category: 'Health & Energy',
    values: ['Health', 'Energy', 'Sleep'],
  },
]

const VALUE_SYNONYMS = {
  Peace:          'calmness, low stress, emotional stability',
  Balance:        'harmony, equilibrium, moderation',
  Happiness:      'joy, positivity, contentment',
  'Self-Love':    'self-acceptance, self-care, inner worth',
  Simplicity:     'minimalism, clarity, ease',
  Mindfulness:    'presence, awareness, focus',
  Growth:         'learning, progress, improvement',
  Discipline:     'consistency, habits, self-control',
  Achievement:    'success, accomplishment, results',
  Purpose:        'meaning, mission, direction',
  Family:         'belonging, loyalty, home',
  Faith:          'spirituality, belief, trust',
  Connection:     'relationships, belonging, community',
  Friendship:     'companionship, trust, support',
  Kindness:       'compassion, generosity, empathy',
  Integrity:      'honesty, ethics, authenticity',
  Courage:        'bravery, resilience, boldness',
  Responsibility: 'accountability, reliability, ownership',
  Freedom:        'independence, autonomy, choice',
  Adventure:      'exploration, novelty, excitement',
  Stability:      'security, consistency, groundedness',
  Creativity:     'expression, imagination, innovation',
  Impact:         'service, legacy, change',
  Wealth:         'financial security, abundance, prosperity',
  Leadership:     'influence, vision, guidance',
  Health:         'fitness, vitality, wellness',
  Energy:         'vitality, momentum, aliveness',
  Sleep:          'rest, recovery, renewal',
}

const POPDOWN_TEXT = 'Personal values are the beliefs, principles, and standards that guide your everyday actions and behaviour. They define what is important to you, and help serve as your compass for navigating all of life\'s challenges.'

export default function OnboardingStep1() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [query, setQuery]       = useState('')
  const [infoOpen, setInfoOpen] = useState(false)

  function toggle(value) {
    setSelected(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= MAX) return prev
      return [...prev, value]
    })
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return VALUES_DATA
    const q = query.toLowerCase()
    return VALUES_DATA
      .map(cat => ({
        ...cat,
        values: cat.values.filter(v => v.toLowerCase().includes(q)),
      }))
      .filter(cat => cat.values.length > 0)
  }, [query])

  const selectedSynonyms = selected.filter(v => VALUE_SYNONYMS[v])

  return (
    <div className="ob-page">

      {/* Header */}
      <div className="ob-header">
        <button className="ob-back-btn" onClick={() => navigate('/onboarding')} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ob-page-label">Values</span>
      </div>

      <div className="ob-s1__scroll-area">

        <h2 className="ob-s1__title">Pick {MAX} Values that Matter The Most to you</h2>

        {/* Popdown info */}
        <div className="ob-popdown">
          <button className="ob-popdown__trigger" onClick={() => setInfoOpen(o => !o)}>
            {infoOpen ? '▾' : '▸'} *What are Personal Values?
          </button>
          {infoOpen && (
            <p className="ob-popdown__body">{POPDOWN_TEXT}</p>
          )}
        </div>

        {/* Search */}
        <div className="ob-search">
          <svg className="ob-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="ob-search__input"
            type="text"
            placeholder="Search Here"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search values"
          />
        </div>

        {/* Count badge */}
        <p className="ob-count-badge">{selected.length} / {MAX} selected</p>

        {/* Value categories */}
        {filtered.map(cat => (
          <div key={cat.category} className="ob-category">
            <p className="ob-category__name">{cat.category}</p>
            <div className="ob-category__chips">
              {cat.values.map(value => {
                const isActive = selected.includes(value)
                const isFaded  = !isActive && selected.length >= MAX
                return (
                  <button
                    key={value}
                    className={`ob-chip${isActive ? ' ob-chip--active' : ''}${isFaded ? ' ob-chip--faded' : ''}`}
                    onClick={() => toggle(value)}
                    disabled={isFaded}
                    aria-pressed={isActive}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Synonyms for selected values */}
        {selectedSynonyms.length > 0 && (
          <div className="ob-s1__synonyms">
            <p className="ob-s1__synonyms-label">Other words to describe your selected values:</p>
            {selectedSynonyms.map(v => (
              <div key={v} className="ob-s1__synonym-item">
                <span className="ob-s1__synonym-name">{v} </span>
                <span className="ob-s1__synonym-desc">({VALUE_SYNONYMS[v]})</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="ob-footer">
        <button
          className="ob-btn"
          disabled={selected.length < MAX}
          onClick={() => navigate('/onboarding/step/2', { state: { top10: selected } })}
        >
          Continue
        </button>
        <p className="ob-step-label">Step 1 of 5</p>
      </div>

    </div>
  )
}
