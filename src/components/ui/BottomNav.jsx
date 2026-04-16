import { NavLink } from 'react-router-dom'
import './BottomNav.css'

function HouseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5z" />
      <polyline points="9 21 9 13 15 13 15 21" />
    </svg>
  )
}

function GoalsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.5l1.5 1.5 2.5-2.5" />
      <path d="M4 12.5l1.5 1.5 2.5-2.5" />
      <path d="M4 18.5l1.5 1.5 2.5-2.5" />
      <line x1="11" y1="7" x2="20" y2="7" />
      <line x1="11" y1="13" x2="20" y2="13" />
      <line x1="11" y1="19" x2="20" y2="19" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4h10l1 8a6 6 0 0 1-12 0L7 4z" />
      <path d="M17 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 6H5a2 2 0 0 0 0 4h2" />
      <line x1="12" y1="16" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  )
}

function CharacterIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" />
      <path d="M5.5 20v-1a6.5 6.5 0 0 1 13 0v1" />
    </svg>
  )
}

function navClass({ isActive }) {
  return `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav__inner">

        <NavLink to="/" end className={navClass} aria-label="Home">
          <HouseIcon />
        </NavLink>

        <NavLink to="/goals" className={navClass} aria-label="Goals and values">
          <GoalsIcon />
        </NavLink>

        <NavLink to="/add-goal" className={navClass} aria-label="Add a new goal">
          <AddIcon />
        </NavLink>

        <NavLink to="/achievements" className={navClass} aria-label="Achievements">
          <TrophyIcon />
        </NavLink>

        <NavLink to="/character" className={navClass} aria-label="Character">
          <CharacterIcon />
        </NavLink>

      </div>
    </nav>
  )
}
