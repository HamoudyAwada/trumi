import { useState, useRef } from 'react'
import { useNavigate }          from 'react-router-dom'
import CharacterCanvas          from '../components/character/CharacterCanvas'
import CategorySelector         from '../components/character/CategorySelector'
import OptionGrid               from '../components/character/OptionGrid'
import FeatureColorPalette      from '../components/character/FeatureColorPalette'
import { DEFAULT_CHARACTER, SKIN_TONES, FEATURE_COLORS, COLOURED_LIPS } from '../components/character/characterAssets'
import './Character.css'

export default function Character() {
  const navigate = useNavigate()

  const [selections, setSelections]         = useState(DEFAULT_CHARACTER)
  const [activeCategory, setActiveCategory] = useState('hair')
  const [isEditingName, setIsEditingName]   = useState(false)
  const [isEditing, setIsEditing]           = useState(false)
  const nameInputRef = useRef(null)

  function handlePartChange(id) {
    setSelections(prev => ({ ...prev, [activeCategory]: id }))
  }

  function handleSkinChange(tone) {
    setSelections(prev => ({ ...prev, skinTone: tone }))
  }

  const CATEGORY_COLOR_KEY = {
    hair:     'hairColor',
    eyes:     'eyeColor',
    eyebrows: 'browColor',
    lips:     'lipColor',
  }

  function handleFeatureColorChange(color) {
    const key = CATEGORY_COLOR_KEY[activeCategory]
    if (key) setSelections(prev => ({ ...prev, [key]: color }))
  }

  const lipsHaveColour = activeCategory !== 'lips' || COLOURED_LIPS.has(selections.lips)
  const featureColors  = lipsHaveColour ? (FEATURE_COLORS[activeCategory] ?? []) : []
  const featureSelected = selections[CATEGORY_COLOR_KEY[activeCategory]]

  function handleNameClick() {
    setIsEditingName(true)
    setTimeout(() => nameInputRef.current?.focus(), 0)
  }

  function handleNameBlur() {
    setIsEditingName(false)
  }

  function handleNameChange(e) {
    setSelections(prev => ({ ...prev, name: e.target.value }))
  }

  const displayName = selections.name.trim() || 'your Tru-mi'

  return (
    <div className="char-page">

      {/* ── Header ─────────────────────────────── */}
      <header className="char-header">
        <div className="char-header__text">
          <h1 className="char-header__title">Meet your Tru-mi!</h1>
          <p className="char-header__subtitle">Make your Tru-mi feel like you</p>
        </div>

        {isEditing ? (
          <button
            className="char-header__action"
            onClick={() => setIsEditing(false)}
            aria-label="Done editing"
          >
            <span>Done</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            className="char-header__action"
            onClick={() => setIsEditing(true)}
            aria-label="Edit character"
          >
            <span>Edit</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </header>

      {/* ── Preview zone: skin palette | canvas | feature palette ── */}
      <section className="char-preview-zone">

        {isEditing ? (
          <div className="char-skin-palette">
            {SKIN_TONES.map(tone => (
              <button
                key={tone}
                className={`char-skin-swatch${selections.skinTone === tone ? ' char-skin-swatch--active' : ''}`}
                style={{ backgroundColor: tone }}
                onClick={() => handleSkinChange(tone)}
                aria-label="Skin tone"
                aria-pressed={selections.skinTone === tone}
              />
            ))}
          </div>
        ) : (
          <div className="char-skin-palette char-skin-palette--hidden" />
        )}

        <div className="char-preview">
          <CharacterCanvas
            selections={selections}
            skinTone={selections.skinTone}
            browColor={selections.browColor}
            eyeColor={selections.eyeColor}
            lipColor={selections.lipColor}
            hairColor={selections.hairColor}
          />
        </div>

        {isEditing ? (
          <FeatureColorPalette
            colors={featureColors}
            selected={featureSelected}
            onChange={handleFeatureColorChange}
          />
        ) : (
          <div className="char-skin-palette char-skin-palette--hidden" />
        )}

      </section>

      {isEditing ? (
        <>
          {/* ── Character name (edit mode only) ─── */}
          <div className="char-name-row">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                className="char-name-input"
                type="text"
                value={selections.name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                placeholder="Name your Tru-mi"
                maxLength={30}
                aria-label="Character name"
              />
            ) : (
              <button
                className="char-name-display"
                onClick={handleNameClick}
                aria-label="Edit name"
              >
                <span className="char-name-display__text">
                  {selections.name || 'Name your Tru-mi'}
                </span>
                <svg className="char-name-display__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Category tabs ──────────────────── */}
          <CategorySelector
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />

          {/* ── Option grid ───────────────────── */}
          <div className="char-options">
            <OptionGrid
              category={activeCategory}
              selected={selections[activeCategory]}
              onChange={handlePartChange}
            />
          </div>

          {/* ── CTA ───────────────────────────── */}
          <div className="char-cta">
            <button
              className="char-cta__btn"
              disabled={!selections.name.trim()}
              aria-label="Save your Tru-mi"
            >
              {selections.name.trim() ? `This is ${selections.name}!` : 'Name your Tru-mi to continue'}
            </button>
          </div>
        </>
      ) : (
        /* ── Chat preview (view mode) ──────────── */
        <div
          className="char-chat-preview"
          onClick={() => navigate('/chat', { state: { name: selections.name } })}
          onKeyDown={e => e.key === 'Enter' && navigate('/chat', { state: { name: selections.name } })}
          role="button"
          tabIndex={0}
          aria-label={`Open chat with ${displayName}`}
        >

          {/* Name + expand row */}
          <div className="char-chat-preview__header">
            <span className="char-chat-preview__name">
              Speak to: <strong>{displayName}</strong>
            </span>
            <svg className="char-chat-preview__expand" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
          </div>

          {/* AI message bubble */}
          <div className="char-chat-preview__bubble">
            <p className="char-chat-preview__bubble-text">
              Hey! I'm here whenever you want to talk. What's on your mind?
            </p>
          </div>

          {/* Chat input bar (visual only — tap anywhere to open) */}
          <div className="char-chat-preview__bar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
              <path d="M19 10a7 7 0 0 1-14 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

        </div>
      )}

    </div>
  )
}
