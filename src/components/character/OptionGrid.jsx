import { ASSETS } from './characterAssets'
import './OptionGrid.css'

/**
 * OptionGrid
 *
 * Scrollable 4-column grid of option tiles for the active category.
 * Shows up to 2 rows (8 tiles) before requiring scroll.
 * Each tile displays a thumbnail preview of the SVG option.
 *
 * @param {string}   category   - Active category id
 * @param {string}   selected   - Currently selected option id within the category
 * @param {Function} onChange   - (optionId) => void
 */
export default function OptionGrid({ category, selected, onChange }) {
  const options = ASSETS[category] ?? []

  return (
    <div className="opt-scroll" role="listbox" aria-label={`${category} options`}>
      <div className="opt-grid">
        {options.map(option => (
          <button
            key={option.id}
            className={`opt-tile${option.id === selected ? ' opt-tile--active' : ''}`}
            onClick={() => onChange(option.id)}
            aria-label={option.label}
            aria-selected={option.id === selected}
            role="option"
          >
            <img
              className="opt-tile__img"
              src={option.path}
              alt={option.label}
              draggable="false"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
