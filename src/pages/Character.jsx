import { useState, useRef } from 'react'
import CharacterCanvas    from '../components/character/CharacterCanvas'
import CategorySelector   from '../components/character/CategorySelector'
import SkinToneSelector   from '../components/character/SkinToneSelector'
import BrowColorSelector  from '../components/character/BrowColorSelector'
import OptionGrid         from '../components/character/OptionGrid'
import { DEFAULT_CHARACTER } from '../components/character/characterAssets'
import './Character.css'

export default function Character() {
  const [selections, setSelections]         = useState(DEFAULT_CHARACTER)
  const [activeCategory, setActiveCategory] = useState('hair')
  const [isEditingName, setIsEditingName]   = useState(false)
  const nameInputRef = useRef(null)

  function handlePartChange(id) {
    setSelections(prev => ({ ...prev, [activeCategory]: id }))
  }

  function handleSkinChange(tone) {
    setSelections(prev => ({ ...prev, skinTone: tone }))
  }

  function handleBrowChange(color) {
    setSelections(prev => ({ ...prev, browColor: color }))
  }

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

  return (
    <div className="char-page">

      {/* ── Header ─────────────────────────────── */}
      <header className="char-header">
        <h1 className="char-header__title">Meet your Tru-mi!</h1>
        <p className="char-header__subtitle">Make your Tru-mi feel like you</p>
      </header>

      {/* ── Skin tone selector ────────────────────── */}
      <SkinToneSelector
        selected={selections.skinTone}
        onChange={handleSkinChange}
      />

      {/* ── Eyebrow color selector ────────────────── */}
      <BrowColorSelector
        selected={selections.browColor}
        onChange={handleBrowChange}
      />

      {/* ── Character preview ─────────────────────── */}
      <section className="char-preview">
        <CharacterCanvas
          selections={selections}
          skinTone={selections.skinTone}
          browColor={selections.browColor}
        />
      </section>

      {/* ── Character name ────────────────────────── */}
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
          <button className="char-name-display" onClick={handleNameClick} aria-label="Edit name">
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

      {/* ── Category tabs (3×2 grid) ─────────────── */}
      <CategorySelector
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {/* ── Option grid ───────────────────────────── */}
      <div className="char-options">
        <OptionGrid
          category={activeCategory}
          selected={selections[activeCategory]}
          onChange={handlePartChange}
        />
      </div>

      {/* ── CTA ───────────────────────────────────── */}
      <div className="char-cta">
        <button
          className="char-cta__btn"
          disabled={!selections.name.trim()}
          aria-label="Save your Tru-mi"
        >
          {selections.name.trim() ? `This is ${selections.name}!` : 'Name your Tru-mi to continue'}
        </button>
      </div>

    </div>
  )
}
