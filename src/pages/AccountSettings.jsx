import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getUser,
  signOut,
  updateUserEmail,
  updateUserPassword,
} from '../services/supabase'
import { DEFAULT_CHARACTER } from '../components/character/characterAssets'
import './AccountSettings.css'

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function EditableField({ label, value, type = 'text', masked = false, onSave }) {
  const [editing, setEditing]   = useState(false)
  const [draft,   setDraft]     = useState('')
  const [saving,  setSaving]    = useState(false)
  const [error,   setError]     = useState(null)

  function startEdit() {
    setDraft(masked ? '' : value)
    setError(null)
    setEditing(true)
  }

  async function handleSave() {
    if (!draft.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave(draft.trim())
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setEditing(false)
    setError(null)
  }

  return (
    <div className="as-field">
      <p className="as-field__label">{label}</p>
      <div className="as-field__card">
        {editing ? (
          <div className="as-field__edit-row">
            <input
              className="as-field__input"
              type={type}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={masked ? 'New password' : ''}
              autoFocus
            />
            <div className="as-field__edit-actions">
              <button className="as-field__btn as-field__btn--save" onClick={handleSave} disabled={saving}>
                {saving ? '…' : 'Save'}
              </button>
              <button className="as-field__btn as-field__btn--cancel" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="as-field__value">{masked ? '••••••••' : value}</span>
            <button className="as-field__pencil" onClick={startEdit} aria-label={`Edit ${label}`}>
              <PencilIcon />
            </button>
          </>
        )}
      </div>
      {error && <p className="as-field__error">{error}</p>}
    </div>
  )
}

function readCharacterName() {
  try {
    const saved = JSON.parse(localStorage.getItem('trumi_character') ?? '{}')
    return saved.name || DEFAULT_CHARACTER.name || ''
  } catch { return '' }
}

function saveCharacterName(name) {
  try {
    const saved = JSON.parse(localStorage.getItem('trumi_character') ?? '{}')
    const updated = { ...DEFAULT_CHARACTER, ...saved, name }
    localStorage.setItem('trumi_character', JSON.stringify(updated))
    window.dispatchEvent(new Event('trumi_character_updated'))
  } catch { /* ignore */ }
}

// ── Logged-in screen ─────────────────────────────────────────────────────────

function LoggedInSettings({ user, onLogOut }) {
  const [username, setUsername] = useState(readCharacterName)

  async function handleSaveUsername(value) {
    saveCharacterName(value)
    setUsername(value)
  }

  async function handleSaveEmail(value) {
    await updateUserEmail(value)
  }

  async function handleSavePassword(value) {
    if (value.length < 8) throw new Error('Password must be at least 8 characters.')
    await updateUserPassword(value)
  }

  return (
    <div className="as-content">
      <h1 className="as-title">Account Settings</h1>

      <div className="as-fields">
        <EditableField
          label="Username:"
          value={username}
          onSave={handleSaveUsername}
        />
        <EditableField
          label="Email Address:"
          value={user.email ?? ''}
          type="email"
          onSave={handleSaveEmail}
        />
        <EditableField
          label="Password"
          value=""
          type="password"
          masked
          onSave={handleSavePassword}
        />
      </div>

      <div className="as-divider" />

      <div className="as-actions">
        <button className="as-btn as-btn--logout" onClick={onLogOut}>
          Log Out
        </button>
      </div>
    </div>
  )
}

// ── Not-logged-in screen ─────────────────────────────────────────────────────

function GuestSettings() {
  const navigate = useNavigate()

  return (
    <div className="as-content">
      <h1 className="as-title">Account Settings</h1>

      <p className="as-guest-text">
        Create an account or log in to access account information and settings.
      </p>

      <div className="as-divider" />

      <div className="as-actions">
        <button className="as-btn as-btn--primary" onClick={() => navigate('/account-creation')}>
          Create Account
        </button>
        <button className="as-btn as-btn--primary" onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AccountSettings() {
  const navigate      = useNavigate()
  const [user,     setUser]     = useState(undefined) // undefined = loading
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getUser()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogOut() {
    try {
      await signOut()
    } catch { /* ignore */ }
    setUser(null)
    navigate('/')
  }

  if (loading) return null

  return (
    <div className="as-page">
      {user ? (
        <LoggedInSettings user={user} onLogOut={handleLogOut} />
      ) : (
        <GuestSettings />
      )}
    </div>
  )
}
