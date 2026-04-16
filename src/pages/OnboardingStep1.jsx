import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

const MIN = 5
const MAX = 10

const VALUES_DATA = [
  {
    category: 'Well-Being & Inner State',
    values: [
      'Peace', 'Balance', 'Happiness', 'Self-Love', 'Simplicity', 'Mindfulness',
      'Gratitude', 'Contentment', 'Acceptance', 'Optimism', 'Joy', 'Serenity',
      'Self-Awareness', 'Emotional Health', 'Inner Peace',
    ],
  },
  {
    category: 'Growth & Achievement',
    values: [
      'Growth', 'Discipline', 'Achievement', 'Purpose', 'Resilience', 'Ambition',
      'Curiosity', 'Excellence', 'Mastery', 'Perseverance', 'Learning', 'Self-Improvement',
    ],
  },
  {
    category: 'Relationships & Connection',
    values: [
      'Family', 'Faith', 'Connection', 'Friendship', 'Kindness', 'Love',
      'Community', 'Empathy', 'Loyalty', 'Belonging', 'Partnership', 'Mentorship', 'Service',
    ],
  },
  {
    category: 'Integrity & Character',
    values: [
      'Integrity', 'Courage', 'Responsibility', 'Authenticity', 'Honesty',
      'Humility', 'Fairness', 'Transparency', 'Ethics',
    ],
  },
  {
    category: 'Lifestyle & Freedom',
    values: [
      'Freedom', 'Adventure', 'Stability', 'Creativity', 'Spontaneity',
      'Nature', 'Solitude', 'Play', 'Humor', 'Travel', 'Leisure', 'Work-Life Balance',
    ],
  },
  {
    category: 'Work & Impact',
    values: [
      'Impact', 'Wealth', 'Leadership', 'Entrepreneurship', 'Innovation',
      'Career', 'Expertise', 'Recognition', 'Autonomy',
    ],
  },
  {
    category: 'Health & Energy',
    values: [
      'Health', 'Energy', 'Sleep', 'Fitness', 'Nutrition',
      'Mental Health', 'Movement', 'Longevity', 'Vitality',
    ],
  },
]

const VALUE_SYNONYMS = {
  Peace:              'calmness, low stress, emotional stability',
  Balance:            'harmony, equilibrium, moderation',
  Happiness:          'joy, positivity, contentment',
  'Self-Love':        'self-acceptance, self-care, inner worth',
  Simplicity:         'minimalism, clarity, ease',
  Mindfulness:        'presence, awareness, focus',
  Gratitude:          'appreciation, thankfulness, counting blessings',
  Contentment:        'satisfaction, enough-ness, fulfillment',
  Acceptance:         'letting go, non-resistance, peace with what is',
  Optimism:           'hope, positive outlook, seeing the best',
  Joy:                'delight, lightness, inner happiness',
  Serenity:           'tranquility, stillness, deep calm',
  'Self-Awareness':   'introspection, knowing yourself, emotional intelligence',
  'Emotional Health': 'mental wellness, emotional regulation, inner stability',
  'Inner Peace':      'stillness, freedom from worry, deep calm',
  Growth:             'learning, progress, improvement',
  Discipline:         'consistency, habits, self-control',
  Achievement:        'success, accomplishment, results',
  Purpose:            'meaning, mission, direction',
  Resilience:         'bouncing back, toughness, adaptability',
  Ambition:           'drive, aspiration, goals',
  Curiosity:          'wonder, questioning, love of learning',
  Excellence:         'quality, high standards, doing your best',
  Mastery:            'expertise, depth, skill',
  Perseverance:       'grit, sticking with it, endurance',
  Learning:           'education, growth mindset, knowledge',
  'Self-Improvement': 'becoming better, personal development, leveling up',
  Family:             'belonging, loyalty, home',
  Faith:              'spirituality, belief, trust',
  Connection:         'relationships, belonging, community',
  Friendship:         'companionship, trust, support',
  Kindness:           'compassion, generosity, empathy',
  Love:               'deep care, affection, unconditional giving',
  Community:          'togetherness, shared purpose, belonging',
  Empathy:            'understanding others, compassion, emotional presence',
  Loyalty:            'faithfulness, commitment, reliability',
  Belonging:          'being accepted, feeling at home, connection',
  Partnership:        'collaboration, mutual support, teamwork',
  Mentorship:         'guiding others, learning from others, shared wisdom',
  Service:            'giving back, helping, contributing',
  Integrity:          'honesty, ethics, authenticity',
  Courage:            'bravery, resilience, boldness',
  Responsibility:     'accountability, reliability, ownership',
  Authenticity:       'being real, true to yourself, no pretending',
  Honesty:            'truth-telling, transparency, directness',
  Humility:           'modesty, openness, not needing to be right',
  Fairness:           'equality, justice, impartiality',
  Transparency:       'openness, no hidden agenda, clarity',
  Ethics:             'moral principles, doing the right thing, values-driven action',
  Freedom:            'independence, autonomy, choice',
  Adventure:          'exploration, novelty, excitement',
  Stability:          'security, consistency, groundedness',
  Creativity:         'expression, imagination, innovation',
  Spontaneity:        'living in the moment, saying yes, going with the flow',
  Nature:             'outdoors, environment, connection to the earth',
  Solitude:           'alone time, recharging, quiet space',
  Play:               'fun, lightness, not taking life too seriously',
  Humor:              'laughter, lightness, finding the funny side',
  Travel:             'new places, exploration, broadening horizons',
  Leisure:            'rest, downtime, enjoyment',
  'Work-Life Balance':'boundaries, rest alongside work, having both',
  Impact:             'service, legacy, change',
  Wealth:             'financial security, abundance, prosperity',
  Leadership:         'influence, vision, guidance',
  Entrepreneurship:   'building something, taking initiative, ownership',
  Innovation:         'new ideas, disruption, creative problem-solving',
  Career:             'professional growth, success at work, contribution',
  Expertise:          'being skilled, deep knowledge, craft',
  Recognition:        'being seen, appreciation, acknowledgment',
  Autonomy:           'self-direction, independence, making your own calls',
  Health:             'fitness, vitality, wellness',
  Energy:             'vitality, momentum, aliveness',
  Sleep:              'rest, recovery, renewal',
  Fitness:            'physical strength, movement, body care',
  Nutrition:          'eating well, nourishing your body, food as fuel',
  'Mental Health':    'psychological wellbeing, emotional balance, mind care',
  Movement:           'exercise, being active, physical energy',
  Longevity:          'living well for a long time, health span, sustainable habits',
  Vitality:           'aliveness, physical energy, feeling vibrant',
}

