import { CATEGORIES, ASSETS, findAsset } from './characterAssets'
import './CategorySelector.css'

/**
 * CategorySelector
 *
 * 3×2 grid of category tabs. Each tab shows a small SVG preview
 * of the current selection for that category.
 * Active tab is visually highlighted.
 *
 * @param {string}   activeCategory  - Currently selected category id
 * @param {Object}   selections      - Current character selections (all categories)
 * @param {Function} onChange        - (categoryId) => void
 */
export default function CategorySelector({ activeCategory, selections, onChange }) {
  return (
    <div className="cat-grid">
      {CATEGORIES.map(cat => {
        const currentAsset = findAsset(cat.id, selections[cat.id])
        const isActive = cat.id === activeCategory

        return (
          <button
            key={cat.id}
            className={`cat-tab${isActive ? ' cat-tab--active' : ''}`}
            onClick={() => onChange(cat.id)}
            aria-label={cat.label}
            aria-pressed={isActive}
          >
            {currentAsset?.path && (
              <img
                className="cat-tab__preview"
                src={currentAsset.path}
                alt={currentAsset.label}
                draggable="false"
              />
            )}
            <span className="cat-tab__label">{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
