import { useState, useEffect, useRef } from 'react'
import { useNavigate }          from 'react-router-dom'
import TrumiCharacter           from '../components/character/TrumiCharacter'
import CategorySelector         from '../components/character/CategorySelector'
import { DEFAULT_CHARACTER, SKIN_TONES, FEATURE_COLORS, ASSETS } from '../components/character/characterAssets'
import './Character.css'

function ChatBubbleIcon() {
  return (
    <svg width="79" height="79" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g filter="url(#filter0_d_874_10590)">
        <path d="M43.25 39.4867C43.25 40.2283 43.0301 40.9534 42.618 41.5701C42.206 42.1867 41.6203 42.6674 40.9351 42.9512C40.2498 43.235 39.4958 43.3093 38.7684 43.1646C38.041 43.0199 37.3728 42.6628 36.8483 42.1383C36.3239 41.6139 35.9667 40.9457 35.8221 40.2183C35.6774 39.4908 35.7516 38.7368 36.0355 38.0516C36.3193 37.3664 36.7999 36.7807 37.4166 36.3687C38.0333 35.9566 38.7583 35.7367 39.5 35.7367C40.4946 35.7367 41.4484 36.1318 42.1516 36.835C42.8549 37.5383 43.25 38.4921 43.25 39.4867ZM25.75 35.7367C25.0083 35.7367 24.2833 35.9566 23.6666 36.3687C23.0499 36.7807 22.5693 37.3664 22.2855 38.0516C22.0016 38.7368 21.9274 39.4908 22.0721 40.2183C22.2167 40.9457 22.5739 41.6139 23.0983 42.1383C23.6228 42.6628 24.291 43.0199 25.0184 43.1646C25.7458 43.3093 26.4998 43.235 27.1851 42.9512C27.8703 42.6674 28.456 42.1867 28.868 41.5701C29.2801 40.9534 29.5 40.2283 29.5 39.4867C29.5 38.4921 29.1049 37.5383 28.4017 36.835C27.6984 36.1318 26.7446 35.7367 25.75 35.7367ZM53.25 35.7367C52.5083 35.7367 51.7833 35.9566 51.1666 36.3687C50.5499 36.7807 50.0693 37.3664 49.7855 38.0516C49.5016 38.7368 49.4274 39.4908 49.5721 40.2183C49.7167 40.9457 50.0739 41.6139 50.5984 42.1383C51.1228 42.6628 51.791 43.0199 52.5184 43.1646C53.2458 43.3093 53.9998 43.235 54.6851 42.9512C55.3703 42.6674 55.956 42.1867 56.368 41.5701C56.7801 40.9534 57 40.2283 57 39.4867C57 38.4921 56.6049 37.5383 55.9016 36.835C55.1984 36.1318 54.2446 35.7367 53.25 35.7367ZM72 39.4867C72.0012 45.0977 70.5497 50.6135 67.7868 55.4971C65.0238 60.3808 61.0436 64.4659 56.2334 67.3549C51.4233 70.2439 45.9471 71.8383 40.3379 71.983C34.7288 72.1276 29.1777 70.8176 24.225 68.1804L13.5844 71.7273C12.7034 72.0211 11.758 72.0637 10.8541 71.8504C9.9503 71.6371 9.12371 71.1763 8.46703 70.5196C7.81036 69.863 7.34955 69.0364 7.13624 68.1325C6.92294 67.2287 6.96558 66.2833 7.25937 65.4023L10.8062 54.7617C8.48796 50.403 7.19312 45.5735 7.01999 40.6397C6.84687 35.7059 7.80002 30.7975 9.80709 26.2871C11.8142 21.7767 14.8224 17.7827 18.6035 14.6085C22.3846 11.4343 26.8391 9.16316 31.629 7.96753C36.4188 6.7719 41.4181 6.68319 46.2474 7.70813C51.0766 8.73308 55.609 10.8447 59.5003 13.8828C63.3916 16.9209 66.5396 20.8056 68.7055 25.242C70.8713 29.6783 71.998 34.5498 72 39.4867ZM67 39.4867C66.9988 35.2683 66.0272 31.1068 64.1603 27.324C62.2934 23.5412 59.5813 20.2387 56.2338 17.6718C52.8863 15.1049 48.9932 13.3425 44.8556 12.521C40.718 11.6995 36.4468 11.8409 32.3726 12.9342C28.2984 14.0275 24.5303 16.0434 21.3599 18.826C18.1894 21.6086 15.7016 25.0833 14.0889 28.9812C12.4763 32.8792 11.7819 37.0959 12.0597 41.3051C12.3374 45.5143 13.5798 49.6032 15.6906 53.2554C15.8678 53.562 15.9778 53.9028 16.0133 54.2551C16.0489 54.6075 16.0092 54.9633 15.8969 55.2992L12 66.9867L23.6875 63.0898C23.9421 63.003 24.2092 62.9587 24.4781 62.9585C24.9172 62.9593 25.3483 63.0757 25.7281 63.296C29.9088 65.7149 34.6527 66.9899 39.4826 66.993C44.3126 66.996 49.0581 65.7269 53.2418 63.3134C57.4255 60.8999 60.8997 57.4271 63.3149 53.2444C65.7301 49.0616 67.0011 44.3166 67 39.4867Z" fill="black"/>
      </g>
      <defs>
        <filter id="filter0_d_874_10590" x="0" y="0" width="79" height="78.9938" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_874_10590"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_874_10590"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_874_10590" result="shape"/>
        </filter>
      </defs>
    </svg>
  )
}

const CATEGORY_COLOR_KEY = {
  hair:     'hairColor',
  eyes:     'eyeColor',
  eyebrows: 'browColor',
  mouth:    'lipColor',
}

