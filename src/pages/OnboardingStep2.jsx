import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Onboarding.css'

const LOOKS_LIKE = {
  Peace:          ['Quiet mornings', 'Reading a book', 'Headphones on, listening to music', 'Calm heart rate', 'No obligations', 'Time alone', 'Slow evenings', 'Less screen time'],
  Balance:        ['Equal work and rest', 'Planned breaks', 'Time for myself', 'Not overcommitting', 'Flexible schedule', 'Protected weekends', 'Saying no gracefully'],
  Happiness:      ['Laughing with friends', 'Doing things I love', 'Feeling light', 'Celebrating small wins', 'Gratitude moments', 'Spontaneous joy', 'Being in the present'],
  'Self-Love':    ['Taking care of my body', 'Setting aside me-time', 'Being gentle with myself', 'Saying no when needed', 'Resting without guilt', 'Celebrating my wins', 'Treating myself kindly'],
  Simplicity:     ['Decluttered space', 'One thing at a time', 'Fewer commitments', 'Clear head', 'Minimal distractions', 'Letting go of what I don\'t need', 'Quiet routines'],
  Mindfulness:    ['Morning meditation', 'Being present in conversations', 'Phone-free time', 'Deep breathing', 'Journaling', 'Noticing small moments', 'Pausing before reacting'],
  Growth:         ['Learning something new', 'Reading regularly', 'Reflecting on mistakes', 'Stepping outside comfort zone', 'Seeking feedback', 'Tracking my progress', 'Trying things I\'ve avoided'],
  Discipline:     ['Sticking to a routine', 'Finishing what I start', 'Saying no to distractions', 'Showing up consistently', 'Doing the hard thing first', 'Tracking habits', 'Delayed gratification'],
  Achievement:    ['Completing a goal', 'Tracking progress', 'Celebrating milestones', 'Raising the bar for myself', 'Finishing what I start', 'Reviewing my results', 'Setting bigger targets'],
  Purpose:        ['Work that feels meaningful', 'Helping others', 'Knowing my why', 'Aligned daily actions', 'Feeling contribution', 'Values-led decisions', 'Waking up motivated'],
  Family:         ['Quality time together', 'Showing up for them', 'Open conversations', 'Shared meals', 'Checking in regularly', 'Being fully present', 'Creating traditions'],
  Faith:          ['Prayer or reflection', 'Community practice', 'Living by my values', 'Trusting the process', 'Gratitude rituals', 'Finding meaning in difficulty', 'Quiet time with my beliefs'],
  Connection:     ['Deep conversations', 'Feeling seen by others', 'Being present with people I care about', 'Shared experiences', 'Vulnerability with trust', 'Reaching out first', 'Eye contact and listening'],
  Friendship:     ['Reaching out first', 'Being a reliable friend', 'Shared laughs', 'Honest conversations', 'Showing up when it counts', 'Making time for people', 'Small gestures of care'],
  Kindness:       ['Small acts of generosity', 'Listening without judgment', 'Checking in on people', 'Giving my time', 'Being patient', 'Assuming the best in others', 'Random acts of care'],
  Integrity:      ['Keeping my word', 'Being honest even when hard', 'Aligned actions and values', 'Owning my mistakes', 'No hidden agendas', 'Consistent behaviour', 'Doing the right thing quietly'],
  Courage:        ['Speaking my truth', 'Taking the first step', 'Facing discomfort', 'Asking for help', 'Sharing my opinion', 'Doing it scared', 'Not shrinking myself'],
  Responsibility: ['Following through on commitments', 'Owning my impact', 'Planning ahead', "Admitting when I'm wrong", 'Not making excuses', 'Being someone others can count on', 'Taking initiative'],
  Freedom:        ['Flexible schedule', 'Making my own choices', 'Not being controlled by fear', 'Space to explore', 'No fixed rules', 'Living on my own terms', 'Room to change my mind'],
  Adventure:      ['Trying new experiences', 'Traveling somewhere new', 'Saying yes to spontaneity', 'Learning a new skill', 'Exploring my city', 'Breaking my routine', 'Collecting new memories'],
  Stability:      ['Consistent routine', 'Financial security', 'Knowing what to expect', 'Reliable relationships', 'A home that feels safe', 'Steady income', 'Long-term planning'],
  Creativity:     ['Making something', 'Brainstorming freely', 'Time without structure', 'Following curiosity', 'Experimenting freely', 'Creative outlets', 'Making things with my hands'],
  Impact:         ['Work that helps others', 'Volunteering', 'Creating something lasting', 'Inspiring people around me', 'Leaving things better', 'Contributing to a cause', 'Mentoring someone'],
  Wealth:         ['Financial security', 'Saving regularly', 'Investing in myself', 'Living without financial stress', 'Building assets', 'Financial independence', 'Long-term money habits'],
  Leadership:     ['Guiding others', 'Taking initiative', 'Being accountable to my team', 'Sharing my vision', 'Creating psychological safety', 'Leading by example', 'Developing people around me'],
  Health:         ['Regular movement', 'Eating well', 'Sleeping enough', 'Annual checkups', 'Listening to my body', 'Managing stress', 'Staying hydrated'],
  Energy:         ['Morning movement', 'Enough sleep', 'Avoiding energy drains', 'Doing things that light me up', 'Protecting my time', 'Eating for fuel', 'Taking real breaks'],
  Sleep:          ['7+ hours a night', 'Consistent bedtime', 'Wind-down routine', 'Restful environment', 'No screens before bed', 'Waking up refreshed', 'Prioritising rest'],

  // Well-being extras
  Gratitude:        ['Writing what I\'m thankful for', 'Noticing the good in small things', 'Saying thank you more', 'Daily gratitude practice', 'Appreciating what I have', 'Sharing gratitude with others', 'Finding silver linings'],
  Contentment:      ['Not needing more to be happy', 'Savoring the present', 'Feeling enough', 'Appreciating where I am', 'Less comparing myself', 'Quiet satisfaction', 'Enjoying simplicity'],
  Acceptance:       ['Letting go of what I can\'t control', 'Not resisting how things are', 'Making peace with the past', 'Being okay with uncertainty', 'Moving forward anyway', 'Non-judgment toward myself', 'Sitting with difficult feelings'],
  Optimism:         ['Looking for what\'s possible', 'Trusting things will work out', 'Reframing setbacks', 'Expecting good things', 'Finding opportunity in challenge', 'Keeping hope alive', 'Focusing on solutions'],
  Joy:              ['Doing things that delight me', 'Laughing often', 'Being fully in the moment', 'Pursuing what lights me up', 'Feeling carefree sometimes', 'Play and spontaneity', 'Sharing joy with others'],
  Serenity:         ['Quiet environment', 'Slow mornings', 'Nature walks', 'Breathing exercises', 'Not rushing', 'Peaceful relationships', 'Letting go of drama'],
  'Self-Awareness': ['Journaling my thoughts', 'Noticing my reactions', 'Asking why I feel what I feel', 'Therapy or coaching', 'Reflecting before responding', 'Understanding my triggers', 'Honest self-assessment'],
  'Emotional Health': ['Processing feelings, not burying them', 'Healthy coping strategies', 'Expressing emotions safely', 'Not bottling things up', 'Asking for support', 'Rest when overwhelmed', 'Therapy or check-ins'],
  'Inner Peace':    ['Freedom from worry', 'Not being reactive', 'Feeling settled inside', 'Less inner conflict', 'Meditation or stillness', 'Aligned with my values', 'Letting things go'],

  // Growth extras
  Resilience:       ['Bouncing back from setbacks', 'Keeping going when it\'s hard', 'Learning from failure', 'Not giving up', 'Recovering quickly', 'Staying calm under pressure', 'Adapting to change'],
  Ambition:         ['Setting big goals', 'Striving to improve', 'Not settling', 'Having a vision for my future', 'Motivated to do more', 'Chasing what excites me', 'Thinking long-term'],
  Curiosity:        ['Asking lots of questions', 'Exploring new topics', 'Reading widely', 'Trying things just to learn', 'Staying open-minded', 'Deep dives into interests', 'Never assuming I know enough'],
  Excellence:       ['Doing my best work', 'High personal standards', 'Taking pride in quality', 'Not cutting corners', 'Continuous improvement', 'Going beyond the minimum', 'Detail-oriented effort'],
  Mastery:          ['Practicing deliberately', 'Deepening my skills', 'Long-term commitment to craft', 'Seeking feedback', 'Learning from experts', 'Not rushing expertise', 'Enjoying the process of getting better'],
  Perseverance:     ['Showing up even when unmotivated', 'Finishing what I start', 'Pushing through resistance', 'Long-term thinking', 'Not quitting at the first obstacle', 'Grit over talent', 'Endurance habits'],
  Learning:         ['Reading regularly', 'Taking courses', 'Seeking new perspectives', 'Asking questions', 'Reflecting on experiences', 'Building on what I know', 'Growth mindset daily'],
  'Self-Improvement': ['Working on my weaknesses', 'Daily habits that build me up', 'Honest self-reflection', 'Seeking mentorship', 'Tracking personal growth', 'Being better than yesterday', 'Intentional development'],

  // Relationships extras
  Love:             ['Deep care for others', 'Expressing affection', 'Being fully present', 'Unconditional support', 'Showing up consistently', 'Saying it out loud', 'Acts of service for people I love'],
  Community:        ['Showing up for local groups', 'Contributing to shared goals', 'Feeling like I belong', 'Supporting others', 'Being a positive presence', 'Participating, not just watching', 'Building something together'],
  Empathy:          ['Listening to understand, not reply', 'Asking how someone truly feels', 'Not judging others\' experiences', 'Being with someone in their pain', 'Perspective-taking', 'Validating feelings', 'Compassionate responses'],
  Loyalty:          ['Showing up for people long-term', 'Keeping confidences', 'Not abandoning people in hard times', 'Being consistent', 'Following through on promises', 'Being someone people can count on', 'Choosing people intentionally'],
  Belonging:        ['Feeling accepted as I am', 'Being part of a group', 'Not hiding parts of myself', 'Finding my people', 'Community involvement', 'Feeling welcomed', 'Shared values and identity'],
  Partnership:      ['Mutual support and respect', 'Sharing responsibilities', 'Open and honest communication', 'Growing together', 'Teamwork in daily life', 'Checking in with each other', 'Building a shared vision'],
  Mentorship:       ['Learning from someone ahead of me', 'Sharing what I know with others', 'Asking for guidance', 'Investing in someone\'s growth', 'Honest conversations about development', 'Being coachable', 'Paying it forward'],
  Service:          ['Volunteering regularly', 'Helping without expecting anything', 'Contributing to causes I care about', 'Being useful to others', 'Acts of generosity', 'Giving my skills away', 'Showing up for the community'],

  // Character extras
  Authenticity:     ['Being myself without apology', 'Not performing for others', 'Saying what I mean', 'Letting people see the real me', 'Aligned words and actions', 'Dropping the mask', 'Honest self-expression'],
  Honesty:          ['Saying the truth even when uncomfortable', 'No white lies', 'Direct communication', 'Owning my opinion', 'Not pretending to be fine when I\'m not', 'Transparency with people I care about', 'Honest self-talk'],
  Humility:         ['Acknowledging what I don\'t know', 'Being open to feedback', 'Not needing to be right', 'Giving credit to others', 'Learning from people different from me', 'No arrogance', 'Quiet confidence'],
  Fairness:         ['Treating everyone equally', 'Standing up against bias', 'Listening to all sides', 'Not playing favourites', 'Equal opportunity thinking', 'Calling out injustice', 'Consistent standards'],
  Transparency:     ['No hidden agenda', 'Communicating clearly', 'Sharing information openly', 'Being upfront about my intentions', 'Honest about my limitations', 'No secrets in close relationships', 'Saying what I\'m thinking'],
  Ethics:           ['Doing the right thing even when no one\'s watching', 'Values-driven decisions', 'Not compromising my principles', 'Thinking about impact on others', 'Standing by my moral code', 'Refusing shortcuts that harm others', 'Integrity in small things'],

  // Lifestyle extras
  Spontaneity:      ['Saying yes without a plan', 'Switching things up', 'Living in the moment', 'Unplanned weekends', 'Following impulse sometimes', 'Breaking routine', 'Being open to anything'],
  Nature:           ['Time outdoors regularly', 'Walks in green spaces', 'Being away from screens', 'Connecting with seasons', 'Environmental care', 'Grounding practices', 'Appreciating natural beauty'],
  Solitude:         ['Time fully alone', 'Recharging in quiet', 'No social obligations', 'Reading alone', 'Space to think', 'Not always being "on"', 'Peace without distraction'],
  Play:             ['Fun without purpose', 'Games and laughter', 'Not taking life too seriously', 'Creative play', 'Childlike curiosity', 'Making time for lightness', 'Doing things just for fun'],
  Humor:            ['Finding the funny side', 'Laughing at myself', 'Lightening the mood', 'Sharing jokes', 'Not being too serious', 'Comedy as a coping tool', 'Laughter with friends'],
  Travel:           ['Exploring new places', 'Experiencing different cultures', 'Trips big or small', 'Getting out of my routine', 'Saying yes to new destinations', 'Travel as learning', 'Making travel a priority'],
  Leisure:          ['Downtime without guilt', 'Hobbies for their own sake', 'Rest as a value, not a reward', 'Slow weekends', 'Enjoying entertainment', 'Doing nothing productively', 'Protected personal time'],
  'Work-Life Balance': ['Leaving work at work', 'Protected family or personal time', 'Not checking messages after hours', 'Holidays and rest', 'Saying no to overwork', 'Energy for life outside work', 'Clear boundaries'],

  // Work & Impact extras
  Entrepreneurship: ['Building something from scratch', 'Taking risks', 'Solving a real problem', 'Being my own boss', 'Iterating and learning fast', 'Ownership mindset', 'Making things happen'],
  Innovation:       ['Questioning how things are done', 'Trying untested ideas', 'Creative problem-solving', 'Staying ahead of the curve', 'Experimenting without fear', 'Disrupting norms', 'Embracing new technology'],
  Career:           ['Professional growth', 'Work I\'m proud of', 'Learning new skills', 'Building a reputation', 'Advancing my expertise', 'Long-term career vision', 'Contributing meaningfully'],
  Expertise:        ['Deep knowledge in my field', 'Being the go-to person', 'Continuous skill-building', 'Teaching others what I know', 'Recognised for my craft', 'Going deep not just wide', 'Committed to mastery'],
  Recognition:      ['Being acknowledged for my work', 'Feeling appreciated', 'Praise from people I respect', 'Visibility in my field', 'Credit where it\'s due', 'Celebrating achievements publicly', 'Feeling seen at work'],
  Autonomy:         ['Making my own decisions', 'Flexible work arrangements', 'Not being micromanaged', 'Self-directed projects', 'Independence in how I work', 'Ownership of my schedule', 'Trusting my own judgment'],

  // Health extras
  Fitness:          ['Regular exercise', 'Building physical strength', 'Moving my body daily', 'Sport or activity I enjoy', 'Body-positive movement', 'Training toward a goal', 'Active lifestyle'],
  Nutrition:        ['Eating whole foods', 'Nourishing my body', 'Mindful eating', 'Not using food as a coping mechanism', 'Balanced meals', 'Cooking for myself', 'Fueling for energy'],
  'Mental Health':  ['Therapy or counselling', 'Managing my stress', 'Emotional regulation habits', 'Reaching out when struggling', 'Reducing anxiety triggers', 'Rest and recovery', 'Self-compassion practices'],
  Movement:         ['Daily physical activity', 'Walks, stretching, or sport', 'Not sitting still for too long', 'Active commuting', 'Exercise I actually enjoy', 'Keeping my body mobile', 'Movement as stress relief'],
  Longevity:        ['Habits that serve future me', 'Regular health check-ups', 'Preventive care', 'Sleep as a priority', 'Stress management', 'Not burning out', 'Sustainable lifestyle choices'],
  Vitality:         ['Feeling energised most days', 'Physical aliveness', 'Vibrant not just healthy', 'Activities that make me feel alive', 'High natural energy', 'Colour in my daily life', 'Mind-body connection'],
}

