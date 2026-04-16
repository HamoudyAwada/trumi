import { NavLink } from 'react-router-dom'
import './BottomNav.css'

/* ── Icons matched to Figma/photo reference ── */

function HouseIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* roof */}
      <path d="M3 11L12 3l9 8" />
      {/* left wall → base → right wall */}
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  )
}

function GoalsIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* row 1 checkmark + line */}
      <polyline points="3 6.5 4.5 8.5 7 5" />
      <line x1="10" y1="7" x2="21" y2="7" />
      {/* row 2 */}
      <polyline points="3 12 4.5 14 7 11" />
      <line x1="10" y1="12.5" x2="21" y2="12.5" />
      {/* row 3 */}
      <polyline points="3 17.5 4.5 19.5 7 16.5" />
      <line x1="10" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <line x1="12" y1="7.5" x2="12" y2="16.5" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* cup body */}
      <path d="M7 3h10l-1 9a6 6 0 0 1-8 0L7 3z" />
      {/* right handle */}
      <path d="M17 5.5h2a1.5 1.5 0 0 1 0 3h-2" />
      {/* left handle */}
      <path d="M7 5.5H5a1.5 1.5 0 0 0 0 3h2" />
      {/* stem + base */}
      <line x1="12" y1="16" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  )
}

function CharacterIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20v-1a7 7 0 0 1 14 0v1" />
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