export default function Character() {
  const navigate = useNavigate()

  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem('trumi_character')
      return saved ? { ...DEFAULT_CHARACTER, ...JSON.parse(saved) } : DEFAULT_CHARACTER
    } catch { return DEFAULT_CHARACTER }
  })
  const [activeCategory, setActiveCategory] = useState('body')
  const [isEditingName, setIsEditingName]   = useState(false)
  const [isEditing, setIsEditing]           = useState(false)
  const nameInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('trumi_character', JSON.stringify(selections))
    window.dispatchEvent(new Event('trumi_character_updated'))
  }, [selections])

  // ── Arrow navigation through current category options ──
  function getOpts(cat) { return ASSETS[cat] ?? [] }

  function handlePrev() {
    const opts = getOpts(activeCategory)
    if (opts.length <= 1) return
    const idx = opts.findIndex(o => o.id === selections[activeCategory])
    const newIdx = ((idx < 0 ? 0 : idx) - 1 + opts.length) % opts.length
    setSelections(prev => ({ ...prev, [activeCategory]: opts[newIdx].id }))
  }

  function handleNext() {
    const opts = getOpts(activeCategory)
    if (opts.length <= 1) return
    const idx = opts.findIndex(o => o.id === selections[activeCategory])
    const newIdx = ((idx < 0 ? 0 : idx) + 1) % opts.length
    setSelections(prev => ({ ...prev, [activeCategory]: opts[newIdx].id }))
  }

  // ── Color swatch row ──
  const hasFeatureColor = activeCategory in CATEGORY_COLOR_KEY
  const colorSwatches   = hasFeatureColor
    ? (FEATURE_COLORS[activeCategory] ?? []).map(c => c.value)
    : SKIN_TONES
  const activeColor     = hasFeatureColor
    ? selections[CATEGORY_COLOR_KEY[activeCategory]]
    : selections.skinColor

  function handleColorPick(color) {
    if (hasFeatureColor) {
      const key = CATEGORY_COLOR_KEY[activeCategory]
      setSelections(prev => ({ ...prev, [key]: color }))
    } else {
      setSelections(prev => ({ ...prev, skinColor: color }))
    }
  }

  function handleNameClick() {
    setIsEditingName(true)
    setTimeout(() => nameInputRef.current?.focus(), 0)
  }

  const displayName = selections.name.trim() || 'your Tru-mi'

  return (
    <div className="char-page">
      <div className="char-body">

        {!isEditing ? (

          /* ── View mode ────────────────────────────── */
          <div className="char-view">
            <h1 className="char-view__name">{displayName}</h1>

            <div className="char-view__canvas-wrap">
              <TrumiCharacter
                selections={selections}
                skinColor={selections.skinColor}
                hairColor={selections.hairColor}
                eyeColor={selections.eyeColor}
                browColor={selections.browColor}
                lipColor={selections.lipColor}
                size={280}
              />
              <button
                className="char-view__chat-btn"
                onClick={() => navigate('/chat', { state: { name: selections.name, character: selections } })}
                aria-label="Chat with your character"
              >
                <ChatBubbleIcon />
              </button>
            </div>

            <p className="char-view__bio">
              {selections.bio || 'This is a space to put a description of your character that the AI will consider.'}
            </p>

            <button className="char-view__customize" onClick={() => setIsEditing(true)}>
              Customize Your Character
            </button>
          </div>

        ) : (

          /* ── Edit mode ────────────────────────────── */
          <>

            {/* Name with pencil icon */}
            <div className="char-edit-name-row">
              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  className="char-edit-name-input"
                  type="text"
                  value={selections.name}
                  onChange={e => setSelections(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => setIsEditingName(false)}
                  placeholder="Name"
                  maxLength={30}
                  aria-label="Character name"
                />
              ) : (
                <button className="char-edit-name-btn" onClick={handleNameClick} aria-label="Edit name">
                  <span className="char-edit-name-btn__text">{selections.name || 'Name'}</span>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Character canvas with left/right arrows */}
            <div className="char-edit-canvas-section">
              <button className="char-edit-arrow char-edit-arrow--left" onClick={handlePrev} aria-label="Previous style">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <div className="char-preview">
                <TrumiCharacter
                  selections={selections}
                  skinColor={selections.skinColor}
                  hairColor={selections.hairColor}
                  eyeColor={selections.eyeColor}
                  browColor={selections.browColor}
                  lipColor={selections.lipColor}
                  size={280}
                />
              </div>

              <button className="char-edit-arrow char-edit-arrow--right" onClick={handleNext} aria-label="Next style">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            {/* Category selector — horizontal scroll */}
            <div className="char-edit-cat-scroll">
              <CategorySelector activeCategory={activeCategory} onChange={setActiveCategory} />
            </div>

            {/* Color / skin tone row — horizontal scroll */}
            <div className="char-edit-color-scroll">
              <div className="char-edit-color-row">
                {colorSwatches.map(color => (
                  <button
                    key={color}
                    className={`char-edit-swatch${color === activeColor ? ' char-edit-swatch--active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorPick(color)}
                    aria-label={color}
                    aria-pressed={color === activeColor}
                  />
                ))}
              </div>
            </div>

            {/* Bio textarea */}
            <textarea
              className="char-edit-bio-input"
              value={selections.bio}
              onChange={e => setSelections(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="character description here..."
              maxLength={300}
              rows={3}
              aria-label="Character description"
            />

            {/* Confirm button */}
            <button className="char-edit-confirm" onClick={() => setIsEditing(false)}>
              Confirm Changes
            </button>

            {/* Cancel button */}
            <button className="char-edit-cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>

          </>
        )}

      </div>
    </div>
  )
}
