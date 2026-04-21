import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../services/supabase'
import './AccountCreation.css'

export default function Login() {
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const canSubmit = email.includes('@') && email.includes('.') && password.length >= 1

  async function handleLogin(e) {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      navigate('/account-settings')
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ac-page">

      <form className="ac-form" onSubmit={handleLogin} noValidate>

        <p className="ac-form__headline">
          Welcome back! Log in to your Trumi account.
        </p>

        <div className="ac-form__fields">

          <div className="ac-field">
            <label className="ac-field__label" htmlFor="login-email">Email:</label>
            <input
              id="login-email"
              className="ac-field__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="ac-field">
            <label className="ac-field__label" htmlFor="login-password">Password:</label>
            <div className="ac-field__pw-row">
              <input
                id="login-password"
                className="ac-field__input"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
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

        {error && <p className="ac-form__error">{error}</p>}

        <div className="ac-actions">
          <button
            type="submit"
            className="ob-btn ac-actions__create"
            disabled={!canSubmit || loading}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
          <p className="ac-actions__or">or</p>
          <button
            type="button"
            className="ac-actions__skip"
            onClick={() => navigate('/account-creation')}
            disabled={loading}
          >
            Create an account
          </button>
        </div>

      </form>

    </div>
  )
}
