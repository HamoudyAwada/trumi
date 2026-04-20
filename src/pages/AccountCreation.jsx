import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../services/supabase'
import './AccountCreation.css'

// Figma asset — Trumi character illustration (valid for 7 days from Apr 17 2026)
const CHARACTER_IMG = 'https://www.figma.com/api/mcp/asset/8185d439-0e59-4e27-95ab-4e70e801814c'

const REQUIREMENTS = [
  { label: 'At least 8 characters long',       test: p => p.length >= 8 },
  { label: 'At least one uppercase letter',    test: p => /[A-Z]/.test(p) },
  { label: 'At least one number',              test: p => /[0-9]/.test(p) },
  { label: 'At least one special character',   test: p => /[^A-Za-z0-9]/.test(p) },
]

function CheckIcon({ met }) {
  return met ? (
    <svg className="ac-req__icon ac-req__icon--met" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#6666cc" />
      <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className="ac-req__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="#c4c4e8" strokeWidth="1.5" />
    </svg>
  )
}

export default function AccountCreation() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const reqMet   = REQUIREMENTS.map(r => r.test(password))
  const canSubmit = email.includes('@') && email.includes('.') && reqMet.every(Boolean)

  function handleUsernameChange(value) {
    setUsername(value)
    try {
      const saved = JSON.parse(localStorage.getItem('trumi_character') ?? '{}')
      const updated = { ...saved, name: value }
      localStorage.setItem('trumi_character', JSON.stringify(updated))
      window.dispatchEvent(new Event('trumi_character_updated'))
    } catch { /* ignore */ }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    setError(null)
    try {
      await signUp(email.trim(), password)
      navigate('/')
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Try a different email.')
      } else {
        setError(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleSkip() {
    navigate('/')
  }

  return (
    <div className="ac-page">

      {/* Hero — character + wordmark */}
      <div className="ac-hero">
        <img
          src={CHARACTER_IMG}
          alt="Trumi character"
          className="ac-hero__character"
        />
        <p className="ac-hero__wordmark">trumi</p>
      </div>

      {/* Form */}
      <form className="ac-form" onSubmit={handleCreate} noValidate>

        <p className="ac-form__headline">
          Create an account to get the most out of Trumi!
        </p>

        <div className="ac-form__fields">

          {/* Username */}
          <div className="ac-field">
            <label className="ac-field__label" htmlFor="ac-username">Username:</label>
            <input
              id="ac-username"
              className="ac-field__input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              placeholder="Choose a username"
            />
          </div>

          {/* Email */}
          <div className="ac-field">
            <label className="ac-field__label" htmlFor="ac-email">Email:</label>
            <input
              id="ac-email"
              className="ac-field__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="ac-field">
            <label className="ac-field__label" htmlFor="ac-password">Password:</label>
            <div className="ac-field__pw-row">
              <input
                id="ac-password"
                className="ac-field__input"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="ac-field__eye"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.89 1 12a10.06 10.06 0 0 1 2.06-3.94M6.53 6.53A10.07 10.07 0 0 1 12 4c5 0 9.27 3.11 11 8a10.06 10.06 0 0 1-4.03 5.47M3 3l18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    <path d="M10.73 10.73A2 2 0 0 0 12 14a2 2 0 0 0 1.27-3.27" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M1 12C2.73 7.11 7 4 12 4s9.27 3.11 11 8c-1.73 4.89-6 8-11 8S2.73 16.89 1 12Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Requirements */}
        <div className="ac-req">
          <p className="ac-req__title">Requirements:</p>
          <ul className="ac-req__list">
            {REQUIREMENTS.map((r, i) => (
              <li key={i} className="ac-req__item">
                <CheckIcon met={reqMet[i]} />
                <span className={`ac-req__label${reqMet[i] ? ' ac-req__label--met' : ''}`}>
                  {r.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error */}
        {error && <p className="ac-form__error">{error}</p>}

        {/* Actions */}
        <div className="ac-actions">
          <button
            type="submit"
            className="ob-btn ac-actions__create"
            disabled={!canSubmit || loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <p className="ac-actions__or">or</p>
          <button
            type="button"
            className="ac-actions__skip"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
          </button>
        </div>

      </form>

    </div>
  )
}
