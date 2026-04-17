import { useState, useRef } from 'react'
import { useNavigate }          from 'react-router-dom'
import PageHeader               from '../components/ui/PageHeader'
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

      <PageHeader title="My Character" />

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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            className="char-header__action"
            onClick={() => setIsEditing(true)}
            aria-label="Edit character"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
            </svg>
          </button>
        )}
      </header>

      {/* ── Preview zone: skin palette | canvas | feature palette ── */}
      <section className="char-preview-zone">

        {isEditing && (
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

        {isEditing && (
          <FeatureColorPalette
            colors={featureColors}
            selected={featureSelected}
            onChange={handleFeatureColorChange}
          />
        )}

      </section>

      {/* ── Divider under canvas ───────────────── */}
      <div className="char-divider" aria-hidden="true" />

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

          {/* ── Bio input ─────────────────────── */}
          <div className="char-bio-row">
            <textarea
              className="char-bio-input"
              value={selections.bio}
              onChange={e => setSelections(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Describe your ideal self..."
              maxLength={300}
              rows={3}
              aria-label="Character biography"
            />
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

        </>
      ) : (
        /* ── View mode ─────────────────────────── */
        <div className="char-view-profile">

          {/* Character name */}
          <p className="char-view-profile__name">{displayName}</p>

          {/* Bio section */}
          <div className="char-view-profile__bio">
            <p>
              <strong>Who {displayName} is:</strong><br />
              {selections.bio || 'Tap Edit to add a short biography about your ideal self.'}
            </p>
          </div>

          {/* Talk CTA */}
          <button
            className="char-view-profile__cta"
            onClick={() => navigate('/chat', { state: { name: selections.name, character: selections } })}
          >
            Talk to {displayName}
          </button>

        </div>
      )}

    </div>
  )
}
