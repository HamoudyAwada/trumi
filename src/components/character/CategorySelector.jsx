import { CATEGORIES } from './characterAssets'
import './CategorySelector.css'

const ICONS = {
  hair:     '💇',
  face:     '🫥',
  eyes:     '👁',
  eyebrows: '〰️',
  nose:     '👃',
  lips:     '👄',
}

export default function CategorySelector({ activeCategory, onChange }) {
  return (
    <div className="cat-grid">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          className={`cat-tab${activeCategory === cat.id ? ' cat-tab--active' : ''}`}
          onClick={() => onChange(cat.id)}
          aria-pressed={activeCategory === cat.id}
        >
          <span className="cat-tab__icon" aria-hidden="true">{ICONS[cat.id]}</span>
          <span className="cat-tab__label">{cat.label}</span>
        </button>
      ))}
    </div>
  )
}