const DEFAULT_CHIPS = ['Living it daily', "Something I'm working toward", 'Being intentional', '+ Use My Own Words']

const COLLAPSE_AT = 3

export default function OnboardingStep2() {
  const navigate  = useNavigate()
  const { state } = useLocation()
  const top10     = state?.top10 ?? []
  const skipDeep  = state?.skipDeep ?? false

  const [top3, setTop3]           = useState([])
  const [valueLooks, setValueLooks] = useState({})
  const [customInputs, setCustom] = useState({})
  const [showCustom, setShowCustom] = useState({})
  const [expanded, setExpanded]   = useState({})

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

      {/* Back navigation */}
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
          const chips      = LOOKS_LIKE[value] ?? DEFAULT_CHIPS
          const selected   = valueLooks[value] ?? []
          const customChips = selected.filter(c => !chips.includes(c))
          const showCustomBtn = !chips.includes('+ Use My Own Words')

          // All items that will appear in the box (preset + user-added)
          const allChips = [
            ...chips,
            ...(showCustomBtn ? ['+ Use My Own Words'] : []),
            ...customChips,
          ]

          const isExpanded    = expanded[value] ?? false
          const needsToggle   = allChips.length > COLLAPSE_AT
          const visibleChips  = needsToggle && !isExpanded ? allChips.slice(0, COLLAPSE_AT) : allChips

          return (
            <div key={value} className="ob-value-card">
              <p className="ob-value-card__question">
                What does <em>{value}</em> look like in your life?
              </p>
              <div className="ob-card-box">
                {visibleChips.map(chip => {
                  if (chip === '+ Use My Own Words') {
                    return (
                      <button
                        key={chip}
                        className="ob-card-chip"
                        onClick={() => toggleChip(value, chip)}
                      >
                        + Use My Own Words
                      </button>
                    )
                  }
                  return (
                    <button
                      key={chip}
                      className={`ob-card-chip${selected.includes(chip) ? ' ob-card-chip--active' : ''}`}
                      onClick={() => toggleChip(value, chip)}
                    >
                      {chip}
                    </button>
                  )
                })}
              </div>

              {needsToggle && (
                <div className="ob-card-expand-row">
                  <button
                    className="ob-card-expand-btn"
                    onClick={() => setExpanded(prev => ({ ...prev, [value]: !isExpanded }))}
                  >
                    {isExpanded ? 'Show less ▴' : `View more ▾`}
                  </button>
                </div>
              )}

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
          onClick={() => {
            if (skipDeep) {
              navigate('/onboarding/goals', { state: { top10, top3, valueLooks, skipDeep: true } })
            } else {
              navigate('/onboarding/step/4', { state: { top10, top3, valueLooks } })
            }
          }}
        >
          Continue
        </button>
        <p className="ob-step-label">Step 2 of 5</p>
      </div>

    </div>
  )
}
