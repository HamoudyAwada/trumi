import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">

      {/* ── Main content area (empty for now) ─── */}
      <main className="home-content" />

      {/* ── Bottom nav bar ───────────────────── */}
      <nav className="home-nav">
        <Link to="/" className="home-nav__item home-nav__item--active" aria-label="Home">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <polyline points="9 21 9 12 15 12 15 21" />
          </svg>
        </Link>

        <Link to="/character" className="home-nav__item" aria-label="Character">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>

        <Link to="/goals" className="home-nav__item" aria-label="Goals">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </Link>

        <Link to="/achievements" className="home-nav__item" aria-label="Achievements">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h.5" />
            <path d="M18 9h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-.5" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M7 4h10l1 9a6 6 0 0 1-12 0L7 4z" />
          </svg>
        </Link>
      </nav>

    </div>
  )
}
