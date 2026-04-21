import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TrumiCharacter from '../character/TrumiCharacter'
import { DEFAULT_CHARACTER } from '../character/characterAssets'
import './GlobalHeader.css'

function TrumiMark() {
  return (
    <svg
      className="global-header__logo"
      viewBox="0 0 509 570"
      xmlns="http://www.w3.org/2000/svg"
      fill="var(--color-tranquil-night, #0f1c3f)"
      aria-label="Trumi"
      role="img"
    >
      <path d="M254.34,429.92c-88.11,0-173.3-26.78-239.88-75.4-11.19-8.17-13.63-23.87-5.46-35.06,8.17-11.19,23.86-13.63,35.05-5.46,58.05,42.4,132.73,65.74,210.29,65.74s152.27-23.35,210.28-65.74c11.19-8.17,26.88-5.73,35.05,5.46,8.17,11.19,5.73,26.88-5.45,35.06-66.54,48.62-151.73,75.4-239.88,75.4Z"/>
      <ellipse cx="254.34" cy="260.21" rx="90.27" ry="90.27"/>
      <path d="M254.34,459.19h0c-29.23,0-54.31,20.85-59.64,49.6l-8.52,45.92c-1.44,7.76,4.52,14.93,12.41,14.93h111.5c7.9,0,13.85-7.17,12.41-14.93l-8.52-45.92c-5.33-28.75-30.41-49.6-59.64-49.6Z"/>
      <path d="M224.83,52.03c0-34.86,13.21-52.03,29.51-52.03s29.51,17.16,29.51,52.03c0,26.53-17.09,67.72-25.26,85.89-1.65,3.67-6.85,3.67-8.5,0-8.17-18.17-25.26-59.36-25.26-85.89Z"/>
      <path d="M444.5,118.58c24.65-24.65,46.13-27.45,57.65-15.92,11.52,11.52,8.73,33-15.92,57.65-18.76,18.76-59.97,35.8-78.59,42.87-3.76,1.43-7.44-2.25-6.01-6.01,7.07-18.62,24.11-59.83,42.87-78.59Z"/>
      <path d="M22.45,160.31C-2.2,135.66-4.99,114.18,6.53,102.65c11.52-11.52,33-8.73,57.65,15.92,18.76,18.76,35.8,59.97,42.87,78.59,1.43,3.76-2.25,7.44-6.01,6.01-18.62-7.07-59.83-24.11-78.59-42.87Z"/>
    </svg>
  )
}

export function CharacterAvatar({ character }) {
  return (
    <div className="global-header__avatar" aria-hidden="true">
      <div className="global-header__avatar-clip">
        <TrumiCharacter
          selections={character}
          skinColor={character.skinColor}
          hairColor={character.hairColor}
          eyeColor={character.eyeColor}
          browColor={character.browColor}
          lipColor={character.lipColor}
          size={250}
        />
      </div>
    </div>
  )
}

function readCharacter() {
  try {
    const saved = localStorage.getItem('trumi_character')
    return saved ? { ...DEFAULT_CHARACTER, ...JSON.parse(saved) } : DEFAULT_CHARACTER
  } catch {
    return DEFAULT_CHARACTER
  }
}

export default function GlobalHeader() {
  const navigate = useNavigate()
  const [character, setCharacter] = useState(readCharacter)

  useEffect(() => {
    function handleUpdate() { setCharacter(readCharacter()) }
    window.addEventListener('trumi_character_updated', handleUpdate)
    return () => window.removeEventListener('trumi_character_updated', handleUpdate)
  }, [])

  return (
    <header className="global-header">
      <TrumiMark />
      <button
        className="global-header__avatar-btn"
        onClick={() => navigate('/account-settings')}
        aria-label="Account settings"
      >
        <CharacterAvatar character={character} />
      </button>
    </header>
  )
}
