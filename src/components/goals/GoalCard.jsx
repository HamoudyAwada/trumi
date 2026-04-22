import { useState, useEffect, useRef } from 'react'
import './GoalCard.css'

export default function GoalCard({
  id,
  title,
  status = 'active',
  isPreview = false,
  onCreateEntry,
  onViewDetail,
  onPause,
  onDelete,
}) {
  const isPaused = status === 'paused'

  const [menuOpen,      setMenuOpen]      = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <article
      className={`goal-card${isPaused ? ' goal-card--paused' : ''}`}
      onClick={() => !isPreview && onViewDetail?.(id)}
      style={{ cursor: isPreview || !onViewDetail ? 'default' : 'pointer' }}
    >
      {/* Inset highlight overlay */}
      <div className="goal-card__glow" aria-hidden="true" />

      {/* Header: title + ellipsis */}
      <div className="goal-card__header">
        <h3 className="goal-card__title">{title}</h3>

        {!isPreview && (
          <div className="goal-card__menu-wrap" ref={menuRef}>
            <button
              className="goal-card__menu-btn"
              onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
              aria-label="Goal options"
              aria-expanded={menuOpen}
            >
              <span className="goal-card__dot" />
              <span className="goal-card__dot" />
              <span className="goal-card__dot" />
            </button>

            {menuOpen && (
              <div className="goal-card__menu" role="menu">
                <button
                  className="goal-card__menu-item"
                  role="menuitem"
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); onPause?.(id) }}
                >
                  {isPaused ? 'Resume Goal' : 'Pause Goal'}
                </button>
                <button
                  className="goal-card__menu-item goal-card__menu-item--danger"
                  role="menuitem"
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); setConfirmDelete(true) }}
                >
                  Delete Goal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isPreview && (
        <div className="goal-card__actions">
          <button
            className="goal-card__btn goal-card__btn--filled"
            onClick={e => { e.stopPropagation(); onCreateEntry?.(id) }}
            disabled={isPaused}
          >
            + Add Entry
          </button>
          <button
            className="goal-card__btn goal-card__btn--outline"
            onClick={e => { e.stopPropagation(); onViewDetail?.(id) }}
          >
            View Details
          </button>
        </div>
      )}

      {/* Delete confirmation overlay */}
      {!isPreview && confirmDelete && (
        <div className="goal-card__confirm-overlay" role="dialog" aria-modal="true">
          <div className="goal-card__confirm-box">
            <p className="goal-card__confirm-title">Delete this goal?</p>
            <p className="goal-card__confirm-body">
              "{title}" will be permanently deleted. This can't be undone.
            </p>
            <div className="goal-card__confirm-actions">
              <button
                className="goal-card__confirm-btn goal-card__confirm-btn--cancel"
                onClick={e => { e.stopPropagation(); setConfirmDelete(false) }}
              >
                Keep It
              </button>
              <button
                className="goal-card__confirm-btn goal-card__confirm-btn--delete"
                onClick={e => { e.stopPropagation(); setConfirmDelete(false); onDelete?.(id) }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
