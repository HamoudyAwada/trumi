import { ASSETS, findAsset } from './characterAssets'
import './OptionGrid.css'

export default function OptionGrid({ category, selected, onChange }) {
  const options = ASSETS[category] ?? []

  return (
    <div className="opt-scroll">
      <div className="opt-grid">
        {options.map(option => (
          <button
            key={option.id}
            className={`opt-tile${selected === option.id ? ' opt-tile--active' : ''}`}
            onClick={() => onChange(option.id)}
            aria-pressed={selected === option.id}
            aria-label={option.label}
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