const POPDOWN_TEXT = "Personal values are the beliefs, principles, and standards that guide your everyday actions and behaviour. They define what is important to you, and help serve as your compass for navigating all of life's challenges."

export default function OnboardingStep1() {
  const navigate = useNavigate()
  const [selected, setSelected]     = useState([])
  const [custom, setCustom]         = useState([])   // user-added values not in the list
  const [query, setQuery]           = useState('')
  const [infoOpen, setInfoOpen]     = useState(false)

  const allValues = useMemo(() => VALUES_DATA.flatMap(c => c.values), [])

  function toggle(value) {
    setSelected(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= MAX) return prev
      return [...prev, value]
    })
  }

  function toggleCustom(value) {
    setSelected(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= MAX) return prev
      return [...prev, value]
    })
  }

  function addCustomValue() {
    const val = query.trim()
    if (!val) return
    // Capitalise first letter
    const formatted = val.charAt(0).toUpperCase() + val.slice(1)
    if (allValues.map(v => v.toLowerCase()).includes(formatted.toLowerCase())) return
    if (!custom.includes(formatted)) setCustom(prev => [...prev, formatted])
    setSelected(prev => {
      if (prev.includes(formatted) || prev.length >= MAX) return prev
      return [...prev, formatted]
    })
    setQuery('')
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

  // True when query has text but matches nothing in the master list
  const noMatch = useMemo(() => {
    if (!query.trim()) return false
    const q = query.toLowerCase()
    return !allValues.some(v => v.toLowerCase().includes(q))
  }, [query, allValues])

  const selectedSynonyms = selected.filter(v => VALUE_SYNONYMS[v])
  const totalSelected = selected.length

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

        <h2 className="ob-s1__title">Pick {MIN}–{MAX} Values that Matter The Most to you</h2>

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
            placeholder="Search or add your own value…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && noMatch && addCustomValue()}
            aria-label="Search values"
          />
        </div>

        {/* Add custom value prompt */}
        {noMatch && (
          <div className="ob-s1__add-custom">
            <p className="ob-s1__add-custom-label">
              No results for <strong>"{query}"</strong>
            </p>
            <button
              className="ob-chip"
              disabled={totalSelected >= MAX}
              onClick={addCustomValue}
            >
              + Add "{query.charAt(0).toUpperCase() + query.slice(1)}"
            </button>
          </div>
        )}

        {/* Count badge */}
        <p className="ob-count-badge">{totalSelected} / {MAX} selected {totalSelected >= MIN && totalSelected < MAX ? '— you can keep going!' : ''}</p>

        {/* Custom values chip row */}
        {custom.length > 0 && (
          <div className="ob-category">
            <p className="ob-category__name">Your Custom Values</p>
            <div className="ob-category__chips">
              {custom.map(value => {
                const isActive = selected.includes(value)
                const isFaded  = !isActive && totalSelected >= MAX
                return (
                  <button
                    key={value}
                    className={`ob-chip${isActive ? ' ob-chip--active' : ''}${isFaded ? ' ob-chip--faded' : ''}`}
                    onClick={() => toggleCustom(value)}
                    disabled={isFaded}
                    aria-pressed={isActive}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Value categories */}
        {filtered.map(cat => (
          <div key={cat.category} className="ob-category">
            <p className="ob-category__name">{cat.category}</p>
            <div className="ob-category__chips">
              {cat.values.map(value => {
                const isActive = selected.includes(value)
                const isFaded  = !isActive && totalSelected >= MAX
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
          disabled={totalSelected < MIN}
          onClick={() => navigate('/onboarding/step/2', { state: { top10: selected } })}
        >
          Continue
        </button>
        <p className="ob-step-label">Step 1 of 5</p>
      </div>

    </div>
  )
}
